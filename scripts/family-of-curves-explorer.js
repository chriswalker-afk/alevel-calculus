import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js";
import {
  createPolynomialFunctionDefinition,
  validateFunctionDefinition
} from "./linked-function-gradient-explorer.js";

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function formatFamilyNumber(value, digits = 2) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(Number(value).toFixed(digits));
  return String(rounded);
}

export function formatConstant(value) {
  const number = finiteNumber(value);
  if (Math.abs(number) < 1e-10) return "";
  return number > 0 ? ` + ${formatFamilyNumber(number)}` : ` − ${formatFamilyNumber(Math.abs(number))}`;
}

export function evaluateFamilyMember(definition, x, constant = 0) {
  validateFunctionDefinition(definition);
  return definition.evaluate(x) + finiteNumber(constant);
}

export function evaluateSharedDerivative(definition, x) {
  validateFunctionDefinition(definition);
  return definition.derivative(x);
}

export function calculateFamilyState(definition, { x = 0, constant = 0 } = {}) {
  validateFunctionDefinition(definition);
  const safeX = clamp(finiteNumber(x), ...normalizeDomain(definition.xDomain, [-4, 4]));
  const safeConstant = finiteNumber(constant);
  return Object.freeze({
    x: safeX,
    constant: safeConstant,
    familyValue: evaluateFamilyMember(definition, safeX, safeConstant),
    derivativeValue: evaluateSharedDerivative(definition, safeX)
  });
}

export const FAMILY_OF_CURVES_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "family-quadratic",
    label: "F(x) = ½x² − 2x",
    coefficients: [0, -2, 0.5],
    xDomain: [-4, 6],
    yDomains: { function: [-8, 22], derivative: [-7, 5], secondDerivative: [0, 2] },
    initialX: 2,
    description: "A quadratic antiderivative family with a linear shared derivative."
  }),
  createPolynomialFunctionDefinition({
    id: "family-cubic",
    label: "F(x) = ⅓x³ − x",
    coefficients: [0, -1, 0, 1 / 3],
    xDomain: [-3, 3],
    yDomains: { function: [-11, 11], derivative: [-2, 8], secondDerivative: [-7, 7] },
    initialX: 1,
    description: "A cubic antiderivative family with a quadratic shared derivative."
  }),
  createPolynomialFunctionDefinition({
    id: "family-quartic",
    label: "F(x) = ¼x⁴ − x²",
    coefficients: [0, 0, -1, 0, 0.25],
    xDomain: [-2.4, 2.4],
    yDomains: { function: [-6, 7], derivative: [-9, 9], secondDerivative: [-4, 15] },
    initialX: 1,
    description: "A quartic antiderivative family with a cubic shared derivative."
  })
]);

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

function sampleFunction(evaluator, xDomain, samples = 220) {
  const [xMin, xMax] = normalizeDomain(xDomain, [-4, 4]);
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: evaluator(x) };
  }).filter(({ y }) => Number.isFinite(y));
}

function normalizeComparisonValues(values, range) {
  const [min, max] = normalizeDomain(range, [-4, 4]);
  const seen = new Set();
  const normalized = [];
  for (const value of values || []) {
    const number = clamp(finiteNumber(value), min, max);
    const key = number.toFixed(8);
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(number);
    }
  }
  return normalized;
}

export class FamilyOfCurvesExplorer {
  constructor(root, {
    functions = FAMILY_OF_CURVES_FUNCTIONS,
    initialFunctionId = functions[0]?.id,
    initialConstant = 0,
    constantRange = [-4, 4],
    constantStep = 0.25,
    comparisonConstants = [-3, 0, 3],
    showFunctionSelector = true,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("FamilyOfCurvesExplorer requires a DOM host element.");
    const validFunctions = functions.map(validateFunctionDefinition);
    if (!validFunctions.length) throw new Error("FamilyOfCurvesExplorer requires at least one function definition.");

    this.root = root;
    this.document = root.ownerDocument;
    this.functions = new Map(validFunctions.map((definition) => [definition.id, definition]));
    this.constantRange = normalizeDomain(constantRange, [-4, 4]);
    this.constantStep = Math.max(0.01, Math.abs(finiteNumber(constantStep, 0.25)));
    this.comparisonConstants = normalizeComparisonValues(comparisonConstants, this.constantRange);
    this.showFunctionSelector = Boolean(showFunctionSelector);
    this.onChange = onChange;
    this.cleanupCallbacks = [];
    this.diagrams = new Map();
    this.controllers = {};

    const initialDefinition = this.functions.get(initialFunctionId) || validFunctions[0];
    this.state = {
      functionId: initialDefinition.id,
      constant: clamp(finiteNumber(initialConstant), ...this.constantRange)
    };

    this.#renderShell();
    this.#renderFunction();
  }

  get definition() {
    return this.functions.get(this.state.functionId);
  }

  getState() {
    return {
      ...this.state,
      comparisonConstants: [...this.comparisonConstants]
    };
  }

  getFamilyState(x = this.definition.initialX ?? 0) {
    return calculateFamilyState(this.definition, { x, constant: this.state.constant });
  }

  destroy() {
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    for (const diagram of this.diagrams.values()) diagram.destroy();
    this.diagrams.clear();
    this.root.replaceChildren();
    this.root.classList.remove("family-curves-explorer");
  }

  setFunction(functionId) {
    const definition = this.functions.get(functionId);
    if (!definition) throw new Error(`Unknown function definition: ${functionId}`);
    this.state.functionId = functionId;
    this.#renderFunction();
    this.#emitChange("function");
  }

  setConstant(constant, source = "programmatic") {
    this.state.constant = clamp(finiteNumber(constant, this.state.constant), ...this.constantRange);
    this.#syncActiveCurve();
    this.#syncReadout();
    this.#emitChange(source);
  }

  setComparisonConstants(values) {
    this.comparisonConstants = normalizeComparisonValues(values, this.constantRange);
    this.#renderFunction();
    this.#emitChange("comparison-constants");
  }

  reset() {
    this.setConstant(0, "reset");
  }

  #emitChange(source) {
    this.onChange({
      ...this.getState(),
      source,
      values: this.getFamilyState()
    });
  }

