import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";
import { getQuestionDefinition } from "../src/scripts/question-catalogue.js";
import {
  isInteractiveQuestionVisual,
  regionResponseFromSelection,
  regionSelectionFromResponse,
  splitResponseFromSelection,
  splitSelectionFromResponse
} from "../src/scripts/question-visual-renderer.js";

const runner=createGeneratorRunner({debugSeed:"graph-interactions-batch-2"});
const generated=(templateId)=>runner.generate(getQuestionDefinition(templateId),{sequence:0});

const endpoint=generated("question-template:y12:integration:area:endpoint-difference");
assert.equal(endpoint.diagramConfig.kind,"calculus-region-selector");
assert.equal(isInteractiveQuestionVisual(endpoint),true);
assert.equal(regionResponseFromSelection(endpoint.diagramConfig,["wanted"]),"a");
assert.equal(endpoint.check("a").tone,"correct");
assert.deepEqual(regionSelectionFromResponse(endpoint.diagramConfig,"a"),["wanted"]);

const signedContribution=generated("question-template:y12:integration:signed-area:contributions");
assert.equal(isInteractiveQuestionVisual(signedContribution),true);
assert.equal(regionResponseFromSelection(signedContribution.diagramConfig,["left"]),"a");
assert.equal(regionResponseFromSelection(signedContribution.diagramConfig,["right"]),"b");
assert.equal(regionResponseFromSelection(signedContribution.diagramConfig,["left","right"]),"c");
assert.equal(signedContribution.check("a").tone,"correct");

const splitRoots=generated("question-template:y12:integration:signed-area:split-roots");
assert.equal(splitRoots.diagramConfig.kind,"calculus-split-selector");
assert.equal(isInteractiveQuestionVisual(splitRoots),true);
assert.equal(splitResponseFromSelection(splitRoots.diagramConfig,["minus-one","plus-one"]),"a");
assert.equal(splitResponseFromSelection(splitRoots.diagramConfig,["zero"]),"b");
assert.equal(splitRoots.check("a").tone,"correct");
assert.deepEqual(splitSelectionFromResponse(splitRoots.diagramConfig,"a").ids,["minus-one","plus-one"]);
assert.equal(splitSelectionFromResponse(splitRoots.diagramConfig,"c").none,true);

const between=generated("question-template:y13:integration:areas:routine");
assert.equal(between.diagramConfig.kind,"calculus-region-selector");
assert.equal(isInteractiveQuestionVisual(between),true);
assert.equal(regionResponseFromSelection(between.diagramConfig,["enclosed"]),"a");
assert.equal(between.check("a").tone,"correct");
assert.match(between.prompt,/y=x\+1/);
assert.doesNotMatch(between.prompt,/x\+3/);
const line=(x)=>x+1;
const parabola=(x)=>x*x-x+1;
assert.equal(line(0),parabola(0));
assert.equal(line(2),parabola(2));
assert.ok(line(1)>parabola(1),"The line should be above the parabola inside the enclosed interval.");

const splitCurves=generated("question-template:y13:integration:areas:split");
assert.equal(splitCurves.diagramConfig.kind,"calculus-split-selector");
assert.equal(isInteractiveQuestionVisual(splitCurves),true);
assert.equal(splitResponseFromSelection(splitCurves.diagramConfig,["crossing"]),"a");
assert.equal(splitResponseFromSelection(splitCurves.diagramConfig,["left"]),"b");
assert.equal(splitCurves.check("a").tone,"correct");

const renderer=readFileSync(new URL("../src/scripts/question-visual-renderer.js",import.meta.url),"utf8");
const styles=readFileSync(new URL("../src/styles/question-shell.css",import.meta.url),"utf8");
assert.match(renderer,/calculus-region-selector/);
assert.match(renderer,/calculus-split-selector/);
assert.match(renderer,/role", "button"/);
assert.match(renderer,/radius:\s*46/,"Split points need generous hit targets.");
assert.match(styles,/Area-question interaction batch/);
assert.match(styles,/min-height:\s*52px/);

console.log("PASS graph interaction batch 2: integration regions, signed-area roots, and areas between curves.");
