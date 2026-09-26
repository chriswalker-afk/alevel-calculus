import { DiagramPrimitives } from "./diagram-primitives.js";
import { evaluatePolynomial } from "./linked-function-gradient-explorer.js";

export const specialInteractiveQuestionVisualKinds = Object.freeze([
  "calculus-parametric-point-selector",
  "calculus-parametric-direction-selector",
  "calculus-trapezium-ordinate-selector",
  "calculus-trapezium-bound-selector"
]);

function createElement(documentRef, tag, className = "") {
  const element = documentRef.createElement(tag);
  if (className) element.className = className;
  return element;
}

function validDomain(value) {
  return Array.isArray(value)
    && value.length === 2
    && value.every((item) => Number.isFinite(Number(item)))
    && Number(value[0]) !== Number(value[1]);
}

function selectionKey(ids, order = []) {
  const selected = new Set((ids ?? []).map(String));
  const ordered = order.map(String).filter((id) => selected.has(id));
  const extras = [...selected].filter((id) => !ordered.includes(id)).sort();
  return [...ordered, ...extras].join("|");
}

function selectionResponse(config, items, prefix, ids) {
  const key = selectionKey(ids, (items ?? []).map((item) => item.id));
  if (!key) return "";
  return config?.responseMap?.[key] ?? `${prefix}:${key}`;
}

function selectionFromResponse(config, items, prefix, response) {
  const text = String(response ?? "");
  if (!text) return Object.freeze([]);
  const mapped = Object.entries(config?.responseMap ?? {}).find(([, value]) => String(value) === text)?.[0];
  const raw = mapped ?? (text.startsWith(`${prefix}:`) ? text.slice(prefix.length + 1) : "");
  const allowed = new Set((items ?? []).map((item) => String(item.id)));
  return Object.freeze(raw.split("|").filter((id) => allowed.has(id)));
}

export function parametricResponseFromSelection(config, ids) {
  return selectionResponse(config, config?.candidates, "parametric", ids);
}

export function parametricSelectionFromResponse(config, response) {
  return selectionFromResponse(config, config?.candidates, "parametric", response);
}

export function trapeziumResponseFromSelection(config, ids) {
  return selectionResponse(config, config?.ordinates, "ordinates", ids);
}

export function trapeziumSelectionFromResponse(config, response) {
  if (String(response ?? "") === String(config?.noneResponse ?? "__never__")) {
    return Object.freeze({ ids: Object.freeze([]), none: true });
  }
  return Object.freeze({
    ids: selectionFromResponse(config, config?.ordinates, "ordinates", response),
    none: false
  });
}

export function directionResponseFromChoice(config, choiceId) {
  return config?.responseMap?.[choiceId] ?? String(choiceId ?? "");
}

function resolvedParametricSpec(question) {
  const config = question?.diagramConfig ?? {};
  const keyed = config.specKey ? question?.parameters?.[config.specKey] : null;
  return keyed ? { ...config, ...keyed, kind: config.kind } : config;
}

function evalParametric(spec, t) {
  if (spec.traceType === "ellipse") {
    const xOffset = Number(spec.xOffset ?? 0);
    const yOffset = Number(spec.yOffset ?? 0);
    return {
      x: xOffset + Number(spec.xScale ?? 1) * Math.cos(t),
      y: yOffset + Number(spec.yScale ?? 1) * Math.sin(t)
    };
  }
  return {
    x: evaluatePolynomial(spec.xCoefficients, t),
    y: evaluatePolynomial(spec.yCoefficients, t)
  };
}

function validParametricSpec(spec) {
  if (!validDomain(spec?.tDomain) || !validDomain(spec?.xDomain) || !validDomain(spec?.yDomain)) return false;
  if (spec.traceType === "ellipse") {
    return Number.isFinite(Number(spec.xScale)) && Number.isFinite(Number(spec.yScale));
  }
  return Array.isArray(spec?.xCoefficients)
    && Array.isArray(spec?.yCoefficients)
    && spec.xCoefficients.length > 0
    && spec.yCoefficients.length > 0
    && spec.xCoefficients.every((value) => Number.isFinite(Number(value)))
    && spec.yCoefficients.every((value) => Number.isFinite(Number(value)));
}

