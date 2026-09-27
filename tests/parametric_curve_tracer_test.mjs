import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PARAMETRIC_CURVES, calculateParametricState, integrateParametricArea, normalizeTInterval, sampleParametricCurve } from "../src/scripts/parametric-curve-tracer.js";

const parabola = PARAMETRIC_CURVES.find((curve) => curve.id === "parametric-parabola");
const state = calculateParametricState(parabola, 1.5);
assert.equal(state.x, 1.5); assert.equal(state.y, 1.25); assert.equal(state.dxdt, 1); assert.equal(state.dydt, 3); assert.equal(state.dydx, 3);
assert.deepEqual(normalizeTInterval([2,-1], parabola.tDomain), [-1,2], "Restricted t intervals must normalize without changing the curve domain.");
assert.deepEqual(normalizeTInterval([-99,99], parabola.tDomain), [-2.5,2.5], "Restricted intervals must clamp to the declared t domain.");
const samples = sampleParametricCurve(parabola, [-1,1], 12); assert.equal(samples.length, 13); assert.ok(samples.every((point) => point.t >= -1 && point.t <= 1));
const area = integrateParametricArea(parabola, [0,2]);
assert.ok(Math.abs(area - (2/3)) < 1e-7, "Parametric area must evaluate integral y(t) x'(t) dt.");
const reverseState = calculateParametricState(PARAMETRIC_CURVES.find((curve)=>curve.id === "parametric-cubic"), 0);
assert.ok(!Number.isFinite(reverseState.dydx), "Vertical tangent states must not invent a finite dy/dx value.");
assert.ok(PARAMETRIC_CURVES.length >= 3, "Step 28 should include varied validation curves.");
for (const definition of PARAMETRIC_CURVES) {
  assert.ok(Object.isFrozen(definition.tDomain)); assert.ok(Object.isFrozen(definition.xDomain)); assert.ok(Object.isFrozen(definition.yDomain));
  assert.ok(definition.initialT >= definition.tDomain[0] && definition.initialT <= definition.tDomain[1]);
}
const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root,"src/scripts/parametric-curve-tracer.js"),"utf8");
const css = fs.readFileSync(path.join(root,"src/styles/parametric-curve-tracer.css"),"utf8");
const demo = fs.readFileSync(path.join(root,"src/parametric-curve-tracer-demo.html"),"utf8");
assert.match(source,/from "\.\/diagram-primitives\.js(?:\?[^"]*)?"/,"Tracer must compose DiagramPrimitives.");
assert.doesNotMatch(source,/createElementNS|<svg|canvas/i,"Tracer must not create a parallel SVG/canvas system.");
assert.match(source,/diagram\.arrow\(/,"Direction must be shown with shared arrows.");
assert.match(source,/shadedRegion\(/,"Area-strip overlays must reuse shared region primitives.");
assert.match(source,/STAGES = Object\.freeze\(\["coordinates", "rates", "gradient", "area"\]\)/,"Information must reveal progressively.");
assert.match(source,/t ∈ \[/,"Restricted t interval must be visible on the diagram.");
assert.match(source,/integrateParametricArea/,"The engine must expose the parametric area calculation for later reuse.");
assert.match(source,/dxdt/); assert.match(source,/dydt/); assert.match(source,/dydx/);
assert.match(css,/@media \(max-width:980px\)/); assert.match(css,/@media \(max-width:720px\)/);
assert.match(css,/parametric-tracer__point-label[\s\S]*paint-order:stroke/,"Point labels should remain legible on tight curves.");
assert.match(demo,/Direction arrows/i); assert.match(demo,/axes stay fixed/i);
console.log("ParametricCurveTracer tests passed.");
