import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js?v=diagramfix3";
import {
  createPolynomialFunctionDefinition,
  validateFunctionDefinition
} from "./linked-function-gradient-explorer.js";

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function formatAreaNumber(value, digits = 3) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(Number(value).toFixed(digits));
  return String(rounded);
}

export function integrateFunction(definition, lower, upper, { subdivisions = 1024 } = {}) {
  validateFunctionDefinition(definition);
  const a = finiteNumber(lower);
  const b = finiteNumber(upper);
  if (Math.abs(b - a) < 1e-12) return 0;
  if (typeof definition.integral === "function") return finiteNumber(definition.integral(a, b));

  const direction = b >= a ? 1 : -1;
  const start = direction > 0 ? a : b;
  const end = direction > 0 ? b : a;
  let n = Math.max(32, Math.floor(Math.abs(finiteNumber(subdivisions, 1024))));
  if (n % 2 !== 0) n += 1;
  const h = (end - start) / n;
  let total = definition.evaluate(start) + definition.evaluate(end);
  for (let index = 1; index < n; index += 1) {
    const x = start + index * h;
    total += (index % 2 === 0 ? 2 : 4) * definition.evaluate(x);
  }
  return direction * (h / 3) * total;
}

function bisectionRoot(definition, left, right, tolerance = 1e-9, iterations = 80) {
  let a = left;
  let b = right;
  let fa = definition.evaluate(a);
  let fb = definition.evaluate(b);
  if (Math.abs(fa) <= tolerance) return a;
  if (Math.abs(fb) <= tolerance) return b;
  for (let index = 0; index < iterations; index += 1) {
    const mid = (a + b) / 2;
    const fm = definition.evaluate(mid);
    if (Math.abs(fm) <= tolerance || Math.abs(b - a) <= tolerance) return mid;
    if (fa * fm <= 0) {
      b = mid;
      fb = fm;
    } else {
      a = mid;
      fa = fm;
    }
  }
  return (a + b) / 2;
}

function dedupeSorted(values, tolerance = 1e-5) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  const result = [];
  for (const value of sorted) {
    if (!result.length || Math.abs(value - result[result.length - 1]) > tolerance) result.push(value);
  }
  return result;
}

export function findRoots(definition, lower, upper, { samples = 720, tolerance = 1e-7 } = {}) {
  validateFunctionDefinition(definition);
  const start = Math.min(finiteNumber(lower), finiteNumber(upper));
  const end = Math.max(finiteNumber(lower), finiteNumber(upper));
  if (Math.abs(end - start) < tolerance) return [];
  const roots = [];
  let previousX = start;
  let previousY = definition.evaluate(previousX);
  if (Math.abs(previousY) <= tolerance) roots.push(previousX);

  for (let index = 1; index <= samples; index += 1) {
    const x = start + (index / samples) * (end - start);
    const y = definition.evaluate(x);
    if (Math.abs(y) <= tolerance) roots.push(x);
    if (Number.isFinite(previousY) && Number.isFinite(y) && previousY * y < 0) {
      roots.push(bisectionRoot(definition, previousX, x, tolerance));
    }
    previousX = x;
    previousY = y;
  }
  return dedupeSorted(roots, Math.max(tolerance * 20, (end - start) / (samples * 4)));
}

export function normalizeSplitPoints(points, lower, upper, xDomain) {
  const [domainMin, domainMax] = normalizeDomain(xDomain, [Math.min(lower, upper), Math.max(lower, upper)]);
  const min = Math.max(domainMin, Math.min(lower, upper));
  const max = Math.min(domainMax, Math.max(lower, upper));
  return dedupeSorted((points || []).map((value) => clamp(finiteNumber(value), min, max)))
    .filter((value) => value > min + 1e-7 && value < max - 1e-7);
}

