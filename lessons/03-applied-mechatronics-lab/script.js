const materialContent = {
  conductor: {
    title: "Leiter: freie Elektronen zwischen den Atomen",
    copy:
      "Bei Leitern sinken die Potentialwaende zwischen vielen Atomen so weit ab, dass Valenzelektronen praktisch frei beweglich werden. Im Bandbild ueberlappen zugaengliche Bereiche stark.",
    level: 150,
    gap: 6,
    conductivity: (temp) => `${Math.max(70, 92 - temp * 0.15).toFixed(0)} % (bei Metallen sinkt Leitfaehigkeit mit T eher leicht)`,
    bandSummary: "Valenz- und Leitungsband praktisch ueberlappend"
  },
  semiconductor: {
    title: "Halbleiter: kleine Bandluecke, stark temperaturabhaengig",
    copy:
      "Halbleiter liegen zwischen Leiter und Isolator. Schon moderate thermische Anregung kann Elektronen ueber die kleine Bandluecke ins Leitungsband heben. Dotierung veraendert die Traegerdichte gezielt.",
    level: 94,
    gap: 38,
    conductivity: (temp) => `${Math.min(100, 8 + temp * 0.9).toFixed(0)} % (nimmt mit Temperatur deutlich zu)`,
    bandSummary: "kleine Bandluecke"
  },
  insulator: {
    title: "Isolator: Elektronen tief gebunden",
    copy:
      "Beim Isolator sitzen Elektronen energetisch zu tief. Die Bandluecke ist gross, daher entstehen ohne extreme Felder oder Durchschlag kaum freie Ladungstraeger.",
    level: 48,
    gap: 78,
    conductivity: () => "nahe 0 % (bis zum Durchschlag)",
    bandSummary: "grosse Bandluecke"
  }
};

const dopingContent = {
  intrinsic: {
    title: "Reiner Halbleiter",
    copy:
      "Im intrinsischen Halbleiter entstehen Elektronen und Loecher paarweise. Keine Sorte ist deutlich dominant.",
    electrons: 4,
    holes: 4,
    majority: "keine Dominanz",
    hint: "Temperatur erzeugt Elektron-Loch-Paare"
  },
  n: {
    title: "n-Dotierung",
    copy:
      "Dotierung mit Elementen der 5. Hauptgruppe liefert ein zusaetzliches Elektron. Diese freien Elektronen werden Mehrheitstraeger.",
    electrons: 8,
    holes: 3,
    majority: "Elektronen",
    hint: "Grundlage fuer den n-Bereich einer Diode"
  },
  p: {
    title: "p-Dotierung",
    copy:
      "Dotierung mit Elementen der 3. Hauptgruppe erzeugt Elektronenmangelstellen. Diese Loecher wirken als bewegliche positive Ladungstraeger.",
    electrons: 3,
    holes: 8,
    majority: "Loecher",
    hint: "Grundlage fuer den p-Bereich einer Diode"
  }
};

