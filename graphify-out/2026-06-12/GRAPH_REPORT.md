# Graph Report - .  (2026-06-12)

## Corpus Check
- 86 files · ~78,477 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 225 nodes · 202 edges · 76 communities (13 shown, 63 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Audio Engine|Audio Engine]]
- [[_COMMUNITY_Component Registry|Component Registry]]
- [[_COMMUNITY_Arduino IDE|Arduino IDE]]
- [[_COMMUNITY_MNA Solver & Events|MNA Solver & Events]]
- [[_COMMUNITY_MNA Post-Evaluation|MNA Post-Evaluation]]
- [[_COMMUNITY_Battery & Solar Simulation|Battery & Solar Simulation]]
- [[_COMMUNITY_Service Worker (PWA)|Service Worker (PWA)]]
- [[_COMMUNITY_LED Matrix Component|LED Matrix Component]]
- [[_COMMUNITY_7-Segment Display|7-Segment Display]]
- [[_COMMUNITY_Ammeter Component|Ammeter Component]]
- [[_COMMUNITY_AC Appliance Components|AC Appliance Components]]
- [[_COMMUNITY_Arduino Board Component|Arduino Board Component]]
- [[_COMMUNITY_ATS Component|ATS Component]]
- [[_COMMUNITY_Battery Component|Battery Component]]
- [[_COMMUNITY_Large Battery Component|Large Battery Component]]
- [[_COMMUNITY_PLTS Battery Component|PLTS Battery Component]]
- [[_COMMUNITY_Bulb Component|Bulb Component]]
- [[_COMMUNITY_Buzzer Component|Buzzer Component]]
- [[_COMMUNITY_Capacitor Component|Capacitor Component]]
- [[_COMMUNITY_Charge Controller Component|Charge Controller Component]]
- [[_COMMUNITY_Crystal Component|Crystal Component]]
- [[_COMMUNITY_Diode Component|Diode Component]]
- [[_COMMUNITY_DPDT Switch Component|DPDT Switch Component]]
- [[_COMMUNITY_Fan Component|Fan Component]]
- [[_COMMUNITY_Fuse Component|Fuse Component]]
- [[_COMMUNITY_Ground Component|Ground Component]]
- [[_COMMUNITY_Inductor Component|Inductor Component]]
- [[_COMMUNITY_Inverter Component|Inverter Component]]
- [[_COMMUNITY_Jumper Wire Component|Jumper Wire Component]]
- [[_COMMUNITY_kWh Meter Component|kWh Meter Component]]
- [[_COMMUNITY_LDR Component|LDR Component]]
- [[_COMMUNITY_LED Component|LED Component]]
- [[_COMMUNITY_LED Strip Component|LED Strip Component]]
- [[_COMMUNITY_MCB Protection Component|MCB Protection Component]]
- [[_COMMUNITY_MOSFET Component|MOSFET Component]]
- [[_COMMUNITY_Motor Component|Motor Component]]
- [[_COMMUNITY_Multimeter Component|Multimeter Component]]
- [[_COMMUNITY_Op-Amp Component|Op-Amp Component]]
- [[_COMMUNITY_Outlet Component|Outlet Component]]
- [[_COMMUNITY_Photodiode Component|Photodiode Component]]
- [[_COMMUNITY_PLN Mains Component|PLN Mains Component]]
- [[_COMMUNITY_Potentiometer Component|Potentiometer Component]]
- [[_COMMUNITY_Power Strip Component|Power Strip Component]]
- [[_COMMUNITY_Push Button Component|Push Button Component]]
- [[_COMMUNITY_Relay Component|Relay Component]]
- [[_COMMUNITY_Resistor Component|Resistor Component]]
- [[_COMMUNITY_SCR Component|SCR Component]]
- [[_COMMUNITY_Servo Component|Servo Component]]
- [[_COMMUNITY_Solar Panel Component|Solar Panel Component]]
- [[_COMMUNITY_Solar Array Component|Solar Array Component]]
- [[_COMMUNITY_Speaker Component|Speaker Component]]
- [[_COMMUNITY_Step-Down Converter|Step-Down Converter]]
- [[_COMMUNITY_Switch Component|Switch Component]]
- [[_COMMUNITY_Terminal Block Component|Terminal Block Component]]
- [[_COMMUNITY_Thermistor Component|Thermistor Component]]
- [[_COMMUNITY_Timer 555 Component|Timer 555 Component]]
- [[_COMMUNITY_Transformer Component|Transformer Component]]
- [[_COMMUNITY_Transistor Component|Transistor Component]]
- [[_COMMUNITY_TRIAC Component|TRIAC Component]]
- [[_COMMUNITY_Varistor Component|Varistor Component]]
- [[_COMMUNITY_Voltage Regulator Component|Voltage Regulator Component]]
- [[_COMMUNITY_Zener Diode Component|Zener Diode Component]]
- [[_COMMUNITY_Component Manifest|Component Manifest]]
- [[_COMMUNITY_Drag & Drop UI|Drag & Drop UI]]
- [[_COMMUNITY_Internationalization|Internationalization]]
- [[_COMMUNITY_PWA Icons & Manifest|PWA Icons & Manifest]]
- [[_COMMUNITY_Component Library Concept|Component Library Concept]]
- [[_COMMUNITY_CZElectro Project Overview|CZElectro Project Overview]]

