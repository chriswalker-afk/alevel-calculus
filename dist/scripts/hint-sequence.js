function normaliseHint(item, index) {
  if (typeof item === "string") {
    const text = item.trim();
    if (!text) throw new Error("HintSequence hints must not be empty.");
    return Object.freeze({ id: `hint-${index + 1}`, text });
  }
  if (!item || typeof item !== "object") throw new Error("HintSequence hints must be strings or objects.");
  const id = typeof item.id === "string" ? item.id.trim() : "";
  const text = typeof item.text === "string" ? item.text.trim() : "";
  if (!id || !text) throw new Error("HintSequence object hints require non-empty id and text fields.");
  return Object.freeze({ id, text });
}

export function createHintSequence(items = []) {
  if (!Array.isArray(items)) throw new Error("HintSequence requires an array.");
  const hints = items.map(normaliseHint);
  const ids = hints.map((hint) => hint.id);
  if (new Set(ids).size !== ids.length) throw new Error("HintSequence hint ids must be unique.");
  return Object.freeze(hints);
}

export function clampHintRevealCount(sequence, revealedCount) {
  const total = Array.isArray(sequence) ? sequence.length : 0;
  const numeric = Number.isInteger(revealedCount) ? revealedCount : 0;
  return Math.max(0, Math.min(numeric, total));
}

export function getVisibleHints(sequence, revealedCount) {
  const count = clampHintRevealCount(sequence, revealedCount);
  return Object.freeze(sequence.slice(0, count));
}

export function nextHintRevealCount(sequence, revealedCount) {
  const total = Array.isArray(sequence) ? sequence.length : 0;
  if (total === 0) return 0;
  const current = clampHintRevealCount(sequence, revealedCount);
  return current >= total ? 0 : current + 1;
}

export function getHintActionLabel(sequence, revealedCount) {
  const total = Array.isArray(sequence) ? sequence.length : 0;
  if (total === 0) return "No hint available";
  const current = clampHintRevealCount(sequence, revealedCount);
  if (current === 0) return "Show hint";
  if (current < total) return `Show next hint (${current + 1} of ${total})`;
  return "Hide hints";
}

export function getHintProgressLabel(sequence, revealedCount) {
  const total = Array.isArray(sequence) ? sequence.length : 0;
  const current = clampHintRevealCount(sequence, revealedCount);
  if (current === 0 || total === 0) return "";
  return current === 1 && total === 1 ? "Hint shown" : `${current} of ${total} hints shown`;
}
