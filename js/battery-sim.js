// CZElectro — Battery Simulation & Status Module
// Handles: battery discharge/charge simulation, SOC tracking, sim panel, battery bars, status bar
(function(CZ) {
    'use strict';

    // ── Battery dead-level helper ──
    // Returns the minimum usable level for a battery (below this = dead)
    CZ.getBattDeadLevel = function(bat) {
        return bat.batteryCapacity * 0.10;
    };

    // ── Status bar ──
    CZ.updateStatus = function() {
        document.getElementById('comp-count').textContent = CZ.deployed.length + ' ' + CZ.t('statusParts');
    };

    // ── Solar Irradiance Curve ──
    CZ.getSolarFactor = function(hourOfDay) {
        if (hourOfDay < 6 || hourOfDay >= 18) return 0;
        return Math.sin(Math.PI * (hourOfDay - 6) / 12);
    };

    // ── Battery Simulation Engine ──
    CZ.simTick = function() {
        const batteries = CZ.deployed.filter(c => c.type.startsWith('battery') && c.batteryCapacity);
        const hourOfDay = (CZ.simElapsedMin / 60) % 24;
        const solarFactor = CZ.getSolarFactor(hourOfDay);
        const isDaytime = solarFactor > 0;
        const hour = hourOfDay;
        const totalSolarW = CZ.simTotalSrcW * solarFactor;
        const totalLoadW = CZ.simTotalLoadW;

        if (batteries.length > 0) {
            CZ.updateSimPanel(totalSolarW, totalLoadW, batteries, hour, isDaytime, solarFactor);
        }

        if (CZ.simSpeed === 0) return;

        const allBattsDead = batteries.length > 0 && batteries.every(b => {
            return b.batteryLevel <= CZ.getBattDeadLevel(b);
        });
        const noPower = allBattsDead && !isDaytime;

        const deltaMin = CZ.simSpeed;
        CZ.simElapsedMin += deltaMin;

        // Recompute solar factor AFTER time advance for accurate charge/drain
        const postHour = (CZ.simElapsedMin / 60) % 24;
        const postSolarFactor = CZ.getSolarFactor(postHour);
        const postIsDaytime = postSolarFactor > 0;

        const loopsDrain = window._activeLoops || [];
        let anyDrained = false;
        loopsDrain.forEach(loop => {
            if (!loop.battIds || loop.battIds.length === 0) return;
            let adjSrcW = (loop.srcW || 0) * postSolarFactor;
            let adjLoadW = loop.loadW || 0;
            if (loop.hasCC) adjSrcW *= 0.93;
            if (loop.hasInverter) adjLoadW /= 0.90;

            // BMS cutoff: when ALL batteries are at dead level, loads are disconnected
            // In real life, BMS cuts off inverter → loads stop → only solar charges
            const allLoopBatts = loop.battIds
                .map(id => CZ.deployed.find(c => c.id === id))
                .filter(Boolean);
            const allDead = allLoopBatts.length > 0 && allLoopBatts.every(b => {
                const minLevel = CZ.getBattDeadLevel(b);
                return b.batteryLevel <= minLevel;
            });
            if (allDead) {
                adjLoadW = 0; // BMS disconnected loads — only solar can charge
            }

            const loopNetW = adjSrcW - adjLoadW;
            if (loopNetW === 0) return;
            const isCharging = loopNetW > 0;
            const loopBatts = allLoopBatts
                .filter(b => isCharging ? b.batteryLevel < b.batteryCapacity : b.batteryLevel > 0);
            if (loopBatts.length === 0) return;
            const perBattRaw = (loopNetW * deltaMin) / 60 / loopBatts.length;
            loopBatts.forEach(bat => {
                let delta = perBattRaw;
                if (isCharging) {
                    // Cap charge rate at 0.5C
                    const maxChargeWhPerMin = (bat.batteryCapacity * 0.5) / 60;
                    const maxDelta = maxChargeWhPerMin * deltaMin;
                    delta = Math.min(delta, maxDelta);
                } else {
                    // Cap discharge rate at 1C — prevents unrealistic instant drain
                    // at high sim speeds (e.g. 9V battery drained 70% in 1 tick)
                    const maxDrainWhPerMin = (bat.batteryCapacity * 1.0) / 60;
                    const maxDrainDelta = maxDrainWhPerMin * deltaMin;
                    delta = Math.max(delta, -maxDrainDelta);
                }
                const minLevel = CZ.getBattDeadLevel(bat);
                bat.batteryLevel = Math.max(minLevel, Math.min(bat.batteryCapacity, bat.batteryLevel + delta));
            });
            anyDrained = true;
        });

        // ── Fallback: Solar direct-charge when batteries are dead ──
        // When batteryLevel <= deadLevel, MNA sees 0V → no current → no loops
        // But in reality, charge controller still charges dead batteries from solar!
        // This fallback bypasses MNA to simulate CC direct charging.
        if (postIsDaytime && batteries.length > 0) {
            const allLoopBattIds = new Set();
            loopsDrain.forEach(loop => (loop.battIds || []).forEach(id => allLoopBattIds.add(id)));

            const orphanBatts = batteries.filter(b => {
                const minLevel = CZ.getBattDeadLevel(b);
                return b.batteryLevel <= minLevel && !allLoopBattIds.has(b.id);
            });

            if (orphanBatts.length > 0) {
                // Find solar panels connected to these batteries via Union-Find
                const ufP = {};
                CZ.deployed.forEach(c => ufP[c.id] = c.id);
                function ufFindSim(x) { return ufP[x] === x ? x : (ufP[x] = ufFindSim(ufP[x])); }
                CZ.wires.forEach(w => {
                    if (ufP[w.c1] !== undefined && ufP[w.c2] !== undefined)
                        ufP[ufFindSim(w.c1)] = ufFindSim(w.c2);
                });

                // Check if any solar panel shares network with orphan batteries
                const solarPanels = CZ.deployed.filter(c => c.type.startsWith('solar_'));
                const hasCCinNetwork = CZ.deployed.some(c => c.type === 'charge_controller');

                orphanBatts.forEach(bat => {
                    const batRoot = ufFindSim(bat.id);
                    const connectedSolar = solarPanels.find(sp => ufFindSim(sp.id) === batRoot);
                    if (!connectedSolar || !hasCCinNetwork) return;

                    const tmpl = COMPONENTS.find(t => t.id === connectedSolar.type);
                    if (!tmpl || !tmpl.ratedPower) return;

                    // Charge at solar rated power × solar factor × CC efficiency
                    // Split among all dead batteries in same network
                    const networkDeadBatts = orphanBatts.filter(b => ufFindSim(b.id) === batRoot);
                    const solarW = tmpl.ratedPower * postSolarFactor * 0.93; // CC 93% efficiency
                    const perBattW = solarW / networkDeadBatts.length;
                    const whDelta = (perBattW * deltaMin) / 60;

                    // Cap charge rate at 0.5C
                    const maxChargeWh = (bat.batteryCapacity * 0.5 / 60) * deltaMin;
                    bat.batteryLevel = Math.min(bat.batteryCapacity, bat.batteryLevel + Math.min(whDelta, maxChargeWh));
                    anyDrained = true;
                });
            }
        }

        // Auto-cutoff: batteries near dead threshold get forced to dead level
        // Only during discharge (nighttime) — don't interfere with solar charging
        // This simulates BMS low-SOC protection during discharge
        if (!postIsDaytime) {
            batteries.forEach(bat => {
                const minLevel = CZ.getBattDeadLevel(bat);
                const usable = bat.batteryCapacity - minLevel;
                if (usable > 0 && bat.batteryLevel > minLevel) {
                    const usablePct = (bat.batteryLevel - minLevel) / usable;
                    if (usablePct < 0.05) { // below 5% usable → force dead
                        bat.batteryLevel = minLevel;
                        anyDrained = true;
                    }
                }
            });
        }

        if (anyDrained) { CZ.saveState(); }
        CZ.evaluateCircuit();
        const postSolarW = CZ.simTotalSrcW * postSolarFactor;
        CZ.updateSimPanel(postSolarW, totalLoadW, batteries, hour, postIsDaytime, postSolarFactor, noPower);
    };

    CZ.updateSimPanel = function(solarW, loadW, batteries, hour, isDaytime, solarFactor, noPower) {
        let panel = document.getElementById('sim-panel');
        if (!panel) return;
        // Single source of truth: derive all time displays from CZ.simElapsedMin
        const displayHour = (CZ.simElapsedMin / 60) % 24;
        const dayNum = Math.floor(CZ.simElapsedMin / 1440) + 1;
        const clockH = Math.floor(displayHour);
        const clockM = Math.floor((displayHour % 1) * 60);
        const timeStr = `${String(clockH).padStart(2,'0')}:${String(clockM).padStart(2,'0')}`;
        const timeIcon = isDaytime ? '☀️' : '🌙';
        const solarPct = (solarFactor * 100).toFixed(0);
        const netW = solarW - loadW;
        const netSign = netW >= 0 ? '+' : '';
        const netColor = netW >= 0 ? '#22c55e' : '#ef4444';
        const speedLabel = CZ.simSpeed === 0 ? CZ.t('simPause') : `▶ ${CZ.simSpeed}x`;
        const speedColor = CZ.simSpeed === 0 ? '#ef4444' : '#22c55e';

        // Clock hand angles (from displayHour — synced with digital time)
        const h12 = displayHour % 12;          // 0-12 float (e.g. 3.5 = 3:30)
        const targetH = h12 * 30;              // h12 already includes minutes as fraction
        const targetM = (displayHour % 1) * 360; // minute fraction → full circle

        // Cumulative tracking: always rotate clockwise (avoid CSS shortest-path issues)
        if (CZ._ckH === undefined) { CZ._ckH = targetH; CZ._ckM = targetM; }
        let dH = targetH - (CZ._ckH % 360);
        if (dH < -1) dH += 360;
        CZ._ckH += dH;
        let dM = targetM - (CZ._ckM % 360);
        if (dM < -1) dM += 360;
        CZ._ckM += dM;

        const faceColor = isDaytime ? '#1a2a3a' : '#0d0d1a';
        const rimColor = isDaytime ? '#f59e0b' : '#334155';
        const sunAngleVis = ((displayHour % 12) / 12) * 360;
        const sunX = 30 + 24 * Math.sin(sunAngleVis * Math.PI / 180);
        const sunY = 30 - 24 * Math.cos(sunAngleVis * Math.PI / 180);

        let clockWrap = panel.querySelector('.sim-clock-wrap');
        if (!clockWrap) {
            clockWrap = document.createElement('div');
            clockWrap.className = 'sim-clock-wrap';
            let ticks = '';
            for (let i = 0; i < 12; i++) {
                const a = i * 30;
                const maj = i % 3 === 0;
                const r1 = maj ? 22 : 24, r2 = 27;
                const x1 = 30 + r1 * Math.sin(a * Math.PI / 180);
                const y1 = 30 - r1 * Math.cos(a * Math.PI / 180);
                const x2 = 30 + r2 * Math.sin(a * Math.PI / 180);
                const y2 = 30 - r2 * Math.cos(a * Math.PI / 180);
                ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${maj ? '#e5e7eb' : '#4b5563'}" stroke-width="${maj ? '1.5' : '0.8'}" stroke-linecap="round"/>`;
            }
            clockWrap.innerHTML = `<svg viewBox="0 0 60 60" width="60" height="60">
                <circle class="ck-face" cx="30" cy="30" r="28" fill="${faceColor}" stroke="${rimColor}" stroke-width="2" style="transition:fill .3s,stroke .3s"/>
                ${ticks}
                <circle class="ck-sun-glow" cx="${sunX}" cy="${sunY}" r="5" fill="#f59e0b" opacity="0" style="transition:cx .3s,cy .3s,opacity .3s"/>
                <circle class="ck-sun" cx="${sunX}" cy="${sunY}" r="3" fill="#f59e0b" opacity="0.5" style="transition:cx .3s,cy .3s,opacity .3s,fill .3s"/>
                <line class="ck-hour" x1="30" y1="30" x2="30" y2="14" stroke="#e5e7eb" stroke-width="2.5" stroke-linecap="round" style="transform-origin:30px 30px"/>
                <line class="ck-min" x1="30" y1="30" x2="30" y2="8" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" style="transform-origin:30px 30px"/>
                <circle cx="30" cy="30" r="2" fill="#f59e0b"/>
            </svg>`;
            panel.insertBefore(clockWrap, panel.firstChild);
        }

        const hHand = clockWrap.querySelector('.ck-hour');
        const mHand = clockWrap.querySelector('.ck-min');
        // Adapt transition speed to sim speed
        const transDur = CZ.simSpeed >= 30 ? '0.4s' : '0.9s';
        hHand.style.transition = `transform ${transDur} linear`;
        mHand.style.transition = `transform ${transDur} linear`;
        hHand.style.transform = `rotate(${CZ._ckH}deg)`;
        mHand.style.transform = `rotate(${CZ._ckM}deg)`;

        const face = clockWrap.querySelector('.ck-face');
        face.setAttribute('fill', faceColor);
        face.setAttribute('stroke', rimColor);
        const sunEl = clockWrap.querySelector('.ck-sun');
        const sunGlow = clockWrap.querySelector('.ck-sun-glow');
        sunEl.setAttribute('cx', sunX); sunEl.setAttribute('cy', sunY);
        sunEl.setAttribute('opacity', isDaytime ? '0.9' : '0.3');
        sunEl.setAttribute('fill', isDaytime ? '#f59e0b' : '#94a3b8');
        sunGlow.setAttribute('cx', sunX); sunGlow.setAttribute('cy', sunY);
        sunGlow.setAttribute('opacity', isDaytime ? '0.2' : '0');

        // Battery info
        const battGroups = {};
        batteries.forEach(b => { if (!battGroups[b.type]) battGroups[b.type] = []; battGroups[b.type].push(b); });

        let battInfo = '';
        Object.entries(battGroups).forEach(([type, batts]) => {
            const totalLevel = batts.reduce((s, b) => s + b.batteryLevel, 0);
            const totalCap = batts.reduce((s, b) => s + b.batteryCapacity, 0);
            const avgPct = (totalLevel / totalCap) * 100;
            const isRch = type.includes('lifepo4') || type.includes('plts') || type === 'battery_32140';
            const icon = avgPct > 50 ? '🟢' : avgPct > 20 ? '🟡' : (isRch && avgPct <= 10) ? '🛑' : avgPct > 0 ? '🔴' : '💀';
            const dodLabel = isRch && avgPct <= 10 ? ' <span style="color:#ef4444;font-size:9px">(BMS)</span>' : '';
            const tmpl = COMPONENTS.find(t => t.id === type);
            const typeName = tmpl ? CZ.getCompName(tmpl) : type;
            if (batts.length === 1) {
                battInfo += `<div class="sim-batt">${icon} ${avgPct.toFixed(0)}% (${totalLevel.toFixed(0)}Wh)${dodLabel}</div>`;
            } else {
                const whLabel = totalLevel >= 1000 ? `${(totalLevel/1000).toFixed(1)}kWh` : `${totalLevel.toFixed(0)}Wh`;
                const capLabel = totalCap >= 1000 ? `${(totalCap/1000).toFixed(1)}kWh` : `${totalCap.toFixed(0)}Wh`;
                battInfo += `<div class="sim-batt">${icon} ${batts.length}× ${typeName}: ${avgPct.toFixed(0)}% (${whLabel}/${capLabel})${dodLabel}</div>`;
            }
        });

        const noPowerLabel = noPower ? ` <span style="color:#ef4444;font-weight:700">${CZ.t('simNoPower')}</span>` : '';

        let infoEl = panel.querySelector('.sim-info');
        if (!infoEl) { infoEl = document.createElement('div'); infoEl.className = 'sim-info'; panel.appendChild(infoEl); }
        infoEl.innerHTML = `
            <div class="sim-header">${timeIcon} ${CZ.t('simDay')} ${dayNum} ${timeStr} <span style="color:#f59e0b">☀${solarPct}%</span> | <span style="color:${speedColor}">${speedLabel}</span>${noPowerLabel}</div>
            <div class="sim-power">⚡${solarW.toFixed(0)}W ⬇ 🏠${loadW.toFixed(0)}W ⬆ = <span style="color:${netColor}">${netSign}${netW.toFixed(0)}W</span></div>
            ${battInfo}
        `;
    };

    CZ.startSim = function(speed) {
        CZ.simSpeed = speed;
        if (CZ.simInterval) clearInterval(CZ.simInterval);
        if (speed > 0) {
            CZ.simInterval = setInterval(CZ.simTick, 1000);
            CZ.simTick();
        }
        document.querySelectorAll('.sim-btn[data-speed]').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.sim-btn[data-speed="${speed}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        CZ.saveSimState();
    };

    CZ.resetBatteries = function() {
        CZ.deployed.forEach(c => {
            if (c.batteryCapacity) {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                c.batteryLevel = c.batteryCapacity;
                if (tmpl) c.voltage = tmpl.voltage;
                const el = document.getElementById(c.id);
                if (el) { el.classList.remove('battery-dead'); el.style.opacity = ''; }
            }
        });
        CZ.simElapsedMin = 0;
        CZ.saveSimState();
        CZ.evaluateCircuit();
    };

    CZ.saveSimState = function() {
        try {
            localStorage.setItem('czelectro_sim', JSON.stringify({ simSpeed: CZ.simSpeed, simElapsedMin: CZ.simElapsedMin }));
        } catch(e) {}
    };

    CZ.restoreSimState = function() {
        try {
            const raw = localStorage.getItem('czelectro_sim');
            if (!raw) return;
            const s = JSON.parse(raw);
            CZ.simElapsedMin = s.simElapsedMin || 0;
            if (s.simSpeed > 0) { CZ.startSim(s.simSpeed); }
            setTimeout(() => { CZ.evaluateCircuit(); CZ.updateBatteryBars(); }, 150);
        } catch(e) {}
    };

    // ── Battery Fill Config ──
    CZ.BATT_FILL_CFG = {
        'battery_9v':       { dir: 'v', yTop: 17, yBot: 103 },
        'battery_3v':       { dir: 'h', maxW: 66 },
        'battery_1v5':      { dir: 'h', maxW: 46 },
        'battery_12v':      { dir: 'v', yTop: 10, yBot: 70 },
        'battery_32140':    { dir: 'h', maxW: 12 },
        'battery_lifepo4':  { dir: 'h', maxW: 22 },
        'battery_plts_100': { dir: 'h', maxW: 64 },
        'battery_plts_200': { dir: 'h', maxW: 78 },
    };

    CZ.updateBatteryBars = function() {
        CZ.deployed.forEach(bat => {
            if (!bat.batteryCapacity) return;
            const el = document.getElementById(bat.id);
            if (!el) return;
            const deadLevel = CZ.getBattDeadLevel(bat);
            const usable = bat.batteryCapacity - deadLevel;
            const pct = usable > 0
                ? Math.max(0, Math.min(100, ((bat.batteryLevel - deadLevel) / usable) * 100))
                : 0;
            const cfg = CZ.BATT_FILL_CFG[bat.type];
            const fillEl = el.querySelector('.batt-fill');
            const pctEl = el.querySelector('.batt-pct');
            const color = pct > 50 ? '#22c55e' : pct > 20 ? '#f59e0b' : '#ef4444';

            if (fillEl && cfg) {
                fillEl.setAttribute('fill', color);
                if (cfg.dir === 'v') {
                    const totalH = cfg.yBot - cfg.yTop;
                    const fillH = (pct / 100) * totalH;
                    fillEl.setAttribute('y', (cfg.yBot - fillH).toFixed(1));
                    fillEl.setAttribute('height', fillH.toFixed(1));
                } else {
                    const fillW = (pct / 100) * cfg.maxW;
                    fillEl.setAttribute('width', fillW.toFixed(1));
                }
            }
            if (pctEl) { pctEl.textContent = `${pct.toFixed(0)}%`; pctEl.setAttribute('fill', '#fff'); }

            const deadThreshold = CZ.getBattDeadLevel(bat);
            if (bat.batteryLevel <= deadThreshold) {
                el.classList.add('battery-dead'); el.style.opacity = '0.5';
                el.dataset.deadLabel = CZ.t('battDead');
            } else {
                el.classList.remove('battery-dead'); el.style.opacity = '';
                el.dataset.deadLabel = '';
            }
        });
    };

    // ── Status Bar Values ──
    CZ.updateStatusValues = function(hasLoop, loops) {
        const dot = document.getElementById('circuit-dot');
        const statusTxt = document.getElementById('circuit-status');
        const loopsDiv = document.getElementById('circuit-loops');

        if (hasLoop && loops.length > 0) {
            dot.className = 'status-dot live';
            statusTxt.textContent = loops.length === 1 ? CZ.t('statusActive') : `${loops.length} ${CZ.t('statusCircuits')}`;
            loopsDiv.innerHTML = loops.map((l, idx) => {
                const label = loops.length > 1 ? `<span style="color:var(--accent);font-weight:700;">#${idx + 1}</span> ` : '';
                const fmtW = EL.Units.autoFormat(l.w, 'W');
                let realInfo = '';
                if (l.hasSolar && l.srcW > 0 && l.loadW > 0) {
                    const ok = l.srcW >= l.loadW;
                    realInfo = `<div class="status-item" style="color:${ok ? '#4ade80' : '#f87171'};font-size:10px;">${ok ? '✅' : '⚠️'} ${CZ.t('statusSource')}: ${l.srcW.toFixed(1)}W | ${CZ.t('statusLoad')}: ${l.loadW.toFixed(1)}W ${ok ? CZ.t('statusEnough') : CZ.t('statusNotEnough')}</div>`;
                }
                return `<div class="status-item">${label}⚡${l.v.toFixed(1)}V &nbsp;🔌${(l.i * 1000).toFixed(1)}mA &nbsp;Ω${l.r.toFixed(0)} &nbsp;💡${fmtW.val}${fmtW.unit}</div>${realInfo}`;
            }).join('');
        } else if (CZ.deployed.length) {
            dot.className = 'status-dot warn';
            statusTxt.textContent = CZ.t('statusOpenCircuit');
            loopsDiv.innerHTML = '';
        } else {
            dot.className = 'status-dot';
            statusTxt.textContent = CZ.t('statusNoCircuit');
            loopsDiv.innerHTML = '';
        }
        CZ.updateStatus();
    };

})(window.CZ);
