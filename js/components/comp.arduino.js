// ═══════════════════════════════════════════════════
// CZElectro — Arduino Uno Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'arduino_uno',
    name: 'Arduino Uno',
    nameEn: 'Arduino Uno',
    spec: 'ATmega328P, 5V',
    category: 'passive',
    voltage: 5,
    resistance: 100,
    isArduino: true,
    width: 80, height: 55,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 55">
    <!-- PCB Board -->
    <rect x="4" y="6" width="72" height="43" rx="3" fill="#0f3042" stroke="#0e7490" stroke-width="1.5"/>
    <!-- USB Connector -->
    <rect x="0" y="18" width="10" height="14" rx="1" fill="#374151" stroke="#6b7280" stroke-width="1"/>
    <rect x="1" y="20" width="6" height="10" rx="0.5" fill="#1f2937"/>
    <!-- Pin headers top -->
    <line x1="10" y1="6" x2="10" y2="0" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <line x1="30" y1="6" x2="30" y2="0" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
    <line x1="50" y1="6" x2="50" y2="0" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
    <line x1="70" y1="6" x2="70" y2="0" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <!-- Pin headers bottom -->
    <line x1="10" y1="49" x2="10" y2="55" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <line x1="30" y1="49" x2="30" y2="55" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <line x1="50" y1="49" x2="50" y2="55" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
    <line x1="70" y1="49" x2="70" y2="55" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <!-- Pin pad squares (top) -->
    <rect x="8" y="6" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="28" y="6" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="48" y="6" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="68" y="6" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <!-- Pin pad squares (bottom) -->
    <rect x="8" y="46" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="28" y="46" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="48" y="46" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <rect x="68" y="46" width="4" height="3" rx="0.5" fill="#d4af37"/>
    <!-- MCU chip -->
    <rect x="28" y="18" width="24" height="16" rx="2" fill="#111827" stroke="#374151" stroke-width="1"/>
    <circle cx="32" cy="22" r="1.5" fill="#475569"/>
    <!-- Power LED indicator -->
    <circle class="arduino-indicator" cx="66" cy="14" r="2.5" fill="#6b7280" style="transition: fill 0.4s;"/>
    <!-- Board label -->
    <text x="40" y="42" fill="#0e7490" font-size="5" font-family="monospace" text-anchor="middle" font-weight="bold">ARDUINO UNO</text>
    <!-- Pin labels top -->
    <text x="10" y="14" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">VIN</text>
    <text x="30" y="14" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">5V</text>
    <text x="50" y="14" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">GND</text>
    <text x="70" y="14" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">D13</text>
    <!-- Pin labels bottom -->
    <text x="10" y="44" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">A0</text>
    <text x="30" y="44" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">A1</text>
    <text x="50" y="44" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">GND</text>
    <text x="70" y="44" fill="#64748b" font-size="3.5" font-family="monospace" text-anchor="middle">3V3</text>
    </svg>`,
    terminals: [
    { x: 10, y: 0, label: 'VIN' },
    { x: 30, y: 0, label: '5V' },
    { x: 50, y: 0, label: 'GND' },
    { x: 70, y: 0, label: 'D13' },
    { x: 10, y: 55, label: 'A0' },
    { x: 30, y: 55, label: 'A1' },
    { x: 50, y: 55, label: 'GND2' },
    { x: 70, y: 55, label: '3V3' }
    ]
    }
];

const styles = `
    /* Arduino styles - reserved for future migration */
`;

export default { variants, styles };
