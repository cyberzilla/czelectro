// ═══════════════════════════════════════════════════
// CZElectro — Varistor / MOV Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'varistor_275v',
    name: 'Varistor MOV',
    nameEn: 'Varistor MOV',
    spec: '275V, 10mm',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isVaristor: true,
    clampVoltage: 275,
    width: 35, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 35 40">
    <!-- Top lead -->
    <line x1="17" y1="0" x2="17" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Bottom lead -->
    <line x1="17" y1="30" x2="17" y2="40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Disc body -->
    <ellipse cx="17" cy="20" rx="14" ry="10" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
    <!-- Varistor symbol: zigzag line through disc -->
    <polyline points="10,15 13,13 17,17 21,13 24,15" fill="none" stroke="#60a5fa" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- MOV label -->
    <text x="17" y="24" fill="#94a3b8" font-size="5" font-family="monospace" text-anchor="middle">MOV</text>
    </svg>`,
    terminals: [
    { x: 17, y: 0, label: '1' },
    { x: 17, y: 40, label: '2' }
    ]
    }
];

const styles = `
    /* Varistor styles - reserved for future migration */
`;

export default { variants, styles };
