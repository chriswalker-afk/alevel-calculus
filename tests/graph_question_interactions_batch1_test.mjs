import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";
import { getQuestionDefinition } from "../src/scripts/question-catalogue.js";
import {
  intervalResponseFromSelection,
  intervalSelectionFromResponse,
  isInteractiveQuestionVisual
} from "../src/scripts/question-visual-renderer.js";

const runner=createGeneratorRunner({debugSeed:"graph-interactions-batch-1"});
const generated=(templateId)=>runner.generate(getQuestionDefinition(templateId),{sequence:0});

const increasingInterval=generated("question-template:y12:differentiation:increasing-decreasing:interval");
assert.equal(isInteractiveQuestionVisual(increasingInterval),true);
assert.equal(intervalResponseFromSelection(increasingInterval.diagramConfig,["right"]),"right");
assert.equal(increasingInterval.check("right").tone,"correct");

const increasingSolve=generated("question-template:y12:differentiation:increasing-decreasing:solve");
assert.equal(isInteractiveQuestionVisual(increasingSolve),true);
assert.equal(intervalResponseFromSelection(increasingSolve.diagramConfig,["left","right"]),"outer");
assert.equal(increasingSolve.check("outer").tone,"correct");
assert.deepEqual(intervalSelectionFromResponse(increasingSolve.diagramConfig,"outer"),["left","right"]);

const increasingApplication=generated("question-template:y12:differentiation:increasing-decreasing:application");
assert.equal(isInteractiveQuestionVisual(increasingApplication),true);
assert.equal(intervalResponseFromSelection(increasingApplication.diagramConfig,["early"]),"a");
assert.equal(increasingApplication.check("a").tone,"correct");

for(const [templateId,answer] of [
  ["question-template:y12:differentiation:stationary-points:sign-maximum","max"],
  ["question-template:y12:differentiation:stationary-points:sign-minimum","min"],
  ["question-template:y12:differentiation:stationary-points:sign-inflection","inflection"],
  ["question-template:y12:differentiation:stationary-points:application-classification","max"]
]){
  const q=generated(templateId);
  assert.equal(q.diagramConfig.kind,"calculus-point-classifier");
  assert.equal(isInteractiveQuestionVisual(q),true);
  assert.equal(q.check(answer).tone,"correct",templateId);
  assert.ok(q.diagramConfig.point && Number.isFinite(q.diagramConfig.point.x));
}

const concavityIntervals=generated("question-template:y13:differentiation:concavity-inflection:intervals");
assert.equal(isInteractiveQuestionVisual(concavityIntervals),true);
assert.equal(intervalResponseFromSelection(concavityIntervals.diagramConfig,["left"]),"a");
assert.equal(concavityIntervals.check("a").tone,"correct");

const quarticCandidate=generated("question-template:y13:differentiation:concavity-inflection:inflection");
assert.equal(quarticCandidate.diagramConfig.kind,"calculus-point-classifier");
assert.equal(isInteractiveQuestionVisual(quarticCandidate),true);
assert.equal(quarticCandidate.check("a").tone,"correct");

const nonStationaryInflection=generated("question-template:y13:differentiation:concavity-inflection:type");
assert.equal(nonStationaryInflection.diagramConfig.kind,"calculus-point-classifier");
assert.equal(nonStationaryInflection.check("a").tone,"correct");

const concavityApplication=generated("question-template:y13:differentiation:concavity-inflection:application");
assert.equal(isInteractiveQuestionVisual(concavityApplication),true);
assert.equal(intervalResponseFromSelection(concavityApplication.diagramConfig,["middle"]),"a");
assert.equal(concavityApplication.check("a").tone,"correct");

const renderer=readFileSync(new URL("../src/scripts/question-visual-renderer.js",import.meta.url),"utf8");
const styles=readFileSync(new URL("../src/styles/question-shell.css",import.meta.url),"utf8");
assert.match(renderer,/radius:\s*48/,"Point classifier must expose a generous invisible hit target.");
assert.match(renderer,/tabindex/,"Point interaction must remain keyboard focusable.");
assert.match(renderer,/aria-pressed/,"Interactive choices must expose selected state.");
assert.match(styles,/min-height:\s*52px/,"Visual answer controls need finger-sized targets.");
assert.match(styles,/prefers-reduced-motion/);

console.log("PASS graph interaction batch 1: increasing/decreasing, stationary points and concavity/inflection.");