  #renderShell() {
    this.root.classList.add("family-curves-explorer");
    const controls = createElement(this.document, "div", "family-curves-explorer__controls");

    if (this.showFunctionSelector && this.functions.size > 1) {
      const label = createElement(this.document, "label", "family-curves-explorer__select-label");
      label.textContent = "Family";
      const select = createElement(this.document, "select", "family-curves-explorer__select");
      select.setAttribute("aria-label", "Choose a function family");
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
      this.functionSelect = select;
    }

    this.sliderHost = createElement(this.document, "div", "family-curves-explorer__slider-host");
    controls.append(this.sliderHost);

    const resetButton = createElement(this.document, "button", "family-curves-explorer__reset");
    resetButton.type = "button";
    resetButton.textContent = "Reset C";
    const resetListener = () => this.reset();
    resetButton.addEventListener("click", resetListener);
    this.cleanupCallbacks.push(() => resetButton.removeEventListener("click", resetListener));
    controls.append(resetButton);

    this.readout = createElement(this.document, "div", "family-curves-explorer__readout");
    this.readout.setAttribute("aria-live", "polite");
    controls.append(this.readout);

    const graphGrid = createElement(this.document, "div", "family-curves-explorer__graphs");
    this.familyCard = this.#createCard("Family", "F(x) + C");
    this.derivativeCard = this.#createCard("Shared derivative", "F′(x)");
    graphGrid.append(this.familyCard.card, this.derivativeCard.card);

    const message = createElement(this.document, "p", "family-curves-explorer__message");
    message.innerHTML = "Changing <strong>C</strong> moves the whole curve vertically without changing its shape. Every member of the family has the <strong>same derivative</strong>.";

    const legend = createElement(this.document, "div", "family-curves-explorer__legend");
    legend.setAttribute("aria-label", "Comparison curve legend");
    this.legend = legend;

