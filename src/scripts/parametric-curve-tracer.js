import { DiagramPrimitives, clamp, normalizeDomain } from "./diagram-primitives.js";

const STAGES = Object.freeze(["coordinates", "rates", "gradient", "area"]);

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value, digits = 3) {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : value < 0 ? "−∞" : "undefined";
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(digits));
  return String(rounded).replace("-", "−");
}

export function normalizeTInterval(interval, tDomain) {
  const [domainMin, domainMax] = normalizeDomain(tDomain, [-1, 1]);
  const source = Array.isArray(interval) && interval.length === 2 ? interval : [domainMin, domainMax];
  const first = clamp(finiteNumber(source[0], domainMin), domainMin, domainMax);
  const second = clamp(finiteNumber(source[1], domainMax), domainMin, domainMax);
  return first <= second ? [first, second] : [second, first];
}

export function validateParametricDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("Parametric definition must be an object.");
  for (const key of ["id", "label", "x", "y", "dxdt", "dydt"]) {
    if (!definition[key]) throw new Error(`Parametric definition is missing ${key}.`);
  }
  for (const key of ["x", "y", "dxdt", "dydt"]) {
    if (typeof definition[key] !== "function") throw new Error(`Parametric definition ${key} must be a function.`);
  }
  normalizeDomain(definition.tDomain, [-1, 1]);
  normalizeDomain(definition.xDomain, [-5, 5]);
  normalizeDomain(definition.yDomain, [-5, 5]);
  return definition;
}

export function calculateParametricState(definition, t) {
  validateParametricDefinition(definition);
  const [tMin, tMax] = normalizeDomain(definition.tDomain, [-1, 1]);
  const safeT = clamp(finiteNumber(t, definition.initialT ?? tMin), tMin, tMax);
  const x = finiteNumber(definition.x(safeT));
  const y = finiteNumber(definition.y(safeT));
  const dxdt = finiteNumber(definition.dxdt(safeT));
  const dydt = finiteNumber(definition.dydt(safeT));
  const dydx = Math.abs(dxdt) < 1e-10
    ? (Math.abs(dydt) < 1e-10 ? Number.NaN : Math.sign(dydt) * Number.POSITIVE_INFINITY)
    : dydt / dxdt;
  return Object.freeze({ t: safeT, x, y, dxdt, dydt, dydx });
}

export function integrateParametricArea(definition, interval, { steps = 600 } = {}) {
  validateParametricDefinition(definition);
  const [a, b] = normalizeTInterval(interval, definition.tDomain);
  if (Math.abs(b - a) < 1e-12) return 0;
  let n = Math.max(20, Math.floor(steps));
  if (n % 2) n += 1;
  const h = (b - a) / n;
  const integrand = (t) => finiteNumber(definition.y(t)) * finiteNumber(definition.dxdt(t));
  let total = integrand(a) + integrand(b);
  for (let i = 1; i < n; i += 1) total += (i % 2 ? 4 : 2) * integrand(a + i * h);
  return total * h / 3;
}

export function calculateCoordinateRanges(definition, interval = definition.tDomain, samples = 800) {
  const points = sampleParametricCurve(definition, interval, samples);
  if (!points.length) return Object.freeze({ xRange: Object.freeze([Number.NaN, Number.NaN]), yRange: Object.freeze([Number.NaN, Number.NaN]) });
  const xs = points.map((point) => point.x); const ys = points.map((point) => point.y);
  return Object.freeze({ xRange: Object.freeze([Math.min(...xs), Math.max(...xs)]), yRange: Object.freeze([Math.min(...ys), Math.max(...ys)]) });
}

export function sampleParametricCurve(definition, interval = definition.tDomain, samples = 240) {
  validateParametricDefinition(definition);
  const [a, b] = normalizeTInterval(interval, definition.tDomain);
  return Array.from({ length: Math.max(2, samples) + 1 }, (_, index) => {
    const t = a + (index / Math.max(2, samples)) * (b - a);
    return { t, x: definition.x(t), y: definition.y(t) };
  }).filter(({ x, y }) => Number.isFinite(x) && Number.isFinite(y));
}

