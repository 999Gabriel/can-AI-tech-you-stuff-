#!/usr/bin/env node

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function line(char = "-", width = 72) {
  return char.repeat(width);
}

function title(text) {
  console.log(`\n${line("=")}`);
  console.log(text);
  console.log(line("="));
}

function printBullets(items) {
  items.forEach((item) => console.log(`- ${item}`));
}

function normalize(answer) {
  return answer.toLowerCase();
}

async function pause() {
  await ask("\nPress Enter to continue...");
}

const ruleMap = [
  {
    heading: "1. Bare infinitive",
    points: [
      "Use the verb without 'to' after modal verbs: can go, must leave, might come.",
      "Also use bare infinitive after had better and would rather.",
      "Classic trap: make somebody do, not make somebody to do.",
      "Perception verbs can take bare infinitive when you mean the whole event: I saw him drop the glass."
    ]
  },
  {
    heading: "2. To-infinitive",
    points: [
      "Very common after verbs of plan, wish, intention or promise: want to, decide to, promise to.",
      "Use it after question words: how to, where to, what to, whether to.",
      "Use it in object + infinitive patterns: ask somebody to help, want somebody to come.",
      "Use it in fixed phrases: be likely to, be supposed to, be expected to, be sure to."
    ]
  },
  {
    heading: "3. Gerund",
    points: [
      "Use -ing for activities in general: I like reading.",
      "Use it after stop when the meaning is 'quit the activity': Stop talking.",
      "Use it after remember for memories of the past: I remember meeting her.",
      "Use it after be used to for habits you are accustomed to: I am used to getting up early."
    ]
  },
  {
    heading: "4. Meaning-change pairs",
    points: [
      "remember doing = memory from the past; remember to do = do not forget",
      "stop doing = quit; stop to do = interrupt one action in order to do another",
      "used to do = past habit; be used to doing = be accustomed to",
      "like doing = enjoy in general; would like to do = specific wish"
    ]
  }
];

const contrastPairs = [
  {
    label: "remember doing / remember to do",
    left: "I remember locking the door.",
    leftMeaning: "The action happened before, and now I still have the memory.",
    right: "Remember to lock the door.",
    rightMeaning: "The action is still in the future. Do not forget it.",
    trap: "One sentence looks backward. The other gives a future reminder."
  },
  {
    label: "stop doing / stop to do",
    left: "He stopped smoking.",
    leftMeaning: "He quit the activity.",
    right: "He stopped to smoke.",
    rightMeaning: "He interrupted something else in order to smoke.",
    trap: "With gerund, the activity ends. With infinitive, a new purpose begins."
  },
  {
    label: "used to do / be used to doing",
    left: "I used to walk to school.",
    leftMeaning: "That was my past habit. It may be different now.",
    right: "I am used to walking to school.",
    rightMeaning: "Walking to school feels normal to me now.",
    trap: "The first is past routine. The second is present familiarity."
  },
  {
    label: "like doing / would like to do",
    left: "She likes swimming in lakes.",
    leftMeaning: "This is something she enjoys in general.",
    right: "She would like to swim in the lake.",
    rightMeaning: "This is a specific wish or plan now.",
    trap: "Gerund gives a general preference. Would like + infinitive gives a present wish."
  }
];

const patternDrillQuestions = [
  {
    sentence: "You must ___ your phone away during the test.",
    options: ["put", "to put", "putting"],
    answer: 0,
    explanation: "Modal verbs take the bare infinitive: must put."
  },
  {
    sentence: "She asked me ___ the window.",
    options: ["close", "to close", "closing"],
    answer: 1,
    explanation: "ask somebody to do something = object + to-infinitive."
  },
  {
    sentence: "I enjoy ___ detective stories.",
    options: ["read", "to read", "reading"],
    answer: 2,
    explanation: "enjoy is followed by a gerund."
  },
  {
    sentence: "They made us ___ all night.",
    options: ["work", "to work", "working"],
    answer: 0,
    explanation: "make + object + bare infinitive."
  },
  {
    sentence: "We did not know where ___ after class.",
    options: ["go", "to go", "going"],
    answer: 1,
    explanation: "Question word + to-infinitive: where to go."
  },
  {
    sentence: "I saw her ___ the cup.",
    options: ["drop", "to drop", "dropping"],
    answer: 0,
    explanation: "Bare infinitive after a perception verb can show the whole completed event."
  },
  {
    sentence: "I saw her ___ by the window for ten minutes.",
    options: ["sit", "to sit", "sitting"],
    answer: 2,
    explanation: "The -ing form highlights the ongoing action."
  },
  {
    sentence: "We are supposed ___ the homework tomorrow.",
    options: ["hand in", "to hand in", "handing in"],
    answer: 1,
    explanation: "be supposed to is a fixed to-infinitive phrase."
  },
  {
    sentence: "She is used to ___ up early.",
    options: ["get", "to get", "getting"],
    answer: 2,
    explanation: "be used to is followed by noun or gerund: getting."
  },
  {
    sentence: "He promised ___ me later.",
    options: ["call", "to call", "calling"],
    answer: 1,
    explanation: "promise is followed by to-infinitive."
  }
];

