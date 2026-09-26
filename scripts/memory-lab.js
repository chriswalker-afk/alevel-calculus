import { createLearnView } from "./learn-view.js";
import { createFlashcardEngine } from "./flashcard-engine.js";
import { createMatchEngine } from "./match-engine.js";
import { createBuildRuleEngine } from "./build-rule-engine.js";
import { createMissingPieceEngine } from "./missing-piece-engine.js";
import { createSortEngine } from "./sort-engine.js";
import { createImpostorEngine } from "./impostor-engine.js";
import { createRapidRecallEngine } from "./rapid-recall-engine.js";
import { createDiagramRecallEngine } from "./diagram-recall-engine.js";
import { createMemoryMixEngine } from "./memory-mix-engine.js";

export const memoryLabViews = Object.freeze(["learn", "flashcards", "games", "review"]);
export const memoryGameViews = Object.freeze(["match", "build", "missing-piece", "sort", "impostor"]);
export const step19GameViews = Object.freeze(["build", "missing-piece", "sort", "impostor"]);
export const memoryReviewModes = Object.freeze(["mix", "rapid", "diagram"]);

function aggregateStep19Security(gameSecurity, completedGames) {
  const values = step19GameViews.map((id) => gameSecurity.get(id)).filter(Boolean);
  if (!values.length) return null;
  if (values.includes("needs-review")) return "needs-review";
  if (step19GameViews.every((id) => completedGames.has(id) && gameSecurity.get(id) === "secure")) return "secure";
  return "developing";
}