export const PARAMETRIC_CURVES = Object.freeze([
  Object.freeze({
    id: "parametric-parabola",
    label: "Parabola: x=t, y=t²−1",
    expressions: Object.freeze({ x: "t", y: "t² − 1", dxdt: "1", dydt: "2t" }),
    tDomain: Object.freeze([-2.5, 2.5]),
    xDomain: Object.freeze([-3, 3]),
    yDomain: Object.freeze([-2, 6]),
    initialT: 1,
    x: (t) => t,
    y: (t) => t * t - 1,
    dxdt: () => 1,
    dydt: (t) => 2 * t,
    description: "A simple first example where t is also the x-coordinate."
  }),
  Object.freeze({
    id: "parametric-cubic",
    label: "Cubic trace: x=t²−1, y=t³−3t",
    expressions: Object.freeze({ x: "t² − 1", y: "t³ − 3t", dxdt: "2t", dydt: "3t² − 3" }),
    tDomain: Object.freeze([-2.1, 2.1]),
    xDomain: Object.freeze([-1.5, 4]),
    yDomain: Object.freeze([-4, 4]),
    initialT: -1.25,
    x: (t) => t * t - 1,
    y: (t) => t * t * t - 3 * t,
    dxdt: (t) => 2 * t,
    dydt: (t) => 3 * t * t - 3,
    description: "A turning trace that makes direction and vertical tangents worth noticing."
  }),
  Object.freeze({
    id: "parametric-ellipse",
    label: "Ellipse: x=3cos t, y=2sin t",
    expressions: Object.freeze({ x: "3 cos t", y: "2 sin t", dxdt: "−3 sin t", dydt: "2 cos t" }),
    tDomain: Object.freeze([0, Math.PI * 2]),
    xDomain: Object.freeze([-4, 4]),
    yDomain: Object.freeze([-3, 3]),
    initialT: Math.PI / 3,
    x: (t) => 3 * Math.cos(t),
    y: (t) => 2 * Math.sin(t),
    dxdt: (t) => -3 * Math.sin(t),
    dydt: (t) => 2 * Math.cos(t),
    description: "A closed curve where the direction of increasing t is essential."
  })
]);

function createElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

function safeTickStep(domain) {
  const span = Math.abs(domain[1] - domain[0]);
  if (span <= 7) return 1;
  if (span <= 15) return 2;
  return 5;
}

