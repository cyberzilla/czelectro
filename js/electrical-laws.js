// ═══════════════════════════════════════════════════════════════
// CZElectro — Electrical Laws & Physics Constants
// ═══════════════════════════════════════════════════════════════
// File ini berisi hukum-hukum kelistrikan BAKU yang tidak berubah.
// Semua rumus berdasarkan fisika nyata — JANGAN diedit.
// ═══════════════════════════════════════════════════════════════
window.EL = (function() {
    'use strict';

    // ─────────────────────────────────────────
    // 1. KONSTANTA FISIKA
    // ─────────────────────────────────────────
    const CONST = Object.freeze({
        // Electron charge (Coulomb)
        ELECTRON_CHARGE: 1.602176634e-19,
        // Boltzmann constant (J/K)
        BOLTZMANN: 1.380649e-23,
        // Room temperature (Kelvin) — 25°C
        ROOM_TEMP_K: 298.15,
        // Thermal voltage at room temp: Vt = kT/q ≈ 25.7mV
        THERMAL_VOLTAGE: 0.02585,
        // Permittivity of free space (F/m)
        EPSILON_0: 8.854187817e-12,
        // Permeability of free space (H/m)
        MU_0: 1.2566370614e-6,
        // Speed of light (m/s)
        SPEED_OF_LIGHT: 299792458,
        // Copper resistivity at 20°C (Ω·m)
        COPPER_RESISTIVITY: 1.68e-8,
    });

    // ─────────────────────────────────────────
    // 2. KONSTANTA SIMULASI (nilai realistis)
    // ─────────────────────────────────────────
    const SIM = Object.freeze({
        // Switch / relay contact resistance saat ON (Ω)
        // Real: 5–50 mΩ, SPICE standard: 0.001Ω
        SWITCH_ON_R: 0.001,
        // Switch resistance saat OFF (Ω) — sangat tinggi
        SWITCH_OFF_R: Infinity,
        // Voltmeter / Ohmmeter input impedance (Ω) — 10MΩ seperti DMM nyata
        METER_HIGH_Z: 10000000,
        // Ammeter shunt resistance (Ω) — sangat rendah agar tidak mengganggu rangkaian
        // Real DMM: ~10µΩ, cukup kecil agar 2+ meter seri tetap akurat
        METER_SHUNT_R: 0.00001,
        // DMM internal fuse rating (A) — standar multimeter
        METER_FUSE_A: 10.0,
        // Minimum resistance yang valid di MNA solver (Ω)
        // Nilai di bawah ini di-clamp untuk stabilitas numerik
        MIN_RESISTANCE: 0.000001,
        // Resistance dianggap open circuit (Ω)
        OPEN_CIRCUIT_R: 1e12,
        // Arus minimum yang dianggap "mengalir" (A)
        MIN_CURRENT: 0.0001,
        // Tegangan minimum yang dianggap "ada" (V)
        MIN_VOLTAGE: 0.0005,
        // Toleransi pivot Gauss elimination
        GAUSS_PIVOT_TOL: 1e-12,
        // Toleransi perbandingan floating-point
        FLOAT_EPSILON: 1e-15,
        // AC grid frequency Indonesia (Hz)
        AC_FREQ_HZ: 50,
        // AC grid voltage Indonesia RMS (V)
        AC_VOLTAGE_RMS: 220,
        // Standard diode forward voltage (V)
        DIODE_VF_SILICON: 0.7,
        DIODE_VF_LED: 2.0,
        DIODE_VF_SCHOTTKY: 0.3,
    });

    // ─────────────────────────────────────────
    // 3. HUKUM OHM (Ohm's Law)
    //    V = I × R
    //    Ditemukan: Georg Simon Ohm, 1827
    // ─────────────────────────────────────────
    const Ohm = Object.freeze({
        /** V = I × R */
        voltage: (current, resistance) => current * resistance,
        /** I = V / R */
        current: (voltage, resistance) => resistance > 0 ? voltage / resistance : 0,
        /** R = V / I */
        resistance: (voltage, current) => current !== 0 ? voltage / current : Infinity,
        /** G = 1 / R (conductance, Siemens) */
        conductance: (resistance) => resistance > 0 ? 1 / resistance : 0,
    });

    // ─────────────────────────────────────────
    // 4. HUKUM DAYA LISTRIK (Joule's Law / Watt's Law)
    //    P = V × I = I²R = V²/R
    //    James Prescott Joule, 1841
    // ─────────────────────────────────────────
    const Power = Object.freeze({
        /** P = V × I */
        fromVI: (voltage, current) => Math.abs(voltage * current),
        /** P = I² × R */
        fromIR: (current, resistance) => current * current * resistance,
        /** P = V² / R */
        fromVR: (voltage, resistance) => resistance > 0 ? (voltage * voltage) / resistance : 0,
        /** Energi: E = P × t (Joule) */
        energy: (power, timeSeconds) => power * timeSeconds,
        /** Energi ke Watt-hour: Wh = J / 3600 */
        jouleToWh: (joules) => joules / 3600,
        /** Watt-hour ke Joule */
        whToJoule: (wh) => wh * 3600,
    });

    // ─────────────────────────────────────────
    // 5. HUKUM KIRCHHOFF (Kirchhoff's Laws)
    //    Gustav Kirchhoff, 1845
    // ─────────────────────────────────────────
    const Kirchhoff = Object.freeze({
        /**
         * KCL (Kirchhoff's Current Law):
         * Jumlah semua arus yang masuk ke suatu node = 0
         * ΣI_in = ΣI_out
         * @param {number[]} currentsIn - arus masuk (positif)
         * @param {number[]} currentsOut - arus keluar (positif)
         * @returns {boolean} true jika hukum terpenuhi
         */
        checkKCL: (currentsIn, currentsOut) => {
            const sumIn = currentsIn.reduce((a, b) => a + b, 0);
            const sumOut = currentsOut.reduce((a, b) => a + b, 0);
            return Math.abs(sumIn - sumOut) < SIM.MIN_CURRENT;
        },

        /**
         * KVL (Kirchhoff's Voltage Law):
         * Jumlah semua tegangan dalam loop tertutup = 0
         * ΣV_sources = ΣV_drops
         * @param {number[]} voltages - semua tegangan dalam loop (positif & negatif)
         * @returns {boolean} true jika hukum terpenuhi
         */
        checkKVL: (voltages) => {
            const sum = voltages.reduce((a, b) => a + b, 0);
            return Math.abs(sum) < SIM.MIN_VOLTAGE;
        },
    });

    // ─────────────────────────────────────────
    // 6. RESISTANSI SERI & PARALEL
    // ─────────────────────────────────────────
    const Resistance = Object.freeze({
        /**
         * Resistansi Seri: R_total = R1 + R2 + R3 + ...
         * @param {...number} resistances
         * @returns {number} total resistance
         */
        series: (...resistances) => resistances.reduce((a, b) => a + b, 0),

        /**
         * Resistansi Paralel: 1/R_total = 1/R1 + 1/R2 + ...
         * @param {...number} resistances
         * @returns {number} equivalent resistance
         */
        parallel: (...resistances) => {
            const valid = resistances.filter(r => r > 0 && isFinite(r));
            if (valid.length === 0) return Infinity;
            const totalConductance = valid.reduce((g, r) => g + 1 / r, 0);
            return totalConductance > 0 ? 1 / totalConductance : Infinity;
        },

        /**
         * Resistansi kawat: R = ρL/A
         * @param {number} resistivity - ρ (Ω·m), default tembaga
         * @param {number} length - panjang (meter)
         * @param {number} area - luas penampang (m²)
         */
        wire: (length, area, resistivity = CONST.COPPER_RESISTIVITY) =>
            (resistivity * length) / area,
    });

    // ─────────────────────────────────────────
    // 7. PEMBAGI TEGANGAN & ARUS (Voltage/Current Divider)
    // ─────────────────────────────────────────
    const Divider = Object.freeze({
        /**
         * Pembagi Tegangan: Vout = Vin × R2 / (R1 + R2)
         */
        voltage: (vIn, r1, r2) => (r1 + r2) > 0 ? vIn * r2 / (r1 + r2) : 0,

        /**
         * Pembagi Arus: I1 = I_total × R2 / (R1 + R2)
         */
        current: (iTotal, r1, r2) => (r1 + r2) > 0 ? iTotal * r2 / (r1 + r2) : 0,
    });

    // ─────────────────────────────────────────
    // 8. KAPASITOR & INDUKTOR (fundamental)
    // ─────────────────────────────────────────
    const Capacitor = Object.freeze({
        /** Muatan: Q = C × V */
        charge: (capacitance, voltage) => capacitance * voltage,
        /** Energi: E = ½CV² */
        energy: (capacitance, voltage) => 0.5 * capacitance * voltage * voltage,
        /** Reaktansi kapasitif: Xc = 1 / (2πfC) */
        reactance: (frequency, capacitance) =>
            (frequency > 0 && capacitance > 0) ? 1 / (2 * Math.PI * frequency * capacitance) : Infinity,
        /** Time constant RC: τ = R × C */
        timeConstantRC: (resistance, capacitance) => resistance * capacitance,
    });

    const Inductor = Object.freeze({
        /** Energi: E = ½LI² */
        energy: (inductance, current) => 0.5 * inductance * current * current,
        /** Reaktansi induktif: XL = 2πfL */
        reactance: (frequency, inductance) => 2 * Math.PI * frequency * inductance,
        /** Time constant RL: τ = L / R */
        timeConstantRL: (inductance, resistance) => resistance > 0 ? inductance / resistance : Infinity,
    });

    // ─────────────────────────────────────────
    // 9. BATERAI & SUMBER TEGANGAN
    // ─────────────────────────────────────────
    const Battery = Object.freeze({
        /**
         * Tegangan terminal: V_terminal = EMF - I × R_internal
         * (tegangan yang keluar dari baterai berkurang seiring arus)
         */
        terminalVoltage: (emf, current, internalR) => emf - current * internalR,

        /**
         * Arus short-circuit: I_sc = EMF / R_internal
         */
        shortCircuitCurrent: (emf, internalR) => internalR > 0 ? emf / internalR : Infinity,

        /**
         * Efisiensi baterai: η = V_terminal / EMF
         */
        efficiency: (emf, current, internalR) =>
            emf > 0 ? (emf - current * internalR) / emf : 0,

        /**
         * Sisa kapasitas (Wh) setelah discharge
         * @param {number} capacityWh - kapasitas awal (Wh)
         * @param {number} power - daya discharge (W)
         * @param {number} dt - waktu (detik)
         * @returns {number} sisa kapasitas (Wh)
         */
        remainingCapacity: (capacityWh, power, dt) =>
            Math.max(0, capacityWh - (power * dt / 3600)),

        /**
         * Tegangan baterai berdasarkan SOC (State of Charge)
         * Model linear: V = V_empty + SOC × (V_full - V_empty)
         */
        voltageFromSOC: (soc, vFull, vEmpty) =>
            vEmpty + Math.max(0, Math.min(1, soc)) * (vFull - vEmpty),
    });

    // ─────────────────────────────────────────
    // 10. DIODA & LED
    // ─────────────────────────────────────────
    const Diode = Object.freeze({
        /**
         * Model Shockley: I = Is × (e^(V/nVt) - 1)
         * @param {number} voltage - tegangan maju (V)
         * @param {number} satCurrent - arus saturasi Is (~1e-12 A)
         * @param {number} n - ideality factor (1-2)
         */
        shockleyCurrent: (voltage, satCurrent = 1e-12, n = 1) => {
            const vt = CONST.THERMAL_VOLTAGE;
            const exponent = Math.min(voltage / (n * vt), 40); // clamp overflow
            return satCurrent * (Math.exp(exponent) - 1);
        },

        /**
         * Cek forward bias: V_anode > V_cathode + V_forward
         */
        isForwardBiased: (vAnode, vCathode, vForward = SIM.DIODE_VF_SILICON) =>
            (vAnode - vCathode) >= vForward * 0.1,
    });

    // ─────────────────────────────────────────
    // 11. TRANSFORMATOR & INVERTER
    // ─────────────────────────────────────────
    const Transformer = Object.freeze({
        /**
         * Rasio transformator: V2/V1 = N2/N1
         */
        voltageRatio: (vIn, turnsRatio) => vIn * turnsRatio,

        /**
         * Konservasi daya: P_in = P_out / η
         * (daya input = daya output / efisiensi)
         */
        inputPower: (outputPower, efficiency = 0.9) =>
            efficiency > 0 ? outputPower / efficiency : Infinity,

        /**
         * AC RMS ke Peak: V_peak = V_rms × √2
         */
        rmsToPeak: (vRms) => vRms * Math.SQRT2,

        /**
         * AC Peak ke RMS: V_rms = V_peak / √2
         */
        peakToRms: (vPeak) => vPeak / Math.SQRT2,
    });

    // ─────────────────────────────────────────
    // 12. KONVERSI SATUAN
    // ─────────────────────────────────────────
    const Units = Object.freeze({
        // Prefix multipliers
        PICO:  1e-12,
        NANO:  1e-9,
        MICRO: 1e-6,
        MILLI: 1e-3,
        KILO:  1e3,
        MEGA:  1e6,
        GIGA:  1e9,

        /**
         * Auto-format nilai dengan prefix SI
         * @param {number} value - nilai dasar
         * @param {string} baseUnit - satuan dasar ('V', 'A', 'Ω', 'W', 'F', 'H')
         * @returns {{ val: string, unit: string }}
         */
        autoFormat: (value, baseUnit) => {
            const abs = Math.abs(value);
            if (abs >= 1e9)  return { val: (value / 1e9).toFixed(2),  unit: 'G' + baseUnit };
            if (abs >= 1e6)  return { val: (value / 1e6).toFixed(2),  unit: 'M' + baseUnit };
            if (abs >= 1e3)  return { val: (value / 1e3).toFixed(2),  unit: 'k' + baseUnit };
            if (abs >= 1)    return { val: value.toFixed(2),          unit: baseUnit };
            if (abs >= 1e-3) return { val: (value * 1e3).toFixed(1),  unit: 'm' + baseUnit };
            if (abs >= 1e-6) return { val: (value * 1e6).toFixed(0),  unit: 'µ' + baseUnit };
            if (abs >= 1e-9) return { val: (value * 1e9).toFixed(0),  unit: 'n' + baseUnit };
            return { val: '0', unit: baseUnit };
        },

        /** Watt-hour ke Ampere-hour: Ah = Wh / V */
        whToAh: (wh, voltage) => voltage > 0 ? wh / voltage : 0,
        /** Ampere-hour ke Watt-hour: Wh = Ah × V */
        ahToWh: (ah, voltage) => ah * voltage,
    });

    // ─────────────────────────────────────────
    // 13. GAUSS ELIMINATION (Linear Algebra)
    //     Solver universal untuk sistem persamaan linear
    // ─────────────────────────────────────────
    const LinearAlgebra = Object.freeze({
        /**
         * Solve Ax = b menggunakan Gauss elimination dengan partial pivoting
         * @param {number[][]} A - matrix koefisien (n×n), AKAN DIMODIFIKASI
         * @param {number[]} b - vektor konstanta (n), AKAN DIMODIFIKASI
         * @returns {number[]} x - solusi
         */
        solveGauss: (A, b) => {
            const n = b.length;
            // Forward elimination dengan partial pivoting
            for (let col = 0; col < n; col++) {
                let pivotRow = col;
                for (let row = col + 1; row < n; row++) {
                    if (Math.abs(A[row][col]) > Math.abs(A[pivotRow][col])) pivotRow = row;
                }
                [A[col], A[pivotRow]] = [A[pivotRow], A[col]];
                [b[col], b[pivotRow]] = [b[pivotRow], b[col]];
                if (Math.abs(A[col][col]) < SIM.FLOAT_EPSILON) continue;
                for (let row = col + 1; row < n; row++) {
                    const f = A[row][col] / A[col][col];
                    for (let k = col; k < n; k++) A[row][k] -= f * A[col][k];
                    b[row] -= f * b[col];
                }
            }
            // Back substitution
            const x = Array(n).fill(0);
            for (let i = n - 1; i >= 0; i--) {
                let sum = b[i];
                for (let j = i + 1; j < n; j++) sum -= A[i][j] * x[j];
                x[i] = Math.abs(A[i][i]) > SIM.FLOAT_EPSILON ? sum / A[i][i] : 0;
            }
            return x;
        },

        /**
         * Hitung resistansi ekuivalen antara 2 node dalam jaringan resistif
         * Menggunakan nodal analysis: inject 1A, ukur voltage → R = V/1
         * @param {Array<{a: number, b: number, g: number}>} edges - konduktansi antar node
         * @param {Set<number>} nodes - semua node dalam jaringan
         * @param {number} nodeP - node positif probe
         * @param {number} nodeN - node negatif probe (referensi)
         * @returns {number} equivalent resistance (Ω)
         */
        equivalentResistance: (edges, nodes, nodeP, nodeN) => {
            if (!nodes.has(nodeP) || !nodes.has(nodeN) || nodeP === nodeN) return 0;
            const nodeArr = [...nodes];
            const idx = {}; nodeArr.forEach((n, i) => idx[n] = i);
            const sz = nodeArr.length;
            // Build admittance matrix Y
            const Y = Array.from({ length: sz }, () => Array(sz).fill(0));
            edges.forEach(e => {
                const i = idx[e.a], j = idx[e.b];
                if (i === undefined || j === undefined) return;
                Y[i][i] += e.g; Y[j][j] += e.g;
                Y[i][j] -= e.g; Y[j][i] -= e.g;
            });
            // Remove reference node (nodeN), build reduced system
            const ref = idx[nodeN];
            const map = [];
            for (let i = 0; i < sz; i++) if (i !== ref) map.push(i);
            const n = map.length;
            if (n === 0) return 0;
            const A = Array.from({ length: n }, (_, ri) => map.map(ci => Y[map[ri]][ci]));
            const b = map.map(ri => nodeArr[ri] === nodeP ? 1 : 0);
            const x = LinearAlgebra.solveGauss(A, b);
            const pIdx = map.indexOf(idx[nodeP]);
            return pIdx >= 0 ? Math.abs(x[pIdx]) : 0;
        },
    });

    // ─────────────────────────────────────────
    // 14. THEVENIN & NORTON EQUIVALENTS
    // ─────────────────────────────────────────
    const Equivalent = Object.freeze({
        /**
         * Thevenin: Vth = Voc (open-circuit voltage), Rth = Voc / Isc
         */
        thevenin: (vOpenCircuit, iShortCircuit) => ({
            vTh: vOpenCircuit,
            rTh: iShortCircuit !== 0 ? vOpenCircuit / iShortCircuit : Infinity,
        }),

        /**
         * Norton: In = Isc (short-circuit current), Rn = Voc / Isc
         */
        norton: (vOpenCircuit, iShortCircuit) => ({
            iN: iShortCircuit,
            rN: iShortCircuit !== 0 ? vOpenCircuit / iShortCircuit : Infinity,
        }),

        /**
         * Maximum Power Transfer: P_max saat R_load = R_source
         * P_max = V²/(4R)
         */
        maxPowerTransfer: (vSource, rSource) =>
            rSource > 0 ? (vSource * vSource) / (4 * rSource) : 0,
    });

    // ─────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────
    return Object.freeze({
        CONST,
        SIM,
        Ohm,
        Power,
        Kirchhoff,
        Resistance,
        Divider,
        Capacitor,
        Inductor,
        Battery,
        Diode,
        Transformer,
        Units,
        LinearAlgebra,
        Equivalent,
    });
})();
