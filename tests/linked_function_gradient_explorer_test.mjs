import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  POLYNOMIAL_FUNCTIONS,
  createPolynomialFunctionDefinition,
  derivativeCoefficients,
  evaluatePolynomial,
  polynomialToText,
  validateFunctionDefinition
} from "../src/scripts/linked-function-gradient-explorer.js";

assert.deepEqual(derivativeCoefficients([5, -2, 3]), [-2, 6]);
assert.deepEqual(derivativeCoefficients([7]), [0]);
assert.equal(evaluatePolynomial([1, -4, 1], 3), -2);
assert.equal(polynomialToText([0, -3, 0, 1]), "x^3 − 3x");

const cubic = createPolynomialFunctionDefinition({
  id: "test-cubic",
  label: "Test cubic",
  coefficients: [2, -1, 0, 2],
  xDomain: [-3, 3],
  yDomains: { function: [-20, 20], derivative: [-10, 50], secondDerivative: [-40, 40] },
  initialX: 1
});
assert.equal(cubic.evaluate(2), 16);
assert.equal(cubic.derivative(2), 23);
assert.equal(cubic.secondDerivative(2), 24);
assert.equal(cubic.expressions.function, "2x^3 − x + 2");
assert.equal(cubic.expressions.derivative, "6x^2 − 1");
assert.equal(cubic.expressions.secondDerivative, "12x");
assert.deepEqual(cubic.xDomain, [-3, 3]);
assert.deepEqual(cubic.yDomains.derivative, [-10, 50]);

assert.ok(POLYNOMIAL_FUNCTIONS.length >= 3, "Step 24 should ship several polynomial examples.");
for (const definition of POLYNOMIAL_FUNCTIONS) {
  assert.equal(definition.family, "polynomial");
  assert.equal(typeof definition.evaluate, "function");
  assert.equal(typeof definition.derivative, "function");
  assert.equal(typeof definition.secondDerivative, "function");
  assert.ok(Object.isFrozen(definition.xDomain), "Graph domains must be fixed so moving the point cannot rescale the graph.");
}

const futureTrigDefinition = {
  id: "future-sine",
  label: "sin x",
  family: "trigonometric",
  xDomain: [-Math.PI, Math.PI],
  yDomains: { function: [-1.2, 1.2], derivative: [-1.2, 1.2], secondDerivative: [-1.2, 1.2] },
  evaluate: Math.sin,
  derivative: Math.cos,
  secondDerivative: (x) => -Math.sin(x)
};
assert.equal(validateFunctionDefinition(futureTrigDefinition), futureTrigDefinition, "The engine contract must accept later non-polynomial families without a fork.");

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/scripts/linked-function-gradient-explorer.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles/linked-function-gradient-explorer.css"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/linked-function-gradient-explorer-demo.html"), "utf8");

assert.match(source, /from "\.\/diagram-primitives\.js(?:\?[^"]*)?"/, "Explorer must compose DiagramPrimitives.");
assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, "Explorer must not introduce a second SVG/canvas primitive system.");
assert.match(source, /draggablePoint\(/, "Function point must use the shared accessible draggable primitive.");
assert.match(source, /tangent\(/, "Tangent must use the shared tangent primitive.");
assert.match(source, /derivativePoint/, "A synchronized point on f'(x) is required.");
assert.match(source, /secondDerivativePoint/, "Optional f''(x) synchronization is required.");
assert.match(source, /setDerivativeVisible/, "Derivative graph reveal must be explicit/progressive.");
assert.match(source, /setDerivativeSamples/, "Step 33 gradient-function construction must extend the shared explorer with sampled derivative points.");
assert.match(source, /derivativePanelVisible/, "Sampled derivative points must be able to appear before the full derivative curve is revealed.");
assert.match(source, /setSecondDerivativeVisible/, "Second derivative reveal must be explicit/progressive.");
assert.match(source, /stepY: 0/, "The primary drag interaction should be horizontal along f(x), not free two-dimensional state.");
assert.match(css, /@media \(max-width: 980px\)/);
assert.match(css, /@media \(max-width: 640px\)/);
assert.match(demo, /linked-function-gradient-explorer-demo\.js/);

console.log("LinkedFunctionGradientExplorer tests passed.");
