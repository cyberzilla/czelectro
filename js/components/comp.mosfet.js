// ═══════════════════════════════════════════════════
// CZElectro — MOSFET Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'mosfet_n',
    name: 'MOSFET N-Ch',
    nameEn: 'N-Channel MOSFET',
    spec: 'IRF540N, 33A',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isMOSFET: true,
    mosfetType: 'n',
    width: 50, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 60">
    <line x1="0" y1="30" x2="14" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="0" x2="50" y2="14" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="46" x2="50" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="14" y1="18" x2="14" y2="42" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="19" y1="18" x2="19" y2="25" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="28" x2="19" y2="32" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="35" x2="19" y2="42" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="14" x2="50" y2="14" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="46" x2="50" y2="46" stroke="#94a3b8" stroke-width="2"/>
    <line x1="50" y1="14" x2="50" y2="14" stroke="#94a3b8" stroke-width="2"/>
    <line x1="50" y1="46" x2="50" y2="46" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="21" x2="36" y2="21" stroke="#94a3b8" stroke-width="2"/>
    <line x1="36" y1="14" x2="36" y2="46" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="39" x2="36" y2="39" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="30" x2="36" y2="30" stroke="#94a3b8" stroke-width="2"/>
    <polygon points="24,30 19,27 19,33" fill="#94a3b8"/>
    <polygon points="36,25 33,18 39,18" fill="#94a3b8"/>
    <text x="25" y="56" fill="#64748b" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">N-MOS</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'G' },
    { x: 50, y: 0, label: 'D' },
    { x: 50, y: 60, label: 'S' }
    ]
    },
    {
    id: 'mosfet_p',
    name: 'MOSFET P-Ch',
    nameEn: 'P-Channel MOSFET',
    spec: 'IRF9540, 23A',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isMOSFET: true,
    mosfetType: 'p',
    width: 50, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 60">
    <line x1="0" y1="30" x2="14" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="0" x2="50" y2="14" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="46" x2="50" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="14" y1="18" x2="14" y2="42" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="19" y1="18" x2="19" y2="25" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="28" x2="19" y2="32" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="35" x2="19" y2="42" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="14" x2="50" y2="14" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="46" x2="50" y2="46" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="21" x2="36" y2="21" stroke="#94a3b8" stroke-width="2"/>
    <line x1="36" y1="14" x2="36" y2="46" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="39" x2="36" y2="39" stroke="#94a3b8" stroke-width="2"/>
    <line x1="19" y1="30" x2="36" y2="30" stroke="#94a3b8" stroke-width="2"/>
    <polygon points="30,30 35,27 35,33" fill="#94a3b8"/>
    <polygon points="36,35 33,42 39,42" fill="#94a3b8"/>
    <text x="25" y="56" fill="#64748b" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">P-MOS</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'G' },
    { x: 50, y: 0, label: 'D' },
    { x: 50, y: 60, label: 'S' }
    ]
    }
];

const styles = `
    /* MOSFET styles - reserved for future migration */
`;

export default { variants, styles };
