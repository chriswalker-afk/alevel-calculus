import { buildEquationStepViewModel, renderEquationSteps } from "./equation-step-renderer.js?v=ao1math3";

export function inspectSolutionSteps(steps) {
  return buildEquationStepViewModel(steps);
}

export function createWorkedSolutionRenderer(container) {
  if (!container) throw new Error("WorkedSolutionRenderer requires a container.");
  let currentSteps = Object.freeze([]);

  function render(steps) {
    const rows = renderEquationSteps(container, steps);
    currentSteps = Object.freeze(rows.map((row) => Object.freeze({ ...row })));
    return currentSteps;
  }

  function clear() {
    container.innerHTML = "";
    currentSteps = Object.freeze([]);
  }

  return Object.freeze({
    render,
    clear,
    inspect: () => currentSteps
  });
}
