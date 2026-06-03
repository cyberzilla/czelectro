// ═══════════════════════════════════════════════════
// CZElectro — Component Loader (ES Module)
// Uses dynamic import() to load component files
// ═══════════════════════════════════════════════════

(async function() {
    'use strict';

    // Initialize registry with manifest
    REGISTRY.initManifest(COMPONENT_MANIFEST);

    // import() paths are relative to THIS module file's location (js/)
    // So './components/comp.xxx.js' correctly resolves to 'js/components/comp.xxx.js'
    const basePath = './components/';

    // Load ALL component files upfront using dynamic import()
    // We load all at once because:
    // 1. The sidebar needs SVG icons from all components
    // 2. State restore needs all component definitions
    // 3. Total is ~119KB split across 34 files — fast on local server
    const loadPromises = COMPONENT_MANIFEST.map(async (group) => {
        try {
            const mod = await import(basePath + group.file);
            REGISTRY.registerModule(mod.default, group.groupId);
        } catch (err) {
            console.error(`[Loader] Failed to load ${group.file}:`, err);
        }
    });

    await Promise.all(loadPromises);



    // Now that all components are loaded, initialize the application
    CZ.init();
})();
