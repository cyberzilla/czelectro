// ═══════════════════════════════════════════════════
// CZElectro — Buzzer Component Module
// ═══════════════════════════════════════════════════

const variants = [
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
    }
];

const styles = `
    /* Buzzer styles - reserved for future migration */
`;

export default { variants, styles };