const opampModes = {
  comparator: {
    title: "Vergleicher ohne Gegenkopplung",
    copy:
      "Wegen der enormen Leerlaufverstaerkung geht der OPV schon bei kleiner Differenz sehr schnell in die Saettigung. Er arbeitet dann praktisch als Schalter.",
    note:
      "Wenn U+ groesser als U- ist, zieht der Ausgang zur positiven Versorgung. Sonst zur negativen.",
    solve(vin, vref) {
      const output = vin >= vref ? 12 : -12;
      return {
        output,
        formula: `Vergleich: Vin ${vin >= vref ? ">=" : "<"} Vref`,
        bar: Math.abs(output) / 12
      };
    }
  },
  inverting: {
    title: "Invertierender Verstaerker",
    copy:
      "Mit Gegenkopplung regelt sich der invertierende Eingang auf virtuelles Potential. Der Strom durch R1 ist gleich dem Strom durch R2, weil ideal kein Eingangsstrom fliesst.",
    note:
      "Kernformel: Uout = -(R2/R1) * Uin. Das Minuszeichen bedeutet Inversion.",
    solve(vin, _vref, r1, r2) {
      const gain = -(r2 / r1);
      const unclamped = gain * vin;
      const output = Math.max(-12, Math.min(12, unclamped));
      return {
        output,
        formula: `Gain = ${gain.toFixed(2)} -> Uout = ${unclamped.toFixed(2)} V${Math.abs(unclamped) > 12 ? " (an Versorgung begrenzt)" : ""}`,
        bar: Math.min(1, Math.abs(output) / 12)
      };
    }
  },
  follower: {
    title: "Spannungsfolger / Impedanzwandler",
    copy:
      "Die Spannungsverstaerkung ist etwa 1. Der eigentliche Nutzen liegt im sehr hohen Eingangswiderstand und der Lastentkopplung.",
    note:
      "Der Sensor wird kaum belastet, der OPV stellt am Ausgang dieselbe Spannung mit deutlich besserer Treibfaehigkeit bereit.",
    solve(vin) {
      const output = Math.max(-12, Math.min(12, vin));
      return {
        output,
        formula: `Uout ≈ Uin = ${output.toFixed(2)} V`,
        bar: Math.min(1, Math.abs(output) / 12)
      };
    }
  },
  schmitt: {
    title: "Schmitt-Trigger mit Hysterese",
    copy:
      "Mitkopplung erzeugt zwei Schaltschwellen. Das verhindert Flackern bei verrauschten Signalen oder langsamen Uebergaengen.",
    note:
      "Zwischen unterer und oberer Schwelle haelt der Schmitt-Trigger seinen letzten Ausgangszustand.",
    solve(vin, vref, r1, r2, state) {
      const hysteresis = Math.max(0.2, r2 / 40);
      const upper = vref + hysteresis / 2;
      const lower = vref - hysteresis / 2;
      let nextState = state;
      if (vin >= upper) nextState = 12;
      if (vin <= lower) nextState = -12;
      return {
        output: nextState,
        state: nextState,
        formula: `untere Schwelle ${lower.toFixed(2)} V, obere Schwelle ${upper.toFixed(2)} V`,
        bar: Math.min(1, Math.abs(nextState) / 12)
      };
    }
  }
};

const cycleSteps = [
  {
    title: "Eingaenge einlesen",
    copy: "Sensor- und Schalterzustaende werden von der Hardware in die SPS uebernommen."
  },
  {
    title: "Prozessabbild Eingabe",
    copy: "Diese Werte werden fuer den laufenden Zyklus zwischengespeichert."
  },
  {
    title: "Anwenderprogramm",
    copy: "Die CPU verarbeitet das Programm mit genau diesen eingefrorenen Eingangswerten."
  },
  {
    title: "Prozessabbild Ausgabe",
    copy: "Die berechneten Ausgaenge werden intern gesammelt."
  },
  {
    title: "Ausgaenge aktualisieren",
    copy: "Erst jetzt schalten Lampen, Ventile oder Schuetze entsprechend um."
  }
];

