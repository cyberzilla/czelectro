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
    // Grid spans from PAD_X - DOT_R to PAD_X + (COLS-1)*SPACING + DOT_R
    // Use equal padding on both sides for symmetry
    const gridWidth = (COLS - 1) * SPACING + DOT_R * 2;
    const gridHeight = (ROWS - 1) * SPACING + DOT_R * 2;
    const W = PAD_X + gridWidth + PAD_X;
    const H = PAD_Y + gridHeight + PAD_Y;
    // Offset dots so they are centered: first dot cx = PAD_X + DOT_R
    const dotOffX = PAD_X + DOT_R;
    const dotOffY = PAD_Y + DOT_R;

    let dots = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cx = dotOffX + c * SPACING;
            const cy = dotOffY + r * SPACING;
            dots += `<circle class="mdot mdot-${c}-${r}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${DOT_R}" fill="#1a2332" style="transition:fill 0.15s;"/>`;
        }
    }

    const iW = Math.round(W);
    const iH = Math.round(H);

    return { svg: `<svg width="100%" height="100%" viewBox="0 0 ${iW} ${iH}">
    <!-- Lead wires -->
    <line x1="${Math.round(iW * 0.3)}" y1="${iH - 2}" x2="${Math.round(iW * 0.3)}" y2="${iH + 6}" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
    <line x1="${Math.round(iW * 0.7)}" y1="${iH - 2}" x2="${Math.round(iW * 0.7)}" y2="${iH + 6}" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <!-- Display case -->
    <rect x="2" y="2" width="${iW - 4}" height="${iH - 4}" rx="4" fill="#0c1222" stroke="#1e3a5f" stroke-width="1.2"/>
    <!-- Inner panel -->
    <rect x="5" y="5" width="${iW - 10}" height="${iH - 10}" rx="2" fill="#0a0f1a"/>
    <!-- Dots -->
    ${dots}
    <!-- Brand label -->
    <text x="${iW - 8}" y="${iH - 6}" font-size="3.5" fill="#1e3a5f" text-anchor="end" font-family="monospace">P10</text>
    </svg>`, W: iW, H: iH };
}

const matrixResult = buildMatrixSVG();
const W = matrixResult.W;
const H = matrixResult.H;

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
        svg: matrixResult.svg,
        terminals: [
            { x: Math.round(W * 0.3), y: H + 6, label: '+' },
            { x: Math.round(W * 0.7), y: H + 6, label: '-' }
        ]
    }
];

const styles = `
    /* LED Dot Matrix active glow */
`;

export default { variants, styles };
