import assert from "node:assert/strict";
import * as memoryReviewContent from "../src/scripts/memory-review-content.js";
const { basicsDifferentiationReviewPack } = memoryReviewContent;
import { createDiagramRecallRound, createDiagramRecallEngine, isDiagramRecallCorrect } from "../src/scripts/diagram-recall-engine.js";

const identityShuffle = (values) => [...values];
const round = createDiagramRecallRound(basicsDifferentiationReviewPack.diagram, { shuffle: identityShuffle });
assert.equal(round.questions.length, 3);
assert.equal(round.markers.length, 3);
for (const question of round.questions) assert.equal(isDiagramRecallCorrect(question.answerMarkerId, question.answerMarkerId), true);

// Every shipped review diagram must be constructible. Several intentionally use
// a single labelled checkpoint, so the shared engine must support one or more
// markers while still validating question references.
const shippedReviewDiagrams = Object.values(memoryReviewContent)
  .filter((value) => value && typeof value === "object" && value.diagram)
  .map((value) => value.diagram);
assert.ok(shippedReviewDiagrams.length >= 20);
for (const definition of shippedReviewDiagrams) {
  const shippedRound = createDiagramRecallRound(definition, { shuffle: identityShuffle });
  assert.ok(shippedRound.markers.length >= 1, `${definition.id} must expose at least one marker`);
  assert.ok(shippedRound.questions.length >= 1, `${definition.id} must expose at least one question`);
}
assert.throws(
  () => createDiagramRecallRound({ markers: [], questions: [{ id: "q", answerMarkerId: "missing" }] }),
  /at least one marker/
);

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

globalThis.document = {
  createElement() { return new FakeElement(); },
  createElementNS() { return new FakeElement(); }
};
function container() {
  const root = new FakeElement();
  for (const selector of [
    "[data-diagram-recall-canvas]", "[data-diagram-recall-prompt]", "[data-diagram-recall-options]", "[data-diagram-recall-progress]",
    "[data-diagram-recall-status]", "[data-diagram-recall-next]", "[data-diagram-recall-reset]"
  ]) root.children.set(selector, new FakeElement());
  return root;
}

const attempts = [], security = [], completions = [];
const engine = createDiagramRecallEngine(container(), {
  definition: basicsDifferentiationReviewPack.diagram,
  shuffle: identityShuffle,
  onAttempt: (entry) => attempts.push(entry),
  onSecurity: (entry) => security.push(entry),
  onComplete: (entry) => completions.push(entry)
});
for (let index = 0; index < engine.getRound().questions.length; index += 1) {
  const question = engine.getRound().questions[engine.getState().index];
  assert.equal(engine.answer(question.answerMarkerId), true);
  engine.advance();
}
assert.equal(completions.length, 1);
assert.equal(security.at(-1).security, "secure");
assert.equal(attempts.length, 3);

console.log("PASS DiagramRecallEngine renders declarative callouts and reports accessible label-recall evidence");
