// ═══════════════════════════════════════════════════
// CZElectro — Photodiode Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'photodiode',
    name: 'Fotodioda',
    nameEn: 'Photodiode',
    spec: 'IR, 940nm',
    category: 'passive',
    voltage: 0,
    resistance: 100000,
    isDiode: true,
    isPhotodiode: true,
    width: 45, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 45 30">
    <!-- Anode lead (left) -->
    <line x1="0" y1="15" x2="12" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Cathode lead (right) -->
    <line x1="33" y1="15" x2="45" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Diode triangle (pointing right) -->
    <polygon points="12,5 12,25 29,15" fill="#1e293b" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Cathode bar -->
    <line x1="29" y1="5" x2="29" y2="25" stroke="#64748b" stroke-width="2.5"/>
    <!-- Light arrows pointing TOWARD diode (incoming light) -->
    <!-- Arrow 1 -->
    <line x1="10" y1="1" x2="18" y2="7" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
    <polygon points="18,7 14,4 16,8" fill="#f59e0b"/>
    <!-- Arrow 2 -->
    <line x1="16" y1="1" x2="24" y2="7" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
    <polygon points="24,7 20,4 22,8" fill="#f59e0b"/>
    <!-- Label -->
    <text x="22" y="28" fill="#94a3b8" font-size="5" font-family="monospace" text-anchor="middle">PD</text>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: 'A' },
    { x: 45, y: 15, label: 'K' }
    ]
    }
];

const styles = `
    /* Photodiode styles - reserved for future migration */
`;

export default { variants, styles };
