const $ = (id) => document.getElementById(id);

const materialContent = {
  conductor: {
    title: "Leiter",
    copy:
      "Bei Leitern stehen leicht bewegliche Elektronen zur Verfuegung. Im Bandbild sind zugaengliche Zustaende praktisch ohne relevante Luecke vorhanden.",
    summary: "Valenz- und Leitungsband praktisch ueberlappend",
    conductivity: (temp) => `${Math.max(70, 92 - temp * 0.15).toFixed(0)} % hoch`
  },
  semiconductor: {
    title: "Halbleiter",
    copy:
      "Halbleiter besitzen eine kleine Bandluecke. Temperatur und Dotierung veraendern die Leitfaehigkeit stark.",
    summary: "kleine Bandluecke, thermisch und durch Dotierung steuerbar",
    conductivity: (temp) => `${Math.min(100, 8 + temp * 0.9).toFixed(0)} % steigend`
  },
  insulator: {
    title: "Isolator",
    copy:
      "Isolatoren haben eine grosse Bandluecke. Freie Ladungstraeger fehlen, bis Felder so gross werden, dass Durchschlag auftritt.",
    summary: "grosse Bandluecke, Leitung erst bei extremer Feldstaerke",
    conductivity: () => "nahe 0 %"
  }
};

const dopingContent = {
  intrinsic: {
    title: "Reiner Halbleiter",
    copy: "Elektronen und Loecher entstehen paarweise. Keine Sorte dominiert deutlich.",
    majority: "keine Dominanz"
  },
  n: {
    title: "n-Dotierung",
    copy: "5. Hauptgruppe -> zusaetzliche freie Elektronen. Elektronen sind Mehrheitstraeger.",
    majority: "Elektronen"
  },
  p: {
    title: "p-Dotierung",
    copy: "3. Hauptgruppe -> Elektronenmangelstellen. Loecher sind Mehrheitstraeger.",
    majority: "Loecher"
  }
};

const challengeData = {
  led: {
    title: "Baue eine sichere 5-V-LED-Schaltung",
    copy:
      "Setze Schalter, Vorwiderstand und LED in den seriellen Pfad. Danach schliesse den Schalter und pruefe, ob der LED-Strom sicher begrenzt ist.",
    boardId: "board-led",
    control: "led",
    slots: {
      switch: "switch",
      series: "resistor",
      load: "led"
    }
  },
  coil: {
    title: "Schuetze eine DC-Spule beim Abschalten",
    copy:
      "Baue Schalter, Spule und eine korrekt orientierte Freilaufdiode auf. Der schwierige Fall ist nicht das Einschalten, sondern das Abschalten.",
    boardId: "board-coil",
    control: "coil",
    slots: {
      switch: "switch",
      load: "coil",
      parallel: "diode"
    }
  },
  pullup: {
    title: "Stabilisiere einen Digitaleingang mit Pull-up",
    copy:
      "Lege einen Widerstand an VCC und einen Taster nach GND. Im offenen Zustand muss der Eingang stabil HIGH sein und beim Druecken LOW werden.",
    boardId: "board-pullup",
    control: "pullup",
    slots: {
      top: "resistor",
      bottom: "pushbutton"
    }
  }
};

const slotConfig = {
  led: {
    switch: $("slot-led-switch"),
    series: $("slot-led-series"),
    load: $("slot-led-load")
  },
  coil: {
    switch: $("slot-coil-switch"),
    load: $("slot-coil-load"),
    parallel: $("slot-coil-parallel")
  },
  pullup: {
    top: $("slot-pullup-top"),
    bottom: $("slot-pullup-bottom")
  }
};

const wireGroups = {
  led: ["led-wire-top-left", "led-wire-top-mid", "led-wire-top-right", "led-wire-down-right", "led-wire-bottom"],
  coilMain: ["coil-wire-top-left", "coil-wire-top-mid", "coil-wire-top-right", "coil-wire-right", "coil-wire-bottom"],
  coilBranch: ["coil-wire-branch-top", "coil-wire-branch-bottom"],
  pullupTop: ["pullup-wire-top", "pullup-wire-node"],
  pullupBottom: ["pullup-wire-bottom", "pullup-wire-node"]
};