## God Nodes (most connected - your core abstractions)
1. `ComponentRegistry` - 16 edges
2. `runArduinoCode()` - 9 edges
3. `stop()` - 8 edges
4. `noiseBuffer()` - 7 edges
5. `get()` - 6 edges
6. `playNoise()` - 5 edges
7. `updateRunButton()` - 4 edges
8. `autoRunFlashed()` - 4 edges
9. `mmUpdateDisplay()` - 4 edges
10. `findConnected()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Progressive Web App Support` --references--> `CZElectro App Icon`  [INFERRED]
  README.md → icon/icon-128x128.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Simulation Engine** — czelectro_readme_mna_solver_concept, czelectro_readme_battery_simulation, czelectro_readme_solar_simulation, czelectro_readme_overcurrent_protection [INFERRED 0.85]

## Communities (76 total, 63 thin omitted)

### Community 0 - "Audio Engine"
Cohesion: 0.19
Nodes (11): burn(), fanStart(), fuseSnap(), motorStart(), noiseBuffer(), playNoise(), playTone(), relayClick() (+3 more)

### Community 2 - "Arduino IDE"
Cohesion: 0.25
Nodes (15): Arduino IDE Integration, applySeg7Pattern(), autoRunFlashed(), checkSyntax(), clearSeg7(), createArduinoAPI(), findConnected(), isArduinoPowered() (+7 more)

### Community 3 - "MNA Solver & Events"
Cohesion: 0.15
Nodes (8): Modified Nodal Analysis Solver, Overcurrent Protection, Simulation Pipeline Architecture, ufFind(), ufUnion(), buildNodeMap(), uf(), ufU()

### Community 4 - "MNA Post-Evaluation"
Cohesion: 0.48
Nodes (6): mmAnimate(), mmColor(), mmFormatValue(), mmUpdateDisplay(), ufFind(), ufUnion()

### Community 5 - "Battery & Solar Simulation"
Cohesion: 0.33
Nodes (3): ATS Auto Transfer Switch Failover, Battery Charge/Discharge Simulation, Solar Irradiance Simulation

## Knowledge Gaps
- **67 isolated node(s):** `variants`, `variants`, `variants`, `variants`, `variants` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buildNodeMap()` connect `MNA Solver & Events` to `Component Registry`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Simulation Pipeline Architecture` connect `MNA Solver & Events` to `MNA Post-Evaluation`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `variants`, `variants`, `variants` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._