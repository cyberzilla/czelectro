// CZElectro — Events & Init Module
// Handles: all mouse/keyboard event handlers + application initialization
(function(CZ) {
    'use strict';

    CZ.setupEvents = function() {
        const ws = CZ.ws;
        const wCont = CZ.wCont;
        const tmpWire = CZ.tmpWire;
        const wireLayer = CZ.wireLayer;

        // ── Touch-to-Mouse adapter for mobile support ──
        // Converts single-finger touch events into synthetic MouseEvents.
        let _touchRAF = null;

        ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(touchType => {
            document.addEventListener(touchType, (e) => {
                // Skip during/after two-finger gesture (pinch-zoom / pan)
                if (CZ._touchGesture) return;
                if (e.touches && e.touches.length > 1) return;
                const touch = e.changedTouches[0];
                if (!touch) return;

                // Skip sidebar items — handled by smart touch handler
                if (touch.target.closest && touch.target.closest('.sidebar-item')) return;
                if (touch.target.closest && touch.target.closest('#component-list')) {
                    if (!CZ._sidebarDragging) return;
                }
                // Skip UI panels that handle their own click events
                if (touch.target.closest && (
                    touch.target.closest('.settings-panel') ||
                    touch.target.closest('#toolbar') ||
                    touch.target.closest('.sidebar-toggle')
                )) return;

                // Prevent scroll/zoom during ongoing interactions
                if (e.cancelable && (CZ.isDragging || CZ.isPanning || CZ.activeTerm || CZ.activeWireDrag || CZ.selRect)) {
                    e.preventDefault();
                }

                // ── touchmove: RAF-throttled, always dispatch to document ──
                if (touchType === 'touchmove') {
                    CZ._touchMoveX = touch.clientX;
                    CZ._touchMoveY = touch.clientY;
                    if (!_touchRAF) {
                        _touchRAF = requestAnimationFrame(() => {
                            _touchRAF = null;
                            document.dispatchEvent(new MouseEvent('mousemove', {
                                bubbles: true, cancelable: true,
                                clientX: CZ._touchMoveX, clientY: CZ._touchMoveY, button: 0
                            }));
                        });
                    }
                    return;
                }

                // ── touchstart / touchend / touchcancel — fire immediately ──
                const mouseType = {
                    touchstart: 'mousedown',
                    touchend: 'mouseup',
                    touchcancel: 'mouseup'
                }[touchType];

                let target = touch.target;

                if (touchType === 'touchstart') {
                    // Clean up stale selection rect from a previous gesture that
                    // didn't complete properly (e.g. browser intercepted the scroll)
                    if (CZ.selRect) {
                        CZ.selRect.remove();
                        CZ.selRect = null;
                    }

                    // SVG hit-testing fix: touch.target is unreliable for SVG children
                    // inside a parent with pointer-events: none (wire-layer).
                    // Use elementFromPoint as fallback specifically for wire elements.
                    const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (elUnder) {
                        const isWireEl = elUnder.closest && (
                            elUnder.closest('.wire-handle') ||
                            elUnder.closest('.wire-hit-area')
                        );
                        if (isWireEl) {
                            target = elUnder;
                        }
                    }
                }

                if (touchType === 'touchend' || touchType === 'touchcancel') {
                    // Use elementFromPoint — touch.target for touchend is where
                    // touch STARTED (per spec), we need current element for wiring
                    const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (elUnder) target = elUnder;
                }

                target.dispatchEvent(new MouseEvent(mouseType, {
                    bubbles: true, cancelable: true,
                    clientX: touch.clientX, clientY: touch.clientY, button: 0
                }));

                // After synthetic mousedown, a drag state may have been activated
                // synchronously. preventDefault to stop browser scroll gesture.
                if (touchType === 'touchstart' && e.cancelable) {
                    if (CZ.activeWireDrag || CZ.isDragging || CZ.activeTerm || CZ.selRect) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });
        });

        // ── Smart sidebar touch: vertical = scroll, horizontal = drag component ──
        CZ._sidebarDragging = false;
        (function() {
            const THRESHOLD = 15; // px before deciding direction
            let touchState = null;

            document.getElementById('component-list')?.addEventListener('touchstart', (e) => {
                const sItem = e.target.closest('.sidebar-item');
                if (!sItem || e.touches.length > 1) return;
                const touch = e.touches[0];
                touchState = {
                    item: sItem,
                    tmplId: sItem.dataset.id,
                    startX: touch.clientX,
                    startY: touch.clientY,
                    decided: false, // 'scroll' or 'drag'
                    ghost: null
                };
            }, { passive: true });

            document.addEventListener('touchmove', (e) => {
                if (!touchState) return;
                const touch = e.touches[0];
                if (!touch) return;
                const dx = Math.abs(touch.clientX - touchState.startX);
                const dy = Math.abs(touch.clientY - touchState.startY);

                if (!touchState.decided) {
                    if (dx < THRESHOLD && dy < THRESHOLD) return; // Still deciding
                    if (dy > dx) {
                        // Vertical — it's a scroll, release control
                        touchState.decided = 'scroll';
                        return;
                    } else {
                        // Horizontal — it's a drag
                        touchState.decided = 'drag';
                        CZ._sidebarDragging = true;
                        const tmpl = REGISTRY.find(touchState.tmplId);
                        if (!tmpl) { touchState = null; return; }
                        touchState.tmpl = tmpl;
                        const ghost = document.createElement('div');
                        ghost.className = 'drag-ghost';
                        ghost.innerHTML = tmpl.svg;
                        ghost.style.cssText = `
                            position:fixed; z-index:10000; pointer-events:none;
                            width:${tmpl.width}px; height:${tmpl.height}px;
                            left:${touch.clientX - tmpl.width/2}px;
                            top:${touch.clientY - tmpl.height/2}px;
                            opacity:0.85; transform:scale(1.05);
                            filter:drop-shadow(0 4px 12px rgba(74,222,128,0.3));
                        `;
                        document.body.appendChild(ghost);
                        touchState.ghost = ghost;
                        if (e.cancelable) e.preventDefault();
                    }
                }

                if (touchState.decided === 'drag' && touchState.ghost) {
                    const tmpl = touchState.tmpl;
                    touchState.ghost.style.left = (touch.clientX - tmpl.width/2) + 'px';
                    touchState.ghost.style.top = (touch.clientY - tmpl.height/2) + 'px';
                    if (e.cancelable) e.preventDefault();
                }
            }, { passive: false });

            document.addEventListener('touchend', (e) => {
                if (!touchState) return;
                const state = touchState;
                touchState = null;
                CZ._sidebarDragging = false;

                if (state.decided === 'drag' && state.ghost) {
                    state.ghost.remove();
                    const touch = e.changedTouches[0];
                    if (!touch) return;
                    const wRect = wCont.getBoundingClientRect();
                    if (touch.clientX >= wRect.left && touch.clientX <= wRect.right &&
                        touch.clientY >= wRect.top && touch.clientY <= wRect.bottom) {
                        const comp = CZ.spawnComponent(state.tmplId, touch.clientX, touch.clientY);
                        if (comp) {
                            CZ.saveState();
                            if (CZ._closeMobileSidebar) CZ._closeMobileSidebar();
                        }
                    }
                }
            }, { passive: true });

            document.addEventListener('touchcancel', () => {
                if (touchState?.ghost) touchState.ghost.remove();
                touchState = null;
                CZ._sidebarDragging = false;
            }, { passive: true });
        })();

        // ── Sidebar drag (mouse) — spawn component ──
        document.addEventListener('mousedown', e => {
            const sItem = e.target.closest('.sidebar-item');
            if (sItem && e.button === 0) {
                e.preventDefault();
                const tmplId = sItem.dataset.id;
                const tmpl = REGISTRY.find(tmplId);
                if (!tmpl) return;

                const ghost = document.createElement('div');
                ghost.className = 'drag-ghost';
                ghost.innerHTML = tmpl.svg;
                ghost.style.cssText = `
                    position: fixed; z-index: 10000; pointer-events: none;
                    width: ${tmpl.width}px; height: ${tmpl.height}px;
                    left: ${e.clientX - tmpl.width / 2}px;
                    top: ${e.clientY - tmpl.height / 2}px;
                    opacity: 0.85; transform: scale(1.05);
                    filter: drop-shadow(0 4px 12px rgba(74,222,128,0.3));
                    transition: transform 0.1s, opacity 0.1s;
                `;
                document.body.appendChild(ghost);

                const onMove = (ev) => {
                    ghost.style.left = (ev.clientX - tmpl.width / 2) + 'px';
                    ghost.style.top = (ev.clientY - tmpl.height / 2) + 'px';
                };

                const onUp = (ev) => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    ghost.remove();

                    const wRect = wCont.getBoundingClientRect();
                    if (ev.clientX >= wRect.left && ev.clientX <= wRect.right &&
                        ev.clientY >= wRect.top && ev.clientY <= wRect.bottom) {
                        const comp = CZ.spawnComponent(tmplId, ev.clientX, ev.clientY);
                        if (comp) {
                            CZ.saveState();
                            if (CZ._closeMobileSidebar) CZ._closeMobileSidebar();
                        }
                    }
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
                return;
            }

            // Terminal — start wiring
            const termEl = e.target.closest('.terminal');
            if (termEl) {
                e.stopPropagation();
                const cid = termEl.dataset.cid, tidx = parseInt(termEl.dataset.tidx);
                const comp = CZ.deployedMap.get(cid);
                CZ.activeTerm = { cid, tidx, comp, el: termEl };
                const pos = CZ.getAbsPos(comp, comp.terminals[tidx]);
                tmpWire.setAttribute('d', `M ${pos.x} ${pos.y} L ${pos.x} ${pos.y}`);
                tmpWire.style.display = 'inline';
                return;
            }

            // Board component — potential drag OR click
            const bComp = e.target.closest('.board-component');
            if (bComp && e.button === 0) {
                CZ.dragEl = bComp;
                const comp = CZ.deployedMap.get(bComp.id);
                const wPos = CZ.clientToWorkspace(e.clientX, e.clientY);
                CZ.dragOX = comp ? wPos.x - comp.x : 0;
                CZ.dragOY = comp ? wPos.y - comp.y : 0;
                CZ.dragStartX = e.clientX;
                CZ.dragStartY = e.clientY;
                CZ.dragMoved = false;
                CZ.isDragging = true;

                // Selection logic: if NOT already selected, clear old selection (unless Ctrl held)
                if (!CZ.selectedIds.has(bComp.id)) {
                    if (!e.ctrlKey && !e.metaKey) {
                        CZ.selectedIds.clear();
                        document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                    }
                    CZ.selectedIds.add(bComp.id);
                    bComp.classList.add('selected');
                }
                CZ.expandSelectionToGroups();
                CZ.renderGroupLabels();
                return;
            }

            // Empty workspace click
            if (e.button === 0 && (e.target === ws || e.target === CZ.gridCanvas || e.target === wCont)) {
                const wantPan = CZ.workspaceMode === 'pan' ? !e.ctrlKey : e.ctrlKey;
                if (wantPan) {
                    e.preventDefault(); CZ.isPanning = true;
                    CZ.panStartX = e.clientX; CZ.panStartY = e.clientY;
                    CZ.panStartPX = CZ.panX; CZ.panStartPY = CZ.panY;
                    wCont.style.cursor = 'grabbing';
                } else {
                    const m = CZ.clientToWorkspace(e.clientX, e.clientY);
                    CZ.selStartX = m.x; CZ.selStartY = m.y;
                    CZ.selRect = document.createElement('div');
                    CZ.selRect.className = 'selection-rect';
                    ws.appendChild(CZ.selRect);
                    CZ.selectedIds.clear();
                    CZ.selectedHandles.clear();
                    document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                    document.querySelectorAll('.wire-handle.handle-selected').forEach(el => el.classList.remove('handle-selected'));
                    document.querySelectorAll('.board-component.show-terminals').forEach(el => el.classList.remove('show-terminals'));
                }
            }
        });

        // ── Mouse move ──
        document.addEventListener('mousemove', e => {
            if (CZ.isPanning) {
                CZ.panX = CZ.panStartPX + (e.clientX - CZ.panStartX);
                CZ.panY = CZ.panStartPY + (e.clientY - CZ.panStartY);
                CZ.applyTransform();
                return;
            }

            const m = CZ.clientToWorkspace(e.clientX, e.clientY);

            // Wire control-point drag
            if (CZ.activeWireDrag) {
                const dx = m.x - CZ.activeWireDrag.startMouse.x;
                const dy = m.y - CZ.activeWireDrag.startMouse.y;
                const updatedWires = new Set();
                if (CZ.activeWireDrag.allHandles && CZ.activeWireDrag.allHandles.length > 0) {
                    CZ.activeWireDrag.allHandles.forEach(h => {
                        const wire = CZ.wires[h.wireIdx];
                        if (wire && wire.controlPoints) {
                            wire.controlPoints[h.handleIdx] = { x: h.startOffset.x + dx, y: h.startOffset.y + dy };
                            updatedWires.add(h.wireIdx);
                        }
                    });
                } else {
                    const w = CZ.wires[CZ.activeWireDrag.wireIdx];
                    if (w && w.controlPoints) {
                        w.controlPoints[CZ.activeWireDrag.handleIdx] = {
                            x: CZ.activeWireDrag.startOffset.x + dx,
                            y: CZ.activeWireDrag.startOffset.y + dy
                        };
                        updatedWires.add(CZ.activeWireDrag.wireIdx);
                    }
                }

                // In-place DOM update — preserves touch target during drag.
                // CZ.renderWires() would destroy all SVG elements (innerHTML='')
                // and recreate them, killing the touch target mid-drag.
                updatedWires.forEach(wi => CZ.updateWire(wi));
                return;
            }

            // Component drag
            if (CZ.isDragging && CZ.dragEl) {
                if (!CZ.dragMoved) {
                    const dx = Math.abs(e.clientX - CZ.dragStartX);
                    const dy = Math.abs(e.clientY - CZ.dragStartY);
                    if (dx + dy < CZ.DRAG_THRESHOLD) return;
                    CZ.dragMoved = true;
                    ws.appendChild(CZ.dragEl);
                }
                let nx = Math.round((m.x - CZ.dragOX) / CZ.GRID) * CZ.GRID;
                let ny = Math.round((m.y - CZ.dragOY) / CZ.GRID) * CZ.GRID;
                CZ.dragEl.style.left = nx + 'px';
                CZ.dragEl.style.top = ny + 'px';
                const comp = CZ.deployedMap.get(CZ.dragEl.id);
                if (comp) {
                    const oldX = comp.x, oldY = comp.y;
                    comp.x = nx; comp.y = ny;
                    if (CZ.selectedIds.has(comp.id) && CZ.selectedIds.size > 1) {
                        const dx = nx - oldX, dy = ny - oldY;
                        CZ.deployed.forEach(c => {
                            if (c.id !== comp.id && CZ.selectedIds.has(c.id)) {
                                c.x += dx; c.y += dy;
                                const el = document.getElementById(c.id);
                                if (el) { el.style.left = c.x + 'px'; el.style.top = c.y + 'px'; }
                            }
                        });
                    }
                    CZ.renderWires();
                    CZ.renderGroupLabels();
                }
            }

            // Selection rectangle
            if (CZ.selRect) {
                const x = Math.min(CZ.selStartX, m.x), y = Math.min(CZ.selStartY, m.y);
                const w = Math.abs(m.x - CZ.selStartX), h = Math.abs(m.y - CZ.selStartY);
                CZ.selRect.style.left = x + 'px'; CZ.selRect.style.top = y + 'px';
                CZ.selRect.style.width = w + 'px'; CZ.selRect.style.height = h + 'px';
                return;
            }

            // Wiring preview
            if (CZ.activeTerm) {
                const start = CZ.getAbsPos(CZ.activeTerm.comp, CZ.activeTerm.comp.terminals[CZ.activeTerm.tidx]);
                const dir1 = CZ.getTerminalDir(CZ.activeTerm.comp, CZ.activeTerm.tidx);
                tmpWire.setAttribute('d', CZ.makePreviewPath(start, dir1, m.x, m.y));
            }
        });

        // ── Mouse up ──
        document.addEventListener('mouseup', e => {
            if (CZ.isPanning) { CZ.isPanning = false; wCont.style.cursor = ''; CZ.persistView(); return; }

            if (CZ.activeWireDrag) { CZ.activeWireDrag = null; CZ.saveState(); return; }

            // End selection rectangle
            if (CZ.selRect) {
                const rx = parseFloat(CZ.selRect.style.left) || 0;
                const ry = parseFloat(CZ.selRect.style.top) || 0;
                const rw = parseFloat(CZ.selRect.style.width) || 0;
                const rh = parseFloat(CZ.selRect.style.height) || 0;
                CZ.selRect.remove(); CZ.selRect = null;
                if (rw > 5 || rh > 5) {
                    CZ.deployed.forEach(c => {
                        const tmpl = REGISTRY.find(c.type);
                        if (!tmpl) return;
                        const cx = c.x + tmpl.width / 2, cy = c.y + tmpl.height / 2;
                        if (cx >= rx && cx <= rx + rw && cy >= ry && cy <= ry + rh) {
                            CZ.selectedIds.add(c.id);
                            document.getElementById(c.id)?.classList.add('selected');
                        }
                    });
                    document.querySelectorAll('.wire-handle').forEach(h => {
                        const hx = parseFloat(h.getAttribute('cx'));
                        const hy = parseFloat(h.getAttribute('cy'));
                        if (hx >= rx && hx <= rx + rw && hy >= ry && hy <= ry + rh) {
                            const key = `${h.dataset.widx}:${h.dataset.hidx}`;
                            CZ.selectedHandles.add(key);
                            h.classList.add('handle-selected');
                        }
                    });
                }
                CZ.expandSelectionToGroups();
                CZ.renderGroupLabels();
                return;
            }

            // Click (not drag) — handle switch toggle + show terminals on touch
            if (CZ.isDragging && CZ.dragEl && !CZ.dragMoved) {
                try {
                const comp = CZ.deployedMap.get(CZ.dragEl.id);
                if (comp && comp.type === 'switch_toggle') {
                    comp.isClosed = !comp.isClosed;
                    comp.currentResistance = comp.isClosed ? EL.SIM.SWITCH_ON_R : EL.SIM.SWITCH_OFF_R;
                    CZ.dragEl.classList.toggle('switch-closed');
                    const indicator = CZ.dragEl.querySelector('.switch-state');
                    if (indicator) indicator.textContent = comp.isClosed ? 'ON' : 'OFF';
                    CZ.SFX.switchClick();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── MCB toggle (click to reset after trip, or manual on/off) ──
                if (comp && comp.type.startsWith('mcb_')) {
                    const tmpl = REGISTRY.find(comp.type);
                    comp.isClosed = comp.isClosed === false ? true : false;
                    comp.currentResistance = comp.isClosed ? (tmpl ? tmpl.resistance : 0.01) : EL.SIM.OPEN_CIRCUIT_R;
                    CZ.dragEl.classList.remove('mcb-tripped');
                    const toggle = CZ.dragEl.querySelector('.mcb-toggle');
                    const label = CZ.dragEl.querySelector('.mcb-label');
                    const indicator = CZ.dragEl.querySelector('.mcb-indicator');
                    if (comp.isClosed) {
                        if (toggle) { toggle.setAttribute('fill', '#22c55e'); toggle.setAttribute('y', '25'); }
                        if (label) { label.textContent = 'ON'; label.setAttribute('y', '44'); }
                        if (indicator) indicator.setAttribute('fill', '#22c55e');
                    } else {
                        if (toggle) { toggle.setAttribute('fill', '#6b7280'); toggle.setAttribute('y', '35'); }
                        if (label) { label.textContent = 'OFF'; label.setAttribute('y', '54'); }
                        if (indicator) indicator.setAttribute('fill', '#6b7280');
                    }
                    CZ.SFX.switchClick();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── PLN toggle (click to turn on/off grid power) ──
                if (comp && comp.type === 'pln_source') {
                    comp.isPoweredOff = !comp.isPoweredOff;
                    const plnLed = CZ.dragEl.querySelector('.pln-led');
                    const plnVolt = CZ.dragEl.querySelector('.pln-voltage');
                    if (comp.isPoweredOff) {
                        comp.currentResistance = EL.SIM.OPEN_CIRCUIT_R;
                        if (plnLed) plnLed.setAttribute('fill', '#ef4444');
                        if (plnVolt) { plnVolt.textContent = 'OFF'; plnVolt.setAttribute('fill', '#ef4444'); }
                    } else {
                        const tmpl = REGISTRY.find('pln_source');
                        comp.currentResistance = tmpl ? tmpl.resistance : 0.01;
                        if (plnLed) plnLed.setAttribute('fill', '#22c55e');
                        if (plnVolt) { plnVolt.textContent = '220V'; plnVolt.setAttribute('fill', '#22c55e'); }
                    }
                    // Power badge (consistent with other toggleable components)
                    let pwrBadge = CZ.dragEl.querySelector('.power-on-off-badge');
                    if (!pwrBadge) {
                        pwrBadge = document.createElement('div');
                        pwrBadge.className = 'power-on-off-badge';
                        CZ.dragEl.appendChild(pwrBadge);
                    }
                    pwrBadge.textContent = comp.isPoweredOff ? '⏻ OFF' : '⏻ ON';
                    pwrBadge.classList.toggle('off', comp.isPoweredOff);
                    CZ.SFX.switchClick();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── ATS mode toggle (click to switch PLN_FIRST ↔ PLTS_FIRST) ──
                if (comp && comp.type === 'ats_switch') {
                    comp.atsMode = (comp.atsMode || 'PLN_FIRST') === 'PLN_FIRST' ? 'PLTS_FIRST' : 'PLN_FIRST';
                    CZ.SFX.switchClick();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── Push Button toggle (momentary, but acts as toggle in sim) ──
                if (comp && comp.type === 'push_button') {
                    comp.isClosed = !comp.isClosed;
                    comp.currentResistance = comp.isClosed ? EL.SIM.SWITCH_ON_R : EL.SIM.SWITCH_OFF_R;
                    CZ.dragEl.classList.toggle('pushbtn-pressed', comp.isClosed);
                    CZ.SFX.switchClick();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── DPDT Switch toggle (position A ↔ B) ──
                if (comp && comp.type === 'dpdt_switch') {
                    comp.isClosed = !comp.isClosed;
                    comp.currentResistance = comp.isClosed ? EL.SIM.SWITCH_ON_R : EL.SIM.SWITCH_ON_R;
                    CZ.dragEl.classList.toggle('dpdt-pos-a', comp.isClosed);
                    CZ.dragEl.classList.toggle('dpdt-pos-b', !comp.isClosed);
                    CZ.SFX.switchClick();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── Relay toggle (manual on/off when not energized) ──

                // ── Power on/off for output components ──
                const toggleTmpl = comp ? REGISTRY.find(comp.type) : null;
                if (comp && toggleTmpl && toggleTmpl.category === 'output') {
                    comp.isPoweredOff = !comp.isPoweredOff;
                    const tmpl = toggleTmpl;
                    if (comp.isPoweredOff) {
                        comp.currentResistance = EL.SIM.OPEN_CIRCUIT_R;
                        CZ.dragEl.classList.add('powered-off');
                    } else {
                        comp.currentResistance = tmpl ? tmpl.resistance : 100;
                        CZ.dragEl.classList.remove('powered-off');
                    }
                    // Power badge
                    let pwrBadge = CZ.dragEl.querySelector('.power-on-off-badge');
                    if (!pwrBadge) {
                        pwrBadge = document.createElement('div');
                        pwrBadge.className = 'power-on-off-badge';
                        CZ.dragEl.appendChild(pwrBadge);
                    }
                    pwrBadge.textContent = comp.isPoweredOff ? '⏻ OFF' : '⏻ ON';
                    pwrBadge.classList.toggle('off', comp.isPoweredOff);
                    // Immediately reset 7-segment segments when powered off
                    if ((comp.type === 'seven_segment' || comp.type === 'seven_segment_clock') && comp.isPoweredOff) {
                        CZ.dragEl.querySelectorAll('.seg').forEach(s => {
                            s.setAttribute('fill', '#374151');
                            s.style.filter = 'none';
                        });
                        CZ.dragEl.classList.remove('seg7-active');
                    }
                    // Immediately reset matrix dots when powered off
                    if (comp.type === 'led_matrix' && comp.isPoweredOff) {
                        CZ.dragEl.querySelectorAll('.mdot').forEach(d => {
                            d.setAttribute('fill', '#1a2332');
                            d.style.filter = 'none';
                        });
                    }
                    CZ.SFX.switchClick();
                    if (typeof CZ.onArduinoWiresChanged === 'function') CZ.onArduinoWiresChanged();
                    CZ.evaluateCircuit();
                    CZ.saveState();
                }

                // ── Multimeter mode cycling: V → Ω → A → V ──
                if (comp && comp.type === 'voltmeter') {
                    const modes = ['V', 'Ω', 'A'];
                    const modeRes = { V: EL.SIM.METER_HIGH_Z, A: EL.SIM.METER_SHUNT_R, 'Ω': EL.SIM.METER_HIGH_Z };
                    const modeLabel = { V: 'VOLTAGE', A: 'CURRENT', 'Ω': 'RESIST' };
                    const modeColor = { V: '#22c55e', A: '#ef4444', 'Ω': '#f59e0b' };
                    // Arrow rotation: V=0° (top), Ω=120° (bottom-left), A=240° (bottom-right)
                    const modeArrowAngle = { V: 0, 'Ω': 120, A: 240 };
                    const cur = comp.mmMode || 'V';
                    const next = modes[(modes.indexOf(cur) + 1) % 3];
                    comp.mmMode = next;
                    comp.currentResistance = modeRes[next];
                    // Cancel any running voltmeter animation
                    if (comp._vmAnimId) { cancelAnimationFrame(comp._vmAnimId); comp._vmAnimId = null; }
                    comp._vmTarget = 0; comp._vmDisplayV = 0;
                    // Update SVG dial
                    const arrow = CZ.dragEl.querySelector('.mm-dial-arrow');
                    if (arrow) {
                        const angle = modeArrowAngle[next];
                        arrow.setAttribute('transform', `rotate(${angle}, 40, 58)`);
                    }
                    const mLabel = CZ.dragEl.querySelector('.mm-mode-label');
                    if (mLabel) { mLabel.textContent = modeLabel[next]; mLabel.setAttribute('fill', modeColor[next]); }
                    // Highlight active mode label, dim others
                    modes.forEach(m => {
                        const cls = m === 'V' ? '.mm-label-v' : m === 'A' ? '.mm-label-a' : '.mm-label-o';
                        const lbl = CZ.dragEl.querySelector(cls);
                        if (lbl) lbl.setAttribute('fill', m === next ? modeColor[m] : '#6b7280');
                    });
                    // Reset display
                    const rdg = CZ.dragEl.querySelector('.vm-reading');
                    if (rdg) { rdg.textContent = '0.00'; rdg.setAttribute('fill', modeColor[next]); rdg.setAttribute('font-size', '12'); }
                    const unt = CZ.dragEl.querySelector('.vm-unit');
                    if (unt) { unt.textContent = next; unt.setAttribute('fill', modeColor[next]); }
                    // Remove old badge
                    CZ.dragEl.querySelectorAll('.vm-badge').forEach(b => b.remove());
                    CZ.dragEl.classList.remove('vm-active');
                    CZ.SFX.switchClick();
                    // A mode: debounce evaluation (800ms) to let user click through safely
                    // V and Ω modes are safe (high impedance) — evaluate immediately
                    if (comp._mmDebounce) { clearTimeout(comp._mmDebounce); comp._mmDebounce = null; }
                    if (next === 'A') {
                        comp._mmDebounce = setTimeout(() => {
                            comp._mmDebounce = null;
                            CZ.evaluateCircuit();
                        }, 800);
                    } else {
                        CZ.evaluateCircuit();
                    }
                    CZ.saveState();
                }

                // Toggle terminal visibility on tap (touch devices)
                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                if (isTouchDevice) {
                    // Clear others, toggle tapped one
                    document.querySelectorAll('.board-component.show-terminals').forEach(el => {
                        if (el !== CZ.dragEl) el.classList.remove('show-terminals');
                    });
                    CZ.dragEl.classList.toggle('show-terminals');
                }
                } catch (err) { console.error('[CZ] Click handler error:', err); }
            }

            if (CZ.dragEl) { CZ.dragEl.style.opacity = ''; CZ.dragEl.style.zIndex = ''; }
            CZ.isDragging = false; CZ.dragEl = null;
            if (CZ.dragMoved) { CZ.saveState(); }
            CZ.dragMoved = false;

            if (CZ.activeTerm) {
                tmpWire.style.display = 'none';
                const tgt = e.target.closest('.terminal');
                if (tgt) {
                    const tCid = tgt.dataset.cid, tIdx = parseInt(tgt.dataset.tidx);
                    if (tCid !== CZ.activeTerm.cid) {
                        const dup = CZ.wires.some(w =>
                            (w.c1 === CZ.activeTerm.cid && w.i1 === CZ.activeTerm.tidx && w.c2 === tCid && w.i2 === tIdx) ||
                            (w.c2 === CZ.activeTerm.cid && w.i2 === CZ.activeTerm.tidx && w.c1 === tCid && w.i1 === tIdx)
                        );
                        if (!dup) {
                            const colors = ['#94a3b8','#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7'];
                            CZ.wires.push({
                                c1: CZ.activeTerm.cid, i1: CZ.activeTerm.tidx,
                                c2: tCid, i2: tIdx,
                                color: colors[CZ.wires.length % colors.length],
                                energized: false,
                                controlPoints: CZ.getDefaultControlPoints()
                            });
                            CZ.renderWires();
                            CZ.evaluateCircuit();
                            if (typeof CZ.onArduinoWiresChanged === 'function') CZ.onArduinoWiresChanged();
                            CZ.SFX.wireSnap();
                            CZ.saveState();
                        }
                    }
                }
                CZ.activeTerm = null;
            }
        });

        // ── Wire handle click (select) and drag ──
        document.addEventListener('mousedown', e => {
            const handle = e.target.closest('.wire-handle');
            if (handle && e.button === 0) {
                e.stopPropagation();
                const wi = parseInt(handle.dataset.widx);
                const hi = parseInt(handle.dataset.hidx);
                const w = CZ.wires[wi];
                if (!w) return;

                const wireGroup = CZ.groups.find(g => g.members.includes(w.c1) && g.members.includes(w.c2));
                if (wireGroup) return;

                if (!w.controlPoints) w.controlPoints = CZ.getDefaultControlPoints();
                const key = `${wi}:${hi}`;

                if (e.ctrlKey || e.metaKey) {
                    if (CZ.selectedHandles.has(key)) { CZ.selectedHandles.delete(key); handle.classList.remove('handle-selected'); }
                    else { CZ.selectedHandles.add(key); handle.classList.add('handle-selected'); }
                } else {
                    if (!CZ.selectedHandles.has(key)) {
                        CZ.selectedHandles.clear();
                        document.querySelectorAll('.wire-handle.handle-selected').forEach(el => el.classList.remove('handle-selected'));
                        CZ.selectedHandles.add(key);
                        handle.classList.add('handle-selected');
                    }
                }

                const m = CZ.clientToWorkspace(e.clientX, e.clientY);
                const dragHandles = [];
                CZ.selectedHandles.forEach(k => {
                    const [wIdx, hIdx] = k.split(':').map(Number);
                    const wire = CZ.wires[wIdx];
                    if (wire && wire.controlPoints) {
                        dragHandles.push({ wireIdx: wIdx, handleIdx: hIdx, startOffset: { x: wire.controlPoints[hIdx].x, y: wire.controlPoints[hIdx].y } });
                    }
                });
                CZ.activeWireDrag = {
                    wireIdx: wi, handleIdx: hi,
                    startMouse: { x: m.x, y: m.y },
                    startOffset: { x: w.controlPoints[hi].x, y: w.controlPoints[hi].y },
                    allHandles: dragHandles
                };
                return;
            }

            // ── Wire body drag — click anywhere on wire to drag center handle ──
            const hitArea = e.target.closest('.wire-hit-area');
            if (hitArea && e.button === 0) {
                e.stopPropagation();
                const wi = parseInt(hitArea.dataset.widx);
                const w = CZ.wires[wi];
                if (!w) return;

                const wireGroup = CZ.groups.find(g => g.members.includes(w.c1) && g.members.includes(w.c2));
                if (wireGroup) return;

                if (!w.controlPoints) w.controlPoints = CZ.getDefaultControlPoints();
                const hi = 1; // Center handle
                const m = CZ.clientToWorkspace(e.clientX, e.clientY);

                CZ.selectedHandles.clear();
                document.querySelectorAll('.wire-handle.handle-selected').forEach(el => el.classList.remove('handle-selected'));
                const key = `${wi}:${hi}`;
                CZ.selectedHandles.add(key);

                CZ.activeWireDrag = {
                    wireIdx: wi, handleIdx: hi,
                    startMouse: { x: m.x, y: m.y },
                    startOffset: { x: w.controlPoints[hi].x, y: w.controlPoints[hi].y },
                    allHandles: [{ wireIdx: wi, handleIdx: hi, startOffset: { x: w.controlPoints[hi].x, y: w.controlPoints[hi].y } }]
                };
            }
        }, true);

        // ── Wire right-click / long-press ──
        wireLayer.addEventListener('contextmenu', e => {
            const wGroup = e.target.closest('.wire-group');
            if (wGroup) {
                e.preventDefault(); e.stopPropagation();
                const wIdx = parseInt(wGroup.dataset.widx);
                const w = CZ.wires[wIdx];
                if (!w) return;

                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                if (!isTouchDevice) {
                    // Desktop: instant delete
                    CZ.wires.splice(wIdx, 1);
                    if (typeof CZ.onArduinoWiresChanged === 'function') CZ.onArduinoWiresChanged();
                    CZ.renderWires(); CZ.evaluateCircuit();
                    CZ.saveState();
                } else {
                    // Touch: show confirmation menu
                    document.querySelector('.ctx-menu')?.remove();
                    const comp1 = CZ.deployedMap.get(w.c1);
                    const comp2 = CZ.deployedMap.get(w.c2);
                    const t1 = comp1 ? REGISTRY.find(comp1.type) : null;
                    const t2 = comp2 ? REGISTRY.find(comp2.type) : null;
                    const name1 = t1 ? CZ.getCompName(t1) : (comp1?.type || '?');
                    const name2 = t2 ? CZ.getCompName(t2) : (comp2?.type || '?');

                    const menu = document.createElement('div');
                    menu.className = 'ctx-menu';
                    menu.style.left = e.clientX + 'px';
                    menu.style.top = e.clientY + 'px';
                    menu.innerHTML = `
                        <div class="ctx-item" data-action="info">🔌 ${name1} ↔ ${name2}</div>
                        <div class="ctx-sep"></div>
                        <div class="ctx-item danger" data-action="delete">🗑 ${CZ.t('ctxDeleteWire')}</div>
                    `;
                    document.body.appendChild(menu);

                    requestAnimationFrame(() => {
                        const rect = menu.getBoundingClientRect();
                        if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
                        if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
                    });

                    menu.addEventListener('click', ev => {
                        const action = ev.target.closest('.ctx-item')?.dataset.action;
                        if (action === 'delete') {
                            CZ.wires.splice(wIdx, 1);
                            if (typeof CZ.onArduinoWiresChanged === 'function') CZ.onArduinoWiresChanged();
                            CZ.renderWires(); CZ.evaluateCircuit();
                            CZ.saveState();
                        }
                        menu.remove();
                    });

                    const closeMenu = (ev) => {
                        if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', closeMenu); }
                    };
                    setTimeout(() => document.addEventListener('mousedown', closeMenu), 10);
                }
            }
        });

        // ── Component Info Modal ──
        function showComponentInfo(comp, tmpl) {
            document.querySelector('.comp-info-modal')?.remove();

            const name = tmpl ? CZ.getCompName(tmpl) : comp.type;
            const spec = tmpl ? CZ.getCompSpec(tmpl) : '';
            const catLabels = { source: '⚡ Sumber', passive: '🔧 Pasif', control: '🎛 Kontrol', output: '💡 Output' };
            const catLabelsEn = { source: '⚡ Source', passive: '🔧 Passive', control: '🎛 Control', output: '💡 Output' };
            const catMap = CZ.lang === 'en' ? catLabelsEn : catLabels;
            const category = tmpl?.category ? (catMap[tmpl.category] || tmpl.category) : '-';

            // Build spec rows
            const rows = [];
            const addRow = (icon, label, value, unit = '') => {
                if (value !== undefined && value !== null && value !== 0 && value !== false)
                    rows.push({ icon, label, value: typeof value === 'number' ? (value >= 1000 ? (value/1000).toFixed(2) + ' k' : value % 1 !== 0 ? value.toFixed(3) : value) + (unit ? ' ' + unit : '') : value + (unit ? ' ' + unit : '') });
            };

            addRow('⚡', CZ.lang === 'en' ? 'Voltage' : 'Tegangan', tmpl?.voltage, 'V');
            addRow('🔌', CZ.lang === 'en' ? 'Forward Voltage' : 'Tegangan Maju', tmpl?.forwardVoltage, 'V');
            addRow('Ω', CZ.lang === 'en' ? 'Resistance' : 'Resistansi', tmpl?.resistance, 'Ω');
            addRow('⚠', CZ.lang === 'en' ? 'Max Current' : 'Arus Maks', tmpl?.maxCurrent ? (tmpl.maxCurrent * 1000).toFixed(0) : null, 'mA');
            addRow('🔥', CZ.lang === 'en' ? 'Rated Power' : 'Daya Nominal', tmpl?.ratedPower ? (tmpl.ratedPower >= 1 ? tmpl.ratedPower : (tmpl.ratedPower * 1000).toFixed(0) + ' m') : null, tmpl?.ratedPower >= 1 ? 'W' : 'W');
            addRow('🔋', CZ.lang === 'en' ? 'Battery' : 'Baterai', comp.batteryCapacity, 'mAh');
            addRow('📐', CZ.lang === 'en' ? 'Size' : 'Ukuran', tmpl ? `${tmpl.width} × ${tmpl.height}` : null, 'px');

            // Special flags
            const flags = [];
            if (tmpl?.isDiode) flags.push('🔒 Diode');
            if (tmpl?.isSwitch) flags.push('🔀 Switch');
            if (tmpl?.isFuse) flags.push('⚡ Fuse');
            if (tmpl?.isArduino) flags.push('🤖 Arduino');
            if (tmpl?.acOnly) flags.push('🏭 AC Only');
            if (tmpl?.isChargeController) flags.push('☀ Charge Controller');
            if (tmpl?.isMCB) flags.push('⚡ MCB');
            if (tmpl?.isKwhMeter) flags.push('📊 kWh Meter');
            if (tmpl?.isPLN) flags.push('🏢 PLN');
            if (tmpl?.isATS) flags.push('🔄 ATS');

            // Terminals
            const terminals = tmpl?.terminals || [];

            // Connected wires
            const wires = CZ.wires.filter(w => w.c1 === comp.id || w.c2 === comp.id);

            // Connection details
            const connections = wires.map(w => {
                const otherId = w.c1 === comp.id ? w.c2 : w.c1;
                const otherComp = CZ.deployedMap.get(otherId);
                const otherTmpl = otherComp ? REGISTRY.find(otherComp.type) : null;
                const otherName = otherTmpl ? CZ.getCompName(otherTmpl) : otherId;
                const myTermIdx = w.c1 === comp.id ? w.i1 : w.i2;
                const otherTermIdx = w.c1 === comp.id ? w.i2 : w.i1;
                const myTerm = terminals[myTermIdx];
                const otherTerm = otherTmpl?.terminals?.[otherTermIdx];
                return `<div class="ci-conn-row">
                    <span class="ci-conn-pin">${myTerm?.label || myTermIdx}</span>
                    <span class="ci-conn-arrow">→</span>
                    <span class="ci-conn-target">${otherName}</span>
                    <span class="ci-conn-pin">${otherTerm?.label || otherTermIdx}</span>
                </div>`;
            });

            // Status info
            const statusItems = [];
            if (comp.isBroken) statusItems.push('<span class="ci-status-bad">💥 ' + (CZ.lang === 'en' ? 'BROKEN' : 'RUSAK') + '</span>');
            if (comp.isPoweredOff) statusItems.push('<span class="ci-status-off">⏻ OFF</span>');
            if (comp.isClosed === false) statusItems.push('<span class="ci-status-off">◯ ' + (CZ.lang === 'en' ? 'OPEN' : 'TERBUKA') + '</span>');
            if (comp.isFlashed) statusItems.push('<span class="ci-status-good">💾 FLASHED</span>');
            if (comp.rotation) statusItems.push('<span class="ci-status-info">↻ ' + comp.rotation + '°</span>');

            const modal = document.createElement('div');
            modal.className = 'comp-info-modal';
            modal.innerHTML = `
                <div class="ci-backdrop"></div>
                <div class="ci-container">
                    <div class="ci-header">
                        <div class="ci-title-row">
                            <div class="ci-preview">${tmpl?.svg || ''}</div>
                            <div class="ci-title-text">
                                <h2 class="ci-name">${name}</h2>
                                <div class="ci-spec">${spec}</div>
                                <div class="ci-meta">
                                    <span class="ci-category">${category}</span>
                                    <span class="ci-id">${comp.id}</span>
                                    <span class="ci-type">${comp.type}</span>
                                </div>
                            </div>
                            <button class="ci-close" title="Close">✕</button>
                        </div>
                        ${statusItems.length ? `<div class="ci-status-bar">${statusItems.join('')}</div>` : ''}
                    </div>
                    <div class="ci-body">
                        ${rows.length ? `
                        <div class="ci-section">
                            <div class="ci-section-title">${CZ.lang === 'en' ? '⚡ Electrical Properties' : '⚡ Sifat Kelistrikan'}</div>
                            <div class="ci-props-grid">
                                ${rows.map(r => `
                                    <div class="ci-prop">
                                        <span class="ci-prop-icon">${r.icon}</span>
                                        <span class="ci-prop-label">${r.label}</span>
                                        <span class="ci-prop-value">${r.value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>` : ''}

                        ${flags.length ? `
                        <div class="ci-section">
                            <div class="ci-section-title">${CZ.lang === 'en' ? '🏷 Features' : '🏷 Fitur'}</div>
                            <div class="ci-flags">${flags.map(f => `<span class="ci-flag">${f}</span>`).join('')}</div>
                        </div>` : ''}

                        <div class="ci-section">
                            <div class="ci-section-title">${CZ.lang === 'en' ? '🔌 Terminals' : '🔌 Terminal'} (${terminals.length})</div>
                            <div class="ci-terminals">
                                ${terminals.map((t, i) => `
                                    <div class="ci-term">
                                        <span class="ci-term-idx">${i}</span>
                                        <span class="ci-term-label">${t.label || '-'}</span>
                                        <span class="ci-term-pos">x:${t.x} y:${t.y}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="ci-section">
                            <div class="ci-section-title">${CZ.lang === 'en' ? '🔗 Connections' : '🔗 Koneksi'} (${wires.length})</div>
                            ${connections.length ? `<div class="ci-connections">${connections.join('')}</div>` : `<div class="ci-empty">${CZ.lang === 'en' ? 'No connections' : 'Tidak ada koneksi'}</div>`}
                        </div>

                        <div class="ci-section">
                            <div class="ci-section-title">${CZ.lang === 'en' ? '📍 Position' : '📍 Posisi'}</div>
                            <div class="ci-pos">X: ${Math.round(comp.x)} &nbsp; Y: ${Math.round(comp.y)} &nbsp; ${CZ.lang === 'en' ? 'Rotation' : 'Rotasi'}: ${comp.rotation || 0}°</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            requestAnimationFrame(() => modal.classList.add('ci-visible'));

            modal.querySelector('.ci-close').onclick = () => { modal.classList.remove('ci-visible'); setTimeout(() => modal.remove(), 200); };
            modal.querySelector('.ci-backdrop').onclick = () => { modal.classList.remove('ci-visible'); setTimeout(() => modal.remove(), 200); };
        }

        // ── Context menu: right-click component ──
        wCont.addEventListener('contextmenu', e => {
            e.preventDefault();
            const existing = document.querySelector('.ctx-menu');
            if (existing) existing.remove();

            const bComp = e.target.closest('.board-component');
            if (!bComp) return;

            const comp = CZ.deployedMap.get(bComp.id);
            const tmpl = REGISTRY.find(comp?.type);
            const name = tmpl ? CZ.getCompName(tmpl) : (CZ.lang === 'en' ? 'Component' : 'Komponen');
            const isBroken = comp?.isBroken;

            if (!CZ.selectedIds.has(bComp.id) && comp) {
                // Clear previous selection when right-clicking a new unselected component
                CZ.selectedIds.clear();
                document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                CZ.selectedIds.add(comp.id);
                bComp.classList.add('selected');
                CZ.expandSelectionToGroups();
            }

            const isMulti = CZ.selectedIds.size > 1;
            const menu = document.createElement('div');
            menu.className = 'ctx-menu';
            menu.style.left = e.clientX + 'px';
            menu.style.top = e.clientY + 'px';

            let menuItems = '';
            if (isMulti) {
                menuItems += `<div class="ctx-item" data-action="info">🔲 ${CZ.selectedIds.size} ${CZ.t('ctxSelected')}</div>`;
            } else {
                menuItems += `<div class="ctx-item" data-action="info">ℹ️ ${name}${isBroken ? ` <span style="color:#ef4444">${CZ.t('ctxBroken')}</span>` : ''}</div>`;
            }
            menuItems += `<div class="ctx-sep"></div>`;

            if (isBroken && !isMulti) {
                menuItems += `<div class="ctx-item" data-action="reset">🔄 ${CZ.t('ctxRepair')}</div>`;
            }

            const allBatteries = isMulti && [...CZ.selectedIds].every(cid => {
                const c = CZ.deployedMap.get(cid);
                return c && c.batteryCapacity;
            });

            if ((!isMulti && comp?.batteryCapacity) || allBatteries) {
                if (!isMulti) {
                    const dl = CZ.getBattDeadLevel ? CZ.getBattDeadLevel(comp) : 0;
                    const usable = comp.batteryCapacity - dl;
                    const pct = usable > 0 ? Math.max(0, ((comp.batteryLevel - dl) / usable) * 100).toFixed(0) : '0';
                    menuItems += `<div class="ctx-item" data-action="resetbatt">🔋 ${CZ.t('ctxResetBatt')} (${pct}% → 100%)</div>`;
                } else {
                    menuItems += `<div class="ctx-item" data-action="resetbatt">🔋 ${CZ.t('ctxResetAllBatt')} (${CZ.selectedIds.size}) → 100%</div>`;
                }
            }

            // kWh Meter options (copy reading / reset counter)
            if (!isMulti && comp) {
                const kwhTmpl = REGISTRY.find(comp.type);
                if (kwhTmpl && kwhTmpl.isKwhMeter) {
                    const kwh = (comp._kwhTotal || 0).toFixed(2);
                    menuItems += `<div class="ctx-item" data-action="copykwh">📋 ${CZ.t('ctxCopyKwh')} (${kwh})</div>`;
                    menuItems += `<div class="ctx-item" data-action="resetkwh">🔄 ${CZ.t('ctxResetKwh')}</div>`;
                }
            }

            // Arduino IDE option (for touch devices that can't double-click)
            if (!isMulti && comp && tmpl && tmpl.isArduino) {
                const ideLabel = CZ.lang === 'en' ? 'Open Arduino IDE' : 'Buka Arduino IDE';
                menuItems += `<div class="ctx-item" data-action="openide">💻 ${ideLabel}</div>`;
            }

            menuItems += `<div class="ctx-item" data-action="duplicate">📋 ${CZ.t('ctxDuplicate')}${isMulti ? ` (${CZ.selectedIds.size})` : ''}</div>`;
            menuItems += `<div class="ctx-item" data-action="rotate">↻ ${CZ.t('ctxRotate')} (R)${isMulti ? ` (${CZ.selectedIds.size})` : ''}</div>`;
            menuItems += `<div class="ctx-item" data-action="rotaterev">↺ ${CZ.t('ctxRotateRev')} (Shift+R)${isMulti ? ` (${CZ.selectedIds.size})` : ''}</div>`;
            menuItems += `<div class="ctx-item" data-action="copytext">📝 ${CZ.t('ctxCopyText')}</div>`;

            // Variant switching — only for single component with multiple variants
            if (!isMulti && comp) {
                const varGroup = REGISTRY.getGroupForComponent(comp.type);
                if (varGroup && varGroup.variants.length > 1) {
                    const varLabel = CZ.lang === 'en' ? 'Change Variant' : 'Ubah Varian';
                    menuItems += `<div class="ctx-item" data-action="variant" data-group-id="${varGroup.groupId}">🔀 ${varLabel} (${varGroup.variants.length})</div>`;
                }
            }

            menuItems += `<div class="ctx-sep"></div>`;

            const anyInGroup = [...CZ.selectedIds].some(id => CZ.groups.some(g => g.members.includes(id)));
            const allSameGroup = isMulti && CZ.groups.some(g => [...CZ.selectedIds].every(id => g.members.includes(id)));
            if (isMulti && !allSameGroup) {
                menuItems += `<div class="ctx-item" data-action="group">📦 ${CZ.t('ctxGroup')} (Ctrl+G)</div>`;
            }
            if (anyInGroup) {
                menuItems += `<div class="ctx-item" data-action="ungroup">📭 ${CZ.t('ctxUngroup')} (Ctrl+Shift+G)</div>`;
            }
            if (isMulti || anyInGroup) {
                menuItems += `<div class="ctx-sep"></div>`;
            }

            menuItems += `<div class="ctx-item danger" data-action="delete">🗑 ${CZ.t('ctxDelete')}${isMulti ? ` (${CZ.selectedIds.size})` : ''}</div>`;

            menu.innerHTML = menuItems;
            document.body.appendChild(menu);

            requestAnimationFrame(() => {
                const rect = menu.getBoundingClientRect();
                if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
                if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
                if (rect.left < 0) menu.style.left = '8px';
                if (rect.top < 0) menu.style.top = '8px';
            });

            menu.addEventListener('click', ev => {
                const action = ev.target.closest('.ctx-item')?.dataset.action;
                if (action === 'info' && comp && !isMulti) {
                    showComponentInfo(comp, tmpl);
                } else if (action === 'delete') {
                    const idsToDelete = new Set(CZ.selectedIds);
                    idsToDelete.forEach(cid => {
                        CZ.removeDeployed(cid);
                        CZ.wires = CZ.wires.filter(w => w.c1 !== cid && w.c2 !== cid);
                        document.getElementById(cid)?.remove();
                        CZ.groups.forEach(g => { const idx = g.members.indexOf(cid); if (idx >= 0) g.members.splice(idx, 1); });
                    });
                    CZ.groups = CZ.groups.filter(g => g.members.length > 0);
                    CZ.selectedIds.clear();
                    CZ.renderGroupLabels();
                    if (typeof CZ.onArduinoWiresChanged === 'function') CZ.onArduinoWiresChanged();
                    CZ.renderWires(); CZ.evaluateCircuit();
                    CZ.saveState();
                } else if (action === 'openide') {
                    if (comp && typeof CZ.openArduinoIDE === 'function') {
                        CZ.openArduinoIDE(comp.id);
                    }
                } else if (action === 'duplicate') {
                    CZ.duplicateSelected();
                } else if (action === 'copytext') {
                    // Build full circuit topology text — auto-separate independent circuits
                    const selIds = [...CZ.selectedIds];
                    const compMap = {}; // id -> {comp, tmpl, shortName}
                    const compNums = {}; // type -> counter for numbering
                    selIds.forEach(cid => {
                        const c = CZ.deployedMap.get(cid);
                        if (!c) return;
                        const t = REGISTRY.find(c.type);
                        const baseName = t ? CZ.getCompName(t) : c.type;
                        compNums[baseName] = (compNums[baseName] || 0) + 1;
                        compMap[cid] = { comp: c, tmpl: t, baseName };
                    });
                    // If multiple of same type, add numbering
                    const typeCount = {};
                    selIds.forEach(cid => { const m = compMap[cid]; if (m) typeCount[m.baseName] = (typeCount[m.baseName] || 0) + 1; });
                    const typeIdx = {};
                    selIds.forEach(cid => {
                        const m = compMap[cid];
                        if (!m) return;
                        if (typeCount[m.baseName] > 1) {
                            typeIdx[m.baseName] = (typeIdx[m.baseName] || 0) + 1;
                            m.shortName = `${m.baseName} #${typeIdx[m.baseName]}`;
                        } else {
                            m.shortName = m.baseName;
                        }
                    });

                    // Union-Find to group selected components into independent circuits
                    const selectedSet = new Set(selIds);
                    const relevantWires = CZ.wires.filter(w => selectedSet.has(w.c1) && selectedSet.has(w.c2));
                    const ufP = {};
                    selIds.forEach(id => ufP[id] = id);
                    function ufFind(x) { return ufP[x] === x ? x : (ufP[x] = ufFind(ufP[x])); }
                    function ufUnion(a, b) { ufP[ufFind(a)] = ufFind(b); }
                    relevantWires.forEach(w => ufUnion(w.c1, w.c2));

                    // Group components by circuit root
                    const circuitMap = {};
                    selIds.forEach(cid => {
                        if (!compMap[cid]) return;
                        const root = ufFind(cid);
                        if (!circuitMap[root]) circuitMap[root] = [];
                        circuitMap[root].push(cid);
                    });
                    const circuits = Object.values(circuitMap);

                    // Build text per circuit
                    const allLines = [];
                    circuits.forEach((circIds, cIdx) => {
                        if (circuits.length > 1) {
                            if (cIdx > 0) allLines.push('', '');
                            allLines.push(`${CZ.t('copyTitle')} #${cIdx + 1}`, '═══════════════════════');
                        } else {
                            allLines.push(CZ.t('copyTitle'), '═══════════════════════');
                        }

                        // Component list
                        allLines.push('', CZ.t('copyCompLabel'));
                        circIds.forEach(cid => {
                            const m = compMap[cid];
                            if (!m) return;
                            const t = m.tmpl;
                            let info = m.shortName;
                            if (t?.voltage) info += ` (${t.voltage}V)`;
                            else if (t?.resistance) info += ` (${t.resistance}Ω)`;
                            if (m.comp.isBroken) info += ' ⛔ ' + CZ.t('ctxBroken');
                            if (m.comp.rotation) info += ` ↻${((m.comp.rotation % 360) + 360) % 360}°`;
                            allLines.push(`  • ${info}`);
                        });

                        // Connection list
                        const circSet = new Set(circIds);
                        const circWires = relevantWires.filter(w => circSet.has(w.c1) && circSet.has(w.c2));
                        if (circWires.length > 0) {
                            allLines.push('', CZ.t('copyConnLabel'));
                            circWires.forEach((w, i) => {
                                const m1 = compMap[w.c1], m2 = compMap[w.c2];
                                if (!m1 || !m2) return;
                                const t1 = m1.tmpl, t2 = m2.tmpl;
                                const pin1 = t1?.terminals?.[w.i1]?.label || w.i1;
                                const pin2 = t2?.terminals?.[w.i2]?.label || w.i2;
                                allLines.push(`  ${i + 1}. ${m1.shortName} [${pin1}] ──→ [${pin2}] ${m2.shortName}`);
                            });
                        } else {
                            allLines.push('', `⚠ ${CZ.t('copyNoWires')}`);
                        }

                        allLines.push('', `📊 ${CZ.t('copyTotal')}: ${circIds.length} ${CZ.t('copyComponents')}, ${circWires.length} ${CZ.t('copyWires')}`);
                    });

                    const text = allLines.join('\n');
                    navigator.clipboard.writeText(text).then(() => {
                        const circLabel = circuits.length > 1 ? `, ${circuits.length} ${CZ.t('statusCircuits')}` : '';
                        const toast = document.createElement('div');
                        toast.className = 'copy-toast';
                        toast.textContent = `📋 ${CZ.t('copyCopied')} (${selIds.length} ${CZ.t('copyComponents')}, ${relevantWires.length} ${CZ.t('copyWires')}${circLabel})`;
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2500);
                    });
                } else if (action === 'reset' && comp) {
                    CZ.resetComponent(comp.id);
                    CZ.saveState();
                } else if (action === 'resetbatt') {
                    const targets = isMulti ? [...CZ.selectedIds] : (comp ? [comp.id] : []);
                    targets.forEach(cid => {
                        const c = CZ.deployedMap.get(cid);
                        if (!c || !c.batteryCapacity) return;
                        c.batteryLevel = c.batteryCapacity;
                        const t = REGISTRY.find(c.type);
                        if (t) c.voltage = t.voltage;
                        // Clear dead visual state
                        const el = document.getElementById(cid);
                        if (el) {
                            el.classList.remove('battery-dead');
                            el.style.opacity = '';
                            el.dataset.deadLabel = '';
                        }
                    });
                    // Also reset any broken components in the circuit
                    CZ.deployed.forEach(c => {
                        if (c.isBroken) CZ.resetComponent(c.id);
                    });
                    CZ.evaluateCircuit();
                    if (CZ.updateBatteryVisuals) CZ.updateBatteryVisuals();
                    CZ.saveState();
                } else if (action === 'copykwh' && comp) {
                    const kwh = (comp._kwhTotal || 0).toFixed(2);
                    navigator.clipboard.writeText(kwh + ' kWh').then(() => {
                        if (typeof CZ.showToast === 'function') CZ.showToast(`📋 ${kwh} kWh`, 'success');
                    }).catch(() => {});
                } else if (action === 'resetkwh' && comp) {
                    comp._kwhTotal = 0;
                    const kwhLabel = document.getElementById(comp.id)?.querySelector('.kwh-reading');
                    if (kwhLabel) kwhLabel.textContent = '000.00';
                    CZ.saveState();
                } else if (action === 'rotate') {
                    CZ.rotateSelection();
                } else if (action === 'rotaterev') {
                    CZ.rotateSelection(-90);
                } else if (action === 'variant' && comp) {
                    const groupId = ev.target.closest('.ctx-item')?.dataset.groupId;
                    const varGroup = COMPONENT_MANIFEST.find(g => g.groupId === groupId);
                    if (varGroup) {
                        menu.remove();
                        CZ._showVariantMenu(e.clientX, e.clientY, varGroup, 'workspace', comp);
                        return; // Don't remove menu again below
                    }
                } else if (action === 'group') {
                    CZ.groupSelected();
                } else if (action === 'ungroup') {
                    CZ.ungroupSelected();
                }
                menu.remove();
            });

            const closeMenu = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', closeMenu); } };
            setTimeout(() => document.addEventListener('mousedown', closeMenu), 10);
        });

        // ── Long press for touch context menu ──
        let longPressTimer = null;
        let longPressTriggered = false;

        wCont.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            longPressTriggered = false;
            const touch = e.touches[0];
            const startX = touch.clientX, startY = touch.clientY;

            // Don't start long press on terminals (they initiate wiring)
            const el = document.elementFromPoint(startX, startY);
            if (el && el.closest && el.closest('.terminal')) return;

            longPressTimer = setTimeout(() => {
                // Abort only if finger actually moved (it's a drag, not a hold)
                if (CZ.dragMoved) {
                    longPressTimer = null;
                    return;
                }

                // Finger held still for 500ms → this is a long press, not a drag.
                // Clear any drag state that was set by the synthetic mousedown
                // (touchstart → mousedown → isDragging/activeWireDrag set immediately)
                CZ.activeWireDrag = null;
                CZ.activeTerm = null;
                CZ.isDragging = false;
                CZ.dragEl = null;
                CZ.dragMoved = false;

                longPressTriggered = true;
                if (navigator.vibrate) navigator.vibrate(30);

                const target = document.elementFromPoint(startX, startY);
                if (target) {
                    const ctxEvent = new MouseEvent('contextmenu', {
                        bubbles: true, cancelable: true,
                        clientX: startX, clientY: startY, button: 2
                    });
                    target.dispatchEvent(ctxEvent);
                }
            }, 500);

            // Cancel long press if finger moves too much
            const onTouchMove = (ev) => {
                const t = ev.touches[0];
                if (t && (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10)) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                    wCont.removeEventListener('touchmove', onTouchMove);
                }
            };
            wCont.addEventListener('touchmove', onTouchMove, { passive: true });
        }, { passive: true });

        wCont.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            longPressTimer = null;
            // Prevent click if long press was triggered
            if (longPressTriggered) {
                longPressTriggered = false;
            }
        }, { passive: true });

        wCont.addEventListener('touchcancel', () => {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }, { passive: true });

        // ── Arduino double-click → open IDE ──
        wCont.addEventListener('dblclick', e => {
            const compEl = e.target.closest('.board-component');
            if (!compEl) return;
            const comp = CZ.deployedMap.get(compEl.id);
            if (!comp) return;
            const tmpl = REGISTRY.find(comp.type);
            if (tmpl && tmpl.isArduino && typeof CZ.openArduinoIDE === 'function') {
                e.preventDefault();
                e.stopPropagation();
                CZ.openArduinoIDE(comp.id);
            }
        });

        document.addEventListener('keydown', e => {
            // Skip workspace shortcuts when typing in text inputs or Arduino IDE
            const tag = document.activeElement?.tagName;
            const inIDE = document.activeElement?.closest('#arduino-ide-modal');
            if (inIDE || tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (CZ.selectedIds.size > 0) {
                    e.preventDefault();
                    CZ.selectedIds.forEach(cid => {
                        CZ.removeDeployed(cid);
                        CZ.wires = CZ.wires.filter(w => w.c1 !== cid && w.c2 !== cid);
                        document.getElementById(cid)?.remove();
                        CZ.groups.forEach(g => { const idx = g.members.indexOf(cid); if (idx >= 0) g.members.splice(idx, 1); });
                    });
                    CZ.groups = CZ.groups.filter(g => g.members.length > 0);
                    CZ.selectedIds.clear();
                    CZ.renderGroupLabels();
                    if (typeof CZ.onArduinoWiresChanged === 'function') CZ.onArduinoWiresChanged();
                    CZ.renderWires(); CZ.evaluateCircuit();
                    CZ.saveState();
                }
            }
            if (e.key === 'Escape') {
                CZ.selectedIds.clear();
                CZ.selectedHandles.clear();
                document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                document.querySelectorAll('.wire-handle.handle-selected').forEach(el => el.classList.remove('handle-selected'));
                CZ.renderGroupLabels();
            }
            if ((e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.metaKey && !e.altKey) { CZ.setMode('select'); }
            if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey) { CZ.setMode('pan'); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); CZ.performUndo(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey) || (e.key === 'Z' && e.shiftKey))) { e.preventDefault(); CZ.performRedo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey) { e.preventDefault(); CZ.groupSelected(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'G' || (e.key === 'g' && e.shiftKey))) { e.preventDefault(); CZ.ungroupSelected(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); CZ.duplicateSelected(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); CZ.saveFile(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') { e.preventDefault(); CZ.openFile(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A') && !e.shiftKey) {
                e.preventDefault();
                // Select all components
                CZ.selectedIds.clear();
                document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                CZ.deployed.forEach(c => {
                    CZ.selectedIds.add(c.id);
                    document.getElementById(c.id)?.classList.add('selected');
                });
                // Select all wire handles
                CZ.selectedHandles.clear();
                document.querySelectorAll('.wire-handle').forEach(h => {
                    const key = `${h.dataset.widx}:${h.dataset.hidx}`;
                    CZ.selectedHandles.add(key);
                    h.classList.add('handle-selected');
                });
                CZ.expandSelectionToGroups();
                CZ.renderGroupLabels();
            }
            if (e.key === 'r' && !e.shiftKey) {
                if (CZ.selectedIds.size > 0 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    CZ.rotateSelection();
                }
            }
            if (e.key === 'R' && e.shiftKey) {
                if (CZ.selectedIds.size > 0 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    CZ.rotateSelection(-90);
                }
            }
            if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                document.getElementById('btn-mute').click();
            }
        });
    };

    // ── Application Initialization ──
    CZ.init = function() {
        CZ.initDOM();
        CZ.setupCategoryTabs();
        CZ.setupGridHandlers();
        CZ.setupToolbar();
        CZ.setupEvents();
        const hasState = CZ.restoreState();
        CZ.restoreSimState();
        if (!hasState && typeof CZ.loadGreetingCircuit === 'function') {
            // First-time user — show greeting demo circuit
            setTimeout(() => CZ.loadGreetingCircuit(), 300);
        }
        // Push initial state as baseline for undo stack (top = current state)
        CZ.saveState();
        CZ.drawGrid();
        window.addEventListener('resize', CZ.drawGrid);
        CZ.applyTransform();
    };

    // ── Boot ──
    // Init is called by components-loader.js after all component modules are loaded via import()
    // (was previously: document.addEventListener('DOMContentLoaded', CZ.init))

})(window.CZ);
