import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js?v=diagramfix3";
import { POLYNOMIAL_FUNCTIONS, validateFunctionDefinition } from "./linked-function-gradient-explorer.js";

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

export function formatChordNumber(value, digits = 3) {
  const numeric = finiteNumber(value);
  const rounded = Math.abs(numeric) < 1e-12 ? 0 : Number(numeric.toFixed(digits));
  return String(rounded);
}

export function calculateChordState(definition, pX, qX) {
  validateFunctionDefinition(definition);
  const p = finiteNumber(pX);
  const q = finiteNumber(qX);
  const h = q - p;
  if (Math.abs(h) < 1e-14) throw new Error("Chord state requires distinct P and Q x-coordinates.");
  const pY = definition.evaluate(p);
  const qY = definition.evaluate(q);
  const chordGradient = (qY - pY) / h;
  const tangentGradient = definition.derivative(p);
  return Object.freeze({
    p: Object.freeze({ x: p, y: pY }),
    q: Object.freeze({ x: q, y: qY }),
    h,
    verticalChange: qY - pY,
    chordGradient,
    tangentGradient,
    gradientError: chordGradient - tangentGradient
  });
}

export const NUMERIC_INFORMATION_MODES = Object.freeze({
  hidden: Object.freeze({ h: false, chordGradient: false, tangentGradient: false }),
  "h-only": Object.freeze({ h: true, chordGradient: false, tangentGradient: false }),
  gradients: Object.freeze({ h: false, chordGradient: true, tangentGradient: true }),
  full: Object.freeze({ h: true, chordGradient: true, tangentGradient: true })
});

function normalizeInformationMode(mode) {
  return Object.hasOwn(NUMERIC_INFORMATION_MODES, mode) ? mode : "full";
}

function sampleFunction(evaluator, xDomain, samples = 220) {
  const [xMin, xMax] = normalizeDomain(xDomain, [-4, 4]);
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: evaluator(x) };
  }).filter(({ y }) => Number.isFinite(y));
}

export class ChordToTangentExplorer {
  constructor(root, {
    functions = POLYNOMIAL_FUNCTIONS,
    initialFunctionId = functions[0]?.id,
    pX = 1,
    initialH = 1.5,
    minAbsH = 0.01,
    informationMode = "full",
    showFunctionSelector = true,
    showInformationSelector = true,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("ChordToTangentExplorer requires a DOM host element.");
    const validFunctions = functions.map(validateFunctionDefinition);
    if (!validFunctions.length) throw new Error("ChordToTangentExplorer requires at least one function definition.");

    this.root = root;
    this.document = root.ownerDocument;
    this.functions = new Map(validFunctions.map((definition) => [definition.id, definition]));
    this.showFunctionSelector = Boolean(showFunctionSelector);
    this.showInformationSelector = Boolean(showInformationSelector);
    this.onChange = onChange;
    this.minAbsH = Math.max(1e-6, Math.abs(finiteNumber(minAbsH, 0.01)));
    this.cleanupCallbacks = [];
    this.controllers = {};
    this.syncing = false;
    this.diagram = null;

    const initialDefinition = this.functions.get(initialFunctionId) || validFunctions[0];
    const [xMin, xMax] = normalizeDomain(initialDefinition.xDomain, [-4, 4]);
    const initialPX = clamp(finiteNumber(pX, initialDefinition.initialX ?? 0), xMin, xMax);
    this.state = {
      functionId: initialDefinition.id,
      pX: initialPX,
      qX: this.#coerceQX(initialPX + finiteNumber(initialH, 1.5), initialPX, initialDefinition),
      informationMode: normalizeInformationMode(informationMode)
    };

    this.#renderShell();
    this.#renderFunction();
  }

  get definition() {
    return this.functions.get(this.state.functionId);
  }

  getState() {
    return { ...this.state, h: this.state.qX - this.state.pX };
  }

  getChordState() {
    return calculateChordState(this.definition, this.state.pX, this.state.qX);
  }

  destroy() {
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    this.diagram?.destroy();
    this.diagram = null;
    this.root.replaceChildren();
    this.root.classList.remove("chord-tangent-explorer");
  }

  setFunction(functionId) {
    const definition = this.functions.get(functionId);
    if (!definition) throw new Error(`Unknown function definition: ${functionId}`);
    const previousH = this.state.qX - this.state.pX;
    this.state.functionId = functionId;
    this.state.pX = clamp(this.state.pX, ...definition.xDomain);
    this.state.qX = this.#coerceQX(this.state.pX + previousH, this.state.pX, definition);
    this.#renderFunction();
    this.#emitChange("function");
  }

  setQX(qX, source = "programmatic") {
    this.state.qX = this.#coerceQX(qX, this.state.pX, this.definition);
    this.#syncGeometry();
    this.#emitChange(source);
  }

  setH(h, source = "programmatic") {
    const requested = finiteNumber(h, this.state.qX - this.state.pX);
    this.setQX(this.state.pX + requested, source);
  }

  setInformationMode(mode) {
    this.state.informationMode = normalizeInformationMode(mode);
    if (this.informationSelect) this.informationSelect.value = this.state.informationMode;
    this.#syncReadout();
    this.#emitChange("information-mode");
  }

  #coerceQX(qX, pX, definition) {
    const [xMin, xMax] = normalizeDomain(definition.xDomain, [-4, 4]);
    let candidate = clamp(finiteNumber(qX, pX + this.minAbsH), xMin, xMax);
    let delta = candidate - pX;
    if (Math.abs(delta) >= this.minAbsH) return candidate;

    const preferredSign = delta < 0 ? -1 : delta > 0 ? 1 : (this.state?.qX < pX ? -1 : 1);
    const rightCandidate = pX + this.minAbsH;
    const leftCandidate = pX - this.minAbsH;
    if (preferredSign > 0 && rightCandidate <= xMax) candidate = rightCandidate;
    else if (preferredSign < 0 && leftCandidate >= xMin) candidate = leftCandidate;
    else if (rightCandidate <= xMax) candidate = rightCandidate;
    else candidate = leftCandidate;
    return clamp(candidate, xMin, xMax);
  }

