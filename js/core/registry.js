// ═══════════════════════════════════════════════════
// CZElectro — Component Registry
// Single source of truth for all component definitions
// ═══════════════════════════════════════════════════
(function() {
    'use strict';

    class ComponentRegistry {
        constructor() {
            /** @type {Array} All registered component definitions (flat) */
            this.components = [];

            /** @type {Map<string, object>} groupId → { groupId, label, category, file, defaultVariant, variants, loaded } */
            this.groups = new Map();

            /** @type {Map<string, object>} componentId → component definition (for fast lookup) */
            this._index = new Map();

            /** @type {Set<string>} Track loaded component files */
            this._loadedFiles = new Set();

            /** @type {Set<string>} Track injected style IDs */
            this._stylesInjected = new Set();

            /** @type {object} Hooks for behavior delegation (Fase 3) */
            this.hooks = {
                evaluate: {},
                contextMenu: {},
                restore: {},
                reset: {}
            };

            /** @type {Array} Manifest data for sidebar rendering */
            this.manifest = [];
        }

        // ── Initialization ──

        /**
         * Initialize with manifest data (lightweight component catalog)
         * @param {Array} manifest - Array of group definitions
         */
        initManifest(manifest) {
            this.manifest = manifest;
            manifest.forEach(group => {
                this.groups.set(group.groupId, {
                    ...group,
                    loaded: false
                });
            });
        }

        // ── Registration ──

        /**
         * Register a single component definition
         * @param {object} definition - Component definition object
         * @param {string} [groupId] - Optional group ID this component belongs to
         */
        register(definition, groupId) {
            // Avoid duplicate registration
            if (this._index.has(definition.id)) {
                // Update existing definition
                const existing = this._index.get(definition.id);
                Object.assign(existing, definition);
                return existing;
            }

            this.components.push(definition);
            this._index.set(definition.id, definition);

            // Register hooks if provided
            if (definition.onEvaluate) {
                this.hooks.evaluate[definition.id] = definition.onEvaluate;
            }
            if (definition.onContextMenu) {
                this.hooks.contextMenu[definition.id] = definition.onContextMenu;
            }
            if (definition.onRestore) {
                this.hooks.restore[definition.id] = definition.onRestore;
            }
            if (definition.onReset) {
                this.hooks.reset[definition.id] = definition.onReset;
            }

            return definition;
        }

        /**
         * Register a component module (file export)
         * @param {object} mod - Module export: { variants: [...], styles: '...' }
         * @param {string} groupId - Group ID
         */
        registerModule(mod, groupId) {
            if (mod.variants) {
                mod.variants.forEach(v => this.register(v, groupId));
            }
            if (mod.styles) {
                this.injectStyles(groupId, mod.styles);
            }
            // Mark group as loaded
            const group = this.groups.get(groupId);
            if (group) group.loaded = true;
        }

        // ── Lookup ──

        /**
         * Find a component by ID (replaces COMPONENTS.find(t => t.id === id))
         * @param {string} id - Component ID
         * @returns {object|undefined}
         */
        find(id) {
            return this._index.get(id);
        }

        /**
         * Find components by capability
         * Replaces hardcoded TOGGLEABLE_TYPES, AC_TYPES, etc.
         * @param {string} capability - Capability name
         * @returns {Array}
         */
        getByCapability(capability) {
            return this.components.filter(c =>
                c.capabilities && c.capabilities.includes(capability)
            );
        }

        /**
         * Get all component IDs that have a given capability
         * @param {string} capability
         * @returns {string[]}
         */
        getIdsByCapability(capability) {
            return this.getByCapability(capability).map(c => c.id);
        }

        /**
         * Find group by component ID
         * @param {string} componentId
         * @returns {object|undefined}
         */
        findGroupByComponentId(componentId) {
            for (const [, group] of this.groups) {
                if (group.variants.some(v => v.id === componentId)) {
                    return group;
                }
            }
            return undefined;
        }

        /**
         * Get all variants in a group
         * @param {string} groupId
         * @returns {Array}
         */
        getVariants(groupId) {
            const group = this.groups.get(groupId);
            if (!group) return [];
            return group.variants.map(v => this.find(v.id)).filter(Boolean);
        }

        /**
         * Get the manifest group for a given component type ID
         * @param {string} componentId
         * @returns {object|undefined} - Manifest group object (has groupId, variants, etc.)
         */
        getGroupForComponent(componentId) {
            return this.findGroupByComponentId(componentId);
        }

        // ── Dynamic Loading ──

        /**
         * Load a component group file via dynamic import()
         * @param {string} groupId - Group ID from manifest
         * @returns {Promise<void>}
         */
        async load(groupId) {
            const group = this.groups.get(groupId);
            if (!group || group.loaded) return;
            if (this._loadedFiles.has(group.file)) return;

            this._loadedFiles.add(group.file);

            try {
                const mod = await import(`./components/${group.file}`);
                this.registerModule(mod.default, groupId);
            } catch (err) {
                console.error(`[Registry] Failed to load ${group.file}:`, err);
                this._loadedFiles.delete(group.file);
            }
        }

        /**
         * Load a component by its component ID
         * @param {string} componentId
         * @returns {Promise<object|undefined>}
         */
        async loadByComponentId(componentId) {
            // Already loaded?
            const existing = this.find(componentId);
            if (existing) return existing;

            // Find its group
            const group = this.findGroupByComponentId(componentId);
            if (group) {
                await this.load(group.groupId);
                return this.find(componentId);
            }

            console.warn(`[Registry] No group found for component: ${componentId}`);
            return undefined;
        }

        /**
         * Load ALL component files (for initial page load or state restore)
         * @returns {Promise<void>}
         */
        async loadAll() {
            const promises = [];
            for (const [groupId, group] of this.groups) {
                if (!group.loaded) {
                    promises.push(this.load(groupId));
                }
            }
            await Promise.all(promises);
        }

        // ── CSS Injection ──

        /**
         * Inject component-specific CSS styles into the document
         * @param {string} id - Unique style ID (usually groupId)
         * @param {string} css - CSS string to inject
         */
        injectStyles(id, css) {
            if (this._stylesInjected.has(id)) return;
            if (!css || !css.trim()) return;

            const style = document.createElement('style');
            style.id = `czcomp-style-${id}`;
            style.textContent = css;
            document.head.appendChild(style);
            this._stylesInjected.add(id);
        }

        // ── Variant Switching ──

        /**
         * Switch a deployed component to a different variant
         * Preserves position, wires, and state
         * @param {object} comp - Deployed component instance
         * @param {string} newVariantId - Target variant ID
         * @param {object} CZ - CZElectro namespace (for re-rendering)
         * @returns {boolean} Success
         */
        switchVariant(comp, newVariantId, CZ) {
            const newTmpl = this.find(newVariantId);
            if (!newTmpl) return false;

            const el = document.getElementById(comp.id);
            if (!el) return false;

            const oldType = comp.type;

            // Update component data
            comp.type = newVariantId;
            comp.voltage = newTmpl.voltage;
            comp.baseResistance = newTmpl.resistance;
            comp.currentResistance = newTmpl.resistance;
            comp.maxCurrent = newTmpl.maxCurrent || null;
            comp.forwardVoltage = newTmpl.forwardVoltage || 0;
            comp.glowGradient = newTmpl.glowGradient || null;

            // Update battery capacity if applicable
            if (newTmpl.capacityWh) {
                comp.batteryCapacity = newTmpl.capacityWh;
                comp.batteryLevel = newTmpl.capacityWh; // Reset to full
            }

            // Update SVG visual
            const svgEl = el.querySelector('svg');
            if (svgEl) svgEl.remove();
            el.insertAdjacentHTML('afterbegin', newTmpl.svg);

            // Update dimensions
            el.style.width = newTmpl.width + 'px';
            el.style.height = newTmpl.height + 'px';

            // Update terminals (deep copy)
            comp.terminals = JSON.parse(JSON.stringify(newTmpl.terminals));

            // Re-create terminal DOM elements
            el.querySelectorAll('.terminal').forEach(t => t.remove());
            comp.terminals.forEach((term, idx) => {
                const termEl = document.createElement('div');
                termEl.className = 'terminal';
                termEl.dataset.cid = comp.id;
                termEl.dataset.tidx = idx;
                termEl.style.left = (term.x - 8) + 'px';
                termEl.style.top = (term.y - 8) + 'px';
                termEl.dataset.label = term.label || '';
                el.appendChild(termEl);
            });

            // ── Auto-activate: set component to ON state after variant switch ──
            if (newVariantId.startsWith('mcb_')) {
                comp.isClosed = true;
                const toggle = el.querySelector('.mcb-toggle');
                const label = el.querySelector('.mcb-label');
                const indicator = el.querySelector('.mcb-indicator');
                if (toggle) { toggle.setAttribute('fill', '#22c55e'); toggle.setAttribute('y', '25'); }
                if (label) { label.textContent = 'ON'; label.setAttribute('y', '44'); }
                if (indicator) indicator.setAttribute('fill', '#22c55e');
            }
            if (newVariantId === 'switch_toggle') {
                comp.isClosed = true;
                el.classList.add('switch-closed');
            }

            // Re-render wires and evaluate
            if (CZ) {
                CZ.renderWires();
                CZ.evaluateCircuit();
                CZ.saveState();
            }

            return true;
        }
    }

    // ── Create global instance ──
    window.REGISTRY = new ComponentRegistry();

    // ── Backward Compatibility ──
    // Create COMPONENTS as a proxy that delegates to REGISTRY.components
    // This allows all existing COMPONENTS.find() calls (~45 places) to work unchanged
    window.COMPONENTS = new Proxy([], {
        get(target, prop) {
            const components = window.REGISTRY.components;
            if (prop === 'find') return (fn) => components.find(fn);
            if (prop === 'filter') return (fn) => components.filter(fn);
            if (prop === 'forEach') return (fn) => components.forEach(fn);
            if (prop === 'map') return (fn) => components.map(fn);
            if (prop === 'some') return (fn) => components.some(fn);
            if (prop === 'every') return (fn) => components.every(fn);
            if (prop === 'length') return components.length;
            if (prop === 'includes') return (v) => components.includes(v);
            if (prop === Symbol.iterator) return function*() { yield* components; };
            if (typeof prop === 'string' && !isNaN(prop)) return components[parseInt(prop)];
            return components[prop];
        }
    });

})();
