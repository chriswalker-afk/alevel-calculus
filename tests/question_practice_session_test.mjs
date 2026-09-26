import assert from "node:assert/strict";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";
import {
  getQuestionDefinition,
  getQuestionPracticeDefinitionForActivity
} from "../src/scripts/question-catalogue.js";
import {
  createQuestionPracticeSession,
  questionFingerprint
} from "../src/scripts/question-practice-session.js";

const runner = createGeneratorRunner({ debugSeed: "question-practice-session-test" });

const powerPractice = getQuestionPracticeDefinitionForActivity("activity:y12:differentiation:basics:ao1:power-rule");
assert.ok(powerPractice);
assert.ok(powerPractice.practiceDefinitions.length > powerPractice.definitions.length, "Practice pool should broaden beyond the first short set within the same topic and AO.");

const powerSession = createQuestionPracticeSession({ setDefinition: powerPractice, runner });
const first = powerSession.currentBatch();
const second = powerSession.nextBatch();
assert.equal(first.practiceBatch, 1);
assert.equal(second.practiceBatch, 2);
assert.notEqual(first.generationSeed, second.generationSeed);
assert.ok(first.questions.length <= 4 && second.questions.length <= 4, "Practice batches should remain short.");
assert.equal(new Set([...first.questions, ...second.questions].map((question) => question.id)).size, first.questions.length + second.questions.length, "Fresh batches must not recycle generated question identities.");

const singleDynamicDefinition = getQuestionDefinition("question-template:y12:differentiation:basics:ao1:term-by-term-polynomial");
const dynamicSession = createQuestionPracticeSession({
  setDefinition: {
    id: "question-set:test:single-dynamic",
    label: "Single dynamic",
    definitions: [singleDynamicDefinition],
    practiceDefinitions: [singleDynamicDefinition]
  },
  runner
});
const dynamicFingerprints = new Set();
for (let index = 0; index < 6; index += 1) {
  const batch = index === 0 ? dynamicSession.currentBatch() : dynamicSession.nextBatch();
  dynamicFingerprints.add(questionFingerprint(batch.questions[0]));
}
assert.ok(dynamicFingerprints.size >= 4, "A parameterised one-template activity should keep producing genuinely different questions.");

const fixedChoiceDefinition = getQuestionDefinition("question-template:y12:differentiation:increasing-decreasing:interval");
const fixedChoiceSession = createQuestionPracticeSession({
  setDefinition: {
    id: "question-set:test:fixed-choice",
    label: "Fixed concept check",
    definitions: [fixedChoiceDefinition],
    practiceDefinitions: [fixedChoiceDefinition]
  },
  runner
});
const optionOrders = new Set();
for (let index = 0; index < 6; index += 1) {
  const batch = index === 0 ? fixedChoiceSession.currentBatch() : fixedChoiceSession.nextBatch();
  optionOrders.add(batch.questions[0].options.map((option) => option.id).join(","));
}
assert.ok(optionOrders.size >= 2, "Even a finite conceptual choice check should vary answer presentation rather than repeat the same layout forever.");
assert.ok(fixedChoiceSession.getStats().unavoidableDuplicates >= 1, "Practice stats should honestly record an underlying fixed stem rather than pretending option shuffling created a new mathematical question.");

const reviewPractice = getQuestionPracticeDefinitionForActivity("activity:full:review:calculus-mastery:ao3:diagnostic-mastery");
const reviewSession = createQuestionPracticeSession({ setDefinition: reviewPractice, runner });
const seenTemplates = new Set();
for (let index = 0; index < 6; index += 1) {
  const batch = index === 0 ? reviewSession.currentBatch() : reviewSession.nextBatch();
  assert.ok(batch.questions.length <= 4, "Large mastery pools should be sampled as manageable short sets.");
  batch.questions.forEach((question) => seenTemplates.add(question.templateId));
}
assert.ok(seenTemplates.size >= 8, "Repeated mastery batches should progressively sample a broad range of question structures.");

console.log("Question practice session regression passed: continuous batches, freshness control, choice variation and broad mastery sampling.");
