import assert from "node:assert/strict";
import { createMemoryMixPlan, createMemoryMixEngine, aggregateMemoryMixSecurity } from "../src/scripts/memory-mix-engine.js";

const resetCounts = new Map();
const tasks = ["rapid", "build", "diagram", "missing-piece", "impostor"].map((id) => ({
  id,
  label: id,
  reset() { resetCounts.set(id, (resetCounts.get(id) ?? 0) + 1); }
}));
const identityShuffle = (values) => [...values];
const plan = createMemoryMixPlan(tasks, { length: 5, shuffle: identityShuffle });
assert.deepEqual(plan.map((task) => task.id), tasks.map((task) => task.id));
assert.equal(new Set(plan.map((task) => task.id)).size, 5, "A five-task mix should vary retrieval engines rather than repeat one engine");
assert.equal(aggregateMemoryMixSecurity(["secure", "secure"]), "secure");
assert.equal(aggregateMemoryMixSecurity(["secure", "developing"]), "developing");
assert.equal(aggregateMemoryMixSecurity(["secure", "needs-review"]), "needs-review");

class FakeElement {
  constructor() {
    this.children = new Map();
    this.attributes = new Map();
    this.textContent = "";
    this.disabled = false;
  }
  querySelector(selector) { return this.children.get(selector) ?? null; }
  addEventListener() {}
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
}
const root = new FakeElement();
for (const selector of ["[data-memory-mix-counter]", "[data-memory-mix-task-label]", "[data-memory-mix-status]", "[data-memory-mix-next]", "[data-memory-mix-restart]"]) {
  root.children.set(selector, new FakeElement());
}
const activations = [], security = [], completions = [];
const mix = createMemoryMixEngine(root, {
  taskDefinitions: tasks,
  length: 5,
  shuffle: identityShuffle,
  onActivateTask: (id) => activations.push(id),
  onSecurity: (entry) => security.push(entry),
  onComplete: (entry) => completions.push(entry)
});
mix.startNewMix();
for (let index = 0; index < 5; index += 1) {
  const taskId = mix.getState().currentTaskId;
  mix.recordTaskSecurity(taskId, "secure");
  assert.equal(mix.recordTaskComplete(taskId), true);
  if (index < 4) mix.advance();
}
assert.equal(completions.length, 1);
assert.equal(security.at(-1).security, "secure");
assert.deepEqual(activations.slice(-5), tasks.map((task) => task.id));
for (const task of tasks) assert.equal((resetCounts.get(task.id) ?? 0) >= 1, true, `${task.id} should be reset through its existing engine adapter`);

console.log("PASS MemoryMixEngine orchestrates varied existing engines and aggregates review security/completion");
