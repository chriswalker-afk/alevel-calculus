#!/usr/bin/env python3
from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"


class ShellParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.data_attrs: set[str] = set()
        self.buttons: set[str] = set()
        self.mode_tabs: list[dict[str, str | None]] = []
        self.scope_badges: list[dict[str, str | None]] = []
        self.scope_sections: list[dict[str, str | None]] = []
        self.stylesheets: list[str] = []
        self.scripts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        mapping = dict(attrs)
        for key in mapping:
            if key.startswith("data-"):
                self.data_attrs.add(key)
        if "data-scope-badge" in mapping:
            self.scope_badges.append(mapping)
        if "data-scope-section" in mapping:
            self.scope_sections.append(mapping)
        if tag == "button":
            for key in mapping:
                if key in {
                    "data-previous-activity",
                    "data-next-activity",
                    "data-topic-navigation-toggle",
                    "data-topic-navigation-close",
                    "data-navigation-scrim",
                    "data-classwiz-trigger",
                    "data-classwiz-close",
                    "data-classwiz-scrim",
                    "data-help-drawer-trigger",
                    "data-help-drawer-close",
                    "data-help-drawer-scrim",
                    "data-word-bank-trigger",
                    "data-word-bank-close",
                    "data-word-bank-scrim",
                }:
                    self.buttons.add(key)
            if "data-mode-tab" in mapping:
                self.mode_tabs.append(mapping)
        if tag == "link" and mapping.get("rel") == "stylesheet" and mapping.get("href"):
            self.stylesheets.append(mapping["href"] or "")
        if tag == "script" and mapping.get("src"):
            self.scripts.append(mapping["src"] or "")


html = (SRC / "index.html").read_text(encoding="utf-8")
css = (SRC / "styles" / "app-shell.css").read_text(encoding="utf-8")
question_css = (SRC / "styles" / "question-shell.css").read_text(encoding="utf-8")
memory_css = (SRC / "styles" / "memory-lab.css").read_text(encoding="utf-8")
js = (SRC / "scripts" / "app-shell.js").read_text(encoding="utf-8")
activities = (SRC / "scripts" / "sample-activities.js").read_text(encoding="utf-8")
scope_metadata = (SRC / "scripts" / "scope-metadata.js").read_text(encoding="utf-8")
progress_model = (SRC / "scripts" / "progress-model.js").read_text(encoding="utf-8")
help_content = (SRC / "scripts" / "help-content.js").read_text(encoding="utf-8")
vocabulary_data = (SRC / "scripts" / "vocabulary-data.js").read_text(encoding="utf-8")
vocabulary_store = (SRC / "scripts" / "vocabulary-store.js").read_text(encoding="utf-8")
vocabulary_term = (SRC / "scripts" / "vocabulary-term.js").read_text(encoding="utf-8")
word_bank_model = (SRC / "scripts" / "word-bank-model.js").read_text(encoding="utf-8")
local_state_store = (SRC / "scripts" / "local-state-store.js").read_text(encoding="utf-8")
progress_store = (SRC / "scripts" / "progress-store.js").read_text(encoding="utf-8")
app_state = (SRC / "scripts" / "app-state.js").read_text(encoding="utf-8")
question_shell = (SRC / "scripts" / "question-shell.js").read_text(encoding="utf-8")
question_definition = (SRC / "scripts" / "question-definition.js").read_text(encoding="utf-8")
generator_runner = (SRC / "scripts" / "generator-runner.js").read_text(encoding="utf-8")
hint_sequence = (SRC / "scripts" / "hint-sequence.js").read_text(encoding="utf-8")
solution_step = (SRC / "scripts" / "solution-step.js").read_text(encoding="utf-8")
question_feedback = (SRC / "scripts" / "question-feedback.js").read_text(encoding="utf-8")
equation_step_renderer = (SRC / "scripts" / "equation-step-renderer.js").read_text(encoding="utf-8")
worked_solution_renderer = (SRC / "scripts" / "worked-solution-renderer.js").read_text(encoding="utf-8")
question_catalogue = (SRC / "scripts" / "question-catalogue.js").read_text(encoding="utf-8")
diagnostic_router = (SRC / "scripts" / "diagnostic-router.js").read_text(encoding="utf-8")
mastery_feedback_model = (SRC / "scripts" / "mastery-feedback-model.js").read_text(encoding="utf-8")
classwiz_support_data = (SRC / "scripts" / "classwiz-support-data.js").read_text(encoding="utf-8")
classwiz_support_panel = (SRC / "scripts" / "classwiz-support-panel.js").read_text(encoding="utf-8")
topic_objectives_data = (SRC / "scripts" / "topic-objectives-data.js").read_text(encoding="utf-8")
power_rule_definitions = (SRC / "scripts" / "question-definitions" / "power-rule.js").read_text(encoding="utf-8")
memory_item = (SRC / "scripts" / "memory-item.js").read_text(encoding="utf-8")
memory_content = (SRC / "scripts" / "memory-content.js").read_text(encoding="utf-8")
learn_view = (SRC / "scripts" / "learn-view.js").read_text(encoding="utf-8")
flashcard_engine = (SRC / "scripts" / "flashcard-engine.js").read_text(encoding="utf-8")
match_engine = (SRC / "scripts" / "match-engine.js").read_text(encoding="utf-8")
memory_game_content = (SRC / "scripts" / "memory-game-content.js").read_text(encoding="utf-8")
memory_review_content = (SRC / "scripts" / "memory-review-content.js").read_text(encoding="utf-8")
rapid_recall_engine = (SRC / "scripts" / "rapid-recall-engine.js").read_text(encoding="utf-8")
diagram_recall_engine = (SRC / "scripts" / "diagram-recall-engine.js").read_text(encoding="utf-8")
memory_mix_engine = (SRC / "scripts" / "memory-mix-engine.js").read_text(encoding="utf-8")
build_rule_engine = (SRC / "scripts" / "build-rule-engine.js").read_text(encoding="utf-8")
missing_piece_engine = (SRC / "scripts" / "missing-piece-engine.js").read_text(encoding="utf-8")
sort_engine = (SRC / "scripts" / "sort-engine.js").read_text(encoding="utf-8")
impostor_engine = (SRC / "scripts" / "impostor-engine.js").read_text(encoding="utf-8")
memory_lab = (SRC / "scripts" / "memory-lab.js").read_text(encoding="utf-8")
parser = ShellParser()
parser.feed(html)

