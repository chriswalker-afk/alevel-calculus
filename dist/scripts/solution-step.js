const allowedKinds = Object.freeze(["working", "reasoning", "result", "check"]);

function assertText(value, label, { allowEmpty = false } = {}) {
  if (typeof value !== "string") throw new Error(`SolutionStep ${label} must be a string.`);
  const text = value.trim();
  if (!allowEmpty && !text) throw new Error(`SolutionStep requires ${label}.`);
  return text;
}

export function defineSolutionStep(config) {
  if (!config || typeof config !== "object") throw new Error("SolutionStep requires a configuration object.");
  const id = assertText(config.id, "id");
  const kind = config.kind == null ? "working" : assertText(config.kind, "kind");
  if (!allowedKinds.includes(kind)) {
    throw new Error(`SolutionStep kind must be one of: ${allowedKinds.join(", ")}.`);
  }

  const expression = config.expression == null ? "" : assertText(config.expression, "expression", { allowEmpty: true });
  const explanation = config.explanation == null ? "" : assertText(config.explanation, "explanation", { allowEmpty: true });
  if (!expression && !explanation) throw new Error("SolutionStep requires an expression or explanation.");

  return Object.freeze({
    id,
    kind,
    label: config.label == null ? "" : assertText(config.label, "label", { allowEmpty: true }),
    expression,
    explanation
  });
}

export function normaliseSolutionSteps(value, { sourceLabel = "worked solution" } = {}) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${sourceLabel} must provide at least one SolutionStep.`);
  }
  const seenIds = new Set();
  const steps = value.map((step, index) => {
    const normalised = defineSolutionStep(step);
    if (seenIds.has(normalised.id)) throw new Error(`${sourceLabel} contains duplicate SolutionStep id: ${normalised.id}.`);
    seenIds.add(normalised.id);
    return normalised;
  });
  return Object.freeze(steps);
}

export const solutionStepKinds = allowedKinds;
