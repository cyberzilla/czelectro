// CZElectro — Internationalization (i18n) Module
// Handles: language dictionaries, dynamic text translation
(function(CZ) {
    'use strict';

    // ── Language Dictionaries ──
    const DICT = {
        id: {
            // Sidebar
            appSubtitle: 'Lab Elektronika Interaktif',
            pageTitle: 'CZElectro — Lab Elektronika',
            metaDescription: 'CZElectro - Simulasi Lab Elektronika interaktif dengan drag-drop komponen, kabel fleksibel, dan animasi realistis.',
            searchPlaceholder: 'Cari komponen...',
            searchEmpty: 'Tidak ditemukan',
            catAll: 'Semua',
            catSource: 'Sumber',
            catPassive: 'Pasif',
            catOutput: 'Output',
            catAC: 'AC',
            catTool: 'Alat',

            // Toolbar tooltips
            tipUndo: 'Urungkan (Ctrl+Z)',
            tipRedo: 'Ulangi (Ctrl+Y)',
            tipSave: 'Simpan File (Ctrl+S)',
            tipOpen: 'Buka File (Ctrl+O)',
            tipZoomIn: 'Perbesar',
            tipZoomOut: 'Perkecil',
            tipFit: 'Sesuaikan Tampilan',
            tipSelect: 'Mode Seleksi (V)',
            tipPan: 'Mode Geser (H)',
            tipRotate: 'Putar 90° (R)',
            tipGroup: 'Kelompokkan (Ctrl+G)',
            tipUngroup: 'Lepas Kelompok (Ctrl+Shift+G)',
            tipMute: 'Suara Aktif/Mati (M)',
            tipClear: 'Hapus Semua',
            tipSettings: 'Pengaturan',

            // Settings panel
            settingsTitle: '⚙️ Pengaturan',
            settingsAppearance: '🎨 Tampilan',
            settingsTheme: 'Tema',
            settingsGrid: 'Grid',
            settingsLang: '🌐 Bahasa',
            settingsLangLabel: 'Bahasa',

            // Status bar
            statusNoCircuit: 'Belum Ada Rangkaian',
            statusOpenCircuit: 'Rangkaian Terbuka',
            statusActive: 'Rangkaian Aktif',
            statusCircuits: 'Rangkaian Aktif',
            statusParts: 'komponen',
            statusSource: 'Sumber',
            statusLoad: 'Beban',
            statusEnough: '(Cukup)',
            statusNotEnough: '(Kurang!)',
            simLabel: '🔋 Simulasi:',

            // Context menu
            ctxRotate: 'Putar 90°',
            ctxReset: 'Reset Komponen',
            ctxDelete: 'Hapus',
            ctxGroup: 'Kelompokkan',
            ctxUngroup: 'Lepas Kelompok',
            ctxCopyCircuit: 'Salin Info Rangkaian',
            ctxDeleteWire: 'Hapus Kabel',
            ctxWireColor: 'Warna Kabel',
            ctxDuplicate: 'Duplikat',
            ctxRepair: 'Reset / Perbaiki',
            ctxResetBatt: 'Reset Baterai',
            ctxResetAllBatt: 'Reset Semua Baterai',
            ctxCopyText: 'Salin Teks Rangkaian',
            confirmClearAll: 'Hapus semua komponen?',
            ctxSelected: 'komponen dipilih',
            ctxBroken: '(RUSAK)',
            copyNoWires: 'Tidak ada kabel antar komponen yang dipilih',
            copyTotal: 'Total',
            copyComponents: 'komponen',
            copyWires: 'kabel',
            copyCopied: 'Teks rangkaian disalin!',
            copyTitle: '📋 RANGKAIAN ELEKTRONIK',
            copyCompLabel: '🔧 Komponen:',
            copyConnLabel: '🔌 Koneksi:',
            savePrompt: 'Nama rangkaian:',
            toastSaved: 'tersimpan!',
            toastLoaded: 'dimuat!',
            toastInvalidFile: 'Format file tidak valid!',
            toastFileError: 'Gagal membuka file',

            // Battery sim
            simDay: 'Hari',
            simPause: '⏸ JEDA',
            simNoAC: '⚠ TANPA AC',
            simPowerLow: '⚠ DAYA KURANG',
            simProtect: '⚡ PROTEKSI',
            simLimit: '⚡ BATAS',
            simNoPower: '⛔ TANPA DAYA',
            simInputLow: '⚠ INPUT KURANG',
            battDead: '💀 HABIS',

            // Effects
            effectBurnt: '⚡ TERBAKAR!',

            // Instructions
            instrTitle: '📋 Cara Pakai',
            instrDrag: 'Seret komponen dari panel kiri',
            instrConnect: 'Klik terminal untuk menghubungkan',
            instrSwitch: 'Klik saklar untuk ON/OFF',
            instrRight: 'Klik kanan untuk opsi lainnya',
        },
        en: {
            // Sidebar
            appSubtitle: 'Interactive Electronics Lab',
            pageTitle: 'CZElectro — Electronics Lab',
            metaDescription: 'CZElectro - Interactive Electronics Lab Simulator with drag-drop components, flexible wires, and realistic animations.',
            searchPlaceholder: 'Search components...',
            searchEmpty: 'Not found',
            catAll: 'All',
            catSource: 'Source',
            catPassive: 'Passive',
            catOutput: 'Output',
            catAC: 'AC',
            catTool: 'Tool',

            // Toolbar tooltips
            tipUndo: 'Undo (Ctrl+Z)',
            tipRedo: 'Redo (Ctrl+Y)',
            tipSave: 'Save File (Ctrl+S)',
            tipOpen: 'Open File (Ctrl+O)',
            tipZoomIn: 'Zoom In',
            tipZoomOut: 'Zoom Out',
            tipFit: 'Fit View',
            tipSelect: 'Select Mode (V)',
            tipPan: 'Pan Mode (H)',
            tipRotate: 'Rotate 90° (R)',
            tipGroup: 'Group (Ctrl+G)',
            tipUngroup: 'Ungroup (Ctrl+Shift+G)',
            tipMute: 'Mute/Unmute (M)',
            tipClear: 'Clear All',
            tipSettings: 'Settings',

            // Settings panel
            settingsTitle: '⚙️ Settings',
            settingsAppearance: '🎨 Appearance',
            settingsTheme: 'Theme',
            settingsGrid: 'Grid',
            settingsLang: '🌐 Language',
            settingsLangLabel: 'Language',

            // Status bar
            statusNoCircuit: 'No Circuit',
            statusOpenCircuit: 'Open Circuit',
            statusActive: 'Circuit Active',
            statusCircuits: 'Circuits Active',
            statusParts: 'parts',
            statusSource: 'Source',
            statusLoad: 'Load',
            statusEnough: '(OK)',
            statusNotEnough: '(Insufficient!)',
            simLabel: '🔋 Simulation:',

            // Context menu
            ctxRotate: 'Rotate 90°',
            ctxReset: 'Reset Component',
            ctxDelete: 'Delete',
            ctxGroup: 'Group',
            ctxUngroup: 'Ungroup',
            ctxCopyCircuit: 'Copy Circuit Info',
            ctxDeleteWire: 'Delete Wire',
            ctxWireColor: 'Wire Color',
            ctxDuplicate: 'Duplicate',
            ctxRepair: 'Reset / Repair',
            ctxResetBatt: 'Reset Battery',
            ctxResetAllBatt: 'Reset All Batteries',
            ctxCopyText: 'Copy Circuit Text',
            confirmClearAll: 'Delete all components?',
            ctxSelected: 'components selected',
            ctxBroken: '(BROKEN)',
            copyNoWires: 'No wires between selected components',
            copyTotal: 'Total',
            copyComponents: 'components',
            copyWires: 'wires',
            copyCopied: 'Circuit text copied!',
            copyTitle: '📋 ELECTRONIC CIRCUIT',
            copyCompLabel: '🔧 Components:',
            copyConnLabel: '🔌 Connections:',
            savePrompt: 'Circuit name:',
            toastSaved: 'saved!',
            toastLoaded: 'loaded!',
            toastInvalidFile: 'Invalid file format!',
            toastFileError: 'Failed to open file',

            // Battery sim
            simDay: 'Day',
            simPause: '⏸ PAUSE',
            simNoAC: '⚠ NO AC',
            simPowerLow: '⚠ LOW POWER',
            simProtect: '⚡ PROTECT',
            simLimit: '⚡ LIMIT',
            simNoPower: '⛔ NO POWER',
            simInputLow: '⚠ LOW INPUT',
            battDead: '💀 EMPTY',

            // Effects
            effectBurnt: '⚡ BURNT!',

            // Instructions
            instrTitle: '📋 How to Use',
            instrDrag: 'Drag components from the left panel',
            instrConnect: 'Click terminals to connect',
            instrSwitch: 'Click switch to toggle ON/OFF',
            instrRight: 'Right-click for more options',
        }
    };

    // ── Current language state ──
    CZ.lang = localStorage.getItem('czelectro_lang') || 'id';

    /**
     * Get translated string
     * @param {string} key - translation key
     * @returns {string} translated text
     */
    CZ.t = function(key) {
        return (DICT[CZ.lang] && DICT[CZ.lang][key]) || (DICT.id[key]) || key;
    };

    /**
     * Apply translations to all [data-i18n] elements
     */
    CZ.applyTranslations = function() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const val = CZ.t(key);
            if (el.tagName === 'INPUT' && el.type !== 'checkbox') {
                el.placeholder = val;
            } else if (el.hasAttribute('title')) {
                el.title = val;
            } else {
                el.textContent = val;
            }
        });
        // Also apply to title-only elements
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = CZ.t(el.dataset.i18nTitle);
        });
        // Update HTML lang attribute
        document.documentElement.lang = CZ.lang === 'id' ? 'id' : 'en';
        // Update meta description
        document.querySelectorAll('[data-i18n-meta]').forEach(el => {
            el.setAttribute('content', CZ.t(el.dataset.i18nMeta));
        });
    };

    // ── Component Name Translations ──
    // Keys = component ID, values = English name
    // Indonesian names are the default in components.js
    const COMP_NAMES = {
        battery_9v: '9V Battery',
        battery_3v: '3V Battery',
        battery_1v5: '1.5V Battery',
        resistor_220: '220Ω Resistor',
        resistor_1k: '1KΩ Resistor',
        switch_toggle: 'Toggle Switch',
        led_yellow: 'Yellow LED',
        led_red: 'Red LED',
        led_green: 'Green LED',
        bulb: 'Light Bulb',
        motor_dc: 'DC Motor',
        buzzer: 'Buzzer',
        fuse: 'Fuse',
        capacitor: 'Capacitor',
        diode: 'Diode',
        potentiometer: 'Potentiometer',
        resistor_100: '100Ω Resistor',
        resistor_10k: '10KΩ Resistor',
        battery_12v: '12V Battery',
        led_blue: 'Blue LED',
        led_white: 'White LED',
        led_rgb: 'RGB LED',
        relay: 'Relay',
        speaker: 'Speaker',
        jumper_wire: 'Jumper Wire',
        solar_6v: '6V Solar Panel',
        solar_12v: '12V Solar Panel',
        solar_18v: '18V Solar Panel',
        solar_array_1k: '1kWp Solar Array',
        solar_array_3k: '3kWp Solar Array',
        solar_array_5k: '5kWp Solar Array',
        battery_32140: 'LiFePO4 32140',
        battery_lifepo4: 'LiFePO4 Cell 100Ah',
        battery_plts_100: '48V 100Ah Battery',
        battery_plts_200: '48V 200Ah Battery',
        charge_controller: 'Charge Controller',
        inverter: '1.5kW Inverter',
        inverter_3k: '3kW Inverter',
        inverter_5k: '5kW Inverter',
        stepdown_12v: '12V Step-Down',
        stepdown_5v: '5V Step-Down',
        ground: 'Ground/Neutral',
        outlet: 'Power Outlet',
        outlet_strip: 'Power Strip',
        terminal: 'Screw Terminal',
        iron: 'Clothes Iron',
        fridge: 'Refrigerator',
        blender: 'Blender',
        ricecooker: 'Rice Cooker',
        ac_05pk: '0.5 HP AC',
        ac_1pk: '1 HP AC',
        tv_led: '32" LED TV',
        lamp_30w: '30W LED Lamp',
        computer: 'Computer',
        pump_125: '125W Water Pump',
        pump_250: '250W Water Pump',
        voltmeter: 'Multimeter',
        timer_555: 'Timer 555',
        led_strip_rgb: 'LED Strip RGB',
    };

    // English spec translations (only for specs containing Indonesian text)
    const COMP_SPECS = {
        led_rgb: '3V, 20mA max, Multicolor',
        jumper_wire: '0Ω (jumper)',
        ground: 'Neutral Bus (auto-connect)',
        outlet_strip: '220V AC, 16A, 4 Outlets',
    };

    /**
     * Get localized component name
     * @param {object} tmpl - component template from COMPONENTS
     * @returns {string} localized name
     */
    CZ.getCompName = function(tmpl) {
        if (!tmpl) return '';
        if (CZ.lang === 'en' && COMP_NAMES[tmpl.id]) {
            return COMP_NAMES[tmpl.id];
        }
        return tmpl.name;
    };

    /**
     * Get localized component spec
     * @param {object} tmpl - component template from COMPONENTS
     * @returns {string} localized spec
     */
    CZ.getCompSpec = function(tmpl) {
        if (!tmpl) return '';
        if (CZ.lang === 'en' && COMP_SPECS[tmpl.id]) {
            return COMP_SPECS[tmpl.id];
        }
        return tmpl.spec;
    };

    /**
     * Switch language and persist
     * @param {string} lang - 'id' or 'en'
     */
    CZ.setLanguage = function(lang) {
        if (!DICT[lang]) return;
        CZ.lang = lang;
        localStorage.setItem('czelectro_lang', lang);
        CZ.applyTranslations();
        // Update language toggle UI
        document.querySelectorAll('.lang-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        // Re-render component sidebar with translated names
        if (typeof CZ.renderComponentList === 'function') {
            CZ.renderComponentList();
        }
        // Refresh dynamic status bar text (uses CZ.t() internally)
        if (typeof CZ.evaluateCircuit === 'function') {
            CZ.evaluateCircuit();
        }
        if (typeof CZ.updateStatus === 'function') {
            CZ.updateStatus();
        }
    };

})(window.CZ);
