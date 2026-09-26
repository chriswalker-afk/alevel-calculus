import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";
import { getQuestionDefinition } from "../src/scripts/question-catalogue.js";
import {
  isSpecialInteractiveQuestionVisual,
  parametricResponseFromSelection,
  parametricSelectionFromResponse,
  trapeziumResponseFromSelection,
  trapeziumSelectionFromResponse,
  directionResponseFromChoice
} from "../src/scripts/question-special-visual-renderer.js";

const runner=createGeneratorRunner({debugSeed:"graph-interactions-batch-3"});
const generated=(templateId,sequence=0)=>runner.generate(getQuestionDefinition(templateId),{sequence});

const coordinate=generated("question-template:y13:differentiation:parametric-differentiation:coordinates");
assert.equal(coordinate.diagramConfig.kind,"calculus-parametric-point-selector");
assert.equal(isSpecialInteractiveQuestionVisual(coordinate),true);
const coordinateSpec={...coordinate.diagramConfig,...coordinate.parameters.visual};
const correctCoordinate=coordinateSpec.candidates.find((candidate)=>candidate.id==="a");
assert.ok(correctCoordinate);
assert.equal(parametricResponseFromSelection(coordinateSpec,["a"]),"a");
assert.deepEqual(parametricSelectionFromResponse(coordinateSpec,"a"),["a"]);
assert.equal(coordinate.check("a").tone,"correct");

const vertical=generated("question-template:y13:differentiation:parametric-differentiation:vertical-tangent");
assert.equal(isSpecialInteractiveQuestionVisual(vertical),true);
assert.equal(parametricResponseFromSelection(vertical.diagramConfig,["a"]),"a");
assert.equal(vertical.check("a").tone,"correct");
assert.deepEqual(vertical.diagramConfig.xCoefficients,[0,0,1]);
assert.deepEqual(vertical.diagramConfig.yCoefficients,[0,-3,0,1]);

const horizontal=generated("question-template:y13:differentiation:parametric-differentiation:application");
assert.equal(isSpecialInteractiveQuestionVisual(horizontal),true);
assert.equal(parametricResponseFromSelection(horizontal.diagramConfig,["minus-one","plus-one"]),"a");
assert.equal(horizontal.check("a").tone,"correct");
assert.equal(parametricResponseFromSelection(horizontal.diagramConfig,["minus-root3","plus-root3"]),"b");

const areaLimits=generated("question-template:y13:integration:parametric-area:limits");
assert.equal(isSpecialInteractiveQuestionVisual(areaLimits),true);
assert.equal(parametricResponseFromSelection(areaLimits.diagramConfig,["zero","two"]),"a");
assert.equal(areaLimits.check("a").tone,"correct");
assert.equal(areaLimits.diagramConfig.xCoefficients[2],1);

const areaDirection=generated("question-template:y13:integration:parametric-area:direction");
assert.equal(areaDirection.diagramConfig.kind,"calculus-parametric-direction-selector");
assert.equal(isSpecialInteractiveQuestionVisual(areaDirection),true);
assert.equal(directionResponseFromChoice(areaDirection.diagramConfig,"right-left"),"a");
assert.equal(areaDirection.check("a").tone,"correct");
assert.equal(areaDirection.diagramConfig.startPoint.x,3);
assert.equal(areaDirection.diagramConfig.endPoint.x,-3);

const coefficients=generated("question-template:y13:integration:numerical:coefficients");
assert.equal(coefficients.diagramConfig.kind,"calculus-trapezium-ordinate-selector");
assert.equal(isSpecialInteractiveQuestionVisual(coefficients),true);
assert.equal(trapeziumResponseFromSelection(coefficients.diagramConfig,["y1","y2","y3"]),"a");
assert.equal(coefficients.check("a").tone,"correct");
assert.deepEqual(trapeziumSelectionFromResponse(coefficients.diagramConfig,"a").ids,["y1","y2","y3"]);
assert.equal(trapeziumSelectionFromResponse(coefficients.diagramConfig,"b").none,true);

const bound=generated("question-template:y13:integration:numerical:bound");
assert.equal(bound.diagramConfig.kind,"calculus-trapezium-bound-selector");
assert.equal(isSpecialInteractiveQuestionVisual(bound),true);
assert.equal(bound.diagramConfig.responseMap.over,"a");
assert.equal(bound.check("a").tone,"correct");
for(let i=0;i<bound.diagramConfig.xValues.length;i++){
  const x=bound.diagramConfig.xValues[i];
  assert.equal(bound.diagramConfig.yValues[i],x*x+1);
}

const shell=readFileSync(new URL("../src/scripts/question-shell.js",import.meta.url),"utf8");
const renderer=readFileSync(new URL("../src/scripts/question-special-visual-renderer.js",import.meta.url),"utf8");
const styles=readFileSync(new URL("../src/styles/question-shell.css",import.meta.url),"utf8");
assert.match(shell,/createSpecialQuestionVisualRenderer/);
assert.match(shell,/isSpecialInteractiveQuestionVisual/);
assert.match(renderer,/radius:\s*44/,"Parametric points should have generous hit targets.");
assert.match(renderer,/radius:\s*42/,"Trapezium ordinates should have generous hit targets.");
assert.match(renderer,/calculus-trapezium-bound-selector/);
assert.match(styles,/Parametric and trapezium bespoke question batch/);
assert.match(styles,/min-height:\s*52px/);

console.log("PASS graph interaction batch 3: parametric points/direction and trapezium construction/bounds.");