export class ParametricCurveTracer {
  constructor(root, {
    curves = PARAMETRIC_CURVES,
    initialCurveId = curves[0]?.id,
    initialT = null,
    initialStage = "coordinates",
    initialInterval = null,
    showCurveSelector = true,
    showAreaTeachingOverlay = false,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("ParametricCurveTracer requires a DOM host element.");
    const validCurves = curves.map(validateParametricDefinition);
    if (!validCurves.length) throw new Error("ParametricCurveTracer requires at least one curve definition.");
    this.root = root;
    this.document = root.ownerDocument;
    this.curves = new Map(validCurves.map((definition) => [definition.id, definition]));
    this.showCurveSelector = Boolean(showCurveSelector);
    this.showAreaTeachingOverlay = Boolean(showAreaTeachingOverlay);
    this.onChange = onChange;
    this.cleanupCallbacks = [];
    this.diagram = null;
    const definition = this.curves.get(initialCurveId) || validCurves[0];
    const interval = normalizeTInterval(initialInterval || definition.tDomain, definition.tDomain);
    this.state = {
      curveId: definition.id,
      t: clamp(finiteNumber(initialT, definition.initialT ?? interval[0]), ...interval),
      stage: STAGES.includes(initialStage) ? initialStage : "coordinates",
      interval
    };
    this.#renderShell();
    this.#renderCurve();
  }

  get definition() { return this.curves.get(this.state.curveId); }
  getState() { return { ...this.state, interval: [...this.state.interval] }; }
  getParametricState() { return calculateParametricState(this.definition, this.state.t); }
  getSignedArea() { return integrateParametricArea(this.definition, this.state.interval); }

  destroy() {
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    this.diagram?.destroy();
    this.root.replaceChildren();
    this.root.classList.remove("parametric-tracer");
  }

  setCurve(curveId) {
    const definition = this.curves.get(curveId);
    if (!definition) throw new Error(`Unknown parametric curve: ${curveId}`);
    this.state.curveId = curveId;
    this.state.interval = [...definition.tDomain];
    this.state.t = clamp(definition.initialT ?? definition.tDomain[0], ...this.state.interval);
    this.#renderCurve();
    this.#emit("curve");
  }

  setT(t, source = "programmatic") {
    this.state.t = clamp(finiteNumber(t, this.state.t), ...this.state.interval);
    this.#syncControls();
    this.#renderDiagram();
    this.#syncReadout();
    this.#emit(source);
  }

  setStage(stage) {
    if (!STAGES.includes(stage)) throw new Error(`Unknown tracer stage: ${stage}`);
    this.state.stage = stage;
    this.#syncStageButtons();
    this.#renderDiagram();
    this.#syncReadout();
    this.#emit("stage");
  }

  setInterval(start, end, source = "programmatic") {
    this.state.interval = normalizeTInterval([start, end], this.definition.tDomain);
    this.state.t = clamp(this.state.t, ...this.state.interval);
    this.#syncControls();
    this.#renderDiagram();
    this.#syncReadout();
    this.#emit(source);
  }

  #renderShell() {
    this.root.classList.add("parametric-tracer");
    this.controls = createElement(this.document, "div", "parametric-tracer__controls");
    this.selectorWrap = createElement(this.document, "label", "parametric-tracer__select-label");
    const selectorText = createElement(this.document, "span"); selectorText.textContent = "Curve";
    this.selector = createElement(this.document, "select", "parametric-tracer__select");
    for (const curve of this.curves.values()) {
      const option = createElement(this.document, "option"); option.value = curve.id; option.textContent = curve.label; this.selector.append(option);
    }
    this.selectorWrap.append(selectorText, this.selector);
    if (!this.showCurveSelector) this.selectorWrap.hidden = true;
    const changeCurve = () => this.setCurve(this.selector.value);
    this.selector.addEventListener("change", changeCurve);
    this.cleanupCallbacks.push(() => this.selector.removeEventListener("change", changeCurve));

    this.stageWrap = createElement(this.document, "div", "parametric-tracer__stages");
    this.stageWrap.setAttribute("role", "group");
    this.stageWrap.setAttribute("aria-label", "Information shown");
    this.stageButtons = new Map();
    const labels = { coordinates: "Coordinates", rates: "+ rates", gradient: "+ dy/dx", area: "+ area strips" };
    STAGES.forEach((stage) => {
      const button = createElement(this.document, "button", "parametric-tracer__stage-button");
      button.type = "button"; button.textContent = labels[stage]; button.dataset.stage = stage;
      const listener = () => this.setStage(stage); button.addEventListener("click", listener);
      this.cleanupCallbacks.push(() => button.removeEventListener("click", listener));
      this.stageButtons.set(stage, button); this.stageWrap.append(button);
    });
    this.controls.append(this.selectorWrap, this.stageWrap);

    this.intervalPanel = createElement(this.document, "div", "parametric-tracer__interval-panel");
    const intervalTitle = createElement(this.document, "strong"); intervalTitle.textContent = "Visible t interval";
    this.intervalControls = createElement(this.document, "div", "parametric-tracer__interval-controls");
    this.intervalPanel.append(intervalTitle, this.intervalControls);

    this.card = createElement(this.document, "section", "parametric-tracer__card");
    const heading = createElement(this.document, "div", "parametric-tracer__card-heading");
    this.title = createElement(this.document, "h3", "parametric-tracer__title"); this.title.textContent = "Parametric curve";
    this.expression = createElement(this.document, "p", "parametric-tracer__expression");
    heading.append(this.title, this.expression);
    this.diagramHost = createElement(this.document, "div", "parametric-tracer__diagram");
    this.legend = createElement(this.document, "div", "parametric-tracer__legend");
    this.legend.innerHTML = '<span><b>→</b> increasing t</span><span><i></i> restricted interval</span>';
    this.card.append(heading, this.diagramHost, this.legend);

    this.readout = createElement(this.document, "div", "parametric-tracer__readout");
    this.note = createElement(this.document, "p", "parametric-tracer__note");
    this.note.textContent = "The axes stay fixed while t moves. Restricting t changes only the part of the curve being traced.";
    this.root.replaceChildren(this.controls, this.intervalPanel, this.card, this.readout, this.note);
  }

