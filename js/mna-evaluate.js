// CZElectro — MNA-based evaluateCircuit override
// Replaces the DFS loop-tracing evaluateCircuit with MNA solver results
(function(CZ) {
    'use strict';

    const isSource = c => c.type.startsWith('battery') || c.type.startsWith('solar_');
    const isInverterType = t => t === 'inverter' || t === 'inverter_3k' || t === 'inverter_5k';
    const AC_TYPES = ['iron','fridge','blender','ricecooker','ac_05pk','ac_1pk','tv_led','lamp_30w','computer','pump_125','pump_250'];

    // ── Multimeter display helpers ──
    function mmFormatValue(v, mode) {
        if (mode === 'A') {
            if (v >= 10)    return { val: v.toFixed(2), unit: 'A' };
            if (v >= 1)     return { val: v.toFixed(3), unit: 'A' };
            if (v >= 0.001)  return { val: (v * 1000).toFixed(1), unit: 'mA' };
            if (v >= 0.000001) return { val: (v * 1000000).toFixed(0), unit: 'µA' };
            return { val: '0.00', unit: 'A' };
        }
        if (mode === 'Ω') {
            if (v >= 1000000) return { val: (v / 1000000).toFixed(2), unit: 'MΩ' };
            if (v >= 1000)    return { val: (v / 1000).toFixed(2), unit: 'kΩ' };
            if (v >= 1)       return { val: v.toFixed(1), unit: 'Ω' };
            if (v >= 0.001)   return { val: (v * 1000).toFixed(1), unit: 'mΩ' };
            return { val: 'OL', unit: 'Ω' };
        }
        // V mode
        if (v >= 1000) return { val: (v / 1000).toFixed(2), unit: 'kV' };
        if (v >= 100)  return { val: v.toFixed(1), unit: 'V' };
        if (v >= 1)    return { val: v.toFixed(2), unit: 'V' };
        if (v >= 0.001) return { val: (v * 1000).toFixed(1), unit: 'mV' };
        return { val: '0.00', unit: 'V' };
    }
    function mmColor(v, mode) {
        if (mode === 'A') {
            if (v > 5) return '#ef4444';      // red: near fuse limit
            if (v > 1) return '#f59e0b';      // amber
            return '#ef4444';                  // red theme for current
        }
        if (mode === 'Ω') return '#f59e0b';    // amber theme for resistance
        // V mode
        if (v > 50) return '#ef4444';
        if (v > 12) return '#f59e0b';
        return '#22c55e';
    }
    function mmUpdateDisplay(el, v, mode) {
        const fmt = mmFormatValue(v, mode);
        const color = mmColor(v, mode);
        const rdg = el.querySelector('.vm-reading');
        const unt = el.querySelector('.vm-unit');
        if (rdg) {
            rdg.textContent = fmt.val;
            rdg.setAttribute('fill', color);
            // Auto-scale font to fit 56px-wide screen
            const len = fmt.val.length;
            const fontSize = len <= 4 ? 16 : len <= 5 ? 13 : 11;
            rdg.setAttribute('font-size', fontSize);
        }
        if (unt) {
            unt.textContent = fmt.unit;
            unt.setAttribute('fill', color);
            unt.setAttribute('opacity', '0.8');
            // Adjust unit font size for long units like 'mΩ', 'MΩ', 'µA'
            unt.setAttribute('font-size', fmt.unit.length > 2 ? 6 : 8);
        }
        // Badge
        let badge = el.querySelector('.vm-badge');
        if (!badge) { badge = document.createElement('div'); badge.className = 'vm-badge'; el.appendChild(badge); }
        badge.textContent = `${fmt.val} ${fmt.unit}`;
        badge.style.color = color;
        badge.style.borderColor = color + '66';
    }
    function mmAnimate(comp, el, targetV, mode) {
        if (comp._vmAnimId) { cancelAnimationFrame(comp._vmAnimId); comp._vmAnimId = null; }
        const startV = comp._vmDisplayV || 0;
        if (Math.abs(targetV - startV) < 0.005) {
            comp._vmDisplayV = targetV;
            comp._vmTarget = targetV;
            mmUpdateDisplay(el, targetV, mode);
            return;
        }
        const startTime = performance.now();
        const duration = 600;
        comp._vmTarget = targetV;

        const tick = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            let current = startV + (targetV - startV) * eased;
            if (t < 0.8 && targetV > 0.01) {
                const jitterAmt = targetV * 0.06 * (1 - t);
                current += (Math.random() - 0.5) * jitterAmt;
                current = Math.max(0, current);
            }
            comp._vmDisplayV = current;
            mmUpdateDisplay(el, current, mode);
            if (t < 1) {
                comp._vmAnimId = requestAnimationFrame(tick);
            } else {
                comp._vmDisplayV = targetV;
                mmUpdateDisplay(el, targetV, mode);
                comp._vmAnimId = null;
            }
        };
        comp._vmAnimId = requestAnimationFrame(tick);
    }

    CZ.evaluateCircuit = function() {
        // ── RESET all output states ──
        CZ.deployed.forEach(c => {
            const el = document.getElementById(c.id);
            if (!el) return;
            el.classList.remove('led-on','led-dim','led-bright','motor-active','motor-reversed','buzzer-active','led-rgb-active','speaker-active','relay-active','scc-active','scc-protecting','ac-active','ac-no-inverter','vm-active');
            if (c._rgbAnimId) { cancelAnimationFrame(c._rgbAnimId); c._rgbAnimId = null; }
            el.style.removeProperty('--glow-intensity');
            const bulb = el.querySelector('.led-bulb');
            if (bulb && !c.isBroken) { bulb.style.fill = ''; bulb.style.filter = ''; }
            const ring = el.querySelector('.led-glow-ring');
            if (ring && !c.isBroken) { ring.style.fillOpacity = '0'; ring.style.fill = ''; }
            const spin = el.querySelector('.motor-spin');
            if (spin) spin.style.animation = 'none';
            el.querySelectorAll('.motor-dir-badge,.scc-status,.no-ac-badge,.power-badge,.sd-status').forEach(b => b.remove());
            // Voltmeter: only remove CSS class; preserve animation state for smooth transitions
            // (vm-badge is managed by the animation system, not by the general reset)
            const vmIndicator = el.querySelector('.vm-indicator');
            if (vmIndicator) vmIndicator.style.fill = '';
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
                    const hasSolar = result.components.some(x => x.comp.type.startsWith('solar_') && Math.abs(x.current) > EL.SIM.MIN_CURRENT);
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
            if (Math.abs(cr.current) < EL.SIM.MIN_CURRENT) return;
            // Input voltage = DC pin voltage relative to ground (node 0 = 0V)
            // Pin 0 (DC) is nodeP, connected to battery positive
            const inputV = Math.abs(cr.v1);
            const inputOk = inputV >= (tmpl.inputVoltageMin || 0);
            // Pin 1 = AC output side of inverter
            const acNode = cr.nodeN; // nodeN corresponds to pin 1 (terminal index 1)
            if (acNode >= 0) {
                nodeDomain[acNode] = inputOk ? 'AC' : 'DC_UNDERVOLT';
                acNodeVoltage[acNode] = inputOk ? (tmpl.outputVoltageEf || 220) : 0;
            }
        });

        // Propagate AC domain through wires AND through passive components
        // (AC domain passes through terminal blocks, ground buses, etc.)
        let domainChanged = true;
        while (domainChanged) {
            domainChanged = false;
            // Propagate through wires
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
            // Propagate through passive components (terminal blocks, outlets, ground, etc.)
            // If one pin of a non-source, non-inverter component is AC, the other pin is also AC
            result.components.forEach(cr => {
                const tmpl = cr.tmpl;
                if (!tmpl) return;
                if (tmpl.isInverter || isSource(cr.comp)) return;
                const nP = cr.nodeP, nN = cr.nodeN;
                if (nP < 0 || nN < 0 || nP === nN) return;
                if (nodeDomain[nP] === 'AC' && nodeDomain[nN] !== 'AC') {
                    nodeDomain[nN] = 'AC';
                    acNodeVoltage[nN] = acNodeVoltage[nP] || 220;
                    domainChanged = true;
                }
                if (nodeDomain[nN] === 'AC' && nodeDomain[nP] !== 'AC') {
                    nodeDomain[nP] = 'AC';
                    acNodeVoltage[nP] = acNodeVoltage[nN] || 220;
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
            const activeComps = result.components.filter(cr => Math.abs(cr.current) > EL.SIM.MIN_CURRENT);
            console.log(`[MNA] Circuit: ${activeComps.length} active components, ${Object.keys(nodeDomain).filter(k => nodeDomain[k] === 'AC').length} AC nodes`);
            activeComps.forEach(cr => {
                const tmpl = cr.tmpl;
                console.log(`  ${cr.comp.type} (${cr.comp.id}): V=${cr.vDrop.toFixed(3)}V, I=${(cr.current*1000).toFixed(1)}mA, P=${cr.power.toFixed(3)}W, nodes=[${cr.nodeP},${cr.nodeN}] domain=${nodeDomain[cr.nodeP]||'DC'}/${nodeDomain[cr.nodeN]||'DC'}`);
            });
        }

        // Compute source/load power for display
        let srcPower = 0, loadPower = 0;
        result.components.forEach(cr => {
            if (Math.abs(cr.current) < EL.SIM.MIN_CURRENT) return;
            const t = cr.tmpl;
            if (!t) return;
            if (isSource(cr.comp) && t.ratedPower && !cr.comp.type.startsWith('battery')) srcPower += t.ratedPower;
            else if (t.ratedPower && !isSource(cr.comp) && cr.comp.type !== 'charge_controller' && !isInverterType(cr.comp.type) && cr.comp.type !== 'switch_toggle') loadPower += t.ratedPower;
        });

        // ── PASS 1: Overcurrent — break WEAKEST component first (lowest maxCurrent) ──
        // Like real circuits: a 10A fuse blows before a 100A battery is damaged
        let anyBroken = false;
        const overcurrentList = [];
        result.components.forEach(cr => {
            const c = cr.comp, el = document.getElementById(c.id);
            if (!el || c.isBroken) return;
            const amps = Math.abs(cr.current);
            const tmpl = cr.tmpl;
            // Source overcurrent
            if (isSource(c) && tmpl && tmpl.maxCurrent && amps > tmpl.maxCurrent) {
                overcurrentList.push({ cr, maxCurrent: tmpl.maxCurrent, amps, isSource: true });
            }
            // Output overcurrent (LEDs, AC, motors, fuses, etc.)
            const isLed = c.type.startsWith('led_') || c.type === 'bulb';
            const isOutput = isLed || AC_TYPES.includes(c.type) || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || c.type === 'fuse';
            if (isOutput && c.maxCurrent && amps > c.maxCurrent) {
                overcurrentList.push({ cr, maxCurrent: c.maxCurrent, amps, isSource: false, isLed });
            }
            // Multimeter fuse (ammeter mode)
            if (c.type === 'voltmeter' && c.mmMode === 'A' && tmpl && tmpl.maxCurrent && amps > tmpl.maxCurrent) {
                overcurrentList.push({ cr, maxCurrent: tmpl.maxCurrent, amps, isSource: false, isMeter: true });
            }
        });
        // Sort: weakest (lowest maxCurrent) first — that's what blows in reality
        overcurrentList.sort((a, b) => a.maxCurrent - b.maxCurrent);
        // Break only the weakest link
        if (overcurrentList.length > 0) {
            const weak = overcurrentList[0];
            const c = weak.cr.comp, el = document.getElementById(c.id);
            if (el) {
                anyBroken = true;
                c.isBroken = true;
                c.currentResistance = Infinity;
                el.classList.add('comp-broken');
                if (weak.isLed) el.classList.add('led-broken');
                if (c.type === 'fuse') el.classList.add('fuse-blown');
                if (c.type === 'motor_dc') { el.classList.remove('motor-active'); const s = el.querySelector('.motor-spin'); if (s) s.style.animation = 'none'; }
                if (c.type === 'bulb') { const f = el.querySelector('.bulb-filament'); if (f) f.style.stroke = 'transparent'; }
                CZ.spawnSparks(el);
                CZ.showBurnNotice(el, weak.amps, weak.maxCurrent);
                if (c.type === 'fuse') CZ.SFX.fuseSnap(); else CZ.SFX.burn();
            }
        }

        // ── PASS 2: Activate outputs ──
        if (!anyBroken) {
            result.components.forEach(cr => {
                const c = cr.comp, el = document.getElementById(c.id);
                if (!el || c.isBroken) return;
                const amps = Math.abs(cr.current);
                const vComp = Math.abs(cr.vDrop);
                const tmpl = cr.tmpl;

                // ── Multimeter — mode-aware measurement, handle before amps threshold ──
                if (tmpl && (tmpl.isMultimeter || tmpl.isVoltmeter)) {
                    const mode = c.mmMode || 'V';
                    let measured = 0;
                    if (mode === 'V') {
                        measured = Math.abs(cr.vDrop);
                    } else if (mode === 'A') {
                        measured = Math.abs(cr.current);
                    } else if (mode === 'Ω') {
                        // Ohmmeter: compute equivalent resistance between probes
                        // by building a conductance network (works without battery)
                        const nP = cr.nodeP, nN = cr.nodeN;
                        if (nP >= 0 && nN >= 0 && nP !== nN) {
                            // Build conductance adjacency (exclude self)
                            const nodes = new Set();
                            const edges = [];
                            result.components.forEach(other => {
                                if (other === cr) return;
                                if (other.nodeP < 0 || other.nodeN < 0 || other.nodeP === other.nodeN) return;
                                let R;
                                if (isSource(other.comp)) {
                                    // For batteries: use internal resistance
                                    const otmpl = other.tmpl || COMPONENTS.find(t => t.id === other.comp.type);
                                    R = otmpl?.internalResistance || otmpl?.resistance || 0.01;
                                } else {
                                    R = other.comp.currentResistance;
                                }
                                if (!R || R <= 0 || R >= Infinity) return;
                                edges.push({ a: other.nodeP, b: other.nodeN, g: 1 / R });
                                nodes.add(other.nodeP); nodes.add(other.nodeN);
                            });
                            if (nodes.has(nP) && nodes.has(nN)) {
                                // Build Y matrix, inject 1A at nP, sink at nN, solve for V → R=V/1
                                const nodeArr = [...nodes];
                                const idx = {}; nodeArr.forEach((n, i) => idx[n] = i);
                                const sz = nodeArr.length;
                                const Y = Array.from({length: sz}, () => Array(sz).fill(0));
                                edges.forEach(e => {
                                    const i = idx[e.a], j = idx[e.b];
                                    Y[i][i] += e.g; Y[j][j] += e.g;
                                    Y[i][j] -= e.g; Y[j][i] -= e.g;
                                });
                                // Remove nN row/col (ground ref), build reduced system
                                const ref = idx[nN];
                                const map = []; // reduced index → original index
                                for (let i = 0; i < sz; i++) if (i !== ref) map.push(i);
                                const n = map.length;
                                const A = Array.from({length: n}, (_, ri) =>
                                    map.map(ci => Y[map[ri]][ci])
                                );
                                const b = map.map(ri => nodeArr[ri] === nP ? 1 : 0); // inject 1A at nP
                                // Gauss elimination
                                for (let col = 0; col < n; col++) {
                                    let pivot = col;
                                    for (let row = col + 1; row < n; row++)
                                        if (Math.abs(A[row][col]) > Math.abs(A[pivot][col])) pivot = row;
                                    [A[col], A[pivot]] = [A[pivot], A[col]];
                                    [b[col], b[pivot]] = [b[pivot], b[col]];
                                    if (Math.abs(A[col][col]) < 1e-15) continue;
                                    for (let row = col + 1; row < n; row++) {
                                        const f = A[row][col] / A[col][col];
                                        for (let k = col; k < n; k++) A[row][k] -= f * A[col][k];
                                        b[row] -= f * b[col];
                                    }
                                }
                                // Back substitution
                                const x = Array(n).fill(0);
                                for (let i = n - 1; i >= 0; i--) {
                                    let sum = b[i];
                                    for (let j = i + 1; j < n; j++) sum -= A[i][j] * x[j];
                                    x[i] = Math.abs(A[i][i]) > 1e-15 ? sum / A[i][i] : 0;
                                }
                                // V at nP = R_eq (since I=1A, R=V/I=V)
                                const pIdx = map.indexOf(idx[nP]);
                                if (pIdx >= 0) measured = Math.abs(x[pIdx]);
                            }
                        }
                    }
                    c._vmProcessed = true;
                    const threshold = mode === 'A' ? 1e-7 : mode === 'Ω' ? EL.SIM.MIN_RESISTANCE : EL.SIM.MIN_VOLTAGE;
                    if (measured > threshold) {
                        const vmIndicator = el.querySelector('.vm-indicator');
                        if (vmIndicator) vmIndicator.style.fill = '#22c55e';
                        el.classList.add('vm-active');
                        const changeSig = mode === 'Ω'
                            ? Math.abs(measured - (c._vmTarget || 0)) > measured * 0.02  // 2% change
                            : Math.abs(measured - (c._vmTarget || 0)) > (mode === 'A' ? EL.SIM.MIN_CURRENT : 0.01);
                        if (changeSig) {
                            mmAnimate(c, el, measured, mode);
                        } else if (!c._vmAnimId) {
                            mmUpdateDisplay(el, measured, mode);
                            c._vmDisplayV = measured;
                            c._vmTarget = measured;
                        }
                    } else if ((c._vmTarget || 0) > threshold) {
                        mmAnimate(c, el, 0, mode);
                    }
                    return;
                }

                if (amps < EL.SIM.MIN_CURRENT) return;

                // AC-only check: must be on AC domain with valid voltage
                if (tmpl && tmpl.acOnly) {
                    const onAC = isOnACDomain(cr);
                    const acV = getACVoltage(cr);
                    if (!onAC || acV < 200) {
                        el.classList.add('ac-no-inverter');
                        let badge = el.querySelector('.no-ac-badge');
                        if (!badge) { badge = document.createElement('div'); badge.className = 'no-ac-badge'; el.appendChild(badge); }
                        if (!onAC) badge.textContent = CZ.t('simNoAC');
                        else if (nodeDomain[cr.nodeP] === 'DC_UNDERVOLT' || nodeDomain[cr.nodeN] === 'DC_UNDERVOLT') badge.textContent = CZ.t('simInputLow');
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
                        lpBadge.textContent = `${CZ.t('simPowerLow')} (${srcPower}W < ${loadPower}W)`;
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
                        // Dynamic gradient color cycling — updates ledGlowRGB stop-colors
                        if (!c._rgbAnimId) {
                            const grad = document.getElementById('ledGlowRGB');
                            if (grad) {
                                const stops = grad.querySelectorAll('stop');
                                const tick = () => {
                                    if (!el.classList.contains('led-rgb-active')) {
                                        c._rgbAnimId = null;
                                        return;
                                    }
                                    const hue = (Date.now() / 30) % 360;
                                    if (stops[0]) stops[0].setAttribute('stop-color', `hsl(${hue}, 100%, 85%)`);
                                    if (stops[1]) stops[1].setAttribute('stop-color', `hsl(${hue}, 95%, 55%)`);
                                    if (stops[2]) stops[2].setAttribute('stop-color', `hsl(${hue}, 90%, 30%)`);
                                    // Sync drop-shadow glow color
                                    if (bulbEl) bulbEl.style.filter = `drop-shadow(0 0 ${glowSize}px hsla(${hue}, 100%, 55%, ${glowAlpha}))${vi > 0.75 ? ` brightness(${(1 + vi * 0.3).toFixed(1)})` : ''}`;
                                    c._rgbAnimId = requestAnimationFrame(tick);
                                };
                                c._rgbAnimId = requestAnimationFrame(tick);
                            }
                        }
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
                    const hasBattery = result.components.some(x => x.comp.type.startsWith('battery') && Math.abs(x.current) > EL.SIM.MIN_CURRENT);
                    el.classList.add('scc-active');
                    if (isProtecting) el.classList.add('scc-protecting');
                    let badge = el.querySelector('.scc-status');
                    if (!badge) { badge = document.createElement('div'); badge.className = 'scc-status'; el.appendChild(badge); }
                    badge.textContent = isProtecting
                        ? (hasBattery ? `${CZ.t('simProtect')} ${(amps*1000).toFixed(0)}mA` : `${CZ.t('simLimit')} ${(amps*1000).toFixed(0)}mA`)
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
                    const fmt = EL.Units.autoFormat(pReal, 'W');
                    pBadge.textContent = `${fmt.val}${fmt.unit}`;
                }
            });
        }

        // ── Handle disconnected multimeters (not in MNA results) ──
        CZ.deployed.forEach(c => {
            if (!c.type.includes('meter')) return;
            if (c._vmProcessed) { c._vmProcessed = false; return; }
            const el = document.getElementById(c.id);
            if (!el) return;
            const mode = c.mmMode || 'V';
            if ((c._vmTarget || 0) > 0.01) {
                mmAnimate(c, el, 0, mode);
            } else if (!c._vmAnimId) {
                c._vmTarget = 0;
                c._vmDisplayV = 0;
                const rdg = el.querySelector('.vm-reading');
                if (rdg) { rdg.textContent = '0.00'; rdg.setAttribute('fill', '#22c55e'); }
                el.querySelectorAll('.vm-badge').forEach(b => b.remove());
            }
        });

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
