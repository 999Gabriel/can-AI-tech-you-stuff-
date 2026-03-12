const storySteps = [
  {
    kicker: "Schritt 1",
    title: "DNA als geschuetztes Archiv",
    text: "Ein Gen ist ein Abschnitt der DNA. In einer menschlichen Zelle bleibt diese Information im Zellkern, weil die DNA langfristig und sicher gespeichert werden soll.",
    place: "Ort: Zellkern",
    enzyme: "Enzym: noch keines",
    direction: "Rolle: Speicher",
    facts: [
      "DNA ist meist doppelstraengig.",
      "Basenpaarung in der DNA: A-T und G-C.",
      "Ein Gen liefert die Bauanleitung fuer ein Protein oder eine funktionelle RNA."
    ]
  },
  {
    kicker: "Schritt 2",
    title: "Transkription schreibt das Gen ab",
    text: "Die RNA-Polymerase bindet am Promotor, oeffnet die DNA lokal und baut mit komplementaerer Basenpaarung eine Prae-mRNA auf.",
    place: "Ort: Zellkern",
    enzyme: "Enzym: RNA-Polymerase",
    direction: "Richtung: DNA 3'->5', RNA 5'->3'",
    facts: [
      "Der Promotor ist das Startsignal.",
      "Die TATA-Box hilft oft beim Auffinden der Startstelle.",
      "Die RNA entsteht immer in 5'->3' Richtung."
    ]
  },
  {
    kicker: "Schritt 3",
    title: "RNA-Prozessierung macht die Abschrift nutzbar",
    text: "Die erste Abschrift ist bei Eukaryoten noch keine fertige mRNA. Erst 5' Cap, Poly-A-Schwanz und Spleissen machen sie stabil und uebersetzbar.",
    place: "Ort: Zellkern",
    enzyme: "Enzym: mehrere Prozessierungskomplexe",
    direction: "Rolle: Veredeln",
    facts: [
      "Prae-mRNA ist die Rohfassung.",
      "Spleissen entfernt nicht codierende Abschnitte.",
      "AAUAAA ist vor allem ein Signal fuer die Prozessierung."
    ]
  },
  {
    kicker: "Schritt 4",
    title: "Translation liest die mRNA am Ribosom",
    text: "Die mRNA verlaesst den Zellkern und wird im Cytoplasma am Ribosom gelesen. Je drei Basen bilden ein Codon und stehen fuer eine Aminosaeure oder ein Stoppsignal.",
    place: "Ort: Cytoplasma",
    enzyme: "Maschinerie: Ribosom und tRNA",
    direction: "Richtung: mRNA wird Codon fuer Codon gelesen",
    facts: [
      "Das Ribosom baut eine Aminosaeurekette auf.",
      "Startcodon ist meist AUG.",
      "Codons geben die Reihenfolge der Aminosaeuren vor."
    ]
  },
  {
    kicker: "Schritt 5",
    title: "Aus der Kette wird ein funktionsfaehiges Protein",
    text: "Die Polypeptidkette faltet sich zu einem Protein. Erst dann kann sie ihre Aufgabe uebernehmen, zum Beispiel als Enzym, Transporter oder Signalprotein.",
    place: "Ort: Cytoplasma oder weitere Zellbereiche",
    enzyme: "Hilfen: Faltung und Modifikation",
    direction: "Ergebnis: Struktur wird Funktion",
    facts: [
      "Protein ist nicht nur eine Kette, sondern eine gefaltete Struktur.",
      "Die Aminosaeurereihenfolge bestimmt die Faltung.",
      "Damit endet der Weg vom Gen zur Funktion."
    ]
  },
  {
    kicker: "Schritt 6",
    title: "Retroviren drehen den Start um",
    text: "Bei Retroviren liegt die Erbinformation zuerst als RNA vor. Die reverse Transkriptase schreibt diese RNA in DNA um, bevor die Wirtszelle weitere RNA und Proteine produziert.",
    place: "Ort: Wirtszelle",
    enzyme: "Enzym: reverse Transkriptase",
    direction: "Besonderheit: RNA -> DNA",
    facts: [
      "Das ist eine Ausnahme zum Normalfall DNA -> RNA -> Protein.",
      "Die virale DNA kann in das Wirtsgenom eingebaut werden.",
      "Wichtig: Nicht DNA in DNA, sondern RNA in DNA."
    ]
  }
];

