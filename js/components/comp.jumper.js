// ═══════════════════════════════════════════════════
// CZElectro — Jumper Wire Component Module
// ═══════════════════════════════════════════════════

const variants = [
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

const styles = `
    /* Jumper Wire styles - reserved for future migration */
`;

export default { variants, styles };