function sampleParametric(spec, count = 180) {
  const [tMin, tMax] = spec.tDomain.map(Number);
  return Array.from({ length: count + 1 }, (_, index) => {
    const t = tMin + (index / count) * (tMax - tMin);
    return evalParametric(spec, t);
  }).filter(({ x, y }) => Number.isFinite(x) && Number.isFinite(y));
}

function candidatePoint(spec, candidate) {
  if (Number.isFinite(Number(candidate?.x)) && Number.isFinite(Number(candidate?.y))) {
    return { x: Number(candidate.x), y: Number(candidate.y) };
  }
  return evalParametric(spec, Number(candidate?.t));
}

function validParametricCandidate(spec, candidate) {
  const point = candidatePoint(spec, candidate);
  return candidate?.id && Number.isFinite(point.x) && Number.isFinite(point.y);
}

function validTrapeziumConfig(config) {
  const xValues = config?.xValues;
  const yValues = config?.yValues;
  return Array.isArray(xValues)
    && Array.isArray(yValues)
    && xValues.length >= 3
    && xValues.length === yValues.length
    && xValues.every((value) => Number.isFinite(Number(value)))
    && yValues.every((value) => Number.isFinite(Number(value)))
    && validDomain(config.xDomain)
    && validDomain(config.yDomain)
    && Array.isArray(config.ordinates)
    && config.ordinates.length === xValues.length;
}

function validTrapeziumBoundConfig(config) {
  return Array.isArray(config?.coefficients)
    && config.coefficients.length > 0
    && config.coefficients.every((value) => Number.isFinite(Number(value)))
    && Array.isArray(config?.xValues)
    && Array.isArray(config?.yValues)
    && config.xValues.length >= 2
    && config.xValues.length === config.yValues.length
    && config.xValues.every((value) => Number.isFinite(Number(value)))
    && config.yValues.every((value) => Number.isFinite(Number(value)))
    && validDomain(config.xDomain)
    && validDomain(config.yDomain)
    && Array.isArray(config.boundChoices)
    && config.boundChoices.length >= 2;
}

export function isSpecialInteractiveQuestionVisual(question) {
  const config = question?.diagramConfig ?? {};
  if (!specialInteractiveQuestionVisualKinds.includes(config.kind)) return false;
  if (config.kind === "calculus-trapezium-ordinate-selector") return validTrapeziumConfig(config);
  if (config.kind === "calculus-trapezium-bound-selector") return validTrapeziumBoundConfig(config);

  const spec = resolvedParametricSpec(question);
  if (!validParametricSpec(spec)) return false;
  if (config.kind === "calculus-parametric-point-selector") {
    return Array.isArray(spec.candidates)
      && spec.candidates.length >= 2
      && spec.candidates.every((candidate) => validParametricCandidate(spec, candidate));
  }
  return Array.isArray(spec.directionChoices) && spec.directionChoices.length >= 2;
}

