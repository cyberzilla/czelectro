// ═══════════════════════════════════════════════════
// CZElectro — Component Manifest
// Lightweight catalog for sidebar rendering + lazy loading
// ═══════════════════════════════════════════════════

const COMPONENT_MANIFEST = [
    // ── Source Components ──
    {
        groupId: 'battery',
        label: 'Baterai',
        labelEn: 'Battery',
        category: 'source',
        file: 'comp.battery.js',
        defaultVariant: 'battery_9v',
        variants: [
            { id: 'battery_9v',  label: 'Baterai 9V',   spec: '9 Volt DC' },
            { id: 'battery_3v',  label: 'Baterai 3V',   spec: '3 Volt (2×AA)' },
            { id: 'battery_1v5', label: 'Baterai 1.5V',  spec: '1.5 Volt (1×AA)' },
            { id: 'battery_12v', label: 'Baterai 12V',   spec: '12 Volt (A23)' },
        ]
    },
    {
        groupId: 'battery-large',
        label: 'LiFePO4 Cell',
        category: 'source',
        file: 'comp.battery-large.js',
        defaultVariant: 'battery_32140',
        variants: [
            { id: 'battery_32140',    label: 'LiFePO4 32140',     spec: '3.2V 15Ah' },
            { id: 'battery_lifepo4',  label: 'Sel LiFePO4 100Ah', spec: '3.2V 100Ah' },
        ]
    },
    {
        groupId: 'battery-plts',
        label: 'Baterai PLTS',
        category: 'source',
        file: 'comp.battery-plts.js',
        defaultVariant: 'battery_plts_100',
        variants: [
            { id: 'battery_plts_100', label: 'Baterai 48V 100Ah', spec: '48V 100Ah, 4.8kWh' },
            { id: 'battery_plts_200', label: 'Baterai 48V 200Ah', spec: '48V 200Ah, 9.6kWh' },
        ]
    },
    {
        groupId: 'solar',
        label: 'Panel Surya',
        labelEn: 'Solar Panel',
        category: 'source',
        file: 'comp.solar.js',
        defaultVariant: 'solar_6v',
        variants: [
            { id: 'solar_6v',  label: 'Panel Surya 6V',  spec: '6V 1W Mono' },
            { id: 'solar_12v', label: 'Panel Surya 12V', spec: '12V 5W Poly' },
            { id: 'solar_18v', label: 'Panel Surya 18V', spec: '18V 10W Mono' },
        ]
    },
    {
        groupId: 'solar-array',
        label: 'Array Surya',
        labelEn: 'Solar Array',
        category: 'source',
        file: 'comp.solar-array.js',
        defaultVariant: 'solar_array_1k',
        variants: [
            { id: 'solar_array_1k', label: 'Array 1kW',  spec: '4×250W, 48V' },
            { id: 'solar_array_3k', label: 'Array 3kW',  spec: '12×250W, 48V' },
            { id: 'solar_array_5k', label: 'Array 5kW',  spec: '20×250W, 48V' },
        ]
    },
    {
        groupId: 'pln',
        label: 'PLN 220V',
        labelEn: 'Grid 220V AC',
        category: 'source',
        file: 'comp.pln.js',
        defaultVariant: 'pln_source',
        variants: [
            { id: 'pln_source', label: 'PLN 220V', spec: '220V AC, 50Hz' },
        ]
    },

    // ── Passive Components ──
    {
        groupId: 'resistor',
        label: 'Resistor',
        category: 'passive',
        file: 'comp.resistor.js',
        defaultVariant: 'resistor_220',
        variants: [
            { id: 'resistor_220',  label: 'Resistor 220Ω',  spec: '220Ω ¼W' },
            { id: 'resistor_1k',   label: 'Resistor 1KΩ',   spec: '1KΩ ¼W' },
            { id: 'resistor_100',  label: 'Resistor 100Ω',  spec: '100Ω ¼W' },
            { id: 'resistor_10k',  label: 'Resistor 10KΩ',  spec: '10KΩ ¼W' },
        ]
    },
    {
        groupId: 'switch',
        label: 'Saklar Toggle',
        labelEn: 'Toggle Switch',
        category: 'passive',
        file: 'comp.switch.js',
        defaultVariant: 'switch_toggle',
        variants: [
            { id: 'switch_toggle', label: 'Saklar Toggle', spec: 'SPST ON/OFF' },
        ]
    },
    {
        groupId: 'fuse',
        label: 'Sekring',
        labelEn: 'Fuse',
        category: 'passive',
        file: 'comp.fuse.js',
        defaultVariant: 'fuse',
        variants: [
            { id: 'fuse', label: 'Sekring', spec: '250mA Glass' },
        ]
    },
    {
        groupId: 'capacitor',
        label: 'Kapasitor',
        labelEn: 'Capacitor',
        category: 'passive',
        file: 'comp.capacitor.js',
        defaultVariant: 'capacitor',
        variants: [
            { id: 'capacitor', label: 'Kapasitor', spec: '100μF 25V' },
        ]
    },
    {
        groupId: 'diode',
        label: 'Dioda',
        labelEn: 'Diode',
        category: 'passive',
        file: 'comp.diode.js',
        defaultVariant: 'diode',
        variants: [
            { id: 'diode', label: 'Dioda', spec: '1N4007, 1A' },
        ]
    },
    {
        groupId: 'potentiometer',
        label: 'Potensiometer',
        labelEn: 'Potentiometer',
        category: 'passive',
        file: 'comp.potentiometer.js',
        defaultVariant: 'potentiometer',
        variants: [
            { id: 'potentiometer', label: 'Potensiometer', spec: '10KΩ Variable' },
        ]
    },
    {
        groupId: 'relay',
        label: 'Relay',
        category: 'passive',
        file: 'comp.relay.js',
        defaultVariant: 'relay',
        variants: [
            { id: 'relay', label: 'Relay', spec: '5V Coil, SPST' },
        ]
    },
    {
        groupId: 'jumper',
        label: 'Kabel Jumper',
        labelEn: 'Jumper Wire',
        category: 'passive',
        file: 'comp.jumper.js',
        defaultVariant: 'jumper_wire',
        variants: [
            { id: 'jumper_wire', label: 'Kabel Jumper', spec: '0Ω (penghubung)' },
        ]
    },
    {
        groupId: 'ground',
        label: 'Ground/Netral',
        category: 'passive',
        file: 'comp.ground.js',
        defaultVariant: 'ground',
        variants: [
            { id: 'ground', label: 'Ground/Netral', spec: 'Bus Netral (auto-connect)' },
        ]
    },

    // ── Control / Protection ──
    {
        groupId: 'mcb',
        label: 'MCB',
        labelEn: 'Circuit Breaker',
        category: 'passive',
        file: 'comp.mcb.js',
        defaultVariant: 'mcb_4a',
        variants: [
            { id: 'mcb_4a',   label: 'MCB 4A (900VA)',   spec: '4A, 230V AC' },
            { id: 'mcb_6a',   label: 'MCB 6A (1300VA)',  spec: '6A, 230V AC' },
            { id: 'mcb_10a',  label: 'MCB 10A (2200VA)', spec: '10A, 230V AC' },
            { id: 'mcb_16a',  label: 'MCB 16A',          spec: '16A, 230V AC' },
            { id: 'mcb_32a',  label: 'MCB 32A',          spec: '32A, 230V AC' },
        ]
    },
    {
        groupId: 'ats',
        label: 'ATS',
        labelEn: 'Auto Transfer Switch',
        category: 'passive',
        file: 'comp.ats.js',
        defaultVariant: 'ats_switch',
        variants: [
            { id: 'ats_switch', label: 'ATS (Auto Switch)', spec: 'Auto PLN↔PLTS' },
        ]
    },
    {
        groupId: 'charge-ctrl',
        label: 'Charge Controller',
        category: 'passive',
        file: 'comp.charge-ctrl.js',
        defaultVariant: 'charge_controller',
        variants: [
            { id: 'charge_controller',       label: 'CC PWM 10A',   spec: 'PWM 10A' },
            { id: 'charge_controller_30a',   label: 'CC PWM 30A',   spec: 'PWM 30A' },
            { id: 'charge_controller_60a',   label: 'CC MPPT 60A',  spec: 'MPPT 60A' },
            { id: 'charge_controller_100a',  label: 'CC MPPT 100A', spec: 'MPPT 100A' },
        ]
    },
    {
        groupId: 'inverter',
        label: 'Inverter',
        category: 'passive',
        file: 'comp.inverter.js',
        defaultVariant: 'inverter',
        variants: [
            { id: 'inverter',    label: 'Inverter 1.5kW', spec: '48V DC → 220V AC' },
            { id: 'inverter_3k', label: 'Inverter 3kW',   spec: '48V DC → 220V AC' },
            { id: 'inverter_5k', label: 'Inverter 5kW',   spec: '48V DC → 220V AC' },
        ]
    },
    {
        groupId: 'stepdown',
        label: 'Step-Down',
        category: 'passive',
        file: 'comp.stepdown.js',
        defaultVariant: 'stepdown_12v',
        variants: [
            { id: 'stepdown_12v', label: 'Step-Down 12V', spec: '48V→12V DC' },
            { id: 'stepdown_5v',  label: 'Step-Down 5V',  spec: '48V→5V DC' },
        ]
    },
    {
        groupId: 'outlet',
        label: 'Stop Kontak',
        labelEn: 'Power Outlet',
        category: 'passive',
        file: 'comp.outlet.js',
        defaultVariant: 'outlet',
        variants: [
            { id: 'outlet',       label: 'Stop Kontak',      spec: '220V AC, 16A' },
            { id: 'outlet_strip', label: 'Terminal Listrik',  spec: '220V AC, 4 Lubang' },
        ]
    },
    {
        groupId: 'multimeter',
        label: 'Multimeter',
        category: 'passive',
        file: 'comp.multimeter.js',
        defaultVariant: 'voltmeter',
        variants: [
            { id: 'voltmeter', label: 'Multimeter', spec: 'Digital DMM, V/A/Ω' },
        ]
    },
    {
        groupId: 'timer',
        label: 'Timer 555',
        category: 'passive',
        file: 'comp.timer.js',
        defaultVariant: 'timer_555',
        variants: [
            { id: 'timer_555', label: 'Timer 555', spec: 'Astable ~1Hz' },
        ]
    },
    {
        groupId: 'kwh-meter',
        label: 'Meteran Listrik',
        labelEn: 'kWh Meter',
        category: 'passive',
        file: 'comp.kwh-meter.js',
        defaultVariant: 'kwh_meter',
        variants: [
            { id: 'kwh_meter', label: 'Meteran Listrik', spec: '1P, 230V, 40A' },
        ]
    },

    // ── Output Components ──
    {
        groupId: 'led',
        label: 'LED',
        category: 'output',
        file: 'comp.led.js',
        defaultVariant: 'led_yellow',
        variants: [
            { id: 'led_yellow', label: 'LED Kuning', spec: '2V, 20mA' },
            { id: 'led_red',    label: 'LED Merah',  spec: '1.8V, 20mA' },
            { id: 'led_green',  label: 'LED Hijau',  spec: '2.1V, 20mA' },
            { id: 'led_blue',   label: 'LED Biru',   spec: '3.2V, 20mA' },
            { id: 'led_white',  label: 'LED Putih',  spec: '3.3V, 20mA' },
            { id: 'led_rgb',    label: 'LED RGB',     spec: '3V, Warna-warni' },
        ]
    },
    {
        groupId: 'led-strip',
        label: 'LED Strip RGB',
        category: 'output',
        file: 'comp.led-strip.js',
        defaultVariant: 'led_strip_rgb',
        variants: [
            { id: 'led_strip_rgb', label: 'LED Strip RGB', spec: '3-12V, Built-in Controller' },
        ]
    },
    {
        groupId: 'bulb',
        label: 'Bohlam',
        labelEn: 'Bulb',
        category: 'output',
        file: 'comp.bulb.js',
        defaultVariant: 'bulb',
        variants: [
            { id: 'bulb', label: 'Bohlam', spec: '6V 0.5W' },
        ]
    },
    {
        groupId: 'motor',
        label: 'Motor DC',
        category: 'output',
        file: 'comp.motor.js',
        defaultVariant: 'motor_dc',
        variants: [
            { id: 'motor_dc', label: 'Motor DC', spec: '3-9V, 200mA' },
        ]
    },
    {
        groupId: 'buzzer',
        label: 'Buzzer',
        category: 'output',
        file: 'comp.buzzer.js',
        defaultVariant: 'buzzer',
        variants: [
            { id: 'buzzer', label: 'Buzzer', spec: '3-12V Piezo' },
        ]
    },
    {
        groupId: 'speaker',
        label: 'Speaker',
        category: 'output',
        file: 'comp.speaker.js',
        defaultVariant: 'speaker',
        variants: [
            { id: 'speaker', label: 'Speaker', spec: '8Ω 0.5W' },
        ]
    },

    // ── AC Appliances (All household appliances) ──
    {
        groupId: 'appliance',
        label: 'Peralatan Rumah Tangga',
        labelEn: 'Household Appliances',
        category: 'output',
        file: 'comp.appliance.js',
        defaultVariant: 'iron',
        variants: [
            { id: 'iron',       label: 'Setrika',         spec: '220V AC, 1000W' },
            { id: 'blender',    label: 'Blender',         spec: '220V AC, 350W' },
            { id: 'ricecooker', label: 'Rice Cooker',     spec: '220V AC, 400W' },
            { id: 'fridge',     label: 'Kulkas',          spec: '220V AC, 100W' },
            { id: 'ac_05pk',    label: 'AC 0.5 PK',      spec: '220V AC, 350W' },
            { id: 'ac_1pk',     label: 'AC 1 PK',        spec: '220V AC, 750W' },
            { id: 'tv_led',     label: 'TV LED 32"',     spec: '220V AC, 80W' },
            { id: 'lamp_30w',   label: 'Lampu LED 30W',  spec: '220V AC, 30W' },
            { id: 'computer',   label: 'Komputer',       spec: '220V AC, 300W' },
            { id: 'pump_125',   label: 'Pompa Air 125W', spec: '220V AC, 125W' },
            { id: 'pump_250',   label: 'Pompa Air 250W', spec: '220V AC, 250W' },
        ]
    },

    // ── Active / Semiconductor Components ──
    {
        groupId: 'transistor',
        label: 'Transistor',
        category: 'passive',
        file: 'comp.transistor.js',
        defaultVariant: 'transistor_npn',
        variants: [
            { id: 'transistor_npn', label: 'NPN 2N2222', spec: 'NPN, 800mA' },
            { id: 'transistor_pnp', label: 'PNP 2N2907', spec: 'PNP, 600mA' },
        ]
    },
    {
        groupId: 'mosfet',
        label: 'MOSFET',
        category: 'passive',
        file: 'comp.mosfet.js',
        defaultVariant: 'mosfet_n',
        variants: [
            { id: 'mosfet_n', label: 'MOSFET N-Ch', spec: 'IRF540N, 33A' },
            { id: 'mosfet_p', label: 'MOSFET P-Ch', spec: 'IRF9540, 23A' },
        ]
    },
    {
        groupId: 'opamp',
        label: 'Op-Amp',
        category: 'passive',
        file: 'comp.opamp.js',
        defaultVariant: 'opamp_741',
        variants: [
            { id: 'opamp_741', label: 'Op-Amp LM741', spec: '±15V, Unity Gain' },
        ]
    },
    {
        groupId: 'scr',
        label: 'SCR / Thyristor',
        category: 'passive',
        file: 'comp.scr.js',
        defaultVariant: 'scr',
        variants: [
            { id: 'scr', label: 'SCR TYN612', spec: '12A, 600V' },
        ]
    },
    {
        groupId: 'triac',
        label: 'Triac',
        category: 'passive',
        file: 'comp.triac.js',
        defaultVariant: 'triac',
        variants: [
            { id: 'triac', label: 'Triac BT136', spec: '4A, 600V' },
        ]
    },

    // ── Passive Extended ──
    {
        groupId: 'zener',
        label: 'Zener Diode',
        category: 'passive',
        file: 'comp.zener.js',
        defaultVariant: 'zener_5v1',
        variants: [
            { id: 'zener_5v1', label: 'Zener 5.1V', spec: '5.1V, 1W 1N4733' },
        ]
    },
    {
        groupId: 'inductor',
        label: 'Induktor',
        labelEn: 'Inductor',
        category: 'passive',
        file: 'comp.inductor.js',
        defaultVariant: 'inductor_100u',
        variants: [
            { id: 'inductor_100u', label: 'Induktor 100μH', spec: '100μH, 2A' },
        ]
    },
    {
        groupId: 'ldr',
        label: 'Sensor LDR',
        labelEn: 'LDR Sensor',
        category: 'passive',
        file: 'comp.ldr.js',
        defaultVariant: 'ldr',
        variants: [
            { id: 'ldr', label: 'Sensor LDR', spec: '1KΩ-10MΩ' },
        ]
    },
    {
        groupId: 'thermistor',
        label: 'Termistor',
        labelEn: 'Thermistor',
        category: 'passive',
        file: 'comp.thermistor.js',
        defaultVariant: 'thermistor_ntc',
        variants: [
            { id: 'thermistor_ntc', label: 'NTC 10KΩ', spec: '10KΩ @ 25°C' },
        ]
    },
    {
        groupId: 'varistor',
        label: 'Varistor MOV',
        category: 'passive',
        file: 'comp.varistor.js',
        defaultVariant: 'varistor_275v',
        variants: [
            { id: 'varistor_275v', label: 'Varistor 275V', spec: '275V, 10mm' },
        ]
    },
    {
        groupId: 'crystal',
        label: 'Kristal Osilator',
        labelEn: 'Crystal Oscillator',
        category: 'passive',
        file: 'comp.crystal.js',
        defaultVariant: 'crystal_16m',
        variants: [
            { id: 'crystal_16m', label: 'Kristal 16MHz', spec: '16MHz HC-49S' },
        ]
    },
    {
        groupId: 'push-button',
        label: 'Push Button',
        category: 'passive',
        file: 'comp.push-button.js',
        defaultVariant: 'push_button',
        variants: [
            { id: 'push_button', label: 'Push Button', spec: 'Momentary NO' },
        ]
    },
    {
        groupId: 'dpdt-switch',
        label: 'Saklar DPDT',
        labelEn: 'DPDT Switch',
        category: 'passive',
        file: 'comp.dpdt-switch.js',
        defaultVariant: 'dpdt_switch',
        variants: [
            { id: 'dpdt_switch', label: 'Saklar DPDT', spec: 'Double Pole, 6-Pin' },
        ]
    },
    {
        groupId: 'terminal-block',
        label: 'Terminal Block',
        category: 'passive',
        file: 'comp.terminal-block.js',
        defaultVariant: 'terminal_block_2',
        variants: [
            { id: 'terminal_block_2', label: 'Terminal Block', spec: '2-Pin, 15A' },
        ]
    },
    {
        groupId: 'transformer',
        label: 'Trafo',
        labelEn: 'Transformer',
        category: 'passive',
        file: 'comp.transformer.js',
        defaultVariant: 'trafo_1a',
        variants: [
            { id: 'trafo_1a', label: 'Trafo CT', spec: '220V→12V, 1A' },
        ]
    },
    {
        groupId: 'voltage-reg',
        label: 'Voltage Regulator',
        category: 'passive',
        file: 'comp.voltage-reg.js',
        defaultVariant: 'vreg_7805',
        variants: [
            { id: 'vreg_7805',  label: '7805 (5V)',      spec: '5V 1A, TO-220' },
            { id: 'vreg_7812',  label: '7812 (12V)',     spec: '12V 1A, TO-220' },
            { id: 'vreg_lm317', label: 'LM317 (Adj)',    spec: '1.25-37V, 1.5A' },
        ]
    },

    // ── Output Extended ──
    {
        groupId: '7segment',
        label: 'Display 7-Segment',
        category: 'output',
        file: 'comp.7segment.js',
        defaultVariant: 'seven_segment',
        variants: [
            { id: 'seven_segment', label: '7-Segment', spec: 'Common Cathode' },
        ]
    },
    {
        groupId: 'fan',
        label: 'Kipas DC',
        labelEn: 'DC Fan',
        category: 'output',
        file: 'comp.fan.js',
        defaultVariant: 'fan_12v',
        variants: [
            { id: 'fan_12v', label: 'Kipas DC 12V', spec: '12V, 0.2A' },
        ]
    },
    {
        groupId: 'servo',
        label: 'Servo Motor',
        category: 'output',
        file: 'comp.servo.js',
        defaultVariant: 'servo_sg90',
        variants: [
            { id: 'servo_sg90', label: 'Servo SG90', spec: '4.8-6V, 180°' },
        ]
    },
    {
        groupId: 'photodiode',
        label: 'Fotodioda',
        labelEn: 'Photodiode',
        category: 'passive',
        file: 'comp.photodiode.js',
        defaultVariant: 'photodiode',
        variants: [
            { id: 'photodiode', label: 'Fotodioda IR', spec: 'IR, 940nm' },
        ]
    },
    {
        groupId: 'ammeter',
        label: 'Ammeter',
        category: 'passive',
        file: 'comp.ammeter.js',
        defaultVariant: 'ammeter',
        variants: [
            { id: 'ammeter', label: 'Ammeter', spec: 'DC 0-10A' },
        ]
    },

    // ── Microcontroller ──
    {
        groupId: 'arduino',
        label: 'Arduino Uno',
        category: 'passive',
        file: 'comp.arduino.js',
        defaultVariant: 'arduino_uno',
        variants: [
            { id: 'arduino_uno', label: 'Arduino Uno', spec: 'ATmega328P, 5V' },
        ]
    },
];
