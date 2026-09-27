import { DiagramPrimitives } from "./diagram-primitives.js";
import { evaluatePolynomial } from "./linked-function-gradient-explorer.js";

export const interactiveQuestionVisualKinds = Object.freeze([
  "calculus-interval-selector",
  "calculus-point-classifier",
  "calculus-region-selector",
  "calculus-split-selector"
]);

function createElement(documentRef, tag, className = "") {
  const element = documentRef.createElement(tag);
  if (className) element.className = className;
  if (/question-graph-interaction__(instruction|status|title)|question-graph-card__title|__cue$/.test(className)) {
    element.setAttribute("data-math-prose", "");
  }
  if (/question-(interval-selector__segment-label|region-selector__label|parametric-selector__label|parametric-direction__label|trapezium-bound__label|trapezium-selector__choice|split-selector__choice|expression-selector__(term|separator)|riemann-selector__choice|line-selector__choice)/.test(className)) {
    element.setAttribute("data-math-render", "");
  }
  return element;
}

function sample(coefficients, xDomain, count = 120) {
  const [xMin, xMax] = xDomain;
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = xMin + (index / count) * (xMax - xMin);
    return { x, y: evaluatePolynomial(coefficients, x) };
  }).filter(({ y }) => Number.isFinite(y));
}

function sampleBetween(upperCoefficients, lowerCoefficients, left, right, count = 64) {
  const upper = Array.from({ length: count + 1 }, (_, index) => {
    const x = left + (index / count) * (right - left);
    return { x, y: evaluatePolynomial(upperCoefficients, x) };
  });
  const lower = Array.from({ length: count + 1 }, (_, index) => {
    const x = right - (index / count) * (right - left);
    return { x, y: evaluatePolynomial(lowerCoefficients, x) };
  });
  return [...upper, ...lower].filter(({ y }) => Number.isFinite(y));
}

function valueFromConfig(question, directKey, parameterKeyKey, fallback) {
  const config = question?.diagramConfig ?? {};
  const parameterKey = config[parameterKeyKey];
  if (parameterKey && question?.parameters && Object.hasOwn(question.parameters, parameterKey)) {
    return question.parameters[parameterKey];
  }
  return config[directKey] ?? fallback;
}

function graphSpec(question) {
  return {
    coefficients: valueFromConfig(question, "coefficients", "coefficientsKey", null),
    xDomain: valueFromConfig(question, "xDomain", "xDomainKey", [-3, 3]),
    yDomain: valueFromConfig(question, "yDomain", "yDomainKey", [-6, 6])
  };
}

function pointSpec(question) {
  return valueFromConfig(question, "point", "pointKey", null);
}

function validDomain(value) {
  return Array.isArray(value)
    && value.length === 2
    && value.every((item) => Number.isFinite(Number(item)))
    && Number(value[0]) !== Number(value[1]);
}

function validGraphSpec(spec) {
  return Array.isArray(spec.coefficients)
    && spec.coefficients.length > 0
    && spec.coefficients.every((item) => Number.isFinite(Number(item)))
    && validDomain(spec.xDomain)
    && validDomain(spec.yDomain);
}

export function intervalSelectionKey(segmentIds, segmentOrder = []) {
  const selected = new Set((segmentIds ?? []).map(String));
  const ordered = (segmentOrder ?? []).map(String).filter((id) => selected.has(id));
  const extras = [...selected].filter((id) => !ordered.includes(id)).sort();
  return [...ordered, ...extras].join("|");
}

export function intervalResponseFromSelection(config, segmentIds) {
  const order = (config?.segments ?? []).map((segment) => segment.id);
  const key = intervalSelectionKey(segmentIds, order);
  if (!key) return "";
  return config?.responseMap?.[key] ?? `segments:${key}`;
}

