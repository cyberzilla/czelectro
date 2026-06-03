// ═══════════════════════════════════════════════════
// CZElectro — Large Battery (LiFePO4) Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'battery_32140',
    name: 'LiFePO4 32140',
    spec: '3.2V 15Ah (15000mAh)',
    category: 'source',
    voltage: 3.2,
    resistance: 0.02,
    internalResistance: 0.02,
    maxCurrent: 30.0,  // 30A max discharge (2C)
    capacityWh: 48,
    ratedPower: 24,  // 0.5C × 15A × 3.2V = 24W continuous
    width: 30, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 30 55">
    <line x1="10" y1="0" x2="10" y2="5" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="20" y1="0" x2="20" y2="5" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="3" y="5" width="24" height="47" rx="6" fill="#22543d" stroke="#166534" stroke-width="1.5"/>
    <rect x="3" y="5" width="24" height="47" rx="6" fill="url(#motorBody)" opacity="0.3"/>
    <rect x="7" y="8" width="16" height="10" rx="2" fill="rgba(0,0,0,0.3)"/>
    <text x="8" y="15" fill="#4ade80" font-size="6" font-weight="900" font-family="monospace">3.2V</text>
    <text x="5" y="28" fill="#86efac" font-size="5" font-weight="700" font-family="sans-serif">15Ah</text>
    <rect x="8" y="32" width="14" height="3" rx="1" fill="#111827"/>
    <rect class="batt-fill" x="9" y="33" width="12" height="1.5" rx="0.5" fill="#4ade80" opacity="0.8"/>
    <text x="4" y="43" fill="#a7f3d0" font-size="3.5" font-weight="700" font-family="sans-serif">32140</text>
    <text x="3" y="50" fill="#6ee7b7" font-size="3" font-weight="600" font-family="sans-serif">LiFePO4</text>
    </svg>`,
    terminals: [
    { x: 10, y: 0, label: '+' },
    { x: 20, y: 0, label: '−' }
    ]
    },
    {
    id: 'battery_lifepo4',
    name: 'Sel LiFePO4 100Ah',
    spec: '3.2V 100Ah Prismatic',
    category: 'source',
    voltage: 3.2,
    resistance: 0.01,
    internalResistance: 0.01,
    maxCurrent: 100.0,  // 100A max (1C)
    capacityWh: 320,
    ratedPower: 150,  // ~150W per cell (16 cells = 2400W)
    width: 40, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 40 55">
    <line x1="12" y1="0" x2="12" y2="6" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="28" y1="0" x2="28" y2="6" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="3" y="6" width="34" height="46" rx="4" fill="#1e3a5f" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="6" y="10" width="28" height="20" rx="2" fill="#0f172a" stroke="#1e293b"/>
    <text x="9" y="23" fill="#3b82f6" font-size="8" font-weight="900" font-family="monospace">3.2V</text>
    <rect x="8" y="34" width="24" height="5" rx="1.5" fill="#111827" stroke="#1e293b"/>
    <rect class="batt-fill" x="9" y="35" width="22" height="3" rx="1" fill="#22c55e" opacity="0.8"/>
    <circle cx="12" cy="45" r="2" fill="#22c55e" opacity="0.6"/>
    <circle cx="20" cy="45" r="2" fill="#3b82f6" opacity="0.4"/>
    <circle cx="28" cy="45" r="2" fill="#6b7280" opacity="0.3"/>
    <text x="7" y="53" fill="#60a5fa" font-size="4" font-weight="700" font-family="sans-serif">LiFePO4</text>
    </svg>`,
    terminals: [
    { x: 12, y: 0, label: '+' },
    { x: 28, y: 0, label: '−' }
    ]
    }
];

const styles = `
    /* Large Battery (LiFePO4) styles - reserved for future migration */
`;

export default { variants, styles };
