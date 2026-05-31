// CZElectro — Modified Nodal Analysis (MNA) Solver Module
// Replaces DFS loop tracing with proper KCL/KVL matrix-based circuit solving
(function(CZ) {
    'use strict';

    // ── Gauss-Jordan Linear System Solver ──
    // Solves A·X = Z, returns X. Modifies A and Z in-place.
    function solveLinearSystem(A, Z) {
        const n = Z.length;
        for (let i = 0; i < n; i++) {
            // Partial pivoting — find largest pivot
            let maxRow = i, maxVal = Math.abs(A[i][i]);
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > maxVal) { maxVal = Math.abs(A[k][i]); maxRow = k; }
            }
            if (maxRow !== i) {
                [A[i], A[maxRow]] = [A[maxRow], A[i]];
                [Z[i], Z[maxRow]] = [Z[maxRow], Z[i]];
            }
            const pivot = A[i][i];
            if (Math.abs(pivot) < EL.SIM.GAUSS_PIVOT_TOL) continue; // singular row — floating node

            // Eliminate all other rows
            for (let k = 0; k < n; k++) {
                if (k === i) continue;
                const factor = A[k][i] / pivot;
                if (factor === 0) continue;
                for (let j = i; j < n; j++) A[k][j] -= factor * A[i][j];
                Z[k] -= factor * Z[i];
            }
            // Normalize pivot row
            for (let j = i; j < n; j++) A[i][j] /= pivot;
            Z[i] /= pivot;
        }
        return Z;
    }

    // ── Node Mapping Engine ──
    // Maps component terminals to unique node IDs using Union-Find.
    // Wires merge their endpoint terminals into the same node.
    // Ground components are pinned to node 0.
    function buildNodeMap(deployed, wires) {
        const parent = {};
        const termKey = (cid, pin) => `${cid}:${pin}`;

        function find(x) {
            if (!(x in parent)) parent[x] = x;
            if (parent[x] !== x) parent[x] = find(parent[x]);
            return parent[x];
        }
        function union(a, b) {
            const ra = find(a), rb = find(b);
            if (ra !== rb) parent[ra] = rb;
        }

        // Initialize all terminal keys
        deployed.forEach(c => {
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            if (!tmpl) return;
            tmpl.terminals.forEach((_, idx) => find(termKey(c.id, idx)));
        });

        // Merge terminals connected by wires
        wires.forEach(w => union(termKey(w.c1, w.i1), termKey(w.c2, w.i2)));

        // Merge ground components to a canonical ground key
        const GND_KEY = '__GND__';
        find(GND_KEY);
        let hasExplicitGround = false;
        deployed.forEach(c => {
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            if (tmpl && tmpl.isGround) {
                union(termKey(c.id, 0), GND_KEY);
                hasExplicitGround = true;
            }
        });

        // If no explicit ground, use first battery's negative terminal as ground reference
        // This prevents singular conductance matrix for floating circuits
        if (!hasExplicitGround) {
            const firstSource = deployed.find(c => {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                return tmpl && (tmpl.voltage > 0 || tmpl.isSolar);
            });
            if (firstSource) {
                union(termKey(firstSource.id, 1), GND_KEY); // pin 1 = negative terminal
            }
        }

        // Assign numeric node IDs (ground = 0)
        const rootToNode = {};
        let nextNode = 1;
        const gndRoot = find(GND_KEY);
        rootToNode[gndRoot] = 0;

        const nodeMap = {}; // termKey -> nodeId
        Object.keys(parent).forEach(key => {
            if (key === GND_KEY) return;
            const root = find(key);
            if (!(root in rootToNode)) rootToNode[root] = nextNode++;
            nodeMap[key] = rootToNode[root];
        });
        nodeMap[GND_KEY] = 0;

        const getNode = (cid, pin) => {
            const root = find(termKey(cid, pin));
            return rootToNode[root] !== undefined ? rootToNode[root] : -1;
        };

        return { getNode, nodeCount: nextNode, termKey };
    }

    // ── Check if component is a voltage source ──
    function isSource(c) {
        return c.type.startsWith('battery') || c.type.startsWith('solar_');
    }

    // ── Get effective voltage of a source (accounts for battery depletion) ──
    function getEffectiveVoltage(c) {
        let v = c.voltage;
        if (c.batteryCapacity && c.batteryLevel !== undefined) {
            const isLiFePO4 = c.type.includes('lifepo4') || c.type === 'battery_32140' || c.type.includes('plts');
            const minLevel = CZ.getBattDeadLevel ? CZ.getBattDeadLevel(c) : 0;
            if (c.batteryLevel <= minLevel) {
                v = 0;
            } else {
                const pct = (c.batteryLevel - minLevel) / (c.batteryCapacity - minLevel);
                let vScale;
                if (isLiFePO4) {
                    // LiFePO4 discharge curve: extremely flat (famous characteristic)
                    // Real LiFePO4 holds ~3.2V from 95% down to ~10% capacity
                    // Only drops steeply in the last ~10%
                    vScale = pct > 0.10
                        ? 0.96 + 0.04 * ((pct - 0.10) / 0.90)  // 96%-100% above 10%
                        : pct / 0.10 * 0.96;                      // drops to 0 below 10%
                } else {
                    // Alkaline/generic: more gradual decline
                    // Voltage drops ~15% across full discharge, then steep below 20%
                    vScale = pct > 0.2
                        ? 0.85 + 0.15 * ((pct - 0.2) / 0.8)    // 85%-100% above 20%
                        : pct / 0.2 * 0.85;                       // drops to 0 below 20%
                }
                v *= vScale;
            }
        }
        if (c.type.startsWith('solar_')) {
            const hod = (CZ.simElapsedMin / 60) % 24;
            if (hod < 6 || hod >= 18) v = 0;
        }
        return v;
    }

    // ── Main MNA Solve ──
    // Returns: { nodeVoltages, branchCurrents, components: [{comp, vDrop, current, power, nodeP, nodeN}], energizedWires, hasCircuit }
    CZ.solveMNA = function() {
        const deployed = CZ.deployed.filter(c => !c.isBroken);
        const wires = CZ.wires;

        // Build node map
        const { getNode, nodeCount } = buildNodeMap(CZ.deployed, wires);

        // Identify voltage sources (batteries, solar) and their effective voltages
        const vSources = [];
        deployed.forEach(c => {
            if (!isSource(c)) return;
            const v = getEffectiveVoltage(c);
            if (v <= 0) return;
            const nP = getNode(c.id, 0); // pin 0 = positive
            const nN = getNode(c.id, 1); // pin 1 = negative
            if (nP < 0 || nN < 0 || nP === nN) return;
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            const intR = tmpl?.internalResistance || tmpl?.resistance || 0.01;
            vSources.push({ comp: c, v, nP, nN, intR, tmpl });
        });

        if (vSources.length === 0 || nodeCount <= 1) {
            // Even without sources, multimeter in Ω mode needs component topology
            const hasOhmMeter = deployed.some(c => c.type === 'voltmeter' && (c.mmMode === 'Ω'));
            if (!hasOhmMeter) {
                return { nodeVoltages: [], branchCurrents: [], components: [], energizedWires: new Set(), hasCircuit: false, loops: [], getNode };
            }
            // Build minimal component results for Ω mode (all zero V/I)
            const compResults = [];
            deployed.forEach(c => {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                const n1 = getNode(c.id, 0), n2 = getNode(c.id, 1);
                if (n1 < 0 || n2 < 0) return;
                compResults.push({ comp: c, tmpl, vDrop: 0, current: 0, power: 0, nodeP: n1, nodeN: n2, v1: 0, v2: 0 });
            });
            return { nodeVoltages: [], branchCurrents: [], components: compResults, energizedWires: new Set(), hasCircuit: false, loops: [], getNode };
        }

        // System size: N nodes (minus ground=0) + M voltage sources
        const N = nodeCount - 1; // node 0 is ground ref, not a variable
        const M = vSources.length;
        const size = N + M;

        if (size === 0) {
            return { nodeVoltages: [], branchCurrents: [], components: [], energizedWires: new Set(), hasCircuit: false, loops: [] };
        }

        // Node index mapping: node k (1..nodeCount-1) maps to matrix row k-1
        const nIdx = (node) => node - 1; // ground (0) is reference, not in matrix

        // Build A matrix and Z vector
        const A = Array.from({ length: size }, () => new Float64Array(size));
        const Z = new Float64Array(size);

        // Stamp passive components (resistors, etc.)
        deployed.forEach(c => {
            if (isSource(c)) return; // handled as voltage sources
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            if (!tmpl) return;

            const n1 = getNode(c.id, 0);
            const n2 = getNode(c.id, 1);
            if (n1 < 0 || n2 < 0 || n1 === n2) return;

            // Switch handling
            if (c.type === 'switch_toggle' && !c.isClosed) return; // open switch = no connection

            // Diode/LED reverse-bias check: terminal 0 = Anode, terminal 1 = Kathode
            // We'll do a first-pass solve, then check polarity in iteration
            let R = c.currentResistance;
            if (R === Infinity) return;
            if (R <= 0) R = EL.SIM.MIN_RESISTANCE; // clamp zero to tiny value (closed switch)

            const G = EL.Ohm.conductance(R);

            // Stamp conductance into G matrix
            if (n1 > 0) A[nIdx(n1)][nIdx(n1)] += G;
            if (n2 > 0) A[nIdx(n2)][nIdx(n2)] += G;
            if (n1 > 0 && n2 > 0) {
                A[nIdx(n1)][nIdx(n2)] -= G;
                A[nIdx(n2)][nIdx(n1)] -= G;
            }
        });

        // Stamp voltage sources with internal resistance
        // Model: V_source in series with R_internal
        // We use the MNA voltage source stamp:
        //   V(nP) - V(nN) - I*R_int = V_eff
        vSources.forEach((vs, m) => {
            const row = N + m; // extra row for this voltage source
            const { nP, nN, v, intR } = vs;

            // KCL stamps: current I_m flows from nN to nP (inside source)
            if (nP > 0) A[nIdx(nP)][row] += 1;
            if (nN > 0) A[nIdx(nN)][row] -= 1;

            // Voltage constraint row: V(nP) - V(nN) - I_m * R_int = V_eff
            if (nP > 0) A[row][nIdx(nP)] += 1;
            if (nN > 0) A[row][nIdx(nN)] -= 1;
            A[row][row] = -intR;
            Z[row] = v;
        });

        // Solve the system
        const X = solveLinearSystem(
            A.map(row => Array.from(row)),
            Array.from(Z)
        );

        // Extract node voltages
        const nodeVoltages = new Array(nodeCount).fill(0); // node 0 = ground = 0V
        for (let i = 0; i < N; i++) {
            nodeVoltages[i + 1] = isFinite(X[i]) ? X[i] : 0;
        }

        // Extract source currents
        const branchCurrents = [];
        vSources.forEach((vs, m) => {
            const I = isFinite(X[N + m]) ? X[N + m] : 0;
            branchCurrents.push({ comp: vs.comp, current: I, voltage: vs.v });
        });

        // Compute per-component results
        const compResults = [];
        const energizedWires = new Set();

        // Check all deployed (including broken for reporting)
        CZ.deployed.forEach(c => {
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            if (!tmpl) return;
            const n1 = getNode(c.id, 0);
            const n2 = getNode(c.id, 1);
            if (n1 < 0 || n2 < 0) return;

            const v1 = nodeVoltages[n1] || 0;
            const v2 = nodeVoltages[n2] || 0;
            let vDrop, current;

            if (isSource(c)) {
                // For sources, find the branch current
                const bc = branchCurrents.find(b => b.comp.id === c.id);
                current = bc ? bc.current : 0;
                vDrop = v1 - v2;
            } else {
                vDrop = v1 - v2;
                const R = c.currentResistance;
                if (c.type === 'switch_toggle' && !c.isClosed) {
                    current = 0;
                } else if (R === Infinity || R <= 0) {
                    current = 0;
                } else {
                    current = EL.Ohm.current(vDrop, R);
                }
            }

            const power = EL.Power.fromVI(vDrop, current);
            compResults.push({ comp: c, tmpl, vDrop, current, power, nodeP: n1, nodeN: n2, v1, v2 });
        });

        // Collect multimeter nodes in V mode (high-impedance instruments that measure voltage)
        const voltmeterNodes = new Set();
        compResults.forEach(cr => {
            const isVmMode = cr.tmpl && (cr.tmpl.isVoltmeter || cr.tmpl.isMultimeter) && (cr.comp.mmMode || 'V') === 'V';
            if (isVmMode && Math.abs(cr.v1 - cr.v2) > 0.001) {
                voltmeterNodes.add(cr.nodeP);
                voltmeterNodes.add(cr.nodeN);
            }
        });

        // Determine energized wires
        wires.forEach((w, idx) => {
            const n1 = getNode(w.c1, w.i1);
            const n2 = getNode(w.c2, w.i2);
            if (n1 < 0 || n2 < 0) return;
            const v1 = nodeVoltages[n1] || 0;
            const v2 = nodeVoltages[n2] || 0;
            // A wire is energized if any connected node has non-zero voltage or current flows
            const hasVoltage = Math.abs(v1) > 0.001 || Math.abs(v2) > 0.001;
            const hasCurrent = compResults.some(cr =>
                Math.abs(cr.current) > EL.SIM.MIN_CURRENT &&
                ((cr.nodeP === n1 || cr.nodeP === n2) || (cr.nodeN === n1 || cr.nodeN === n2))
            );
            // Also energize wires connected to active voltmeter probes
            const hasVoltmeter = voltmeterNodes.has(n1) || voltmeterNodes.has(n2);
            if (hasVoltage && (hasCurrent || hasVoltmeter)) energizedWires.add(idx);
        });

        // Circuit is active if any non-source has significant current, OR a multimeter reads a value
        const hasCircuit = compResults.some(cr =>
            (Math.abs(cr.current) > EL.SIM.MIN_CURRENT && !isSource(cr.comp)) ||
            (cr.tmpl && (cr.tmpl.isVoltmeter || cr.tmpl.isMultimeter) && Math.abs(cr.v1 - cr.v2) > 0.001)
        );

        // Build loop-equivalent info for battery simulation compatibility
        const loops = [];
        if (hasCircuit) {
            let totalSrcW = 0, totalLoadW = 0;
            const battIds = [];
            let hasCC = false, hasInv = false;
            let totalV = 0, totalR = 0, totalI = 0;

            compResults.forEach(cr => {
                if (isSource(cr.comp) && Math.abs(cr.current) > EL.SIM.MIN_CURRENT) {
                    totalV += Math.abs(cr.vDrop);
                    if (cr.comp.batteryCapacity) battIds.push(cr.comp.id);
                    if (cr.tmpl.ratedPower && !cr.comp.type.startsWith('battery')) totalSrcW += cr.tmpl.ratedPower;
                }
                if (cr.comp.type === 'charge_controller') hasCC = true;
                if (cr.tmpl.isInverter) hasInv = true;
                if (!isSource(cr.comp) && cr.tmpl.ratedPower && Math.abs(cr.current) > EL.SIM.MIN_CURRENT &&
                    cr.comp.type !== 'charge_controller' && !cr.tmpl.isInverter && cr.comp.type !== 'switch_toggle') {
                    totalLoadW += cr.tmpl.ratedPower;
                }
            });

            const maxI = compResults.reduce((mx, cr) => Math.max(mx, Math.abs(cr.current)), 0);
            const loopV = vSources.reduce((s, vs) => s + vs.v, 0);
            const loopR = maxI > 0 ? loopV / maxI : 0;
            const loopW = loopV * maxI;

            loops.push({
                key: 'mna_loop',
                v: loopV,
                r: loopR,
                i: maxI,
                w: loopW,
                srcW: totalSrcW,
                loadW: totalLoadW,
                battIds,
                hasCC,
                hasInverter: hasInv
            });
        }

        return { nodeVoltages, branchCurrents, components: compResults, energizedWires, hasCircuit, loops, getNode };
    };

    // ── Diode iteration: re-solve with reverse-biased diodes blocked ──
    CZ.solveMNAWithDiodes = function() {
        const MAX_ITER = 5;
        let result;

        // Reset all diode/LED resistances to template values before solving
        // This prevents deadlock where a blocked diode stays blocked forever
        CZ.deployed.forEach(c => {
            if (c.isBroken) return;
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            if (tmpl && tmpl.isDiode && c.currentResistance === 1e12) {
                c.currentResistance = tmpl.resistance;
            }
        });

        for (let iter = 0; iter < MAX_ITER; iter++) {
            result = CZ.solveMNA();
            if (!result.hasCircuit) break;

            let changed = false;
            result.components.forEach(cr => {
                const tmpl = cr.tmpl;
                if (!tmpl || !tmpl.isDiode) return;
                if (cr.comp.isBroken) return;

                // Pin 0 = Anode (+), Pin 1 = Cathode (-)
                // Forward bias: V_anode > V_cathode (vDrop > 0 when current flows A->K)
                const vAcross = cr.v1 - cr.v2; // v at pin0 - v at pin1

                if (vAcross < (tmpl.forwardVoltage || 0) * 0.1) {
                    // Reverse biased or below threshold — block
                    if (cr.comp.currentResistance !== 1e12) {
                        cr.comp.currentResistance = 1e12; // effectively infinite
                        changed = true;
                    }
                } else {
                    // Forward biased — restore original resistance
                    if (cr.comp.currentResistance === 1e12) {
                        cr.comp.currentResistance = tmpl.resistance;
                        changed = true;
                    }
                }
            });

            if (!changed) break;
        }

        return result;
    };

})(window.CZ);
