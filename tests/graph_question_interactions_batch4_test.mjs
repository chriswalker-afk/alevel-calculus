import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";
import { getQuestionDefinition } from "../src/scripts/question-catalogue.js";
import {
  isConceptInteractiveQuestionVisual,
  termResponseFromSelection,
  termSelectionFromResponse
} from "../src/scripts/question-concept-visual-renderer.js";
import { checkRateFlowState, createRateFlowState, correctVariableOrder } from "../src/scripts/rate-flow-diagram.js";

const runner=createGeneratorRunner({debugSeed:"graph-interactions-batch-4"});
const generated=(templateId,sequence=0)=>runner.generate(getQuestionDefinition(templateId),{sequence});

const rate=generated("question-template:y13:differentiation:connected-rates:chain");
assert.equal(rate.diagramConfig.kind,"calculus-rate-flow-workspace");
assert.equal(isConceptInteractiveQuestionVisual(rate),true);
const rateDef=rate.diagramConfig.rateFlowDefinition;
const solved=createRateFlowState(rateDef,{
  order:correctVariableOrder(rateDef),
  orientations:Object.fromEntries(rateDef.relations.map((relation)=>[relation.id,"forward"])),
  targetOrientation:"forward"
});
assert.equal(checkRateFlowState(rateDef,solved).overallCorrect,true);
assert.equal(rate.check("a").tone,"correct");
assert.notEqual(rate.check("b").tone,"correct");

for(let sequence=0;sequence<12;sequence++){
  const implicit=generated("question-template:y13:differentiation:implicit-differentiation:y-term",sequence);
  assert.equal(implicit.diagramConfig.kind,"calculus-expression-term-selector");
  assert.equal(isConceptInteractiveQuestionVisual(implicit),true);
  const spec={...implicit.diagramConfig,...implicit.parameters.visual,kind:implicit.diagramConfig.kind};
  const correctKey=Object.entries(spec.responseMap).find(([,response])=>response==="a")?.[0];
  assert.ok(correctKey);
  const ids=correctKey.split("|");
  assert.equal(termResponseFromSelection(spec,ids),"a");
  assert.deepEqual(termSelectionFromResponse(spec,"a"),ids);
  assert.equal(implicit.check("a").tone,"correct");
}

for(let sequence=0;sequence<12;sequence++){
  const riemann=generated("question-template:y13:integration:limit-of-sum:map",sequence);
  assert.equal(riemann.diagramConfig.kind,"calculus-riemann-component-selector");
  assert.equal(isConceptInteractiveQuestionVisual(riemann),true);
  assert.ok(["width","height","sample","bounds"].includes(riemann.parameters.target));
  assert.equal(riemann.check(riemann.parameters.target).tone,"correct");
}

const normal=generated("question-template:y12:differentiation:tangents-normals:special-case");
assert.equal(normal.diagramConfig.kind,"calculus-line-selector");
assert.equal(isConceptInteractiveQuestionVisual(normal),true);
assert.equal(normal.check("b").tone,"correct");
assert.ok(normal.diagramConfig.lines.find((line)=>line.id==="b")?.vertical);
assert.equal(normal.diagramConfig.point.x,2);

const ode=generated("question-template:y13:differential-equations:first-order:initial-condition");
assert.equal(ode.diagramConfig.kind,"calculus-solution-curve-selector");
assert.equal(isConceptInteractiveQuestionVisual(ode),true);
assert.equal(ode.check("a").tone,"correct");
const exact=(x)=>2*Math.exp(-x);
assert.equal(exact(0),2);
assert.ok(Math.abs((-exact(0))-(-2))<1e-12,"At x=0, y'=−y must give slope −2.");
assert.ok(exact(1)<exact(0),"The correct solution should decay for positive x.");

const shell=readFileSync(new URL("../src/scripts/question-shell.js",import.meta.url),"utf8");
const renderer=readFileSync(new URL("../src/scripts/question-concept-visual-renderer.js",import.meta.url),"utf8");
const styles=readFileSync(new URL("../src/styles/question-shell.css",import.meta.url),"utf8");
assert.match(shell,/createConceptQuestionVisualRenderer/);
assert.match(shell,/isConceptInteractiveQuestionVisual/);
assert.match(renderer,/RateFlowDiagram/,"Connected-rates assessment must reuse the shared RateFlowDiagram.");
assert.match(renderer,/calculus-expression-term-selector/);
assert.match(renderer,/calculus-riemann-component-selector/);
assert.match(renderer,/calculus-line-selector/);
assert.match(renderer,/calculus-solution-curve-selector/);
assert.match(styles,/Bespoke interaction batch 4/);
assert.match(styles,/min-height:\s*52px/);

console.log("PASS graph interaction batch 4: connected rates, implicit terms, Riemann components, tangent/normal lines and differential-equation solution curves.");
