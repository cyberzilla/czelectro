// CZElectro — Sound Engine Module (Web Audio API)
(function(CZ) {
    'use strict';

    // audioCtx and activeSounds are initialized in state.js

    CZ.getAudioCtx = function() {
        if (!CZ.audioCtx) CZ.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (CZ.audioCtx.state === 'suspended') CZ.audioCtx.resume();
        return CZ.audioCtx;
    };

    CZ.SFX = {
        // One-shot: component burn/break
        burn() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noise = ctx.createBufferSource();
            // White noise burst
            const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
            noise.buffer = buf;
            const nGain = ctx.createGain();
            nGain.gain.setValueAtTime(0.3, ctx.currentTime);
            noise.connect(nGain).connect(ctx.destination);
            noise.start(); noise.stop(ctx.currentTime + 0.15);
            // Pop tone
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain).connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.15);
        },

        // One-shot: fuse blow — sharp snap
        fuseSnap() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square'; osc.frequency.setValueAtTime(2000, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.connect(gain).connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.1);
        },

        // One-shot: switch click
        switchClick() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain).connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.04);
        },

        // One-shot: wire connect snap
        wireSnap() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(900, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
            osc.connect(gain).connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.06);
        },

        // One-shot: relay click
        relayClick() {
            if (CZ.isMuted) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square'; osc.frequency.setValueAtTime(300, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            osc.connect(gain).connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.03);
        },

        // Looping: motor hum — frequency varies with speed
        motorStart(id, speedRatio) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return; // already playing
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(60 + speedRatio * 180, ctx.currentTime);
            gain.gain.setValueAtTime(0.04 + speedRatio * 0.06, ctx.currentTime);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            CZ.activeSounds[id] = { osc, gain };
        },
        motorUpdate(id, speedRatio) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            const ctx = CZ.getAudioCtx();
            s.osc.frequency.setTargetAtTime(60 + speedRatio * 180, ctx.currentTime, 0.1);
            s.gain.gain.setTargetAtTime(0.04 + speedRatio * 0.06, ctx.currentTime, 0.1);
        },

        // Looping: buzzer tone
        buzzerStart(id) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square'; osc.frequency.value = 440;
            gain.gain.value = 0.06;
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            CZ.activeSounds[id] = { osc, gain };
        },

        // Looping: speaker tone — pitch varies with voltage
        speakerStart(id, voltage) {
            if (CZ.isMuted) return;
            if (CZ.activeSounds[id]) return;
            const ctx = CZ.getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200 + voltage * 80, ctx.currentTime);
            gain.gain.value = 0.05;
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            CZ.activeSounds[id] = { osc, gain };
        },
        speakerUpdate(id, voltage) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            const ctx = CZ.getAudioCtx();
            s.osc.frequency.setTargetAtTime(200 + voltage * 80, ctx.currentTime, 0.1);
        },

        // Stop a looping sound
        stop(id) {
            const s = CZ.activeSounds[id];
            if (!s) return;
            try {
                s.gain.gain.setTargetAtTime(0, CZ.getAudioCtx().currentTime, 0.05);
                setTimeout(() => { try { s.osc.stop(); } catch(e) {} }, 100);
            } catch(e) {}
            delete CZ.activeSounds[id];
        },

        // Stop all looping sounds
        stopAll() {
            Object.keys(CZ.activeSounds).forEach(id => CZ.SFX.stop(id));
        }
    };

})(window.CZ);
