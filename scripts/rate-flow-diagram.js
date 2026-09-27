import { DiagramPrimitives } from "./diagram-primitives.js";

const RATE_STATUSES = Object.freeze({
  known: Object.freeze({ label: "known", symbol: "●", tone: "accent" }),
  unknown: Object.freeze({ label: "find", symbol: "◆", tone: "warning" }),
  relationship: Object.freeze({ label: "relationship", symbol: "■", tone: "primary" })
});

export const RATE_FLOW_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "expanding-circle",
    label: "Expanding circle",
    context: "A circular ripple expands as time passes.",
    variables: Object.freeze([
      Object.freeze({ id: "t", symbol: "t", label: "time", unit: "s" }),
      Object.freeze({ id: "r", symbol: "r", label: "radius", unit: "cm" }),
      Object.freeze({ id: "A", symbol: "A", label: "area", unit: "cm²" })
    ]),
    relations: Object.freeze([
      Object.freeze({ id: "r-t", from: "t", to: "r", status: "known", detail: "0.40 cm s⁻¹" }),
      Object.freeze({ id: "A-r", from: "r", to: "A", status: "relationship", detail: "dA/dr = 2πr" })
    ]),
    targetRate: Object.freeze({ from: "t", to: "A", status: "unknown", detail: "rate of change of area" }),
    initialOrder: Object.freeze(["A", "t", "r"]),
    initialOrientations: Object.freeze({ "r-t": "reverse", "A-r": "forward", target: "forward" })
  }),
  Object.freeze({
    id: "sphere-density-chain",
    label: "Expanding sphere → mass",
    context: "A sphere expands; its volume changes, and mass depends on volume.",
    variables: Object.freeze([
      Object.freeze({ id: "t", symbol: "t", label: "time", unit: "s" }),
      Object.freeze({ id: "r", symbol: "r", label: "radius", unit: "cm" }),
      Object.freeze({ id: "V", symbol: "V", label: "volume", unit: "cm³" }),
      Object.freeze({ id: "m", symbol: "m", label: "mass", unit: "g" })
    ]),
    relations: Object.freeze([
      Object.freeze({ id: "r-t", from: "t", to: "r", status: "known", detail: "dr/dt is known" }),
      Object.freeze({ id: "V-r", from: "r", to: "V", status: "relationship", detail: "V = 4πr³/3" }),
      Object.freeze({ id: "m-V", from: "V", to: "m", status: "known", detail: "dm/dV is known" })
    ]),
    targetRate: Object.freeze({ from: "t", to: "m", status: "unknown", detail: "find dm/dt" }),
    initialOrder: Object.freeze(["V", "t", "m", "r"]),
    initialOrientations: Object.freeze({ "r-t": "forward", "V-r": "reverse", "m-V": "forward", target: "reverse" })
  })
]);

function finiteArray(value) {
  return Array.isArray(value) ? value : [];
}

export function validateRateFlowDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("Rate-flow definition must be an object.");
  const variables = finiteArray(definition.variables);
  const relations = finiteArray(definition.relations);
  if (variables.length < 2) throw new Error("Rate-flow definition requires at least two variables.");
  const ids = new Set();
  for (const variable of variables) {
    if (!variable?.id || !variable?.symbol || ids.has(variable.id)) throw new Error("Variables require unique id and symbol values.");
    ids.add(variable.id);
  }
  for (const relation of relations) {
    if (!relation?.id || !ids.has(relation.from) || !ids.has(relation.to) || relation.from === relation.to) {
      throw new Error("Each rate relation requires a unique id and valid from/to variables.");
    }
    if (!RATE_STATUSES[relation.status]) throw new Error(`Unknown rate status: ${relation.status}`);
  }
  if (!definition.targetRate || !ids.has(definition.targetRate.from) || !ids.has(definition.targetRate.to)) {
    throw new Error("Rate-flow definition requires a valid targetRate.");
  }
  if (!RATE_STATUSES[definition.targetRate.status || "unknown"]) throw new Error("Target rate has an unknown status.");
  return definition;
}

