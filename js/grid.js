/**
 * CZElectro — Grid Drawing, Zoom/Pan, and Transform Module
 * Handles grid canvas rendering, zoom/pan transforms, coordinate conversion,
 * and workspace mode switching (select/pan).
 */
(function(CZ) {
    'use strict';

    // ── Grid Drawing ──
    CZ.drawGrid = function() {
        const ctx = CZ.gridCanvas.getContext('2d');
        CZ.gridCanvas.width = CZ.wCont.clientWidth;
        CZ.gridCanvas.height = CZ.wCont.clientHeight;
        if (!CZ.showGrid) { ctx.clearRect(0, 0, CZ.gridCanvas.width, CZ.gridCanvas.height); return; }
        ctx.clearRect(0, 0, CZ.gridCanvas.width, CZ.gridCanvas.height);
        // Draw minor grid lines (every 10px — matches GRID snap)
        const step = CZ.GRID * CZ.zoom;
        const offX = ((CZ.panX % step) + step) % step;
        const offY = ((CZ.panY % step) + step) % step;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-minor').trim() || 'rgba(74, 222, 128, 0.12)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = offX; x < CZ.gridCanvas.width; x += step) {
            ctx.moveTo(x, 0); ctx.lineTo(x, CZ.gridCanvas.height);
        }
        for (let y = offY; y < CZ.gridCanvas.height; y += step) {
            ctx.moveTo(0, y); ctx.lineTo(CZ.gridCanvas.width, y);
        }
        ctx.stroke();
        // Major grid every 10 steps (100px) — thicker for clear distinction
        const major = step * 10;
        const mOffX = ((CZ.panX % major) + major) % major;
        const mOffY = ((CZ.panY % major) + major) % major;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-major').trim() || 'rgba(74, 222, 128, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = mOffX; x < CZ.gridCanvas.width; x += major) {
            ctx.moveTo(x, 0); ctx.lineTo(x, CZ.gridCanvas.height);
        }
        for (let y = mOffY; y < CZ.gridCanvas.height; y += major) {
            ctx.moveTo(0, y); ctx.lineTo(CZ.gridCanvas.width, y);
        }
        ctx.stroke();
    };

    // ── Zoom & Pan Transform ──
    CZ.applyTransform = function() {
        // Wire layer is inside workspace, so only one transform needed
        CZ.ws.style.transform = `translate(${CZ.panX}px,${CZ.panY}px) scale(${CZ.zoom})`;
        document.getElementById('zoom-label').textContent = Math.round(CZ.zoom * 100) + '%';
        CZ.drawGrid();
    };

    // ── Coordinate helpers ──
    CZ.clientToWorkspace = function(cx, cy) {
        const r = CZ.wCont.getBoundingClientRect();
        return { x: (cx - r.left - CZ.panX) / CZ.zoom, y: (cy - r.top - CZ.panY) / CZ.zoom };
    };

    // ── Mode Toggle (Select / Pan) ──
    CZ.setMode = function(mode) {
        CZ.workspaceMode = mode;
        const btnSel = document.getElementById('btn-mode-select');
        const btnPan = document.getElementById('btn-mode-pan');
        btnSel.classList.toggle('active', mode === 'select');
        btnPan.classList.toggle('active', mode === 'pan');
        CZ.wCont.classList.toggle('mode-pan', mode === 'pan');
    };

    // ── Setup Grid Handlers ──
    CZ.setupGridHandlers = function() {
        // Zoom buttons
        document.getElementById('btn-zoom-in').onclick = () => { CZ.zoom = Math.min(3, CZ.zoom + 0.1); CZ.applyTransform(); CZ.persistView(); };
        document.getElementById('btn-zoom-out').onclick = () => { CZ.zoom = Math.max(0.2, CZ.zoom - 0.1); CZ.applyTransform(); CZ.persistView(); };
        document.getElementById('btn-fit').onclick = () => { CZ.zoom = 1; CZ.panX = 0; CZ.panY = 0; CZ.applyTransform(); CZ.persistView(); };

        // Grid toggle — state loaded from settings (UI control is in settings panel)
        const savedGrid = CZ.getSetting('grid');
        if (savedGrid !== null) {
            CZ.showGrid = savedGrid !== 'false' && savedGrid !== false;
        }
        CZ.drawGrid();

        // Select / Pan mode buttons
        document.getElementById('btn-mode-select').onclick = () => CZ.setMode('select');
        document.getElementById('btn-mode-pan').onclick = () => CZ.setMode('pan');

        // Wheel zoom handler
        CZ.wCont.addEventListener('wheel', e => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.08 : 0.08;
            const oldZoom = CZ.zoom;
            const newZoom = Math.min(3, Math.max(0.2, CZ.zoom + delta));
            // Zoom toward mouse cursor position
            const rect = CZ.wCont.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            // Point in workspace under mouse before zoom
            const wx = (mx - CZ.panX) / oldZoom;
            const wy = (my - CZ.panY) / oldZoom;
            // Adjust pan so the same workspace point stays under mouse after zoom
            CZ.panX = mx - wx * newZoom;
            CZ.panY = my - wy * newZoom;
            CZ.zoom = newZoom;
            CZ.applyTransform(); CZ.persistView();
        }, { passive: false });

        // Middle-click pan handler
        CZ.wCont.addEventListener('mousedown', e => {
            if (e.button === 1) {
                e.preventDefault(); CZ.isPanning = true;
                CZ.panStartX = e.clientX; CZ.panStartY = e.clientY;
                CZ.panStartPX = CZ.panX; CZ.panStartPY = CZ.panY;
                CZ.wCont.style.cursor = 'move';
            }
        });

        // ── Two-finger touch: pinch-zoom + drag-pan ──
        let _touchState = null;

        CZ.wCont.addEventListener('touchstart', e => {
            if (e.touches.length === 2) {
                e.preventDefault();
                CZ._touchGesture = true; // flag to block single-finger adapter
                const t0 = e.touches[0], t1 = e.touches[1];
                const dx = t1.clientX - t0.clientX;
                const dy = t1.clientY - t0.clientY;
                _touchState = {
                    dist: Math.hypot(dx, dy),
                    midX: (t0.clientX + t1.clientX) / 2,
                    midY: (t0.clientY + t1.clientY) / 2,
                    zoom: CZ.zoom,
                    panX: CZ.panX,
                    panY: CZ.panY
                };
            }
        }, { passive: false });

        CZ.wCont.addEventListener('touchmove', e => {
            if (!_touchState || e.touches.length < 2) return;
            e.preventDefault();
            const t0 = e.touches[0], t1 = e.touches[1];
            const dx = t1.clientX - t0.clientX;
            const dy = t1.clientY - t0.clientY;
            const newDist = Math.hypot(dx, dy);
            const newMidX = (t0.clientX + t1.clientX) / 2;
            const newMidY = (t0.clientY + t1.clientY) / 2;

            // ── Pinch zoom (focused on midpoint) ──
            const scale = newDist / _touchState.dist;
            const newZoom = Math.min(3, Math.max(0.2, _touchState.zoom * scale));
            const rect = CZ.wCont.getBoundingClientRect();
            // Workspace point under original midpoint
            const mx = _touchState.midX - rect.left;
            const my = _touchState.midY - rect.top;
            const wx = (mx - _touchState.panX) / _touchState.zoom;
            const wy = (my - _touchState.panY) / _touchState.zoom;
            // Pan so same workspace point stays under new midpoint, plus drag offset
            const panDx = newMidX - _touchState.midX;
            const panDy = newMidY - _touchState.midY;
            CZ.panX = (mx - wx * newZoom) + panDx;
            CZ.panY = (my - wy * newZoom) + panDy;
            CZ.zoom = newZoom;

            CZ.applyTransform();
        }, { passive: false });

        const _touchEnd = () => {
            if (_touchState) {
                _touchState = null;
                CZ.persistView();
                // Delay clearing the gesture flag so the touchend from
                // lifting the second finger doesn't fire a synthetic mouseup
                setTimeout(() => { CZ._touchGesture = false; }, 50);
            }
        };
        CZ.wCont.addEventListener('touchend', _touchEnd, { passive: true });
        CZ.wCont.addEventListener('touchcancel', _touchEnd, { passive: true });
    };

})(window.CZ);
