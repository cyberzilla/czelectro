// ═══════════════════════════════════════════════════
// CZElectro — MCB Circuit Breaker Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'mcb_4a',
    name: 'MCB 4A (900VA)',
    nameEn: 'MCB 4A (900VA)',
    spec: '4A, 230V AC, 900VA',
    category: 'passive',
    voltage: 0, resistance: 0.01, maxCurrent: 4, isMCB: true,
    width: 50, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
    <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
    <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
    <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
    <text x="25" y="18" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">900VA</text>
    <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">4A</text>
    <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [{ x: 25, y: 0, label: 'LINE' }, { x: 25, y: 90, label: 'LOAD' }]
    },
    {
    id: 'mcb_6a',
    name: 'MCB 6A (1300VA)',
    nameEn: 'MCB 6A (1300VA)',
    spec: '6A, 230V AC, 1300VA',
    category: 'passive',
    voltage: 0, resistance: 0.01, maxCurrent: 6, isMCB: true,
    width: 50, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
    <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
    <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
    <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
    <text x="25" y="18" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">1300VA</text>
    <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">6A</text>
    <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [{ x: 25, y: 0, label: 'LINE' }, { x: 25, y: 90, label: 'LOAD' }]
    },
    {
    id: 'mcb_10a',
    name: 'MCB 10A (2200VA)',
    nameEn: 'MCB 10A (2200VA)',
    spec: '10A, 230V AC, 2200VA',
    category: 'passive',
    voltage: 0, resistance: 0.01, maxCurrent: 10, isMCB: true,
    width: 50, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
    <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
    <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
    <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
    <text x="25" y="18" fill="#94a3b8" font-size="5" font-weight="700" text-anchor="middle" font-family="monospace">2200VA</text>
    <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">10A</text>
    <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [{ x: 25, y: 0, label: 'LINE' }, { x: 25, y: 90, label: 'LOAD' }]
    },
    {
    id: 'mcb_16a',
    name: 'MCB 16A',
    nameEn: 'MCB 16A',
    spec: '16A, 230V AC',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    maxCurrent: 16,
    isMCB: true,
    width: 50, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
    <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
    <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
    <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
    <text x="25" y="20" fill="#94a3b8" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">MCB</text>
    <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">16A</text>
    <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'LINE' },
    { x: 25, y: 90, label: 'LOAD' }
    ]
    },
    {
    id: 'mcb_32a',
    name: 'MCB 32A',
    nameEn: 'MCB 32A',
    spec: '32A, 230V AC',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    maxCurrent: 32,
    isMCB: true,
    width: 50, height: 90,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 90">
    <rect x="5" y="5" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="5" y="5" width="40" height="80" rx="4" fill="url(#motorBody)" opacity="0.2"/>
    <line x1="25" y1="0" x2="25" y2="10" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="80" x2="25" y2="90" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect class="mcb-toggle" x="14" y="25" width="22" height="30" rx="3" fill="#22c55e" stroke="#15803d" stroke-width="1.5" style="transition: fill 0.3s, y 0.3s;"/>
    <text class="mcb-label" x="25" y="44" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">ON</text>
    <text x="25" y="20" fill="#94a3b8" font-size="6" font-weight="700" text-anchor="middle" font-family="monospace">MCB</text>
    <text x="25" y="75" fill="#f59e0b" font-size="7" font-weight="800" text-anchor="middle" font-family="monospace">32A</text>
    <circle class="mcb-indicator" cx="25" cy="63" r="3" fill="#22c55e" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [
    { x: 25, y: 0, label: 'LINE' },
    { x: 25, y: 90, label: 'LOAD' }
    ]
    }
];

const styles = `
    /* MCB Circuit Breaker styles - reserved for future migration */
`;

export default { variants, styles };