const quizData = [
  {
    question: "Was beschreibt Stromstaerke physikalisch?",
    options: [
      "Ladung pro Zeit",
      "Energie pro Ladung",
      "Leistung pro Widerstand"
    ],
    answer: 0,
    explanation: "I = dQ/dt. Stromstaerke sagt, wie viel Ladung pro Sekunde bewegt wird."
  },
  {
    question: "Was ist der zentrale Unterschied zwischen Halbleiter und Isolator?",
    options: [
      "Der Halbleiter hat typischerweise eine deutlich kleinere Bandluecke",
      "Im Isolator gibt es nie Elektronen",
      "Halbleiter leiten nur mit Wechselstrom"
    ],
    answer: 0,
    explanation: "Die kleine Bandluecke macht den Halbleiter thermisch und durch Dotierung steuerbar."
  },
  {
    question: "Warum braucht eine LED meist einen Vorwiderstand?",
    options: [
      "Weil ihre Kennlinie nicht ohmsch ist und kleine Spannungssteigerungen grosse Stromanstiege erzeugen koennen",
      "Weil sie sonst keine Farbe hat",
      "Weil der Widerstand die LED heller macht"
    ],
    answer: 0,
    explanation: "Die LED begrenzt den Strom nicht selbst verlässlich. Ohne Strombegrenzung kann sie thermisch ueberlastet werden."
  },
  {
    question: "Was leistet die Gegenkopplung beim linearen OPV-Betrieb?",
    options: [
      "Sie regelt den OPV so ein, dass U+ und U- nahezu gleich werden",
      "Sie macht aus jedem OPV automatisch einen Schmitt-Trigger",
      "Sie hebt den Eingangswiderstand auf null"
    ],
    answer: 0,
    explanation: "Beim idealen OPV mit Gegenkopplung gilt in der linearen Rechnung U+ ≈ U-."
  },
  {
    question: "Was bleibt konstant, wenn ein geladener Kondensator von der Quelle getrennt wird?",
    options: [
      "Die Ladung Q",
      "Die Spannung U",
      "Die Kapazitaet C"
    ],
    answer: 0,
    explanation: "Im isolierten Fall kann keine Ladung nachfliessen oder abfliessen, also bleibt Q konstant."
  },
  {
    question: "Was unterscheidet Regelung von Steuerung?",
    options: [
      "Die Regelung verwendet eine Rueckmeldung der Ausgangsgroesse",
      "Die Steuerung braucht immer einen OPV",
      "Die Regelung arbeitet nie mit Sensoren"
    ],
    answer: 0,
    explanation: "Rueckkopplung des Istwertes ist die Kernidee einer Regelung."
  }
];

const ledStandardResistors = [47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000];

let activeMaterial = "conductor";
let activeDoping = "intrinsic";
let activeFlyback = "with";
let activeOpampMode = "comparator";
let schmittState = -12;
let capacitorMode = "connected";
let frozenCharge = null;
let cycleIndex = 0;
let cycleTimer = null;
let quizIndex = 0;
let quizScore = 0;

const $ = (id) => document.getElementById(id);