export function createSpecialQuestionVisualRenderer(host, { onResponseChange = () => {} } = {}) {
  if (!host?.ownerDocument) {
    return Object.freeze({ render() {}, clear() {}, focusResponse() {} });
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
  }

  function createGraphCard(title, xDomain, yDomain, ariaLabel, minHeight = 250) {
    const card = createElement(documentRef, "section", "question-graph-card");
    const heading = createElement(documentRef, "h3", "question-graph-card__title");
    heading.textContent = title;
    const plot = createElement(documentRef, "div", "question-graph-card__plot");
    card.append(heading, plot);
    const diagram = new DiagramPrimitives(plot, {
      xDomain,
      yDomain,
      ariaLabel,
      minHeight,
      aspectRatio: "4 / 3"
    });
    diagram.grid({ xStep: 1, yStep: 1 });
    diagram.axes({ tickStep: 1 });
    diagrams.push(diagram);
    return { card, plot, diagram };
  }

  function shell(config, modifier) {
    const wrap = createElement(documentRef, "section", `question-graph-interaction ${modifier}`);
    const intro = createElement(documentRef, "div", "question-graph-interaction__intro");
    const title = createElement(documentRef, "h3", "question-graph-interaction__title");
    title.textContent = config.title ?? "Make a selection";
    const instruction = createElement(documentRef, "p", "question-graph-interaction__instruction");
    instruction.textContent = config.instruction ?? "Select the mathematically correct target.";
    intro.append(title, instruction);
    const graphHost = createElement(documentRef, "div", "question-graph-interaction__graph");
    const controls = createElement(documentRef, "div");
    const status = createElement(documentRef, "p", "question-graph-interaction__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    wrap.append(intro, graphHost, controls, status);
    host.append(wrap);
    host.hidden = false;
    host.dataset.visualKind = config.kind;
    return { wrap, graphHost, controls, status };
  }

  function renderParametricPointSelector(question, response) {
    const config = question.diagramConfig;
    const spec = resolvedParametricSpec(question);
    if (!validParametricSpec(spec)) return false;

    const selected = new Set(parametricSelectionFromResponse(spec, response));
    const allowMultiple = Boolean(spec.allowMultiple);
    const { graphHost, controls, status } = shell(spec, "question-graph-interaction--parametric");
    controls.className = "question-parametric-selector__choices";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", spec.controlLabel ?? "Candidate points on the parametric curve");

    const { card, diagram } = createGraphCard(
      spec.graphTitle ?? "Parametric curve",
      spec.xDomain,
      spec.yDomain,
      spec.ariaLabel ?? "Parametric curve with selectable points",
      260
    );
    graphHost.append(card);
    diagram.polyline(sampleParametric(spec), { tone: "curve" });

    const visibleById = new Map();
    const hitById = new Map();
    const buttonById = new Map();

    function choose(id) {
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
      onResponseChange(parametricResponseFromSelection(spec, [...selected]));
    }

    function sync() {
      for (const candidate of spec.candidates) {
        const active = selected.has(candidate.id);
        visibleById.get(candidate.id)?.element.setAttribute("data-selected", active ? "true" : "false");
        hitById.get(candidate.id)?.setAttribute("aria-pressed", active ? "true" : "false");
        buttonById.get(candidate.id)?.setAttribute("aria-pressed", active ? "true" : "false");
      }
      const labels = spec.candidates.filter((candidate) => selected.has(candidate.id)).map((candidate) => candidate.label);
      status.textContent = labels.length ? `Selected: ${labels.join(" and ")}.` : "No point selected yet.";
    }

    for (const candidate of spec.candidates) {
      const point = candidatePoint(spec, candidate);
      const visible = diagram.point({
        x: point.x,
        y: point.y,
        radius: 10,
        tone: candidate.tone ?? "accent",
        label: candidate.graphLabel ?? candidate.shortLabel ?? ""
      });
      const hit = diagram.point({ x: point.x, y: point.y, radius: 44, tone: "interactive" }).element;
      hit.classList.add("question-parametric-selector__hit");
      hit.style.opacity = "0.001";
      hit.style.pointerEvents = "all";
      hit.style.cursor = "pointer";
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("role", "button");
      hit.setAttribute("aria-label", candidate.ariaLabel ?? `Select ${candidate.label}`);
      hit.setAttribute("aria-pressed", selected.has(candidate.id) ? "true" : "false");
      const click = () => choose(candidate.id);
      const key = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        choose(candidate.id);
      };
      hit.addEventListener("click", click);
      hit.addEventListener("keydown", key);
      addCleanup(() => hit.removeEventListener("click", click));
      addCleanup(() => hit.removeEventListener("keydown", key));
      visibleById.set(candidate.id, visible);
      hitById.set(candidate.id, hit);
      if (!focusTarget) focusTarget = hit;

      const button = createElement(documentRef, "button", "question-parametric-selector__choice");
      button.type = "button";
      button.setAttribute("aria-pressed", selected.has(candidate.id) ? "true" : "false");
      const label = createElement(documentRef, "span", "question-parametric-selector__label");
      label.textContent = candidate.label;
      const cue = createElement(documentRef, "span", "question-parametric-selector__cue");
      cue.textContent = candidate.cue ?? "";
      button.append(label, cue);
      const buttonClick = () => choose(candidate.id);
      button.addEventListener("click", buttonClick);
      addCleanup(() => button.removeEventListener("click", buttonClick));
      controls.append(button);
      buttonById.set(candidate.id, button);
    }

    sync();
    return true;
  }

  function renderDirectionSelector(question, response) {
    const spec = resolvedParametricSpec(question);
    if (!validParametricSpec(spec)) return false;
    const selectedResponse = String(response ?? "");
    const selectedChoice = spec.directionChoices.find((choice) =>
      String(directionResponseFromChoice(spec, choice.id)) === selectedResponse
    )?.id ?? "";

    const { graphHost, controls, status } = shell(spec, "question-graph-interaction--parametric-direction");
    controls.className = "question-parametric-direction__choices";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", spec.controlLabel ?? "Direction choices");

    const { card, diagram } = createGraphCard(
      spec.graphTitle ?? "Parametric traversal",
      spec.xDomain,
      spec.yDomain,
      spec.ariaLabel ?? "Parametric curve with start and end points",
      260
    );
    graphHost.append(card);
    diagram.polyline(sampleParametric(spec), { tone: "curve" });

    if (spec.startPoint) {
      diagram.point({ x: spec.startPoint.x, y: spec.startPoint.y, radius: 10, tone: "accent", label: spec.startPoint.label ?? "start" });
    }
    if (spec.endPoint) {
      diagram.point({ x: spec.endPoint.x, y: spec.endPoint.y, radius: 10, tone: "point", label: spec.endPoint.label ?? "end" });
    }

    const arrows = new Map();
    const buttons = new Map();
    for (const choice of spec.directionChoices) {
      if (choice.arrow) {
        const arrow = diagram.arrow({ ...choice.arrow, tone: choice.arrow.tone ?? "tangent", label: choice.arrow.label ?? "" });
        arrow.element.style.opacity = choice.id === selectedChoice ? "1" : "0.08";
        arrows.set(choice.id, arrow.element);
      }
      const button = createElement(documentRef, "button", "question-parametric-direction__choice");
      button.type = "button";
      button.setAttribute("aria-pressed", choice.id === selectedChoice ? "true" : "false");
      const label = createElement(documentRef, "span", "question-parametric-direction__label");
      label.textContent = choice.label;
      const cue = createElement(documentRef, "span", "question-parametric-direction__cue");
      cue.textContent = choice.cue ?? "";
      button.append(label, cue);
      const handler = () => {
        const mapped = directionResponseFromChoice(spec, choice.id);
        for (const [id, element] of arrows) element.style.opacity = id === choice.id ? "1" : "0.08";
        for (const [id, item] of buttons) item.setAttribute("aria-pressed", id === choice.id ? "true" : "false");
        status.textContent = `Selected: ${choice.label}.`;
        onResponseChange(mapped);
      };
      button.addEventListener("click", handler);
      addCleanup(() => button.removeEventListener("click", handler));
      controls.append(button);
      buttons.set(choice.id, button);
      if (!focusTarget) focusTarget = button;
    }
    status.textContent = selectedChoice
      ? `Selected: ${spec.directionChoices.find((choice) => choice.id === selectedChoice)?.label ?? ""}.`
      : "No direction selected yet.";
    return true;
  }

  function renderTrapeziumSelector(question, response) {
    const config = question.diagramConfig;
    if (!validTrapeziumConfig(config)) return false;
    const restored = trapeziumSelectionFromResponse(config, response);
    const selected = new Set(restored.ids);
    let noneSelected = restored.none;

    const { graphHost, controls, status } = shell(config, "question-graph-interaction--trapezium");
    controls.className = "question-trapezium-selector__choices";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", config.controlLabel ?? "Trapezium ordinate choices");

    const { card, diagram } = createGraphCard(
      config.graphTitle ?? "Trapezium-rule diagram",
      config.xDomain,
      config.yDomain,
      config.ariaLabel ?? "Trapezium approximation with selectable ordinates",
      260
    );
    graphHost.append(card);

    const points = config.xValues.map((x, index) => ({ x: Number(x), y: Number(config.yValues[index]) }));
    for (let index = 0; index < points.length - 1; index += 1) {
      const left = points[index];
      const right = points[index + 1];
      diagram.shadedRegion([
        { x: left.x, y: 0 },
        left,
        right,
        { x: right.x, y: 0 }
      ], { tone: "region", opacity: 0.07 });
    }
    diagram.polyline(points, { tone: "curve" });

    const visibleById = new Map();
    const hitById = new Map();
    const buttonById = new Map();

    function emit() {
      if (noneSelected) onResponseChange(config.noneResponse ?? "");
      else onResponseChange(trapeziumResponseFromSelection(config, [...selected]));
    }

    function choose(id) {
      noneSelected = false;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      sync();
      emit();
    }

    function chooseNone() {
      selected.clear();
      noneSelected = true;
      sync();
      emit();
    }

    function sync() {
      for (const ordinate of config.ordinates) {
        const active = selected.has(ordinate.id);
        visibleById.get(ordinate.id)?.element.setAttribute("data-selected", active ? "true" : "false");
        hitById.get(ordinate.id)?.setAttribute("aria-pressed", active ? "true" : "false");
        buttonById.get(ordinate.id)?.setAttribute("aria-pressed", active ? "true" : "false");
      }
      controls.querySelector("[data-ordinate-none]")?.setAttribute("aria-pressed", noneSelected ? "true" : "false");
      const labels = config.ordinates.filter((ordinate) => selected.has(ordinate.id)).map((ordinate) => ordinate.label);
      status.textContent = noneSelected
        ? "Selected: no ordinates receive coefficient 2."
        : labels.length
          ? `Selected ordinates: ${labels.join(", ")}.`
          : "No ordinate selected yet.";
    }

    for (let index = 0; index < config.ordinates.length; index += 1) {
      const ordinate = config.ordinates[index];
      const point = points[index];
      diagram.line({ x1: point.x, y1: 0, x2: point.x, y2: point.y, tone: "bound" });
      const visible = diagram.point({ x: point.x, y: point.y, radius: 9, tone: "accent", label: ordinate.graphLabel ?? ordinate.label });
      const hit = diagram.point({ x: point.x, y: point.y, radius: 42, tone: "interactive" }).element;
      hit.classList.add("question-trapezium-selector__hit");
      hit.style.opacity = "0.001";
      hit.style.pointerEvents = "all";
      hit.style.cursor = "pointer";
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("role", "button");
      hit.setAttribute("aria-label", ordinate.ariaLabel ?? `Toggle ${ordinate.label}`);
      hit.setAttribute("aria-pressed", selected.has(ordinate.id) ? "true" : "false");
      const hitClick = () => choose(ordinate.id);
      const hitKey = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        choose(ordinate.id);
      };
      hit.addEventListener("click", hitClick);
      hit.addEventListener("keydown", hitKey);
      addCleanup(() => hit.removeEventListener("click", hitClick));
      addCleanup(() => hit.removeEventListener("keydown", hitKey));
      visibleById.set(ordinate.id, visible);
      hitById.set(ordinate.id, hit);
      if (!focusTarget) focusTarget = hit;

      const button = createElement(documentRef, "button", "question-trapezium-selector__choice");
      button.type = "button";
      button.textContent = ordinate.label;
      button.setAttribute("aria-pressed", selected.has(ordinate.id) ? "true" : "false");
      const buttonClick = () => choose(ordinate.id);
      button.addEventListener("click", buttonClick);
      addCleanup(() => button.removeEventListener("click", buttonClick));
      controls.append(button);
      buttonById.set(ordinate.id, button);
    }

    if (config.noneResponse) {
      const noneButton = createElement(documentRef, "button", "question-trapezium-selector__choice");
      noneButton.type = "button";
      noneButton.dataset.ordinateNone = "";
      noneButton.textContent = config.noneLabel ?? "None";
      noneButton.setAttribute("aria-pressed", noneSelected ? "true" : "false");
      const handler = () => chooseNone();
      noneButton.addEventListener("click", handler);
      addCleanup(() => noneButton.removeEventListener("click", handler));
      controls.append(noneButton);
    }

    sync();
    return true;
  }

  function renderTrapeziumBoundSelector(question, response) {
    const config = question.diagramConfig;
    if (!validTrapeziumBoundConfig(config)) return false;

    const selectedResponse = String(response ?? "");
    const selectedChoice = config.boundChoices.find((choice) =>
      String(config.responseMap?.[choice.id] ?? choice.id) === selectedResponse
    )?.id ?? "";

    const { graphHost, controls, status } = shell(config, "question-graph-interaction--trapezium-bound");
    controls.className = "question-trapezium-bound__choices";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", config.controlLabel ?? "Trapezium estimate classification");

    const { card, diagram } = createGraphCard(
      config.graphTitle ?? "Curve and trapezium approximation",
      config.xDomain,
      config.yDomain,
      config.ariaLabel ?? "Curve with trapezium chords",
      260
    );
    graphHost.append(card);

    const [xMin, xMax] = config.xDomain.map(Number);
    diagram.polyline(
      Array.from({ length: 161 }, (_, index) => {
        const x = xMin + (index / 160) * (xMax - xMin);
        return { x, y: evaluatePolynomial(config.coefficients, x) };
      }),
      { tone: "curve" }
    );

    const points = config.xValues.map((x, index) => ({ x: Number(x), y: Number(config.yValues[index]) }));
    for (let index = 0; index < points.length - 1; index += 1) {
      const left = points[index];
      const right = points[index + 1];
      diagram.shadedRegion([
        { x: left.x, y: 0 },
        left,
        right,
        { x: right.x, y: 0 }
      ], { tone: "region", opacity: 0.06 });
      diagram.line({ x1: left.x, y1: left.y, x2: right.x, y2: right.y, tone: "tangent" });
    }
    for (const point of points) {
      diagram.line({ x1: point.x, y1: 0, x2: point.x, y2: point.y, tone: "bound" });
      diagram.point({ x: point.x, y: point.y, radius: 8, tone: "accent" });
    }

    const buttons = new Map();
    for (const choice of config.boundChoices) {
      const button = createElement(documentRef, "button", "question-trapezium-bound__choice");
      button.type = "button";
      button.setAttribute("aria-pressed", choice.id === selectedChoice ? "true" : "false");
      const label = createElement(documentRef, "span", "question-trapezium-bound__label");
      label.textContent = choice.label;
      const cue = createElement(documentRef, "span", "question-trapezium-bound__cue");
      cue.textContent = choice.cue ?? "";
      button.append(label, cue);
      const handler = () => {
        const mapped = config.responseMap?.[choice.id] ?? choice.id;
        for (const [id, item] of buttons) item.setAttribute("aria-pressed", id === choice.id ? "true" : "false");
        status.textContent = `Selected: ${choice.label}.`;
        onResponseChange(mapped);
      };
      button.addEventListener("click", handler);
      addCleanup(() => button.removeEventListener("click", handler));
      controls.append(button);
      buttons.set(choice.id, button);
      if (!focusTarget) focusTarget = button;
    }
    status.textContent = selectedChoice
      ? `Selected: ${config.boundChoices.find((choice) => choice.id === selectedChoice)?.label ?? ""}.`
      : "Choose how the trapezium estimate compares with the exact integral.";
    return true;
  }

  function render(question, { response = "" } = {}) {
    clear();
    const kind = question?.diagramConfig?.kind;
    if (kind === "calculus-parametric-point-selector") return renderParametricPointSelector(question, response);
    if (kind === "calculus-parametric-direction-selector") return renderDirectionSelector(question, response);
    if (kind === "calculus-trapezium-ordinate-selector") return renderTrapeziumSelector(question, response);
    if (kind === "calculus-trapezium-bound-selector") return renderTrapeziumBoundSelector(question, response);
    return false;
  }

  function focusResponse() {
    focusTarget?.focus?.();
  }

  return Object.freeze({ render, clear, focusResponse });
}
