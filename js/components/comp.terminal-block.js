// ═══════════════════════════════════════════════════
// CZElectro — Terminal Block Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'terminal_block_2',
    name: 'Terminal Block',
    nameEn: 'Terminal Block',
    spec: '2-Pin, 15A',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    width: 40, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 40 30">
    <!-- Lead wires -->
    <line x1="12" y1="24" x2="12" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="28" y1="24" x2="28" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Body -->
    <rect x="2" y="4" width="36" height="20" rx="2" fill="#334155" stroke="#475569" stroke-width="1.5"/>
    <!-- Center divider -->
    <line x1="20" y1="4" x2="20" y2="24" stroke="#475569" stroke-width="1"/>
    <!-- Wire entry holes -->
    <rect x="7" y="14" width="10" height="6" rx="1" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>
    <rect x="23" y="14" width="10" height="6" rx="1" fill="#1e293b" stroke="#475569" stroke-width="0.8"/>
    <!-- Screw tops -->
    <circle cx="12" cy="9" r="4" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <line x1="9" y1="9" x2="15" y2="9" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="12" y1="6" x2="12" y2="12" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="28" cy="9" r="4" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <line x1="25" y1="9" x2="31" y2="9" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="28" y1="6" x2="28" y2="12" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 12, y: 30, label: '1' },
    { x: 28, y: 30, label: '2' }
    ]
    }
];

const styles = `
    /* Terminal Block styles - reserved for future migration */
`;

export default { variants, styles };
