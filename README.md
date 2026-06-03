<p align="center">
  <img src="images/CZElectro.png" alt="CZElectro Logo" width="120"/>
</p>

<h1 align="center">⚡ CZElectro</h1>

<p align="center">
  <strong>Interactive Electronics Lab Simulator</strong><br>
  A web-based circuit simulation tool with drag-and-drop components, flexible wire routing, Arduino IDE, and a real-time MNA solver.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/SVG-Components-FF9900?style=flat-square&logo=svg&logoColor=white" alt="SVG"/>
  <img src="https://img.shields.io/badge/MNA-Solver-00D4AA?style=flat-square" alt="MNA"/>
  <img src="https://img.shields.io/badge/i18n-ID%20%7C%20EN-blue?style=flat-square" alt="i18n"/>
</p>

---

## 📖 About

**CZElectro** is a fully interactive, browser-based electronics circuit simulator that lets users design, test, and visualize electrical circuits in real-time. Built entirely with **Vanilla JavaScript** — no frameworks, no dependencies — just pure HTML, CSS, and JS.

The simulator uses **Modified Nodal Analysis (MNA)** to compute voltages and currents across the entire circuit on every state change.

---

## ✨ Key Features

### 🔌 Component Library (69+ components)

| Category | Components |
|---|---|
| **DC Sources** | Battery 1.5V, 3V, 9V, 12V, LiFePO4 32140, PLTS 100Ah / 200Ah |
| **AC Sources** | PLN 220V Mains, ATS Auto Transfer Switch |
| **Solar** | Panel 6V, 12V, 18V, Array 1kW / 3kW / 5kW |
| **Charge Controllers** | PWM 10A, PWM 30A, MPPT 60A, MPPT 100A |
| **Inverters** | 1kW, 3kW, 5kW |
| **Passive** | Resistor (100Ω–10kΩ), Capacitor, Diode, Potentiometer, Fuse |
| **DC Output** | LED (Red/Green/Blue/White/RGB), LED Strip RGB, LED Dot Matrix 32×8, Bulb, DC Motor, Buzzer, Speaker |
| **AC Appliances** | LED TV, Fridge, Blender, Rice Cooker, AC ½PK / 1PK, Computer, Water Pump, Iron, 30W Lamp |
| **Wiring** | Jumper Wire, Outlet, Outlet Strip, Ground |
| **Protection** | MCB (4A / 6A / 10A / 16A / 32A), Fuse |
| **Instruments** | Multimeter (V / A / Ω), kWh Meter, Timer 555 |
| **Converters** | Step-Down 12V, Step-Down 5V |
| **Microcontroller** | Arduino Uno (with built-in IDE), 7-Segment Display |

### ⚙️ Realistic Simulation

- **MNA Solver** — Modified Nodal Analysis with iterative solving for diodes, relays, and non-linear components
- **Battery Simulation** — Realistic charge/discharge with BMS cutoff, 0.5C charge cap, and 1C discharge cap
- **Solar Simulation** — Sinusoidal irradiance curve (06:00–18:00), day/night cycle
- **Overcurrent Protection** — Components burn out when current exceeds their rating; MCBs auto-trip and can be reset
- **ATS Failover** — Automatic PLN↔PLTS transfer based on actual wire connectivity (BFS tracing), not just component existence
- **Time Acceleration** — 1x, 10x, 60x simulation speed

### 🤖 Arduino IDE & Microcontroller

- **Built-in Arduino IDE** — Write, upload, and run Arduino code directly in the browser
- **Pin-Aware Simulation** — Components only work when wired to the correct pin AND `pinMode(pin, OUTPUT)` is set in code
- **LED Dot Matrix 32×8** — Full API: `matrix.scroll()`, `matrix.text()`, `matrix.pixel()`, `matrix.clear()` with built-in font
- **7-Segment Display** — API: `seg7.show()`, `seg7.text()`, `seg7.segments()`, `seg7.dot()`
- **Serial Monitor** — `Serial.println()` output visible in real-time
- **MNA-Integrated Current** — Arduino outputs draw real current from battery through MNA solver; measurable with multimeter
- **Auto-Stop on Power Loss** — Arduino program halts when battery dies or wires are disconnected
- **Preset Programs** — 8 built-in example sketches (Blink, Traffic Light, Running Text Masjid, Combo Demo, etc.)
- **Greeting Circuit** — First-time visitors see an auto-deployed demo with Arduino + LED Matrix + LED RGB + Battery

### 🎨 Modern Interface

- **Drag & Drop** — Drag components from the sidebar onto the workspace
- **Bézier Wires** — Flexible wires with editable control points
- **Dark / Light Theme** — Persistent theme toggle
- **Rotation** — Rotate components clockwise (`R`) or counter-clockwise (`Shift+R`)
- **Group / Ungroup** — Group components for bulk rotation and movement
- **Zoom & Pan** — Scroll-to-cursor zoom, middle-click pan
- **Context Menu** — Right-click for quick actions (rotate, duplicate, reset, delete, etc.)
- **Undo / Redo** — Full history with `Ctrl+Z` / `Ctrl+Y`
- **Grid Snap** — 10px grid with toggle visibility
- **Broken Badge** — Persistent pulsing `⛔ Broken` indicator on damaged components
- **Sound Effects** — Audio feedback for burns, fuse snaps, and switches (mutable)

