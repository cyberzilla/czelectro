/**
 * wire.js — Wire Management Module
 * Rotation helpers, terminal positioning, wire path generation (Catmull-Rom spline),
 * preview paths, and full wire rendering with spread, flow animation, and drag handles.
 */
(function(CZ) {
    'use strict';

    // Detect coarse pointer (touch device) once for SVG attribute sizing.
    // CSS `r` property may not affect SVG hit-testing in all browsers,
    // so we must set the SVG `r` attribute directly for reliable touch targets.
    const _isCoarse = matchMedia('(pointer: coarse)').matches;

    // ── Rotation helper ──
    // Fast rotation with special cases for 0/90/180/270
    CZ.rotatePoint = function(px, py, cx, cy, angleDeg) {
        let cos, sin;
        switch (((angleDeg % 360) + 360) % 360) {
            case 0:   cos = 1;  sin = 0;  break;
            case 90:  cos = 0;  sin = 1;  break;
            case 180: cos = -1; sin = 0;  break;
            case 270: cos = 0;  sin = -1; break;
            default:
                const rad = angleDeg * Math.PI / 180;
                cos = Math.cos(rad); sin = Math.sin(rad);
        }
        const dx = px - cx, dy = py - cy;
        return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
    };

    // ── Absolute terminal position ──
    // Returns absolute workspace position of a terminal, accounting for rotation.
    CZ.getAbsPos = function(comp, term) {
        const tmpl = COMPONENTS.find(t => t.id === comp.type);
        if (!tmpl || !comp.rotation) {
            return { x: comp.x + term.x, y: comp.y + term.y };
        }
        const cx = tmpl.width / 2, cy = tmpl.height / 2;
        const rotated = CZ.rotatePoint(term.x, term.y, cx, cy, comp.rotation);
        return { x: comp.x + rotated.x, y: comp.y + rotated.y };
    };

    // ── Terminal exit direction ──
    // Detects terminal direction based on position relative to component center.
    CZ.getTerminalDir = function(comp, termIdx) {
        const tmpl = COMPONENTS.find(t => t.id === comp.type);
        if (!tmpl) return { dx: 0, dy: 1 };
        const term = comp.terminals[termIdx];
        const cx = tmpl.width / 2, cy = tmpl.height / 2;

        let dx, dy;

        // Check for explicit direction override on the terminal template
        const tmplTerm = tmpl.terminals[termIdx];
        if (tmplTerm && tmplTerm.dir) {
            switch (tmplTerm.dir) {
                case 'down':  dx = 0;  dy = 1;  break;
                case 'up':    dx = 0;  dy = -1; break;
                case 'left':  dx = -1; dy = 0;  break;
                case 'right': dx = 1;  dy = 0;  break;
                default: dx = 0; dy = 1;
            }
        } else {
            // Smart edge-based auto-detect:
            // If terminal is at a component edge, wire exits outward from that edge.
            // This correctly handles wide/tall components (Arduino, power strips, etc.)
            const w = tmpl.width, h = tmpl.height;
            const edgeThresh = 2; // px tolerance for edge detection
            const atLeft   = term.x <= edgeThresh;
            const atRight  = term.x >= w - edgeThresh;
            const atTop    = term.y <= edgeThresh;
            const atBottom = term.y >= h - edgeThresh;

            if (atTop && !atLeft && !atRight) {
                dx = 0; dy = -1; // top edge → wire goes up
            } else if (atBottom && !atLeft && !atRight) {
                dx = 0; dy = 1;  // bottom edge → wire goes down
            } else if (atLeft && !atTop && !atBottom) {
                dx = -1; dy = 0; // left edge → wire goes left
            } else if (atRight && !atTop && !atBottom) {
                dx = 1; dy = 0;  // right edge → wire goes right
            } else if (atTop && atLeft) {
                dx = -1; dy = -1; // corner: bias outward, normalize later
                // pick dominant edge: whichever is closer to actual edge
                if (term.x <= term.y) { dx = -1; dy = 0; } else { dx = 0; dy = -1; }
            } else if (atTop && atRight) {
                if ((w - term.x) <= term.y) { dx = 1; dy = 0; } else { dx = 0; dy = -1; }
            } else if (atBottom && atLeft) {
                if (term.x <= (h - term.y)) { dx = -1; dy = 0; } else { dx = 0; dy = 1; }
            } else if (atBottom && atRight) {
                if ((w - term.x) <= (h - term.y)) { dx = 1; dy = 0; } else { dx = 0; dy = 1; }
            } else {
                // Fallback: terminal is NOT at any edge (rare), use center-based detect
                const tx = term.x - cx, ty = term.y - cy;
                if (Math.abs(tx) > Math.abs(ty)) {
                    dx = tx > 0 ? 1 : -1; dy = 0;
                } else {
                    dx = 0; dy = ty > 0 ? 1 : -1;
                }
            }
        }

        // Rotate direction vector using exact values (same as rotatePoint)
        if (comp.rotation) {
            const angle = ((comp.rotation % 360) + 360) % 360;
            let cos, sin;
            switch (angle) {
                case 0:   cos = 1;  sin = 0;  break;
                case 90:  cos = 0;  sin = 1;  break;
                case 180: cos = -1; sin = 0;  break;
                case 270: cos = 0;  sin = -1; break;
                default:
                    const rad = angle * Math.PI / 180;
                    cos = Math.cos(rad); sin = Math.sin(rad);
            }
            const ndx = dx * cos - dy * sin;
            const ndy = dx * sin + dy * cos;
            dx = Math.round(ndx);
            dy = Math.round(ndy);
        }
        return { dx, dy };
    };

    // ── Default control points ──
    CZ.getDefaultControlPoints = function() {
        return [
            { x: 0, y: 0 },  // handle at ~35%
            { x: 0, y: 0 },  // handle at ~50%
            { x: 0, y: 0 }   // handle at ~65%
        ];
    };

    // ── Resolve control points ──
    // Convert controlPoints offsets into absolute positions along the wire.
    CZ.resolveControlPoints = function(p1, dir1, p2, dir2, controlPoints) {
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const arm = Math.max(15, Math.min(dist * 0.4, 150));

        // Base cubic bezier — spread-independent so handles stay stable
        const bc1x = p1.x + dir1.dx * arm;
        const bc1y = p1.y + dir1.dy * arm;
        const bc2x = p2.x + dir2.dx * arm;
        const bc2y = p2.y + dir2.dy * arm;

        // Evaluate the base bezier at t to get natural positions
        function baseBezier(t) {
            const u = 1 - t;
            return {
                x: u*u*u*p1.x + 3*u*u*t*bc1x + 3*u*t*t*bc2x + t*t*t*p2.x,
                y: u*u*u*p1.y + 3*u*u*t*bc1y + 3*u*t*t*bc2y + t*t*t*p2.y
            };
        }

        const cps = controlPoints || CZ.getDefaultControlPoints();
        const tValues = [0.35, 0.5, 0.65];
        return tValues.map((t, i) => {
            const base = baseBezier(t);
            const offset = cps[i] || { x: 0, y: 0 };
            return { x: base.x + offset.x, y: base.y + offset.y };
        });
    };

    // ── Make wire path ──
    // Generates smooth wire path. Uses simple cubic Bezier when control points
    // are at default, switches to Catmull-Rom spline when user has moved handles.
    CZ.makeWirePath = function(p1, dir1, p2, dir2, controlPoints, spreadOffset) {
        const cps = controlPoints || CZ.getDefaultControlPoints();
        const sox = spreadOffset?.x || 0, soy = spreadOffset?.y || 0;

        const dx0 = p2.x - p1.x, dy0 = p2.y - p1.y;
        const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
        const arm = Math.max(15, Math.min(dist0 * 0.4, 150));

        // Check if all control points are at default (untouched by user)
        const isDefault = cps.every(cp => Math.abs(cp.x) < 0.5 && Math.abs(cp.y) < 0.5);

        if (isDefault) {
            // ── Clean cubic Bezier — no wobble ──
            const cp1x = p1.x + dir1.dx * arm + sox * 0.5;
            const cp1y = p1.y + dir1.dy * arm + soy * 0.5;
            const cp2x = p2.x + dir2.dx * arm + sox * 0.5;
            const cp2y = p2.y + dir2.dy * arm + soy * 0.5;

            const d = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;

            // Place handles at natural positions on the curve for potential user dragging
            function evalBez(t) {
                const u = 1 - t;
                return {
                    x: u*u*u*p1.x + 3*u*u*t*cp1x + 3*u*t*t*cp2x + t*t*t*p2.x,
                    y: u*u*u*p1.y + 3*u*u*t*cp1y + 3*u*t*t*cp2y + t*t*t*p2.y
                };
            }
            const handlePositions = [evalBez(0.35), evalBez(0.5), evalBez(0.65)];
            return { d, handlePositions };
        }

        // ── Catmull-Rom spline — user has moved handles ──
        const pts = CZ.resolveControlPoints(p1, dir1, p2, dir2, controlPoints);
        const allPts = [p1, pts[0], pts[1], pts[2], p2];
        const n = allPts.length;
        let d = `M ${allPts[0].x} ${allPts[0].y}`;

        const exitTan = { x: dir1.dx * arm * 0.6 + sox * 0.7, y: dir1.dy * arm * 0.6 + soy * 0.7 };
        const enterTan = { x: dir2.dx * arm * 0.6 + sox * 0.7, y: dir2.dy * arm * 0.6 + soy * 0.7 };

        for (let i = 0; i < n - 1; i++) {
            const p0 = allPts[Math.max(0, i - 1)];
            const pi = allPts[i];
            const pi1 = allPts[i + 1];
            const p3 = allPts[Math.min(n - 1, i + 2)];

            let cp1x, cp1y, cp2x, cp2y;
            const segLen = Math.sqrt((pi1.x - pi.x) ** 2 + (pi1.y - pi.y) ** 2) || 1;
            const tScale = Math.min(0.45, segLen / 300);

            if (i === 0) {
                const exitScale = Math.min(1, segLen / (arm * 1.2));
                cp1x = pi.x + exitTan.x * exitScale;
                cp1y = pi.y + exitTan.y * exitScale;
                cp2x = pi1.x - (p3.x - pi.x) * tScale;
                cp2y = pi1.y - (p3.y - pi.y) * tScale;
            } else if (i === n - 2) {
                const enterScale = Math.min(1, segLen / (arm * 1.2));
                cp1x = pi.x + (pi1.x - p0.x) * tScale;
                cp1y = pi.y + (pi1.y - p0.y) * tScale;
                cp2x = pi1.x + enterTan.x * enterScale;
                cp2y = pi1.y + enterTan.y * enterScale;
            } else {
                cp1x = pi.x + (pi1.x - p0.x) * tScale;
                cp1y = pi.y + (pi1.y - p0.y) * tScale;
                cp2x = pi1.x - (p3.x - pi.x) * tScale;
                cp2y = pi1.y - (p3.y - pi.y) * tScale;
            }

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pi1.x} ${pi1.y}`;
        }

        return { d, handlePositions: pts };
    };

    // ── Make preview path ──
    // For temp-wire preview (mouse endpoint has no component direction).
    CZ.makePreviewPath = function(p1, dir1, mx, my) {
        const dx = mx - p1.x, dy = my - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const arm = Math.max(15, Math.min(dist * 0.4, 150));

        const cp1x = p1.x + dir1.dx * arm;
        const cp1y = p1.y + dir1.dy * arm;
        const cp2x = mx - (dx / (dist || 1)) * arm * 0.5;
        const cp2y = my - (dy / (dist || 1)) * arm * 0.5;

        return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${mx} ${my}`;
    };

    // ── Wire rendering ──
    CZ.renderWires = function() {
        // Incremental DOM update: reuse existing wire groups, only add/remove as needed
        const existingGroups = CZ.wiresG.querySelectorAll('g.wire-group');
        const existingMap = {};
        existingGroups.forEach(g => { existingMap[g.dataset.widx] = g; });

        // Track which indices are still valid
        const activeIndices = new Set();
        document.querySelectorAll('.terminal').forEach(el => el.classList.remove('connected'));

        // Auto-spread: compute offset for wires sharing the same terminal pair
        const terminalGroups = {};
        CZ.wires.forEach((w, idx) => {
            // Group by terminal endpoints (regardless of order)
            const keyA = `${w.c1}:${w.i1}`;
            const keyB = `${w.c2}:${w.i2}`;
            [keyA, keyB].forEach(key => {
                if (!terminalGroups[key]) terminalGroups[key] = [];
                terminalGroups[key].push(idx);
            });
        });

        // Calculate spread offsets for wires sharing a terminal
        const wireSpread = {};
        Object.values(terminalGroups).forEach(group => {
            if (group.length <= 1) return;
            group.forEach((widx, i) => {
                const offset = (i - (group.length - 1) / 2) * 25;
                if (!wireSpread[widx]) wireSpread[widx] = { x: 0, y: 0 };
                // Spread perpendicular to the wire direction
                const w = CZ.wires[widx];
                const c1 = CZ.deployed.find(c => c.id === w.c1);
                const c2 = CZ.deployed.find(c => c.id === w.c2);
                if (!c1 || !c2) return;
                const p1 = CZ.getAbsPos(c1, c1.terminals[w.i1]);
                const p2 = CZ.getAbsPos(c2, c2.terminals[w.i2]);
                const dx = p2.x - p1.x, dy = p2.y - p1.y;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                // Perpendicular direction
                wireSpread[widx].x += (-dy / len) * offset;
                wireSpread[widx].y += (dx / len) * offset;
            });
        });

        CZ.wires.forEach((w, idx) => {
            const c1 = CZ.deployed.find(c => c.id === w.c1);
            const c2 = CZ.deployed.find(c => c.id === w.c2);
            if (!c1 || !c2) return;
            const p1 = CZ.getAbsPos(c1, c1.terminals[w.i1]);
            const p2 = CZ.getAbsPos(c2, c2.terminals[w.i2]);
            const dir1 = CZ.getTerminalDir(c1, w.i1);
            const dir2 = CZ.getTerminalDir(c2, w.i2);

            // Migrate legacy single-bend to controlPoints array
            if (!w.controlPoints && w.bend) {
                w.controlPoints = [
                    { x: w.bend.x * 0.5, y: w.bend.y * 0.5 },
                    { x: w.bend.x, y: w.bend.y },
                    { x: w.bend.x * 0.5, y: w.bend.y * 0.5 }
                ];
            }
            if (!w.controlPoints) w.controlPoints = CZ.getDefaultControlPoints();

            // Save spread for in-place updates during drag
            w._lastSpread = wireSpread[idx];

            activeIndices.add(String(idx));

            // Reuse existing DOM group if possible
            if (existingMap[String(idx)]) {
                CZ.updateWire(idx);
                // Update energized flow state
                const g = existingMap[String(idx)];
                const flow = g.querySelector('.wire-flow');
                const { d } = CZ.makeWirePath(p1, dir1, p2, dir2, w.controlPoints, wireSpread[idx]);
                if (w.energized && !flow) {
                    const nf = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    nf.setAttribute('d', d);
                    nf.setAttribute('stroke', 'rgba(74,222,128,0.6)');
                    nf.setAttribute('stroke-width', '2');
                    nf.setAttribute('fill', 'none');
                    nf.setAttribute('stroke-linecap', 'round');
                    nf.setAttribute('stroke-linejoin', 'round');
                    nf.classList.add('wire-flow');
                    g.insertBefore(nf, g.firstChild);
                } else if (!w.energized && flow) {
                    flow.remove();
                }
                // Update wire color
                const vis = g.querySelector('.real-wire');
                if (vis) vis.setAttribute('stroke', w.color || '#94a3b8');
            } else {
                // Create new wire group
                const { d, handlePositions } = CZ.makeWirePath(p1, dir1, p2, dir2, w.controlPoints, wireSpread[idx]);

                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('wire-group');
                g.dataset.widx = idx;

                // Hit area for dragging
                const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                hit.setAttribute('d', d);
                hit.classList.add('wire-hit-area');
                hit.dataset.widx = idx;

                // Visual wire
                const vis = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                vis.setAttribute('d', d);
                vis.setAttribute('stroke', w.color || '#94a3b8');
                vis.setAttribute('stroke-width', '3.5');
                vis.setAttribute('stroke-linecap', 'round');
                vis.setAttribute('stroke-linejoin', 'round');
                vis.classList.add('real-wire');

                // Flow animation if energized
                if (w.energized) {
                    const flow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    flow.setAttribute('d', d);
                    flow.setAttribute('stroke', 'rgba(74,222,128,0.6)');
                    flow.setAttribute('stroke-width', '2');
                    flow.setAttribute('fill', 'none');
                    flow.setAttribute('stroke-linecap', 'round');
                    flow.setAttribute('stroke-linejoin', 'round');
                    flow.classList.add('wire-flow');
                    g.appendChild(flow);
                }

                g.appendChild(vis);
                g.appendChild(hit);

                // Draggable handles — 3 control points, hidden by default, visible on hover
                handlePositions.forEach((hp, hIdx) => {
                    const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    handle.setAttribute('cx', hp.x);
                    handle.setAttribute('cy', hp.y);
                    handle.setAttribute('r', _isCoarse ? '16' : '5');
                    handle.classList.add('wire-handle');
                    handle.dataset.widx = idx;
                    handle.dataset.hidx = hIdx;
                    if (CZ.selectedHandles.has(`${idx}:${hIdx}`)) {
                        handle.classList.add('handle-selected');
                    }
                    g.appendChild(handle);
                });

                CZ.wiresG.appendChild(g);
            }

            document.querySelector(`[data-cid="${w.c1}"][data-tidx="${w.i1}"]`)?.classList.add('connected');
            document.querySelector(`[data-cid="${w.c2}"][data-tidx="${w.i2}"]`)?.classList.add('connected');
        });

        // Remove stale wire groups (deleted wires)
        Object.keys(existingMap).forEach(widx => {
            if (!activeIndices.has(widx)) {
                existingMap[widx].remove();
            }
        });
    };

    // ── In-place wire update (preserves DOM elements for touch drag) ──
    // Updates SVG attributes directly without destroying/recreating elements.
    // This prevents touch targets from being lost during touchmove.
    CZ.updateWire = function(idx) {
        const w = CZ.wires[idx];
        if (!w) return;

        const c1 = CZ.deployed.find(c => c.id === w.c1);
        const c2 = CZ.deployed.find(c => c.id === w.c2);
        if (!c1 || !c2) return;

        const p1 = CZ.getAbsPos(c1, c1.terminals[w.i1]);
        const p2 = CZ.getAbsPos(c2, c2.terminals[w.i2]);
        const dir1 = CZ.getTerminalDir(c1, w.i1);
        const dir2 = CZ.getTerminalDir(c2, w.i2);

        const spread = w._lastSpread || { x: 0, y: 0 };
        const { d, handlePositions } = CZ.makeWirePath(p1, dir1, p2, dir2, w.controlPoints, spread);

        // Find the existing SVG group by wire index
        const g = CZ.wiresG.querySelector(`g.wire-group[data-widx="${idx}"]`);
        if (!g) return;

        // Clear any lingering CSS transforms from group rotation animation
        if (g.style.transform) {
            g.style.transform = '';
            g.style.transformOrigin = '';
            g.style.transition = '';
        }

        // Update path data in-place — no DOM destruction
        const hit = g.querySelector('.wire-hit-area');
        if (hit) hit.setAttribute('d', d);

        const vis = g.querySelector('.real-wire');
        if (vis) vis.setAttribute('d', d);

        const flow = g.querySelector('.wire-flow');
        if (flow) flow.setAttribute('d', d);

        // Update handle positions in-place
        const handles = g.querySelectorAll('.wire-handle');
        handles.forEach(h => {
            const hIdx = parseInt(h.dataset.hidx);
            if (handlePositions[hIdx]) {
                h.setAttribute('cx', handlePositions[hIdx].x);
                h.setAttribute('cy', handlePositions[hIdx].y);
            }
        });
    };

})(window.CZ);
