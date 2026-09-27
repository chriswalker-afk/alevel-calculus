import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js";

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value, digits = 2) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(digits));
  return String(rounded);
}

function formatSignedTerm(coefficient, power, variable = "x") {
  if (Math.abs(coefficient) < 1e-12) return null;
  const sign = coefficient < 0 ? "−" : "+";
  const magnitude = Math.abs(coefficient);
  let body = "";
  if (power === 0) body = formatNumber(magnitude, 4);
  else {
    const coeff = Math.abs(magnitude - 1) < 1e-12 ? "" : formatNumber(magnitude, 4);
    const exponent = power === 1 ? "" : `^${power}`;
    body = `${coeff}${variable}${exponent}`;
  }
  return { sign, body };
}

export function polynomialToText(coefficients, variable = "x") {
  const terms = [];
  coefficients.forEach((coefficient, power) => {
    const term = formatSignedTerm(finiteNumber(coefficient), power, variable);
    if (term) terms.push({ ...term, power });
  });
  if (!terms.length) return "0";
  terms.sort((a, b) => b.power - a.power);
  return terms.map((term, index) => {
    if (index === 0) return `${term.sign === "−" ? "−" : ""}${term.body}`;
    return ` ${term.sign} ${term.body}`;
  }).join("");
}

export function derivativeCoefficients(coefficients) {
  if (!Array.isArray(coefficients) || coefficients.length <= 1) return [0];
  return coefficients.slice(1).map((coefficient, powerIndex) => finiteNumber(coefficient) * (powerIndex + 1));
}

export function evaluatePolynomial(coefficients, x) {
  return [...coefficients].reverse().reduce((value, coefficient) => value * x + finiteNumber(coefficient), 0);
}

export function createPolynomialFunctionDefinition({
  id,
  label,
  coefficients,
  xDomain = [-4, 4],
  yDomains = {},
  initialX = 0,
  description = ""
}) {
  if (!id || !label || !Array.isArray(coefficients) || !coefficients.length) {
    throw new Error("Polynomial definitions require id, label and coefficients.");
  }
  const baseCoefficients = coefficients.map((value) => finiteNumber(value));
  const firstCoefficients = derivativeCoefficients(baseCoefficients);
  const secondCoefficients = derivativeCoefficients(firstCoefficients);
  const normalizedXDomain = normalizeDomain(xDomain, [-4, 4]);
  const normalizedYDomains = {
    function: normalizeDomain(yDomains.function || [-10, 10], [-10, 10]),
    derivative: normalizeDomain(yDomains.derivative || [-10, 10], [-10, 10]),
    secondDerivative: normalizeDomain(yDomains.secondDerivative || [-10, 10], [-10, 10])
  };
  return Object.freeze({
    id,
    label,
    family: "polynomial",
    description,
    xDomain: Object.freeze(normalizedXDomain),
    yDomains: Object.freeze({
      function: Object.freeze(normalizedYDomains.function),
      derivative: Object.freeze(normalizedYDomains.derivative),
      secondDerivative: Object.freeze(normalizedYDomains.secondDerivative)
    }),
    initialX: clamp(finiteNumber(initialX), ...normalizedXDomain),
    expressions: Object.freeze({
      function: polynomialToText(baseCoefficients),
      derivative: polynomialToText(firstCoefficients),
      secondDerivative: polynomialToText(secondCoefficients)
    }),
    evaluate: (x) => evaluatePolynomial(baseCoefficients, x),
    derivative: (x) => evaluatePolynomial(firstCoefficients, x),
    secondDerivative: (x) => evaluatePolynomial(secondCoefficients, x),
    coefficients: Object.freeze(baseCoefficients),
    derivativeCoefficients: Object.freeze(firstCoefficients),
    secondDerivativeCoefficients: Object.freeze(secondCoefficients)
  });
}

export function validateFunctionDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("Function definition must be an object.");
  for (const key of ["id", "label", "evaluate", "derivative"]) {
    if (!definition[key]) throw new Error(`Function definition is missing ${key}.`);
  }
  if (typeof definition.evaluate !== "function" || typeof definition.derivative !== "function") {
    throw new Error("Function definitions require evaluate(x) and derivative(x) functions.");
  }
  normalizeDomain(definition.xDomain, [-4, 4]);
  return definition;
}