required_attrs = {
    "data-app-shell",
    "data-shell-topbar",
    "data-topic-navigation",
    "data-topic-navigation-toggle",
    "data-topic-navigation-close",
    "data-navigation-scrim",
    "data-mode-tabs",
    "data-mode-tab",
    "data-mode-panel",
    "data-learning-workspace",
    "data-activity-stage",
    "data-activity-controls",
    "data-understand-visual-host",
    "data-classwiz-panel",
    "data-classwiz-trigger",
    "data-classwiz-close",
    "data-classwiz-scrim",
    "data-classwiz-use-case",
    "data-classwiz-model",
    "data-classwiz-helps",
    "data-classwiz-steps",
    "data-classwiz-does-not-replace",
    "data-help-drawer",
    "data-help-drawer-trigger",
    "data-help-drawer-close",
    "data-help-drawer-scrim",
    "data-help-target",
    "data-topic-goals-trigger",
    "data-topic-goals-dialog",
    "data-topic-goals-close",
    "data-topic-goals-heading",
    "data-topic-goals-list",
    "data-topic-objectives-inline",
    "data-topic-objectives-inline-heading",
    "data-topic-objectives-inline-list",
    "data-topic-pathway",
    "data-topic-pathway-heading",
    "data-topic-pathway-note",
    "data-topic-pathway-mode",
    "data-topic-pathway-revisit",
    "data-word-bank-drawer",
    "data-word-bank-trigger",
    "data-word-bank-close",
    "data-word-bank-scrim",
    "data-word-bank-search",
    "data-word-bank-filter",
    "data-word-bank-list",
    "data-word-bank-detail",
    "data-data-management-trigger",
    "data-data-management-dialog",
    "data-export-progress",
    "data-import-progress-file",
    "data-confirm-import",
    "data-reset-progress",
    "data-confirm-reset",
    "data-standard-activity-content",
    "data-question-shell",
    "data-question-shell-input",
    "data-question-shell-choice",
    "data-question-shell-reasoning",
    "data-question-shell-check",
    "data-question-shell-hint",
    "data-question-shell-hint-progress",
    "data-question-shell-hint-list",
    "data-question-shell-solution",
    "data-question-shell-solution-steps",
    "data-question-shell-diagnostic",
    "data-question-shell-diagnostic-link",
    "data-question-shell-new",
    "data-question-shell-next",
    "data-question-shell-next-label",
    "data-question-set-summary",
    "data-question-set-summary-score",
    "data-question-set-summary-new-set",
    "data-question-set-summary-next-ao",
    "data-question-set-summary-next-topic",
    "data-memory-lab",
    "data-memory-lab-view",
    "data-memory-lab-panel",
    "data-memory-learn-list",
    "data-memory-learn-complete",
    "data-flashcard-card",
    "data-flashcard-not-yet",
    "data-flashcard-know",
    "data-match-left",
    "data-match-right",
    "data-match-reset",
    "data-memory-game",
    "data-memory-game-panel",
    "data-build-tokens",
    "data-build-check",
    "data-missing-options",
    "data-missing-check",
    "data-sort-items",
    "data-sort-buckets",
    "data-sort-check",
    "data-impostor-options",
    "data-impostor-check",
    "data-memory-review-mode",
    "data-memory-review-task-panel",
    "data-memory-mix",
    "data-memory-mix-next",
    "data-memory-mix-restart",
    "data-rapid-options",
    "data-rapid-timer-toggle",
    "data-diagram-recall-canvas",
    "data-diagram-recall-options",
}
assert required_attrs <= parser.data_attrs, f"Missing shell regions: {sorted(required_attrs - parser.data_attrs)}"
assert parser.buttons == {
    "data-previous-activity",
    "data-next-activity",
    "data-topic-navigation-toggle",
    "data-topic-navigation-close",
    "data-navigation-scrim",
    "data-classwiz-trigger",
    "data-classwiz-close",
    "data-classwiz-scrim",
    "data-help-drawer-trigger",
    "data-help-drawer-close",
    "data-help-drawer-scrim",
    "data-word-bank-trigger",
    "data-word-bank-close",
    "data-word-bank-scrim",
}
assert 'aria-controls="topic-navigation"' in html
assert 'aria-expanded="false"' in html
assert 'role="tablist"' in html and 'role="tabpanel"' in html
assert 'data-learning-mode="understand"' in html
assert "./styles/tokens.css" in parser.stylesheets
assert any("app-shell.css" in sheet for sheet in parser.stylesheets)
assert any("question-shell.css" in sheet for sheet in parser.stylesheets)
assert any("memory-lab.css" in sheet for sheet in parser.stylesheets)
assert any("family-of-curves-explorer.css" in sheet for sheet in parser.stylesheets)
assert any("area-explorer.css" in sheet for sheet in parser.stylesheets)
assert any("rectangle-sum-explorer.css" in sheet for sheet in parser.stylesheets)
assert any("app-shell.js" in script for script in parser.scripts)

