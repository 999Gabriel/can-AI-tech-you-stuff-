# Can AI Teach You Stuff?

This repository is a practical answer to the question:

**Can AI teach you stuff and, if yes, how?**

The repo is built as a series of lesson experiments. Each lesson takes a real topic and turns it into a teachable artifact: sometimes a website, sometimes a visual explainer, simulator, game, worksheet, CLI tool, or another format that fits the topic best.

The goal is not just to dump information. The goal is to test how AI can:

- structure a topic into a clear learning path
- turn passive notes into active understanding
- use interaction, feedback, and visualization to improve recall
- choose the right medium for the content instead of forcing one format everywhere

## Repo Structure

Each lesson lives in its own folder and should include:

- a short lesson explanation in Markdown
- the actual teaching artifact
- enough code or material so others can inspect how the lesson teaches

Current lessons:

1. [DNA, RNA, Protein: Interactive Central Dogma Lesson](./lessons/01-dna-rna-protein-interactive/README.md)
2. [Gerund vs Infinitive: Terminal Grammar Coach](./lessons/02-gerund-infinitive-terminal-coach/README.md)

## Lesson Design Principle

For each new topic, the question is not only:

**What should be taught?**

It is also:

**What is the best format to teach this specific thing well?**

Examples:

- A process-heavy biology topic may work best as an interactive visual flow.
- A math topic may work better as a step-by-step problem solver.
- A programming topic may work better as a runnable sandbox.
- A history topic may benefit from a timeline or branching decisions.

So this repo is also a design study on AI-driven teaching formats.

## First Experiment

The first lesson teaches the biological information flow:

`DNA -> RNA -> Protein`

It turns a dense block of notes into an interactive learning sequence with:

- a visual story from gene to protein
- a base-pairing practice tool
- transcription phase explanations
- a comparison between normal cells, RNA viruses, and retroviruses
- a self-test with immediate feedback

See:

- [Lesson folder](./lessons/01-dna-rna-protein-interactive/)
- [Lesson explanation](./lessons/01-dna-rna-protein-interactive/README.md)
- [Website entry point](./lessons/01-dna-rna-protein-interactive/index.html)

## How To Use

Clone the repo, open a lesson folder, and inspect both:

- the artifact itself
- the Markdown explanation of the teaching strategy

For website-based lessons, open the `index.html` file directly in a browser.

For terminal-based lessons, run the entry script shown in the lesson README.

## What This Repo Tries To Show

AI can teach effectively when it does more than summarize. It has to:

- reorganize information
- choose a fitting medium
- create interaction where the learner needs it
- expose misconceptions and common failure points
- reinforce understanding with repetition and feedback

This repository is a collection of concrete examples of that idea.
