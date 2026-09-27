import { renderMathElement } from "./math-renderer.js?v=integrationmath1";
import { formatStudentMathForDisplay } from "./student-math-input.js?v=questionfix1";

const mathToolbar = Object.freeze([
  Object.freeze({ label: "x²", insert: "^2", cursorBack: 0, ariaLabel: "Insert squared power" }),
  Object.freeze({ label: "xⁿ", insert: "^()", cursorBack: 1, ariaLabel: "Insert a power" }),
  Object.freeze({ label: "√", insert: "sqrt()", cursorBack: 1, ariaLabel: "Insert square root" }),
  Object.freeze({ label: "a/b", insert: "()/()", cursorBack: 4, ariaLabel: "Insert a fraction" }),
  Object.freeze({ label: "( )", insert: "()", cursorBack: 1, ariaLabel: "Insert brackets" }),
  Object.freeze({ label: "π", insert: "pi", cursorBack: 0, ariaLabel: "Insert pi" }),
  Object.freeze({ label: "eˣ", insert: "e^()", cursorBack: 1, ariaLabel: "Insert e to a power" }),
  Object.freeze({ label: "ln", insert: "ln()", cursorBack: 1, ariaLabel: "Insert natural logarithm" }),
  Object.freeze({ label: "sin", insert: "sin()", cursorBack: 1, ariaLabel: "Insert sine" }),
  Object.freeze({ label: "cos", insert: "cos()", cursorBack: 1, ariaLabel: "Insert cosine" }),
  Object.freeze({ label: "tan", insert: "tan()", cursorBack: 1, ariaLabel: "Insert tangent" }),
  Object.freeze({ label: "dy/dx", insert: "dy/dx", cursorBack: 0, ariaLabel: "Insert d y by d x" }),
  Object.freeze({ label: "d/dx", insert: "d/dx", cursorBack: 0, ariaLabel: "Insert differentiation operator d by d x" }),
  Object.freeze({ label: "+ C", insert: " + C", cursorBack: 0, ariaLabel: "Insert constant of integration plus C" })
]);

const reflectionFocusOptions = Object.freeze([
  Object.freeze({ id: "method", label: "Method" }),
  Object.freeze({ id: "working", label: "Working" }),
  Object.freeze({ id: "explanation", label: "Explanation" }),
  Object.freeze({ id: "interpretation", label: "Interpretation" }),
  Object.freeze({ id: "units", label: "Units" })
]);

function normaliseCriterion(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.endsWith(".") ? text : `${text}.`;
}

export function formatMathInputForDisplay(value) {
  return formatStudentMathForDisplay(value);
}

export function isAo3SelfReviewQuestion(question) {
  return question?.responseType === "short-reasoning"
    && question?.metadata?.assessmentObjective === "ao3";
}

export function deriveSelfReviewCriteria(question) {
  const explicit = Array.isArray(question?.selfReviewCriteria)
    ? question.selfReviewCriteria.map(normaliseCriterion).filter(Boolean)
    : [];
  if (explicit.length) return Object.freeze([...new Set(explicit)].slice(0, 6));

  const steps = Array.isArray(question?.solutionSteps) ? question.solutionSteps : [];
  const derived = [];
  for (const step of steps) {
    const text = normaliseCriterion(step?.explanation || step?.label);
    if (text && !derived.includes(text)) derived.push(text);
    if (derived.length >= 5) break;
  }
  if (derived.length) return Object.freeze(derived);
  return Object.freeze([
    "The method is appropriate for the question.",
    "The conclusion answers the question in context."
  ]);
}

function dispatchInput(input) {
  const EventCtor = input?.ownerDocument?.defaultView?.Event ?? globalThis.Event;
  if (typeof input?.dispatchEvent !== "function" || typeof EventCtor !== "function") return;
  input.dispatchEvent(new EventCtor("input", { bubbles: true }));
}

function insertAtSelection(input, spec) {
  const value = String(input.value ?? "");
  const start = Number.isInteger(input.selectionStart) ? input.selectionStart : value.length;
  const end = Number.isInteger(input.selectionEnd) ? input.selectionEnd : start;
  const selected = value.slice(start, end);

  let insertion = spec.insert;
  let cursorBack = spec.cursorBack;
  if (spec.insert === "()/()" && selected) {
    insertion = `(${selected})/()`;
    cursorBack = 1;
  } else if (spec.insert === "^()" && selected) {
    insertion = `${selected}^()`;
    cursorBack = 1;
  }

  if (typeof input.setRangeText === "function") input.setRangeText(insertion, start, end, "end");
  else input.value = `${value.slice(0, start)}${insertion}${value.slice(end)}`;

  const cursor = Math.max(0, (input.selectionStart ?? (start + insertion.length)) - cursorBack);
  input.setSelectionRange?.(cursor, cursor);
  dispatchInput(input);
  input.focus?.();
}

