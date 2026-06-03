// CZElectro — State Module (Foundation)
// Creates the global CZ namespace and all shared state variables.
(function() {
    'use strict';

    const STORAGE_KEY = 'czelectro_state';

    const CZ = window.CZ = {
        // ── State ──
        deployed: [],
        wires: [],
        counter: 0,
        zoom: 1,
        panX: 0,
        panY: 0,
        isDragging: false,
        dragEl: null,
        dragOX: 0,
        dragOY: 0,
        dragStartX: 0,
        dragStartY: 0,
        dragMoved: false,
        activeTerm: null,
        showGrid: true,
        isPanning: false,
        panStartX: 0,
        panStartY: 0,
        panStartPX: 0,
        panStartPY: 0,
        activeWireDrag: null,
        selRect: null,
        selStartX: 0,
        selStartY: 0,
        selectedIds: new Set(),
        selectedHandles: new Set(),
        GRID: 10,
        DRAG_THRESHOLD: 5,
        isMuted: false,
        _touchGesture: false,
        workspaceMode: 'select',

        // ── Undo/Redo History ──
        UNDO_MAX: 30,
        undoStack: [],
        redoStack: [],
        isRestoring: false,

        // ── Groups ──
        groups: [],
        groupCounter: 0,

        // ── Battery Simulation State ──
        simSpeed: 0,
        simInterval: null,
        simElapsedMin: 0,
        simTotalLoadW: 0,
        simTotalSrcW: 0,

        // ── Sound Engine (Web Audio API) ──
        audioCtx: null,
        activeSounds: {},

        // ── DOM refs (populated by initDOM) ──
        listEl: null,
        ws: null,
        wCont: null,
        wiresG: null,
        tmpWire: null,
        wireLayer: null,
        gridCanvas: null,
        tooltip: null
    };

    // ── DOM Initialization ──
    CZ.initDOM = function() {
        CZ.listEl = document.getElementById('component-list');
        CZ.ws = document.getElementById('workspace');
        CZ.wCont = document.getElementById('workspace-container');
        CZ.wiresG = document.getElementById('wires-group');
        CZ.tmpWire = document.getElementById('temp-wire');
        CZ.wireLayer = document.getElementById('wire-layer');
        CZ.gridCanvas = document.getElementById('grid-canvas');
        CZ.tooltip = document.getElementById('tooltip');
    };

    // ── Snapshot helpers for undo/redo ──
    // NOTE: zoom/pan are excluded — undo should only affect data, not viewport.
    CZ.getSnapshot = function() {
        return JSON.stringify({
            deployed: CZ.deployed.map(c => ({
                id: c.id, type: c.type, x: c.x, y: c.y,
                isBroken: c.isBroken, isClosed: c.isClosed,
                isPoweredOff: c.isPoweredOff || false,
                mmMode: c.mmMode || undefined,
                currentResistance: c.currentResistance,
                rotation: c.rotation || 0,
                batteryLevel: c.batteryLevel,
                batteryCapacity: c.batteryCapacity,
                atsMode: c.atsMode || undefined,
                kwhTotal: c._kwhTotal || undefined
            })),
            wires: CZ.wires.map(w => ({
                c1: w.c1, i1: w.i1, c2: w.c2, i2: w.i2,
                color: w.color,
                controlPoints: w.controlPoints || CZ.getDefaultControlPoints()
            })),
            groups: CZ.groups.map(g => ({ id: g.id, members: [...g.members], label: g.label || '' })),
            counter: CZ.counter
        });
    };

    // Full snapshot including viewport — for localStorage persistence only
    CZ.getFullSnapshot = function() {
        const base = JSON.parse(CZ.getSnapshot());
        base.zoom = CZ.zoom;
        base.panX = CZ.panX;
        base.panY = CZ.panY;
        return JSON.stringify(base);
    };

    CZ.applySnapshot = function(json) {
        const state = JSON.parse(json);
        // Clear current DOM
        document.querySelectorAll('.board-component').forEach(el => el.remove());
        document.querySelectorAll('.group-label-badge').forEach(el => el.remove());
        CZ.deployed = []; CZ.wires = [];

        CZ.counter = state.counter || 0;
        // Only restore viewport if present (full snapshot from localStorage)
        if (state.zoom !== undefined) CZ.zoom = state.zoom;
        if (state.panX !== undefined) CZ.panX = state.panX;
        if (state.panY !== undefined) CZ.panY = state.panY;
        CZ.groups = (state.groups || []).map(g => ({ id: g.id, members: [...g.members], label: g.label || '' }));

        // Rebuild components
        state.deployed.forEach(saved => {
            const tmpl = COMPONENTS.find(t => t.id === saved.type);
            if (!tmpl) return;
            const el = document.createElement('div');
            el.className = 'board-component';
            el.id = saved.id;
            el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${saved.x}px;top:${saved.y}px;`;
            el.innerHTML = tmpl.svg;

            const comp = {
                id: saved.id, type: saved.type, voltage: tmpl.voltage,
                baseResistance: tmpl.resistance,
                currentResistance: saved.currentResistance ?? tmpl.resistance,
                maxCurrent: tmpl.maxCurrent || null,
                glowGradient: tmpl.glowGradient || null,
                isClosed: saved.isClosed || false,
                isPoweredOff: saved.isPoweredOff || false,
                mmMode: saved.mmMode || (saved.type === 'ammeter' ? 'A' : 'V'),
                isBroken: saved.isBroken || false,
                atsMode: saved.atsMode || undefined,
                rotation: saved.rotation || 0,
                x: saved.x, y: saved.y,
                terminals: JSON.parse(JSON.stringify(tmpl.terminals))
            };
            if (tmpl.capacityWh) {
                comp.batteryCapacity = tmpl.capacityWh;
                comp.batteryLevel = saved.batteryLevel ?? tmpl.capacityWh;
            }
            // Restore kWh meter accumulated reading
            if (saved.kwhTotal) {
                comp._kwhTotal = saved.kwhTotal;
                const kwhLabel = el.querySelector('.kwh-reading');
                if (kwhLabel) kwhLabel.textContent = saved.kwhTotal.toFixed(2);
            }
            comp.terminals.forEach((term, idx) => {
                const tEl = document.createElement('div');
                tEl.className = 'terminal';
                tEl.style.left = `${term.x - 8}px`;
                tEl.style.top = `${term.y - 8}px`;
                tEl.dataset.cid = saved.id;
                tEl.dataset.tidx = idx;
                tEl.dataset.label = term.label || '';
                el.appendChild(tEl);
            });
            // Apply rotation FIRST — before any visual classes (broken/active/etc.)
            // This prevents broken-effect animations from flashing at 0° on restore
            if (comp.rotation) {
                el.style.transform = `rotate(${comp.rotation}deg)`;
            }
            if (comp.isBroken) {
                el.classList.add('comp-broken', 'restoring');
                if (comp.type.startsWith('led_') || comp.type === 'bulb') el.classList.add('led-broken');
                if (comp.type === 'fuse') el.classList.add('fuse-blown');
                const brokenBadge = document.createElement('div');
                brokenBadge.className = 'broken-badge';
                brokenBadge.textContent = `⛔ ${CZ.t('ctxBroken')}`;
                el.appendChild(brokenBadge);
                // Remove restoring flag after paint so future breaks still animate
                requestAnimationFrame(() => el.classList.remove('restoring'));
            }
            if (comp.isClosed && comp.type === 'switch_toggle') el.classList.add('switch-closed');
            // Restore MCB visual state
            if (comp.type.startsWith('mcb_') && comp.isClosed === false) {
                const toggle = el.querySelector('.mcb-toggle');
                const label = el.querySelector('.mcb-label');
                const indicator = el.querySelector('.mcb-indicator');
                if (toggle) { toggle.setAttribute('fill', '#6b7280'); toggle.setAttribute('y', '35'); }
                if (label) { label.textContent = 'OFF'; label.setAttribute('y', '54'); }
                if (indicator) indicator.setAttribute('fill', '#6b7280');
            }
            // Restore power on/off badge for all toggleable components
            const RESTORE_TOGGLEABLE = [
                'tv_led','fridge','pump_125','pump_250','lamp_30w',
                'iron','blender','ricecooker','ac_05pk','ac_1pk',
                'computer','motor_dc','buzzer','speaker','bulb',
                'led_red','led_green','led_blue','led_white','led_rgb',
                'pln_source'
            ];
            if (RESTORE_TOGGLEABLE.includes(comp.type)) {
                if (comp.isPoweredOff) {
                    el.classList.add('powered-off');
                    if (comp.type === 'pln_source') {
                        const plnLed = el.querySelector('.pln-led');
                        const plnVolt = el.querySelector('.pln-voltage');
                        if (plnLed) plnLed.setAttribute('fill', '#ef4444');
                        if (plnVolt) { plnVolt.textContent = 'OFF'; plnVolt.setAttribute('fill', '#ef4444'); }
                    }
                }
                const pwrBadge = document.createElement('div');
                pwrBadge.className = 'power-on-off-badge' + (comp.isPoweredOff ? ' off' : '');
                pwrBadge.textContent = comp.isPoweredOff ? '⏻ OFF' : '⏻ ON';
                el.appendChild(pwrBadge);
            }
            // Restore multimeter mode visual
            if (comp.type === 'voltmeter' && comp.mmMode && comp.mmMode !== 'V') {
                const modeColor = { V: '#22c55e', A: '#ef4444', 'Ω': '#f59e0b' };
                const modeLabel = { V: 'VOLTAGE', A: 'CURRENT', 'Ω': 'RESIST' };
                const modeArrowAngle = { V: 0, A: 120, 'Ω': 240 };
                const m = comp.mmMode;
                const arrow = el.querySelector('.mm-dial-arrow');
                if (arrow) arrow.setAttribute('transform', `rotate(${modeArrowAngle[m]}, 40, 58)`);
                const mLbl = el.querySelector('.mm-mode-label');
                if (mLbl) { mLbl.textContent = modeLabel[m]; mLbl.setAttribute('fill', modeColor[m]); }
                ['V','A','Ω'].forEach(mode => {
                    const cls = mode === 'V' ? '.mm-label-v' : mode === 'A' ? '.mm-label-a' : '.mm-label-o';
                    const lbl = el.querySelector(cls);
                    if (lbl) lbl.setAttribute('fill', mode === m ? modeColor[mode] : '#6b7280');
                });
                const unt = el.querySelector('.vm-unit');
                if (unt) { unt.textContent = m; unt.setAttribute('fill', modeColor[m]); }
            }
            // Mark grouped components
            const grp = CZ.groups.find(g => g.members.includes(saved.id));
            if (grp) el.classList.add('grouped');

            CZ.ws.appendChild(el);
            CZ.deployed.push(comp);
        });

        // Rebuild wires
        state.wires.forEach(saved => {
            let cps = saved.controlPoints;
            if (!cps && saved.bend) {
                cps = [
                    { x: saved.bend.x * 0.5, y: saved.bend.y * 0.5 },
                    { x: saved.bend.x, y: saved.bend.y },
                    { x: saved.bend.x * 0.5, y: saved.bend.y * 0.5 }
                ];
            }
            CZ.wires.push({
                c1: saved.c1, i1: saved.i1,
                c2: saved.c2, i2: saved.i2,
                color: saved.color || '#94a3b8',
                energized: false,
                controlPoints: cps || CZ.getDefaultControlPoints()
            });
        });

        CZ.applyTransform();
        CZ.renderWires();
        CZ.renderGroupLabels();
        CZ.evaluateCircuit();
    };

    CZ.updateUndoRedoButtons = function() {
        document.getElementById('btn-undo').disabled = CZ.undoStack.length < 2;
        document.getElementById('btn-redo').disabled = CZ.redoStack.length === 0;
    };

    // ── Save state after an action ──
    // Stack model: undoStack top = current state.
    // Undo pops current → redo, applies previous (peek).
    CZ.saveState = function() {
        if (CZ.isRestoring) return; // don't save during undo/redo
        try {
            const snap = CZ.getSnapshot();
            // Avoid duplicate consecutive states
            if (CZ.undoStack.length > 0 && CZ.undoStack[CZ.undoStack.length - 1] === snap) return;
            CZ.undoStack.push(snap);
            if (CZ.undoStack.length > CZ.UNDO_MAX) CZ.undoStack.shift();
            CZ.redoStack = []; // any new action clears redo
            CZ.updateUndoRedoButtons();
            localStorage.setItem(STORAGE_KEY, CZ.getFullSnapshot());
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                console.warn('CZElectro: localStorage quota exceeded, state not persisted');
                if (typeof CZ.showToast === 'function') CZ.showToast('⚠️ Storage penuh! State tidak tersimpan.', 'warning');
            }
        }
    };

    // Save view-only changes (zoom/pan) without pushing to undo stack
    CZ.persistView = function() {
        try {
            localStorage.setItem(STORAGE_KEY, CZ.getFullSnapshot());
        } catch (e) { /* silently fail */ }
    };

    CZ.performUndo = function() {
        if (CZ.undoStack.length < 2) return; // need current + at least one previous
        CZ.redoStack.push(CZ.undoStack.pop()); // move current state to redo
        const snap = CZ.undoStack[CZ.undoStack.length - 1]; // peek previous (keep as new "current")
        CZ.isRestoring = true;
        CZ.applySnapshot(snap);
        CZ.isRestoring = false;
        CZ.updateUndoRedoButtons();
        try { localStorage.setItem(STORAGE_KEY, CZ.getFullSnapshot()); } catch(e) {}
    };

    CZ.performRedo = function() {
        if (CZ.redoStack.length === 0) return;
        const snap = CZ.redoStack.pop();
        CZ.undoStack.push(snap); // push to undo as new "current"
        CZ.isRestoring = true;
        CZ.applySnapshot(snap);
        CZ.isRestoring = false;
        CZ.updateUndoRedoButtons();
        try { localStorage.setItem(STORAGE_KEY, CZ.getFullSnapshot()); } catch(e) {}
    };

    CZ.restoreState = function() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const state = JSON.parse(raw);
            if (!state.deployed || !state.wires) return false;

            CZ.counter = state.counter || 0;
            CZ.zoom = state.zoom || 1;
            CZ.panX = state.panX || 0;
            CZ.panY = state.panY || 0;

            // Restore groups
            CZ.groups = (state.groups || []).map(g => ({ id: g.id, members: [...g.members], label: g.label || '' }));
            // Restore groupCounter
            CZ.groups.forEach(g => {
                const num = parseInt(g.id.replace('grp_', ''));
                if (num > CZ.groupCounter) CZ.groupCounter = num;
            });

            // Rebuild components
            state.deployed.forEach(saved => {
                const tmpl = COMPONENTS.find(t => t.id === saved.type);
                if (!tmpl) return;

                const el = document.createElement('div');
                el.className = 'board-component';
                el.id = saved.id;
                el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${saved.x}px;top:${saved.y}px;`;
                el.innerHTML = tmpl.svg;

                const comp = {
                    id: saved.id, type: saved.type, voltage: tmpl.voltage,
                    baseResistance: tmpl.resistance,
                    currentResistance: saved.currentResistance ?? tmpl.resistance,
                    maxCurrent: tmpl.maxCurrent || null,
                    glowGradient: tmpl.glowGradient || null,
                    isClosed: saved.isClosed || false,
                    isPoweredOff: saved.isPoweredOff || false,
                    mmMode: saved.mmMode || (saved.type === 'ammeter' ? 'A' : 'V'),
                    isBroken: saved.isBroken || false,
                    atsMode: saved.atsMode || undefined,
                    rotation: saved.rotation || 0,
                    x: saved.x, y: saved.y,
                    terminals: JSON.parse(JSON.stringify(tmpl.terminals))
                };

                // Restore battery level from saved state
                if (tmpl.capacityWh) {
                    comp.batteryCapacity = tmpl.capacityWh;
                    comp.batteryLevel = saved.batteryLevel ?? tmpl.capacityWh;
                }
                // Restore kWh meter accumulated reading
                if (saved.kwhTotal) {
                    comp._kwhTotal = saved.kwhTotal;
                    const kwhLabel = el.querySelector('.kwh-reading');
                    if (kwhLabel) kwhLabel.textContent = saved.kwhTotal.toFixed(2);
                }

                // Re-create terminals
                comp.terminals.forEach((term, idx) => {
                    const tEl = document.createElement('div');
                    tEl.className = 'terminal';
                    tEl.style.left = `${term.x - 8}px`;
                    tEl.style.top = `${term.y - 8}px`;
                    tEl.dataset.cid = saved.id;
                    tEl.dataset.tidx = idx;
                    tEl.dataset.label = term.label || '';
                    el.appendChild(tEl);
                });

                // Apply rotation FIRST — before any visual classes
                if (comp.rotation) {
                    el.style.transform = `rotate(${comp.rotation}deg)`;
                }
                // Restore visual states
                if (comp.isBroken) {
                    el.classList.add('comp-broken', 'restoring');
                    if (comp.type.startsWith('led_') || comp.type === 'bulb') el.classList.add('led-broken');
                    if (comp.type === 'fuse') el.classList.add('fuse-blown');
                    const brokenBadge = document.createElement('div');
                    brokenBadge.className = 'broken-badge';
                    brokenBadge.textContent = `⛔ ${CZ.t('ctxBroken')}`;
                    el.appendChild(brokenBadge);
                    requestAnimationFrame(() => el.classList.remove('restoring'));
                }
                if (comp.isClosed && comp.type === 'switch_toggle') {
                    el.classList.add('switch-closed');
                }
                // Restore MCB visual state
                if (comp.type.startsWith('mcb_') && comp.isClosed === false) {
                    const toggle = el.querySelector('.mcb-toggle');
                    const label = el.querySelector('.mcb-label');
                    const indicator = el.querySelector('.mcb-indicator');
                    if (toggle) { toggle.setAttribute('fill', '#6b7280'); toggle.setAttribute('y', '35'); }
                    if (label) { label.textContent = 'OFF'; label.setAttribute('y', '54'); }
                    if (indicator) indicator.setAttribute('fill', '#6b7280');
                }
                // Restore power on/off badge for all toggleable components
                const RESTORE_TOGGLEABLE2 = [
                    'tv_led','fridge','pump_125','pump_250','lamp_30w',
                    'iron','blender','ricecooker','ac_05pk','ac_1pk',
                    'computer','motor_dc','buzzer','speaker','bulb',
                    'led_red','led_green','led_blue','led_white','led_rgb',
                    'pln_source'
                ];
                if (RESTORE_TOGGLEABLE2.includes(comp.type)) {
                    if (comp.isPoweredOff) {
                        el.classList.add('powered-off');
                        if (comp.type === 'pln_source') {
                            const plnLed = el.querySelector('.pln-led');
                            const plnVolt = el.querySelector('.pln-voltage');
                            if (plnLed) plnLed.setAttribute('fill', '#ef4444');
                            if (plnVolt) { plnVolt.textContent = 'OFF'; plnVolt.setAttribute('fill', '#ef4444'); }
                        }
                    }
                    const pwrBadge = document.createElement('div');
                    pwrBadge.className = 'power-on-off-badge' + (comp.isPoweredOff ? ' off' : '');
                    pwrBadge.textContent = comp.isPoweredOff ? '⏻ OFF' : '⏻ ON';
                    el.appendChild(pwrBadge);
                }
                // Restore multimeter mode visual
                if (comp.type === 'voltmeter' && comp.mmMode && comp.mmMode !== 'V') {
                    const modeColor = { V: '#22c55e', A: '#ef4444', 'Ω': '#f59e0b' };
                    const modeLabel = { V: 'VOLTAGE', A: 'CURRENT', 'Ω': 'RESIST' };
                    const modeArrowAngle = { V: 0, A: 120, 'Ω': 240 };
                    const m = comp.mmMode;
                    const arrow = el.querySelector('.mm-dial-arrow');
                    if (arrow) arrow.setAttribute('transform', `rotate(${modeArrowAngle[m]}, 40, 58)`);
                    const mLbl = el.querySelector('.mm-mode-label');
                    if (mLbl) { mLbl.textContent = modeLabel[m]; mLbl.setAttribute('fill', modeColor[m]); }
                    ['V','A','Ω'].forEach(mode => {
                        const cls = mode === 'V' ? '.mm-label-v' : mode === 'A' ? '.mm-label-a' : '.mm-label-o';
                        const lbl = el.querySelector(cls);
                        if (lbl) lbl.setAttribute('fill', mode === m ? modeColor[mode] : '#6b7280');
                    });
                    const unt = el.querySelector('.vm-unit');
                    if (unt) { unt.textContent = m; unt.setAttribute('fill', modeColor[m]); }
                }
                // Mark grouped components
                const grp = CZ.groups.find(g => g.members.includes(saved.id));
                if (grp) el.classList.add('grouped');

                CZ.ws.appendChild(el);
                CZ.deployed.push(comp);
            });

            // Rebuild wires
            state.wires.forEach(saved => {
                // Backward compat: migrate legacy single-bend to controlPoints
                let cps = saved.controlPoints;
                if (!cps && saved.bend) {
                    cps = [
                        { x: saved.bend.x * 0.5, y: saved.bend.y * 0.5 },
                        { x: saved.bend.x, y: saved.bend.y },
                        { x: saved.bend.x * 0.5, y: saved.bend.y * 0.5 }
                    ];
                }
                CZ.wires.push({
                    c1: saved.c1, i1: saved.i1,
                    c2: saved.c2, i2: saved.i2,
                    color: saved.color || '#94a3b8',
                    energized: false,
                    controlPoints: cps || CZ.getDefaultControlPoints()
                });
            });

            CZ.applyTransform();
            CZ.renderWires();
            CZ.renderGroupLabels();
            CZ.evaluateCircuit();
            return true;
        } catch (e) {
            console.warn('CZElectro: Failed to restore state', e);
            return false;
        }
    };

})();
