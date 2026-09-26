import assert from "node:assert/strict";
import { buildFlashcardDeck } from "../src/scripts/flashcard-engine.js";
import { basicsDifferentiationMemoryItems } from "../src/scripts/memory-content.js";

const deck = buildFlashcardDeck(basicsDifferentiationMemoryItems);
const expected = basicsDifferentiationMemoryItems.reduce((count, item) => count + 1 + (item.flashcard.reverse ? 1 : 0), 0);
assert.equal(deck.length, expected);
assert.equal(Object.isFrozen(deck), true);
for (const item of basicsDifferentiationMemoryItems) {
  const forward = deck.find((card) => card.id === `${item.id}:forward`);
  assert.ok(forward, `missing forward card for ${item.id}`);
  assert.equal(forward.front, item.flashcard.front);
  assert.equal(forward.back, item.flashcard.back);
  if (item.flashcard.reverse) {
    const reverse = deck.find((card) => card.id === `${item.id}:reverse`);
    assert.ok(reverse, `missing reverse card for ${item.id}`);
    assert.equal(reverse.front, item.flashcard.back);
    assert.equal(reverse.back, item.flashcard.front);
  }
}
console.log("PASS FlashcardEngine deck reuses MemoryItem content in both directions");