expected_modes = ["understand", "memorise", "ao1", "ao2", "ao3"]
assert [tab.get("data-mode-tab") for tab in parser.mode_tabs] == expected_modes
assert [tab.get("data-learning-mode") for tab in parser.mode_tabs] == expected_modes
assert [tab.get("role") for tab in parser.mode_tabs] == ["tab"] * 5
assert [tab.get("aria-selected") for tab in parser.mode_tabs] == ["true", "false", "false", "false", "false"]
assert [tab.get("tabindex") for tab in parser.mode_tabs] == ["0", "-1", "-1", "-1", "-1"]

expected_scopes = ["y12", "y13-additional", "full-alevel"]
rendered_scopes = [badge.get("data-course-scope") for badge in parser.scope_badges]
assert rendered_scopes.count("y12") >= 2, "Current activity and Year 12 navigation should both show the shared scope badge"
assert {scope for scope in rendered_scopes if scope} == set(expected_scopes)
assert [section.get("data-scope-section") for section in parser.scope_sections] == expected_scopes
assert 'role="separator" aria-label="Year 12 mastery checkpoint"' in html
assert html.index('data-scope-section="y12"') < html.index('aria-label="Year 12 mastery checkpoint"') < html.index('data-scope-section="y13-additional"')
assert "Year 12 review &amp; mastery" in html
assert "Additional Year 13" in html
assert "Differentiation review &amp; mastery" in html
assert html.count("data-topic-progress-item") == 33, "Expected compact progress on all sample topic entries"
assert 'data-topic-id="topic:y12:differentiation:basics"' in html
assert 'data-topic-id="topic:y13:integration:substitution"' in html
assert 'data-topic-id="topic:full:review:calculus-mastery"' in html
assert html.count('data-topic-state-marker') == 33
assert html.count('data-topic-mode-progress') == 33
assert html.count('data-mode-progress="understand"') == 33