export const POLYNOMIAL_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "quadratic-bowl",
    label: "Quadratic: x² − 4x + 1",
    coefficients: [1, -4, 1],
    xDomain: [-2, 6],
    yDomains: { function: [-5, 10], derivative: [-8, 8], secondDerivative: [-1, 4] },
    initialX: 1,
    description: "A quadratic with one stationary point."
  }),
  createPolynomialFunctionDefinition({
    id: "cubic-turns",
    label: "Cubic: x³ − 3x",
    coefficients: [0, -3, 0, 1],
    xDomain: [-2.4, 2.4],
    yDomains: { function: [-7, 7], derivative: [-4, 15], secondDerivative: [-15, 15] },
    initialX: -1.35,
    description: "A cubic that links gradient sign to two stationary points."
  }),
  createPolynomialFunctionDefinition({
    id: "quartic-shape",
    label: "Quartic: ¼x⁴ − 2x² + 1",
    coefficients: [1, 0, -2, 0, 0.25],
    xDomain: [-3, 3],
    yDomains: { function: [-4, 6], derivative: [-11, 11], secondDerivative: [-6, 22] },
    initialX: 1.25,
    description: "A symmetric quartic for richer gradient and concavity comparisons."
  })
]);

function sampleFunction(evaluator, xDomain, samples = 180) {
  const [xMin, xMax] = normalizeDomain(xDomain, [-4, 4]);
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: evaluator(x) };
  }).filter(({ y }) => Number.isFinite(y));
}

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

export class LinkedFunctionGradientExplorer {
  constructor(root, {
    functions = POLYNOMIAL_FUNCTIONS,
    initialFunctionId = functions[0]?.id,
    revealDerivative = false,
    revealSecondDerivative = false,
    allowSecondDerivative = true,
    showFunctionSelector = true,
    showDerivativeControls = true,
    showDerivativeReadout = true,
    derivativeSamples = [],
    derivativePanelVisible = false,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("LinkedFunctionGradientExplorer requires a DOM host element.");
    const validFunctions = functions.map(validateFunctionDefinition);
    if (!validFunctions.length) throw new Error("LinkedFunctionGradientExplorer requires at least one function definition.");
    this.root = root;
    this.document = root.ownerDocument;
    this.functions = new Map(validFunctions.map((definition) => [definition.id, definition]));
    this.allowSecondDerivative = Boolean(allowSecondDerivative);
    this.showFunctionSelector = Boolean(showFunctionSelector);
    this.showDerivativeControls = Boolean(showDerivativeControls);
    this.showDerivativeReadout = Boolean(showDerivativeReadout);
    this.derivativeSamples = Array.isArray(derivativeSamples) ? [...derivativeSamples] : [];
    this.derivativePanelVisible = Boolean(derivativePanelVisible);
    this.onChange = onChange;
    this.cleanupCallbacks = [];
    this.diagrams = new Map();
    this.controllers = {};
    this.syncing = false;
    const initial = this.functions.get(initialFunctionId) || validFunctions[0];
    this.state = {
      functionId: initial.id,
      x: initial.initialX ?? initial.xDomain?.[0] ?? 0,
      derivativeVisible: Boolean(revealDerivative || revealSecondDerivative),
      secondDerivativeVisible: Boolean(this.allowSecondDerivative && revealSecondDerivative)
    };
    this.#renderShell();
    this.#renderFunction();
  }

  get definition() {
    return this.functions.get(this.state.functionId);
  }

  getState() {
    return { ...this.state };
  }

  destroy() {
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    for (const diagram of this.diagrams.values()) diagram.destroy();
    this.diagrams.clear();
    this.root.replaceChildren();
    this.root.classList.remove("linked-gradient-explorer");
  }

  setFunction(functionId) {
    const definition = this.functions.get(functionId);
    if (!definition) throw new Error(`Unknown function definition: ${functionId}`);
    this.state.functionId = functionId;
    this.state.x = definition.initialX ?? clamp(this.state.x, ...definition.xDomain);
    this.#renderFunction();
    this.#emitChange("function");
  }

  setX(x, source = "programmatic") {
    this.state.x = clamp(finiteNumber(x, this.state.x), ...this.definition.xDomain);
    this.#syncAtX();
    this.#emitChange(source);
  }

  setDerivativeVisible(visible) {
    this.state.derivativeVisible = Boolean(visible);
    if (!this.state.derivativeVisible) this.state.secondDerivativeVisible = false;
    this.#applyVisibility();
    this.#emitChange("reveal");
  }

  setSecondDerivativeVisible(visible) {
    this.state.secondDerivativeVisible = Boolean(this.allowSecondDerivative && visible);
    if (this.state.secondDerivativeVisible) this.state.derivativeVisible = true;
    this.#applyVisibility();
    this.#emitChange("reveal");
  }

  setDerivativeSamples(xValues = []) {
    this.derivativeSamples = [...new Set((Array.isArray(xValues) ? xValues : []).map((value) =>
      clamp(finiteNumber(value, this.state.x), ...this.definition.xDomain)
    ))];
    this.derivativePanelVisible = this.derivativePanelVisible || this.derivativeSamples.length > 0;
    this.#renderDerivativeSamples();
    this.#applyVisibility();
    this.#emitChange("samples");
  }

  #emitChange(source) {
    const definition = this.definition;
    this.onChange({
      ...this.getState(),
      source,
      values: {
        function: definition.evaluate(this.state.x),
        derivative: definition.derivative(this.state.x),
        secondDerivative: typeof definition.secondDerivative === "function" ? definition.secondDerivative(this.state.x) : null
      }
    });
  }

