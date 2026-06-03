// ═══════════════════════════════════════════════════
// CZElectro — Multimeter Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'voltmeter',
    name: 'Multimeter',
    spec: 'Digital DMM, V / A / Ω',
    category: 'passive',
    voltage: 0,
    resistance: 10000000, // Default V mode: 10MΩ
    isMultimeter: true,
    isVoltmeter: true,     // backward compat
    maxCurrent: 10.0,      // 10A fuse like real DMM
    width: 80, height: 100,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 100">
    <!-- Lead wires -->
    <line x1="20" y1="88" x2="20" y2="100" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="88" x2="60" y2="100" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
    <!-- Body -->
    <rect x="4" y="4" width="72" height="84" rx="8" fill="#1a1a2e" stroke="#2d2d4a" stroke-width="2"/>
    <!-- Screen bezel -->
    <rect x="10" y="10" width="60" height="34" rx="4" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <!-- Screen background -->
    <rect class="vm-screen-bg" x="12" y="12" width="56" height="30" rx="3" fill="#0d1117" opacity="0.9"/>
    <!-- Reading value — centered in screen -->
    <text class="vm-reading" x="40" y="33" fill="#22c55e" font-size="12" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code','Consolas',monospace" style="transition: fill 0.3s;">0.00</text>
    <!-- Unit label — top-right of screen -->
    <text class="vm-unit" x="65" y="21" fill="#4ade80" font-size="7" font-weight="700" text-anchor="end" font-family="sans-serif" opacity="0.8">V</text>
    <!-- Mode dial -->
    <circle class="mm-dial-bg" cx="40" cy="58" r="11" fill="#111827" stroke="#374151" stroke-width="1.5"/>
    <text class="mm-label-v" x="40" y="51" fill="#22c55e" font-size="5.5" font-weight="800" text-anchor="middle" font-family="sans-serif">V</text>
    <text class="mm-label-o" x="49" y="63" fill="#6b7280" font-size="5.5" font-weight="800" text-anchor="middle" font-family="sans-serif">Ω</text>
    <text class="mm-label-a" x="31" y="63" fill="#6b7280" font-size="5.5" font-weight="800" text-anchor="middle" font-family="sans-serif">A</text>
    <line class="mm-dial-arrow" x1="40" y1="58" x2="40" y2="50" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <circle cx="40" cy="58" r="2.5" fill="#f59e0b"/>
    <!-- Mode label -->
    <text class="mm-mode-label" x="40" y="76" fill="#9ca3af" font-size="7" font-weight="700" text-anchor="middle" font-family="sans-serif">VOLTAGE</text>
    <!-- Indicator LED -->
    <circle class="vm-indicator" cx="66" cy="82" r="3" fill="#374151" style="transition: fill 0.4s;"/>
    <!-- Terminal connectors -->
    <circle cx="20" cy="92" r="4" fill="#374151" stroke="#4b5563" stroke-width="1"/>
    <text x="20" y="94.5" fill="#ef4444" font-size="5" font-weight="900" text-anchor="middle" font-family="sans-serif">+</text>
    <circle cx="60" cy="92" r="4" fill="#374151" stroke="#4b5563" stroke-width="1"/>
    <text x="60" y="94.5" fill="#9ca3af" font-size="5" font-weight="900" text-anchor="middle" font-family="sans-serif">−</text>
    </svg>`,
    terminals: [
    { x: 20, y: 100, label: '+' },
    { x: 60, y: 100, label: '−' }
    ]
    }
];

const styles = `
    /* Multimeter styles - reserved for future migration */
`;

export default { variants, styles };