  #renderCurve() {
    const definition = this.definition;
    this.selector.value = definition.id;
    this.expression.textContent = `x(t) = ${definition.expressions?.x || "x(t)"}    y(t) = ${definition.expressions?.y || "y(t)"}`;
    this.diagram?.destroy();
    this.diagram = new DiagramPrimitives(this.diagramHost, {
      xDomain: definition.xDomain,
      yDomain: definition.yDomain,
      ariaLabel: `Parametric curve tracer for ${definition.label}`,
      minHeight: 360,
      aspectRatio: "16 / 9"
    });
    this.#renderIntervalControls();
    this.#syncStageButtons();
    this.#renderDiagram();
    this.#syncReadout();
  }

  #renderIntervalControls() {
    this.intervalControls.replaceChildren();
    const [tMin, tMax] = this.definition.tDomain;
    const span = tMax - tMin;
    const step = span / 200;
    this.tSlider = this.diagram.slider({ label: "t", min: this.state.interval[0], max: this.state.interval[1], step, value: this.state.t, format: (v) => formatNumber(v, 2), onInput: (v) => this.setT(v, "t-slider") });
    this.startSlider = this.diagram.slider({ label: "start", min: tMin, max: tMax, step, value: this.state.interval[0], format: (v) => formatNumber(v, 2), onInput: (v) => this.setInterval(v, this.state.interval[1], "interval-start") });
    this.endSlider = this.diagram.slider({ label: "end", min: tMin, max: tMax, step, value: this.state.interval[1], format: (v) => formatNumber(v, 2), onInput: (v) => this.setInterval(this.state.interval[0], v, "interval-end") });
    this.intervalControls.append(this.tSlider.element, this.startSlider.element, this.endSlider.element);
  }

  #syncControls() {
    if (!this.tSlider) return;
    const [start, end] = this.state.interval;
    this.tSlider.input.min = String(start); this.tSlider.input.max = String(end); this.tSlider.input.value = String(this.state.t); this.tSlider.output.textContent = formatNumber(this.state.t, 2);
    this.startSlider.input.value = String(start); this.startSlider.output.textContent = formatNumber(start, 2);
    this.endSlider.input.value = String(end); this.endSlider.output.textContent = formatNumber(end, 2);
  }

  #syncStageButtons() {
    const activeIndex = STAGES.indexOf(this.state.stage);
    STAGES.forEach((stage, index) => {
      const button = this.stageButtons.get(stage);
      const active = index === activeIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  #renderDiagram() {
    const definition = this.definition;
    const stageIndex = STAGES.indexOf(this.state.stage);
    const [start, end] = this.state.interval;
    this.diagram.clear();
    this.diagram.grid({ xStep: safeTickStep(definition.xDomain), yStep: safeTickStep(definition.yDomain) });
    this.diagram.axes({ tickStep: safeTickStep(definition.xDomain) });

    if (stageIndex >= 3) {
      const strips = sampleParametricCurve(definition, [start, end], 44);
      for (let i = 0; i < strips.length - 1; i += 1) {
        const a = strips[i]; const b = strips[i + 1];
        const tone = ((a.y + b.y) / 2) >= 0 ? "parametric-area-positive" : "parametric-area-negative";
        this.diagram.shadedRegion([{ x: a.x, y: 0 }, { x: a.x, y: a.y }, { x: b.x, y: b.y }, { x: b.x, y: 0 }], { tone, opacity: .14 });
      }
    }

    if (stageIndex >= 3 && this.showAreaTeachingOverlay) {
      const current = calculateParametricState(definition, this.state.t);
      const intervalSpan = Math.max(1e-6, end - start);
      const dt = intervalSpan / 28;
      let nextT = Math.min(end, current.t + dt);
      if (Math.abs(nextT - current.t) < 1e-8) nextT = Math.max(start, current.t - dt);
      const next = calculateParametricState(definition, nextT);
      const tone = current.y >= 0 ? "parametric-area-positive" : "parametric-area-negative";
      this.diagram.shadedRegion([{x:current.x,y:0},{x:current.x,y:current.y},{x:next.x,y:next.y},{x:next.x,y:0}],{tone,opacity:.34,className:"parametric-tracer__teaching-strip"});
      const arrowY = Math.max(definition.yDomain[0], Math.min(definition.yDomain[1], current.y * .45));
      this.diagram.arrow({x1:current.x,y1:arrowY,x2:next.x,y2:arrowY,tone:"direction",className:"parametric-tracer__dx-arrow"});
      this.diagram.label({x:(current.x+next.x)/2,y:arrowY,text:`Δx ${next.x-current.x >= 0 ? "→" : "←"}`,dy:-10,tone:"direction",className:"parametric-tracer__dx-label"});
    }

    const full = sampleParametricCurve(definition, definition.tDomain, 320);
    this.diagram.polyline(full, { tone: "parametric-muted", className: "parametric-tracer__full-curve" });
    const trace = sampleParametricCurve(definition, [start, end], 260);
    this.diagram.polyline(trace, { tone: "curve", className: "parametric-tracer__active-curve" });

    const arrowFractions = [0.22, 0.5, 0.78];
    arrowFractions.forEach((fraction) => {
      const t = start + fraction * (end - start);
      const state = calculateParametricState(definition, t);
      const speed = Math.hypot(state.dxdt, state.dydt);
      if (speed < 1e-8) return;
      const length = 0.38 * Math.min(definition.xDomain[1] - definition.xDomain[0], definition.yDomain[1] - definition.yDomain[0]);
      const ux = state.dxdt / speed; const uy = state.dydt / speed;
      this.diagram.arrow({ x1: state.x - ux * length * .22, y1: state.y - uy * length * .22, x2: state.x + ux * length * .22, y2: state.y + uy * length * .22, tone: "direction" });
    });

    const current = calculateParametricState(definition, this.state.t);
    this.diagram.point({ x: current.x, y: current.y, radius: 10, tone: "interactive", tooltip: `t=${formatNumber(current.t, 2)}, (${formatNumber(current.x, 2)}, ${formatNumber(current.y, 2)})` });
    this.diagram.label({ x: current.x, y: current.y, text: `t=${formatNumber(current.t, 2)}`, dx: 14, dy: -16, anchor: "start", tone: "interactive", className: "parametric-tracer__point-label" });

    if (stageIndex >= 2 && Number.isFinite(current.dydx)) {
      const span = Math.max(.7, (definition.xDomain[1] - definition.xDomain[0]) * .18);
      this.diagram.tangent({ x: current.x, y: current.y, slope: current.dydx, span, tone: "tangent" });
    } else if (stageIndex >= 2 && !Number.isNaN(current.dydx) && !Number.isFinite(current.dydx)) {
      const ySpan = (definition.yDomain[1] - definition.yDomain[0]) * .34;
      this.diagram.line({ x1: current.x, y1: current.y - ySpan / 2, x2: current.x, y2: current.y + ySpan / 2, tone: "tangent", className: "parametric-tracer__vertical-tangent" });
    }

    const intervalY = definition.yDomain[0] + .07 * (definition.yDomain[1] - definition.yDomain[0]);
    this.diagram.label({ x: definition.xDomain[0] + .03 * (definition.xDomain[1] - definition.xDomain[0]), y: intervalY, text: `t ∈ [${formatNumber(start, 2)}, ${formatNumber(end, 2)}]`, anchor: "start", tone: "interval", className: "parametric-tracer__interval-label" });
  }

  #syncReadout() {
    const state = this.getParametricState();
    const stageIndex = STAGES.indexOf(this.state.stage);
    const metrics = [
      ["t", formatNumber(state.t)],
      ["Point", `(${formatNumber(state.x)}, ${formatNumber(state.y)})`]
    ];
    if (stageIndex >= 1) metrics.push(["dx/dt", formatNumber(state.dxdt)], ["dy/dt", formatNumber(state.dydt)]);
    if (stageIndex >= 2) {
      metrics.push(["dy/dx", formatNumber(state.dydx)]);
      if (!Number.isNaN(state.dydx) && !Number.isFinite(state.dydx)) metrics.push(["Tangent", "vertical (dx/dt = 0)"]);
    }
    if (stageIndex >= 3) {
      metrics.push(["∫ y dx", formatNumber(this.getSignedArea())]);
      if (this.showAreaTeachingOverlay) {
        metrics.push(["y·dx/dt", formatNumber(state.y * state.dxdt)]);
        metrics.push(["x direction", state.dxdt > 1e-10 ? "increasing →" : state.dxdt < -1e-10 ? "decreasing ←" : "stationary"]);
      }
    }
    this.readout.replaceChildren(...metrics.map(([label, value]) => {
      const card = createElement(this.document, "div", "parametric-tracer__metric");
      const small = createElement(this.document, "span"); small.textContent = label; small.setAttribute("data-math-render", "");
      const strong = createElement(this.document, "strong"); strong.textContent = value; strong.setAttribute("data-math-render", "");
      card.append(small, strong); return card;
    }));
  }

  #emit(source) {
    this.onChange({ source, state: this.getState(), point: this.getParametricState() });
  }
}
