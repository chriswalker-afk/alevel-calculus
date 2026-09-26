import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js";
import { integrateFunction } from "./area-explorer.js";
import {
  createPolynomialFunctionDefinition,
  validateFunctionDefinition
} from "./linked-function-gradient-explorer.js";

const SAMPLE_LOCATIONS = Object.freeze(["left", "midpoint", "right"]);

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value, digits = 4) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(Number(value).toFixed(digits));
  return String(rounded);
}

export function normalizeRectangleCount(value, { min = 1, max = 100 } = {}) {
  return Math.round(clamp(finiteNumber(value, min), min, max));
}

export function normalizeSampleLocation(value) {
  return SAMPLE_LOCATIONS.includes(value) ? value : "midpoint";
}

export function sampleXForRectangle(left, right, sampleLocation = "midpoint") {
  const location = normalizeSampleLocation(sampleLocation);
  if (location === "left") return left;
  if (location === "right") return right;
  return (left + right) / 2;
}

export function calculateRectangleSum(definition, {
  lower = 0,
  upper = 1,
  n = 4,
  sampleLocation = "midpoint"
} = {}) {
  validateFunctionDefinition(definition);
  const [domainMin, domainMax] = normalizeDomain(definition.xDomain, [0, 1]);
  const a = clamp(finiteNumber(lower), domainMin, domainMax);
  const b = clamp(finiteNumber(upper), domainMin, domainMax);
  const count = normalizeRectangleCount(n);
  const location = normalizeSampleLocation(sampleLocation);
  const deltaX = (b - a) / count;
  const rectangles = [];
  let sum = 0;

  for (let index = 0; index < count; index += 1) {
    const x0 = a + index * deltaX;
    const x1 = a + (index + 1) * deltaX;
    const left = Math.min(x0, x1);
    const right = Math.max(x0, x1);
    const sampleX = sampleXForRectangle(x0, x1, location);
    const height = finiteNumber(definition.evaluate(sampleX));
    const contribution = height * deltaX;
    sum += contribution;
    rectangles.push(Object.freeze({
      index: index + 1,
      x0,
      x1,
      left,
      right,
      sampleX,
      height,
      contribution
    }));
  }

  const exactIntegral = integrateFunction(definition, a, b);
  return Object.freeze({
    lower: a,
    upper: b,
    n: count,
    sampleLocation: location,
    deltaX,
    rectangles: Object.freeze(rectangles),
    sum,
    exactIntegral,
    error: sum - exactIntegral,
    absoluteError: Math.abs(sum - exactIntegral)
  });
}

export function buildSumToIntegralMap(state, definition) {
  const sampleSymbol = state.sampleLocation === "left"
    ? "xₖ = a + (k−1)Δx"
    : state.sampleLocation === "right"
      ? "xₖ = a + kΔx"
      : "xₖ = a + (k−½)Δx";
  return Object.freeze({
    finiteSum: `Σₖ₌₁^${state.n} f(xₖ) Δx`,
    limitingSum: "lim n→∞ Σₖ₌₁ⁿ f(xₖ) Δx",
    integral: `∫_${formatNumber(state.lower, 3)}^${formatNumber(state.upper, 3)} f(x) dx`,
    integrand: definition.expressions?.function ? `f(x) = ${definition.expressions.function}` : "f(x)",
    lowerBound: `a = ${formatNumber(state.lower, 3)}`,
    upperBound: `b = ${formatNumber(state.upper, 3)}`,
    width: `Δx = (b−a)/n = ${formatNumber(state.deltaX, 4)}`,
    sample: sampleSymbol
  });
}

export const RECTANGLE_SUM_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "rectangle-positive-quadratic",
    label: "Quadratic: x² + 1",
    coefficients: [1, 0, 1],
    xDomain: [-0.5, 2.5],
    yDomains: { function: [-1, 7], derivative: [-2, 6], secondDerivative: [0, 3] },
    initialX: 1,
    description: "A positive increasing curve that makes left/right/midpoint sampling easy to compare."
  }),
  createPolynomialFunctionDefinition({
    id: "rectangle-linear",
    label: "Linear: x + 1",
    coefficients: [1, 1],
    xDomain: [-0.5, 3.5],
    yDomains: { function: [-1, 5], derivative: [0, 2], secondDerivative: [-1, 1] },
    initialX: 1,
    description: "A simple line where midpoint rectangles give the exact integral for every n."
  }),
  createPolynomialFunctionDefinition({
    id: "rectangle-curved",
    label: "Curve: ½x² + ½x + 1",
    coefficients: [1, 0.5, 0.5],
    xDomain: [-0.5, 3],
    yDomains: { function: [-1, 8], derivative: [-1, 4], secondDerivative: [0, 2] },
    initialX: 1,
    description: "A gently curved example for comparing convergence as n increases."
  })
]);

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

