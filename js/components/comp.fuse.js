// ═══════════════════════════════════════════════════
// CZElectro — Fuse Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'fuse',
    name: 'Sekring',
    spec: '250mA Glass',
    category: 'passive',
    voltage: 0,
    resistance: 1,
    maxCurrent: 0.25,
    width: 90, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 90 30">
    <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="15" x2="90" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="20" y="5" width="50" height="20" rx="10" fill="rgba(200,220,255,0.2)" stroke="rgba(200,220,255,0.4)" stroke-width="1.5"/>
    <rect x="20" y="8" width="8" height="14" rx="2" fill="#9ca3af"/>
    <rect x="62" y="8" width="8" height="14" rx="2" fill="#9ca3af"/>
    <line class="fuse-wire" x1="28" y1="15" x2="62" y2="15" stroke="#d4af37" stroke-width="1.5"/>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: '1' },
    { x: 90, y: 15, label: '2' }
    ]
    }
];

const styles = `
    /* Fuse styles - reserved for future migration */
`;

export default { variants, styles };