export function calculateAreaState(definition, {
  lower = 0,
  upper = 1,
  splitPoints = []
} = {}) {
  validateFunctionDefinition(definition);
  const [xMin, xMax] = normalizeDomain(definition.xDomain, [-4, 4]);
  const a = clamp(finiteNumber(lower), xMin, xMax);
  const b = clamp(finiteNumber(upper), xMin, xMax);
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  const roots = findRoots(definition, start, end);
  const splits = normalizeSplitPoints(splitPoints, start, end, [xMin, xMax]);
  const boundaries = dedupeSorted([start, ...roots, ...splits, end]);
  const regions = [];
  let geometricArea = 0;

  for (let index = 0; index < boundaries.length - 1; index += 1) {
    const left = boundaries[index];
    const right = boundaries[index + 1];
    if (right - left < 1e-9) continue;
    const signedIntegral = integrateFunction(definition, left, right);
    const mid = (left + right) / 2;
    const sign = definition.evaluate(mid) >= 0 ? "positive" : "negative";
    geometricArea += Math.abs(signedIntegral);
    regions.push(Object.freeze({ left, right, signedIntegral, sign }));
  }

  return Object.freeze({
    lower: a,
    upper: b,
    orientation: b >= a ? 1 : -1,
    roots: Object.freeze(roots),
    splitPoints: Object.freeze(splits),
    boundaries: Object.freeze(boundaries),
    regions: Object.freeze(regions),
    integral: integrateFunction(definition, a, b),
    geometricArea
  });
}

export const AREA_EXPLORER_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "area-quadratic-crossing",
    label: "Quadratic: x² − 1",
    coefficients: [-1, 0, 1],
    xDomain: [-3, 3],
    yDomains: { function: [-2, 9], derivative: [-7, 7], secondDerivative: [0, 3] },
    initialX: 0,
    description: "Crosses the axis twice, so signed area and geometrical area differ."
  }),
  createPolynomialFunctionDefinition({
    id: "area-cubic-crossing",
    label: "Cubic: x³ − 4x",
    coefficients: [0, -4, 0, 1],
    xDomain: [-3, 3],
    yDomains: { function: [-16, 16], derivative: [-5, 24], secondDerivative: [-20, 20] },
    initialX: 0,
    description: "Three roots create alternating positive and negative signed regions."
  }),
  createPolynomialFunctionDefinition({
    id: "area-positive-quadratic",
    label: "Positive curve: ½x² + 1",
    coefficients: [1, 0, 0.5],
    xDomain: [-3, 3],
    yDomains: { function: [-1, 7], derivative: [-4, 4], secondDerivative: [0, 2] },
    initialX: 0,
    description: "Stays above the axis so definite integral and geometrical area agree for forward limits."
  })
]);

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

function sampleFunction(evaluator, xDomain, samples = 280) {
  const [xMin, xMax] = normalizeDomain(xDomain, [-4, 4]);
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: evaluator(x) };
  }).filter(({ y }) => Number.isFinite(y));
}

function sampleRegion(definition, left, right, samples = 80) {
  const points = [{ x: left, y: 0 }];
  for (let index = 0; index <= samples; index += 1) {
    const x = left + (index / samples) * (right - left);
    points.push({ x, y: definition.evaluate(x) });
  }
  points.push({ x: right, y: 0 });
  return points;
}

function safeTickStep(domain) {
  const span = Math.abs(domain[1] - domain[0]);
  if (span <= 6) return 1;
  if (span <= 14) return 2;
  return 5;
}

