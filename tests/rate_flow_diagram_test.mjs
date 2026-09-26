import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  RATE_FLOW_DEFINITIONS,
  chainRuleExpression,
  checkRateFlowState,
  correctVariableOrder,
  createRateFlowState,
  derivativeLabel,
  moveVariable,
  statusToken
} from "../src/scripts/rate-flow-diagram.js";

const circle = RATE_FLOW_DEFINITIONS.find((definition) => definition.id === "expanding-circle");
assert.deepEqual(correctVariableOrder(circle), ["t", "r", "A"]);
assert.equal(derivativeLabel(circle, "t", "r"), "dr/dt");
assert.equal(derivativeLabel(circle, "t", "r", "reverse"), "dt/dr");
assert.equal(statusToken("known"), "● known");
assert.equal(statusToken("unknown"), "◆ find");
assert.equal(statusToken("relationship"), "■ relationship");
assert.equal(chainRuleExpression(circle), "dA/dt = dA/dr × dr/dt");

let order = ["A", "t", "r"];
order = moveVariable(order, "A", "right");
assert.deepEqual(order, ["t", "A", "r"]);
order = moveVariable(order, "A", "right");
assert.deepEqual(order, ["t", "r", "A"]);

const solvedState = createRateFlowState(circle, {
  order: ["t", "r", "A"],
  orientations: { "r-t": "forward", "A-r": "forward" },
  targetOrientation: "forward"
});
assert.equal(checkRateFlowState(circle, solvedState).overallCorrect, true);
const wrongOrientation = createRateFlowState(circle, {
  order: ["t", "r", "A"],
  orientations: { "r-t": "reverse", "A-r": "forward" },
  targetOrientation: "forward"
});
assert.equal(checkRateFlowState(circle, wrongOrientation).orderCorrect, true);
assert.equal(checkRateFlowState(circle, wrongOrientation).orientationResults["r-t"], false);
assert.equal(checkRateFlowState(circle, wrongOrientation).overallCorrect, false);

const multi = RATE_FLOW_DEFINITIONS.find((definition) => definition.id === "sphere-density-chain");
assert.deepEqual(correctVariableOrder(multi), ["t", "r", "V", "m"], "Step 29 must support a multi-stage dependency chain.");
assert.equal(chainRuleExpression(multi), "dm/dt = dm/dV × dV/dr × dr/dt");
assert.notDeepEqual(createRateFlowState(multi).order, correctVariableOrder(multi), "The demo definition should begin rearrangeable rather than already solved.");

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/scripts/rate-flow-diagram.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles/rate-flow-diagram.css"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/rate-flow-diagram-demo.html"), "utf8");
assert.match(source, /from "\.\/diagram-primitives\.js"/, "RateFlowDiagram must compose DiagramPrimitives.");
assert.doesNotMatch(source, /createElementNS|<svg|canvas/i, "RateFlowDiagram must not create a parallel SVG/canvas system.");
assert.match(source, /this\.diagram\.arrow\(/, "Dependency direction must use shared arrow primitives.");
assert.match(source, /this\.diagram\.point\(/, "Variables must reuse shared point primitives.");
assert.match(source, /Move .* left|Move \$\{variable\.symbol\} \$\{direction\}/, "Rearrangement must expose labelled controls rather than pointer-only dragging.");
assert.match(source, /aria-pressed/, "Derivative orientation choices must expose their selected state accessibly.");
assert.match(source, /Arrange the dependency/);
assert.match(source, /Orient the derivatives/);
assert.match(css, /@media \(max-width: 980px\)/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(css, /rate-flow__shape--known/);
assert.match(css, /rate-flow__shape--unknown/);
assert.match(css, /rate-flow__shape--relationship/);
assert.match(demo, /Known, unknown and relationship-derived rates use both words and distinct shapes/i);
console.log("RateFlowDiagram tests passed.");
