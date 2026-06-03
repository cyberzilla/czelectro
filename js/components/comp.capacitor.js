// ═══════════════════════════════════════════════════
// CZElectro — Capacitor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'capacitor',
    name: 'Kapasitor',
    spec: '100μF 25V',
    category: 'passive',
    voltage: 0,
    resistance: 5,
    width: 60, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 60 50">
    <line x1="0" y1="25" x2="22" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="38" y1="25" x2="60" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="22" y="8" width="4" height="34" rx="1" fill="#60a5fa" stroke="#3b82f6"/>
    <rect x="34" y="8" width="4" height="34" rx="1" fill="#60a5fa" stroke="#3b82f6"/>
    </svg>`,
    terminals: [
    { x: 0, y: 25, label: '+' },
    { x: 60, y: 25, label: '−' }
    ]
    }
];

const styles = `
    /* Capacitor styles - reserved for future migration */
`;

export default { variants, styles };
