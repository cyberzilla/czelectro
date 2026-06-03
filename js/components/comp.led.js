// ═══════════════════════════════════════════════════
// CZElectro — LED Component Module
// ═══════════════════════════════════════════════════

const variants = [
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
    }
];

const styles = `
    /* LED styles - reserved for future migration */
`;

export default { variants, styles };
