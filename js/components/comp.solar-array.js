// ═══════════════════════════════════════════════════
// CZElectro — Solar Panel Array Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'solar_array_1k',
    name: 'Panel Array 1kWp',
    spec: '5×200W Poly, 48V',
    category: 'source',
    voltage: 48,
    resistance: 0.2,
    ratedPower: 1000,
    width: 100, height: 80,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 80">
    <rect x="2" y="2" width="96" height="62" rx="3" fill="#0f172a" stroke="#1e3a5f" stroke-width="2"/>
    <rect x="5" y="5" width="90" height="56" rx="2" fill="#172554"/>
    <line x1="5" y1="16" x2="95" y2="16" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="5" y1="27" x2="95" y2="27" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="5" y1="38" x2="95" y2="38" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="5" y1="49" x2="95" y2="49" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="23" y1="5" x2="23" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="41" y1="5" x2="41" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="59" y1="5" x2="59" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <line x1="77" y1="5" x2="77" y2="61" stroke="#1d4ed8" stroke-width="0.5" opacity="0.4"/>
    <rect x="5" y="5" width="90" height="56" rx="2" fill="url(#ledGlowBlue)" opacity="0.1"/>
    <text x="12" y="36" fill="#3b82f6" font-size="14" font-weight="900" font-family="sans-serif" opacity="0.5">1kWp</text>
    <text x="60" y="14" fill="#fbbf24" font-size="7" font-weight="700" opacity="0.6">×5</text>
    <circle cx="82" cy="12" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.5"/>
    <line x1="82" y1="4" x2="82" y2="6" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
    <line x1="82" y1="18" x2="82" y2="20" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
    <line x1="74" y1="12" x2="76" y2="12" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
    <line x1="88" y1="12" x2="90" y2="12" stroke="#fbbf24" stroke-width="1" opacity="0.4"/>
    <line x1="30" y1="64" x2="30" y2="78" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="64" x2="70" y2="78" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 30, y: 78, label: '+' },
    { x: 70, y: 78, label: '−' }
    ]
    },
    {
    id: 'solar_array_3k',
    name: 'Panel Array 3kWp',
    spec: '15×200W Mono, 48V',
    category: 'source',
    voltage: 48,
    resistance: 0.1,
    ratedPower: 3000,
    width: 110, height: 85,
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 85">
    <rect x="2" y="2" width="106" height="66" rx="4" fill="#020617" stroke="#1e40af" stroke-width="2"/>
    <rect x="5" y="5" width="100" height="60" rx="2" fill="#0c1e3f"/>
    <line x1="5" y1="15" x2="105" y2="15" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="5" y1="25" x2="105" y2="25" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="5" y1="35" x2="105" y2="35" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="5" y1="45" x2="105" y2="45" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="5" y1="55" x2="105" y2="55" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="20" y1="5" x2="20" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="35" y1="5" x2="35" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="50" y1="5" x2="50" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="65" y1="5" x2="65" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="80" y1="5" x2="80" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <line x1="95" y1="5" x2="95" y2="65" stroke="#1e40af" stroke-width="0.5" opacity="0.35"/>
    <rect x="5" y="5" width="100" height="60" rx="2" fill="url(#ledGlowBlue)" opacity="0.08"/>
    <text x="10" y="40" fill="#2563eb" font-size="15" font-weight="900" font-family="sans-serif" opacity="0.45">3kWp</text>
    <text x="68" y="14" fill="#fbbf24" font-size="7" font-weight="700" opacity="0.5">×15</text>
    <circle cx="92" cy="14" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.4"/>
    <line x1="92" y1="5" x2="92" y2="8" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="92" y1="20" x2="92" y2="23" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="84" y1="14" x2="86" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="98" y1="14" x2="100" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="35" y1="68" x2="35" y2="83" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="75" y1="68" x2="75" y2="83" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 35, y: 83, label: '+' },
    { x: 75, y: 83, label: '−' }
    ]
    },
    {
    id: 'solar_array_5k',
    name: 'Panel Array 5kWp',
    spec: '25×200W Mono, 48V',
    category: 'source',
    voltage: 48,
    resistance: 0.08,
    ratedPower: 5000,
    width: 120, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 120 90">
    <rect x="2" y="2" width="116" height="70" rx="4" fill="#020617" stroke="#1e3a5f" stroke-width="2.5"/>
    <rect x="5" y="5" width="110" height="64" rx="2" fill="#0a1628"/>
    <line x1="5" y1="14" x2="115" y2="14" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="5" y1="23" x2="115" y2="23" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="5" y1="32" x2="115" y2="32" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="5" y1="41" x2="115" y2="41" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="5" y1="50" x2="115" y2="50" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="5" y1="59" x2="115" y2="59" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="17" y1="5" x2="17" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="29" y1="5" x2="29" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="41" y1="5" x2="41" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="53" y1="5" x2="53" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="65" y1="5" x2="65" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="77" y1="5" x2="77" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="89" y1="5" x2="89" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <line x1="101" y1="5" x2="101" y2="69" stroke="#1e3a8a" stroke-width="0.5" opacity="0.3"/>
    <rect x="5" y="5" width="110" height="64" rx="2" fill="url(#ledGlowBlue)" opacity="0.06"/>
    <text x="10" y="42" fill="#1d4ed8" font-size="16" font-weight="900" font-family="sans-serif" opacity="0.4">5kWp</text>
    <text x="75" y="16" fill="#fbbf24" font-size="7" font-weight="700" opacity="0.45">×25</text>
    <circle cx="100" cy="15" r="7" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.35"/>
    <line x1="100" y1="5" x2="100" y2="8" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="100" y1="22" x2="100" y2="25" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="91" y1="15" x2="93" y2="15" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="107" y1="15" x2="109" y2="15" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
    <line x1="38" y1="72" x2="38" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="82" y1="72" x2="82" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 38, y: 88, label: '+' },
    { x: 82, y: 88, label: '−' }
    ]
    }
];

const styles = `
    /* Solar Panel Array styles - reserved for future migration */
`;

export default { variants, styles };
