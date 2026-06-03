// ═══════════════════════════════════════════════════
// CZElectro — DC Fan Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'fan_12v',
    name: 'Kipas DC 12V',
    nameEn: 'DC Fan 12V',
    spec: '12V, 0.2A',
    category: 'output',
    voltage: 0,
    resistance: 60,
    maxCurrent: 0.2,
    ratedPower: 2.4,
    width: 55, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 55 55">
    <!-- Lead wires -->
    <line x1="15" y1="48" x2="15" y2="55" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="48" x2="40" y2="55" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Square frame -->
    <rect x="3" y="2" width="49" height="46" rx="4" fill="#1f2937" stroke="#334155" stroke-width="1.5"/>
    <!-- Corner screw holes -->
    <circle cx="8" cy="7" r="2" fill="#111827" stroke="#475569" stroke-width="0.5"/>
    <circle cx="47" cy="7" r="2" fill="#111827" stroke="#475569" stroke-width="0.5"/>
    <circle cx="8" cy="43" r="2" fill="#111827" stroke="#475569" stroke-width="0.5"/>
    <circle cx="47" cy="43" r="2" fill="#111827" stroke="#475569" stroke-width="0.5"/>
    <!-- Circular housing -->
    <circle cx="27.5" cy="25" r="18" fill="#111827" stroke="#475569" stroke-width="1"/>
    <!-- Fan blades (4 blades) -->
    <g class="fan-spin" style="transform-origin: 27.5px 25px;">
    <path d="M 27.5 25 Q 22 15, 27.5 8" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <path d="M 27.5 25 Q 37 20, 44 25" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <path d="M 27.5 25 Q 33 35, 27.5 42" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <path d="M 27.5 25 Q 18 30, 11 25" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    </g>
    <!-- Center hub -->
    <circle cx="27.5" cy="25" r="4" fill="#334155" stroke="#64748b" stroke-width="1"/>
    <circle cx="27.5" cy="25" r="1.5" fill="#94a3b8"/>
    </svg>`,
    terminals: [
    { x: 15, y: 55, label: '+' },
    { x: 40, y: 55, label: '-' }
    ]
    }
];

const styles = `
    /* DC Fan styles - reserved for future migration */
`;

export default { variants, styles };
