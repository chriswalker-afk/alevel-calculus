import assert from "node:assert/strict";
import { createMatchRound, isCorrectMatch } from "../src/scripts/match-engine.js";
import { basicsDifferentiationMemoryItems } from "../src/scripts/memory-content.js";

const reverse = (values) => [...values].reverse();
const round = createMatchRound(basicsDifferentiationMemoryItems, { limit: 4, shuffle: reverse });
assert.equal(round.itemIds.length, 4);
assert.equal(round.left.length, 4);
assert.equal(round.right.length, 4);
assert.equal(Object.isFrozen(round), true);
for (const left of round.left) {
  const right = round.right.find((entry) => entry.itemId === left.itemId);
  assert.ok(right);
  assert.equal(isCorrectMatch(left, right), true);
  const wrong = round.right.find((entry) => entry.itemId !== left.itemId);
  assert.equal(isCorrectMatch(left, wrong), false);
}
console.log("PASS MatchEngine rounds consume the shared MemoryItem bank");
