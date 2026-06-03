// ═══════════════════════════════════════════════════
// CZElectro — ATS Auto Transfer Switch Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'ats_switch',
    name: 'ATS (Auto Switch)',
    nameEn: 'ATS Auto Transfer',
    spec: 'Auto PLN↔PLTS, 220V',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    isATS: true,
    width: 100, height: 110,
    svg: `<svg width="100%" height="100%" viewBox="0 0 100 110">
    <rect x="5" y="15" width="90" height="80" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
    <rect x="5" y="15" width="90" height="80" rx="6" fill="url(#motorBody)" opacity="0.15"/>
    <!-- Input PLN (kiri atas) -->
    <line x1="25" y1="0" x2="25" y2="20" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <text x="25" y="30" fill="#f59e0b" font-size="6" font-weight="800" text-anchor="middle" font-family="monospace">PLN</text>
    <!-- Input PLTS (kanan atas) -->
    <line x1="75" y1="0" x2="75" y2="20" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <text x="75" y="30" fill="#3b82f6" font-size="6" font-weight="800" text-anchor="middle" font-family="monospace">PLTS</text>
    <!-- Output LOAD (bawah tengah) -->
    <line x1="50" y1="90" x2="50" y2="110" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
    <text x="50" y="88" fill="#64748b" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">LOAD</text>
    <!-- Title -->
    <text x="50" y="44" fill="#94a3b8" font-size="7" font-weight="900" text-anchor="middle" font-family="sans-serif">ATS</text>
    <!-- Switch arm visual -->
    <circle cx="50" cy="58" r="4" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <line class="ats-arm" x1="50" y1="58" x2="30" y2="38" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" style="transition: all 0.5s ease;"/>
    <!-- PLN indicator -->
    <circle class="ats-pln-led" cx="18" cy="76" r="3" fill="#475569" style="transition: fill 0.3s;"/>
    <text x="28" y="79" fill="#64748b" font-size="5" font-weight="600" font-family="monospace">PLN</text>
    <!-- PLTS indicator -->
    <circle class="ats-plts-led" cx="62" cy="76" r="3" fill="#475569" style="transition: fill 0.3s;"/>
    <text x="72" y="79" fill="#64748b" font-size="5" font-weight="600" font-family="monospace">PLTS</text>
    <!-- Source label (dynamic) -->
    <text class="ats-source-label" x="50" y="70" fill="#22c55e" font-size="6" font-weight="900" text-anchor="middle" font-family="monospace">---</text>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'PLN' },
    { x: 75, y: 0, label: 'PLTS' },
    { x: 50, y: 110, label: 'LOAD' }
    ]
    }
];

const styles = `
    /* ATS Auto Transfer Switch styles - reserved for future migration */
`;

export default { variants, styles };