const topologyModes = {
  comparator: {
    title: "Vergleicher ohne Gegenkopplung",
    copy:
      "Schon kleinste Differenzen zwischen Eingang und Referenz schieben den Ausgang in die Saettigung. Der lineare Bereich ist praktisch winzig.",
    evaluate(a, b) {
      const out = a >= b ? 12 : -12;
      return {
        out,
        formula: `Wenn Vin ${a >= b ? ">=" : "<"} Vref, dann Uout -> ${out > 0 ? "+" : "-"}Saettigung`,
        extra: "Typischer Einsatz: Schaltschwelle, Grenzwertdetektion, einfacher Reglervergleich."
      };
    },
    draw(ctx, width, height, a, b) {
      drawAxes(ctx, width, height, "Vin", "Uout");
      const scaleX = (v) => 40 + ((v + 10) / 20) * (width - 60);
      const scaleY = (v) => height - 30 - ((v + 12) / 24) * (height - 50);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(40, scaleY(-12));
      ctx.lineTo(scaleX(b), scaleY(-12));
      ctx.lineTo(scaleX(b), scaleY(12));
      ctx.lineTo(width - 20, scaleY(12));
      ctx.stroke();
      drawPoint(ctx, scaleX(a), scaleY(a >= b ? 12 : -12));
    }
  },
  inverting: {
    title: "Invertierender Verstaerker",
    copy:
      "Mit Gegenkopplung stellt sich am invertierenden Eingang ein virtuelles Potential ein. Das Widerstandsverhaeltnis bestimmt die Verstaerkung.",
    evaluate(a, _b, r1, r2) {
      const gain = -(r2 / r1);
      const ideal = gain * a;
      const out = clamp(ideal, -12, 12);
      return {
        out,
        formula: `Uout = -(R2/R1) · Uin = ${gain.toFixed(2)} · ${a.toFixed(2)} V = ${ideal.toFixed(2)} V`,
        extra: Math.abs(ideal) > 12 ? "Der ideale Ausgang waere ausserhalb der Versorgung und wird deshalb begrenzt." : "Minuszeichen bedeutet Phaseninversion."
      };
    },
    draw(ctx, width, height, a, _b, r1, r2) {
      drawAxes(ctx, width, height, "Uin", "Uout");
      const gain = -(r2 / r1);
      drawTransferLine(ctx, width, height, (x) => clamp(gain * x, -12, 12), a);
    }
  },
  noninverting: {
    title: "Nichtinvertierender Verstaerker",
    copy:
      "Der Eingang liegt am nichtinvertierenden Eingang. Die Verstaerkung ist positiv und ergibt sich zu 1 + R2/R1.",
    evaluate(a, _b, r1, r2) {
      const gain = 1 + r2 / r1;
      const ideal = gain * a;
      const out = clamp(ideal, -12, 12);
      return {
        out,
        formula: `Uout = (1 + R2/R1) · Uin = ${gain.toFixed(2)} · ${a.toFixed(2)} V = ${ideal.toFixed(2)} V`,
        extra: "Kein Minuszeichen: Das Signal bleibt phasengleich."
      };
    },
    draw(ctx, width, height, a, _b, r1, r2) {
      drawAxes(ctx, width, height, "Uin", "Uout");
      const gain = 1 + r2 / r1;
      drawTransferLine(ctx, width, height, (x) => clamp(gain * x, -12, 12), a);
    }
  },
  follower: {
    title: "Spannungsfolger / Impedanzwandler",
    copy:
      "Die Spannungsverstaerkung ist etwa 1. Der eigentliche Nutzen ist die Entkopplung: hohe Eingangsimpedanz, niedriger Ausgangswiderstand.",
    evaluate(a, b) {
      const out = clamp(a, -12, 12);
      const sourceResistance = Math.max(1, b + 11);
      const sourceCurrentmA = Math.abs(a / (sourceResistance * 1000)) * 1000;
      return {
        out,
        formula: `Uout ≈ Uin = ${out.toFixed(2)} V`,
        extra: `Beispielhafte Sensorbelastung bei ${sourceResistance.toFixed(1)} kOhm Quellwiderstand: nur ${sourceCurrentmA.toFixed(3)} mA.`
      };
    },
    draw(ctx, width, height, a) {
      drawAxes(ctx, width, height, "Uin", "Uout");
      drawTransferLine(ctx, width, height, (x) => clamp(x, -12, 12), a);
    }
  },
  difference: {
    title: "Differenzverstaerker",
    copy:
      "Der Ausgang bildet die Differenz zweier Eingangssignale, skaliert mit dem Widerstandsverhaeltnis. In der Praxis helfen oft vorgeschaltete Follower gegen hohe Quellenimpedanzen.",
    evaluate(a, b, r1, r2) {
      const gain = r2 / r1;
      const ideal = gain * (b - a);
      const out = clamp(ideal, -12, 12);
      return {
        out,
        formula: `Uout = (R2/R1) · (V2 - V1) = ${gain.toFixed(2)} · (${b.toFixed(2)} - ${a.toFixed(2)}) = ${ideal.toFixed(2)} V`,
        extra: "Diese Topologie ist empfindlicher gegen Quellenbelastung als ein reiner Follower."
      };
    },
    draw(ctx, width, height, a, b, r1, r2) {
      drawAxes(ctx, width, height, "Signale", "Spannung");
      const gain = r2 / r1;
      const out = clamp(gain * (b - a), -12, 12);
      const scaleY = (v) => height - 30 - ((v + 12) / 24) * (height - 50);
      const bars = [
        { x: 90, value: a, label: "V1" },
        { x: 190, value: b, label: "V2" },
        { x: 290, value: out, label: "Uout" }
      ];
      bars.forEach((bar) => {
        ctx.fillStyle = "#121212";
        ctx.fillRect(bar.x, scaleY(Math.max(bar.value, 0)), 52, Math.abs(scaleY(bar.value) - scaleY(0)));
        ctx.fillStyle = "rgba(18,18,18,0.72)";
        ctx.fillText(bar.label, bar.x + 6, height - 8);
      });
    }
  }
};

const dynamicModes = {
  schmitt: {
    title: "Schmitt-Trigger mit Hysterese",
    copy:
      "Mitkopplung erzeugt zwei Schaltschwellen. Das verhindert Flackern, wenn das Eingangssignal verrauscht oder langsam den Schwellwert durchlaeuft.",
    render(amplitude, frequency, r, c) {
      const hysteresis = c / 18;
      const center = r / 20 - 2.5;
      const upper = center + hysteresis / 2;
      const lower = center - hysteresis / 2;
      const input = [];
      const output = [];
      let state = -12;
      for (let i = 0; i < 240; i += 1) {
        const t = i / 239;
        const value = center + Math.sin(t * Math.PI * 2 * frequency / 2) * amplitude + Math.sin(t * 55) * 0.15;
        input.push(value);
        if (value >= upper) state = 12;
        if (value <= lower) state = -12;
        output.push(state);
      }
      return {
        formula: `untere Schwelle ${lower.toFixed(2)} V, obere Schwelle ${upper.toFixed(2)} V`,
        extra: "Im Zwischenbereich haelt das System den letzten Zustand.",
        state: output.at(-1),
        input,
        output,
        thresholds: [lower, upper]
      };
    }
  },
  integrator: {
    title: "Integrator",
    copy:
      "Bei konstantem Eingangsstrom laedt oder entlaedt sich der Rueckkopplungskondensator linear. Ein Rechtecksignal wird dadurch zu einer Rampe.",
    render(amplitude, frequency, r, c) {
      const input = [];
      const output = [];
      let y = 0;
      const rc = (r / 10) * (c / 10);
      for (let i = 0; i < 240; i += 1) {
        const t = i / 239;
        const square = Math.sin(t * Math.PI * 2 * frequency / 2) >= 0 ? amplitude : -amplitude;
        input.push(square);
        y += (-square / Math.max(rc, 0.4)) * 0.05;
        y = clamp(y, -11, 11);
        output.push(y);
      }
      return {
        formula: `Uout proportional zu -1/(R·C) · Integral(Uin dt)`,
        extra: "Mehr Eingangsamplitude oder kleinere RC-Zeitkonstante -> steilere Rampe.",
        state: output.at(-1),
        input,
        output
      };
    }
  },
  peak: {
    title: "Peak-Detektor",
    copy:
      "Eine Diode laedt den Kondensator auf den bisherigen Spitzenwert. Ohne Puffer und ohne ideale Diode entstehen Diodenabfall und Entladungsfehler.",
    render(amplitude, frequency, r, c) {
      const input = [];
      const output = [];
      let peak = 0;
      const leak = 1 - 1 / (150 + r + c);
      for (let i = 0; i < 240; i += 1) {
        const t = i / 239;
        const value = amplitude * Math.sin(t * Math.PI * 2 * frequency / 2) + amplitude * 0.3;
        input.push(value);
        peak = Math.max(peak * leak, value - 0.6);
        output.push(Math.max(0, peak));
      }
      return {
        formula: "Uhold folgt dem bisherigen Hoechstwert minus Diodenabfall",
        extra: "Eine Last am Ausgang entlaedt den Kondensator und verfaelscht den Messwert.",
        state: output.at(-1),
        input,
        output
      };
    }
  }
};