function sampleFunction(evaluator, xDomain, samples = 260) {
  const [xMin, xMax] = normalizeDomain(xDomain, [0, 4]);
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: evaluator(x) };
  }).filter(({ y }) => Number.isFinite(y));
}

function tickStep(domain) {
  const span = Math.abs(domain[1] - domain[0]);
  if (span <= 4) return 0.5;
  if (span <= 8) return 1;
  return 2;
}

export class RectangleSumExplorer {
  constructor(root, {
    functions = RECTANGLE_SUM_FUNCTIONS,
    initialFunctionId = functions[0]?.id,
    initialLower = 0,
    initialUpper = 2,
    initialN = 1,
    initialSampleLocation = "midpoint",
    maxRectangles = 100,
    showFunctionSelector = true,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("RectangleSumExplorer requires a DOM host element.");
    const validFunctions = functions.map(validateFunctionDefinition);
    if (!validFunctions.length) throw new Error("RectangleSumExplorer requires at least one function definition.");

    this.root = root;
    this.document = root.ownerDocument;
    this.functions = new Map(validFunctions.map((definition) => [definition.id, definition]));
    this.maxRectangles = Math.max(10, Math.floor(finiteNumber(maxRectangles, 100)));
    this.showFunctionSelector = Boolean(showFunctionSelector);
    this.onChange = onChange;
    this.cleanupCallbacks = [];
    this.diagram = null;
    this.controls = {};

    const initial = this.functions.get(initialFunctionId) || validFunctions[0];
    this.state = {
      functionId: initial.id,
      lower: clamp(finiteNumber(initialLower), ...initial.xDomain),
      upper: clamp(finiteNumber(initialUpper), ...initial.xDomain),
      n: normalizeRectangleCount(initialN, { max: this.maxRectangles }),
      sampleLocation: normalizeSampleLocation(initialSampleLocation)
    };
    if (Math.abs(this.state.upper - this.state.lower) < 1e-9) {
      this.state.upper = clamp(this.state.lower + (initial.xDomain[1] - initial.xDomain[0]) / 2, ...initial.xDomain);
    }

    this.#renderShell();
    this.#renderAll();
  }

  get definition() {
    return this.functions.get(this.state.functionId);
  }

  getState() {
    return { ...this.state };
  }

  getRectangleState() {
    return calculateRectangleSum(this.definition, this.state);
  }

  destroy() {
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    this.diagram?.destroy();
    this.diagram = null;
    this.root.replaceChildren();
    this.root.classList.remove("rectangle-sum-explorer");
  }

  setRectangleCount(n) {
    this.state.n = normalizeRectangleCount(n, { max: this.maxRectangles });
    this.#syncControlValues();
    this.#renderDiagramAndReadout();
  }

  setSampleLocation(sampleLocation) {
    this.state.sampleLocation = normalizeSampleLocation(sampleLocation);
    this.#syncControlValues();
    this.#renderDiagramAndReadout();
  }

  setBounds(lower, upper) {
    const [xMin, xMax] = this.definition.xDomain;
    const nextLower = clamp(finiteNumber(lower, this.state.lower), xMin, xMax);
    const nextUpper = clamp(finiteNumber(upper, this.state.upper), xMin, xMax);
    if (Math.abs(nextUpper - nextLower) < 1e-9) {
      this.#syncControlValues();
      return;
    }
    this.state.lower = nextLower;
    this.state.upper = nextUpper;
    this.#syncControlValues();
    this.#renderDiagramAndReadout();
  }

  setFunction(functionId) {
    const definition = this.functions.get(functionId);
    if (!definition) throw new Error(`Unknown function definition: ${functionId}`);
    this.state.functionId = functionId;
    const [xMin, xMax] = definition.xDomain;
    const span = Math.min(Math.abs(this.state.upper - this.state.lower), xMax - xMin);
    const centre = clamp((this.state.lower + this.state.upper) / 2, xMin, xMax);
    this.state.lower = clamp(centre - span / 2, xMin, xMax);
    this.state.upper = clamp(centre + span / 2, xMin, xMax);
    if (Math.abs(this.state.upper - this.state.lower) < 1e-9) {
      this.state.lower = xMin;
      this.state.upper = xMax;
    }
    this.#syncControlValues();
    this.#renderAll();
  }

  #renderShell() {
    this.root.classList.add("rectangle-sum-explorer");
    this.root.replaceChildren();

    const controls = createElement(this.document, "section", "rectangle-sum-explorer__controls");
    controls.setAttribute("aria-label", "Rectangle sum controls");

    if (this.showFunctionSelector) {
      const label = createElement(this.document, "label", "rectangle-sum-explorer__select-label");
      label.append("Function");
      const select = createElement(this.document, "select", "rectangle-sum-explorer__select");
      select.setAttribute("aria-label", "Function");
      for (const definition of this.functions.values()) {
        const option = this.document.createElement("option");
        option.value = definition.id;
        option.textContent = definition.label;
        select.append(option);
      }
      const listener = () => this.setFunction(select.value);
      select.addEventListener("change", listener);
      this.cleanupCallbacks.push(() => select.removeEventListener("change", listener));
      label.append(select);
      controls.append(label);
      this.controls.functionSelect = select;
    }

    const sampleLabel = createElement(this.document, "label", "rectangle-sum-explorer__select-label");
    sampleLabel.append("Sample location");
    const sampleSelect = createElement(this.document, "select", "rectangle-sum-explorer__select");
    sampleSelect.setAttribute("aria-label", "Rectangle sample location");
    for (const [value, text] of [["left", "Left endpoint"], ["midpoint", "Midpoint"], ["right", "Right endpoint"]]) {
      const option = this.document.createElement("option");
      option.value = value;
      option.textContent = text;
      sampleSelect.append(option);
    }
    const sampleListener = () => this.setSampleLocation(sampleSelect.value);
    sampleSelect.addEventListener("change", sampleListener);
    this.cleanupCallbacks.push(() => sampleSelect.removeEventListener("change", sampleListener));
    sampleLabel.append(sampleSelect);
    controls.append(sampleLabel);
    this.controls.sampleSelect = sampleSelect;

    const bounds = createElement(this.document, "div", "rectangle-sum-explorer__bounds");
    for (const [key, text] of [["lower", "Lower bound a"], ["upper", "Upper bound b"]]) {
      const label = createElement(this.document, "label", "rectangle-sum-explorer__bound-label");
      label.append(text);
      const input = createElement(this.document, "input", "rectangle-sum-explorer__number-input");
      input.type = "number";
      input.step = "0.1";
      input.setAttribute("aria-label", text);
      const listener = () => {
        const value = finiteNumber(input.value, this.state[key]);
        this.setBounds(key === "lower" ? value : this.state.lower, key === "upper" ? value : this.state.upper);
      };
      input.addEventListener("change", listener);
      this.cleanupCallbacks.push(() => input.removeEventListener("change", listener));
      label.append(input);
      bounds.append(label);
      this.controls[`${key}Input`] = input;
    }
    controls.append(bounds);

    const nControl = createElement(this.document, "div", "rectangle-sum-explorer__n-control");
    const sliderHost = createElement(this.document, "div", "rectangle-sum-explorer__n-slider-host");
    nControl.append(sliderHost);
    const presets = createElement(this.document, "div", "rectangle-sum-explorer__preset-row");
    presets.setAttribute("aria-label", "Rectangle count presets");
    for (const [value, labelText] of [[1, "1 rectangle"], [6, "Several: 6"], [30, "Many: 30"], [80, "Very many: 80"]]) {
      const button = createElement(this.document, "button", "rectangle-sum-explorer__preset");
      button.type = "button";
      button.textContent = labelText;
      button.dataset.n = String(value);
      const listener = () => this.setRectangleCount(value);
      button.addEventListener("click", listener);
      this.cleanupCallbacks.push(() => button.removeEventListener("click", listener));
      presets.append(button);
    }
    nControl.append(presets);
    controls.append(nControl);

    const card = createElement(this.document, "section", "rectangle-sum-explorer__card");
    const heading = createElement(this.document, "div", "rectangle-sum-explorer__card-heading");
    const title = createElement(this.document, "h2", "rectangle-sum-explorer__title");
    title.textContent = "Finite rectangle sum";
    const expression = createElement(this.document, "p", "rectangle-sum-explorer__expression");
    heading.append(title, expression);
    const diagramHost = createElement(this.document, "div", "rectangle-sum-explorer__diagram");
    card.append(heading, diagramHost);

    const readout = createElement(this.document, "section", "rectangle-sum-explorer__readout");
    readout.setAttribute("aria-label", "Rectangle sum values");

    const mapping = createElement(this.document, "section", "rectangle-sum-explorer__mapping");
    const mappingTitle = createElement(this.document, "h2", "rectangle-sum-explorer__mapping-title");
    mappingTitle.textContent = "How the finite sum maps to an integral";
    const formulaFlow = createElement(this.document, "div", "rectangle-sum-explorer__formula-flow");
    const componentGrid = createElement(this.document, "div", "rectangle-sum-explorer__component-grid");
    const note = createElement(this.document, "p", "rectangle-sum-explorer__note");
    note.textContent = "This is a recognition model: making rectangles thinner improves the approximation; the later course section formalises how limiting sums are recognised as definite integrals.";
    mapping.append(mappingTitle, formulaFlow, componentGrid, note);

    this.root.append(controls, card, readout, mapping);
    this.elements = { controls, sliderHost, expression, diagramHost, readout, formulaFlow, componentGrid };
  }

