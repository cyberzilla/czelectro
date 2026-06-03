// ═══════════════════════════════════════════════════
// CZElectro — Household Appliances Component Module
// All AC-powered home appliances in one group
// ═══════════════════════════════════════════════════

const variants = [
{
    id: 'iron',
    name: 'Setrika',
    spec: '220V AC, 1000W',
    category: 'output',
    voltage: 0,
    resistance: 200,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 1000,  // 1000W real
    glowGradient: 'bulbGlowGrad',
    width: 80, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 55">
    <line x1="15" y1="0" x2="15" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="65" y1="0" x2="65" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M 10 18 L 70 18 L 70 30 Q 70 36, 65 38 L 50 44 L 8 44 Q 4 44, 4 40 L 4 26 Q 4 18, 10 18 Z" fill="#4b5563" stroke="#374151" stroke-width="1.5"/>
    <path class="iron-plate" d="M 6 38 L 50 38 L 65 32 L 68 28 L 68 24 L 10 24 L 6 28 Z" fill="#9ca3af" stroke="#6b7280" stroke-width="0.5" style="transition: fill 0.4s;"/>
    <rect x="20" y="10" width="40" height="10" rx="3" fill="#374151" stroke="#4b5563"/>
    <circle class="iron-indicator" cx="40" cy="15" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
    <text x="14" y="34" fill="#1f2937" font-size="7" font-weight="800" font-family="sans-serif" opacity="0.5">AC</text>
    </svg>`,
    terminals: [
    { x: 15, y: 0, label: 'L' },
    { x: 65, y: 0, label: 'N' }
    ]
    },
    {
    id: 'blender',
    name: 'Blender',
    spec: '220V AC, 350W',
    category: 'output',
    voltage: 0,
    resistance: 250,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 350,  // 350W real
    width: 50, height: 85,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 85">
    <line x1="12" y1="75" x2="12" y2="85" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="38" y1="75" x2="38" y2="85" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="8" y="60" width="34" height="18" rx="4" fill="#374151" stroke="#1e293b" stroke-width="1.5"/>
    <circle class="blender-indicator" cx="25" cy="69" r="4" fill="#6b7280" stroke="#4b5563" style="transition: fill 0.4s;"/>
    <path d="M 14 60 L 10 15 Q 9 5, 18 4 L 32 4 Q 41 5, 40 15 L 36 60 Z" fill="#94a3b8" stroke="#6b7280" stroke-width="1" opacity="0.3"/>
    <path d="M 14 60 L 10 15 Q 9 5, 18 4 L 32 4 Q 41 5, 40 15 L 36 60 Z" fill="none" stroke="#9ca3af" stroke-width="1.5"/>
    <rect x="18" y="0" width="14" height="6" rx="2" fill="#4b5563" stroke="#374151"/>
    <g class="blender-blade" style="transform-origin: 25px 50px;">
    <line x1="18" y1="50" x2="32" y2="50" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
    <line x1="25" y1="43" x2="25" y2="57" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
    </g>
    <text x="14" y="73" fill="#9ca3af" font-size="5" font-weight="800" font-family="sans-serif">AC</text>
    </svg>`,
    terminals: [
    { x: 12, y: 85, label: 'L' },
    { x: 38, y: 85, label: 'N' }
    ]
    },
    {
    id: 'ricecooker',
    name: 'Rice Cooker',
    spec: '220V AC, 400W',
    category: 'output',
    voltage: 0,
    resistance: 220,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 400,  // 400W real
    glowGradient: 'bulbGlowGrad',
    width: 70, height: 65,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 65">
    <line x1="15" y1="55" x2="15" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="55" y1="55" x2="55" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="35" cy="50" rx="30" ry="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <path d="M 5 35 Q 5 52, 35 52 Q 65 52, 65 35 L 65 28 Q 65 18, 35 18 Q 5 18, 5 28 Z" fill="#374151" stroke="#1e293b" stroke-width="1.5"/>
    <ellipse cx="35" cy="18" rx="30" ry="10" fill="#4b5563" stroke="#374151" stroke-width="1.5"/>
    <ellipse cx="35" cy="18" rx="20" ry="6" fill="#334155"/>
    <circle cx="35" cy="17" r="4" fill="#1e293b" stroke="#374151"/>
    <rect x="32" y="8" width="6" height="6" rx="2" fill="#6b7280" stroke="#4b5563"/>
    <circle class="rc-indicator" cx="55" cy="35" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
    <text x="20" y="42" fill="#9ca3af" font-size="6" font-weight="800" font-family="sans-serif" opacity="0.4">AC</text>
    </svg>`,
    terminals: [
    { x: 15, y: 65, label: 'L' },
    { x: 55, y: 65, label: 'N' }
    ]
    },
{
    id: 'fridge',
    name: 'Kulkas',
    spec: '220V AC, 100W',
    category: 'output',
    voltage: 0,
    resistance: 350,
    maxCurrent: 0.3,
    acOnly: true,
    ratedPower: 100,  // 100W real
    width: 55, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 55 90">
    <line x1="15" y1="80" x2="15" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="80" x2="40" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="2" width="45" height="78" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <rect x="8" y="5" width="39" height="25" rx="2" fill="#1e293b" stroke="#334155"/>
    <rect x="8" y="34" width="39" height="43" rx="2" fill="#1e293b" stroke="#334155"/>
    <line x1="8" y1="32" x2="47" y2="32" stroke="#475569" stroke-width="1.5"/>
    <rect x="42" y="12" width="3" height="12" rx="1" fill="#94a3b8"/>
    <rect x="42" y="42" width="3" height="18" rx="1" fill="#94a3b8"/>
    <circle class="fridge-indicator" cx="15" cy="15" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
    <text x="14" y="58" fill="#475569" font-size="7" font-weight="800" font-family="sans-serif" opacity="0.5">AC</text>
    </svg>`,
    terminals: [
    { x: 15, y: 90, label: 'L' },
    { x: 40, y: 90, label: 'N' }
    ]
    },
{
    id: 'ac_05pk',
    name: 'AC 0.5 PK',
    spec: '220V AC, 350W',
    category: 'output',
    voltage: 0,
    resistance: 280,
    maxCurrent: 0.4,
    acOnly: true,
    ratedPower: 350,
    width: 90, height: 45,
    svg: `<svg width="100%" height="100%" viewBox="0 0 90 45">
    <line x1="20" y1="38" x2="20" y2="45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="38" x2="70" y2="45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="3" y="3" width="84" height="35" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="6" y="6" width="78" height="20" rx="3" fill="#f8fafc"/>
    <line x1="10" y1="10" x2="80" y2="10" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="13" x2="80" y2="13" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="16" x2="80" y2="16" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="19" x2="80" y2="19" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="22" x2="80" y2="22" stroke="#cbd5e1" stroke-width="0.8"/>
    <rect x="6" y="28" width="78" height="6" rx="2" fill="#f1f5f9" stroke="#e2e8f0"/>
    <circle class="ac-indicator" cx="75" cy="31" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
    <text x="10" y="33" fill="#94a3b8" font-size="5" font-weight="800" font-family="sans-serif">0.5PK</text>
    <g class="ac-fan" style="transform-origin: 45px 14px;">
    <line x1="38" y1="14" x2="52" y2="14" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
    <line x1="45" y1="8" x2="45" y2="20" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
    </g>
    </svg>`,
    terminals: [
    { x: 20, y: 45, label: 'L' },
    { x: 70, y: 45, label: 'N' }
    ]
    },
    {
    id: 'ac_1pk',
    name: 'AC 1 PK',
    spec: '220V AC, 750W',
    category: 'output',
    voltage: 0,
    resistance: 240,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 750,
    width: 100, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 50">
    <line x1="22" y1="42" x2="22" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="78" y1="42" x2="78" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="3" y="3" width="94" height="40" rx="7" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="6" y="6" width="88" height="24" rx="3" fill="#f8fafc"/>
    <line x1="10" y1="10" x2="90" y2="10" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="13" x2="90" y2="13" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="16" x2="90" y2="16" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="19" x2="90" y2="19" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="22" x2="90" y2="22" stroke="#cbd5e1" stroke-width="0.8"/>
    <line x1="10" y1="25" x2="90" y2="25" stroke="#cbd5e1" stroke-width="0.8"/>
    <rect x="6" y="32" width="88" height="7" rx="2" fill="#f1f5f9" stroke="#e2e8f0"/>
    <circle class="ac-indicator" cx="84" cy="36" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
    <text x="10" y="38" fill="#94a3b8" font-size="6" font-weight="800" font-family="sans-serif">1 PK</text>
    <g class="ac-fan" style="transform-origin: 50px 16px;">
    <line x1="42" y1="16" x2="58" y2="16" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
    <line x1="50" y1="9" x2="50" y2="23" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
    </g>
    </svg>`,
    terminals: [
    { x: 22, y: 50, label: 'L' },
    { x: 78, y: 50, label: 'N' }
    ]
    },
{
    id: 'tv_led',
    name: 'TV LED 32"',
    spec: '220V AC, 80W',
    category: 'output',
    voltage: 0,
    resistance: 300,
    maxCurrent: 0.4,
    acOnly: true,
    ratedPower: 80,
    width: 75, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 75 55">
    <line x1="18" y1="48" x2="18" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="57" y1="48" x2="57" y2="55" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="3" width="65" height="40" rx="3" fill="#111827" stroke="#374151" stroke-width="2"/>
    <rect x="8" y="6" width="59" height="34" rx="1" fill="#1e293b" class="tv-screen"/>
    <rect x="20" y="43" width="35" height="5" rx="1.5" fill="#374151"/>
    <text x="15" y="26" fill="#475569" font-size="8" font-weight="700" font-family="sans-serif">TV 32"</text>
    <circle class="tv-indicator" cx="63" cy="45" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 18, y: 55, label: 'L' },
    { x: 57, y: 55, label: 'N' }
    ]
    },
    {
    id: 'lamp_30w',
    name: 'Lampu LED 30W',
    spec: '220V AC, 30W',
    category: 'output',
    voltage: 0,
    resistance: 400,
    maxCurrent: 0.3,
    acOnly: true,
    ratedPower: 30,
    width: 45, height: 65,
    svg: `<svg width="100%" height="100%" viewBox="0 0 45 65">
    <line x1="13" y1="58" x2="13" y2="65" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="32" y1="58" x2="32" y2="65" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 10 30 Q 10 5, 22.5 5 Q 35 5, 35 30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <ellipse cx="22.5" cy="30" rx="12.5" ry="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
    <rect x="14" y="33" width="17" height="8" rx="2" fill="#94a3b8"/>
    <line x1="14" y1="35" x2="31" y2="35" stroke="#78716c" stroke-width="0.5"/>
    <line x1="14" y1="37" x2="31" y2="37" stroke="#78716c" stroke-width="0.5"/>
    <line x1="14" y1="39" x2="31" y2="39" stroke="#78716c" stroke-width="0.5"/>
    <rect x="17" y="41" width="11" height="4" rx="1" fill="#6b7280"/>
    <line x1="17" y1="45" x2="13" y2="58" stroke="#94a3b8" stroke-width="2"/>
    <line x1="28" y1="45" x2="32" y2="58" stroke="#94a3b8" stroke-width="2"/>
    <text x="11" y="52" fill="#9ca3af" font-size="5" font-weight="700" font-family="sans-serif">30W</text>
    <circle class="lamp-glow" cx="22.5" cy="18" r="8" fill="none" opacity="0"/>
    </svg>`,
    terminals: [
    { x: 13, y: 65, label: 'L' },
    { x: 32, y: 65, label: 'N' }
    ]
    },
    {
    id: 'computer',
    name: 'Komputer',
    spec: '220V AC, 300W',
    category: 'output',
    voltage: 0,
    resistance: 260,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 300,
    width: 70, height: 65,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 65">
    <line x1="15" y1="58" x2="15" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="55" y1="58" x2="55" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="5" y="3" width="60" height="36" rx="3" fill="#111827" stroke="#374151" stroke-width="1.5"/>
    <rect x="8" y="6" width="54" height="30" rx="1" fill="#1e293b" class="pc-screen"/>
    <rect x="24" y="39" width="22" height="3" rx="1" fill="#374151"/>
    <rect x="18" y="42" width="34" height="3" rx="1" fill="#4b5563"/>
    <rect x="50" y="47" width="15" height="12" rx="2" fill="#1f2937" stroke="#374151" stroke-width="1"/>
    <circle cx="57.5" cy="50" r="1.5" fill="#22c55e" opacity="0.4" class="pc-power"/>
    <rect x="51" y="55" width="3" height="1" rx="0.5" fill="#6b7280"/>
    <rect x="55" y="55" width="3" height="1" rx="0.5" fill="#6b7280"/>
    <rect x="59" y="55" width="3" height="1" rx="0.5" fill="#6b7280"/>
    <text x="14" y="24" fill="#475569" font-size="7" font-weight="700" font-family="sans-serif">PC</text>
    <circle class="pc-indicator" cx="62" cy="41" r="2" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 15, y: 65, label: 'L' },
    { x: 55, y: 65, label: 'N' }
    ]
    },
{
    id: 'pump_125',
    name: 'Pompa Air 125W',
    spec: '220V AC, 125W',
    category: 'output',
    voltage: 0,
    resistance: 320,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 125,
    width: 75, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 75 60">
    <line x1="15" y1="53" x2="15" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="53" x2="60" y2="60" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="8" y="15" width="50" height="38" rx="5" fill="#1e40af" stroke="#2563eb" stroke-width="1.5"/>
    <circle cx="33" cy="34" r="14" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
    <g class="pump-impeller" style="transform-origin: 33px 34px;">
    <line x1="33" y1="22" x2="33" y2="46" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <line x1="21" y1="34" x2="45" y2="34" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <line x1="24" y1="25" x2="42" y2="43" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="42" y1="25" x2="24" y2="43" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <rect x="58" y="25" width="14" height="8" rx="2" fill="#3b82f6"/>
    <rect x="66" y="22" width="6" height="14" rx="2" fill="#2563eb" stroke="#1e40af" stroke-width="0.5"/>
    <circle cx="69" cy="29" r="2.5" fill="#111827"/>
    <text x="10" y="12" fill="#60a5fa" font-size="6" font-weight="800" font-family="sans-serif">125W</text>
    <circle class="pump-indicator" cx="52" cy="20" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 15, y: 60, label: 'L' },
    { x: 60, y: 60, label: 'N' }
    ]
    },
    {
    id: 'pump_250',
    name: 'Pompa Air 250W',
    spec: '220V AC, 250W',
    category: 'output',
    voltage: 0,
    resistance: 270,
    maxCurrent: 0.5,
    acOnly: true,
    ratedPower: 250,
    width: 85, height: 65,
    svg: `<svg width="100%" height="100%" viewBox="0 0 85 65">
    <line x1="18" y1="58" x2="18" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="67" y1="58" x2="67" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="8" y="15" width="58" height="43" rx="6" fill="#1e3a5f" stroke="#2563eb" stroke-width="2"/>
    <circle cx="37" cy="37" r="16" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
    <g class="pump-impeller" style="transform-origin: 37px 37px;">
    <line x1="37" y1="23" x2="37" y2="51" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="23" y1="37" x2="51" y2="37" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="27" y1="27" x2="47" y2="47" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    <line x1="47" y1="27" x2="27" y2="47" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
    </g>
    <rect x="66" y="27" width="16" height="10" rx="3" fill="#3b82f6"/>
    <rect x="75" y="23" width="8" height="18" rx="3" fill="#2563eb" stroke="#1e40af" stroke-width="0.5"/>
    <circle cx="79" cy="32" r="3" fill="#111827"/>
    <text x="10" y="12" fill="#60a5fa" font-size="7" font-weight="800" font-family="sans-serif">250W</text>
    <circle class="pump-indicator" cx="60" cy="20" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
    </svg>`,
    terminals: [
    { x: 18, y: 65, label: 'L' },
    { x: 67, y: 65, label: 'N' }
    ]
    }
];

const styles = `
    /* Household Appliances styles - reserved for future migration */
`;

export default { variants, styles };
