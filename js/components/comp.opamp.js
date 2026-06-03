// ═══════════════════════════════════════════════════
// CZElectro — Operational Amplifier Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'opamp_741',
    name: 'Op-Amp LM741',
    nameEn: 'Op-Amp LM741',
    spec: '±15V, Unity Gain',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isOpAmp: true,
    width: 60, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 60 60">
    <!-- Lead lines -->
    <line x1="0" y1="15" x2="14" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="45" x2="14" y2="45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="46" y1="30" x2="60" y2="30" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <!-- Triangle body -->
    <polygon points="14,4 14,56 50,30" fill="#1e293b" stroke="#64748b" stroke-width="1.8" stroke-linejoin="round"/>
    <!-- Input labels -->
    <text x="19" y="20" fill="#22c55e" font-size="10" font-weight="bold" font-family="monospace">+</text>
    <text x="19" y="50" fill="#ef4444" font-size="10" font-weight="bold" font-family="monospace">−</text>
    <!-- Output dot -->
    <circle cx="46" cy="30" r="2" fill="#64748b"/>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: 'V+' },
    { x: 0, y: 45, label: 'V-' },
    { x: 60, y: 30, label: 'OUT' }
    ]
    }
];

const styles = `
    /* Op-Amp styles - reserved for future migration */
`;

export default { variants, styles };
