// ═══════════════════════════════════════════════════
// CZElectro — Diode Component Module
// ═══════════════════════════════════════════════════

const variants = [
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
    }
];

const styles = `
    /* Diode styles - reserved for future migration */
`;

export default { variants, styles };
