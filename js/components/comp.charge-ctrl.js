// ═══════════════════════════════════════════════════
// CZElectro — Charge Controller Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'charge_controller',
    name: 'CC PWM 10A',
    spec: 'PWM 10A, Panel 6-18V',
    category: 'passive',
    voltage: 0,
    resistance: 1.5,
    maxOutputCurrent: 10,  // 10A max regulated output
    isChargeController: true,
    width: 90, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 90 55">
    <line x1="0" y1="28" x2="12" y2="28" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="78" y1="28" x2="90" y2="28" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="5" width="66" height="46" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <rect x="16" y="9" width="58" height="22" rx="3" fill="#0f172a" stroke="#1e293b"/>
    <text x="20" y="21" fill="#22c55e" font-size="7" font-weight="800" font-family="monospace">PWM</text>
    <text x="50" y="21" fill="#4ade80" font-size="7" font-weight="600" font-family="monospace">10A</text>
    <circle cx="22" cy="40" r="3" fill="#22c55e" opacity="0.8"/>
    <circle cx="32" cy="40" r="3" fill="#3b82f6" opacity="0.6"/>
    <circle cx="42" cy="40" r="3" fill="#f59e0b" opacity="0.5"/>
    <circle cx="52" cy="40" r="3" fill="#6b7280" opacity="0.3"/>
    <text x="16" y="52" fill="#9ca3af" font-size="5" font-family="sans-serif">SOLAR</text>
    <text x="55" y="52" fill="#9ca3af" font-size="5" font-family="sans-serif">BATT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 28, label: 'IN' },
    { x: 90, y: 28, label: 'OUT' }
    ]
    },
    {
    id: 'charge_controller_30a',
    name: 'CC PWM 30A',
    spec: 'PWM 30A, Array 1kW',
    category: 'passive',
    voltage: 0,
    resistance: 0.8,
    maxOutputCurrent: 30,  // 30A → 48V × 30A = 1440W
    isChargeController: true,
    width: 100, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 60">
    <line x1="0" y1="30" x2="10" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="90" y1="30" x2="100" y2="30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="10" y="4" width="80" height="52" rx="5" fill="#1e293b" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="14" y="8" width="72" height="24" rx="3" fill="#0f172a" stroke="#1e293b"/>
    <text x="18" y="22" fill="#3b82f6" font-size="8" font-weight="800" font-family="monospace">PWM</text>
    <text x="52" y="22" fill="#60a5fa" font-size="8" font-weight="700" font-family="monospace">30A</text>
    <circle cx="20" cy="44" r="3" fill="#22c55e" opacity="0.8"/>
    <circle cx="30" cy="44" r="3" fill="#22c55e" opacity="0.6"/>
    <circle cx="40" cy="44" r="3" fill="#3b82f6" opacity="0.6"/>
    <circle cx="50" cy="44" r="3" fill="#f59e0b" opacity="0.5"/>
    <circle cx="60" cy="44" r="3" fill="#6b7280" opacity="0.3"/>
    <text x="14" y="56" fill="#9ca3af" font-size="5" font-family="sans-serif">SOLAR</text>
    <text x="66" y="56" fill="#9ca3af" font-size="5" font-family="sans-serif">BATT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 30, label: 'IN' },
    { x: 100, y: 30, label: 'OUT' }
    ]
    },
    {
    id: 'charge_controller_60a',
    name: 'CC MPPT 60A',
    spec: 'MPPT 60A, Array 3kW',
    category: 'passive',
    voltage: 0,
    resistance: 0.4,
    maxOutputCurrent: 60,  // 60A → 48V × 60A = 2880W
    isChargeController: true,
    width: 110, height: 65,
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 65">
    <line x1="0" y1="33" x2="10" y2="33" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="100" y1="33" x2="110" y2="33" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="10" y="3" width="90" height="59" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="14" y="7" width="82" height="26" rx="3" fill="#111827" stroke="#1e293b"/>
    <text x="18" y="22" fill="#f59e0b" font-size="8" font-weight="900" font-family="monospace">MPPT</text>
    <text x="58" y="22" fill="#fbbf24" font-size="8" font-weight="700" font-family="monospace">60A</text>
    <circle cx="20" cy="48" r="3.5" fill="#22c55e" opacity="0.9"/>
    <circle cx="31" cy="48" r="3.5" fill="#22c55e" opacity="0.7"/>
    <circle cx="42" cy="48" r="3.5" fill="#3b82f6" opacity="0.6"/>
    <circle cx="53" cy="48" r="3.5" fill="#f59e0b" opacity="0.6"/>
    <circle cx="64" cy="48" r="3.5" fill="#f59e0b" opacity="0.4"/>
    <circle cx="75" cy="48" r="3.5" fill="#6b7280" opacity="0.3"/>
    <text x="14" y="61" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">SOLAR</text>
    <text x="74" y="61" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">BATT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 33, label: 'IN' },
    { x: 110, y: 33, label: 'OUT' }
    ]
    },
    {
    id: 'charge_controller_100a',
    name: 'CC MPPT 100A',
    spec: 'MPPT 100A, Array 5kW',
    category: 'passive',
    voltage: 0,
    resistance: 0.2,
    maxOutputCurrent: 100,  // 100A → 48V × 100A = 4800W
    isChargeController: true,
    width: 120, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 120 70">
    <line x1="0" y1="35" x2="10" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="110" y1="35" x2="120" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="10" y="2" width="100" height="66" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
    <rect x="15" y="7" width="90" height="28" rx="4" fill="#111827" stroke="#1e293b"/>
    <text x="20" y="24" fill="#ef4444" font-size="9" font-weight="900" font-family="monospace">MPPT</text>
    <text x="62" y="24" fill="#f87171" font-size="9" font-weight="700" font-family="monospace">100A</text>
    <circle cx="22" cy="52" r="4" fill="#22c55e" opacity="0.9"/>
    <circle cx="34" cy="52" r="4" fill="#22c55e" opacity="0.7"/>
    <circle cx="46" cy="52" r="4" fill="#3b82f6" opacity="0.7"/>
    <circle cx="58" cy="52" r="4" fill="#f59e0b" opacity="0.6"/>
    <circle cx="70" cy="52" r="4" fill="#f59e0b" opacity="0.5"/>
    <circle cx="82" cy="52" r="4" fill="#ef4444" opacity="0.4"/>
    <circle cx="94" cy="52" r="4" fill="#6b7280" opacity="0.3"/>
    <text x="15" y="66" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">SOLAR</text>
    <text x="82" y="66" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">BATT</text>
    </svg>`,
    terminals: [
    { x: 0, y: 35, label: 'IN' },
    { x: 120, y: 35, label: 'OUT' }
    ]
    }
];

const styles = `
    /* Charge Controller styles - reserved for future migration */
`;

export default { variants, styles };
