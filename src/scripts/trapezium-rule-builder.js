import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js";
import { integrateFunction } from "./area-explorer.js";
import { createPolynomialFunctionDefinition, validateFunctionDefinition } from "./linked-function-gradient-explorer.js";

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value, digits = 4) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(Number(value).toFixed(digits));
  return String(rounded);
}

export function normalizeTrapeziumCount(value, { min = 1, max = 24 } = {}) {
  return Math.round(clamp(finiteNumber(value, min), min, max));
}

export function calculateTrapeziumRule(definition, { lower = 0, upper = 1, n = 2 } = {}) {
  validateFunctionDefinition(definition);
  const [xMin, xMax] = normalizeDomain(definition.xDomain, [0, 1]);
  const a = clamp(finiteNumber(lower), xMin, xMax);
  const b = clamp(finiteNumber(upper), xMin, xMax);
  const count = normalizeTrapeziumCount(n);
  const h = (b - a) / count;
  const ordinates = Array.from({ length: count + 1 }, (_, index) => {
    const x = a + index * h;
    return Object.freeze({ index, x, y: finiteNumber(definition.evaluate(x)) });
  });
  const trapezia = Array.from({ length: count }, (_, index) => {
    const left = ordinates[index];
    const right = ordinates[index + 1];
    const area = (h / 2) * (left.y + right.y);
    return Object.freeze({ index: index + 1, left, right, area });
  });
  const estimate = trapezia.reduce((sum, trapezium) => sum + trapezium.area, 0);
  const exactIntegral = integrateFunction(definition, a, b);
  const absoluteError = Math.abs(estimate - exactIntegral);
  const percentageError = Math.abs(exactIntegral) > 1e-12 ? absoluteError / Math.abs(exactIntegral) * 100 : null;
  return Object.freeze({ lower: a, upper: b, n: count, h, ordinates: Object.freeze(ordinates), trapezia: Object.freeze(trapezia), estimate, exactIntegral, absoluteError, percentageError });
}

export function buildLongWayTerms(state) {
  return Object.freeze(state.trapezia.map((trap) => `½h(y${trap.left.index}+y${trap.right.index})`));
}

export function buildCoefficientSummary(state) {
  const coefficients = state.ordinates.map((ordinate, index) => index === 0 || index === state.ordinates.length - 1 ? 1 : 2);
  return Object.freeze({ coefficients: Object.freeze(coefficients), expression: coefficients.map((coefficient, index) => coefficient === 1 ? `y${index}` : `2y${index}`).join(" + ") });
}

export function buildOrdinateTable(state, { digits = 4 } = {}) {
  const coefficients = buildCoefficientSummary(state).coefficients;
  return Object.freeze(state.ordinates.map((ordinate, index) => Object.freeze({
    index,
    label: `y${index}`,
    x: Number(ordinate.x.toFixed(digits)),
    y: Number(ordinate.y.toFixed(digits)),
    coefficient: coefficients[index]
  })));
}

export function classifyTrapeziumBound(definition, lower, upper, { samples = 240, tolerance = 1e-7 } = {}) {
  if (typeof definition.secondDerivative !== "function") return Object.freeze({ kind: "unknown", reason: "No second derivative is available for this function." });
  const a = Math.min(lower, upper);
  const b = Math.max(lower, upper);
  let sawPositive = false;
  let sawNegative = false;
  for (let index = 0; index <= samples; index += 1) {
    const x = a + (index / samples) * (b - a);
    const value = finiteNumber(definition.secondDerivative(x), NaN);
    if (!Number.isFinite(value)) return Object.freeze({ kind: "unknown", reason: "Concavity could not be established across the whole interval." });
    if (value > tolerance) sawPositive = true;
    if (value < -tolerance) sawNegative = true;
    if (sawPositive && sawNegative) return Object.freeze({ kind: "mixed", reason: "Concavity changes on this interval, so no whole-interval over/under bound is justified." });
  }
  if (sawPositive && !sawNegative) return Object.freeze({ kind: "overestimate", reason: "The curve is convex on this interval, so its chords lie above the curve." });
  if (sawNegative && !sawPositive) return Object.freeze({ kind: "underestimate", reason: "The curve is concave on this interval, so its chords lie below the curve." });
  return Object.freeze({ kind: "exact-or-flat", reason: "The second derivative is zero throughout this interval, so the chord model is exact for a linear curve." });
}

