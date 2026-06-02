// CZElectro — Component UI Module
// Handles: spawning, rotating, resetting, duplicating components
(function(CZ) {
    'use strict';

    // ── Spawn Component ──
    CZ.spawnComponent = function(tmplId, cx, cy) {
        const tmpl = COMPONENTS.find(t => t.id === tmplId);
        if (!tmpl) return;
        CZ.counter++;
        const uId = `c_${tmplId}_${CZ.counter}`;
        const pos = CZ.clientToWorkspace(cx, cy);
        let x = Math.round((pos.x - tmpl.width / 2) / CZ.GRID) * CZ.GRID;
        let y = Math.round((pos.y - tmpl.height / 2) / CZ.GRID) * CZ.GRID;

        const el = document.createElement('div');
        el.className = 'board-component';
        el.id = uId;
        el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${x}px;top:${y}px;`;
        el.innerHTML = tmpl.svg;

        const comp = {
            id: uId, type: tmpl.id, voltage: tmpl.voltage,
            baseResistance: tmpl.resistance, currentResistance: tmpl.resistance,
            maxCurrent: tmpl.maxCurrent || null, glowGradient: tmpl.glowGradient || null,
            isClosed: false, isBroken: false, rotation: 0, x, y,
            terminals: JSON.parse(JSON.stringify(tmpl.terminals))
        };

        comp.terminals.forEach((term, idx) => {
            const tEl = document.createElement('div');
            tEl.className = 'terminal';
            tEl.style.left = `${term.x - 8}px`;
            tEl.style.top = `${term.y - 8}px`;
            tEl.dataset.cid = uId;
            tEl.dataset.tidx = idx;
            tEl.dataset.label = term.label || '';
            el.appendChild(tEl);
        });

        CZ.ws.appendChild(el);
        // Initialize battery level if component has capacity
        const tmplCap = COMPONENTS.find(t => t.id === comp.type);
        if (tmplCap?.capacityWh) {
            comp.batteryCapacity = tmplCap.capacityWh;
            comp.batteryLevel = comp.batteryLevel ?? tmplCap.capacityWh;
        }
        // Initialize multimeter mode
        if (tmplCap?.isMultimeter) {
            comp.mmMode = 'V';
        }
        CZ.deployed.push(comp);
        // Toggleable output components start OFF (like real appliances)
        const TOGGLEABLE_TYPES = [
            'tv_led','fridge','pump_125','pump_250','lamp_30w',
            'iron','blender','ricecooker','ac_05pk','ac_1pk',
            'computer','motor_dc','buzzer','speaker','bulb',
            'led_red','led_green','led_blue','led_white','led_rgb'
        ];
        if (TOGGLEABLE_TYPES.includes(comp.type)) {
            comp.isPoweredOff = true;
            comp.currentResistance = EL.SIM.OPEN_CIRCUIT_R;
            el.classList.add('powered-off');
            const pwrBadge = document.createElement('div');
            pwrBadge.className = 'power-on-off-badge off';
            pwrBadge.textContent = '⏻ OFF';
            el.appendChild(pwrBadge);
        }
        // PLN source also starts OFF
        if (comp.type === 'pln_source') {
            comp.isPoweredOff = true;
            comp.currentResistance = EL.SIM.OPEN_CIRCUIT_R;
            const plnLed = el.querySelector('.pln-led');
            const plnVolt = el.querySelector('.pln-voltage');
            if (plnLed) plnLed.setAttribute('fill', '#ef4444');
            if (plnVolt) { plnVolt.textContent = 'OFF'; plnVolt.setAttribute('fill', '#ef4444'); }
            const pwrBadge = document.createElement('div');
            pwrBadge.className = 'power-on-off-badge off';
            pwrBadge.textContent = '⏻ OFF';
            el.appendChild(pwrBadge);
        }
        // MCB starts ON (closed circuit) — matches SVG default visual
        if (comp.type.startsWith('mcb_')) {
            comp.isClosed = true;
            comp.currentResistance = tmplCap ? tmplCap.resistance : 0.01;
        }
        CZ.updateStatus();
        return comp;
    };

    // ── Reset a broken component to original state ──
    CZ.resetComponent = function(compId) {
        const comp = CZ.deployed.find(c => c.id === compId);
        if (!comp) return;
        const el = document.getElementById(compId);
        if (!el) return;
        const tmpl = COMPONENTS.find(t => t.id === comp.type);
        if (!tmpl) return;

        // Restore electrical properties
        comp.isBroken = false;
        comp.currentResistance = tmpl.resistance;
        el.classList.remove('comp-broken', 'led-broken', 'fuse-blown', 'restoring');
        const brokenBadge = el.querySelector('.broken-badge');
        if (brokenBadge) brokenBadge.remove();
        if (comp.type === 'switch_toggle') {
            comp.isClosed = false;
            comp.currentResistance = Infinity;
            el.classList.remove('switch-closed');
        }
        if (comp.type === 'timer_555') {
            if (comp._timerInterval) { clearInterval(comp._timerInterval); comp._timerInterval = null; }
            comp.isClosed = false;
            comp.currentResistance = tmpl.resistance;
        }
        // MCB resets to ON (closed)
        if (comp.type.startsWith('mcb_')) {
            comp.isClosed = true;
            comp.currentResistance = tmpl.resistance;
            el.classList.remove('mcb-tripped');
        }

        // Restore visual — re-inject SVG
        el.innerHTML = tmpl.svg;
        el.className = 'board-component';
        el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${comp.x}px;top:${comp.y}px;`;
        // Re-apply rotation if component was rotated
        if (comp.rotation) {
            el.style.transform = `rotate(${comp.rotation}deg)`;
        }

        // Re-create terminals
        comp.terminals = JSON.parse(JSON.stringify(tmpl.terminals));
        comp.terminals.forEach((term, idx) => {
            const tEl = document.createElement('div');
            tEl.className = 'terminal';
            tEl.style.left = `${term.x - 8}px`;
            tEl.style.top = `${term.y - 8}px`;
            tEl.dataset.cid = compId;
            tEl.dataset.tidx = idx;
            tEl.dataset.label = term.label || '';
            el.appendChild(tEl);
        });

        // Flash green to confirm reset
        el.style.outline = '2px solid #4ade80';
        el.style.outlineOffset = '4px';
        setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 600);

        CZ.evaluateCircuit();
    };

    // ── Rotate a component by 90 degrees ──
    // direction: +90 (CW, default) or -90 (CCW)
    CZ.rotateComponent = function(compId, direction) {
        const deg = direction || 90;
        const comp = CZ.deployed.find(c => c.id === compId);
        if (!comp) return;
        const el = document.getElementById(compId);
        if (!el) return;

        // Use cumulative rotation so CSS transition never goes backwards
        comp.rotation = (comp.rotation || 0) + deg;

        // Disable CSS transition so rotation + wire render happen simultaneously
        el.style.transition = 'none';
        el.style.transform = `rotate(${comp.rotation}deg)`;
        el.offsetHeight; // force reflow — apply rotation instantly

        // Render wires immediately with new rotation value
        CZ.renderWires();
        CZ.evaluateCircuit();

        // Re-enable transition for future interactions (drag, etc.)
        el.style.transition = '';

        const displayAngle = ((comp.rotation % 360) + 360) % 360;

        // Normalize to prevent unbounded growth
        clearTimeout(comp._rotNormTimer);
        comp._rotNormTimer = setTimeout(() => {
            comp.rotation = displayAngle;
            el.style.transition = 'none';
            el.style.transform = displayAngle ? `rotate(${displayAngle}deg)` : '';
            el.offsetHeight; // force reflow
            el.style.transition = '';
            delete comp._rotNormTimer;
        }, 50);
    };

    // ── Helper: immediately finalize any pending group rotation animation ──
    CZ._finalizeGroupRot = function() {
        if (!CZ._groupRotData) return;
        clearTimeout(CZ._groupRotTimer);
        CZ._groupRotData.entries.forEach(({ comp }) => {
            const normalized = ((comp.rotation % 360) + 360) % 360;
            comp.rotation = normalized;
            const el = document.getElementById(comp.id);
            if (el) {
                el.style.transition = 'none';
                el.style.left = comp.x + 'px';
                el.style.top = comp.y + 'px';
                el.style.transform = normalized ? `rotate(${normalized}deg)` : '';
                el.offsetHeight;
                el.style.transition = '';
            }
        });
        CZ.renderWires();
        CZ.renderGroupLabels();
        CZ._groupRotData = null;
        CZ._groupRotTimer = null;
    };

    // ── Rotate entire selection as a group around the selection center ──
    CZ.rotateSelection = function(direction) {
        const deg = direction || 90;
        if (CZ.selectedIds.size === 0) return;

        // Single component — rotate in-place (animated)
        if (CZ.selectedIds.size === 1) {
            const cid = CZ.selectedIds.values().next().value;
            CZ.rotateComponent(cid, deg);
            CZ.saveState();
            return;
        }

        // Finalize any pending group rotation so positions are clean
        CZ._finalizeGroupRot();

        // Gather selected components and compute bounding box
        const entries = [];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        CZ.selectedIds.forEach(cid => {
            const comp = CZ.deployed.find(c => c.id === cid);
            if (!comp) return;
            const tmpl = COMPONENTS.find(t => t.id === comp.type);
            if (!tmpl) return;
            entries.push({ comp, tmpl });
            minX = Math.min(minX, comp.x);
            minY = Math.min(minY, comp.y);
            maxX = Math.max(maxX, comp.x + tmpl.width);
            maxY = Math.max(maxY, comp.y + tmpl.height);
        });

        if (entries.length === 0) return;

        // Pivot = center of bounding box
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const ANIM_MS = 200;
        const EASE = 'cubic-bezier(0.25, 0.8, 0.25, 1)';

        // Store entries for finalize helper
        CZ._groupRotData = { entries };

        // ── Phase 1: Animate components via transform (keep old left/top) ──
        entries.forEach(({ comp, tmpl }) => {
            const oldX = comp.x, oldY = comp.y;
            const compCX = comp.x + tmpl.width / 2;
            const compCY = comp.y + tmpl.height / 2;

            // Rotate around pivot: CW (+90) or CCW (-90)
            const rad = (deg * Math.PI) / 180;
            const cos = Math.round(Math.cos(rad));
            const sin = Math.round(Math.sin(rad));
            const newCX = cx + cos * (compCX - cx) - sin * (compCY - cy);
            const newCY = cy + sin * (compCX - cx) + cos * (compCY - cy);

            // Store final position — no grid snapping so rotation is perfectly
            // reversible (4× 90° returns to exact original position, zero drift)
            comp.x = newCX - tmpl.width / 2;
            comp.y = newCY - tmpl.height / 2;

            const cumulative = (comp.rotation || 0) + deg;
            const normalized = ((cumulative % 360) + 360) % 360;
            comp.rotation = cumulative;

            const dx = comp.x - oldX;
            const dy = comp.y - oldY;

            const el = document.getElementById(comp.id);
            if (el) {
                el.style.transition = `transform ${ANIM_MS}ms ${EASE}`;
                el.style.transform = `translate(${dx}px, ${dy}px) rotate(${cumulative}deg)`;
            }
        });

        // ── Phase 2: Animate wire SVG groups around the same pivot ──
        CZ.wires.forEach((w, idx) => {
            if (!CZ.selectedIds.has(w.c1) || !CZ.selectedIds.has(w.c2)) return;
            const g = CZ.wiresG.querySelector(`g.wire-group[data-widx="${idx}"]`);
            if (g) {
                g.style.transformOrigin = `${cx}px ${cy}px`;
                g.style.transition = `transform ${ANIM_MS}ms ${EASE}`;
                g.style.transform = `rotate(${deg}deg)`;
            }
            if (w.controlPoints) {
                if (deg > 0) {
                    // CW: (x, y) → (-y, x)
                    w.controlPoints = w.controlPoints.map(cp => ({ x: -cp.y, y: cp.x }));
                } else {
                    // CCW: (x, y) → (y, -x)
                    w.controlPoints = w.controlPoints.map(cp => ({ x: cp.y, y: -cp.x }));
                }
            }
        });

        // ── Phase 3: Finalize after animation completes ──
        CZ._groupRotTimer = setTimeout(() => {
            CZ._finalizeGroupRot();
            CZ.evaluateCircuit();
        }, ANIM_MS + 20);

        CZ.saveState();
    };

    // ── Duplicate selected components ──
    CZ.duplicateSelected = function() {
        if (CZ.selectedIds.size === 0) return;
        const newIds = new Set();
        const idMap = {};
        CZ.selectedIds.forEach(cid => {
            const comp = CZ.deployed.find(c => c.id === cid);
            if (!comp) return;
            const tmpl = COMPONENTS.find(t => t.id === comp.type);
            if (!tmpl) return;
            CZ.counter++;
            const newId = `c_${comp.type}_${CZ.counter}`;
            idMap[cid] = newId;

            const el = document.createElement('div');
            el.className = 'board-component';
            el.id = newId;
            const nx = comp.x + 40, ny = comp.y + 40;
            el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${nx}px;top:${ny}px;`;
            el.innerHTML = tmpl.svg;

            const newComp = {
                id: newId, type: comp.type, voltage: tmpl.voltage,
                baseResistance: tmpl.resistance, currentResistance: tmpl.resistance,
                maxCurrent: tmpl.maxCurrent || null, glowGradient: tmpl.glowGradient || null,
                isClosed: false, isBroken: false, rotation: comp.rotation || 0, x: nx, y: ny,
                terminals: JSON.parse(JSON.stringify(tmpl.terminals))
            };
            // Copy battery properties from source
            if (tmpl.capacityWh) {
                newComp.batteryCapacity = tmpl.capacityWh;
                newComp.batteryLevel = comp.batteryLevel ?? tmpl.capacityWh;
            }
            // Apply rotation CSS if source was rotated
            if (newComp.rotation) {
                el.style.transform = `rotate(${newComp.rotation}deg)`;
            }
            newComp.terminals.forEach((term, idx) => {
                const tEl = document.createElement('div');
                tEl.className = 'terminal';
                tEl.style.left = `${term.x - 8}px`;
                tEl.style.top = `${term.y - 8}px`;
                tEl.dataset.cid = newId;
                tEl.dataset.tidx = idx;
                tEl.dataset.label = term.label || '';
                el.appendChild(tEl);
            });
            CZ.ws.appendChild(el);
            CZ.deployed.push(newComp);
            newIds.add(newId);
        });
        // Duplicate wires between selected components (snapshot to avoid infinite loop)
        const origWires = [...CZ.wires];
        origWires.forEach(w => {
            if (idMap[w.c1] && idMap[w.c2]) {
                CZ.wires.push({
                    c1: idMap[w.c1], i1: w.i1,
                    c2: idMap[w.c2], i2: w.i2,
                    color: w.color, energized: false,
                    controlPoints: (w.controlPoints || CZ.getDefaultControlPoints()).map(cp => ({ x: cp.x, y: cp.y }))
                });
            }
        });
        // Select new components
        CZ.selectedIds.clear();
        document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
        newIds.forEach(id => {
            CZ.selectedIds.add(id);
            document.getElementById(id)?.classList.add('selected');
        });
        // Duplicate groups: if all members of a group were selected, create a new group with mapped IDs
        CZ.groups.forEach(g => {
            const allInSelection = g.members.every(mid => idMap[mid]);
            if (allInSelection) {
                CZ.groupCounter++;
                const newMembers = g.members.map(mid => idMap[mid]);
                CZ.groups.push({
                    id: `grp_${CZ.groupCounter}`,
                    members: newMembers,
                    label: g.label || ''
                });
                newMembers.forEach(mid => {
                    document.getElementById(mid)?.classList.add('grouped');
                });
            }
        });
        CZ.renderWires(); CZ.evaluateCircuit();
        CZ.renderGroupLabels();
    };

})(window.CZ);
