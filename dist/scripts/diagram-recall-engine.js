import { randomShuffle } from "./match-engine.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function normalizeDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("DiagramRecallEngine requires declarative diagram data.");
  if (!Array.isArray(definition.markers) || definition.markers.length < 1) throw new Error("DiagramRecallEngine requires at least one marker.");
  if (!Array.isArray(definition.questions) || !definition.questions.length) throw new Error("DiagramRecallEngine requires recall questions.");
  const markerIds = new Set(definition.markers.map((marker) => marker.id));
  if (definition.questions.some((question) => !markerIds.has(question.answerMarkerId))) {
    throw new Error("DiagramRecallEngine question references an unknown marker.");
  }
  return deepFreeze({ ...definition });
}

export function createDiagramRecallRound(definition, { shuffle = randomShuffle } = {}) {
  const normalized = normalizeDefinition(definition);
  return Object.freeze({
    ...normalized,
    questions: Object.freeze(shuffle(normalized.questions).map((question) => Object.freeze({ ...question })))
  });
}

export function isDiagramRecallCorrect(selectedMarkerId, answerMarkerId) {
  return Boolean(selectedMarkerId && selectedMarkerId === answerMarkerId);
}

function svgElement(name) {
  if (typeof document.createElementNS === "function") return document.createElementNS(SVG_NS, name);
  return document.createElement(name);
}

function setAttributes(element, attributes) {
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
}

function renderDiagram(container, definition) {
  const svg = svgElement("svg");
  setAttributes(svg, {
    viewBox: definition.viewBox ?? "0 0 420 240",
    role: "img",
    "aria-label": definition.ariaLabel ?? "Calculus diagram for recall"
  });
  svg.setAttribute("class", "memory-diagram-recall__svg");

  for (const item of definition.elements ?? []) {
    const element = svgElement(item.type);
    const attrs = { ...item };
    delete attrs.type;
    delete attrs.variant;
    setAttributes(element, attrs);
    element.setAttribute("class", `memory-diagram-recall__element memory-diagram-recall__element--${item.variant ?? item.type}`);
    svg.append(element);
  }

  for (const marker of definition.markers) {
    const connector = svgElement("line");
    setAttributes(connector, { x1: marker.x, y1: marker.y, x2: marker.targetX, y2: marker.targetY, class: "memory-diagram-recall__connector" });
    const circle = svgElement("circle");
    setAttributes(circle, { cx: marker.x, cy: marker.y, r: 15, class: "memory-diagram-recall__marker" });
    const text = svgElement("text");
    setAttributes(text, { x: marker.x, y: marker.y + 5, "text-anchor": "middle", class: "memory-diagram-recall__marker-text" });
    text.textContent = marker.label;
    svg.append(connector, circle, text);
  }
  container.replaceChildren(svg);
}

export function createDiagramRecallEngine(container, {
  definition,
  shuffle = randomShuffle,
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("DiagramRecallEngine requires a container.");
  const canvas = container.querySelector("[data-diagram-recall-canvas]");
  const prompt = container.querySelector("[data-diagram-recall-prompt]");
  const options = container.querySelector("[data-diagram-recall-options]");
  const progress = container.querySelector("[data-diagram-recall-progress]");
  const status = container.querySelector("[data-diagram-recall-status]");
  const next = container.querySelector("[data-diagram-recall-next]");
  const reset = container.querySelector("[data-diagram-recall-reset]");
  if ([canvas, prompt, options, progress, status, next, reset].some((node) => !node)) {
    throw new Error("DiagramRecallEngine markup is incomplete.");
  }

  let round = createDiagramRecallRound(definition, { shuffle });
  let index = 0;
  let answered = false;
  let completed = false;
  let incorrectAttempts = 0;

  const current = () => round.questions[index];

  function renderOptions() {
    options.replaceChildren();
    for (const marker of round.markers) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-diagram-choice";
      button.dataset.diagramMarker = marker.id;
      button.textContent = `${marker.label} · ${marker.optionLabel ?? "diagram label"}`;
      button.disabled = answered || completed;
      button.addEventListener("click", () => answer(marker.id));
      options.append(button);
    }
  }

  function render() {
    prompt.textContent = current().prompt;
    progress.textContent = `${index + 1} of ${round.questions.length}`;
    next.disabled = !answered || completed;
    next.textContent = index === round.questions.length - 1 ? "Finish round" : "Next";
    renderOptions();
  }

  function answer(markerId) {
    if (answered || completed) return false;
    if (!round.markers.some((marker) => marker.id === markerId)) return false;
    const success = isDiagramRecallCorrect(markerId, current().answerMarkerId);
    onAttempt({ engine: "diagram-recall", questionId: current().id, success, result: success ? 1 : 0, completed: false });
    if (!success) {
      incorrectAttempts += 1;
      status.textContent = "Not that label. Look at where each callout points and try again.";
      return false;
    }
    answered = true;
    status.textContent = current().successMessage ?? "Correct. Move on when you are ready.";
    render();
    return true;
  }

  function finishRound() {
    if (completed) return;
    completed = true;
    const security = incorrectAttempts === 0 ? "secure" : incorrectAttempts <= 2 ? "developing" : "needs-review";
    onSecurity({ engine: "diagram-recall", security, incorrectAttempts });
    onComplete({ engine: "diagram-recall", result: round.questions.length / (round.questions.length + incorrectAttempts) });
    status.textContent = incorrectAttempts === 0
      ? "Diagram recall complete — every feature was identified first time."
      : "Diagram recall complete. Revisit the features that needed another look.";
    next.disabled = true;
  }

  function advance() {
    if (!answered || completed) return;
    if (index === round.questions.length - 1) {
      finishRound();
      return;
    }
    index += 1;
    answered = false;
    status.textContent = "Choose the label that matches the prompt.";
    render();
  }

  function resetRound() {
    round = createDiagramRecallRound(definition, { shuffle });
    index = 0;
    answered = false;
    completed = false;
    incorrectAttempts = 0;
    status.textContent = "Choose the label that matches the prompt.";
    renderDiagram(canvas, round);
    render();
  }

  next.addEventListener("click", advance);
  reset.addEventListener("click", resetRound);
  status.textContent = "Choose the label that matches the prompt.";
  renderDiagram(canvas, round);
  render();

  return Object.freeze({
    answer,
    advance,
    reset: resetRound,
    getRound: () => round,
    getState: () => Object.freeze({ index, answered, completed, incorrectAttempts })
  });
}
