// ═══════════════════════════════════════════════════
// CZElectro — Arduino Uno Component Module
// Realistic pin layout matching actual Arduino Uno R3
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'arduino_uno',
    name: 'Arduino Uno',
    nameEn: 'Arduino Uno',
    spec: 'ATmega328P, 5V, 14 Digital + 6 Analog',
    category: 'passive',
    voltage: 0,
    resistance: 100,
    isArduino: true,
    width: 210, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 210 70">
    <!-- PCB Board -->
    <rect x="5" y="8" width="200" height="54" rx="3" fill="#0f3042" stroke="#0e7490" stroke-width="1.5"/>
    <!-- USB Connector -->
    <rect x="0" y="24" width="12" height="16" rx="1.5" fill="#374151" stroke="#6b7280" stroke-width="1"/>
    <rect x="1" y="26" width="8" height="12" rx="0.5" fill="#1f2937"/>
    <!-- DC Barrel Jack -->
    <rect x="0" y="46" width="10" height="10" rx="1" fill="#1f2937" stroke="#4b5563" stroke-width="0.8"/>
    <circle cx="5" cy="51" r="2.5" fill="#374151" stroke="#6b7280" stroke-width="0.5"/>

    <!-- ═══ Pin Headers — Top (Digital D2-D13) ═══ -->
    <line x1="22" y1="8" x2="22" y2="0" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="38" y1="8" x2="38" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="54" y1="8" x2="54" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="70" y1="8" x2="70" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="86" y1="8" x2="86" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="102" y1="8" x2="102" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="118" y1="8" x2="118" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="134" y1="8" x2="134" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="150" y1="8" x2="150" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="166" y1="8" x2="166" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="182" y1="8" x2="182" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="198" y1="8" x2="198" y2="0" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>

    <!-- Pin pad squares (top) -->
    <rect x="20" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="36" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="52" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="68" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="84" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="100" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="116" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="132" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="148" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="164" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="180" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="196" y="8" width="4" height="3" rx="0.5" fill="#d4af37"/>

    <!-- ═══ Pin Headers — Bottom (Power + Analog) ═══ -->
    <line x1="22" y1="62" x2="22" y2="70" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="42" y1="62" x2="42" y2="70" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="62" y1="62" x2="62" y2="70" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="82" y1="62" x2="82" y2="70" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="110" y1="62" x2="110" y2="70" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="130" y1="62" x2="130" y2="70" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="150" y1="62" x2="150" y2="70" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="170" y1="62" x2="170" y2="70" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="190" y1="62" x2="190" y2="70" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="198" y1="62" x2="198" y2="70" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round"/>

    <!-- Pin pad squares (bottom) -->
    <rect x="20" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="40" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="60" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="80" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="108" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="128" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="148" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="168" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="188" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="196" y="59" width="4" height="3" rx="0.5" fill="#d4af37"/>

    <!-- MCU chip -->
    <rect x="68" y="24" width="36" height="20" rx="2" fill="#111827" stroke="#374151" stroke-width="1"/>
    <circle cx="73" cy="29" r="1.5" fill="#475569"/>
    <!-- Chip legs -->
    <line x1="72" y1="44" x2="72" y2="47" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="78" y1="44" x2="78" y2="47" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="84" y1="44" x2="84" y2="47" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="90" y1="44" x2="90" y2="47" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="96" y1="44" x2="96" y2="47" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="72" y1="24" x2="72" y2="21" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="78" y1="24" x2="78" y2="21" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="84" y1="24" x2="84" y2="21" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="90" y1="24" x2="90" y2="21" stroke="#94a3b8" stroke-width="0.8"/>
    <line x1="96" y1="24" x2="96" y2="21" stroke="#94a3b8" stroke-width="0.8"/>

    <!-- Crystal oscillator -->
    <rect x="110" y="28" width="8" height="12" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="0.6"/>
    <text x="114" y="36" fill="#475569" font-size="3" font-family="monospace" text-anchor="middle">16M</text>

    <!-- Reset button -->
    <rect x="45" y="30" width="8" height="8" rx="1" fill="#374151" stroke="#6b7280" stroke-width="0.6"/>
    <circle cx="49" cy="34" r="2" fill="#64748b"/>

    <!-- Power LED indicator -->
    <circle class="arduino-indicator" cx="180" cy="18" r="3" fill="#6b7280" style="transition: fill 0.4s;"/>
    <!-- TX/RX LEDs -->
    <circle cx="170" cy="18" r="1.5" fill="#1e3a1e" opacity="0.6"/>
    <circle cx="164" cy="18" r="1.5" fill="#1e3a1e" opacity="0.6"/>
    <text x="170" y="23" fill="#475569" font-size="2.5" font-family="monospace" text-anchor="middle">TX</text>
    <text x="164" y="23" fill="#475569" font-size="2.5" font-family="monospace" text-anchor="middle">RX</text>

    <!-- Board label -->
    <text x="145" y="42" fill="#0e7490" font-size="5.5" font-family="monospace" text-anchor="middle" font-weight="bold">ARDUINO UNO</text>
    <text x="145" y="48" fill="#065666" font-size="3" font-family="monospace" text-anchor="middle">ATmega328P</text>

    <!-- ═══ Pin Labels ═══ -->
    <!-- Top: Digital pins (right to left: D13..D2) -->
    <text x="22" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D13</text>
    <text x="38" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D12</text>
    <text x="54" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D11</text>
    <text x="70" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D10</text>
    <text x="86" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D9</text>
    <text x="102" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D8</text>
    <text x="118" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D7</text>
    <text x="134" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D6</text>
    <text x="150" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D5</text>
    <text x="166" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D4</text>
    <text x="182" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D3</text>
    <text x="198" y="16" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">D2</text>

    <!-- PWM indicators (~) -->
    <text x="57" y="13" fill="#a78bfa" font-size="3" font-family="monospace">~</text>
    <text x="73" y="13" fill="#a78bfa" font-size="3" font-family="monospace">~</text>
    <text x="89" y="13" fill="#a78bfa" font-size="3" font-family="monospace">~</text>
    <text x="137" y="13" fill="#a78bfa" font-size="3" font-family="monospace">~</text>
    <text x="153" y="13" fill="#a78bfa" font-size="3" font-family="monospace">~</text>
    <text x="185" y="13" fill="#a78bfa" font-size="3" font-family="monospace">~</text>

    <!-- Bottom: Power + Analog -->
    <text x="22" y="57" fill="#64748b" font-size="3.2" font-family="monospace" text-anchor="middle">VIN</text>
    <text x="42" y="57" fill="#22c55e" font-size="3.2" font-family="monospace" text-anchor="middle">GND</text>
    <text x="62" y="57" fill="#ef4444" font-size="3.2" font-family="monospace" text-anchor="middle">5V</text>
    <text x="82" y="57" fill="#f59e0b" font-size="3.2" font-family="monospace" text-anchor="middle">3V3</text>
    <text x="110" y="57" fill="#60a5fa" font-size="3.2" font-family="monospace" text-anchor="middle">A0</text>
    <text x="130" y="57" fill="#60a5fa" font-size="3.2" font-family="monospace" text-anchor="middle">A1</text>
    <text x="150" y="57" fill="#60a5fa" font-size="3.2" font-family="monospace" text-anchor="middle">A2</text>
    <text x="170" y="57" fill="#60a5fa" font-size="3.2" font-family="monospace" text-anchor="middle">A3</text>
    <text x="190" y="57" fill="#60a5fa" font-size="3.2" font-family="monospace" text-anchor="middle">A4</text>
    <text x="198" y="57" fill="#22c55e" font-size="3.2" font-family="monospace" text-anchor="middle">GND</text>
    </svg>`,
    // Terminal indices:
    //  0-11: Digital D13,D12,D11,D10,D9,D8,D7,D6,D5,D4,D3,D2 (top row, left→right)
    // 12-15: VIN, GND, 5V, 3V3 (bottom left)
    // 16-20: A0-A4 (bottom right)
    //    21: GND2 (bottom far right)
    terminals: [
    // ── Top row: Digital pins ──
    { x: 22,  y: 0,  label: 'D13' },  //  0
    { x: 38,  y: 0,  label: 'D12' },  //  1
    { x: 54,  y: 0,  label: 'D11' },  //  2  (PWM)
    { x: 70,  y: 0,  label: 'D10' },  //  3  (PWM)
    { x: 86,  y: 0,  label: 'D9' },   //  4  (PWM)
    { x: 102, y: 0,  label: 'D8' },   //  5
    { x: 118, y: 0,  label: 'D7' },   //  6
    { x: 134, y: 0,  label: 'D6' },   //  7  (PWM)
    { x: 150, y: 0,  label: 'D5' },   //  8  (PWM)
    { x: 166, y: 0,  label: 'D4' },   //  9
    { x: 182, y: 0,  label: 'D3' },   // 10  (PWM)
    { x: 198, y: 0,  label: 'D2' },   // 11
    // ── Bottom row: Power ──
    { x: 22,  y: 70, label: 'VIN' },  // 12
    { x: 42,  y: 70, label: 'GND' },  // 13
    { x: 62,  y: 70, label: '5V' },   // 14
    { x: 82,  y: 70, label: '3V3' },  // 15
    // ── Bottom row: Analog ──
    { x: 110, y: 70, label: 'A0' },   // 16
    { x: 130, y: 70, label: 'A1' },   // 17
    { x: 150, y: 70, label: 'A2' },   // 18
    { x: 170, y: 70, label: 'A3' },   // 19
    { x: 190, y: 70, label: 'A4' },   // 20
    { x: 198, y: 70, label: 'GND2' }  // 21
    ]
    }
];

const styles = `
    /* Arduino styles - reserved for future migration */
`;

export default { variants, styles };
