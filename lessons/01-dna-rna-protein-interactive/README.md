# Lesson 01: DNA, RNA, Protein

## What This Lesson Teaches

This lesson teaches the biological core idea:

`DNA -> RNA -> Protein`

It covers:

- what a gene is
- how DNA and RNA differ
- complementary base pairing
- transcription
- RNA processing
- translation
- why mRNA is needed as an intermediate
- the special cases of RNA viruses and retroviruses
- typical accuracy traps such as `3' -> 5'` versus `5' -> 3'`

The aim is not only memorization. The learner should understand the **flow of information** and be able to explain where each step happens, what it produces, and why that step exists.

## Why This Was Built As A Website

This topic is process-based, spatial, and sequential.

A static text explanation helps, but it has weaknesses:

- the learner can read without actually processing the sequence
- cellular locations are hard to picture
- directionality mistakes are easy to miss
- exceptions like retroviruses are often remembered incorrectly

An interactive website is a better fit because it can combine:

- sequence
- motion
- spatial separation
- immediate feedback
- repeated low-friction practice

That makes the topic easier to see as a system instead of a pile of isolated definitions.

## How The Website Teaches

### 1. HTML creates the learning path

The HTML is organized as a guided lesson, not as a random page of facts.

The learner moves through:

1. the big picture
2. DNA/RNA basics
3. directionality traps
4. transcription phases
5. virus exceptions
6. self-test and recap

This structure matters because the teaching goal is progressive understanding. Each section depends on the one before it.

### 2. CSS creates the visual mental model

The CSS is not just decoration. It teaches by shaping attention and spatial memory.

Examples:

- The page visually separates **Zellkern** and **Cytoplasma** so location becomes memorable.
- The animated scene makes the learner see that DNA stays protected while mRNA moves the information onward.
- Motion highlights process: polymerase activity, RNA appearance, ribosome action, and protein emergence.
- Color and card grouping reduce the chance that all concepts blur together.

In short, the CSS helps convert abstract biology into a visible process.

### 3. JavaScript creates active learning

The JavaScript is where passive reading becomes practice.

It teaches by letting the learner:

- click through the central dogma step by step
- enter a DNA template strand and immediately see the RNA transcript
- inspect codons and a protein preview
- answer directionality questions with instant correction
- switch between normal cells, RNA viruses, and retroviruses
- complete a quiz with feedback and repetition

This matters because understanding improves when the learner has to respond, not just observe.

## Teaching Strategy Behind The Lesson

This lesson uses a few clear teaching principles:

### Guided sequencing

The lesson starts with the overall flow before zooming into details. That prevents early overload.

### Visual anchoring

Important distinctions are tied to visual anchors:

- DNA = protected archive
- mRNA = working copy
- Ribosome = translation site
- Retrovirus = reversed starting direction

### Misconception targeting

The lesson explicitly targets common mistakes:

- saying not all genes are DNA instead of saying some genetic information is RNA
- mixing up transcription directions
- treating `AAUAAA` as a universal simple stop label
- saying retroviruses turn DNA into DNA instead of RNA into DNA

### Immediate feedback

The learner gets correction during the task, not only afterward. That helps close misunderstanding quickly.

### Compression after expansion

After the detailed walkthrough, the page ends with quiz feedback and a mini-sheet. That supports final recall.

## Files In This Lesson

- [index.html](./index.html): lesson structure and content
- [styles.css](./styles.css): visual design, layout, motion, and emphasis
- [script.js](./script.js): interactivity, practice logic, state changes, and quiz behavior

## How To Use This Lesson

Open [index.html](./index.html) in a browser.

Recommended use order:

1. Click through the story board from DNA to protein.
2. Use the base-pairing section and change the DNA sequence.
3. Do the directionality challenge.
4. Switch through the transcription phases.
5. Compare normal cells, RNA viruses, and retroviruses.
6. Finish with the self-test.

## Why This Fits The Repo Thesis

This lesson is the first example of the repo's central claim:

AI can teach well when it does three things at once:

- translates raw notes into a usable explanation
- chooses a teaching format that matches the topic
- builds interaction that exposes whether the learner actually understands

For this biology topic, the right format was an interactive website. Another topic may need a different format, and that is part of what this repository is testing.