function fmt(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function engineering(value, unit = "") {
  const abs = Math.abs(value);
  if (abs >= 1) return `${value.toFixed(2)} ${unit}`.trim();
  if (abs >= 1e-3) return `${(value * 1e3).toFixed(2)} m${unit}`.trim();
  if (abs >= 1e-6) return `${(value * 1e6).toFixed(2)} µ${unit}`.trim();
  if (abs >= 1e-9) return `${(value * 1e9).toFixed(2)} n${unit}`.trim();
  if (abs >= 1e-12) return `${(value * 1e12).toFixed(2)} p${unit}`.trim();
  return `${value.toExponential(2)} ${unit}`.trim();
}

function nearestResistor(value) {
  return ledStandardResistors.reduce((best, current) => {
    return Math.abs(current - value) < Math.abs(best - value) ? current : best;
  }, ledStandardResistors[0]);
}

function setupJumpButtons() {
  document.querySelectorAll(".jump-button").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      if (target) {
        $(target).scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function updateFundamentals() {
  const carrier18 = parseFloat($("charge-carriers").value);
  const time = parseFloat($("charge-time").value);
  const q = carrier18 * 1e18 * 1.602176634e-19;
  const i = q / time;

  $("charge-value").textContent = fmt(q, 2);
  $("current-value").textContent = fmt(i, 2);
  $("charge-stream").style.setProperty("--flow-speed", `${Math.max(0.6, 4 - Math.min(i, 3))}s`);

  const work = parseFloat($("work-input").value);
  const qForVoltage = parseFloat($("voltage-charge").value);
  const powerCurrent = parseFloat($("power-current").value);
  const u = work / qForVoltage;
  const p = u * powerCurrent;

  $("voltage-value").textContent = fmt(u, 2);
  $("power-value").textContent = fmt(p, 2);
  $("voltage-bar").style.width = `${Math.min(100, u / 24 * 100)}%`;
  $("power-bar").style.width = `${Math.min(100, p / 100 * 100)}%`;

  const uq = parseFloat($("source-uq").value);
  const ri = parseFloat($("source-ri").value);
  const rl = parseFloat($("source-rl").value);
  const sourceCurrent = uq / (ri + rl);
  const uk = sourceCurrent * rl;
  const pload = sourceCurrent * sourceCurrent * rl;

  $("source-current").textContent = fmt(sourceCurrent, 2);
  $("source-terminal").textContent = fmt(uk, 2);
  $("source-power").textContent = fmt(pload, 2);
  $("source-match-note").textContent =
    Math.abs(rl - ri) < 0.11
      ? "Hier liegt nahezu Leistungsanpassung vor: RL ≈ Ri. Maximale Lastleistung, aber auch hohe Verluste in der Quelle."
      : "Klemmenspannung folgt Uk = Uq - Ri · I. Je kleiner RL oder je groesser Ri, desto staerker bricht die Ausgangsspannung ein.";
}

function renderMaterial() {
  const data = materialContent[activeMaterial];
  const temp = parseFloat($("material-temperature").value);
  $("material-title").textContent = data.title;
  $("material-copy").textContent = data.copy;
  $("electron-level").style.bottom = `${data.level}px`;
  $("band-gap").style.minHeight = `${data.gap}px`;
  $("band-summary").textContent = data.bandSummary;
  $("conductivity-summary").textContent = data.conductivity(temp);
  $("conduction-band").style.opacity =
    activeMaterial === "insulator" ? "0.55" : activeMaterial === "semiconductor" ? "0.78" : "1";

  document.querySelectorAll(".material-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.material === activeMaterial);
  });
}

function renderDoping() {
  const data = dopingContent[activeDoping];
  $("doping-title").textContent = data.title;
  $("doping-copy").textContent = data.copy;
  $("majority-carrier").textContent = data.majority;
  $("device-hint").textContent = data.hint;

  const electronRow = $("electron-row");
  const holeRow = $("hole-row");
  electronRow.innerHTML = "";
  holeRow.innerHTML = "";

  Array.from({ length: data.electrons }).forEach(() => {
    const dot = document.createElement("span");
    electronRow.appendChild(dot);
  });
  Array.from({ length: data.holes }).forEach(() => {
    const dot = document.createElement("span");
    holeRow.appendChild(dot);
  });

  document.querySelectorAll(".doping-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.doping === activeDoping);
  });
}

function drawAxes(ctx, width, height, labels = {}) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(38, 12);
  ctx.lineTo(38, height - 28);
  ctx.lineTo(width - 12, height - 28);
  ctx.stroke();
  ctx.fillStyle = "rgba(231,241,245,0.7)";
  ctx.font = "12px Trebuchet MS";
  if (labels.y) ctx.fillText(labels.y, 10, 18);
  if (labels.x) ctx.fillText(labels.x, width - 64, height - 10);
}

function drawDiodeCurve() {
  const canvas = $("diode-curve");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawAxes(ctx, width, height, { x: "U_D", y: "I" });

  const supply = parseFloat($("led-supply").value);
  const forward = parseFloat($("led-color").value);
  const currentA = parseFloat($("led-current").value) / 1000;
  const rawR = (supply - forward) / currentA;
  const safeR = rawR > 0 ? rawR : 0;
  const pLoss = safeR > 0 ? currentA * currentA * safeR : 0;
  const suggested = safeR > 0 ? nearestResistor(safeR) : 0;

  $("led-forward").textContent = fmt(forward, 2);
  $("led-resistor").textContent = safeR > 0 ? `${fmt(safeR, 0)} (naechstliegend ${suggested})` : "nicht moeglich";
  $("led-power-loss").textContent = fmt(pLoss, 3);
  $("led-note").textContent =
    safeR > 0
      ? `Mit ${suggested} Ohm liegt der Strom in realistischer Groessenordnung. Ohne Widerstand waere die Kennlinie zu steil.`
      : "Die Versorgung liegt unter oder auf der Diodenspannung. Mit diesen Werten fliesst praktisch kein sinnvoller LED-Strom.";

  ctx.strokeStyle = "#57d0ff";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let x = 0; x <= 260; x += 2) {
    const v = (x / 260) * 5;
    const current = v < forward ? 0.002 * Math.exp((v - forward) * 2) : Math.min(0.03, 0.001 + (v - forward) ** 2 * 0.05);
    const y = height - 28 - current / 0.03 * (height - 52);
    const px = 38 + x;
    if (x === 0) ctx.moveTo(px, y);
    else ctx.lineTo(px, y);
  }
  ctx.stroke();

  const xMark = 38 + forward / 5 * 260;
  const yMark = height - 28 - Math.min(currentA, 0.03) / 0.03 * (height - 52);
  ctx.fillStyle = "#f4b54d";
  ctx.beginPath();
  ctx.arc(xMark, yMark, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(231,241,245,0.8)";
  ctx.fillText("Betriebspunkt", xMark + 8, yMark - 8);
}

