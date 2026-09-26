function normalizeDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("SortEngine requires declarative game data.");
  if (!Array.isArray(definition.buckets) || definition.buckets.length < 2) throw new Error("SortEngine requires at least two buckets.");
  if (!Array.isArray(definition.items) || !definition.items.length) throw new Error("SortEngine requires items.");
  const bucketIds = new Set(definition.buckets.map((bucket) => bucket.id));
  if (definition.items.some((item) => !bucketIds.has(item.bucketId))) throw new Error("SortEngine item references an unknown bucket.");
  return Object.freeze({
    ...definition,
    buckets: Object.freeze(definition.buckets.map((bucket) => Object.freeze({ ...bucket }))),
    items: Object.freeze(definition.items.map((item) => Object.freeze({ ...item })))
  });
}

export function createSortRound(definition) {
  return normalizeDefinition(definition);
}

export function scoreSortAssignments(items, assignments) {
  const entries = assignments instanceof Map ? assignments : new Map(Object.entries(assignments ?? {}));
  const correct = items.filter((item) => entries.get(item.id) === item.bucketId).length;
  return Object.freeze({ correct, total: items.length, success: items.length > 0 && correct === items.length });
}

export function createSortEngine(container, {
  definition,
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("SortEngine requires a container.");
  const round = createSortRound(definition);
  const prompt = container.querySelector("[data-sort-prompt]");
  const items = container.querySelector("[data-sort-items]");
  const buckets = container.querySelector("[data-sort-buckets]");
  const progress = container.querySelector("[data-sort-progress]");
  const status = container.querySelector("[data-sort-status]");
  const reset = container.querySelector("[data-sort-reset]");
  const check = container.querySelector("[data-sort-check]");
  if ([prompt, items, buckets, progress, status, reset, check].some((node) => !node)) {
    throw new Error("SortEngine markup is incomplete.");
  }

  let selectedItemId = null;
  let assignments = new Map();
  let attempts = 0;
  let completed = false;

  function bucketLabel(id) {
    return round.buckets.find((bucket) => bucket.id === id)?.label ?? id;
  }

  function render() {
    prompt.textContent = round.prompt;
    items.replaceChildren();
    for (const item of round.items) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-sort-item";
      button.dataset.sortItem = item.id;
      button.setAttribute("aria-pressed", selectedItemId === item.id ? "true" : "false");
      button.disabled = completed;
      const assignment = assignments.get(item.id);
      button.textContent = assignment ? `${item.label} · ${bucketLabel(assignment)}` : item.label;
      button.addEventListener("click", () => selectItem(item.id));
      items.append(button);
    }

    buckets.replaceChildren();
    for (const bucket of round.buckets) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-sort-bucket";
      button.dataset.sortBucket = bucket.id;
      button.disabled = !selectedItemId || completed;
      const title = document.createElement("span");
      title.className = "memory-sort-bucket__title";
      title.textContent = bucket.label;
      const description = document.createElement("span");
      description.className = "memory-sort-bucket__description";
      description.textContent = bucket.description ?? "";
      button.append(title, description);
      button.addEventListener("click", () => assignSelected(bucket.id));
      buckets.append(button);
    }

    progress.textContent = `${assignments.size} of ${round.items.length} placed`;
    check.disabled = assignments.size !== round.items.length || completed;
  }

  function selectItem(itemId) {
    if (completed || !round.items.some((item) => item.id === itemId)) return;
    selectedItemId = selectedItemId === itemId ? null : itemId;
    status.textContent = selectedItemId ? "Now choose a bucket." : "Choose an expression to classify.";
    render();
  }

  function assignSelected(bucketId) {
    if (completed || !selectedItemId || !round.buckets.some((bucket) => bucket.id === bucketId)) return;
    assignments.set(selectedItemId, bucketId);
    selectedItemId = null;
    status.textContent = assignments.size === round.items.length ? "Everything is placed. Check your sort." : "Placed. Choose another expression.";
    render();
  }

  function resetRound() {
    selectedItemId = null;
    assignments = new Map();
    attempts = 0;
    completed = false;
    status.textContent = "Choose an expression, then choose its bucket.";
    render();
  }

  function checkAnswer() {
    if (completed || assignments.size !== round.items.length) return false;
    attempts += 1;
    const score = scoreSortAssignments(round.items, assignments);
    onAttempt({ engine: "sort", gameId: round.id, success: score.success, result: score.correct / score.total, completed: false });
    if (score.success) {
      completed = true;
      onSecurity({ engine: "sort", gameId: round.id, security: attempts === 1 ? "secure" : "developing" });
      onComplete({ engine: "sort", gameId: round.id });
      status.textContent = round.successMessage;
    } else {
      onSecurity({ engine: "sort", gameId: round.id, security: "needs-review" });
      status.textContent = `${score.correct} of ${score.total} are in the right place. Reconsider the others.`;
    }
    render();
    return score.success;
  }

  reset.addEventListener("click", resetRound);
  check.addEventListener("click", checkAnswer);
  status.textContent = "Choose an expression, then choose its bucket.";
  render();

  return Object.freeze({
    selectItem,
    assignSelected,
    reset: resetRound,
    check: checkAnswer,
    getRound: () => round,
    getState: () => Object.freeze({ selectedItemId, assignments: Object.freeze(Object.fromEntries(assignments)), attempts, completed })
  });
}
