// CZElectro — UI Module
// Handles: sidebar, groups, status, toolbar button bindings
(function(CZ) {
    'use strict';

    // ── Sidebar rendering ──
    let activeCategory = 'all';
    let searchQuery = '';

    CZ.renderSidebar = function() {
        CZ.listEl.innerHTML = '';
        const catOrder = { source: 0, passive: 1, control: 2, output: 3 };
        const sorted = [...COMPONENTS].sort((a, b) => (catOrder[a.category] ?? 9) - (catOrder[b.category] ?? 9) || a.name.localeCompare(b.name));
        let filtered = activeCategory === 'all' ? sorted : sorted.filter(c => c.category === activeCategory);

        // Apply search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.spec.toLowerCase().includes(q) ||
                c.id.toLowerCase().includes(q)
            );
        }

        if (filtered.length === 0 && searchQuery) {
            const empty = document.createElement('div');
            empty.className = 'sidebar-empty';
            empty.textContent = `${CZ.t('searchEmpty')}: "${searchQuery}"`;
            CZ.listEl.appendChild(empty);
            return;
        }

        filtered.forEach(tmpl => {
            const item = document.createElement('div');
            item.className = 'sidebar-item';
            item.dataset.id = tmpl.id;
            item.innerHTML = `<div class="item-icon">${tmpl.svg}</div>
                <div class="item-details"><span class="item-name">${CZ.getCompName(tmpl)}</span><span class="item-spec">${CZ.getCompSpec(tmpl)}</span></div>`;
            CZ.listEl.appendChild(item);
        });
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
                const c = CZ.deployed.find(d => d.id === id);
                if (!c) return;
                const tmpl = COMPONENTS.find(t => t.id === c.type);
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
            CZ.deployed = []; CZ.wires = []; CZ.groups = [];
            document.querySelectorAll('.group-label-badge').forEach(el => el.remove());
            CZ.renderWires(); CZ.evaluateCircuit();
        });

        // Rotate selected
        document.getElementById('btn-rotate').addEventListener('click', () => {
            CZ.rotateSelection();
        });

        // Mute
        document.getElementById('btn-mute').addEventListener('click', function() {
            CZ.isMuted = !CZ.isMuted;
            this.textContent = CZ.isMuted ? '🔇' : '🔊';
            this.classList.toggle('muted', CZ.isMuted);
            if (CZ.isMuted) CZ.SFX.stopAll();
        });

        // ── Settings Panel ──
        const settingsPanel = document.getElementById('settings-panel');
        const btnSettings = document.getElementById('btn-settings');
        const THEME_KEY = 'czelectro_theme';

        // Apply saved theme on load
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
        CZ.applyTheme = function(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            // Update theme toggle buttons
            document.querySelectorAll('.theme-opt').forEach(b => {
                b.classList.toggle('active', b.dataset.theme === theme);
            });
            localStorage.setItem(THEME_KEY, theme);
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
            localStorage.setItem('czelectro_grid', CZ.showGrid);
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
            if (e.detail === 'day') {
                CZ.simElapsedMin = currentDay * 1440 + 6 * 60;
            } else {
                CZ.simElapsedMin = currentDay * 1440 + 18 * 60;
            }
            CZ.saveSimState();
            CZ.evaluateCircuit();
            if (CZ.simSpeed > 0) CZ.simTick();
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
            const SIDEBAR_KEY = 'czelectro_sidebar';

            CZ.toggleSidebar = function() {
                if (isMobile()) {
                    sidebar.classList.toggle('open');
                    overlay.classList.toggle('visible', sidebar.classList.contains('open'));
                    toggleBtn.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
                } else {
                    sidebar.classList.toggle('collapsed');
                    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
                    localStorage.setItem(SIDEBAR_KEY, sidebar.classList.contains('collapsed') ? 'collapsed' : 'open');
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
    };

})(window.CZ);
