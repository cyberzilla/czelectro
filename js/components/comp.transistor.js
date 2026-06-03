// ═══════════════════════════════════════════════════
// CZElectro — Transistor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'transistor_npn',
    name: 'Transistor NPN',
    nameEn: 'NPN Transistor',
    spec: 'NPN 2N2222, 800mA',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isTransistor: true,
    transistorType: 'npn',
    width: 50, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 60">
    <line x1="0" y1="30" x2="16" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="0" x2="50" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="50" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="28" cy="30" r="16" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
    <line x1="18" y1="20" x2="18" y2="40" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="18" y1="24" x2="50" y2="10" stroke="#94a3b8" stroke-width="2"/>
    <line x1="18" y1="36" x2="50" y2="50" stroke="#94a3b8" stroke-width="2"/>
    <polygon points="44,48 50,50 46,43" fill="#94a3b8"/>
    <text x="28" y="55" fill="#64748b" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">NPN</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'B' },
    { x: 50, y: 0, label: 'C' },
    { x: 50, y: 60, label: 'E' }
    ]
    },
    {
    id: 'transistor_pnp',
    name: 'Transistor PNP',
    nameEn: 'PNP Transistor',
    spec: 'PNP 2N2907, 600mA',
    category: 'passive',
    voltage: 0,
    resistance: 1000000,
    isTransistor: true,
    transistorType: 'pnp',
    width: 50, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 60">
    <line x1="0" y1="30" x2="16" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="0" x2="50" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="50" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="28" cy="30" r="16" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
    <line x1="18" y1="20" x2="18" y2="40" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="18" y1="24" x2="50" y2="10" stroke="#94a3b8" stroke-width="2"/>
    <line x1="18" y1="36" x2="50" y2="50" stroke="#94a3b8" stroke-width="2"/>
    <polygon points="24,38 18,36 22,44" fill="#94a3b8"/>
    <text x="28" y="55" fill="#64748b" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">PNP</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'B' },
    { x: 50, y: 0, label: 'C' },
    { x: 50, y: 60, label: 'E' }
    ]
    }
];

const styles = `
    /* Transistor styles - reserved for future migration */
`;

export default { variants, styles };