const quizData = [
  {
    question: "Warum braucht eine LED meist einen Vorwiderstand?",
    options: [
      "Weil ihre Kennlinie stark nichtlinear ist und kleine Spannungsanstiege grosse Stromanstiege ausloesen koennen",
      "Weil Widerstaende die LED heller machen",
      "Weil die LED sonst ihre Farbe aendert"
    ],
    answer: 0,
    explanation: "LEDs begrenzen den Strom nicht verlässlich selbst. Ohne Strombegrenzung koennen sie thermisch ueberlastet werden."
  },
  {
    question: "Was ist der Kern der Gegenkopplung beim linearen OPV-Betrieb?",
    options: [
      "Der OPV regelt so, dass U+ und U- nahezu gleich werden",
      "Der OPV erzeugt immer automatisch Hysterese",
      "Der OPV zieht grosse Eingangsstroeme"
    ],
    answer: 0,
    explanation: "Das ist genau die Grundlage fuer virtuelle Masse und die Standard-Rechenregeln."
  },
  {
    question: "Welche Aussage zu Freilaufdioden ist richtig?",
    options: [
      "Sie schaffen beim Abschalten einer Spule einen Strompfad und begrenzen die Spannungsspitze",
      "Sie erhoehen die Versorgungsspannung",
      "Sie machen eine Spule ohmsch"
    ],
    answer: 0,
    explanation: "Die gespeicherte magnetische Energie kann kontrolliert abgebaut werden, statt eine hohe Abschaltspannung zu erzeugen."
  },
  {
    question: "Was bleibt bei einem von der Quelle getrennten Kondensator konstant?",
    options: ["Q", "U", "C"],
    answer: 0,
    explanation: "Ohne Anschluss kann keine Ladung abfliessen oder nachfliessen, daher bleibt Q konstant."
  },
  {
    question: "Was ist der Unterschied zwischen Steuerung und Regelung?",
    options: [
      "Regelung besitzt Rueckfuehrung des Istwertes, Steuerung nicht",
      "Steuerung arbeitet immer digital, Regelung immer analog",
      "Regelung braucht nie Sensoren"
    ],
    answer: 0,
    explanation: "Rueckmeldung ist die entscheidende Unterscheidung."
  },
  {
    question: "Was beschreibt die Bandluecke bei Halbleitern besonders gut?",
    options: [
      "Warum Temperatur und Dotierung die Leitfaehigkeit stark beeinflussen",
      "Warum Halbleiter nur mit Wechselstrom funktionieren",
      "Warum alle Halbleiter isolieren"
    ],
    answer: 0,
    explanation: "Gerade die kleine Bandluecke macht Halbleiter steuerbar."
  },
  {
    question: "Warum sind Pull-up-Widerstaende notwendig?",
    options: [
      "Weil hochohmige Eingänge sonst floaten und stoeranfaellig unbestimmte Pegel annehmen",
      "Weil sie den Mikrocontroller kuehlen",
      "Weil Taster nur mit Wechselstrom arbeiten"
    ],
    answer: 0,
    explanation: "Der Pull-up erzwingt einen definierten Zustand im offenen Fall."
  }
];

let activeChallenge = "led";
let selectedComponent = "switch";
let challengeSolved = { led: false, coil: false, pullup: false };
const builderState = {
  led: {
    slots: { switch: null, series: null, load: null },
    closed: false,
    resistance: 150
  },
  coil: {
    slots: { switch: null, load: null, parallel: null },
    powerOn: false,
    diodeOrientation: "flyback"
  },
  pullup: {
    slots: { top: null, bottom: null },
    pressed: false,
    resistance: 10
  }
};

let activeTopology = "comparator";
let activeDynamic = "schmitt";
let cycleIndex = 0;
let cycleTimer = null;
let activeMaterial = "conductor";
let activeDoping = "intrinsic";
let capacitorMode = "connected";
let frozenCharge = null;
let quizIndex = 0;
let quizScore = 0;

function fmt(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function engineering(value, unit = "") {
  const abs = Math.abs(value);
  if (abs >= 1) return `${value.toFixed(2)} ${unit}`.trim();
  if (abs >= 1e-3) return `${(value * 1e3).toFixed(2)} m${unit}`.trim();
  if (abs >= 1e-6) return `${(value * 1e6).toFixed(2)} u${unit}`.trim();
  if (abs >= 1e-9) return `${(value * 1e9).toFixed(2)} n${unit}`.trim();
  if (abs >= 1e-12) return `${(value * 1e12).toFixed(2)} p${unit}`.trim();
  return `${value.toExponential(2)} ${unit}`.trim();
}

function drawAxes(ctx, width, height, xLabel, yLabel) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 16);
  ctx.lineTo(40, height - 30);
  ctx.lineTo(width - 16, height - 30);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.font = "12px Avenir Next";
  ctx.fillText(yLabel, 10, 18);
  ctx.fillText(xLabel, width - 60, height - 10);
}

