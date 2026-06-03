// ═══════════════════════════════════════════════════
// CZElectro — Battery Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'battery_9v',
    name: 'Baterai 9V',
    spec: '9 Volt DC',
    category: 'source',
    voltage: 9,
    resistance: 0.5, // internal resistance
    internalResistance: 0.5,
    maxCurrent: 0.5,  // 500mA max discharge
    capacityWh: 4.5,
    ratedPower: 4.5,  // 9V battery ~4.5W capacity
    width: 70, height: 110,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 110">
    <rect x="5" y="15" width="60" height="90" rx="8" fill="#1a1a2e" stroke="#333" stroke-width="2"/>
    <rect class="batt-fill" x="7" y="17" width="56" height="86" rx="6" fill="#22c55e" opacity="0.85"/>
    <text x="35" y="65" fill="#fff" font-weight="900" font-size="18" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">9V</text>
    <rect x="15" y="2" width="12" height="13" rx="2" fill="url(#battTop)" stroke="#333"/>
    <rect x="40" y="2" width="18" height="13" rx="2" fill="url(#battTop)" stroke="#333"/>
    </svg>`,
    terminals: [
    { x: 21, y: 0, label: '+' },
    { x: 49, y: 0, label: '−' }
    ]
    },
    {
    id: 'battery_3v',
    name: 'Baterai 3V',
    spec: '3 Volt (2×AA)',
    category: 'source',
    voltage: 3,
    resistance: 0.3,
    internalResistance: 0.3,
    maxCurrent: 1.0,  // 1A max discharge
    capacityWh: 7.5,
    width: 80, height: 50,
    svg: `<svg width="100%" height="100%" viewBox="0 0 80 50">
    <rect x="5" y="10" width="70" height="30" rx="6" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/>
    <rect class="batt-fill" x="7" y="12" width="66" height="26" rx="4" fill="#22c55e" opacity="0.85"/>
    <text x="40" y="30" fill="#fff" font-weight="800" font-size="12" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">3V</text>
    <rect x="0" y="18" width="5" height="14" rx="1" fill="url(#battTop)" stroke="#333"/>
    <rect x="75" y="16" width="5" height="18" rx="1" fill="url(#battTop)" stroke="#333"/>
    </svg>`,
    terminals: [
    { x: 2, y: 25, label: '+' },
    { x: 78, y: 25, label: '−' }
    ]
    },
    {
    id: 'battery_1v5',
    name: 'Baterai 1.5V',
    spec: '1.5 Volt (1×AA)',
    category: 'source',
    voltage: 1.5,
    resistance: 0.5,
    internalResistance: 0.5,
    maxCurrent: 0.8,  // 800mA max discharge
    capacityWh: 3.75,
    width: 60, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 60 40">
    <rect x="5" y="8" width="50" height="24" rx="5" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/>
    <rect class="batt-fill" x="7" y="10" width="46" height="20" rx="3" fill="#22c55e" opacity="0.85"/>
    <text x="30" y="24" fill="#fff" font-weight="800" font-size="10" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">1.5V</text>
    <rect x="0" y="14" width="5" height="12" rx="1" fill="url(#battTop)" stroke="#333"/>
    <rect x="55" y="12" width="5" height="16" rx="1" fill="url(#battTop)" stroke="#333"/>
    </svg>`,
    terminals: [
    { x: 2, y: 20, label: '+' },
    { x: 58, y: 20, label: '−' }
    ]
    },
    {
    id: 'battery_12v',
    name: 'Baterai 12V',
    spec: '12 Volt (A23)',
    category: 'source',
    voltage: 12,
    resistance: 0.08,
    internalResistance: 0.08,
    maxCurrent: 0.3,  // 300mA max discharge
    capacityWh: 1.2,
    width: 50, height: 80,
    svg: `<svg width="100%" height="100%" viewBox="0 0 50 80">
    <rect x="10" y="8" width="30" height="64" rx="5" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/>
    <rect class="batt-fill" x="12" y="10" width="26" height="60" rx="3" fill="#22c55e" opacity="0.85"/>
    <text x="25" y="44" fill="#fff" font-weight="900" font-size="11" text-anchor="middle" font-family="sans-serif" style="text-shadow:0 1px 3px rgba(0,0,0,0.8)">12V</text>
    <rect x="18" y="2" width="14" height="8" rx="2" fill="url(#battTop)" stroke="#333"/>
    <rect x="15" y="72" width="20" height="4" rx="1" fill="#555"/>
    </svg>`,
    terminals: [
    { x: 25, y: 2, label: '+' },
    { x: 25, y: 78, label: '−' }
    ]
    }
];

const styles = `
    /* Battery styles - reserved for future migration */
`;

export default { variants, styles };
