import assert from "node:assert/strict";
import { defineMemoryItem, isMemoryItem } from "../src/scripts/memory-item.js";
import { basicsDifferentiationMemoryItems, getMemoryItemsForTopic } from "../src/scripts/memory-content.js";

const sample = defineMemoryItem({
  id: "memory-item:test:rule",
  courseScope: "y12",
  topicId: "topic:test",
  microSkillId: "skill:test",
  kind: "rule",
  learn: { label: "Rule", statement: "Remember this.", notation: "x -> 1" },
  flashcard: { front: "x", back: "1", reverse: true },
  match: { left: "x", right: "1" }
});
assert.equal(isMemoryItem(sample), true);
assert.equal(Object.isFrozen(sample), true);
assert.equal(Object.isFrozen(sample.learn), true);
assert.throws(() => defineMemoryItem({}), /MemoryItem id/);

assert.equal(getMemoryItemsForTopic("topic:y12:differentiation:basics"), basicsDifferentiationMemoryItems);
assert.ok(basicsDifferentiationMemoryItems.length >= 6);
assert.equal(new Set(basicsDifferentiationMemoryItems.map((item) => item.id)).size, basicsDifferentiationMemoryItems.length);
for (const item of basicsDifferentiationMemoryItems) {
  assert.equal(item.topicId, "topic:y12:differentiation:basics");
  assert.ok(item.learn.statement.length > 0);
  assert.ok(item.flashcard.front.length > 0 && item.flashcard.back.length > 0);
  assert.ok(item.match.left.length > 0 && item.match.right.length > 0);
}
console.log("PASS MemoryItem contract and shared Basics memory bank");
