// ═══════════════════════════════════════════════════
// CZElectro — Transformer Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'trafo_1a',
    name: 'Trafo CT',
    nameEn: 'Transformer',
    spec: '220V→12V, 1A',
    category: 'passive',
    voltage: 0,
    resistance: 5,
    isTransformer: true,
    turnsRatio: 18.3,
    acOnly: true,
    width: 70, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 60">
    <!-- Primary leads -->
    <line x1="0" y1="5" x2="14" y2="5" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="55" x2="14" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Secondary leads -->
    <line x1="56" y1="5" x2="70" y2="5" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="56" y1="55" x2="70" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Primary coil (left arcs) -->
    <path d="M 14 5 Q 26 5, 26 12.5 Q 26 20, 14 20" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
    <path d="M 14 20 Q 26 20, 26 27.5 Q 26 35, 14 35" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
    <path d="M 14 35 Q 26 35, 26 42.5 Q 26 50, 14 50" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
    <line x1="14" y1="50" x2="14" y2="55" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
    <!-- Core lines -->
    <line x1="30" y1="2" x2="30" y2="58" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="35" y1="2" x2="35" y2="58" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Secondary coil (right arcs) -->
    <path d="M 56 5 Q 44 5, 44 12.5 Q 44 20, 56 20" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <path d="M 56 20 Q 44 20, 44 27.5 Q 44 35, 56 35" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <path d="M 56 35 Q 44 35, 44 42.5 Q 44 50, 56 50" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <line x1="56" y1="50" x2="56" y2="55" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <!-- Labels -->
    <text x="10" y="3" fill="#f87171" font-size="5" font-family="monospace" text-anchor="middle">P</text>
    <text x="60" y="3" fill="#93c5fd" font-size="5" font-family="monospace" text-anchor="middle">S</text>
    </svg>`,
    terminals: [
    { x: 0, y: 5, label: 'P1' },
    { x: 0, y: 55, label: 'P2' },
    { x: 70, y: 5, label: 'S1' },
    { x: 70, y: 55, label: 'S2' }
    ]
    }
];

const styles = `
    /* Transformer styles - reserved for future migration */
`;

export default { variants, styles };
