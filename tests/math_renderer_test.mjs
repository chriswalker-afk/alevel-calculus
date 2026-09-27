import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tokeniseMathExpression } from "../src/scripts/math-renderer.js";

const derivative = tokeniseMathExpression("dy/dx = 3x²");
assert.equal(derivative[0].type, "fraction");
assert.equal(derivative[0].numerator, "dy");
assert.equal(derivative[0].denominator, "dx");
assert.equal(derivative[0].derivative, true);

const operator = tokeniseMathExpression("d/dx [x^3] = 3x^2");
assert.equal(operator[0].type, "fraction");
assert.equal(operator[0].numerator, "d");
assert.equal(operator[0].denominator, "dx");

const second = tokeniseMathExpression("d²y/dx² < 0");
assert.equal(second[0].numerator, "d²y");
assert.equal(second[0].denominator, "dx²");

const ordinary = tokeniseMathExpression("y = 3/x² + 1/(x+1)");
const fractions = ordinary.filter((token) => token.type === "fraction");
assert.equal(fractions.length, 2);
assert.deepEqual(
  fractions.map(({ numerator, denominator }) => [numerator, denominator]),
  [["3", "x²"], ["1", "x+1"]]
);

const prose = tokeniseMathExpression("Differentiate with respect to x.");
assert.deepEqual(prose, [{ type: "text", value: "Differentiate with respect to x." }]);

const firstPrinciples = tokeniseMathExpression("f′(x)=lim_(h→0) [f(x+h)−f(x)]/h");
const differenceQuotient = firstPrinciples.find((token) => token.type === "fraction");
assert.ok(differenceQuotient);
assert.equal(differenceQuotient.numerator, "f(x+h)−f(x)");
assert.equal(differenceQuotient.denominator, "h");

const nestedDerivativeRatio = tokeniseMathExpression("(dy/dt)/(dx/dt)");
assert.equal(nestedDerivativeRatio.length, 1);
assert.equal(nestedDerivativeRatio[0].type, "fraction");
assert.equal(nestedDerivativeRatio[0].numerator, "dy/dt");
assert.equal(nestedDerivativeRatio[0].denominator, "dx/dt");

const slashProse = tokeniseMathExpression("substitution/parts/trig");
assert.deepEqual(slashProse, [{ type: "text", value: "substitution/parts/trig" }]);

const scriptedDenominator = tokeniseMathExpression("m_normal = −1/m_tangent");
const scriptedFraction = scriptedDenominator.find((token) => token.type === "fraction");
assert.ok(scriptedFraction);
assert.equal(scriptedFraction.numerator, "1");
assert.equal(scriptedFraction.denominator, "m_tangent");

console.log("Math renderer tokenisation regression passed.");


const appShell = readFileSync(new URL("../src/scripts/app-shell.js", import.meta.url), "utf8");
const sourceHtml = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const mathCss = readFileSync(new URL("../src/styles/math-renderer.css", import.meta.url), "utf8");
assert.match(appShell, /installMathRendering\(document\)/);
assert.match(sourceHtml, /styles\/math-renderer\.css/);
assert.match(mathCss, /white-space:\s*nowrap/);
assert.match(mathCss, /overflow-x:\s*auto/);
