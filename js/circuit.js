// CZElectro — Circuit Tracing Module (Legacy DFS)
// Contains: DFS loop tracing for circuit discovery
// NOTE: evaluateCircuit is now handled by mna-evaluate.js (MNA solver)
//       Visual effects are in effects.js
//       Battery simulation is in battery-sim.js
(function(CZ) {
    'use strict';

    // ── Circuit Tracing (DFS) ──
    CZ.traceCircuit = function(curr, visited, path, paths, targetBatt) {
        const conns = CZ.wires.map((w, idx) => ({ ...w, wireIdx: idx }))
            .filter(w => (w.c1 === curr.cid && w.i1 === curr.pin) || (w.c2 === curr.cid && w.i2 === curr.pin));

        conns.forEach(w => {
            const isFrom = (w.c1 === curr.cid && w.i1 === curr.pin);
            const nCid = isFrom ? w.c2 : w.c1;
            const nPin = isFrom ? w.i2 : w.i1;

            if (nCid === targetBatt && nPin === 1) {
                paths.push([...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }]);
                return;
            }

            const nextComp = CZ.deployed.find(c => c.id === nCid);
            if (!nextComp || visited.includes(nCid)) return;

            const nextTmpl = COMPONENTS.find(t => t.id === nextComp.type);
            if (nextTmpl?.isGround) {
                const otherGrounds = CZ.deployed.filter(c => {
                    const t = COMPONENTS.find(x => x.id === c.type);
                    return t?.isGround && c.id !== nCid && !visited.includes(c.id);
                });
                otherGrounds.forEach(gnd => {
                    const gndConns = CZ.wires.map((gw, idx) => ({ ...gw, wireIdx: idx }))
                        .filter(gw => (gw.c1 === gnd.id && gw.i1 === 0) || (gw.c2 === gnd.id && gw.i2 === 0));
                    gndConns.forEach(gw => {
                        const gIsFrom = (gw.c1 === gnd.id && gw.i1 === 0);
                        const gNCid = gIsFrom ? gw.c2 : gw.c1;
                        const gNPin = gIsFrom ? gw.i2 : gw.i1;
                        if (gNCid === targetBatt && gNPin === 1) {
                            paths.push([...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }, { cid: gnd.id, pin: 0, wireIdx: gw.wireIdx }]);
                            return;
                        }
                        const gNextComp = CZ.deployed.find(c => c.id === gNCid);
                        if (!gNextComp || visited.includes(gNCid)) return;
                        const gOutPin = gNPin === 0 ? 1 : 0;
                        CZ.traceCircuit(
                            { cid: gNCid, pin: gOutPin },
                            [...visited, nCid, gnd.id, gNCid],
                            [...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }, { cid: gnd.id, pin: 0, wireIdx: gw.wireIdx }, { cid: gNCid, pin: gNPin }],
                            paths, targetBatt
                        );
                    });
                });
                return;
            }

            const outPin = nPin === 0 ? 1 : 0;
            CZ.traceCircuit(
                { cid: nCid, pin: outPin },
                [...visited, nCid],
                [...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }],
                paths, targetBatt
            );
        });
    };

})(window.CZ);
