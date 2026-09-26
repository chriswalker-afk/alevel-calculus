function normalizeDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("ImpostorEngine requires declarative game data.");
  if (!Array.isArray(definition.options) || definition.options.length < 3) throw new Error("ImpostorEngine requires at least three options.");
  if (!definition.options.some((option) => option.id === definition.answerId)) throw new Error("ImpostorEngine answer must reference an option.");
  return Object.freeze({
    ...definition,
    options: Object.freeze(definition.options.map((option) => Object.freeze({ ...option })))
  });
}

export function createImpostorRound(definition) {
  return normalizeDefinition(definition);
}

export function isImpostorCorrect(selectedId, answerId) {
  return Boolean(selectedId && selectedId === answerId);
}

export function createImpostorEngine(container, {
  definition,
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("ImpostorEngine requires a container.");
  const round = createImpostorRound(definition);
  const prompt = container.querySelector("[data-impostor-prompt]");
  const options = container.querySelector("[data-impostor-options]");
  const status = container.querySelector("[data-impostor-status]");
  const reset = container.querySelector("[data-impostor-reset]");
  const check = container.querySelector("[data-impostor-check]");
  if ([prompt, options, status, reset, check].some((node) => !node)) {
    throw new Error("ImpostorEngine markup is incomplete.");
  }

  let selectedId = null;
  let attempts = 0;
  let completed = false;

  function render() {
    prompt.textContent = round.prompt;
    options.replaceChildren();
    for (const option of round.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-impostor-option";
      button.dataset.impostorOption = option.id;
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
    status.textContent = "Choose the single incorrect statement.";
    render();
  }

  function checkAnswer() {
    if (!selectedId || completed) return false;
    attempts += 1;
    const success = isImpostorCorrect(selectedId, round.answerId);
    onAttempt({ engine: "impostor", gameId: round.id, success, result: success ? 1 : 0, completed: false });
    if (success) {
      completed = true;
      onSecurity({ engine: "impostor", gameId: round.id, security: attempts === 1 ? "secure" : "developing" });
      onComplete({ engine: "impostor", gameId: round.id });
      status.textContent = round.successMessage;
    } else {
      onSecurity({ engine: "impostor", gameId: round.id, security: "needs-review" });
      status.textContent = "That statement is correct. Look for the one that breaks the rule.";
    }
    render();
    return success;
  }

  reset.addEventListener("click", resetRound);
  check.addEventListener("click", checkAnswer);
  status.textContent = "Choose the single incorrect statement.";
  render();

  return Object.freeze({
    select,
    reset: resetRound,
    check: checkAnswer,
    getRound: () => round,
    getState: () => Object.freeze({ selectedId, attempts, completed })
  });
}
