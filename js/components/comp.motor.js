// ═══════════════════════════════════════════════════
// CZElectro — Motor DC Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'motor_dc',
    name: 'Motor DC',
    spec: '3-9V, 200mA max',
    category: 'output',
    voltage: 0,
    resistance: 50,
    maxCurrent: 0.2,
    ratedPower: 0.9,
    ratedVoltage: 3,
    width: 70, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 70">
    <line x1="10" y1="60" x2="10" y2="70" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="60" x2="60" y2="70" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="35" cy="32" r="28" fill="url(#motorBody)" stroke="#111" stroke-width="2"/>
    <circle cx="35" cy="32" r="20" fill="#1f2937" stroke="#374151" stroke-width="1"/>
    <g class="motor-spin" style="transform-origin: 35px 32px;">
    <line x1="20" y1="32" x2="50" y2="32" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="35" y1="17" x2="35" y2="47" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="24" y1="21" x2="46" y2="43" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="46" y1="21" x2="24" y2="43" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <circle class="motor-shaft" cx="35" cy="32" r="5" fill="#d4af37" stroke="#92400e" stroke-width="1"/>
    <text x="35" y="36" fill="#9ca3af" font-weight="bold" font-size="8" text-anchor="middle" font-family="sans-serif">M</text>
    </svg>`,
    terminals: [
    { x: 10, y: 70, label: '+' },
    { x: 60, y: 70, label: '−' }
    ]
    }
];

const styles = `
    /* Motor DC styles - reserved for future migration */
`;

export default { variants, styles };