const missionQuestions = [
  {
    prompt: "Pick the better sentence for an exam answer.",
    sentenceA: "Remember locking the classroom.",
    sentenceB: "Remember to lock the classroom.",
    answer: "b",
    explanation: "This is a reminder for a future action, so you need remember to lock."
  },
  {
    prompt: "Choose the sentence that means 'she quit the activity'.",
    sentenceA: "She stopped to talk.",
    sentenceB: "She stopped talking.",
    answer: "b",
    explanation: "stop + gerund means the activity ended."
  },
  {
    prompt: "Choose the correct structure.",
    sentenceA: "My teacher made me rewrite the sentence.",
    sentenceB: "My teacher made me to rewrite the sentence.",
    answer: "a",
    explanation: "make takes the bare infinitive after the object."
  },
  {
    prompt: "Choose the sentence about a past habit.",
    sentenceA: "I used to revise every evening.",
    sentenceB: "I am used to revise every evening.",
    answer: "a",
    explanation: "used to + base verb = past habit. be used to needs a noun or gerund."
  },
  {
    prompt: "Choose the sentence about a general preference.",
    sentenceA: "I like reading before bed.",
    sentenceB: "I would like reading before bed.",
    answer: "a",
    explanation: "like + gerund works for general preference. would like needs to-infinitive."
  },
  {
    prompt: "Choose the sentence with the correct fixed phrase.",
    sentenceA: "We are likely win.",
    sentenceB: "We are likely to win.",
    answer: "b",
    explanation: "be likely to is a fixed pattern."
  },
  {
    prompt: "Choose the sentence where the whole event was seen.",
    sentenceA: "I saw him cross the street.",
    sentenceB: "I saw him crossing the street.",
    answer: "a",
    explanation: "cross = whole event. crossing = action in progress."
  },
  {
    prompt: "Choose the sentence with question word + infinitive.",
    sentenceA: "She could not decide what to say.",
    sentenceB: "She could not decide what saying.",
    answer: "a",
    explanation: "what to say is the correct reduced structure."
  }
];

function cheatSheet() {
  title("Mini Cheat Sheet");
  printBullets([
    "Bare infinitive: after modal verbs, had better, would rather, make, and often after see/hear/watch for a whole event.",
    "To-infinitive: after want, decide, promise, ask somebody to, question words, fixed phrases like be likely to.",
    "Gerund: for activities in general, after stop when you quit, after remember for past memory, after be used to.",
    "Big traps: remember doing vs remember to do; stop doing vs stop to do; used to do vs be used to doing; make somebody do."
  ]);
}

async function runRuleMap() {
  title("Rule Map");
  ruleMap.forEach((section) => {
    console.log(`\n${section.heading}`);
    printBullets(section.points);
  });
  await pause();
}

async function runContrastLab() {
  title("Contrast Lab");
  console.log("These are the pairs you must really know for tomorrow.\n");
  for (const pair of contrastPairs) {
    console.log(pair.label);
    console.log(line());
    console.log(`A: ${pair.left}`);
    console.log(`   Meaning: ${pair.leftMeaning}`);
    console.log(`B: ${pair.right}`);
    console.log(`   Meaning: ${pair.rightMeaning}`);
    console.log(`Trap: ${pair.trap}\n`);
    await pause();
  }
}

async function askMultipleChoice(question, index, total) {
  console.log(`\n${index + 1}/${total}`);
  console.log(question.sentence);
  question.options.forEach((option, optionIndex) => {
    const label = String.fromCharCode(65 + optionIndex);
    console.log(`  ${label}) ${option}`);
  });

  while (true) {
    const answer = normalize(await ask("Your answer (A/B/C or q): "));
    if (answer === "q") {
      return { quit: true };
    }
    const picked = answer.charCodeAt(0) - 97;
    if (picked >= 0 && picked < question.options.length) {
      const correct = picked === question.answer;
      console.log(correct ? "Correct." : "Not quite.");
      console.log(question.explanation);
      return { quit: false, correct };
    }
    console.log("Please answer with A, B, C or q.");
  }
}

