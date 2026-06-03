// ═══════════════════════════════════════════════════
// CZElectro — 7-Segment Display Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'seven_segment',
    name: 'Display 7-Segment',
    nameEn: '7-Segment Display',
    spec: 'Common Cathode, Merah',
    category: 'output',
    voltage: 0,
    resistance: 150,
    is7Segment: true,
    forwardVoltage: 2.0,
    width: 45, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 45 60">
    <!-- Lead wires -->
    <line x1="12" y1="52" x2="12" y2="60" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="33" y1="52" x2="33" y2="60" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Display body -->
    <rect x="3" y="2" width="39" height="50" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <!-- Inner display area -->
    <rect x="7" y="5" width="31" height="44" rx="2" fill="#111827"/>
    <!-- Segment A (top) -->
    <rect class="seg seg-a" x="15" y="8" width="15" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Segment B (top-right) -->
    <rect class="seg seg-b" x="29" y="11" width="3" height="13" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Segment C (bottom-right) -->
    <rect class="seg seg-c" x="29" y="26" width="3" height="13" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Segment D (bottom) -->
    <rect class="seg seg-d" x="15" y="38" width="15" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Segment E (bottom-left) -->
    <rect class="seg seg-e" x="13" y="26" width="3" height="13" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Segment F (top-left) -->
    <rect class="seg seg-f" x="13" y="11" width="3" height="13" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Segment G (middle) -->
    <rect class="seg seg-g" x="15" y="23" width="15" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <!-- Decimal point -->
    <circle class="seg seg-dp" cx="36" cy="40" r="1.5" fill="#374151" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [
    { x: 12, y: 60, label: '+' },
    { x: 33, y: 60, label: '-' }
    ]
    }
];

const styles = `
    /* 7-Segment Display styles - reserved for future migration */
`;

export default { variants, styles };
