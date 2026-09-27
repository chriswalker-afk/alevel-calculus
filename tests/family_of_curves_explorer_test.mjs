import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  FAMILY_OF_CURVES_FUNCTIONS,
  calculateFamilyState,
  evaluateFamilyMember,
  evaluateSharedDerivative,
  formatConstant
} from "../src/scripts/family-of-curves-explorer.js";
import { createPolynomialFunctionDefinition } from "../src/scripts/linked-function-gradient-explorer.js";

const definition = createPolynomialFunctionDefinition({
  id: "family-test",
  label: "F(x) = x²",
  coefficients: [0, 0, 1],
  xDomain: [-3, 3],
  yDomains: { function: [-8, 12], derivative: [-7, 7], secondDerivative: [0, 3] }
});

assert.equal(evaluateFamilyMember(definition, 2, 3), 7);
assert.equal(evaluateFamilyMember(definition, 2, -4), 0);
assert.equal(evaluateSharedDerivative(definition, 2), 4);
assert.equal(evaluateSharedDerivative(definition, -1), -2);
assert.equal(calculateFamilyState(definition, { x: 2, constant: 3 }).derivativeValue, 4);
assert.equal(calculateFamilyState(definition, { x: 2, constant: -4 }).derivativeValue, 4, "Derivative must be independent of C.");
assert.equal(evaluateFamilyMember(definition, 1.5, 3) - evaluateFamilyMember(definition, 1.5, -2), 5, "Changing C must translate every y-value by the same vertical amount.");
assert.equal(formatConstant(3), " + 3");
assert.equal(formatConstant(-2.5), " − 2.5");
assert.equal(formatConstant(0), "");

assert.ok(FAMILY_OF_CURVES_FUNCTIONS.length >= 3, "Step 26 should ship several validation families.");
for (const item of FAMILY_OF_CURVES_FUNCTIONS) {
  assert.ok(Object.isFrozen(item.xDomain), "x-domain must remain fixed while C changes.");
  assert.ok(Object.isFrozen(item.yDomains.function), "y-domain must remain fixed so translation is not autoscaled away.");
  const [xMin, xMax] = item.xDomain;
  const [yMin, yMax] = item.yDomains.function;
  for (let index = 0; index <= 120; index += 1) {
    const x = xMin + (index / 120) * (xMax - xMin);
    for (const constant of [-4, 4]) {
      const y = evaluateFamilyMember(item, x, constant);
      assert.ok(y >= yMin && y <= yMax, `${item.id} must keep C=${constant} visible inside its fixed y-domain.`);
    }
  }
}

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/scripts/family-of-curves-explorer.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles/family-of-curves-explorer.css"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/family-of-curves-explorer-demo.html"), "utf8");

assert.match(source, /from "\.\/diagram-primitives\.js(?:\?[^"]*)?"/, "Explorer must compose DiagramPrimitives.");
assert.match(source, /from "\.\/linked-function-gradient-explorer\.js"/, "Explorer should reuse the established function-definition contract.");
assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, "Explorer must not create a parallel SVG/canvas system.");
assert.match(source, /familyDiagram\.slider\(/, "C must use the shared accessible range-slider primitive.");
assert.match(source, /comparisonConstants/, "Multiple C values must be comparable.");
assert.match(source, /derivativeCurve/, "The shared derivative needs its own persistent representation.");
assert.match(source, /yDomain: definition\.yDomains\?\.function/, "Family graph must use a fixed declared y-domain rather than autoscaling with C.");
assert.match(source, /same for every C/, "The unchanged derivative relationship should be explicit.");
assert.match(css, /stroke-dasharray/, "Comparison curves should differ by line style rather than colour alone.");
assert.match(css, /@media \(max-width: 980px\)/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(demo, /comparison curves/i);
assert.match(demo, /axes stay fixed/i);

console.log("FamilyOfCurvesExplorer tests passed.");