function updateZener() {
  const input = parseFloat($("zener-input").value);
  const zener = parseFloat($("zener-voltage").value);
  const output = Math.min(input, zener);
  $("zener-in-display").textContent = fmt(input, 1);
  $("zener-out-display").textContent = fmt(output, 1);
  $("zener-input-bar").style.width = `${Math.min(100, input / 15 * 100)}%`;
  $("zener-output-bar").style.width = `${Math.min(100, output / 15 * 100)}%`;
}

function drawFlyback() {
  const canvas = $("flyback-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawAxes(ctx, width, height, { x: "t", y: "U" });

  ctx.strokeStyle = activeFlyback === "with" ? "#72db8f" : "#ff7b47";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let x = 0; x <= 300; x += 2) {
    const t = x / 300;
    let value;
    if (activeFlyback === "with") {
      value = x < 40 ? 0.85 : 0.12 + 0.7 * Math.exp(-(t - 0.13) * 5.5);
    } else {
      value = x < 40 ? 0.85 : 0.15 + 3.4 * Math.exp(-(t - 0.13) * 10);
    }
    const y = height - 28 - Math.min(value / 4, 1) * (height - 52);
    const px = 38 + x;
    if (x === 0) ctx.moveTo(px, y);
    else ctx.lineTo(px, y);
  }
  ctx.stroke();

  $("flyback-copy").textContent =
    activeFlyback === "with"
      ? "Mit Freilaufdiode bleibt der Strompfad nach dem Abschalten erhalten. Die Spannungsspitze bleibt niedrig, die Energie wird langsam im Kreis abgebaut."
      : "Ohne Freilaufdiode erzwingt die Selbstinduktion eine hohe Abschaltspannung. Das kann Transistoren, Relaiskontakte oder Mikrocontroller-Ausgaenge gefaehrden.";
  $("flyback-path").textContent =
    activeFlyback === "with" ? "Spule -> Diode -> Spule" : "kein definierter Kreis; Strom sucht sich einen Ueberschlagsweg";
  $("flyback-spike").textContent = activeFlyback === "with" ? "niedrig, typ. etwa Diodenspannung" : "hoch, potentiell viele 10 bis 100 V";
}

function updateMeasurement() {
  const sensor = parseFloat($("sensor-resistance").value);
  const lead = parseFloat($("lead-resistance").value);
  const twoWire = sensor + 2 * lead;
  const fourWire = sensor;
  const tempError = (twoWire - sensor) / 0.385;

  $("two-wire-value").textContent = fmt(twoWire, 1);
  $("four-wire-value").textContent = fmt(fourWire, 1);
  $("wire-temp-error").textContent = fmt(tempError, 1);
}

