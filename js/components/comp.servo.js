// ═══════════════════════════════════════════════════
// CZElectro — Servo Motor Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'servo_sg90',
    name: 'Servo SG90',
    nameEn: 'Servo Motor SG90',
    spec: '4.8-6V, 180°',
    category: 'output',
    voltage: 0,
    resistance: 100,
    maxCurrent: 0.5,
    ratedPower: 2.5,
    isServo: true,
    width: 55, height: 45,
    svg: `<svg width="100%" height="100%" viewBox="0 0 55 45">
    <!-- Lead wires (SIG=orange, VCC=red, GND=brown) -->
    <line x1="14" y1="38" x2="14" y2="45" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="28" y1="38" x2="28" y2="45" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="38" x2="42" y2="45" stroke="#92400e" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Mounting tabs -->
    <rect x="0" y="28" width="10" height="5" rx="1" fill="#1e40af" stroke="#1e3a8a" stroke-width="0.8"/>
    <rect x="45" y="28" width="10" height="5" rx="1" fill="#1e40af" stroke="#1e3a8a" stroke-width="0.8"/>
    <circle cx="5" cy="30.5" r="1.2" fill="#111827"/>
    <circle cx="50" cy="30.5" r="1.2" fill="#111827"/>
    <!-- Servo body -->
    <rect x="6" y="14" width="43" height="24" rx="3" fill="#1e40af" stroke="#1e3a8a" stroke-width="1.5"/>
    <!-- Label -->
    <text x="27.5" y="30" fill="#93c5fd" font-size="5" font-weight="bold" text-anchor="middle" font-family="monospace">SG90</text>
    <!-- Horn base circle -->
    <circle cx="20" cy="14" r="7" fill="#334155" stroke="#64748b" stroke-width="1"/>
    <circle cx="20" cy="14" r="3" fill="#475569" stroke="#64748b" stroke-width="0.8"/>
    <!-- Horn arm -->
    <rect x="18" y="2" width="4" height="12" rx="2" fill="#94a3b8" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="20" cy="3" r="1.5" fill="#64748b"/>
    <!-- Pin labels -->
    <text x="14" y="36" fill="#fb923c" font-size="3.5" text-anchor="middle" font-family="monospace">SIG</text>
    <text x="28" y="36" fill="#fca5a5" font-size="3.5" text-anchor="middle" font-family="monospace">VCC</text>
    <text x="42" y="36" fill="#d6a06c" font-size="3.5" text-anchor="middle" font-family="monospace">GND</text>
    </svg>`,
    terminals: [
    { x: 14, y: 45, label: 'SIG' },
    { x: 28, y: 45, label: 'VCC' },
    { x: 42, y: 45, label: 'GND' }
    ]
    }
];

const styles = `
    /* Servo Motor styles - reserved for future migration */
`;

export default { variants, styles };
