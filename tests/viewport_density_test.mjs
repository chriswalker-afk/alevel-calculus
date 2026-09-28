import assert from "node:assert/strict";
import {
  applyViewportDensity,
  classifyViewportDensity,
  readViewportMetrics,
  viewportReference
} from "../src/scripts/viewport-density.js";

assert.deepEqual(viewportReference(390), { width: 390, height: 780 });
assert.deepEqual(viewportReference(820), { width: 820, height: 820 });
assert.deepEqual(viewportReference(1440), { width: 1440, height: 900 });

assert.equal(classifyViewportDensity({ width: 1920, height: 1080 }), "spacious");
assert.equal(classifyViewportDensity({ width: 1440, height: 900 }), "standard");
assert.equal(classifyViewportDensity({ width: 1366, height: 768 }), "compact");
assert.equal(classifyViewportDensity({ width: 1259, height: 530 }), "tight");
assert.equal(classifyViewportDensity({ width: 390, height: 844 }), "standard");
assert.equal(classifyViewportDensity({ width: 375, height: 667 }), "compact");

const metrics = readViewportMetrics({
  innerWidth: 1440,
  innerHeight: 900,
  visualViewport: { width: 1180, height: 650 }
});
assert.deepEqual(metrics, { width: 1180, height: 650 }, "VisualViewport should win so browser zoom and browser chrome are respected.");

const root = { dataset: {} };
assert.equal(applyViewportDensity(root, { width: 1180, height: 650 }), "compact");
assert.equal(root.dataset.uiDensity, "compact");

console.log("PASS adaptive viewport-density classification and VisualViewport handling");