const phaseContent = {
  initiation: {
    title: "Initiation: Start am Promotor",
    text: "Die RNA-Polymerase bindet mit Hilfe von Transkriptionsfaktoren an den Promotor. Dort wird die DNA lokal geoeffnet und der Startkomplex entsteht.",
    bullets: [
      "Promotor = Startregion eines Gens.",
      "TATA-Box ist eine typische Erkennungssequenz vieler eukaryotischer Gene.",
      "Noch wird nur vorbereitet, nicht in voller Laenge abgeschrieben."
    ]
  },
  elongation: {
    title: "Elongation: Die RNA-Kette waechst",
    text: "Jetzt wandert die RNA-Polymerase entlang des Matrizenstrangs. Hinter ihr loest sich die neue RNA von der DNA, waehrend die DNA wieder zusammenschliesst.",
    bullets: [
      "Der Matrizenstrang wird 3'->5' gelesen.",
      "Die RNA wird 5'->3' aufgebaut.",
      "Mehrere Polymerasen koennen nacheinander dasselbe Gen ablesen."
    ]
  },
  termination: {
    title: "Termination: Abschrift wird beendet",
    text: "Wenn das Ende der Transkription erreicht ist, wird das RNA-Produkt freigesetzt. Bei Eukaryoten ist das Signal AAUAAA besonders fuer die weitere Prozessierung wichtig.",
    bullets: [
      "Die Polymerase loest sich von der DNA.",
      "Die Prae-mRNA wird fuer die weitere Bearbeitung uebergeben.",
      "AAUAAA ist kein pauschales universelles Stoppschild, sondern Teil der Prozessierungslogik."
    ]
  }
};

const directionChallenges = [
  {
    question: "Welcher Strang wird bei der Transkription direkt abgelesen?",
    options: ["Der DNA-Matrizenstrang", "Der codierende DNA-Strang", "Die fertige mRNA"],
    answer: 0,
    explanation: "Die RNA-Polymerase liest den Matrizenstrang. Der codierende Strang hat fast dieselbe Sequenz wie die RNA, nur mit T statt U."
  },
  {
    question: "In welche Richtung wird eine RNA neu aufgebaut?",
    options: ["3' -> 5'", "5' -> 3'", "Beides ist moeglich"],
    answer: 1,
    explanation: "Nukleotide koennen nur am 3'-Ende angehaengt werden. Deshalb verlaeuft die Synthese immer 5' -> 3'."
  },
  {
    question: "Wofuer steht der Promotor?",
    options: ["Fuer das Startsignal der Transkription", "Fuer das Ende der Translation", "Fuer die Faltung des Proteins"],
    answer: 0,
    explanation: "Am Promotor beginnt die RNA-Polymerase ihre Arbeit."
  },
  {
    question: "Was ist bei Eukaryoten die Rohfassung direkt nach der Transkription?",
    options: ["tRNA", "Prae-mRNA", "fertige Proteinkette"],
    answer: 1,
    explanation: "Erst nach Cap, Poly-A und Spleissen spricht man von reifer mRNA."
  }
];

const virusModes = {
  normal: {
    title: "Normalfall in einer Koerperzelle",
    text: "Das Gen liegt auf DNA. Zuerst entsteht RNA durch Transkription, danach wird am Ribosom ein Protein gebildet.",
    points: [
      "Standardfluss: DNA -> RNA -> Protein",
      "DNA bleibt im Zellkern.",
      "mRNA transportiert die Information zum Ribosom."
    ],
    arrows: ["->", "->"],
    labels: ["DNA", "RNA", "Protein"]
  },
  rna: {
    title: "RNA-Virus: Erbinformation liegt direkt als RNA vor",
    text: "Manche Viren nutzen RNA statt DNA als Erbmaterial. Diese RNA kann von der Wirtszelle direkt oder nach Zwischenschritten genutzt werden, um Virusproteine herzustellen.",
    points: [
      "Nicht alle genetischen Informationen liegen in Form von DNA vor.",
      "SARS-Coronaviren besitzen RNA als Genom.",
      "Die Information startet hier nicht mit einer viralen DNA."
    ],
    arrows: ["->", "->"],
    labels: ["Virus-RNA", "mRNA/virale RNA", "Protein"]
  },
  retro: {
    title: "Retrovirus: erst RNA, dann DNA",
    text: "Retroviren sind besonders, weil sie den Informationsfluss am Anfang umdrehen. Die reverse Transkriptase macht aus viraler RNA zuerst DNA.",
    points: [
      "Besonderheit: RNA -> DNA",
      "Danach kann die Wirtszelle wieder RNA und Proteine herstellen.",
      "Genau dieser Umweg ist der zentrale Sonderfall."
    ],
    arrows: ["=>", "->"],
    labels: ["Virus-RNA", "DNA", "Protein"]
  }
};

