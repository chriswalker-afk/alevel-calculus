export const progressStates = Object.freeze(["not-started", "partial", "complete"]);
export const progressModeOrder = Object.freeze(["understand", "memorise", "ao1", "ao2", "ao3"]);

const MODE_LABELS = Object.freeze({
  understand: "Understand",
  memorise: "Memorise",
  ao1: "AO1",
  ao2: "AO2",
  ao3: "AO3"
});

export const progressStatePresentation = Object.freeze({
  "not-started": Object.freeze({ label: "Not started", symbol: "○" }),
  partial: Object.freeze({ label: "In progress", symbol: "◐" }),
  complete: Object.freeze({ label: "Complete", symbol: "✓" })
});

// Step 14 keeps only topic/mode applicability here. Actual completion state now
// comes from ProgressStore and survives refresh through LocalStateStore.
const topicModeCatalog = Object.freeze({
  "topic:y12:foundations:pre-calculus": Object.freeze(["understand"]),
  "topic:y12:differentiation:basics": progressModeOrder,
  "topic:y12:differentiation:first-principles": progressModeOrder,
  "topic:y12:differentiation:tangents-normals": progressModeOrder,
  "topic:y12:differentiation:stationary-points": progressModeOrder,
  "topic:y12:differentiation:increasing-decreasing": progressModeOrder,
  "topic:y12:integration:introduction": progressModeOrder,
  "topic:y12:integration:definite-indefinite": progressModeOrder,
  "topic:y12:integration:area": progressModeOrder,
  "topic:y12:integration:signed-area": progressModeOrder,
  "topic:y12:review:calculus-mastery": Object.freeze(["memorise", "ao1", "ao2", "ao3"]),
  "topic:y13:differentiation:standard-functions": progressModeOrder,
  "topic:y13:differentiation:product-quotient-chain": progressModeOrder,
  "topic:y13:differentiation:parametric-differentiation": progressModeOrder,
  "topic:y13:integration:standard-integrals": progressModeOrder,
  "topic:y13:integration:reverse-chain-rule": progressModeOrder,
  "topic:y13:integration:trig-identities": progressModeOrder,
  "topic:y13:integration:substitution": progressModeOrder,
  "topic:full:review:calculus-mastery": Object.freeze(["memorise", "ao1", "ao2", "ao3"]),
  "topic:full:review:full-calculus-mastery": Object.freeze(["ao1", "ao2", "ao3"])
});

function normalizeState(value) {
  return progressStates.includes(value) ? value : "not-started";
}

export function getModeProgress(topicId, mode, progressStore) {
  const enabledModes = topicModeCatalog[topicId] ?? progressModeOrder;
  const enabled = enabledModes.includes(mode);
  const state = enabled && progressStore
    ? normalizeState(progressStore.getModeCompletionState(topicId, mode))
    : "not-started";

  return Object.freeze({
    topicId,
    mode,
    modeLabel: MODE_LABELS[mode] ?? mode,
    enabled,
    state,
    ...progressStatePresentation[state]
  });
}

export function getTopicProgress(topicId, progressStore) {
  const enabledCatalog = topicModeCatalog[topicId] ?? progressModeOrder;
  const modes = Object.fromEntries(
    progressModeOrder.map((mode) => [mode, getModeProgress(topicId, mode, progressStore)])
  );
  const enabledModes = progressModeOrder.filter((mode) => enabledCatalog.includes(mode));
  const enabledStates = enabledModes.map((mode) => modes[mode].state);

  let state = "not-started";
  if (enabledStates.length > 0 && enabledStates.every((value) => value === "complete")) {
    state = "complete";
  } else if (enabledStates.some((value) => value !== "not-started")) {
    state = "partial";
  }

  const completedModes = enabledStates.filter((value) => value === "complete").length;
  const partialModes = enabledStates.filter((value) => value === "partial").length;
  const detail = enabledModes
    .map((mode) => `${modes[mode].modeLabel} ${modes[mode].label.toLowerCase()}`)
    .join(", ");

  return Object.freeze({
    topicId,
    state,
    label: progressStatePresentation[state].label,
    symbol: progressStatePresentation[state].symbol,
    enabledModes: Object.freeze(enabledModes),
    modes: Object.freeze(modes),
    completedModes,
    partialModes,
    totalModes: enabledModes.length,
    accessibleSummary: `${progressStatePresentation[state].label}. ${detail}.`
  });
}

export function listProgressTopicIds() {
  return Object.freeze(Object.keys(topicModeCatalog));
}