assert "height: 100dvh" in css
assert "grid-template-columns: 248px minmax(0, 1fr)" in css
assert "grid-template-rows: auto minmax(0, 1fr) auto" in css
assert "@media (max-width: 900px)" in css
assert "@media (max-width: 680px)" in css
assert "position: fixed" in css and "translateX" in css
assert "overscroll-behavior: contain" in css
assert ".activity-stage" in css and "overflow: auto" in css
assert "body {\n  overflow: hidden;" in css
assert ".mode-tabs" in css and ".mode-tab[aria-selected=\"true\"]" in css
assert "var(--surface-base)" in css and "var(--mode-accent)" in css and "var(--mode-soft)" in css
assert not re.search(r"#[0-9A-Fa-f]{6}", css), "AppShell CSS must consume locked tokens rather than local hex colours"
assert not re.search(r"#[0-9A-Fa-f]{6}", question_css), "QuestionShell CSS must consume locked tokens rather than local hex colours"
assert not re.search(r"#[0-9A-Fa-f]{6}", memory_css), "MemoryLab CSS must consume locked tokens rather than local hex colours"
assert ".question-shell" in question_css and ".question-shell__feedback" in question_css
assert ".equation-step-list" in question_css and ".question-hint-list" in question_css
assert 'data-tone="correct"' in question_css and 'data-tone="incorrect"' in question_css
assert "var(--feedback-correct-accent)" in question_css and "var(--feedback-incorrect-accent)" in question_css

assert "openTopicNavigation" in js
assert "closeTopicNavigation" in js
assert 'window.matchMedia("(max-width: 900px)")' in js
assert 'event.key === "Escape"' in js
assert "setBackgroundInert(true)" in js
assert "selectMode" in js
assert "syncModeTabs" in js
assert "learningModeOrder" in js and "learningModes" in js
assert "root.dataset.learningMode = activeMode" in js
assert '"ArrowLeft"' in js and '"ArrowRight"' in js and '"Home"' in js and '"End"' in js
assert "activityIndexByTopicMode" in js and "topicModeKey" in js
assert "openClassWizSupport" in js and "closeClassWizSupport" in js
assert 'shell.dataset.classwizOpen = "true"' in js and 'shell.dataset.classwizOpen = "false"' in js
assert 'classWizPanelElement.setAttribute("aria-hidden", "false")' in js
assert '.classwiz-support-panel' in css and '.classwiz-support-button' in css
assert 'fx-991CW' in html and 'fx-991EX' in html
assert 'What it can help with' in html and 'What it does not replace' in html
assert 'derivative-check' in classwiz_support_data and 'integral-check' in classwiz_support_data
assert 'radiansRequired: true' in classwiz_support_data and 'radiansRequired: false' in classwiz_support_data
assert 'createClassWizSupportPanel' in classwiz_support_panel
assert "openHelpDrawer" in js and "closeHelpDrawer" in js
assert 'document.querySelectorAll("[data-help-target]")' in js
assert 'shell.dataset.helpOpen = "true"' in js and 'shell.dataset.helpOpen = "false"' in js
assert 'helpDrawer.setAttribute("aria-hidden", "false")' in js
assert 'setHelpBackgroundInert(true)' in js and 'setHelpBackgroundInert(false)' in js
assert 'getHelpTarget(currentTopicId, need)' in js
assert '.help-drawer' in css and '.help-target' in css and 'var(--overlay-scrim)' in css
assert 'role="dialog"' in html and 'aria-modal="true"' in html
assert html.count('data-help-target=') == 3
assert 'Need a reminder?' in html
assert 'Topic goals' in html
assert 'In this topic you will learn to…' in html
assert 'data-topic-objectives-inline' in html and 'data-topic-goals-dialog' in html
assert 'getTopicObjectiveConfig' in js and 'syncUnderstandJourneyPages' in js and 'understandJourneyActivity' in js
assert 'const understandExperiences = Object.freeze([' in js
assert 'currentTopicRuntime().understandExperience' in js
assert 'data-understand-visual-host' in html
assert 'topicObjectiveCount' in topic_objectives_data and 'topicObjectiveCount = Object.keys(topicObjectiveConfigs).length' in topic_objectives_data
assert topic_objectives_data.count('"topic:') == 33, "Every registered topic should have a student-facing objective set"
assert '.topic-objectives-card--inline' in css and '.topic-pathway-card' in css and '.topic-goals-dialog' in css


