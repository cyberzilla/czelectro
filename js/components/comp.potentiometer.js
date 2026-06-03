// ═══════════════════════════════════════════════════
// CZElectro — Potentiometer Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'potentiometer',
    name: 'Potensiometer',
    spec: '10KΩ Variable',
    category: 'passive',
    voltage: 0,
    resistance: 5000,
    width: 100, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 50">
    <line x1="0" y1="35" x2="25" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="75" y1="35" x2="100" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M 25 28 Q 28 23, 33 23 L 67 23 Q 72 23, 75 28 L 75 42 Q 72 47, 67 47 L 33 47 Q 28 47, 25 42 Z" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5"/>
    <polygon points="50,5 44,20 56,20" fill="#d4af37" stroke="#92400e" stroke-width="1"/>
    <line x1="50" y1="20" x2="50" y2="23" stroke="#d4af37" stroke-width="2"/>
    </svg>`,
    terminals: [
    { x: 0, y: 35, label: '1' },
    { x: 100, y: 35, label: '2' }
    ]
    }
];

const styles = `
    /* Potentiometer styles - reserved for future migration */
`;

export default { variants, styles };
