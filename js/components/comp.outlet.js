// ═══════════════════════════════════════════════════
// CZElectro — Power Outlet Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'outlet',
    name: 'Stop Kontak',
    spec: '220V AC, 16A',
    category: 'passive',
    voltage: 0,
    resistance: 0.5,
    width: 50, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 50">
    <line x1="5" y1="25" x2="0" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="25" x2="45" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="5" width="40" height="40" rx="5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    <rect x="8" y="8" width="34" height="34" rx="8" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"/>
    <circle cx="25" cy="25" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="19" y="17" width="3" height="7" rx="1" fill="#6b7280"/>
    <rect x="28" y="17" width="3" height="7" rx="1" fill="#6b7280"/>
    <circle cx="25" cy="30" r="2" fill="#6b7280" class="outlet-indicator" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 0, y: 25, label: 'L' },
    { x: 50, y: 25, label: 'N' }
    ]
    },
    {
    id: 'outlet_strip',
    name: 'Terminal Listrik',
    spec: '220V AC, 16A, 4 Lubang',
    category: 'passive',
    voltage: 0,
    resistance: 0.5,
    width: 110, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 40">
    <line x1="0" y1="20" x2="5" y2="20" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="105" y1="20" x2="110" y2="20" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="3" width="100" height="34" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="22" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="19" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="25" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="44" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="41" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="47" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="66" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="63" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="69" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="88" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="85" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="91" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="11" cy="10" r="2.5" fill="#ef4444" class="strip-power" opacity="0.4" style="transition: all 0.4s;"/>
    <rect x="7" y="31" width="8" height="3" rx="1" fill="#94a3b8"/>
    </svg>`,
    terminals: [
    { x: 0, y: 20, label: 'L' },
    { x: 110, y: 20, label: 'N' }
    ]
    }
];

const styles = `
    /* Power Outlet styles - reserved for future migration */
`;

export default { variants, styles };
