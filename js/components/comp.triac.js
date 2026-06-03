// ═══════════════════════════════════════════════════
// CZElectro — Triac Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'triac',
    name: 'Triac',
    nameEn: 'Triac',
    spec: 'BT136, 4A 600V',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isTriac: true,
    acOnly: true,
    width: 50, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 55">
    <!-- MT1 lead (top) -->
    <line x1="25" y1="0" x2="25" y2="12" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- MT2 lead (bottom) -->
    <line x1="25" y1="43" x2="25" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Gate lead (left) -->
    <line x1="0" y1="35" x2="13" y2="35" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    <line x1="13" y1="35" x2="19" y2="32" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <!-- Upper triangle (pointing down) -->
    <polygon points="13,12 37,12 25,27" fill="#1e293b" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Bar between triangles -->
    <line x1="13" y1="27.5" x2="37" y2="27.5" stroke="#64748b" stroke-width="2"/>
    <!-- Lower triangle (pointing up) -->
    <polygon points="13,43 37,43 25,28" fill="#1e293b" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Gate connection dot -->
    <circle cx="19" cy="32" r="1.5" fill="#f59e0b"/>
    <!-- Label -->
    <text x="34" y="30" fill="#94a3b8" font-size="5" font-family="monospace">TRIAC</text>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'MT1' },
    { x: 25, y: 55, label: 'MT2' },
    { x: 0, y: 35, label: 'G' }
    ]
    }
];

const styles = `
    /* Triac styles - reserved for future migration */
`;

export default { variants, styles };