async function runPatternDrill() {
  title("Pattern Drill");
  console.log("Choose the correct structure. This is the fast pattern-recognition mode.");
  let score = 0;

  for (let i = 0; i < patternDrillQuestions.length; i += 1) {
    const result = await askMultipleChoice(patternDrillQuestions[i], i, patternDrillQuestions.length);
    if (result.quit) {
      break;
    }
    if (result.correct) {
      score += 1;
    }
  }

  console.log(`\nScore: ${score}/${patternDrillQuestions.length}`);
  if (score <= 4) {
    console.log("Priority: revise the rule map and the contrast pairs first.");
  } else if (score <= 7) {
    console.log("Good base. Focus on the traps and fixed patterns.");
  } else {
    console.log("Strong. You are close to exam-ready.");
  }
  await pause();
}

async function runMission() {
  title("Exam Mission");
  console.log("Pick the better sentence each time. Think like tomorrow's homework or test.");
  let score = 0;

  for (let i = 0; i < missionQuestions.length; i += 1) {
    const item = missionQuestions[i];
    console.log(`\n${i + 1}/${missionQuestions.length}`);
    console.log(item.prompt);
    console.log(`  A) ${item.sentenceA}`);
    console.log(`  B) ${item.sentenceB}`);

    while (true) {
      const answer = normalize(await ask("Your answer (A/B or q): "));
      if (answer === "q") {
        console.log(`\nMission score so far: ${score}/${missionQuestions.length}`);
        await pause();
        return;
      }
      if (answer === "a" || answer === "b") {
        const correct = answer === item.answer;
        console.log(correct ? "Correct." : "Wrong choice.");
        console.log(item.explanation);
        if (correct) {
          score += 1;
        }
        break;
      }
      console.log("Please answer with A, B or q.");
    }
  }

  console.log(`\nMission score: ${score}/${missionQuestions.length}`);
  if (score === missionQuestions.length) {
    console.log("Excellent. The distinction patterns are solid.");
  } else if (score >= 6) {
    console.log("Decent. Re-run the mission once and focus on the explanations.");
  } else {
    console.log("Revisit the contrast pairs. The meaning changes are the main weak spot.");
  }
  await pause();
}

async function runQuickCoach() {
  title("Quick Coach");
  console.log("Answer these four questions in your head before you choose a form.\n");
  printBullets([
    "Is it a plan, wish, promise, instruction or goal? Then to-infinitive is very likely.",
    "Is it an activity in general, a memory from the past, or a habit you are used to? Then gerund is very likely.",
    "Do you have a modal verb, had better, would rather, or make? Then use the bare infinitive.",
    "Is the verb one of the special meaning-change verbs? Then the form changes the meaning, not just the grammar."
  ]);
  await pause();
}

async function mainMenu() {
  while (true) {
    title("Gerund vs Infinitive Terminal Coach");
    console.log("Pick a mode:");
    console.log("  1) Rule Map");
    console.log("  2) Contrast Lab");
    console.log("  3) Pattern Drill");
    console.log("  4) Exam Mission");
    console.log("  5) Quick Coach");
    console.log("  6) Mini Cheat Sheet");
    console.log("  7) Exit");

    const choice = await ask("\nYour choice: ");

    if (choice === "1") {
      await runRuleMap();
    } else if (choice === "2") {
      await runContrastLab();
    } else if (choice === "3") {
      await runPatternDrill();
    } else if (choice === "4") {
      await runMission();
    } else if (choice === "5") {
      await runQuickCoach();
    } else if (choice === "6") {
      cheatSheet();
      await pause();
    } else if (choice === "7" || normalize(choice) === "q") {
      break;
    } else {
      console.log("\nPlease choose a number from 1 to 7.");
      await pause();
    }
  }
}

async function start() {
  title("Welcome");
  console.log("This coach teaches the high-value patterns for gerund, to-infinitive and bare infinitive.");
  console.log("Best order if you are revising fast: 1 -> 2 -> 4 -> 6.");
  console.log("You can quit any drill early with q.\n");
  await mainMenu();
  console.log("\nGood luck for English tomorrow.");
  rl.close();
}

start().catch((error) => {
  console.error(error);
  rl.close();
  process.exitCode = 1;
});
