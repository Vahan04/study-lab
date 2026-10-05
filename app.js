const answers = {
  quantum: {
    keywords: ["quantum", "qubit", "wavefunction", "bloch", "schrodinger"],
    reply: "A useful starting point is the state vector. A qubit is written as |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1. The squared magnitudes are probabilities, so measurement connects the abstract state to an observable result. Think of the Bloch sphere as a map of all possible pure qubit states."
  },
  calculus: {
    keywords: ["calculus", "derivative", "integral", "limit", "differentiate"],
    reply: "A derivative measures local change: f'(x) = lim[h→0] (f(x+h) − f(x))/h. Geometrically, it is the slope of the tangent line. An integral adds infinitely many small pieces, and the Fundamental Theorem connects the two ideas: differentiation and integration are inverse operations."
  },
  circuits: {
    keywords: ["circuit", "voltage", "current", "resistor", "kirchhoff", "ohm"],
    reply: "Start with Ohm's law: V = IR. Then use Kirchhoff's laws: currents entering a node equal currents leaving it, and the voltage changes around a closed loop sum to zero. Label unknowns, choose current directions, write equations, and solve the resulting linear system."
  },
  probability: {
    keywords: ["probability", "random", "bayes", "expectation", "distribution"],
    reply: "Probability describes uncertainty with numbers between 0 and 1. For conditional probability, P(A|B) = P(A∩B)/P(B). Bayes' theorem reverses the condition: P(A|B) = P(B|A)P(A)/P(B). Always define the events before putting numbers into a formula."
  }
};

const formulas = [
  ["QUANTUM MECHANICS", "Time-dependent Schrödinger equation", "iℏ ∂ψ/∂t = Ĥψ", "The state of a quantum system changes in time according to its Hamiltonian — the operator for total energy."],
  ["CALCULUS", "Gaussian integral", "∫₋∞∞ e⁻ˣ² dx = √π", "This beautiful result appears in probability, statistical mechanics, and quantum physics."],
  ["CIRCUITS", "Kirchhoff's voltage law", "ΣV = 0", "The algebraic sum of all voltage changes around any closed loop in a circuit is zero."],
  ["PROBABILITY", "Bayes' theorem", "P(A|B) = P(B|A)P(A) / P(B)", "Update a prior belief with new evidence. The denominator keeps the result normalized."]
];

const conversation = document.querySelector("#conversation");
const form = document.querySelector("#question-form");
const question = document.querySelector("#question");
let formulaIndex = 0;

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = type === "user"
    ? `<div class="avatar user-avatar">V</div><div><p class="message-name">YOU</p><p></p></div>`
    : `<div class="avatar">∑</div><div><p class="message-name">STUDYLAB</p><p></p></div>`;
  message.querySelector("p:last-child").textContent = text;
  conversation.appendChild(message);
  conversation.scrollTop = conversation.scrollHeight;
}

function findReply(text) {
  const lower = text.toLowerCase();
  const found = Object.values(answers).find((item) => item.keywords.some((word) => lower.includes(word)));
  return found?.reply || "That is a good question to explore. Try naming the topic — for example quantum mechanics, calculus, circuits, or probability — and I’ll connect it to a core equation and a simple intuition.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = question.value.trim();
  if (!text) return;
  addMessage(text, "user");
  question.value = "";
  setTimeout(() => addMessage(findReply(text), "assistant"), 450);
});

document.querySelectorAll(".topic-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    question.value = `Explain ${chip.textContent.toLowerCase()} with intuition and one example.`;
    question.focus();
  });
});

document.querySelector("#shuffle-formula").addEventListener("click", () => {
  formulaIndex = (formulaIndex + 1) % formulas.length;
  const [domain, name, equation, description] = formulas[formulaIndex];
  document.querySelector("#formula-domain").textContent = domain;
  document.querySelector("#formula-number").textContent = `0${formulaIndex + 1} / 04`;
  document.querySelector("#formula-name").textContent = name;
  document.querySelector("#formula-equation").textContent = equation;
  document.querySelector("#formula-description").textContent = description;
});

document.querySelector("#theme-toggle").addEventListener("click", () => document.body.classList.toggle("dark"));
document.querySelector("#map-button").addEventListener("click", () => {
  document.querySelector(".active-node").textContent = "Superposition";
  document.querySelector(".active-node").nextElementSibling.nextElementSibling.textContent = "Interference";
});
document.querySelector("#start-quiz").addEventListener("click", () => {
  document.querySelector("#quiz").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#start-quiz").textContent = "Quiz ready ✓";
});

const canvas = document.querySelector("#bloch-canvas");
const ctx = canvas.getContext("2d");
const driveControl = document.querySelector("#drive-control");
const detuningControl = document.querySelector("#detuning-control");
const timeControl = document.querySelector("#time-control");
const driveOutput = document.querySelector("#drive-output");
const detuningOutput = document.querySelector("#detuning-output");
const timeOutput = document.querySelector("#time-output");
let animationFrame;

function stateAt(omega, delta, time) {
  const frequency = Math.hypot(omega, delta);
  if (frequency === 0) return [0, 0, 1];
  const nx = omega / frequency;
  const nz = delta / frequency;
  const angle = frequency * time;
  return [
    nx * nz * (1 - Math.cos(angle)),
    -nx * Math.sin(angle),
    Math.cos(angle) + nz * nz * (1 - Math.cos(angle))
  ];
}

function drawBloch() {
  const omega = Number(driveControl.value);
  const delta = Number(detuningControl.value);
  const time = Number(timeControl.value);
  const [x, y, z] = stateAt(omega, delta, time);
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2 + 12;
  const radius = Math.min(w, h) * .34;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(215, 239, 211, .28)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius, radius * .34, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.stroke();
  const px = cx + radius * (x - y * .32);
  const py = cy - radius * (z * .88 + y * .18);
  ctx.strokeStyle = "#a5f268";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.fillStyle = "#a5f268";
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d8e9d5";
  ctx.font = '12px "DM Mono"';
  ctx.fillText("|0⟩", cx + 8, cy - radius - 10);
  ctx.fillText("|1⟩", cx + 8, cy + radius + 20);
  driveOutput.value = omega.toFixed(2);
  detuningOutput.value = delta.toFixed(2);
  timeOutput.value = time.toFixed(2);
  document.querySelector("#excited-probability").textContent = `${((1 - z) / 2 * 100).toFixed(1)}%`;
  document.querySelector("#bloch-coordinates").textContent = `${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}`;
  document.querySelector("#state-label").textContent = ((1 - z) / 2 > .5) ? "|1⟩ leaning" : "|0⟩ leaning";
}

function animateSimulation() {
  const start = performance.now();
  const initial = Number(timeControl.value);
  function frame(now) {
    const next = initial + ((now - start) / 1000);
    timeControl.value = (next % 12).toFixed(2);
    drawBloch();
    animationFrame = requestAnimationFrame(frame);
  }
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(frame);
}

[driveControl, detuningControl, timeControl].forEach((control) => control.addEventListener("input", drawBloch));
document.querySelector("#run-simulation").addEventListener("click", animateSimulation);
document.querySelector("#reset-simulation").addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
  driveControl.value = 1;
  detuningControl.value = 0;
  timeControl.value = 0;
  drawBloch();
});
drawBloch();
