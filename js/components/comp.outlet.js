// ═══════════════════════════════════════════════════
// CZElectro — Power Outlet Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'outlet',
    name: 'Stop Kontak',
    spec: '220V AC, 16A',
    category: 'passive',
    voltage: 0,
    resistance: 0.5,
    width: 50, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 50">
    <line x1="5" y1="25" x2="0" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="25" x2="45" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="5" width="40" height="40" rx="5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    <rect x="8" y="8" width="34" height="34" rx="8" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"/>
    <circle cx="25" cy="25" r="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="18.5" y="16.5" width="3" height="7" rx="1" fill="#6b7280"/>
    <rect x="28.5" y="16.5" width="3" height="7" rx="1" fill="#6b7280"/>
    <circle cx="25" cy="31" r="2" fill="#6b7280" class="outlet-indicator" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 0, y: 25, label: 'L' },
    { x: 50, y: 25, label: 'N' }
    ]
    },
    {
    id: 'outlet_strip',
    name: 'Terminal Listrik 4 Lubang',
    nameEn: 'Power Strip 4-Outlet',
    spec: '220V AC, 16A, 4 Lubang',
    category: 'passive',
    voltage: 0,
    resistance: 0,
    isBusOnly: true,
    groundTerminals: [1], // N terminal acts as GND — auto-connected to ground reference
    width: 110, height: 40,
    // L + 4 holes share one bus (hot distribution). N is GND (return).
    // No internal L-N resistance — current flows through external loads only.
    busTerminals: [[0, 2, 3, 4, 5]],
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 40">
    <!-- Input cable L -->
    <line x1="0" y1="20" x2="5" y2="20" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <!-- GND cable N -->
    <line x1="105" y1="20" x2="110" y2="20" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <!-- Body -->
    <rect x="5" y="2" width="100" height="36" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Power LED -->
    <circle cx="11" cy="9" r="2.5" fill="#ef4444" class="strip-power" opacity="0.4" style="transition: all 0.4s;"/>
    <!-- Switch -->
    <rect x="7" y="30" width="8" height="4" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>

    <!-- Outlet 1 (center=27) -->
    <circle cx="27" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="22.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="29.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="27" cy="26" r="1.5" fill="#94a3b8"/>

    <!-- Outlet 2 (center=49) -->
    <circle cx="49" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="44.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="51.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="49" cy="26" r="1.5" fill="#94a3b8"/>

    <!-- Outlet 3 (center=71) -->
    <circle cx="71" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="66.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="73.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="71" cy="26" r="1.5" fill="#94a3b8"/>

    <!-- Outlet 4 (center=93) -->
    <circle cx="93" cy="20" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    <rect x="88.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <rect x="95.5" y="14" width="2" height="5" rx="0.5" fill="#6b7280"/>
    <circle cx="93" cy="26" r="1.5" fill="#94a3b8"/>
    </svg>`,
    terminals: [
    { x: 0, y: 20, label: 'L' },
    { x: 110, y: 20, label: 'N' },
    { x: 27, y: 40, label: '1' },
    { x: 49, y: 40, label: '2' },
    { x: 71, y: 40, label: '3' },
    { x: 93, y: 40, label: '4' }
    ]
    },
    {
    id: 'power_strip_4',
    name: 'Power Strip 4 Lubang',
    nameEn: 'Power Strip 4-Outlet',
    spec: '220V AC, 16A, 4 Outlet',
    category: 'passive',
    voltage: 0,
    resistance: 0,
    isBusOnly: true,
    width: 180, height: 46,
    // Bus: all L terminals share a node, all N terminals share a node
    // No internal L-N resistance — current flows through external loads only
    // Terminals: 0=L-in, 1=N-in, 2=L1, 3=N1, 4=L2, 5=N2, 6=L3, 7=N3, 8=L4, 9=N4
    busTerminals: [[0, 2, 4, 6, 8], [1, 3, 5, 7, 9]],
    svg: `<svg width="100%" height="100%" viewBox="0 0 180 46">
    <!-- Body -->
    <rect x="2" y="6" width="176" height="38" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="4" y="8" width="172" height="34" rx="5" fill="#0f172a" stroke="#334155" stroke-width="0.8"/>

    <!-- Power input cable (left) -->
    <line x1="0" y1="18" x2="6" y2="18" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="0" y1="32" x2="6" y2="32" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Power LED -->
    <circle cx="13" cy="25" r="2.5" fill="#475569" class="strip-power-led"/>

    <!-- Outlet 1 (center=37) -->
    <rect x="21" y="10" width="32" height="28" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <circle cx="31" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="43" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="37" cy="32" r="2.5" fill="#0d1117" stroke="#475569" stroke-width="0.7"/>
    <!-- Short pin stubs -->
    <line x1="31" y1="0" x2="31" y2="10" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="43" y1="0" x2="43" y2="10" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round"/>

    <!-- Outlet 2 (center=75) -->
    <rect x="59" y="10" width="32" height="28" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <circle cx="69" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="81" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="75" cy="32" r="2.5" fill="#0d1117" stroke="#475569" stroke-width="0.7"/>
    <line x1="69" y1="0" x2="69" y2="10" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="81" y1="0" x2="81" y2="10" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round"/>

    <!-- Outlet 3 (center=113) -->
    <rect x="97" y="10" width="32" height="28" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <circle cx="107" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="119" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="113" cy="32" r="2.5" fill="#0d1117" stroke="#475569" stroke-width="0.7"/>
    <line x1="107" y1="0" x2="107" y2="10" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="119" y1="0" x2="119" y2="10" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round"/>

    <!-- Outlet 4 (center=151) -->
    <rect x="135" y="10" width="32" height="28" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <circle cx="145" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="157" cy="21" r="3.5" fill="#0d1117" stroke="#64748b" stroke-width="0.8"/>
    <circle cx="151" cy="32" r="2.5" fill="#0d1117" stroke="#475569" stroke-width="0.7"/>
    <line x1="145" y1="0" x2="145" y2="10" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="157" y1="0" x2="157" y2="10" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    // Input (from source/inverter)
    { x: 0, y: 18, label: 'L' },
    { x: 0, y: 32, label: 'N' },
    // Outlet pins at top edge (y=0)
    { x: 31, y: 0, label: 'L1' },
    { x: 43, y: 0, label: 'N1' },
    { x: 69, y: 0, label: 'L2' },
    { x: 81, y: 0, label: 'N2' },
    { x: 107, y: 0, label: 'L3' },
    { x: 119, y: 0, label: 'N3' },
    { x: 145, y: 0, label: 'L4' },
    { x: 157, y: 0, label: 'N4' }
    ]
    }
];

const styles = `
    /* Power Outlet styles - reserved for future migration */
`;

export default { variants, styles };
