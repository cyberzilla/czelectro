// CZElectro — Visual Effects Module
// Handles: spark particles, smoke puffs, burn notices
(function(CZ) {
    'use strict';

    // ── Spark & Smoke Particles ──
    CZ.spawnSparks = function(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - CZ.wCont.getBoundingClientRect().left;
        const cy = rect.top + rect.height / 2 - CZ.wCont.getBoundingClientRect().top;

        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark-particle';
            const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
            const dist = 20 + Math.random() * 40;
            spark.style.cssText = `left:${cx}px;top:${cy}px;--sx:${Math.cos(angle) * dist}px;--sy:${Math.sin(angle) * dist}px;
                background:${['#fbbf24','#ef4444','#fff'][i%3]};animation-delay:${Math.random()*0.1}s`;
            CZ.wCont.appendChild(spark);
            setTimeout(() => spark.remove(), 700);
        }
        for (let i = 0; i < 3; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-puff';
            smoke.style.cssText = `left:${cx - 15 + Math.random()*30}px;top:${cy - 10}px;animation-delay:${i*0.15}s`;
            CZ.wCont.appendChild(smoke);
            setTimeout(() => smoke.remove(), 1500);
        }
    };

    // ── Burn Notice Popup ──
    CZ.showBurnNotice = function(el, amps, max) {
        const notice = document.createElement('div');
        notice.className = 'burn-notice';
        const fmtAmps = EL.Units.autoFormat(amps, 'A');
        const fmtMax = EL.Units.autoFormat(max, 'A');
        notice.innerHTML = `${CZ.t('effectBurnt')} ${fmtAmps.val}${fmtAmps.unit} > ${fmtMax.val}${fmtMax.unit} max`;
        el.appendChild(notice);
        setTimeout(() => notice.remove(), 3000);
    };

})(window.CZ);
