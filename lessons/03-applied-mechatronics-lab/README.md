# Lesson 03: Applied Mechatronics Lab

## What This Lesson Teaches

This lesson teaches the core conceptual chain behind a large mechatronics block:

- charge, current, voltage, power
- real voltage sources and internal resistance
- conductor / insulator / semiconductor behavior
- p- and n-doping
- diodes, LEDs, Zener diodes, freewheel diodes
- lead resistance and four-wire measurement
- operational amplifier basics
- comparator, hysteresis, inverting amplifier, voltage follower
- capacitors, dielectric materials, field quantities and geometry effects
- magnetic field basics, coils and transformer ratio
- control vs regulation
- SPS scan cycle

The goal is not to present these as isolated chapters. The lesson is built to show how they connect:

- moving charge leads to current
- separated charge leads to voltage
- nonlinear device behavior leads to protective circuits
- feedback leads to stable measurement and stable control behavior

## Why This Format Was Chosen

This topic is wide, diagram-heavy, and highly prone to shallow memorization.

Students often know fragments like:

- `P = U * I`
- "LED needs resistor"
- "Schmitt trigger has hysteresis"
- "Regelung has feedback"

but cannot explain **why** these statements are true or how they relate.

So this lesson is built as a **multi-module interactive web lab**.

That format is the right fit here because the topic needs:

- diagrams
- parameter changes
- visible cause-effect relations
- curve interpretation
- multiple linked models for the same physics

## Teaching Strategy

The site is structured in a strict sequence from physics foundation to engineering application:

1. Fundamental electrical quantities
2. Material behavior and band picture
3. Nonlinear semiconductor devices and protection circuits
4. Measurement and analog signal conditioning
5. Energy storage, fields, magnetics
6. Control theory and PLC logic

This matters because later engineering topics are only understandable when the earlier physical model is stable.

## How The Website Teaches

### 1. Interactive quantity lab

The first module lets the learner directly vary:

- number of charge carriers
- time
- work
- charge
- source resistance
- load resistance

This turns definitions like `I = dQ/dt` and `U = dW/dQ` into manipulable relationships instead of abstract formulas.

### 2. Dual representation for materials

The lesson teaches conductor, semiconductor and insulator behavior with:

- a simplified potential-well picture
- a simplified band-structure picture

This is important because students often see these as separate topics even though they describe the same physics at different levels.

### 3. Practice-oriented diode bench

The diode module is not only about theory:

- LED resistor calculation
- Zener clamping
- freewheel diode behavior during switch-off

That mirrors real workshop and Arduino practice, where the main learning value lies in understanding failure prevention.

### 4. Measurement + OPV bridge

The lesson deliberately places four-wire measurement and OPV concepts near each other because both are really about:

- not disturbing the measured system
- separating a source from a load
- controlling what current flows where

This builds a more coherent mental model than teaching them as unrelated topics.

### 5. Capacitor and field reasoning

The capacitor module links:

- geometry
- dielectric material
- capacitance
- stored charge
- field strength
- electric flux density

and then tests the classic understanding trap:

- connected to source -> `U` stays constant
- disconnected -> `Q` stays constant

### 6. Automation with visible feedback

The final module makes the open-loop vs closed-loop distinction visible through a simple room-temperature simulation and then ties that to the SPS scan-cycle logic.

That is more effective than a text-only definition because the learner sees the consequence of feedback directly.

## Scientific Accuracy Notes

This lesson stays close to the supplied technical content and standard electrotechnical models.

Where simplifications are used, they are marked clearly:

- material band pictures are qualitative, not full solid-state calculations
- the coil field display uses relative values because full geometry is not parameterized
- the Zener display shows the regulating effect conceptually, not a detailed datasheet curve

The simplification level is chosen to preserve the physics while keeping the lesson interactive and readable.

## Files In This Lesson

- [index.html](./index.html): structure and learning flow
- [styles.css](./styles.css): visual system, diagram styling, layout and motion
- [script.js](./script.js): calculators, simulations, charts and quiz logic

## How To Use

Open [index.html](./index.html) in a browser.

Recommended study path:

1. Work through the modules in order once
2. Then revisit only the weak spots:
   - LED / freewheel diode
   - OPV modes
   - capacitor connected vs isolated
   - control vs regulation
3. Finish with the final quick check

## Why This Fits The Repo Thesis

This lesson strengthens the repo's central claim:

AI teaches best when it chooses a format that matches the epistemic structure of the topic.

For this mechatronics lesson, the right format was not a terminal drill and not a simple static summary. It needed:

- visual spatial models
- parameter-based interaction
- charts and state changes
- engineering calculators

So this lesson acts as a hybrid of explainer, simulator and revision tool.
