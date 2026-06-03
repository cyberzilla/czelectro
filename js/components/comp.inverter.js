// ═══════════════════════════════════════════════════
// CZElectro — Inverter Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'inverter',
    name: 'Inverter 1.5kW',
    spec: '48V DC → 220V AC, 1500W',
    category: 'passive',
    voltage: 0,
    resistance: 3,
    ratedPower: 1500,
    inputVoltageMin: 42.0,
    outputVoltageEf: 220,
    isInverter: true,
    width: 100, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 60">
    <line x1="0" y1="30" x2="12" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="88" y1="30" x2="100" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="5" width="76" height="50" rx="5" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
    <rect x="16" y="9" width="68" height="24" rx="3" fill="#111827" stroke="#1f2937"/>
    <text x="20" y="24" fill="#60a5fa" font-size="8" font-weight="800" font-family="monospace">DC→AC</text>
    <text x="68" y="24" fill="#fbbf24" font-size="6" font-weight="700" font-family="monospace">1.5k</text>
    <path d="M 20 40 L 24 40 L 26 36 L 30 44 L 34 36 L 36 40 L 40 40" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
    <text x="18" y="54" fill="#ef4444" font-size="6" font-weight="700" font-family="sans-serif">DC IN</text>
    <path d="M 54 40 Q 58 34, 62 40 Q 66 46, 70 40 Q 74 34, 78 40" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
    <text x="55" y="54" fill="#22c55e" font-size="6" font-weight="700" font-family="sans-serif">AC OUT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'DC' },
    { x: 100, y: 30, label: 'AC' }
    ]
    },
    {
    id: 'inverter_3k',
    name: 'Inverter 3kW',
    spec: '48V DC → 220V AC, 3000W',
    category: 'passive',
    voltage: 0,
    resistance: 2,
    ratedPower: 3000,
    inputVoltageMin: 42.0,
    outputVoltageEf: 220,
    isInverter: true,
    width: 110, height: 65,
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 65">
    <line x1="0" y1="32" x2="12" y2="32" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="98" y1="32" x2="110" y2="32" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="4" width="86" height="56" rx="5" fill="#1f2937" stroke="#374151" stroke-width="2"/>
    <rect x="16" y="8" width="78" height="26" rx="3" fill="#111827" stroke="#1f2937"/>
    <text x="20" y="24" fill="#60a5fa" font-size="9" font-weight="800" font-family="monospace">DC→AC</text>
    <text x="70" y="24" fill="#f59e0b" font-size="7" font-weight="700" font-family="monospace">3kW</text>
    <path d="M 22 44 L 26 44 L 28 39 L 32 49 L 36 39 L 38 44 L 42 44" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
    <text x="20" y="58" fill="#ef4444" font-size="6" font-weight="700" font-family="sans-serif">DC IN</text>
    <path d="M 60 44 Q 64 37, 68 44 Q 72 51, 76 44 Q 80 37, 84 44" fill="none" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round"/>
    <text x="61" y="58" fill="#22c55e" font-size="6" font-weight="700" font-family="sans-serif">AC OUT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 32, label: 'DC' },
    { x: 110, y: 32, label: 'AC' }
    ]
    },
    {
    id: 'inverter_5k',
    name: 'Inverter 5kW',
    spec: '48V DC → 220V AC, 5000W',
    category: 'passive',
    voltage: 0,
    resistance: 1.5,
    ratedPower: 5000,
    inputVoltageMin: 42.0,
    outputVoltageEf: 220,
    isInverter: true,
    width: 120, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 120 70">
    <line x1="0" y1="35" x2="12" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="108" y1="35" x2="120" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="4" width="96" height="62" rx="6" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/>
    <rect x="16" y="8" width="88" height="28" rx="4" fill="#111827" stroke="#1f2937"/>
    <text x="22" y="26" fill="#60a5fa" font-size="10" font-weight="800" font-family="monospace">DC→AC</text>
    <text x="76" y="26" fill="#f59e0b" font-size="9" font-weight="900" font-family="monospace">5kW</text>
    <path d="M 24 48 L 28 48 L 30 42 L 34 54 L 38 42 L 40 48 L 44 48" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    <text x="22" y="64" fill="#ef4444" font-size="7" font-weight="700" font-family="sans-serif">DC IN</text>
    <path d="M 66 48 Q 70 40, 74 48 Q 78 56, 82 48 Q 86 40, 90 48" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
    <text x="67" y="64" fill="#22c55e" font-size="7" font-weight="700" font-family="sans-serif">AC OUT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 35, label: 'DC' },
    { x: 120, y: 35, label: 'AC' }
    ]
    }
];

const styles = `
    /* Inverter styles - reserved for future migration */
`;

export default { variants, styles };