const quizQuestions = [
  {
    question: "Warum braucht die Zelle mRNA als Zwischenschritt?",
    options: [
      "Weil die DNA als geschuetztes Archiv im Zellkern bleibt",
      "Weil Proteine direkt aus DNA-Basen bestehen",
      "Weil Ribosomen nur DNA lesen koennen"
    ],
    answer: 0,
    explanation: "Die mRNA ist die Arbeitskopie. Sie bringt die Information vom Zellkern zum Ribosom."
  },
  {
    question: "Welche Basenpaarung gilt in RNA?",
    options: ["A-U und G-C", "A-T und G-C", "A-C und G-U"],
    answer: 0,
    explanation: "In RNA ersetzt Uracil das Thymin."
  },
  {
    question: "Welcher Schritt gehoert zur RNA-Prozessierung?",
    options: ["Spleissen", "DNA-Replikation", "Protein-Faltung"],
    answer: 0,
    explanation: "Spleissen entfernt bestimmte Abschnitte der Prae-mRNA."
  },
  {
    question: "Welche Aussage zu AAUAAA ist am saubersten?",
    options: [
      "Es ist besonders wichtig fuer die Prozessierung der eukaryotischen Prae-mRNA",
      "Es ist das einzige universelle Stoppsignal jeder Transkription",
      "Es codiert immer fuer Methionin"
    ],
    answer: 0,
    explanation: "AAUAAA wird oft vereinfacht dargestellt, ist aber vor allem mit der Prozessierung verknuepft."
  },
  {
    question: "Was ist der richtige Sonderfall bei Retroviren?",
    options: [
      "Virale RNA wird durch reverse Transkriptase in DNA umgeschrieben",
      "Virale DNA wird in RNA zuruetranskribiert",
      "Proteine werden direkt in DNA umgewandelt"
    ],
    answer: 0,
    explanation: "Genau hier wird der normale Startfluss umgedreht."
  }
];

const codonTable = {
  UUU: "Phe", UUC: "Phe", UUA: "Leu", UUG: "Leu",
  UCU: "Ser", UCC: "Ser", UCA: "Ser", UCG: "Ser",
  UAU: "Tyr", UAC: "Tyr", UAA: "Stop", UAG: "Stop",
  UGU: "Cys", UGC: "Cys", UGA: "Stop", UGG: "Trp",
  CUU: "Leu", CUC: "Leu", CUA: "Leu", CUG: "Leu",
  CCU: "Pro", CCC: "Pro", CCA: "Pro", CCG: "Pro",
  CAU: "His", CAC: "His", CAA: "Gln", CAG: "Gln",
  CGU: "Arg", CGC: "Arg", CGA: "Arg", CGG: "Arg",
  AUU: "Ile", AUC: "Ile", AUA: "Ile", AUG: "Met",
  ACU: "Thr", ACC: "Thr", ACA: "Thr", ACG: "Thr",
  AAU: "Asn", AAC: "Asn", AAA: "Lys", AAG: "Lys",
  AGU: "Ser", AGC: "Ser", AGA: "Arg", AGG: "Arg",
  GUU: "Val", GUC: "Val", GUA: "Val", GUG: "Val",
  GCU: "Ala", GCC: "Ala", GCA: "Ala", GCG: "Ala",
  GAU: "Asp", GAC: "Asp", GAA: "Glu", GAG: "Glu",
  GGU: "Gly", GGC: "Gly", GGA: "Gly", GGG: "Gly"
};

const cellStage = document.getElementById("cell-stage");
const storyButtons = [...document.querySelectorAll(".story-step")];
const stepKicker = document.getElementById("step-kicker");
const stepTitle = document.getElementById("step-title");
const stepText = document.getElementById("step-text");
const conceptPlace = document.getElementById("concept-place");
const conceptEnzyme = document.getElementById("concept-enzyme");
const conceptDirection = document.getElementById("concept-direction");
const storyFacts = document.getElementById("story-facts");
const prevStep = document.getElementById("prev-step");
const nextStep = document.getElementById("next-step");

