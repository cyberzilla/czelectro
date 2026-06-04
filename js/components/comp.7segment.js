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
    },
    {
    id: 'seven_segment_clock',
    name: 'Display Jam 7-Segment',
    nameEn: '7-Segment Clock Display',
    spec: '4-Digit, Common Cathode, Merah',
    category: 'output',
    voltage: 0,
    resistance: 150,
    is7Segment: true,
    is7SegmentClock: true,
    forwardVoltage: 2.0,
    width: 110, height: 60,
    svg: `<svg width="100%" height="100%" viewBox="0 0 110 60">
    <!-- Lead wires -->
    <line x1="35" y1="52" x2="35" y2="60" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="75" y1="52" x2="75" y2="60" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Display body -->
    <rect x="3" y="2" width="104" height="50" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <!-- Inner display area -->
    <rect x="6" y="5" width="98" height="44" rx="2" fill="#111827"/>

    <!-- Digit 0 (tens of hours) — x: 15..31 -->
    <rect class="seg d0-a" x="17" y="8" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d0-b" x="28" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d0-c" x="28" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d0-d" x="17" y="35" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d0-e" x="15" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d0-f" x="15" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d0-g" x="17" y="22" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>

    <!-- Digit 1 (units of hours) — x: 34..50 -->
    <rect class="seg d1-a" x="36" y="8" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d1-b" x="47" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d1-c" x="47" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d1-d" x="36" y="35" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d1-e" x="34" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d1-f" x="34" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d1-g" x="36" y="22" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>

    <!-- Colon (two dots) — center at x=55 -->
    <circle class="seg colon-top" cx="55" cy="18" r="2" fill="#374151" style="transition: fill 0.3s;"/>
    <circle class="seg colon-bot" cx="55" cy="32" r="2" fill="#374151" style="transition: fill 0.3s;"/>

    <!-- Digit 2 (tens of minutes) — x: 60..76 -->
    <rect class="seg d2-a" x="62" y="8" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d2-b" x="73" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d2-c" x="73" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d2-d" x="62" y="35" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d2-e" x="60" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d2-f" x="60" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d2-g" x="62" y="22" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>

    <!-- Digit 3 (units of minutes) — x: 79..95 -->
    <rect class="seg d3-a" x="81" y="8" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d3-b" x="92" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d3-c" x="92" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d3-d" x="81" y="35" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d3-e" x="79" y="24" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d3-f" x="79" y="11" width="3" height="11" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    <rect class="seg d3-g" x="81" y="22" width="12" height="3" rx="1" fill="#374151" style="transition: fill 0.3s;"/>
    </svg>`,
    terminals: [
    { x: 35, y: 60, label: '+' },
    { x: 75, y: 60, label: '-' }
    ]
    }
];

const styles = `
    /* 7-Segment Display styles - reserved for future migration */
`;

export default { variants, styles };