  #renderShell() {
    this.root.classList.add("linked-gradient-explorer");
    const controls = createElement(this.document, "div", "linked-gradient-explorer__controls");

    if (this.showFunctionSelector && this.functions.size > 1) {
      const label = createElement(this.document, "label", "linked-gradient-explorer__select-label");
      label.textContent = "Function";
      const select = createElement(this.document, "select", "linked-gradient-explorer__select");
      select.setAttribute("aria-label", "Choose a function");
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

    if (this.showDerivativeControls) {
      const revealGroup = createElement(this.document, "div", "linked-gradient-explorer__reveal-group");
      revealGroup.setAttribute("aria-label", "Derivative graph controls");
      this.derivativeButton = createElement(this.document, "button", "linked-gradient-explorer__reveal-button");
      this.derivativeButton.type = "button";
      this.derivativeButton.textContent = "Reveal f′(x)";
      this.derivativeButton.addEventListener("click", () => this.setDerivativeVisible(!this.state.derivativeVisible));
      revealGroup.append(this.derivativeButton);
      if (this.allowSecondDerivative) {
        this.secondDerivativeButton = createElement(this.document, "button", "linked-gradient-explorer__reveal-button");
        this.secondDerivativeButton.type = "button";
        this.secondDerivativeButton.textContent = "Reveal f″(x)";
        this.secondDerivativeButton.addEventListener("click", () => this.setSecondDerivativeVisible(!this.state.secondDerivativeVisible));
        revealGroup.append(this.secondDerivativeButton);
      }
      controls.append(revealGroup);
    }

    this.readout = createElement(this.document, "div", "linked-gradient-explorer__readout");
    this.readout.setAttribute("aria-live", "polite");
    controls.append(this.readout);

    this.graphs = createElement(this.document, "div", "linked-gradient-explorer__graphs");
    this.graphs.setAttribute("data-graph-count", this.allowSecondDerivative ? "3" : "2");

    this.root.replaceChildren(controls, this.graphs);
  }