export function derivativeLabel(definition, fromId, toId, orientation = "forward") {
  validateRateFlowDefinition(definition);
  const variables = new Map(definition.variables.map((variable) => [variable.id, variable]));
  const from = variables.get(fromId);
  const to = variables.get(toId);
  if (!from || !to) throw new Error("Derivative endpoints must be variables in the definition.");
  return orientation === "reverse"
    ? `d${from.symbol}/d${to.symbol}`
    : `d${to.symbol}/d${from.symbol}`;
}

export function statusToken(status) {
  const token = RATE_STATUSES[status];
  if (!token) throw new Error(`Unknown rate status: ${status}`);
  return `${token.symbol} ${token.label}`;
}

export function correctVariableOrder(definition) {
  validateRateFlowDefinition(definition);
  const incoming = new Map(definition.variables.map((variable) => [variable.id, 0]));
  const outgoing = new Map(definition.variables.map((variable) => [variable.id, []]));
  for (const relation of definition.relations) {
    incoming.set(relation.to, incoming.get(relation.to) + 1);
    outgoing.get(relation.from).push(relation.to);
  }
  const starts = definition.variables.filter((variable) => incoming.get(variable.id) === 0).map((variable) => variable.id);
  if (starts.length !== 1) throw new Error("Rate-flow definitions must form one unambiguous dependency chain.");
  const order = [];
  let current = starts[0];
  const seen = new Set();
  while (current && !seen.has(current)) {
    seen.add(current);
    order.push(current);
    const next = outgoing.get(current);
    if (next.length > 1) throw new Error("Step 29 RateFlowDiagram currently supports a single dependency chain.");
    current = next[0];
  }
  if (order.length !== definition.variables.length) throw new Error("Rate-flow relations must connect every variable into one chain.");
  return order;
}

export function createRateFlowState(definition, { order, orientations, targetOrientation } = {}) {
  validateRateFlowDefinition(definition);
  const correctOrder = correctVariableOrder(definition);
  const requestedOrder = finiteArray(order).length === correctOrder.length ? order : (definition.initialOrder || correctOrder);
  const validIds = new Set(correctOrder);
  const normalizedOrder = requestedOrder.filter((id, index) => validIds.has(id) && requestedOrder.indexOf(id) === index);
  const finalOrder = normalizedOrder.length === correctOrder.length ? [...normalizedOrder] : [...correctOrder];
  const finalOrientations = {};
  for (const relation of definition.relations) {
    const candidate = orientations?.[relation.id] ?? definition.initialOrientations?.[relation.id] ?? "forward";
    finalOrientations[relation.id] = candidate === "reverse" ? "reverse" : "forward";
  }
  const targetCandidate = targetOrientation ?? orientations?.target ?? definition.initialOrientations?.target ?? "forward";
  return { order: finalOrder, orientations: finalOrientations, targetOrientation: targetCandidate === "reverse" ? "reverse" : "forward" };
}

