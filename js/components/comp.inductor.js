// ═══════════════════════════════════════════════════
// CZElectro — Inductor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'inductor_100u',
    name: 'Induktor 100μH',
    nameEn: 'Inductor 100μH',
    spec: '100μH, 2A',
    category: 'passive',
    voltage: 0,
    resistance: 0.5,
    isInductor: true,
    inductance: 0.0001,
    width: 60, height: 25,
    svg: `<svg width="100%" height="100%" viewBox="0 0 60 25">
    <line x1="0" y1="12" x2="10" y2="12" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="12" x2="60" y2="12" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M 10 12 A 5 5 0 0 1 20 12" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 20 12 A 5 5 0 0 1 30 12" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 30 12 A 5 5 0 0 1 40 12" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 40 12 A 5 5 0 0 1 50 12" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round"/>
    <text x="30" y="23" fill="#64748b" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">100μH</text>
    </svg>`,
    terminals: [
    { x: 0, y: 12, label: '1' },
    { x: 60, y: 12, label: '2' }
    ]
    }
];

const styles = `
    /* Inductor styles - reserved for future migration */
`;

export default { variants, styles };