export function intervalSelectionFromResponse(config, response) {
  const text = String(response ?? "");
  if (!text) return Object.freeze([]);
  const responseMap = config?.responseMap ?? {};
  const mapped = Object.entries(responseMap).find(([, mappedResponse]) => mappedResponse === text)?.[0];
  const raw = mapped ?? (text.startsWith("segments:") ? text.slice("segments:".length) : "");
  const allowed = new Set((config?.segments ?? []).map((segment) => segment.id));
  return Object.freeze(raw.split("|").filter((id) => allowed.has(id)));
}

function selectionResponse(config, items, prefix, selectedIds) {
  const order = (items ?? []).map((item) => item.id);
  const key = intervalSelectionKey(selectedIds, order);
  if (!key) return "";
  return config?.responseMap?.[key] ?? `${prefix}:${key}`;
}

function selectionFromResponse(config, items, prefix, response) {
  const text = String(response ?? "");
  if (!text) return Object.freeze([]);
  const responseMap = config?.responseMap ?? {};
  const mapped = Object.entries(responseMap).find(([, mappedResponse]) => mappedResponse === text)?.[0];
  const raw = mapped ?? (text.startsWith(`${prefix}:`) ? text.slice(prefix.length + 1) : "");
  const allowed = new Set((items ?? []).map((item) => item.id));
  return Object.freeze(raw.split("|").filter((id) => allowed.has(id)));
}

export function regionResponseFromSelection(config, regionIds) {
  return selectionResponse(config, config?.regions, "regions", regionIds);
}

export function regionSelectionFromResponse(config, response) {
  return selectionFromResponse(config, config?.regions, "regions", response);
}

export function splitResponseFromSelection(config, splitIds) {
  return selectionResponse(config, config?.splitCandidates, "splits", splitIds);
}

export function splitSelectionFromResponse(config, response) {
  if (String(response ?? "") === String(config?.noneResponse ?? "__never__")) {
    return Object.freeze({ ids: Object.freeze([]), none: true });
  }
  return Object.freeze({
    ids: selectionFromResponse(config, config?.splitCandidates, "splits", response),
    none: false
  });
}

export function isInteractiveQuestionVisual(question) {
  const kind = question?.diagramConfig?.kind;
  if (!interactiveQuestionVisualKinds.includes(kind)) return false;
  const spec = graphSpec(question);
  if (!validGraphSpec(spec)) return false;
  if (kind === "calculus-interval-selector") {
    return Array.isArray(question.diagramConfig.segments) && question.diagramConfig.segments.length >= 2;
  }
  if (kind === "calculus-region-selector") {
    return Array.isArray(question.diagramConfig.regions)
      && question.diagramConfig.regions.length >= 2
      && question.diagramConfig.regions.every((region) =>
        Array.isArray(region.upperCoefficients)
        && Array.isArray(region.lowerCoefficients)
        && Number.isFinite(Number(region.from))
        && Number.isFinite(Number(region.to))
      );
  }
  if (kind === "calculus-split-selector") {
    return Array.isArray(question.diagramConfig.splitCandidates)
      && question.diagramConfig.splitCandidates.length >= 1
      && question.diagramConfig.splitCandidates.every((candidate) => Number.isFinite(Number(candidate.x)));
  }
  const point = pointSpec(question);
  return Boolean(
    point
    && Number.isFinite(Number(point.x))
    && Number.isFinite(Number(point.y))
    && Array.isArray(question.options)
    && question.options.length >= 2
  );
}

