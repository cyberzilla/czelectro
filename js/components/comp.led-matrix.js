// ═══════════════════════════════════════════════════
// CZElectro — LED Dot Matrix Display Component
// 32×8 LED matrix (256 dots) — like mosque running text
// ═══════════════════════════════════════════════════

// Generate 32×8 dot grid SVG
function buildMatrixSVG() {
    const COLS = 32, ROWS = 8;
    const DOT_R = 1.3;
    const SPACING = 4.5;
    const PAD_X = 12, PAD_Y = 10;
    const W = PAD_X * 2 + (COLS - 1) * SPACING + DOT_R * 2;
    const H = PAD_Y * 2 + (ROWS - 1) * SPACING + DOT_R * 2;

    let dots = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cx = PAD_X + c * SPACING;
            const cy = PAD_Y + r * SPACING;
            dots += `<circle class="mdot mdot-${c}-${r}" cx="${cx}" cy="${cy}" r="${DOT_R}" fill="#1a2332" style="transition:fill 0.15s;"/>`;
        }
    }

    return `<svg width="100%" height="100%" viewBox="0 0 ${Math.ceil(W)} ${Math.ceil(H)}">
    <!-- Lead wires -->
    <line x1="${Math.ceil(W * 0.3)}" y1="${Math.ceil(H) - 2}" x2="${Math.ceil(W * 0.3)}" y2="${Math.ceil(H) + 6}" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
    <line x1="${Math.ceil(W * 0.7)}" y1="${Math.ceil(H) - 2}" x2="${Math.ceil(W * 0.7)}" y2="${Math.ceil(H) + 6}" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <!-- Display case -->
    <rect x="2" y="2" width="${Math.ceil(W) - 4}" height="${Math.ceil(H) - 4}" rx="4" fill="#0c1222" stroke="#1e3a5f" stroke-width="1.2"/>
    <!-- Inner panel -->
    <rect x="5" y="5" width="${Math.ceil(W) - 10}" height="${Math.ceil(H) - 10}" rx="2" fill="#0a0f1a"/>
    <!-- Dots -->
    ${dots}
    <!-- Brand label -->
    <text x="${Math.ceil(W) - 8}" y="${Math.ceil(H) - 6}" font-size="3.5" fill="#1e3a5f" text-anchor="end" font-family="monospace">P10</text>
    </svg>`;
}

const svgContent = buildMatrixSVG();
const W = Math.ceil(12 * 2 + 31 * 4.5 + 1.3 * 2);
const H = Math.ceil(10 * 2 + 7 * 4.5 + 1.3 * 2);

const variants = [
    {
        id: 'led_matrix',
        name: 'LED Dot Matrix',
        nameEn: 'LED Dot Matrix Display',
        spec: '32×8, P10, Merah',
        category: 'output',
        voltage: 0,
        resistance: 100,
        isMatrix: true,
        matrixCols: 32,
        matrixRows: 8,
        forwardVoltage: 2.0,
        width: W, height: H + 8,
        svg: svgContent,
        terminals: [
            { x: Math.ceil(W * 0.3), y: H + 6, label: '+' },
            { x: Math.ceil(W * 0.7), y: H + 6, label: '-' }
        ]
    }
];

const styles = `
    /* LED Dot Matrix active glow */
`;

export default { variants, styles };
