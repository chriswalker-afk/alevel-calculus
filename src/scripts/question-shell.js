import { createQuestionVisualRenderer } from "./question-visual-renderer.js?v=auditstep7";
import { createSpecialQuestionVisualRenderer, isSpecialInteractiveQuestionVisual } from "./question-special-visual-renderer.js?v=ao3math1";
import { createConceptQuestionVisualRenderer, isConceptInteractiveQuestionVisual } from "./question-concept-visual-renderer.js?v=ao3math1";
import {
  getHintActionLabel,
  getHintProgressLabel,
  getVisibleHints,
  nextHintRevealCount
} from "./hint-sequence.js";
import { createWorkedSolutionRenderer } from "./worked-solution-renderer.js?v=ao3math1";
import { createMathEntryEnhancement, createReasoningMathPreview, createSelfReviewPanel, deriveSelfReviewCriteria, isAo3SelfReviewQuestion } from "./question-response-enhancements.js?v=memorymath2";
import { renderMathElement } from "./math-renderer.js?v=memorymath2";

export const questionResponseTypes = Object.freeze([
  "numeric",
  "algebraic",
  "choice",
  "short-reasoning"
]);

const feedbackPresentation = Object.freeze({
  correct: Object.freeze({ symbol: "✓", fallbackTitle: "Correct" }),
  incorrect: Object.freeze({ symbol: "×", fallbackTitle: "Not quite" }),
  warning: Object.freeze({ symbol: "△", fallbackTitle: "Keep going" }),
  info: Object.freeze({ symbol: "i", fallbackTitle: "Feedback" })
});

function assertElement(value, label) {
  if (!value) throw new Error(`QuestionShell is missing ${label}.`);
  return value;
}

function isEmptyResponse(question, response) {
  if (question.responseType === "choice") return !response;
  return String(response ?? "").trim().length === 0;
}

function makeBlankState() {
  return {
    response: "",
    checked: false,
    feedback: null,
    diagnostic: null,
    hintsRevealed: 0,
    solutionOpen: false,
    selfReviewOpen: false,
    selfReviewCriteria: new Set(),
    selfReviewFocus: new Set(),
    selfReviewOutcome: null,
    selfReviewAttemptCount: 0,
    scorePoint: null
  };
}

