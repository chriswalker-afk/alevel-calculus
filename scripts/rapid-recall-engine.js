import { randomShuffle } from "./match-engine.js";

function freezeQuestion(question) {
  return Object.freeze({
    ...question,
    options: Object.freeze(question.options.map((option) => Object.freeze({ ...option })))
  });
}

export function buildRapidRecallDeck(items, {
  limit = 5,
  optionCount = 4,
  shuffle = randomShuffle
} = {}) {
  const candidates = items
    .filter((item) => item?.flashcard?.front && item?.flashcard?.back)
    .map((item) => ({
      id: `${item.id}:rapid`,
      itemId: item.id,
      prompt: item.flashcard.front,
      answer: item.flashcard.back,
      cue: item.flashcard.cue ?? "Recall the fact"
    }));
  if (candidates.length < 2) throw new Error("RapidRecallEngine requires at least two MemoryItems.");

  const selected = shuffle(candidates).slice(0, Math.min(limit, candidates.length));
  const answerPool = [...new Set(candidates.map((candidate) => candidate.answer))];
  return Object.freeze(selected.map((candidate) => {
    const distractors = shuffle(answerPool.filter((answer) => answer !== candidate.answer))
      .slice(0, Math.max(1, optionCount - 1));
    const optionValues = shuffle([candidate.answer, ...distractors]);
    return freezeQuestion({
      id: candidate.id,
      itemId: candidate.itemId,
      prompt: candidate.prompt,
      cue: candidate.cue,
      answer: candidate.answer,
      options: optionValues.map((label, index) => ({ id: `${candidate.id}:option:${index}`, label, correct: label === candidate.answer }))
    });
  }));
}

export function createRapidRecallEngine(container, {
  items = [],
  limit = 5,
  optionCount = 4,
  secondsPerItem = 12,
  shuffle = randomShuffle,
  setIntervalFn = (handler, delay) => globalThis.setInterval(handler, delay),
  clearIntervalFn = (handle) => globalThis.clearInterval(handle),
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!container) throw new Error("RapidRecallEngine requires a container.");
  const prompt = container.querySelector("[data-rapid-prompt]");
  const cue = container.querySelector("[data-rapid-cue]");
  const options = container.querySelector("[data-rapid-options]");
  const progress = container.querySelector("[data-rapid-progress]");
  const status = container.querySelector("[data-rapid-status]");
  const next = container.querySelector("[data-rapid-next]");
  const reset = container.querySelector("[data-rapid-reset]");
  const timerToggle = container.querySelector("[data-rapid-timer-toggle]");
  const timer = container.querySelector("[data-rapid-timer]");
  if ([prompt, cue, options, progress, status, next, reset, timerToggle, timer].some((node) => !node)) {
    throw new Error("RapidRecallEngine markup is incomplete.");
  }

  let deck = buildRapidRecallDeck(items, { limit, optionCount, shuffle });
  let index = 0;
  let answered = false;
  let completed = false;
  let incorrectAttempts = 0;
  let timeouts = 0;
  let timerEnabled = false;
  let timerRemaining = secondsPerItem;
  let timerHandle = null;

  const current = () => deck[index];

  function stopTimer() {
    if (timerHandle !== null) clearIntervalFn(timerHandle);
    timerHandle = null;
  }

  function renderTimer() {
    timerToggle.setAttribute("aria-pressed", timerEnabled ? "true" : "false");
    timerToggle.textContent = timerEnabled ? "Timer on" : "Timer off";
    timer.hidden = !timerEnabled;
    timer.textContent = timerEnabled ? `${timerRemaining}s` : "";
  }

  function tickTimer() {
    if (!timerEnabled || answered || completed) return;
    timerRemaining = Math.max(0, timerRemaining - 1);
    renderTimer();
    if (timerRemaining > 0) return;
    stopTimer();
    timeouts += 1;
    incorrectAttempts += 1;
    onAttempt({ engine: "rapid-recall", itemId: current().itemId, success: false, result: 0, timedOut: true, completed: false });
    status.textContent = "Time’s up. Keep going without rushing — choose the answer when you are ready.";
  }

  function startTimer() {
    stopTimer();
    timerRemaining = secondsPerItem;
    renderTimer();
    if (!timerEnabled || answered || completed) return;
    timerHandle = setIntervalFn(tickTimer, 1000);
  }

  function renderOptions() {
    options.replaceChildren();
    for (const option of current().options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-rapid-option";
      button.dataset.rapidOption = option.id;
      button.textContent = option.label;
      button.disabled = answered || completed;
      button.addEventListener("click", () => answer(option.id));
      options.append(button);
    }
  }

  function render() {
    const question = current();
    cue.textContent = question.cue;
    prompt.textContent = question.prompt;
    progress.textContent = `${index + 1} of ${deck.length}`;
    next.disabled = !answered || completed;
    next.textContent = index === deck.length - 1 ? "Finish round" : "Next";
    renderOptions();
    renderTimer();
  }

  function answer(optionId) {
    if (answered || completed) return false;
    const option = current().options.find((candidate) => candidate.id === optionId);
    if (!option) return false;
    const success = option.correct;
    onAttempt({ engine: "rapid-recall", itemId: current().itemId, success, result: success ? 1 : 0, timedOut: false, completed: false });
    if (!success) {
      incorrectAttempts += 1;
      status.textContent = "Not that one. Try again — accuracy matters more than speed.";
      return false;
    }
    answered = true;
    stopTimer();
    status.textContent = "Correct. Move on when you are ready.";
    render();
    return true;
  }

  function finishRound() {
    if (completed) return;
    completed = true;
    stopTimer();
    const misses = incorrectAttempts;
    const security = misses === 0 ? "secure" : misses <= 2 ? "developing" : "needs-review";
    onSecurity({ engine: "rapid-recall", security, incorrectAttempts, timeouts });
    onComplete({ engine: "rapid-recall", result: deck.length / (deck.length + misses) });
    status.textContent = misses === 0
      ? "Rapid recall complete — every item was correct first time."
      : "Rapid recall complete. Revisit any facts that needed another try.";
    renderTimer();
    next.disabled = true;
  }

  function advance() {
    if (!answered || completed) return;
    if (index === deck.length - 1) {
      finishRound();
      return;
    }
    index += 1;
    answered = false;
    status.textContent = "Choose the best answer.";
    render();
    startTimer();
  }

  function resetRound() {
    stopTimer();
    deck = buildRapidRecallDeck(items, { limit, optionCount, shuffle });
    index = 0;
    answered = false;
    completed = false;
    incorrectAttempts = 0;
    timeouts = 0;
    timerRemaining = secondsPerItem;
    status.textContent = "Choose the best answer.";
    render();
    startTimer();
  }

  function setTimerEnabled(enabled) {
    timerEnabled = Boolean(enabled);
    startTimer();
  }

  next.addEventListener("click", advance);
  reset.addEventListener("click", resetRound);
  timerToggle.addEventListener("click", () => setTimerEnabled(!timerEnabled));
  status.textContent = "Choose the best answer.";
  render();

  return Object.freeze({
    answer,
    advance,
    reset: resetRound,
    setTimerEnabled,
    tickTimer,
    getDeck: () => deck,
    getState: () => Object.freeze({ index, answered, completed, incorrectAttempts, timeouts, timerEnabled, timerRemaining })
  });
}