function updateOpamp() {
  const vin = parseFloat($("opamp-vin").value);
  const vref = parseFloat($("opamp-vref").value);
  const r1 = parseFloat($("opamp-r1").value);
  const r2 = parseFloat($("opamp-r2").value);
  const mode = opampModes[activeOpampMode];

  let result;
  if (activeOpampMode === "schmitt") {
    result = mode.solve(vin, vref, r1, r2, schmittState);
    schmittState = result.state;
  } else {
    result = mode.solve(vin, vref, r1, r2, schmittState);
  }

  $("opamp-title").textContent = mode.title;
  $("opamp-copy").textContent = mode.copy;
  $("opamp-note").textContent = mode.note;
  $("opamp-output").textContent = `${result.output >= 0 ? "+" : ""}${fmt(result.output, 1)}`;
  $("opamp-formula").textContent = result.formula;

  const widthPercent = Math.max(10, result.bar * 100);
  const bar = $("opamp-output-bar");
  bar.style.width = `${widthPercent}%`;
  bar.style.background =
    result.output >= 0
      ? "linear-gradient(90deg, var(--cyan), var(--green))"
      : "linear-gradient(90deg, var(--pink), var(--orange))";

  document.querySelectorAll(".opamp-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === activeOpampMode);
  });
}

function computeCapacitance(areaCm2, distanceMm, epsilonR) {
  const epsilon0 = 8.854187817e-12;
  const areaM2 = areaCm2 / 10000;
  const distanceM = distanceMm / 1000;
  return epsilonR * epsilon0 * areaM2 / distanceM;
}

function updateCapacitor() {
  const area = parseFloat($("cap-area").value);
  const distance = parseFloat($("cap-distance").value);
  const epsilonR = parseFloat($("cap-dielectric").value);
  const voltageInput = parseFloat($("cap-voltage").value);
  const epsilon0 = 8.854187817e-12;
  const capacitance = computeCapacitance(area, distance, epsilonR);

  let voltage = voltageInput;
  if (capacitorMode === "isolated") {
    if (frozenCharge === null) {
      frozenCharge = capacitance * voltageInput;
    }
    voltage = frozenCharge / capacitance;
  } else {
    frozenCharge = capacitance * voltageInput;
  }

  const charge = capacitance * voltage;
  const fieldStrength = voltage / (distance / 1000);
  const fluxDensity = epsilonR * epsilon0 * fieldStrength;

  $("capacitor-copy").textContent =
    capacitorMode === "connected"
      ? "Bei angeschlossener Quelle bleibt U konstant. Veraendert sich der Abstand, fliesst Ladung zur Quelle oder von ihr nach."
      : "Im isolierten Fall bleibt Q konstant. Veraendert sich die Geometrie, muss sich die Spannung entsprechend aendern.";

  $("capacitance-value").textContent = engineering(capacitance, "F");
  $("charge-stored-value").textContent = engineering(charge, "C");
  $("field-strength-value").textContent = engineering(fieldStrength, "V/m");
  $("flux-density-value").textContent = engineering(fluxDensity, "C/m^2");

  const dielectric = $("dielectric-block");
  const width = Math.max(8, 40 - distance * 5);
  dielectric.style.left = `${50 - width / 2}%`;
  dielectric.style.right = `${50 - width / 2}%`;
  dielectric.style.background =
    epsilonR > 20 ? "rgba(114, 219, 143, 0.48)" : epsilonR > 3 ? "rgba(87, 208, 255, 0.35)" : "rgba(255, 255, 255, 0.14)";
}

