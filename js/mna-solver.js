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
            const tmpl = REGISTRY.find(c.type);
            if (!tmpl) return;
            tmpl.terminals.forEach((_, idx) => find(termKey(c.id, idx)));
        });

        // Merge terminals connected by wires
        wires.forEach(w => union(termKey(w.c1, w.i1), termKey(w.c2, w.i2)));

        // Arduino: internally connect GND pins (terminals 13 and 21) — like real Arduino
        deployed.forEach(c => {
            const tmpl = REGISTRY.find(c.type);
            if (tmpl && tmpl.isArduino) {
                union(termKey(c.id, 13), termKey(c.id, 21)); // GND = GND2
            }
            // busTerminals: groups of terminals that are internally shorted (e.g. power strip L/N buses)
            if (tmpl && tmpl.busTerminals) {
                tmpl.busTerminals.forEach(bus => {
                    for (let i = 1; i < bus.length; i++) {
                        union(termKey(c.id, bus[0]), termKey(c.id, bus[i]));
                    }
                });
            }
            // groundTerminals: terminals that act as implicit ground (e.g. outlet_strip N)
            if (tmpl && tmpl.groundTerminals) {
                tmpl.groundTerminals.forEach(ti => {
                    union(termKey(c.id, ti), '__GND__');
                });
            }
        });

        // Merge ground components to a canonical ground key
        const GND_KEY = '__GND__';
        find(GND_KEY);
        let hasExplicitGround = false;
        deployed.forEach(c => {
            const tmpl = REGISTRY.find(c.type);
            if (tmpl && tmpl.isGround) {
                union(termKey(c.id, 0), GND_KEY);
                hasExplicitGround = true;
            }
        });

        // If no explicit ground, use ALL sources' negative terminals as ground reference
        // This ensures multiple disconnected circuits each have a valid ground node
        // (prevents singular conductance matrix for floating sub-circuits)
        if (!hasExplicitGround) {
            deployed.forEach(c => {
                if (!isSource(c)) return;
                union(termKey(c.id, 1), GND_KEY); // pin 1 = negative terminal
            });
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
        return c.type.startsWith('battery') || c.type.startsWith('solar_') || c.type === 'pln_source';
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
        // PLN: 48V in MNA (matches battery pack), 0V when off
        if (c.type === 'pln_source') {
            v = c.isPoweredOff ? 0 : 48;
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
        const deadSources = []; // track dead batteries to check series/parallel
        deployed.forEach(c => {
            if (!isSource(c)) return;
            const v = getEffectiveVoltage(c);
            if (v <= 0) {
                deadSources.push(c);
                return;
            }
            const nP = getNode(c.id, 0); // pin 0 = positive
            const nN = getNode(c.id, 1); // pin 1 = negative
            if (nP < 0 || nN < 0 || nP === nN) return;
            const tmpl = REGISTRY.find(c.type);
            const intR = tmpl?.internalResistance || tmpl?.resistance || 0.01;
            vSources.push({ comp: c, v, nP, nN, intR, tmpl });
        });

        // ── Arduino virtual voltage sources ──
        // When an Arduino pin is set HIGH via digitalWrite(), it becomes a 5V source
        // between the pin terminal and the Arduino's GND terminal.
        // This makes current flow through connected components via real MNA simulation.
        // Terminal layout (22-pin):
        //   0-11: D13,D12,D11,D10,D9,D8,D7,D6,D5,D4,D3,D2
        //  12=VIN, 13=GND, 14=5V, 15=3V3, 16-20=A0-A4, 21=GND2
        const ARD_PIN_TO_TERMINAL = {
            13: 0,  12: 1,  11: 2,  10: 3,  9: 4,  8: 5,
            7: 6,   6: 7,   5: 8,   4: 9,   3: 10, 2: 11
        };
        const ARD_GND_TERMINALS = [13, 21]; // GND terminal indices

        // Arduino virtual voltage sources — only when Arduino is properly powered
        deployed.forEach(c => {
            const tmpl = REGISTRY.find(c.type);
            if (!tmpl || !tmpl.isArduino || !c._arduinoPins) return;

            // Check if Arduino is properly powered (VIN → battery AND GND → battery)
            const vinWires = CZ.wires.filter(w =>
                (w.c1 === c.id && w.i1 === 12) || (w.c2 === c.id && w.i2 === 12)
            );
            const hasPower = vinWires.some(w => {
                const otherId = w.c1 === c.id ? w.c2 : w.c1;
                const otherComp = CZ.deployedMap.get(otherId);
                if (!otherComp) return false;
                return isSource(otherComp) && !otherComp.isPoweredOff && !otherComp.isBroken;
            });
            // GND must connect to a battery/source negative terminal
            const gndWires = CZ.wires.filter(w =>
                (w.c1 === c.id && (w.i1 === 13 || w.i1 === 21)) ||
                (w.c2 === c.id && (w.i2 === 13 || w.i2 === 21))
            );
            const hasGND = gndWires.some(w => {
                const otherId = w.c1 === c.id ? w.c2 : w.c1;
                const otherComp = CZ.deployedMap.get(otherId);
                if (!otherComp) return false;
                return isSource(otherComp) && !otherComp.isPoweredOff && !otherComp.isBroken;
            });
            if (!hasPower || !hasGND) return; // Need both VIN+battery and GND+battery

            Object.entries(c._arduinoPins).forEach(([pin, value]) => {
                if (!value) return; // only HIGH pins become sources
                const termIdx = ARD_PIN_TO_TERMINAL[parseInt(pin)];
                if (termIdx === undefined) return;

                const nP = getNode(c.id, termIdx); // active pin terminal
                // Find connected GND terminal (try both GND pins)
                let nN = -1;
                for (const gndIdx of ARD_GND_TERMINALS) {
                    const n = getNode(c.id, gndIdx);
                    if (n >= 0 && n !== nP) { nN = n; break; }
                }
                if (nP < 0 || nN < 0 || nP === nN) return;

                // Add as 5V source with internal resistance (25Ω — realistic ATmega328P pin)
                vSources.push({ comp: c, v: 5, nP, nN, intR: 25, tmpl, isArduinoPin: true, pin: parseInt(pin) });
            });
        });

        // Dead batteries: only stamp as passive resistor if in SERIES (not parallel)
        // Parallel dead battery = open circuit (realistic: doesn't short the circuit)
        // Series dead battery = passive resistor (realistic: current still flows through)
        const deadSourceIds = new Set();
        deadSources.forEach(dc => {
            const dP = getNode(dc.id, 0);
            const dN = getNode(dc.id, 1);
            // Check if this dead battery shares both terminal nodes with any active source
            const isParallel = vSources.some(vs => 
                (vs.nP === dP && vs.nN === dN) || (vs.nP === dN && vs.nN === dP)
            );
            if (!isParallel) {
                deadSourceIds.add(dc.id); // series: stamp as passive resistor
            }
            // parallel: skip entirely (open circuit)
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
                const tmpl = REGISTRY.find(c.type);
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

        // Stamp passive components (resistors, etc.) + dead batteries as internal resistors
        deployed.forEach(c => {
            if (isSource(c) && !deadSourceIds.has(c.id)) return; // active sources handled separately
            const tmpl = REGISTRY.find(c.type);
            if (!tmpl) return;

            const n1 = getNode(c.id, 0);
            const n2 = getNode(c.id, 1);
            if (n1 < 0 || n2 < 0 || n1 === n2) return;

            // Switch / MCB handling — open = no connection
            const isSwitchLike = c.type === 'switch_toggle' || c.type === 'timer_555' || c.type.startsWith('mcb_');
            if (isSwitchLike && !c.isClosed) return;
            if (c.isPoweredOff) return; // powered-off component = open circuit
            if (tmpl.isBusOnly) return; // bus-only component (e.g. outlet_strip) — no internal resistance to stamp

            // ── ATS: 3-terminal auto transfer switch ──
            // Terminal 0=PLN, Terminal 1=PLTS, Terminal 2=LOAD
            // Mode: PLN_FIRST (default) or PLTS_FIRST
            if (tmpl && tmpl.isATS) {
                const n3 = getNode(c.id, 2); // LOAD terminal
                if (n3 < 0) return;
                const mode = c.atsMode || 'PLN_FIRST';

                // BFS: trace wires from an ATS terminal to find connected sources
                // Traverses through passive components but stops at grounds & ATS itself
                function hasSourceViaWire(atsId, termIdx, sourceCheck) {
                    const visited = new Set();
                    const queue = [{ cid: atsId, ti: termIdx }];
                    while (queue.length) {
                        const { cid, ti } = queue.shift();
                        const key = cid + ':' + ti;
                        if (visited.has(key)) continue;
                        visited.add(key);
                        // Check if this component is the source we're looking for
                        if (cid !== atsId) {
                            const comp = CZ.deployedMap.get(cid);
                            if (comp && sourceCheck(comp)) return true;
                        }
                        // Follow wires from this terminal
                        CZ.wires.forEach(w => {
                            let nextCid, nextTi;
                            if (w.c1 === cid && w.i1 === ti) { nextCid = w.c2; nextTi = w.i2; }
                            else if (w.c2 === cid && w.i2 === ti) { nextCid = w.c1; nextTi = w.i1; }
                            else return;
                            if (visited.has(nextCid + ':' + nextTi)) return;
                            queue.push({ cid: nextCid, ti: nextTi });
                            // Traverse through component to its other terminals
                            // (skip ground & ATS to avoid cross-contamination)
                            const nc = CZ.deployedMap.get(nextCid);
                            const nt = nc ? REGISTRY.find(nc.type) : null;
                            if (nt && nt.terminals && !nt.isGround && !nt.isATS) {
                                nt.terminals.forEach((_, i) => {
                                    if (i !== nextTi) queue.push({ cid: nextCid, ti: i });
                                });
                            }
                        });
                    }
                    return false;
                }

                // Check PLN: trace from ATS terminal 0 to find active PLN source
                const plnActive = hasSourceViaWire(c.id, 0, pc => {
                    const pt = REGISTRY.find(pc.type);
                    return pt && pt.isPLN && !pc.isPoweredOff && !pc.isBroken;
                });

                // Check PLTS: trace from ATS terminal 1 to find charged battery/inverter
                const pltsActive = hasSourceViaWire(c.id, 1, pc => {
                    if (pc.type !== 'battery_32140' && !pc.type.includes('lifepo4') && !pc.type.includes('plts')) return false;
                    if (pc.isBroken) return false;
                    const minLvl = CZ.getBattDeadLevel ? CZ.getBattDeadLevel(pc) : 0;
                    return (pc.batteryLevel || 0) > minLvl;
                });

                // Determine active source based on mode
                let usePLN;
                if (mode === 'PLTS_FIRST') {
                    // PLTS priority: use PLTS if connected & batteries alive, PLN as backup
                    usePLN = !pltsActive && plnActive;
                } else {
                    // PLN priority (default): use PLN if connected & available, PLTS as backup
                    usePLN = plnActive;
                }

                const srcNode = usePLN ? n1 : n2;
                c._atsSource = usePLN ? 'PLN' : (pltsActive || !plnActive ? 'PLTS' : 'NONE');
                const G = EL.Ohm.conductance(0.01);
                if (srcNode > 0) A[nIdx(srcNode)][nIdx(srcNode)] += G;
                if (n3 > 0) A[nIdx(n3)][nIdx(n3)] += G;
                if (srcNode > 0 && n3 > 0) {
                    A[nIdx(srcNode)][nIdx(n3)] -= G;
                    A[nIdx(n3)][nIdx(srcNode)] -= G;
                }
                return;
            }

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
            const tmpl = REGISTRY.find(c.type);
            if (!tmpl) return;
            const n1 = getNode(c.id, 0);
            const n2 = getNode(c.id, 1);
            if (n1 < 0 || n2 < 0) return;

            const v1 = nodeVoltages[n1] || 0;
            const v2 = nodeVoltages[n2] || 0;
            let vDrop, current;

            // ATS: 3-terminal component — use active source↔load pair
            if (tmpl && tmpl.isATS) {
                const n3 = getNode(c.id, 2); // LOAD terminal
                const v3 = n3 >= 0 ? (nodeVoltages[n3] || 0) : 0;
                const srcNode = c._atsSource === 'PLN' ? n1 : (getNode(c.id, 1));
                const vSrc = srcNode >= 0 ? (nodeVoltages[srcNode] || 0) : 0;
                vDrop = vSrc - v3;
                current = Math.abs(vDrop) > 0.001 ? EL.Ohm.current(vDrop, 0.01) : 0;
                const power = EL.Power.fromVI(vDrop, current);
                compResults.push({ comp: c, tmpl, vDrop, current, power, nodeP: srcNode, nodeN: n3 >= 0 ? n3 : n2, v1: vSrc, v2: v3 });
                return;
            }

            if (isSource(c)) {
                // For sources, find the branch current
                const bc = branchCurrents.find(b => b.comp.id === c.id);
                current = bc ? bc.current : 0;
                vDrop = v1 - v2;
            } else {
                vDrop = v1 - v2;
                const R = c.currentResistance;
                if ((c.type === 'switch_toggle' || c.type === 'timer_555' || c.type.startsWith('mcb_')) && !c.isClosed) {
                    current = 0;
                } else if (c.isPoweredOff) {
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
        // Group by electrically connected circuits using Union-Find
        const loops = [];
        if (hasCircuit) {
            // Union-Find to identify connected circuits
            const ufP = {};
            function uf(x) { return ufP[x] === x ? x : (ufP[x] = uf(ufP[x])); }
            function ufU(a, b) { ufP[uf(a)] = uf(b); }
            deployed.forEach(c => ufP[c.id] = c.id);
            wires.forEach(w => {
                if (ufP[w.c1] !== undefined && ufP[w.c2] !== undefined) ufU(w.c1, w.c2);
            });

            // Group components by their circuit root
            const circuitGroups = {};
            compResults.forEach(cr => {
                const root = uf(cr.comp.id);
                if (!circuitGroups[root]) circuitGroups[root] = [];
                circuitGroups[root].push(cr);
            });

            // Build one loop per independent circuit
            Object.values(circuitGroups).forEach(group => {
                let totalSrcW = 0, totalLoadW = 0;
                const battIds = [];
                let hasCC = false, hasInv = false, hasSolar = false;
                let groupHasCurrent = false;

                // Pass 1: detect circuit features and sources
                group.forEach(cr => {
                    if (Math.abs(cr.current) > EL.SIM.MIN_CURRENT) groupHasCurrent = true;
                    if (isSource(cr.comp) && Math.abs(cr.current) > EL.SIM.MIN_CURRENT) {
                        if (cr.comp.batteryCapacity) battIds.push(cr.comp.id);
                        if (cr.comp.type.startsWith('solar_')) hasSolar = true;
                        if (cr.tmpl.ratedPower && !cr.comp.type.startsWith('battery')) totalSrcW += cr.tmpl.ratedPower;
                    }
                    if (cr.tmpl.isChargeController) hasCC = true;
                    if (cr.tmpl.isInverter) hasInv = true;
                });

                // Pass 2: compute load power (needs hasInv to be resolved first)
                group.forEach(cr => {
                    if (!isSource(cr.comp) && Math.abs(cr.current) > EL.SIM.MIN_CURRENT &&
                        !cr.tmpl.isChargeController && !cr.tmpl.isInverter && cr.comp.type !== 'switch_toggle') {
                        // AC loads through inverter: use ratedPower (nameplate watts)
                        // because MNA computes V²/R at DC battery voltage (~51V),
                        // not at the 220V AC the inverter provides.
                        // DC loads: use actual MNA power (accurate at DC voltage).
                        if (cr.tmpl.acOnly && hasInv && cr.tmpl.ratedPower) {
                            totalLoadW += cr.tmpl.ratedPower;
                        } else {
                            totalLoadW += cr.power || 0;
                        }
                    }
                });

                if (!groupHasCurrent || battIds.length === 0) return;

                // Calculate actual power from MNA results for this circuit
                const maxI = group.reduce((mx, cr) => Math.max(mx, Math.abs(cr.current)), 0);
                const circuitSources = group.filter(cr => isSource(cr.comp) && Math.abs(cr.current) > EL.SIM.MIN_CURRENT);
                const loopV = circuitSources.reduce((s, cr) => s + Math.abs(cr.vDrop), 0);
                const loopW = loopV * maxI;

                loops.push({
                    key: 'mna_loop_' + battIds[0],
                    v: loopV,
                    r: maxI > 0 ? loopV / maxI : 0,
                    i: maxI,
                    w: loopW,
                    srcW: totalSrcW,
                    loadW: totalLoadW,
                    battIds,
                    hasCC,
                    hasSolar,
                    hasInverter: hasInv
                });
            });
        }

        return { nodeVoltages, branchCurrents, components: compResults, energizedWires, hasCircuit, loops, getNode };
    };

    // ── Diode iteration: re-solve with reverse-biased diodes blocked ──
    CZ.solveMNAWithDiodes = function() {
        const MAX_ITER = 10;
        let result;

        // Reset all diode/LED resistances to template values before solving
        // This prevents deadlock where a blocked diode stays blocked forever
        CZ.deployed.forEach(c => {
            if (c.isBroken) return;
            const tmpl = REGISTRY.find(c.type);
            if (tmpl && tmpl.isDiode && c.currentResistance === 1e12) {
                c.currentResistance = tmpl.resistance;
            }
        });

        // Track per-diode flip count for oscillation detection
        const flipCount = {};

        for (let iter = 0; iter < MAX_ITER; iter++) {
            result = CZ.solveMNA();
            if (!result.hasCircuit) break;

            let changed = false;
            result.components.forEach(cr => {
                const tmpl = cr.tmpl;
                if (!tmpl || !tmpl.isDiode) return;
                if (cr.comp.isBroken) return;

                const did = cr.comp.id;
                if (!flipCount[did]) flipCount[did] = 0;

                // Oscillation guard: if diode flipped > 3 times, freeze its state
                if (flipCount[did] >= 3) return;

                // Pin 0 = Anode (+), Pin 1 = Cathode (-)
                // Forward bias: V_anode > V_cathode (vDrop > 0 when current flows A->K)
                const vAcross = cr.v1 - cr.v2; // v at pin0 - v at pin1

                if (vAcross < (tmpl.forwardVoltage || 0) * 0.1) {
                    // Reverse biased or below threshold — block
                    if (cr.comp.currentResistance !== 1e12) {
                        cr.comp.currentResistance = 1e12; // effectively infinite
                        flipCount[did]++;
                        changed = true;
                    }
                } else {
                    // Forward biased — restore original resistance
                    if (cr.comp.currentResistance === 1e12) {
                        cr.comp.currentResistance = tmpl.resistance;
                        flipCount[did]++;
                        changed = true;
                    }
                }
            });

            if (!changed) break;
        }

        return result;
    };

})(window.CZ);
