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
        'traffic_light': {
            name: '🚦 Traffic Light (3 LED)',
            code: `// Lampu lalu lintas: LED Merah (D13), Kuning (D12), Hijau (D11)
void setup() {
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);
  Serial.println("Traffic Light Started");
}

void loop() {
  // Merah
  digitalWrite(13, HIGH);
  digitalWrite(12, LOW);
  digitalWrite(11, LOW);
  Serial.println("🔴 MERAH - Berhenti");
  delay(3000);

  // Hijau
  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  digitalWrite(11, HIGH);
  Serial.println("🟢 HIJAU - Jalan");
  delay(3000);

  // Kuning
  digitalWrite(13, LOW);
  digitalWrite(12, HIGH);
  digitalWrite(11, LOW);
  Serial.println("🟡 KUNING - Hati-hati");
  delay(1500);
}`
        },
        'multi_component': {
            name: '🎛️ Multi-Component Demo',
            code: `// LED (D13) + 7-Segment + Motor sekaligus
void setup() {
  pinMode(13, OUTPUT);
  Serial.println("Multi-component demo");
}

void loop() {
  // Fase 1: LED nyala, motor pelan, tampil "1"
  digitalWrite(13, HIGH);
  motor.speed(100);
  seg7.show("1");
  Serial.println("Phase 1");
  delay(2000);

  // Fase 2: LED mati, motor cepat, tampil "2"
  digitalWrite(13, LOW);
  motor.speed(200);
  seg7.show("2");
  Serial.println("Phase 2");
  delay(2000);

  // Fase 3: LED nyala, motor stop, tampil "3"
  digitalWrite(13, HIGH);
  motor.speed(0);
  seg7.show("3");
  Serial.println("Phase 3");
  delay(2000);

  // Reset
  digitalWrite(13, LOW);
  motor.speed(0);
  seg7.clear();
  delay(1000);
}`
        },
    };

    // ── Active Arduino Sessions ──
    const sessions = new Map(); // compId → session

    // ── Pin ↔ Terminal Index Mapping ──
    // Maps Arduino pin numbers to terminal array indices (from comp.arduino.js)
    // Terminal layout:
    //   0-11: D13,D12,D11,D10,D9,D8,D7,D6,D5,D4,D3,D2
    //  12-15: VIN, GND, 5V, 3V3
    //  16-20: A0-A4
    //     21: GND2
    const PIN_TO_TERM = {
        13: 0,  12: 1,  11: 2,  10: 3,  9: 4,  8: 5,
        7: 6,   6: 7,   5: 8,   4: 9,   3: 10, 2: 11
    };
    const TERM_TO_PIN = {};
    Object.entries(PIN_TO_TERM).forEach(([pin, term]) => TERM_TO_PIN[term] = parseInt(pin));
    // Analog pins
    const ANALOG_TO_TERM = { 0: 16, 1: 17, 2: 18, 3: 19, 4: 20 };
    // PWM-capable pins
    const PWM_PINS = new Set([3, 5, 6, 9, 10, 11]);

    // ── Find connected components (per-pin mapping) ──
    function findConnected(arduinoId) {
        const byPin = {};  // pinNumber → [{ id, comp, type }]
        const leds = [], seg7s = [], motors = [], servos = [], fans = [], buzzers = [], all = [];

        CZ.wires.forEach(w => {
            let ardTermIdx, otherId;
            if (w.c1 === arduinoId) { ardTermIdx = w.i1; otherId = w.c2; }
            else if (w.c2 === arduinoId) { ardTermIdx = w.i2; otherId = w.c1; }
            else return;

            const comp = CZ.deployed.find(c => c.id === otherId);
            if (!comp) return;
            const entry = { id: otherId, comp, type: comp.type };
            all.push(entry);

            // Categorize by type (backward compat)
            if (comp.type.startsWith('led_')) leds.push(entry);
            if (comp.type === 'seven_segment') seg7s.push(entry);
            if (comp.type === 'motor_dc') motors.push(entry);
            if (comp.type === 'servo_sg90') servos.push(entry);
            if (comp.type === 'fan_12v') fans.push(entry);
            if (comp.type === 'buzzer') buzzers.push(entry);

            // Map by pin number (for per-pin control)
            const pinNum = TERM_TO_PIN[ardTermIdx];
            if (pinNum !== undefined) {
                if (!byPin[pinNum]) byPin[pinNum] = [];
                byPin[pinNum].push(entry);
            }
        });

        return { byPin, leds, seg7s, motors, servos, fans, buzzers, all };
    }

    // ── Apply 7-segment pattern to DOM ──
    function applySeg7Pattern(seg7Entry, pattern, dp = false) {
        const el = document.getElementById(seg7Entry.id);
        if (!el) return;
        // Don't light up if component is powered off or not fully connected
        const comp = CZ.deployed.find(c => c.id === seg7Entry.id);
        if (comp && comp.isPoweredOff) return;
        // Both terminals must have wires (complete circuit required)
        const hasT0 = CZ.wires.some(w => (w.c1 === seg7Entry.id && w.i1 === 0) || (w.c2 === seg7Entry.id && w.i2 === 0));
        const hasT1 = CZ.wires.some(w => (w.c1 === seg7Entry.id && w.i1 === 1) || (w.c2 === seg7Entry.id && w.i2 === 1));
        if (!hasT0 || !hasT1) return;
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
                    session.connected.seg7s.forEach(s => {
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
                    session.connected.seg7s.forEach(s => {
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
                        session.connected.seg7s.forEach(s => applySeg7Pattern(s, pattern, false));
                        await api.delay(delayMs);
                    }
                },

                clear() {
                    session.connected.seg7s.forEach(s => clearSeg7(s));
                },

                dot(on) {
                    session.connected.seg7s.forEach(s => {
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

    // ── Syntax Checker ──
    function checkSyntax(code) {
        const errors = [];
        // Strip single-line comments and multi-line comments for analysis
        const stripped = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

        // 1. Required functions
        if (!/void\s+setup\s*\(/.test(stripped)) {
            errors.push('❌ Missing void setup() function');
        }
        if (!/void\s+loop\s*\(/.test(stripped)) {
            errors.push('❌ Missing void loop() function');
        }

        // 2. Matching braces
        let braceCount = 0, parenCount = 0, bracketCount = 0;
        let lineNum = 1;
        const braceErrors = [];
        for (const ch of stripped) {
            if (ch === '\n') lineNum++;
            if (ch === '{') braceCount++;
            if (ch === '}') braceCount--;
            if (ch === '(') parenCount++;
            if (ch === ')') parenCount--;
            if (ch === '[') bracketCount++;
            if (ch === ']') bracketCount--;
            if (braceCount < 0) { braceErrors.push(`Line ${lineNum}: Unexpected '}'`); braceCount = 0; }
            if (parenCount < 0) { braceErrors.push(`Line ${lineNum}: Unexpected ')'`); parenCount = 0; }
            if (bracketCount < 0) { braceErrors.push(`Line ${lineNum}: Unexpected ']'`); bracketCount = 0; }
        }
        if (braceCount > 0) errors.push(`❌ ${braceCount} unclosed '{' brace(s)`);
        if (parenCount > 0) errors.push(`❌ ${parenCount} unclosed '(' parenthesis`);
        if (bracketCount > 0) errors.push(`❌ ${bracketCount} unclosed '[' bracket(s)`);
        braceErrors.forEach(e => errors.push('❌ ' + e));

        // 3. Unterminated strings
        const lines = stripped.split('\n');
        lines.forEach((line, i) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//')) return;
            // Count unescaped quotes
            let dq = 0;
            for (let j = 0; j < trimmed.length; j++) {
                if (trimmed[j] === '"' && (j === 0 || trimmed[j-1] !== '\\')) dq++;
            }
            if (dq % 2 !== 0) {
                errors.push(`❌ Line ${i+1}: Unterminated string "...`);
            }
        });

        // 4. Missing semicolons (basic check on statement-like lines)
        lines.forEach((line, i) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
            // Skip lines that end with { } , or are flow control
            if (/[{},]$/.test(trimmed)) return;
            if (/^(void|if|else|for|while|switch|case|default|return\s*;|#|\/\/)/.test(trimmed)) return;
            if (trimmed === '}' || trimmed === '{') return;
            // Statement-like lines that should end with ;
            if (/\)\s*$/.test(trimmed) && !/^(if|for|while|else)\b/.test(trimmed)) {
                errors.push(`⚠ Line ${i+1}: Missing semicolon ';' → ${trimmed.substring(0, 40)}`);
            }
        });

        return errors;
    }

    // ── Interpreter — Run Arduino Code ──
    async function runArduinoCode(session, skipUploadSim) {

        // Syntax check before upload (skip for auto-run from flash)
        if (!skipUploadSim) {
            const syntaxErrors = checkSyntax(session.code);
            if (syntaxErrors.length > 0) {
                session.serialLines.push('⛔ Compilation failed:');
                syntaxErrors.forEach(e => session.serialLines.push('  ' + e));
                session.serialLines.push('');
                updateSerialMonitor(session);
                return; // Block upload
            }
        }

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
            // Save flashed state on the component object (single source of truth)
            const ardComp2 = CZ.deployed.find(c => c.id === session.compId);
            if (ardComp2) { ardComp2.arduinoCode = session.code; ardComp2.isFlashed = true; ardComp2._pinLayoutVersion = 2; }
            // Show FLASHED indicator on IDE and on chip SVG
            const flashEl = document.getElementById('ard-flash-' + session.compId);
            if (flashEl) flashEl.style.display = 'inline';
            const chipEl = document.getElementById(session.compId);
            if (chipEl) chipEl.classList.add('arduino-flashed');

            // If Arduino has no power, don't run — just stay flashed (orange)
            if (!isArduinoPowered(session.compId)) {
                session.running = false;
                session.serialLines.push('⚡ No power — code flashed but not running.');
                session.serialLines.push('Connect VIN + GND to a power source to run.');
                updateSerialMonitor(session);
                updateRunButton(session);
                return;
            }
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
        // Turn off running indicator, but keep flashed if code is stored
        const chipOff = document.getElementById(session.compId);
        if (chipOff) {
            chipOff.classList.remove('arduino-running');
            const ardComp3 = CZ.deployed.find(c => c.id === session.compId);
            if (ardComp3 && ardComp3.isFlashed) {
                chipOff.classList.add('arduino-flashed');
            }
        }
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
            el.querySelectorAll('.seg').forEach(seg => {
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
        // Remove running indicator, restore flashed if code is stored
        const chipEl = document.getElementById(session.compId);
        if (chipEl) {
            chipEl.classList.remove('arduino-running');
            const ardComp4 = CZ.deployed.find(c => c.id === session.compId);
            if (ardComp4 && ardComp4.isFlashed) {
                chipEl.classList.add('arduino-flashed');
            }
        }
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
        const stopBtn = document.getElementById('ard-stop-' + session.compId);
        if (runBtn) runBtn.disabled = session.running;
        if (stopBtn) stopBtn.disabled = !session.running;
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
            // Load saved code from component object
            const savedCode = comp.arduinoCode;
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
                    <div class="ard-ide-toolbar-top">
                        <div class="ard-ide-title">
                            <span class="ard-ide-icon">⚡</span>
                            <span>Arduino IDE</span>
                            <span class="ard-ide-comp-id">${compId}</span>
                            <span id="ard-flash-${compId}" class="ard-flash-badge" style="display:${comp.isFlashed ? 'inline-flex' : 'none'}">● FLASHED</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:6px;">
                            <select id="ard-preset-${compId}" class="ard-preset-select">
                                <option value="">📂 Contoh Program...</option>
                                ${Object.entries(PRESETS).map(([k, v]) =>
                                    `<option value="${k}">${v.name}</option>`
                                ).join('')}
                            </select>
                            <button class="ard-btn ard-btn-close" id="ard-close-${compId}">✕</button>
                        </div>
                    </div>
                    <div class="ard-ide-toolbar-actions">
                        <button id="ard-run-${compId}" class="ard-btn ard-btn-run" ${session.running ? 'disabled' : ''}>⬆ Upload</button>
                        <button id="ard-stop-${compId}" class="ard-btn ard-btn-stop" ${session.running ? '' : 'disabled'}>⏹ Stop</button>
                        <div class="ard-toolbar-sep"></div>
                        <button id="ard-reset-${compId}" class="ard-btn ard-btn-reset" title="Stop & restart program">↺ Reset</button>
                        <button id="ard-erase-${compId}" class="ard-btn ard-btn-erase" title="Hapus program dari chip">🗑 Erase</button>
                        <div class="ard-toolbar-sep"></div>
                        <div class="ard-ide-status-inline">
                            <span class="ard-status-dot ${session.running ? 'running' : ''}"></span>
                            <span>${session.connected.leds.length} LED, ${session.connected.seg7s.length} 7-Seg, ${session.connected.motors.length + session.connected.fans.length} Motor</span>
                        </div>
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
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Helper: save code to component object
        const saveCode = () => {
            const val = document.getElementById(`ard-code-${compId}`).value;
            session.code = val;
            comp.arduinoCode = val;
        };

        // Event handlers
        document.getElementById(`ard-run-${compId}`).onclick = () => {
            saveCode();
            session.connected = findConnected(compId);
            runArduinoCode(session);
        };
        document.getElementById(`ard-stop-${compId}`).onclick = () => {
            if (session.running) {
                stopArduino(session);
                session.serialLines.push('⏹ Program stopped');
                updateSerialMonitor(session);
            }
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
                if (comp.isFlashed && comp.arduinoCode && isArduinoPowered(compId)) {
                    session.code = comp.arduinoCode;
                    session.connected = findConnected(compId);
                    session.aborted = false;
                    runArduinoCode(session, true);
                }
            }, 300);
        };
        document.getElementById(`ard-erase-${compId}`).onclick = () => {
            // Erase = stop + clear flash
            if (session.running) stopArduino(session);
            comp.arduinoCode = undefined;
            comp.isFlashed = false;
            session.code = PRESETS['blink_led'].code;
            document.getElementById(`ard-code-${compId}`).value = session.code;
            const flashEl = document.getElementById(`ard-flash-${compId}`);
            if (flashEl) flashEl.style.display = 'none';
            const chipEl = document.getElementById(compId);
            if (chipEl) {
                chipEl.classList.remove('arduino-running', 'arduino-flashed');
            }
            session.serialLines.push('🗑 Flash erased — program cleared');
            updateSerialMonitor(session);
            CZ.saveState();
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
        const codeEl = document.getElementById(`ard-code-${compId}`);
        let _saveTimer = null;
        codeEl.addEventListener('input', () => {
            clearTimeout(_saveTimer);
            _saveTimer = setTimeout(saveCode, 500);
        });
        // Tab key → insert 2 spaces (instead of changing focus)
        codeEl.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = codeEl.selectionStart;
                const end = codeEl.selectionEnd;
                codeEl.value = codeEl.value.substring(0, start) + '  ' + codeEl.value.substring(end);
                codeEl.selectionStart = codeEl.selectionEnd = start + 2;
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
    // Terminal indices: VIN=12, GND=13, GND2=21
    function isArduinoPowered(compId) {
        const isSourceComp = (otherId) => {
            const c = CZ.deployed.find(x => x.id === otherId);
            if (!c || c.isPoweredOff || c.isBroken) return false;
            return c.type.startsWith('battery') || c.type.startsWith('solar_') || c.type === 'pln_source';
        };
        const hasVIN = CZ.wires.some(w => {
            if (w.c1 === compId && w.i1 === 12) return isSourceComp(w.c2);
            if (w.c2 === compId && w.i2 === 12) return isSourceComp(w.c1);
            return false;
        });
        const hasGND = CZ.wires.some(w => {
            if (w.c1 === compId && (w.i1 === 13 || w.i1 === 21)) return isSourceComp(w.c2);
            if (w.c2 === compId && (w.i2 === 13 || w.i2 === 21)) return isSourceComp(w.c1);
            return false;
        });
        return hasVIN && hasGND;
    }

    // Auto-run flashed code on a specific Arduino
    function autoRunFlashed(compId) {
        const ardComp = CZ.deployed.find(c => c.id === compId);
        if (!ardComp || !ardComp.isFlashed || !ardComp.arduinoCode) return;

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
                code: ardComp.arduinoCode,
                serialLines: [],
                connected: findConnected(compId),
                running: false,
                aborted: false,
                _timers: [],
                api: null,
            });
        }
        const s = sessions.get(compId);
        s.code = ardComp.arduinoCode;
        s.connected = findConnected(compId);
        s.aborted = false;
        runArduinoCode(s, true); // skip upload simulation
    }

    // Called when wires change — stop if lost power, auto-run if power restored
    // NOTE: Arduino keeps running as long as it has power (VIN + GND connected),
    // even if downstream wires are disconnected. This matches real Arduino behavior.
    // Downstream effects (LED off, motor stop) are handled by MNA circuit evaluation.
    CZ.onArduinoWiresChanged = function() {
        // 1. Check ALL running Arduinos — stop ONLY if power is lost
        sessions.forEach(session => {
            // Always refresh connected components so interpreter sees updated topology
            session.connected = findConnected(session.compId);

            if (!session.running) return;
            if (!isArduinoPowered(session.compId)) {
                stopArduino(session);
                session.serialLines.push('⚡ Power lost — program stopped');
                updateSerialMonitor(session);
            }
        });

        // 1b. Reset disconnected 7-segment displays to gray
        CZ.deployed.forEach(c => {
            if (c.type !== 'seven_segment') return;
            const hasT0 = CZ.wires.some(w => (w.c1 === c.id && w.i1 === 0) || (w.c2 === c.id && w.i2 === 0));
            const hasT1 = CZ.wires.some(w => (w.c1 === c.id && w.i1 === 1) || (w.c2 === c.id && w.i2 === 1));
            if (!hasT0 || !hasT1) {
                const el = document.getElementById(c.id);
                if (el) {
                    el.querySelectorAll('.seg').forEach(s => {
                        s.setAttribute('fill', '#374151');
                        s.style.filter = 'none';
                    });
                    el.classList.remove('seg7-active');
                }
            }
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
        // ── Migrate old localStorage keys → component properties ──
        CZ.deployed.forEach(c => {
            if (c.type !== 'arduino_uno') return;
            const oldFlash = localStorage.getItem('czelectro_ard_flash_' + c.id);
            const oldCode = localStorage.getItem('czelectro_ard_code_' + c.id);
            if (oldFlash && !c.arduinoCode) {
                c.arduinoCode = oldFlash;
                c.isFlashed = true;
            } else if (oldCode && !c.arduinoCode) {
                c.arduinoCode = oldCode;
            }
            // Clean up old keys
            localStorage.removeItem('czelectro_ard_flash_' + c.id);
            localStorage.removeItem('czelectro_ard_code_' + c.id);
        });

        if (typeof CZ.autoRunFlashedArduinos === 'function') {
            CZ.autoRunFlashedArduinos();
        }
    }, 2000);

})(window.CZ);
