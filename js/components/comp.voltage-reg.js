// ═══════════════════════════════════════════════════
// CZElectro — Voltage Regulator Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'vreg_7805',
    name: 'Regulator 7805',
    nameEn: 'Voltage Regulator 7805',
    spec: '5V 1A, TO-220',
    category: 'passive',
    voltage: 0,
    resistance: 1,
    isVoltageRegulator: true,
    outputVoltage: 5,
    width: 45, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 45 55">
    <!-- Pin leads -->
    <line x1="10" y1="42" x2="10" y2="55" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="22" y1="42" x2="22" y2="55" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="35" y1="42" x2="35" y2="55" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Heat tab -->
    <rect x="5" y="2" width="35" height="8" rx="1" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="22" cy="6" r="2" fill="#334155" stroke="#64748b" stroke-width="0.5"/>
    <!-- Body -->
    <rect x="5" y="10" width="35" height="32" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <!-- Label -->
    <text x="22" y="23" fill="#e2e8f0" font-size="7" font-weight="bold" text-anchor="middle" font-family="monospace">7805</text>
    <!-- Pin labels -->
    <text x="10" y="38" fill="#f87171" font-size="4" text-anchor="middle" font-family="monospace">IN</text>
    <text x="22" y="38" fill="#94a3b8" font-size="4" text-anchor="middle" font-family="monospace">GND</text>
    <text x="35" y="38" fill="#4ade80" font-size="4" text-anchor="middle" font-family="monospace">OUT</text>
    <!-- Indicator -->
    <circle class="vreg-indicator" cx="38" cy="14" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 10, y: 55, label: 'IN' },
    { x: 22, y: 55, label: 'GND' },
    { x: 35, y: 55, label: 'OUT' }
    ]
    },
    {
    id: 'vreg_7812',
    name: 'Regulator 7812',
    nameEn: 'Voltage Regulator 7812',
    spec: '12V 1A, TO-220',
    category: 'passive',
    voltage: 0,
    resistance: 1,
    isVoltageRegulator: true,
    outputVoltage: 12,
    width: 45, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 45 55">
    <!-- Pin leads -->
    <line x1="10" y1="42" x2="10" y2="55" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="22" y1="42" x2="22" y2="55" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="35" y1="42" x2="35" y2="55" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Heat tab -->
    <rect x="5" y="2" width="35" height="8" rx="1" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="22" cy="6" r="2" fill="#334155" stroke="#64748b" stroke-width="0.5"/>
    <!-- Body -->
    <rect x="5" y="10" width="35" height="32" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <!-- Label -->
    <text x="22" y="23" fill="#e2e8f0" font-size="7" font-weight="bold" text-anchor="middle" font-family="monospace">7812</text>
    <!-- Pin labels -->
    <text x="10" y="38" fill="#f87171" font-size="4" text-anchor="middle" font-family="monospace">IN</text>
    <text x="22" y="38" fill="#94a3b8" font-size="4" text-anchor="middle" font-family="monospace">GND</text>
    <text x="35" y="38" fill="#4ade80" font-size="4" text-anchor="middle" font-family="monospace">OUT</text>
    <!-- Indicator -->
    <circle class="vreg-indicator" cx="38" cy="14" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 10, y: 55, label: 'IN' },
    { x: 22, y: 55, label: 'GND' },
    { x: 35, y: 55, label: 'OUT' }
    ]
    },
    {
    id: 'vreg_lm317',
    name: 'Regulator LM317',
    nameEn: 'Voltage Regulator LM317',
    spec: '1.25-37V Adj, 1.5A',
    category: 'passive',
    voltage: 0,
    resistance: 1,
    isVoltageRegulator: true,
    outputVoltage: 5,
    isAdjustable: true,
    width: 45, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 45 55">
    <!-- Pin leads -->
    <line x1="10" y1="42" x2="10" y2="55" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="22" y1="42" x2="22" y2="55" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="35" y1="42" x2="35" y2="55" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Heat tab -->
    <rect x="5" y="2" width="35" height="8" rx="1" fill="#475569" stroke="#64748b" stroke-width="1"/>
    <circle cx="22" cy="6" r="2" fill="#334155" stroke="#64748b" stroke-width="0.5"/>
    <!-- Body -->
    <rect x="5" y="10" width="35" height="32" rx="3" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.5"/>
    <!-- Label -->
    <text x="22" y="22" fill="#e2e8f0" font-size="6" font-weight="bold" text-anchor="middle" font-family="monospace">LM317</text>
    <!-- Pin labels -->
    <text x="10" y="38" fill="#f87171" font-size="4" text-anchor="middle" font-family="monospace">IN</text>
    <text x="22" y="38" fill="#fbbf24" font-size="4" text-anchor="middle" font-family="monospace">ADJ</text>
    <text x="35" y="38" fill="#4ade80" font-size="4" text-anchor="middle" font-family="monospace">OUT</text>
    <!-- Indicator -->
    <circle class="vreg-indicator" cx="38" cy="14" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 10, y: 55, label: 'IN' },
    { x: 22, y: 55, label: 'ADJ' },
    { x: 35, y: 55, label: 'OUT' }
    ]
    }
];

const styles = `
    /* Voltage Regulator styles - reserved for future migration */
`;

export default { variants, styles };
