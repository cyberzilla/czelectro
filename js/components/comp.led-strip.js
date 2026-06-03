// ═══════════════════════════════════════════════════
// CZElectro — LED Strip RGB Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'led_strip_rgb',
    name: 'LED Strip RGB',
    spec: '3-12V, Built-in Controller',
    category: 'output',
    voltage: 0,
    resistance: 500,
    forwardVoltage: 2.5,
    isDiode: true,
    isBlinkingLed: true,
    blinkHz: 2,
    maxCurrent: 0.06,
    ratedPower: 0.5,
    width: 120, height: 30,
    svg: `<svg width="100%" height="100%" viewBox="0 0 120 30">
    <line x1="0" y1="15" x2="10" y2="15" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="110" y1="15" x2="120" y2="15" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="10" y="4" width="100" height="22" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <rect x="10" y="4" width="100" height="22" rx="4" fill="url(#motorBody)" opacity="0.15"/>
    <line x1="10" y1="9" x2="110" y2="9" stroke="#334155" stroke-width="0.5"/>
    <line x1="10" y1="21" x2="110" y2="21" stroke="#334155" stroke-width="0.5"/>
    <circle class="strip-led strip-led-0" cx="25" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
    <circle class="strip-led strip-led-1" cx="42" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
    <circle class="strip-led strip-led-2" cx="59" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
    <circle class="strip-led strip-led-3" cx="76" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
    <circle class="strip-led strip-led-4" cx="93" cy="15" r="5" fill="#475569" stroke="#6b7280" stroke-width="0.8" style="transition: fill 0.15s, filter 0.15s;"/>
    <text x="28" y="28" fill="#64748b" font-size="5" font-family="monospace" opacity="0.6">R G B  S T R I P</text>
    </svg>`,
    terminals: [
    { x: 0, y: 15, label: '+' },
    { x: 120, y: 15, label: '−' }
    ]
    }
];

const styles = `
    /* LED Strip RGB styles - reserved for future migration */
`;

export default { variants, styles };
