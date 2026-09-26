function normalizeDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("MissingPieceEngine requires declarative game data.");
  if (!Array.isArray(definition.options) || definition.options.length < 2) throw new Error("MissingPieceEngine requires at least two options.");
  if (!definition.options.some((option) => option.id === definition.answerId)) throw new Error("MissingPieceEngine answer must reference an option.");
  return Object.freeze({
    ...definition,
    options: Object.freeze(definition.options.map((option) => Object.freeze({ ...option })))
  });
}

export function createMissingPieceRound(definition) {
  return normalizeDefinition(definition);
}

export function isMissingPieceCorrect(selectedId, answerId) {
  return Boolean(selectedId && selectedId === answerId);
}

export function createMissingPieceEngine(container, {
  definition,
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("MissingPieceEngine requires a container.");
  const round = createMissingPieceRound(definition);
  const prompt = container.querySelector("[data-missing-prompt]");
  const expression = container.querySelector("[data-missing-expression]");
  const options = container.querySelector("[data-missing-options]");
  const status = container.querySelector("[data-missing-status]");
  const reset = container.querySelector("[data-missing-reset]");
  const check = container.querySelector("[data-missing-check]");
  if ([prompt, expression, options, status, reset, check].some((node) => !node)) {
    throw new Error("MissingPieceEngine markup is incomplete.");
  }

  let selectedId = null;
  let attempts = 0;
  let completed = false;

  function render() {
    prompt.textContent = round.prompt;
    expression.textContent = round.expression;
    options.replaceChildren();
    for (const option of round.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-game-choice";
      button.dataset.missingOption = option.id;
      button.textContent = option.label;
      button.setAttribute("aria-pressed", selectedId === option.id ? "true" : "false");
      button.disabled = completed;
      button.addEventListener("click", () => select(option.id));
      options.append(button);
    }
    check.disabled = !selectedId || completed;
  }

  function select(optionId) {
    if (completed || !round.options.some((option) => option.id === optionId)) return;
    selectedId = optionId;
    status.textContent = "Ready to check.";
    render();
  }

  function resetRound() {
    selectedId = null;
    attempts = 0;
    completed = false;
    status.textContent = "Choose the missing piece.";
    render();
  }

  function checkAnswer() {
    if (!selectedId || completed) return false;
    attempts += 1;
    const success = isMissingPieceCorrect(selectedId, round.answerId);
    onAttempt({ engine: "missing-piece", gameId: round.id, success, result: success ? 1 : 0, completed: false });
    if (success) {
      completed = true;
      onSecurity({ engine: "missing-piece", gameId: round.id, security: attempts === 1 ? "secure" : "developing" });
      onComplete({ engine: "missing-piece", gameId: round.id });
      status.textContent = round.successMessage;
    } else {
      onSecurity({ engine: "missing-piece", gameId: round.id, security: "needs-review" });
      status.textContent = "Not that one. Think about what happens to the exponent when differentiating.";
    }
    render();
    return success;
  }

  reset.addEventListener("click", resetRound);
  check.addEventListener("click", checkAnswer);
  status.textContent = "Choose the missing piece.";
  render();

  return Object.freeze({
    select,
    reset: resetRound,
    check: checkAnswer,
    getRound: () => round,
    getState: () => Object.freeze({ selectedId, attempts, completed })
  });
}