export function createMathEntryEnhancement({ inputGroup, input } = {}) {
  const doc = input?.ownerDocument ?? inputGroup?.ownerDocument ?? null;
  if (!doc?.createElement || !inputGroup?.insertBefore || !input) {
    return Object.freeze({
      sync() {},
      setMode() {},
      enhanced: false
    });
  }

  const shell = doc.createElement("div");
  shell.className = "question-math-entry";
  shell.setAttribute("data-question-math-entry", "");

  const entryRow = doc.createElement("div");
  entryRow.className = "question-math-entry__field";

  const previewWrap = doc.createElement("div");
  previewWrap.className = "question-math-entry__preview-wrap";
  const previewLabel = doc.createElement("span");
  previewLabel.className = "question-math-entry__preview-label";
  previewLabel.textContent = "As mathematics";
  const preview = doc.createElement("div");
  preview.className = "question-math-entry__preview";
  preview.setAttribute("data-question-math-entry-preview", "");
  preview.setAttribute("aria-label", "Formatted mathematics preview");
  previewWrap.append(previewLabel, preview);

  const toolbarWrap = doc.createElement("div");
  toolbarWrap.className = "question-math-entry__toolbar-wrap";
  const toolbarLabel = doc.createElement("span");
  toolbarLabel.className = "question-math-entry__toolbar-label";
  toolbarLabel.textContent = "Maths keys";
  const toolbar = doc.createElement("div");
  toolbar.className = "question-math-entry__toolbar";
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Common mathematics symbols");

  for (const spec of mathToolbar) {
    const button = doc.createElement("button");
    button.type = "button";
    button.className = "question-math-entry__key";
    button.textContent = spec.label;
    button.setAttribute("aria-label", spec.ariaLabel);
    button.addEventListener("click", () => insertAtSelection(input, spec));
    toolbar.append(button);
  }
  toolbarWrap.append(toolbarLabel, toolbar);

  const hint = doc.createElement("p");
  hint.className = "question-math-entry__hint";
  hint.textContent = "Type normally or use the maths keys. Your answer is checked from what you type; the preview only improves readability.";

  inputGroup.insertBefore(shell, input);
  entryRow.append(input);
  shell.append(entryRow, previewWrap, toolbarWrap, hint);

  function sync(value) {
    const raw = String(value ?? "").trim();
    preview.dataset.empty = raw ? "false" : "true";
    if (!raw) {
      preview.replaceChildren();
      preview.textContent = "Your expression will appear here.";
      preview.classList.remove("math-typeset", "math-typeset--display");
      return;
    }
    preview.replaceChildren();
    renderMathElement(preview, { source: formatMathInputForDisplay(raw) });
  }

  function setMode(responseType) {
    shell.dataset.responseType = responseType ?? "";
    toolbarWrap.hidden = responseType !== "algebraic";
  }

  sync(input.value);
  return Object.freeze({ sync, setMode, enhanced: true });
}


export function createReasoningMathPreview({ reasoningGroup, reasoning } = {}) {
  const doc = reasoning?.ownerDocument ?? reasoningGroup?.ownerDocument ?? null;
  if (!doc?.createElement || !reasoningGroup?.append || !reasoning) {
    return Object.freeze({ sync() {}, enhanced: false, element: null });
  }

  const wrap = doc.createElement("div");
  wrap.className = "question-reasoning-preview-wrap";
  wrap.hidden = true;
  wrap.setAttribute("data-question-reasoning-preview-wrap", "");

  const label = doc.createElement("span");
  label.className = "question-reasoning-preview__label";
  label.textContent = "Formatted explanation";

  const preview = doc.createElement("div");
  preview.className = "question-reasoning-preview";
  preview.setAttribute("data-question-reasoning-preview", "");
  preview.setAttribute("data-math-prose", "");
  preview.setAttribute("aria-label", "Formatted explanation preview");

  wrap.append(label, preview);
  reasoningGroup.append(wrap);

  function sync(value) {
    const raw = String(value ?? "").trim();
    wrap.hidden = !raw;
    if (!raw) {
      preview.replaceChildren();
      preview.classList.remove("math-typeset", "math-typeset--display");
      delete preview.dataset.mathSource;
      return;
    }
    preview.replaceChildren();
    renderMathElement(preview, { source: formatMathInputForDisplay(raw) });
  }

  reasoning.addEventListener?.("input", () => sync(reasoning.value));
  sync(reasoning.value);
  return Object.freeze({ sync, enhanced: true, element: wrap });
}

