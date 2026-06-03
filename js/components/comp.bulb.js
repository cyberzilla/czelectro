// ═══════════════════════════════════════════════════
// CZElectro — Bulb Component Module
// ═══════════════════════════════════════════════════

const variants = [
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
    }
];

const styles = `
    /* Bulb styles - reserved for future migration */
`;

export default { variants, styles };
