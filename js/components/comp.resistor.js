// ═══════════════════════════════════════════════════
// CZElectro — Resistor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'resistor_220',
    name: 'Resistor 220Ω',
    spec: '220Ω ¼W',
    category: 'passive',
    voltage: 0,
    resistance: 220,
    width: 100, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 40">
    <line x1="0" y1="20" x2="25" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="75" y1="20" x2="100" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 25 13 Q 28 8, 33 8 L 67 8 Q 72 8, 75 13 L 75 27 Q 72 32, 67 32 L 33 32 Q 28 32, 25 27 Z" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5" filter="url(#innerShadow)"/>
    <rect x="35" y="8" width="4" height="24" fill="#dc2626"/>
    <rect x="45" y="8" width="4" height="24" fill="#dc2626"/>
    <rect x="55" y="8" width="4" height="24" fill="#78350f"/>
    <rect x="65" y="9" width="3" height="22" fill="#d4af37"/>
    </svg>`,
    terminals: [
    { x: 0, y: 20, label: '1' },
    { x: 100, y: 20, label: '2' }
    ]
    },
    {
    id: 'resistor_1k',
    name: 'Resistor 1KΩ',
    spec: '1KΩ ¼W',
    category: 'passive',
    voltage: 0,
    resistance: 1000,
    width: 100, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 40">
    <line x1="0" y1="20" x2="25" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="75" y1="20" x2="100" y2="20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 25 13 Q 28 8, 33 8 L 67 8 Q 72 8, 75 13 L 75 27 Q 72 32, 67 32 L 33 32 Q 28 32, 25 27 Z" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5" filter="url(#innerShadow)"/>
    <rect x="35" y="8" width="4" height="24" fill="#78350f"/>
    <rect x="45" y="8" width="4" height="24" fill="#1a1a1a"/>
    <rect x="55" y="8" width="4" height="24" fill="#dc2626"/>
    <rect x="65" y="9" width="3" height="22" fill="#d4af37"/>
    </svg>`,
    terminals: [
    { x: 0, y: 20, label: '1' },
    { x: 100, y: 20, label: '2' }
    ]
    },
    {
    id: 'resistor_100',
    name: 'Resistor 100Ω',
    spec: '100Ω ¼W',
    category: 'passive',
    voltage: 0,
    resistance: 100,
    width: 90, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 90 30">
    <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="15" x2="90" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="20" y="5" width="50" height="20" rx="4" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5"/>
    <line x1="30" y1="5" x2="30" y2="25" stroke="#a78bfa" stroke-width="3"/>
    <line x1="42" y1="5" x2="42" y2="25" stroke="#000" stroke-width="3"/>
    <line x1="54" y1="5" x2="54" y2="25" stroke="#a78bfa" stroke-width="3"/>
    <line x1="60" y1="5" x2="60" y2="25" stroke="#d4af37" stroke-width="2"/>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: '1' },
    { x: 90, y: 15, label: '2' }
    ]
    },
    {
    id: 'resistor_10k',
    name: 'Resistor 10KΩ',
    spec: '10KΩ ¼W',
    category: 'passive',
    voltage: 0,
    resistance: 10000,
    width: 90, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 90 30">
    <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="15" x2="90" y2="15" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="20" y="5" width="50" height="20" rx="4" fill="url(#resBody)" stroke="#64748b" stroke-width="1.5"/>
    <line x1="30" y1="5" x2="30" y2="25" stroke="#a78bfa" stroke-width="3"/>
    <line x1="42" y1="5" x2="42" y2="25" stroke="#000" stroke-width="3"/>
    <line x1="54" y1="5" x2="54" y2="25" stroke="#f97316" stroke-width="3"/>
    <line x1="60" y1="5" x2="60" y2="25" stroke="#d4af37" stroke-width="2"/>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: '1' },
    { x: 90, y: 15, label: '2' }
    ]
    }
];

const styles = `
    /* Resistor styles - reserved for future migration */
`;

export default { variants, styles };