export const TRAPEZIUM_RULE_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "trapezium-convex", label: "Convex: x² + 1", coefficients: [1, 0, 1], xDomain: [0, 4],
    yDomains: { function: [0, 18], derivative: [0, 9], secondDerivative: [0, 3] }, initialX: 2,
    description: "A convex curve: trapezium chords sit above the curve on the whole interval."
  }),
  createPolynomialFunctionDefinition({
    id: "trapezium-concave", label: "Concave: 8 − x²/2", coefficients: [8, 0, -0.5], xDomain: [0, 3.5],
    yDomains: { function: [0, 9], derivative: [-4, 1], secondDerivative: [-2, 0] }, initialX: 1.5,
    description: "A concave curve: trapezium chords sit below the curve on the whole interval."
  }),
  createPolynomialFunctionDefinition({
    id: "trapezium-inflection", label: "Changing concavity: x³ − 3x² + 3x + 2", coefficients: [2, 3, -3, 1], xDomain: [0, 3],
    yDomains: { function: [0, 7], derivative: [-1, 5], secondDerivative: [-7, 7] }, initialX: 1.5,
    description: "Concavity changes, so a whole-interval over/under claim is not justified."
  })
]);

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

function sampleFunction(evaluator, xDomain, samples = 280) {
  const [xMin, xMax] = normalizeDomain(xDomain, [0, 4]);
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + index / samples * (xMax - xMin);
    return { x, y: evaluator(x) };
  }).filter(({ y }) => Number.isFinite(y));
}