export class AreaExplorer {
  constructor(root, {
    functions = AREA_EXPLORER_FUNCTIONS,
    initialFunctionId = functions[0]?.id,
    initialLower = -2,
    initialUpper = 2,
    initialSplitPoints = [],
    maxSplitPoints = 3,
    showFunctionSelector = true,
    showSplitControls = true,
    showLegend = true,
    showAdvancedReadout = true,
    lockedLowerLimit = null,
    title = "Signed area",
    noteText = null,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("AreaExplorer requires a DOM host element.");
    const validFunctions = functions.map(validateFunctionDefinition);
    if (!validFunctions.length) throw new Error("AreaExplorer requires at least one function definition.");

    this.root = root;
    this.document = root.ownerDocument;
    this.functions = new Map(validFunctions.map((definition) => [definition.id, definition]));
    this.maxSplitPoints = Math.max(0, Math.floor(finiteNumber(maxSplitPoints, 3)));
    this.showFunctionSelector = Boolean(showFunctionSelector);
    this.showSplitControls = Boolean(showSplitControls);
    this.showLegend = Boolean(showLegend);
    this.showAdvancedReadout = Boolean(showAdvancedReadout);
    this.lockedLowerLimit = Number.isFinite(Number(lockedLowerLimit)) ? Number(lockedLowerLimit) : null;
    this.titleText = String(title || "Signed area");
    this.noteText = noteText === null ? null : String(noteText);
    this.onChange = onChange;
    this.cleanupCallbacks = [];
    this.splitCleanupCallbacks = [];
    this.diagram = null;
    this.limitControls = {};

    const initial = this.functions.get(initialFunctionId) || validFunctions[0];
    this.state = {
      functionId: initial.id,
      lower: clamp(this.lockedLowerLimit ?? finiteNumber(initialLower), ...initial.xDomain),
      upper: clamp(finiteNumber(initialUpper), ...initial.xDomain),
      splitPoints: normalizeSplitPoints(initialSplitPoints, initialLower, initialUpper, initial.xDomain)
    };

    this.#renderShell();
    this.#renderFunction();
  }

  get definition() {
    return this.functions.get(this.state.functionId);
  }

  getState() {
    return { ...this.state, splitPoints: [...this.state.splitPoints] };
  }

  getAreaState() {
    return calculateAreaState(this.definition, this.state);
  }

  destroy() {
    for (const cleanup of this.splitCleanupCallbacks.splice(0)) cleanup();
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    this.limitControls.helper?.destroy();
    this.diagram?.destroy();
    this.diagram = null;
    this.root.replaceChildren();
    this.root.classList.remove("area-explorer");
  }

  setFunction(functionId) {
    const definition = this.functions.get(functionId);
    if (!definition) throw new Error(`Unknown function definition: ${functionId}`);
    const oldDomain = this.definition.xDomain;
    const oldSpan = Math.abs(this.state.upper - this.state.lower);
    this.state.functionId = functionId;
    const [xMin, xMax] = definition.xDomain;
    const centre = clamp((this.state.lower + this.state.upper) / 2, xMin, xMax);
    const half = Math.min(oldSpan / 2 || (xMax - xMin) / 4, (xMax - xMin) / 2);
    this.state.lower = clamp(centre - half, xMin, xMax);
    this.state.upper = clamp(centre + half, xMin, xMax);
    if (oldDomain[0] === this.state.lower && oldDomain[1] === this.state.upper) {
      this.state.lower = xMin;
      this.state.upper = xMax;
    }
    this.state.splitPoints = normalizeSplitPoints(this.state.splitPoints, this.state.lower, this.state.upper, definition.xDomain);
    this.#renderFunction();
    this.#emitChange("function");
  }

  setLimits(lower, upper, source = "programmatic") {
    const [xMin, xMax] = this.definition.xDomain;
    this.state.lower = clamp(this.lockedLowerLimit ?? finiteNumber(lower, this.state.lower), xMin, xMax);
    this.state.upper = clamp(finiteNumber(upper, this.state.upper), xMin, xMax);
    this.state.splitPoints = normalizeSplitPoints(this.state.splitPoints, this.state.lower, this.state.upper, this.definition.xDomain);
    this.#syncControls();
    this.#renderDiagram();
    this.#renderSplitControls();
    this.#syncReadout();
    this.#emitChange(source);
  }

  setSplitPoints(points, source = "programmatic") {
    this.state.splitPoints = normalizeSplitPoints(points, this.state.lower, this.state.upper, this.definition.xDomain).slice(0, this.maxSplitPoints);
    this.#renderDiagram();
    this.#renderSplitControls();
    this.#syncReadout();
    this.#emitChange(source);
  }

  addSplitPoint(value = null) {
    if (this.state.splitPoints.length >= this.maxSplitPoints) return false;
    const start = Math.min(this.state.lower, this.state.upper);
    const end = Math.max(this.state.lower, this.state.upper);
    const candidate = value === null
      ? start + ((this.state.splitPoints.length + 1) / (this.state.splitPoints.length + 2)) * (end - start)
      : finiteNumber(value);
    this.setSplitPoints([...this.state.splitPoints, candidate], "split-add");
    return true;
  }

  removeSplitPoint(index) {
    const next = [...this.state.splitPoints];
    if (index < 0 || index >= next.length) return false;
    next.splice(index, 1);
    this.setSplitPoints(next, "split-remove");
    return true;
  }

  reset() {
    const [xMin, xMax] = this.definition.xDomain;
    const half = (xMax - xMin) / 3;
    const centre = clamp(0, xMin, xMax);
    this.state.lower = clamp(centre - half, xMin, xMax);
    this.state.upper = clamp(centre + half, xMin, xMax);
    this.state.splitPoints = [];
    this.#syncControls();
    this.#renderDiagram();
    this.#renderSplitControls();
    this.#syncReadout();
    this.#emitChange("reset");
  }

  #emitChange(source) {
    this.onChange({ ...this.getState(), source, area: this.getAreaState() });
  }

