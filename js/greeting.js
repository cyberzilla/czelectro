// ═══════════════════════════════════════════════════
// CZElectro — Greeting Demo Circuit
// Auto-loads when user has no saved state (first visit)
// ═══════════════════════════════════════════════════
(function (CZ) {
    'use strict';

    const GREETING_CODE = `// Welcome to CZElectro!
// LED Dot Matrix Running Text + LED RGB Demo

void setup() {
  pinMode(13, OUTPUT);  // LED RGB pin
  pinMode(11, OUTPUT);  // Matrix data pin
  Serial.println("Welcome to CZElectro!");
  matrix.clear();
}

void loop() {
  // LED indikator berkedip
  digitalWrite(13, HIGH);
  
  // Scroll welcome message
  matrix.scroll("WELCOME TO CZELECTRO BY CYBERZILLA..  HOPE YOU LIKE THIS PROJECT!", 65);
  
  digitalWrite(13, LOW);
  delay(300);
  
  // Scroll info
  matrix.scroll("DRAG COMPONENTS FROM SIDEBAR..  BUILD YOUR OWN CIRCUIT!", 65);
  delay(300);
}`;

    /**
     * Build greeting circuit:
     *  - 1× Arduino Uno (centered)
     *  - 1× LED Dot Matrix (right of Arduino)
     *  - 1× Resistor 220Ω (current limiter for LED)
     *  - 1× LED RGB (connected via resistor)
     *  - 1× Battery 9V (left of Arduino)
     *  - Wires connecting them all
     *  - Arduino pre-flashed with greeting code
     */
    CZ.loadGreetingCircuit = function () {
        // Wait for COMPONENTS to be available
        if (typeof COMPONENTS === 'undefined' || COMPONENTS.length === 0) {
            setTimeout(CZ.loadGreetingCircuit, 200);
            return;
        }

        const arduino = REGISTRY.find('arduino_uno');
        const matrix = REGISTRY.find('led_matrix');
        const resistor = REGISTRY.find('resistor_220');
        const led = REGISTRY.find('led_rgb');
        const battery = REGISTRY.find('battery_9v');

        if (!arduino || !matrix || !led || !battery || !resistor) {
            console.warn('Greeting: missing required components');
            return;
        }

        // Position components on the board
        const centerX = 550, centerY = 300;

        // Arduino at center
        const ardX = centerX - arduino.width / 2;
        const ardY = centerY - arduino.height / 2;

        // Battery to the left (enough clearance from sidebar ~260px)
        const batX = ardX - battery.width - 40;
        const batY = ardY + 30;

        // LED Matrix to the right
        const matX = ardX + arduino.width + 60;
        const matY = ardY + 10;

        // Resistor above-right of Arduino
        const resX = ardX + arduino.width + 30;
        const resY = matY - resistor.height - 60;

        // LED RGB after resistor
        const ledX = resX + resistor.width + 40;
        const ledY = resY - 5;

        // Deploy components
        const ardId = 'comp_greeting_1';
        const batId = 'comp_greeting_2';
        const matId = 'comp_greeting_3';
        const resId = 'comp_greeting_4';
        const ledId = 'comp_greeting_5';

        // Helper: deploy one component (matches components-ui.js logic)
        function deploy(id, tmpl, x, y, extraProps) {
            const el = document.createElement('div');
            el.className = 'board-component';
            el.id = id;
            el.style.cssText = `width:${tmpl.width}px;height:${tmpl.height}px;left:${x}px;top:${y}px;`;
            el.innerHTML = tmpl.svg;

            // Create terminal elements (like components-ui.js)
            tmpl.terminals.forEach((term, idx) => {
                const tEl = document.createElement('div');
                tEl.className = 'terminal';
                tEl.style.left = `${term.x - 8}px`;
                tEl.style.top = `${term.y - 8}px`;
                tEl.dataset.cid = id;
                tEl.dataset.tidx = idx;
                tEl.dataset.label = term.label || '';
                el.appendChild(tEl);
            });

            CZ.ws.appendChild(el);

            const comp = {
                id, type: tmpl.id, voltage: tmpl.voltage,
                baseResistance: tmpl.resistance,
                currentResistance: tmpl.resistance,
                maxCurrent: tmpl.maxCurrent || null,
                glowGradient: tmpl.glowGradient || null,
                isClosed: false,
                isPoweredOff: false,
                x, y,
                terminals: JSON.parse(JSON.stringify(tmpl.terminals)),
                ...extraProps
            };

            // Init battery capacity
            if (tmpl.capacityWh) {
                comp.batteryCapacity = tmpl.capacityWh;
                comp.batteryLevel = comp.batteryLevel ?? tmpl.capacityWh;
            }

            CZ.addDeployed(comp);

            // Power badge for toggleable outputs
            const TOGGLEABLE = ['led_rgb', 'led_matrix', 'seven_segment', 'motor_dc', 'buzzer', 'fan_12v'];
            if (TOGGLEABLE.includes(tmpl.id)) {
                const badge = document.createElement('div');
                badge.className = 'power-on-off-badge';
                badge.textContent = '⏻ ON';
                el.appendChild(badge);
            }

            // Init drag
            if (typeof CZ.initDragForComponent === 'function') {
                CZ.initDragForComponent(el, comp);
            }

            return comp;
        }

        // Deploy all components
        deploy(batId, battery, batX, batY);
        deploy(ardId, arduino, ardX, ardY, {
            arduinoCode: GREETING_CODE,
            isFlashed: true,
            _pinLayoutVersion: 2
        });
        deploy(matId, matrix, matX, matY);
        deploy(resId, resistor, resX, resY);
        deploy(ledId, led, ledX, ledY);

        // Add Arduino flashed indicator
        const ardEl = document.getElementById(ardId);
        if (ardEl) ardEl.classList.add('arduino-flashed');

        // Wire connections
        // Arduino terminal mapping:
        //   0=D13, 1=D12, 2=D11, 12=VIN, 13=GND, 21=GND2

        // Battery + → Arduino VIN (terminal 12)
        CZ.wires.push({
            c1: batId, i1: 0,
            c2: ardId, i2: 12,
            color: '#ef4444',
            controlPoints: CZ.getDefaultControlPoints()
        });
        // Battery - → Arduino GND (terminal 13)
        CZ.wires.push({
            c1: batId, i1: 1,
            c2: ardId, i2: 13,
            color: '#1e293b',
            controlPoints: CZ.getDefaultControlPoints()
        });
        // Arduino D11 (terminal 2) → Matrix + (terminal 0)
        CZ.wires.push({
            c1: ardId, i1: 2,
            c2: matId, i2: 0,
            color: '#f59e0b',
            controlPoints: CZ.getDefaultControlPoints()
        });
        // Arduino GND2 (terminal 21) → Matrix - (terminal 1)
        CZ.wires.push({
            c1: ardId, i1: 21,
            c2: matId, i2: 1,
            color: '#1e293b',
            controlPoints: CZ.getDefaultControlPoints()
        });
        // Arduino D13 (terminal 0) → Resistor terminal 0
        CZ.wires.push({
            c1: ardId, i1: 0,
            c2: resId, i2: 0,
            color: '#f59e0b',
            controlPoints: CZ.getDefaultControlPoints()
        });
        // Resistor terminal 1 → LED RGB + (terminal 0)
        CZ.wires.push({
            c1: resId, i1: 1,
            c2: ledId, i2: 0,
            color: '#22c55e',
            controlPoints: CZ.getDefaultControlPoints()
        });
        // LED RGB - (terminal 1) → Arduino GND (terminal 13)
        CZ.wires.push({
            c1: ledId, i1: 1,
            c2: ardId, i2: 13,
            color: '#64748b',
            controlPoints: CZ.getDefaultControlPoints()
        });

        CZ.counter = 6;

        // Render wires and update UI
        CZ.renderWires();
        CZ.evaluateCircuit();

        // Update status bar comp count
        const countEl = document.getElementById('comp-count');
        if (countEl) countEl.textContent = CZ.deployed.length + ' ' + CZ.t('statusParts');

        CZ.saveState();

        // Auto-run the flashed Arduino code after circuit is ready
        setTimeout(() => {
            if (typeof CZ.onArduinoWiresChanged === 'function') {
                CZ.onArduinoWiresChanged();
            }
            // Start simulation at 1x speed for battery drain
            if (typeof CZ.startSim === 'function') {
                CZ.startSim(1);
            }
        }, 800);
    };

})(window.CZ);