  #createGraphCard(kind, title, expression, yDomain) {
    const card = createElement(this.document, "section", `linked-gradient-explorer__card linked-gradient-explorer__card--${kind}`);
    card.dataset.graphKind = kind;
    const heading = createElement(this.document, "div", "linked-gradient-explorer__card-heading");
    const titleNode = createElement(this.document, "h3", "linked-gradient-explorer__card-title");
    titleNode.textContent = title;
    const expressionNode = createElement(this.document, "p", "linked-gradient-explorer__expression");
    expressionNode.textContent = expression;
    heading.append(titleNode, expressionNode);
    const host = createElement(this.document, "div", "linked-gradient-explorer__diagram");
    card.append(heading, host);
    this.graphs.append(card);
    const diagram = new DiagramPrimitives(host, {
      xDomain: this.definition.xDomain,
      yDomain,
      ariaLabel: `${title}: ${expression}`,
      minHeight: 270,
      aspectRatio: "4 / 3"
    });
    this.diagrams.set(kind, diagram);
    return { card, diagram, expressionNode };
  }

  #renderFunction() {
    for (const diagram of this.diagrams.values()) diagram.destroy();
    this.diagrams.clear();
    this.controllers = {};
    this.graphs.replaceChildren();
    const definition = this.definition;
    if (this.functionSelect) this.functionSelect.value = definition.id;

    const functionCard = this.#createGraphCard("function", "Function f(x)", `f(x) = ${definition.expressions?.function || definition.label}`, definition.yDomains?.function || [-10, 10]);
    const derivativeCard = this.#createGraphCard("derivative", "Gradient function f′(x)", `f′(x) = ${definition.expressions?.derivative || "gradient function"}`, definition.yDomains?.derivative || [-10, 10]);
    let secondCard = null;
    if (this.allowSecondDerivative && typeof definition.secondDerivative === "function") {
      secondCard = this.#createGraphCard("secondDerivative", "Second derivative f″(x)", `f″(x) = ${definition.expressions?.secondDerivative || "second derivative"}`, definition.yDomains?.secondDerivative || [-10, 10]);
    }

    for (const { diagram } of [functionCard, derivativeCard, secondCard].filter(Boolean)) {
      diagram.grid({ xStep: 1, yStep: 2 });
      diagram.axes({ tickStep: 1 });
    }

    this.controllers.functionCurve = functionCard.diagram.polyline(sampleFunction(definition.evaluate, definition.xDomain), { tone: "curve" });
    this.controllers.derivativeCurve = derivativeCard.diagram.polyline(sampleFunction(definition.derivative, definition.xDomain), { tone: "accent" });
    this.#renderDerivativeSamples();
    if (secondCard) this.controllers.secondDerivativeCurve = secondCard.diagram.polyline(sampleFunction(definition.secondDerivative, definition.xDomain), { tone: "warning" });

    const x = clamp(this.state.x, ...definition.xDomain);
    this.state.x = x;
    const y = definition.evaluate(x);
    const slope = definition.derivative(x);
    const tangentSpan = (definition.xDomain[1] - definition.xDomain[0]) * 0.38;
    this.controllers.tangent = functionCard.diagram.tangent({ x, y, slope, span: tangentSpan, tone: "tangent" });
    this.controllers.functionHandle = functionCard.diagram.draggablePoint({
      x,
      y,
      label: "Move the point along f(x)",
      tooltip: "Drag horizontally or use Left and Right arrow keys to move along the curve.",
      xDomain: definition.xDomain,
      yDomain: definition.yDomains?.function || [-10, 10],
      stepX: (definition.xDomain[1] - definition.xDomain[0]) / 80,
      stepY: 0,
      onChange: ({ x: nextX }) => {
        if (!this.syncing) this.setX(nextX, "interaction");
      }
    });
    this.controllers.functionPoint = functionCard.diagram.point({ x, y, radius: 7, tone: "point", tooltip: "Point of contact for the tangent." });
    this.controllers.derivativePoint = derivativeCard.diagram.point({ x, y: slope, radius: 9, tone: "interactive", tooltip: "Its height is the tangent gradient on f(x)." });
    if (secondCard) {
      this.controllers.secondDerivativePoint = secondCard.diagram.point({ x, y: definition.secondDerivative(x), radius: 9, tone: "warning", tooltip: "Its height is the gradient of f′(x)." });
    }
    this.#applyVisibility();
    this.#syncAtX();
  }

  #syncAtX() {
    if (!this.controllers.functionHandle) return;
    if (this.syncing) return;
    this.syncing = true;
    const definition = this.definition;
    const x = this.state.x;
    const y = definition.evaluate(x);
    const gradient = definition.derivative(x);
    const second = typeof definition.secondDerivative === "function" ? definition.secondDerivative(x) : null;
    this.controllers.functionHandle.setPosition(x, y);
    this.controllers.functionPoint.setPosition(x, y);
    this.controllers.tangent.setPointSlope({
      x,
      y,
      slope: gradient,
      span: (definition.xDomain[1] - definition.xDomain[0]) * 0.38
    });
    this.controllers.derivativePoint.setPosition(x, gradient);
    if (this.controllers.secondDerivativePoint && second !== null) this.controllers.secondDerivativePoint.setPosition(x, second);
    const derivativeReadout = this.showDerivativeReadout ? `<span data-math-render>f′(x) = ${formatNumber(gradient)}</span>` : "";
    this.readout.innerHTML = `<span data-math-render>x = ${formatNumber(x)}</span><span data-math-render>f(x) = ${formatNumber(y)}</span>${derivativeReadout}${this.state.secondDerivativeVisible && second !== null ? `<span data-math-render>f″(x) = ${formatNumber(second)}</span>` : ""}`;
    this.syncing = false;
  }

  #renderDerivativeSamples() {
    const diagram = this.diagrams.get("derivative");
    if (!diagram) return;
    for (const controller of this.controllers.derivativeSamples || []) controller.element?.remove?.();
    this.controllers.derivativeSamples = this.derivativeSamples.map((x) => diagram.point({
      x, y: this.definition.derivative(x), radius: 7, tone: "interactive",
      tooltip: `At x = ${formatNumber(x)}, the derivative height is the tangent gradient.`
    }));
  }

  #applyVisibility() {
    const derivativeCard = this.graphs.querySelector?.('[data-graph-kind="derivative"]');
    const secondCard = this.graphs.querySelector?.('[data-graph-kind="secondDerivative"]');
    if (derivativeCard) {
      const panelVisible = this.state.derivativeVisible || this.derivativePanelVisible || this.derivativeSamples.length > 0;
      derivativeCard.hidden = !panelVisible;
      derivativeCard.setAttribute("aria-hidden", panelVisible ? "false" : "true");
      if (this.controllers.derivativeCurve?.element) this.controllers.derivativeCurve.element.style.display = this.state.derivativeVisible ? "" : "none";
      if (this.controllers.derivativePoint?.element) this.controllers.derivativePoint.element.style.display = this.state.derivativeVisible ? "" : "none";
    }
    if (secondCard) {
      secondCard.hidden = !this.state.secondDerivativeVisible;
      secondCard.setAttribute("aria-hidden", this.state.secondDerivativeVisible ? "false" : "true");
    }
    this.derivativeButton?.setAttribute("aria-pressed", String(this.state.derivativeVisible));
    if (this.derivativeButton) this.derivativeButton.textContent = this.state.derivativeVisible ? "Hide f′(x)" : "Reveal f′(x)";
    if (this.secondDerivativeButton) {
      this.secondDerivativeButton.disabled = !this.state.derivativeVisible && !this.state.secondDerivativeVisible;
      this.secondDerivativeButton.setAttribute("aria-pressed", String(this.state.secondDerivativeVisible));
      this.secondDerivativeButton.textContent = this.state.secondDerivativeVisible ? "Hide f″(x)" : "Reveal f″(x)";
    }
    this.#syncAtX();
  }
}

