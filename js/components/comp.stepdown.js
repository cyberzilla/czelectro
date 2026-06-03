// ═══════════════════════════════════════════════════
// CZElectro — Step-Down Converter Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'stepdown_12v',
    name: 'Step-Down 12V',
    spec: '48V→12V DC, 3A max',
    category: 'passive',
    voltage: 0,
    resistance: 2,
    maxOutputCurrent: 3,  // 3A max regulated output
    isStepDown: true,
    width: 70, height: 45,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 45">
    <line x1="0" y1="22" x2="8" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="62" y1="22" x2="70" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="8" y="3" width="54" height="39" rx="4" fill="#1f2937" stroke="#8b5cf6" stroke-width="1.5"/>
    <rect x="11" y="6" width="48" height="16" rx="2" fill="#111827"/>
    <text x="15" y="16" fill="#a78bfa" font-size="6" font-weight="800" font-family="monospace">48→12V</text>
    <path d="M 15 30 L 20 30 L 22 26 L 26 34 L 28 30 L 33 30" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
    <text x="12" y="40" fill="#f87171" font-size="5" font-weight="700" font-family="sans-serif">IN</text>
    <path d="M 38 30 L 55 30" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
    <text x="45" y="40" fill="#4ade80" font-size="5" font-weight="700" font-family="sans-serif">OUT</text>
    <circle class="sd-indicator" cx="56" cy="9" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 0, y: 22, label: 'IN' },
    { x: 70, y: 22, label: 'OUT' }
    ]
    },
    {
    id: 'stepdown_5v',
    name: 'Step-Down 5V',
    spec: '48V→5V DC, 2A max',
    category: 'passive',
    voltage: 0,
    resistance: 2,
    maxOutputCurrent: 2,  // 2A max regulated output
    isStepDown: true,
    width: 70, height: 45,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 45">
    <line x1="0" y1="22" x2="8" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="62" y1="22" x2="70" y2="22" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="8" y="3" width="54" height="39" rx="4" fill="#1f2937" stroke="#06b6d4" stroke-width="1.5"/>
    <rect x="11" y="6" width="48" height="16" rx="2" fill="#111827"/>
    <text x="16" y="16" fill="#67e8f9" font-size="6" font-weight="800" font-family="monospace">48→5V</text>
    <path d="M 15 30 L 20 30 L 22 26 L 26 34 L 28 30 L 33 30" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
    <text x="12" y="40" fill="#f87171" font-size="5" font-weight="700" font-family="sans-serif">IN</text>
    <path d="M 38 30 L 55 30" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
    <text x="45" y="40" fill="#4ade80" font-size="5" font-weight="700" font-family="sans-serif">OUT</text>
    <circle class="sd-indicator" cx="56" cy="9" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 0, y: 22, label: 'IN' },
    { x: 70, y: 22, label: 'OUT' }
    ]
    }
];

const styles = `
    /* Step-Down Converter styles - reserved for future migration */
`;

export default { variants, styles };
