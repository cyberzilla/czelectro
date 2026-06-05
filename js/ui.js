// CZElectro — UI Module
// Handles: sidebar, groups, status, toolbar button bindings
(function(CZ) {
    'use strict';

    // ── Sidebar rendering ──
    let activeCategory = 'all';
    let searchQuery = '';

    CZ.renderSidebar = function() {
        CZ.listEl.innerHTML = '';
        // Restore interactivity after pre-render cache is replaced
        if (CZ.listEl.dataset.cached) {
            CZ.listEl.style.pointerEvents = '';
            delete CZ.listEl.dataset.cached;
        }
        const catOrder = { source: 0, passive: 1, control: 2, output: 3 };

        // Build grouped sidebar from manifest
        let groups = COMPONENT_MANIFEST.map(group => {
            const defaultTmpl = REGISTRY.find(group.defaultVariant);
            if (!defaultTmpl) return null;
            return {
                group,
                tmpl: defaultTmpl,
                category: group.category,
                variantCount: group.variants.length
            };
        }).filter(Boolean);

        // Sort by category then name
        groups.sort((a, b) => (catOrder[a.category] ?? 9) - (catOrder[b.category] ?? 9) || a.tmpl.name.localeCompare(b.tmpl.name));

        // Category filter
        if (activeCategory !== 'all') {
            groups = groups.filter(g => g.category === activeCategory);
        }

        // Search filter — search across ALL variants in each group
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            groups = groups.filter(g => {
                // Check group label
                if (g.group.label.toLowerCase().includes(q)) return true;
                if (g.group.labelEn && g.group.labelEn.toLowerCase().includes(q)) return true;
                // Check all variants in the group
                return g.group.variants.some(v =>
                    v.label.toLowerCase().includes(q) ||
                    v.spec.toLowerCase().includes(q) ||
                    v.id.toLowerCase().includes(q)
                );
            });
        }

        if (groups.length === 0 && searchQuery) {
            const empty = document.createElement('div');
            empty.className = 'sidebar-empty';
            empty.textContent = `${CZ.t('searchEmpty')}: "${searchQuery}"`;
            CZ.listEl.appendChild(empty);
            return;
        }

        groups.forEach(({ group, tmpl, variantCount }) => {
            const item = document.createElement('div');
            item.className = 'sidebar-item';
            item.dataset.id = tmpl.id;
            item.dataset.groupId = group.groupId;

            const variantBadge = variantCount > 1
                ? `<span class="variant-badge" title="Klik kanan untuk pilih varian">${variantCount}</span>`
                : '';

            // Multi-variant: show group label (e.g. "LED", "Resistor")
            // Single-variant: show component name directly
            const displayName = variantCount > 1
                ? (CZ.lang === 'en' && group.labelEn ? group.labelEn : group.label)
                : CZ.getCompName(tmpl);

            item.innerHTML = `<div class="item-icon">${tmpl.svg}</div>
                <div class="item-details"><span class="item-name">${displayName}${variantBadge}</span><span class="item-spec">${CZ.getCompSpec(tmpl)}</span></div>`;

            // Right-click on sidebar item
            if (variantCount > 1) {
                // Multiple variants → show variant submenu
                item.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    CZ._showVariantMenu(e.clientX, e.clientY, group, 'sidebar');
                });
            } else {
                // Single variant → just disable browser context menu
                item.addEventListener('contextmenu', (e) => e.preventDefault());
            }

            CZ.listEl.appendChild(item);
        });
    };

    // ── Variant Submenu ──
    CZ._showVariantMenu = function(x, y, group, source, deployedComp) {
        // Remove existing menus
        document.querySelector('.ctx-menu')?.remove();
        document.querySelector('.variant-menu')?.remove();

        const menu = document.createElement('div');
        menu.className = 'variant-menu ctx-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';

        const title = CZ.lang === 'en'
            ? `✦ Select Variant — ${group.labelEn || group.label}`
            : `✦ Pilih Varian — ${group.label}`;
        let html = `<div class="ctx-item ctx-title">${title}</div><div class="ctx-sep"></div>`;

        let currentId;
        if (deployedComp) {
            currentId = deployedComp.type;
        } else if (source === 'sidebar') {
            const sItem = CZ.listEl.querySelector(`[data-group-id="${group.groupId}"]`);
            currentId = sItem ? sItem.dataset.id : group.defaultVariant;
        } else {
            currentId = group.defaultVariant;
        }

        group.variants.forEach(v => {
            const isActive = v.id === currentId;
            const tmpl = REGISTRY.find(v.id);
            const label = tmpl ? CZ.getCompName(tmpl) : v.label;
            const spec = tmpl ? CZ.getCompSpec(tmpl) : v.spec;
            html += `<div class="ctx-item${isActive ? ' ctx-active' : ''}" data-variant-id="${v.id}">
                ${isActive ? '✓ ' : '&nbsp;&nbsp;'}${label} <span class="ctx-spec">${spec}</span>
            </div>`;
        });

        menu.innerHTML = html;
        document.body.appendChild(menu);

        // Auto-position: clamp to viewport + max-height with scroll
        requestAnimationFrame(() => {
            const maxH = Math.floor(window.innerHeight * 0.7);
            menu.style.maxHeight = maxH + 'px';
            menu.style.overflowY = 'auto';

            const rect = menu.getBoundingClientRect();
            // Horizontal clamp
            if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
            if (rect.left < 0) menu.style.left = '8px';
            // Vertical: prefer showing below click, flip above if no room
            if (rect.bottom > window.innerHeight) {
                const above = y - rect.height;
                menu.style.top = (above >= 8 ? above : 8) + 'px';
            }
            if (parseFloat(menu.style.top) < 8) menu.style.top = '8px';
        });

        menu.addEventListener('click', ev => {
            const variantId = ev.target.closest('.ctx-item')?.dataset.variantId;
            if (!variantId) return;

            if (source === 'sidebar') {
                // Update sidebar default to selected variant
                const sidebarItem = CZ.listEl.querySelector(`[data-group-id="${group.groupId}"]`);
                if (sidebarItem) {
                    sidebarItem.dataset.id = variantId;
                    const tmpl = REGISTRY.find(variantId);
                    if (tmpl) {
                        const iconEl = sidebarItem.querySelector('.item-icon');
                        const nameEl = sidebarItem.querySelector('.item-name');
                        const specEl = sidebarItem.querySelector('.item-spec');
                        if (iconEl) iconEl.innerHTML = tmpl.svg;
                        if (nameEl) {
                            const badge = nameEl.querySelector('.variant-badge');
                            nameEl.textContent = CZ.getCompName(tmpl);
                            if (badge) nameEl.appendChild(badge);
                        }
                        if (specEl) specEl.textContent = CZ.getCompSpec(tmpl);
                    }
                }
            } else if (source === 'workspace' && deployedComp) {
                // Switch variant on deployed component
                REGISTRY.switchVariant(deployedComp, variantId, CZ);
            }

            menu.remove();
        });

        // Close on outside click
        const closeHandler = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('mousedown', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', closeHandler), 0);
    };

    // Alias for i18n language switch callback
    CZ.renderComponentList = function() { CZ.renderSidebar(); };

    // ── Category Tabs ──
    CZ.setupCategoryTabs = function() {
        document.querySelectorAll('.cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelector('.cat-tab.active')?.classList.remove('active');
                tab.classList.add('active');
                activeCategory = tab.dataset.cat;
                CZ.renderSidebar();
            });
        });

        // Search input
        const searchInput = document.getElementById('comp-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value.trim();
                CZ.renderSidebar();
            });
            // Prevent keyboard shortcuts while typing in search
            searchInput.addEventListener('keydown', (e) => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    searchQuery = '';
                    CZ.renderSidebar();
                    searchInput.blur();
                }
            });
        }

        CZ.renderSidebar();
    };

    // ── Group Selection Expansion ──
    CZ.expandSelectionToGroups = function() {
        let changed = true;
        while (changed) {
            changed = false;
            CZ.selectedIds.forEach(id => {
                const grp = CZ.groups.find(g => g.members.includes(id));
                if (grp) {
                    grp.members.forEach(mid => {
                        if (!CZ.selectedIds.has(mid)) {
                            CZ.selectedIds.add(mid);
                            document.getElementById(mid)?.classList.add('selected');
                            changed = true;
                        }
                    });
                }
            });
        }
    };

    // ── Group / Ungroup ──
    CZ.groupSelected = function() {
        if (CZ.selectedIds.size < 2) return;
        const memberIds = [...CZ.selectedIds];
        const existingGroup = CZ.groups.find(g => memberIds.every(id => g.members.includes(id)));
        if (existingGroup) return;

        memberIds.forEach(id => {
            CZ.groups.forEach(g => { const idx = g.members.indexOf(id); if (idx >= 0) g.members.splice(idx, 1); });
        });
        CZ.groups = CZ.groups.filter(g => g.members.length > 0);

        CZ.groupCounter++;
        const newGroup = { id: `grp_${CZ.groupCounter}`, members: memberIds, label: '' };
        CZ.groups.push(newGroup);

        memberIds.forEach(id => { document.getElementById(id)?.classList.add('grouped'); });
        CZ.renderGroupLabels();
        CZ.saveState();
    };

    CZ.ungroupSelected = function() {
        const memberIds = [...CZ.selectedIds];
        let changed = false;
        memberIds.forEach(id => {
            const gi = CZ.groups.findIndex(g => g.members.includes(id));
            if (gi >= 0) {
                CZ.groups[gi].members.forEach(mid => { document.getElementById(mid)?.classList.remove('grouped'); });
                CZ.groups.splice(gi, 1);
                changed = true;
            }
        });
        if (changed) { CZ.renderGroupLabels(); CZ.saveState(); }
    };

    CZ.renderGroupLabels = function() {
        document.querySelectorAll('.group-label-badge').forEach(el => {
            try { el.remove(); } catch(e) {}
        });
        CZ.groups.forEach(g => {
            if (!g.label && !CZ.selectedIds.size) return;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let hasMembers = false;
            g.members.forEach(id => {
                const c = CZ.deployedMap.get(id);
                if (!c) return;
                const tmpl = REGISTRY.find(c.type);
                if (!tmpl) return;
                hasMembers = true;
                minX = Math.min(minX, c.x); minY = Math.min(minY, c.y);
                maxX = Math.max(maxX, c.x + tmpl.width); maxY = Math.max(maxY, c.y + tmpl.height);
            });
            if (!hasMembers) return;

            const isGroupSelected = g.members.some(id => CZ.selectedIds.has(id));
            const badge = document.createElement('div');
            badge.className = 'group-label-badge';
            if (isGroupSelected) badge.classList.add('group-selected');
            badge.dataset.gid = g.id;
            badge.style.left = `${(minX + maxX) / 2}px`;
            badge.style.top = `${minY - 22}px`;

            if (isGroupSelected) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'group-label-input';
                input.placeholder = '';
                input.value = g.label || '';
                input.addEventListener('input', () => { g.label = input.value; });
                input.addEventListener('blur', () => { CZ.renderGroupLabels(); CZ.saveState(); });
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') { input.blur(); e.preventDefault(); }
                    e.stopPropagation();
                });
                badge.appendChild(input);
                requestAnimationFrame(() => { if (!g.label) input.focus(); });
            } else if (g.label) {
                badge.textContent = g.label;
                badge.style.cursor = 'pointer';
                badge.style.pointerEvents = 'auto';
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Clear previous selection
                    CZ.selectedIds.clear();
                    CZ.selectedHandles.clear();
                    document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                    document.querySelectorAll('.wire-handle.handle-selected').forEach(el => el.classList.remove('handle-selected'));
                    // Select all group members
                    g.members.forEach(mid => {
                        CZ.selectedIds.add(mid);
                        document.getElementById(mid)?.classList.add('selected');
                    });
                    CZ.renderGroupLabels();
                });
            } else {
                return;
            }

            CZ.ws.appendChild(badge);
        });
    };

    // ── Toolbar button bindings ──
    CZ.setupToolbar = function() {
        document.getElementById('btn-undo').onclick = CZ.performUndo;
        document.getElementById('btn-redo').onclick = CZ.performRedo;
        document.getElementById('btn-group').onclick = CZ.groupSelected;
        document.getElementById('btn-ungroup').onclick = CZ.ungroupSelected;

        // ── Save File ──
        CZ.saveFile = function() {
            const snapshot = CZ.getSnapshot();
            const data = JSON.parse(snapshot);
            const fileData = {
                version: '1.0',
                app: 'CZElectro',
                savedAt: new Date().toISOString(),
                components: data.deployed.length,
                wires: data.wires.length,
                state: data
            };
            const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const name = prompt(CZ.t('savePrompt'), (CZ.lang === 'en' ? 'circuit-' : 'rangkaian-') + new Date().toISOString().slice(0,10));
            if (!name) return;
            a.href = url;
            a.download = name.replace(/[^a-zA-Z0-9_\-]/g, '_') + '.cze';
            a.click();
            URL.revokeObjectURL(url);

            // Toast
            const toast = document.createElement('div');
            toast.className = 'copy-toast';
            toast.textContent = `💾 "${name}" ${CZ.t('toastSaved')} (${data.deployed.length} ${CZ.t('copyComponents')}, ${data.wires.length} ${CZ.t('copyWires')})`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        };

        document.getElementById('btn-save').addEventListener('click', CZ.saveFile);

        // ── Open File ──
        const fileInput = document.getElementById('file-input');

        CZ.openFile = function() {
            fileInput.click();
        };

        document.getElementById('btn-open').addEventListener('click', CZ.openFile);

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const raw = JSON.parse(ev.target.result);
                    // Support both wrapped format (.cze) and raw snapshot
                    const stateData = raw.state || raw;

                    if (!stateData.deployed || !Array.isArray(stateData.deployed)) {
                        alert('❌ ' + CZ.t('toastInvalidFile'));
                        return;
                    }

                    const json = JSON.stringify(stateData);
                    CZ.applySnapshot(json);
                    CZ.saveState();

                    // Toast
                    const toast = document.createElement('div');
                    toast.className = 'copy-toast';
                    toast.textContent = `📂 "${file.name}" ${CZ.t('toastLoaded')} (${stateData.deployed.length} ${CZ.t('copyComponents')}, ${stateData.wires.length} ${CZ.t('copyWires')})`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2500);
                } catch (err) {
                    alert('❌ ' + CZ.t('toastFileError') + ': ' + err.message);
                }
            };
            reader.readAsText(file);
            fileInput.value = ''; // Reset agar bisa buka file yang sama lagi
        });

        // Clear all
        document.getElementById('btn-clear').addEventListener('click', () => {
            if (!CZ.deployed.length) return;
            if (!confirm(CZ.t('confirmClearAll'))) return;
            CZ.deployed.forEach(c => document.getElementById(c.id)?.remove());
            CZ.deployed = []; CZ.deployedMap.clear(); CZ.wires = []; CZ.groups = [];
            document.querySelectorAll('.group-label-badge').forEach(el => el.remove());
            CZ.renderWires(); CZ.evaluateCircuit();
        });

        // Rotate selected
        document.getElementById('btn-rotate').addEventListener('click', () => {
            CZ.rotateSelection();
        });

        // Mute — restore saved preference
        const btnMute = document.getElementById('btn-mute');
        const savedMute = CZ.getSetting('muted');
        if (savedMute === 'true') {
            CZ.isMuted = true;
            btnMute.textContent = '🔇';
            btnMute.classList.add('muted');
        }

        btnMute.addEventListener('click', function() {
            CZ.isMuted = !CZ.isMuted;
            this.textContent = CZ.isMuted ? '🔇' : '🔊';
            this.classList.toggle('muted', CZ.isMuted);
            CZ.setSetting('muted', CZ.isMuted);
            if (CZ.isMuted) CZ.SFX.stopAll();
        });

        const settingsPanel = document.getElementById('settings-panel');
        const btnSettings = document.getElementById('btn-settings');

        // Apply saved theme on load
        const savedTheme = CZ.getSetting('theme', 'dark');
        CZ.applyTheme = function(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            // Update theme toggle buttons
            document.querySelectorAll('.theme-opt').forEach(b => {
                b.classList.toggle('active', b.dataset.theme === theme);
            });
            CZ.setSetting('theme', theme);
            CZ.drawGrid();
        };
        CZ.applyTheme(savedTheme);

        // Settings toggle
        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('hidden');
            btnSettings.classList.toggle('active', !settingsPanel.classList.contains('hidden'));
        });

        // Close settings when clicking outside
        document.addEventListener('mousedown', (e) => {
            if (!settingsPanel.classList.contains('hidden') &&
                !settingsPanel.contains(e.target) &&
                e.target !== btnSettings) {
                settingsPanel.classList.add('hidden');
                btnSettings.classList.remove('active');
            }
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', (e) => {
            const btn = e.target.closest('.theme-opt');
            if (!btn) return;
            CZ.applyTheme(btn.dataset.theme);
        });

        // Grid toggle in settings panel
        const settingsGrid = document.getElementById('settings-grid');
        settingsGrid.checked = CZ.showGrid;
        settingsGrid.addEventListener('change', () => {
            CZ.showGrid = settingsGrid.checked;
            CZ.setSetting('grid', CZ.showGrid);
            CZ.drawGrid();
        });

        // Language toggle in settings panel
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            // Restore saved language on load
            document.querySelectorAll('.lang-opt').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === CZ.lang);
            });
            langToggle.addEventListener('click', (e) => {
                const btn = e.target.closest('.lang-opt');
                if (!btn) return;
                CZ.setLanguage(btn.dataset.lang);
            });
        }
        // Apply translations on initial load
        CZ.applyTranslations();

        // Simulation event listeners
        document.addEventListener('sim-speed', (e) => CZ.startSim(e.detail));
        document.addEventListener('sim-reset', () => CZ.resetBatteries());
        document.addEventListener('sim-jump', (e) => {
            const currentDay = Math.floor(CZ.simElapsedMin / 1440);
            const currentHourMin = CZ.simElapsedMin % 1440; // minutes within current day
            if (e.detail === 'day') {
                const targetMin = 6 * 60; // 06:00
                // If already past 06:00, jump to next day's 06:00
                CZ.simElapsedMin = currentHourMin >= targetMin
                    ? (currentDay + 1) * 1440 + targetMin
                    : currentDay * 1440 + targetMin;
            } else {
                const targetMin = 18 * 60; // 18:00
                // If already past 18:00, jump to next day's 18:00
                CZ.simElapsedMin = currentHourMin >= targetMin
                    ? (currentDay + 1) * 1440 + targetMin
                    : currentDay * 1440 + targetMin;
            }
            CZ.saveSimState();
            CZ.evaluateCircuit();
            // Always update sim panel after jumping (even when paused)
            CZ.simTick();
        });

        // ── Toolbar drag-to-scroll (desktop) ──
        const toolbar = document.getElementById('toolbar');
        if (toolbar) {
            let isDragScroll = false, startX = 0, scrollStart = 0;
            toolbar.addEventListener('mousedown', (e) => {
                // Only activate on empty area or separator, not buttons
                if (e.target.closest('.tb-btn') || e.target.closest('.tb-label')) return;
                isDragScroll = true;
                startX = e.clientX;
                scrollStart = toolbar.scrollLeft;
                toolbar.style.cursor = 'grabbing';
                e.preventDefault();
            });
            document.addEventListener('mousemove', (e) => {
                if (!isDragScroll) return;
                toolbar.scrollLeft = scrollStart - (e.clientX - startX);
            });
            document.addEventListener('mouseup', () => {
                if (isDragScroll) {
                    isDragScroll = false;
                    toolbar.style.cursor = '';
                }
            });
            // Wheel → horizontal scroll on toolbar
            toolbar.addEventListener('wheel', (e) => {
                if (toolbar.scrollWidth > toolbar.clientWidth) {
                    e.preventDefault();
                    toolbar.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }

        // ── Sidebar Toggle ──
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (sidebar && toggleBtn) {
            // Create overlay for mobile
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            const isMobile = () => window.innerWidth <= 768;
            CZ.toggleSidebar = function() {
                if (isMobile()) {
                    sidebar.classList.toggle('open');
                    overlay.classList.toggle('visible', sidebar.classList.contains('open'));
                    toggleBtn.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
                } else {
                    sidebar.classList.toggle('collapsed');
                    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
                    CZ.setSetting('sidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'open');
                    setTimeout(() => CZ.drawGrid(), 360);
                }
            };

            // Redraw grid if sidebar was pre-collapsed by inline script
            if (!isMobile() && sidebar.classList.contains('collapsed')) {
                setTimeout(() => CZ.drawGrid(), 400);
            }

            toggleBtn.addEventListener('click', CZ.toggleSidebar);

            // Close sidebar when clicking overlay (mobile)
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
                toggleBtn.textContent = '☰';
            });

            // Tab key toggles sidebar
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    const active = document.activeElement;
                    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
                    e.preventDefault();
                    CZ.toggleSidebar();
                }
            });

            // Auto-close sidebar on mobile after spawning component
            CZ._closeMobileSidebar = function() {
                if (isMobile() && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('visible');
                    toggleBtn.textContent = '☰';
                }
            };
        }

        // ── Import / Export JSON ──
        const importModal = document.getElementById('import-modal');
        const importInput = document.getElementById('import-json-input');
        const importConfirm = document.getElementById('import-json-confirm');
        const importCancel = document.getElementById('import-json-cancel');
        const btnImport = document.getElementById('btn-import-json');
        const btnExport = document.getElementById('btn-export-json');

        if (btnExport) {
            btnExport.addEventListener('click', () => {
                try {
                    let exportData;
                    let label;

                    if (CZ.selectedIds.size > 0) {
                        // Export only selected components + their interconnecting wires
                        const selIds = new Set(CZ.selectedIds);
                        const selComps = CZ.deployed.filter(c => selIds.has(c.id));
                        const selWires = CZ.wires.filter(w => selIds.has(w.c1) && selIds.has(w.c2));
                        const selGroups = CZ.groups.filter(g => g.members.some(m => selIds.has(m)))
                            .map(g => ({ ...g, members: g.members.filter(m => selIds.has(m)) }))
                            .filter(g => g.members.length > 0);

                        exportData = {
                            deployed: selComps.map(c => ({
                                id: c.id, type: c.type, x: c.x, y: c.y,
                                isBroken: c.isBroken, isClosed: c.isClosed,
                                isPoweredOff: c.isPoweredOff || false,
                                mmMode: c.mmMode || undefined,
                                currentResistance: c.currentResistance,
                                rotation: c.rotation || 0,
                                batteryLevel: c.batteryLevel,
                                batteryCapacity: c.batteryCapacity,
                                arduinoCode: c.arduinoCode ? btoa(unescape(encodeURIComponent(c.arduinoCode))) : undefined,
                                tempCode: c._tempCode ? btoa(unescape(encodeURIComponent(c._tempCode))) : undefined,
                                isFlashed: c.isFlashed || undefined,
                                pinLayoutVersion: c._pinLayoutVersion || undefined
                            })),
                            wires: selWires.map(w => ({
                                c1: w.c1, i1: w.i1, c2: w.c2, i2: w.i2,
                                color: w.color,
                                controlPoints: w.controlPoints
                            })),
                            groups: selGroups,
                            counter: CZ.counter
                        };
                        label = `📤 ${selComps.length} komponen, ${selWires.length} kabel (seleksi)`;
                    } else {
                        // Export full circuit
                        exportData = JSON.parse(CZ.getFullSnapshot());
                        label = `📤 ${exportData.deployed.length} komponen, ${exportData.wires.length} kabel (semua)`;
                    }

                    const json = JSON.stringify(exportData, null, 2);
                    navigator.clipboard.writeText(json).then(() => {
                        btnExport.textContent = '✓';
                        setTimeout(() => btnExport.textContent = '📤', 1500);
                        // Toast notification
                        const toast = document.createElement('div');
                        toast.className = 'copy-toast';
                        toast.textContent = label + ' — disalin ke clipboard';
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2500);
                    });
                } catch (e) {
                    alert('Export failed: ' + e.message);
                }
            });
        }

        if (btnImport && importModal) {
            const btnMerge = document.getElementById('import-json-merge');

            btnImport.addEventListener('click', () => {
                importInput.value = '';
                importModal.classList.remove('hidden');
                importInput.focus();
            });

            importCancel.addEventListener('click', () => {
                importModal.classList.add('hidden');
            });


            // Parse and validate input JSON
            function parseImportJSON() {
                const raw = importInput.value.trim();
                if (!raw) return null;
                try {
                    const state = JSON.parse(raw);
                    if (!state.deployed || !Array.isArray(state.deployed)) {
                        alert('Invalid circuit JSON: missing "deployed" array');
                        return null;
                    }
                    if (!state.wires) state.wires = [];
                    if (!state.groups) state.groups = [];
                    return state;
                } catch (e) {
                    alert('Invalid JSON: ' + e.message);
                    return null;
                }
            }

            // ── Replace mode: replaces entire circuit ──
            importConfirm.addEventListener('click', () => {
                const state = parseImportJSON();
                if (!state) return;
                if (!state.counter) state.counter = state.deployed.length;
                CZ.applySnapshot(JSON.stringify(state));
                CZ.saveState();
                importModal.classList.add('hidden');

                const toast = document.createElement('div');
                toast.className = 'copy-toast';
                toast.textContent = `🔄 Rangkaian diganti — ${state.deployed.length} komponen, ${state.wires.length} kabel`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
            });

            // ── Merge mode: adds to existing circuit ──
            if (btnMerge) {
                btnMerge.addEventListener('click', () => {
                    const state = parseImportJSON();
                    if (!state) return;

                    // If workspace is empty, just apply directly
                    if (CZ.deployed.length === 0) {
                        if (!state.counter) state.counter = state.deployed.length;
                        CZ.applySnapshot(JSON.stringify(state));
                        CZ.saveState();
                        importModal.classList.add('hidden');
                        const toast = document.createElement('div');
                        toast.className = 'copy-toast';
                        toast.textContent = `➕ ${state.deployed.length} komponen, ${state.wires.length} kabel ditambahkan`;
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2500);
                        return;
                    }

                    // Calculate position offset to avoid overlap
                    let maxX = -Infinity;
                    CZ.deployed.forEach(c => {
                        const tmpl = REGISTRY.find(c.type);
                        const w = tmpl ? tmpl.width : 80;
                        maxX = Math.max(maxX, c.x + w);
                    });
                    let minImportX = Infinity;
                    state.deployed.forEach(c => { minImportX = Math.min(minImportX, c.x); });
                    const offsetX = (maxX + 50) - minImportX;

                    // Remap IDs to avoid collisions
                    const idMap = {};
                    state.deployed.forEach(saved => {
                        CZ.counter++;
                        const newId = `comp_${CZ.counter}`;
                        idMap[saved.id] = newId;
                        saved.id = newId;
                        saved.x += offsetX;
                    });

                    // Remap wire references
                    state.wires.forEach(w => {
                        w.c1 = idMap[w.c1] || w.c1;
                        w.c2 = idMap[w.c2] || w.c2;
                    });

                    // Remap group member references
                    state.groups.forEach(g => {
                        g.members = g.members.map(m => idMap[m] || m);
                        CZ.groupCounter++;
                        g.id = `grp_${CZ.groupCounter}`;
                    });

                    // Build a snapshot that combines existing + new
                    const combined = JSON.parse(CZ.getSnapshot());
                    combined.deployed.push(...state.deployed);
                    combined.wires.push(...state.wires);
                    combined.groups.push(...state.groups);
                    combined.counter = CZ.counter;

                    // Apply combined state
                    CZ.applySnapshot(JSON.stringify(combined));

                    // Auto-select the newly added components
                    CZ.selectedIds.clear();
                    CZ.selectedHandles.clear();
                    document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
                    Object.values(idMap).forEach(newId => {
                        CZ.selectedIds.add(newId);
                        document.getElementById(newId)?.classList.add('selected');
                    });

                    CZ.saveState();
                    importModal.classList.add('hidden');

                    const toast = document.createElement('div');
                    toast.className = 'copy-toast';
                    toast.textContent = `➕ ${state.deployed.length} komponen, ${state.wires.length} kabel ditambahkan ke rangkaian`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2500);
                });
            }
        }
    };

})(window.CZ);
