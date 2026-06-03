// ═══════════════════════════════════════════════════
// CZElectro — Switch Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'switch_toggle',
    name: 'Saklar Toggle',
    spec: 'SPST ON/OFF',
    category: 'passive',
    voltage: 0,
    resistance: Infinity,
    width: 80, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 60">
    <line x1="0" y1="30" x2="20" y2="30" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <line x1="60" y1="30" x2="80" y2="30" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <rect x="20" y="18" width="40" height="24" rx="5" fill="#475569" stroke="#334155" stroke-width="1.5"/>
    <circle cx="40" cy="30" r="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
    <g class="switch-lever">
    <rect x="36" y="6" width="8" height="28" rx="4" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
    </g>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'A' },
    { x: 80, y: 30, label: 'B' }
    ]
    }
];

const styles = `
    /* Switch styles - reserved for future migration */
`;

export default { variants, styles };
