import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  NUMERIC_INFORMATION_MODES,
  calculateChordState,
  formatChordNumber
} from "../src/scripts/chord-to-tangent-explorer.js";
import { createPolynomialFunctionDefinition } from "../src/scripts/linked-function-gradient-explorer.js";

const quadratic = createPolynomialFunctionDefinition({
  id: "x-squared",
  label: "x squared",
  coefficients: [0, 0, 1],
  xDomain: [-3, 3],
  yDomains: { function: [-1, 10], derivative: [-7, 7], secondDerivative: [0, 3] }
});

const stateAtH1 = calculateChordState(quadratic, 1, 2);
assert.deepEqual(stateAtH1.p, { x: 1, y: 1 });
assert.deepEqual(stateAtH1.q, { x: 2, y: 4 });
assert.equal(stateAtH1.h, 1);
assert.equal(stateAtH1.chordGradient, 3);
assert.equal(stateAtH1.tangentGradient, 2);

const stateAtSmallH = calculateChordState(quadratic, 1, 1.01);
assert.ok(Math.abs(stateAtSmallH.chordGradient - 2.01) < 1e-10);
assert.ok(Math.abs(stateAtSmallH.chordGradient - stateAtSmallH.tangentGradient) < Math.abs(stateAtH1.chordGradient - stateAtH1.tangentGradient));
assert.equal(formatChordNumber(0.01000000001), "0.01");

assert.deepEqual(Object.keys(NUMERIC_INFORMATION_MODES), ["hidden", "h-only", "gradients", "full"]);
assert.equal(NUMERIC_INFORMATION_MODES.hidden.h, false);
assert.equal(NUMERIC_INFORMATION_MODES["h-only"].h, true);
assert.equal(NUMERIC_INFORMATION_MODES.gradients.chordGradient, true);
assert.equal(NUMERIC_INFORMATION_MODES.full.tangentGradient, true);

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/scripts/chord-to-tangent-explorer.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles/chord-to-tangent-explorer.css"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/chord-to-tangent-explorer-demo.html"), "utf8");

assert.match(source, /from "\.\/diagram-primitives\.js"/, "Explorer must compose DiagramPrimitives.");
assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, "Explorer must not create a parallel SVG/canvas system.");
assert.match(source, /draggablePoint\(/, "Q must use the shared pointer/touch/keyboard draggable primitive.");
assert.match(source, /tangent\(/, "Tangent must use the shared tangent primitive.");
assert.match(source, /calculateChordState/, "Chord and tangent gradients should derive from one mathematical state object.");
assert.match(source, /setInformationMode/, "Numeric information must be revealable/restrictable by activity mode.");
assert.match(source, /close = Math\.abs\(state\.h\)/, "Near-P label positioning should adapt as h becomes small.");
assert.match(source, /dx: close \? sign \* 42 : 0/, "The h label must shift away from the collision zone for small h.");
assert.match(source, /stepY: 0/, "Q interaction should be horizontal along the curve, not free two-dimensional state.");
assert.match(css, /@media \(max-width: 980px\)/);
assert.match(css, /@media \(max-width: 640px\)/);
assert.match(demo, /data-h-preset="0\.01"/, "Demo should exercise the smallest planned h value.");
assert.match(demo, /Numbers shown/, "Demo should expose the numeric-information visibility contract.");

console.log("ChordToTangentExplorer tests passed.");
