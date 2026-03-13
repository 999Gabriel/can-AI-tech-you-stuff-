# Lesson 03: Applied Mechatronics Lab

## What This Lesson Teaches

This lesson now teaches the mechatronics block in two layers at once:

- a dense conceptual atlas for breadth
- a guided systems lab for active practice

It covers:

- charge, current, voltage, power
- real voltage sources and internal resistance
- conductor / insulator / semiconductor behavior
- p- and n-doping
- diodes, LEDs, Zener diodes, freewheel diodes
- lead resistance and four-wire measurement
- operational amplifier basics
- comparator, hysteresis, inverting amplifier, non-inverting amplifier
- voltage follower, difference amplifier, integrator and peak detector
- capacitors, dielectric materials, field quantities and geometry effects
- magnetic field basics, coils and transformer ratio
- control vs regulation
- SPS scan cycle

The goal is not to present these as isolated chapters. The lesson is built to show how they connect in actual engineering workflows:

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

So this lesson is built as a **multi-module interactive web lab with a guided circuit builder**.

That format is the right fit here because the topic needs:

- diagrams
- parameter changes
- visible cause-effect relations
- curve interpretation
- multiple linked models for the same physics

## Teaching Strategy

The site is structured in a strict sequence from physics foundation to engineering application:

1. Fundamental electrical quantities
2. Interactive circuit construction tasks
3. OPV analysis in linear and switching operation
4. Material behavior and band picture
5. Energy storage, fields, magnetics
6. Control theory and PLC logic

This matters because later engineering topics are only understandable when the earlier physical model is stable.

## How The Website Teaches

### 1. Concept atlas first

The lesson now opens with a dense concept atlas instead of dropping straight into one widget.

That matters because this subject is broad. The learner needs a map of the whole system before drilling individual circuits.

### 2. Guided circuit builder

The lesson now includes three explicit build tasks:

- safe LED circuit
- relay / coil protection with flywheel diode
- pull-up input wiring

The learner does not only read the rule. They place components into the circuit, simulate the result and see whether current flows correctly, dangerously or not at all.

This directly targets a common weakness in technical classes:
students can often repeat the rule, but cannot translate it into a working schematic.

### 3. Expanded OPV studio

The previous version was too shallow on OPVs. The revised lesson now separates:

- topology bench for static transfer behavior
- dynamic bench for time-dependent behavior

Interactive topology modes:

- comparator
- inverting amplifier
- non-inverting amplifier
- voltage follower
- difference amplifier

Interactive dynamic modes:

- Schmitt trigger
- integrator
- peak detector

That gives the learner both the static formulas and the dynamic system intuition.

### 4. Field, material and measurement bridge

The field lab reconnects formulas to physical meaning:

- Q, I, U, P
- real sources with internal resistance
- band picture and doting logic
- capacitor geometry and dielectric influence
- magnetic field strength and transformer ratio
- two-wire vs four-wire measurement
- Zener voltage limiting

This section is deliberately broad so the learner can move back from component tricks to the physics underneath them.

### 5. Automation with visible feedback

The final module makes the open-loop vs closed-loop distinction visible through a simple room-temperature simulation and then ties that to the SPS scan-cycle logic.

That is more effective than a text-only definition because the learner sees the consequence of feedback directly.

## Scientific Accuracy Notes

This lesson stays close to the supplied technical content and standard electrotechnical models.

Where simplifications are used, they are marked clearly:

- material band pictures are qualitative, not full solid-state calculations
- the coil field display uses relative values because full geometry is not parameterized
- the circuit builder is a guided topology trainer, not a free SPICE-equivalent simulator
- the dynamic OPV plots are didactic response models, not vendor-accurate transient simulations

The simplification level is chosen to preserve the physics while keeping the lesson interactive and readable.

## Files In This Lesson

- [index.html](./index.html): structure and learning flow
- [styles.css](./styles.css): visual system, diagram styling, layout and motion
- [script.js](./script.js): circuit-builder logic, OPV studio, calculators, charts and quiz logic

## How To Use

Open [index.html](./index.html) in a browser.

Recommended study path:

1. Read the concept atlas once for the big picture.
2. Solve the three circuit-building tasks.
3. Spend the most time in the OPV studio.
4. Use the field lab to reconnect formulas with physical meaning.
5. Finish with the final quick check.

## Why This Fits The Repo Thesis

This lesson strengthens the repo's central claim:

AI teaches best when it chooses a format that matches the epistemic structure of the topic.

For this mechatronics lesson, the right format was not a terminal drill and not a simple static summary. It needed:

- visual spatial models
- parameter-based interaction
- charts and state changes
- circuit-construction tasks
- engineering calculators
- static and dynamic OPV views

<<<<<<< HEAD
So this lesson acts as a hybrid of explainer, simulator and revision tool.

# Feedback:
this was wayyy to short for me personally, not interactive enough, nice idea but not a good implementation. I asked it to overwork this one again. Let's see🚢.
=======
So this lesson now acts as a hybrid of explainer, guided builder, simulator and revision tool.

## Revision Context

This version replaces an earlier shorter attempt after direct feedback that the mechatronics lesson needed:

- more topic coverage
- more interactivity
- a cleaner design
- a much deeper OPV treatment

The current version is the result of that revision.
>>>>>>> f914faa (Overhaul mechatronics lesson with circuit builder)
