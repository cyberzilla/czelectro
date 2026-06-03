// ═══════════════════════════════════════════════════
// CZElectro — Thermistor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'thermistor_ntc',
    name: 'Termistor NTC',
    nameEn: 'NTC Thermistor',
    spec: '10KΩ @ 25°C',
    category: 'passive',
    voltage: 0,
    resistance: 10000,
    isThermistor: true,
    thermistorType: 'ntc',
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
    <!-- Temperature indicator 'T' -->
    <text x="33" y="14" fill="#f87171" font-size="8" font-weight="bold" font-family="monospace" text-anchor="middle">T</text>
    <!-- Diagonal line through body (thermistor symbol) -->
    <line x1="8" y1="32" x2="32" y2="8" stroke="#94a3b8" stroke-width="1" stroke-linecap="round"/>
    <!-- Negative temperature coefficient arrow -->
    <line x1="8" y1="32" x2="12" y2="28" stroke="#94a3b8" stroke-width="1" stroke-linecap="round"/>
    <line x1="8" y1="32" x2="12" y2="32" stroke="#94a3b8" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 20, y: 0, label: '1' },
    { x: 20, y: 40, label: '2' }
    ]
    }
];

const styles = `
    /* Thermistor styles - reserved for future migration */
`;

export default { variants, styles };
