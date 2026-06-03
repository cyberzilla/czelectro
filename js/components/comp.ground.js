// ═══════════════════════════════════════════════════
// CZElectro — Ground/Neutral Component Module
// ═══════════════════════════════════════════════════

const variants = [
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
    }
];

const styles = `
    /* Ground/Neutral styles - reserved for future migration */
`;

export default { variants, styles };
