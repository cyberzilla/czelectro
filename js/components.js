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
        internalResistance: 0.5,
        maxCurrent: 0.5,  // 500mA max discharge
        capacityWh: 4.5,
        ratedPower: 4.5,  // 9V battery ~4.5W capacity
        width: 70, height: 110,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 110">
            <rect x="5" y="15" width="60" height="90" rx="8" fill="#1a1a2e" stroke="#333" stroke-width="2"/>
            <rect class="batt-fill" x="7" y="17" width="56" height="86" rx="6" fill="#22c55e" opacity="0.85"/>
            <text x="35" y="65" fill="#fff" font-weight="900" font-size="18" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">9V</text>
            <rect x="15" y="2" width="12" height="13" rx="2" fill="url(#battTop)" stroke="#333"/>
            <rect x="40" y="2" width="18" height="13" rx="2" fill="url(#battTop)" stroke="#333"/>
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
        internalResistance: 0.3,
        maxCurrent: 1.0,  // 1A max discharge
        capacityWh: 7.5,
        width: 80, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 50">
            <rect x="5" y="10" width="70" height="30" rx="6" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/>
            <rect class="batt-fill" x="7" y="12" width="66" height="26" rx="4" fill="#22c55e" opacity="0.85"/>
            <text x="40" y="30" fill="#fff" font-weight="800" font-size="12" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">3V</text>
            <rect x="0" y="18" width="5" height="14" rx="1" fill="url(#battTop)" stroke="#333"/>
            <rect x="75" y="16" width="5" height="18" rx="1" fill="url(#battTop)" stroke="#333"/>
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
        internalResistance: 0.5,
        maxCurrent: 0.8,  // 800mA max discharge
        capacityWh: 3.75,
        width: 60, height: 40,
        svg: `<svg width="100%" height="100%" viewBox="0 0 60 40">
            <rect x="5" y="8" width="50" height="24" rx="5" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/>
            <rect class="batt-fill" x="7" y="10" width="46" height="20" rx="3" fill="#22c55e" opacity="0.85"/>
            <text x="30" y="24" fill="#fff" font-weight="800" font-size="10" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">1.5V</text>
            <rect x="0" y="14" width="5" height="12" rx="1" fill="url(#battTop)" stroke="#333"/>
            <rect x="55" y="12" width="5" height="16" rx="1" fill="url(#battTop)" stroke="#333"/>
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
        spec: '2V, 20mA max',
        category: 'output',
        voltage: 0,
        resistance: 100,
        forwardVoltage: 2.0,
        isDiode: true,
        maxCurrent: 0.025,
        ratedPower: 0.04,
        width: 50, height: 80,
        glowGradient: 'ledGlowGrad',
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(250,204,21,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_red',
        name: 'LED Merah',
        spec: '1.8V, 20mA max',
        category: 'output',
        voltage: 0,
        resistance: 90,
        forwardVoltage: 1.8,
        isDiode: true,
        maxCurrent: 0.025,
        ratedPower: 0.036,
        width: 50, height: 80,
        glowGradient: 'ledGlowRed',
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(239,68,68,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(255,200,200,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_green',
        name: 'LED Hijau',
        spec: '2.1V, 20mA max',
        category: 'output',
        voltage: 0,
        resistance: 105,
        forwardVoltage: 2.1,
        isDiode: true,
        maxCurrent: 0.025,
        ratedPower: 0.042,
        width: 50, height: 80,
        glowGradient: 'ledGlowGreen',
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(34,197,94,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(200,255,200,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'bulb',
        name: 'Bohlam',
        spec: '6V 0.5W, 100mA max',
        category: 'output',
        voltage: 0,
        resistance: 72,
        forwardVoltage: 0,
        maxCurrent: 0.1,
        ratedPower: 0.5,  // 6V 0.5W
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
        spec: '3-9V, 200mA max',
        category: 'output',
        voltage: 0,
        resistance: 50,
        maxCurrent: 0.2,
        ratedPower: 0.9,
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
        </svg>`,
        terminals: [
            { x: 10, y: 70, label: '+' },
            { x: 60, y: 70, label: '−' }
        ]
    },
    {
        id: 'buzzer',
        name: 'Buzzer',
        spec: '3-12V Piezo, 30mA max',
        category: 'output',
        voltage: 0,
        resistance: 400,
        maxCurrent: 0.035,
        ratedPower: 0.1,  // ~100mW
        width: 60, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 60 65">
            <line x1="18" y1="50" x2="18" y2="63" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="42" y1="50" x2="42" y2="63" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="30" cy="28" r="24" fill="#1f2937" stroke="#374151" stroke-width="2"/>
            <circle cx="30" cy="28" r="16" fill="#111827" stroke="#1f2937" stroke-width="1"/>
            <circle cx="30" cy="28" r="6" fill="#374151"/>
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
        forwardVoltage: 0.7,
        maxReverseVoltage: 1000,
        isDiode: true,
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
        internalResistance: 0.08,
        maxCurrent: 0.3,  // 300mA max discharge
        capacityWh: 1.2,
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <rect x="10" y="8" width="30" height="64" rx="5" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/>
            <rect class="batt-fill" x="12" y="10" width="26" height="60" rx="3" fill="#22c55e" opacity="0.85"/>
            <text x="25" y="44" fill="#fff" font-weight="900" font-size="11" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">12V</text>
            <rect x="18" y="2" width="14" height="8" rx="2" fill="url(#battTop)" stroke="#333"/>
            <rect x="15" y="72" width="20" height="4" rx="1" fill="#555"/>
        </svg>`,
        terminals: [
            { x: 25, y: 2, label: '+' },
            { x: 25, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_blue',
        name: 'LED Biru',
        spec: '3.2V, 20mA max',
        category: 'output',
        voltage: 0,
        resistance: 160,
        forwardVoltage: 3.2,
        isDiode: true,
        maxCurrent: 0.025,
        ratedPower: 0.064,
        glowGradient: 'ledGlowBlue',
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(59,130,246,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(147,197,253,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_white',
        name: 'LED Putih',
        spec: '3.3V, 20mA max',
        category: 'output',
        voltage: 0,
        resistance: 165,
        forwardVoltage: 3.3,
        isDiode: true,
        maxCurrent: 0.025,
        ratedPower: 0.066,
        glowGradient: 'ledGlowWhite',
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(255,255,255,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 78, label: '+' },
            { x: 32, y: 78, label: '−' }
        ]
    },
    {
        id: 'led_rgb',
        name: 'LED RGB',
        spec: '3V, 20mA max, Warna-warni',
        category: 'output',
        voltage: 0,
        resistance: 150,
        forwardVoltage: 3.0,
        isDiode: true,
        maxCurrent: 0.025,
        ratedPower: 0.06,
        glowGradient: 'ledGlowRGB',
        width: 50, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
            <line x1="18" y1="55" x2="18" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="55" x2="32" y2="78" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="led-glow-ring" cx="25" cy="30" r="24" fill="rgba(168,85,247,0.15)" fill-opacity="0" style="transition: fill-opacity 0.4s"/>
            <path class="led-bulb" d="M 8 32 Q 8 4, 25 4 Q 42 4, 42 32 L 44 55 L 6 55 Z" fill="url(#ledGlass)" stroke="rgba(168,85,247,0.35)" stroke-width="1.5" style="transition: fill 0.3s, filter 0.3s;"/>
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
    },
    // ═══════════════════════════════════════════════════
    // Solar Power System Components
    // ═══════════════════════════════════════════════════
    {
        id: 'solar_6v',
        name: 'Panel Surya 6V',
        spec: '6V 1W Mono',
        category: 'source',
        voltage: 6,
        resistance: 0.8,
        ratedPower: 1,  // 6V 1W panel
        width: 80, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 90">
            <rect x="4" y="4" width="72" height="72" rx="3" fill="#1e293b" stroke="#334155" stroke-width="2"/>
            <rect x="8" y="8" width="64" height="64" rx="2" fill="#1e3a5f"/>
            <line x1="8" y1="24" x2="72" y2="24" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
            <line x1="8" y1="40" x2="72" y2="40" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
            <line x1="8" y1="56" x2="72" y2="56" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
            <line x1="24" y1="8" x2="24" y2="72" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
            <line x1="40" y1="8" x2="40" y2="72" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
            <line x1="56" y1="8" x2="56" y2="72" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
            <rect x="8" y="8" width="64" height="64" rx="2" fill="url(#ledGlowBlue)" opacity="0.15"/>
            <circle cx="62" cy="14" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.7"/>
            <line x1="62" y1="5" x2="62" y2="8" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
            <line x1="62" y1="20" x2="62" y2="23" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
            <line x1="53" y1="14" x2="56" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
            <line x1="68" y1="14" x2="71" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
            <text x="16" y="44" fill="#60a5fa" font-size="10" font-weight="800" font-family="sans-serif" opacity="0.6">6V</text>
            <line x1="25" y1="76" x2="25" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="76" x2="55" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        terminals: [
            { x: 25, y: 88, label: '+' },
            { x: 55, y: 88, label: '−' }
        ]
    },
    {
        id: 'solar_12v',
        name: 'Panel Surya 12V',
        spec: '12V 5W Poly',
        category: 'source',
        voltage: 12,
        resistance: 0.5,
        ratedPower: 5,  // 12V 5W panel
        width: 100, height: 70,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 70">
            <rect x="3" y="3" width="94" height="54" rx="3" fill="#1e293b" stroke="#334155" stroke-width="2"/>
            <rect x="7" y="7" width="86" height="46" rx="2" fill="#172554"/>
            <line x1="7" y1="19" x2="93" y2="19" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="7" y1="31" x2="93" y2="31" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="7" y1="43" x2="93" y2="43" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="21" y1="7" x2="21" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="36" y1="7" x2="36" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="50" y1="7" x2="50" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="64" y1="7" x2="64" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <line x1="79" y1="7" x2="79" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
            <rect x="7" y="7" width="86" height="46" rx="2" fill="url(#ledGlowBlue)" opacity="0.12"/>
            <circle cx="82" cy="14" r="5" fill="none" stroke="#fbbf24" stroke-width="1.2" opacity="0.6"/>
            <line x1="82" y1="6" x2="82" y2="9" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
            <line x1="82" y1="19" x2="82" y2="22" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
            <line x1="74" y1="14" x2="77" y2="14" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
            <line x1="87" y1="14" x2="90" y2="14" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
            <text x="14" y="35" fill="#3b82f6" font-size="12" font-weight="900" font-family="sans-serif" opacity="0.5">12V</text>
            <line x1="30" y1="57" x2="30" y2="68" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="57" x2="70" y2="68" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        terminals: [
            { x: 30, y: 68, label: '+' },
            { x: 70, y: 68, label: '−' }
        ]
    },
    {
        id: 'solar_18v',
        name: 'Panel Surya 18V',
        spec: '18V 10W Mono',
        category: 'source',
        voltage: 18,
        resistance: 0.3,
        ratedPower: 10,  // 18V 10W panel
        width: 110, height: 75,
        svg: `<svg width="100%" height="100%" viewBox="0 0 110 75">
            <rect x="3" y="3" width="104" height="58" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
            <rect x="7" y="7" width="96" height="50" rx="2" fill="#0c1e3f"/>
            <line x1="7" y1="17" x2="103" y2="17" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="7" y1="27" x2="103" y2="27" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="7" y1="37" x2="103" y2="37" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="7" y1="47" x2="103" y2="47" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="19" y1="7" x2="19" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="31" y1="7" x2="31" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="43" y1="7" x2="43" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="55" y1="7" x2="55" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="67" y1="7" x2="67" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="79" y1="7" x2="79" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <line x1="91" y1="7" x2="91" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
            <rect x="7" y="7" width="96" height="50" rx="2" fill="url(#ledGlowBlue)" opacity="0.1"/>
            <circle cx="92" cy="15" r="5" fill="none" stroke="#fbbf24" stroke-width="1.2" opacity="0.5"/>
            <line x1="92" y1="7" x2="92" y2="10" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
            <line x1="92" y1="20" x2="92" y2="23" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
            <line x1="84" y1="15" x2="87" y2="15" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
            <line x1="97" y1="15" x2="100" y2="15" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
            <text x="14" y="38" fill="#2563eb" font-size="13" font-weight="900" font-family="sans-serif" opacity="0.45">18V</text>
            <line x1="35" y1="61" x2="35" y2="73" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="75" y1="61" x2="75" y2="73" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        terminals: [
            { x: 35, y: 73, label: '+' },
            { x: 75, y: 73, label: '−' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // Solar Panel Arrays (Real-world PLTS)
    // ═══════════════════════════════════════════════════
    {
        id: 'solar_array_1k',
        name: 'Panel Array 1kWp',
        spec: '5×200W Poly, 48V',
        category: 'source',
        voltage: 48,
        resistance: 0.2,
        ratedPower: 1000,
        width: 100, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 80">
            <rect x="2" y="2" width="96" height="62" rx="3" fill="#0f172a" stroke="#1e3a5f" stroke-width="2"/>
            <rect x="5" y="5" width="90" height="56" rx="2" fill="#172554"/>
            <line x1="5" y1="16" x2="95" y2="16" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="5" y1="27" x2="95" y2="27" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="5" y1="38" x2="95" y2="38" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="5" y1="49" x2="95" y2="49" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="23" y1="5" x2="23" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="41" y1="5" x2="41" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="59" y1="5" x2="59" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <line x1="77" y1="5" x2="77" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
            <rect x="5" y="5" width="90" height="56" rx="2" fill="url(#ledGlowBlue)" opacity="0.1"/>
            <text x="12" y="36" fill="#3b82f6" font-size="14" font-weight="900" font-family="sans-serif" opacity="0.5">1kWp</text>
            <text x="60" y="14" fill="#fbbf24" font-size="7" font-weight="700" opacity="0.6">×5</text>
            <circle cx="82" cy="12" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.5"/>
            <line x1="82" y1="4" x2="82" y2="6" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
            <line x1="82" y1="18" x2="82" y2="20" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
            <line x1="74" y1="12" x2="76" y2="12" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
            <line x1="88" y1="12" x2="90" y2="12" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
            <line x1="30" y1="64" x2="30" y2="78" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="64" x2="70" y2="78" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        terminals: [
            { x: 30, y: 78, label: '+' },
            { x: 70, y: 78, label: '−' }
        ]
    },
    {
        id: 'solar_array_3k',
        name: 'Panel Array 3kWp',
        spec: '15×200W Mono, 48V',
        category: 'source',
        voltage: 48,
        resistance: 0.1,
        ratedPower: 3000,
        width: 110, height: 85,
        svg: `<svg width="100%" height="100%" viewBox="0 0 110 85">
            <rect x="2" y="2" width="106" height="66" rx="4" fill="#020617" stroke="#1e40af" stroke-width="2"/>
            <rect x="5" y="5" width="100" height="60" rx="2" fill="#0c1e3f"/>
            <line x1="5" y1="15" x2="105" y2="15" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="5" y1="25" x2="105" y2="25" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="5" y1="35" x2="105" y2="35" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="5" y1="45" x2="105" y2="45" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="5" y1="55" x2="105" y2="55" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="20" y1="5" x2="20" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="35" y1="5" x2="35" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="50" y1="5" x2="50" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="65" y1="5" x2="65" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="80" y1="5" x2="80" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <line x1="95" y1="5" x2="95" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
            <rect x="5" y="5" width="100" height="60" rx="2" fill="url(#ledGlowBlue)" opacity="0.08"/>
            <text x="10" y="40" fill="#2563eb" font-size="15" font-weight="900" font-family="sans-serif" opacity="0.45">3kWp</text>
            <text x="68" y="14" fill="#fbbf24" font-size="7" font-weight="700" opacity="0.5">×15</text>
            <circle cx="92" cy="14" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.4"/>
            <line x1="92" y1="5" x2="92" y2="8" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="92" y1="20" x2="92" y2="23" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="84" y1="14" x2="86" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="98" y1="14" x2="100" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="35" y1="68" x2="35" y2="83" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="75" y1="68" x2="75" y2="83" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        terminals: [
            { x: 35, y: 83, label: '+' },
            { x: 75, y: 83, label: '−' }
        ]
    },
    {
        id: 'solar_array_5k',
        name: 'Panel Array 5kWp',
        spec: '25×200W Mono, 48V',
        category: 'source',
        voltage: 48,
        resistance: 0.08,
        ratedPower: 5000,
        width: 120, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 120 90">
            <rect x="2" y="2" width="116" height="70" rx="4" fill="#020617" stroke="#1e3a5f" stroke-width="2.5"/>
            <rect x="5" y="5" width="110" height="64" rx="2" fill="#0a1628"/>
            <line x1="5" y1="14" x2="115" y2="14" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="5" y1="23" x2="115" y2="23" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="5" y1="32" x2="115" y2="32" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="5" y1="41" x2="115" y2="41" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="5" y1="50" x2="115" y2="50" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="5" y1="59" x2="115" y2="59" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="17" y1="5" x2="17" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="29" y1="5" x2="29" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="41" y1="5" x2="41" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="53" y1="5" x2="53" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="65" y1="5" x2="65" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="77" y1="5" x2="77" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="89" y1="5" x2="89" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <line x1="101" y1="5" x2="101" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
            <rect x="5" y="5" width="110" height="64" rx="2" fill="url(#ledGlowBlue)" opacity="0.06"/>
            <text x="10" y="42" fill="#1d4ed8" font-size="16" font-weight="900" font-family="sans-serif" opacity="0.4">5kWp</text>
            <text x="75" y="16" fill="#fbbf24" font-size="7" font-weight="700" opacity="0.45">×25</text>
            <circle cx="100" cy="15" r="7" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.35"/>
            <line x1="100" y1="5" x2="100" y2="8" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="100" y1="22" x2="100" y2="25" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="91" y1="15" x2="93" y2="15" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="107" y1="15" x2="109" y2="15" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
            <line x1="38" y1="72" x2="38" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="82" y1="72" x2="82" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        terminals: [
            { x: 38, y: 88, label: '+' },
            { x: 82, y: 88, label: '−' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // PLN — Grid Electricity Source
    // ═══════════════════════════════════════════════════
    {
        id: 'pln_source',
        name: 'PLN 220V',
        nameEn: 'Grid 220V AC',
        spec: '220V AC, 50Hz',
        category: 'source',
        voltage: 48,            // MNA internal voltage (matches battery pack level)
        resistance: 0.01,
        internalResistance: 0.01,
        ratedPower: 99000,
        maxCurrent: 100,
        isPLN: true,
        isACSource: true,
        outputVoltageEf: 220,   // effective AC output (for display/domain tagging)
        width: 80, height: 110,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 110">
            <!-- Box body -->
            <rect x="4" y="10" width="72" height="90" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <rect x="4" y="10" width="72" height="90" rx="6" fill="url(#motorBody)" opacity="0.15"/>
            <!-- Terminal leads -->
            <line x1="25" y1="0" x2="25" y2="14" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="0" x2="55" y2="14" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
            <!-- L / N labels at top -->
            <text x="25" y="24" fill="#ef4444" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">L</text>
            <text x="55" y="24" fill="#3b82f6" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">N</text>
            <!-- PLN title panel -->
            <rect x="10" y="30" width="60" height="18" rx="3" fill="#0a0a1a" stroke="#1e3a5f" stroke-width="0.8"/>
            <text x="40" y="43" fill="#f59e0b" font-size="10" font-weight="900" text-anchor="middle" font-family="monospace">PLN</text>
            <!-- Voltage display -->
            <rect x="10" y="52" width="60" height="16" rx="2" fill="#0a0a1a" stroke="#1e293b" stroke-width="0.8"/>
            <text class="pln-voltage" x="40" y="64" fill="#22c55e" font-size="11" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code',monospace">220V</text>
            <!-- AC waveform symbol -->
            <path d="M 18 80 Q 24 72, 30 80 Q 36 88, 42 80" fill="none" stroke="#64748b" stroke-width="1.2" stroke-linecap="round"/>
            <text x="50" y="84" fill="#64748b" font-size="7" font-weight="700" font-family="monospace">50Hz</text>
            <!-- Status LED -->
            <circle class="pln-led" cx="62" cy="93" r="3" fill="#475569" style="transition: fill 0.3s;"/>
            <text x="18" y="96" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">STATUS</text>
        </svg>`,
        terminals: [
            { x: 25, y: 0, label: 'L' },
            { x: 55, y: 0, label: 'N' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // ATS — Automatic Transfer Switch (PLN/PLTS)
    // ═══════════════════════════════════════════════════
    {
        id: 'ats_switch',
        name: 'ATS (Auto Switch)',
        nameEn: 'ATS Auto Transfer',
        spec: 'Auto PLN↔PLTS, 220V',
        category: 'passive',
        voltage: 0,
        resistance: 0.01,
        isATS: true,
        width: 100, height: 110,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 110">
            <rect x="5" y="15" width="90" height="80" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
            <rect x="5" y="15" width="90" height="80" rx="6" fill="url(#motorBody)" opacity="0.15"/>
            <!-- Input PLN (kiri atas) -->
            <line x1="25" y1="0" x2="25" y2="20" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <text x="25" y="30" fill="#f59e0b" font-size="6" font-weight="800" text-anchor="middle" font-family="monospace">PLN</text>
            <!-- Input PLTS (kanan atas) -->
            <line x1="75" y1="0" x2="75" y2="20" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
            <text x="75" y="30" fill="#3b82f6" font-size="6" font-weight="800" text-anchor="middle" font-family="monospace">PLTS</text>
            <!-- Output LOAD (bawah tengah) -->
            <line x1="50" y1="90" x2="50" y2="110" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
            <text x="50" y="88" fill="#64748b" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">LOAD</text>
            <!-- Title -->
            <text x="50" y="44" fill="#94a3b8" font-size="7" font-weight="900" text-anchor="middle" font-family="sans-serif">ATS</text>
            <!-- Switch arm visual -->
            <circle cx="50" cy="58" r="4" fill="#1e293b" stroke="#475569" stroke-width="1"/>
            <line class="ats-arm" x1="50" y1="58" x2="30" y2="38" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" style="transition: all 0.5s ease;"/>
            <!-- PLN indicator -->
            <circle class="ats-pln-led" cx="18" cy="76" r="3" fill="#475569" style="transition: fill 0.3s;"/>
            <text x="28" y="79" fill="#64748b" font-size="5" font-weight="600" font-family="monospace">PLN</text>
            <!-- PLTS indicator -->
            <circle class="ats-plts-led" cx="62" cy="76" r="3" fill="#475569" style="transition: fill 0.3s;"/>
            <text x="72" y="79" fill="#64748b" font-size="5" font-weight="600" font-family="monospace">PLTS</text>
            <!-- Source label (dynamic) -->
            <text class="ats-source-label" x="50" y="70" fill="#22c55e" font-size="6" font-weight="900" text-anchor="middle" font-family="monospace">---</text>
        </svg>`,
        terminals: [
            { x: 25, y: 0, label: 'PLN' },
            { x: 75, y: 0, label: 'PLTS' },
            { x: 50, y: 110, label: 'LOAD' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // LiFePO4 Rechargeable Cells
    // ═══════════════════════════════════════════════════
    {
        id: 'battery_32140',
        name: 'LiFePO4 32140',
        spec: '3.2V 15Ah (15000mAh)',
        category: 'source',
        voltage: 3.2,
        resistance: 0.02,
        internalResistance: 0.02,
        maxCurrent: 30.0,  // 30A max discharge (2C)
        capacityWh: 48,
        ratedPower: 24,  // 0.5C × 15A × 3.2V = 24W continuous
        width: 30, height: 55,
        svg: `<svg width="100%" height="100%" viewBox="0 0 30 55">
            <line x1="10" y1="0" x2="10" y2="5" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="0" x2="20" y2="5" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <rect x="3" y="5" width="24" height="47" rx="6" fill="#22543d" stroke="#166534" stroke-width="1.5"/>
            <rect x="3" y="5" width="24" height="47" rx="6" fill="url(#motorBody)" opacity="0.3"/>
            <rect x="7" y="8" width="16" height="10" rx="2" fill="rgba(0,0,0,0.3)"/>
            <text x="8" y="15" fill="#4ade80" font-size="6" font-weight="900" font-family="monospace">3.2V</text>
            <text x="5" y="28" fill="#86efac" font-size="5" font-weight="700" font-family="sans-serif">15Ah</text>
            <rect x="8" y="32" width="14" height="3" rx="1" fill="#111827"/>
            <rect class="batt-fill" x="9" y="33" width="12" height="1.5" rx="0.5" fill="#4ade80" opacity="0.8"/>
            <text x="4" y="43" fill="#a7f3d0" font-size="3.5" font-weight="700" font-family="sans-serif">32140</text>
            <text x="3" y="50" fill="#6ee7b7" font-size="3" font-weight="600" font-family="sans-serif">LiFePO4</text>
        </svg>`,
        terminals: [
            { x: 10, y: 0, label: '+' },
            { x: 20, y: 0, label: '−' }
        ]
    },
    {
        id: 'battery_lifepo4',
        name: 'Sel LiFePO4 100Ah',
        spec: '3.2V 100Ah Prismatic',
        category: 'source',
        voltage: 3.2,
        resistance: 0.01,
        internalResistance: 0.01,
        maxCurrent: 100.0,  // 100A max (1C)
        capacityWh: 320,
        ratedPower: 150,  // ~150W per cell (16 cells = 2400W)
        width: 40, height: 55,
        svg: `<svg width="100%" height="100%" viewBox="0 0 40 55">
            <line x1="12" y1="0" x2="12" y2="6" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="28" y1="0" x2="28" y2="6" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="3" y="6" width="34" height="46" rx="4" fill="#1e3a5f" stroke="#2563eb" stroke-width="1.5"/>
            <rect x="6" y="10" width="28" height="20" rx="2" fill="#0f172a" stroke="#1e293b"/>
            <text x="9" y="23" fill="#3b82f6" font-size="8" font-weight="900" font-family="monospace">3.2V</text>
            <rect x="8" y="34" width="24" height="5" rx="1.5" fill="#111827" stroke="#1e293b"/>
            <rect class="batt-fill" x="9" y="35" width="22" height="3" rx="1" fill="#22c55e" opacity="0.8"/>
            <circle cx="12" cy="45" r="2" fill="#22c55e" opacity="0.6"/>
            <circle cx="20" cy="45" r="2" fill="#3b82f6" opacity="0.4"/>
            <circle cx="28" cy="45" r="2" fill="#6b7280" opacity="0.3"/>
            <text x="7" y="53" fill="#60a5fa" font-size="4" font-weight="700" font-family="sans-serif">LiFePO4</text>
        </svg>`,
        terminals: [
            { x: 12, y: 0, label: '+' },
            { x: 28, y: 0, label: '−' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // PLTS Battery Banks (Energy Storage)
    // ═══════════════════════════════════════════════════
    {
        id: 'battery_plts_100',
        name: 'Baterai 48V 100Ah',
        spec: '48V 100Ah LiFePO4, 4.8kWh',
        category: 'source',
        voltage: 48,
        resistance: 0.1,
        internalResistance: 0.1,
        maxCurrent: 50.0,  // 50A max discharge
        capacityWh: 4800,
        ratedPower: 2400,  // continuous discharge ~2400W
        width: 90, height: 70,
        svg: `<svg width="100%" height="100%" viewBox="0 0 90 70">
            <line x1="25" y1="0" x2="25" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="65" y1="0" x2="65" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="5" y="8" width="80" height="58" rx="5" fill="#1e293b" stroke="#334155" stroke-width="2"/>
            <rect x="10" y="12" width="70" height="30" rx="3" fill="#0f172a" stroke="#1e293b"/>
            <text x="16" y="30" fill="#22c55e" font-size="10" font-weight="900" font-family="monospace">48V</text>
            <text x="50" y="30" fill="#4ade80" font-size="8" font-weight="700" font-family="monospace">100Ah</text>
            <rect x="12" y="46" width="66" height="6" rx="2" fill="#111827" stroke="#1e293b"/>
            <rect class="batt-fill" x="13" y="47" width="64" height="4" rx="1.5" fill="#22c55e" opacity="0.8"/>
            <text class="batt-pct" x="68" y="51" fill="#4ade80" font-size="5" font-weight="800" font-family="sans-serif">100%</text>
            <circle cx="18" cy="60" r="3" fill="#22c55e" opacity="0.7"/>
            <circle cx="28" cy="60" r="3" fill="#22c55e" opacity="0.5"/>
            <circle cx="38" cy="60" r="3" fill="#3b82f6" opacity="0.5"/>
            <circle cx="48" cy="60" r="3" fill="#6b7280" opacity="0.3"/>
            <text x="55" y="63" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">LiFePO4</text>
        </svg>`,
        terminals: [
            { x: 25, y: 0, label: '+' },
            { x: 65, y: 0, label: '−' }
        ]
    },
    {
        id: 'battery_plts_200',
        name: 'Baterai 48V 200Ah',
        spec: '48V 200Ah LiFePO4, 9.6kWh',
        category: 'source',
        voltage: 48,
        resistance: 0.05,
        internalResistance: 0.05,
        maxCurrent: 100.0,  // 100A max discharge
        capacityWh: 9600,
        ratedPower: 4800,  // continuous discharge ~4800W
        width: 100, height: 80,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 80">
            <line x1="28" y1="0" x2="28" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="72" y1="0" x2="72" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="3" y="8" width="94" height="68" rx="6" fill="#0f172a" stroke="#1e40af" stroke-width="2"/>
            <rect x="8" y="12" width="84" height="34" rx="3" fill="#111827" stroke="#1e293b"/>
            <text x="14" y="32" fill="#3b82f6" font-size="11" font-weight="900" font-family="monospace">48V</text>
            <text x="50" y="32" fill="#60a5fa" font-size="9" font-weight="700" font-family="monospace">200Ah</text>
            <rect x="10" y="50" width="80" height="8" rx="3" fill="#111827" stroke="#1e293b"/>
            <rect class="batt-fill" x="11" y="51" width="78" height="6" rx="2" fill="#22c55e" opacity="0.8"/>
            <text class="batt-pct" x="82" y="57" fill="#22c55e" font-size="5" font-weight="800" font-family="sans-serif">100%</text>
            <circle cx="16" cy="68" r="3.5" fill="#22c55e" opacity="0.7"/>
            <circle cx="26" cy="68" r="3.5" fill="#22c55e" opacity="0.6"/>
            <circle cx="36" cy="68" r="3.5" fill="#3b82f6" opacity="0.5"/>
            <circle cx="46" cy="68" r="3.5" fill="#3b82f6" opacity="0.4"/>
            <circle cx="56" cy="68" r="3.5" fill="#6b7280" opacity="0.3"/>
            <text x="64" y="72" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">LiFePO4</text>
        </svg>`,
        terminals: [
            { x: 28, y: 0, label: '+' },
            { x: 72, y: 0, label: '−' }
        ]
    },
    {
        id: 'charge_controller',
        name: 'CC PWM 10A',
        spec: 'PWM 10A, Panel 6-18V',
        category: 'passive',
        voltage: 0,
        resistance: 1.5,
        maxOutputCurrent: 10,  // 10A max regulated output
        isChargeController: true,
        width: 90, height: 55,
        svg: `<svg width="100%" height="100%" viewBox="0 0 90 55">
            <line x1="0" y1="28" x2="12" y2="28" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="78" y1="28" x2="90" y2="28" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="12" y="5" width="66" height="46" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
            <rect x="16" y="9" width="58" height="22" rx="3" fill="#0f172a" stroke="#1e293b"/>
            <text x="20" y="21" fill="#22c55e" font-size="7" font-weight="800" font-family="monospace">PWM</text>
            <text x="50" y="21" fill="#4ade80" font-size="7" font-weight="600" font-family="monospace">10A</text>
            <circle cx="22" cy="40" r="3" fill="#22c55e" opacity="0.8"/>
            <circle cx="32" cy="40" r="3" fill="#3b82f6" opacity="0.6"/>
            <circle cx="42" cy="40" r="3" fill="#f59e0b" opacity="0.5"/>
            <circle cx="52" cy="40" r="3" fill="#6b7280" opacity="0.3"/>
            <text x="16" y="52" fill="#9ca3af" font-size="5" font-family="sans-serif">SOLAR</text>
            <text x="55" y="52" fill="#9ca3af" font-size="5" font-family="sans-serif">BATT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 28, label: 'IN' },
            { x: 90, y: 28, label: 'OUT' }
        ]
    },
    {
        id: 'charge_controller_30a',
        name: 'CC PWM 30A',
        spec: 'PWM 30A, Array 1kW',
        category: 'passive',
        voltage: 0,
        resistance: 0.8,
        maxOutputCurrent: 30,  // 30A → 48V × 30A = 1440W
        isChargeController: true,
        width: 100, height: 60,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 60">
            <line x1="0" y1="30" x2="10" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="90" y1="30" x2="100" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="10" y="4" width="80" height="52" rx="5" fill="#1e293b" stroke="#2563eb" stroke-width="1.5"/>
            <rect x="14" y="8" width="72" height="24" rx="3" fill="#0f172a" stroke="#1e293b"/>
            <text x="18" y="22" fill="#3b82f6" font-size="8" font-weight="800" font-family="monospace">PWM</text>
            <text x="52" y="22" fill="#60a5fa" font-size="8" font-weight="700" font-family="monospace">30A</text>
            <circle cx="20" cy="44" r="3" fill="#22c55e" opacity="0.8"/>
            <circle cx="30" cy="44" r="3" fill="#22c55e" opacity="0.6"/>
            <circle cx="40" cy="44" r="3" fill="#3b82f6" opacity="0.6"/>
            <circle cx="50" cy="44" r="3" fill="#f59e0b" opacity="0.5"/>
            <circle cx="60" cy="44" r="3" fill="#6b7280" opacity="0.3"/>
            <text x="14" y="56" fill="#9ca3af" font-size="5" font-family="sans-serif">SOLAR</text>
            <text x="66" y="56" fill="#9ca3af" font-size="5" font-family="sans-serif">BATT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 30, label: 'IN' },
            { x: 100, y: 30, label: 'OUT' }
        ]
    },
    {
        id: 'charge_controller_60a',
        name: 'CC MPPT 60A',
        spec: 'MPPT 60A, Array 3kW',
        category: 'passive',
        voltage: 0,
        resistance: 0.4,
        maxOutputCurrent: 60,  // 60A → 48V × 60A = 2880W
        isChargeController: true,
        width: 110, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 110 65">
            <line x1="0" y1="33" x2="10" y2="33" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="100" y1="33" x2="110" y2="33" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="10" y="3" width="90" height="59" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
            <rect x="14" y="7" width="82" height="26" rx="3" fill="#111827" stroke="#1e293b"/>
            <text x="18" y="22" fill="#f59e0b" font-size="8" font-weight="900" font-family="monospace">MPPT</text>
            <text x="58" y="22" fill="#fbbf24" font-size="8" font-weight="700" font-family="monospace">60A</text>
            <circle cx="20" cy="48" r="3.5" fill="#22c55e" opacity="0.9"/>
            <circle cx="31" cy="48" r="3.5" fill="#22c55e" opacity="0.7"/>
            <circle cx="42" cy="48" r="3.5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="53" cy="48" r="3.5" fill="#f59e0b" opacity="0.6"/>
            <circle cx="64" cy="48" r="3.5" fill="#f59e0b" opacity="0.4"/>
            <circle cx="75" cy="48" r="3.5" fill="#6b7280" opacity="0.3"/>
            <text x="14" y="61" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">SOLAR</text>
            <text x="74" y="61" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">BATT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 33, label: 'IN' },
            { x: 110, y: 33, label: 'OUT' }
        ]
    },
    {
        id: 'charge_controller_100a',
        name: 'CC MPPT 100A',
        spec: 'MPPT 100A, Array 5kW',
        category: 'passive',
        voltage: 0,
        resistance: 0.2,
        maxOutputCurrent: 100,  // 100A → 48V × 100A = 4800W
        isChargeController: true,
        width: 120, height: 70,
        svg: `<svg width="100%" height="100%" viewBox="0 0 120 70">
            <line x1="0" y1="35" x2="10" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="110" y1="35" x2="120" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="10" y="2" width="100" height="66" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
            <rect x="15" y="7" width="90" height="28" rx="4" fill="#111827" stroke="#1e293b"/>
            <text x="20" y="24" fill="#ef4444" font-size="9" font-weight="900" font-family="monospace">MPPT</text>
            <text x="62" y="24" fill="#f87171" font-size="9" font-weight="700" font-family="monospace">100A</text>
            <circle cx="22" cy="52" r="4" fill="#22c55e" opacity="0.9"/>
            <circle cx="34" cy="52" r="4" fill="#22c55e" opacity="0.7"/>
            <circle cx="46" cy="52" r="4" fill="#3b82f6" opacity="0.7"/>
            <circle cx="58" cy="52" r="4" fill="#f59e0b" opacity="0.6"/>
            <circle cx="70" cy="52" r="4" fill="#f59e0b" opacity="0.5"/>
            <circle cx="82" cy="52" r="4" fill="#ef4444" opacity="0.4"/>
            <circle cx="94" cy="52" r="4" fill="#6b7280" opacity="0.3"/>
            <text x="15" y="66" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">SOLAR</text>
            <text x="82" y="66" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">BATT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 35, label: 'IN' },
            { x: 120, y: 35, label: 'OUT' }
        ]
    },
    {
        id: 'inverter',
        name: 'Inverter 1.5kW',
        spec: '48V DC → 220V AC, 1500W',
        category: 'passive',
        voltage: 0,
        resistance: 3,
        ratedPower: 1500,
        inputVoltageMin: 42.0,
        outputVoltageEf: 220,
        isInverter: true,
        width: 100, height: 60,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 60">
            <line x1="0" y1="30" x2="12" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="88" y1="30" x2="100" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="12" y="5" width="76" height="50" rx="5" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
            <rect x="16" y="9" width="68" height="24" rx="3" fill="#111827" stroke="#1f2937"/>
            <text x="20" y="24" fill="#60a5fa" font-size="8" font-weight="800" font-family="monospace">DC→AC</text>
            <text x="68" y="24" fill="#fbbf24" font-size="6" font-weight="700" font-family="monospace">1.5k</text>
            <path d="M 20 40 L 24 40 L 26 36 L 30 44 L 34 36 L 36 40 L 40 40" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
            <text x="18" y="54" fill="#ef4444" font-size="6" font-weight="700" font-family="sans-serif">DC IN</text>
            <path d="M 54 40 Q 58 34, 62 40 Q 66 46, 70 40 Q 74 34, 78 40" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
            <text x="55" y="54" fill="#22c55e" font-size="6" font-weight="700" font-family="sans-serif">AC OUT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 30, label: 'DC' },
            { x: 100, y: 30, label: 'AC' }
        ]
    },
    {
        id: 'inverter_3k',
        name: 'Inverter 3kW',
        spec: '48V DC → 220V AC, 3000W',
        category: 'passive',
        voltage: 0,
        resistance: 2,
        ratedPower: 3000,
        inputVoltageMin: 42.0,
        outputVoltageEf: 220,
        isInverter: true,
        width: 110, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 110 65">
            <line x1="0" y1="32" x2="12" y2="32" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="98" y1="32" x2="110" y2="32" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="12" y="4" width="86" height="56" rx="5" fill="#1f2937" stroke="#374151" stroke-width="2"/>
            <rect x="16" y="8" width="78" height="26" rx="3" fill="#111827" stroke="#1f2937"/>
            <text x="20" y="24" fill="#60a5fa" font-size="9" font-weight="800" font-family="monospace">DC→AC</text>
            <text x="70" y="24" fill="#f59e0b" font-size="7" font-weight="700" font-family="monospace">3kW</text>
            <path d="M 22 44 L 26 44 L 28 39 L 32 49 L 36 39 L 38 44 L 42 44" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
            <text x="20" y="58" fill="#ef4444" font-size="6" font-weight="700" font-family="sans-serif">DC IN</text>
            <path d="M 60 44 Q 64 37, 68 44 Q 72 51, 76 44 Q 80 37, 84 44" fill="none" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round"/>
            <text x="61" y="58" fill="#22c55e" font-size="6" font-weight="700" font-family="sans-serif">AC OUT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 32, label: 'DC' },
            { x: 110, y: 32, label: 'AC' }
        ]
    },
    {
        id: 'inverter_5k',
        name: 'Inverter 5kW',
        spec: '48V DC → 220V AC, 5000W',
        category: 'passive',
        voltage: 0,
        resistance: 1.5,
        ratedPower: 5000,
        inputVoltageMin: 42.0,
        outputVoltageEf: 220,
        isInverter: true,
        width: 120, height: 70,
        svg: `<svg width="100%" height="100%" viewBox="0 0 120 70">
            <line x1="0" y1="35" x2="12" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="108" y1="35" x2="120" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="12" y="4" width="96" height="62" rx="6" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/>
            <rect x="16" y="8" width="88" height="28" rx="4" fill="#111827" stroke="#1f2937"/>
            <text x="22" y="26" fill="#60a5fa" font-size="10" font-weight="800" font-family="monospace">DC→AC</text>
            <text x="76" y="26" fill="#f59e0b" font-size="9" font-weight="900" font-family="monospace">5kW</text>
            <path d="M 24 48 L 28 48 L 30 42 L 34 54 L 38 42 L 40 48 L 44 48" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
            <text x="22" y="64" fill="#ef4444" font-size="7" font-weight="700" font-family="sans-serif">DC IN</text>
            <path d="M 66 48 Q 70 40, 74 48 Q 78 56, 82 48 Q 86 40, 90 48" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
            <text x="67" y="64" fill="#22c55e" font-size="7" font-weight="700" font-family="sans-serif">AC OUT</text>
        </svg>`,
        terminals: [
            { x: 0, y: 35, label: 'DC' },
            { x: 120, y: 35, label: 'AC' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // Step-Down DC Converters
    // ═══════════════════════════════════════════════════
    {
        id: 'stepdown_12v',
        name: 'Step-Down 12V',
        spec: '48V→12V DC, 3A max',
        category: 'passive',
        voltage: 0,
        resistance: 2,
        maxOutputCurrent: 3,  // 3A max regulated output
        isStepDown: true,
        width: 70, height: 45,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 45">
            <line x1="0" y1="22" x2="8" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="62" y1="22" x2="70" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="8" y="3" width="54" height="39" rx="4" fill="#1f2937" stroke="#8b5cf6" stroke-width="1.5"/>
            <rect x="11" y="6" width="48" height="16" rx="2" fill="#111827"/>
            <text x="15" y="16" fill="#a78bfa" font-size="6" font-weight="800" font-family="monospace">48→12V</text>
            <path d="M 15 30 L 20 30 L 22 26 L 26 34 L 28 30 L 33 30" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
            <text x="12" y="40" fill="#f87171" font-size="5" font-weight="700" font-family="sans-serif">IN</text>
            <path d="M 38 30 L 55 30" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
            <text x="45" y="40" fill="#4ade80" font-size="5" font-weight="700" font-family="sans-serif">OUT</text>
            <circle class="sd-indicator" cx="56" cy="9" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 0, y: 22, label: 'IN' },
            { x: 70, y: 22, label: 'OUT' }
        ]
    },
    {
        id: 'stepdown_5v',
        name: 'Step-Down 5V',
        spec: '48V→5V DC, 2A max',
        category: 'passive',
        voltage: 0,
        resistance: 2,
        maxOutputCurrent: 2,  // 2A max regulated output
        isStepDown: true,
        width: 70, height: 45,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 45">
            <line x1="0" y1="22" x2="8" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="62" y1="22" x2="70" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="8" y="3" width="54" height="39" rx="4" fill="#1f2937" stroke="#06b6d4" stroke-width="1.5"/>
            <rect x="11" y="6" width="48" height="16" rx="2" fill="#111827"/>
            <text x="16" y="16" fill="#67e8f9" font-size="6" font-weight="800" font-family="monospace">48→5V</text>
            <path d="M 15 30 L 20 30 L 22 26 L 26 34 L 28 30 L 33 30" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
            <text x="12" y="40" fill="#f87171" font-size="5" font-weight="700" font-family="sans-serif">IN</text>
            <path d="M 38 30 L 55 30" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
            <text x="45" y="40" fill="#4ade80" font-size="5" font-weight="700" font-family="sans-serif">OUT</text>
            <circle class="sd-indicator" cx="56" cy="9" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 0, y: 22, label: 'IN' },
            { x: 70, y: 22, label: 'OUT' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // Grounding / Neutral Bus
    // ═══════════════════════════════════════════════════
    {
        id: 'ground',
        name: 'Ground/Netral',
        spec: 'Bus Netral (auto-connect)',
        category: 'passive',
        voltage: 0,
        resistance: 0.01,
        isGround: true,
        width: 40, height: 45,
        svg: `<svg width="100%" height="100%" viewBox="0 0 40 45">
            <line x1="20" y1="0" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="6" y1="15" x2="34" y2="15" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
            <line x1="10" y1="22" x2="30" y2="22" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="14" y1="29" x2="26" y2="29" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
            <line x1="17" y1="35" x2="23" y2="35" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
            <text x="5" y="44" fill="#4ade80" font-size="5" font-weight="700" font-family="sans-serif">GND</text>
        </svg>`,
        terminals: [
            { x: 20, y: 0, label: 'GND' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // Power Distribution (Outlets)
    // ═══════════════════════════════════════════════════
    {
        id: 'outlet',
        name: 'Stop Kontak',
        spec: '220V AC, 16A',
        category: 'passive',
        voltage: 0,
        resistance: 0.5,
        width: 50, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 50">
            <line x1="5" y1="25" x2="0" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="25" x2="45" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="5" y="5" width="40" height="40" rx="5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
            <rect x="8" y="8" width="34" height="34" rx="8" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"/>
            <circle cx="25" cy="25" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <rect x="19" y="17" width="3" height="7" rx="1" fill="#6b7280"/>
            <rect x="28" y="17" width="3" height="7" rx="1" fill="#6b7280"/>
            <circle cx="25" cy="30" r="2" fill="#6b7280" class="outlet-indicator" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 0, y: 25, label: 'L' },
            { x: 50, y: 25, label: 'N' }
        ]
    },
    {
        id: 'outlet_strip',
        name: 'Terminal Listrik',
        spec: '220V AC, 16A, 4 Lubang',
        category: 'passive',
        voltage: 0,
        resistance: 0.5,
        width: 110, height: 40,
        svg: `<svg width="100%" height="100%" viewBox="0 0 110 40">
            <line x1="0" y1="20" x2="5" y2="20" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="105" y1="20" x2="110" y2="20" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="5" y="3" width="100" height="34" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
            <circle cx="22" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
            <rect x="19" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <rect x="25" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <circle cx="44" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
            <rect x="41" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <rect x="47" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <circle cx="66" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
            <rect x="63" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <rect x="69" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <circle cx="88" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
            <rect x="85" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <rect x="91" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
            <circle cx="11" cy="10" r="2.5" fill="#ef4444" class="strip-power" opacity="0.4" style="transition: all 0.4s;"/>
            <rect x="7" y="31" width="8" height="3" rx="1" fill="#94a3b8"/>
        </svg>`,
        terminals: [
            { x: 0, y: 20, label: 'L' },
            { x: 110, y: 20, label: 'N' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // AC Household Appliances (require Inverter)
    // ═══════════════════════════════════════════════════
    {
        id: 'iron',
        name: 'Setrika',
        spec: '220V AC, 1000W',
        category: 'output',
        voltage: 0,
        resistance: 200,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 1000,  // 1000W real
        glowGradient: 'bulbGlowGrad',
        width: 80, height: 55,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 55">
            <line x1="15" y1="0" x2="15" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="65" y1="0" x2="65" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <path d="M 10 18 L 70 18 L 70 30 Q 70 36, 65 38 L 50 44 L 8 44 Q 4 44, 4 40 L 4 26 Q 4 18, 10 18 Z" fill="#4b5563" stroke="#374151" stroke-width="1.5"/>
            <path class="iron-plate" d="M 6 38 L 50 38 L 65 32 L 68 28 L 68 24 L 10 24 L 6 28 Z" fill="#9ca3af" stroke="#6b7280" stroke-width="0.5" style="transition: fill 0.4s;"/>
            <rect x="20" y="10" width="40" height="10" rx="3" fill="#374151" stroke="#4b5563"/>
            <circle class="iron-indicator" cx="40" cy="15" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
            <text x="14" y="34" fill="#1f2937" font-size="7" font-weight="800" font-family="sans-serif" opacity="0.5">AC</text>
        </svg>`,
        terminals: [
            { x: 15, y: 0, label: 'L' },
            { x: 65, y: 0, label: 'N' }
        ]
    },
    {
        id: 'fridge',
        name: 'Kulkas',
        spec: '220V AC, 100W',
        category: 'output',
        voltage: 0,
        resistance: 350,
        maxCurrent: 0.3,
        acOnly: true,
        ratedPower: 100,  // 100W real
        width: 55, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 55 90">
            <line x1="15" y1="80" x2="15" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="40" y1="80" x2="40" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="5" y="2" width="45" height="78" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
            <rect x="8" y="5" width="39" height="25" rx="2" fill="#1e293b" stroke="#334155"/>
            <rect x="8" y="34" width="39" height="43" rx="2" fill="#1e293b" stroke="#334155"/>
            <line x1="8" y1="32" x2="47" y2="32" stroke="#475569" stroke-width="1.5"/>
            <rect x="42" y="12" width="3" height="12" rx="1" fill="#94a3b8"/>
            <rect x="42" y="42" width="3" height="18" rx="1" fill="#94a3b8"/>
            <circle class="fridge-indicator" cx="15" cy="15" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
            <text x="14" y="58" fill="#475569" font-size="7" font-weight="800" font-family="sans-serif" opacity="0.5">AC</text>
        </svg>`,
        terminals: [
            { x: 15, y: 90, label: 'L' },
            { x: 40, y: 90, label: 'N' }
        ]
    },
    {
        id: 'blender',
        name: 'Blender',
        spec: '220V AC, 350W',
        category: 'output',
        voltage: 0,
        resistance: 250,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 350,  // 350W real
        width: 50, height: 85,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 85">
            <line x1="12" y1="75" x2="12" y2="85" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="38" y1="75" x2="38" y2="85" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="8" y="60" width="34" height="18" rx="4" fill="#374151" stroke="#1e293b" stroke-width="1.5"/>
            <circle class="blender-indicator" cx="25" cy="69" r="4" fill="#6b7280" stroke="#4b5563" style="transition: fill 0.4s;"/>
            <path d="M 14 60 L 10 15 Q 9 5, 18 4 L 32 4 Q 41 5, 40 15 L 36 60 Z" fill="#94a3b8" stroke="#6b7280" stroke-width="1" opacity="0.3"/>
            <path d="M 14 60 L 10 15 Q 9 5, 18 4 L 32 4 Q 41 5, 40 15 L 36 60 Z" fill="none" stroke="#9ca3af" stroke-width="1.5"/>
            <rect x="18" y="0" width="14" height="6" rx="2" fill="#4b5563" stroke="#374151"/>
            <g class="blender-blade" style="transform-origin: 25px 50px;">
                <line x1="18" y1="50" x2="32" y2="50" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
                <line x1="25" y1="43" x2="25" y2="57" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
            </g>
            <text x="14" y="73" fill="#9ca3af" font-size="5" font-weight="800" font-family="sans-serif">AC</text>
        </svg>`,
        terminals: [
            { x: 12, y: 85, label: 'L' },
            { x: 38, y: 85, label: 'N' }
        ]
    },
    {
        id: 'ricecooker',
        name: 'Rice Cooker',
        spec: '220V AC, 400W',
        category: 'output',
        voltage: 0,
        resistance: 220,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 400,  // 400W real
        glowGradient: 'bulbGlowGrad',
        width: 70, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 65">
            <line x1="15" y1="55" x2="15" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="55" x2="55" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="35" cy="50" rx="30" ry="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <path d="M 5 35 Q 5 52, 35 52 Q 65 52, 65 35 L 65 28 Q 65 18, 35 18 Q 5 18, 5 28 Z" fill="#374151" stroke="#1e293b" stroke-width="1.5"/>
            <ellipse cx="35" cy="18" rx="30" ry="10" fill="#4b5563" stroke="#374151" stroke-width="1.5"/>
            <ellipse cx="35" cy="18" rx="20" ry="6" fill="#334155"/>
            <circle cx="35" cy="17" r="4" fill="#1e293b" stroke="#374151"/>
            <rect x="32" y="8" width="6" height="6" rx="2" fill="#6b7280" stroke="#4b5563"/>
            <circle class="rc-indicator" cx="55" cy="35" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
            <text x="20" y="42" fill="#9ca3af" font-size="6" font-weight="800" font-family="sans-serif" opacity="0.4">AC</text>
        </svg>`,
        terminals: [
            { x: 15, y: 65, label: 'L' },
            { x: 55, y: 65, label: 'N' }
        ]
    },
    {
        id: 'ac_05pk',
        name: 'AC 0.5 PK',
        spec: '220V AC, 350W',
        category: 'output',
        voltage: 0,
        resistance: 280,
        maxCurrent: 0.4,
        acOnly: true,
        ratedPower: 350,
        width: 90, height: 45,
        svg: `<svg width="100%" height="100%" viewBox="0 0 90 45">
            <line x1="20" y1="38" x2="20" y2="45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="38" x2="70" y2="45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="3" y="3" width="84" height="35" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <rect x="6" y="6" width="78" height="20" rx="3" fill="#f8fafc"/>
            <line x1="10" y1="10" x2="80" y2="10" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="13" x2="80" y2="13" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="16" x2="80" y2="16" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="19" x2="80" y2="19" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="22" x2="80" y2="22" stroke="#cbd5e1" stroke-width="0.8"/>
            <rect x="6" y="28" width="78" height="6" rx="2" fill="#f1f5f9" stroke="#e2e8f0"/>
            <circle class="ac-indicator" cx="75" cy="31" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
            <text x="10" y="33" fill="#94a3b8" font-size="5" font-weight="800" font-family="sans-serif">0.5PK</text>
            <g class="ac-fan" style="transform-origin: 45px 14px;">
                <line x1="38" y1="14" x2="52" y2="14" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
                <line x1="45" y1="8" x2="45" y2="20" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
            </g>
        </svg>`,
        terminals: [
            { x: 20, y: 45, label: 'L' },
            { x: 70, y: 45, label: 'N' }
        ]
    },
    {
        id: 'ac_1pk',
        name: 'AC 1 PK',
        spec: '220V AC, 750W',
        category: 'output',
        voltage: 0,
        resistance: 240,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 750,
        width: 100, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 100 50">
            <line x1="22" y1="42" x2="22" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="78" y1="42" x2="78" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="3" y="3" width="94" height="40" rx="7" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <rect x="6" y="6" width="88" height="24" rx="3" fill="#f8fafc"/>
            <line x1="10" y1="10" x2="90" y2="10" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="13" x2="90" y2="13" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="16" x2="90" y2="16" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="19" x2="90" y2="19" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="22" x2="90" y2="22" stroke="#cbd5e1" stroke-width="0.8"/>
            <line x1="10" y1="25" x2="90" y2="25" stroke="#cbd5e1" stroke-width="0.8"/>
            <rect x="6" y="32" width="88" height="7" rx="2" fill="#f1f5f9" stroke="#e2e8f0"/>
            <circle class="ac-indicator" cx="84" cy="36" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
            <text x="10" y="38" fill="#94a3b8" font-size="6" font-weight="800" font-family="sans-serif">1 PK</text>
            <g class="ac-fan" style="transform-origin: 50px 16px;">
                <line x1="42" y1="16" x2="58" y2="16" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
                <line x1="50" y1="9" x2="50" y2="23" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
            </g>
        </svg>`,
        terminals: [
            { x: 22, y: 50, label: 'L' },
            { x: 78, y: 50, label: 'N' }
        ]
    },
    {
        id: 'tv_led',
        name: 'TV LED 32"',
        spec: '220V AC, 80W',
        category: 'output',
        voltage: 0,
        resistance: 300,
        maxCurrent: 0.4,
        acOnly: true,
        ratedPower: 80,
        width: 75, height: 55,
        svg: `<svg width="100%" height="100%" viewBox="0 0 75 55">
            <line x1="18" y1="48" x2="18" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="57" y1="48" x2="57" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="5" y="3" width="65" height="40" rx="3" fill="#111827" stroke="#374151" stroke-width="2"/>
            <rect x="8" y="6" width="59" height="34" rx="1" fill="#1e293b" class="tv-screen"/>
            <rect x="20" y="43" width="35" height="5" rx="1.5" fill="#374151"/>
            <text x="15" y="26" fill="#475569" font-size="8" font-weight="700" font-family="sans-serif">TV 32"</text>
            <circle class="tv-indicator" cx="63" cy="45" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 55, label: 'L' },
            { x: 57, y: 55, label: 'N' }
        ]
    },
    {
        id: 'lamp_30w',
        name: 'Lampu LED 30W',
        spec: '220V AC, 30W',
        category: 'output',
        voltage: 0,
        resistance: 400,
        maxCurrent: 0.3,
        acOnly: true,
        ratedPower: 30,
        width: 45, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 45 65">
            <line x1="13" y1="58" x2="13" y2="65" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="58" x2="32" y2="65" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M 10 30 Q 10 5, 22.5 5 Q 35 5, 35 30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
            <ellipse cx="22.5" cy="30" rx="12.5" ry="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
            <rect x="14" y="33" width="17" height="8" rx="2" fill="#94a3b8"/>
            <line x1="14" y1="35" x2="31" y2="35" stroke="#78716c" stroke-width="0.5"/>
            <line x1="14" y1="37" x2="31" y2="37" stroke="#78716c" stroke-width="0.5"/>
            <line x1="14" y1="39" x2="31" y2="39" stroke="#78716c" stroke-width="0.5"/>
            <rect x="17" y="41" width="11" height="4" rx="1" fill="#6b7280"/>
            <line x1="17" y1="45" x2="13" y2="58" stroke="#94a3b8" stroke-width="2"/>
            <line x1="28" y1="45" x2="32" y2="58" stroke="#94a3b8" stroke-width="2"/>
            <text x="11" y="52" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">30W</text>
            <circle class="lamp-glow" cx="22.5" cy="18" r="8" fill="none" opacity="0"/>
        </svg>`,
        terminals: [
            { x: 13, y: 65, label: 'L' },
            { x: 32, y: 65, label: 'N' }
        ]
    },
    {
        id: 'computer',
        name: 'Komputer',
        spec: '220V AC, 300W',
        category: 'output',
        voltage: 0,
        resistance: 260,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 300,
        width: 70, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 70 65">
            <line x1="15" y1="58" x2="15" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="58" x2="55" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="5" y="3" width="60" height="36" rx="3" fill="#111827" stroke="#374151" stroke-width="1.5"/>
            <rect x="8" y="6" width="54" height="30" rx="1" fill="#1e293b" class="pc-screen"/>
            <rect x="24" y="39" width="22" height="3" rx="1" fill="#374151"/>
            <rect x="18" y="42" width="34" height="3" rx="1" fill="#4b5563"/>
            <rect x="50" y="47" width="15" height="12" rx="2" fill="#1f2937" stroke="#374151" stroke-width="1"/>
            <circle cx="57.5" cy="50" r="1.5" fill="#22c55e" opacity="0.4" class="pc-power"/>
            <rect x="51" y="55" width="3" height="1" rx="0.5" fill="#6b7280"/>
            <rect x="55" y="55" width="3" height="1" rx="0.5" fill="#6b7280"/>
            <rect x="59" y="55" width="3" height="1" rx="0.5" fill="#6b7280"/>
            <text x="14" y="24" fill="#475569" font-size="7" font-weight="700" font-family="sans-serif">PC</text>
            <circle class="pc-indicator" cx="62" cy="41" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 15, y: 65, label: 'L' },
            { x: 55, y: 65, label: 'N' }
        ]
    },
    {
        id: 'pump_125',
        name: 'Pompa Air 125W',
        spec: '220V AC, 125W',
        category: 'output',
        voltage: 0,
        resistance: 320,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 125,
        width: 75, height: 60,
        svg: `<svg width="100%" height="100%" viewBox="0 0 75 60">
            <line x1="15" y1="53" x2="15" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="60" y1="53" x2="60" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="8" y="15" width="50" height="38" rx="5" fill="#1e40af" stroke="#2563eb" stroke-width="1.5"/>
            <circle cx="33" cy="34" r="14" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
            <g class="pump-impeller" style="transform-origin: 33px 34px;">
                <line x1="33" y1="22" x2="33" y2="46" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                <line x1="21" y1="34" x2="45" y2="34" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                <line x1="24" y1="25" x2="42" y2="43" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="42" y1="25" x2="24" y2="43" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
            </g>
            <rect x="58" y="25" width="14" height="8" rx="2" fill="#3b82f6"/>
            <rect x="66" y="22" width="6" height="14" rx="2" fill="#2563eb" stroke="#1e40af" stroke-width="0.5"/>
            <circle cx="69" cy="29" r="2.5" fill="#111827"/>
            <text x="10" y="12" fill="#60a5fa" font-size="6" font-weight="800" font-family="sans-serif">125W</text>
            <circle class="pump-indicator" cx="52" cy="20" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 15, y: 60, label: 'L' },
            { x: 60, y: 60, label: 'N' }
        ]
    },
    {
        id: 'pump_250',
        name: 'Pompa Air 250W',
        spec: '220V AC, 250W',
        category: 'output',
        voltage: 0,
        resistance: 270,
        maxCurrent: 0.5,
        acOnly: true,
        ratedPower: 250,
        width: 85, height: 65,
        svg: `<svg width="100%" height="100%" viewBox="0 0 85 65">
            <line x1="18" y1="58" x2="18" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="67" y1="58" x2="67" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="8" y="15" width="58" height="43" rx="6" fill="#1e3a5f" stroke="#2563eb" stroke-width="2"/>
            <circle cx="37" cy="37" r="16" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
            <g class="pump-impeller" style="transform-origin: 37px 37px;">
                <line x1="37" y1="23" x2="37" y2="51" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="23" y1="37" x2="51" y2="37" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="27" y1="27" x2="47" y2="47" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                <line x1="47" y1="27" x2="27" y2="47" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
            </g>
            <rect x="66" y="27" width="16" height="10" rx="3" fill="#3b82f6"/>
            <rect x="75" y="23" width="8" height="18" rx="3" fill="#2563eb" stroke="#1e40af" stroke-width="0.5"/>
            <circle cx="79" cy="32" r="3" fill="#111827"/>
            <text x="10" y="12" fill="#60a5fa" font-size="7" font-weight="800" font-family="sans-serif">250W</text>
            <circle class="pump-indicator" cx="60" cy="20" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
        </svg>`,
        terminals: [
            { x: 18, y: 65, label: 'L' },
            { x: 67, y: 65, label: 'N' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // Measurement Instruments
    // ═══════════════════════════════════════════════════
    {
        id: 'voltmeter',
        name: 'Multimeter',
        spec: 'Digital DMM, V / A / Ω',
        category: 'passive',
        voltage: 0,
        resistance: 10000000, // Default V mode: 10MΩ
        isMultimeter: true,
        isVoltmeter: true,     // backward compat
        maxCurrent: 10.0,      // 10A fuse like real DMM
        width: 80, height: 100,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 100">
            <line x1="20" y1="88" x2="20" y2="100" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <line x1="60" y1="88" x2="60" y2="100" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
            <rect x="4" y="4" width="72" height="84" rx="8" fill="#1a1a2e" stroke="#2d2d4a" stroke-width="2"/>
            <rect x="4" y="4" width="72" height="84" rx="8" fill="url(#motorBody)" opacity="0.3"/>
            <rect x="10" y="10" width="60" height="34" rx="4" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
            <rect class="vm-screen-bg" x="12" y="12" width="56" height="30" rx="3" fill="#0d1117" opacity="0.9"/>
            <text class="vm-reading" x="40" y="33" fill="#22c55e" font-size="16" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code','Consolas',monospace" style="transition: fill 0.3s;">0.00</text>
            <text class="vm-unit" x="65" y="19" fill="#4ade80" font-size="8" font-weight="700" text-anchor="end" font-family="sans-serif" opacity="0.7">V</text>
            <circle class="mm-dial-bg" cx="40" cy="58" r="11" fill="#111827" stroke="#374151" stroke-width="1.5"/>
            <text class="mm-label-v" x="40" y="51" fill="#22c55e" font-size="5.5" font-weight="800" text-anchor="middle" font-family="sans-serif">V</text>
            <text class="mm-label-o" x="49" y="63" fill="#6b7280" font-size="5.5" font-weight="800" text-anchor="middle" font-family="sans-serif">Ω</text>
            <text class="mm-label-a" x="31" y="63" fill="#6b7280" font-size="5.5" font-weight="800" text-anchor="middle" font-family="sans-serif">A</text>
            <line class="mm-dial-arrow" x1="40" y1="58" x2="40" y2="50" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
            <circle cx="40" cy="58" r="2.5" fill="#f59e0b"/>
            <text class="mm-mode-label" x="40" y="76" fill="#9ca3af" font-size="7" font-weight="700" text-anchor="middle" font-family="sans-serif">VOLTAGE</text>
            <circle class="vm-indicator" cx="66" cy="82" r="3" fill="#374151" style="transition: fill 0.4s;"/>
            <circle cx="20" cy="92" r="4" fill="#374151" stroke="#4b5563" stroke-width="1"/>
            <text x="20" y="94" fill="#ef4444" font-size="5" font-weight="900" text-anchor="middle" font-family="sans-serif">+</text>
            <circle cx="60" cy="92" r="4" fill="#374151" stroke="#4b5563" stroke-width="1"/>
            <text x="60" y="94" fill="#9ca3af" font-size="5" font-weight="900" text-anchor="middle" font-family="sans-serif">−</text>
        </svg>`,
        terminals: [
            { x: 20, y: 100, label: '+' },
            { x: 60, y: 100, label: '−' }
        ]
    },
    // ═══════════════════════════════════════════════════
    // Timer / Oscillator
    // ═══════════════════════════════════════════════════
    {
        id: 'timer_555',
        name: 'Timer 555',
        spec: 'Astable ~1Hz',
        category: 'passive',
        voltage: 0,
        resistance: 0.01,
        isTimer: true,
        timerHz: 1,
        maxCurrent: 0.5,
        width: 80, height: 50,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 50">
            <line x1="0" y1="25" x2="10" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="70" y1="25" x2="80" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect x="10" y="5" width="60" height="40" rx="3" fill="#1a1a2e" stroke="#374151" stroke-width="1.5"/>
            <rect x="10" y="5" width="60" height="40" rx="3" fill="url(#motorBody)" opacity="0.3"/>
            <circle cx="18" cy="12" r="3" fill="none" stroke="#6b7280" stroke-width="0.8"/>
            <rect x="15" y="20" width="50" height="2" rx="1" fill="#374151"/>
            <rect x="15" y="28" width="50" height="2" rx="1" fill="#374151"/>
            <circle cx="18" cy="25" r="2" fill="#94a3b8"/>
            <circle cx="28" cy="25" r="2" fill="#94a3b8"/>
            <circle cx="38" cy="25" r="2" fill="#94a3b8"/>
            <circle cx="48" cy="25" r="2" fill="#94a3b8"/>
            <circle cx="58" cy="25" r="2" fill="#94a3b8"/>
            <text x="25" y="16" fill="#a78bfa" font-size="9" font-weight="900" font-family="monospace">555</text>
            <circle class="timer-indicator" cx="62" cy="12" r="3" fill="#6b7280" style="transition: fill 0.15s;"/>
            <polyline class="timer-wave" points="20,38 24,38 24,34 28,34 28,38 32,38 32,34 36,34 36,38 40,38 40,34 44,34 44,38" fill="none" stroke="#4ade80" stroke-width="1" opacity="0.4"/>
        </svg>`,
        terminals: [
            { x: 0, y: 25, label: 'IN' },
            { x: 80, y: 25, label: 'OUT' }
        ]
    },
    {
        id: 'led_strip_rgb',
        name: 'LED Strip RGB',
        spec: '3-12V, Built-in Controller',
        category: 'output',
        voltage: 0,
        resistance: 500,
        forwardVoltage: 2.5,
        isDiode: true,
        isBlinkingLed: true,
        blinkHz: 2,
        maxCurrent: 0.06,
        ratedPower: 0.5,
        width: 120, height: 30,
        svg: `<svg width="100%" height="100%" viewBox="0 0 120 30">
            <line x1="0" y1="15" x2="10" y2="15" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="110" y1="15" x2="120" y2="15" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
            <rect x="10" y="4" width="100" height="22" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <rect x="10" y="4" width="100" height="22" rx="4" fill="url(#motorBody)" opacity="0.15"/>
            <line x1="10" y1="9" x2="110" y2="9" stroke="#334155" stroke-width="0.5"/>
            <line x1="10" y1="21" x2="110" y2="21" stroke="#334155" stroke-width="0.5"/>
            <circle class="strip-led strip-led-0" cx="25" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
            <circle class="strip-led strip-led-1" cx="42" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
            <circle class="strip-led strip-led-2" cx="59" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
            <circle class="strip-led strip-led-3" cx="76" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
            <circle class="strip-led strip-led-4" cx="93" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
            <text x="28" y="28" fill="#64748b" font-size="5" font-family="monospace" opacity="0.6">R G B  S T R I P</text>
        </svg>`,
        terminals: [
            { x: 0, y: 15, label: '+' },
            { x: 120, y: 15, label: '−' }
        ]
    },
    // ═══ MCB — Miniature Circuit Breaker (PLN Tiers) ═══
    {
        id: 'mcb_4a',
        name: 'MCB 4A (900VA)',
        nameEn: 'MCB 4A (900VA)',
        spec: '4A, 230V AC, 900VA',
        category: 'passive',
        voltage: 0, resistance: 0.01, maxCurrent: 4, isMCB: true,
        width: 50, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
            <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
            <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
            <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
            <text x="25" y="18" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">900VA</text>
            <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">4A</text>
            <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
        </svg>`,
        terminals: [{ x: 25, y: 0, label: 'LINE' }, { x: 25, y: 90, label: 'LOAD' }]
    },
    {
        id: 'mcb_6a',
        name: 'MCB 6A (1300VA)',
        nameEn: 'MCB 6A (1300VA)',
        spec: '6A, 230V AC, 1300VA',
        category: 'passive',
        voltage: 0, resistance: 0.01, maxCurrent: 6, isMCB: true,
        width: 50, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
            <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
            <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
            <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
            <text x="25" y="18" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">1300VA</text>
            <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">6A</text>
            <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
        </svg>`,
        terminals: [{ x: 25, y: 0, label: 'LINE' }, { x: 25, y: 90, label: 'LOAD' }]
    },
    {
        id: 'mcb_10a',
        name: 'MCB 10A (2200VA)',
        nameEn: 'MCB 10A (2200VA)',
        spec: '10A, 230V AC, 2200VA',
        category: 'passive',
        voltage: 0, resistance: 0.01, maxCurrent: 10, isMCB: true,
        width: 50, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
            <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
            <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
            <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
            <text x="25" y="18" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">2200VA</text>
            <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">10A</text>
            <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
        </svg>`,
        terminals: [{ x: 25, y: 0, label: 'LINE' }, { x: 25, y: 90, label: 'LOAD' }]
    },
    {
        id: 'mcb_16a',
        name: 'MCB 16A',
        nameEn: 'MCB 16A',
        spec: '16A, 230V AC',
        category: 'passive',
        voltage: 0,
        resistance: 0.01,
        maxCurrent: 16,
        isMCB: true,
        width: 50, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
            <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
            <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
            <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
            <text x="25" y="20" fill="#94a3b8" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">MCB</text>
            <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">16A</text>
            <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 25, y: 0, label: 'LINE' },
            { x: 25, y: 90, label: 'LOAD' }
        ]
    },
    {
        id: 'mcb_32a',
        name: 'MCB 32A',
        nameEn: 'MCB 32A',
        spec: '32A, 230V AC',
        category: 'passive',
        voltage: 0,
        resistance: 0.01,
        maxCurrent: 32,
        isMCB: true,
        width: 50, height: 90,
        svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
            <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
            <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
            <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
            <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
            <text x="25" y="20" fill="#94a3b8" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">MCB</text>
            <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">32A</text>
            <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 25, y: 0, label: 'LINE' },
            { x: 25, y: 90, label: 'LOAD' }
        ]
    },
    // ═══ kWh Meter — Electric Meter with spinning disc ═══
    {
        id: 'kwh_meter',
        name: 'Meteran Listrik',
        nameEn: 'kWh Meter',
        spec: '1P, 230V, 40A',
        category: 'passive',
        voltage: 0,
        resistance: 0.05,
        isKwhMeter: true,
        maxCurrent: 40,
        width: 80, height: 100,
        svg: `<svg width="100%" height="100%" viewBox="0 0 80 100">
            <rect x="4" y="4" width="72" height="92" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <rect x="4" y="4" width="72" height="92" rx="6" fill="url(#motorBody)" opacity="0.15"/>
            <line x1="25" y1="0" x2="25" y2="8" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="0" x2="55" y2="8" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="92" x2="25" y2="100" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <line x1="55" y1="92" x2="55" y2="100" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
            <text x="40" y="16" fill="#64748b" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">kWh METER</text>
            <rect x="10" y="20" width="60" height="26" rx="3" fill="#0a0a1a" stroke="#1e3a5f" stroke-width="0.8"/>
            <text x="40" y="28" fill="#4ade80" font-size="6" font-weight="700" text-anchor="middle" font-family="sans-serif" opacity="0.7">kWh</text>
            <text class="kwh-reading" x="40" y="42" fill="#22c55e" font-size="14" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code',monospace">000.00</text>
            <rect x="14" y="50" width="52" height="26" rx="3" fill="#111827" stroke="#1e293b" stroke-width="0.8"/>
            <circle class="meter-disc-bg" cx="40" cy="63" r="10" fill="#1a1a2e" stroke="#374151" stroke-width="1"/>
            <g class="meter-disc-group">
                <circle class="meter-disc" cx="40" cy="63" r="8" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
                <line class="meter-disc-mark" x1="40" y1="55" x2="40" y2="59" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
            </g>
            <text class="meter-watt" x="40" y="86" fill="#f59e0b" font-size="9" font-weight="800" text-anchor="middle" font-family="'JetBrains Mono',monospace">0W</text>
            <circle class="meter-led" cx="65" cy="86" r="2.5" fill="#475569" style="transition: fill 0.3s;"/>
        </svg>`,
        terminals: [
            { x: 25, y: 0, label: 'LINE' },
            { x: 25, y: 100, label: 'LOAD' }
        ]
    }
];