### 🌐 Internationalization (i18n)

- 🇮🇩 Bahasa Indonesia (default)
- 🇬🇧 English

All labels, context menus, badges, and notifications update instantly when the language is changed.

### 💾 Persistence & File I/O

- **Auto-save** — Circuit state is persisted to `localStorage` automatically
- **Export / Import JSON** — Save and open circuit files (`.json`)
- **Copy Circuit Text** — Copy the circuit schema as text to clipboard

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `R` | Rotate 90° clockwise (CW) |
| `Shift+R` | Rotate 90° counter-clockwise (CCW) |
| `Delete` / `Backspace` | Delete selected component(s) |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Duplicate selection |
| `Ctrl+G` | Group selected components |
| `Ctrl+Shift+G` | Ungroup |
| `Ctrl+S` | Save circuit to file |
| `Ctrl+O` | Open circuit file |
| `Ctrl+A` | Select all components |
| `M` | Mute / Unmute sound effects |

---

## 🏗️ Architecture

```
czelectro/
├── index.html              # Entry point & SVG gradient definitions
├── css/
│   ├── variables.css       # CSS custom properties & theming tokens
│   ├── layout.css          # Sidebar, workspace, panels, responsive layout
│   └── components.css      # Component-specific styles & animations
├── js/
│   ├── components.js       # Component registry (SVG templates, specs, terminals)
│   ├── components-ui.js    # Spawn, rotate, reset, duplicate logic
│   ├── electrical-laws.js  # Ohm's law, power, voltage divider helpers
│   ├── mna-solver.js       # MNA matrix builder & Gaussian elimination solver
│   ├── mna-evaluate.js     # Post-solve evaluation (LED glow, motor spin, etc.)
│   ├── battery-sim.js      # Battery charge/discharge, solar sim & Arduino drain
│   ├── wire.js             # Wire creation, Bézier rendering, terminal positioning
│   ├── events.js           # Mouse/keyboard event handlers, context menu
│   ├── state.js            # Save/restore state (localStorage & JSON file I/O)
│   ├── grid.js             # Grid canvas rendering & coordinate snapping
│   ├── ui.js               # Sidebar, toolbar, settings panel, simulation controls
│   ├── i18n.js             # Language dictionaries & dynamic text translation
│   ├── audio.js            # Web Audio API sound effects engine
│   ├── effects.js          # Visual effects (sparks, burn notices)
│   ├── arduino-ide.js      # Arduino IDE modal, interpreter, device APIs
│   └── greeting.js         # Auto-deploy demo circuit for first-time visitors
└── images/
    └── CZElectro.png       # Application logo
```

### Simulation Pipeline

```
User Interaction (drag / click / wire)
    │
    ▼
┌─────────────┐     ┌────────────────┐     ┌──────────────────┐
│  events.js  │────▶│  mna-solver.js │────▶│ mna-evaluate.js  │
│  (capture   │     │  (build MNA    │     │  (apply results: │
│   input)    │     │   matrix,      │     │   LED glow,      │
│             │     │   solve for    │     │   motor spin,    │
│             │     │   V and I)     │     │   overcurrent    │
│             │     │                │     │   detection)     │
└─────────────┘     └────────────────┘     └──────────────────┘
                          │                        │
                          ▼                        ▼
                   ┌─────────────┐          ┌────────────┐
                   │ battery-    │          │  state.js  │
                   │  sim.js     │          │ (auto-save │
                   │ (charge /   │          │  to local  │
                   │  discharge  │          │  storage)  │
                   │  engine)    │          └────────────┘
                   └─────────────┘
```

---

## 🚀 Getting Started

CZElectro is a fully static web application — no build step or backend required.

### Option 1: Open directly
```
Open index.html in any modern browser (Chrome, Firefox, Edge)
```

### Option 2: Local server (recommended)
```bash
# Using a simple HTTP server:
npx -y serve .

# Or with Python:
python -m http.server 8000
```

Then navigate to `http://localhost:8000`.

### Requirements
- A modern browser with ES6+ support (Chrome 80+, Firefox 78+, Edge 80+)
- No Node.js, npm, or build tools required

---

## 🔧 Tech Stack

| Technology | Usage |
|---|---|
| **Vanilla JavaScript** | Entire application logic — zero external dependencies |
| **Inline SVG** | All components rendered as scalable vector graphics |
| **CSS Custom Properties** | Dynamic theming (dark / light mode) |
| **CSS Animations** | Visual effects (LED glow, motor spin, broken shake, pulse badges) |
| **Modified Nodal Analysis** | Real-time circuit solving engine |
| **localStorage API** | Automatic state persistence across sessions |
| **Web Audio API** | Optional sound effects (burn, fuse snap, switch click) |

---

## 📝 License

© 2024–2026 CyberZilla. All rights reserved.