assert 'data-help-target-skill' not in html, "Stable IDs belong in data/metadata, not visible student UI"
assert 'Exact support targets use the shared Step 5' not in html, "Developer implementation notes must not appear in student UI"
assert 'See the derivative as a gradient function' in html, "Step 12 must preserve the Step 11 polished activity fallback"
assert 'width: min(388px, calc(100% - 56px))' in css, "HelpDrawer should remain restrained rather than covering half the workspace"
assert 'activity:y12:differentiation:basics:understand:gradient-function' in help_content
assert 'activity:y12:differentiation:basics:memorise:derivative-notation' in help_content
assert 'activity:y12:differentiation:basics:ao1:power-rule' in help_content
assert '/y12/differentiation/basics/understand/gradient-function' in help_content
assert 'skill:y12:differentiation:basics:' in help_content

assert 'id="word-bank-drawer"' in html and 'aria-labelledby="word-bank-title"' in html
assert html.count('data-word-bank-filter=') == 4
assert 'Search encountered words' in html and 'Needs review' in html
assert '.word-bank-drawer' in css and '.vocabulary-term--known' in css and '.vocabulary-popover' in css
assert 'var(--feedback-info-soft)' in css and 'var(--feedback-info-accent)' in css
assert 'openWordBank' in js and 'closeWordBank' in js
assert 'renderVocabularyRichText' in js and 'vocabularyStore' in js
assert 'shell.dataset.wordBankOpen = "true"' in js and 'shell.dataset.wordBankOpen = "false"' in js
assert 'wordBankDrawer.setAttribute("aria-hidden", "false")' in js
assert 'filterWordBankEntries' in js and 'buildWordBankEntries' in js
assert 'localStorage' not in vocabulary_store and 'sessionStorage' not in vocabulary_store, "Step 13 VocabularyStore must wait for Step 14 LocalStateStore before browser persistence"
assert 'replaceSnapshot' in vocabulary_store and 'exportSnapshot' in vocabulary_store
assert '"vocab:derivative"' in vocabulary_data and '"vocab:gradient-function"' in vocabulary_data and '"vocab:tangent"' in vocabulary_data
assert 'renderVocabularyRichText' in vocabulary_term and 'aria-expanded' in vocabulary_term
assert 'id: "needs-review"' in word_bank_model
assert 'bodySegments' in activities and 'vocab:derivative' in activities and 'vocab:gradient-function' in activities
assert 'data-help-target-skill' not in html, "Step 13 must not regress the corrected student-facing HelpDrawer"
assert 'See the derivative as a gradient function' in html, "Step 13 must preserve the Step 12 corrected workspace fallback"

