// CZElectro — MNA-based evaluateCircuit override
// Replaces the DFS loop-tracing evaluateCircuit with MNA solver results
(function(CZ) {
    'use strict';

    const isSource = c => c.type.startsWith('battery') || c.type.startsWith('solar_');
    const isInverterType = t => t === 'inverter' || t === 'inverter_3k' || t === 'inverter_5k';
    const AC_TYPES = ['iron','fridge','blender','ricecooker','ac_05pk','ac_1pk','tv_led','lamp_30w','computer','pump_125','pump_250'];

    CZ.evaluateCircuit = function() {
        // ── RESET all output states ──
        CZ.deployed.forEach(c => {
            const el = document.getElementById(c.id);
            if (!el) return;
            el.classList.remove('led-on','led-dim','led-bright','motor-active','motor-reversed','buzzer-active','led-rgb-active','speaker-active','relay-active','scc-active','scc-protecting','ac-active','ac-no-inverter');
            el.style.removeProperty('--glow-intensity');
            const bulb = el.querySelector('.led-bulb');
            if (bulb && !c.isBroken) { bulb.style.fill = ''; bulb.style.filter = ''; }
            const ring = el.querySelector('.led-glow-ring');
            if (ring && !c.isBroken) { ring.style.fillOpacity = '0'; ring.style.fill = ''; }
            const spin = el.querySelector('.motor-spin');
            if (spin) spin.style.animation = 'none';
            el.querySelectorAll('.motor-dir-badge,.scc-status,.no-ac-badge,.power-badge,.sd-status').forEach(b => b.remove());
            const cones = el.querySelectorAll('.speaker-cone');
            cones.forEach(cone => cone.style.animation = 'none');
            // Reset AC appliance indicators
            ['iron-plate','iron-indicator','fridge-indicator','blender-indicator','rc-indicator','ac-indicator','tv-indicator','pc-indicator','sd-indicator','pump-indicator'].forEach(cls => {
                const ind = el.querySelector('.' + cls); if (ind) ind.style.fill = '';
            });
            const blenderBlade = el.querySelector('.blender-blade');
            if (blenderBlade) blenderBlade.style.animation = 'none';
            const acFan = el.querySelector('.ac-fan');
            if (acFan) acFan.style.animation = 'none';
            const tvScreen = el.querySelector('.tv-screen');
            if (tvScreen) { tvScreen.style.fill = ''; tvScreen.style.filter = ''; }
            const lampGlow = el.querySelector('.lamp-glow');
            if (lampGlow) { lampGlow.style.fill = 'none'; lampGlow.style.opacity = '0'; lampGlow.style.filter = ''; }
            const pcScreen = el.querySelector('.pc-screen');
            if (pcScreen) { pcScreen.style.fill = ''; pcScreen.style.filter = ''; }
            const pcPower = el.querySelector('.pc-power');
            if (pcPower) pcPower.style.opacity = '';
            const pumpImp = el.querySelector('.pump-impeller');
            if (pumpImp) pumpImp.style.animation = 'none';
            // Reset charge controller / step-down
            if (c.type === 'charge_controller' || c.type === 'stepdown_12v' || c.type === 'stepdown_5v') {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                if (tmpl) c.currentResistance = tmpl.resistance;
            }
        });
        CZ.SFX.stopAll();
        CZ.wires.forEach(w => w.energized = false);

        // ── SOLVE with MNA + diode iteration ──
        let result = CZ.solveMNAWithDiodes();

        // ── Charge Controller & Step-Down Protection (re-solve if overcurrent) ──
        const protectedComps = new Set(); // track which comps are in protection mode
        if (result.hasCircuit) {
            let needResolve = false;
            result.components.forEach(cr => {
                const c = cr.comp, tmpl = cr.tmpl;
                if (!tmpl || c.isBroken) return;
                const amps = Math.abs(cr.current);
                // Charge Controller
                if (c.type === 'charge_controller' && tmpl.maxOutputCurrent && amps > tmpl.maxOutputCurrent) {
                    const hasSolar = result.components.some(x => x.comp.type.startsWith('solar_') && Math.abs(x.current) > 0.0001);
                    if (hasSolar) {
                        // Increase resistance to limit current to maxOutputCurrent
                        const totalV = result.loops[0] ? result.loops[0].v : 0;
                        if (totalV > 0) {
                            const neededR = totalV / tmpl.maxOutputCurrent;
                            c.currentResistance = Math.max(tmpl.resistance, neededR);
                            needResolve = true;
                            protectedComps.add(c.id);
                        }
                    }
                }
                // Step-Down Converters
                if ((c.type === 'stepdown_12v' || c.type === 'stepdown_5v') && tmpl.maxOutputCurrent && amps > tmpl.maxOutputCurrent) {
                    const totalV = result.loops[0] ? result.loops[0].v : 0;
                    if (totalV > 0) {
                        const neededR = totalV / tmpl.maxOutputCurrent;
                        c.currentResistance = Math.max(tmpl.resistance, neededR);
                        needResolve = true;
                        protectedComps.add(c.id);
                    }
                }
            });
            // Re-solve with adjusted resistances
            if (needResolve) {
                result = CZ.solveMNAWithDiodes();
            }
        }

        const hasLoop = result.hasCircuit;
        const activeLoops = result.loops;

        // ── AC/DC Domain Tagging per Node ──
        // Nodes connected to inverter AC output (pin 1) are tagged 'AC'
        // All other nodes default to 'DC'
        const nodeDomain = {}; // nodeId -> 'AC' | 'DC'
        const acNodeVoltage = {}; // nodeId -> effective AC voltage
        result.components.forEach(cr => {
            const tmpl = cr.tmpl;
            if (!tmpl || !tmpl.isInverter) return;
            if (Math.abs(cr.current) < 0.0001) return;
            const inputV = Math.abs(cr.v1 - cr.v2);
            const inputOk = inputV >= (tmpl.inputVoltageMin || 0);
            // Pin 1 = AC output side of inverter
            const acNode = cr.nodeN; // nodeN corresponds to pin 1 (terminal index 1)
            if (acNode >= 0) {
                nodeDomain[acNode] = inputOk ? 'AC' : 'DC_UNDERVOLT';
                acNodeVoltage[acNode] = inputOk ? (tmpl.outputVoltageEf || 220) : 0;
            }
        });

        // Propagate AC domain to all nodes sharing wires with AC-tagged nodes
        // (nodes connected through non-inverter components are same domain)
        let domainChanged = true;
        while (domainChanged) {
            domainChanged = false;
            CZ.wires.forEach(w => {
                const n1 = result.getNode ? result.getNode(w.c1, w.i1) : -1;
                const n2 = result.getNode ? result.getNode(w.c2, w.i2) : -1;
                if (n1 < 0 || n2 < 0) return;
                // Skip propagation through inverters (they create domain boundary)
                const c1comp = CZ.deployed.find(c => c.id === w.c1);
                const c2comp = CZ.deployed.find(c => c.id === w.c2);
                const c1tmpl = c1comp ? COMPONENTS.find(t => t.id === c1comp.type) : null;
                const c2tmpl = c2comp ? COMPONENTS.find(t => t.id === c2comp.type) : null;
                if (c1tmpl?.isInverter || c2tmpl?.isInverter) return;
                // Propagate AC domain
                if (nodeDomain[n1] === 'AC' && nodeDomain[n2] !== 'AC') {
                    nodeDomain[n2] = 'AC';
                    acNodeVoltage[n2] = acNodeVoltage[n1] || 220;
                    domainChanged = true;
                }
                if (nodeDomain[n2] === 'AC' && nodeDomain[n1] !== 'AC') {
                    nodeDomain[n1] = 'AC';
                    acNodeVoltage[n1] = acNodeVoltage[n2] || 220;
                    domainChanged = true;
                }
            });
        }

        // Helper: check if component is on AC domain
        const isOnACDomain = (cr) => {
            return nodeDomain[cr.nodeP] === 'AC' || nodeDomain[cr.nodeN] === 'AC';
        };
        const getACVoltage = (cr) => {
            return acNodeVoltage[cr.nodeP] || acNodeVoltage[cr.nodeN] || 0;
        };

        // Debug logging
        if (hasLoop) {
            const activeComps = result.components.filter(cr => Math.abs(cr.current) > 0.0001);
            console.log(`[MNA] Circuit: ${activeComps.length} active components, ${Object.keys(nodeDomain).filter(k => nodeDomain[k] === 'AC').length} AC nodes`);
            activeComps.forEach(cr => {
                const tmpl = cr.tmpl;
                console.log(`  ${cr.comp.type} (${cr.comp.id}): V=${cr.vDrop.toFixed(3)}V, I=${(cr.current*1000).toFixed(1)}mA, P=${cr.power.toFixed(3)}W, nodes=[${cr.nodeP},${cr.nodeN}] domain=${nodeDomain[cr.nodeP]||'DC'}/${nodeDomain[cr.nodeN]||'DC'}`);
            });
        }

        // Compute source/load power for display
        let srcPower = 0, loadPower = 0;
        result.components.forEach(cr => {
            if (Math.abs(cr.current) < 0.0001) return;
            const t = cr.tmpl;
            if (!t) return;
            if (isSource(cr.comp) && t.ratedPower && !cr.comp.type.startsWith('battery')) srcPower += t.ratedPower;
            else if (t.ratedPower && !isSource(cr.comp) && cr.comp.type !== 'charge_controller' && !isInverterType(cr.comp.type) && cr.comp.type !== 'switch_toggle') loadPower += t.ratedPower;
        });

        // ── PASS 1: Overcurrent — break components & sources ──
        let anyBroken = false;
        result.components.forEach(cr => {
            const c = cr.comp, el = document.getElementById(c.id);
            if (!el || c.isBroken) return;
            const amps = Math.abs(cr.current);
            const tmpl = cr.tmpl;
            // Source overcurrent (battery short circuit protection)
            if (isSource(c) && tmpl && tmpl.maxCurrent && amps > tmpl.maxCurrent) {
                anyBroken = true;
                c.isBroken = true;
                c.currentResistance = Infinity;
                el.classList.add('comp-broken');
                CZ.spawnSparks(el);
                CZ.showBurnNotice(el, amps, tmpl.maxCurrent);
                CZ.SFX.burn();
                return;
            }
            // Output overcurrent
            const isLed = c.type.startsWith('led_') || c.type === 'bulb';
            const isOutput = isLed || AC_TYPES.includes(c.type) || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || c.type === 'fuse';
            if (isOutput && c.maxCurrent && amps > c.maxCurrent) {
                anyBroken = true;
                c.isBroken = true;
                c.currentResistance = Infinity;
                el.classList.add('comp-broken');
                if (isLed) el.classList.add('led-broken');
                if (c.type === 'fuse') el.classList.add('fuse-blown');
                if (c.type === 'motor_dc') { el.classList.remove('motor-active'); const s = el.querySelector('.motor-spin'); if (s) s.style.animation = 'none'; }
                if (c.type === 'bulb') { const f = el.querySelector('.bulb-filament'); if (f) f.style.stroke = 'transparent'; }
                CZ.spawnSparks(el);
                CZ.showBurnNotice(el, amps, c.maxCurrent);
                if (c.type === 'fuse') CZ.SFX.fuseSnap(); else CZ.SFX.burn();
            }
        });

        // ── PASS 2: Activate outputs ──
        if (!anyBroken) {
            result.components.forEach(cr => {
                const c = cr.comp, el = document.getElementById(c.id);
                if (!el || c.isBroken) return;
                const amps = Math.abs(cr.current);
                const vComp = Math.abs(cr.vDrop);
                const tmpl = cr.tmpl;
                if (amps < 0.0001) return;

                // AC-only check: must be on AC domain with valid voltage
                if (tmpl && tmpl.acOnly) {
                    const onAC = isOnACDomain(cr);
                    const acV = getACVoltage(cr);
                    if (!onAC || acV < 200) {
                        el.classList.add('ac-no-inverter');
                        let badge = el.querySelector('.no-ac-badge');
                        if (!badge) { badge = document.createElement('div'); badge.className = 'no-ac-badge'; el.appendChild(badge); }
                        if (!onAC) badge.textContent = '⚠ NO AC';
                        else if (nodeDomain[cr.nodeP] === 'DC_UNDERVOLT' || nodeDomain[cr.nodeN] === 'DC_UNDERVOLT') badge.textContent = '⚠ INPUT KURANG';
                        else badge.textContent = `⚠ AC ${acV}V < 200V`;
                        return;
                    }
                }

                // Power insufficient check
                if (tmpl && tmpl.ratedPower && !isSource(c) && c.type !== 'charge_controller' && !isInverterType(c.type) && c.type !== 'switch_toggle') {
                    if (srcPower > 0 && loadPower > srcPower) {
                        el.classList.add('ac-no-inverter');
                        let lpBadge = el.querySelector('.no-ac-badge');
                        if (!lpBadge) { lpBadge = document.createElement('div'); lpBadge.className = 'no-ac-badge'; el.appendChild(lpBadge); }
                        lpBadge.textContent = `⚠ DAYA KURANG (${srcPower}W < ${loadPower}W)`;
                        return;
                    }
                }

                // ── LED / Bulb ──
                const isLed = c.type.startsWith('led_') || c.type === 'bulb';
                if (isLed && c.maxCurrent) {
                    const ratio = Math.min(amps / c.maxCurrent, 1);
                    const vi = Math.pow(ratio, 0.85);
                    const ring = el.querySelector('.led-glow-ring');
                    if (ring) ring.style.fillOpacity = (vi * 0.95).toFixed(3);
                    const bulbEl = el.querySelector('.led-bulb');
                    const glowSize = Math.round(2 + vi * vi * 40);
                    const glowAlpha = (vi * 0.9).toFixed(2);
                    let glowColor;
                    if (c.type === 'led_rgb') {
                        el.classList.add('led-rgb-active');
                        el.style.setProperty('--rgb-glow-size', glowSize + 'px');
                        el.style.setProperty('--rgb-alpha', glowAlpha);
                    } else if (c.glowGradient) {
                        if (bulbEl) bulbEl.style.fill = `url(#${c.glowGradient})`;
                        glowColor = c.type.includes('red') ? `rgba(239,68,68,${glowAlpha})`
                            : c.type.includes('green') ? `rgba(34,197,94,${glowAlpha})`
                            : c.type.includes('blue') ? `rgba(59,130,246,${glowAlpha})`
                            : c.type.includes('white') ? `rgba(255,255,255,${glowAlpha})`
                            : `rgba(250,204,21,${glowAlpha})`;
                    } else {
                        const r = Math.round(100 + vi * 155), g = Math.round(20 + vi * 200), b = Math.round(0 + vi * 80);
                        glowColor = `rgba(${r},${g},${b},${glowAlpha})`;
                        if (bulbEl) bulbEl.style.fill = `rgba(${r},${g},${b},${(0.1 + vi * 0.9).toFixed(2)})`;
                    }
                    if (c.type !== 'led_rgb' && bulbEl) {
                        bulbEl.style.filter = `drop-shadow(0 0 ${glowSize}px ${glowColor})${vi > 0.75 ? ` brightness(${(1 + vi * 0.3).toFixed(1)})` : ''}`;
                    }
                    if (ratio >= 0.8) el.classList.add('led-bright');
                    else if (ratio >= 0.3) el.classList.add('led-on');
                    else if (ratio > 0) el.classList.add('led-dim');
                }

                // ── Motor DC ──
                if (c.type === 'motor_dc') {
                    const rated = tmpl?.ratedVoltage || 3;
                    const speedRatio = Math.min(vComp / rated, 1);
                    if (speedRatio >= 0.03) {
                        el.classList.add('motor-active');
                        const speed = 0.2 + (1 - speedRatio) * 5.8;
                        const spinEl = el.querySelector('.motor-spin');
                        // Determine direction from current polarity
                        const isReversed = cr.current < 0;
                        if (spinEl) spinEl.style.animation = `spin ${speed.toFixed(2)}s linear infinite${isReversed ? ' reverse' : ''}`;
                        el.classList.toggle('motor-reversed', isReversed);
                        let badge = el.querySelector('.motor-dir-badge');
                        if (!badge) { badge = document.createElement('div'); badge.className = 'motor-dir-badge'; el.appendChild(badge); }
                        badge.textContent = isReversed ? '↺ REV' : '↻ FWD';
                        badge.classList.toggle('reversed', isReversed);
                        CZ.SFX.motorStart(c.id, speedRatio);
                        CZ.SFX.motorUpdate(c.id, speedRatio);
                    }
                }
                // ── Buzzer ──
                if (c.type === 'buzzer' && vComp > 0.5) { el.classList.add('buzzer-active'); CZ.SFX.buzzerStart(c.id); }
                // ── Speaker ──
                if (c.type === 'speaker' && vComp > 0.3) {
                    el.classList.add('speaker-active');
                    const cone = el.querySelector('.speaker-cone');
                    if (cone) { const intensity = Math.min(vComp / 5, 1); cone.style.animation = `speakerVibrate ${(0.05 + (1 - intensity) * 0.1).toFixed(3)}s ease-in-out infinite alternate`; }
                    CZ.SFX.speakerStart(c.id, vComp); CZ.SFX.speakerUpdate(c.id, vComp);
                }
                // ── Relay ──
                if (c.type === 'relay' && vComp > 3) { el.classList.add('relay-active'); CZ.SFX.relayClick(); }

                // ── AC Appliances ──
                if (c.type === 'iron') { el.classList.add('ac-active'); const p = el.querySelector('.iron-plate'); const i = el.querySelector('.iron-indicator'); if (p) p.style.fill = '#ef4444'; if (i) i.style.fill = '#ef4444'; }
                if (c.type === 'fridge') { el.classList.add('ac-active'); const i = el.querySelector('.fridge-indicator'); if (i) i.style.fill = '#22c55e'; }
                if (c.type === 'blender') { el.classList.add('ac-active'); const b = el.querySelector('.blender-blade'); const i = el.querySelector('.blender-indicator'); if (b) b.style.animation = 'spin 0.3s linear infinite'; if (i) i.style.fill = '#22c55e'; }
                if (c.type === 'ricecooker') { el.classList.add('ac-active'); const i = el.querySelector('.rc-indicator'); if (i) i.style.fill = '#ef4444'; }
                if (c.type === 'ac_05pk' || c.type === 'ac_1pk') { el.classList.add('ac-active'); const i = el.querySelector('.ac-indicator'); if (i) i.style.fill = '#22c55e'; const f = el.querySelector('.ac-fan'); if (f) f.style.animation = 'spin 2s linear infinite'; }
                if (c.type === 'tv_led') { el.classList.add('ac-active'); const s = el.querySelector('.tv-screen'); if (s) { s.style.fill = '#1e40af'; s.style.filter = 'brightness(1.5)'; } const i = el.querySelector('.tv-indicator'); if (i) i.style.fill = '#22c55e'; }
                if (c.type === 'lamp_30w') { el.classList.add('ac-active'); const g = el.querySelector('.lamp-glow'); if (g) { g.style.fill = '#fbbf24'; g.style.opacity = '0.6'; g.style.filter = 'blur(4px)'; } }
                if (c.type === 'computer') { el.classList.add('ac-active'); const s = el.querySelector('.pc-screen'); if (s) { s.style.fill = '#1e3a5f'; s.style.filter = 'brightness(1.4)'; } const p = el.querySelector('.pc-power'); if (p) p.style.opacity = '1'; const i = el.querySelector('.pc-indicator'); if (i) i.style.fill = '#22c55e'; }
                if (c.type === 'pump_125' || c.type === 'pump_250') { el.classList.add('ac-active'); const imp = el.querySelector('.pump-impeller'); if (imp) imp.style.animation = 'spin 0.5s linear infinite'; const i = el.querySelector('.pump-indicator'); if (i) i.style.fill = '#22c55e'; }

                // ── Charge Controller badge ──
                if (c.type === 'charge_controller') {
                    const isProtecting = protectedComps.has(c.id);
                    const hasBattery = result.components.some(x => x.comp.type.startsWith('battery') && Math.abs(x.current) > 0.0001);
                    el.classList.add('scc-active');
                    if (isProtecting) el.classList.add('scc-protecting');
                    let badge = el.querySelector('.scc-status');
                    if (!badge) { badge = document.createElement('div'); badge.className = 'scc-status'; el.appendChild(badge); }
                    badge.textContent = isProtecting
                        ? (hasBattery ? `⚡ PROTECT ${(amps*1000).toFixed(0)}mA` : `⚡ LIMIT ${(amps*1000).toFixed(0)}mA`)
                        : `✓ OK ${(amps*1000).toFixed(0)}mA`;
                }
                // ── Step-Down badge ──
                if (c.type === 'stepdown_12v' || c.type === 'stepdown_5v') {
                    const isProtecting = protectedComps.has(c.id);
                    el.classList.add(isProtecting ? 'scc-protecting' : 'scc-active');
                    let badge = el.querySelector('.sd-status');
                    if (!badge) { badge = document.createElement('div'); badge.className = 'sd-status scc-status'; el.appendChild(badge); }
                    badge.textContent = isProtecting
                        ? `⚡ ${(amps*1000).toFixed(0)}mA`
                        : `✓ ${(amps*1000).toFixed(0)}mA`;
                    const ind = el.querySelector('.sd-indicator');
                    if (ind) ind.style.fill = isProtecting ? '#f59e0b' : '#22c55e';
                }

                // ── Power badge (REAL power, not ratedPower) ──
                const isOutputComp = c.type.startsWith('led_') || c.type === 'bulb' || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || AC_TYPES.includes(c.type);
                if (isOutputComp) {
                    const pReal = cr.power;
                    let pBadge = el.querySelector('.power-badge');
                    if (!pBadge) { pBadge = document.createElement('div'); pBadge.className = 'power-badge'; el.appendChild(pBadge); }
                    pBadge.textContent = pReal >= 1 ? `${pReal.toFixed(1)}W` : `${(pReal * 1000).toFixed(0)}mW`;
                }
            });
        }

        // ── Energize wires ──
        result.energizedWires.forEach(idx => { if (CZ.wires[idx]) CZ.wires[idx].energized = true; });
        CZ.renderWires();

        // ── Battery tracking (same logic as before) ──
        CZ.simTotalLoadW = 0;
        CZ.simTotalSrcW = 0;
        const activeBatteryIds = new Set();
        activeLoops.forEach(l => { CZ.simTotalSrcW += l.srcW || 0; CZ.simTotalLoadW += l.loadW || 0; });
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
                allBatteries.forEach(b => { if (ufFind(loopBatId) === ufFind(b.id)) expanded.add(b.id); });
            });
            loop.battIds = [...expanded];
        });

        window._activeLoops = activeLoops;
        CZ.updateStatusValues(hasLoop, activeLoops);
        CZ.updateBatteryBars();
        CZ.saveState();
    };

})(window.CZ);
