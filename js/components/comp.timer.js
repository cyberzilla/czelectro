// ═══════════════════════════════════════════════════
// CZElectro — Timer 555 Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'timer_555',
    name: 'Timer 555',
    spec: 'Astable ~1Hz',
    category: 'passive',
    voltage: 0,
    resistance: 0.01,
    isTimer: true,
    timerHz: 1,
    maxCurrent: 0.5,
    width: 80, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 50">
    <line x1="0" y1="25" x2="10" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="25" x2="80" y2="25" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="10" y="5" width="60" height="40" rx="3" fill="#1a1a2e" stroke="#374151" stroke-width="1.5"/>
    <rect x="10" y="5" width="60" height="40" rx="3" fill="url(#motorBody)" opacity="0.3"/>
    <circle cx="18" cy="12" r="3" fill="none" stroke="#6b7280" stroke-width="0.8"/>
    <rect x="15" y="20" width="50" height="2" rx="1" fill="#374151"/>
    <rect x="15" y="28" width="50" height="2" rx="1" fill="#374151"/>
    <circle cx="18" cy="25" r="2" fill="#94a3b8"/>
    <circle cx="28" cy="25" r="2" fill="#94a3b8"/>
    <circle cx="38" cy="25" r="2" fill="#94a3b8"/>
    <circle cx="48" cy="25" r="2" fill="#94a3b8"/>
    <circle cx="58" cy="25" r="2" fill="#94a3b8"/>
    <text x="25" y="16" fill="#a78bfa" font-size="9" font-weight="900" font-family="monospace">555</text>
    <circle class="timer-indicator" cx="62" cy="12" r="3" fill="#6b7280" style="transition: fill 0.15s;"/>
    <polyline class="timer-wave" points="20,38 24,38 24,34 28,34 28,38 32,38 32,34 36,34 36,38 40,38 40,34 44,34 44,38" fill="none" stroke="#4ade80" stroke-width="1" opacity="0.4"/>
    </svg>`,
    terminals: [
    { x: 0, y: 25, label: 'IN' },
    { x: 80, y: 25, label: 'OUT' }
    ]
    }
];

const styles = `
    /* Timer 555 styles - reserved for future migration */
`;

export default { variants, styles };