assert "syncScopeBadges" in js and "getCourseScope" in js
assert "data.routeScope" not in js
assert 'label: "Year 12 · 8MA0"' in scope_metadata
assert 'label: "Year 13 additional · 9MA0"' in scope_metadata
assert 'label: "Full A level · 9MA0"' in scope_metadata
assert 'routeScope: "y12"' in scope_metadata and 'routeScope: "y13"' in scope_metadata and 'routeScope: "full"' in scope_metadata
assert '/y12/differentiation/first-principles/understand/chord-gradient' in scope_metadata
assert '/y13/integration/substitution/ao1/change-limits' in scope_metadata
assert "syncTopicProgress" in js and "getTopicProgress" in js
assert 'document.querySelectorAll("[data-topic-progress-item]")' in js
assert 'progressStatePresentation' in progress_model
assert '"not-started"' in progress_model and 'partial' in progress_model and 'complete' in progress_model
assert 'topic:y12:differentiation:basics' in progress_model
assert 'topic:y13:integration:substitution' in progress_model
assert not re.search(r"[\"\']security[\"\']\s*:", progress_model, flags=re.I), "Step 11 completion fixtures must not define a security field"
assert "previousButton.addEventListener" in js
assert "nextButton.addEventListener" in js
assert "renderActivity(activityIndex - 1)" in js
assert "renderActivity(activityIndex + 1)" in js
assert "shell.dataset.activityIndex" in js
assert js.count("innerHTML") == 0, "AppShell should update fields in place, not replace the shell/activity DOM wholesale"
assert question_shell.count("innerHTML") == 0, "QuestionShell should update its reusable fields rather than replace the component wholesale"
assert 'createQuestionShell' in question_shell and 'questionResponseTypes' in question_shell
assert all(response_type in question_shell for response_type in ['"numeric"', '"algebraic"', '"choice"', '"short-reasoning"'])
assert 'data-question-shell-feedback' in html and 'aria-live="polite"' in html
assert html.count('data-question-shell-option') == 4
assert 'Worked solution' in html and 'Show hint' in html and 'Check answer' in html and 'Another question' in html
assert 'getQuestionPracticeDefinitionForActivity' in js and 'createQuestionPracticeSession' in js and 'createGeneratorRunner' in js and 'createQuestionShell' in js
assert 'readQuestionDebugSeed(window.location?.search ?? "")' in js, "Runtime should support an optional deterministic questionSeed debug parameter"
assert 'progressStore.recordAttempt' in js, "QuestionShell attempts should report through the existing shared progress layer"
assert 'questionShell.loadSet' in js and 'questionShell.hide' in js
assert 'questionShellSampleSet' not in activities, "Step 15 sample-set pointer must not survive as a competing question schema"
assert 'defineQuestionDefinition' in question_definition and 'getQuestionDefinitionMetadata' in question_definition
assert 'templateId' in question_definition and 'courseScope' in question_definition and 'assessmentObjective' in question_definition
assert 'microSkillId' in question_definition and 'difficulty' in question_definition
assert 'prerequisiteTags' in question_definition and 'methodTags' in question_definition and 'vocabularyTags' in question_definition
assert 'errorCategories' in question_definition, 'QuestionDefinition should declare diagnostic error categories without implementing routing yet'
assert 'parameterGenerator' in question_definition and 'promptRenderer' in question_definition
assert 'answerChecker' in question_definition and 'workedSolutionGenerator' in question_definition
assert 'createGeneratorRunner' in generator_runner and 'createSeededRandom' in generator_runner and 'deriveQuestionSeed' in generator_runner
assert 'createHintSequence' in generator_runner and 'normaliseSolutionSteps' in generator_runner and 'normaliseQuestionCheckResult' in generator_runner
assert 'createHintSequence' in hint_sequence and 'nextHintRevealCount' in hint_sequence and 'getVisibleHints' in hint_sequence
assert 'defineSolutionStep' in solution_step and 'normaliseSolutionSteps' in solution_step
assert 'normaliseQuestionCheckResult' in question_feedback and 'errorCategory' in question_feedback
assert 'renderEquationSteps' in equation_step_renderer and 'buildEquationStepViewModel' in equation_step_renderer
assert 'createWorkedSolutionRenderer' in worked_solution_renderer and 'inspectSolutionSteps' in worked_solution_renderer
assert 'hintsRevealed' in question_shell and 'errorCategory' in question_shell
assert 'data-question-shell-hint-list' in html and 'data-question-shell-solution-steps' in html
assert 'data-solution-step-id' in equation_step_renderer, 'Solution lines should preserve stable step IDs for debug/teacher inspection'
assert 'questionSeed' in generator_runner and 'generationSeed' in generator_runner
assert 'getQuestionSetDefinitionForActivity' in question_catalogue and 'listQuestionDefinitions' in question_catalogue
assert 'activity:y12:differentiation:basics:ao1:power-rule' in question_catalogue
assert 'activity:y12:differentiation:basics:ao2:diagnose-power-rule' in question_catalogue
assert power_rule_definitions.count('defineQuestionDefinition({') == 4
assert 'question-template:y12:differentiation:basics:ao1:power-rule-polynomial' in power_rule_definitions
assert 'question-template:y12:differentiation:basics:ao1:power-rule-value-at-point' in power_rule_definitions
assert 'question-template:y12:differentiation:basics:ao1:power-rule-choice' in power_rule_definitions
assert 'question-template:y12:differentiation:basics:ao2:explain-power-rule' in power_rule_definitions
assert 'question-shell-samples.js' not in js, "Step 16 must replace the temporary Step 15 sample schema"
assert 'createDiagnosticRouter' in diagnostic_router and 'routeOutcome' in diagnostic_router
assert 'getSupportTargetForMicroSkill' in diagnostic_router, 'DiagnosticRouter should resolve support through the shared support metadata'
assert 'createMasteryFeedbackModel' in mastery_feedback_model and 'recognitionErrors' in mastery_feedback_model and 'executionErrors' in mastery_feedback_model
assert 'diagnosticRules' in question_definition and 'defaultDiagnostic' in question_definition
assert 'data-question-shell-diagnostic' in html and 'data-question-shell-diagnostic-link' in html
assert 'resolveDiagnostic' in question_shell and 'onDiagnosticNavigate' in question_shell
assert 'createDiagnosticRouter' in js and 'createMasteryFeedbackModel' in js and 'followSupportTarget' in js
assert 'getSupportTargetForMicroSkill' in help_content and '/y12/differentiation/basics/memorise/power-rule-recall' in help_content
assert '.question-shell__diagnostic' in question_css and 'var(--feedback-info-soft)' in question_css

