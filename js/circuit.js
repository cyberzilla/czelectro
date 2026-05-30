// CZElectro — Circuit Evaluation & Battery Simulation Module
// Handles: circuit tracing, evaluation, output activation, battery sim, status bar
(function(CZ) {
    'use strict';

    // ── Spark/Smoke effects ──
    CZ.spawnSparks = function(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - CZ.wCont.getBoundingClientRect().left;
        const cy = rect.top + rect.height / 2 - CZ.wCont.getBoundingClientRect().top;

        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark-particle';
            const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
            const dist = 20 + Math.random() * 40;
            spark.style.cssText = `left:${cx}px;top:${cy}px;--sx:${Math.cos(angle) * dist}px;--sy:${Math.sin(angle) * dist}px;
                background:${['#fbbf24','#ef4444','#fff'][i%3]};animation-delay:${Math.random()*0.1}s`;
            CZ.wCont.appendChild(spark);
            setTimeout(() => spark.remove(), 700);
        }
        for (let i = 0; i < 3; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-puff';
            smoke.style.cssText = `left:${cx - 15 + Math.random()*30}px;top:${cy - 10}px;animation-delay:${i*0.15}s`;
            CZ.wCont.appendChild(smoke);
            setTimeout(() => smoke.remove(), 1500);
        }
    };

    // Burn notice popup
    CZ.showBurnNotice = function(el, amps, max) {
        const notice = document.createElement('div');
        notice.className = 'burn-notice';
        notice.innerHTML = `⚡ BURNT! ${(amps*1000).toFixed(0)}mA > ${(max*1000).toFixed(0)}mA max`;
        el.appendChild(notice);
        setTimeout(() => notice.remove(), 3000);
    };

    // ── Circuit Evaluation with Brightness Levels ──
    CZ.evaluateCircuit = function() {
        // Reset ALL output states completely
        CZ.deployed.forEach(c => {
            const el = document.getElementById(c.id);
            if (!el) return;
            el.classList.remove('led-on', 'led-dim', 'led-bright', 'motor-active', 'motor-reversed', 'buzzer-active', 'led-rgb-active', 'speaker-active', 'relay-active');
            el.style.removeProperty('--glow-intensity');
            const bulb = el.querySelector('.led-bulb');
            if (bulb && !c.isBroken) { bulb.style.fill = ''; bulb.style.filter = ''; }
            const ring = el.querySelector('.led-glow-ring');
            if (ring && !c.isBroken) { ring.style.fillOpacity = '0'; ring.style.fill = ''; }
            const spin = el.querySelector('.motor-spin');
            if (spin) spin.style.animation = 'none';
            el.querySelectorAll('.motor-dir-badge').forEach(b => b.remove());
            const cones = el.querySelectorAll('.speaker-cone');
            cones.forEach(cone => cone.style.animation = 'none');
            el.classList.remove('scc-active', 'scc-protecting', 'ac-active', 'ac-no-inverter');
            el.querySelectorAll('.scc-status').forEach(s => s.remove());
            el.querySelectorAll('.no-ac-badge').forEach(b => b.remove());
            el.querySelectorAll('.power-badge').forEach(b => b.remove());
            const ironPlate = el.querySelector('.iron-plate');
            if (ironPlate) ironPlate.style.fill = '';
            const ironInd = el.querySelector('.iron-indicator');
            if (ironInd) ironInd.style.fill = '';
            const fridgeInd = el.querySelector('.fridge-indicator');
            if (fridgeInd) fridgeInd.style.fill = '';
            const blenderBlade = el.querySelector('.blender-blade');
            if (blenderBlade) blenderBlade.style.animation = 'none';
            const blenderInd = el.querySelector('.blender-indicator');
            if (blenderInd) blenderInd.style.fill = '';
            const rcInd = el.querySelector('.rc-indicator');
            if (rcInd) rcInd.style.fill = '';
            const acInd = el.querySelector('.ac-indicator');
            if (acInd) acInd.style.fill = '';
            const acFan = el.querySelector('.ac-fan');
            if (acFan) acFan.style.animation = 'none';
            const tvScreen = el.querySelector('.tv-screen');
            if (tvScreen) { tvScreen.style.fill = ''; tvScreen.style.filter = ''; }
            const tvInd = el.querySelector('.tv-indicator');
            if (tvInd) tvInd.style.fill = '';
            const lampGlow = el.querySelector('.lamp-glow');
            if (lampGlow) { lampGlow.style.fill = 'none'; lampGlow.style.opacity = '0'; lampGlow.style.filter = ''; }
            const pcScreen = el.querySelector('.pc-screen');
            if (pcScreen) { pcScreen.style.fill = ''; pcScreen.style.filter = ''; }
            const pcPower = el.querySelector('.pc-power');
            if (pcPower) pcPower.style.opacity = '';
            const pcInd = el.querySelector('.pc-indicator');
            if (pcInd) pcInd.style.fill = '';
            const sdInd = el.querySelector('.sd-indicator');
            if (sdInd) sdInd.style.fill = '';
            el.querySelectorAll('.sd-status').forEach(b => b.remove());
            const pumpImp = el.querySelector('.pump-impeller');
            if (pumpImp) pumpImp.style.animation = 'none';
            const pumpInd = el.querySelector('.pump-indicator');
            if (pumpInd) pumpInd.style.fill = '';
            if (c.type === 'charge_controller') {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                if (tmpl) c.currentResistance = tmpl.resistance;
            }
            if (c.type === 'stepdown_12v' || c.type === 'stepdown_5v') {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                if (tmpl) c.currentResistance = tmpl.resistance;
            }
        });
        CZ.SFX.stopAll();
        CZ.wires.forEach(w => w.energized = false);

        let hasLoop = false;
        const activeLoops = [];

        const isSource = c => c.type.startsWith('battery') || c.type.startsWith('solar_');

        CZ.deployed.filter(isSource).forEach(batt => {
            const paths = [];
            CZ.traceCircuit({ cid: batt.id, pin: 0 }, [batt.id], [], paths, batt.id);

            paths.forEach(loop => {
                let rTotal = 0, open = false;
                const compsInLoop = [];
                const wireIndices = new Set();
                const compEntryPin = {};

                loop.forEach(node => {
                    const c = CZ.deployed.find(x => x.id === node.cid);
                    if (c && !compsInLoop.includes(c)) compsInLoop.push(c);
                    if (node.wireIdx !== undefined) wireIndices.add(node.wireIdx);
                    if (node.wireIdx === undefined && node.cid) {
                        compEntryPin[node.cid] = node.pin;
                    }
                });

                const parallelSourceIds = new Set();
                compsInLoop.forEach(c => {
                    if (isSource(c) && c.id !== batt.id && compEntryPin[c.id] === 0) {
                        parallelSourceIds.add(c.id);
                    }
                });

                compsInLoop.forEach(c => {
                    if (parallelSourceIds.has(c.id)) return;
                    rTotal += c.currentResistance;
                    if (c.type === 'switch_toggle' && !c.isClosed) open = true;
                });

                if (parallelSourceIds.size > 0) {
                    const allParR = [batt.currentResistance];
                    parallelSourceIds.forEach(id => {
                        const psrc = CZ.deployed.find(x => x.id === id);
                        if (psrc) allParR.push(psrc.currentResistance);
                    });
                    const equivR = 1 / allParR.reduce((s, r) => s + 1 / r, 0);
                    rTotal = rTotal - batt.currentResistance + equivR;
                }

                if (open || rTotal === Infinity || rTotal <= 0) return;

                let loopVoltage = 0;
                compsInLoop.forEach(c => {
                    if (isSource(c)) {
                        let effectiveV = c.voltage;
                        if (c.batteryCapacity) {
                            const isRechargeable = c.type.includes('lifepo4') || c.type.includes('plts') || c.type === 'battery_32140';
                            const minLevel = isRechargeable ? c.batteryCapacity * 0.10 : 0;
                            if (c.batteryLevel <= minLevel) effectiveV = 0;
                        }
                        if (c.type.startsWith('solar_')) {
                            const hod = (CZ.simElapsedMin / 60) % 24;
                            if (hod < 6 || hod >= 18) effectiveV = 0;
                        }
                        if (parallelSourceIds.has(c.id)) {
                            loopVoltage -= effectiveV;
                        } else {
                            loopVoltage += effectiveV;
                        }
                    }
                });

                if (loopVoltage <= 0) return;

                hasLoop = true;
                let amps = loopVoltage / rTotal;

                // ── Charge Controller Protection Logic ──
                const scc = compsInLoop.find(c => c.type === 'charge_controller');
                if (scc && !scc.isBroken) {
                    const tmpl = COMPONENTS.find(t => t.id === 'charge_controller');
                    const maxOut = tmpl?.maxOutputCurrent || 0.05;
                    const hasSolar = compsInLoop.some(c => c.type.startsWith('solar_'));
                    const hasBattery = compsInLoop.some(c => c.type.startsWith('battery'));
                    const hasLoads = compsInLoop.some(c => {
                        const isACLoad = ['iron', 'fridge', 'blender', 'ricecooker', 'ac_05pk', 'ac_1pk', 'tv_led', 'lamp_30w', 'computer', 'pump_125', 'pump_250'].includes(c.type);
                        const isDCLoad = c.type.startsWith('led_') || c.type === 'bulb' || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker';
                        const hasInv = c.type === 'inverter' || c.type === 'inverter_3k' || c.type === 'inverter_5k';
                        return isACLoad || isDCLoad || hasInv;
                    });

                    if (hasSolar && !hasLoads && amps > maxOut) {
                        const neededR = loopVoltage / maxOut;
                        scc.currentResistance = Math.max(tmpl.resistance, neededR - (rTotal - scc.currentResistance));
                        rTotal = loopVoltage / maxOut;
                        amps = maxOut;
                        const sccEl = document.getElementById(scc.id);
                        if (sccEl) {
                            sccEl.classList.add('scc-active', 'scc-protecting');
                            let badge = sccEl.querySelector('.scc-status');
                            if (!badge) { badge = document.createElement('div'); badge.className = 'scc-status'; sccEl.appendChild(badge); }
                            badge.textContent = hasBattery ? `⚡ PROTECT ${(amps*1000).toFixed(0)}mA` : `⚡ LIMIT ${(amps*1000).toFixed(0)}mA`;
                        }
                    } else if (hasSolar) {
                        const sccEl = document.getElementById(scc.id);
                        if (sccEl) {
                            sccEl.classList.add('scc-active');
                            let badge = sccEl.querySelector('.scc-status');
                            if (!badge) { badge = document.createElement('div'); badge.className = 'scc-status'; sccEl.appendChild(badge); }
                            badge.textContent = `✓ OK ${(amps*1000).toFixed(0)}mA`;
                        }
                    }
                }

                // ── Step-Down Converter Protection Logic ──
                const stepDowns = compsInLoop.filter(c => c.type === 'stepdown_12v' || c.type === 'stepdown_5v');
                stepDowns.forEach(sd => {
                    if (sd.isBroken) return;
                    const sdTmpl = COMPONENTS.find(t => t.id === sd.type);
                    const sdMaxOut = sdTmpl?.maxOutputCurrent || 0.02;
                    if (amps > sdMaxOut) {
                        const neededR = loopVoltage / sdMaxOut;
                        sd.currentResistance = Math.max(sdTmpl.resistance, neededR - (rTotal - sd.currentResistance));
                        rTotal = loopVoltage / sdMaxOut;
                        amps = sdMaxOut;
                        const sdEl = document.getElementById(sd.id);
                        if (sdEl) {
                            sdEl.classList.add('scc-protecting');
                            let badge = sdEl.querySelector('.sd-status');
                            if (!badge) { badge = document.createElement('div'); badge.className = 'sd-status scc-status'; sdEl.appendChild(badge); }
                            badge.textContent = `⚡ ${(amps*1000).toFixed(0)}mA`;
                            const ind = sdEl.querySelector('.sd-indicator');
                            if (ind) ind.style.fill = '#f59e0b';
                        }
                    } else {
                        const sdEl = document.getElementById(sd.id);
                        if (sdEl) {
                            sdEl.classList.add('scc-active');
                            let badge = sdEl.querySelector('.sd-status');
                            if (!badge) { badge = document.createElement('div'); badge.className = 'sd-status scc-status'; sdEl.appendChild(badge); }
                            badge.textContent = `✓ ${(amps*1000).toFixed(0)}mA`;
                            const ind = sdEl.querySelector('.sd-indicator');
                            if (ind) ind.style.fill = '#22c55e';
                        }
                    }
                });

                const loopKey = compsInLoop.map(c => c.id).sort().join(',');
                if (activeLoops.find(l => l.key === loopKey)) return;
                const watts = loopVoltage * amps;
                let srcPower = 0, loadPower = 0;
                compsInLoop.forEach(c => {
                    const t = COMPONENTS.find(x => x.id === c.type);
                    if (!t) return;
                    if (isSource(c) && t.ratedPower && !c.type.startsWith('battery')) srcPower += t.ratedPower;
                    else if (t.ratedPower && !isSource(c) && c.type !== 'charge_controller' && c.type !== 'inverter' && c.type !== 'inverter_3k' && c.type !== 'inverter_5k' && c.type !== 'switch_toggle') loadPower += t.ratedPower;
                });
                const battIds = compsInLoop.filter(c => c.type.startsWith('battery') && c.batteryCapacity).map(c => c.id);
                const hasCC = compsInLoop.some(c => c.type === 'charge_controller');
                const hasInverter = compsInLoop.some(c => c.type.startsWith('inverter'));
                activeLoops.push({ key: loopKey, v: loopVoltage, r: rTotal, i: amps, w: watts, srcW: srcPower, loadW: loadPower, battIds, hasCC, hasInverter });

                console.log(`[CZElectro] Loop ${activeLoops.length}: V=${loopVoltage}V, R=${rTotal.toFixed(1)}Ω, I=${(amps*1000).toFixed(1)}mA, components:`, compsInLoop.map(c => `${c.type}(${c.currentResistance}Ω)`).join(' → '));

                wireIndices.forEach(wi => { if (CZ.wires[wi]) CZ.wires[wi].energized = true; });

                // PASS 1: Check overcurrent — break components first
                let loopBroken = false;
                compsInLoop.forEach(c => {
                    const el = document.getElementById(c.id);
                    if (!el || c.isBroken) return;
                    const isLed = c.type.startsWith('led_') || c.type === 'bulb';
                    const isAC = c.type === 'iron' || c.type === 'fridge' || c.type === 'blender' || c.type === 'ricecooker' || c.type === 'ac_05pk' || c.type === 'ac_1pk' || c.type === 'tv_led' || c.type === 'lamp_30w' || c.type === 'computer' || c.type === 'pump_125' || c.type === 'pump_250';
                    const isOutput = isLed || isAC || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || c.type === 'fuse';
                    if (isOutput && c.maxCurrent && amps > c.maxCurrent) {
                        loopBroken = true;
                        c.isBroken = true;
                        c.currentResistance = Infinity;
                        el.classList.add('comp-broken');
                        if (isLed || c.type === 'bulb') el.classList.add('led-broken');
                        if (c.type === 'fuse') el.classList.add('fuse-blown');
                        if (c.type === 'motor_dc') {
                            el.classList.remove('motor-active');
                            const spin = el.querySelector('.motor-spin');
                            if (spin) spin.style.animation = 'none';
                        }
                        if (c.type === 'bulb') {
                            const fil = el.querySelector('.bulb-filament');
                            if (fil) fil.style.stroke = 'transparent';
                        }
                        CZ.spawnSparks(el);
                        CZ.showBurnNotice(el, amps, c.maxCurrent);
                        if (c.type === 'fuse') CZ.SFX.fuseSnap();
                        else CZ.SFX.burn();
                    }
                });

                // PASS 2: Activate outputs using per-component voltage division
                if (!loopBroken) {
                    compsInLoop.forEach(c => {
                        const el = document.getElementById(c.id);
                        if (!el || c.isBroken) return;

                        const tmplAC = COMPONENTS.find(t => t.id === c.type);
                        if (tmplAC?.acOnly && !hasInverter) {
                            el.classList.add('ac-no-inverter');
                            let noAcBadge = el.querySelector('.no-ac-badge');
                            if (!noAcBadge) { noAcBadge = document.createElement('div'); noAcBadge.className = 'no-ac-badge'; noAcBadge.textContent = '⚠ NO AC'; el.appendChild(noAcBadge); }
                            return;
                        }

                        const isOutputComp2 = tmplAC && tmplAC.ratedPower && !isSource(c) && c.type !== 'charge_controller' && c.type !== 'inverter' && c.type !== 'inverter_3k' && c.type !== 'inverter_5k' && c.type !== 'switch_toggle';
                        if (isOutputComp2 && srcPower > 0 && loadPower > srcPower) {
                            el.classList.add('ac-no-inverter');
                            let lpBadge = el.querySelector('.no-ac-badge');
                            if (!lpBadge) { lpBadge = document.createElement('div'); lpBadge.className = 'no-ac-badge'; el.appendChild(lpBadge); }
                            lpBadge.textContent = `⚠ DAYA KURANG (${srcPower}W < ${loadPower}W)`;
                            return;
                        }

                        const vComp = amps * c.currentResistance;
                        const tmpl = COMPONENTS.find(t => t.id === c.type);

                        const isLed = c.type.startsWith('led_') || c.type === 'bulb';
                        if (isLed) {
                            const ratio = Math.min(amps / c.maxCurrent, 1);
                            const vi = Math.pow(ratio, 0.85);
                            const ring = el.querySelector('.led-glow-ring');
                            if (ring) ring.style.fillOpacity = (vi * 0.95).toFixed(3);
                            const bulb = el.querySelector('.led-bulb');
                            const glowSize = Math.round(2 + vi * vi * 40);
                            const glowAlpha = (vi * 0.9).toFixed(2);
                            let glowColor;
                            if (c.type === 'led_rgb') {
                                el.classList.add('led-rgb-active');
                                el.style.setProperty('--rgb-glow-size', glowSize + 'px');
                                el.style.setProperty('--rgb-alpha', glowAlpha);
                            } else if (c.glowGradient) {
                                bulb.style.fill = `url(#${c.glowGradient})`;
                                glowColor = c.type.includes('red') ? `rgba(239,68,68,${glowAlpha})`
                                    : c.type.includes('green') ? `rgba(34,197,94,${glowAlpha})`
                                    : c.type.includes('blue') ? `rgba(59,130,246,${glowAlpha})`
                                    : c.type.includes('white') ? `rgba(255,255,255,${glowAlpha})`
                                    : `rgba(250,204,21,${glowAlpha})`;
                            } else {
                                const r = Math.round(100 + vi * 155);
                                const g = Math.round(20 + vi * 200);
                                const b = Math.round(0 + vi * 80);
                                glowColor = `rgba(${r},${g},${b},${glowAlpha})`;
                                if (bulb) bulb.style.fill = `rgba(${r},${g},${b},${(0.1 + vi * 0.9).toFixed(2)})`;
                            }
                            if (c.type !== 'led_rgb') {
                                if (bulb) bulb.style.filter = `drop-shadow(0 0 ${glowSize}px ${glowColor})${vi > 0.75 ? ` brightness(${(1 + vi * 0.3).toFixed(1)})` : ''}`;
                            }
                            if (ratio >= 0.8) el.classList.add('led-bright');
                            else if (ratio >= 0.3) el.classList.add('led-on');
                            else if (ratio > 0) el.classList.add('led-dim');
                        }
                        if (c.type === 'motor_dc') {
                            const rated = tmpl?.ratedVoltage || 3;
                            const speedRatio = Math.min(vComp / rated, 1);
                            if (speedRatio < 0.03) return;
                            el.classList.add('motor-active');
                            const speed = 0.2 + (1 - speedRatio) * 5.8;
                            const spin = el.querySelector('.motor-spin');
                            const entryPin = compEntryPin[c.id];
                            const isReversed = entryPin === 1;
                            if (spin) spin.style.animation = `spin ${speed.toFixed(2)}s linear infinite${isReversed ? ' reverse' : ''}`;
                            el.classList.toggle('motor-reversed', isReversed);
                            let badge = el.querySelector('.motor-dir-badge');
                            if (!badge) { badge = document.createElement('div'); badge.className = 'motor-dir-badge'; el.appendChild(badge); }
                            badge.textContent = isReversed ? '↺ REV' : '↻ FWD';
                            badge.classList.toggle('reversed', isReversed);
                            CZ.SFX.motorStart(c.id, speedRatio);
                            CZ.SFX.motorUpdate(c.id, speedRatio);
                        }
                        if (c.type === 'buzzer') {
                            if (vComp > 0.5) { el.classList.add('buzzer-active'); CZ.SFX.buzzerStart(c.id); }
                        }
                        if (c.type === 'speaker') {
                            if (vComp > 0.3) {
                                el.classList.add('speaker-active');
                                const cone = el.querySelector('.speaker-cone');
                                if (cone) {
                                    const intensity = Math.min(vComp / 5, 1);
                                    cone.style.animation = `speakerVibrate ${(0.05 + (1 - intensity) * 0.1).toFixed(3)}s ease-in-out infinite alternate`;
                                }
                                CZ.SFX.speakerStart(c.id, vComp);
                                CZ.SFX.speakerUpdate(c.id, vComp);
                            }
                        }
                        if (c.type === 'relay') {
                            if (vComp > 3) { el.classList.add('relay-active'); CZ.SFX.relayClick(); }
                        }
                        // AC Appliances activation
                        if (c.type === 'iron') {
                            el.classList.add('ac-active');
                            const plate = el.querySelector('.iron-plate'); const indicator = el.querySelector('.iron-indicator');
                            if (plate) plate.style.fill = '#ef4444'; if (indicator) indicator.style.fill = '#ef4444';
                        }
                        if (c.type === 'fridge') { el.classList.add('ac-active'); const ind = el.querySelector('.fridge-indicator'); if (ind) ind.style.fill = '#22c55e'; }
                        if (c.type === 'blender') {
                            el.classList.add('ac-active');
                            const blade = el.querySelector('.blender-blade'); const ind = el.querySelector('.blender-indicator');
                            if (blade) blade.style.animation = 'spin 0.3s linear infinite'; if (ind) ind.style.fill = '#22c55e';
                        }
                        if (c.type === 'ricecooker') { el.classList.add('ac-active'); const ind = el.querySelector('.rc-indicator'); if (ind) ind.style.fill = '#ef4444'; }
                        if (c.type === 'ac_05pk' || c.type === 'ac_1pk') {
                            el.classList.add('ac-active');
                            const ind = el.querySelector('.ac-indicator'); if (ind) ind.style.fill = '#22c55e';
                            const fan = el.querySelector('.ac-fan'); if (fan) fan.style.animation = 'spin 2s linear infinite';
                        }
                        if (c.type === 'tv_led') {
                            el.classList.add('ac-active');
                            const screen = el.querySelector('.tv-screen'); if (screen) { screen.style.fill = '#1e40af'; screen.style.filter = 'brightness(1.5)'; }
                            const ind = el.querySelector('.tv-indicator'); if (ind) ind.style.fill = '#22c55e';
                        }
                        if (c.type === 'lamp_30w') {
                            el.classList.add('ac-active');
                            const glow = el.querySelector('.lamp-glow'); if (glow) { glow.style.fill = '#fbbf24'; glow.style.opacity = '0.6'; glow.style.filter = 'blur(4px)'; }
                        }
                        if (c.type === 'computer') {
                            el.classList.add('ac-active');
                            const screen = el.querySelector('.pc-screen'); if (screen) { screen.style.fill = '#1e3a5f'; screen.style.filter = 'brightness(1.4)'; }
                            const power = el.querySelector('.pc-power'); if (power) power.style.opacity = '1';
                            const ind = el.querySelector('.pc-indicator'); if (ind) ind.style.fill = '#22c55e';
                        }
                        if (c.type === 'pump_125' || c.type === 'pump_250') {
                            el.classList.add('ac-active');
                            const impeller = el.querySelector('.pump-impeller'); if (impeller) impeller.style.animation = 'spin 0.5s linear infinite';
                            const ind = el.querySelector('.pump-indicator'); if (ind) ind.style.fill = '#22c55e';
                        }

                        // Power badge for output components
                        const isOutputComp = c.type.startsWith('led_') || c.type === 'bulb' || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || c.type === 'iron' || c.type === 'fridge' || c.type === 'blender' || c.type === 'ricecooker' || c.type === 'ac_05pk' || c.type === 'ac_1pk' || c.type === 'tv_led' || c.type === 'lamp_30w' || c.type === 'computer' || c.type === 'pump_125' || c.type === 'pump_250';
                        if (isOutputComp) {
                            const pComp = vComp * amps;
                            let pBadge = el.querySelector('.power-badge');
                            if (!pBadge) { pBadge = document.createElement('div'); pBadge.className = 'power-badge'; el.appendChild(pBadge); }
                            pBadge.textContent = tmpl?.ratedPower
                                ? (tmpl.ratedPower >= 1 ? `${tmpl.ratedPower}W` : `${(tmpl.ratedPower * 1000).toFixed(0)}mW`)
                                : (pComp >= 1 ? `${pComp.toFixed(1)}W` : `${(pComp * 1000).toFixed(0)}mW`);
                        }
                    });
                }
            });
        });

        CZ.renderWires();
        CZ.simTotalLoadW = 0;
        CZ.simTotalSrcW = 0;
        const activeBatteryIds = new Set();
        activeLoops.forEach(l => {
            CZ.simTotalSrcW += l.srcW || 0;
            CZ.simTotalLoadW += l.loadW || 0;
        });
        CZ.deployed.forEach(c => {
            if (c.type.startsWith('battery') && c.batteryCapacity) {
                const hasWire = CZ.wires.some(w => w.c1 === c.id || w.c2 === c.id);
                const el = document.getElementById(c.id);
                if (hasWire && el && CZ.wires.some(w => w.energized && (w.c1 === c.id || w.c2 === c.id))) {
                    activeBatteryIds.add(c.id);
                }
            }
        });
        window._activeBatteryIds = activeBatteryIds;

        // Union-Find for parallel batteries
        const ufParent = {};
        CZ.deployed.forEach(c => ufParent[c.id] = c.id);
        function ufFind(x) { return ufParent[x] === x ? x : (ufParent[x] = ufFind(ufParent[x])); }
        function ufUnion(a, b) { ufParent[ufFind(a)] = ufFind(b); }
        CZ.wires.forEach(w => ufUnion(w.c1, w.c2));

        const allBatteries = CZ.deployed.filter(c => c.type.startsWith('battery') && c.batteryCapacity);
        activeLoops.forEach(loop => {
            if (!loop.battIds || loop.battIds.length === 0) return;
            const expanded = new Set(loop.battIds);
            loop.battIds.forEach(loopBatId => {
                allBatteries.forEach(b => {
                    if (ufFind(loopBatId) === ufFind(b.id)) expanded.add(b.id);
                });
            });
            loop.battIds = [...expanded];
        });

        window._activeLoops = activeLoops;
        CZ.updateStatusValues(hasLoop, activeLoops);
        CZ.updateBatteryBars();
        CZ.saveState();
    };

    // ── Circuit Tracing (DFS) ──
    CZ.traceCircuit = function(curr, visited, path, paths, targetBatt) {
        const conns = CZ.wires.map((w, idx) => ({ ...w, wireIdx: idx }))
            .filter(w => (w.c1 === curr.cid && w.i1 === curr.pin) || (w.c2 === curr.cid && w.i2 === curr.pin));

        conns.forEach(w => {
            const isFrom = (w.c1 === curr.cid && w.i1 === curr.pin);
            const nCid = isFrom ? w.c2 : w.c1;
            const nPin = isFrom ? w.i2 : w.i1;

            if (nCid === targetBatt && nPin === 1) {
                paths.push([...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }]);
                return;
            }

            const nextComp = CZ.deployed.find(c => c.id === nCid);
            if (!nextComp || visited.includes(nCid)) return;

            const nextTmpl = COMPONENTS.find(t => t.id === nextComp.type);
            if (nextTmpl?.isGround) {
                const otherGrounds = CZ.deployed.filter(c => {
                    const t = COMPONENTS.find(x => x.id === c.type);
                    return t?.isGround && c.id !== nCid && !visited.includes(c.id);
                });
                otherGrounds.forEach(gnd => {
                    const gndConns = CZ.wires.map((gw, idx) => ({ ...gw, wireIdx: idx }))
                        .filter(gw => (gw.c1 === gnd.id && gw.i1 === 0) || (gw.c2 === gnd.id && gw.i2 === 0));
                    gndConns.forEach(gw => {
                        const gIsFrom = (gw.c1 === gnd.id && gw.i1 === 0);
                        const gNCid = gIsFrom ? gw.c2 : gw.c1;
                        const gNPin = gIsFrom ? gw.i2 : gw.i1;
                        if (gNCid === targetBatt && gNPin === 1) {
                            paths.push([...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }, { cid: gnd.id, pin: 0, wireIdx: gw.wireIdx }]);
                            return;
                        }
                        const gNextComp = CZ.deployed.find(c => c.id === gNCid);
                        if (!gNextComp || visited.includes(gNCid)) return;
                        const gOutPin = gNPin === 0 ? 1 : 0;
                        CZ.traceCircuit(
                            { cid: gNCid, pin: gOutPin },
                            [...visited, nCid, gnd.id, gNCid],
                            [...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }, { cid: gnd.id, pin: 0, wireIdx: gw.wireIdx }, { cid: gNCid, pin: gNPin }],
                            paths, targetBatt
                        );
                    });
                });
                return;
            }

            const outPin = nPin === 0 ? 1 : 0;
            CZ.traceCircuit(
                { cid: nCid, pin: outPin },
                [...visited, nCid],
                [...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }],
                paths, targetBatt
            );
        });
    };

    // ── Status bar ──
    CZ.updateStatus = function() {
        document.getElementById('comp-count').textContent = CZ.deployed.length + ' parts';
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
            const isRch = b.type.includes('lifepo4') || b.type.includes('plts') || b.type === 'battery_32140';
            const minLevel = isRch ? b.batteryCapacity * 0.10 : 0;
            return b.batteryLevel <= minLevel;
        });
        const noPower = allBattsDead && !isDaytime;

        const deltaMin = CZ.simSpeed;
        CZ.simElapsedMin += deltaMin;

        const loopsDrain = window._activeLoops || [];
        let anyDrained = false;
        loopsDrain.forEach(loop => {
            if (!loop.battIds || loop.battIds.length === 0) return;
            let adjSrcW = (loop.srcW || 0) * solarFactor;
            let adjLoadW = loop.loadW || 0;
            if (loop.hasCC) adjSrcW *= 0.93;
            if (loop.hasInverter) adjLoadW /= 0.90;
            const loopNetW = adjSrcW - adjLoadW;
            if (loopNetW === 0) return;
            const isCharging = loopNetW > 0;
            const loopBatts = loop.battIds
                .map(id => CZ.deployed.find(c => c.id === id))
                .filter(b => b && (isCharging ? b.batteryLevel < b.batteryCapacity : b.batteryLevel > 0));
            if (loopBatts.length === 0) return;
            const perBattRaw = (loopNetW * deltaMin) / 60 / loopBatts.length;
            loopBatts.forEach(bat => {
                let delta = perBattRaw;
                if (isCharging) {
                    const maxChargeWhPerMin = (bat.batteryCapacity * 0.5) / 60;
                    const maxDelta = maxChargeWhPerMin * deltaMin;
                    delta = Math.min(delta, maxDelta);
                }
                const isRechargeable = bat.type.includes('lifepo4') || bat.type.includes('plts') || bat.type === 'battery_32140';
                const minLevel = isRechargeable ? bat.batteryCapacity * 0.10 : 0;
                bat.batteryLevel = Math.max(minLevel, Math.min(bat.batteryCapacity, bat.batteryLevel + delta));
            });
            anyDrained = true;
        });

        if (anyDrained) { CZ.saveState(); }
        CZ.evaluateCircuit();
        CZ.updateSimPanel(totalSolarW, totalLoadW, batteries, hour, isDaytime, solarFactor, noPower);
    };

    CZ.updateSimPanel = function(solarW, loadW, batteries, hour, isDaytime, solarFactor, noPower) {
        let panel = document.getElementById('sim-panel');
        if (!panel) return;
        const dayNum = Math.floor(CZ.simElapsedMin / 1440) + 1;
        const clockH = Math.floor(hour);
        const clockM = Math.floor((hour % 1) * 60);
        const timeStr = `${String(clockH).padStart(2,'0')}:${String(clockM).padStart(2,'0')}`;
        const timeIcon = isDaytime ? '☀️' : '🌙';
        const solarPct = (solarFactor * 100).toFixed(0);
        const netW = solarW - loadW;
        const netSign = netW >= 0 ? '+' : '';
        const netColor = netW >= 0 ? '#22c55e' : '#ef4444';
        const speedLabel = CZ.simSpeed === 0 ? '⏸ PAUSE' : `▶ ${CZ.simSpeed}x`;
        const speedColor = CZ.simSpeed === 0 ? '#ef4444' : '#22c55e';

        const hourAngle = CZ.simElapsedMin * 0.5;
        const minAngle = CZ.simElapsedMin * 6;
        const faceColor = isDaytime ? '#1a2a3a' : '#0d0d1a';
        const rimColor = isDaytime ? '#f59e0b' : '#334155';
        const sunAngleVis = ((hour % 12) / 12) * 360;
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
                <line class="ck-hour" x1="30" y1="30" x2="30" y2="14" stroke="#e5e7eb" stroke-width="2.5" stroke-linecap="round" style="transform-origin:30px 30px;transition:transform .9s linear"/>
                <line class="ck-min" x1="30" y1="30" x2="30" y2="8" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" style="transform-origin:30px 30px;transition:transform .9s linear"/>
                <circle cx="30" cy="30" r="2" fill="#f59e0b"/>
            </svg>`;
            panel.insertBefore(clockWrap, panel.firstChild);
        }

        const hHand = clockWrap.querySelector('.ck-hour');
        const mHand = clockWrap.querySelector('.ck-min');
        hHand.style.transform = `rotate(${hourAngle}deg)`;
        mHand.style.transform = `rotate(${minAngle}deg)`;

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
            const typeName = tmpl ? tmpl.name : type;
            if (batts.length === 1) {
                battInfo += `<div class="sim-batt">${icon} ${avgPct.toFixed(0)}% (${totalLevel.toFixed(0)}Wh)${dodLabel}</div>`;
            } else {
                const whLabel = totalLevel >= 1000 ? `${(totalLevel/1000).toFixed(1)}kWh` : `${totalLevel.toFixed(0)}Wh`;
                const capLabel = totalCap >= 1000 ? `${(totalCap/1000).toFixed(1)}kWh` : `${totalCap.toFixed(0)}Wh`;
                battInfo += `<div class="sim-batt">${icon} ${batts.length}× ${typeName}: ${avgPct.toFixed(0)}% (${whLabel}/${capLabel})${dodLabel}</div>`;
            }
        });

        const noPowerLabel = noPower ? ' <span style="color:#ef4444;font-weight:700">⛔ NO POWER</span>' : '';

        let infoEl = panel.querySelector('.sim-info');
        if (!infoEl) { infoEl = document.createElement('div'); infoEl.className = 'sim-info'; panel.appendChild(infoEl); }
        infoEl.innerHTML = `
            <div class="sim-header">${timeIcon} Hari ${dayNum} ${timeStr} <span style="color:#f59e0b">☀${solarPct}%</span> | <span style="color:${speedColor}">${speedLabel}</span>${noPowerLabel}</div>
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
            const pct = Math.max(0, Math.min(100, (bat.batteryLevel / bat.batteryCapacity) * 100));
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

            const isRechargeable = bat.type.includes('lifepo4') || bat.type.includes('plts') || bat.type === 'battery_32140';
            const deadThreshold = isRechargeable ? bat.batteryCapacity * 0.10 : 0;
            if (bat.batteryLevel <= deadThreshold) {
                el.classList.add('battery-dead'); el.style.opacity = '0.5';
            } else {
                el.classList.remove('battery-dead'); el.style.opacity = '';
            }
        });
    };

    CZ.updateStatusValues = function(hasLoop, loops) {
        const dot = document.getElementById('circuit-dot');
        const statusTxt = document.getElementById('circuit-status');
        const loopsDiv = document.getElementById('circuit-loops');

        if (hasLoop && loops.length > 0) {
            dot.className = 'status-dot live';
            statusTxt.textContent = loops.length === 1 ? 'Circuit Active' : `${loops.length} Circuits Active`;
            loopsDiv.innerHTML = loops.map((l, idx) => {
                const label = loops.length > 1 ? `<span style="color:var(--accent);font-weight:700;">#${idx + 1}</span> ` : '';
                const wattStr = l.w >= 1 ? `${l.w.toFixed(1)}W` : `${(l.w * 1000).toFixed(0)}mW`;
                let realInfo = '';
                if (l.srcW > 0 && l.loadW > 0) {
                    const ok = l.srcW >= l.loadW;
                    realInfo = `<div class="status-item" style="color:${ok ? '#4ade80' : '#f87171'};font-size:10px;">${ok ? '✅' : '⚠️'} Sumber: ${l.srcW}W | Beban: ${l.loadW}W ${ok ? '(Cukup)' : '(Kurang!)'}</div>`;
                }
                return `<div class="status-item">${label}⚡${l.v.toFixed(1)}V &nbsp;🔌${(l.i * 1000).toFixed(1)}mA &nbsp;Ω${l.r.toFixed(0)} &nbsp;💡${wattStr}</div>${realInfo}`;
            }).join('');
        } else if (CZ.deployed.length) {
            dot.className = 'status-dot warn';
            statusTxt.textContent = 'Open Circuit';
            loopsDiv.innerHTML = '';
        } else {
            dot.className = 'status-dot';
            statusTxt.textContent = 'No Circuit';
            loopsDiv.innerHTML = '';
        }
        CZ.updateStatus();
    };

})(window.CZ);
