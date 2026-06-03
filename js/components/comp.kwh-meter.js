// ═══════════════════════════════════════════════════
// CZElectro — kWh Meter Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'kwh_meter',
    name: 'Meteran Listrik',
    nameEn: 'kWh Meter',
    spec: '1P, 230V, 40A',
    category: 'passive',
    voltage: 0,
    resistance: 0.05,
    isKwhMeter: true,
    maxCurrent: 40,
    width: 80, height: 100,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 100">
    <rect x="4" y="4" width="72" height="92" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="4" y="4" width="72" height="92" rx="6" fill="url(#motorBody)" opacity="0.15"/>
    <line x1="25" y1="0" x2="25" y2="8" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="55" y1="0" x2="55" y2="8" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="92" x2="25" y2="100" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="55" y1="92" x2="55" y2="100" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round"/>
    <text x="40" y="16" fill="#64748b" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">kWh METER</text>
    <rect x="10" y="20" width="60" height="26" rx="3" fill="#0a0a1a" stroke="#1e3a5f" stroke-width="0.8"/>
    <text x="40" y="28" fill="#4ade80" font-size="6" font-weight="700" text-anchor="middle" font-family="sans-serif" opacity="0.7">kWh</text>
    <text class="kwh-reading" x="40" y="42" fill="#22c55e" font-size="14" font-weight="900" text-anchor="middle" font-family="'JetBrains Mono','Cascadia Code',monospace">000.00</text>
    <rect x="14" y="50" width="52" height="26" rx="3" fill="#111827" stroke="#1e293b" stroke-width="0.8"/>
    <circle class="meter-disc-bg" cx="40" cy="63" r="10" fill="#1a1a2e" stroke="#374151" stroke-width="1"/>
    <g class="meter-disc-group">
    <circle class="meter-disc" cx="40" cy="63" r="8" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line class="meter-disc-mark" x1="40" y1="55" x2="40" y2="59" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
    </g>
    <text class="meter-watt" x="40" y="86" fill="#f59e0b" font-size="9" font-weight="800" text-anchor="middle" font-family="'JetBrains Mono',monospace">0W</text>
    <circle class="meter-led" cx="65" cy="86" r="2.5" fill="#475569" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'LINE' },
    { x: 25, y: 100, label: 'LOAD' }
    ]
    }
];

const styles = `
    /* kWh Meter styles - reserved for future migration */
`;

export default { variants, styles };
