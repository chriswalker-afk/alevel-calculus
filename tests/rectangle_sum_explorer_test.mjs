import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  RECTANGLE_SUM_FUNCTIONS,
  buildSumToIntegralMap,
  calculateRectangleSum,
  normalizeRectangleCount,
  normalizeSampleLocation,
  sampleXForRectangle
} from "../src/scripts/rectangle-sum-explorer.js";
import { createPolynomialFunctionDefinition } from "../src/scripts/linked-function-gradient-explorer.js";

const squarePlusOne = createPolynomialFunctionDefinition({
  id: "rectangle-test-square",
  label: "x² + 1",
  coefficients: [1, 0, 1],
  xDomain: [0, 2],
  yDomains: { function: [-1, 6], derivative: [-1, 5], secondDerivative: [0, 3] }
});

assert.equal(normalizeRectangleCount(0), 1);
assert.equal(normalizeRectangleCount(4.6), 5);
assert.equal(normalizeRectangleCount(500), 100);
assert.equal(normalizeSampleLocation("left"), "left");
assert.equal(normalizeSampleLocation("unknown"), "midpoint");
assert.equal(sampleXForRectangle(0, 2, "left"), 0);
assert.equal(sampleXForRectangle(0, 2, "midpoint"), 1);
assert.equal(sampleXForRectangle(0, 2, "right"), 2);

const oneMid = calculateRectangleSum(squarePlusOne, { lower: 0, upper: 2, n: 1, sampleLocation: "midpoint" });
assert.equal(oneMid.deltaX, 2, "One rectangle should span the whole interval.");
assert.equal(oneMid.rectangles.length, 1);
assert.equal(oneMid.rectangles[0].sampleX, 1);
assert.equal(oneMid.sum, 4, "Midpoint height f(1)=2 times width 2 gives 4.");
assert.ok(Math.abs(oneMid.exactIntegral - 14 / 3) < 1e-7, "Exact comparison should use the definite integral.");

const left4 = calculateRectangleSum(squarePlusOne, { lower: 0, upper: 2, n: 4, sampleLocation: "left" });
const right4 = calculateRectangleSum(squarePlusOne, { lower: 0, upper: 2, n: 4, sampleLocation: "right" });
const mid4 = calculateRectangleSum(squarePlusOne, { lower: 0, upper: 2, n: 4, sampleLocation: "midpoint" });
assert.equal(left4.deltaX, 0.5);
assert.ok(left4.sum < left4.exactIntegral, "Left rectangles should underestimate this increasing function.");
assert.ok(right4.sum > right4.exactIntegral, "Right rectangles should overestimate this increasing function.");
assert.ok(mid4.absoluteError < left4.absoluteError && mid4.absoluteError < right4.absoluteError, "Midpoints should improve this smooth test case.");

const mid80 = calculateRectangleSum(squarePlusOne, { lower: 0, upper: 2, n: 80, sampleLocation: "midpoint" });
assert.ok(mid80.absoluteError < mid4.absoluteError, "Making rectangles thinner should improve the limiting comparison in the validation case.");
assert.ok(mid80.absoluteError < 0.001, "Many midpoint rectangles should be visibly close to the exact integral.");

const reversed = calculateRectangleSum(squarePlusOne, { lower: 2, upper: 0, n: 20, sampleLocation: "midpoint" });
assert.ok(reversed.deltaX < 0, "Reversed bounds should preserve signed Δx.");
assert.ok(Math.abs(reversed.exactIntegral + 14 / 3) < 1e-7, "Exact integral comparison should respect orientation.");
assert.ok(reversed.sum < 0, "The finite sum should also respect orientation.");

const map = buildSumToIntegralMap(mid4, squarePlusOne);
assert.match(map.finiteSum, /Σ/);
assert.match(map.limitingSum, /lim n→∞/);
assert.match(map.integral, /∫_0\^2/);
assert.match(map.width, /Δx = \(b−a\)\/n/);
assert.match(map.sample, /k−½/);

assert.ok(RECTANGLE_SUM_FUNCTIONS.length >= 3, "Step 30 should include multiple fixed-domain validation functions.");
for (const definition of RECTANGLE_SUM_FUNCTIONS) {
  assert.ok(Object.isFrozen(definition.xDomain), "Rectangle-sum graph domains must remain fixed as n changes.");
  assert.ok(Object.isFrozen(definition.yDomains.function), "Rectangle-sum y-domains must remain fixed as n changes.");
  assert.ok(definition.yDomains.function[0] <= 0, "The x-axis must remain visible beneath the rectangles.");
}

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/scripts/rectangle-sum-explorer.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles/rectangle-sum-explorer.css"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/rectangle-sum-explorer-demo.html"), "utf8");

assert.match(source, /from "\.\/diagram-primitives\.js"/, "RectangleSumExplorer must compose DiagramPrimitives.");
assert.match(source, /from "\.\/area-explorer\.js"/, "Exact integral comparison should reuse AreaExplorer's canonical integration helper.");
assert.match(source, /from "\.\/linked-function-gradient-explorer\.js"/, "Function definitions should reuse the shared function contract.");
assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, "RectangleSumExplorer must not create a parallel SVG/canvas system.");
assert.match(source, /shadedRegion\(/, "Rectangles should reuse shared shaded-region primitives.");
assert.match(source, /Number of rectangles n/, "The engine must expose an n control.");
assert.match(source, /Left endpoint/);
assert.match(source, /Midpoint/);
assert.match(source, /Right endpoint/);
assert.match(source, /1 rectangle/);
assert.match(source, /Several: 6/);
assert.match(source, /Many: 30/);
assert.match(source, /Very many: 80/);
assert.match(source, /lim n→∞ Σ/, "The recognition bridge to a limiting sum must be present.");
assert.match(source, /How the finite sum maps to an integral/, "The engine must map finite-sum components to integral notation.");
assert.match(css, /@media \(max-width: 980px\)/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(demo, /fixed axes/i);
assert.match(demo, /sum components → integral notation/i);

console.log("RectangleSumExplorer tests passed.");
