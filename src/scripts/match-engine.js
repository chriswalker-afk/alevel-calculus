export function randomShuffle(values, random = Math.random) {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

export function createMatchRound(items, { limit = 4, shuffle = randomShuffle } = {}) {
  const selected = shuffle(items).slice(0, Math.min(limit, items.length));
  const left = selected.map((item) => Object.freeze({ id: `${item.id}:left`, itemId: item.id, text: item.match.left }));
  const right = selected.map((item) => Object.freeze({ id: `${item.id}:right`, itemId: item.id, text: item.match.right }));
  return Object.freeze({
    itemIds: Object.freeze(selected.map((item) => item.id)),
    left: Object.freeze(shuffle(left).map(Object.freeze)),
    right: Object.freeze(shuffle(right).map(Object.freeze))
  });
}

export function isCorrectMatch(left, right) {
  return Boolean(left?.itemId && right?.itemId && left.itemId === right.itemId);
}

export function createMatchEngine(container, {
  items = [],
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {},
  limit = 4,
  shuffle = randomShuffle
} = {}) {
  if (!container) throw new Error("MatchEngine requires a container.");
  const leftColumn = container.querySelector("[data-match-left]");
  const rightColumn = container.querySelector("[data-match-right]");
  const status = container.querySelector("[data-match-status]");
  const progress = container.querySelector("[data-match-progress]");
  const reset = container.querySelector("[data-match-reset]");
  if ([leftColumn, rightColumn, status, progress, reset].some((node) => !node)) {
    throw new Error("MatchEngine markup is incomplete.");
  }

  let round = createMatchRound(items, { limit, shuffle });
  let selectedLeftId = null;
  let selectedRightId = null;
  let matchedItemIds = new Set();
  let incorrectSelections = 0;

  function findEntry(side, id) {
    return round[side].find((entry) => entry.id === id) ?? null;
  }

  function renderColumn(column, side) {
    column.replaceChildren();
    for (const entry of round[side]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-match-option";
      button.dataset.matchSide = side;
      button.dataset.matchEntryId = entry.id;
      button.dataset.memoryItemId = entry.itemId;
      button.textContent = entry.text;
      const selectedId = side === "left" ? selectedLeftId : selectedRightId;
      button.setAttribute("aria-pressed", selectedId === entry.id ? "true" : "false");
      if (matchedItemIds.has(entry.itemId)) {
        button.disabled = true;
        button.dataset.matchState = "matched";
      }
      button.addEventListener("click", () => select(side, entry.id));
      column.append(button);
    }
  }

  function render() {
    renderColumn(leftColumn, "left");
    renderColumn(rightColumn, "right");
    progress.textContent = `${matchedItemIds.size} of ${round.itemIds.length} matched`;
  }

  function evaluateSelection() {
    if (!selectedLeftId || !selectedRightId) return;
    const left = findEntry("left", selectedLeftId);
    const right = findEntry("right", selectedRightId);
    if (isCorrectMatch(left, right)) {
      matchedItemIds.add(left.itemId);
      status.textContent = "Correct match.";
    } else {
      incorrectSelections += 1;
      status.textContent = "Not a match yet — try one of the other options.";
    }
    selectedLeftId = null;
    selectedRightId = null;

    const complete = round.itemIds.length > 0 && matchedItemIds.size === round.itemIds.length;
    if (complete) {
      const result = round.itemIds.length / (round.itemIds.length + incorrectSelections);
      onAttempt({ engine: "match", success: true, result, completed: false, incorrectSelections });
      onSecurity({ engine: "match", security: incorrectSelections === 0 ? "secure" : "developing" });
      onComplete({ engine: "match" });
      status.textContent = incorrectSelections === 0
        ? "Round complete — every pair matched first time."
        : "Round complete — all pairs matched.";
    }
    render();
  }

  function select(side, id) {
    const entry = findEntry(side, id);
    if (!entry || matchedItemIds.has(entry.itemId)) return;
    if (side === "left") selectedLeftId = selectedLeftId === id ? null : id;
    if (side === "right") selectedRightId = selectedRightId === id ? null : id;
    evaluateSelection();
    render();
  }

  function resetRound() {
    round = createMatchRound(items, { limit, shuffle });
    selectedLeftId = null;
    selectedRightId = null;
    matchedItemIds = new Set();
    incorrectSelections = 0;
    status.textContent = "Choose one item from each column.";
    render();
  }

  reset.addEventListener("click", resetRound);
  status.textContent = "Choose one item from each column.";
  render();

  return Object.freeze({
    select,
    reset: resetRound,
    getRound: () => round,
    getState: () => Object.freeze({ matched: Object.freeze([...matchedItemIds]), incorrectSelections })
  });
}
