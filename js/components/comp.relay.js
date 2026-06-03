// ═══════════════════════════════════════════════════
// CZElectro — Relay Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'relay',
    name: 'Relay',
    spec: '5V Coil, SPST',
    category: 'passive',
    voltage: 0,
    resistance: 70,
    width: 80, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 60">
    <rect x="8" y="5" width="64" height="50" rx="6" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
    <rect x="14" y="12" width="22" height="36" rx="3" fill="#111827" stroke="#4b5563"/>
    <path d="M 18 20 Q 25 15, 32 20 Q 25 25, 18 30 Q 25 25, 32 30" stroke="#d4af37" stroke-width="1.2" fill="none"/>
    <rect x="44" y="18" width="22" height="24" rx="2" fill="#111827" stroke="#4b5563"/>
    <line x1="55" y1="22" x2="55" y2="38" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="55" cy="28" r="3" fill="#ef4444"/>
    <text x="40" y="55" fill="#9ca3af" font-size="7" font-family="sans-serif">RELAY</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: '1' },
    { x: 80, y: 30, label: '2' }
    ]
    }
];

const styles = `
    /* Relay styles - reserved for future migration */
`;

export default { variants, styles };
