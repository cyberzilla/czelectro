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
        const step = 20 * CZ.zoom;
        const offX = ((CZ.panX % step) + step) % step;
        const offY = ((CZ.panY % step) + step) % step;
        // Draw grid lines
        ctx.strokeStyle = 'rgba(100, 140, 120, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = offX; x < CZ.gridCanvas.width; x += step) {
            ctx.moveTo(x, 0); ctx.lineTo(x, CZ.gridCanvas.height);
        }
        for (let y = offY; y < CZ.gridCanvas.height; y += step) {
            ctx.moveTo(0, y); ctx.lineTo(CZ.gridCanvas.width, y);
        }
        ctx.stroke();
        // Major grid every 5 steps
        const major = step * 5;
        const mOffX = ((CZ.panX % major) + major) % major;
        const mOffY = ((CZ.panY % major) + major) % major;
        ctx.strokeStyle = 'rgba(100, 180, 140, 0.12)';
        ctx.lineWidth = 1;
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

        // Grid toggle
        const GRID_KEY = 'czelectro_grid';
        const savedGrid = localStorage.getItem(GRID_KEY);
        if (savedGrid !== null) {
            CZ.showGrid = savedGrid !== 'false';
        }
        document.getElementById('btn-grid').classList.toggle('active', CZ.showGrid);
        CZ.drawGrid();

        document.getElementById('btn-grid').onclick = (e) => {
            CZ.showGrid = !CZ.showGrid;
            e.currentTarget.classList.toggle('active', CZ.showGrid);
            localStorage.setItem(GRID_KEY, CZ.showGrid);
            CZ.drawGrid();
        };

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
    };

})(window.CZ);
