import assert from "node:assert/strict";
import fs from "node:fs";
import {
  DiagramPrimitives,
  clamp,
  normalizeDomain,
  domainToView,
  viewToDomain,
  fitLabelViewPosition,
  createDiagramPrimitives
} from "../src/scripts/diagram-primitives.js";

assert.equal(clamp(5, 0, 4), 4);
assert.equal(clamp(-1, 0, 4), 0);
assert.deepEqual(normalizeDomain([5, -5]), [-5, 5]);
assert.deepEqual(normalizeDomain([2, 2], [-1, 1]), [-1, 1]);
assert.equal(domainToView(0, [-5, 5], 0, 100), 50);
assert.equal(viewToDomain(75, [-5, 5], 0, 100), 2.5);
const startEdge = fitLabelViewPosition({ x: 995, y: 10, text: "long edge label", anchor: "start", width: 1000, height: 600 });
assert.ok(startEdge.x < 900, "Start-anchored labels near the right edge must be shifted inward rather than clipped.");
assert.ok(startEdge.y > 20, "Labels near the top edge must be shifted below the clipping boundary.");
const endEdge = fitLabelViewPosition({ x: 5, y: 598, text: "left edge", anchor: "end", width: 1000, height: 600 });
assert.ok(endEdge.x > 50, "End-anchored labels near the left edge must be shifted inward rather than clipped.");
assert.ok(endEdge.y < 598, "Labels near the bottom edge must stay inside the SVG viewBox.");
assert.equal(typeof DiagramPrimitives, "function");
assert.equal(typeof createDiagramPrimitives, "function");

const source = fs.readFileSync(new URL("../src/scripts/diagram-primitives.js", import.meta.url), "utf8");
for (const required of [
  "grid(", "axes(", "label(", "line(", "tangent(", "arrow(", "shadedRegion(",
  "draggablePoint(", "handle(", "tooltip(", "slider("
]) {
  assert.ok(source.includes(required), `Expected DiagramPrimitives to expose ${required}`);
}
assert.ok(source.includes('addEventListener("pointerdown"'), "draggable handles need pointer/touch-capable interaction");
assert.ok(source.includes('addEventListener("keydown"'), "draggable handles need keyboard interaction");
assert.ok(source.includes('role: "slider"'), "draggable handles need an accessible value role");
assert.ok(source.includes("ResizeObserver"), "responsive canvas sizing should observe its host");
assert.match(source, /function parseAspectRatio\(/, "DiagramPrimitives should derive its internal viewBox from the requested aspect ratio.");
assert.match(source, /this\.height = Math\.round\(this\.width \* aspectHeight \/ aspectWidth\)/, "The SVG viewBox should match the configured aspect ratio.");
assert.match(source, /preserveAspectRatio: "xMidYMid meet"/, "Responsive hosts must not stretch the mathematical SVG.");

const demo = fs.readFileSync(new URL("../src/diagram-primitives-demo.html", import.meta.url), "utf8");
assert.match(demo, /data-diagram-demo/);
assert.match(demo, /Pointer \/ touch/);
assert.match(demo, /Arrow keys/);
console.log("DiagramPrimitives contract checks passed.");
