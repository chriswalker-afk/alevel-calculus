import { normaliseSolutionSteps } from "./solution-step.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEquationStepViewModel(steps) {
  const normalised = normaliseSolutionSteps(steps, { sourceLabel: "EquationStepRenderer" });
  return Object.freeze(normalised.map((step, index) => Object.freeze({
    number: index + 1,
    id: step.id,
    kind: step.kind,
    label: step.label,
    expression: step.expression,
    explanation: step.explanation
  })));
}

export function renderEquationSteps(container, steps, options = {}) {
  if (!container) throw new Error("EquationStepRenderer requires a container.");
  const rows = buildEquationStepViewModel(steps);
  container.innerHTML = `<ol class="equation-step-list">${rows.map((row) => `
    <li class="equation-step equation-step--${escapeHtml(row.kind)}" data-solution-step-id="${escapeHtml(row.id)}" data-solution-step-kind="${escapeHtml(row.kind)}">
      <span class="equation-step__number" aria-hidden="true">${row.number}</span>
      <div class="equation-step__content">
        ${row.label ? `<span class="equation-step__label">${escapeHtml(row.label)}</span>` : ""}
        ${row.expression ? `<div class="equation-step__expression">${escapeHtml(row.expression)}</div>` : ""}
        ${row.explanation ? `<p class="equation-step__explanation">${escapeHtml(row.explanation)}</p>` : ""}
      </div>
    </li>`).join("")}</ol>`;
  if (typeof options.decorateExpression === "function" && typeof container.querySelector === "function") {
    for (const row of rows) {
      const item = container.querySelector(`[data-solution-step-id="${row.id}"]`);
      const expressionElement = item?.querySelector?.(".equation-step__expression") ?? null;
      if (expressionElement) options.decorateExpression(expressionElement, row);
    }
  }
  return rows;
}