export function createQuestionVisualRenderer(host, { onResponseChange = () => {} } = {}) {
  if (!host?.ownerDocument) {
    return Object.freeze({
      render() {},
      clear() {},
      handlesResponse: () => false,
      focusResponse() {}
    });
  }

  const documentRef = host.ownerDocument;
  let diagrams = [];
  let cleanup = [];
  let focusTarget = null;

  function addCleanup(callback) {
    cleanup.push(callback);
  }

  function clear() {
    for (const callback of cleanup.splice(0)) callback();
    for (const diagram of diagrams) diagram.destroy();
    diagrams = [];
    focusTarget = null;
    host.replaceChildren();
    host.hidden = true;
    delete host.dataset.visualKind;
  }

  function addGraph(container, {
    title,
    coefficients,
    xDomain,
    yDomain,
    tone = "curve",
    ariaLabel,
    minHeight = 190,
    extraCurves = []
  }) {
    const card = createElement(documentRef, "section", "question-graph-card");
    const heading = createElement(documentRef, "h3", "question-graph-card__title");
    heading.textContent = title;
    const plot = createElement(documentRef, "div", "question-graph-card__plot");
    card.append(heading, plot);
    container.append(card);

    const diagram = new DiagramPrimitives(plot, {
      xDomain,
      yDomain,
      ariaLabel,
      minHeight,
      aspectRatio: "4 / 3"
    });
    diagram.grid({ xStep: 1, yStep: 1 });
    diagram.axes({ tickStep: 1 });
    diagram.polyline(sample(coefficients, xDomain), { tone });
    for (const curve of extraCurves) {
      if (!Array.isArray(curve?.coefficients)) continue;
      diagram.polyline(sample(curve.coefficients, xDomain), { tone: curve.tone ?? "accent" });
      if (curve.label && curve.labelAt && Number.isFinite(Number(curve.labelAt.x)) && Number.isFinite(Number(curve.labelAt.y))) {
        diagram.label({
          x: Number(curve.labelAt.x),
          y: Number(curve.labelAt.y),
          text: curve.label,
          dx: curve.labelAt.dx ?? 0,
          dy: curve.labelAt.dy ?? -12,
          tone: curve.tone ?? "accent"
        });
      }
    }
    diagrams.push(diagram);
    return { card, plot, diagram };
  }

  function renderDerivativeMatch(question) {
    const { coefficients, candidateGraphs } = question.parameters ?? {};
    if (!Array.isArray(coefficients) || !Array.isArray(candidateGraphs) || candidateGraphs.length !== 4) return false;
    const config = question.diagramConfig;
    const xDomain = config.xDomain ?? [-3, 3];
    const functionYDomain = config.functionYDomain ?? [-8, 8];
    const candidateYDomain = config.candidateYDomain ?? [-8, 8];

    host.hidden = false;
    host.dataset.visualKind = "function-derivative-choice";
    const wrap = createElement(documentRef, "div", "question-graph-match");
    const original = createElement(documentRef, "div", "question-graph-match__original");
    const candidates = createElement(documentRef, "div", "question-graph-match__candidates");
    wrap.append(original, candidates);
    host.append(wrap);

    addGraph(original, {
      title: "Function f(x)",
      coefficients,
      xDomain,
      yDomain: functionYDomain,
      tone: "curve",
      ariaLabel: "Graph of the original function f of x"
    });
    candidateGraphs.forEach((candidate, index) => addGraph(candidates, {
      title: `Derivative candidate ${String.fromCharCode(65 + index)}`,
      coefficients: candidate.coefficients,
      xDomain,
      yDomain: candidateYDomain,
      tone: "accent",
      ariaLabel: `Derivative candidate graph ${String.fromCharCode(65 + index)}`
    }));
    return true;
  }

  function renderIntervalSelector(question, response) {
    const config = question.diagramConfig;
    const spec = graphSpec(question);
    if (!validGraphSpec(spec)) return false;

    const selected = new Set(intervalSelectionFromResponse(config, response));
    const wrap = createElement(documentRef, "section", "question-graph-interaction question-graph-interaction--intervals");
    const intro = createElement(documentRef, "div", "question-graph-interaction__intro");
    const title = createElement(documentRef, "h3", "question-graph-interaction__title");
    title.textContent = config.title ?? "Select the interval(s)";
    const instruction = createElement(documentRef, "p", "question-graph-interaction__instruction");
    instruction.textContent = config.instruction ?? "Select one or more intervals. Select an interval again to remove it.";
    intro.append(title, instruction);

    const graphHost = createElement(documentRef, "div", "question-graph-interaction__graph");
    const controls = createElement(documentRef, "div", "question-interval-selector");
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", config.controlLabel ?? "Selectable x intervals");
    const status = createElement(documentRef, "p", "question-graph-interaction__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    wrap.append(intro, graphHost, controls, status);
    host.append(wrap);
    host.hidden = false;
    host.dataset.visualKind = config.kind;

    const { diagram } = addGraph(graphHost, {
      title: config.graphTitle ?? "Graph of f(x)",
      coefficients: spec.coefficients,
      xDomain: spec.xDomain,
      yDomain: spec.yDomain,
      tone: "curve",
      ariaLabel: config.ariaLabel ?? "Graph for selecting calculus intervals",
      minHeight: 230
    });

    const [xMin, xMax] = spec.xDomain.map(Number);
    const [yMin, yMax] = spec.yDomain.map(Number);
    const regionById = new Map();

    for (const segment of config.segments) {
      const left = segment.from == null ? xMin : Number(segment.from);
      const right = segment.to == null ? xMax : Number(segment.to);
      const region = diagram.shadedRegion([
        { x: left, y: yMin },
        { x: left, y: yMax },
        { x: right, y: yMax },
        { x: right, y: yMin }
      ], { tone: "accent", opacity: 0.02 });
      region.element.classList.add("question-interval-selector__region");
      regionById.set(segment.id, region.element);
    }

    for (const boundary of config.boundaries ?? []) {
      const x = Number(boundary);
      if (!Number.isFinite(x)) continue;
      diagram.line({ x1: x, y1: yMin, x2: x, y2: yMax, tone: "bound", dashed: true });
      diagram.label({
        x,
        y: Math.min(0, yMax),
        text: config.boundaryLabels?.[String(boundary)] ?? String(boundary),
        dy: 22,
        tone: "bound"
      });
    }

    function sync() {
      for (const button of controls.querySelectorAll("[data-interval-segment]")) {
        const active = selected.has(button.dataset.intervalSegment);
        button.setAttribute("aria-pressed", active ? "true" : "false");
        button.dataset.selected = active ? "true" : "false";
      }
      for (const [id, region] of regionById) {
        region.style.opacity = selected.has(id) ? "0.13" : "0.02";
      }
      const labels = config.segments
        .filter((segment) => selected.has(segment.id))
        .map((segment) => segment.label);
      status.textContent = labels.length
        ? `Selected: ${labels.join(" and ")}.`
        : "No interval selected yet.";
    }

    for (const segment of config.segments) {
      const button = createElement(documentRef, "button", "question-interval-selector__segment");
      button.type = "button";
      button.dataset.intervalSegment = segment.id;
      button.setAttribute("aria-pressed", selected.has(segment.id) ? "true" : "false");
      const label = createElement(documentRef, "span", "question-interval-selector__segment-label");
      label.textContent = segment.label;
      const cue = createElement(documentRef, "span", "question-interval-selector__segment-cue");
      cue.textContent = segment.cue ?? "";
      button.append(label, cue);
      const handler = () => {
        if (selected.has(segment.id)) selected.delete(segment.id);
        else selected.add(segment.id);
        sync();
        onResponseChange(intervalResponseFromSelection(config, [...selected]));
      };
      button.addEventListener("click", handler);
      addCleanup(() => button.removeEventListener("click", handler));
      controls.append(button);
      if (!focusTarget) focusTarget = button;
    }
    sync();
    return true;
  }

  function renderPointClassifier(question, response) {
    const config = question.diagramConfig;
    const spec = graphSpec(question);
    const point = pointSpec(question);
    if (!validGraphSpec(spec) || !point) return false;

    let pointSelected = Boolean(response);
    const wrap = createElement(documentRef, "section", "question-graph-interaction question-graph-interaction--point");
    const intro = createElement(documentRef, "div", "question-graph-interaction__intro");
    const title = createElement(documentRef, "h3", "question-graph-interaction__title");
    title.textContent = config.title ?? "Classify the marked point";
    const instruction = createElement(documentRef, "p", "question-graph-interaction__instruction");
    instruction.textContent = config.instruction ?? "Select the marked point on the graph, then classify it.";
    intro.append(title, instruction);

    const graphHost = createElement(documentRef, "div", "question-graph-interaction__graph");
    const classifier = createElement(documentRef, "div", "question-point-classifier__choices");
    classifier.setAttribute("role", "group");
    classifier.setAttribute("aria-label", config.controlLabel ?? "Classify the selected point");
    const status = createElement(documentRef, "p", "question-graph-interaction__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    wrap.append(intro, graphHost, classifier, status);
    host.append(wrap);
    host.hidden = false;
    host.dataset.visualKind = config.kind;

    const { diagram } = addGraph(graphHost, {
      title: config.graphTitle ?? "Graph of f(x)",
      coefficients: spec.coefficients,
      xDomain: spec.xDomain,
      yDomain: spec.yDomain,
      tone: "curve",
      ariaLabel: config.ariaLabel ?? "Graph with a marked calculus point to classify",
      minHeight: 240
    });

    const pointX = Number(point.x);
    const pointY = Number(point.y);
    if (config.showGuide !== false) {
      const [yMin, yMax] = spec.yDomain.map(Number);
      diagram.line({ x1: pointX, y1: yMin, x2: pointX, y2: yMax, tone: "bound", dashed: true });
    }
    const visiblePoint = diagram.point({
      x: pointX,
      y: pointY,
      radius: 13,
      tone: "accent",
      label: config.pointLabel ?? "P",
      tooltip: "Marked point to classify"
    });
    const hitPoint = diagram.point({ x: pointX, y: pointY, radius: 48, tone: "interactive" });
    hitPoint.element.style.opacity = "0.001";
    hitPoint.element.style.cursor = "pointer";
    hitPoint.element.style.pointerEvents = "all";
    hitPoint.element.setAttribute("tabindex", "0");
    hitPoint.element.setAttribute("role", "button");
    hitPoint.element.setAttribute("aria-label", config.pointAriaLabel ?? `Select marked point at x = ${pointX}`);
    hitPoint.element.setAttribute("aria-pressed", pointSelected ? "true" : "false");
    focusTarget = hitPoint.element;

    const buttons = [];
    for (const option of question.options ?? []) {
      const button = createElement(documentRef, "button", "question-point-classifier__choice");
      button.type = "button";
      button.dataset.pointClassification = option.id;
      button.textContent = option.label;
      button.setAttribute("aria-pressed", option.id === response ? "true" : "false");
      button.hidden = !pointSelected;
      const handler = () => {
        if (!pointSelected) return;
        buttons.forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
        status.textContent = `Selected classification: ${option.label}.`;
        onResponseChange(option.id);
      };
      button.addEventListener("click", handler);
      addCleanup(() => button.removeEventListener("click", handler));
      buttons.push(button);
      classifier.append(button);
    }

    function selectPoint() {
      pointSelected = true;
      hitPoint.element.setAttribute("aria-pressed", "true");
      visiblePoint.element.dataset.selected = "true";
      buttons.forEach((button) => { button.hidden = false; });
      status.textContent = response
        ? "Marked point selected. Your classification is shown below."
        : "Marked point selected. Now choose its classification.";
      buttons[0]?.focus?.();
    }

    const clickHandler = () => selectPoint();
    const keyHandler = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectPoint();
    };
    hitPoint.element.addEventListener("click", clickHandler);
    hitPoint.element.addEventListener("keydown", keyHandler);
    addCleanup(() => hitPoint.element.removeEventListener("click", clickHandler));
    addCleanup(() => hitPoint.element.removeEventListener("keydown", keyHandler));

    if (pointSelected) {
      visiblePoint.element.dataset.selected = "true";
      status.textContent = "Marked point selected. Your classification is shown below.";
    } else {
      status.textContent = "Select the marked point P to begin.";
    }
    return true;
  }

  function renderRegionSelector(question, response) {
    const config = question.diagramConfig;
    const spec = graphSpec(question);
    if (!validGraphSpec(spec)) return false;

    const selected = new Set(regionSelectionFromResponse(config, response));
    const allowMultiple = Boolean(config.allowMultiple);
    const wrap = createElement(documentRef, "section", "question-graph-interaction question-graph-interaction--regions");
    const intro = createElement(documentRef, "div", "question-graph-interaction__intro");
    const title = createElement(documentRef, "h3", "question-graph-interaction__title");
    title.textContent = config.title ?? "Select the required region";
    const instruction = createElement(documentRef, "p", "question-graph-interaction__instruction");
    instruction.textContent = config.instruction ?? "Select the region on the graph. Use the large buttons below as an alternative.";
    intro.append(title, instruction);

    const graphHost = createElement(documentRef, "div", "question-graph-interaction__graph");
    const controls = createElement(documentRef, "div", "question-region-selector__choices");
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", config.controlLabel ?? "Selectable graph regions");
    const status = createElement(documentRef, "p", "question-graph-interaction__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    wrap.append(intro, graphHost, controls, status);
    host.append(wrap);
    host.hidden = false;
    host.dataset.visualKind = config.kind;

    const { diagram } = addGraph(graphHost, {
      title: config.graphTitle ?? "Graph",
      coefficients: spec.coefficients,
      xDomain: spec.xDomain,
      yDomain: spec.yDomain,
      tone: config.primaryTone ?? "curve",
      ariaLabel: config.ariaLabel ?? "Graph with selectable calculus regions",
      minHeight: 250,
      extraCurves: config.secondaryCurves ?? []
    });

    const regionElements = new Map();
    const controlButtons = new Map();

    function emitSelection() {
      onResponseChange(regionResponseFromSelection(config, [...selected]));
    }

    function chooseRegion(id) {
      if (!allowMultiple) {
        const alreadySelected = selected.has(id) && selected.size === 1;
        selected.clear();
        if (!alreadySelected) selected.add(id);
      } else if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
      sync();
      emitSelection();
    }

    function sync() {
      for (const region of config.regions) {
        const active = selected.has(region.id);
        const polygon = regionElements.get(region.id);
        const button = controlButtons.get(region.id);
        polygon?.setAttribute("aria-pressed", active ? "true" : "false");
        if (polygon) {
          polygon.dataset.selected = active ? "true" : "false";
          polygon.style.opacity = active ? "0.18" : "0.035";
        }
        button?.setAttribute("aria-pressed", active ? "true" : "false");
      }
      const labels = config.regions.filter((region) => selected.has(region.id)).map((region) => region.label);
      status.textContent = labels.length ? `Selected: ${labels.join(" and ")}.` : "No region selected yet.";
    }

    for (const region of config.regions) {
      const polygon = diagram.shadedRegion(
        sampleBetween(region.upperCoefficients, region.lowerCoefficients, Number(region.from), Number(region.to)),
        { tone: region.tone ?? "region", opacity: selected.has(region.id) ? 0.18 : 0.035 }
      ).element;
      polygon.classList.add("question-region-selector__region");
      polygon.setAttribute("tabindex", "0");
      polygon.setAttribute("role", "button");
      polygon.setAttribute("aria-label", region.ariaLabel ?? `Select ${region.label}`);
      polygon.setAttribute("aria-pressed", selected.has(region.id) ? "true" : "false");
      polygon.style.pointerEvents = "all";
      polygon.style.cursor = "pointer";
      const clickHandler = () => chooseRegion(region.id);
      const keyHandler = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        chooseRegion(region.id);
      };
      polygon.addEventListener("click", clickHandler);
      polygon.addEventListener("keydown", keyHandler);
      addCleanup(() => polygon.removeEventListener("click", clickHandler));
      addCleanup(() => polygon.removeEventListener("keydown", keyHandler));
      regionElements.set(region.id, polygon);
      if (!focusTarget) focusTarget = polygon;

      const button = createElement(documentRef, "button", "question-region-selector__choice");
      button.type = "button";
      button.setAttribute("aria-pressed", selected.has(region.id) ? "true" : "false");
      const label = createElement(documentRef, "span", "question-region-selector__label");
      label.textContent = region.label;
      const cue = createElement(documentRef, "span", "question-region-selector__cue");
      cue.textContent = region.cue ?? "";
      button.append(label, cue);
      const buttonHandler = () => chooseRegion(region.id);
      button.addEventListener("click", buttonHandler);
      addCleanup(() => button.removeEventListener("click", buttonHandler));
      controls.append(button);
      controlButtons.set(region.id, button);
    }
    sync();
    return true;
  }

  function renderSplitSelector(question, response) {
    const config = question.diagramConfig;
    const spec = graphSpec(question);
    if (!validGraphSpec(spec)) return false;

    const restored = splitSelectionFromResponse(config, response);
    const selected = new Set(restored.ids);
    let noneSelected = restored.none;
    const allowMultiple = config.allowMultiple !== false;

    const wrap = createElement(documentRef, "section", "question-graph-interaction question-graph-interaction--splits");
    const intro = createElement(documentRef, "div", "question-graph-interaction__intro");
    const title = createElement(documentRef, "h3", "question-graph-interaction__title");
    title.textContent = config.title ?? "Select the split point(s)";
    const instruction = createElement(documentRef, "p", "question-graph-interaction__instruction");
    instruction.textContent = config.instruction ?? "Select every x-value where the integral must be split.";
    intro.append(title, instruction);
    const graphHost = createElement(documentRef, "div", "question-graph-interaction__graph");
    const controls = createElement(documentRef, "div", "question-split-selector__choices");
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", config.controlLabel ?? "Candidate split points");
    const status = createElement(documentRef, "p", "question-graph-interaction__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    wrap.append(intro, graphHost, controls, status);
    host.append(wrap);
    host.hidden = false;
    host.dataset.visualKind = config.kind;

    const { diagram } = addGraph(graphHost, {
      title: config.graphTitle ?? "Graph",
      coefficients: spec.coefficients,
      xDomain: spec.xDomain,
      yDomain: spec.yDomain,
      tone: config.primaryTone ?? "curve",
      ariaLabel: config.ariaLabel ?? "Graph with candidate split points",
      minHeight: 250,
      extraCurves: config.secondaryCurves ?? []
    });

    const [yMin, yMax] = spec.yDomain.map(Number);
    const markerById = new Map();
    const hitById = new Map();
    const buttonById = new Map();

    function emitSelection() {
      if (noneSelected) {
        onResponseChange(config.noneResponse ?? "");
        return;
      }
      onResponseChange(splitResponseFromSelection(config, [...selected]));
    }

    function chooseSplit(id) {
      noneSelected = false;
      if (!allowMultiple) selected.clear();
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      sync();
      emitSelection();
    }

    function chooseNone() {
      selected.clear();
      noneSelected = true;
      sync();
      emitSelection();
    }

    function sync() {
      for (const candidate of config.splitCandidates) {
        const active = selected.has(candidate.id);
        markerById.get(candidate.id)?.element.setAttribute("data-selected", active ? "true" : "false");
        hitById.get(candidate.id)?.setAttribute("aria-pressed", active ? "true" : "false");
        buttonById.get(candidate.id)?.setAttribute("aria-pressed", active ? "true" : "false");
      }
      const noneButton = controls.querySelector("[data-split-none]");
      noneButton?.setAttribute("aria-pressed", noneSelected ? "true" : "false");
      const labels = config.splitCandidates.filter((candidate) => selected.has(candidate.id)).map((candidate) => candidate.label);
      status.textContent = noneSelected
        ? "Selected: no split is needed."
        : labels.length
          ? `Selected split point${labels.length > 1 ? "s" : ""}: ${labels.join(" and ")}.`
          : "No split point selected yet.";
    }

    for (const candidate of config.splitCandidates) {
      const x = Number(candidate.x);
      const y = Number.isFinite(Number(candidate.y)) ? Number(candidate.y) : 0;
      if (config.showGuides !== false) {
        diagram.line({ x1: x, y1: yMin, x2: x, y2: yMax, tone: "bound", dashed: true });
      }
      const marker = diagram.point({ x, y, radius: 11, tone: "accent", label: candidate.graphLabel ?? candidate.label });
      const hit = diagram.point({ x, y, radius: 46, tone: "interactive" }).element;
      hit.classList.add("question-split-selector__hit");
      hit.style.opacity = "0.001";
      hit.style.pointerEvents = "all";
      hit.style.cursor = "pointer";
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("role", "button");
      hit.setAttribute("aria-label", candidate.ariaLabel ?? `Toggle split at ${candidate.label}`);
      hit.setAttribute("aria-pressed", selected.has(candidate.id) ? "true" : "false");
      const hitClick = () => chooseSplit(candidate.id);
      const hitKey = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        chooseSplit(candidate.id);
      };
      hit.addEventListener("click", hitClick);
      hit.addEventListener("keydown", hitKey);
      addCleanup(() => hit.removeEventListener("click", hitClick));
      addCleanup(() => hit.removeEventListener("keydown", hitKey));
      markerById.set(candidate.id, marker);
      hitById.set(candidate.id, hit);
      if (!focusTarget) focusTarget = hit;

      const button = createElement(documentRef, "button", "question-split-selector__choice");
      button.type = "button";
      button.textContent = candidate.label;
      button.setAttribute("aria-pressed", selected.has(candidate.id) ? "true" : "false");
      const buttonHandler = () => chooseSplit(candidate.id);
      button.addEventListener("click", buttonHandler);
      addCleanup(() => button.removeEventListener("click", buttonHandler));
      controls.append(button);
      buttonById.set(candidate.id, button);
    }

    if (config.noneResponse) {
      const noneButton = createElement(documentRef, "button", "question-split-selector__choice");
      noneButton.type = "button";
      noneButton.dataset.splitNone = "";
      noneButton.textContent = config.noneLabel ?? "No split needed";
      noneButton.setAttribute("aria-pressed", noneSelected ? "true" : "false");
      const noneHandler = () => chooseNone();
      noneButton.addEventListener("click", noneHandler);
      addCleanup(() => noneButton.removeEventListener("click", noneHandler));
      controls.append(noneButton);
    }

    sync();
    return true;
  }

  function handlesResponse(question) {
    return isInteractiveQuestionVisual(question);
  }

  function render(question, { response = "" } = {}) {
    clear();
    const kind = question?.diagramConfig?.kind;
    if (kind === "function-derivative-choice") return renderDerivativeMatch(question);
    if (kind === "calculus-interval-selector") return renderIntervalSelector(question, response);
    if (kind === "calculus-point-classifier") return renderPointClassifier(question, response);
    if (kind === "calculus-region-selector") return renderRegionSelector(question, response);
    if (kind === "calculus-split-selector") return renderSplitSelector(question, response);
    return false;
  }

  function focusResponse() {
    focusTarget?.focus?.();
  }

  return Object.freeze({ render, clear, handlesResponse, focusResponse });
}
