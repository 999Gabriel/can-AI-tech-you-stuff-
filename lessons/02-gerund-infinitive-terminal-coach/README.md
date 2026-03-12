# Lesson 02: Gerund vs Infinitive Terminal Coach

## What This Lesson Teaches

This lesson teaches the English grammar patterns behind:

- bare infinitive
- to-infinitive
- gerund

It focuses on the specific homework topic:

- modal verbs + bare infinitive
- had better / would rather
- to-infinitive after verbs like want, promise, have to
- question word + infinitive
- fixed phrases like be likely to, be supposed to, be expected to
- object + infinitive patterns such as ask somebody to help
- the exception make somebody do
- perception verbs: whole event vs ongoing action
- meaning-change pairs like remember doing vs remember to do
- stop doing vs stop to do
- used to do vs be used to doing
- like doing vs would like to do

## Why This Was Not Built As A Website

This topic is not mainly spatial or visual. It is contrast-heavy.

The learner has to make quick grammar decisions and separate similar-looking structures that carry different meanings. That means the best format is not a visual page but a response-based drill environment.

So this lesson is built as a **terminal coach**.

That format works well because it:

- removes visual noise
- forces active choice
- gives immediate correction
- makes repetition fast
- feels closer to a real classroom drill or oral revision session

## The Teaching Idea

The coach is designed around the real learning bottleneck:

Students usually do not fail because they have never seen the rules.
They fail because, under pressure, they confuse **similar patterns**.

So the tool teaches in layers:

1. a compact rule map
2. high-value contrast pairs
3. quick pattern recognition
4. exam-style choice practice
5. a final cheat sheet

This means the lesson trains both:

- rule recognition
- meaning recognition

That is exactly what this grammar topic requires.

## How The Code Teaches

### `coach.js`

The entire lesson artifact lives in [coach.js](./coach.js).

It is a Node-based interactive CLI study coach.

The code teaches through several modes:

### 1. Rule Map

This mode compresses the topic into the main structural families:

- bare infinitive
- to-infinitive
- gerund
- meaning-change pairs

This is the orientation phase. It gives the learner a map before testing begins.

### 2. Contrast Lab

This is the most important section.

It teaches the pairs that students most often confuse:

- remember doing / remember to do
- stop doing / stop to do
- used to do / be used to doing
- like doing / would like to do

Instead of listing them as a table, the tool slows down and explains each pair in direct contrast. That helps the learner see the semantic switch clearly.

### 3. Pattern Drill

This section gives fast multiple-choice items for core structures.

The learner has to decide between:

- bare infinitive
- to-infinitive
- gerund

Each answer gets an explanation, so it is not only testing. It is guided correction.

### 4. Exam Mission

This mode simulates the pressure point of the homework or a class test:

two competing sentence forms, one has to be chosen.

This is good for this topic because the real challenge is often not producing language from zero but choosing correctly between two almost-correct-looking options.

### 5. Quick Coach and Cheat Sheet

These modes condense the topic into decision rules and last-minute revision.

That supports the learner right before class or homework submission.

## Why This Fits The Repo Thesis

This lesson supports the repo's main idea:

AI can teach better when it chooses the right medium for the topic.

For biology, a visual interactive website made sense because the content was process-based and spatial.

For this grammar topic, a terminal coach is a better fit because the content is:

- contrast-driven
- error-prone under time pressure
- best learned through repeated decisions

So this lesson is intentionally not a website. The change of format is part of the experiment.

## How To Run

From this folder, run:

```bash
node coach.js
```

## Suggested Study Order

If you are revising quickly for tomorrow:

1. `Rule Map`
2. `Contrast Lab`
3. `Exam Mission`
4. `Mini Cheat Sheet`

If you want extra drilling, add `Pattern Drill` before the mission.