  #renderShell() {
    this.root.classList.add("area-explorer");
    const controls = createElement(this.document, "div", "area-explorer__controls");

    if (this.showFunctionSelector && this.functions.size > 1) {
      const label = createElement(this.document, "label", "area-explorer__select-label");
      label.textContent = "Function";
      const select = createElement(this.document, "select", "area-explorer__select");
      select.setAttribute("aria-label", "Choose a function for the area explorer");
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

    this.limitHost = createElement(this.document, "div", "area-explorer__limit-controls");
    controls.append(this.limitHost);

    const buttonRow = createElement(this.document, "div", "area-explorer__button-row");
    this.addSplitButton = createElement(this.document, "button", "area-explorer__button");
    this.addSplitButton.type = "button";
    this.addSplitButton.textContent = "Add split point";
    const addListener = () => this.addSplitPoint();
    this.addSplitButton.addEventListener("click", addListener);
    this.cleanupCallbacks.push(() => this.addSplitButton.removeEventListener("click", addListener));

    const resetButton = createElement(this.document, "button", "area-explorer__button area-explorer__button--secondary");
    resetButton.type = "button";
    resetButton.textContent = "Reset interval";
    const resetListener = () => this.reset();
    resetButton.addEventListener("click", resetListener);
    this.cleanupCallbacks.push(() => resetButton.removeEventListener("click", resetListener));
    buttonRow.append(this.addSplitButton, resetButton);
    if (this.showSplitControls) controls.append(buttonRow);

    this.graphCard = createElement(this.document, "section", "area-explorer__card");
    const heading = createElement(this.document, "div", "area-explorer__card-heading");
    const title = createElement(this.document, "h3", "area-explorer__title");
    title.textContent = this.titleText;
    this.expression = createElement(this.document, "p", "area-explorer__expression");
    heading.append(title, this.expression);
    this.diagramHost = createElement(this.document, "div", "area-explorer__diagram");
    this.graphCard.append(heading, this.diagramHost);

    this.legend = createElement(this.document, "div", "area-explorer__legend");
    this.legend.innerHTML = '<span class="area-explorer__legend-item area-explorer__legend-item--positive"><span aria-hidden="true">＋</span> above the axis</span><span class="area-explorer__legend-item area-explorer__legend-item--negative"><span aria-hidden="true">−</span> below the axis</span><span class="area-explorer__legend-item area-explorer__legend-item--split"><span aria-hidden="true">⋮</span> user split</span>';
    this.legend.hidden = !this.showLegend;

    this.readout = createElement(this.document, "div", "area-explorer__readout");
    this.readout.setAttribute("aria-live", "polite");

    this.splitControls = createElement(this.document, "div", "area-explorer__split-controls");
    this.splitControls.setAttribute("aria-label", "Optional split points");

    const note = createElement(this.document, "p", "area-explorer__note");
    note.innerHTML = this.noteText ?? "The <strong>definite integral</strong> is signed and depends on limit order. <strong>Geometrical area</strong> adds the magnitudes of regions above and below the axis.";

    this.splitControls.hidden = !this.showSplitControls;
    this.root.replaceChildren(controls, this.graphCard, this.legend, this.readout, this.splitControls, note);
  }

