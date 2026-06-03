// ═══════════════════════════════════════════════════
// CZElectro — PLN Grid Source Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'pln_source',
    name: 'PLN 220V',
    nameEn: 'Grid 220V AC',
    spec: '220V AC, 50Hz',
    category: 'source',
    voltage: 48,            // MNA internal voltage (matches battery pack level)
    resistance: 0.01,
    internalResistance: 0.01,
    ratedPower: 99000,
    maxCurrent: 100,
    isPLN: true,
    isACSource: true,
    outputVoltageEf: 220,   // effective AC output (for display/domain tagging)
    width: 80, height: 110,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 110">
    <!-- Box body -->
    <rect x="4" y="10" width="72" height="90" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="4" y="10" width="72" height="90" rx="6" fill="url(#motorBody)" opacity="0.15"/>
    <!-- Terminal leads -->
    <line x1="25" y1="0" x2="25" y2="14" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="55" y1="0" x2="55" y2="14" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <!-- L / N labels at top -->
    <text x="25" y="24" fill="#ef4444" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">L</text>
    <text x="55" y="24" fill="#3b82f6" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">N</text>
    <!-- PLN title panel -->
    <rect x="10" y="30" width="60" height="18" rx="3" fill="#0a0a1a" stroke="#1e3a5f" stroke-width="0.8"/>
    <text x="40" y="43" fill="#f59e0b" font-size="10" font-weight="900" text-anchor="middle" font-family="monospace">PLN</text>
    <!-- Voltage display -->
    <rect x="10" y="52" width="60" height="16" rx="2" fill="#0a0a1a" stroke="#1e293b" stroke-width="0.8"/>
    <text class="pln-voltage" x="40" y="64" fill="#22c55e" font-size="11" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code',monospace">220V</text>
    <!-- AC waveform symbol -->
    <path d="M 18 80 Q 24 72, 30 80 Q 36 88, 42 80" fill="none" stroke="#64748b" stroke-width="1.2" stroke-linecap="round"/>
    <text x="50" y="84" fill="#64748b" font-size="7" font-weight="700" font-family="monospace">50Hz</text>
    <!-- Status LED -->
    <circle class="pln-led" cx="62" cy="93" r="3" fill="#475569" style="transition: fill 0.3s;"/>
    <text x="18" y="96" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">STATUS</text>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'L' },
    { x: 55, y: 0, label: 'N' }
    ]
    }
];

const styles = `
    /* PLN Grid Source styles - reserved for future migration */
`;

export default { variants, styles };