  #emitChange(source) {
    this.onChange({
      ...this.getState(),
      source,
      values: this.getChordState()
    });
  }

  #renderShell() {
    this.root.classList.add("chord-tangent-explorer");
    const controls = createElement(this.document, "div", "chord-tangent-explorer__controls");

    if (this.showFunctionSelector && this.functions.size > 1) {
      const label = createElement(this.document, "label", "chord-tangent-explorer__control-label");
      label.textContent = "Curve";
      const select = createElement(this.document, "select", "chord-tangent-explorer__select");
      select.setAttribute("aria-label", "Choose a curve");
      for (const definition of this.functions.values()) {
        const option = this.document.createElement("option");
        option.value = definition.id;
        option.textContent = definition.label;
        select.append(option);
      }
      select.value = this.state.functionId;
      const listener = () => this.setFunction(select.value);
      select.addEventListener("change", listener);
      this.cleanupCallbacks.push(() => select.removeEventListener("change", listener));
      label.append(select);
      controls.append(label);
      this.functionSelect = select;
    }

    if (this.showInformationSelector) {
      const label = createElement(this.document, "label", "chord-tangent-explorer__control-label");
      label.textContent = "Numbers shown";
      const select = createElement(this.document, "select", "chord-tangent-explorer__select");
      select.setAttribute("aria-label", "Choose which numerical information is shown");
      const options = [
        ["hidden", "Visual only"],
        ["h-only", "h only"],
        ["gradients", "Gradients only"],
        ["full", "h and gradients"]
      ];
      for (const [value, text] of options) {
        const option = this.document.createElement("option");
        option.value = value;
        option.textContent = text;
        select.append(option);
      }
      select.value = this.state.informationMode;
      const listener = () => this.setInformationMode(select.value);
      select.addEventListener("change", listener);
      this.cleanupCallbacks.push(() => select.removeEventListener("change", listener));
      label.append(select);
      controls.append(label);
      this.informationSelect = select;
    }

    this.readout = createElement(this.document, "div", "chord-tangent-explorer__readout");
    this.readout.setAttribute("aria-live", "polite");
    controls.append(this.readout);

    const card = createElement(this.document, "section", "chord-tangent-explorer__card");
    const heading = createElement(this.document, "div", "chord-tangent-explorer__card-heading");
    this.titleNode = createElement(this.document, "h3", "chord-tangent-explorer__card-title");
    this.expressionNode = createElement(this.document, "p", "chord-tangent-explorer__expression");
    heading.append(this.titleNode, this.expressionNode);
    this.diagramHost = createElement(this.document, "div", "chord-tangent-explorer__diagram");
    card.append(heading, this.diagramHost);

    const guidance = createElement(this.document, "p", "chord-tangent-explorer__guidance");
    guidance.innerHTML = "Move <strong>Q</strong> towards fixed point <strong>P</strong>. Watch the chord rotate towards the tangent as <strong>h</strong> approaches 0.";

    this.root.replaceChildren(controls, card, guidance);
  }

  #renderFunction() {
    this.diagram?.destroy();
    this.controllers = {};
    const definition = this.definition;
    if (this.functionSelect) this.functionSelect.value = definition.id;
    this.titleNode.textContent = "Chord and tangent at P";
    this.expressionNode.textContent = `f(x) = ${definition.expressions?.function || definition.label}`;

    const yDomain = definition.yDomains?.function || [-10, 10];
    this.diagram = new DiagramPrimitives(this.diagramHost, {
      xDomain: definition.xDomain,
      yDomain,
      ariaLabel: `Chord-to-tangent explorer for ${definition.label}`,
      minHeight: 360,
      aspectRatio: "16 / 9"
    });
    this.diagram.grid({ xStep: 1, yStep: 2 });
    this.diagram.axes({ tickStep: 1 });
    this.controllers.curve = this.diagram.polyline(sampleFunction(definition.evaluate, definition.xDomain), { tone: "curve" });

    const state = this.getChordState();
    const xRange = definition.xDomain[1] - definition.xDomain[0];
    const yRange = yDomain[1] - yDomain[0];
    const tangentSpan = xRange * 0.46;
    const measureY = yDomain[0] + yRange * 0.09;
    const tickHeight = yRange * 0.018;

    this.controllers.chord = this.diagram.line({
      x1: state.p.x, y1: state.p.y, x2: state.q.x, y2: state.q.y, tone: "accent", className: "chord-tangent-explorer__chord"
    });
    this.controllers.tangent = this.diagram.tangent({
      x: state.p.x, y: state.p.y, slope: state.tangentGradient, span: tangentSpan, tone: "tangent"
    });
    this.controllers.pPoint = this.diagram.point({
      x: state.p.x, y: state.p.y, radius: 9, tone: "point", tooltip: "Fixed point P where the tangent is measured."
    });
    this.controllers.qHandle = this.diagram.draggablePoint({
      x: state.q.x,
      y: state.q.y,
      radius: 12,
      tone: "interactive",
      label: "Move point Q along the curve",
      tooltip: "Drag horizontally or use Left and Right arrow keys to move Q along the curve towards P.",
      xDomain: definition.xDomain,
      yDomain,
      stepX: Math.max(this.minAbsH, xRange / 160),
      stepY: 0,
      onChange: ({ x: nextX }) => {
        if (!this.syncing) this.setQX(nextX, "interaction");
      }
    });

    this.controllers.pLabel = this.diagram.label({ x: state.p.x, y: state.p.y, text: "P", dx: -26, dy: -18, anchor: "middle", tone: "point" });
    this.controllers.qLabel = this.diagram.label({ x: state.q.x, y: state.q.y, text: "Q", dx: 26, dy: 30, anchor: "middle", tone: "interactive" });

    this.controllers.pGuide = this.diagram.line({ x1: state.p.x, y1: measureY, x2: state.p.x, y2: state.p.y, tone: "muted", dashed: true });
    this.controllers.qGuide = this.diagram.line({ x1: state.q.x, y1: measureY, x2: state.q.x, y2: state.q.y, tone: "muted", dashed: true });
    this.controllers.hLine = this.diagram.line({ x1: state.p.x, y1: measureY, x2: state.q.x, y2: measureY, tone: "accent", className: "chord-tangent-explorer__h-line" });
    this.controllers.hTickP = this.diagram.line({ x1: state.p.x, y1: measureY - tickHeight, x2: state.p.x, y2: measureY + tickHeight, tone: "accent" });
    this.controllers.hTickQ = this.diagram.line({ x1: state.q.x, y1: measureY - tickHeight, x2: state.q.x, y2: measureY + tickHeight, tone: "accent" });
    this.controllers.hLabel = this.diagram.label({ x: (state.p.x + state.q.x) / 2, y: measureY, text: "h", dy: -15, tone: "accent" });

    this.geometry = { xRange, yRange, yDomain, tangentSpan, measureY, tickHeight };
    this.#syncGeometry();
  }

  #syncGeometry() {
    if (!this.diagram || this.syncing) return;
    this.syncing = true;
    const state = this.getChordState();
    const { tangentSpan, measureY, tickHeight, xRange } = this.geometry;
    const sign = state.h >= 0 ? 1 : -1;
    const close = Math.abs(state.h) < xRange * 0.12;

    this.controllers.qHandle.setPosition(state.q.x, state.q.y);
    this.controllers.chord.setCoordinates({ x1: state.p.x, y1: state.p.y, x2: state.q.x, y2: state.q.y });
    this.controllers.tangent.setPointSlope({ x: state.p.x, y: state.p.y, slope: state.tangentGradient, span: tangentSpan });
    this.controllers.pGuide.setCoordinates({ x1: state.p.x, y1: measureY, x2: state.p.x, y2: state.p.y });
    this.controllers.qGuide.setCoordinates({ x1: state.q.x, y1: measureY, x2: state.q.x, y2: state.q.y });
    this.controllers.hLine.setCoordinates({ x1: state.p.x, y1: measureY, x2: state.q.x, y2: measureY });
    this.controllers.hTickP.setCoordinates({ x1: state.p.x, y1: measureY - tickHeight, x2: state.p.x, y2: measureY + tickHeight });
    this.controllers.hTickQ.setCoordinates({ x1: state.q.x, y1: measureY - tickHeight, x2: state.q.x, y2: measureY + tickHeight });

    this.controllers.pLabel.set({
      x: state.p.x,
      y: state.p.y,
      text: "P",
      dx: sign > 0 ? -26 : 26,
      dy: -18
    });
    this.controllers.qLabel.set({
      x: state.q.x,
      y: state.q.y,
      text: "Q",
      dx: sign > 0 ? 26 : -26,
      dy: 30
    });
    this.controllers.hLabel.set({
      x: (state.p.x + state.q.x) / 2,
      y: measureY,
      text: "h",
      dx: close ? sign * 42 : 0,
      dy: -15
    });

    this.#syncReadout(state);
    this.syncing = false;
  }

  #syncReadout(state = this.getChordState()) {
    const visibility = NUMERIC_INFORMATION_MODES[this.state.informationMode];
    const items = [];
    items.push(`<span><strong>P</strong> fixed at x = ${formatChordNumber(state.p.x)}</span>`);
    items.push(visibility.h ? `<span><strong>h</strong> = ${formatChordNumber(state.h)}</span>` : `<span><strong>h</strong> is hidden</span>`);
    if (visibility.chordGradient) items.push(`<span><strong>Chord gradient</strong> = ${formatChordNumber(state.chordGradient)}</span>`);
    else items.push(`<span><strong>Chord gradient</strong> hidden</span>`);
    if (visibility.tangentGradient) items.push(`<span><strong>Tangent gradient</strong> = ${formatChordNumber(state.tangentGradient)}</span>`);
    else items.push(`<span><strong>Tangent gradient</strong> hidden</span>`);
    this.readout.innerHTML = items.join("");
    this.readout.dataset.informationMode = this.state.informationMode;
  }
}

export function createChordToTangentExplorer(root, options) {
  return new ChordToTangentExplorer(root, options);
}