export class TrapeziumRuleBuilder {
  constructor(root, { functions = TRAPEZIUM_RULE_FUNCTIONS, initialFunctionId = functions[0]?.id, initialLower = 0, initialUpper = 3, initialN = 1, maxTrapezia = 24, onChange = () => {} } = {}) {
    if (!root?.ownerDocument) throw new Error("TrapeziumRuleBuilder requires a DOM host element.");
    const validFunctions = functions.map(validateFunctionDefinition);
    if (!validFunctions.length) throw new Error("TrapeziumRuleBuilder requires at least one function definition.");
    this.root = root; this.document = root.ownerDocument; this.functions = new Map(validFunctions.map((definition) => [definition.id, definition]));
    this.maxTrapezia = Math.max(3, Math.floor(maxTrapezia)); this.onChange = onChange; this.diagram = null; this.cleanupCallbacks = [];
    const initial = this.functions.get(initialFunctionId) || validFunctions[0];
    this.state = { functionId: initial.id, lower: initialLower, upper: initialUpper, n: normalizeTrapeziumCount(initialN, { max: this.maxTrapezia }), revealFormula: false };
    this.#renderShell(); this.#renderAll();
  }
  get definition() { return this.functions.get(this.state.functionId); }
  getState() { return { ...this.state }; }
  getTrapeziumState() { return calculateTrapeziumRule(this.definition, this.state); }
  destroy() { for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup(); this.diagram?.destroy(); this.root.replaceChildren(); this.root.classList.remove("trapezium-rule-builder"); }
  setCount(value) { this.state.n = normalizeTrapeziumCount(value, { max: this.maxTrapezia }); if (this.state.n > 3) this.state.revealFormula = true; this.#renderAll(); }
  #renderShell() {
    this.root.classList.add("trapezium-rule-builder");
    this.root.innerHTML = `
      <section class="trapezium-rule-builder__controls" aria-label="Trapezium rule controls">
        <label>Function <select data-role="function"></select></label>
        <label>Number of trapezia n <input data-role="n" type="range" min="1" max="${this.maxTrapezia}" step="1"><output data-role="n-output"></output></label>
        <div class="trapezium-rule-builder__presets" aria-label="Build the rule in stages">
          <button type="button" data-n="1">One trapezium</button><button type="button" data-n="2">Two: add the long way</button><button type="button" data-n="3">Three: spot repeats</button><button type="button" data-n="8">Full rule</button>
        </div>
      </section>
      <section class="trapezium-rule-builder__grid">
        <div class="trapezium-rule-builder__card"><div data-role="diagram"></div></div>
        <div class="trapezium-rule-builder__card"><h2>Build the rule</h2><div data-role="working"></div></div>
      </section>`;
    const select = this.root.querySelector('[data-role="function"]');
    for (const definition of this.functions.values()) { const option = this.document.createElement("option"); option.value = definition.id; option.textContent = definition.label; select.append(option); }
    select.value = this.state.functionId;
    const nInput = this.root.querySelector('[data-role="n"]'); nInput.value = String(this.state.n);
    const onSelect = () => { this.state.functionId = select.value; const [a,b] = this.definition.xDomain; this.state.lower = a; this.state.upper = b; this.#renderAll(); };
    const onN = () => this.setCount(nInput.value);
    select.addEventListener("change", onSelect); nInput.addEventListener("input", onN);
    this.cleanupCallbacks.push(() => select.removeEventListener("change", onSelect), () => nInput.removeEventListener("input", onN));
    this.root.querySelectorAll("[data-n]").forEach((button) => { const handler = () => this.setCount(button.dataset.n); button.addEventListener("click", handler); this.cleanupCallbacks.push(() => button.removeEventListener("click", handler)); });
  }
  #renderAll() {
    this.root.querySelector('[data-role="n"]').value = String(this.state.n);
    this.root.querySelector('[data-role="n-output"]').textContent = String(this.state.n);
    this.root.querySelectorAll("[data-n]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.n) === this.state.n)));
    const host = this.root.querySelector('[data-role="diagram"]'); this.diagram?.destroy(); host.replaceChildren();
    this.diagram = new DiagramPrimitives(host, { xDomain: this.definition.xDomain, yDomain: this.definition.yDomains.function, ariaLabel: "Trapezium-rule approximation graph" });
    this.diagram.grid({ xStep: 1, yStep: 2 }); this.diagram.axes();
    const state = this.getTrapeziumState();
    for (const trap of state.trapezia) {
      this.diagram.shadedRegion([{ x: trap.left.x, y: 0 }, { x: trap.left.x, y: trap.left.y }, { x: trap.right.x, y: trap.right.y }, { x: trap.right.x, y: 0 }], { tone: "trapezium", opacity: 0.16 });
      this.diagram.line({ x1: trap.left.x, y1: trap.left.y, x2: trap.right.x, y2: trap.right.y, tone: "trapezium", className: "trapezium-rule-builder__chord" });
    }
    this.diagram.polyline(sampleFunction((x) => this.definition.evaluate(x), this.definition.xDomain), { tone: "curve", className: "trapezium-rule-builder__curve" });
    for (const ordinate of state.ordinates) {
      const interior = ordinate.index > 0 && ordinate.index < state.ordinates.length - 1;
      this.diagram.line({ x1: ordinate.x, y1: 0, x2: ordinate.x, y2: ordinate.y, tone: interior ? "repeated" : "bound", className: "trapezium-rule-builder__ordinate" });
      this.diagram.label({ x: ordinate.x, y: 0, text: `y${ordinate.index}`, anchor: "middle", dy: 18, tone: interior ? "repeated" : "bound" });
    }
    this.#renderWorking(state); this.onChange(this.getState(), state);
  }
  #renderWorking(state) {
    const host = this.root.querySelector('[data-role="working"]');
    const terms = buildLongWayTerms(state); const summary = buildCoefficientSummary(state); const bound = classifyTrapeziumBound(this.definition, state.lower, state.upper);
    const longWay = terms.map((term, index) => `<div class="trapezium-rule-builder__term"><span>T${index + 1}</span><code>${term}</code></div>`).join("");
    const formula = state.n >= 3 || this.state.revealFormula ? `<div class="trapezium-rule-builder__formula"><strong>Repeated interior ordinates give coefficient 2:</strong><code>${summary.expression}</code><code>∫ ≈ (h/2)[y₀ + yₙ + 2(y₁ + … + yₙ₋₁)]</code></div>` : `<p class="trapezium-rule-builder__prompt">Add the trapezia first. Which interior ordinates appear twice?</p>`;
    const pct = state.percentageError == null ? "not defined" : `${formatNumber(state.percentageError, 3)}%`;
    host.innerHTML = `<div class="trapezium-rule-builder__recap"><strong>One trapezium:</strong> A = ½(a+b)h. Rotated under a curve, the parallel sides are neighbouring vertical ordinates.</div>
      <div class="trapezium-rule-builder__metric-row"><div><span>h=(b−a)/n</span><strong>${formatNumber(state.h)}</strong></div><div><span>Estimate</span><strong>${formatNumber(state.estimate)}</strong></div><div><span>Exact integral</span><strong>${formatNumber(state.exactIntegral)}</strong></div><div><span>Percentage error</span><strong>${pct}</strong></div></div>
      <div class="trapezium-rule-builder__long-way"><h3>Add them the long way</h3>${longWay}</div>${formula}
      <aside class="trapezium-rule-builder__bound trapezium-rule-builder__bound--${bound.kind}"><strong>${bound.kind.replaceAll("-", " ")}</strong><span>${bound.reason}</span>${bound.kind === "overestimate" ? `<span>So exact integral &lt; trapezium estimate.</span>` : bound.kind === "underestimate" ? `<span>So exact integral &gt; trapezium estimate.</span>` : ""}</aside>`;
  }
}

export function createTrapeziumRuleBuilder(root, options) { return new TrapeziumRuleBuilder(root, options); }
