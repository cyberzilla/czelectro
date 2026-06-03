// ═══════════════════════════════════════════════════
// CZElectro — Arduino IDE & Interpreter Module
// ═══════════════════════════════════════════════════
(function(CZ) {
    'use strict';

    // ── 7-Segment Character Map [a,b,c,d,e,f,g] ──
    // Verified against standard 7-segment datasheets
    //        a
    //       ───
    //   f │   │ b
    //       ─g─
    //   e │   │ c
    //       ───
    //        d
    const SEG7_CHARS = {
        '0': [1,1,1,1,1,1,0], '1': [0,1,1,0,0,0,0], '2': [1,1,0,1,1,0,1],
        '3': [1,1,1,1,0,0,1], '4': [0,1,1,0,0,1,1], '5': [1,0,1,1,0,1,1],
        '6': [1,0,1,1,1,1,1], '7': [1,1,1,0,0,0,0], '8': [1,1,1,1,1,1,1],
        '9': [1,1,1,1,0,1,1],
        'A': [1,1,1,0,1,1,1], 'B': [0,0,1,1,1,1,1], 'C': [1,0,0,1,1,1,0],
        'D': [0,1,1,1,1,0,1], 'E': [1,0,0,1,1,1,1], 'F': [1,0,0,0,1,1,1],
        'G': [1,0,1,1,1,1,0], 'H': [0,1,1,0,1,1,1], 'I': [0,1,1,0,0,0,0],
        'J': [0,1,1,1,0,0,0], 'K': [1,0,1,0,1,1,1], 'L': [0,0,0,1,1,1,0],
        'M': [1,0,1,0,1,0,0], 'N': [0,0,1,0,1,0,1], 'O': [1,1,1,1,1,1,0],
        'P': [1,1,0,0,1,1,1], 'Q': [1,1,1,0,0,1,1], 'R': [0,0,0,0,1,0,1],
        'S': [1,0,1,1,0,1,1], 'T': [0,0,0,1,1,1,1], 'U': [0,1,1,1,1,1,0],
        'V': [0,0,1,1,1,0,0], 'W': [0,1,0,1,0,1,0], 'X': [0,1,1,0,1,1,1],
        'Y': [0,1,1,1,0,1,1], 'Z': [1,1,0,1,1,0,1],
        ' ': [0,0,0,0,0,0,0], '-': [0,0,0,0,0,0,1], '_': [0,0,0,1,0,0,0],
        '.': [0,0,0,0,0,0,0], // dot handled via dp separately
    };
    const SEG_NAMES = ['a','b','c','d','e','f','g'];

    // ── Preset Examples ──
    const PRESETS = {
        'blink_led': {
            name: '💡 Blink LED',
            code: `// Blink LED yang terhubung ke pin D13
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}`
        },
        'seg7_counter': {
            name: '🔢 7-Seg Counter 0-9',
            code: `// Counter 0 sampai 9 pada 7-Segment
void setup() {
  seg7.clear();
}

void loop() {
  for (int i = 0; i <= 9; i++) {
    seg7.show(String(i));
    delay(800);
  }
}`
        },
        'seg7_text': {
            name: '📝 7-Seg Running Text',
            code: `// Running text pada 7-Segment Display
void setup() {
  seg7.clear();
}

void loop() {
  seg7.text("HELLO ", 400);
  delay(200);
  seg7.text("ARDUINO ", 400);
  delay(200);
}`
        },
        'seg7_alphabet': {
            name: '🔤 7-Seg Alphabet A-Z',
            code: `// Tampilkan A sampai Z
void setup() {
  Serial.println("Starting alphabet...");
}

void loop() {
  String abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (int i = 0; i < abc.length; i++) {
    seg7.show(abc[i]);
    Serial.println("Char: " + abc[i]);
    delay(600);
  }
  delay(1000);
}`
        },
        'seg7_custom': {
            name: '🎨 7-Seg Custom Segments',
            code: `// Kontrol segment individu [a,b,c,d,e,f,g]
void setup() {
  seg7.clear();
}

void loop() {
  // Pola custom - animasi berputar
  seg7.segments([1,0,0,0,0,0,0]); delay(150);
  seg7.segments([0,1,0,0,0,0,0]); delay(150);
  seg7.segments([0,0,1,0,0,0,0]); delay(150);
  seg7.segments([0,0,0,1,0,0,0]); delay(150);
  seg7.segments([0,0,0,0,1,0,0]); delay(150);
  seg7.segments([0,0,0,0,0,1,0]); delay(150);
}`
        },
        'motor_control': {
            name: '⚙️ Motor Speed Control',
            code: `// Kontrol kecepatan motor bertahap
void setup() {
  Serial.println("Motor speed test");
}

void loop() {
  for (int s = 0; s <= 255; s += 51) {
    motor.speed(s);
    Serial.println("Speed: " + String(s));
    delay(1000);
  }
  motor.speed(0);
  delay(2000);
}`
        },
    };

    // ── Active Arduino Sessions ──
    const sessions = new Map(); // compId → session

    // ── Find connected components ──
    function findConnected(arduinoId) {
        const connected = { leds: [], seg7s: [], motors: [], servos: [], fans: [], buzzers: [], all: [] };
        CZ.wires.forEach(w => {
            let otherId = null;
            if (w.c1 === arduinoId) otherId = w.c2;
            else if (w.c2 === arduinoId) otherId = w.c1;
            if (!otherId) return;
            const comp = CZ.deployed.find(c => c.id === otherId);
            if (!comp) return;
            const entry = { id: otherId, comp, type: comp.type };
            connected.all.push(entry);
            if (comp.type.startsWith('led_')) connected.leds.push(entry);
            if (comp.type === 'seven_segment') connected.seg7s.push(entry);
            if (comp.type === 'motor_dc') connected.motors.push(entry);
            if (comp.type === 'servo_sg90') connected.servos.push(entry);
            if (comp.type === 'fan_12v') connected.fans.push(entry);
            if (comp.type === 'buzzer') connected.buzzers.push(entry);
        });
        return connected;
    }

    // ── Apply 7-segment pattern to DOM ──
    function applySeg7Pattern(seg7Entry, pattern, dp = false) {
        const el = document.getElementById(seg7Entry.id);
        if (!el) return;
        el.classList.add('seg7-active');
        SEG_NAMES.forEach((name, i) => {
            const seg = el.querySelector('.seg-' + name);
            if (seg) {
                if (pattern[i]) {
                    seg.setAttribute('fill', '#ef4444');
                    seg.style.filter = 'drop-shadow(0 0 3px rgba(239,68,68,0.8))';
                } else {
                    seg.setAttribute('fill', '#374151');
                    seg.style.filter = 'none';
                }
            }
        });
        const dpEl = el.querySelector('.seg-dp');
        if (dpEl) {
            dpEl.setAttribute('fill', dp ? '#ef4444' : '#374151');
            dpEl.style.filter = dp ? 'drop-shadow(0 0 3px rgba(239,68,68,0.8))' : 'none';
        }
    }

    // ── Clear 7-segment ──
    function clearSeg7(seg7Entry) {
        applySeg7Pattern(seg7Entry, [0,0,0,0,0,0,0], false);
        const el = document.getElementById(seg7Entry.id);
        if (el) el.classList.remove('seg7-active');
    }

    // ── Create Arduino API for interpreter ──
    function createArduinoAPI(session) {
        const conn = session.connected;
        const serialLines = session.serialLines;
        let aborted = false;

        const api = {
            // Constants
            HIGH: 1, LOW: 0, OUTPUT: 1, INPUT: 0,
            LED_BUILTIN: 13,

            // Pin state
            _pins: {},
            _pinModes: {},

            // Abort flag
            get _aborted() { return session.aborted; },

            pinMode(pin, mode) { api._pinModes[pin] = mode; },

            digitalWrite(pin, value) {
                if (session.aborted) return;
                api._pins[pin] = value;
                // Store pin state on the deployed component for MNA integration
                const ardComp = CZ.deployed.find(c => c.id === session.compId);
                if (ardComp) {
                    if (!ardComp._arduinoPins) ardComp._arduinoPins = {};
                    ardComp._arduinoPins[pin] = value ? 1 : 0;
                }
                // Trigger MNA re-evaluation — LED/motor/etc will be handled by circuit
                CZ.evaluateCircuit();
            },

            digitalRead(pin) { return api._pins[pin] || 0; },
            analogRead(pin) { return Math.floor(Math.random() * 1024); },
            analogWrite(pin, val) { api._pins[pin] = val; },

            // delay — real async delay
            delay(ms) {
                return new Promise((resolve, reject) => {
                    if (session.aborted) return reject('__ABORT__');
                    const start = Date.now();
                    const check = () => {
                        if (session.aborted) return reject('__ABORT__');
                        if (Date.now() - start >= ms) return resolve();
                        const tid = setTimeout(check, Math.min(50, ms));
                        session._timers.push(tid);
                    };
                    const tid = setTimeout(check, Math.min(50, ms));
                    session._timers.push(tid);
                });
            },

            // Serial
            Serial: {
                println(val) {
                    const str = String(val);
                    serialLines.push(str);
                    if (serialLines.length > 200) serialLines.shift();
                    updateSerialMonitor(session);
                },
                print(val) {
                    const str = String(val);
                    if (serialLines.length === 0) serialLines.push('');
                    serialLines[serialLines.length - 1] += str;
                    updateSerialMonitor(session);
                },
                begin(baud) { /* no-op */ }
            },

            // 7-Segment high-level API
            seg7: {
                show(ch) {
                    if (session.aborted) return;
                    const char = String(ch).toUpperCase()[0] || ' ';
                    const pattern = SEG7_CHARS[char] || SEG7_CHARS[' '];
                    const hasDot = String(ch).includes('.');
                    conn.seg7s.forEach(s => {
                        const comp = CZ.deployed.find(c => c.id === s.id);
                        if (comp && comp.isPoweredOff) return;
                        // Stop any existing MNA-driven animation
                        if (comp && comp._seg7Interval) {
                            clearInterval(comp._seg7Interval);
                            comp._seg7Interval = null;
                        }
                        applySeg7Pattern(s, pattern, hasDot);
                    });
                },

                segments(arr) {
                    if (session.aborted) return;
                    const pattern = arr.map(v => v ? 1 : 0);
                    while (pattern.length < 7) pattern.push(0);
                    conn.seg7s.forEach(s => {
                        const comp = CZ.deployed.find(c => c.id === s.id);
                        if (comp && comp._seg7Interval) {
                            clearInterval(comp._seg7Interval);
                            comp._seg7Interval = null;
                        }
                        applySeg7Pattern(s, pattern);
                    });
                },

                async text(str, delayMs = 300) {
                    const text = String(str).toUpperCase();
                    for (let i = 0; i < text.length; i++) {
                        if (session.aborted) throw '__ABORT__';
                        const ch = text[i];
                        const pattern = SEG7_CHARS[ch] || SEG7_CHARS[' '];
                        conn.seg7s.forEach(s => applySeg7Pattern(s, pattern, false));
                        await api.delay(delayMs);
                    }
                },

                clear() {
                    conn.seg7s.forEach(s => clearSeg7(s));
                },

                dot(on) {
                    conn.seg7s.forEach(s => {
                        const el = document.getElementById(s.id);
                        if (!el) return;
                        const dpEl = el.querySelector('.seg-dp');
                        if (dpEl) {
                            dpEl.setAttribute('fill', on ? '#ef4444' : '#374151');
                            dpEl.style.filter = on ? 'drop-shadow(0 0 3px rgba(239,68,68,0.8))' : 'none';
                        }
                    });
                }
            },

            // Motor control
            motor: {
                speed(val) {
                    if (session.aborted) return;
                    const spd = Math.max(0, Math.min(255, val));
                    conn.motors.concat(conn.fans).forEach(m => {
                        const el = document.getElementById(m.id);
                        if (!el) return;
                        if (spd > 0) {
                            el.classList.add(m.type === 'fan_12v' ? 'fan-active' : 'motor-active');
                            const spinEl = el.querySelector('.motor-spin') || el.querySelector('.fan-spin');
                            if (spinEl) {
                                const duration = 0.1 + (1 - spd / 255) * 3.9;
                                spinEl.style.animation = `spin ${duration.toFixed(2)}s linear infinite`;
                            }
                        } else {
                            el.classList.remove('motor-active', 'fan-active');
                            const spinEl = el.querySelector('.motor-spin') || el.querySelector('.fan-spin');
                            if (spinEl) spinEl.style.animation = 'none';
                        }
                    });
                },
                stop() { api.motor.speed(0); }
            },

            // Servo control
            servo: {
                angle(deg) {
                    if (session.aborted) return;
                    conn.servos.forEach(s => {
                        const el = document.getElementById(s.id);
                        if (!el) return;
                        el.classList.add('servo-active');
                        const arm = el.querySelector('.servo-arm');
                        if (arm) {
                            arm.style.animation = 'none';
                            arm.style.transform = `rotate(${deg}deg)`;
                        }
                    });
                }
            },

            // Buzzer
            buzzer: {
                tone(freq, duration) {
                    if (session.aborted) return;
                    conn.buzzers.forEach(b => {
                        const el = document.getElementById(b.id);
                        if (el) el.classList.add('buzzer-active');
                    });
                    if (duration) {
                        setTimeout(() => api.buzzer.noTone(), duration);
                    }
                },
                noTone() {
                    conn.buzzers.forEach(b => {
                        const el = document.getElementById(b.id);
                        if (el) el.classList.remove('buzzer-active');
                    });
                }
            },

            // LED helper
            led: {
                on() { api.digitalWrite(13, 1); },
                off() { api.digitalWrite(13, 0); },
                toggle() { api.digitalWrite(13, api._pins[13] ? 0 : 1); },
                blink(ms) {
                    api.led.toggle();
                    return api.delay(ms);
                }
            }
        };

        return api;
    }

    // ── Upload Simulation ──
    function simulateUpload(session) {
        return new Promise(resolve => {
            session.serialLines = [];
            session.running = true;
            session._uploading = true;
            updateRunButton(session);

            const steps = [
                { msg: 'Compiling sketch...', delay: 400 },
                { msg: 'Sketch uses 924 bytes (2%) of program storage space.', delay: 300 },
                { msg: 'Global variables use 9 bytes (0%) of dynamic memory.', delay: 200 },
                { msg: '', delay: 100 },
                { msg: 'Uploading to board...', delay: 0 },
            ];
            let i = 0;
            let totalDelay = 0;
            steps.forEach(step => {
                totalDelay += step.delay;
                setTimeout(() => {
                    if (session.aborted) return;
                    if (step.msg) session.serialLines.push(step.msg);
                    updateSerialMonitor(session);
                }, totalDelay);
            });

            // Progress bar simulation
            const progressSteps = 10;
            for (let p = 0; p < progressSteps; p++) {
                setTimeout(() => {
                    if (session.aborted) return;
                    const pct = Math.round(((p + 1) / progressSteps) * 100);
                    const bar = '█'.repeat(p + 1) + '░'.repeat(progressSteps - p - 1);
                    // Replace last line if it's a progress bar
                    const lastIdx = session.serialLines.length - 1;
                    if (session.serialLines[lastIdx]?.startsWith('█') || session.serialLines[lastIdx]?.startsWith('░')) {
                        session.serialLines[lastIdx] = `${bar} ${pct}%`;
                    } else {
                        session.serialLines.push(`${bar} ${pct}%`);
                    }
                    updateSerialMonitor(session);
                }, totalDelay + 100 + p * 150);
            }

            setTimeout(() => {
                if (session.aborted) { resolve(false); return; }
                session.serialLines.push('avrdude done. Thank you.');
                session.serialLines.push('');
                session.serialLines.push('── Program Output ──');
                updateSerialMonitor(session);
                session._uploading = false;
                resolve(true);
            }, totalDelay + 100 + progressSteps * 150 + 200);
        });
    }

    // ── Interpreter — Run Arduino Code ──
    async function runArduinoCode(session, skipUploadSim) {
        session.aborted = false;
        session._timers = [];
        // Clear previous pin states
        const ardComp = CZ.deployed.find(c => c.id === session.compId);
        if (ardComp) ardComp._arduinoPins = {};
        // Track wire count for disconnect detection
        session._wireCount = CZ.wires.filter(w => w.c1 === session.compId || w.c2 === session.compId).length;

        if (!skipUploadSim) {
            // User clicked Upload → simulate compile & upload, then flash
            const uploaded = await simulateUpload(session);
            if (!uploaded) { session.running = false; updateRunButton(session); return; }
            localStorage.setItem('czelectro_ard_flash_' + session.compId, session.code);
            // Show FLASHED indicator on IDE and on chip SVG
            const flashEl = document.getElementById('ard-flash-' + session.compId);
            if (flashEl) flashEl.style.display = 'inline';
            const chipEl = document.getElementById(session.compId);
            if (chipEl) chipEl.classList.add('arduino-flashed');
        } else {
            // Auto-run from flash — show brief message, no upload sim
            session.serialLines = ['── Auto-run from flash ──'];
            session.running = true;
            updateSerialMonitor(session);
        }

        // Light up chip indicator — program running
        const chipEl = document.getElementById(session.compId);
        if (chipEl) chipEl.classList.add('arduino-running');

        const api = createArduinoAPI(session);
        session.api = api;

        const code = session.code;

        // Build async-wrapped code
        // Convert Arduino C syntax → JavaScript
        let asyncCode = code
            // void setup() → function setup(), void loop() → function loop()
            .replace(/\bvoid\s+setup\s*\(\)/g, 'function setup()')
            .replace(/\bvoid\s+loop\s*\(\)/g, 'function loop()')
            // C type declarations → let (simple cases only: Type varname = ...)
            .replace(/\b(int|float|double|byte|long|boolean|String)\s+(\w+)\s*=/g, 'let $2 =')
            // Replace delay() calls with await delay()
            .replace(/\bdelay\s*\(/g, 'await delay(')
            .replace(/\bseg7\.text\s*\(/g, 'await seg7.text(');

        // Wrap setup and loop as async
        asyncCode = asyncCode
            .replace(/function\s+setup\s*\(\)/g, 'async function setup()')
            .replace(/function\s+loop\s*\(\)/g, 'async function loop()');

        // Build the executor
        const fnBody = `
            ${asyncCode}

            try {
                if (typeof setup === 'function') await setup();
                if (typeof loop === 'function') {
                    for (let __i = 0; __i < 10000; __i++) {
                        if (_isAborted()) break;
                        await loop();
                        if (_isAborted()) break;
                        await delay(10); // yield
                    }
                }
            } catch(e) {
                if (e !== '__ABORT__') Serial.println('❌ Error: ' + e);
            }
        `;

        try {
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const fn = new AsyncFunction(
                'HIGH','LOW','OUTPUT','INPUT','LED_BUILTIN',
                'pinMode','digitalWrite','digitalRead','analogRead','analogWrite',
                'delay','Serial','seg7','motor','servo','buzzer','led',
                '_isAborted',
                fnBody
            );

            session.running = true;
            updateRunButton(session);

            await fn(
                api.HIGH, api.LOW, api.OUTPUT, api.INPUT, api.LED_BUILTIN,
                api.pinMode, api.digitalWrite.bind(api), api.digitalRead.bind(api),
                api.analogRead.bind(api), api.analogWrite.bind(api),
                api.delay, api.Serial, api.seg7, api.motor, api.servo, api.buzzer, api.led,
                () => session.aborted
            );
        } catch(e) {
            if (e !== '__ABORT__') {
                session.serialLines.push('❌ ' + String(e));
                updateSerialMonitor(session);
            }
        }

        session.running = false;
        // Turn off chip indicator
        const chipOff = document.getElementById(session.compId);
        if (chipOff) chipOff.classList.remove('arduino-running');
        resetAllControlled(session);
        updateRunButton(session);
    }

    // ── Reset all controlled component DOM effects ──
    function resetAllControlled(session) {
        // Clear Arduino pin states — removes virtual voltage sources from MNA
        const ardComp = CZ.deployed.find(c => c.id === session.compId);
        if (ardComp) {
            ardComp._arduinoPins = {};
        }

        const conn = session.connected;
        // Reset 7-segments (direct control — MNA can't handle individual segments)
        conn.seg7s.forEach(s => {
            const el = document.getElementById(s.id);
            if (!el) return;
            el.classList.remove('seg7-active');
            el.querySelectorAll('[class^="seg-"]').forEach(seg => {
                seg.setAttribute('fill', '#374151');
                seg.style.filter = 'none';
            });
        });
        // Reset buzzers (tone is Arduino-controlled, not MNA)
        (conn.buzzers || []).forEach(b => {
            const el = document.getElementById(b.id);
            if (el) el.classList.remove('buzzer-active');
        });

        // Trigger MNA re-evaluation — LED/motor will turn off naturally (no current)
        CZ.evaluateCircuit();
    }

    // ── Stop execution ──
    function stopArduino(session) {
        session.aborted = true;
        session._uploading = false;
        if (session._timers) session._timers.forEach(t => clearTimeout(t));
        session._timers = [];
        session.running = false;
        // Remove running indicator immediately
        const chipEl = document.getElementById(session.compId);
        if (chipEl) chipEl.classList.remove('arduino-running');
        resetAllControlled(session);
        updateRunButton(session);
    }

    // ── Update Serial Monitor ──
    function updateSerialMonitor(session) {
        const el = document.getElementById('ard-serial-' + session.compId);
        if (!el) return;
        el.textContent = session.serialLines.join('\n');
        el.scrollTop = el.scrollHeight;
    }

    // ── Update Run/Stop button ──
    function updateRunButton(session) {
        const runBtn = document.getElementById('ard-run-' + session.compId);
        if (runBtn) runBtn.disabled = session.running;
    }

    // ── Create IDE Modal ──
    function openArduinoIDE(compId) {
        // Close existing
        const existing = document.getElementById('arduino-ide-modal');
        if (existing) existing.remove();

        const comp = CZ.deployed.find(c => c.id === compId);
        if (!comp) return;

        // Get or create session
        if (!sessions.has(compId)) {
            // Load saved code from localStorage
            const savedCode = localStorage.getItem('czelectro_ard_code_' + compId);
            sessions.set(compId, {
                compId,
                code: savedCode || PRESETS['blink_led'].code,
                serialLines: [],
                connected: findConnected(compId),
                running: false,
                aborted: false,
                _timers: [],
                api: null,
            });
        }
        const session = sessions.get(compId);
        session.connected = findConnected(compId); // refresh connections

        // Build modal
        const modal = document.createElement('div');
        modal.id = 'arduino-ide-modal';
        modal.innerHTML = `
            <div class="ard-ide-backdrop"></div>
            <div class="ard-ide-container">
                <div class="ard-ide-header">
                    <div class="ard-ide-title">
                        <span class="ard-ide-icon">⚡</span>
                        <span>Arduino IDE</span>
                        <span class="ard-ide-comp-id">${compId}</span>
                    </div>
                    <div class="ard-ide-actions">
                        <select id="ard-preset-${compId}" class="ard-preset-select">
                            <option value="">📂 Contoh Program...</option>
                            ${Object.entries(PRESETS).map(([k, v]) =>
                                `<option value="${k}">${v.name}</option>`
                            ).join('')}
                        </select>
                        <button id="ard-run-${compId}" class="ard-btn ard-btn-run">⬆ Upload</button>
                        <button id="ard-reset-${compId}" class="ard-btn ard-btn-stop">↺ Reset</button>
                        <span id="ard-flash-${compId}" style="color:#22c55e;font-size:11px;margin-left:4px;display:${localStorage.getItem('czelectro_ard_flash_' + compId) ? 'inline' : 'none'}" title="Program ter-flash di chip">● FLASHED</span>
                        <button class="ard-btn ard-btn-close" id="ard-close-${compId}">✕</button>
                    </div>
                </div>
                <div class="ard-ide-body">
                    <div class="ard-ide-editor-pane">
                        <div class="ard-ide-pane-header">📝 Code Editor</div>
                        <textarea id="ard-code-${compId}" class="ard-code-editor" spellcheck="false">${session.code}</textarea>
                    </div>
                    <div class="ard-ide-serial-pane">
                        <div class="ard-ide-pane-header">
                            📡 Serial Monitor
                            <button id="ard-clear-serial-${compId}" class="ard-btn-mini">Clear</button>
                        </div>
                        <pre id="ard-serial-${compId}" class="ard-serial-output">${session.serialLines.join('\n')}</pre>
                        <div class="ard-ide-status">
                            <span class="ard-status-dot ${session.running ? 'running' : ''}"></span>
                            <span>${session.connected.seg7s.length} × 7-Seg, ${session.connected.leds.length} × LED, ${session.connected.motors.length + session.connected.fans.length} × Motor</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Helper: save code to localStorage
        const saveCode = () => {
            const val = document.getElementById(`ard-code-${compId}`).value;
            session.code = val;
            localStorage.setItem('czelectro_ard_code_' + compId, val);
        };

        // Event handlers
        document.getElementById(`ard-run-${compId}`).onclick = () => {
            saveCode();
            session.connected = findConnected(compId);
            runArduinoCode(session);
        };
        document.getElementById(`ard-reset-${compId}`).onclick = () => {
            // Reset = stop + restart (like pressing physical reset button)
            if (session.running) {
                stopArduino(session);
                session.serialLines.push('↺ Board reset');
                updateSerialMonitor(session);
            }
            // Restart from flash after brief delay
            setTimeout(() => {
                const flashedCode = localStorage.getItem('czelectro_ard_flash_' + compId);
                if (flashedCode && isArduinoPowered(compId)) {
                    session.code = flashedCode;
                    session.connected = findConnected(compId);
                    session.aborted = false;
                    runArduinoCode(session, true);
                }
            }, 300);
        };
        document.getElementById(`ard-close-${compId}`).onclick = () => {
            saveCode();
            modal.remove();
        };
        document.getElementById(`ard-clear-serial-${compId}`).onclick = () => {
            session.serialLines = [];
            updateSerialMonitor(session);
        };
        document.getElementById(`ard-preset-${compId}`).onchange = (e) => {
            if (e.target.value && PRESETS[e.target.value]) {
                document.getElementById(`ard-code-${compId}`).value = PRESETS[e.target.value].code;
                saveCode();
                e.target.value = '';
            }
        };
        document.querySelector('.ard-ide-backdrop').onclick = () => {
            saveCode();
            modal.remove();
        };

        // Auto-save on every keystroke (debounced)
        let _saveTimer = null;
        document.getElementById(`ard-code-${compId}`).addEventListener('input', () => {
            clearTimeout(_saveTimer);
            _saveTimer = setTimeout(saveCode, 500);
        });

        // Tab key support in editor
        document.getElementById(`ard-code-${compId}`).addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const ta = e.target;
                const s = ta.selectionStart;
                ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(ta.selectionEnd);
                ta.selectionStart = ta.selectionEnd = s + 2;
            }
        });

        updateRunButton(session);
    }


    // ── Public API ──
    CZ.openArduinoIDE = openArduinoIDE;
    CZ.arduinoSessions = sessions;
    CZ.SEG7_CHARS = SEG7_CHARS;

    // Stop all running Arduino programs and cleanup DOM
    CZ.stopAllArduinos = function() {
        sessions.forEach(session => {
            if (session.running) stopArduino(session);
        });
    };

    // Check if Arduino has power (VIN→source + GND→source)
    function isArduinoPowered(compId) {
        const isSourceComp = (otherId) => {
            const c = CZ.deployed.find(x => x.id === otherId);
            if (!c || c.isPoweredOff || c.isBroken) return false;
            return c.type.startsWith('battery') || c.type.startsWith('solar_') || c.type === 'pln_source';
        };
        const hasVIN = CZ.wires.some(w => {
            if (w.c1 === compId && w.i1 === 0) return isSourceComp(w.c2);
            if (w.c2 === compId && w.i2 === 0) return isSourceComp(w.c1);
            return false;
        });
        const hasGND = CZ.wires.some(w => {
            if (w.c1 === compId && (w.i1 === 2 || w.i1 === 6)) return isSourceComp(w.c2);
            if (w.c2 === compId && (w.i2 === 2 || w.i2 === 6)) return isSourceComp(w.c1);
            return false;
        });
        return hasVIN && hasGND;
    }

    // Auto-run flashed code on a specific Arduino
    function autoRunFlashed(compId) {
        const flashedCode = localStorage.getItem('czelectro_ard_flash_' + compId);
        if (!flashedCode) return;

        // Always show flashed indicator on chip
        const chipEl = document.getElementById(compId);
        if (chipEl) chipEl.classList.add('arduino-flashed');

        if (!isArduinoPowered(compId)) return;

        // Check if already running
        const existing = sessions.get(compId);
        if (existing && existing.running) return;

        // Create or reuse session
        if (!sessions.has(compId)) {
            sessions.set(compId, {
                compId,
                code: flashedCode,
                serialLines: [],
                connected: findConnected(compId),
                running: false,
                aborted: false,
                _timers: [],
                api: null,
            });
        }
        const s = sessions.get(compId);
        s.code = flashedCode;
        s.connected = findConnected(compId);
        s.aborted = false;
        runArduinoCode(s, true); // skip upload simulation
    }

    // Called when wires change — stop if disconnected, auto-run if power restored
    CZ.onArduinoWiresChanged = function() {
        // 1. Check ALL Arduinos — stop if lost power
        sessions.forEach(session => {
            if (!session.running) return;
            if (!isArduinoPowered(session.compId)) {
                stopArduino(session);
                session.serialLines.push('⚡ Power lost — program stopped');
                updateSerialMonitor(session);
            }
            session.connected = findConnected(session.compId);
        });

        // 2. Auto-run: check if any Arduino just got power and has flashed code
        setTimeout(() => {
            CZ.deployed.forEach(c => {
                const tmpl = COMPONENTS.find(t => t.id === c.type);
                if (!tmpl || !tmpl.isArduino) return;
                autoRunFlashed(c.id);
            });
        }, 200);
    };

    // Auto-run flashed Arduinos on page load
    CZ.autoRunFlashedArduinos = function() {
        CZ.deployed.forEach(c => {
            const tmpl = COMPONENTS.find(t => t.id === c.type);
            if (!tmpl || !tmpl.isArduino) return;
            autoRunFlashed(c.id);
        });
    };

    // Run after page load (delay to let circuit render)
    setTimeout(() => {
        if (typeof CZ.autoRunFlashedArduinos === 'function') {
            CZ.autoRunFlashedArduinos();
        }
    }, 2000);

})(window.CZ);
