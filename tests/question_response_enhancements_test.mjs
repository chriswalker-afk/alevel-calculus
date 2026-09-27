import assert from "node:assert/strict";
import {
  createReasoningMathPreview,
  deriveSelfReviewCriteria,
  formatMathInputForDisplay,
  isAo3SelfReviewQuestion,
  mathEntryToolbarLabels,
  selfReviewFocusIds
} from "../src/scripts/question-response-enhancements.js";
import { listQuestionDefinitions } from "../src/scripts/question-catalogue.js";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";

assert.equal(formatMathInputForDisplay("sqrt(x)+pi+x^2"), "√(x)+π+x^2");
assert.equal(formatMathInputForDisplay("-30x^(4)+-9x^(2)"), "−30x^4−9x^2");
assert.equal(formatMathInputForDisplay("3x^-4"), "3x^-4", "Negative powers must remain parseable by the shared superscript renderer.");
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
assert.equal(typeof createReasoningMathPreview, "function");

const responseEnhancementSource = await import("node:fs").then(({ readFileSync }) =>
  readFileSync(new URL("../src/scripts/question-response-enhancements.js", import.meta.url), "utf8")
);
assert.match(responseEnhancementSource, /question-self-review__criterion/);
assert.match(responseEnhancementSource, /span\.setAttribute\("data-math-prose", ""\)/);

const runner = createGeneratorRunner({ debugSeed: "answer-entry-pass" });
let ao2ReasoningCount = 0;
let ao3ReasoningCount = 0;
for (const definition of listQuestionDefinitions()) {
  if (definition.assessmentObjective === "ao2" && definition.responseType === "short-reasoning") ao2ReasoningCount += 1;
  if (definition.assessmentObjective !== "ao3" || definition.responseType !== "short-reasoning") continue;
  const question = runner.generate(definition);
  ao3ReasoningCount += 1;
  assert.equal(isAo3SelfReviewQuestion(question), true, definition.templateId);
  assert.ok(deriveSelfReviewCriteria(question).length >= 1, definition.templateId);
}
assert.ok(ao2ReasoningCount >= 1);
assert.ok(ao3ReasoningCount >= 1);

console.log(`Question response enhancement regression passed for ${ao2ReasoningCount} AO2 and ${ao3ReasoningCount} AO3 reasoning templates.`);