function drawPoint(ctx, x, y) {
  ctx.fillStyle = "#20724d";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTransferLine(ctx, width, height, fn, markX) {
  const scaleX = (v) => 40 + ((v + 10) / 20) * (width - 60);
  const scaleY = (v) => height - 30 - ((v + 12) / 24) * (height - 50);
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i <= 240; i += 1) {
    const xValue = -10 + (i / 240) * 20;
    const yValue = fn(xValue);
    const px = scaleX(xValue);
    const py = scaleY(yValue);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  drawPoint(ctx, scaleX(markX), scaleY(fn(markX)));
}

function drawWaveform(ctx, width, height, values, color, min, max) {
  const scaleY = (v) => height - 30 - ((v - min) / (max - min)) * (height - 50);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = 40 + index / (values.length - 1) * (width - 60);
    const y = scaleY(value);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function setupJumpButtons() {
  document.querySelectorAll(".jump-button").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      if (target) $(target).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function clearWireStates() {
  document.querySelectorAll(".wire").forEach((wire) => {
    wire.classList.remove("live", "warn");
  });
}

function clearSlotStates(challengeKey) {
  Object.values(slotConfig[challengeKey]).forEach((slot) => {
    slot.classList.remove("good", "bad");
  });
}

function componentLabel(component, challengeKey, slotKey) {
  if (!component) return slotConfig[challengeKey][slotKey].dataset.slot || "Slot";
  if (challengeKey === "led" && slotKey === "series" && component === "resistor") {
    return `${builderState.led.resistance} Ohm`;
  }
  if (challengeKey === "pullup" && slotKey === "top" && component === "resistor") {
    return `${builderState.pullup.resistance} k Pull-up`;
  }
  if (challengeKey === "coil" && slotKey === "parallel" && component === "diode") {
    return builderState.coil.diodeOrientation === "flyback" ? "Diode (Freilauf)" : "Diode (falsch)";
  }
  const labels = {
    switch: "Schalter",
    resistor: "Widerstand",
    led: "LED",
    coil: "Spule",
    diode: "Diode",
    pushbutton: "Taster"
  };
  return labels[component] || component;
}

function renderBuilderBoard() {
  document.querySelectorAll(".challenge-board").forEach((board) => {
    board.classList.toggle("active", board.id === challengeData[activeChallenge].boardId);
  });
  document.querySelectorAll(".challenge-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.challenge === activeChallenge);
  });
  document.querySelectorAll(".control-group").forEach((group) => {
    group.classList.toggle("active", group.dataset.control === challengeData[activeChallenge].control);
  });

  $("challenge-title").textContent = challengeData[activeChallenge].title;
  $("challenge-copy").textContent = challengeData[activeChallenge].copy;

  Object.entries(slotConfig).forEach(([challengeKey, slots]) => {
    Object.entries(slots).forEach(([slotKey, button]) => {
      const component = builderState[challengeKey].slots[slotKey];
      button.textContent = componentLabel(component, challengeKey, slotKey);
      button.classList.toggle("filled", Boolean(component));
      if (!component) button.classList.remove("good", "bad");
    });
  });
}

function setBuilderStatus(status, detail, a, b, c) {
  $("builder-status").textContent = status;
  $("builder-detail").textContent = detail;
  $("builder-metric-a").textContent = a;
  $("builder-metric-b").textContent = b;
  $("builder-metric-c").textContent = c;
  $("challenge-progress").textContent = `${Object.values(challengeSolved).filter(Boolean).length} / 3 Aufgaben korrekt`;
}

function markSlots(challengeKey, evaluation) {
  clearSlotStates(challengeKey);
  Object.entries(slotConfig[challengeKey]).forEach(([slotKey, slot]) => {
    const isGood = evaluation.goodSlots?.includes(slotKey);
    const isBad = evaluation.badSlots?.includes(slotKey);
    if (isGood) slot.classList.add("good");
    if (isBad) slot.classList.add("bad");
  });
}

function simulateLEDChallenge() {
  clearWireStates();
  const state = builderState.led;
  const evaluation = { goodSlots: [], badSlots: [] };
  const correct =
    state.slots.switch === "switch" &&
    state.slots.series === "resistor" &&
    state.slots.load === "led";
  if (state.slots.switch === "switch") evaluation.goodSlots.push("switch");
  else if (state.slots.switch) evaluation.badSlots.push("switch");
  if (state.slots.series === "resistor") evaluation.goodSlots.push("series");
  else if (state.slots.series) evaluation.badSlots.push("series");
  if (state.slots.load === "led") evaluation.goodSlots.push("load");
  else if (state.slots.load) evaluation.badSlots.push("load");

  markSlots("led", evaluation);

  if (!correct) {
    challengeSolved.led = false;
    setBuilderStatus(
      "Die Topologie stimmt noch nicht.",
      "Du brauchst einen geschlossenen Serienpfad aus Schalter, Vorwiderstand und LED.",
      `Strom: 0 mA`,
      `LED-Spannung: 2.2 V angenommen`,
      `Vorwiderstand: ${state.resistance} Ohm`
    );
    return;
  }

  const current = state.closed ? (5 - 2.2) / state.resistance : 0;
  if (state.closed) {
    wireGroups.led.forEach((id) => $(id).classList.add(current <= 0.025 && current >= 0.005 ? "live" : "warn"));
  }

  if (!state.closed) {
    challengeSolved.led = false;
    setBuilderStatus(
      "Topologie korrekt, aber der Schalter ist offen.",
      "Die Schaltung ist richtig aufgebaut. Schliesse jetzt den Schalter, damit Strom fliesst und du den Betriebspunkt beurteilen kannst.",
      `Strom: 0.00 mA`,
      `Vorwiderstand: ${state.resistance} Ohm`,
      "Bewertung: noch kein Betriebsfall"
    );
    return;
  }

  const currentmA = current * 1000;
  const safe = currentmA >= 5 && currentmA <= 25;
  challengeSolved.led = safe;
  setBuilderStatus(
    safe ? "Schaltung korrekt und sicher." : "Schaltung korrekt, aber der Strom ist unguenstig.",
    safe
      ? "Der Strom liegt im typischen sicheren Bereich fuer eine normale Anzeige-LED."
      : "Die Topologie stimmt, aber der Widerstand ist fuer 5 V und 2.2 V LED-Spannung zu klein oder zu gross gewaehlt.",
    `Strom: ${currentmA.toFixed(1)} mA`,
    `Spannung am Widerstand: ${(5 - 2.2).toFixed(2)} V`,
    `Leistung im Widerstand: ${(current * current * state.resistance).toFixed(3)} W`
  );
}

function simulateCoilChallenge() {
  clearWireStates();
  const state = builderState.coil;
  const evaluation = { goodSlots: [], badSlots: [] };
  if (state.slots.switch === "switch") evaluation.goodSlots.push("switch");
  else if (state.slots.switch) evaluation.badSlots.push("switch");
  if (state.slots.load === "coil") evaluation.goodSlots.push("load");
  else if (state.slots.load) evaluation.badSlots.push("load");
  if (state.slots.parallel === "diode") evaluation.goodSlots.push("parallel");
  else if (state.slots.parallel) evaluation.badSlots.push("parallel");
  markSlots("coil", evaluation);

  const hasMainPath = state.slots.switch === "switch" && state.slots.load === "coil";
  const hasDiode = state.slots.parallel === "diode";
  const correctOrientation = state.diodeOrientation === "flyback";

  if (!hasMainPath) {
    challengeSolved.coil = false;
    setBuilderStatus(
      "Die Grundschaltung stimmt noch nicht.",
      "Du brauchst mindestens Schalter und Spule im Lastkreis. Danach kommt die Schutzdiode parallel zur Spule.",
      "Strompfad: unvollstaendig",
      `Diodenlage: ${correctOrientation ? "Freilauf" : "falsch"}`,
      `Spule: ${state.powerOn ? "eingeschaltet" : "abgeschaltet"}`
    );
    return;
  }

  if (state.powerOn) {
    wireGroups.coilMain.forEach((id) => $(id).classList.add("live"));
    if (hasDiode && !correctOrientation) {
      wireGroups.coilBranch.forEach((id) => $(id).classList.add("warn"));
      challengeSolved.coil = false;
      setBuilderStatus(
        "Gefaehrliche Diodenlage im Einschaltfall.",
        "Die Diode liegt parallel zur Spule, aber in falscher Richtung. So wuerde sie die Versorgung im Einschaltmoment praktisch kurzschliessen.",
        "Spule: eingeschaltet",
        "Spitzenspannung: im Einschaltfall nicht das Problem",
        "Fehler: Diode muss im Normalbetrieb sperren"
      );
      return;
    }
    challengeSolved.coil = false;
    setBuilderStatus(
      hasDiode ? "Einschaltfall korrekt, pruefe jetzt den Abschaltfall." : "Spule laeuft, aber Schutz fehlt.",
      hasDiode
        ? "Im eingeschalteten Zustand sperrt die Freilaufdiode und stoert nicht. Schalte jetzt ab, um den Schutzfall zu pruefen."
        : "Ohne Diode sieht im Einschaltfall alles normal aus. Das Problem zeigt sich erst beim Abschalten.",
      "Spule: eingeschaltet",
      hasDiode ? `Diodenlage: ${correctOrientation ? "korrekt" : "falsch"}` : "Diode: fehlt",
      "Merksatz: Problemfall ist das Abschalten"
    );
    return;
  }

  if (hasDiode && correctOrientation) {
    wireGroups.coilBranch.forEach((id) => $(id).classList.add("live"));
    wireGroups.coilMain.forEach((id) => $(id).classList.add("live"));
    challengeSolved.coil = true;
    setBuilderStatus(
      "Schaltung korrekt und Schutz wirksam.",
      "Nach dem Abschalten fliesst der Strom weiter im Kreis durch Spule und Diode. Die Spannungsspitze bleibt niedrig.",
      "Abschaltspitze: klein, in der Naehe der Diodenspannung",
      "Strompfad: Spule -> Diode -> Spule",
      "Bewertung: Aufgabe geloest"
    );
  } else {
    wireGroups.coilMain.forEach((id) => $(id).classList.add("warn"));
    challengeSolved.coil = false;
    setBuilderStatus(
      "Abschaltfall gefaehrlich.",
      hasDiode
        ? "Eine Diode ist vorhanden, aber falsch orientiert. Sie bietet im Abschaltmoment keinen sicheren Umlaufpfad."
        : "Ohne Freilaufdiode erzwingt die Selbstinduktion eine hohe Spannungsspitze.",
      "Abschaltspitze: hoch, potentiell viele 10 bis 100 V",
      hasDiode ? `Diodenlage: ${correctOrientation ? "korrekt" : "falsch"}` : "Diode: fehlt",
      "Folge: Transistor- oder Mikrocontroller-Schaeden moeglich"
    );
  }
}

function simulatePullupChallenge() {
  clearWireStates();
  const state = builderState.pullup;
  const evaluation = { goodSlots: [], badSlots: [] };
  if (state.slots.top === "resistor") evaluation.goodSlots.push("top");
  else if (state.slots.top) evaluation.badSlots.push("top");
  if (state.slots.bottom === "pushbutton") evaluation.goodSlots.push("bottom");
  else if (state.slots.bottom) evaluation.badSlots.push("bottom");
  markSlots("pullup", evaluation);

  const correct = state.slots.top === "resistor" && state.slots.bottom === "pushbutton";
  if (!correct) {
    challengeSolved.pullup = false;
    setBuilderStatus(
      "Der Eingang ist noch nicht sauber beschaltet.",
      "Du brauchst einen Widerstand nach VCC und einen Taster nach GND. Sonst floatet der Eingang oder er laesst sich nicht sinnvoll schalten.",
      `Taster: ${state.pressed ? "gedrueckt" : "offen"}`,
      `Pull-up: ${state.resistance} kOhm`,
      "Pegel: unbestimmt"
    );
    return;
  }

  $("pullup-wire-top").classList.add("live");
  if (state.pressed) {
    $("pullup-wire-bottom").classList.add("live");
    $("pullup-wire-node").classList.add("live");
    setBuilderStatus(
      "Pull-up korrekt, Taster gedrueckt.",
      "Im offenen Zustand zieht der Widerstand den Eingang auf HIGH. Beim Druecken wird der Knoten nach GND gezogen und der Eingang wird LOW.",
      "Eingangspegel: LOW",
      `Pull-up-Strom: ${(5 / (state.resistance * 1000) * 1000).toFixed(3)} mA`,
      "Bewertung: Aufgabe geloest"
    );
  } else {
    $("pullup-wire-node").classList.add("live");
    setBuilderStatus(
      "Pull-up korrekt, Taster offen.",
      "Der Widerstand sorgt dafuer, dass der Eingang auch ohne Tastendruck einen definierten HIGH-Zustand hat.",
      "Eingangspegel: HIGH",
      `Pull-up-Strom: praktisch 0 mA im offenen Fall`,
      "Druecke den Taster, um den LOW-Fall zu sehen"
    );
  }
  challengeSolved.pullup = true;
}

function simulateBuilder() {
  if (activeChallenge === "led") simulateLEDChallenge();
  if (activeChallenge === "coil") simulateCoilChallenge();
  if (activeChallenge === "pullup") simulatePullupChallenge();
  $("challenge-progress").textContent = `${Object.values(challengeSolved).filter(Boolean).length} / 3 Aufgaben korrekt`;
}

function resetChallengeState(challengeKey) {
  if (challengeKey === "led") {
    builderState.led = { slots: { switch: null, series: null, load: null }, closed: false, resistance: 150 };
    $("builder-led-toggle").textContent = "Schalter schliessen";
    $("builder-led-resistance").value = "150";
  }
  if (challengeKey === "coil") {
    builderState.coil = { slots: { switch: null, load: null, parallel: null }, powerOn: false, diodeOrientation: "flyback" };
    $("builder-coil-toggle").textContent = "Spule einschalten";
    $("builder-diode-orientation").textContent = "Diodenlage: Freilauf";
  }
  if (challengeKey === "pullup") {
    builderState.pullup = { slots: { top: null, bottom: null }, pressed: false, resistance: 10 };
    $("builder-button-toggle").textContent = "Taster offen";
    $("builder-pullup-resistance").value = "10";
  }
  challengeSolved[challengeKey] = false;
  clearWireStates();
  renderBuilderBoard();
  setBuilderStatus(
    "Aufgabe zurueckgesetzt.",
    "Setze Bauteile in die Slots und starte die Simulation erneut.",
    "Messwert A: -",
    "Messwert B: -",
    "Messwert C: -"
  );
}

function bindBuilder() {
  document.querySelectorAll(".challenge-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeChallenge = button.dataset.challenge;
      renderBuilderBoard();
      clearWireStates();
      setBuilderStatus(
        "Neue Aufgabe geladen.",
        challengeData[activeChallenge].copy,
        "Messwert A: -",
        "Messwert B: -",
        "Messwert C: -"
      );
    });
  });

  document.querySelectorAll(".palette-item").forEach((button) => {
    button.addEventListener("click", () => {
      selectedComponent = button.dataset.component;
      document.querySelectorAll(".palette-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.component === selectedComponent);
      });
    });
  });

  Object.entries(slotConfig).forEach(([challengeKey, slots]) => {
    Object.entries(slots).forEach(([slotKey, button]) => {
      button.addEventListener("click", () => {
        if (selectedComponent === "clear") {
          builderState[challengeKey].slots[slotKey] = null;
        } else {
          builderState[challengeKey].slots[slotKey] = selectedComponent;
        }
        renderBuilderBoard();
      });
    });
  });

  $("builder-led-resistance").addEventListener("input", (event) => {
    builderState.led.resistance = Number(event.target.value);
    renderBuilderBoard();
  });
  $("builder-led-toggle").addEventListener("click", () => {
    builderState.led.closed = !builderState.led.closed;
    $("builder-led-toggle").textContent = builderState.led.closed ? "Schalter oeffnen" : "Schalter schliessen";
  });

  $("builder-coil-toggle").addEventListener("click", () => {
    builderState.coil.powerOn = !builderState.coil.powerOn;
    $("builder-coil-toggle").textContent = builderState.coil.powerOn ? "Spule abschalten" : "Spule einschalten";
  });
  $("builder-diode-orientation").addEventListener("click", () => {
    builderState.coil.diodeOrientation = builderState.coil.diodeOrientation === "flyback" ? "wrong" : "flyback";
    $("builder-diode-orientation").textContent =
      builderState.coil.diodeOrientation === "flyback" ? "Diodenlage: Freilauf" : "Diodenlage: falsch";
    renderBuilderBoard();
  });

  $("builder-pullup-resistance").addEventListener("input", (event) => {
    builderState.pullup.resistance = Number(event.target.value);
    renderBuilderBoard();
  });
  $("builder-button-toggle").addEventListener("click", () => {
    builderState.pullup.pressed = !builderState.pullup.pressed;
    $("builder-button-toggle").textContent = builderState.pullup.pressed ? "Taster gedrueckt" : "Taster offen";
  });

  $("builder-simulate").addEventListener("click", simulateBuilder);
  $("builder-reset").addEventListener("click", () => resetChallengeState(activeChallenge));
}

