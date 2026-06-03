// ═══════════════════════════════════════════════════
// CZElectro — DPDT Switch Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'dpdt_switch',
    name: 'Saklar DPDT',
    nameEn: 'DPDT Switch',
    spec: 'Double Pole, 6-Pin',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    isDPDT: true,
    width: 60, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 60 50">
    <line x1="0" y1="10" x2="12" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="25" x2="12" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="40" x2="12" y2="40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="48" y1="10" x2="60" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="48" y1="25" x2="60" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="48" y1="40" x2="60" y2="40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="2" width="36" height="46" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <circle cx="16" cy="10" r="2.5" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="16" cy="25" r="2.5" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="16" cy="40" r="2.5" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="44" cy="10" r="2.5" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="44" cy="25" r="2.5" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="44" cy="40" r="2.5" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <line x1="16" y1="15" x2="44" y2="10" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <line x1="16" y1="35" x2="44" y2="30" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <line x1="28" y1="15" x2="28" y2="35" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
    <text x="30" y="8" fill="#64748b" font-size="4.5" font-weight="700" text-anchor="middle" font-family="monospace">DPDT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 10, label: '1A' },
    { x: 0, y: 25, label: '1C' },
    { x: 0, y: 40, label: '1B' },
    { x: 60, y: 10, label: '2A' },
    { x: 60, y: 25, label: '2C' },
    { x: 60, y: 40, label: '2B' }
    ]
    }
];

const styles = `
    /* DPDT Switch styles - reserved for future migration */
`;

export default { variants, styles };
