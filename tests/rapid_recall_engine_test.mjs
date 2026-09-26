import assert from "node:assert/strict";
import { basicsDifferentiationMemoryItems } from "../src/scripts/memory-content.js";
import { buildRapidRecallDeck, createRapidRecallEngine } from "../src/scripts/rapid-recall-engine.js";

const identityShuffle = (values) => [...values];
const deck = buildRapidRecallDeck(basicsDifferentiationMemoryItems, { limit: 5, optionCount: 4, shuffle: identityShuffle });
assert.equal(deck.length, 5);
assert.equal(Object.isFrozen(deck), true);
assert.equal(new Set(deck.map((question) => question.itemId)).size, 5);
for (const question of deck) {
  assert.equal(question.options.some((option) => option.correct && option.label === question.answer), true);
  assert.equal(question.options.length, 4);
}

class FakeElement {
  constructor() {
    this.children = new Map();
    this.appended = [];
    this.attributes = new Map();
    this.textContent = "";
    this.hidden = false;
    this.disabled = false;
    this.dataset = {};
  }
  querySelector(selector) { return this.children.get(selector) ?? null; }
  replaceChildren(...nodes) { this.appended = [...nodes]; }
  append(...nodes) { this.appended.push(...nodes); }
  addEventListener() {}
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
}

globalThis.document = { createElement() { return new FakeElement(); } };
function container() {
  const root = new FakeElement();
  for (const selector of [
    "[data-rapid-prompt]", "[data-rapid-cue]", "[data-rapid-options]", "[data-rapid-progress]", "[data-rapid-status]",
    "[data-rapid-next]", "[data-rapid-reset]", "[data-rapid-timer-toggle]", "[data-rapid-timer]"
  ]) root.children.set(selector, new FakeElement());
  return root;
}

const attempts = [], security = [], completions = [];
const engine = createRapidRecallEngine(container(), {
  items: basicsDifferentiationMemoryItems,
  limit: 5,
  optionCount: 4,
  secondsPerItem: 3,
  shuffle: identityShuffle,
  setIntervalFn: () => 1,
  clearIntervalFn: () => {},
  onAttempt: (entry) => attempts.push(entry),
  onSecurity: (entry) => security.push(entry),
  onComplete: (entry) => completions.push(entry)
});
assert.equal(engine.getState().timerEnabled, false, "Rapid Recall should default to untimed mode");

for (let index = 0; index < engine.getDeck().length; index += 1) {
  const question = engine.getDeck()[engine.getState().index];
  const correct = question.options.find((option) => option.correct);
  assert.equal(engine.answer(correct.id), true);
  engine.advance();
}
assert.equal(completions.length, 1);
assert.equal(security.at(-1).security, "secure");
assert.equal(attempts.filter((entry) => entry.success).length, 5);

engine.reset();
engine.setTimerEnabled(true);
assert.equal(engine.getState().timerEnabled, true);
engine.tickTimer();
engine.tickTimer();
engine.tickTimer();
assert.equal(attempts.at(-1).timedOut, true, "Optional timer expiry should report retrieval evidence without forcing timed mode");

// Two timer expiries are two misses, not four: timeout evidence must not be double-counted.
const timeoutSecurity = [];
const timeoutEngine = createRapidRecallEngine(container(), {
  items: basicsDifferentiationMemoryItems,
  limit: 5,
  optionCount: 4,
  secondsPerItem: 1,
  shuffle: identityShuffle,
  setIntervalFn: () => 1,
  clearIntervalFn: () => {},
  onSecurity: (entry) => timeoutSecurity.push(entry)
});
timeoutEngine.setTimerEnabled(true);
for (let index = 0; index < timeoutEngine.getDeck().length; index += 1) {
  if (index < 2) timeoutEngine.tickTimer();
  const question = timeoutEngine.getDeck()[timeoutEngine.getState().index];
  timeoutEngine.answer(question.options.find((option) => option.correct).id);
  timeoutEngine.advance();
}
assert.equal(timeoutSecurity.at(-1).security, "developing", "Two timed-out retrievals should count as two misses.");

console.log("PASS RapidRecallEngine derives one-at-a-time retrieval from MemoryItem content with optional timer");
