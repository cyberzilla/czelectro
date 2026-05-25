// ═══════════════════════════════════════════════════
// CZElectro — Component Definitions
// ═══════════════════════════════════════════════════

const COMPONENTS = [
    {
        id: 'battery_9v',
        name: 'Baterai 9V',
        spec: '9 Volt DC',
        category: 'source',
        voltage: 9,
        resistance: 0.5, // internal resistance
        width: 70, height: 110,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 110">
            <rect x="5" y="15" width="60" height="90" rx="8" fill="url(#battBody)" stroke="#000" stroke-width="2"/>
            <rect x="5" y="40" width="60" height="40" fill="#fbbf24"/>
            <text x="35" y="65" fill="#000" font-weight="900" font-size="18" text-anchor="middle" font-family="sans-serif">9V</text>
            <rect x="15" y="2" width="12" height="13" rx="2" fill="url(#battTop)" stroke="#333"/>
            <rect x="40" y="2" width="18" height="13" rx="2" fill="url(#battTop)" stroke="#333"/>
            <text x="21" y="30" fill="#fff" font-weight="bold" font-size="14" text-anchor="middle">+</text>
            <text x="49" y="30" fill="#fff" font-weight="bold" font-size="16" text-anchor="middle">−</text>
        </svg>`,
        terminals: [
            { x: 21, y: 0, label: '+' },
            { x: 49, y: 0, label: '−' }
        ]
    },
    {
        id: 'battery_3v',
        name: 'Baterai 3V',
        spec: '3 Volt (2×AA)',
        category: 'source',
        voltage: 3,
        resistance: 0.3,
        width: 80, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 50">
            <rect x="5" y="10" width="70" height="30" rx="6" fill="#374151" stroke="#000" stroke-width="1.5"/>
            <rect x="5" y="18" width="70" height="14" fill="#16a34a"/>
            <text x="40" y="30" fill="#fff" font-weight="800" font-size="12" text-anchor="middle" font-family="sans-serif">3V</text>
            <rect x="0" y="18" width="5" height="14" rx="1" fill="url(#battTop)" stroke="#333"/>
            <rect x="75" y="16" width="5" height="18" rx="1" fill="url(#battTop)" stroke="#333"/>
            <text x="3" y="14" fill="#4ade80" font-weight="bold" font-size="10" text-anchor="middle">+</text>
            <text x="77" y="14" fill="#ef4444" font-weight="bold" font-size="10" text-anchor="middle">−</text>
        </svg>`,
        terminals: [
            { x: 2, y: 25, label: '+' },
            { x: 78, y: 25, label: '−' }
        ]
    },
    {
        id: 'battery_1v5',
        name: 'Baterai 1.5V',
        spec: '1.5 Volt (1×AA)',
        category: 'source',
        voltage: 1.5,
        resistance: 0.5,
        width: 60, height: 40,
        svg: `<svg width="100%" height="100%" viewBox="0 0 60 40">
            <rect x="5" y="8" width="50" height="24" rx="5" fill="#374151" stroke="#000" stroke-width="1.5"/>
            <rect x="5" y="14" width="50" height="12" fill="#ca8a04"/>
            <text x="30" y="24" fill="#fff" font-weight="800" font-size="10" text-anchor="middle" font-family="sans-serif">1.5V</text>
            <rect x="0" y="14" width="5" height="12" rx="1" fill="url(#battTop)" stroke="#333"/>
            <rect x="55" y="12" width="5" height="16" rx="1" fill="url(#battTop)" stroke="#333"/>
            <text x="3" y="11" fill="#4ade80" font-weight="bold" font-size="9" text-anchor="middle">+</text>
            <text x="57" y="11" fill="#ef4444" font-weight="bold" font-size="9" text-anchor="middle">−</text>
        </svg>`,
        terminals: [
            { x: 2, y: 20, label: '+' },
            { x: 58, y: 20, label: '−' }
        ]
    },
    {
        id: 'resistor_220',
        name: 'Resistor 220Ω',
        spec: '220Ω ¼W',
        category: 'passive',
        voltage: 0,
        resistance: 220,
        width: 100, height: 40,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 40">
            <line x1="0" y1="20" x2="25" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="75" y1="20" x2="100" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 25 13 Q 28 8, 33 8 L 67 8 Q 72 8, 75 13 L 75 27 Q 72 32, 67 32 L 33 32 Q 28 32, 25 27 Z" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5" filter="url(#innerShadow)"/>
            <rect x="35" y="8" width="4" height="24" fill="#dc2626"/>
            <rect x="45" y="8" width="4" height="24" fill="#dc2626"/>
            <rect x="55" y="8" width="4" height="24" fill="#78350f"/>
            <rect x="65" y="9" width="3" height="22" fill="#d4af37"/>
        </svg>`,
        terminals: [
            { x: 0, y: 20, label: '1' },
            { x: 100, y: 20, label: '2' }
        ]
    },
    {
        id: 'resistor_1k',
        name: 'Resistor 1KΩ',
        spec: '1KΩ ¼W',
        category: 'passive',
        voltage: 0,
        resistance: 1000,
        width: 100, height: 40,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 40">
            <line x1="0" y1="20" x2="25" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="75" y1="20" x2="100" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 25 13 Q 28 8, 33 8 L 67 8 Q 72 8, 75 13 L 75 27 Q 72 32, 67 32 L 33 32 Q 28 32, 25 27 Z" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5" filter="url(#innerShadow)"/>
            <rect x="35" y="8" width="4" height="24" fill="#78350f"/>
            <rect x="45" y="8" width="4" height="24" fill="#1a1a1a"/>
            <rect x="55" y="8" width="4" height="24" fill="#dc2626"/>
            <rect x="65" y="9" width="3" height="22" fill="#d4af37"/>
        </svg>`,
        terminals: [
            { x: 0, y: 20, label: '1' },
            { x: 100, y: 20, label: '2' }
        ]
    },
    {
        id: 'switch_toggle',
        name: 'Saklar Toggle',
        spec: 'SPST ON/OFF',
        category: 'passive',
        voltage: 0,
        resistance: Infinity,
        width: 80, height: 60,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 60">
            <line x1="0" y1="30" x2="20" y2="30" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
            <line x1="60" y1="30" x2="80" y2="30" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
            <rect x="20" y="18" width="40" height="24" rx="5" fill="#475569" stroke="#334155" stroke-width="1.5"/>
            <circle cx="40" cy="30" r="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
            <g class="switch-lever">
                <rect x="36" y="6" width="8" height="28" rx="4" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
            </g>
        </svg>`,
        terminals: [
            { x: 0, y: 30, label: 'A' },
            { x: 80, y: 30, label: 'B' }
        ]
    },
    {
        id: 'led_yellow',
        name: 'LED Kuning',
        spec: 'Max 20mA, 2V drop',
        category: 'output',
        voltage: 0,
        resistance: 20,
        maxCurrent: 0.02,
        voltageDrop: 2,
        width: 50, height: 80,
        glowGradient: 'ledGlowGrad',
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(250,204,21,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
            <text x="10" y="73" fill="#fbbf24" font-size="9" font-weight="bold">+</text>
            <text x="37" y="73" fill="#94a3b8" font-size="9" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_red',
        name: 'LED Merah',
        spec: 'Max 20mA, 1.8V drop',
        category: 'output',
        voltage: 0,
        resistance: 18,
        maxCurrent: 0.02,
        voltageDrop: 1.8,
        width: 50, height: 80,
        glowGradient: 'ledGlowRed',
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(239,68,68,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(255,200,200,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
            <text x="10" y="73" fill="#f87171" font-size="9" font-weight="bold">+</text>
            <text x="37" y="73" fill="#94a3b8" font-size="9" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_green',
        name: 'LED Hijau',
        spec: 'Max 20mA, 2.1V drop',
        category: 'output',
        voltage: 0,
        resistance: 21,
        maxCurrent: 0.02,
        voltageDrop: 2.1,
        width: 50, height: 80,
        glowGradient: 'ledGlowGreen',
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(34,197,94,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(200,255,200,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
            <text x="10" y="73" fill="#4ade80" font-size="9" font-weight="bold">+</text>
            <text x="37" y="73" fill="#94a3b8" font-size="9" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'bulb',
        name: 'Bohlam',
        spec: '6V 0.5W, 60mA max',
        category: 'output',
        voltage: 0,
        resistance: 100,
        maxCurrent: 0.06,
        width: 60, height: 90,
        glowGradient: 'bulbGlowGrad',
        svg: `<svg width="100%" height="100%" viewBox="0 0 60 90">
            <line x1="22" y1="70" x2="22" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="38" y1="70" x2="38" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="18" y="58" width="24" height="14" rx="2" fill="#6b7280" stroke="#4b5563" stroke-width="1"/>
            <line x1="20" y1="62" x2="40" y2="62" stroke="#9ca3af" stroke-width="1"/>
            <line x1="20" y1="66" x2="40" y2="66" stroke="#9ca3af" stroke-width="1"/>
            <circle class="led-glow-ring" cx="30" cy="32" r="28" fill="rgba(253,224,71,0.12)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <circle class="led-bulb" cx="30" cy="32" r="22" fill="url(#ledGlass)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
            <path d="M 24 26 Q 30 18 36 26 M 26 32 Q 30 24 34 32" fill="none" stroke="rgba(200,200,200,0.4)" stroke-width="1" class="bulb-filament"/>
        </svg>`,
        terminals: [
            { x: 22, y: 88, label: '+' },
            { x: 38, y: 88, label: '−' }
        ]
    },
    {
        id: 'motor_dc',
        name: 'Motor DC',
        spec: '3-9V, 100mA max',
        category: 'output',
        voltage: 0,
        resistance: 50,
        maxCurrent: 0.1,
        ratedVoltage: 3,
        width: 70, height: 70,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 70">
            <line x1="10" y1="60" x2="10" y2="70" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="60" y1="60" x2="60" y2="70" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <circle cx="35" cy="32" r="28" fill="url(#motorBody)" stroke="#111" stroke-width="2"/>
            <circle cx="35" cy="32" r="20" fill="#1f2937" stroke="#374151" stroke-width="1"/>
            <g class="motor-spin" style="transform-origin: 35px 32px;">
                <line x1="20" y1="32" x2="50" y2="32" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="35" y1="17" x2="35" y2="47" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="24" y1="21" x2="46" y2="43" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="46" y1="21" x2="24" y2="43" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
            </g>
            <circle class="motor-shaft" cx="35" cy="32" r="5" fill="#d4af37" stroke="#92400e" stroke-width="1"/>
            <text x="35" y="36" fill="#9ca3af" font-weight="bold" font-size="8" text-anchor="middle" font-family="sans-serif">M</text>
            <text x="4" y="58" fill="#4ade80" font-size="8" font-weight="bold">+</text>
            <text x="56" y="58" fill="#ef4444" font-size="8" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 10, y: 70, label: '+' },
            { x: 60, y: 70, label: '−' }
        ]
    },
    {
        id: 'buzzer',
        name: 'Buzzer',
        spec: '3-12V Piezo',
        category: 'output',
        voltage: 0,
        resistance: 40,
        maxCurrent: 0.03,
        width: 60, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 60 65">
            <line x1="18" y1="50" x2="18" y2="63" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="42" y1="50" x2="42" y2="63" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="30" cy="28" r="24" fill="#1f2937" stroke="#374151" stroke-width="2"/>
            <circle cx="30" cy="28" r="16" fill="#111827" stroke="#1f2937" stroke-width="1"/>
            <circle cx="30" cy="28" r="6" fill="#374151"/>
            <text x="10" y="48" fill="#4ade80" font-size="8" font-weight="bold">+</text>
            <text x="44" y="48" fill="#ef4444" font-size="8" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 63, label: '+' },
            { x: 42, y: 63, label: '−' }
        ]
    },
    {
        id: 'fuse',
        name: 'Sekring',
        spec: '250mA Glass',
        category: 'passive',
        voltage: 0,
        resistance: 1,
        maxCurrent: 0.25,
        width: 90, height: 30,
        svg: `<svg width="100%" height="100%" viewBox="0 0 90 30">
            <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="15" x2="90" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="20" y="5" width="50" height="20" rx="10" fill="rgba(200,220,255,0.2)" stroke="rgba(200,220,255,0.4)" stroke-width="1.5"/>
            <rect x="20" y="8" width="8" height="14" rx="2" fill="#9ca3af"/>
            <rect x="62" y="8" width="8" height="14" rx="2" fill="#9ca3af"/>
            <line class="fuse-wire" x1="28" y1="15" x2="62" y2="15" stroke="#d4af37" stroke-width="1.5"/>
        </svg>`,
        terminals: [
            { x: 0, y: 15, label: '1' },
            { x: 90, y: 15, label: '2' }
        ]
    },
    {
        id: 'capacitor',
        name: 'Kapasitor',
        spec: '100μF 25V',
        category: 'passive',
        voltage: 0,
        resistance: 5,
        width: 60, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 60 50">
            <line x1="0" y1="25" x2="22" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="38" y1="25" x2="60" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="22" y="8" width="4" height="34" rx="1" fill="#60a5fa" stroke="#3b82f6"/>
            <rect x="34" y="8" width="4" height="34" rx="1" fill="#60a5fa" stroke="#3b82f6"/>
            <text x="16" y="8" fill="#4ade80" font-size="10" font-weight="bold">+</text>
            <text x="40" y="8" fill="#94a3b8" font-size="10" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 0, y: 25, label: '+' },
            { x: 60, y: 25, label: '−' }
        ]
    },
    {
        id: 'diode',
        name: 'Dioda',
        spec: '1N4007, 1A',
        category: 'passive',
        voltage: 0,
        resistance: 2,
        width: 80, height: 36,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 36">
            <line x1="0" y1="18" x2="25" y2="18" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="18" x2="80" y2="18" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <polygon points="25,6 55,18 25,30" fill="#374151" stroke="#6b7280" stroke-width="1.5"/>
            <line x1="55" y1="6" x2="55" y2="30" stroke="#6b7280" stroke-width="2.5"/>
            <text x="34" y="22" fill="#94a3b8" font-size="9" font-weight="bold">D</text>
        </svg>`,
        terminals: [
            { x: 0, y: 18, label: 'A' },
            { x: 80, y: 18, label: 'K' }
        ]
    },
    {
        id: 'potentiometer',
        name: 'Potensiometer',
        spec: '10KΩ Variable',
        category: 'passive',
        voltage: 0,
        resistance: 5000,
        width: 100, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 50">
            <line x1="0" y1="35" x2="25" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="75" y1="35" x2="100" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <path d="M 25 28 Q 28 23, 33 23 L 67 23 Q 72 23, 75 28 L 75 42 Q 72 47, 67 47 L 33 47 Q 28 47, 25 42 Z" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5"/>
            <polygon points="50,5 44,20 56,20" fill="#d4af37" stroke="#92400e" stroke-width="1"/>
            <line x1="50" y1="20" x2="50" y2="23" stroke="#d4af37" stroke-width="2"/>
        </svg>`,
        terminals: [
            { x: 0, y: 35, label: '1' },
            { x: 100, y: 35, label: '2' }
        ]
    },
    {
        id: 'resistor_100',
        name: 'Resistor 100Ω',
        spec: '100Ω ¼W',
        category: 'passive',
        voltage: 0,
        resistance: 100,
        width: 90, height: 30,
        svg: `<svg width="100%" height="100%" viewBox="0 0 90 30">
            <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="15" x2="90" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="20" y="5" width="50" height="20" rx="4" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5"/>
            <line x1="30" y1="5" x2="30" y2="25" stroke="#a78bfa" stroke-width="3"/>
            <line x1="42" y1="5" x2="42" y2="25" stroke="#000" stroke-width="3"/>
            <line x1="54" y1="5" x2="54" y2="25" stroke="#a78bfa" stroke-width="3"/>
            <line x1="60" y1="5" x2="60" y2="25" stroke="#d4af37" stroke-width="2"/>
        </svg>`,
        terminals: [
            { x: 0, y: 15, label: '1' },
            { x: 90, y: 15, label: '2' }
        ]
    },
    {
        id: 'resistor_10k',
        name: 'Resistor 10KΩ',
        spec: '10KΩ ¼W',
        category: 'passive',
        voltage: 0,
        resistance: 10000,
        width: 90, height: 30,
        svg: `<svg width="100%" height="100%" viewBox="0 0 90 30">
            <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="15" x2="90" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="20" y="5" width="50" height="20" rx="4" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5"/>
            <line x1="30" y1="5" x2="30" y2="25" stroke="#a78bfa" stroke-width="3"/>
            <line x1="42" y1="5" x2="42" y2="25" stroke="#000" stroke-width="3"/>
            <line x1="54" y1="5" x2="54" y2="25" stroke="#f97316" stroke-width="3"/>
            <line x1="60" y1="5" x2="60" y2="25" stroke="#d4af37" stroke-width="2"/>
        </svg>`,
        terminals: [
            { x: 0, y: 15, label: '1' },
            { x: 90, y: 15, label: '2' }
        ]
    },
    {
        id: 'battery_12v',
        name: 'Baterai 12V',
        spec: '12 Volt (A23)',
        category: 'source',
        voltage: 12,
        resistance: 0.08,
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <rect x="10" y="8" width="30" height="64" rx="5" fill="#374151" stroke="#000" stroke-width="1.5"/>
            <rect x="10" y="20" width="30" height="40" fill="#1e40af"/>
            <text x="25" y="44" fill="#fff" font-weight="900" font-size="11" text-anchor="middle" font-family="sans-serif">12V</text>
            <rect x="18" y="2" width="14" height="8" rx="2" fill="url(#battTop)" stroke="#333"/>
            <rect x="15" y="72" width="20" height="4" rx="1" fill="#555"/>
            <text x="25" y="18" fill="#4ade80" font-weight="bold" font-size="9" text-anchor="middle">+</text>
        </svg>`,
        terminals: [
            { x: 25, y: 2, label: '+' },
            { x: 25, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_blue',
        name: 'LED Biru',
        spec: '3.2V, 20mA',
        category: 'output',
        voltage: 0,
        resistance: 20,
        maxCurrent: 0.02,
        voltageDrop: 3.2,
        glowGradient: 'ledGlowBlue',
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(59,130,246,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(147,197,253,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
            <text x="10" y="73" fill="#60a5fa" font-size="9" font-weight="bold">+</text>
            <text x="37" y="73" fill="#94a3b8" font-size="9" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_white',
        name: 'LED Putih',
        spec: '3.3V, 20mA',
        category: 'output',
        voltage: 0,
        resistance: 20,
        maxCurrent: 0.02,
        voltageDrop: 3.3,
        glowGradient: 'ledGlowWhite',
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(255,255,255,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
            <text x="10" y="73" fill="#e5e7eb" font-size="9" font-weight="bold">+</text>
            <text x="37" y="73" fill="#94a3b8" font-size="9" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_rgb',
        name: 'LED RGB',
        spec: '3V, 20mA, Warna-warni',
        category: 'output',
        voltage: 0,
        resistance: 20,
        maxCurrent: 0.02,
        voltageDrop: 3,
        glowGradient: 'ledGlowRGB',
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(168,85,247,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(168,85,247,0.35)" stroke-width="1.5" style="transition: filter 0.3s;"/>
            <text x="6" y="73" fill="#c084fc" font-size="7" font-weight="bold">RGB</text>
            <text x="37" y="73" fill="#94a3b8" font-size="9" font-weight="bold">−</text>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'relay',
        name: 'Relay',
        spec: '5V Coil, SPST',
        category: 'passive',
        voltage: 0,
        resistance: 70,
        width: 80, height: 60,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 60">
            <rect x="8" y="5" width="64" height="50" rx="6" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
            <rect x="14" y="12" width="22" height="36" rx="3" fill="#111827" stroke="#4b5563"/>
            <path d="M 18 20 Q 25 15, 32 20 Q 25 25, 18 30 Q 25 25, 32 30" stroke="#d4af37" stroke-width="1.2" fill="none"/>
            <rect x="44" y="18" width="22" height="24" rx="2" fill="#111827" stroke="#4b5563"/>
            <line x1="55" y1="22" x2="55" y2="38" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="55" cy="28" r="3" fill="#ef4444"/>
            <text x="40" y="55" fill="#9ca3af" font-size="7" font-family="sans-serif">RELAY</text>
        </svg>`,
        terminals: [
            { x: 0, y: 30, label: '1' },
            { x: 80, y: 30, label: '2' }
        ]
    },
    {
        id: 'speaker',
        name: 'Speaker',
        spec: '8Ω 0.5W',
        category: 'output',
        voltage: 0,
        resistance: 8,
        maxCurrent: 0.25,
        width: 70, height: 70,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="30" fill="#1f2937" stroke="#374151" stroke-width="2"/>
            <circle cx="35" cy="35" r="22" fill="#111827" stroke="#4b5563"/>
            <circle class="speaker-cone" cx="35" cy="35" r="14" fill="none" stroke="#6b7280" stroke-width="0.5"/>
            <circle class="speaker-cone" cx="35" cy="35" r="8" fill="none" stroke="#6b7280" stroke-width="0.5"/>
            <circle cx="35" cy="35" r="3" fill="#d4af37" stroke="#92400e"/>
            <path class="speaker-wave sw1" d="M 60 25 Q 65 35, 60 45" fill="none" stroke="rgba(74,222,128,0)" stroke-width="1.5" stroke-linecap="round"/>
            <path class="speaker-wave sw2" d="M 64 20 Q 70 35, 64 50" fill="none" stroke="rgba(74,222,128,0)" stroke-width="1.2" stroke-linecap="round"/>
            <text x="35" y="62" fill="#9ca3af" font-size="7" text-anchor="middle" font-family="sans-serif">8Ω</text>
        </svg>`,
        terminals: [
            { x: 5, y: 60, label: '+' },
            { x: 65, y: 60, label: '−' }
        ]
    },
    {
        id: 'jumper_wire',
        name: 'Kabel Jumper',
        spec: '0Ω (penghubung)',
        category: 'passive',
        voltage: 0,
        resistance: 0.01,
        width: 80, height: 20,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 20">
            <line x1="0" y1="10" x2="80" y2="10" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
            <circle cx="5" cy="10" r="4" fill="#0891b2" stroke="#06b6d4"/>
            <circle cx="75" cy="10" r="4" fill="#0891b2" stroke="#06b6d4"/>
        </svg>`,
        terminals: [
            { x: 5, y: 10, label: '1' },
            { x: 75, y: 10, label: '2' }
        ]
    }
];