const dnaInput = document.getElementById("dna-input");
const rnaOutput = document.getElementById("rna-output");
const codonOutput = document.getElementById("codon-output");
const proteinOutput = document.getElementById("protein-output");

const challengeQuestion = document.getElementById("challenge-question");
const challengeOptions = document.getElementById("challenge-options");
const challengeFeedback = document.getElementById("challenge-feedback");
const nextChallenge = document.getElementById("next-challenge");

const phaseTabs = [...document.querySelectorAll(".phase-tab")];
const phaseVisual = document.getElementById("phase-visual");
const phaseTitle = document.getElementById("phase-title");
const phaseText = document.getElementById("phase-text");
const phaseBullets = document.getElementById("phase-bullets");

const virusButtons = [...document.querySelectorAll(".virus-button")];
const virusVisual = document.getElementById("virus-visual");
const virusTitle = document.getElementById("virus-title");
const virusText = document.getElementById("virus-text");
const virusPoints = document.getElementById("virus-points");
const virusArrowA = document.getElementById("virus-arrow-a");
const virusArrowB = document.getElementById("virus-arrow-b");

const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const quizProgress = document.getElementById("quiz-progress");
const quizScore = document.getElementById("quiz-score");
const restartQuiz = document.getElementById("restart-quiz");

let currentStep = 0;
let currentChallenge = 0;
let currentQuiz = 0;
let score = 0;

function renderStoryStep(index) {
  currentStep = index;
  const step = storySteps[index];
  cellStage.dataset.scene = String(index);
  stepKicker.textContent = step.kicker;
  stepTitle.textContent = step.title;
  stepText.textContent = step.text;
  conceptPlace.textContent = step.place;
  conceptEnzyme.textContent = step.enzyme;
  conceptDirection.textContent = step.direction;
  storyFacts.innerHTML = "";
  step.facts.forEach((fact) => {
    const item = document.createElement("div");
    item.className = "fact-chip";
    item.textContent = fact;
    storyFacts.appendChild(item);
  });
  storyButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.step) === index);
  });
  prevStep.disabled = index === 0;
  nextStep.disabled = index === storySteps.length - 1;
}

function sanitizeSequence(value) {
  return value.toUpperCase().replace(/[^ATGC]/g, "");
}

function dnaToRna(templateStrand) {
  const map = { A: "U", T: "A", G: "C", C: "G" };
  return [...templateStrand].map((base) => map[base] || "").join("");
}

function chunkString(value, size) {
  const chunks = [];
  for (let i = 0; i < value.length; i += size) {
    chunks.push(value.slice(i, i + size));
  }
  return chunks;
}

function translateRna(rna) {
  const codons = chunkString(rna, 3).filter((item) => item.length === 3);
  const acids = [];
  for (const codon of codons) {
    const amino = codonTable[codon] || "?";
    acids.push(amino);
    if (amino === "Stop") {
      break;
    }
  }
  return { codons, acids };
}

function renderSequenceLab() {
  const clean = sanitizeSequence(dnaInput.value);
  const rna = dnaToRna(clean);
  const { codons, acids } = translateRna(rna);
  dnaInput.value = clean;
  rnaOutput.textContent = rna || "Noch keine gueltige DNA-Sequenz";
  codonOutput.innerHTML = "";

  if (!codons.length) {
    const token = document.createElement("span");
    token.className = "token";
    token.textContent = "Bitte mindestens 3 Basen eingeben";
    codonOutput.appendChild(token);
    proteinOutput.textContent = "Noch keine Protein-Vorschau";
    return;
  }

  codons.forEach((codon) => {
    const token = document.createElement("span");
    token.className = "token";
    token.textContent = codon;
    codonOutput.appendChild(token);
  });

  proteinOutput.textContent = acids.join(" - ");
}

function renderChallenge(index) {
  currentChallenge = index;
  const item = directionChallenges[index];
  challengeQuestion.textContent = item.question;
  challengeOptions.innerHTML = "";
  challengeFeedback.textContent = "";
  item.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "challenge-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      [...challengeOptions.children].forEach((child) => {
        child.disabled = true;
      });
      const correct = optionIndex === item.answer;
      button.classList.add(correct ? "correct" : "wrong");
      if (!correct) {
        challengeOptions.children[item.answer].classList.add("correct");
      }
      challengeFeedback.textContent = item.explanation;
    });
    challengeOptions.appendChild(button);
  });
}