  #renderFunction() {
    if (this.functionSelect) this.functionSelect.value = this.definition.id;
    this.expression.textContent = this.definition.expressions?.function || this.definition.label;
    this.#renderLimitControls();
    this.#renderDiagram();
    this.#renderSplitControls();
    this.#syncReadout();
  }

  #renderLimitControls() {
    this.limitControls.helper?.destroy();
    this.limitHost.replaceChildren();
    this.diagram?.destroy();
    this.diagram = null;
    const [xMin, xMax] = this.definition.xDomain;
    const step = (xMax - xMin) / 120;
    const helper = new DiagramPrimitives(createElement(this.document, "div"), { xDomain: this.definition.xDomain });
    const lowerControl = helper.slider({
      label: "Lower limit a",
      min: xMin,
      max: xMax,
      step,
      value: this.state.lower,
      format: (value) => formatAreaNumber(value, 2),
      onInput: (value) => this.setLimits(value, this.state.upper, "lower-limit")
    });
    const upperControl = helper.slider({
      label: "Upper limit b",
      min: xMin,
      max: xMax,
      step,
      value: this.state.upper,
      format: (value) => formatAreaNumber(value, 2),
      onInput: (value) => this.setLimits(this.state.lower, value, "upper-limit")
    });
    if (this.lockedLowerLimit !== null) {
      lowerControl.input.disabled = true;
      lowerControl.input.setAttribute("aria-description", "The lower limit is fixed for this activity.");
    }
    this.limitControls = { lower: lowerControl, upper: upperControl, helper };
    this.limitHost.append(lowerControl.element, upperControl.element);
  }

  #syncControls() {
    if (this.limitControls.lower) {
      this.limitControls.lower.input.value = String(this.state.lower);
      this.limitControls.lower.output.textContent = formatAreaNumber(this.state.lower, 2);
    }
    if (this.limitControls.upper) {
      this.limitControls.upper.input.value = String(this.state.upper);
      this.limitControls.upper.output.textContent = formatAreaNumber(this.state.upper, 2);
    }
  }

  #renderDiagram() {
    this.diagram?.destroy();
    const definition = this.definition;
    this.diagram = new DiagramPrimitives(this.diagramHost, {
      xDomain: definition.xDomain,
      yDomain: definition.yDomains?.function || [-10, 10],
      ariaLabel: `Area explorer graph for ${definition.label}`,
      minHeight: 340,
      aspectRatio: "16 / 9"
    });
    const diagram = this.diagram;
    const tickStep = safeTickStep(definition.xDomain);
    diagram.grid({ xStep: tickStep, yStep: tickStep });

    const area = this.getAreaState();
    for (const region of area.regions) {
      const shaded = diagram.shadedRegion(sampleRegion(definition, region.left, region.right), {
        tone: region.sign === "positive" ? "area-positive" : "area-negative",
        opacity: 0.24
      });
      shaded.element.classList.add(`area-explorer__region--${region.sign}`);
      const mid = (region.left + region.right) / 2;
      const functionY = definition.evaluate(mid);
      const labelY = functionY / 2;
      if (Math.abs(region.right - region.left) > (definition.xDomain[1] - definition.xDomain[0]) * 0.07 && Number.isFinite(labelY)) {
        diagram.label({
          x: mid,
          y: labelY,
          text: region.sign === "positive" ? "+" : "−",
          tone: region.sign === "positive" ? "area-positive" : "area-negative",
          className: "area-explorer__region-sign"
        });
      }
    }

    diagram.axes({ tickStep });
    diagram.polyline(sampleFunction((x) => definition.evaluate(x), definition.xDomain), {
      tone: "curve",
      className: "area-explorer__curve"
    });

    const [yMin, yMax] = definition.yDomains?.function || [-10, 10];
    const railTop = yMax - (yMax - yMin) * 0.05;
    for (const root of area.roots) {
      const guide = diagram.line({ x1: root, y1: yMin, x2: root, y2: yMax, tone: "root", dashed: true, className: "area-explorer__root-guide" });
      guide.element.setAttribute("aria-hidden", "true");
      diagram.label({ x: root, y: railTop, text: `root ${formatAreaNumber(root, 2)}`, dy: 0, tone: "root", className: "area-explorer__root-label" });
    }

    const intervalStart = Math.min(area.lower, area.upper);
    const intervalEnd = Math.max(area.lower, area.upper);
    for (const [label, value] of [["a", area.lower], ["b", area.upper]]) {
      diagram.line({ x1: value, y1: yMin, x2: value, y2: yMax, tone: "limit", dashed: true, className: "area-explorer__limit-guide" });
      diagram.label({ x: value, y: yMin, text: `${label}=${formatAreaNumber(value, 2)}`, dy: -10, tone: "limit", className: "area-explorer__limit-label" });
    }

    const splitLabelY = yMin + (yMax - yMin) * 0.08;
    area.splitPoints.forEach((value, index) => {
      diagram.line({ x1: value, y1: yMin, x2: value, y2: yMax, tone: "split", dashed: true, className: "area-explorer__split-guide" });
      diagram.label({ x: value, y: splitLabelY, text: `s${index + 1}`, tone: "split", className: "area-explorer__split-label" });
    });

    if (intervalStart === intervalEnd) {
      diagram.label({ x: intervalStart, y: 0, text: "a = b", dy: -18, tone: "limit" });
    }
  }

  #renderSplitControls() {
    for (const cleanup of this.splitCleanupCallbacks.splice(0)) cleanup();
    this.splitControls.replaceChildren();
    const area = this.getAreaState();
    if (!this.showSplitControls) return;
    this.addSplitButton.disabled = area.splitPoints.length >= this.maxSplitPoints || Math.abs(area.upper - area.lower) < 1e-7;

    if (!area.splitPoints.length) {
      const empty = createElement(this.document, "p", "area-explorer__split-empty");
      empty.textContent = "No user split points. Add one when you want to break the interval into separate pieces of working.";
      this.splitControls.append(empty);
      return;
    }

    const start = Math.min(area.lower, area.upper);
    const end = Math.max(area.lower, area.upper);
    const step = Math.max((end - start) / 120, 0.001);
    area.splitPoints.forEach((value, index) => {
      const row = createElement(this.document, "div", "area-explorer__split-row");
      const label = createElement(this.document, "label", "area-explorer__split-slider");
      const heading = createElement(this.document, "span", "area-explorer__split-heading");
      heading.textContent = `Split s${index + 1}`;
      const output = createElement(this.document, "output", "area-explorer__split-value");
      output.textContent = formatAreaNumber(value, 2);
      const input = createElement(this.document, "input", "area-explorer__split-input");
      input.type = "range";
      const neighbourGap = Math.max(step, (end - start) / 500);
      const localMin = index === 0 ? start + neighbourGap : area.splitPoints[index - 1] + neighbourGap;
      const localMax = index === area.splitPoints.length - 1 ? end - neighbourGap : area.splitPoints[index + 1] - neighbourGap;
      input.min = String(localMin);
      input.max = String(localMax);
      input.step = String(step);
      input.value = String(value);
      input.setAttribute("aria-label", `Split point ${index + 1}`);
      const listener = () => {
        const nextValue = clamp(Number(input.value), localMin, localMax);
        this.state.splitPoints[index] = nextValue;
        output.textContent = formatAreaNumber(nextValue, 2);
        this.#renderDiagram();
        this.#syncReadout();
        this.#emitChange(`split-${index + 1}`);
      };
      input.addEventListener("input", listener);
      this.splitCleanupCallbacks.push(() => input.removeEventListener("input", listener));
      const headingRow = createElement(this.document, "span", "area-explorer__split-heading-row");
      headingRow.append(heading, output);
      label.append(headingRow, input);

      const remove = createElement(this.document, "button", "area-explorer__split-remove");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove split point ${index + 1}`);
      const removeListener = () => this.removeSplitPoint(index);
      remove.addEventListener("click", removeListener);
      this.splitCleanupCallbacks.push(() => remove.removeEventListener("click", removeListener));
      row.append(label, remove);
      this.splitControls.append(row);
    });
  }

  #syncReadout() {
    const area = this.getAreaState();
    const orientationText = area.orientation > 0 ? "forward limits" : "reversed limits";
    const rootText = area.roots.length
      ? area.roots.map((root) => formatAreaNumber(root, 2)).join(", ")
      : "none in the interval";
    if (!this.showAdvancedReadout) {
      this.readout.innerHTML = `
        <div class="area-explorer__metric"><span>Definite integral</span><strong>${formatAreaNumber(area.integral)}</strong></div>
        <div class="area-explorer__metric area-explorer__metric--secondary"><span>Interval</span><strong>${formatAreaNumber(area.lower,2)} to ${formatAreaNumber(area.upper,2)}</strong></div>
      `;
      return;
    }
    this.readout.innerHTML = `
      <div class="area-explorer__metric"><span>Definite integral</span><strong>${formatAreaNumber(area.integral)}</strong></div>
      <div class="area-explorer__metric"><span>Total geometrical area</span><strong>${formatAreaNumber(area.geometricArea)}</strong></div>
      <div class="area-explorer__metric area-explorer__metric--secondary"><span>Limit order</span><strong>${orientationText}</strong></div>
      <div class="area-explorer__metric area-explorer__metric--secondary"><span>Roots crossed</span><strong>${rootText}</strong></div>
    `;
  }
}

export function createAreaExplorer(root, options) {
  return new AreaExplorer(root, options);
}