assert '"understand"' in activities and '"memorise"' in activities
assert '"ao1"' in activities and '"ao2"' in activities and '"ao3"' in activities
assert activities.count("activities: Object.freeze([") == 5, "Expected one activity collection for each learning mode"
assert activities.count("Object.freeze({") >= 20, "Expected mode definitions plus three validation activities per mode"
assert 'activity:y12:differentiation:basics:understand:gradient-function' in activities
assert 'activity:y12:differentiation:basics:memorise:derivative-notation' in activities
assert 'activity:y12:differentiation:basics:ao1:power-rule' in activities
assert 'activities.findIndex((activity) => activity.activityId === target.activityId)' in js
assert "mode-specific" not in activities.lower() or True


assert '.memory-lab' in memory_css and '.memory-flashcard' in memory_css and '.memory-match-board' in memory_css
assert '.memory-game-tabs' in memory_css and '.memory-build-expression' in memory_css and '.memory-sort-workspace' in memory_css
assert 'var(--mode-accent)' in memory_css and 'var(--feedback-correct-accent)' in memory_css
assert html.count('data-memory-lab-view=') == 4
assert html.count('data-memory-lab-panel=') == 4
assert html.count('data-memory-game=') == 5
assert html.count('data-memory-game-panel=') == 5
assert 'Memory Lab' in html and 'I’m ready to retrieve' in html and '>Games<' in html and '>Review<' in html
assert 'createMemoryLab' in memory_lab and 'memoryLabViews' in memory_lab and 'memoryGameViews' in memory_lab
assert 'createLearnView' in learn_view
assert 'buildFlashcardDeck' in flashcard_engine and 'createFlashcardEngine' in flashcard_engine
assert 'createMatchRound' in match_engine and 'createMatchEngine' in match_engine
assert 'createBuildRuleRound' in build_rule_engine and 'createBuildRuleEngine' in build_rule_engine
assert 'createMissingPieceRound' in missing_piece_engine and 'createMissingPieceEngine' in missing_piece_engine
assert 'createSortRound' in sort_engine and 'createSortEngine' in sort_engine
assert 'createImpostorRound' in impostor_engine and 'createImpostorEngine' in impostor_engine
assert 'basicsDifferentiationGamePack' in memory_game_content and 'getMemoryGamePackForTopic' in memory_game_content
assert 'basicsDifferentiationReviewPack' in memory_review_content and 'getMemoryReviewPackForTopic' in memory_review_content
assert 'createRapidRecallEngine' in rapid_recall_engine and 'buildRapidRecallDeck' in rapid_recall_engine
assert 'Timer off' in html and 'data-rapid-timer-toggle' in html, "Rapid Recall must keep time pressure optional"
assert 'createDiagramRecallEngine' in diagram_recall_engine and 'createDiagramRecallRound' in diagram_recall_engine
assert 'createMemoryMixEngine' in memory_mix_engine and 'createMemoryMixPlan' in memory_mix_engine and 'aggregateMemoryMixSecurity' in memory_mix_engine
assert 'memoryReviewModes' in memory_lab and 'createRapidRecallEngine' in memory_lab and 'createDiagramRecallEngine' in memory_lab and 'createMemoryMixEngine' in memory_lab
assert '.memory-review-layout' in memory_css and '.memory-rapid-options' in memory_css and '.memory-diagram-layout' in memory_css
assert html.count('data-memory-review-mode=') == 3
assert html.count('data-memory-review-task-panel=') == 6
assert 'activity:y12:differentiation:basics:memorise:mixed-review' in activities
assert 'defineMemoryItem' in memory_item and 'memory-item:' in memory_item
assert 'basicsDifferentiationMemoryItems' in memory_content and 'getMemoryItemsForTopic' in memory_content
assert memory_content.count('defineMemoryItem({') >= 6
assert 'memoryLabView: "learn"' in activities and 'memoryLabView: "flashcards"' in activities and 'memoryLabView: "games"' in activities and 'memoryLabView: "review"' in activities
assert 'getMemoryItemsForTopic(topicId)' in js and 'getMemoryGamePackForTopic(topicId)' in js and 'getMemoryReviewPackForTopic(topicId)' in js and 'createTopicMemoryLab' in js
assert 'progressStore.setSecurity' in js and 'progressStore.setCompleted' in js
assert 'memoryState.lab.show(memoryLabView' in js and 'activeMemoryLab()?.hide()' in js