export function createSelfReviewPanel({
  beforeElement,
  onCriterionChange = () => {},
  onFocusChange = () => {},
  onOutcome = () => {}
} = {}) {
  const doc = beforeElement?.ownerDocument ?? null;
  const parent = beforeElement?.parentElement ?? null;
  if (!doc?.createElement || !parent?.insertBefore) {
    return Object.freeze({ render() {}, enhanced: false, element: null });
  }

  const panel = doc.createElement("section");
  panel.className = "question-self-review";
  panel.hidden = true;
  panel.setAttribute("data-question-self-review", "");
  panel.setAttribute("aria-label", "Self review");

  const eyebrow = doc.createElement("p");
  eyebrow.className = "question-self-review__eyebrow";
  eyebrow.textContent = "Review your reasoning";
  const heading = doc.createElement("h3");
  heading.textContent = "Compare your answer with the model";
  const intro = doc.createElement("p");
  intro.className = "question-self-review__intro";
  intro.textContent = "Tick a point only when your own response contains it. This avoids guessing the exact wording a computer expects.";

  const criteriaHeading = doc.createElement("strong");
  criteriaHeading.className = "question-self-review__subheading";
  criteriaHeading.textContent = "My response includes:";
  const criteria = doc.createElement("div");
  criteria.className = "question-self-review__criteria";
  criteria.setAttribute("data-question-self-review-criteria", "");

  const focusFieldset = doc.createElement("fieldset");
  focusFieldset.className = "question-self-review__focus";
  const focusLegend = doc.createElement("legend");
  focusLegend.textContent = "What would you improve next?";
  const focusGrid = doc.createElement("div");
  focusGrid.className = "question-self-review__focus-grid";
  for (const option of reflectionFocusOptions) {
    const label = doc.createElement("label");
    label.className = "question-self-review__focus-option";
    const input = doc.createElement("input");
    input.type = "checkbox";
    input.value = option.id;
    input.dataset.selfReviewFocus = option.id;
    input.addEventListener("change", () => onFocusChange(option.id, input.checked));
    const span = doc.createElement("span");
    span.textContent = option.label;
    label.append(input, span);
    focusGrid.append(label);
  }
  focusFieldset.append(focusLegend, focusGrid);

  const note = doc.createElement("p");
  note.className = "question-self-review__note";
  note.textContent = "The model solution is shown below. Improve your answer before deciding whether it is secure.";

  const actions = doc.createElement("div");
  actions.className = "question-self-review__actions";
  const revise = doc.createElement("button");
  revise.type = "button";
  revise.className = "question-shell__button";
  revise.textContent = "I need to revise";
  revise.addEventListener("click", () => onOutcome("needs-review"));
  const secure = doc.createElement("button");
  secure.type = "button";
  secure.className = "question-shell__button question-shell__button--check";
  secure.textContent = "I've met these points";
  secure.addEventListener("click", () => onOutcome("secure"));
  actions.append(revise, secure);

  panel.append(eyebrow, heading, intro, criteriaHeading, criteria, focusFieldset, note, actions);
  parent.insertBefore(panel, beforeElement);

  function render({
    visible = false,
    criteria: criterionText = [],
    checkedCriteria = [],
    focus = [],
    outcome = null
  } = {}) {
    panel.hidden = !visible;
    if (!visible) return;

    const checked = new Set(checkedCriteria);
    criteria.replaceChildren();
    criterionText.forEach((text, index) => {
      const label = doc.createElement("label");
      label.className = "question-self-review__criterion";
      const input = doc.createElement("input");
      input.type = "checkbox";
      input.checked = checked.has(index);
      input.dataset.selfReviewCriterion = String(index);
      input.addEventListener("change", () => onCriterionChange(index, input.checked));
      const span = doc.createElement("span");
      span.setAttribute("data-math-prose", "");
      span.textContent = text;
      label.append(input, span);
      criteria.append(label);
    });

    const focusSet = new Set(focus);
    for (const checkbox of focusGrid.querySelectorAll?.("[data-self-review-focus]") ?? []) {
      checkbox.checked = focusSet.has(checkbox.value);
    }

    const allChecked = criterionText.length > 0 && criterionText.every((_, index) => checked.has(index));
    secure.disabled = !allChecked;
    panel.dataset.outcome = outcome ?? "";
  }

  return Object.freeze({ render, enhanced: true, element: panel });
}

export const mathEntryToolbarLabels = Object.freeze(mathToolbar.map((item) => item.label));
export const selfReviewFocusIds = Object.freeze(reflectionFocusOptions.map((item) => item.id));
