function freezeRound(definition) {
  if (!definition || typeof definition !== "object") throw new Error("BuildRuleEngine requires declarative game data.");
  if (!Array.isArray(definition.tokens) || !definition.tokens.length) throw new Error("BuildRuleEngine requires tokens.");
  if (!Array.isArray(definition.answer) || !definition.answer.length) throw new Error("BuildRuleEngine requires an answer token sequence.");
  if (definition.answer.length !== definition.slots) throw new Error("BuildRuleEngine slots must match the answer length.");
  const tokenIds = new Set(definition.tokens.map((token) => token.id));
  if (definition.answer.some((id) => !tokenIds.has(id))) throw new Error("BuildRuleEngine answer references an unknown token.");
  return Object.freeze({
    ...definition,
    tokens: Object.freeze(definition.tokens.map((token) => Object.freeze({ ...token }))),
    answer: Object.freeze([...definition.answer])
  });
}

export function createBuildRuleRound(definition) {
  return freezeRound(definition);
}

export function isBuildRuleCorrect(selection, answer) {
  return Array.isArray(selection) && Array.isArray(answer)
    && selection.length === answer.length
    && selection.every((value, index) => value === answer[index]);
}

export function createBuildRuleEngine(container, {
  definition,
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("BuildRuleEngine requires a container.");
  const round = createBuildRuleRound(definition);
  const prompt = container.querySelector("[data-build-prompt]");
  const context = container.querySelector("[data-build-context]");
  const slots = container.querySelector("[data-build-slots]");
  const tokens = container.querySelector("[data-build-tokens]");
  const status = container.querySelector("[data-build-status]");
  const undo = container.querySelector("[data-build-undo]");
  const reset = container.querySelector("[data-build-reset]");
  const check = container.querySelector("[data-build-check]");
  if ([prompt, context, slots, tokens, status, undo, reset, check].some((node) => !node)) {
    throw new Error("BuildRuleEngine markup is incomplete.");
  }

  let selection = [];
  let attempts = 0;
  let completed = false;

  function tokenLabel(id) {
    return round.tokens.find((token) => token.id === id)?.label ?? id;
  }

  function render() {
    prompt.textContent = round.prompt;
    context.textContent = round.context;
    slots.replaceChildren();
    for (let index = 0; index < round.slots; index += 1) {
      const slot = document.createElement("span");
      slot.className = "memory-build-slot";
      slot.dataset.buildSlot = String(index);
      slot.textContent = selection[index] ? tokenLabel(selection[index]) : "?";
      slot.setAttribute("aria-label", selection[index] ? `Slot ${index + 1}: ${slot.textContent}` : `Slot ${index + 1}: empty`);
      slots.append(slot);
    }
    tokens.replaceChildren();
    for (const token of round.tokens) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-game-token";
      button.dataset.buildToken = token.id;
      button.textContent = token.label;
      button.disabled = selection.length >= round.slots || completed;
      button.addEventListener("click", () => choose(token.id));
      tokens.append(button);
    }
    undo.disabled = selection.length === 0 || completed;
    check.disabled = selection.length !== round.slots || completed;
  }

  function choose(tokenId) {
    if (completed || selection.length >= round.slots || !round.tokens.some((token) => token.id === tokenId)) return;
    selection = [...selection, tokenId];
    status.textContent = selection.length === round.slots ? "Ready to check." : "Choose the next token.";
    render();
  }

  function undoLast() {
    if (completed || !selection.length) return;
    selection = selection.slice(0, -1);
    status.textContent = "Last token removed.";
    render();
  }

  function resetRound() {
    selection = [];
    attempts = 0;
    completed = false;
    status.textContent = "Choose tokens from left to right.";
    render();
  }

  function checkAnswer() {
    if (completed || selection.length !== round.slots) return false;
    attempts += 1;
    const success = isBuildRuleCorrect(selection, round.answer);
    onAttempt({ engine: "build-rule", gameId: round.id, success, result: success ? 1 : 0, completed: false });
    if (success) {
      completed = true;
      onSecurity({ engine: "build-rule", gameId: round.id, security: attempts === 1 ? "secure" : "developing" });
      onComplete({ engine: "build-rule", gameId: round.id });
      status.textContent = round.successMessage;
    } else {
      onSecurity({ engine: "build-rule", gameId: round.id, security: "needs-review" });
      status.textContent = "Not quite. Use Undo or Reset, then rebuild the rule.";
    }
    render();
    return success;
  }

  undo.addEventListener("click", undoLast);
  reset.addEventListener("click", resetRound);
  check.addEventListener("click", checkAnswer);
  status.textContent = "Choose tokens from left to right.";
  render();

  return Object.freeze({
    choose,
    undo: undoLast,
    reset: resetRound,
    check: checkAnswer,
    getRound: () => round,
    getState: () => Object.freeze({ selection: Object.freeze([...selection]), attempts, completed })
  });
}