export function createLinkedFunctionGradientExplorer(root, options) {
  return new LinkedFunctionGradientExplorer(root, options);
}

function standardExpression(kind, scale = 1, base = Math.E) {
  const s = Math.abs(scale - 1) < 1e-12 ? "" : formatNumber(scale, 4);
  const inner = s ? `${s}x` : "x";
  if (kind === "sin") return { fn: `sin(${inner})`, d: `${s || ""}cos(${inner})`.replace(/^cos/, "cos") };
  if (kind === "cos") return { fn: `cos(${inner})`, d: `−${s || ""}sin(${inner})` };
  if (kind === "exp") return { fn: `e^(${inner})`, d: `${s || ""}e^(${inner})`.replace(/^e/, "e") };
  if (kind === "ln") return { fn: `ln(${inner})`, d: "1/x" };
  const b = formatNumber(base, 4);
  return { fn: `${b}^(${inner})`, d: `${formatNumber(scale, 4)} ln(${b}) · ${b}^(${inner})` };
}

export function createStandardFunctionDefinition({ id, label, kind, scale = 1, base = Math.E, xDomain, yDomains, initialX = 0.5, description = "" }) {
  if (!["sin", "cos", "exp", "ln", "base-exp"].includes(kind)) throw new Error(`Unsupported standard-function kind: ${kind}`);
  if (!(Number.isFinite(scale) && scale > 0)) throw new Error("Standard-function scale must be positive.");
  if (kind === "base-exp" && !(Number.isFinite(base) && base > 0 && Math.abs(base - 1) > 1e-12)) throw new Error("Exponential base must be positive and not 1.");
  const evaluate = kind === "sin" ? (x) => Math.sin(scale * x)
    : kind === "cos" ? (x) => Math.cos(scale * x)
    : kind === "exp" ? (x) => Math.exp(scale * x)
    : kind === "ln" ? (x) => Math.log(scale * x)
    : (x) => Math.pow(base, scale * x);
  const derivative = kind === "sin" ? (x) => scale * Math.cos(scale * x)
    : kind === "cos" ? (x) => -scale * Math.sin(scale * x)
    : kind === "exp" ? (x) => scale * Math.exp(scale * x)
    : kind === "ln" ? (x) => 1 / x
    : (x) => scale * Math.log(base) * Math.pow(base, scale * x);
  const defaultDomain = kind === "ln" ? [0.15, 4] : kind === "exp" || kind === "base-exp" ? [-2, 2] : [-Math.PI, Math.PI];
  const domain = normalizeDomain(xDomain || defaultDomain, defaultDomain);
  const expressions = standardExpression(kind, scale, base);
  return Object.freeze({
    id, label, family: "standard", kind, scale, base, description,
    xDomain: Object.freeze(domain),
    yDomains: Object.freeze({
      function: Object.freeze(normalizeDomain(yDomains?.function || (kind === "ln" ? [-3, 2] : kind === "exp" || kind === "base-exp" ? [-1, 8] : [-1.5, 1.5]), [-10, 10])),
      derivative: Object.freeze(normalizeDomain(yDomains?.derivative || (kind === "ln" ? [-1, 7] : kind === "exp" || kind === "base-exp" ? [-2, 12] : [-3, 3]), [-10, 10]))
    }),
    initialX: clamp(initialX, ...domain),
    expressions: Object.freeze({ function: expressions.fn, derivative: expressions.d }),
    evaluate, derivative
  });
}

