import { randomShuffle } from "./match-engine.js";

const VALID_SECURITY = new Set(["needs-review", "developing", "secure"]);

export function createMemoryMixPlan(taskDefinitions, {
  length = taskDefinitions.length,
  shuffle = randomShuffle
} = {}) {
  if (!Array.isArray(taskDefinitions) || taskDefinitions.length < 2) throw new Error("MemoryMixEngine requires at least two task types.");
  const normalized = taskDefinitions.map((task) => {
    if (!task?.id || !task?.label || typeof task.reset !== "function") throw new Error("Each Memory Mix task needs id, label and reset().");
    return Object.freeze({ id: task.id, label: task.label, reset: task.reset });
  });
  const output = [];
  while (output.length < length) {
    const cycle = shuffle(normalized);
    for (const task of cycle) {
      if (output.length >= length) break;
      output.push(task);
    }
  }
  return Object.freeze(output);
}

export function aggregateMemoryMixSecurity(values) {
  const security = values.filter((value) => VALID_SECURITY.has(value));
  if (!security.length) return null;
  if (security.includes("needs-review")) return "needs-review";
  if (security.every((value) => value === "secure")) return "secure";
  return "developing";
}

export function createMemoryMixEngine(container, {
  taskDefinitions = [],
  length = taskDefinitions.length,
  shuffle = randomShuffle,
  onActivateTask = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("MemoryMixEngine requires a container.");
  const counter = container.querySelector("[data-memory-mix-counter]");
  const taskLabel = container.querySelector("[data-memory-mix-task-label]");
  const status = container.querySelector("[data-memory-mix-status]");
  const next = container.querySelector("[data-memory-mix-next]");
  const restart = container.querySelector("[data-memory-mix-restart]");
  if ([counter, taskLabel, status, next, restart].some((node) => !node)) throw new Error("MemoryMixEngine markup is incomplete.");

  let plan = createMemoryMixPlan(taskDefinitions, { length, shuffle });
  let index = 0;
  let currentComplete = false;
  let finished = false;
  let taskSecurity = new Map();

  const current = () => plan[index];

  function render() {
    counter.textContent = `Retrieval ${index + 1} of ${plan.length}`;
    taskLabel.textContent = current().label;
    next.disabled = !currentComplete || finished;
    next.textContent = index === plan.length - 1 ? "Finish review" : "Next retrieval";
  }

  function activateCurrent({ resetTask = false } = {}) {
    if (resetTask) current().reset();
    onActivateTask(current().id);
    render();
  }

  function startNewMix() {
    plan = createMemoryMixPlan(taskDefinitions, { length, shuffle });
    index = 0;
    currentComplete = false;
    finished = false;
    taskSecurity = new Map();
    status.textContent = "Complete the current retrieval before moving on.";
    activateCurrent({ resetTask: true });
  }

  function resume() {
    onActivateTask(current().id);
    render();
  }

  function recordTaskSecurity(taskId, security) {
    if (!VALID_SECURITY.has(security)) return;
    taskSecurity.set(taskId, security);
  }

  function recordTaskComplete(taskId) {
    if (finished || taskId !== current().id) return false;
    currentComplete = true;
    if (index === plan.length - 1) {
      finished = true;
      const security = aggregateMemoryMixSecurity(plan.map((task) => taskSecurity.get(task.id)));
      if (security) onSecurity({ engine: "memory-mix", security, taskSecurity: Object.freeze(Object.fromEntries(taskSecurity)) });
      onComplete({ engine: "memory-mix", taskIds: Object.freeze(plan.map((task) => task.id)) });
      status.textContent = "Mixed review complete. Use the result to decide what to revisit next.";
    } else {
      status.textContent = "Retrieval complete. Move on when you are ready.";
    }
    render();
    return true;
  }

  function advance() {
    if (!currentComplete || finished) return;
    index += 1;
    currentComplete = false;
    status.textContent = "Complete the current retrieval before moving on.";
    activateCurrent({ resetTask: true });
  }

  next.addEventListener("click", advance);
  restart.addEventListener("click", startNewMix);
  status.textContent = "Complete the current retrieval before moving on.";
  render();

  return Object.freeze({
    startNewMix,
    resume,
    advance,
    recordTaskSecurity,
    recordTaskComplete,
    getPlan: () => plan,
    getState: () => Object.freeze({ index, currentTaskId: current().id, currentComplete, finished, taskSecurity: Object.freeze(Object.fromEntries(taskSecurity)) })
  });
}
