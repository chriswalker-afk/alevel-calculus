import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fitLabelViewPosition } from "../src/scripts/diagram-primitives.js";
import { POLYNOMIAL_FUNCTIONS } from "../src/scripts/linked-function-gradient-explorer.js";
import { calculateChordState } from "../src/scripts/chord-to-tangent-explorer.js";
import { FAMILY_OF_CURVES_FUNCTIONS, calculateFamilyState } from "../src/scripts/family-of-curves-explorer.js";
import { AREA_EXPLORER_FUNCTIONS, calculateAreaState } from "../src/scripts/area-explorer.js";
import { PARAMETRIC_CURVES, calculateParametricState, normalizeTInterval } from "../src/scripts/parametric-curve-tracer.js";
import { RATE_FLOW_DEFINITIONS, createRateFlowState, checkRateFlowState, correctVariableOrder } from "../src/scripts/rate-flow-diagram.js";
import { RECTANGLE_SUM_FUNCTIONS, calculateRectangleSum } from "../src/scripts/rectangle-sum-explorer.js";
import { TRAPEZIUM_RULE_FUNCTIONS, calculateTrapeziumRule, classifyTrapeziumBound } from "../src/scripts/trapezium-rule-builder.js";

const root = path.resolve(import.meta.dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const finite = (value, message) => assert.ok(Number.isFinite(value), message);

// Central label fitting: edge labels must stay inside the SVG view at phone-like and desktop-like viewboxes.
for (const width of [390, 768, 1000]) {
  for (const anchor of ["start", "middle", "end"]) {
    for (const [x, y] of [[-100, -100], [0, 0], [width, 600], [width + 100, 700]]) {
      const fitted = fitLabelViewPosition({ x, y, text: "t = -12.345 / long mathematical label", anchor, width, height: 600 });
      assert.ok(fitted.x >= 0 && fitted.x <= width, `Fitted ${anchor} label must stay horizontally visible at width ${width}.`);
      assert.ok(fitted.y >= 0 && fitted.y <= 600, `Fitted ${anchor} label must stay vertically visible at width ${width}.`);
    }
  }
}

// Linked gradient explorer: endpoint states remain finite and declared axes stay fixed.
for (const definition of POLYNOMIAL_FUNCTIONS) {
  for (const x of definition.xDomain) {
    finite(definition.evaluate(x), `${definition.id} function endpoint must be finite.`);
    finite(definition.derivative(x), `${definition.id} derivative endpoint must be finite.`);
    finite(definition.secondDerivative(x), `${definition.id} second derivative endpoint must be finite.`);
  }
  assert.ok(Object.isFrozen(definition.xDomain));
  assert.ok(Object.isFrozen(definition.yDomains.function));
}

// Chord/tangent explorer: smallest useful h and both domain directions must remain distinct and finite.
for (const definition of POLYNOMIAL_FUNCTIONS) {
  const [xMin, xMax] = definition.xDomain;
  const p = Math.min(Math.max(definition.initialX ?? 0, xMin + 0.02), xMax - 0.02);
  for (const q of [Math.min(xMax, p + 0.01), Math.max(xMin, p - 0.01), xMin, xMax]) {
    if (Math.abs(q - p) < 1e-12) continue;
    const state = calculateChordState(definition, p, q);
    finite(state.chordGradient, `${definition.id} chord gradient must remain finite at extreme Q.`);
    finite(state.tangentGradient, `${definition.id} tangent gradient must remain finite at extreme Q.`);
  }
}

// Family explorer: both C extremes remain within the predeclared fixed graph window.
for (const definition of FAMILY_OF_CURVES_FUNCTIONS) {
  const [xMin, xMax] = definition.xDomain;
  const [yMin, yMax] = definition.yDomains.function;
  for (const constant of [-4, 4]) {
    for (let i = 0; i <= 80; i += 1) {
      const x = xMin + (i / 80) * (xMax - xMin);
      const state = calculateFamilyState(definition, { x, constant });
      assert.ok(state.familyValue >= yMin - 1e-9 && state.familyValue <= yMax + 1e-9, `${definition.id}, C=${constant} must remain visible.`);
    }
  }
}

// Area explorer: full/reversed/zero-width/extreme split states must remain mathematically coherent.
for (const definition of AREA_EXPLORER_FUNCTIONS) {
  const [a, b] = definition.xDomain;
  const forward = calculateAreaState(definition, { lower: a, upper: b, splitPoints: [a, (a+b)/2, b] });
  const reverse = calculateAreaState(definition, { lower: b, upper: a, splitPoints: [(a+b)/2] });
  const zero = calculateAreaState(definition, { lower: a, upper: a, splitPoints: [] });
  finite(forward.integral, `${definition.id} full-domain integral must be finite.`);
  assert.ok(Math.abs(forward.integral + reverse.integral) < 2e-5, `${definition.id} reversed limits must reverse sign.`);
  assert.ok(Math.abs(forward.geometricArea - reverse.geometricArea) < 2e-5, `${definition.id} geometric area must ignore orientation.`);
  assert.ok(Math.abs(zero.integral) < 1e-10 && Math.abs(zero.geometricArea) < 1e-10, `${definition.id} zero-width interval must render as zero area.`);
}

// Parametric tracer: extreme t and restricted intervals stay in declared domains; vertical tangents stay explicit.
let sawVertical = false;
for (const definition of PARAMETRIC_CURVES) {
  const [tMin, tMax] = definition.tDomain;
  assert.deepEqual(normalizeTInterval([tMax + 99, tMin - 99], definition.tDomain), [tMin, tMax]);
  for (const t of [tMin, (tMin+tMax)/2, tMax]) {
    const state = calculateParametricState(definition, t);
    finite(state.x, `${definition.id} x(t) must be finite at t=${t}.`);
    finite(state.y, `${definition.id} y(t) must be finite at t=${t}.`);
    finite(state.dxdt, `${definition.id} dx/dt must be finite at t=${t}.`);
    finite(state.dydt, `${definition.id} dy/dt must be finite at t=${t}.`);
    if (!Number.isFinite(state.dydx) && !Number.isNaN(state.dydx)) sawVertical = true;
  }
}
assert.ok(sawVertical, "Visual audit must include an explicit vertical-tangent state.");

// Rectangle sums: minimum/maximum rectangle counts, all sampling modes and reversed bounds remain finite.
for (const definition of RECTANGLE_SUM_FUNCTIONS) {
  const [a, b] = definition.xDomain;
  for (const n of [1, 100]) for (const sampleLocation of ["left", "midpoint", "right"]) {
    for (const [lower, upper] of [[a,b],[b,a]]) {
      const state = calculateRectangleSum(definition, { lower, upper, n, sampleLocation });
      assert.equal(state.rectangles.length, n);
      finite(state.sum, `${definition.id} rectangle sum must stay finite at n=${n}.`);
      finite(state.exactIntegral, `${definition.id} exact integral must stay finite.`);
    }
  }
}

// Trapezium builder: minimum/maximum counts, reversed bounds and concavity classification stay coherent.
for (const definition of TRAPEZIUM_RULE_FUNCTIONS) {
  const [a,b] = definition.xDomain;
  for (const n of [1,24]) for (const [lower,upper] of [[a,b],[b,a]]) {
    const state = calculateTrapeziumRule(definition,{lower,upper,n});
    assert.equal(state.trapezia.length,n);
    finite(state.estimate, `${definition.id} trapezium estimate must stay finite.`);
    finite(state.exactIntegral, `${definition.id} exact integral must stay finite.`);
  }
  assert.ok(["overestimate","underestimate","mixed","unknown"].includes(classifyTrapeziumBound(definition,a,b).kind));
}

// Rate-flow diagram: initial and solved extreme arrangements remain checkable without drag-only interaction.
for (const definition of RATE_FLOW_DEFINITIONS) {
  const initial = createRateFlowState(definition);
  assert.equal(typeof checkRateFlowState(definition, initial).overallCorrect, "boolean");
  const order = correctVariableOrder(definition);
  const orientations = Object.fromEntries(definition.relations.map((relation)=>[relation.id,"forward"]));
  const solved = createRateFlowState(definition,{order,orientations,targetOrientation:"forward"});
  assert.equal(typeof checkRateFlowState(definition, solved).overallCorrect, "boolean");
}

// Shared-source visual/accessibility contract: all diagram systems reuse primitives and expose responsive layout.
const systems = [
  ["linked-function-gradient-explorer", 640],
  ["chord-to-tangent-explorer", 640],
  ["family-of-curves-explorer", 720],
  ["area-explorer", 720],
  ["parametric-curve-tracer", 720],
  ["rate-flow-diagram", 720],
  ["rectangle-sum-explorer", 720],
  ["trapezium-rule-builder", 720]
];
for (const [name, mobileBreak] of systems) {
  const source = read(`src/scripts/${name}.js`);
  const css = read(`src/styles/${name}.css`);
  assert.match(source, /diagram-primitives\.js/, `${name} must reuse DiagramPrimitives.`);
  assert.match(css, new RegExp(`max-width\\s*:\\s*${mobileBreak}px|max-width:${mobileBreak}px`), `${name} must retain its phone/tablet collapse rule.`);
  assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, `${name} must not fork the shared SVG/canvas layer.`);
}
const primitiveSource = read("src/scripts/diagram-primitives.js");
assert.match(primitiveSource, /pointerdown/);
assert.match(primitiveSource, /keydown/);
assert.match(primitiveSource, /role: "slider"/);
assert.match(primitiveSource, /fitLabelViewPosition/);
const rateSource = read("src/scripts/rate-flow-diagram.js");
assert.match(rateSource, /Move \$\{variable\.symbol\} \$\{direction\}/, "Rate-flow reordering must remain available by labelled buttons, not drag only.");

// Text-centric visuals must wrap rather than force horizontal clipping at student widths.
const questionShellCss = read("src/styles/question-shell.css");
assert.match(questionShellCss, /equation-step__expression[\s\S]*overflow-wrap:\s*anywhere/, "EquationStepRenderer output must wrap long mathematics.");
const structureCss = read("src/styles/product-quotient-chain-understand.css");
assert.match(structureCss, /equation-step__expression\[data-structure-expression=true\][\s\S]*flex-wrap:\s*wrap/, "StructureHighlighter output must wrap on narrow widths.");
assert.match(structureCss, /structure-token\{[^}]*max-width:100%|@media\(max-width:700px\)[\s\S]*structure-token\{max-width:100%/, "Structure tokens must remain bounded at phone widths.");

console.log("Step 78 interactive/diagram extreme-state audit passed.");