    this.root.replaceChildren(controls, graphGrid, legend, message);
  }

  #createCard(title, expression) {
    const card = createElement(this.document, "section", "family-curves-explorer__card");
    const heading = createElement(this.document, "div", "family-curves-explorer__card-heading");
    const titleNode = createElement(this.document, "h3", "family-curves-explorer__card-title");
    titleNode.textContent = title;
    const expressionNode = createElement(this.document, "p", "family-curves-explorer__expression");
    expressionNode.textContent = expression;
    heading.append(titleNode, expressionNode);
    const host = createElement(this.document, "div", "family-curves-explorer__diagram");
    card.append(heading, host);
    return { card, titleNode, expressionNode, host };
  }

  #renderFunction() {
    for (const diagram of this.diagrams.values()) diagram.destroy();
    this.diagrams.clear();
    this.controllers = {};
    const definition = this.definition;
    if (this.functionSelect) {
      this.functionSelect.value = definition.id;
      this.functionSelect.setAttribute("aria-label", `Choose a function family. Current: ${definition.label}`);
    }

    const baseExpression = definition.expressions?.function || definition.label;
    const derivativeExpression = definition.expressions?.derivative || "F′(x)";
    this.familyCard.expressionNode.textContent = `${baseExpression} + C`;
    this.derivativeCard.expressionNode.textContent = `F′(x) = ${derivativeExpression} — unchanged for every C`;

    const familyDiagram = new DiagramPrimitives(this.familyCard.host, {
      xDomain: definition.xDomain,
      yDomain: definition.yDomains?.function || [-10, 10],
      ariaLabel: `Family of vertically translated curves for ${definition.label}`,
      minHeight: 360,
      aspectRatio: "16 / 9"
    });
    familyDiagram.grid({ xStep: 1, yStep: 2 });
    familyDiagram.axes({ tickStep: 1 });

    const derivativeDiagram = new DiagramPrimitives(this.derivativeCard.host, {
      xDomain: definition.xDomain,
      yDomain: definition.yDomains?.derivative || [-10, 10],
      ariaLabel: `Shared derivative for every member of ${definition.label}`,
      minHeight: 360,
      aspectRatio: "16 / 9"
    });
    derivativeDiagram.grid({ xStep: 1, yStep: 2 });
    derivativeDiagram.axes({ tickStep: 1 });

    this.diagrams.set("family", familyDiagram);
    this.diagrams.set("derivative", derivativeDiagram);

    this.controllers.comparisons = this.comparisonConstants.map((constant) => {
      const curve = familyDiagram.polyline(
        sampleFunction((x) => evaluateFamilyMember(definition, x, constant), definition.xDomain),
        { tone: "curve", className: "family-curves-explorer__comparison-curve" }
      );
      curve.element.dataset.constant = String(constant);
      return { constant, curve };
    });

    this.controllers.activeCurve = familyDiagram.polyline(
      sampleFunction((x) => evaluateFamilyMember(definition, x, this.state.constant), definition.xDomain),
      { tone: "interactive", className: "family-curves-explorer__active-curve" }
    );

    this.controllers.derivativeCurve = derivativeDiagram.polyline(
      sampleFunction((x) => evaluateSharedDerivative(definition, x), definition.xDomain),
      { tone: "tangent", className: "family-curves-explorer__derivative-curve" }
    );

    const derivativeLabelX = definition.xDomain[1] - (definition.xDomain[1] - definition.xDomain[0]) * 0.08;
    const derivativeLabelY = evaluateSharedDerivative(definition, derivativeLabelX);
    if (Number.isFinite(derivativeLabelY)) {
      derivativeDiagram.label({
        x: derivativeLabelX,
        y: derivativeLabelY,
        text: "same for every C",
        dx: -8,
        dy: -18,
        anchor: "end",
        tone: "tangent"
      });
    }

    this.sliderHost.replaceChildren();
    this.constantSlider = familyDiagram.slider({
      label: "Vertical translation C",
      min: this.constantRange[0],
      max: this.constantRange[1],
      step: this.constantStep,
      value: this.state.constant,
      format: (value) => formatFamilyNumber(value),
      onInput: (value) => this.setConstant(value, "slider")
    });
    this.sliderHost.append(this.constantSlider.element);

    this.#renderLegend();
    this.#syncReadout();
  }

  #syncActiveCurve() {
    const controller = this.controllers.activeCurve;
    if (!controller) return;
    controller.setPoints(sampleFunction(
      (x) => evaluateFamilyMember(this.definition, x, this.state.constant),
      this.definition.xDomain
    ));
    if (this.constantSlider && Number(this.constantSlider.input.value) !== this.state.constant) {
      this.constantSlider.input.value = String(this.state.constant);
      this.constantSlider.output.textContent = formatFamilyNumber(this.state.constant);
    }
    this.#renderLegend();
  }

  #renderLegend() {
    if (!this.legend) return;
    const items = [];
    const active = createElement(this.document, "span", "family-curves-explorer__legend-item family-curves-explorer__legend-item--active");
    active.textContent = `Current: F(x)${formatConstant(this.state.constant) || " + 0"}`;
    items.push(active);
    for (const constant of this.comparisonConstants) {
      const item = createElement(this.document, "span", "family-curves-explorer__legend-item family-curves-explorer__legend-item--comparison");
      item.textContent = `Compare: F(x)${formatConstant(constant) || " + 0"}`;
      items.push(item);
    }
    const derivative = createElement(this.document, "span", "family-curves-explorer__legend-item family-curves-explorer__legend-item--derivative");
    derivative.textContent = "Derivative: one unchanged curve";
    items.push(derivative);
    this.legend.replaceChildren(...items);
  }

  #syncReadout() {
    const expression = this.definition.expressions?.function || "F(x)";
    const derivative = this.definition.expressions?.derivative || "F′(x)";
    this.readout.replaceChildren();
    const cChip = createElement(this.document, "span");
    cChip.textContent = `C = ${formatFamilyNumber(this.state.constant)}`;
    const familyChip = createElement(this.document, "span");
    familyChip.textContent = `${expression}${formatConstant(this.state.constant) || " + 0"}`;
    const derivativeChip = createElement(this.document, "span");
    derivativeChip.textContent = `F′(x) = ${derivative}`;
    this.readout.append(cChip, familyChip, derivativeChip);
  }
}

export function createFamilyOfCurvesExplorer(root, options) {
  return new FamilyOfCurvesExplorer(root, options);
}
