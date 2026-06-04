// CZElectro — Sound Engine Module (Web Audio API)
// Enhanced SFX with layered sounds, filters, and realistic effects
(function(CZ) {
    'use strict';

    CZ.getAudioCtx = function() {
        if (!CZ.audioCtx) CZ.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (CZ.audioCtx.state === 'suspended') CZ.audioCtx.resume();
        return CZ.audioCtx;
    };

    // ── Utility: create white noise buffer ──
    function noiseBuffer(ctx, duration) {
        const len = Math.floor(ctx.sampleRate * duration);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        return buf;
    }

    // ── Utility: simple convolver reverb ──
    let _reverbBuf = null;
    function getReverb(ctx) {
        if (_reverbBuf) return _reverbBuf;
        const len = Math.floor(ctx.sampleRate * 0.3);
        const buf = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const d = buf.getChannelData(ch);
            for (let i = 0; i < len; i++) {
                d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
            }
        }
        _reverbBuf = buf;
        return buf;
    }

    // ── Utility: play noise burst with envelope ──
    function playNoise(ctx, dest, duration, volume, decay) {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer(ctx, duration);
        const g = ctx.createGain();
        const t = ctx.currentTime;
        g.gain.setValueAtTime(volume, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + (decay || duration));
        src.connect(g).connect(dest);
        src.start(); src.stop(t + duration);
        return src;
    }

    // ── Utility: play tone with envelope ──
    function playTone(ctx, dest, type, freq, freqEnd, duration, volume, attack) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const t = ctx.currentTime;
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
        if (attack) {
            g.gain.setValueAtTime(0.001, t);
            g.gain.linearRampToValueAtTime(volume, t + attack);
            g.gain.exponentialRampToValueAtTime(0.001, t + duration);
        } else {
            g.gain.setValueAtTime(volume, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + duration);
        }
        osc.connect(g).connect(dest);
        osc.start(); osc.stop(t + duration);
        return osc;
    }

    CZ.SFX = {

        // ══════════════════════════════════════
        // ONE-SHOT: Component burn / explosion
        // ══════════════════════════════════════
        burn() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;

            // Master bus with compression
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.35, t);
            const comp = ctx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-12, t);
            comp.ratio.setValueAtTime(8, t);
            master.connect(comp).connect(ctx.destination);

            // Layer 1: Initial POP — short sharp transient
            const pop = ctx.createOscillator();
            const popG = ctx.createGain();
            pop.type = 'sawtooth';
            pop.frequency.setValueAtTime(1200, t);
            pop.frequency.exponentialRampToValueAtTime(60, t + 0.08);
            popG.gain.setValueAtTime(0.8, t);
            popG.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            pop.connect(popG).connect(master);
            pop.start(t); pop.stop(t + 0.1);

            // Layer 2: Crackle — filtered noise burst
            const nBuf = noiseBuffer(ctx, 0.25);
            const noise = ctx.createBufferSource();
            noise.buffer = nBuf;
            const nGain = ctx.createGain();
            nGain.gain.setValueAtTime(0.5, t);
            nGain.gain.setValueAtTime(0.6, t + 0.02);
            nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            const hpf = ctx.createBiquadFilter();
            hpf.type = 'highpass'; hpf.frequency.setValueAtTime(800, t);
            hpf.frequency.exponentialRampToValueAtTime(2000, t + 0.2);
            noise.connect(hpf).connect(nGain).connect(master);
            noise.start(t); noise.stop(t + 0.25);

            // Layer 3: Low rumble — sub bass impact
            const sub = ctx.createOscillator();
            const subG = ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(80, t);
            sub.frequency.exponentialRampToValueAtTime(30, t + 0.2);
            subG.gain.setValueAtTime(0.4, t);
            subG.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            sub.connect(subG).connect(master);
            sub.start(t); sub.stop(t + 0.2);

            // Layer 4: Sizzle tail — high pitched decay
            const sizzle = ctx.createBufferSource();
            sizzle.buffer = noiseBuffer(ctx, 0.4);
            const sG = ctx.createGain();
            sG.gain.setValueAtTime(0.001, t);
            sG.gain.linearRampToValueAtTime(0.15, t + 0.05);
            sG.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            const bpf = ctx.createBiquadFilter();
            bpf.type = 'bandpass'; bpf.frequency.value = 4000; bpf.Q.value = 2;
            sizzle.connect(bpf).connect(sG).connect(master);
            sizzle.start(t + 0.03); sizzle.stop(t + 0.4);
        },

        // ══════════════════════════════════════
        // ONE-SHOT: Fuse blow — sharp electrical snap
        // ══════════════════════════════════════
        fuseSnap() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;

            // Sharp initial crack
            const crack = ctx.createOscillator();
            const cG = ctx.createGain();
            crack.type = 'square';
            crack.frequency.setValueAtTime(3000, t);
            crack.frequency.exponentialRampToValueAtTime(200, t + 0.05);
            cG.gain.setValueAtTime(0.25, t);
            cG.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            crack.connect(cG).connect(ctx.destination);
            crack.start(t); crack.stop(t + 0.06);

            // Metallic ring
            const ring = ctx.createOscillator();
            const rG = ctx.createGain();
            ring.type = 'sine';
            ring.frequency.setValueAtTime(1800, t);
            ring.frequency.exponentialRampToValueAtTime(600, t + 0.12);
            rG.gain.setValueAtTime(0.08, t + 0.01);
            rG.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            ring.connect(rG).connect(ctx.destination);
            ring.start(t + 0.01); ring.stop(t + 0.12);

            // Tiny noise tail
            playNoise(ctx, ctx.destination, 0.08, 0.1, 0.08);
        },

        // ══════════════════════════════════════
        // ONE-SHOT: Switch click — satisfying mechanical click
        // ══════════════════════════════════════
        switchClick() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;

            // Click body — short percussive hit
            const click = ctx.createOscillator();
            const cG = ctx.createGain();
            click.type = 'sine';
            click.frequency.setValueAtTime(1800, t);
            click.frequency.exponentialRampToValueAtTime(400, t + 0.015);
            cG.gain.setValueAtTime(0.15, t);
            cG.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
            click.connect(cG).connect(ctx.destination);
            click.start(t); click.stop(t + 0.025);

            // Mechanical snap — tiny noise transient
            const snap = ctx.createBufferSource();
            snap.buffer = noiseBuffer(ctx, 0.012);
            const sG = ctx.createGain();
            sG.gain.setValueAtTime(0.12, t);
            sG.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
            const hpf = ctx.createBiquadFilter();
            hpf.type = 'highpass'; hpf.frequency.value = 3000;
            snap.connect(hpf).connect(sG).connect(ctx.destination);
            snap.start(t); snap.stop(t + 0.012);

            // Subtle resonance tail
            const tail = ctx.createOscillator();
            const tG = ctx.createGain();
            tail.type = 'sine';
            tail.frequency.setValueAtTime(600, t + 0.01);
            tG.gain.setValueAtTime(0.03, t + 0.01);
            tG.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
            tail.connect(tG).connect(ctx.destination);
            tail.start(t + 0.01); tail.stop(t + 0.04);
        },

        // ══════════════════════════════════════
        // ONE-SHOT: Wire connect — metallic snap
        // ══════════════════════════════════════
        wireSnap() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;

            // Metallic ting
            const ting = ctx.createOscillator();
            const tG = ctx.createGain();
            ting.type = 'sine';
            ting.frequency.setValueAtTime(2200, t);
            ting.frequency.exponentialRampToValueAtTime(800, t + 0.06);
            tG.gain.setValueAtTime(0.1, t);
            tG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            ting.connect(tG).connect(ctx.destination);
            ting.start(t); ting.stop(t + 0.08);

            // Harmonic overtone
            const h2 = ctx.createOscillator();
            const h2G = ctx.createGain();
            h2.type = 'sine';
            h2.frequency.setValueAtTime(4400, t);
            h2.frequency.exponentialRampToValueAtTime(1600, t + 0.04);
            h2G.gain.setValueAtTime(0.04, t);
            h2G.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            h2.connect(h2G).connect(ctx.destination);
            h2.start(t); h2.stop(t + 0.05);

            // Click transient
            const n = ctx.createBufferSource();
            n.buffer = noiseBuffer(ctx, 0.008);
            const nG = ctx.createGain();
            nG.gain.setValueAtTime(0.08, t);
            nG.gain.exponentialRampToValueAtTime(0.001, t + 0.008);
            n.connect(nG).connect(ctx.destination);
            n.start(t); n.stop(t + 0.008);
        },

        // ══════════════════════════════════════
        // ONE-SHOT: Relay click — electromagnetic clunk
        // ══════════════════════════════════════
        relayClick() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;

            // Impact body — low thud
            const thud = ctx.createOscillator();
            const thG = ctx.createGain();
            thud.type = 'sine';
            thud.frequency.setValueAtTime(400, t);
            thud.frequency.exponentialRampToValueAtTime(120, t + 0.04);
            thG.gain.setValueAtTime(0.15, t);
            thG.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            thud.connect(thG).connect(ctx.destination);
            thud.start(t); thud.stop(t + 0.05);

            // Contact snap — metallic high
            const snap = ctx.createOscillator();
            const sG = ctx.createGain();
            snap.type = 'square';
            snap.frequency.setValueAtTime(2500, t);
            snap.frequency.exponentialRampToValueAtTime(800, t + 0.02);
            sG.gain.setValueAtTime(0.08, t);
            sG.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
            snap.connect(sG).connect(ctx.destination);
            snap.start(t); snap.stop(t + 0.025);

            // Mechanical rattle (micro noise)
            playNoise(ctx, ctx.destination, 0.02, 0.06, 0.02);
        },

        // ══════════════════════════════════════
        // LOOPING: Motor hum — rich harmonic motor sound
        // ══════════════════════════════════════
        motorStart(id, speedRatio) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            const baseFreq = 50 + speedRatio * 200;
            const vol = 0.03 + speedRatio * 0.05;

            // Master bus
            const master = ctx.createGain();
            master.gain.setValueAtTime(0, t);
            master.gain.linearRampToValueAtTime(vol, t + 0.15);
            master.connect(ctx.destination);

            // Fundamental — sawtooth for harmonics
            const osc1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(baseFreq, t);
            g1.gain.value = 0.5;
            // Low-pass to soften
            const lpf = ctx.createBiquadFilter();
            lpf.type = 'lowpass'; lpf.frequency.value = baseFreq * 4; lpf.Q.value = 1;
            osc1.connect(lpf).connect(g1).connect(master);
            osc1.start(t);

            // 2nd harmonic — adds body
            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(baseFreq * 2, t);
            g2.gain.value = 0.25;
            osc2.connect(g2).connect(master);
            osc2.start(t);

            // Noise layer — mechanical texture
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer(ctx, 4);
            noise.loop = true;
            const nG = ctx.createGain();
            nG.gain.value = 0.08;
            const nbpf = ctx.createBiquadFilter();
            nbpf.type = 'bandpass'; nbpf.frequency.value = baseFreq * 3; nbpf.Q.value = 3;
            noise.connect(nbpf).connect(nG).connect(master);
            noise.start(t);

            CZ.activeSounds[id] = { osc: osc1, osc2, noise, gain: master, lpf, nbpf, g1, g2 };
        },

        motorUpdate(id, speedRatio) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            const baseFreq = 50 + speedRatio * 200;
            const vol = 0.03 + speedRatio * 0.05;
            s.osc.frequency.setTargetAtTime(baseFreq, t, 0.1);
            if (s.osc2) s.osc2.frequency.setTargetAtTime(baseFreq * 2, t, 0.1);
            s.gain.gain.setTargetAtTime(vol, t, 0.1);
            if (s.lpf) s.lpf.frequency.setTargetAtTime(baseFreq * 4, t, 0.1);
            if (s.nbpf) s.nbpf.frequency.setTargetAtTime(baseFreq * 3, t, 0.1);
        },

        // ══════════════════════════════════════
        // LOOPING: Buzzer — pulsing alarm tone
        // ══════════════════════════════════════
        buzzerStart(id) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;

            const master = ctx.createGain();
            master.gain.value = 0.06;
            master.connect(ctx.destination);

            // Main square wave
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.value = 440;

            // Pulsing effect via LFO on gain
            const lfo = ctx.createOscillator();
            const lfoG = ctx.createGain();
            lfo.type = 'sine'; lfo.frequency.value = 8;
            lfoG.gain.value = 0.03;
            lfo.connect(lfoG).connect(master.gain);
            lfo.start(t);

            // Slight detuned layer for richness
            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'square';
            osc2.frequency.value = 443; // slight detune
            g2.gain.value = 0.3;
            osc2.connect(g2).connect(master);
            osc2.start(t);

            osc.connect(master);
            osc.start(t);

            CZ.activeSounds[id] = { osc, osc2, lfo, gain: master };
        },

        // ══════════════════════════════════════
        // LOOPING: Speaker — warm sine with harmonics
        // ══════════════════════════════════════
        speakerStart(id, voltage) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            const freq = 200 + voltage * 80;

            const master = ctx.createGain();
            master.gain.setValueAtTime(0, t);
            master.gain.linearRampToValueAtTime(0.05, t + 0.1);
            master.connect(ctx.destination);

            // Main tone
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            osc.connect(master);
            osc.start(t);

            // Soft harmonic
            const h = ctx.createOscillator();
            const hG = ctx.createGain();
            h.type = 'sine';
            h.frequency.setValueAtTime(freq * 2, t);
            hG.gain.value = 0.15;
            h.connect(hG).connect(master);
            h.start(t);

            CZ.activeSounds[id] = { osc, osc2: h, gain: master };
        },

        speakerUpdate(id, voltage) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            const freq = 200 + voltage * 80;
            s.osc.frequency.setTargetAtTime(freq, t, 0.1);
            if (s.osc2) s.osc2.frequency.setTargetAtTime(freq * 2, t, 0.1);
        },

        // ══════════════════════════════════════
        // LOOPING: Fan whir — smooth airflow sound
        // ══════════════════════════════════════
        fanStart(id, speedRatio) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            const vol = 0.02 + speedRatio * 0.04;

            const master = ctx.createGain();
            master.gain.setValueAtTime(0, t);
            master.gain.linearRampToValueAtTime(vol, t + 0.3);
            master.connect(ctx.destination);

            // Filtered noise — wind/airflow texture
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer(ctx, 4);
            noise.loop = true;
            const bpf = ctx.createBiquadFilter();
            bpf.type = 'bandpass';
            bpf.frequency.value = 300 + speedRatio * 400;
            bpf.Q.value = 0.8;
            noise.connect(bpf).connect(master);
            noise.start(t);

            // Low motor hum (subtle)
            const osc = ctx.createOscillator();
            const oG = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(40 + speedRatio * 80, t);
            oG.gain.value = 0.3;
            osc.connect(oG).connect(master);
            osc.start(t);

            // Blade whoosh — modulated with LFO
            const lfo = ctx.createOscillator();
            const lfoG = ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = 3 + speedRatio * 12; // blade pass frequency
            lfoG.gain.value = 0.015;
            lfo.connect(lfoG).connect(master.gain);
            lfo.start(t);

            CZ.activeSounds[id] = { osc, noise, lfo, gain: master, bpf };
        },

        fanUpdate(id, speedRatio) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            const vol = 0.02 + speedRatio * 0.04;
            s.gain.gain.setTargetAtTime(vol, t, 0.15);
            s.osc.frequency.setTargetAtTime(40 + speedRatio * 80, t, 0.15);
            if (s.bpf) s.bpf.frequency.setTargetAtTime(300 + speedRatio * 400, t, 0.15);
            if (s.lfo) s.lfo.frequency.setTargetAtTime(3 + speedRatio * 12, t, 0.15);
        },

        // ══════════════════════════════════════
        // Stop / StopAll
        // ══════════════════════════════════════
        stop(id) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            const ctx = CZ.getAudioCtx();
            const t = ctx.currentTime;
            try {
                // Fade out smoothly
                if (s.gain) s.gain.gain.setTargetAtTime(0, t, 0.05);
                setTimeout(() => {
                    try {
                        if (s.osc) s.osc.stop();
                        if (s.osc2) s.osc2.stop();
                        if (s.noise) s.noise.stop();
                        if (s.lfo) s.lfo.stop();
                    } catch(e) {}
                }, 120);
            } catch(e) {}
            delete CZ.activeSounds[id];
        },

        stopAll() {
            Object.keys(CZ.activeSounds).forEach(id => CZ.SFX.stop(id));
        }
    };

})(window.CZ);