export function moveVariable(order, variableId, direction) {
  const next = [...order];
  const index = next.indexOf(variableId);
  if (index < 0) return next;
  const delta = direction === "left" ? -1 : direction === "right" ? 1 : Number(direction) || 0;
  const target = Math.max(0, Math.min(next.length - 1, index + delta));
  if (target === index) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function checkRateFlowState(definition, state) {
  const expected = correctVariableOrder(definition);
  const orderCorrect = expected.every((id, index) => state.order[index] === id);
  const orientationResults = Object.fromEntries(definition.relations.map((relation) => [relation.id, state.orientations?.[relation.id] !== "reverse"]));
  const targetCorrect = state.targetOrientation !== "reverse";
  return {
    orderCorrect,
    orientationResults,
    targetCorrect,
    overallCorrect: orderCorrect && targetCorrect && Object.values(orientationResults).every(Boolean),
    expectedOrder: expected
  };
}

export function chainRuleExpression(definition) {
  const order = correctVariableOrder(definition);
  const target = derivativeLabel(definition, order[0], order.at(-1), "forward");
  const factors = [...definition.relations].reverse().map((relation) => derivativeLabel(definition, relation.from, relation.to, "forward"));
  return `${target} = ${factors.join(" × ")}`;
}

function createElement(documentRef, tag, className = "") {
  const element = documentRef.createElement(tag);
  if (className) element.className = className;
  return element;
}

function relationStatus(relation) {
  return RATE_STATUSES[relation.status] || RATE_STATUSES.relationship;
}

export class RateFlowDiagram {
  constructor(root, {
    definitions = RATE_FLOW_DEFINITIONS,
    initialDefinitionId = definitions[0]?.id,
    showDefinitionSelector = true,
    onChange = () => {}
  } = {}) {
    if (!root?.ownerDocument) throw new Error("RateFlowDiagram requires a DOM host element.");
    const validDefinitions = definitions.map(validateRateFlowDefinition);
    if (!validDefinitions.length) throw new Error("RateFlowDiagram requires at least one definition.");
    this.root = root;
    this.document = root.ownerDocument;
    this.definitions = new Map(validDefinitions.map((definition) => [definition.id, definition]));
    this.showDefinitionSelector = Boolean(showDefinitionSelector);
    this.onChange = onChange;
    this.cleanupCallbacks = [];
    this.diagram = null;
    this.definition = this.definitions.get(initialDefinitionId) || validDefinitions[0];
    this.state = createRateFlowState(this.definition);
    this.lastCheck = null;
    this.#renderShell();
    this.#renderDefinition();
  }

  getState() {
    return { order: [...this.state.order], orientations: { ...this.state.orientations }, targetOrientation: this.state.targetOrientation };
  }

  destroy() {
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    this.diagram?.destroy();
    this.root.replaceChildren();
    this.root.classList.remove("rate-flow");
  }

  setDefinition(definitionId) {
    const definition = this.definitions.get(definitionId);
    if (!definition) throw new Error(`Unknown rate-flow definition: ${definitionId}`);
    this.definition = definition;
    this.state = createRateFlowState(definition);
    this.lastCheck = null;
    this.#renderDefinition();
    this.#emit("definition");
  }

  moveVariable(variableId, direction) {
    this.state.order = moveVariable(this.state.order, variableId, direction);
    this.lastCheck = null;
    this.#renderDiagram();
    this.#renderArrangeControls();
    this.#renderFeedback();
    this.#emit("arrange");
  }

  setRateOrientation(relationId, orientation) {
    const relation = this.definition.relations.find((candidate) => candidate.id === relationId);
    if (!relation) throw new Error(`Unknown rate relation: ${relationId}`);
    this.state.orientations[relationId] = orientation === "reverse" ? "reverse" : "forward";
    this.lastCheck = null;
    this.#renderDiagram();
    this.#renderRateControls();
    this.#renderFeedback();
    this.#emit("orientation");
  }

  setTargetOrientation(orientation) {
    this.state.targetOrientation = orientation === "reverse" ? "reverse" : "forward";
    this.lastCheck = null;
    this.#renderTarget();
    this.#renderRateControls();
    this.#renderFeedback();
    this.#emit("target-orientation");
  }

  check() {
    this.lastCheck = checkRateFlowState(this.definition, this.state);
    this.#renderFeedback();
    this.#renderArrangeControls();
    this.#renderRateControls();
    this.#emit("check");
    return this.lastCheck;
  }

  reset() {
    this.state = createRateFlowState(this.definition);
    this.lastCheck = null;
    this.#renderDefinition();
    this.#emit("reset");
  }

  #renderShell() {
    this.root.classList.add("rate-flow");
    this.toolbar = createElement(this.document, "div", "rate-flow__toolbar");
    const selectorLabel = createElement(this.document, "label", "rate-flow__selector-label");
    const selectorText = createElement(this.document, "span"); selectorText.textContent = "Scenario";
    this.selector = createElement(this.document, "select", "rate-flow__selector");
    for (const definition of this.definitions.values()) {
      const option = createElement(this.document, "option"); option.value = definition.id; option.textContent = definition.label; this.selector.append(option);
    }
    selectorLabel.append(selectorText, this.selector);
    if (!this.showDefinitionSelector) selectorLabel.hidden = true;
    const selectorChange = () => this.setDefinition(this.selector.value);
    this.selector.addEventListener("change", selectorChange);
    this.cleanupCallbacks.push(() => this.selector.removeEventListener("change", selectorChange));
    this.toolbar.append(selectorLabel);

    this.context = createElement(this.document, "p", "rate-flow__context");
    this.diagramHost = createElement(this.document, "div", "rate-flow__diagram");
    this.legend = createElement(this.document, "div", "rate-flow__legend");
    this.legend.innerHTML = '<span><b class="rate-flow__shape rate-flow__shape--known">●</b> known rate</span><span><b class="rate-flow__shape rate-flow__shape--unknown">◆</b> rate to find</span><span><b class="rate-flow__shape rate-flow__shape--relationship">■</b> relationship-derived rate</span>';

    this.workspace = createElement(this.document, "div", "rate-flow__workspace");
    this.arrangePanel = createElement(this.document, "section", "rate-flow__panel");
    this.ratePanel = createElement(this.document, "section", "rate-flow__panel");
    this.workspace.append(this.arrangePanel, this.ratePanel);

    this.targetPanel = createElement(this.document, "section", "rate-flow__target");
    this.feedback = createElement(this.document, "div", "rate-flow__feedback");
    this.feedback.setAttribute("aria-live", "polite");

    this.actions = createElement(this.document, "div", "rate-flow__actions");
    this.checkButton = createElement(this.document, "button", "rate-flow__button rate-flow__button--primary"); this.checkButton.type = "button"; this.checkButton.textContent = "Check diagram";
    this.resetButton = createElement(this.document, "button", "rate-flow__button"); this.resetButton.type = "button"; this.resetButton.textContent = "Reset";
    const checkListener = () => this.check(); const resetListener = () => this.reset();
    this.checkButton.addEventListener("click", checkListener); this.resetButton.addEventListener("click", resetListener);
    this.cleanupCallbacks.push(() => this.checkButton.removeEventListener("click", checkListener), () => this.resetButton.removeEventListener("click", resetListener));
    this.actions.append(this.checkButton, this.resetButton);

    this.root.replaceChildren(this.toolbar, this.context, this.diagramHost, this.legend, this.workspace, this.targetPanel, this.feedback, this.actions);
  }

  #renderDefinition() {
    this.selector.value = this.definition.id;
    this.context.textContent = this.definition.context || "Arrange the variables, then orient each derivative so the numerator is the quantity the arrow points to.";
    this.#renderDiagram();
    this.#renderArrangeControls();
    this.#renderRateControls();
    this.#renderTarget();
    this.#renderFeedback();
  }

  #renderDiagram() {
    this.diagram?.destroy();
    const count = this.definition.variables.length;
    const maxX = Math.max(3, (count - 1) * 3);
    this.diagram = new DiagramPrimitives(this.diagramHost, {
      xDomain: [-0.8, maxX + 0.8], yDomain: [-1, 1], minHeight: 230, aspectRatio: count > 3 ? "16 / 5" : "16 / 6",
      ariaLabel: "Rate-flow dependency diagram. Arrows point from an independent variable towards a quantity that depends on it."
    });
    const positions = new Map(this.state.order.map((id, index) => [id, index * 3]));
    const variableMap = new Map(this.definition.variables.map((variable) => [variable.id, variable]));

    for (const relation of this.definition.relations) {
      const status = relationStatus(relation);
      const startX = positions.get(relation.from);
      const endX = positions.get(relation.to);
      const direction = endX >= startX ? 1 : -1;
      const shownRate = derivativeLabel(this.definition, relation.from, relation.to, this.state.orientations[relation.id]);
      this.diagram.arrow({ x1: startX + 0.28 * direction, y1: 0, x2: endX - 0.28 * direction, y2: 0, tone: status.tone });
      this.diagram.label({ x: (startX + endX) / 2, y: 0, text: `${shownRate}  ${status.symbol} ${status.label}`, dy: -24, tone: status.tone, className: "rate-flow__diagram-rate" });
    }

    for (const variableId of this.state.order) {
      const variable = variableMap.get(variableId);
      const x = positions.get(variableId);
      this.diagram.point({ x, y: 0, radius: 18, tone: "interactive", tooltip: `${variable.label}, ${variable.symbol}, measured in ${variable.unit || "unspecified units"}` });
      this.diagram.label({ x, y: 0, text: variable.symbol, dy: 7, tone: "default", className: "rate-flow__diagram-symbol" });
      this.diagram.label({ x, y: 0, text: variable.label, dy: 42, tone: "default", className: "rate-flow__diagram-name" });
      if (variable.unit) this.diagram.label({ x, y: 0, text: `[${variable.unit}]`, dy: 66, tone: "default", className: "rate-flow__diagram-unit" });
    }
  }

  #renderArrangeControls() {
    this.arrangePanel.replaceChildren();
    const heading = createElement(this.document, "h3"); heading.textContent = "1. Arrange the dependency";
    const help = createElement(this.document, "p", "rate-flow__help"); help.textContent = "Put the independent variable first, then follow what each quantity directly changes.";
    const list = createElement(this.document, "ol", "rate-flow__arrange-list");
    const variableMap = new Map(this.definition.variables.map((variable) => [variable.id, variable]));
    this.state.order.forEach((id, index) => {
      const variable = variableMap.get(id);
      const item = createElement(this.document, "li", "rate-flow__variable-card");
      const text = createElement(this.document, "span", "rate-flow__variable-text"); text.innerHTML = `<strong>${variable.symbol}</strong><small>${variable.label}${variable.unit ? ` · ${variable.unit}` : ""}</small>`;
      const buttons = createElement(this.document, "span", "rate-flow__move-buttons");
      for (const direction of ["left", "right"]) {
        const button = createElement(this.document, "button", "rate-flow__move-button"); button.type = "button"; button.textContent = direction === "left" ? "←" : "→";
        button.setAttribute("aria-label", `Move ${variable.symbol} ${direction}`);
        button.disabled = direction === "left" ? index === 0 : index === this.state.order.length - 1;
        button.addEventListener("click", () => this.moveVariable(id, direction), { once: true });
        buttons.append(button);
      }
      item.append(text, buttons);
      if (this.lastCheck) item.dataset.check = this.lastCheck.orderCorrect ? "correct" : "review";
      list.append(item);
    });
    this.arrangePanel.append(heading, help, list);
  }

  #renderRateControls() {
    this.ratePanel.replaceChildren();
    const heading = createElement(this.document, "h3"); heading.textContent = "2. Orient the derivatives";
    const help = createElement(this.document, "p", "rate-flow__help"); help.textContent = "For an arrow x → y, the matching rate is dy/dx, not dx/dy."; help.setAttribute("data-math-render", "");
    const rows = createElement(this.document, "div", "rate-flow__rate-list");
    for (const relation of this.definition.relations) {
      rows.append(this.#rateChoiceRow({
        key: relation.id,
        from: relation.from,
        to: relation.to,
        status: relation.status,
        detail: relation.detail,
        orientation: this.state.orientations[relation.id],
        onSelect: (orientation) => this.setRateOrientation(relation.id, orientation),
        checked: this.lastCheck?.orientationResults?.[relation.id]
      }));
    }
    rows.append(this.#rateChoiceRow({
      key: "target",
      from: this.definition.targetRate.from,
      to: this.definition.targetRate.to,
      status: this.definition.targetRate.status || "unknown",
      detail: this.definition.targetRate.detail,
      orientation: this.state.targetOrientation,
      onSelect: (orientation) => this.setTargetOrientation(orientation),
      checked: this.lastCheck?.targetCorrect,
      isTarget: true
    }));
    this.ratePanel.append(heading, help, rows);
  }

  #rateChoiceRow({ key, from, to, status, detail, orientation, onSelect, checked, isTarget = false }) {
    const row = createElement(this.document, "div", "rate-flow__rate-row");
    if (checked !== undefined) row.dataset.check = checked ? "correct" : "review";
    const meta = createElement(this.document, "div", "rate-flow__rate-meta");
    const statusInfo = RATE_STATUSES[status] || RATE_STATUSES.relationship;
    const badge = createElement(this.document, "span", `rate-flow__status rate-flow__status--${status}`); badge.textContent = `${statusInfo.symbol} ${statusInfo.label}`;
    const description = createElement(this.document, "span", "rate-flow__rate-detail"); description.textContent = `${isTarget ? "Target rate" : "Direct link"}${detail ? ` · ${detail}` : ""}`;
    meta.append(badge, description);
    const choices = createElement(this.document, "div", "rate-flow__choices"); choices.setAttribute("role", "group"); choices.setAttribute("aria-label", `${isTarget ? "Target" : "Rate"} derivative orientation`);
    for (const candidate of ["forward", "reverse"]) {
      const button = createElement(this.document, "button", "rate-flow__choice"); button.type = "button";
      button.textContent = derivativeLabel(this.definition, from, to, candidate);
      button.setAttribute("data-math-render", "");
      button.setAttribute("aria-pressed", String(orientation === candidate));
      const listener = () => onSelect(candidate); button.addEventListener("click", listener, { once: true });
      choices.append(button);
    }
    row.append(meta, choices);
    return row;
  }

  #renderTarget() {
    this.targetPanel.replaceChildren();
    const badge = createElement(this.document, "span", "rate-flow__status rate-flow__status--unknown"); badge.textContent = `${RATE_STATUSES.unknown.symbol} ${RATE_STATUSES.unknown.label}`;
    const rate = createElement(this.document, "strong"); rate.textContent = derivativeLabel(this.definition, this.definition.targetRate.from, this.definition.targetRate.to, this.state.targetOrientation); rate.setAttribute("data-math-render", "");
    const hint = createElement(this.document, "span"); hint.textContent = "Chain rule target — build it from the direct arrows before substituting values.";
    this.targetPanel.append(badge, rate, hint);
  }

  #renderFeedback() {
    this.feedback.replaceChildren();
    if (!this.lastCheck) {
      this.feedback.className = "rate-flow__feedback";
      const message = createElement(this.document, "p"); message.textContent = "Arrange first, orient second, then check the whole chain.";
      this.feedback.append(message);
      return;
    }
    const result = this.lastCheck;
    this.feedback.className = `rate-flow__feedback ${result.overallCorrect ? "rate-flow__feedback--correct" : "rate-flow__feedback--review"}`;
    const heading = createElement(this.document, "strong"); heading.textContent = result.overallCorrect ? "Dependency chain correct." : "Review the highlighted parts.";
    const detail = createElement(this.document, "p");
    if (result.overallCorrect) detail.textContent = `Now connect the rates: ${chainRuleExpression(this.definition)}. Substitute numerical values only after this structure is correct.`;
    else {
      const issues = [];
      if (!result.orderCorrect) issues.push("variable order");
      if (!Object.values(result.orientationResults).every(Boolean) || !result.targetCorrect) issues.push("derivative orientation");
      detail.textContent = `Check ${issues.join(" and ")}. Follow each dependency arrow: denominator first, numerator second.`;
    }
    this.feedback.append(heading, detail);
  }

  #emit(source) {
    this.onChange({ source, definitionId: this.definition.id, state: this.getState(), check: this.lastCheck });
  }
}