export const STANDARD_FUNCTIONS = Object.freeze([
  createStandardFunctionDefinition({ id:"sin-x", label:"sin x", kind:"sin", initialX:0.6 }),
  createStandardFunctionDefinition({ id:"cos-x", label:"cos x", kind:"cos", initialX:0.6 }),
  createStandardFunctionDefinition({ id:"exp-x", label:"e^x", kind:"exp", initialX:0 }),
  createStandardFunctionDefinition({ id:"ln-x", label:"ln x", kind:"ln", initialX:1 }),
  createStandardFunctionDefinition({ id:"sin-2x", label:"sin(2x)", kind:"sin", scale:2, initialX:0.6, yDomains:{derivative:[-2.5,2.5]} }),
  createStandardFunctionDefinition({ id:"cos-3x", label:"cos(3x)", kind:"cos", scale:3, initialX:0.4, yDomains:{derivative:[-3.5,3.5]} }),
  createStandardFunctionDefinition({ id:"exp-2x", label:"e^(2x)", kind:"exp", scale:2, xDomain:[-1.5,1.2], initialX:0, yDomains:{function:[-1,12],derivative:[-2,24]} }),
  createStandardFunctionDefinition({ id:"ln-2x", label:"ln(2x)", kind:"ln", scale:2, initialX:1 }),
  createStandardFunctionDefinition({ id:"two-3x", label:"2^(3x)", kind:"base-exp", scale:3, base:2, xDomain:[-1.5,1.2], initialX:0, yDomains:{function:[-1,14],derivative:[-2,30]} })
]);