function updateMagnetics() {
  const turns = parseFloat($("coil-turns").value);
  const current = parseFloat($("coil-current").value);
  const core = parseFloat($("coil-core").value);
  const v1 = parseFloat($("transformer-v1").value);
  const n1 = parseFloat($("transformer-n1").value);
  const n2 = parseFloat($("transformer-n2").value);
  const hRelative = turns * current;
  const bRelative = hRelative * core;
  const v2 = v1 * n2 / n1;

  $("coil-h-value").textContent = fmt(hRelative, 1);
  $("coil-b-value").textContent = fmt(bRelative, 1);
  $("transformer-v2").textContent = fmt(v2, 1);

  const canvas = $("magnet-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawAxes(ctx, width, height, { x: "relativ", y: "Feld" });

  const maxValue = Math.max(bRelative, hRelative, 1);
  const hBarHeight = (hRelative / maxValue) * (height - 70);
  const bBarHeight = (bRelative / maxValue) * (height - 70);

  ctx.fillStyle = "#57d0ff";
  ctx.fillRect(86, height - 28 - hBarHeight, 64, hBarHeight);
  ctx.fillStyle = "#f4b54d";
  ctx.fillRect(214, height - 28 - bBarHeight, 64, bBarHeight);
  ctx.fillStyle = "rgba(231,241,245,0.8)";
  ctx.fillText("H", 110, height - 8);
  ctx.fillText("B", 238, height - 8);
}

function simulateControl(mode, setpoint, disturbance) {
  let roomTemp = 18;
  let ambient = 12;
  let heaterCommand = 0.42;
  const points = [];
  for (let step = 0; step < 80; step += 1) {
    if (step === 32) ambient -= disturbance;
    if (mode === "closed") {
      const error = setpoint - roomTemp;
      heaterCommand = Math.max(0, Math.min(1, 0.3 + error * 0.09));
    }
    const heaterTemp = heaterCommand * 38;
    roomTemp += 0.12 * ((ambient + heaterTemp) - roomTemp);
    points.push(roomTemp);
  }
  return points;
}

function drawControlChart() {
  const setpoint = parseFloat($("control-setpoint").value);
  const disturbance = parseFloat($("control-disturbance").value);
  const openLoop = simulateControl("open", setpoint, disturbance);
  const closedLoop = simulateControl("closed", setpoint, disturbance);
  const canvas = $("control-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  drawAxes(ctx, width, height, { x: "Zeit", y: "Raumtemp" });

  const minTemp = Math.min(...openLoop, ...closedLoop, setpoint - 2, 0);
  const maxTemp = Math.max(...openLoop, ...closedLoop, setpoint + 2);
  const scaleY = (temp) => height - 28 - ((temp - minTemp) / (maxTemp - minTemp)) * (height - 52);

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.moveTo(38, scaleY(setpoint));
  ctx.lineTo(width - 12, scaleY(setpoint));
  ctx.stroke();
  ctx.setLineDash([]);

  const drawSeries = (series, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    series.forEach((value, index) => {
      const x = 38 + index / (series.length - 1) * (width - 50);
      const y = scaleY(value);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  drawSeries(openLoop, "#ff7b47");
  drawSeries(closedLoop, "#57d0ff");

  ctx.fillStyle = "rgba(231,241,245,0.8)";
  ctx.fillText("Steuerung", width - 132, 24);
  ctx.fillStyle = "#ff7b47";
  ctx.fillRect(width - 176, 16, 28, 4);
  ctx.fillStyle = "rgba(231,241,245,0.8)";
  ctx.fillText("Regelung", width - 132, 44);
  ctx.fillStyle = "#57d0ff";
  ctx.fillRect(width - 176, 36, 28, 4);

  $("open-loop-end").textContent = fmt(openLoop.at(-1), 1);
  $("closed-loop-end").textContent = fmt(closedLoop.at(-1), 1);
}

function renderCycle() {
  document.querySelectorAll(".cycle-step").forEach((step, index) => {
    step.classList.toggle("active", index === cycleIndex);
  });
  $("cycle-title").textContent = cycleSteps[cycleIndex].title;
  $("cycle-copy").textContent = cycleSteps[cycleIndex].copy;
}

function nextCycleStep() {
  cycleIndex = (cycleIndex + 1) % cycleSteps.length;
  renderCycle();
}

function toggleCycleAuto() {
  if (cycleTimer) {
    window.clearInterval(cycleTimer);
    cycleTimer = null;
    $("cycle-auto-button").textContent = "Auto abspielen";
    return;
  }
  cycleTimer = window.setInterval(nextCycleStep, 1200);
  $("cycle-auto-button").textContent = "Auto stoppen";
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
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      const alreadyDone = [...container.children].some((child) => child.disabled);
      if (alreadyDone) return;
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
      window.setTimeout(() => {
        if (quizIndex < quizData.length - 1) {
          quizIndex += 1;
          renderQuiz();
        } else {
          $("quiz-progress").textContent = "Abschluss";
          $("quiz-question").textContent = `Fertig. Du hast ${quizScore} von ${quizData.length} Punkten erreicht.`;
          container.innerHTML = "";
          $("quiz-feedback").textContent =
            quizScore >= 5
              ? "Stark. Wiederhole jetzt nur noch die Formeln und die typischen Praxisfallen."
              : "Gehe die Module noch einmal gezielt durch: LED/Freilauf, OPV-Gegenkopplung, Kondensatorfall an Quelle vs. getrennt und Steuerung vs. Regelung.";
        }
      }, 1500);
    });
    container.appendChild(button);
  });
}

function bindEvents() {
  [
    "charge-carriers",
    "charge-time",
    "work-input",
    "voltage-charge",
    "power-current",
    "source-uq",
    "source-ri",
    "source-rl"
  ].forEach((id) => $(id).addEventListener("input", updateFundamentals));

  $("material-temperature").addEventListener("input", renderMaterial);
  document.querySelectorAll(".material-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeMaterial = button.dataset.material;
      renderMaterial();
    });
  });

  document.querySelectorAll(".doping-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeDoping = button.dataset.doping;
      renderDoping();
    });
  });

  ["led-supply", "led-color", "led-current"].forEach((id) => {
    $(id).addEventListener("input", drawDiodeCurve);
    $(id).addEventListener("change", drawDiodeCurve);
  });

  ["zener-input", "zener-voltage"].forEach((id) => $(id).addEventListener("input", updateZener));

  document.querySelectorAll(".flyback-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFlyback = button.dataset.flyback;
      document.querySelectorAll(".flyback-button").forEach((item) => {
        item.classList.toggle("active", item.dataset.flyback === activeFlyback);
      });
      drawFlyback();
    });
  });

  ["sensor-resistance", "lead-resistance"].forEach((id) => $(id).addEventListener("input", updateMeasurement));

  ["opamp-vin", "opamp-vref", "opamp-r1", "opamp-r2"].forEach((id) => $(id).addEventListener("input", updateOpamp));
  document.querySelectorAll(".opamp-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeOpampMode = button.dataset.mode;
      updateOpamp();
    });
  });

  ["cap-area", "cap-distance", "cap-dielectric", "cap-voltage"].forEach((id) => {
    $(id).addEventListener("input", updateCapacitor);
    $(id).addEventListener("change", updateCapacitor);
  });
  document.querySelectorAll(".capacitor-mode").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.capmode;
      if (nextMode === capacitorMode) return;
      if (nextMode === "isolated") {
        const currentCap = computeCapacitance(
          parseFloat($("cap-area").value),
          parseFloat($("cap-distance").value),
          parseFloat($("cap-dielectric").value)
        );
        frozenCharge = currentCap * parseFloat($("cap-voltage").value);
      }
      if (nextMode === "connected") {
        frozenCharge = null;
      }
      capacitorMode = nextMode;
      document.querySelectorAll(".capacitor-mode").forEach((item) => {
        item.classList.toggle("active", item.dataset.capmode === capacitorMode);
      });
      updateCapacitor();
    });
  });

  ["coil-turns", "coil-current", "coil-core", "transformer-v1", "transformer-n1", "transformer-n2"].forEach((id) => {
    $(id).addEventListener("input", updateMagnetics);
    $(id).addEventListener("change", updateMagnetics);
  });

  ["control-setpoint", "control-disturbance"].forEach((id) => $(id).addEventListener("input", drawControlChart));
  $("cycle-step-button").addEventListener("click", nextCycleStep);
  $("cycle-auto-button").addEventListener("click", toggleCycleAuto);
}

function init() {
  setupJumpButtons();
  bindEvents();
  updateFundamentals();
  renderMaterial();
  renderDoping();
  drawDiodeCurve();
  updateZener();
  drawFlyback();
  updateMeasurement();
  updateOpamp();
  updateCapacitor();
  updateMagnetics();
  drawControlChart();
  renderCycle();
  renderQuiz();
}

init();