  #renderAll() {
    this.diagram?.destroy();
    this.controls.nSlider = null;
    this.diagram = new DiagramPrimitives(this.elements.diagramHost, {
      xDomain: this.definition.xDomain,
      yDomain: this.definition.yDomains.function,
      ariaLabel: "Curve with finite approximation rectangles",
      minHeight: 370,
      aspectRatio: "16 / 9"
    });

    if (!this.controls.nSlider) {
      const slider = this.diagram.slider({
        label: "Number of rectangles n",
        min: 1,
        max: this.maxRectangles,
        step: 1,
        value: this.state.n,
        format: (value) => String(Math.round(value)),
        onInput: (value) => this.setRectangleCount(value)
      });
      this.elements.sliderHost.replaceChildren(slider.element);
      this.controls.nSlider = slider;
    }

    this.#syncControlValues();
    this.#renderDiagramAndReadout();
  }

  #syncControlValues() {
    if (this.controls.functionSelect) this.controls.functionSelect.value = this.state.functionId;
    if (this.controls.sampleSelect) this.controls.sampleSelect.value = this.state.sampleLocation;
    if (this.controls.lowerInput) {
      this.controls.lowerInput.value = formatNumber(this.state.lower, 3);
      this.controls.lowerInput.min = String(this.definition.xDomain[0]);
      this.controls.lowerInput.max = String(this.definition.xDomain[1]);
    }
    if (this.controls.upperInput) {
      this.controls.upperInput.value = formatNumber(this.state.upper, 3);
      this.controls.upperInput.min = String(this.definition.xDomain[0]);
      this.controls.upperInput.max = String(this.definition.xDomain[1]);
    }
    if (this.controls.nSlider) {
      this.controls.nSlider.input.value = String(this.state.n);
      this.controls.nSlider.output.textContent = String(this.state.n);
    }
    for (const button of this.root.querySelectorAll?.("[data-n]") || []) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.n) === this.state.n));
    }
  }

  #renderDiagramAndReadout() {
    const state = this.getRectangleState();
    const diagram = this.diagram;
    diagram.clear();
    const xStep = tickStep(this.definition.xDomain);
    const yStep = tickStep(this.definition.yDomains.function);
    diagram.grid({ xStep, yStep });
    diagram.axes({ xLabel: "x", yLabel: "y", tickStep: Math.max(xStep, yStep) });

    for (const rectangle of state.rectangles) {
      const tone = rectangle.height >= 0 ? "rectangle-positive" : "rectangle-negative";
      const points = [
        { x: rectangle.x0, y: 0 },
        { x: rectangle.x0, y: rectangle.height },
        { x: rectangle.x1, y: rectangle.height },
        { x: rectangle.x1, y: 0 }
      ];
      const region = diagram.shadedRegion(points, { tone, opacity: state.n > 40 ? 0.13 : 0.2 });
      region.element.classList.add("rectangle-sum-explorer__rectangle");
      const outline = diagram.polyline([...points, points[0]], { tone, className: "rectangle-sum-explorer__rectangle-outline" });
      outline.element.setAttribute("vector-effect", "non-scaling-stroke");
      if (state.n <= 12) {
        diagram.point({
          x: rectangle.sampleX,
          y: rectangle.height,
          radius: state.n === 1 ? 7 : 5,
          tone: "sample",
          tooltip: `Rectangle ${rectangle.index}: sample x = ${formatNumber(rectangle.sampleX, 3)}, height = ${formatNumber(rectangle.height, 3)}`
        });
      }
    }

    diagram.polyline(sampleFunction((x) => this.definition.evaluate(x), this.definition.xDomain), {
      tone: "curve",
      className: "rectangle-sum-explorer__curve"
    });

    diagram.line({ x1: state.lower, y1: 0, x2: state.lower, y2: this.definition.yDomains.function[1], tone: "bound", dashed: true, className: "rectangle-sum-explorer__bound-guide" });
    diagram.line({ x1: state.upper, y1: 0, x2: state.upper, y2: this.definition.yDomains.function[1], tone: "bound", dashed: true, className: "rectangle-sum-explorer__bound-guide" });
    diagram.label({ x: state.lower, y: 0, text: `a=${formatNumber(state.lower, 2)}`, dx: 8, dy: -12, anchor: "start", tone: "bound", className: "rectangle-sum-explorer__bound-label-svg" });
    diagram.label({ x: state.upper, y: 0, text: `b=${formatNumber(state.upper, 2)}`, dx: -8, dy: -12, anchor: "end", tone: "bound", className: "rectangle-sum-explorer__bound-label-svg" });

    if (state.rectangles.length && state.n <= 12) {
      const first = state.rectangles[0];
      const labelY = Math.min(Math.max(first.height * 0.48, 0.5), this.definition.yDomains.function[1] - 0.5);
      diagram.label({
        x: (first.x0 + first.x1) / 2,
        y: labelY,
        text: `width Δx=${formatNumber(Math.abs(state.deltaX), 3)}`,
        dy: -8,
        tone: "sample",
        className: "rectangle-sum-explorer__width-label"
      });
    }

    this.elements.expression.textContent = `Σ f(xₖ)Δx with n=${state.n}, Δx=${formatNumber(state.deltaX, 4)}`;
    this.#renderReadout(state);
    this.#renderMapping(state);
    this.onChange(Object.freeze({ ...this.getState(), rectangleState: state }));
  }

  #renderReadout(state) {
    this.elements.readout.replaceChildren();
    const metrics = [
      ["n", String(state.n)],
      ["Δx", formatNumber(state.deltaX, 4)],
      ["Finite sum", formatNumber(state.sum, 6)],
      ["Exact integral", formatNumber(state.exactIntegral, 6)],
      ["Absolute error", formatNumber(state.absoluteError, 6)]
    ];
    for (const [labelText, value] of metrics) {
      const metric = createElement(this.document, "div", "rectangle-sum-explorer__metric");
      const label = createElement(this.document, "span");
      label.textContent = labelText;
      const strong = createElement(this.document, "strong");
      strong.textContent = value;
      metric.append(label, strong);
      this.elements.readout.append(metric);
    }
  }

  #renderMapping(state) {
    const map = buildSumToIntegralMap(state, this.definition);
    this.elements.formulaFlow.replaceChildren();
    for (const [text, className] of [
      [map.finiteSum, "finite"],
      ["→ thinner rectangles →", "arrow"],
      [map.limitingSum, "limit"],
      ["=", "arrow"],
      [map.integral, "integral"]
    ]) {
      const item = createElement(this.document, "span", `rectangle-sum-explorer__formula rectangle-sum-explorer__formula--${className}`);
      item.textContent = text;
      this.elements.formulaFlow.append(item);
    }

    this.elements.componentGrid.replaceChildren();
    const items = [
      ["Rectangle height", "f(xₖ)", map.integrand],
      ["Rectangle width", "Δx", map.width],
      ["Sample position", "xₖ", map.sample],
      ["Integral bounds", "a → b", `${map.lowerBound}; ${map.upperBound}`]
    ];
    for (const [title, symbol, detail] of items) {
      const card = createElement(this.document, "div", "rectangle-sum-explorer__component");
      const heading = createElement(this.document, "strong");
      heading.textContent = title;
      const symbolNode = createElement(this.document, "code");
      symbolNode.textContent = symbol;
      const detailNode = createElement(this.document, "span");
      detailNode.textContent = detail;
      card.append(heading, symbolNode, detailNode);
      this.elements.componentGrid.append(card);
    }
  }
}