function drawTopology() {
  const a = Number($("opv-a").value);
  const b = Number($("opv-b").value);
  const r1 = Number($("opv-r1").value);
  const r2 = Number($("opv-r2").value);
  const mode = topologyModes[activeTopology];
  const result = mode.evaluate(a, b, r1, r2);

  $("opv-topology-title").textContent = mode.title;
  $("opv-topology-copy").textContent = mode.copy;
  $("opv-topology-formula").textContent = result.formula;
  $("opv-topology-output").textContent = `Uout = ${result.out >= 0 ? "+" : ""}${result.out.toFixed(2)} V`;
  $("opv-topology-extra").textContent = result.extra;
  $("opv-schematic-text").textContent =
    activeTopology === "difference"
      ? "Zwei Eingangsnetzwerke werden gegeneinander ausgewertet."
      : activeTopology === "follower"
        ? "Rueckkopplung direkt vom Ausgang auf den invertierenden Eingang."
        : "Widerstandsnetzwerk bestimmt die Rueckkopplung und damit den Arbeitspunkt.";

  const canvas = $("opv-topology-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  mode.draw(ctx, width, height, a, b, r1, r2);
}

function drawDynamic() {
  const amplitude = Number($("opv-dyn-amplitude").value);
  const frequency = Number($("opv-dyn-frequency").value);
  const r = Number($("opv-dyn-r").value);
  const c = Number($("opv-dyn-c").value);
  const mode = dynamicModes[activeDynamic];
  const result = mode.render(amplitude, frequency, r, c);

  $("opv-dynamic-title").textContent = mode.title;
  $("opv-dynamic-copy").textContent = mode.copy;
  $("opv-dynamic-formula").textContent = result.formula;
  $("opv-dynamic-output").textContent = `Momentaner Endzustand: ${result.state >= 0 ? "+" : ""}${Number(result.state).toFixed(2)} V`;
  $("opv-dynamic-extra").textContent = result.extra;

  const canvas = $("opv-dynamic-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawAxes(ctx, width, height, "Zeit", "Signal");
  let min = Math.min(...result.input, ...result.output, -12);
  let max = Math.max(...result.input, ...result.output, 12);
  if (activeDynamic === "peak") min = Math.min(...result.input, -1);
  drawWaveform(ctx, width, height, result.input, "#7a7a7a", min, max);
  drawWaveform(ctx, width, height, result.output, "#111111", min, max);

  if (result.thresholds) {
    const scaleY = (v) => height - 30 - ((v - min) / (max - min)) * (height - 50);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(181,91,34,0.55)";
    result.thresholds.forEach((threshold) => {
      ctx.beginPath();
      ctx.moveTo(40, scaleY(threshold));
      ctx.lineTo(width - 16, scaleY(threshold));
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }
}

function bindOPV() {
  document.querySelectorAll(".topology-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeTopology = button.dataset.topology;
      document.querySelectorAll(".topology-button").forEach((item) => {
        item.classList.toggle("active", item.dataset.topology === activeTopology);
      });
      drawTopology();
    });
  });
  document.querySelectorAll(".dynamic-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeDynamic = button.dataset.dynamic;
      document.querySelectorAll(".dynamic-button").forEach((item) => {
        item.classList.toggle("active", item.dataset.dynamic === activeDynamic);
      });
      drawDynamic();
    });
  });

  ["opv-a", "opv-b", "opv-r1", "opv-r2"].forEach((id) => {
    $(id).addEventListener("input", drawTopology);
  });
  ["opv-dyn-amplitude", "opv-dyn-frequency", "opv-dyn-r", "opv-dyn-c"].forEach((id) => {
    $(id).addEventListener("input", drawDynamic);
  });
}