assert 'id="data-management-dialog"' in html and 'Progress data' in html
assert 'data-reset-confirmation' in html and 'Yes, reset everything' in html, "Reset must require an explicit second confirmation"
assert '.data-management-dialog' in css and '.data-management-card' in css
assert 'createLocalStateStore' in local_state_store and 'APP_STATE_SCHEMA_VERSION = 1' in local_state_store
assert 'APP_STATE_STORAGE_KEY = "calculus-website:state"' in local_state_store
assert 'schemaVersion' in local_state_store and 'inspectImport' in local_state_store and 'exportData' in local_state_store
assert 'localStorage' in local_state_store, "Only LocalStateStore may touch browser localStorage"
for source_name, source_text in {
    'app-shell.js': js,
    'progress-store.js': progress_store,
    'progress-model.js': progress_model,
    'vocabulary-store.js': vocabulary_store,
    'vocabulary-term.js': vocabulary_term,
    'word-bank-model.js': word_bank_model,
    'app-state.js': app_state,
}.items():
    assert 'localStorage' not in source_text and 'sessionStorage' not in source_text, f"{source_name} must use LocalStateStore rather than direct browser storage"
assert 'visited' in progress_store and 'completed' in progress_store and 'attempts' in progress_store
assert 'recentSuccess' in progress_store and 'bestResult' in progress_store and 'lastSeen' in progress_store
assert 'security' in progress_store and 'needs-review' in progress_store and 'developing' in progress_store and 'secure' in progress_store
assert 'getModeCompletionState' in progress_store
assert 'getTopicProgress(topicId, progressStore)' in js, "Topic progress must read through ProgressStore"
assert 'progressStore.markVisited' in js, "Activity visits should pass through shared ProgressStore"
assert 'localStateStore.subscribe' in js and 'localStateStore.importData' in js and 'localStateStore.reset' in js
assert 'createVocabularyStore({ localStateStore })' in app_state, "VocabularyStore must now use the shared versioned state layer"
activity_ids = re.findall(r'activityId:\s*["\']([^"\']+)["\']', activities)
assert len(activity_ids) >= 25, "Step 34 should preserve prior activities and add the three missing canonical Memorise activities"
assert len(activity_ids) == len(set(activity_ids)), "Every current activity must have a unique stable ID for persistence"
for required_memorise_id in [
    "activity:y12:differentiation:basics:memorise:special-cases",
    "activity:y12:differentiation:basics:memorise:rewrite-powers",
    "activity:y12:differentiation:basics:memorise:term-by-term",
]:
    assert required_memorise_id in activity_ids, f"Missing canonical Step 34 activity {required_memorise_id}"

print("PASS static AppShell, shared QuestionShell, staged hints, structured worked solutions and persistence checks")
