// ═══════════════════════════════════════════════════
// CZElectro — LDR (Light Dependent Resistor) Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'ldr',
    name: 'Sensor LDR',
    nameEn: 'LDR Sensor',
    spec: '1KΩ-10MΩ',
    category: 'passive',
    voltage: 0,
    resistance: 10000,
    isLDR: true,
    width: 40, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 40 40">
    <!-- Top lead -->
    <line x1="20" y1="0" x2="20" y2="7" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Bottom lead -->
    <line x1="20" y1="33" x2="20" y2="40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Sensor body circle -->
    <circle cx="20" cy="20" r="13" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <!-- Resistor zigzag inside -->
    <path d="M 20 7 L 20 12 L 15 14 L 25 17 L 15 20 L 25 23 L 15 26 L 20 28 L 20 33" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Light arrows (incoming rays) -->
    <line x1="2" y1="8" x2="9" y2="14" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
    <polygon points="9,14 5,12 7,16" fill="#fbbf24"/>
    <line x1="2" y1="16" x2="9" y2="20" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
    <polygon points="9,20 5,18 6,22" fill="#fbbf24"/>
    </svg>`,
    terminals: [
    { x: 20, y: 0, label: '1' },
    { x: 20, y: 40, label: '2' }
    ]
    }
];

const styles = `
    /* LDR styles - reserved for future migration */
`;

export default { variants, styles };
