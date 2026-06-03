// ═══════════════════════════════════════════════════
// CZElectro — Push Button Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'push_button',
    name: 'Push Button',
    nameEn: 'Push Button',
    spec: 'Momentary NO',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    isMCB: false,
    width: 40, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 40 50">
    <line x1="20" y1="0" x2="20" y2="14" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="20" y1="36" x2="20" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="8" y="14" width="24" height="22" rx="3" fill="#334155" stroke="#475569" stroke-width="1.5"/>
    <circle cx="20" cy="22" r="7" fill="#ef4444" stroke="#dc2626" stroke-width="1.5"/>
    <circle cx="20" cy="21" r="3" fill="#f87171" opacity="0.5"/>
    <text x="20" y="33" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">BTN</text>
    </svg>`,
    terminals: [
    { x: 20, y: 0, label: '+' },
    { x: 20, y: 50, label: '-' }
    ]
    }
];

const styles = `
    /* Push Button styles - reserved for future migration */
`;

export default { variants, styles };