function updateFundamentals() {
  const carrier18 = Number($("charge-carriers").value);
  const time = Number($("charge-time").value);
  const q = carrier18 * 1e18 * 1.602176634e-19;
  const i = q / time;
  const work = Number($("work-input").value);
  const qVoltage = Number($("voltage-charge").value);
  const voltage = work / qVoltage;
  const power = voltage * Number($("power-current").value);
  const uq = Number($("source-uq").value);
  const ri = Number($("source-ri").value);
  const rl = Number($("source-rl").value);
  const sourceCurrent = uq / (ri + rl);
  const uk = uq - ri * sourceCurrent;
  const pload = sourceCurrent * sourceCurrent * rl;

  $("charge-value").textContent = fmt(q, 2);
  $("current-value").textContent = fmt(i, 2);
  $("voltage-value").textContent = fmt(voltage, 2);
  $("power-value").textContent = fmt(power, 2);
  $("source-terminal").textContent = fmt(uk, 2);
  $("source-current").textContent = fmt(sourceCurrent, 2);
  $("source-power").textContent = fmt(pload, 2);
}

function renderMaterial() {
  const temp = Number($("material-temperature").value);
  const material = materialContent[activeMaterial];
  const doping = dopingContent[activeDoping];
  $("material-title").textContent = material.title;
  $("material-copy").textContent = material.copy;
  $("band-summary").textContent = material.summary;
  $("conductivity-summary").textContent = material.conductivity(temp);
  $("band-gap").textContent =
    activeMaterial === "conductor" ? "praktisch keine relevante Luecke" : activeMaterial === "semiconductor" ? "kleine Bandluecke" : "grosse Bandluecke";
  $("doping-title").textContent = doping.title;
  $("doping-copy").textContent = doping.copy;
  $("majority-carrier").textContent = doping.majority;

  document.querySelectorAll(".material-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.material === activeMaterial);
  });
  document.querySelectorAll(".doping-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.doping === activeDoping);
  });
}

