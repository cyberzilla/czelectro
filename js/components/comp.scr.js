// ═══════════════════════════════════════════════════
// CZElectro — SCR / Thyristor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'scr',
    name: 'SCR / Thyristor',
    nameEn: 'SCR / Thyristor',
    spec: 'TYN612, 12A 600V',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isSCR: true,
    isDiode: true,
    width: 50, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 55">
    <!-- Anode lead (top) -->
    <line x1="25" y1="0" x2="25" y2="14" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <!-- Cathode lead (bottom) -->
    <line x1="25" y1="41" x2="25" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Gate lead (left) -->
    <line x1="0" y1="35" x2="14" y2="35" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    <line x1="14" y1="35" x2="20" y2="32" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <!-- Diode triangle (pointing down) -->
    <polygon points="13,14 37,14 25,34" fill="#1e293b" stroke="#64748b" stroke-width="1.8" stroke-linejoin="round"/>
    <!-- Cathode bar -->
    <line x1="13" y1="34" x2="37" y2="34" stroke="#64748b" stroke-width="2.5"/>
    <!-- Gate connection point -->
    <circle cx="20" cy="32" r="1.5" fill="#f59e0b"/>
    <!-- Label -->
    <text x="35" y="30" fill="#94a3b8" font-size="6" font-family="monospace">SCR</text>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'A' },
    { x: 25, y: 55, label: 'K' },
    { x: 0, y: 35, label: 'G' }
    ]
    }
];

const styles = `
    /* SCR styles - reserved for future migration */
`;

export default { variants, styles };
