// ═══════════════════════════════════════════════════
// CZElectro — Zener Diode Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'zener_5v1',
    name: 'Zener Diode',
    nameEn: 'Zener Diode',
    spec: '5.1V, 1W 1N4733',
    category: 'passive',
    voltage: 0,
    resistance: 10,
    isDiode: true,
    isZener: true,
    zenerVoltage: 5.1,
    forwardVoltage: 0.7,
    maxReverseVoltage: 5.1,
    width: 50, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 30">
    <line x1="0" y1="15" x2="15" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="35" y1="15" x2="50" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <polygon points="15,5 33,15 15,25" fill="#374151" stroke="#6b7280" stroke-width="1.5"/>
    <line x1="33" y1="5" x2="33" y2="25" stroke="#6b7280" stroke-width="2.5"/>
    <line x1="30" y1="5" x2="33" y2="5" stroke="#6b7280" stroke-width="2.5"/>
    <line x1="33" y1="25" x2="36" y2="25" stroke="#6b7280" stroke-width="2.5"/>
    <text x="24" y="19" fill="#94a3b8" font-size="6" font-weight="bold" text-anchor="middle" font-family="monospace">Z</text>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: 'A' },
    { x: 50, y: 15, label: 'K' }
    ]
    }
];

const styles = `
    /* Zener Diode styles - reserved for future migration */
`;

export default { variants, styles };