function computeCapacitance(areaCm2, distanceMm, er) {
  const e0 = 8.854187817e-12;
  return er * e0 * (areaCm2 / 10000) / (distanceMm / 1000);
}

function updateFieldLab() {
  updateFundamentals();
  renderMaterial();

  const area = Number($("cap-area").value);
  const distance = Number($("cap-distance").value);
  const er = Number($("cap-dielectric").value);
  const sliderVoltage = Number($("cap-voltage").value);
  const c = computeCapacitance(area, distance, er);
  let effectiveVoltage = sliderVoltage;
  if (capacitorMode === "isolated") {
    if (frozenCharge === null) {
      frozenCharge = c * sliderVoltage;
    }
    effectiveVoltage = frozenCharge / c;
  } else {
    frozenCharge = c * sliderVoltage;
  }
  const q = capacitorMode === "isolated" ? frozenCharge : c * effectiveVoltage;
  const eField = effectiveVoltage / (distance / 1000);

  $("capacitance-value").textContent = engineering(c, "F");
  $("charge-stored-value").textContent = engineering(q, "C");
  $("field-strength-value").textContent = engineering(eField, "V/m");
  $("cap-effective-voltage").textContent = fmt(effectiveVoltage, 2);
  $("cap-mode-note").textContent =
    capacitorMode === "connected"
      ? "An der Quelle bleibt die Spannung konstant. Aenderst du d, fliesst Ladung zur Quelle oder von ihr weg."
      : "Im isolierten Fall bleibt die Ladung konstant. Aenderst du d, muss sich die Spannung aendern.";
  document.querySelectorAll(".cap-mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.capmode === capacitorMode);
  });

  const turns = Number($("coil-turns").value);
  const current = Number($("coil-current").value);
  const core = Number($("coil-core").value);
  const h = turns * current;
  const b = h * core;
  const v1 = Number($("transformer-v1").value);
  const n1 = Number($("transformer-n1").value);
  const n2 = Number($("transformer-n2").value);
  const v2 = v1 * n2 / n1;
  $("coil-h-value").textContent = fmt(h, 1);
  $("coil-b-value").textContent = fmt(b, 1);
  $("transformer-v2").textContent = fmt(v2, 1);

  const sensor = Number($("sensor-resistance").value);
  const lead = Number($("lead-resistance").value);
  const twoWire = sensor + 2 * lead;
  $("two-wire-value").textContent = fmt(twoWire, 1);
  $("four-wire-value").textContent = fmt(sensor, 1);
  $("wire-temp-error").textContent = fmt((twoWire - sensor) / 0.385, 1);

  const zenerIn = Number($("zener-input").value);
  const zener = Number($("zener-voltage").value);
  const zenerOut = Math.min(zenerIn, zener);
  $("zener-in-display").textContent = fmt(zenerIn, 1);
  $("zener-out-display").textContent = fmt(zenerOut, 1);
  $("zener-input-bar").style.width = `${Math.min(100, zenerIn / 15 * 100)}%`;
  $("zener-output-bar").style.width = `${Math.min(100, zenerOut / 15 * 100)}%`;
}

const cycleSteps = [
  { title: "Eingaenge lesen", copy: "Sensorwerte werden von der Hardware eingelesen." },
  { title: "Eingangsabbild", copy: "Die Werte werden fuer den laufenden Zyklus gespeichert." },
  { title: "Programm", copy: "Das SPS-Programm arbeitet mit genau diesen gespeicherten Eingangswerten." },
  { title: "Ausgangsabbild", copy: "Die berechneten Ergebnisse werden intern abgelegt." },
  { title: "Ausgaenge schreiben", copy: "Erst jetzt werden reale Ausgaenge aktualisiert." }
];

