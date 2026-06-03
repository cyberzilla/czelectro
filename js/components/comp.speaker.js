// ═══════════════════════════════════════════════════
// CZElectro — Speaker Component Module
// ═══════════════════════════════════════════════════

const variants = [
    {
    id: 'speaker',
    name: 'Speaker',
    spec: '8Ω 0.5W',
    category: 'output',
    voltage: 0,
    resistance: 8,
    maxCurrent: 0.25,
    width: 70, height: 70,
    svg: `<svg width="100%" height="100%" viewBox="0 0 70 70">
    <circle cx="35" cy="35" r="30" fill="#1f2937" stroke="#374151" stroke-width="2"/>
    <circle cx="35" cy="35" r="22" fill="#111827" stroke="#4b5563"/>
    <circle class="speaker-cone" cx="35" cy="35" r="14" fill="none" stroke="#6b7280" stroke-width="0.5"/>
    <circle class="speaker-cone" cx="35" cy="35" r="8" fill="none" stroke="#6b7280" stroke-width="0.5"/>
    <circle cx="35" cy="35" r="3" fill="#d4af37" stroke="#92400e"/>
    <path class="speaker-wave sw1" d="M 60 25 Q 65 35, 60 45" fill="none" stroke="rgba(74,222,128,0)" stroke-width="1.5" stroke-linecap="round"/>
    <path class="speaker-wave sw2" d="M 64 20 Q 70 35, 64 50" fill="none" stroke="rgba(74,222,128,0)" stroke-width="1.2" stroke-linecap="round"/>
    <text x="35" y="62" fill="#9ca3af" font-size="7" text-anchor="middle" font-family="sans-serif">8Ω</text>
    </svg>`,
    terminals: [
    { x: 5, y: 60, label: '+' },
    { x: 65, y: 60, label: '−' }
    ]
    }
];

const styles = `
    /* Speaker styles - reserved for future migration */
`;

export default { variants, styles };
