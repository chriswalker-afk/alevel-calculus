import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  AREA_EXPLORER_FUNCTIONS,
  calculateAreaState,
  findRoots,
  integrateFunction,
  normalizeSplitPoints
} from "../src/scripts/area-explorer.js";
import { createPolynomialFunctionDefinition } from "../src/scripts/linked-function-gradient-explorer.js";

const crossing = createPolynomialFunctionDefinition({
  id: "area-test-crossing",
  label: "x² − 1",
  coefficients: [-1, 0, 1],
  xDomain: [-3, 3],
  yDomains: { function: [-2, 9], derivative: [-7, 7], secondDerivative: [0, 3] }
});

const positive = createPolynomialFunctionDefinition({
  id: "area-test-positive",
  label: "x²",
  coefficients: [0, 0, 1],
  xDomain: [-3, 3],
  yDomains: { function: [-1, 9], derivative: [-7, 7], secondDerivative: [0, 3] }
});

assert.ok(Math.abs(integrateFunction(positive, 0, 2) - 8 / 3) < 1e-7, "Lower limit 0 should integrate correctly.");
assert.ok(Math.abs(integrateFunction(positive, 2, 0) + 8 / 3) < 1e-7, "Reversed limits must reverse the integral sign.");

const roots = findRoots(crossing, -2, 2);
assert.equal(roots.length, 2);
assert.ok(Math.abs(roots[0] + 1) < 1e-5);
assert.ok(Math.abs(roots[1] - 1) < 1e-5);

const forward = calculateAreaState(crossing, { lower: -2, upper: 2, splitPoints: [0] });
const reverse = calculateAreaState(crossing, { lower: 2, upper: -2, splitPoints: [0] });
assert.ok(Math.abs(forward.integral - 4 / 3) < 1e-6, "Crossing interval should preserve signed cancellation.");
assert.ok(Math.abs(forward.geometricArea - 4) < 1e-6, "Geometrical area should add absolute region areas.");
assert.ok(Math.abs(reverse.integral + 4 / 3) < 1e-6, "Reversing limits should negate only the definite integral.");
assert.ok(Math.abs(reverse.geometricArea - forward.geometricArea) < 1e-9, "Geometrical area should not depend on limit order.");
assert.deepEqual(forward.splitPoints, [0]);
assert.ok(forward.boundaries.some((value) => Math.abs(value) < 1e-9), "A user split point must subdivide the region model.");

const withExtraSplits = calculateAreaState(crossing, { lower: -2, upper: 2, splitPoints: [-0.5, 0.5] });
assert.ok(Math.abs(withExtraSplits.integral - forward.integral) < 1e-9, "Split points must not change the definite integral.");
assert.ok(Math.abs(withExtraSplits.geometricArea - forward.geometricArea) < 1e-8, "Split points must not change total geometrical area.");
assert.deepEqual(normalizeSplitPoints([2, 0, -2, 0, 9], -1, 1, [-3, 3]), [0], "Split points must be unique and strictly inside the chosen interval.");

assert.ok(AREA_EXPLORER_FUNCTIONS.length >= 3, "Step 27 should include positive and crossing validation families.");
for (const definition of AREA_EXPLORER_FUNCTIONS) {
  assert.ok(Object.isFrozen(definition.xDomain), "Area explorer function domains must remain fixed.");
  assert.ok(Object.isFrozen(definition.yDomains.function), "Area explorer y-domains must remain fixed rather than autoscale with limits.");
  assert.ok(definition.yDomains.function[0] <= 0 && definition.yDomains.function[1] >= 0, "Area graphs must keep the x-axis visible for signed shading.");
}

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/scripts/area-explorer.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles/area-explorer.css"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/area-explorer-demo.html"), "utf8");

assert.match(source, /from "\.\/diagram-primitives\.js(?:\?[^"]*)?"/, "AreaExplorer must compose DiagramPrimitives.");
assert.match(source, /from "\.\/linked-function-gradient-explorer\.js"/, "AreaExplorer should reuse the established function-definition contract.");
assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, "AreaExplorer must not create a parallel SVG/canvas system.");
assert.match(source, /shadedRegion\(/, "Signed regions must reuse the shared shading primitive.");
assert.match(source, /geometricArea/, "The engine must expose total geometrical area.");
assert.match(source, /splitPoints/, "The engine must support optional user-selected split points.");
assert.match(source, /orientation/, "The mathematical state must distinguish reversed limits.");
assert.match(css, /area-explorer__region--negative[\s\S]*stroke-dasharray/, "Negative regions need a non-colour visual cue.");
assert.match(source, /text: region\.sign === "positive" \? "\+" : "−"/, "Regions should carry explicit sign labels as a second non-colour cue.");
assert.match(source, /area-explorer__root-guide/, "Roots should be indicated with guides instead of markers obscuring the curve.");
assert.match(source, /area-explorer__split-guide/, "Split points should use unobtrusive guides rather than handles on the curve.");
assert.match(css, /@media \(max-width: 980px\)/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(demo, /reversed limits/i);
assert.match(demo, /axes stay fixed/i);

console.log("AreaExplorer tests passed.");
