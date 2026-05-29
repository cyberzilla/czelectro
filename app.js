// CZElectro — Main Application
document.addEventListener('DOMContentLoaded', () => {
    // ── State ──
    let deployed = [], wires = [], counter = 0, zoom = 1;
    let isDragging = false, dragEl = null, dragOX = 0, dragOY = 0;
    let dragStartX = 0, dragStartY = 0, dragMoved = false;
    let activeTerm = null, showGrid = true, panX = 0, panY = 0;
    let isPanning = false, panStartX = 0, panStartY = 0, panStartPX = 0, panStartPY = 0;
    let activeWireDrag = null;
    let selRect = null, selStartX = 0, selStartY = 0; // selection rectangle
    let selectedIds = new Set();
    const GRID = 10, DRAG_THRESHOLD = 5;
    let isMuted = false;

    // ── Battery Simulation State ──
    let simSpeed = 0;  // 0=paused, 1=1x, 10=10x, 60=60x
    let simInterval = null;
    let simElapsedMin = 0; // simulated minutes elapsed
    // simMode removed — simulation uses automatic 24h solar cycle based on simElapsedMin
    let simTotalLoadW = 0; // tracked from evaluateCircuit
    let simTotalSrcW = 0;  // tracked from evaluateCircuit

    // ── Sound Engine (Web Audio API) ──
    let audioCtx = null;
    const activeSounds = {}; // track looping sounds by component id

    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    const SFX = {
        // One-shot: component burn/break
        burn() {
            if (isMuted) return;
            const ctx = getAudioCtx();
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
            if (isMuted) return;
            const ctx = getAudioCtx();
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
            if (isMuted) return;
            const ctx = getAudioCtx();
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
            if (isMuted) return;
            const ctx = getAudioCtx();
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
            if (isMuted) return;
            const ctx = getAudioCtx();
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
            if (isMuted) return;
            if (activeSounds[id]) return; // already playing
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(60 + speedRatio * 180, ctx.currentTime);
            gain.gain.setValueAtTime(0.04 + speedRatio * 0.06, ctx.currentTime);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            activeSounds[id] = { osc, gain };
        },
        motorUpdate(id, speedRatio) {
            const s = activeSounds[id];
            if (!s) return;
            const ctx = getAudioCtx();
            s.osc.frequency.setTargetAtTime(60 + speedRatio * 180, ctx.currentTime, 0.1);
            s.gain.gain.setTargetAtTime(0.04 + speedRatio * 0.06, ctx.currentTime, 0.1);
        },

        // Looping: buzzer tone
        buzzerStart(id) {
            if (isMuted) return;
            if (activeSounds[id]) return;
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square'; osc.frequency.value = 440;
            gain.gain.value = 0.06;
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            activeSounds[id] = { osc, gain };
        },

        // Looping: speaker tone — pitch varies with voltage
        speakerStart(id, voltage) {
            if (isMuted) return;
            if (activeSounds[id]) return;
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200 + voltage * 80, ctx.currentTime);
            gain.gain.value = 0.05;
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            activeSounds[id] = { osc, gain };
        },
        speakerUpdate(id, voltage) {
            const s = activeSounds[id];
            if (!s) return;
            const ctx = getAudioCtx();
            s.osc.frequency.setTargetAtTime(200 + voltage * 80, ctx.currentTime, 0.1);
        },

        // Stop a looping sound
        stop(id) {
            const s = activeSounds[id];
            if (!s) return;
            try {
                s.gain.gain.setTargetAtTime(0, getAudioCtx().currentTime, 0.05);
                setTimeout(() => { try { s.osc.stop(); } catch(e) {} }, 100);
            } catch(e) {}
            delete activeSounds[id];
        },

        // Stop all looping sounds
        stopAll() {
            Object.keys(activeSounds).forEach(id => SFX.stop(id));
        }
    };

    // ── DOM refs ──
    const listEl = document.getElementById('component-list');
    const ws = document.getElementById('workspace');
    const wCont = document.getElementById('workspace-container');
    const wiresG = document.getElementById('wires-group');
    const tmpWire = document.getElementById('temp-wire');
    const wireLayer = document.getElementById('wire-layer');
    const gridCanvas = document.getElementById('grid-canvas');
    const tooltip = document.getElementById('tooltip');

    // ── Grid Drawing ──
    function drawGrid() {
        const ctx = gridCanvas.getContext('2d');
        gridCanvas.width = wCont.clientWidth;
        gridCanvas.height = wCont.clientHeight;
        if (!showGrid) { ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height); return; }
        ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        const step = 20 * zoom;
        const offX = ((panX % step) + step) % step;
        const offY = ((panY % step) + step) % step;
        // Draw grid lines
        ctx.strokeStyle = 'rgba(100, 140, 120, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = offX; x < gridCanvas.width; x += step) {
            ctx.moveTo(x, 0); ctx.lineTo(x, gridCanvas.height);
        }
        for (let y = offY; y < gridCanvas.height; y += step) {
            ctx.moveTo(0, y); ctx.lineTo(gridCanvas.width, y);
        }
        ctx.stroke();
        // Major grid every 5 steps
        const major = step * 5;
        const mOffX = ((panX % major) + major) % major;
        const mOffY = ((panY % major) + major) % major;
        ctx.strokeStyle = 'rgba(100, 180, 140, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = mOffX; x < gridCanvas.width; x += major) {
            ctx.moveTo(x, 0); ctx.lineTo(x, gridCanvas.height);
        }
        for (let y = mOffY; y < gridCanvas.height; y += major) {
            ctx.moveTo(0, y); ctx.lineTo(gridCanvas.width, y);
        }
        ctx.stroke();
    }

    // ── Sidebar Render ──
    let activeCategory = 'all';
    function renderSidebar() {
        listEl.innerHTML = '';
        const catOrder = { source: 0, passive: 1, control: 2, output: 3 };
        const sorted = [...COMPONENTS].sort((a, b) => (catOrder[a.category] ?? 9) - (catOrder[b.category] ?? 9) || a.name.localeCompare(b.name));
        const filtered = activeCategory === 'all' ? sorted : sorted.filter(c => c.category === activeCategory);
        filtered.forEach(tmpl => {
            const item = document.createElement('div');
            item.className = 'sidebar-item';
            item.dataset.id = tmpl.id;
            item.innerHTML = `<div class="item-icon">${tmpl.svg}</div>
                <div class="item-details"><span class="item-name">${tmpl.name}</span><span class="item-spec">${tmpl.spec}</span></div>`;
            listEl.appendChild(item);
        });
    }

    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.cat-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            activeCategory = tab.dataset.cat;
            renderSidebar();
        });
    });
    renderSidebar();

    // ── Zoom & Pan ──
    function applyTransform() {
        // Wire layer is inside workspace, so only one transform needed
        ws.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
        document.getElementById('zoom-label').textContent = Math.round(zoom * 100) + '%';
        drawGrid();
    }

    document.getElementById('btn-zoom-in').onclick = () => { zoom = Math.min(3, zoom + 0.1); applyTransform(); saveState(); };
    document.getElementById('btn-zoom-out').onclick = () => { zoom = Math.max(0.2, zoom - 0.1); applyTransform(); saveState(); };
    document.getElementById('btn-fit').onclick = () => { zoom = 1; panX = 0; panY = 0; applyTransform(); saveState(); };
    document.getElementById('btn-grid').onclick = (e) => {
        showGrid = !showGrid;
        e.currentTarget.classList.toggle('active', showGrid);
        drawGrid();
    };
    document.getElementById('btn-clear').onclick = () => {
        if (!deployed.length) return;
        if (!confirm('Hapus semua komponen dan kabel?')) return;
        ws.querySelectorAll('.board-component').forEach(el => el.remove());
        deployed = []; wires = []; counter = 0;
        SFX.stopAll();
        renderWires(); evaluateCircuit();
        localStorage.removeItem('czelectro_state');
    };
    document.getElementById('btn-rotate').onclick = () => {
        if (selectedIds.size > 0) {
            selectedIds.forEach(cid => rotateComponent(cid));
        }
    };
    document.getElementById('btn-mute').onclick = () => {
        isMuted = !isMuted;
        const btn = document.getElementById('btn-mute');
        btn.textContent = isMuted ? '🔇' : '🔊';
        btn.classList.toggle('active', isMuted);
        if (isMuted) {
            SFX.stopAll();
        } else {
            evaluateCircuit(); // re-evaluate to restart sounds
        }
    };

    wCont.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        zoom = Math.min(3, Math.max(0.2, zoom + delta));
        applyTransform(); saveState();
    }, { passive: false });

    // Middle-click pan
    wCont.addEventListener('mousedown', e => {
        if (e.button === 1) {
            e.preventDefault(); isPanning = true;
            panStartX = e.clientX; panStartY = e.clientY;
            panStartPX = panX; panStartPY = panY;
            wCont.style.cursor = 'move';
        }
    });

    // ── Coordinate helpers ──
    function clientToWorkspace(cx, cy) {
        const r = wCont.getBoundingClientRect();
        return { x: (cx - r.left - panX) / zoom, y: (cy - r.top - panY) / zoom };
    }

    // ── Rotation helper ──
    function rotatePoint(px, py, cx, cy, angleDeg) {
        let cos, sin;
        switch (((angleDeg % 360) + 360) % 360) {
            case 0:   cos = 1;  sin = 0;  break;
            case 90:  cos = 0;  sin = 1;  break;
            case 180: cos = -1; sin = 0;  break;
            case 270: cos = 0;  sin = -1; break;
            default:
                const rad = angleDeg * Math.PI / 180;
                cos = Math.cos(rad); sin = Math.sin(rad);
        }
        const dx = px - cx, dy = py - cy;
        return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
    }

    function getAbsPos(comp, term) {
        const tmpl = COMPONENTS.find(t => t.id === comp.type);
        if (!tmpl || !comp.rotation) {
            return { x: comp.x + term.x, y: comp.y + term.y };
        }
        const cx = tmpl.width / 2, cy = tmpl.height / 2;
        const rotated = rotatePoint(term.x, term.y, cx, cy, comp.rotation);
        return { x: comp.x + rotated.x, y: comp.y + rotated.y };
    }

    // ── Spawn Component ──
    function spawnComponent(tmplId, cx, cy) {
        const tmpl = COMPONENTS.find(t => t.id === tmplId);
        if (!tmpl) return;
        counter++;
        const uId = `c_${tmplId}_${counter}`;
        const pos = clientToWorkspace(cx, cy);
        let x = Math.round((pos.x - tmpl.width / 2) / GRID) * GRID;
        let y = Math.round((pos.y - tmpl.height / 2) / GRID) * GRID;

        const el = document.createElement('div');
        el.className = 'board-component';
        el.id = uId;
        el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${x}px;top:${y}px;`;
        el.innerHTML = tmpl.svg;

        const comp = {
            id: uId, type: tmpl.id, voltage: tmpl.voltage,
            baseResistance: tmpl.resistance, currentResistance: tmpl.resistance,
            maxCurrent: tmpl.maxCurrent || null, glowGradient: tmpl.glowGradient || null,
            isClosed: false, isBroken: false, rotation: 0, x, y,
            terminals: JSON.parse(JSON.stringify(tmpl.terminals))
        };

        comp.terminals.forEach((term, idx) => {
            const tEl = document.createElement('div');
            tEl.className = 'terminal';
            tEl.style.left = `${term.x - 8}px`;
            tEl.style.top = `${term.y - 8}px`;
            tEl.dataset.cid = uId;
            tEl.dataset.tidx = idx;
            tEl.dataset.label = term.label || '';
            el.appendChild(tEl);
        });

        ws.appendChild(el);
        // Initialize battery level if component has capacity
        const tmplCap = COMPONENTS.find(t => t.id === comp.type);
        if (tmplCap?.capacityWh) {
            comp.batteryCapacity = tmplCap.capacityWh;
            comp.batteryLevel = comp.batteryLevel ?? tmplCap.capacityWh; // preserve on load
        }
        deployed.push(comp);
        updateStatus();
        return comp;
    }

    // ── Smart Wire Path Generation ──
    // Detects terminal direction based on position relative to component center,
    // then generates a natural cubic bezier curve that exits/enters from the correct side.
    function getTerminalDir(comp, termIdx) {
        const tmpl = COMPONENTS.find(t => t.id === comp.type);
        if (!tmpl) return { dx: 0, dy: 1 };
        const term = comp.terminals[termIdx];
        const cx = tmpl.width / 2, cy = tmpl.height / 2;
        const tx = term.x - cx, ty = term.y - cy;
        let dir;
        if (Math.abs(tx) > Math.abs(ty)) {
            dir = tx > 0 ? { dx: 1, dy: 0 } : { dx: -1, dy: 0 };
        } else {
            dir = ty > 0 ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 };
        }
        // Rotate direction vector if component is rotated
        if (comp.rotation) {
            const rad = comp.rotation * Math.PI / 180;
            const cos = Math.cos(rad), sin = Math.sin(rad);
            dir = { dx: Math.round(dir.dx * cos - dir.dy * sin), dy: Math.round(dir.dx * sin + dir.dy * cos) };
        }
        return dir;
    }

    function makeWirePath(p1, dir1, p2, dir2, bend, spreadOffset) {
        const bx = bend?.x || 0, by = bend?.y || 0;
        const sox = spreadOffset?.x || 0, soy = spreadOffset?.y || 0;
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const arm = Math.max(50, Math.min(dist * 0.5, 200));

        const cp1x = p1.x + dir1.dx * arm + bx * 0.6 + sox;
        const cp1y = p1.y + dir1.dy * arm + by * 0.6 + soy;
        const cp2x = p2.x + dir2.dx * arm + bx * 0.4 + sox;
        const cp2y = p2.y + dir2.dy * arm + by * 0.4 + soy;

        return {
            d: `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`,
            mid: {
                x: 0.125*p1.x + 0.375*cp1x + 0.375*cp2x + 0.125*p2.x,
                y: 0.125*p1.y + 0.375*cp1y + 0.375*cp2y + 0.125*p2.y
            }
        };
    }

    // For temp-wire preview (mouse endpoint has no component direction)
    function makePreviewPath(p1, dir1, mx, my) {
        const dx = mx - p1.x, dy = my - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const arm = Math.max(40, Math.min(dist * 0.45, 160));

        const cp1x = p1.x + dir1.dx * arm;
        const cp1y = p1.y + dir1.dy * arm;
        const cp2x = mx - (dx / (dist || 1)) * arm * 0.5;
        const cp2y = my - (dy / (dist || 1)) * arm * 0.5;

        return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${mx} ${my}`;
    }

    // ── Wire rendering ──
    function renderWires() {
        wiresG.innerHTML = '';
        document.querySelectorAll('.terminal').forEach(el => el.classList.remove('connected'));

        // Auto-spread: compute offset for wires sharing the same terminal pair
        const terminalGroups = {};
        wires.forEach((w, idx) => {
            // Group by terminal endpoints (regardless of order)
            const keyA = `${w.c1}:${w.i1}`;
            const keyB = `${w.c2}:${w.i2}`;
            [keyA, keyB].forEach(key => {
                if (!terminalGroups[key]) terminalGroups[key] = [];
                terminalGroups[key].push(idx);
            });
        });

        // Calculate spread offsets for wires sharing a terminal
        const wireSpread = {};
        Object.values(terminalGroups).forEach(group => {
            if (group.length <= 1) return;
            group.forEach((widx, i) => {
                const offset = (i - (group.length - 1) / 2) * 25;
                if (!wireSpread[widx]) wireSpread[widx] = { x: 0, y: 0 };
                // Spread perpendicular to the wire direction
                const w = wires[widx];
                const c1 = deployed.find(c => c.id === w.c1);
                const c2 = deployed.find(c => c.id === w.c2);
                if (!c1 || !c2) return;
                const p1 = getAbsPos(c1, c1.terminals[w.i1]);
                const p2 = getAbsPos(c2, c2.terminals[w.i2]);
                const dx = p2.x - p1.x, dy = p2.y - p1.y;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                // Perpendicular direction
                wireSpread[widx].x += (-dy / len) * offset;
                wireSpread[widx].y += (dx / len) * offset;
            });
        });

        wires.forEach((w, idx) => {
            const c1 = deployed.find(c => c.id === w.c1);
            const c2 = deployed.find(c => c.id === w.c2);
            if (!c1 || !c2) return;
            const p1 = getAbsPos(c1, c1.terminals[w.i1]);
            const p2 = getAbsPos(c2, c2.terminals[w.i2]);
            const dir1 = getTerminalDir(c1, w.i1);
            const dir2 = getTerminalDir(c2, w.i2);

            const { d, mid } = makeWirePath(p1, dir1, p2, dir2, w.bend, wireSpread[idx]);

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('wire-group');
            g.dataset.widx = idx;

            // Hit area for dragging
            const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            hit.setAttribute('d', d);
            hit.classList.add('wire-hit-area');
            hit.dataset.widx = idx;

            // Visual wire
            const vis = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            vis.setAttribute('d', d);
            vis.setAttribute('stroke', w.color || '#94a3b8');
            vis.setAttribute('stroke-width', '3.5');
            vis.setAttribute('stroke-linecap', 'round');
            vis.classList.add('real-wire');

            // Flow animation if energized
            if (w.energized) {
                const flow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                flow.setAttribute('d', d);
                flow.setAttribute('stroke', 'rgba(74,222,128,0.6)');
                flow.setAttribute('stroke-width', '2');
                flow.setAttribute('fill', 'none');
                flow.setAttribute('stroke-linecap', 'round');
                flow.classList.add('wire-flow');
                g.appendChild(flow);
            }

            g.appendChild(vis);
            g.appendChild(hit);

            // Draggable midpoint handle
            const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            handle.setAttribute('cx', mid.x);
            handle.setAttribute('cy', mid.y);
            handle.setAttribute('r', '5');
            handle.classList.add('wire-handle');
            handle.dataset.widx = idx;
            g.appendChild(handle);

            wiresG.appendChild(g);

            document.querySelector(`[data-cid="${w.c1}"][data-tidx="${w.i1}"]`)?.classList.add('connected');
            document.querySelector(`[data-cid="${w.c2}"][data-tidx="${w.i2}"]`)?.classList.add('connected');
        });
    }

    // ── Spark/Smoke effects ──
    function spawnSparks(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - wCont.getBoundingClientRect().left;
        const cy = rect.top + rect.height / 2 - wCont.getBoundingClientRect().top;

        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark-particle';
            const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
            const dist = 20 + Math.random() * 40;
            spark.style.cssText = `left:${cx}px;top:${cy}px;--sx:${Math.cos(angle) * dist}px;--sy:${Math.sin(angle) * dist}px;
                background:${['#fbbf24','#ef4444','#fff'][i%3]};animation-delay:${Math.random()*0.1}s`;
            wCont.appendChild(spark);
            setTimeout(() => spark.remove(), 700);
        }
        for (let i = 0; i < 3; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-puff';
            smoke.style.cssText = `left:${cx - 15 + Math.random()*30}px;top:${cy - 10}px;animation-delay:${i*0.15}s`;
            wCont.appendChild(smoke);
            setTimeout(() => smoke.remove(), 1500);
        }
    }

    // ── Circuit Evaluation with Brightness Levels ──
    function evaluateCircuit() {
        // Reset ALL output states completely
        deployed.forEach(c => {
            const el = document.getElementById(c.id);
            if (!el) return;
            el.classList.remove('led-on', 'led-dim', 'led-bright', 'motor-active', 'motor-reversed', 'buzzer-active', 'led-rgb-active', 'speaker-active', 'relay-active');
            el.style.removeProperty('--glow-intensity');
            // Reset LED fill to original glass look
            const bulb = el.querySelector('.led-bulb');
            if (bulb && !c.isBroken) { bulb.style.fill = ''; bulb.style.filter = ''; }
            const ring = el.querySelector('.led-glow-ring');
            if (ring && !c.isBroken) { ring.style.fillOpacity = '0'; ring.style.fill = ''; }
            // Reset motor spin and direction badge
            const spin = el.querySelector('.motor-spin');
            if (spin) spin.style.animation = 'none';
            el.querySelectorAll('.motor-dir-badge').forEach(b => b.remove());
            // Reset speaker cone
            const cones = el.querySelectorAll('.speaker-cone');
            cones.forEach(cone => cone.style.animation = 'none');
            // Reset SCC state
            el.classList.remove('scc-active', 'scc-protecting', 'ac-active', 'ac-no-inverter');
            el.querySelectorAll('.scc-status').forEach(s => s.remove());
            el.querySelectorAll('.no-ac-badge').forEach(b => b.remove());
            el.querySelectorAll('.power-badge').forEach(b => b.remove());
            // Reset AC appliance indicators
            const ironPlate = el.querySelector('.iron-plate');
            if (ironPlate) ironPlate.style.fill = '';
            const ironInd = el.querySelector('.iron-indicator');
            if (ironInd) ironInd.style.fill = '';
            const fridgeInd = el.querySelector('.fridge-indicator');
            if (fridgeInd) fridgeInd.style.fill = '';
            const blenderBlade = el.querySelector('.blender-blade');
            if (blenderBlade) blenderBlade.style.animation = 'none';
            const blenderInd = el.querySelector('.blender-indicator');
            if (blenderInd) blenderInd.style.fill = '';
            const rcInd = el.querySelector('.rc-indicator');
            if (rcInd) rcInd.style.fill = '';
            const acInd = el.querySelector('.ac-indicator');
            if (acInd) acInd.style.fill = '';
            const acFan = el.querySelector('.ac-fan');
            if (acFan) acFan.style.animation = 'none';
            const tvScreen = el.querySelector('.tv-screen');
            if (tvScreen) { tvScreen.style.fill = ''; tvScreen.style.filter = ''; }
            const tvInd = el.querySelector('.tv-indicator');
            if (tvInd) tvInd.style.fill = '';
            const lampGlow = el.querySelector('.lamp-glow');
            if (lampGlow) { lampGlow.style.fill = 'none'; lampGlow.style.opacity = '0'; lampGlow.style.filter = ''; }
            const pcScreen = el.querySelector('.pc-screen');
            if (pcScreen) { pcScreen.style.fill = ''; pcScreen.style.filter = ''; }
            const pcPower = el.querySelector('.pc-power');
            if (pcPower) pcPower.style.opacity = '';
            const pcInd = el.querySelector('.pc-indicator');
            if (pcInd) pcInd.style.fill = '';
            const sdInd = el.querySelector('.sd-indicator');
            if (sdInd) sdInd.style.fill = '';
            el.querySelectorAll('.sd-status').forEach(b => b.remove());
            const pumpImp = el.querySelector('.pump-impeller');
            if (pumpImp) pumpImp.style.animation = 'none';
            const pumpInd = el.querySelector('.pump-indicator');
            if (pumpInd) pumpInd.style.fill = '';
            // Reset SCC resistance to base
            if (c.type === 'charge_controller') {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                if (tmpl) c.currentResistance = tmpl.resistance;
            }
            // Reset Step-Down resistance to base
            if (c.type === 'stepdown_12v' || c.type === 'stepdown_5v') {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                if (tmpl) c.currentResistance = tmpl.resistance;
            }
        });
        SFX.stopAll(); // Stop all looping sounds before re-evaluating
        wires.forEach(w => w.energized = false);

        let hasLoop = false;
        const activeLoops = [];

        const isSource = c => c.type.startsWith('battery') || c.type.startsWith('solar_');

        deployed.filter(isSource).forEach(batt => {
            const paths = [];
            traceCircuit({ cid: batt.id, pin: 0 }, [batt.id], [], paths, batt.id);

            paths.forEach(loop => {
                let rTotal = 0, open = false;
                const compsInLoop = [];
                const wireIndices = new Set();
                const compEntryPin = {}; // Track which pin current enters each component

                loop.forEach(node => {
                    const c = deployed.find(x => x.id === node.cid);
                    if (c && !compsInLoop.includes(c)) compsInLoop.push(c);
                    if (node.wireIdx !== undefined) wireIndices.add(node.wireIdx);
                    // Nodes without wireIdx are "entry" nodes — record which pin was entered
                    if (node.wireIdx === undefined && node.cid) {
                        compEntryPin[node.cid] = node.pin;
                    }
                });

                // Identify parallel sources: entered at pin 0 (+) means opposing EMF
                const parallelSourceIds = new Set();
                compsInLoop.forEach(c => {
                    if (isSource(c) && c.id !== batt.id && compEntryPin[c.id] === 0) {
                        parallelSourceIds.add(c.id);
                    }
                });

                compsInLoop.forEach(c => {
                    if (parallelSourceIds.has(c.id)) return; // Skip parallel sources' resistance
                    rTotal += c.currentResistance;
                    if (c.type === 'switch_toggle' && !c.isClosed) open = true;
                });

                // Parallel batteries: use parallel resistance formula (R_eq = 1/(1/R1 + 1/R2 + ...))
                if (parallelSourceIds.size > 0) {
                    const allParR = [batt.currentResistance];
                    parallelSourceIds.forEach(id => {
                        const psrc = deployed.find(x => x.id === id);
                        if (psrc) allParR.push(psrc.currentResistance);
                    });
                    const equivR = 1 / allParR.reduce((s, r) => s + 1 / r, 0);
                    rTotal = rTotal - batt.currentResistance + equivR;
                }

                if (open || rTotal === Infinity || rTotal <= 0) return;

                // Sum voltages based on entry pin direction (series vs parallel detection)
                // Pin 1 (−) entry = series (same EMF direction) → ADD voltage
                // Pin 0 (+) entry = parallel (opposing EMF) → SUBTRACT voltage
                let loopVoltage = 0;
                compsInLoop.forEach(c => {
                    if (isSource(c)) {
                        let effectiveV = c.voltage;
                        // Dead batteries contribute 0V (DoD limit for rechargeable)
                        if (c.batteryCapacity) {
                            const isRechargeable = c.type.includes('lifepo4') || c.type.includes('plts') || c.type === 'battery_32140';
                            const minLevel = isRechargeable ? c.batteryCapacity * 0.10 : 0;
                            if (c.batteryLevel <= minLevel) effectiveV = 0;
                        }
                        // Solar panels: 0V outside daylight hours (6-18)
                        if (c.type.startsWith('solar_')) {
                            const hod = (simElapsedMin / 60) % 24;
                            if (hod < 6 || hod >= 18) effectiveV = 0;
                        }
                        // Parallel source: subtract (opposing EMF, e.g. parallel batteries → net 0V)
                        if (parallelSourceIds.has(c.id)) {
                            loopVoltage -= effectiveV;
                        } else {
                            loopVoltage += effectiveV;
                        }
                    }
                });

                if (loopVoltage <= 0) return; // No net voltage = no current, skip loop

                hasLoop = true;
                let amps = loopVoltage / rTotal;

                // ── Charge Controller Protection Logic ──
                const scc = compsInLoop.find(c => c.type === 'charge_controller');
                if (scc && !scc.isBroken) {
                    const tmpl = COMPONENTS.find(t => t.id === 'charge_controller');
                    const maxOut = tmpl?.maxOutputCurrent || 0.05;
                    const hasSolar = compsInLoop.some(c => c.type.startsWith('solar_'));
                    const hasBattery = compsInLoop.some(c => c.type.startsWith('battery'));
                    // SCC only limits on CHARGING circuits (no load components)
                    const hasLoads = compsInLoop.some(c => {
                        const isACLoad = ['iron', 'fridge', 'blender', 'ricecooker', 'ac_05pk', 'ac_1pk', 'tv_led', 'lamp_30w', 'computer', 'pump_125', 'pump_250'].includes(c.type);
                        const isDCLoad = c.type.startsWith('led_') || c.type === 'bulb' || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker';
                        const hasInv = c.type === 'inverter' || c.type === 'inverter_3k' || c.type === 'inverter_5k';
                        return isACLoad || isDCLoad || hasInv;
                    });

                    if (hasSolar && !hasLoads && amps > maxOut) {
                        // SCC increases its resistance to limit current
                        const neededR = loopVoltage / maxOut;
                        scc.currentResistance = Math.max(tmpl.resistance, neededR - (rTotal - scc.currentResistance));
                        rTotal = loopVoltage / maxOut;
                        amps = maxOut;

                        // Mark SCC as protecting
                        const sccEl = document.getElementById(scc.id);
                        if (sccEl) {
                            sccEl.classList.add('scc-active', 'scc-protecting');
                            let badge = sccEl.querySelector('.scc-status');
                            if (!badge) {
                                badge = document.createElement('div');
                                badge.className = 'scc-status';
                                sccEl.appendChild(badge);
                            }
                            badge.textContent = hasBattery
                                ? `⚡ PROTECT ${(amps*1000).toFixed(0)}mA`
                                : `⚡ LIMIT ${(amps*1000).toFixed(0)}mA`;
                        }
                    } else if (hasSolar) {
                        // SCC is active but not limiting
                        const sccEl = document.getElementById(scc.id);
                        if (sccEl) {
                            sccEl.classList.add('scc-active');
                            let badge = sccEl.querySelector('.scc-status');
                            if (!badge) {
                                badge = document.createElement('div');
                                badge.className = 'scc-status';
                                sccEl.appendChild(badge);
                            }
                            badge.textContent = `✓ OK ${(amps*1000).toFixed(0)}mA`;
                        }
                    }
                }

                // ── Step-Down Converter Protection Logic ──
                const stepDowns = compsInLoop.filter(c => c.type === 'stepdown_12v' || c.type === 'stepdown_5v');
                stepDowns.forEach(sd => {
                    if (sd.isBroken) return;
                    const sdTmpl = COMPONENTS.find(t => t.id === sd.type);
                    const sdMaxOut = sdTmpl?.maxOutputCurrent || 0.02;
                    if (amps > sdMaxOut) {
                        const neededR = loopVoltage / sdMaxOut;
                        sd.currentResistance = Math.max(sdTmpl.resistance, neededR - (rTotal - sd.currentResistance));
                        rTotal = loopVoltage / sdMaxOut;
                        amps = sdMaxOut;
                        const sdEl = document.getElementById(sd.id);
                        if (sdEl) {
                            sdEl.classList.add('scc-protecting');
                            let badge = sdEl.querySelector('.sd-status');
                            if (!badge) {
                                badge = document.createElement('div');
                                badge.className = 'sd-status scc-status';
                                sdEl.appendChild(badge);
                            }
                            badge.textContent = `⚡ ${(amps*1000).toFixed(0)}mA`;
                            const ind = sdEl.querySelector('.sd-indicator');
                            if (ind) ind.style.fill = '#f59e0b';
                        }
                    } else {
                        const sdEl = document.getElementById(sd.id);
                        if (sdEl) {
                            sdEl.classList.add('scc-active');
                            let badge = sdEl.querySelector('.sd-status');
                            if (!badge) {
                                badge = document.createElement('div');
                                badge.className = 'sd-status scc-status';
                                sdEl.appendChild(badge);
                            }
                            badge.textContent = `✓ ${(amps*1000).toFixed(0)}mA`;
                            const ind = sdEl.querySelector('.sd-indicator');
                            if (ind) ind.style.fill = '#22c55e';
                        }
                    }
                });

                // Deduplicate: skip if same set of components already processed
                const loopKey = compsInLoop.map(c => c.id).sort().join(',');
                if (activeLoops.find(l => l.key === loopKey)) return;
                const watts = loopVoltage * amps;
                // Real-world power calculation
                let srcPower = 0, loadPower = 0;
                compsInLoop.forEach(c => {
                    const t = COMPONENTS.find(x => x.id === c.type);
                    if (!t) return;
                    // Only count non-battery sources (solar/generator) as power generation
                    // Batteries are energy storage, not generators for the energy balance
                    if (isSource(c) && t.ratedPower && !c.type.startsWith('battery')) srcPower += t.ratedPower;
                    else if (t.ratedPower && !isSource(c) && c.type !== 'charge_controller' && c.type !== 'inverter' && c.type !== 'inverter_3k' && c.type !== 'inverter_5k' && c.type !== 'switch_toggle') loadPower += t.ratedPower;
                });
                const battIds = compsInLoop.filter(c => c.type.startsWith('battery') && c.batteryCapacity).map(c => c.id);
                const hasCC = compsInLoop.some(c => c.type === 'charge_controller');
                const hasInverter = compsInLoop.some(c => c.type.startsWith('inverter'));
                activeLoops.push({ key: loopKey, v: loopVoltage, r: rTotal, i: amps, w: watts, srcW: srcPower, loadW: loadPower, battIds, hasCC, hasInverter });

                console.log(`[CZElectro] Loop ${activeLoops.length}: V=${loopVoltage}V, R=${rTotal.toFixed(1)}Ω, I=${(amps*1000).toFixed(1)}mA, components:`, compsInLoop.map(c => `${c.type}(${c.currentResistance}Ω)`).join(' → '));

                wireIndices.forEach(wi => { if (wires[wi]) wires[wi].energized = true; });

                // Calculate per-component voltage: V_comp = I × R_comp
                // This ensures voltage is properly divided among series components

                // PASS 1: Check overcurrent — break components first
                let loopBroken = false;
                compsInLoop.forEach(c => {
                    const el = document.getElementById(c.id);
                    if (!el || c.isBroken) return;
                    const isLed = c.type.startsWith('led_') || c.type === 'bulb';
                    const isAC = c.type === 'iron' || c.type === 'fridge' || c.type === 'blender' || c.type === 'ricecooker' || c.type === 'ac_05pk' || c.type === 'ac_1pk' || c.type === 'tv_led' || c.type === 'lamp_30w' || c.type === 'computer' || c.type === 'pump_125' || c.type === 'pump_250';
                    const isOutput = isLed || isAC || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || c.type === 'fuse';
                    if (isOutput && c.maxCurrent && amps > c.maxCurrent) {
                        loopBroken = true;
                        c.isBroken = true;
                        c.currentResistance = Infinity;
                        el.classList.add('comp-broken');
                        if (isLed || c.type === 'bulb') el.classList.add('led-broken');
                        if (c.type === 'fuse') el.classList.add('fuse-blown');
                        if (c.type === 'motor_dc') {
                            el.classList.remove('motor-active');
                            const spin = el.querySelector('.motor-spin');
                            if (spin) spin.style.animation = 'none';
                        }
                        if (c.type === 'bulb') {
                            const fil = el.querySelector('.bulb-filament');
                            if (fil) fil.style.stroke = 'transparent';
                        }
                        spawnSparks(el);
                        showBurnNotice(el, amps, c.maxCurrent);
                        // Sound effect
                        if (c.type === 'fuse') SFX.fuseSnap();
                        else SFX.burn();
                    }
                });
                // Check if loop has an inverter (needed for AC appliances) — hasInverter declared above

                // PASS 2: Activate outputs using per-component voltage division
                if (!loopBroken) {
                    compsInLoop.forEach(c => {
                        const el = document.getElementById(c.id);
                        if (!el || c.isBroken) return;

                        const tmplAC = COMPONENTS.find(t => t.id === c.type);
                        // AC-only check: skip activation if no inverter
                        if (tmplAC?.acOnly && !hasInverter) {
                            el.classList.add('ac-no-inverter');
                            let noAcBadge = el.querySelector('.no-ac-badge');
                            if (!noAcBadge) {
                                noAcBadge = document.createElement('div');
                                noAcBadge.className = 'no-ac-badge';
                                noAcBadge.textContent = '⚠ NO AC';
                                el.appendChild(noAcBadge);
                            }
                            return; // Don't activate
                        }

                        // Power budget check: if source can't supply the load, don't activate
                        const isOutputComp2 = tmplAC && tmplAC.ratedPower && !isSource(c) && c.type !== 'charge_controller' && c.type !== 'inverter' && c.type !== 'inverter_3k' && c.type !== 'inverter_5k' && c.type !== 'switch_toggle';
                        if (isOutputComp2 && srcPower > 0 && loadPower > srcPower) {
                            el.classList.add('ac-no-inverter'); // reuse dim style
                            let lpBadge = el.querySelector('.no-ac-badge');
                            if (!lpBadge) {
                                lpBadge = document.createElement('div');
                                lpBadge.className = 'no-ac-badge';
                                el.appendChild(lpBadge);
                            }
                            lpBadge.textContent = `⚠ DAYA KURANG (${srcPower}W < ${loadPower}W)`;
                            return; // Don't activate
                        }

                        // Voltage across this component: V = I × R
                        const vComp = amps * c.currentResistance;
                        const tmpl = COMPONENTS.find(t => t.id === c.type);

                        const isLed = c.type.startsWith('led_') || c.type === 'bulb';
                        if (isLed) {
                            // Current ratio is the primary brightness driver
                            const ratio = Math.min(amps / c.maxCurrent, 1);
                            // Power curve 0.85 = more realistic mapping
                            // ratio 0.1 → 0.14 visual (very dim)
                            // ratio 0.3 → 0.35 visual (dim)
                            // ratio 0.5 → 0.54 visual (moderate)
                            // ratio 0.8 → 0.83 visual (bright)
                            // ratio 1.0 → 1.0  visual (max)
                            const vi = Math.pow(ratio, 0.85);

                            // Continuous glow ring opacity
                            const ring = el.querySelector('.led-glow-ring');
                            if (ring) ring.style.fillOpacity = (vi * 0.95).toFixed(3);

                            // Glow filter: size and alpha scale with intensity
                            const bulb = el.querySelector('.led-bulb');
                            const glowSize = Math.round(2 + vi * vi * 40);
                            const glowAlpha = (vi * 0.9).toFixed(2);

                            let glowColor;
                            if (c.type === 'led_rgb') {
                                // RGB LED: use CSS animation for smooth cycling
                                el.classList.add('led-rgb-active');
                                // Set glow intensity via CSS variable
                                el.style.setProperty('--rgb-glow-size', glowSize + 'px');
                                el.style.setProperty('--rgb-alpha', glowAlpha);
                            } else if (c.glowGradient) {
                                bulb.style.fill = `url(#${c.glowGradient})`;
                                glowColor = c.type.includes('red') ? `rgba(239,68,68,${glowAlpha})`
                                    : c.type.includes('green') ? `rgba(34,197,94,${glowAlpha})`
                                    : c.type.includes('blue') ? `rgba(59,130,246,${glowAlpha})`
                                    : c.type.includes('white') ? `rgba(255,255,255,${glowAlpha})`
                                    : `rgba(250,204,21,${glowAlpha})`;
                            } else {
                                // Bulb: warm color shift (dim=dark orange, bright=white-yellow)
                                const r = Math.round(100 + vi * 155);
                                const g = Math.round(20 + vi * 200);
                                const b = Math.round(0 + vi * 80);
                                glowColor = `rgba(${r},${g},${b},${glowAlpha})`;
                                if (bulb) bulb.style.fill = `rgba(${r},${g},${b},${(0.1 + vi * 0.9).toFixed(2)})`;
                            }
                            if (c.type !== 'led_rgb') {
                                if (bulb) bulb.style.filter = `drop-shadow(0 0 ${glowSize}px ${glowColor})${vi > 0.75 ? ` brightness(${(1 + vi * 0.3).toFixed(1)})` : ''}`;
                            }

                            if (ratio >= 0.8) el.classList.add('led-bright');
                            else if (ratio >= 0.3) el.classList.add('led-on');
                            else if (ratio > 0) el.classList.add('led-dim');
                        }
                        if (c.type === 'motor_dc') {
                            const rated = tmpl?.ratedVoltage || 3;
                            const speedRatio = Math.min(vComp / rated, 1);
                            if (speedRatio < 0.03) return;
                            el.classList.add('motor-active');
                            const speed = 0.2 + (1 - speedRatio) * 5.8;
                            const spin = el.querySelector('.motor-spin');
                            // Determine polarity: if current enters at pin 1 (−), motor is reversed
                            const entryPin = compEntryPin[c.id];
                            const isReversed = entryPin === 1;
                            if (spin) spin.style.animation = `spin ${speed.toFixed(2)}s linear infinite${isReversed ? ' reverse' : ''}`;
                            // Add direction indicator
                            el.classList.toggle('motor-reversed', isReversed);
                            let badge = el.querySelector('.motor-dir-badge');
                            if (!badge) {
                                badge = document.createElement('div');
                                badge.className = 'motor-dir-badge';
                                el.appendChild(badge);
                            }
                            badge.textContent = isReversed ? '↺ REV' : '↻ FWD';
                            badge.classList.toggle('reversed', isReversed);
                            SFX.motorStart(c.id, speedRatio);
                            SFX.motorUpdate(c.id, speedRatio);
                        }
                        if (c.type === 'buzzer') {
                            if (vComp > 0.5) {
                                el.classList.add('buzzer-active');
                                SFX.buzzerStart(c.id);
                            }
                        }
                        if (c.type === 'speaker') {
                            if (vComp > 0.3) {
                                el.classList.add('speaker-active');
                                const cone = el.querySelector('.speaker-cone');
                                if (cone) {
                                    const intensity = Math.min(vComp / 5, 1);
                                    cone.style.animation = `speakerVibrate ${(0.05 + (1 - intensity) * 0.1).toFixed(3)}s ease-in-out infinite alternate`;
                                }
                                SFX.speakerStart(c.id, vComp);
                                SFX.speakerUpdate(c.id, vComp);
                            }
                        }
                        if (c.type === 'relay') {
                            if (vComp > 3) {
                                el.classList.add('relay-active');
                                SFX.relayClick();
                            }
                        }
                        // AC Appliances activation
                        if (c.type === 'iron') {
                            el.classList.add('ac-active');
                            const plate = el.querySelector('.iron-plate');
                            const indicator = el.querySelector('.iron-indicator');
                            if (plate) plate.style.fill = '#ef4444';
                            if (indicator) indicator.style.fill = '#ef4444';
                        }
                        if (c.type === 'fridge') {
                            el.classList.add('ac-active');
                            const indicator = el.querySelector('.fridge-indicator');
                            if (indicator) indicator.style.fill = '#22c55e';
                        }
                        if (c.type === 'blender') {
                            el.classList.add('ac-active');
                            const blade = el.querySelector('.blender-blade');
                            const indicator = el.querySelector('.blender-indicator');
                            if (blade) blade.style.animation = 'spin 0.3s linear infinite';
                            if (indicator) indicator.style.fill = '#22c55e';
                        }
                        if (c.type === 'ricecooker') {
                            el.classList.add('ac-active');
                            const indicator = el.querySelector('.rc-indicator');
                            if (indicator) indicator.style.fill = '#ef4444';
                        }
                        if (c.type === 'ac_05pk' || c.type === 'ac_1pk') {
                            el.classList.add('ac-active');
                            const indicator = el.querySelector('.ac-indicator');
                            if (indicator) indicator.style.fill = '#22c55e';
                            const fan = el.querySelector('.ac-fan');
                            if (fan) fan.style.animation = 'spin 2s linear infinite';
                        }
                        if (c.type === 'tv_led') {
                            el.classList.add('ac-active');
                            const screen = el.querySelector('.tv-screen');
                            if (screen) { screen.style.fill = '#1e40af'; screen.style.filter = 'brightness(1.5)'; }
                            const indicator = el.querySelector('.tv-indicator');
                            if (indicator) indicator.style.fill = '#22c55e';
                        }
                        if (c.type === 'lamp_30w') {
                            el.classList.add('ac-active');
                            const glow = el.querySelector('.lamp-glow');
                            if (glow) { glow.style.fill = '#fbbf24'; glow.style.opacity = '0.6'; glow.style.filter = 'blur(4px)'; }
                        }
                        if (c.type === 'computer') {
                            el.classList.add('ac-active');
                            const screen = el.querySelector('.pc-screen');
                            if (screen) { screen.style.fill = '#1e3a5f'; screen.style.filter = 'brightness(1.4)'; }
                            const power = el.querySelector('.pc-power');
                            if (power) power.style.opacity = '1';
                            const indicator = el.querySelector('.pc-indicator');
                            if (indicator) indicator.style.fill = '#22c55e';
                        }
                        if (c.type === 'pump_125' || c.type === 'pump_250') {
                            el.classList.add('ac-active');
                            const impeller = el.querySelector('.pump-impeller');
                            if (impeller) impeller.style.animation = 'spin 0.5s linear infinite';
                            const indicator = el.querySelector('.pump-indicator');
                            if (indicator) indicator.style.fill = '#22c55e';
                        }

                        // Power badge for output components
                        const isOutputComp = c.type.startsWith('led_') || c.type === 'bulb' || c.type === 'motor_dc' || c.type === 'buzzer' || c.type === 'speaker' || c.type === 'iron' || c.type === 'fridge' || c.type === 'blender' || c.type === 'ricecooker' || c.type === 'ac_05pk' || c.type === 'ac_1pk' || c.type === 'tv_led' || c.type === 'lamp_30w' || c.type === 'computer' || c.type === 'pump_125' || c.type === 'pump_250';
                        if (isOutputComp) {
                            const pComp = vComp * amps;
                            let pBadge = el.querySelector('.power-badge');
                            if (!pBadge) {
                                pBadge = document.createElement('div');
                                pBadge.className = 'power-badge';
                                el.appendChild(pBadge);
                            }
                            pBadge.textContent = tmpl?.ratedPower
                                ? (tmpl.ratedPower >= 1 ? `${tmpl.ratedPower}W` : `${(tmpl.ratedPower * 1000).toFixed(0)}mW`)
                                : (pComp >= 1 ? `${pComp.toFixed(1)}W` : `${(pComp * 1000).toFixed(0)}mW`);
                        }
                    });
                }
            });
        });

        renderWires();
        // Track power for simulation engine
        simTotalLoadW = 0;
        simTotalSrcW = 0;
        const activeBatteryIds = new Set();
        activeLoops.forEach(l => {
            simTotalSrcW += l.srcW || 0;
            simTotalLoadW += l.loadW || 0;
        });
        // Find batteries that are in active loops
        deployed.forEach(c => {
            if (c.type.startsWith('battery') && c.batteryCapacity) {
                const hasWire = wires.some(w => w.c1 === c.id || w.c2 === c.id);
                const el = document.getElementById(c.id);
                if (hasWire && el && wires.some(w => w.energized && (w.c1 === c.id || w.c2 === c.id))) {
                    activeBatteryIds.add(c.id);
                }
            }
        });
        window._activeBatteryIds = activeBatteryIds;

        // ── Expand loop battIds to include parallel batteries ──
        // Union-Find on wire connectivity: batteries connected via wires
        // share the same electrical node and should drain equally
        const ufParent = {};
        deployed.forEach(c => ufParent[c.id] = c.id);
        function ufFind(x) { return ufParent[x] === x ? x : (ufParent[x] = ufFind(ufParent[x])); }
        function ufUnion(a, b) { ufParent[ufFind(a)] = ufFind(b); }
        wires.forEach(w => ufUnion(w.c1, w.c2));

        const allBatteries = deployed.filter(c => c.type.startsWith('battery') && c.batteryCapacity);
        activeLoops.forEach(loop => {
            if (!loop.battIds || loop.battIds.length === 0) return;
            const expanded = new Set(loop.battIds);
            loop.battIds.forEach(loopBatId => {
                allBatteries.forEach(b => {
                    if (ufFind(loopBatId) === ufFind(b.id)) expanded.add(b.id);
                });
            });
            loop.battIds = [...expanded];
        });

        window._activeLoops = activeLoops; // Per-loop drain info for simTick
        updateStatusValues(hasLoop, activeLoops);
        updateBatteryBars(); // Always show battery progress on all battery components
        saveState();
    }

    // Burn notice popup
    function showBurnNotice(el, amps, max) {
        const notice = document.createElement('div');
        notice.className = 'burn-notice';
        notice.innerHTML = `⚡ BURNT! ${(amps*1000).toFixed(0)}mA > ${(max*1000).toFixed(0)}mA max`;
        el.appendChild(notice);
        setTimeout(() => notice.remove(), 3000);
    }

    // Reset a broken component to original state
    function resetComponent(compId) {
        const comp = deployed.find(c => c.id === compId);
        if (!comp) return;
        const el = document.getElementById(compId);
        if (!el) return;
        const tmpl = COMPONENTS.find(t => t.id === comp.type);
        if (!tmpl) return;

        // Restore electrical properties
        comp.isBroken = false;
        comp.currentResistance = tmpl.resistance;
        if (comp.type === 'switch_toggle') {
            comp.isClosed = false;
            comp.currentResistance = Infinity;
            el.classList.remove('switch-closed');
        }

        // Restore visual — re-inject SVG
        el.innerHTML = tmpl.svg;
        el.className = 'board-component';
        el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${comp.x}px;top:${comp.y}px;`;
        // Re-apply rotation if component was rotated
        if (comp.rotation) {
            el.style.transform = `rotate(${comp.rotation}deg)`;
        }

        // Re-create terminals
        comp.terminals = JSON.parse(JSON.stringify(tmpl.terminals));
        comp.terminals.forEach((term, idx) => {
            const tEl = document.createElement('div');
            tEl.className = 'terminal';
            tEl.style.left = `${term.x - 8}px`;
            tEl.style.top = `${term.y - 8}px`;
            tEl.dataset.cid = compId;
            tEl.dataset.tidx = idx;
            tEl.dataset.label = term.label || '';
            el.appendChild(tEl);
        });

        // Flash green to confirm reset
        el.style.outline = '2px solid #4ade80';
        el.style.outlineOffset = '4px';
        setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 600);

        evaluateCircuit();
    }

    // Rotate a component by 90 degrees
    function rotateComponent(compId) {
        const comp = deployed.find(c => c.id === compId);
        if (!comp) return;
        const el = document.getElementById(compId);
        if (!el) return;

        comp.rotation = ((comp.rotation || 0) + 90) % 360;
        el.style.transform = comp.rotation ? `rotate(${comp.rotation}deg)` : '';

        // Show/hide rotation badge
        let badge = el.querySelector('.rotation-badge');
        if (comp.rotation) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'rotation-badge';
                el.appendChild(badge);
            }
            badge.textContent = `${comp.rotation}°`;
        } else if (badge) {
            badge.remove();
        }

        renderWires();
        evaluateCircuit();
    }

    function traceCircuit(curr, visited, path, paths, targetBatt) {
        const conns = wires.map((w, idx) => ({ ...w, wireIdx: idx }))
            .filter(w => (w.c1 === curr.cid && w.i1 === curr.pin) || (w.c2 === curr.cid && w.i2 === curr.pin));

        conns.forEach(w => {
            const isFrom = (w.c1 === curr.cid && w.i1 === curr.pin);
            const nCid = isFrom ? w.c2 : w.c1;
            const nPin = isFrom ? w.i2 : w.i1;

            if (nCid === targetBatt && nPin === 1) {
                paths.push([...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }]);
                return;
            }

            const nextComp = deployed.find(c => c.id === nCid);
            if (!nextComp || visited.includes(nCid)) return;

            // Ground component: single terminal (pin 0) — jump to all other grounds
            const nextTmpl = COMPONENTS.find(t => t.id === nextComp.type);
            if (nextTmpl?.isGround) {
                const otherGrounds = deployed.filter(c => {
                    const t = COMPONENTS.find(x => x.id === c.type);
                    return t?.isGround && c.id !== nCid && !visited.includes(c.id);
                });
                otherGrounds.forEach(gnd => {
                    // From this ground, continue to whatever is connected to the other ground's terminal (pin 0)
                    const gndConns = wires.map((gw, idx) => ({ ...gw, wireIdx: idx }))
                        .filter(gw => (gw.c1 === gnd.id && gw.i1 === 0) || (gw.c2 === gnd.id && gw.i2 === 0));
                    gndConns.forEach(gw => {
                        const gIsFrom = (gw.c1 === gnd.id && gw.i1 === 0);
                        const gNCid = gIsFrom ? gw.c2 : gw.c1;
                        const gNPin = gIsFrom ? gw.i2 : gw.i1;
                        if (gNCid === targetBatt && gNPin === 1) {
                            paths.push([...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }, { cid: gnd.id, pin: 0, wireIdx: gw.wireIdx }]);
                            return;
                        }
                        const gNextComp = deployed.find(c => c.id === gNCid);
                        if (!gNextComp || visited.includes(gNCid)) return;
                        const gOutPin = gNPin === 0 ? 1 : 0;
                        traceCircuit(
                            { cid: gNCid, pin: gOutPin },
                            [...visited, nCid, gnd.id, gNCid],
                            [...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }, { cid: gnd.id, pin: 0, wireIdx: gw.wireIdx }, { cid: gNCid, pin: gNPin }],
                            paths, targetBatt
                        );
                    });
                });
                return; // Ground handled — don't continue normal trace
            }

            const outPin = nPin === 0 ? 1 : 0;
            traceCircuit(
                { cid: nCid, pin: outPin },
                [...visited, nCid],
                [...path, { cid: curr.cid, pin: curr.pin, wireIdx: w.wireIdx }, { cid: nCid, pin: nPin }],
                paths, targetBatt
            );
        });
    }

    // ── Status bar ──
    function updateStatus() {
        document.getElementById('comp-count').textContent = deployed.length + ' parts';
    }

    // ── Solar Irradiance Curve ──
    // Sinusoidal model: sunrise 6:00, peak noon, sunset 18:00
    function getSolarFactor(hourOfDay) {
        if (hourOfDay < 6 || hourOfDay >= 18) return 0;
        return Math.sin(Math.PI * (hourOfDay - 6) / 12);
    }

    // ── Battery Simulation Engine ──
    function simTick() {
        // Always show current status
        const batteries = deployed.filter(c => c.type.startsWith('battery') && c.batteryCapacity);
        // Time-based solar curve (automatic 24h cycle)
        const hourOfDay = (simElapsedMin / 60) % 24;
        const solarFactor = getSolarFactor(hourOfDay);
        const isDaytime = solarFactor > 0;
        const hour = hourOfDay;
        const totalSolarW = simTotalSrcW * solarFactor;
        const totalLoadW = simTotalLoadW;

        // Update panel even when paused
        if (batteries.length > 0) {
            updateSimPanel(totalSolarW, totalLoadW, batteries, hour, isDaytime, solarFactor);
        }

        if (simSpeed === 0) return;

        // Detect no-power state (all batteries depleted + no solar)
        const allBattsDead = batteries.length > 0 && batteries.every(b => {
            const isRch = b.type.includes('lifepo4') || b.type.includes('plts') || b.type === 'battery_32140';
            const minLevel = isRch ? b.batteryCapacity * 0.10 : 0;
            return b.batteryLevel <= minLevel;
        });
        const noPower = allBattsDead && !isDaytime;

        const deltaMin = simSpeed;
        simElapsedMin += deltaMin;

        // Per-loop battery drain (each circuit drains its own batteries)
        const loopsDrain = window._activeLoops || [];
        let anyDrained = false;
        loopsDrain.forEach(loop => {
            if (!loop.battIds || loop.battIds.length === 0) return;
            // Apply solar curve to source power
            let adjSrcW = (loop.srcW || 0) * solarFactor;
            let adjLoadW = loop.loadW || 0;
            // Efficiency losses (real-world component losses)
            if (loop.hasCC) adjSrcW *= 0.93;       // Charge controller ~93% efficiency
            if (loop.hasInverter) adjLoadW /= 0.90; // Inverter ~90% efficiency (draws 10% more)
            const loopNetW = adjSrcW - adjLoadW;
            if (loopNetW === 0) return;
            // Charging: include non-full batteries; Draining: include non-empty batteries
            const isCharging = loopNetW > 0;
            const loopBatts = loop.battIds
                .map(id => deployed.find(c => c.id === id))
                .filter(b => b && (isCharging ? b.batteryLevel < b.batteryCapacity : b.batteryLevel > 0));
            if (loopBatts.length === 0) return;
            const perBattRaw = (loopNetW * deltaMin) / 60 / loopBatts.length;
            loopBatts.forEach(bat => {
                let delta = perBattRaw;
                if (isCharging) {
                    // Cap charging at 0.5C rate (minimum 2 hours to full charge)
                    const maxChargeWhPerMin = (bat.batteryCapacity * 0.5) / 60;
                    const maxDelta = maxChargeWhPerMin * deltaMin;
                    delta = Math.min(delta, maxDelta);
                }
                // DoD limit: rechargeable batteries stop at 10% (BMS protection)
                const isRechargeable = bat.type.includes('lifepo4') || bat.type.includes('plts') || bat.type === 'battery_32140';
                const minLevel = isRechargeable ? bat.batteryCapacity * 0.10 : 0;
                bat.batteryLevel = Math.max(minLevel, Math.min(bat.batteryCapacity, bat.batteryLevel + delta));
            });
            anyDrained = true;
        });

        if (anyDrained) {
            saveState();
        }

        // Re-evaluate circuit FIRST (resets styles)
        evaluateCircuit();

        // Battery visuals are handled by updateBatteryBars() called from evaluateCircuit()

        // Update sim panel
        updateSimPanel(totalSolarW, totalLoadW, batteries, hour, isDaytime, solarFactor, noPower);
    }

    function updateSimPanel(solarW, loadW, batteries, hour, isDaytime, solarFactor, noPower) {
        let panel = document.getElementById('sim-panel');
        if (!panel) return;
        const dayNum = Math.floor(simElapsedMin / 1440) + 1;
        const clockH = Math.floor(hour);
        const clockM = Math.floor((hour % 1) * 60);
        const timeStr = `${String(clockH).padStart(2,'0')}:${String(clockM).padStart(2,'0')}`;
        const timeIcon = isDaytime ? '☀️' : '🌙';
        const solarPct = (solarFactor * 100).toFixed(0);
        const netW = solarW - loadW;
        const netSign = netW >= 0 ? '+' : '';
        const netColor = netW >= 0 ? '#22c55e' : '#ef4444';
        const speedLabel = simSpeed === 0 ? '⏸ PAUSE' : `▶ ${simSpeed}x`;
        const speedColor = simSpeed === 0 ? '#ef4444' : '#22c55e';

        // Cumulative angles (never wrap backwards for smooth CSS transitions)
        const hourAngle = simElapsedMin * 0.5; // 0.5° per minute
        const minAngle = simElapsedMin * 6;    // 6° per minute

        // Day/night face color
        const faceColor = isDaytime ? '#1a2a3a' : '#0d0d1a';
        const rimColor = isDaytime ? '#f59e0b' : '#334155';

        // Sun position on rim
        const sunAngleVis = ((hour % 12) / 12) * 360;
        const sunX = 30 + 24 * Math.sin(sunAngleVis * Math.PI / 180);
        const sunY = 30 - 24 * Math.cos(sunAngleVis * Math.PI / 180);

        // === Persistent Clock (create once, update via DOM) ===
        let clockWrap = panel.querySelector('.sim-clock-wrap');
        if (!clockWrap) {
            clockWrap = document.createElement('div');
            clockWrap.className = 'sim-clock-wrap';
            // Build tick marks (static)
            let ticks = '';
            for (let i = 0; i < 12; i++) {
                const a = i * 30;
                const maj = i % 3 === 0;
                const r1 = maj ? 22 : 24, r2 = 27;
                const x1 = 30 + r1 * Math.sin(a * Math.PI / 180);
                const y1 = 30 - r1 * Math.cos(a * Math.PI / 180);
                const x2 = 30 + r2 * Math.sin(a * Math.PI / 180);
                const y2 = 30 - r2 * Math.cos(a * Math.PI / 180);
                ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${maj?'#94a3b8':'#475569'}" stroke-width="${maj?2:1}" stroke-linecap="round"/>`;
            }
            clockWrap.innerHTML = `
            <svg viewBox="0 0 60 60" width="44" height="44">
                <circle class="ck-face" cx="30" cy="30" r="28" fill="${faceColor}" stroke="${rimColor}" stroke-width="1.5" style="transition:fill .5s,stroke .5s"/>
                ${ticks}
                <circle class="ck-sun-glow" cx="${sunX}" cy="${sunY}" r="5" fill="#f59e0b" opacity="0" style="transition:cx .3s,cy .3s,opacity .3s"/>
                <circle class="ck-sun" cx="${sunX}" cy="${sunY}" r="3" fill="#f59e0b" opacity="0.5" style="transition:cx .3s,cy .3s,opacity .3s,fill .3s"/>
                <line class="ck-hour" x1="30" y1="30" x2="30" y2="14" stroke="#e5e7eb" stroke-width="2.5" stroke-linecap="round" style="transform-origin:30px 30px;transition:transform .9s linear"/>
                <line class="ck-min" x1="30" y1="30" x2="30" y2="8" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" style="transform-origin:30px 30px;transition:transform .9s linear"/>
                <circle cx="30" cy="30" r="2" fill="#f59e0b"/>
            </svg>`;
            panel.insertBefore(clockWrap, panel.firstChild);
        }

        // Update clock hands (smooth via CSS transition)
        const hHand = clockWrap.querySelector('.ck-hour');
        const mHand = clockWrap.querySelector('.ck-min');
        hHand.style.transform = `rotate(${hourAngle}deg)`;
        mHand.style.transform = `rotate(${minAngle}deg)`;

        // Update face & sun
        const face = clockWrap.querySelector('.ck-face');
        face.setAttribute('fill', faceColor);
        face.setAttribute('stroke', rimColor);
        const sunEl = clockWrap.querySelector('.ck-sun');
        const sunGlow = clockWrap.querySelector('.ck-sun-glow');
        sunEl.setAttribute('cx', sunX); sunEl.setAttribute('cy', sunY);
        sunEl.setAttribute('opacity', isDaytime ? '0.9' : '0.3');
        sunEl.setAttribute('fill', isDaytime ? '#f59e0b' : '#94a3b8');
        sunGlow.setAttribute('cx', sunX); sunGlow.setAttribute('cy', sunY);
        sunGlow.setAttribute('opacity', isDaytime ? '0.2' : '0');

        // === Info section (rebuilt each tick) ===
        // Group batteries by type
        const battGroups = {};
        batteries.forEach(b => {
            if (!battGroups[b.type]) battGroups[b.type] = [];
            battGroups[b.type].push(b);
        });

        let battInfo = '';
        Object.entries(battGroups).forEach(([type, batts]) => {
            const totalLevel = batts.reduce((s, b) => s + b.batteryLevel, 0);
            const totalCap = batts.reduce((s, b) => s + b.batteryCapacity, 0);
            const avgPct = (totalLevel / totalCap) * 100;
            const isRch = type.includes('lifepo4') || type.includes('plts') || type === 'battery_32140';
            const icon = avgPct > 50 ? '🟢' : avgPct > 20 ? '🟡' : (isRch && avgPct <= 10) ? '🛑' : avgPct > 0 ? '🔴' : '💀';
            const dodLabel = isRch && avgPct <= 10 ? ' <span style="color:#ef4444;font-size:9px">(BMS)</span>' : '';
            const tmpl = COMPONENTS.find(t => t.id === type);
            const typeName = tmpl ? tmpl.name : type;
            if (batts.length === 1) {
                battInfo += `<div class="sim-batt">${icon} ${avgPct.toFixed(0)}% (${totalLevel.toFixed(0)}Wh)${dodLabel}</div>`;
            } else {
                const whLabel = totalLevel >= 1000 ? `${(totalLevel/1000).toFixed(1)}kWh` : `${totalLevel.toFixed(0)}Wh`;
                const capLabel = totalCap >= 1000 ? `${(totalCap/1000).toFixed(1)}kWh` : `${totalCap.toFixed(0)}Wh`;
                battInfo += `<div class="sim-batt">${icon} ${batts.length}× ${typeName}: ${avgPct.toFixed(0)}% (${whLabel}/${capLabel})${dodLabel}</div>`;
            }
        });

        const noPowerLabel = noPower ? ' <span style="color:#ef4444;font-weight:700">⛔ NO POWER</span>' : '';

        // Update or create info section
        let infoEl = panel.querySelector('.sim-info');
        if (!infoEl) {
            infoEl = document.createElement('div');
            infoEl.className = 'sim-info';
            panel.appendChild(infoEl);
        }
        infoEl.innerHTML = `
            <div class="sim-header">${timeIcon} Hari ${dayNum} ${timeStr} <span style="color:#f59e0b">☀${solarPct}%</span> | <span style="color:${speedColor}">${speedLabel}</span>${noPowerLabel}</div>
            <div class="sim-power">⚡${solarW.toFixed(0)}W ⬇ 🏠${loadW.toFixed(0)}W ⬆ = <span style="color:${netColor}">${netSign}${netW.toFixed(0)}W</span></div>
            ${battInfo}
        `;
    }

    function startSim(speed) {
        simSpeed = speed;
        if (simInterval) clearInterval(simInterval);
        if (speed > 0) {
            simInterval = setInterval(simTick, 1000);
            simTick(); // Run immediately, don't wait 1s
        }
        document.querySelectorAll('.sim-btn[data-speed]').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.sim-btn[data-speed="${speed}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        saveSimState();
    }

    function resetBatteries() {
        deployed.forEach(c => {
            if (c.batteryCapacity) {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                c.batteryLevel = c.batteryCapacity;
                if (tmpl) c.voltage = tmpl.voltage;
                const el = document.getElementById(c.id);
                if (el) {
                    el.classList.remove('battery-dead');
                    el.style.opacity = '';
                }
            }
        });
        simElapsedMin = 0;
        saveSimState();
        evaluateCircuit();
    }

    function saveSimState() {
        try {
            localStorage.setItem('czelectro_sim', JSON.stringify({
                simSpeed, simElapsedMin
            }));
        } catch(e) {}
    }

    function restoreSimState() {
        try {
            const raw = localStorage.getItem('czelectro_sim');
            if (!raw) return;
            const s = JSON.parse(raw);
            simElapsedMin = s.simElapsedMin || 0;
            // Restore speed (start paused, user can resume)
            if (s.simSpeed > 0) {
                startSim(s.simSpeed);
            }
            // Re-evaluate with correct mode and show battery bars
            setTimeout(() => {
                evaluateCircuit(); // Apply night mode voltage rules
                updateBatteryBars(); // Show bars + dead state
            }, 150);
        } catch(e) {}
    }

    // ── Battery Fill Config — dimensions for each battery type ──
    const BATT_FILL_CFG = {
        'battery_9v':       { dir: 'v', yTop: 17, yBot: 103 },
        'battery_3v':       { dir: 'h', maxW: 66 },
        'battery_1v5':      { dir: 'h', maxW: 46 },
        'battery_12v':      { dir: 'v', yTop: 10, yBot: 70 },
        'battery_32140':    { dir: 'h', maxW: 12 },
        'battery_lifepo4':  { dir: 'h', maxW: 22 },
        'battery_plts_100': { dir: 'h', maxW: 64 },
        'battery_plts_200': { dir: 'h', maxW: 78 },
    };

    function updateBatteryBars() {
        deployed.forEach(bat => {
            if (!bat.batteryCapacity) return;
            const el = document.getElementById(bat.id);
            if (!el) return;
            const pct = Math.max(0, Math.min(100, (bat.batteryLevel / bat.batteryCapacity) * 100));
            const cfg = BATT_FILL_CFG[bat.type];
            const fillEl = el.querySelector('.batt-fill');
            const pctEl = el.querySelector('.batt-pct');

            // Color based on charge level
            const color = pct > 50 ? '#22c55e' : pct > 20 ? '#f59e0b' : '#ef4444';

            if (fillEl && cfg) {
                fillEl.setAttribute('fill', color);
                if (cfg.dir === 'v') {
                    // Vertical fill: bottom to top
                    const totalH = cfg.yBot - cfg.yTop;
                    const fillH = (pct / 100) * totalH;
                    fillEl.setAttribute('y', (cfg.yBot - fillH).toFixed(1));
                    fillEl.setAttribute('height', fillH.toFixed(1));
                } else {
                    // Horizontal fill: left to right
                    const fillW = (pct / 100) * cfg.maxW;
                    fillEl.setAttribute('width', fillW.toFixed(1));
                }
            }

            // Update percentage text for PLTS batteries (white for contrast)
            if (pctEl) {
                pctEl.textContent = `${pct.toFixed(0)}%`;
                pctEl.setAttribute('fill', '#fff');
            }

            // DoD threshold: rechargeable batteries show dead at 10% (BMS cutoff)
            const isRechargeable = bat.type.includes('lifepo4') || bat.type.includes('plts') || bat.type === 'battery_32140';
            const deadThreshold = isRechargeable ? bat.batteryCapacity * 0.10 : 0;
            if (bat.batteryLevel <= deadThreshold) {
                el.classList.add('battery-dead');
                el.style.opacity = '0.5';
            } else {
                el.classList.remove('battery-dead');
                el.style.opacity = '';
            }
        });
    }

    function updateStatusValues(hasLoop, loops) {
        const dot = document.getElementById('circuit-dot');
        const statusTxt = document.getElementById('circuit-status');
        const loopsDiv = document.getElementById('circuit-loops');

        if (hasLoop && loops.length > 0) {
            dot.className = 'status-dot live';
            statusTxt.textContent = loops.length === 1 ? 'Circuit Active' : `${loops.length} Circuits Active`;
            loopsDiv.innerHTML = loops.map((l, idx) => {
                const label = loops.length > 1 ? `<span style="color:var(--accent);font-weight:700;">#${idx + 1}</span> ` : '';
                const wattStr = l.w >= 1 ? `${l.w.toFixed(1)}W` : `${(l.w * 1000).toFixed(0)}mW`;
                let realInfo = '';
                if (l.srcW > 0 && l.loadW > 0) {
                    const ok = l.srcW >= l.loadW;
                    realInfo = `<div class="status-item" style="color:${ok ? '#4ade80' : '#f87171'};font-size:10px;">${ok ? '✅' : '⚠️'} Sumber: ${l.srcW}W | Beban: ${l.loadW}W ${ok ? '(Cukup)' : '(Kurang!)'}</div>`;
                }
                return `<div class="status-item">${label}⚡${l.v.toFixed(1)}V &nbsp;🔌${(l.i * 1000).toFixed(1)}mA &nbsp;Ω${l.r.toFixed(0)} &nbsp;💡${wattStr}</div>${realInfo}`;
            }).join('');
        } else if (deployed.length) {
            dot.className = 'status-dot warn';
            statusTxt.textContent = 'Open Circuit';
            loopsDiv.innerHTML = '';
        } else {
            dot.className = 'status-dot';
            statusTxt.textContent = 'No Circuit';
            loopsDiv.innerHTML = '';
        }
        updateStatus();
    }

    // ── Event Handlers (with drag threshold) ──
    document.addEventListener('mousedown', e => {
        // Sidebar drag — immediate
        const sItem = e.target.closest('.sidebar-item');
        if (sItem) {
            e.preventDefault();
            const tmplId = sItem.dataset.id;
            const tmpl = COMPONENTS.find(t => t.id === tmplId);
            if (!tmpl) return;

            // Create ghost element on body (above sidebar z-index)
            const ghost = document.createElement('div');
            ghost.className = 'drag-ghost';
            ghost.innerHTML = tmpl.svg;
            ghost.style.cssText = `
                position: fixed; z-index: 10000; pointer-events: none;
                width: ${tmpl.width}px; height: ${tmpl.height}px;
                left: ${e.clientX - tmpl.width / 2}px;
                top: ${e.clientY - tmpl.height / 2}px;
                opacity: 0.85; transform: scale(1.05);
                filter: drop-shadow(0 4px 12px rgba(74,222,128,0.3));
                transition: transform 0.1s, opacity 0.1s;
            `;
            document.body.appendChild(ghost);

            const onMove = (ev) => {
                ghost.style.left = (ev.clientX - tmpl.width / 2) + 'px';
                ghost.style.top = (ev.clientY - tmpl.height / 2) + 'px';
            };

            const onUp = (ev) => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                ghost.remove();

                // Check if dropped over workspace area
                const wRect = wCont.getBoundingClientRect();
                if (ev.clientX >= wRect.left && ev.clientX <= wRect.right &&
                    ev.clientY >= wRect.top && ev.clientY <= wRect.bottom) {
                    // Spawn real component at drop position
                    const comp = spawnComponent(tmplId, ev.clientX, ev.clientY);
                    if (comp) { saveState(); }
                } else {
                    // Dropped outside workspace — cancelled
                }
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            return;
        }

        // Terminal — start wiring
        const termEl = e.target.closest('.terminal');
        if (termEl) {
            e.stopPropagation();
            const cid = termEl.dataset.cid, tidx = parseInt(termEl.dataset.tidx);
            const comp = deployed.find(c => c.id === cid);
            activeTerm = { cid, tidx, comp, el: termEl };
            const pos = getAbsPos(comp, comp.terminals[tidx]);
            tmpWire.setAttribute('d', `M ${pos.x} ${pos.y} L ${pos.x} ${pos.y}`);
            tmpWire.style.display = 'inline';
            return;
        }

        // Board component — potential drag OR click
        const bComp = e.target.closest('.board-component');
        if (bComp && e.button === 0) {
            dragEl = bComp;
            // Use workspace coordinates for offset — immune to CSS rotation
            const comp = deployed.find(c => c.id === bComp.id);
            const wPos = clientToWorkspace(e.clientX, e.clientY);
            dragOX = comp ? wPos.x - comp.x : 0;
            dragOY = comp ? wPos.y - comp.y : 0;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragMoved = false;
            isDragging = true;
            return;
        }

        // Empty workspace click
        if (e.button === 0 && (e.target === ws || e.target === gridCanvas || e.target === wCont)) {
            if (e.shiftKey) {
                // Shift+drag = pan workspace
                e.preventDefault(); isPanning = true;
                panStartX = e.clientX; panStartY = e.clientY;
                panStartPX = panX; panStartPY = panY;
                wCont.style.cursor = 'grabbing';
            } else {
                // Normal drag = selection rectangle
                const m = clientToWorkspace(e.clientX, e.clientY);
                selStartX = m.x; selStartY = m.y;
                selRect = document.createElement('div');
                selRect.className = 'selection-rect';
                ws.appendChild(selRect);
                selectedIds.clear();
                document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
            }
        }
    });

    document.addEventListener('mousemove', e => {
        // Pan
        if (isPanning) {
            panX = panStartPX + (e.clientX - panStartX);
            panY = panStartPY + (e.clientY - panStartY);
            applyTransform();
            return;
        }

        const m = clientToWorkspace(e.clientX, e.clientY);

        // Wire bend drag
        if (activeWireDrag) {
            const w = wires[activeWireDrag.wireIdx];
            if (w) {
                w.bend = {
                    x: activeWireDrag.startBend.x + (m.x - activeWireDrag.startMouse.x),
                    y: activeWireDrag.startBend.y + (m.y - activeWireDrag.startMouse.y)
                };
                renderWires();
            }
            return;
        }

        // Component drag — only after threshold
        if (isDragging && dragEl) {
            if (!dragMoved) {
                const dx = Math.abs(e.clientX - dragStartX);
                const dy = Math.abs(e.clientY - dragStartY);
                if (dx + dy < DRAG_THRESHOLD) return;
                dragMoved = true;
                ws.appendChild(dragEl); // bring to top only when actually dragging
            }
            let nx = Math.round((m.x - dragOX) / GRID) * GRID;
            let ny = Math.round((m.y - dragOY) / GRID) * GRID;
            dragEl.style.left = nx + 'px';
            dragEl.style.top = ny + 'px';
            const comp = deployed.find(c => c.id === dragEl.id);
            if (comp) {
                const oldX = comp.x, oldY = comp.y;
                comp.x = nx; comp.y = ny;
                // Multi-drag: move all selected components by same delta
                if (selectedIds.has(comp.id) && selectedIds.size > 1) {
                    const dx = nx - oldX, dy = ny - oldY;
                    deployed.forEach(c => {
                        if (c.id !== comp.id && selectedIds.has(c.id)) {
                            c.x += dx; c.y += dy;
                            const el = document.getElementById(c.id);
                            if (el) { el.style.left = c.x + 'px'; el.style.top = c.y + 'px'; }
                        }
                    });
                }
                renderWires();
            }
        }

        // Selection rectangle drawing
        if (selRect) {
            const x = Math.min(selStartX, m.x), y = Math.min(selStartY, m.y);
            const w = Math.abs(m.x - selStartX), h = Math.abs(m.y - selStartY);
            selRect.style.left = x + 'px'; selRect.style.top = y + 'px';
            selRect.style.width = w + 'px'; selRect.style.height = h + 'px';
            return;
        }

        // Wiring preview
        if (activeTerm) {
            const start = getAbsPos(activeTerm.comp, activeTerm.comp.terminals[activeTerm.tidx]);
            const dir1 = getTerminalDir(activeTerm.comp, activeTerm.tidx);
            tmpWire.setAttribute('d', makePreviewPath(start, dir1, m.x, m.y));
        }
    });

    document.addEventListener('mouseup', e => {
        if (isPanning) { isPanning = false; wCont.style.cursor = ''; saveState(); return; }

        // End wire bend drag
        if (activeWireDrag) { activeWireDrag = null; saveState(); return; }

        // End selection rectangle — select components within
        if (selRect) {
            const rx = parseFloat(selRect.style.left) || 0;
            const ry = parseFloat(selRect.style.top) || 0;
            const rw = parseFloat(selRect.style.width) || 0;
            const rh = parseFloat(selRect.style.height) || 0;
            selRect.remove(); selRect = null;
            if (rw > 5 || rh > 5) {
                deployed.forEach(c => {
                    const tmpl = COMPONENTS.find(t => t.id === c.type);
                    if (!tmpl) return;
                    const cx = c.x + tmpl.width / 2, cy = c.y + tmpl.height / 2;
                    if (cx >= rx && cx <= rx + rw && cy >= ry && cy <= ry + rh) {
                        selectedIds.add(c.id);
                        document.getElementById(c.id)?.classList.add('selected');
                    }
                });
            }
            return;
        }

        // Click (not drag) — handle switch toggle
        if (isDragging && dragEl && !dragMoved) {
            const comp = deployed.find(c => c.id === dragEl.id);
            if (comp && comp.type === 'switch_toggle') {
                comp.isClosed = !comp.isClosed;
                comp.currentResistance = comp.isClosed ? 0 : Infinity;
                dragEl.classList.toggle('switch-closed');
                // Visual feedback
                const indicator = dragEl.querySelector('.switch-state');
                if (indicator) indicator.textContent = comp.isClosed ? 'ON' : 'OFF';
                SFX.switchClick();
                evaluateCircuit();
            }
        }

        if (dragEl) {
            dragEl.style.opacity = '';
            dragEl.style.zIndex = '';
        }
        isDragging = false; dragEl = null;
        if (dragMoved) { saveState(); }
        dragMoved = false;

        if (activeTerm) {
            tmpWire.style.display = 'none';
            const tgt = e.target.closest('.terminal');
            if (tgt) {
                const tCid = tgt.dataset.cid, tIdx = parseInt(tgt.dataset.tidx);
                if (tCid !== activeTerm.cid) {
                    // Prevent duplicate wires
                    const dup = wires.some(w =>
                        (w.c1 === activeTerm.cid && w.i1 === activeTerm.tidx && w.c2 === tCid && w.i2 === tIdx) ||
                        (w.c2 === activeTerm.cid && w.i2 === activeTerm.tidx && w.c1 === tCid && w.i1 === tIdx)
                    );
                    if (!dup) {
                        const colors = ['#94a3b8','#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7'];
                        wires.push({
                            c1: activeTerm.cid, i1: activeTerm.tidx,
                            c2: tCid, i2: tIdx,
                            color: colors[wires.length % colors.length],
                            energized: false,
                            bend: { x: 0, y: 0 }
                        });
                        renderWires();
                        evaluateCircuit();
                        SFX.wireSnap();
                    }
                }
            }
            activeTerm = null;
        }
    });

    // Wire drag (left-click on wire/handle = bend) 
    document.addEventListener('mousedown', e => {
        const handle = e.target.closest('.wire-handle');
        const hitArea = e.target.closest('.wire-hit-area');
        const target = handle || hitArea;
        if (target && e.button === 0) {
            e.stopPropagation();
            const wi = parseInt(target.dataset.widx);
            const w = wires[wi];
            if (!w) return;
            const m = clientToWorkspace(e.clientX, e.clientY);
            activeWireDrag = {
                wireIdx: wi,
                startMouse: { x: m.x, y: m.y },
                startBend: { x: w.bend?.x || 0, y: w.bend?.y || 0 }
            };
        }
    }, true); // capture phase so it fires before component drag

    // Right-click on wire = delete
    wireLayer.addEventListener('contextmenu', e => {
        const wGroup = e.target.closest('.wire-group');
        if (wGroup) {
            e.preventDefault();
            e.stopPropagation();
            const wIdx = parseInt(wGroup.dataset.widx);
            wires.splice(wIdx, 1);
            renderWires(); evaluateCircuit();
        }
    });

    // Context menu: delete component
    wCont.addEventListener('contextmenu', e => {
        e.preventDefault();
        const existing = document.querySelector('.ctx-menu');
        if (existing) existing.remove();

        const bComp = e.target.closest('.board-component');
        if (!bComp) return;

        const comp = deployed.find(c => c.id === bComp.id);
        const tmpl = COMPONENTS.find(t => t.id === comp?.type);
        const name = tmpl?.name || 'Komponen';
        const isBroken = comp?.isBroken;

        // Auto-include right-clicked component in selection
        if (!selectedIds.has(bComp.id) && comp) {
            selectedIds.add(comp.id);
            bComp.classList.add('selected');
        }

        const isMulti = selectedIds.size > 1;

        const menu = document.createElement('div');
        menu.className = 'ctx-menu';
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';

        let menuItems = '';

        if (isMulti) {
            menuItems += `<div class="ctx-item" data-action="info">🔲 ${selectedIds.size} komponen dipilih</div>`;
        } else {
            menuItems += `<div class="ctx-item" data-action="info">ℹ️ ${name}${isBroken ? ' <span style="color:#ef4444">(RUSAK)</span>' : ''}</div>`;
        }
        menuItems += `<div class="ctx-sep"></div>`;

        if (isBroken && !isMulti) {
            menuItems += `<div class="ctx-item" data-action="reset">🔄 Reset / Perbaiki</div>`;
        }

        // Show reset battery for single battery or multi-select where all are batteries
        const allBatteries = isMulti && [...selectedIds].every(cid => {
            const c = deployed.find(d => d.id === cid);
            return c && c.batteryCapacity;
        });

        if ((!isMulti && comp?.batteryCapacity) || allBatteries) {
            if (!isMulti) {
                const pct = ((comp.batteryLevel / comp.batteryCapacity) * 100).toFixed(0);
                menuItems += `<div class="ctx-item" data-action="resetbatt">🔋 Reset Baterai (${pct}% → 100%)</div>`;
            } else {
                menuItems += `<div class="ctx-item" data-action="resetbatt">🔋 Reset Semua Baterai (${selectedIds.size}) → 100%</div>`;
            }
        }

        menuItems += `<div class="ctx-item" data-action="duplicate">📋 Duplikat${isMulti ? ` (${selectedIds.size})` : ''}</div>`;
        menuItems += `<div class="ctx-item" data-action="rotate">🔄 Putar 90° (R)${isMulti ? ` (${selectedIds.size})` : ''}</div>`;
        menuItems += `<div class="ctx-item" data-action="copytext">📝 Salin Teks Rangkaian</div>`;
        menuItems += `<div class="ctx-sep"></div>`;
        menuItems += `<div class="ctx-item danger" data-action="delete">🗑 Hapus${isMulti ? ` (${selectedIds.size})` : ''}</div>`;

        menu.innerHTML = menuItems;
        document.body.appendChild(menu);

        // Adjust position if menu goes off-screen
        requestAnimationFrame(() => {
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
            if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
            if (rect.left < 0) menu.style.left = '8px';
            if (rect.top < 0) menu.style.top = '8px';
        });

        menu.addEventListener('click', ev => {
            const action = ev.target.closest('.ctx-item')?.dataset.action;
            if (action === 'delete') {
                // Delete all selected (synced with Delete key behavior)
                const idsToDelete = new Set(selectedIds);
                idsToDelete.forEach(cid => {
                    deployed = deployed.filter(c => c.id !== cid);
                    wires = wires.filter(w => w.c1 !== cid && w.c2 !== cid);
                    document.getElementById(cid)?.remove();
                });
                selectedIds.clear();
                renderWires(); evaluateCircuit();
            } else if (action === 'duplicate') {
                duplicateSelected();
            } else if (action === 'copytext') {
                // Build component summary text
                const counts = {};
                selectedIds.forEach(cid => {
                    const c = deployed.find(d => d.id === cid);
                    if (!c) return;
                    const t = COMPONENTS.find(x => x.id === c.type);
                    const key = t ? t.name : c.type;
                    counts[key] = (counts[key] || 0) + 1;
                });
                const parts = Object.entries(counts).map(([name, qty]) => qty > 1 ? `${qty}×${name}` : name);
                const text = parts.join(' + ');
                navigator.clipboard.writeText(text).then(() => {
                    // Show brief toast
                    const toast = document.createElement('div');
                    toast.className = 'copy-toast';
                    toast.textContent = `📋 "${text}" disalin!`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2500);
                });
            } else if (action === 'reset' && comp) {
                resetComponent(comp.id);
            } else if (action === 'resetbatt') {
                // Reset batteries — single or multi-select
                const targets = isMulti ? [...selectedIds] : (comp ? [comp.id] : []);
                targets.forEach(cid => {
                    const c = deployed.find(d => d.id === cid);
                    if (!c || !c.batteryCapacity) return;
                    c.batteryLevel = c.batteryCapacity;
                    const t = COMPONENTS.find(x => x.id === c.type);
                    if (t) c.voltage = t.voltage;
                });
                evaluateCircuit();
            } else if (action === 'rotate') {
                selectedIds.forEach(cid => rotateComponent(cid));
            }
            menu.remove();
        });

        const closeMenu = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', closeMenu); } };
        setTimeout(() => document.addEventListener('mousedown', closeMenu), 10);
    });

    // ── Keyboard: Delete selected, Escape clear selection ──
    document.addEventListener('keydown', e => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedIds.size > 0) {
                e.preventDefault();
                selectedIds.forEach(cid => {
                    deployed = deployed.filter(c => c.id !== cid);
                    wires = wires.filter(w => w.c1 !== cid && w.c2 !== cid);
                    document.getElementById(cid)?.remove();
                });
                selectedIds.clear();
                renderWires(); evaluateCircuit();
            }
        }
        if (e.key === 'Escape') {
            selectedIds.clear();
            document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
        }
        // Ctrl+D = Duplicate selected
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            duplicateSelected();
        }
        // R = Rotate selected components 90°
        if (e.key === 'r' || e.key === 'R') {
            if (selectedIds.size > 0 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                selectedIds.forEach(cid => rotateComponent(cid));
            }
        }
        // M = Toggle mute
        if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
            document.getElementById('btn-mute').click();
        }
    });

    // ── Shared duplicate function (used by Ctrl+D and context menu) ──
    function duplicateSelected() {
        if (selectedIds.size === 0) return;
        const newIds = new Set();
        const idMap = {};
        selectedIds.forEach(cid => {
            const comp = deployed.find(c => c.id === cid);
            if (!comp) return;
            const tmpl = COMPONENTS.find(t => t.id === comp.type);
            if (!tmpl) return;
            counter++;
            const newId = `c_${comp.type}_${counter}`;
            idMap[cid] = newId;

            const el = document.createElement('div');
            el.className = 'board-component';
            el.id = newId;
            const nx = comp.x + 40, ny = comp.y + 40;
            el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${nx}px;top:${ny}px;`;
            el.innerHTML = tmpl.svg;

            const newComp = {
                id: newId, type: comp.type, voltage: tmpl.voltage,
                baseResistance: tmpl.resistance, currentResistance: tmpl.resistance,
                maxCurrent: tmpl.maxCurrent || null, glowGradient: tmpl.glowGradient || null,
                isClosed: false, isBroken: false, rotation: comp.rotation || 0, x: nx, y: ny,
                terminals: JSON.parse(JSON.stringify(tmpl.terminals))
            };
            // Copy battery properties from source
            if (tmpl.capacityWh) {
                newComp.batteryCapacity = tmpl.capacityWh;
                newComp.batteryLevel = comp.batteryLevel ?? tmpl.capacityWh;
            }
            // Apply rotation CSS if source was rotated
            if (newComp.rotation) {
                el.style.transform = `rotate(${newComp.rotation}deg)`;
                const badge = document.createElement('div');
                badge.className = 'rotation-badge';
                badge.textContent = `${newComp.rotation}°`;
                el.appendChild(badge);
            }
            newComp.terminals.forEach((term, idx) => {
                const tEl = document.createElement('div');
                tEl.className = 'terminal';
                tEl.style.left = `${term.x - 8}px`;
                tEl.style.top = `${term.y - 8}px`;
                tEl.dataset.cid = newId;
                tEl.dataset.tidx = idx;
                tEl.dataset.label = term.label || '';
                el.appendChild(tEl);
            });
            ws.appendChild(el);
            deployed.push(newComp);
            newIds.add(newId);
        });
        // Duplicate wires between selected components (snapshot to avoid infinite loop)
        const origWires = [...wires];
        origWires.forEach(w => {
            if (idMap[w.c1] && idMap[w.c2]) {
                wires.push({
                    c1: idMap[w.c1], i1: w.i1,
                    c2: idMap[w.c2], i2: w.i2,
                    color: w.color, energized: false,
                    bend: { x: (w.bend?.x || 0), y: (w.bend?.y || 0) }
                });
            }
        });
        // Select new components
        selectedIds.clear();
        document.querySelectorAll('.board-component.selected').forEach(el => el.classList.remove('selected'));
        newIds.forEach(id => {
            selectedIds.add(id);
            document.getElementById(id)?.classList.add('selected');
        });
        renderWires(); evaluateCircuit();
    }

    // ── Persistence: Save & Restore ──
    const STORAGE_KEY = 'czelectro_state';

    function saveState() {
        try {
            const state = {
                deployed: deployed.map(c => ({
                    id: c.id, type: c.type, x: c.x, y: c.y,
                    isBroken: c.isBroken, isClosed: c.isClosed,
                    currentResistance: c.currentResistance,
                    rotation: c.rotation || 0,
                    batteryLevel: c.batteryLevel,
                    batteryCapacity: c.batteryCapacity
                })),
                wires: wires.map(w => ({
                    c1: w.c1, i1: w.i1, c2: w.c2, i2: w.i2,
                    color: w.color, bend: w.bend || { x: 0, y: 0 }
                })),
                counter, zoom, panX, panY
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* quota exceeded, silently fail */ }
    }

    function restoreState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const state = JSON.parse(raw);
            if (!state.deployed || !state.wires) return false;

            counter = state.counter || 0;
            zoom = state.zoom || 1;
            panX = state.panX || 0;
            panY = state.panY || 0;

            // Rebuild components
            state.deployed.forEach(saved => {
                const tmpl = COMPONENTS.find(t => t.id === saved.type);
                if (!tmpl) return;

                const el = document.createElement('div');
                el.className = 'board-component';
                el.id = saved.id;
                el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${saved.x}px;top:${saved.y}px;`;
                el.innerHTML = tmpl.svg;

                const comp = {
                    id: saved.id, type: saved.type, voltage: tmpl.voltage,
                    baseResistance: tmpl.resistance,
                    currentResistance: saved.currentResistance ?? tmpl.resistance,
                    maxCurrent: tmpl.maxCurrent || null,
                    glowGradient: tmpl.glowGradient || null,
                    isClosed: saved.isClosed || false,
                    isBroken: saved.isBroken || false,
                    rotation: saved.rotation || 0,
                    x: saved.x, y: saved.y,
                    terminals: JSON.parse(JSON.stringify(tmpl.terminals))
                };

                // Restore battery level from saved state
                if (tmpl.capacityWh) {
                    comp.batteryCapacity = tmpl.capacityWh;
                    comp.batteryLevel = saved.batteryLevel ?? tmpl.capacityWh;
                }

                // Re-create terminals
                comp.terminals.forEach((term, idx) => {
                    const tEl = document.createElement('div');
                    tEl.className = 'terminal';
                    tEl.style.left = `${term.x - 8}px`;
                    tEl.style.top = `${term.y - 8}px`;
                    tEl.dataset.cid = saved.id;
                    tEl.dataset.tidx = idx;
                    tEl.dataset.label = term.label || '';
                    el.appendChild(tEl);
                });

                // Restore visual states
                if (comp.isBroken) {
                    el.classList.add('comp-broken');
                    if (comp.type.startsWith('led_') || comp.type === 'bulb') el.classList.add('led-broken');
                    if (comp.type === 'fuse') el.classList.add('fuse-blown');
                }
                if (comp.isClosed && comp.type === 'switch_toggle') {
                    el.classList.add('switch-closed');
                }
                // Restore rotation
                if (comp.rotation) {
                    el.style.transform = `rotate(${comp.rotation}deg)`;
                    const badge = document.createElement('div');
                    badge.className = 'rotation-badge';
                    badge.textContent = `${comp.rotation}°`;
                    el.appendChild(badge);
                }

                ws.appendChild(el);
                deployed.push(comp);
            });

            // Rebuild wires
            state.wires.forEach(saved => {
                wires.push({
                    c1: saved.c1, i1: saved.i1,
                    c2: saved.c2, i2: saved.i2,
                    color: saved.color || '#94a3b8',
                    energized: false,
                    bend: saved.bend || { x: 0, y: 0 }
                });
            });

            applyTransform();
            renderWires();
            evaluateCircuit();
            return true;
        } catch (e) {
            console.warn('CZElectro: Failed to restore state', e);
            return false;
        }
    }

    // Hook auto-save into evaluateCircuit
    // saveState() is called at the end of evaluateCircuit and after wire/component changes

    // ── Simulation Event Listeners ──
    document.addEventListener('sim-speed', (e) => startSim(e.detail));
    document.addEventListener('sim-reset', () => resetBatteries());
    document.addEventListener('sim-jump', (e) => {
        // Jump simulation clock to a specific time of day
        const currentDay = Math.floor(simElapsedMin / 1440);
        if (e.detail === 'day') {
            // Jump to 06:00 (sunrise)
            simElapsedMin = currentDay * 1440 + 6 * 60;
        } else {
            // Jump to 18:00 (sunset)
            simElapsedMin = currentDay * 1440 + 18 * 60;
        }
        saveSimState();
        evaluateCircuit();
        // Run one tick to update panel immediately
        if (simSpeed > 0) simTick();
    });

    // ── Init ──
    document.getElementById('btn-grid').classList.add('active');
    restoreState();
    restoreSimState();
    drawGrid();
    window.addEventListener('resize', drawGrid);
    applyTransform();
});
