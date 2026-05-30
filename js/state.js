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
        workspaceMode: 'select',

        // ── Undo/Redo History ──
        UNDO_MAX: 100,
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
    CZ.getSnapshot = function() {
        return JSON.stringify({
            deployed: CZ.deployed.map(c => ({
                id: c.id, type: c.type, x: c.x, y: c.y,
                isBroken: c.isBroken, isClosed: c.isClosed,
                currentResistance: c.currentResistance,
                rotation: c.rotation || 0,
                batteryLevel: c.batteryLevel,
                batteryCapacity: c.batteryCapacity
            })),
            wires: CZ.wires.map(w => ({
                c1: w.c1, i1: w.i1, c2: w.c2, i2: w.i2,
                color: w.color,
                controlPoints: w.controlPoints || CZ.getDefaultControlPoints()
            })),
            groups: CZ.groups.map(g => ({ id: g.id, members: [...g.members], label: g.label || '' })),
            counter: CZ.counter, zoom: CZ.zoom, panX: CZ.panX, panY: CZ.panY
        });
    };

    CZ.applySnapshot = function(json) {
        const state = JSON.parse(json);
        // Clear current DOM
        document.querySelectorAll('.board-component').forEach(el => el.remove());
        document.querySelectorAll('.group-label-badge').forEach(el => el.remove());
        CZ.deployed = []; CZ.wires = [];

        CZ.counter = state.counter || 0;
        CZ.zoom = state.zoom || 1;
        CZ.panX = state.panX || 0;
        CZ.panY = state.panY || 0;
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
                isBroken: saved.isBroken || false,
                rotation: saved.rotation || 0,
                x: saved.x, y: saved.y,
                terminals: JSON.parse(JSON.stringify(tmpl.terminals))
            };
            if (tmpl.capacityWh) {
                comp.batteryCapacity = tmpl.capacityWh;
                comp.batteryLevel = saved.batteryLevel ?? tmpl.capacityWh;
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
            if (comp.isBroken) {
                el.classList.add('comp-broken');
                if (comp.type.startsWith('led_') || comp.type === 'bulb') el.classList.add('led-broken');
                if (comp.type === 'fuse') el.classList.add('fuse-blown');
            }
            if (comp.isClosed && comp.type === 'switch_toggle') el.classList.add('switch-closed');
            if (comp.rotation) {
                el.style.transform = `rotate(${comp.rotation}deg)`;
                const badge = document.createElement('div');
                badge.className = 'rotation-badge';
                badge.textContent = `${comp.rotation}°`;
                el.appendChild(badge);
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
        document.getElementById('btn-undo').disabled = CZ.undoStack.length === 0;
        document.getElementById('btn-redo').disabled = CZ.redoStack.length === 0;
    };

    CZ.saveState = function() {
        if (CZ.isRestoring) return; // don't save during undo/redo
        try {
            const snap = CZ.getSnapshot();
            // Avoid pushing duplicate consecutive states
            if (CZ.undoStack.length > 0 && CZ.undoStack[CZ.undoStack.length - 1] === snap) return;
            CZ.undoStack.push(snap);
            if (CZ.undoStack.length > CZ.UNDO_MAX) CZ.undoStack.shift();
            CZ.redoStack = []; // any new action clears redo
            CZ.updateUndoRedoButtons();
            localStorage.setItem(STORAGE_KEY, snap);
        } catch (e) { /* quota exceeded, silently fail */ }
    };

    // Save view-only changes (zoom/pan) without pushing to undo stack
    CZ.persistView = function() {
        try {
            localStorage.setItem(STORAGE_KEY, CZ.getSnapshot());
        } catch (e) { /* silently fail */ }
    };

    CZ.performUndo = function() {
        if (CZ.undoStack.length === 0) return;
        CZ.redoStack.push(CZ.getSnapshot()); // save current state to redo
        const snap = CZ.undoStack.pop();
        CZ.isRestoring = true;
        CZ.applySnapshot(snap);
        CZ.isRestoring = false;
        CZ.updateUndoRedoButtons();
        try { localStorage.setItem(STORAGE_KEY, snap); } catch(e) {}
    };

    CZ.performRedo = function() {
        if (CZ.redoStack.length === 0) return;
        CZ.undoStack.push(CZ.getSnapshot()); // save current state to undo
        const snap = CZ.redoStack.pop();
        CZ.isRestoring = true;
        CZ.applySnapshot(snap);
        CZ.isRestoring = false;
        CZ.updateUndoRedoButtons();
        try { localStorage.setItem(STORAGE_KEY, snap); } catch(e) {}
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
                    isBroken: saved.isBroken || false,
                    rotation: saved.rotation || 0,
                    x: saved.x, y: saved.y,
                    terminals: JSON.parse(JSON.stringify(tmpl.terminals))
                };

                // Restore battery level from saved state
                if (tmpl.capacityWh) {
                    comp.batteryCapacity = tmpl.capacityWh;
                    comp.batteryLevel = saved.batteryLevel ?? tmpl.capacityWh;
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

                // Restore visual states
                if (comp.isBroken) {
                    el.classList.add('comp-broken');
                    if (comp.type.startsWith('led_') || comp.type === 'bulb') el.classList.add('led-broken');
                    if (comp.type === 'fuse') el.classList.add('fuse-blown');
                }
                if (comp.isClosed && comp.type === 'switch_toggle') {
                    el.classList.add('switch-closed');
                }
                // Restore rotation
                if (comp.rotation) {
                    el.style.transform = `rotate(${comp.rotation}deg)`;
                    const badge = document.createElement('div');
                    badge.className = 'rotation-badge';
                    badge.textContent = `${comp.rotation}°`;
                    el.appendChild(badge);
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