function renderPhase(phaseKey) {
  const phase = phaseContent[phaseKey];
  phaseVisual.dataset.phase = phaseKey;
  phaseTitle.textContent = phase.title;
  phaseText.textContent = phase.text;
  phaseBullets.innerHTML = "";
  phase.bullets.forEach((bullet) => {
    const item = document.createElement("div");
    item.className = "bullet-item";
    item.textContent = bullet;
    phaseBullets.appendChild(item);
  });
  phaseTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.phase === phaseKey);
  });
}

function renderVirus(modeKey) {
  const mode = virusModes[modeKey];
  const pills = [...virusVisual.querySelectorAll(".flow-pill")];
  pills.forEach((pill, index) => {
    pill.textContent = mode.labels[index];
  });
  virusArrowA.textContent = mode.arrows[0];
  virusArrowB.textContent = mode.arrows[1];
  virusVisual.dataset.mode = modeKey;
  virusTitle.textContent = mode.title;
  virusText.textContent = mode.text;
  virusPoints.innerHTML = "";
  mode.points.forEach((point) => {
    const item = document.createElement("div");
    item.className = "bullet-item";
    item.textContent = point;
    virusPoints.appendChild(item);
  });
  virusButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === modeKey);
  });
}

function renderQuiz(index) {
  const question = quizQuestions[index];
  quizQuestion.textContent = question.question;
  quizFeedback.textContent = "";
  quizProgress.textContent = `Frage ${index + 1} von ${quizQuestions.length}`;
  quizScore.textContent = `Punkte: ${score}`;
  quizOptions.innerHTML = "";
  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      const alreadyAnswered = [...quizOptions.children].some((child) => child.disabled);
      if (alreadyAnswered) {
        return;
      }
      [...quizOptions.children].forEach((child) => {
        child.disabled = true;
      });
      const isCorrect = optionIndex === question.answer;
      if (isCorrect) {
        score += 1;
      }
      button.classList.add(isCorrect ? "correct" : "wrong");
      if (!isCorrect) {
        quizOptions.children[question.answer].classList.add("correct");
      }
      quizFeedback.textContent = question.explanation;
      quizScore.textContent = `Punkte: ${score}`;

      window.setTimeout(() => {
        if (currentQuiz < quizQuestions.length - 1) {
          currentQuiz += 1;
          renderQuiz(currentQuiz);
        } else {
          quizQuestion.textContent = `Fertig. Du hast ${score} von ${quizQuestions.length} Punkten erreicht.`;
          quizOptions.innerHTML = "";
          quizFeedback.textContent = "Wenn du unter 5 liegst, klick die Story oben noch einmal gezielt Schritt fuer Schritt durch.";
          quizProgress.textContent = "Wiederholung abgeschlossen";
          quizScore.textContent = `Punkte: ${score}`;
        }
      }, 1600);
    });
    quizOptions.appendChild(button);
  });
}

function resetQuiz() {
  currentQuiz = 0;
  score = 0;
  renderQuiz(currentQuiz);
}

storyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderStoryStep(Number(button.dataset.step));
  });
});

prevStep.addEventListener("click", () => {
  if (currentStep > 0) {
    renderStoryStep(currentStep - 1);
  }
});

nextStep.addEventListener("click", () => {
  if (currentStep < storySteps.length - 1) {
    renderStoryStep(currentStep + 1);
  }
});

dnaInput.addEventListener("input", renderSequenceLab);

nextChallenge.addEventListener("click", () => {
  renderChallenge((currentChallenge + 1) % directionChallenges.length);
});

phaseTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderPhase(tab.dataset.phase);
  });
});

virusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderVirus(button.dataset.mode);
  });
});

document.getElementById("start-story").addEventListener("click", () => {
  document.getElementById("story-board").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("jump-quiz").addEventListener("click", () => {
  document.getElementById("review-card").scrollIntoView({ behavior: "smooth", block: "start" });
});

restartQuiz.addEventListener("click", resetQuiz);

renderStoryStep(0);
renderSequenceLab();
renderChallenge(0);
renderPhase("initiation");
renderVirus("normal");
resetQuiz();
