// ═══════════════════════════════════════════════════
// CZElectro — Crystal Oscillator Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'crystal_16m',
    name: 'Kristal 16MHz',
    nameEn: 'Crystal 16MHz',
    spec: '16MHz HC-49S',
    category: 'passive',
    voltage: 0,
    resistance: 50,
    isCrystal: true,
    frequency: 16000000,
    width: 35, height: 40,
    svg: `<svg width="100%" height="100%" viewBox="0 0 35 40">
    <!-- Top lead -->
    <line x1="17" y1="0" x2="17" y2="9" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Bottom lead -->
    <line x1="17" y1="31" x2="17" y2="40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <!-- Top plate -->
    <line x1="7" y1="9" x2="27" y2="9" stroke="#64748b" stroke-width="2"/>
    <!-- Bottom plate -->
    <line x1="7" y1="31" x2="27" y2="31" stroke="#64748b" stroke-width="2"/>
    <!-- Crystal body (rectangle between plates) -->
    <rect x="10" y="13" width="14" height="14" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
    <!-- Crystal label -->
    <text x="17" y="23" fill="#94a3b8" font-size="5" font-family="monospace" text-anchor="middle">Y</text>
    </svg>`,
    terminals: [
    { x: 17, y: 0, label: '1' },
    { x: 17, y: 40, label: '2' }
    ]
    }
];

const styles = `
    /* Crystal styles - reserved for future migration */
`;

export default { variants, styles };
