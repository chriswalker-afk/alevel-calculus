import assert from "node:assert/strict";
import {
  deriveSelfReviewCriteria,
  formatMathInputForDisplay,
  isAo3SelfReviewQuestion,
  mathEntryToolbarLabels,
  selfReviewFocusIds
} from "../src/scripts/question-response-enhancements.js";
import { listQuestionDefinitions } from "../src/scripts/question-catalogue.js";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";

assert.equal(formatMathInputForDisplay("sqrt(x)+pi+x^2"), "√(x)+π+x^2");
assert.ok(mathEntryToolbarLabels.includes("dy/dx"));
assert.ok(mathEntryToolbarLabels.includes("d/dx"));
assert.deepEqual(selfReviewFocusIds, ["method", "working", "explanation", "interpretation", "units"]);

const explicit = deriveSelfReviewCriteria({
  selfReviewCriteria: ["Interpret the sign", "State the units"],
  solutionSteps: []
});
assert.deepEqual(explicit, ["Interpret the sign.", "State the units."]);

const fallback = deriveSelfReviewCriteria({
  solutionSteps: [
    { label: "Choose a method", explanation: "Use the derivative because the question asks for an instantaneous rate" },
    { label: "Interpret", explanation: "State the sign and units in context" }
  ]
});
assert.equal(fallback.length, 2);

assert.equal(isAo3SelfReviewQuestion({
  responseType: "short-reasoning",
  metadata: { assessmentObjective: "ao3" }
}), true);
assert.equal(isAo3SelfReviewQuestion({
  responseType: "short-reasoning",
  metadata: { assessmentObjective: "ao2" }
}), false);

const runner = createGeneratorRunner({ debugSeed: "answer-entry-pass" });
let ao3ReasoningCount = 0;
for (const definition of listQuestionDefinitions()) {
  if (definition.assessmentObjective !== "ao3" || definition.responseType !== "short-reasoning") continue;
  const question = runner.generate(definition);
  ao3ReasoningCount += 1;
  assert.equal(isAo3SelfReviewQuestion(question), true, definition.templateId);
  assert.ok(deriveSelfReviewCriteria(question).length >= 1, definition.templateId);
}
assert.ok(ao3ReasoningCount >= 1);

console.log(`Question response enhancement regression passed for ${ao3ReasoningCount} AO3 reasoning templates.`);