export function createQuestionShell(root, {
  onAttempt = () => {},
  resolveDiagnostic = () => null,
  onDiagnosticNavigate = () => {},
  onRequestFreshSet = () => null,
  onSetSummaryVisibilityChange = () => {},
  getSetCompletionChoices = () => ({}),
  onRequestNextAo = () => false,
  onRequestNextTopic = () => false
} = {}) {
  assertElement(root, "root");

  const fields = Object.freeze({
    topline: root.querySelector("[data-question-shell-topline]"),
    body: root.querySelector("[data-question-shell-body]"),
    footer: root.querySelector("[data-question-shell-footer]"),
    format: assertElement(root.querySelector("[data-question-shell-format]"), "format label"),
    counter: assertElement(root.querySelector("[data-question-shell-counter]"), "question counter"),
    newButton: assertElement(root.querySelector("[data-question-shell-new]"), "new set button"),
    prompt: assertElement(root.querySelector("[data-question-shell-prompt]"), "prompt"),
    math: assertElement(root.querySelector("[data-question-shell-math]"), "mathematics prompt"),
    visual: root.querySelector("[data-question-shell-visual]"),
    inputGroup: assertElement(root.querySelector('[data-question-response="input"]'), "text input response group"),
    inputLabel: assertElement(root.querySelector("[data-question-shell-input-label]"), "input label"),
    input: assertElement(root.querySelector("[data-question-shell-input]"), "input"),
    choiceGroup: assertElement(root.querySelector('[data-question-response="choice"]'), "choice response group"),
    reasoningGroup: assertElement(root.querySelector('[data-question-response="short-reasoning"]'), "reasoning response group"),
    reasoningLabel: assertElement(root.querySelector("[data-question-shell-reasoning-label]"), "reasoning label"),
    reasoning: assertElement(root.querySelector("[data-question-shell-reasoning]"), "reasoning textarea"),
    hintButton: assertElement(root.querySelector("[data-question-shell-hint]"), "hint button"),
    solutionButton: assertElement(root.querySelector("[data-question-shell-solution]"), "worked solution button"),
    checkButton: assertElement(root.querySelector("[data-question-shell-check]"), "check button"),
    feedback: assertElement(root.querySelector("[data-question-shell-feedback]"), "feedback region"),
    feedbackSymbol: assertElement(root.querySelector("[data-question-shell-feedback-symbol]"), "feedback symbol"),
    feedbackTitle: assertElement(root.querySelector("[data-question-shell-feedback-title]"), "feedback title"),
    feedbackMessage: assertElement(root.querySelector("[data-question-shell-feedback-message]"), "feedback message"),
    diagnostic: assertElement(root.querySelector("[data-question-shell-diagnostic]"), "diagnostic region"),
    diagnosticKind: assertElement(root.querySelector("[data-question-shell-diagnostic-kind]"), "diagnostic kind"),
    diagnosticTitle: assertElement(root.querySelector("[data-question-shell-diagnostic-title]"), "diagnostic title"),
    diagnosticMessage: assertElement(root.querySelector("[data-question-shell-diagnostic-message]"), "diagnostic message"),
    diagnosticLink: assertElement(root.querySelector("[data-question-shell-diagnostic-link]"), "diagnostic support link"),
    hintPanel: assertElement(root.querySelector("[data-question-shell-hint-panel]"), "hint panel"),
    hintProgress: assertElement(root.querySelector("[data-question-shell-hint-progress]"), "hint progress"),
    hintList: assertElement(root.querySelector("[data-question-shell-hint-list]"), "hint list"),
    solutionPanel: assertElement(root.querySelector("[data-question-shell-solution-panel]"), "worked solution panel"),
    solutionSteps: assertElement(root.querySelector("[data-question-shell-solution-steps]"), "worked solution steps"),
    progress: assertElement(root.querySelector("[data-question-shell-progress]"), "footer progress"),
    nextButton: assertElement(root.querySelector("[data-question-shell-next]"), "next question button"),
    nextLabel: assertElement(root.querySelector("[data-question-shell-next-label]"), "next question label"),
    summary: assertElement(root.querySelector("[data-question-set-summary]"), "set summary"),
    summaryTitle: assertElement(root.querySelector("[data-question-set-summary-title]"), "set summary title"),
    summaryScore: assertElement(root.querySelector("[data-question-set-summary-score]"), "set summary score"),
    summaryPercentage: assertElement(root.querySelector("[data-question-set-summary-percentage]"), "set summary percentage"),
    summaryDetail: assertElement(root.querySelector("[data-question-set-summary-detail]"), "set summary detail"),
    summaryNewSet: assertElement(root.querySelector("[data-question-set-summary-new-set]"), "new set button"),
    summaryNextAo: assertElement(root.querySelector("[data-question-set-summary-next-ao]"), "next AO button"),
    summaryNextTopic: assertElement(root.querySelector("[data-question-set-summary-next-topic]"), "next topic button")
  });

  for (const element of [
    fields.prompt,
    fields.feedbackTitle,
    fields.feedbackMessage,
    fields.diagnosticTitle,
    fields.diagnosticMessage,
    fields.hintList,
    fields.inputLabel,
    fields.reasoningLabel
  ]) element?.setAttribute?.("data-math-prose", "");
  const solutionRenderer = createWorkedSolutionRenderer(fields.solutionSteps);
  function handleVisualResponseChange(response) {
    const question = currentQuestion();
    if (!question) return;
    const state = stateFor(question);
    state.response = response;
    state.checked = false;
    state.feedback = null;
    state.diagnostic = null;
    state.solutionOpen = false;
    renderFeedback(state);
    renderDiagnostic(state);
    renderPanels(question, state);
  }
  const visualRenderer = createQuestionVisualRenderer(fields.visual, {
    onResponseChange: handleVisualResponseChange
  });
  const specialVisualRenderer = createSpecialQuestionVisualRenderer(fields.visual, {
    onResponseChange: handleVisualResponseChange
  });
  const conceptVisualRenderer = createConceptQuestionVisualRenderer(fields.visual, {
    onResponseChange: handleVisualResponseChange
  });

  function handlesInteractiveVisual(question) {
    return visualRenderer.handlesResponse(question)
      || isSpecialInteractiveQuestionVisual(question)
      || isConceptInteractiveQuestionVisual(question);
  }

  function renderInteractiveVisual(question, response) {
    if (isConceptInteractiveQuestionVisual(question)) {
      visualRenderer.clear();
      specialVisualRenderer.clear();
      return conceptVisualRenderer.render(question, { response });
    }
    conceptVisualRenderer.clear();
    if (isSpecialInteractiveQuestionVisual(question)) {
      visualRenderer.clear();
      return specialVisualRenderer.render(question, { response });
    }
    specialVisualRenderer.clear();
    return visualRenderer.render(question, { response });
  }
  const optionRows = Array.from(root.querySelectorAll("[data-question-shell-option]"));
  if (optionRows.length < 4) throw new Error("QuestionShell requires at least four reusable choice-option rows.");

  let activeSet = null;
  let questionIndex = 0;
  let completionChoices = Object.freeze({});
  const setIndex = new Map();
  const completedSetKeys = new Set();
  const stateByQuestionId = new Map();
  const mathEntry = createMathEntryEnhancement({ inputGroup: fields.inputGroup, input: fields.input });
  const reasoningPreview = createReasoningMathPreview({ reasoningGroup: fields.reasoningGroup, reasoning: fields.reasoning });
  let selfReview = null;

  function stateFor(question) {
    if (!stateByQuestionId.has(question.id)) stateByQuestionId.set(question.id, makeBlankState());
    return stateByQuestionId.get(question.id);
  }

  function currentQuestion() {
    return activeSet?.questions?.[questionIndex] ?? null;
  }

  function setKey(set = activeSet) {
    if (!set) return "";
    return `${set.id}::${set.practiceBatch ?? set.generationSeed ?? "base"}`;
  }

  function scoreActiveSet() {
    const questions = activeSet?.questions ?? [];
    const score = questions.reduce((total, question) => total + (stateFor(question).scorePoint === 1 ? 1 : 0), 0);
    const completed = questions.reduce((total, question) => total + (stateFor(question).checked ? 1 : 0), 0);
    const total = questions.length;
    return Object.freeze({
      score,
      total,
      completed,
      percentage: total ? Math.round((score / total) * 100) : 0,
      setId: activeSet?.id ?? null,
      practiceBatch: activeSet?.practiceBatch ?? null,
      assessmentObjective: currentQuestion()?.metadata?.assessmentObjective ?? null
    });
  }

  function setQuestionSurfaceVisible(visible) {
    if (fields.topline) fields.topline.hidden = !visible;
    if (fields.body) fields.body.hidden = !visible;
    if (fields.footer) fields.footer.hidden = !visible;
    fields.summary.hidden = visible;
    root.dataset.questionView = visible ? "question" : "summary";
    onSetSummaryVisibilityChange(!visible);
  }

  function renderSetSummary({ focus = false } = {}) {
    if (!activeSet) return;
    const result = scoreActiveSet();
    completionChoices = Object.freeze(getSetCompletionChoices(result) ?? {});
    const setLabel = Number.isInteger(result.practiceBatch) ? `Set ${result.practiceBatch}` : "Set";
    fields.summaryTitle.textContent = `${setLabel} complete`;
    fields.summaryScore.textContent = `${result.score} / ${result.total}`;
    fields.summaryPercentage.textContent = `${result.percentage}%`;
    fields.summaryDetail.textContent = `You scored ${result.score} out of ${result.total} on this set, based on the first checked response for each question. Choose what you want to do next.`;

    const nextAo = completionChoices.nextAo ?? null;
    fields.summaryNextAo.hidden = !nextAo;
    fields.summaryNextAo.disabled = !nextAo;
    if (nextAo) fields.summaryNextAo.textContent = nextAo.label ?? `Continue to ${String(nextAo.mode ?? "").toUpperCase()}`;

    const nextTopic = completionChoices.nextTopic ?? null;
    fields.summaryNextTopic.hidden = !nextTopic;
    fields.summaryNextTopic.disabled = !nextTopic;
    if (nextTopic) fields.summaryNextTopic.textContent = nextTopic.label ?? "Next topic";

    setQuestionSurfaceVisible(false);
    root.hidden = false;
    if (focus) fields.summaryNewSet.focus?.();
  }

  selfReview = createSelfReviewPanel({
    beforeElement: fields.solutionPanel,
    onCriterionChange(index, checked) {
      const question = currentQuestion();
      if (!question) return;
      const state = stateFor(question);
      if (checked) state.selfReviewCriteria.add(index);
      else state.selfReviewCriteria.delete(index);
      renderSelfReview(question, state);
    },
    onFocusChange(focusId, checked) {
      const question = currentQuestion();
      if (!question) return;
      const state = stateFor(question);
      if (checked) state.selfReviewFocus.add(focusId);
      else state.selfReviewFocus.delete(focusId);
    },
    onOutcome(outcome) {
      recordSelfReviewOutcome(outcome);
    }
  });

  function validateQuestion(question) {
    if (!question?.id || !questionResponseTypes.includes(question.responseType) || typeof question.check !== "function") {
      throw new Error("QuestionShell received an invalid question object.");
    }
    if (!Array.isArray(question.hintSequence)) throw new Error("QuestionShell questions require a hintSequence array.");
    if (!Array.isArray(question.solutionSteps) || question.solutionSteps.length === 0) throw new Error("QuestionShell questions require structured solutionSteps.");
    if (question.responseType === "choice" && (!Array.isArray(question.options) || question.options.length < 2 || question.options.length > optionRows.length)) {
      throw new Error("Choice questions must provide between 2 and 4 options for the shared QuestionShell.");
    }
  }

  function validateSet(set) {
    if (!set?.id || !Array.isArray(set.questions) || set.questions.length === 0) {
      throw new Error("QuestionShell requires a non-empty question set with a stable set ID.");
    }
    set.questions.forEach(validateQuestion);
  }

  function readResponse(question) {
    if (handlesInteractiveVisual(question)) return stateFor(question).response;
    if (question.responseType === "choice") {
      const selected = optionRows
        .map((row) => row.querySelector("[data-question-shell-choice]"))
        .find((input) => input?.checked && !input.disabled);
      return selected?.value ?? "";
    }
    if (question.responseType === "short-reasoning") return fields.reasoning.value;
    return fields.input.value;
  }

  function writeResponse(question, state) {
    fields.input.value = "";
    fields.reasoning.value = "";
    for (const row of optionRows) {
      const input = row.querySelector("[data-question-shell-choice]");
      if (input) input.checked = false;
    }

    if (question.responseType === "choice") {
      for (const row of optionRows) {
        const input = row.querySelector("[data-question-shell-choice]");
        if (input) input.checked = input.value === state.response;
      }
    } else if (question.responseType === "short-reasoning") {
      fields.reasoning.value = state.response;
    } else {
      fields.input.value = state.response;
    }
    mathEntry.sync(fields.input.value);
    reasoningPreview.sync(fields.reasoning.value);
  }

  function saveCurrentResponse() {
    const question = currentQuestion();
    if (!question) return;
    stateFor(question).response = readResponse(question);
  }

  function renderFeedback(state) {
    const feedback = state.feedback;
    fields.feedback.hidden = !feedback;
    if (!feedback) {
      fields.feedback.removeAttribute("data-tone");
      delete fields.feedback.dataset.errorCategory;
      fields.feedbackSymbol.textContent = "";
      fields.feedbackTitle.textContent = "";
      fields.feedbackMessage.textContent = "";
      return;
    }

    const presentation = feedbackPresentation[feedback.tone] ?? feedbackPresentation.info;
    fields.feedback.dataset.tone = feedback.tone in feedbackPresentation ? feedback.tone : "info";
    if (feedback.errorCategory) fields.feedback.dataset.errorCategory = feedback.errorCategory;
    else delete fields.feedback.dataset.errorCategory;
    fields.feedbackSymbol.textContent = presentation.symbol;
    fields.feedbackTitle.textContent = feedback.title || presentation.fallbackTitle;
    fields.feedbackMessage.textContent = feedback.message || "";
  }

  function renderDiagnostic(state) {
    const diagnostic = state.diagnostic;
    fields.diagnostic.hidden = !diagnostic;
    if (!diagnostic) {
      fields.diagnostic.removeAttribute("data-diagnostic-kind");
      fields.diagnosticKind.textContent = "";
      fields.diagnosticTitle.textContent = "";
      fields.diagnosticMessage.textContent = "";
      fields.diagnosticLink.textContent = "";
      fields.diagnosticLink.removeAttribute("href");
      delete fields.diagnosticLink.dataset.diagnosticTargetActivity;
      return;
    }

    fields.diagnostic.dataset.diagnosticKind = diagnostic.kind;
    fields.diagnosticKind.textContent = `Next step · ${diagnostic.kindLabel}`;
    fields.diagnosticTitle.textContent = diagnostic.target.title;
    fields.diagnosticMessage.textContent = diagnostic.message;
    fields.diagnosticLink.href = diagnostic.target.route;
    fields.diagnosticLink.textContent = `Open ${diagnostic.target.supportLabel}: ${diagnostic.target.title}`;
    fields.diagnosticLink.dataset.diagnosticTargetActivity = diagnostic.target.activityId;
  }

  function renderHintPanel(question, state) {
    const hints = question.hintSequence ?? [];
    const visibleHints = getVisibleHints(hints, state.hintsRevealed);
    const hintOpen = visibleHints.length > 0;
    fields.hintButton.disabled = hints.length === 0;
    fields.hintButton.setAttribute("aria-expanded", hintOpen ? "true" : "false");
    fields.hintButton.textContent = getHintActionLabel(hints, state.hintsRevealed);
    fields.hintPanel.hidden = !hintOpen;
    fields.hintProgress.textContent = getHintProgressLabel(hints, state.hintsRevealed);
    fields.hintList.textContent = visibleHints.map((hint, index) => `${index + 1}. ${hint.text}`).join("\n\n");
  }

  function renderSelfReview(question, state) {
    const visible = isAo3SelfReviewQuestion(question) && state.selfReviewOpen;
    selfReview?.render({
      visible,
      criteria: visible ? deriveSelfReviewCriteria(question) : [],
      checkedCriteria: [...state.selfReviewCriteria],
      focus: [...state.selfReviewFocus],
      outcome: state.selfReviewOutcome
    });
  }

  function renderPanels(question, state) {
    renderHintPanel(question, state);

    const selfReviewQuestion = isAo3SelfReviewQuestion(question);
    const solutionAvailable = state.checked || (selfReviewQuestion && state.selfReviewOpen);
    fields.solutionButton.disabled = !solutionAvailable;
    fields.solutionButton.setAttribute("aria-expanded", state.solutionOpen ? "true" : "false");
    fields.solutionButton.textContent = state.solutionOpen ? "Hide model solution" : (selfReviewQuestion ? "Model solution" : "Worked solution");
    fields.solutionPanel.hidden = !state.solutionOpen;
    solutionRenderer.render(question.solutionSteps);

    renderSelfReview(question, state);
    const atEndOfSet = questionIndex >= (activeSet?.questions?.length ?? 0) - 1;
    fields.nextLabel.textContent = atEndOfSet ? "Finish set" : "Next question";
    fields.nextButton.disabled = selfReviewQuestion ? state.selfReviewOutcome !== "secure" : !state.checked;
  }

  const mathFunctionWords = new Set(["sin", "cos", "tan", "sec", "cosec", "cot", "ln", "log", "exp", "lim"]);

  function shouldUseReasoningProseOption(question, option) {
    if (!["ao2", "ao3"].includes(question?.metadata?.assessmentObjective)) return false;
    const text = String(option?.label ?? "").trim();
    if (!text) return false;
    const words = text.match(/[A-Za-z]{3,}/g) ?? [];
    const proseWords = words.filter((word) => !mathFunctionWords.has(word.toLowerCase()));
    return /[.!?;:]/.test(text) || proseWords.length >= 3;
  }

  function renderOptions(question) {
    optionRows.forEach((row, index) => {
      const option = question.options?.[index] ?? null;
      const input = row.querySelector("[data-question-shell-choice]");
      const label = row.querySelector("[data-question-shell-choice-label]");
      const marker = row.querySelector("[data-question-shell-choice-marker]");
      row.hidden = !option;
      if (!input || !label || !marker) return;
      input.disabled = !option;
      input.value = option?.id ?? "";
      if (shouldUseReasoningProseOption(question, option)) label.setAttribute("data-math-prose", "");
      else label.removeAttribute("data-math-prose");
      label.textContent = option?.label ?? "";
      marker.textContent = String.fromCharCode(65 + index);
    });
  }

  function responseTypeLabel(responseType) {
    return {
      numeric: "Numeric response",
      algebraic: "Algebraic response",
      choice: "Multiple choice",
      "short-reasoning": "Short reasoning"
    }[responseType] ?? "Response";
  }

  function focusResponse(question) {
    if (handlesInteractiveVisual(question)) {
      if (isConceptInteractiveQuestionVisual(question)) conceptVisualRenderer.focusResponse();
      else if (isSpecialInteractiveQuestionVisual(question)) specialVisualRenderer.focusResponse();
      else visualRenderer.focusResponse();
      return;
    }
    if (question.responseType === "choice") {
      optionRows.find((row) => !row.hidden)?.querySelector("[data-question-shell-choice]")?.focus?.();
      return;
    }
    if (question.responseType === "short-reasoning") fields.reasoning.focus?.();
    else fields.input.focus?.();
  }

  function renderPrompt(question) {
    const segments = Array.isArray(question?.promptSegments) ? question.promptSegments : null;
    const doc = fields.prompt?.ownerDocument ?? null;
    if (!segments?.length || !doc?.createElement || !fields.prompt?.replaceChildren) {
      fields.prompt.textContent = question?.prompt ?? "";
      return;
    }

    fields.prompt.replaceChildren();
    for (const segment of segments) {
      if (!segment || typeof segment !== "object") continue;
      if (segment.type === "break") {
        fields.prompt.append(doc.createElement("br"));
        continue;
      }
      const value = String(segment.value ?? "");
      if (!value) continue;
      if (segment.type === "math") {
        const span = doc.createElement("span");
        span.className = "question-shell__inline-math";
        span.setAttribute("data-math-render", "");
        span.textContent = value;
        fields.prompt.append(span);
        renderMathElement(span, { source: value });
      } else {
        fields.prompt.append(doc.createTextNode(value));
      }
    }
  }

  function render({ focus = false } = {}) {
    const question = currentQuestion();
    if (!question || !activeSet) return;
    setQuestionSurfaceVisible(true);
    const state = stateFor(question);
    const position = `${questionIndex + 1} of ${activeSet.questions.length}`;
    const batchPrefix = Number.isInteger(activeSet.practiceBatch) ? `Set ${activeSet.practiceBatch} · ` : "";

    root.dataset.questionResponseType = question.responseType;
    root.dataset.questionId = question.id;
    const interactiveVisual = handlesInteractiveVisual(question);
    fields.format.textContent = interactiveVisual ? "Graph selection" : responseTypeLabel(question.responseType);
    fields.counter.textContent = `${batchPrefix}Question ${position}`;
    fields.progress.textContent = `${batchPrefix}Question ${position}`;
    renderPrompt(question);
    const standaloneMath = String(question.math ?? "").trim();
    fields.math.hidden = !standaloneMath;
    if (standaloneMath) fields.math.textContent = standaloneMath;
    else {
      fields.math.replaceChildren?.();
      fields.math.textContent = "";
    }

    const inputResponse = question.responseType === "numeric" || question.responseType === "algebraic";
    fields.inputGroup.hidden = !inputResponse;
    fields.choiceGroup.hidden = question.responseType !== "choice" || interactiveVisual;
    fields.reasoningGroup.hidden = question.responseType !== "short-reasoning";

    fields.inputLabel.textContent = question.responseLabel || "Your answer";
    fields.input.placeholder = question.placeholder || "Enter your answer";
    fields.input.inputMode = question.responseType === "numeric" ? "decimal" : "text";
    fields.reasoningLabel.textContent = question.responseLabel || "Your explanation";
    fields.reasoning.placeholder = question.placeholder || "Write a short explanation.";
    fields.checkButton.textContent = isAo3SelfReviewQuestion(question) ? "Review my reasoning" : "Check answer";

    mathEntry.setMode(question.responseType);
    renderOptions(question);
    writeResponse(question, state);
    renderInteractiveVisual(question, state.response);
    renderFeedback(state);
    renderDiagnostic(state);
    renderPanels(question, state);

    root.hidden = false;
    if (focus) focusResponse(question);
  }

  function loadSet(set, { focus = false, resetIndex = false } = {}) {
    validateSet(set);
    saveCurrentResponse();
    if (activeSet) setIndex.set(activeSet.id, questionIndex);
    activeSet = set;
    questionIndex = resetIndex
      ? 0
      : Math.min(setIndex.get(set.id) ?? 0, set.questions.length - 1);
    if (completedSetKeys.has(setKey(set))) renderSetSummary({ focus });
    else render({ focus });
  }

  function hide() {
    saveCurrentResponse();
    if (activeSet) setIndex.set(activeSet.id, questionIndex);
    visualRenderer.clear();
    specialVisualRenderer.clear();
    conceptVisualRenderer.clear();
    onSetSummaryVisibilityChange(false);
    root.hidden = true;
  }

  function checkCurrent() {
    const question = currentQuestion();
    if (!question) return null;
    const state = stateFor(question);
    state.response = readResponse(question);

    if (isEmptyResponse(question, state.response)) {
      state.feedback = {
        tone: "warning",
        title: "Enter a response first",
        message: "Add an answer, choice or short explanation before checking.",
        errorCategory: null
      };
      state.checked = false;
      state.solutionOpen = false;
      state.diagnostic = null;
      renderFeedback(state);
      renderDiagnostic(state);
      renderPanels(question, state);
      return state.feedback;
    }

    if (isAo3SelfReviewQuestion(question)) {
      state.selfReviewOpen = true;
      state.solutionOpen = true;
      state.feedback = {
        tone: "info",
        title: "Compare your reasoning",
        message: "Use the checklist and model solution to judge your own response. The site will not guess whether your wording matches a hidden phrase.",
        errorCategory: null
      };
      state.diagnostic = null;
      renderFeedback(state);
      renderDiagnostic(state);
      renderPanels(question, state);
      selfReview?.element?.scrollIntoView?.({ block: "nearest" });
      return state.feedback;
    }

    const result = question.check(state.response) ?? {};
    const tone = feedbackPresentation[result.tone] ? result.tone : "info";
    state.checked = true;
    state.feedback = {
      tone,
      title: result.title || feedbackPresentation[tone].fallbackTitle,
      message: result.message || "",
      errorCategory: result.errorCategory ?? null
    };
    if (state.scorePoint === null) state.scorePoint = tone === "correct" ? 1 : 0;
    const attemptBase = {
      setId: activeSet.id,
      questionId: question.id,
      responseType: question.responseType,
      response: state.response,
      templateId: question.templateId ?? null,
      generationSeed: question.generationSeed ?? null,
      metadata: question.metadata ?? null,
      tone,
      success: tone === "correct",
      errorCategory: state.feedback.errorCategory
    };
    state.diagnostic = attemptBase.success ? null : (resolveDiagnostic(attemptBase) ?? null);
    renderFeedback(state);
    renderDiagnostic(state);
    renderPanels(question, state);
    if (state.diagnostic) fields.diagnostic.scrollIntoView?.({ block: "nearest" });
    onAttempt(Object.freeze({ ...attemptBase, diagnostic: state.diagnostic }));
    return state.feedback;
  }

  function recordSelfReviewOutcome(outcome) {
    const question = currentQuestion();
    if (!question || !isAo3SelfReviewQuestion(question)) return null;
    const state = stateFor(question);
    if (!state.selfReviewOpen) return null;

    const secure = outcome === "secure";
    state.selfReviewOutcome = secure ? "secure" : "needs-review";
    state.checked = true;
    if (state.scorePoint === null) state.scorePoint = secure ? 1 : 0;
    state.selfReviewAttemptCount += 1;
    state.feedback = secure
      ? { tone: "correct", title: "Self-review complete", message: "You have checked your reasoning against the model and the success criteria.", errorCategory: null }
      : { tone: "warning", title: "Revise before moving on", message: "Use the points you selected to improve your response, then review it again.", errorCategory: null };

    const attemptBase = {
      setId: activeSet.id,
      questionId: question.id,
      responseType: question.responseType,
      response: state.response,
      templateId: question.templateId ?? null,
      generationSeed: question.generationSeed ?? null,
      metadata: question.metadata ?? null,
      tone: state.feedback.tone,
      success: secure,
      errorCategory: null,
      selfReviewed: true,
      selfReviewOutcome: state.selfReviewOutcome,
      selfReviewCriteria: [...state.selfReviewCriteria],
      selfReviewFocus: [...state.selfReviewFocus]
    };
    state.diagnostic = secure ? null : (resolveDiagnostic(attemptBase) ?? null);
    renderFeedback(state);
    renderDiagnostic(state);
    renderPanels(question, state);
    onAttempt(Object.freeze({ ...attemptBase, diagnostic: state.diagnostic }));
    return state.feedback;
  }

  function requestFreshQuestion(source = "manual-new-set") {
    const question = currentQuestion();
    if (!question || !activeSet) return null;
    saveCurrentResponse();
    const freshSet = onRequestFreshSet(Object.freeze({
      setId: activeSet.id,
      questionId: question.id,
      templateId: question.templateId ?? null,
      practiceBatch: activeSet.practiceBatch ?? null,
      source
    }));
    if (!freshSet) return null;
    loadSet(freshSet, { focus: true, resetIndex: true });
    return freshSet;
  }

  function moveNext() {
    const question = currentQuestion();
    if (!question) return;
    const state = stateFor(question);
    const selfReviewQuestion = isAo3SelfReviewQuestion(question);
    const canContinue = selfReviewQuestion ? state.selfReviewOutcome === "secure" : state.checked;
    if (!canContinue) return;

    saveCurrentResponse();
    const atEndOfSet = questionIndex >= activeSet.questions.length - 1;
    if (atEndOfSet) {
      completedSetKeys.add(setKey());
      renderSetSummary({ focus: true });
      return;
    }

    questionIndex = questionIndex + 1;
    setIndex.set(activeSet.id, questionIndex);
    render({ focus: true });
  }

  fields.input.addEventListener("input", () => {
    saveCurrentResponse();
    mathEntry.sync(fields.input.value);
  });
  fields.reasoning.addEventListener("input", saveCurrentResponse);
  fields.choiceGroup.addEventListener("change", saveCurrentResponse);
  fields.input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    checkCurrent();
  });
  fields.hintButton.addEventListener("click", () => {
    const question = currentQuestion();
    if (!question) return;
    const state = stateFor(question);
    state.hintsRevealed = nextHintRevealCount(question.hintSequence, state.hintsRevealed);
    renderHintPanel(question, state);
    if (state.hintsRevealed > 0) fields.hintPanel.scrollIntoView?.({ block: "nearest" });
  });
  fields.solutionButton.addEventListener("click", () => {
    const question = currentQuestion();
    if (!question) return;
    const state = stateFor(question);
    if (!state.checked) return;
    state.solutionOpen = !state.solutionOpen;
    renderPanels(question, state);
    if (state.solutionOpen) fields.solutionPanel.scrollIntoView?.({ block: "nearest" });
  });
  fields.checkButton.addEventListener("click", checkCurrent);
  fields.diagnosticLink.addEventListener("click", (event) => {
    const question = currentQuestion();
    if (!question) return;
    const diagnostic = stateFor(question).diagnostic;
    if (!diagnostic?.target) return;
    event.preventDefault();
    onDiagnosticNavigate(diagnostic.target, diagnostic);
  });
  fields.newButton.addEventListener("click", () => requestFreshQuestion("manual-new-set"));
  fields.nextButton.addEventListener("click", moveNext);
  fields.summaryNewSet.addEventListener("click", () => requestFreshQuestion("set-summary-new-set"));
  fields.summaryNextAo.addEventListener("click", () => {
    const choice = completionChoices.nextAo;
    if (choice) onRequestNextAo(choice, scoreActiveSet());
  });
  fields.summaryNextTopic.addEventListener("click", () => {
    const choice = completionChoices.nextTopic;
    if (choice) onRequestNextTopic(choice, scoreActiveSet());
  });

  return Object.freeze({
    loadSet,
    hide,
    checkCurrent,
    newQuestion: requestFreshQuestion,
    newSet: requestFreshQuestion,
    nextQuestion: moveNext,
    getActiveQuestionId: () => currentQuestion()?.id ?? null,
    getSnapshot: () => {
      const question = currentQuestion();
      if (!question || !activeSet) return null;
      const state = stateFor(question);
      return Object.freeze({
        setId: activeSet.id,
        questionIndex,
        questionId: question.id,
        templateId: question.templateId ?? null,
        generationSeed: question.generationSeed ?? null,
        metadata: question.metadata ?? null,
        responseType: question.responseType,
        response: state.response,
        checked: state.checked,
        feedback: state.feedback ? { ...state.feedback } : null,
        diagnostic: state.diagnostic ? { ...state.diagnostic } : null,
        hintOpen: state.hintsRevealed > 0,
        hintsRevealed: state.hintsRevealed,
        solutionOpen: state.solutionOpen,
        selfReviewOpen: state.selfReviewOpen,
        selfReviewCriteria: [...state.selfReviewCriteria],
        selfReviewFocus: [...state.selfReviewFocus],
        selfReviewOutcome: state.selfReviewOutcome,
        scorePoint: state.scorePoint,
        setComplete: completedSetKeys.has(setKey())
      });
    }
  });
}
