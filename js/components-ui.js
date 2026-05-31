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
        if (comp.type === 'switch_toggle') {
            comp.isClosed = false;
            comp.currentResistance = Infinity;
            el.classList.remove('switch-closed');
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
    CZ.rotateComponent = function(compId) {
        const comp = CZ.deployed.find(c => c.id === compId);
        if (!comp) return;
        const el = document.getElementById(compId);
        if (!el) return;

        // Use cumulative rotation (always +90°) so CSS transition never goes backwards
        comp.rotation = (comp.rotation || 0) + 90;
        el.style.transform = `rotate(${comp.rotation}deg)`;

        // Show/hide rotation badge (display angle mod 360)
        const displayAngle = ((comp.rotation % 360) + 360) % 360;
        let badge = el.querySelector('.rotation-badge');
        if (displayAngle) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'rotation-badge';
                el.appendChild(badge);
            }
            badge.textContent = `${displayAngle}°`;
        } else if (badge) {
            badge.remove();
        }

        // Normalize after CSS transition completes to prevent unbounded growth
        // (270→360 animates forward, then silently resets to 0 with no visual change)
        clearTimeout(comp._rotNormTimer);
        comp._rotNormTimer = setTimeout(() => {
            comp.rotation = displayAngle;
            el.style.transition = 'none';
            el.style.transform = displayAngle ? `rotate(${displayAngle}deg)` : '';
            el.offsetHeight; // force reflow
            el.style.transition = '';
            delete comp._rotNormTimer;
        }, 180);

        CZ.renderWires();
        CZ.evaluateCircuit();
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
                const badge = document.createElement('div');
                badge.className = 'rotation-badge';
                badge.textContent = `${newComp.rotation}°`;
                el.appendChild(badge);
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
