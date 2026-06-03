// ═══════════════════════════════════════════════════
// CZElectro — PLTS Battery Bank Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'battery_plts_100',
    name: 'Baterai 48V 100Ah',
    spec: '48V 100Ah LiFePO4, 4.8kWh',
    category: 'source',
    voltage: 48,
    resistance: 0.1,
    internalResistance: 0.1,
    maxCurrent: 50.0,  // 50A max discharge
    capacityWh: 4800,
    ratedPower: 2400,  // continuous discharge ~2400W
    width: 90, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 90 70">
    <line x1="25" y1="0" x2="25" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="65" y1="0" x2="65" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="8" width="80" height="58" rx="5" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="10" y="12" width="70" height="30" rx="3" fill="#0f172a" stroke="#1e293b"/>
    <text x="16" y="30" fill="#22c55e" font-size="10" font-weight="900" font-family="monospace">48V</text>
    <text x="50" y="30" fill="#4ade80" font-size="8" font-weight="700" font-family="monospace">100Ah</text>
    <rect x="12" y="46" width="66" height="6" rx="2" fill="#111827" stroke="#1e293b"/>
    <rect class="batt-fill" x="13" y="47" width="64" height="4" rx="1.5" fill="#22c55e" opacity="0.8"/>
    <text class="batt-pct" x="68" y="51" fill="#4ade80" font-size="5" font-weight="800" font-family="sans-serif">100%</text>
    <circle cx="18" cy="60" r="3" fill="#22c55e" opacity="0.7"/>
    <circle cx="28" cy="60" r="3" fill="#22c55e" opacity="0.5"/>
    <circle cx="38" cy="60" r="3" fill="#3b82f6" opacity="0.5"/>
    <circle cx="48" cy="60" r="3" fill="#6b7280" opacity="0.3"/>
    <text x="55" y="63" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">LiFePO4</text>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: '+' },
    { x: 65, y: 0, label: '−' }
    ]
    },
    {
    id: 'battery_plts_200',
    name: 'Baterai 48V 200Ah',
    spec: '48V 200Ah LiFePO4, 9.6kWh',
    category: 'source',
    voltage: 48,
    resistance: 0.05,
    internalResistance: 0.05,
    maxCurrent: 100.0,  // 100A max discharge
    capacityWh: 9600,
    ratedPower: 4800,  // continuous discharge ~4800W
    width: 100, height: 80,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 80">
    <line x1="28" y1="0" x2="28" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="72" y1="0" x2="72" y2="8" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="3" y="8" width="94" height="68" rx="6" fill="#0f172a" stroke="#1e40af" stroke-width="2"/>
    <rect x="8" y="12" width="84" height="34" rx="3" fill="#111827" stroke="#1e293b"/>
    <text x="14" y="32" fill="#3b82f6" font-size="11" font-weight="900" font-family="monospace">48V</text>
    <text x="50" y="32" fill="#60a5fa" font-size="9" font-weight="700" font-family="monospace">200Ah</text>
    <rect x="10" y="50" width="80" height="8" rx="3" fill="#111827" stroke="#1e293b"/>
    <rect class="batt-fill" x="11" y="51" width="78" height="6" rx="2" fill="#22c55e" opacity="0.8"/>
    <text class="batt-pct" x="82" y="57" fill="#22c55e" font-size="5" font-weight="800" font-family="sans-serif">100%</text>
    <circle cx="16" cy="68" r="3.5" fill="#22c55e" opacity="0.7"/>
    <circle cx="26" cy="68" r="3.5" fill="#22c55e" opacity="0.6"/>
    <circle cx="36" cy="68" r="3.5" fill="#3b82f6" opacity="0.5"/>
    <circle cx="46" cy="68" r="3.5" fill="#3b82f6" opacity="0.4"/>
    <circle cx="56" cy="68" r="3.5" fill="#6b7280" opacity="0.3"/>
    <text x="64" y="72" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">LiFePO4</text>
    </svg>`,
    terminals: [
    { x: 28, y: 0, label: '+' },
    { x: 72, y: 0, label: '−' }
    ]
    }
];

const styles = `
    /* PLTS Battery Bank styles - reserved for future migration */
`;

export default { variants, styles };
