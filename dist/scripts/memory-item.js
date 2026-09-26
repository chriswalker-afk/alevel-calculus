const VALID_KINDS = new Set(["rule", "notation", "vocabulary", "rewrite", "method"]);

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function assertText(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`MemoryItem ${label} must be a non-empty string.`);
  }
}

export function defineMemoryItem(input) {
  if (!input || typeof input !== "object") throw new Error("MemoryItem requires a definition object.");
  const requiredText = ["id", "courseScope", "topicId", "microSkillId", "kind"];
  for (const key of requiredText) assertText(input[key], key);
  if (!input.id.startsWith("memory-item:")) throw new Error("MemoryItem id must start with memory-item:.");
  if (!VALID_KINDS.has(input.kind)) throw new Error(`Unknown MemoryItem kind: ${input.kind}`);

  if (!input.learn || typeof input.learn !== "object") throw new Error("MemoryItem requires learn content.");
  assertText(input.learn.label, "learn.label");
  assertText(input.learn.statement, "learn.statement");

  if (!input.flashcard || typeof input.flashcard !== "object") throw new Error("MemoryItem requires flashcard content.");
  assertText(input.flashcard.front, "flashcard.front");
  assertText(input.flashcard.back, "flashcard.back");

  if (!input.match || typeof input.match !== "object") throw new Error("MemoryItem requires match content.");
  assertText(input.match.left, "match.left");
  assertText(input.match.right, "match.right");

  const normalized = {
    ...input,
    vocabularyTags: Array.isArray(input.vocabularyTags) ? [...input.vocabularyTags] : [],
    prerequisiteTags: Array.isArray(input.prerequisiteTags) ? [...input.prerequisiteTags] : [],
    flashcard: {
      reverse: Boolean(input.flashcard.reverse),
      cue: input.flashcard.cue ?? "Recall the fact",
      ...input.flashcard
    }
  };
  return deepFreeze(normalized);
}

export function isMemoryItem(value) {
  return Boolean(value?.id?.startsWith?.("memory-item:") && value.learn && value.flashcard && value.match);
}
