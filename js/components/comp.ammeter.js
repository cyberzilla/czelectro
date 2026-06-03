// ═══════════════════════════════════════════════════
// CZElectro — Ammeter Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'ammeter',
    name: 'Ammeter',
    nameEn: 'Ammeter',
    spec: 'DC 0-10A',
    category: 'passive',
    voltage: 0,
    resistance: 0.00001,
    isMultimeter: true,
    isAmmeter: true,
    maxCurrent: 10.0,
    width: 70, height: 85,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 85">
    <!-- Lead wires -->
    <line x1="18" y1="76" x2="18" y2="85" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="52" y1="76" x2="52" y2="85" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
    <!-- Body -->
    <rect x="4" y="4" width="62" height="72" rx="8" fill="#1a1a2e" stroke="#2d2d4a" stroke-width="2"/>
    <!-- Screen bezel -->
    <rect x="9" y="9" width="52" height="30" rx="4" fill="#0a1628" stroke="#3b1a1a" stroke-width="1"/>
    <!-- Screen background -->
    <rect class="am-screen-bg" x="11" y="11" width="48" height="26" rx="3" fill="#0d1117" opacity="0.9"/>
    <!-- Reading value — centered in screen -->
    <text class="am-reading" x="35" y="31" fill="#ef4444" font-size="12" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code','Consolas',monospace" style="transition: fill 0.3s;">0.00</text>
    <!-- Unit label — top-right of screen -->
    <text class="am-unit" x="56" y="20" fill="#f87171" font-size="7" font-weight="700" text-anchor="end" font-family="sans-serif" opacity="0.8">A</text>
    <!-- Center icon -->
    <circle cx="35" cy="52" r="9" fill="#111827" stroke="#374151" stroke-width="1.5"/>
    <text x="35" y="56" fill="#ef4444" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">A</text>
    <!-- Mode label -->
    <text x="35" y="68" fill="#f87171" font-size="7" font-weight="700" text-anchor="middle" font-family="sans-serif" opacity="0.6">CURRENT</text>
    <!-- Indicator LED -->
    <circle class="am-indicator" cx="56" cy="70" r="3" fill="#374151" style="transition: fill 0.4s;"/>
    <!-- Terminal connectors -->
    <circle cx="18" cy="78" r="3.5" fill="#374151" stroke="#4b5563" stroke-width="1"/>
    <text x="18" y="80.5" fill="#ef4444" font-size="5" font-weight="900" text-anchor="middle" font-family="sans-serif">+</text>
    <circle cx="52" cy="78" r="3.5" fill="#374151" stroke="#4b5563" stroke-width="1"/>
    <text x="52" y="80.5" fill="#9ca3af" font-size="5" font-weight="900" text-anchor="middle" font-family="sans-serif">−</text>
    </svg>`,
    terminals: [
    { x: 18, y: 85, label: '+' },
    { x: 52, y: 85, label: '-' }
    ]
    }
];

const styles = `
    /* Ammeter styles - reserved for future migration */
`;

export default { variants, styles };