function simulateControl(mode, setpoint, disturbance) {
  let room = 18;
  let ambient = 12;
  let heater = 0.42;
  const points = [];
  for (let step = 0; step < 80; step += 1) {
    if (step === 30) ambient -= disturbance;
    if (mode === "closed") {
      const error = setpoint - room;
      heater = clamp(0.32 + error * 0.09, 0, 1);
    }
    room += 0.12 * ((ambient + heater * 38) - room);
    points.push(room);
  }
  return points;
}

function drawControlChart() {
  const setpoint = Number($("control-setpoint").value);
  const disturbance = Number($("control-disturbance").value);
  const open = simulateControl("open", setpoint, disturbance);
  const closed = simulateControl("closed", setpoint, disturbance);
  $("open-loop-end").textContent = fmt(open.at(-1), 1);
  $("closed-loop-end").textContent = fmt(closed.at(-1), 1);

  const canvas = $("control-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawAxes(ctx, width, height, "Zeit", "Temp");
  const min = Math.min(...open, ...closed, setpoint - 3);
  const max = Math.max(...open, ...closed, setpoint + 3);
  drawWaveform(ctx, width, height, open, "#b43a3a", min, max);
  drawWaveform(ctx, width, height, closed, "#111111", min, max);
  const scaleY = (v) => height - 30 - ((v - min) / (max - min)) * (height - 50);
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.moveTo(40, scaleY(setpoint));
  ctx.lineTo(width - 16, scaleY(setpoint));
  ctx.stroke();
  ctx.setLineDash([]);
}

function renderCycle() {
  document.querySelectorAll(".cycle-step").forEach((step, index) => {
    step.classList.toggle("active", index === cycleIndex);
  });
  $("cycle-title").textContent = cycleSteps[cycleIndex].title;
  $("cycle-copy").textContent = cycleSteps[cycleIndex].copy;
}

function nextCycle() {
  cycleIndex = (cycleIndex + 1) % cycleSteps.length;
  renderCycle();
}

function toggleCycleAuto() {
  if (cycleTimer) {
    clearInterval(cycleTimer);
    cycleTimer = null;
    $("cycle-auto-button").textContent = "Auto";
    return;
  }
  cycleTimer = setInterval(nextCycle, 1200);
  $("cycle-auto-button").textContent = "Stop";
}

function renderQuiz() {
  const item = quizData[quizIndex];
  $("quiz-progress").textContent = `Frage ${quizIndex + 1} von ${quizData.length}`;
  $("quiz-question").textContent = item.question;
  $("quiz-feedback").textContent = "";
  const container = $("quiz-options");
  container.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => {
      const alreadyAnswered = [...container.children].some((child) => child.disabled);
      if (alreadyAnswered) return;
      [...container.children].forEach((child) => {
        child.disabled = true;
      });
      const correct = index === item.answer;
      if (correct) {
        quizScore += 1;
        button.classList.add("correct");
      } else {
        button.classList.add("wrong");
        container.children[item.answer].classList.add("correct");
      }
      $("quiz-feedback").textContent = `${item.explanation} | Punktestand: ${quizScore}/${quizData.length}`;
      setTimeout(() => {
        if (quizIndex < quizData.length - 1) {
          quizIndex += 1;
          renderQuiz();
        } else {
          $("quiz-progress").textContent = "Abschluss";
          $("quiz-question").textContent = `Fertig. Du hast ${quizScore} von ${quizData.length} Punkten erreicht.`;
          container.innerHTML = "";
          $("quiz-feedback").textContent =
            quizScore >= 6
              ? "Stark. Nutze jetzt noch das Schaltungs-Lab und das OPV-Studio fuer die Feinarbeit."
              : "Gehe noch einmal gezielt durch: LED/Freilauf, Gegenkopplung, Bandluecke, Pull-up und Steuerung vs. Regelung.";
        }
      }, 1500);
    });
    container.appendChild(button);
  });
}

function bindFieldAndAutomation() {
  [
    "charge-carriers",
    "charge-time",
    "work-input",
    "voltage-charge",
    "power-current",
    "source-uq",
    "source-ri",
    "source-rl",
    "material-temperature",
    "cap-area",
    "cap-distance",
    "cap-dielectric",
    "cap-voltage",
    "coil-turns",
    "coil-current",
    "coil-core",
    "transformer-v1",
    "transformer-n1",
    "transformer-n2",
    "sensor-resistance",
    "lead-resistance",
    "zener-input",
    "zener-voltage",
    "control-setpoint",
    "control-disturbance"
  ].forEach((id) => {
    $(id).addEventListener("input", () => {
      updateFieldLab();
      drawControlChart();
    });
    $(id).addEventListener("change", () => {
      updateFieldLab();
      drawControlChart();
    });
  });

  document.querySelectorAll(".material-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeMaterial = button.dataset.material;
      renderMaterial();
    });
  });
  document.querySelectorAll(".doping-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeDoping = button.dataset.doping;
      renderMaterial();
    });
  });

  document.querySelectorAll(".cap-mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.capmode;
      if (nextMode === capacitorMode) return;
      if (nextMode === "isolated") {
        const area = Number($("cap-area").value);
        const distance = Number($("cap-distance").value);
        const er = Number($("cap-dielectric").value);
        const voltage = Number($("cap-voltage").value);
        frozenCharge = computeCapacitance(area, distance, er) * voltage;
      }
      if (nextMode === "connected") {
        frozenCharge = null;
      }
      capacitorMode = nextMode;
      updateFieldLab();
    });
  });

  $("cycle-step-button").addEventListener("click", nextCycle);
  $("cycle-auto-button").addEventListener("click", toggleCycleAuto);
}

function init() {
  setupJumpButtons();
  bindBuilder();
  bindOPV();
  bindFieldAndAutomation();
  renderBuilderBoard();
  setBuilderStatus(
    "Bereit fuer die erste Schaltungsaufgabe.",
    challengeData[activeChallenge].copy,
    "Messwert A: -",
    "Messwert B: -",
    "Messwert C: -"
  );
  drawTopology();
  drawDynamic();
  updateFieldLab();
  drawControlChart();
  renderCycle();
  renderQuiz();
}

init();