export function createMemoryLab(element, {
  items = [],
  gamePack = null,
  reviewPack = null,
  gameActivityIds = {},
  onNavigate = () => {},
  onGameNavigate = null,
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {}
} = {}) {
  if (!element) throw new Error("MemoryLab requires a root element.");
  const viewButtons = Array.from(element.querySelectorAll("[data-memory-lab-view]"));
  const panels = Array.from(element.querySelectorAll("[data-memory-lab-panel]"));
  const summary = element.querySelector("[data-memory-lab-bank-summary]");
  const learnComplete = element.querySelector("[data-memory-learn-complete]");
  if (viewButtons.length !== memoryLabViews.length || panels.length !== memoryLabViews.length || !summary || !learnComplete) {
    throw new Error("MemoryLab markup is incomplete.");
  }

  const panelByView = new Map(panels.map((panel) => [panel.dataset.memoryLabPanel, panel]));
  const gamesPanel = panelByView.get("games");
  const gameButtons = Array.from(gamesPanel?.querySelectorAll("[data-memory-game]") ?? []);
  const gamePanels = Array.from(gamesPanel?.querySelectorAll("[data-memory-game-panel]") ?? []);
  if (gameButtons.length !== memoryGameViews.length || gamePanels.length !== memoryGameViews.length) {
    throw new Error("MemoryLab Games markup is incomplete.");
  }
  const gamePanelById = new Map(gamePanels.map((panel) => [panel.dataset.memoryGamePanel, panel]));

  const reviewPanel = panelByView.get("review");
  const reviewModeButtons = Array.from(reviewPanel?.querySelectorAll("[data-memory-review-mode]") ?? []);
  const reviewTaskPanels = Array.from(reviewPanel?.querySelectorAll("[data-memory-review-task-panel]") ?? []);
  const mixContainer = reviewPanel?.querySelector("[data-memory-mix]") ?? null;
  if (reviewModeButtons.length !== memoryReviewModes.length || !mixContainer || reviewTaskPanels.length < 5) {
    throw new Error("MemoryLab Review markup is incomplete.");
  }
  const reviewTaskPanelById = new Map(reviewTaskPanels.map((panel) => [panel.dataset.memoryReviewTaskPanel, panel]));

  if (!gamePack?.build || !gamePack?.missingPiece || !gamePack?.sort || !gamePack?.impostor) {
    throw new Error("MemoryLab requires declarative Step 19 game data.");
  }
  if (!reviewPack?.rapid || !reviewPack?.diagram || !reviewPack?.mix?.taskIds?.length) {
    throw new Error("MemoryLab requires declarative Step 20 review data.");
  }

  let activeView = "learn";
  let activeGame = "match";
  let activeReviewMode = "mix";
  let activeReviewTask = reviewPack.mix.taskIds[0];
  let activeActivityId = null;
  const completedGames = new Set();
  const gameSecurity = new Map();
  let step19CompletionReported = false;
  let memoryMix = null;

  const activityIdForGame = (gameId) => gameActivityIds[gameId] ?? activeActivityId;

  const learnView = createLearnView(panelByView.get("learn"), { items });
  const flashcards = createFlashcardEngine(panelByView.get("flashcards"), {
    items,
    onAttempt: (evidence) => onAttempt({ ...evidence, activityId: activeActivityId }),
    onSecurity: (evidence) => onSecurity({ ...evidence, activityId: activeActivityId }),
    onComplete: (evidence) => onComplete({ ...evidence, activityId: activeActivityId })
  });

  function reportMatchAttempt(evidence) {
    onAttempt({ ...evidence, gameId: "match", activityId: activityIdForGame("match") });
  }

  function reportMatchSecurity(evidence) {
    if (evidence.security) gameSecurity.set("match", evidence.security);
    onSecurity({ ...evidence, gameId: "match", activityId: activityIdForGame("match") });
  }

  function reportMatchComplete(evidence = {}) {
    completedGames.add("match");
    syncGameTabs();
    onComplete({ ...evidence, gameId: "match", activityId: activityIdForGame("match") });
  }

  function reportStep19Attempt(gameId, evidence) {
    onAttempt({ ...evidence, gameId, activityId: activityIdForGame(gameId) });
  }

  function reportStep19Security(gameId, evidence) {
    if (evidence.security) gameSecurity.set(gameId, evidence.security);
    const security = aggregateStep19Security(gameSecurity, completedGames);
    if (security) onSecurity({ engine: "memory-games", gameId, security, activityId: activityIdForGame(gameId) });
  }

  function reportStep19Complete(gameId, evidence = {}) {
    completedGames.add(gameId);
    syncGameTabs();
    const security = aggregateStep19Security(gameSecurity, completedGames);
    if (security) onSecurity({ engine: "memory-games", gameId, security, activityId: activityIdForGame(gameId) });
    if (step19GameViews.every((id) => completedGames.has(id)) && !step19CompletionReported) {
      step19CompletionReported = true;
      onComplete({ ...evidence, engine: "memory-games", activityId: activityIdForGame(gameId) });
    }
  }

  const match = createMatchEngine(gamePanelById.get("match"), {
    items,
    onAttempt: reportMatchAttempt,
    onSecurity: reportMatchSecurity,
    onComplete: reportMatchComplete
  });
  const build = createBuildRuleEngine(gamePanelById.get("build"), {
    definition: gamePack.build,
    onAttempt: (evidence) => reportStep19Attempt("build", evidence),
    onSecurity: (evidence) => reportStep19Security("build", evidence),
    onComplete: (evidence) => reportStep19Complete("build", evidence)
  });
  const missingPiece = createMissingPieceEngine(gamePanelById.get("missing-piece"), {
    definition: gamePack.missingPiece,
    onAttempt: (evidence) => reportStep19Attempt("missing-piece", evidence),
    onSecurity: (evidence) => reportStep19Security("missing-piece", evidence),
    onComplete: (evidence) => reportStep19Complete("missing-piece", evidence)
  });
  const sort = createSortEngine(gamePanelById.get("sort"), {
    definition: gamePack.sort,
    onAttempt: (evidence) => reportStep19Attempt("sort", evidence),
    onSecurity: (evidence) => reportStep19Security("sort", evidence),
    onComplete: (evidence) => reportStep19Complete("sort", evidence)
  });
  const impostor = createImpostorEngine(gamePanelById.get("impostor"), {
    definition: gamePack.impostor,
    onAttempt: (evidence) => reportStep19Attempt("impostor", evidence),
    onSecurity: (evidence) => reportStep19Security("impostor", evidence),
    onComplete: (evidence) => reportStep19Complete("impostor", evidence)
  });

  function reportReviewAttempt(taskId, evidence) {
    onAttempt({ ...evidence, reviewTaskId: taskId, activityId: activeActivityId });
  }

  function reportReviewSecurity(taskId, evidence) {
    if (!evidence.security) return;
    if (activeReviewMode === "mix" && memoryMix) {
      memoryMix.recordTaskSecurity(taskId, evidence.security);
      return;
    }
    onSecurity({ ...evidence, reviewTaskId: taskId, activityId: activeActivityId });
  }

  function reportReviewComplete(taskId, evidence = {}) {
    if (activeReviewMode === "mix" && memoryMix) memoryMix.recordTaskComplete(taskId);
  }

  const rapidRecall = createRapidRecallEngine(reviewTaskPanelById.get("rapid"), {
    items,
    limit: reviewPack.rapid.limit,
    optionCount: reviewPack.rapid.optionCount,
    secondsPerItem: reviewPack.rapid.secondsPerItem,
    onAttempt: (evidence) => reportReviewAttempt("rapid", evidence),
    onSecurity: (evidence) => reportReviewSecurity("rapid", evidence),
    onComplete: (evidence) => reportReviewComplete("rapid", evidence)
  });
  const diagramRecall = createDiagramRecallEngine(reviewTaskPanelById.get("diagram"), {
    definition: reviewPack.diagram,
    onAttempt: (evidence) => reportReviewAttempt("diagram", evidence),
    onSecurity: (evidence) => reportReviewSecurity("diagram", evidence),
    onComplete: (evidence) => reportReviewComplete("diagram", evidence)
  });
  const reviewBuild = createBuildRuleEngine(reviewTaskPanelById.get("build"), {
    definition: gamePack.build,
    onAttempt: (evidence) => reportReviewAttempt("build", evidence),
    onSecurity: (evidence) => reportReviewSecurity("build", evidence),
    onComplete: (evidence) => reportReviewComplete("build", evidence)
  });
  const reviewMissingPiece = createMissingPieceEngine(reviewTaskPanelById.get("missing-piece"), {
    definition: gamePack.missingPiece,
    onAttempt: (evidence) => reportReviewAttempt("missing-piece", evidence),
    onSecurity: (evidence) => reportReviewSecurity("missing-piece", evidence),
    onComplete: (evidence) => reportReviewComplete("missing-piece", evidence)
  });
  const reviewImpostor = createImpostorEngine(reviewTaskPanelById.get("impostor"), {
    definition: gamePack.impostor,
    onAttempt: (evidence) => reportReviewAttempt("impostor", evidence),
    onSecurity: (evidence) => reportReviewSecurity("impostor", evidence),
    onComplete: (evidence) => reportReviewComplete("impostor", evidence)
  });

  const reviewEngines = new Map([
    ["rapid", rapidRecall],
    ["diagram", diagramRecall],
    ["build", reviewBuild],
    ["missing-piece", reviewMissingPiece],
    ["impostor", reviewImpostor]
  ]);
  const reviewLabels = new Map([
    ["rapid", reviewPack.rapid.label],
    ["diagram", reviewPack.diagram.label],
    ["build", gamePack.build.label],
    ["missing-piece", gamePack.missingPiece.label],
    ["impostor", gamePack.impostor.label]
  ]);

  function activateReviewTask(taskId) {
    if (!reviewTaskPanelById.has(taskId)) throw new Error(`Unknown review task: ${taskId}`);
    activeReviewTask = taskId;
    for (const panel of reviewTaskPanels) panel.hidden = panel.dataset.memoryReviewTaskPanel !== taskId;
  }

  const mixTaskDefinitions = reviewPack.mix.taskIds.map((taskId) => {
    const engine = reviewEngines.get(taskId);
    if (!engine) throw new Error(`Memory Mix references an unavailable engine: ${taskId}`);
    return Object.freeze({ id: taskId, label: reviewLabels.get(taskId) ?? taskId, reset: engine.reset });
  });

  memoryMix = createMemoryMixEngine(mixContainer, {
    taskDefinitions: mixTaskDefinitions,
    length: mixTaskDefinitions.length,
    onActivateTask: activateReviewTask,
    onSecurity: (evidence) => onSecurity({ ...evidence, activityId: activeActivityId }),
    onComplete: (evidence) => onComplete({ ...evidence, activityId: activeActivityId })
  });

  summary.textContent = `${items.length} shared facts and vocabulary items · Learn, retrieve, play, then mix them in Review.`;

  function syncGameTabs({ focusActive = false } = {}) {
    for (const button of gameButtons) {
      const gameId = button.dataset.memoryGame;
      const selected = gameId === activeGame;
      const baseLabel = button.dataset.memoryGameLabel || button.textContent.replace(/^✓\s*/, "");
      button.dataset.memoryGameLabel = baseLabel;
      button.textContent = completedGames.has(gameId) ? `✓ ${baseLabel}` : baseLabel;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.setAttribute("tabindex", selected ? "0" : "-1");
      if (selected && focusActive) button.focus();
    }
    for (const panel of gamePanels) panel.hidden = panel.dataset.memoryGamePanel !== activeGame;
  }

  function syncReviewMode({ focusActive = false } = {}) {
    reviewPanel.dataset.reviewMode = activeReviewMode;
    for (const button of reviewModeButtons) {
      const selected = button.dataset.memoryReviewMode === activeReviewMode;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.setAttribute("tabindex", selected ? "0" : "-1");
      if (selected && focusActive) button.focus();
    }
    if (activeReviewMode === "mix") memoryMix.resume();
    else activateReviewTask(activeReviewMode);
  }

  function sync({ focusActive = false } = {}) {
    for (const button of viewButtons) {
      const selected = button.dataset.memoryLabView === activeView;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.setAttribute("tabindex", selected ? "0" : "-1");
      if (selected && focusActive) button.focus();
    }
    for (const panel of panels) panel.hidden = panel.dataset.memoryLabPanel !== activeView;
    if (activeView === "games") syncGameTabs();
    if (activeView === "review") syncReviewMode();
  }

  function show(view = "learn", {
    activityId = null,
    game = null,
    reviewMode = null,
    focusTab = false,
    focusGameTab = false,
    focusReviewTab = false
  } = {}) {
    if (!memoryLabViews.includes(view)) throw new Error(`Unknown MemoryLab view: ${view}`);
    activeView = view;
    activeActivityId = activityId;
    if (game) {
      if (!memoryGameViews.includes(game)) throw new Error(`Unknown MemoryLab game: ${game}`);
      activeGame = game;
    }
    if (reviewMode) {
      if (!memoryReviewModes.includes(reviewMode)) throw new Error(`Unknown MemoryLab review mode: ${reviewMode}`);
      activeReviewMode = reviewMode;
    }
    element.hidden = false;
    sync({ focusActive: focusTab });
    if (activeView === "games") syncGameTabs({ focusActive: focusGameTab });
    if (activeView === "review") syncReviewMode({ focusActive: focusReviewTab });
  }

  function hide() {
    element.hidden = true;
  }

  function moveFocus(fromButton, key) {
    const index = viewButtons.indexOf(fromButton);
    if (index < 0) return;
    let nextIndex = index;
    if (key === "ArrowRight") nextIndex = (index + 1) % viewButtons.length;
    if (key === "ArrowLeft") nextIndex = (index - 1 + viewButtons.length) % viewButtons.length;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = viewButtons.length - 1;
    if (nextIndex !== index || key === "Home" || key === "End") onNavigate(viewButtons[nextIndex].dataset.memoryLabView, { focusTab: true });
  }

  function selectGame(gameId, { focusTab = false, navigate = false } = {}) {
    if (!memoryGameViews.includes(gameId)) throw new Error(`Unknown MemoryLab game: ${gameId}`);
    if (navigate && typeof onGameNavigate === "function") {
      onGameNavigate(gameId, { focusGameTab: focusTab });
      return;
    }
    activeGame = gameId;
    syncGameTabs({ focusActive: focusTab });
  }

  function moveGameFocus(fromButton, key) {
    const index = gameButtons.indexOf(fromButton);
    if (index < 0) return;
    let nextIndex = index;
    if (key === "ArrowRight") nextIndex = (index + 1) % gameButtons.length;
    if (key === "ArrowLeft") nextIndex = (index - 1 + gameButtons.length) % gameButtons.length;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = gameButtons.length - 1;
    if (nextIndex !== index || key === "Home" || key === "End") selectGame(gameButtons[nextIndex].dataset.memoryGame, { focusTab: true, navigate: true });
  }

  function selectReviewMode(mode, { focusTab = false } = {}) {
    if (!memoryReviewModes.includes(mode)) throw new Error(`Unknown MemoryLab review mode: ${mode}`);
    activeReviewMode = mode;
    syncReviewMode({ focusActive: focusTab });
  }

  function moveReviewFocus(fromButton, key) {
    const index = reviewModeButtons.indexOf(fromButton);
    if (index < 0) return;
    let nextIndex = index;
    if (key === "ArrowRight") nextIndex = (index + 1) % reviewModeButtons.length;
    if (key === "ArrowLeft") nextIndex = (index - 1 + reviewModeButtons.length) % reviewModeButtons.length;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = reviewModeButtons.length - 1;
    if (nextIndex !== index || key === "Home" || key === "End") selectReviewMode(reviewModeButtons[nextIndex].dataset.memoryReviewMode, { focusTab: true });
  }

  learnComplete.addEventListener("click", () => {
    onComplete({ engine: "learn", activityId: activeActivityId });
    onNavigate("flashcards");
  });

  for (const button of viewButtons) {
    button.addEventListener("click", () => onNavigate(button.dataset.memoryLabView));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      moveFocus(button, event.key);
    });
  }

  for (const button of gameButtons) {
    button.addEventListener("click", () => selectGame(button.dataset.memoryGame, { navigate: true }));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      moveGameFocus(button, event.key);
    });
  }

  for (const button of reviewModeButtons) {
    button.addEventListener("click", () => selectReviewMode(button.dataset.memoryReviewMode));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      moveReviewFocus(button, event.key);
    });
  }

  sync();
  syncGameTabs();
  syncReviewMode();
  return Object.freeze({
    show,
    hide,
    selectGame,
    selectReviewMode,
    learnView,
    flashcards,
    match,
    build,
    missingPiece,
    sort,
    impostor,
    rapidRecall,
    diagramRecall,
    memoryMix,
    getState: () => Object.freeze({
      activeView,
      activeGame,
      activeReviewMode,
      activeReviewTask,
      activeActivityId,
      completedGames: Object.freeze([...completedGames]),
      gameSecurity: Object.freeze(Object.fromEntries(gameSecurity)),
      mix: memoryMix.getState()
    })
  });
}
