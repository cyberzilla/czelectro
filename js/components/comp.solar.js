// ═══════════════════════════════════════════════════
// CZElectro — Solar Panel Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'solar_6v',
    name: 'Panel Surya 6V',
    spec: '6V 1W Mono',
    category: 'source',
    voltage: 6,
    resistance: 0.8,
    ratedPower: 1,  // 6V 1W panel
    width: 80, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 90">
    <rect x="4" y="4" width="72" height="72" rx="3" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="8" y="8" width="64" height="64" rx="2" fill="#1e3a5f"/>
    <line x1="8" y1="24" x2="72" y2="24" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
    <line x1="8" y1="40" x2="72" y2="40" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
    <line x1="8" y1="56" x2="72" y2="56" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
    <line x1="24" y1="8" x2="24" y2="72" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
    <line x1="40" y1="8" x2="40" y2="72" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
    <line x1="56" y1="8" x2="56" y2="72" stroke="#2563eb" stroke-width="0.5" opacity="0.5"/>
    <rect x="8" y="8" width="64" height="64" rx="2" fill="url(#ledGlowBlue)" opacity="0.15"/>
    <circle cx="62" cy="14" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.7"/>
    <line x1="62" y1="5" x2="62" y2="8" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
    <line x1="62" y1="20" x2="62" y2="23" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
    <line x1="53" y1="14" x2="56" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
    <line x1="68" y1="14" x2="71" y2="14" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
    <text x="16" y="44" fill="#60a5fa" font-size="10" font-weight="800" font-family="sans-serif" opacity="0.6">6V</text>
    <line x1="25" y1="76" x2="25" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="55" y1="76" x2="55" y2="88" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 25, y: 88, label: '+' },
    { x: 55, y: 88, label: '−' }
    ]
    },
    {
    id: 'solar_12v',
    name: 'Panel Surya 12V',
    spec: '12V 5W Poly',
    category: 'source',
    voltage: 12,
    resistance: 0.5,
    ratedPower: 5,  // 12V 5W panel
    width: 100, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 70">
    <rect x="3" y="3" width="94" height="54" rx="3" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="7" y="7" width="86" height="46" rx="2" fill="#172554"/>
    <line x1="7" y1="19" x2="93" y2="19" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="7" y1="31" x2="93" y2="31" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="7" y1="43" x2="93" y2="43" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="21" y1="7" x2="21" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="36" y1="7" x2="36" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="50" y1="7" x2="50" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="64" y1="7" x2="64" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <line x1="79" y1="7" x2="79" y2="53" stroke="#1d4ed8" stroke-width="0.5" opacity="0.5"/>
    <rect x="7" y="7" width="86" height="46" rx="2" fill="url(#ledGlowBlue)" opacity="0.12"/>
    <circle cx="82" cy="14" r="5" fill="none" stroke="#fbbf24" stroke-width="1.2" opacity="0.6"/>
    <line x1="82" y1="6" x2="82" y2="9" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
    <line x1="82" y1="19" x2="82" y2="22" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
    <line x1="74" y1="14" x2="77" y2="14" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
    <line x1="87" y1="14" x2="90" y2="14" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
    <text x="14" y="35" fill="#3b82f6" font-size="12" font-weight="900" font-family="sans-serif" opacity="0.5">12V</text>
    <line x1="30" y1="57" x2="30" y2="68" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="57" x2="70" y2="68" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 30, y: 68, label: '+' },
    { x: 70, y: 68, label: '−' }
    ]
    },
    {
    id: 'solar_18v',
    name: 'Panel Surya 18V',
    spec: '18V 10W Mono',
    category: 'source',
    voltage: 18,
    resistance: 0.3,
    ratedPower: 10,  // 18V 10W panel
    width: 110, height: 75,
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 75">
    <rect x="3" y="3" width="104" height="58" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <rect x="7" y="7" width="96" height="50" rx="2" fill="#0c1e3f"/>
    <line x1="7" y1="17" x2="103" y2="17" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="7" y1="27" x2="103" y2="27" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="7" y1="37" x2="103" y2="37" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="7" y1="47" x2="103" y2="47" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="19" y1="7" x2="19" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="31" y1="7" x2="31" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="43" y1="7" x2="43" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="55" y1="7" x2="55" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="67" y1="7" x2="67" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="79" y1="7" x2="79" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <line x1="91" y1="7" x2="91" y2="57" stroke="#1e40af" stroke-width="0.5" opacity="0.4"/>
    <rect x="7" y="7" width="96" height="50" rx="2" fill="url(#ledGlowBlue)" opacity="0.1"/>
    <circle cx="92" cy="15" r="5" fill="none" stroke="#fbbf24" stroke-width="1.2" opacity="0.5"/>
    <line x1="92" y1="7" x2="92" y2="10" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
    <line x1="92" y1="20" x2="92" y2="23" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
    <line x1="84" y1="15" x2="87" y2="15" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
    <line x1="97" y1="15" x2="100" y2="15" stroke="#fbbf24" stroke-width="0.8" opacity="0.35"/>
    <text x="14" y="38" fill="#2563eb" font-size="13" font-weight="900" font-family="sans-serif" opacity="0.45">18V</text>
    <line x1="35" y1="61" x2="35" y2="73" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="75" y1="61" x2="75" y2="73" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    terminals: [
    { x: 35, y: 73, label: '+' },
    { x: 75, y: 73, label: '−' }
    ]
    }
];

const styles = `
    /* Solar Panel styles - reserved for future migration */
`;

export default { variants, styles };
