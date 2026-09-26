# Calculus Website runtime scaffold

This source tree began at implementation Step 7. It remains a small dependency-free static build so the shared shell and learning-mode system can be inspected and tested before later steps decide whether any framework is actually needed.

## Commands

```bash
python3 tools/build_static.py
./tests/run_tests.sh
```

The built site is written to `dist/`.

## Implemented through Step 27

- fixed `AppShell` frame;
- compact top bar with course context;
- persistent topic-navigation region on wide screens;
- one responsive topic-navigation drawer below 901px, with scrim, Escape close and focus return;
- fixed single-screen browser shell at desktop, tablet and phone sizes;
- internal activity-panel scrolling on narrow screens when content genuinely needs more height;
- canonical `ModeTabs` for Understand, Memorise, AO1, AO2 and AO3;
- stable icon + label + colour identity for every learning mode using the locked design-token aliases;
- accessible tab semantics with roving tab stop and ArrowLeft/ArrowRight/Home/End keyboard switching;
- mode-scoped sample activity state so switching away and back restores that mode's previous activity position;
- shared `ScopeBadge` treatment for `Year 12 / 8MA0`, `Year 13 additional / 9MA0` and `Full A level / 9MA0`;
- scope labels are driven by one `scope-metadata.js` source rather than copied into topic files;
- a visible Year 12 review/mastery checkpoint separates 8MA0 from additional Year 13 / 9MA0 content in the topic-navigation structure;
- compact topic completion markers and per-topic mode progress using shared not-started / partial / complete selectors;
- progress state is symbol + shape + neutral token treatment rather than colour-only, and navigation does not foreground percentages;
- one reusable `Need a reminder?` HelpDrawer with exact Understand / Memorise / AO1 support targets, focus return, Escape/scrim close and background inert handling;
- one reusable `VocabularyTerm` treatment with automatic encounter collection, first-encounter `NEW` treatment and later subtle definition bubbles available by hover, tap/click and keyboard focus;
- one state-preserving `WordBankDrawer` with search, Year 12 / Year 13 / Needs review filters and term detail;
- versioned `LocalStateStore` browser persistence shared by `ProgressStore` and `VocabularyStore`;
- persistent progress fields for visited, completed, attempts, recent success, best result, last seen and separate security state;
- progress-data export/import/reset controls with explicit reset confirmation;
- the full-A-level mixed review area has its own separate scope identity;
- central activity workspace and persistent Previous/Next controls;
- in-place mode/activity switching without replacing shell DOM or topic context;
- locked Step 4 design-token import;
- reduced-motion-safe drawer and mode transitions.
- one shared `DiagramPrimitives` SVG/HTML layer for axes, grids, labels, curves, lines/tangents, arrows, shaded regions, fixed/draggable points, handles, tooltips, sliders and responsive sizing;
- draggable diagram handles use one Pointer Events path for mouse/pen/touch plus keyboard arrow movement and accessible value text;
- a separate `diagram-primitives-demo.html` validation page composes the primitives while keeping mathematical/domain state outside the low-level renderer.
- one shared `QuestionShell` for AO1/AO2/AO3/review/mastery question presentation, with configurable numeric, algebraic, multiple-choice and short-reasoning response surfaces;
- in-place answer checking with universal feedback, basic hint access, basic worked-solution reveal and next-question behaviour;
- QuestionShell response/check/reveal state survives HelpDrawer and WordBankDrawer overlays and mode/activity navigation;
- QuestionShell reports attempts through the existing `ProgressStore` callback boundary rather than accessing persistence directly.
- canonical `QuestionDefinition` metadata/behaviour contract with stable template IDs, scope/topic/AO/micro-skill/difficulty and prerequisite/method/vocabulary tags;
- shared `GeneratorRunner` with constrained parameter generation, same-parameter prompt/check/solution derivation, and optional deterministic `?questionSeed=...` debug reproduction;
- generated power-rule validation definitions consumed by the same `QuestionShell`, with the temporary Step 15 sample schema retired;
- shared staged `HintSequence`, structured immutable `SolutionStep` rows, `EquationStepRenderer` / `WorkedSolutionRenderer`, and validated error-category feedback hooks;
- the same generated question objects can be assembled into mixed sets without a second mastery question bank.
- one shared `MemoryLab` workspace in Memorise mode with compact Learn, one-card Flashcards and reusable Match views;
- one canonical immutable `MemoryItem` bank feeds Learn, Flashcards and Match rather than duplicating facts inside each engine;
- flashcards support configured forward/reverse retrieval plus explicit `Not yet` / `Know it` evidence;
- Match uses button-based pair selection so the same activity works by pointer, touch and keyboard;
- Memory Lab completion/security evidence flows through the existing `ProgressStore` callback boundary rather than direct storage access.
- reusable Build the Rule, Missing Piece, Sort and Spot the Impostor engines run from declarative Step 19 game data without drag-only interaction;
- the complete `Learn | Flashcards | Games | Review` Memory Lab structure, including untimed-by-default Rapid Recall, accessible declarative Diagram Recall and a Memory Mix orchestrator that reuses existing engines;
- one shared `DiagnosticRouter` that converts normalized question outcome metadata into exact existing Understand / Memorise / AO1 support targets, distinguishing recognition/recall from method execution;
- one shared `MasteryFeedbackModel` that aggregates tagged outcomes into strengths and micro-skill weaknesses without turning mastery into a percentage score or duplicating `ProgressStore.security`;
- one shared optional `ClassWizSupportPanel` with declarative numerical derivative/integral checks, fx-991CW/fx-991EX model-specific steps, conditional RADIAN reminders and explicit “does not replace” guidance;

## Responsive contract

- **Wide / landscape tablet (`>900px`)**: persistent left topic navigation and two-column mathematical activity where space permits.
- **Tablet (`<=900px`)**: topic list moves into the same overlay drawer; the learning workspace gets the full width. Mode tabs remain in the workspace header.
- **Narrow (`<=680px`)**: the workspace header stacks, mode tabs remain visible as one compact five-item strip, activity content stacks, mathematics remains readable, and overflow is contained inside the activity stage rather than the browser page.

There is no separate mobile or tablet shell and no AO-specific shell.

## ModeTabs contract

The active mode is stored on the document root as `data-learning-mode` and therefore drives the shared semantic aliases such as `--mode-accent` and `--mode-soft`. Each tab also carries its own `data-learning-mode`, allowing its icon/hover identity to retain the correct mode colour even when another mode is active.

`Previous` / `Next` move only inside the current mode. Each mode keeps its own sample activity index so switching modes does not destroy the student's place. Actual question/answer state will be owned by later activity engines rather than added ad hoc to `ModeTabs`.

## Course-scope contract

`ScopeBadge` reads from `src/scripts/scope-metadata.js`. Visual scope IDs are `y12`, `y13-additional` and `full-alevel`; their canonical route segments remain `y12`, `y13` and `full`, matching the Step 5 routing convention. Scope colours are neutral and independent from the active learning-mode accent.

The topic navigation now contains a structural Year 12 mastery checkpoint before additional Year 13 calculus. This is a curriculum boundary only: Step 10 does not infer completion, security or route state.

## Deferred intentionally

- shared mathematical diagram systems;
- full runtime route resolution (the Step 5 metadata contract exists, but routing itself has not yet been implemented).

## Step 11 compact progress contract

Topic navigation now consumes one shared read-only progress selector in `src/scripts/progress-model.js`. The selector derives each topic's overall `not-started`, `partial` or `complete` state from explicit per-mode completion states. The visible navigation uses neutral progress tokens and non-colour symbols (`○`, `◐`, `✓`); it does not use learning-mode colour to imply completion and it does not display percentages.

Each topic entry also shows a compact mode strip in the stable order Understand / Memorise / AO1 / AO2 / AO3. Modes that do not apply to a topic are omitted rather than treated as incomplete. The accessible progress description names every enabled mode and its state.

From Step 14 onward, the selector reads completion state from `ProgressStore`. Visits alone do not create visible completion progress; a meaningful attempt can produce `partial`, and explicit completion produces `complete`. Security remains a separate stored field and is not inferred from page visits or completion.
## Step 12 HelpDrawer

The activity header now exposes one shared `Need a reminder?` trigger. It opens a right-side `HelpDrawer` over the current workspace without re-rendering the activity. Opening and closing the drawer changes only overlay state, so the current mode/activity index, answer-like DOM state, slider-like values, selected-point state and question-state fixtures remain unchanged. Background shell regions are made inert while the drawer is open; focus moves to Close and returns to the trigger. Escape and the scrim also close it.

Support content is declarative in `src/scripts/help-content.js`. The current Basics sample uses three exact Step 5 targets: gradient-function Understand support, derivative-notation Memorise support and power-rule AO1 support. Each target carries a stable `activity:...` ID, a `skill:...` micro-skill ID and a canonical human-readable route. The HelpDrawer resolves a target by stable `activityId` to an activity that actually exists in `sample-activities.js`; unresolved placeholder links are not allowed. Runtime URL dispatch remains deferred, so the canonical `href` is present while current clicks are handled in-app.



### Step 12 visual-fidelity correction

The HelpDrawer is additive to the Step 11 presentation. The closed state preserves the polished derivative/gradient-function sample, topic navigation, mode tabs and workspace geometry; the only new closed-state element is the restrained `Need a reminder?` trigger. The drawer itself is deliberately narrow, student-facing and free of visible implementation IDs or developer commentary. Stable activity/micro-skill IDs remain internal metadata only.

Standalone previews must be self-contained (or otherwise explicitly verified from their delivered link) so CSS/JS failures cannot make a later-step preview appear to regress to fallback markup.


## Step 13 Word Bank and VocabularyTerm

Tagged vocabulary now flows through one shared path. `sample-activities.js` supplies declarative rich-text segments containing stable vocabulary IDs; `vocabulary-term.js` renders those terms and records encounters through `VocabularyStore`. First encounters remain visually close to ordinary prose with a small `NEW` marker. Later encounters use a restrained rounded bubble. Definitions are available by hover, tap/click and keyboard focus, so hover is never required.

The top-of-activity Word Bank trigger opens `WordBankDrawer` over the current activity without changing the active mode or activity index. It supports search and `All | Year 12 | Year 13 | Needs review` filters. Detail shows definition, notation/representation, first encounter and related topics. `Needs review` is explicitly student-controlled vocabulary state and is not calculus security/mastery.

`VocabularyStore` now persists through the same versioned `LocalStateStore` as progress. Topic and vocabulary UI code still never touches browser storage directly. Vocabulary encounter/review state therefore survives refresh and participates in the same export/import/reset file as calculus progress.


## Step 14 Local progress/security persistence

`src/scripts/local-state-store.js` is the only low-level browser-storage owner. It stores one versioned envelope under `calculus-website:state`, validates imports against the current schema version, and provides one export/import/reset boundary for both progress and vocabulary. Unknown future schema versions are rejected rather than guessed. If browser storage is unavailable, the app continues in memory and reports that status in the data panel.

`ProgressStore` owns activity records keyed by stable `activity:...` IDs. Each record can store `visited`, `completed`, `attempts`, bounded `recentSuccess`, `bestResult`, `lastSeen`, and a separate `security` value (`needs-review | developing | secure | null`). Completion and security never overwrite or imply one another. Opening an activity records a visit and last-seen time, but a visit alone does not become partial/complete progress.

The TopicNavigation progress selector now reads through `ProgressStore`; `VocabularyStore` uses the same local state layer. The compact **Data** control in topic navigation opens a native modal with export, import preview/confirmation and a two-step reset. Reset persists an empty state so a later refresh does not silently restore the original validation seed.

## Step 15 Shared QuestionShell

`src/scripts/question-shell.js` owns one reusable question interaction shell. The shell contains the prompt, response area, check action, nearby feedback, basic hint access, basic worked-solution reveal and next-question control. It supports the four Step 15 validation response types: `numeric`, `algebraic`, `choice` and `short-reasoning`. AO1, AO2, AO3, review and mastery must configure this same shell rather than create separate question interfaces.

The temporary Step 15 `question-shell-samples.js` validation pack was retired in Step 16 so it cannot become a competing question schema. The same four response surfaces are now exercised by generated `QuestionDefinition` objects and the shared `GeneratorRunner`.

Feedback remains directly beside the student's response and uses the universal correct/incorrect/warning/info identities rather than the active mode colour. Empty responses do not create attempts. When a genuine check occurs, `QuestionShell` emits an attempt callback and `app-shell.js` records it through the already implemented `ProgressStore`; the shell never calls browser storage directly and does not automatically infer completion or security.

Step 15 originally introduced one simple hint reveal and one in-place worked-solution reveal. Step 17 now extends the same shell with progressive `HintSequence`, line-by-line structured solutions and validated error-category feedback. Opening Help or Word Bank, moving to another mode/activity and returning preserves the real QuestionShell response and staged reveal state rather than substituting test-only state fixtures.



## Step 16 QuestionDefinition and GeneratorRunner

`src/scripts/question-definition.js` defines the canonical question-template contract. Every registered definition carries a stable `question-template:...` ID plus course scope, topic, assessment objective, micro-skill, difficulty, prerequisite tags, method tags and vocabulary tags. A definition also supplies the parameter generator, prompt renderer, answer checker and worked-solution generator; optional hint-sequence and diagram metadata remain on the same object rather than creating parallel schemas.

`src/scripts/generator-runner.js` executes those definitions. It gives the parameter generator a small seeded random API, freezes the generated parameter object, and derives prompt, checking logic and worked solution from that same object. This removes the risk of a generated prompt and solution drifting apart. The runtime accepts an optional `?questionSeed=...` query parameter so a problematic question can be reproduced exactly; ordinary sessions use a runtime seed and cache the generated set for the current activity so student state is not regenerated when navigating away and back.

The Step 16 validation catalogue contains three AO1 power-rule definitions (algebraic, numeric and choice) plus one AO2 short-reasoning definition. Parameter ranges are deliberately small and exact-friendly. Automated QA runs a 240-question algebraic batch, checks boundary coverage and verifies that each generated checker accepts the derivative implied by its own parameter object. A mixed-consumer contract test combines the existing AO1 and AO2 definitions through the same runner, proving that later mastery can consume the same question definitions rather than maintaining a second bank.

`QuestionShell` receives generated question objects and forwards their template ID, generation seed, metadata and normalized error-category evidence with attempts. It still owns presentation/state only; Step 17 supplies progressive hints and structured `SolutionStep` rendering through shared feedback modules rather than a second question UI.


## Step 17 Shared staged feedback system

`src/scripts/hint-sequence.js` owns ordered progressive hint behavior. Generated hints are immutable and reveal one additional stage at a time so a small prompt is not skipped in favor of a more revealing one. The same state is stored by `QuestionShell`, so Help/Word Bank overlays and navigation away/back preserve how far the student had progressed through the hints.

`src/scripts/solution-step.js` defines the canonical immutable solution row. `workedSolutionGenerator(parameters)` returns structured rows with stable IDs, a step kind, optional label, mathematical expression and/or explanation. `src/scripts/equation-step-renderer.js` renders those rows in order, while `src/scripts/worked-solution-renderer.js` composes that renderer for question solutions and exposes the same normalized rows for teacher/debug inspection. There is no second debug solution generator.

`src/scripts/question-feedback.js` normalizes checker results. Each `QuestionDefinition` declares allowed `errorCategories`; a checker may emit one of those categories for recognizable wrong-answer patterns, and `GeneratorRunner` rejects undeclared categories. `QuestionShell` keeps the category internal, displays only student-facing feedback text and forwards the category through its attempt callback. From Step 21, `DiagnosticRouter` converts that normalized evidence into exact point-of-need support without exposing raw category IDs.

The full worked solution unlocks only after a genuine checked attempt. At narrow widths, opening hints or the solution may scroll the existing internal activity/question region into view; it does not navigate away, shrink mathematics or introduce browser-page scrolling.
## Step 18 Memory Lab core

`src/scripts/memory-item.js` defines the canonical immutable memorisation-content shape. The current Basics of Differentiation bank in `memory-content.js` contains the planned power rule, constant and linear derivatives, derivative notation, the `d/dx` operator, reciprocal/root rewrites and term-by-term differentiation. `LearnView`, `FlashcardEngine` and `MatchEngine` project from those same items; none owns a copied topic fact bank.

`MemoryLab` is the one Memorise workspace. The existing stable Memorise activities map to Learn, Flashcards and Match, so global Previous/Next controls, exact HelpDrawer targets and progress IDs remain intact. Learn completion is explicit through `I'm ready to retrieve`; merely opening the summary does not count as completion. Flashcards present one dominant object at a time and can create reverse-direction cards where the content permits. `Not yet` / `Know it` evidence is reported through callbacks; self-rating cannot jump directly to `secure`. Match uses two columns of buttons rather than drag-only interaction and therefore remains usable by keyboard, pointer and touch. A perfect completed match round may report `secure`; a round completed with mistakes reports `developing`. Completion and security remain separate fields.

All Memory Lab engines are presentation/domain modules only. They do not access `localStorage`; `app-shell.js` forwards their evidence to the existing `ProgressStore`. Memory Lab state survives switching away from Memorise and returning. Steps 19-20 extend this same workspace with reusable Games and Review rather than introducing topic-specific game UIs.
## Step 19 Memory Lab reusable game set

The Memorise workspace now uses the planned `Learn | Flashcards | Games` top-level structure. `Games` contains the existing Match engine plus the new reusable Build the Rule, Missing Piece, Sort and Spot the Impostor engines, with one retrieval object visible at a time. The game switcher is keyboard navigable and every essential action has a click/tap/keyboard path; none of the games requires dragging.

`src/scripts/memory-game-content.js` supplies declarative token, option, bucket and impostor data. The four new engines own only generic interaction/scoring behaviour and report attempt/security/completion evidence through callbacks to the existing `ProgressStore` boundary. The original Match activity retains its stable Step 18 activity ID, while the Step 19 games use `activity:y12:differentiation:basics:memorise:memory-games`, preventing earlier Match completion from being reinterpreted as completion of the new game set. The Step 19 activity completes only after Build, Missing Piece, Sort and Impostor have all been completed.

Games preserve their session state across game switches, mode changes and Help/Word Bank overlays. On small screens the existing Memory Lab workspace scrolls internally rather than creating browser-page overflow. Step 20 extends this same workspace with Rapid Recall, Diagram Recall and Memory Mix/Review.

## Step 20 Rapid Recall, Diagram Recall and Memory Mix

`MemoryLab` now has the complete planned `Learn | Flashcards | Games | Review` structure. Review contains a mixed retrieval sequence plus focused Rapid Recall and Diagram Recall views, all inside the existing Memorise workspace rather than a second shell.

`RapidRecallEngine` derives its question/answer pool from the existing `MemoryItem.flashcard` data. It presents one prompt at a time and is **untimed by default**. Students may opt into the timer, turn it off again at any point, and still use the complete retrieval path without time pressure. Timer expiry records one unsuccessful retrieval but does not force the student onward.

`DiagramRecallEngine` consumes declarative accessible diagram/callout data. The current Basics validation schematic asks students to identify the curve, tangent line and point of contact using normal choice buttons, so pointer, touch and keyboard interaction all work. This local recall schematic does not replace or pre-empt the general `DiagramPrimitives` system planned for Step 23.

`MemoryMixEngine` orchestrates existing engines instead of duplicating their logic. The current validation mix combines Rapid Recall, Build, Diagram Recall, Missing Piece and Impostor; each underlying engine is reset/activated through a small adapter, and the next retrieval remains unavailable until the current one is complete. Final Review completion and aggregated security flow through the same callback boundary to `ProgressStore`, keeping completion and security separate.

Review state survives mode changes and overlays during the session. Responsive layouts keep Review/task overflow inside the Memory Lab workspace; no timer, animation or drag interaction is required for a complete accessible path.


## Step 21 DiagnosticRouter and MasteryFeedbackModel

`src/scripts/diagnostic-router.js` is the one diagnostic routing engine. It reads normalized outcome evidence plus the existing `QuestionDefinition` metadata; topic question UIs do not hard-code destination links. A failed outcome can be classified as `recognition` or `execution`, then mapped to an exact support need (`understand`, `memorise` or `ao1`). Target lookup is delegated to the shared support metadata in `help-content.js`, and a target must resolve to an activity that actually exists before it can be followed in-app.

The current Basics validation family demonstrates both branches. Treating the original function value as though it were the derivative is a recognition error and routes to the exact gradient-function Understand activity. Applying the power rule but failing to reduce the exponent is an execution error and routes to the exact power-rule AO1 activity. A generic power-rule recall error routes to the exact power-rule Memorise activity. Canonical `href` values remain on the links for future runtime routing while the current shell follows the stable target `activityId` in-place.

`QuestionShell` remains the presentation owner. On an unsuccessful checked response it asks the router for an optional diagnostic and, when one exists, renders a compact **Next step** card beside the existing feedback. The card shows student-facing recognition/execution wording and the suggested support destination; raw diagnostic/error IDs stay internal. Clicking the route uses the same shared support-navigation plumbing as `HelpDrawer`, preserves the question state, and returns the student to the exact activity if they later navigate back.

`src/scripts/mastery-feedback-model.js` aggregates tagged outcome evidence by stable micro-skill. It exposes strengths and weaknesses, separately counts recognition and execution errors, and carries the latest exact diagnostic next step. It deliberately does not calculate a percentage score and it does not create or infer a second security field: completion/security remain owned by `ProgressStore`. Full Year 12 / Year 13 mastery screens will consume this model later rather than creating their own diagnostic aggregation logic.


## Step 22 ClassWiz support panel

`src/scripts/classwiz-support-data.js` supplies calculator-support use cases as data, while `src/scripts/classwiz-support-panel.js` owns the one reusable panel. The initial Basics validation pack demonstrates numerical `d/dx` and definite-integral checking with separate step sequences for **fx-991CW** and **fx-991EX**. The visible structure is always **What it can help with -> Model-specific steps -> What it does not replace**.

The derivative sample uses a trigonometric function and therefore displays the conditional **RADIAN mode** reminder. Switching to the polynomial definite-integral sample removes that reminder. This establishes the planned rule that radians guidance appears where it is mathematically required rather than becoming permanent calculator chrome.

ClassWiz is optional support, not an activity or assessment engine. Opening it does not mark progress, change security, regenerate a question or replace the student's algebraic method. The panel explicitly states that numerical checking does not replace differentiation/integration working expected in the course. Topic files may later add TABLE, Solver/Equation, sigma and other use cases by extending declarative data instead of creating new calculator UIs.

The panel shares the AppShell overlay/inert/focus contract: Help, Word Bank, Data and ClassWiz do not compete for simultaneous modal state; Escape/scrim/Close dismiss it; focus returns to the trigger; activity state remains untouched. The same component is responsive across desktop/tablet/phone, becoming full-width on narrow screens.


## Step 23 DiagramPrimitives

`src/scripts/diagram-primitives.js` is the canonical low-level graph/diagram module. It supplies responsive coordinate mapping and reusable SVG primitives without owning calculus-domain state. `src/styles/diagram-primitives.css` supplies the shared visual treatment and semantic diagram tones. The standalone `diagram-primitives-demo.html` page is a QA/demonstration consumer only: it owns the example point and slope state and therefore does not pre-empt Step 24's `LinkedFunctionGradientExplorer`.

Every draggable handle supports Pointer Events and Arrow-key movement; standard range inputs provide adjacent parameter controls. Later mathematical engines should compose this module rather than create a parallel SVG/canvas primitive layer.


## Step 24 - Linked Function / Gradient Explorer

- `src/scripts/linked-function-gradient-explorer.js` implements the reusable `LinkedFunctionGradientExplorer` on top of `DiagramPrimitives`.
- It links `f(x)` to progressively revealed `f'(x)` and optional `f''(x)`, with a movable point/tangent and synchronized derivative points at one shared x-coordinate.
- Built-in validation content is polynomial, with fixed graph domains so comparison scales do not jump as the point moves or panels are revealed.
- The function-definition boundary accepts arbitrary `evaluate`, `derivative` and optional `secondDerivative` functions so later trig/exponential/log catalogues extend the same engine.
- `src/linked-function-gradient-explorer-demo.html` is the standalone Step 24 validation surface.


## Step 25 - Chord-to-Tangent Explorer

`src/scripts/chord-to-tangent-explorer.js` implements the reusable `ChordToTangentExplorer` on top of `DiagramPrimitives`. Point P is fixed for an activity while Q is constrained to the selected curve. One state object derives `h`, the chord gradient and the tangent gradient; topic activities can reveal all, some or none of those numerical values through the engine's information-mode API.

The P/Q labels deliberately move to opposite sides of the two points and the h label shifts away from the collision zone when `|h|` becomes small. The standalone demo includes the planned comparison sequence `h = 1, 0.5, 0.1, 0.01` plus a negative-side approach. Q reuses the shared Pointer Events and Arrow-key interaction path from `DiagramPrimitives`; no separate SVG/canvas layer is introduced.

## Step 26 - Family-of-Curves Explorer

`src/scripts/family-of-curves-explorer.js` implements the reusable `FamilyOfCurvesExplorer` on top of `DiagramPrimitives` and the existing family-agnostic function-definition contract. It renders several fixed-scale members of `F(x)+C`, lets the active constant move with a shared accessible range slider, and keeps one separate derivative graph unchanged as `C` varies.

Comparison curves use a dashed line treatment as well as the existing semantic diagram palette, so the comparison does not rely on colour alone. The graph domains are declared by each function definition and remain fixed while `C` changes; vertical translation therefore stays visually meaningful rather than being hidden by autoscaling. The standalone `family-of-curves-explorer-demo.html` page is the Step 26 validation surface.


## Step 27 - Area Explorer

`src/scripts/area-explorer.js` implements the canonical `AreaExplorer` on top of `DiagramPrimitives` and the existing family-agnostic function-definition contract. It supports selectable functions, fixed graph domains, arbitrary lower/upper limits (including lower limit 0 and reversed limits), detected roots, sign-consistent shaded regions, signed definite-integral value, optional user-selected split points and total geometrical area.

Changing or reversing limits never autos-scales the graph. Reversed limits change the sign of the definite integral but not the total geometrical area. Split points subdivide the working representation without changing either mathematical total. Regions above/below the axis use explicit + / - labels and different solid/dashed boundary styles as well as colour, so sign is not encoded by colour alone. Roots, limits and user splits are shown with restrained guide lines and offset labels rather than point handles on the curve, protecting curve legibility.

The built-in validation catalogue includes a positive-only quadratic, a quadratic with two crossings and a cubic with three roots. Pure helpers expose numerical integration, root detection, split-point normalization and a combined area-state model for later Year 12/Year 13 area activities and advanced-method checking.

## Step 28 - Parametric Curve Tracer

`src/scripts/parametric-curve-tracer.js` implements the canonical `ParametricCurveTracer` on top of `DiagramPrimitives`. It keeps fixed graph domains while a shared `t` state drives `x(t)`, `y(t)`, the traced point and direction-of-increasing-`t` arrows. A visible restricted `t` interval controls which part of the curve is emphasised without changing the underlying curve definition or graph scale.

Information is deliberately progressive: coordinates first, then `dx/dt` and `dy/dt`, then `dy/dx` and a tangent, then parametric area strips. The area helper evaluates `integral y(t) x'(t) dt` over the selected interval so later parametric-area activities can reuse the same mathematical state rather than introduce a separate canvas. The built-in validation set includes a parabola, a turning cubic trace and an ellipse. `src/parametric-curve-tracer-demo.html` is the standalone Step 28 validation surface.

## Step 29 - Rate-Flow Diagram

`src/scripts/rate-flow-diagram.js` implements the canonical `RateFlowDiagram` for connected-rates dependency chains. It composes `DiagramPrimitives` for variables, dependency arrows and mathematical labels while keeping arrangement/checking state in the higher-level engine. Students first arrange the variables into dependency order, then choose the orientation of each derivative and the target rate before checking the complete structure.

Rate status is not encoded by colour alone: `● known`, `◆ find` and `■ relationship` appear as both distinct shapes and words. Dependency arrows always show the physical/logical direction of influence, while the derivative choice separately tests the numerator/denominator orientation. The engine exposes pure helpers for canonical chain order, derivative labels, rearrangement, checking and the resulting chain-rule expression so later connected-rates and differential-equation modelling activities can reuse the same logic without custom SVG per question.

The validation catalogue includes the planned `t → r → A` ripple/circle chain and a four-stage `t → r → V → m` chain. `src/rate-flow-diagram-demo.html` is the standalone Step 29 validation surface.

## Step 30 - Rectangle-Sum Explorer

`src/scripts/rectangle-sum-explorer.js` is the canonical finite-rectangle / limiting-sum visual engine. It composes `DiagramPrimitives`, reuses the shared function-definition contract and the canonical numerical definite-integral helper, and keeps axes fixed while `n` or sample location changes. The standalone `rectangle-sum-explorer-demo.html` demonstrates one, several and many rectangles, left/midpoint/right sampling, `Δx=(b-a)/n`, finite-sum comparison with the exact integral, and the recognition-level mapping from sum components to definite-integral notation.


## Step 31 - Trapezium-Rule Builder

`src/scripts/trapezium-rule-builder.js` implements the canonical `TrapeziumRuleBuilder`. It composes `DiagramPrimitives`, reuses the shared function-definition contract and the canonical definite-integral evaluator from `AreaExplorer`, and exposes the ordinate/trapezium state as reusable data for later generated questions and ClassWiz TABLE support.

The student journey is deliberately staged: one rotated trapezium recalls `A = 1/2(a+b)h`; two and three trapezia are added individually; interior ordinates are visually distinguished so their repeated appearance explains coefficient 2; only then is the general rule revealed. The engine also computes exact comparison, percentage error and a concavity-aware bound classification. Over/under claims are made only when the second derivative keeps one sign across the whole interval; a changing-concavity interval is explicitly reported as unsuitable for a whole-interval bound.

`src/trapezium-rule-builder-demo.html` is the standalone Step 31 validation surface.

## Step 32 - Basics of Differentiation content model

`src/scripts/topic-metadata.js` is the runtime implementation of the Step 5 `TopicMetadata` / route-projection contract. It validates stable topic, micro-skill and activity IDs, derives canonical five-segment routes, validates support targets against real activity records, and exposes mode/route lookup helpers without owning navigation UI or browser history.

`src/scripts/topic-content/basics-differentiation.js` is the canonical Basics of Differentiation topic model. It preserves the planned journey **gradient on a curve -> gradient function -> polynomial explorer -> notation/operator -> backstory -> power rule -> term-by-term differentiation**, records the prerequisite tags, models all five learning modes, and gives each diagnostic micro-skill exact future activity IDs/routes plus vocabulary tags. Activity records deliberately point to implementation Steps 33-35; Step 32 does not build those screens.

The shared vocabulary bank now contains the full planned Basics vocabulary, including function, differentiate, gradient, constant, power/index, increasing/decreasing, `f′(x)`, `dy/dx` and the `d/dx` operator, alongside the previously implemented derivative/gradient-function/tangent/coefficient entries.


## Step 33 - Basics: Understand

The reference topic now uses eight canonical Understand activities from the Step 32 metadata model. `BasicsUnderstandExperience` coordinates the journey while reusing `LinkedFunctionGradientExplorer` and `DiagramPrimitives`. The linked explorer was extended with sampled derivative points so students can construct the gradient function before revealing the complete derivative curve. Memorise and AO1/AO2/AO3 remain deferred to Steps 34 and 35.

## Step 34 - Basics: Memorise and Word Bank

The Basics Memorise mode now uses the existing `MemoryLab` as its production recall workspace. `memory-content.js` contains the complete planned differentiation fact bank: the general power rule, constants, `x`, `ax`, reciprocal-to-negative-power rewrites, root-to-fractional-power rewrites, term-by-term differentiation, derivative notation and the `d/dx` operator.

The planned Step 32 vocabulary is not copied into a topic glossary. Instead, each vocabulary memory item is projected directly from the canonical `VocabularyTerm` definition and notation, so Learn, Flashcards, Match and the Word Bank share one source of truth. `MatchEngine` now samples the complete candidate bank before applying its compact round limit, allowing repeated rounds to reach every fact/vocabulary item without placing the whole bank on screen at once.

The six canonical Step 34 Memorise activity IDs are live, while the Step 19 `memory-games` and Step 20 `mixed-review` IDs remain available so existing progress records are not reinterpreted. No topic-specific flashcard, match or vocabulary UI has been introduced.

## Step 35 - Basics: AO1, AO2 and AO3

The reference topic now uses the shared `QuestionShell` and `GeneratorRunner` for all nine canonical Step 35 assessment activities declared by Step 32. AO1 contains power-rule fluency, rewrite-then-differentiate, term-by-term differentiation and function/derivative matching. AO2 contains gradient-function explanation, power-rule explanation, error correction and unknown coefficients. AO3 contains simple rate-of-change applications with contextual interpretation.

`src/scripts/question-definitions/basics-assessment.js` owns the new generated-question definitions. `src/scripts/question-visual-renderer.js` is an optional shared QuestionShell child for declarative graph evidence; the graph-matching activity uses it to render the original function and four derivative candidates through `DiagramPrimitives`. Every definition carries the canonical Basics topic ID, one exact micro-skill, assessment-objective tag, prerequisite/method/vocabulary tags, declared error categories and diagnostic rules. Existing Step 16 power-rule definitions are reused rather than copied. `question-catalogue.js` maps the nine canonical activity IDs to those shared definitions; no `AO1QuestionShell`, `AO2QuestionShell` or `AO3QuestionShell` exists.

The AO boundaries are deliberate: AO1 questions execute familiar procedures; AO2 questions require explanation, diagnosis or backwards use of derivative information; AO3 questions select differentiation in a short unfamiliar context and interpret the resulting signed rate. Failed outcomes route through the existing `DiagnosticRouter` to exact Understand, Memorise or AO1 support targets. The existing QuestionShell remains the single response/hint/solution/diagnostic workspace across all three modes.

## Step 36 - Reference-topic regression and design freeze

Basics of Differentiation is the frozen reference-topic implementation for future topic work. The production path is now fixed as one `AppShell`, one five-mode identity system, `TopicMetadata` as the source of stable activity IDs/routes, shared graph engines for Understand, `MemoryLab` + `VocabularyTerm`/Word Bank for Memorise, and `QuestionShell` + `GeneratorRunner`/`QuestionDefinition` for AO1/AO2/AO3. Later topics configure or extend these systems rather than creating topic-local shells, storage helpers, graph canvases, memory games or assessment runners.

`tests/reference_topic_freeze_test.mjs` is the regression gate for the frozen topic. It verifies all five live mode surfaces, support-target resolution, Word Bank/MemoryLab vocabulary parity, generated-question AO separation, responsive/internal-scroll/focus/touch conventions, persistence boundaries, and diagram/question reuse boundaries. Step 36 also normalises the Basics-specific controls, Memory Lab tabs and narrow-screen Topics toggle to the shared 44px touch-target token and gives Memory Lab / QuestionShell explicit shared focus-ring treatment. Discrete changes to the gradient-point count and `d/dx` machine result are announced politely to assistive technology without making continuous graph dragging noisy.

Broad shell redesign is now considered frozen. Any later change to the AppShell, mode tabs, overlays, shared workspace geometry, storage contracts, Memory Lab, QuestionShell or reference-topic interaction conventions must rerun the complete Basics regression gate and compare the resulting topic across all five modes. The managed system Chromium in this environment still returns `ERR_BLOCKED_BY_ADMINISTRATOR` for localhost preview URLs; Step 36 records that browser limitation explicitly rather than treating it as a successful screenshot pass.

## Step 37 - Pre-calculus introduction

The Year 12 Pre-calculus navigation item is now a real understanding-only topic. Its seven short states move from hill/car change intuition through sign, steepness, gradient-vs-height, the near-vertical limit idea and visible `Δy/Δx`, ending with the question of gradient on a curve. The topic reuses `DiagramPrimitives`, shared vocabulary/Help/progress systems and the frozen AppShell. Memorise/AO1/AO2/AO3 remain visible but disabled for this topic because Step 37 intentionally contains no assessment or memory content.

## Step 38 - Differentiation from First Principles: Understand

The First principles Year 12 topic is live as a nine-state Understand journey. It moves from informal limit intuition and simple numerical limits through the two-point chord construction, the shared `ChordToTangentExplorer`, the planned `h = 1, 0.5, 0.1, 0.01` sequence, the formal first-principles definition, slow x²/x³ derivations and a final distinction between using a rule and proving it.

The topic does not introduce a new graph engine. `FirstPrinciplesUnderstandExperience` is a thin orchestration layer over the registered `ChordToTangentExplorer`; continuous Q dragging keeps the engine readout out of live-region announcements, while discrete sequence/reveal actions use restrained status updates. The x²/x³ proofs reuse `EquationStepRenderer` and reveal progressively by rendering an increasing prefix of the same shared `SolutionStep` structure rather than creating a topic-specific equation renderer.

## Step 39 - Differentiation from First Principles: Memorise / AO1-AO3

All five frozen modes are now live for First principles. Memorise projects the canonical first-principles facts and vocabulary through the shared `MemoryLab`, including recall, matching, memory-game and mixed-review activities. AO1 builds from limits and `f(x+h)` through fading first-principles proofs; AO2 focuses on explaining chord/tangent approximation, interpreting `h -> 0`, and diagnosing derivation errors; AO3 stays deliberately modest, selecting the correct difference quotient and using an established first-principles derivative in a simple gradient application.

No parallel memory or assessment surface was introduced. The AppShell now caches topic-scoped instances of the existing `MemoryLab` composition so switching between Basics and First principles preserves each topic's memory state. AO activities use the existing `QuestionShell`, `GeneratorRunner` and shared `QuestionDefinition` catalogue. Diagnostic routes distinguish limit intuition, algebra execution and straight-line-gradient prerequisites, sending learners back to the most precise existing support activity.

## Step 40 - Tangents and Normals

All five frozen modes are now live for Tangents and Normals. Understand follows the planned journey **derivative gives gradient -> tangent uses gradient -> normal is perpendicular -> equation of line**. `TangentsNormalsUnderstandExperience` remains a thin topic-level orchestration layer: the curve and tangent come from the existing `LinkedFunctionGradientExplorer`, while the normal is drawn with the shared `DiagramPrimitives.line` overlay rather than a new graph engine.

The shared `tangentNormalModel` owns the line mathematics. At a regular point it evaluates the tangent gradient, forms the negative-reciprocal normal gradient and supplies point-slope line information. At a horizontal tangent it deliberately returns a vertical normal `x = a`; it never attempts to display `-1/0` or an undefined gradient. Fixed domains keep tangent/normal comparisons visually stable as the point moves.

Memorise reuses `MemoryLab` with canonical vocabulary and fact items. AO1-AO3 reuse `QuestionShell`, `GeneratorRunner` and `QuestionDefinition`, with distinct procedural, reasoning/diagnosis and short application tasks. Diagnostic routing is micro-skill-specific, including exact tangent-gradient, normal-gradient, normal-line and horizontal-tangent support targets. No parallel memory, assessment, storage or diagram system has been introduced.

## Step 41 - Stationary and Turning Points: Understand

The Stationary Points navigation item is now a real Understand-only topic. Its five-state journey follows **gradient function -> zero gradient -> classify from derivative signs -> stationary point with no turn -> first/second derivative meaning**. `StationaryPointsUnderstandExperience` is a thin orchestration layer over the existing `LinkedFunctionGradientExplorer`; it does not introduce a separate stationary-point graph engine or topic-local SVG/canvas layer.

The topic deliberately classifies behaviour from the sign of `f'(x)` before introducing the second-derivative shortcut. The linked examples include `x^2`, `-x^2`, `x^3` and a constant function. In particular, `x^3` at `x=0` gives the planned `+ -> 0 -> +` stationary-inflection counterexample, so `f'(a)=0` is not presented as proof of a turning point. When `f''(a)=0`, the model and teaching text report **inconclusive**; the constant-function and stationary-inflection examples make that limitation visible. Memorise and AO1-AO3 remain disabled until Step 42.

## Step 42 - Stationary and Turning Points: Memorise / AO1-AO3

The Stationary and Turning Points topic now uses the full five-mode architecture. Memorise projects stationary-point facts and the canonical vocabulary through the shared `MemoryLab`; AO1 covers solving `f'(x)=0`, first-derivative sign tests and the second-derivative shortcut; AO2 explains and diagnoses the tests; AO3 uses simple Year 12 application and parameter problems through the existing generated-question pipeline.

The first-derivative sign-test set deliberately contains separate maximum (`+ -> 0 -> -`), minimum (`- -> 0 -> +`) and stationary-inflection (`+ -> 0 -> +`) definitions so all three behaviours are always represented. The second-derivative question definition preserves the Step 41 rule that `f''(a)=0` is **inconclusive** and routes that misconception back to the exact Understand support activity. No new Memory Lab, QuestionShell, generator, diagnostic router or graph system was introduced.

## Step 43 - Increasing and Decreasing Functions

Step 43 adds the full Increasing & Decreasing topic across Understand, Memorise, AO1, AO2 and AO3. The Understand journey is appearance-first and reuses `LinkedFunctionGradientExplorer`; `IntervalSelectionOverlay` is a reusable accessible interval selector added for visible interval choice before algebra. The same canonical models drive the graph/sign/algebra checks, including `x^3-3x` with increasing `(-infinity,-1) U (1,infinity)` and decreasing `(-1,1)`. Memory and assessment continue through the shared Memory Lab and QuestionShell/generator/diagnostic systems.

## Step 44 - Introduction to Integration

The Year 12 Introduction to Integration topic is now live across Understand, Memorise, AO1, AO2 and AO3. The Understand sequence starts with an intentionally ambiguous reverse-differentiation guess, then reuses `FamilyOfCurvesExplorer` to show that vertical translations have the same derivative before revealing the constant of integration. It continues to the routine power rule (`n != -1`), rewriting roots/suitable reciprocals as powers, and term-by-term integration with one `+C` after recombination.

Memorise uses the shared `MemoryLab` and existing game/review engines; AO1-AO3 use the shared `QuestionShell`, `GeneratorRunner`, `QuestionDefinition` and diagnostics. No integration-specific graph engine, memory UI, assessment runner or storage path has been added. The Step 44 contract also verifies the `n=-1` exception and exact support routes for reverse differentiation, `+C`, rewriting powers and routine integration.

## Step 45 - Definite and Indefinite Integration

The Year 12 Definite and Indefinite Integration topic is now live across Understand, Memorise and AO1-AO3. The central journey contrasts indefinite families with definite numerical values, keeps **Integrate** and **Evaluate** as separate visual stages, introduces `[F(x)]_a^b = F(b)-F(a)` explicitly as evaluation notation, and shows why `+C` cancels both algebraically and through the existing `FamilyOfCurvesExplorer`.

The topic reuses `EquationStepRenderer` for staged endpoint evaluation, the shared `MemoryLab` for recall, and the existing generated-question/diagnostic systems for AO work. Basic limit properties cover equal limits, reversed limits, splitting an interval and `int_a^b = int_0^b - int_0^a`; integration-as-area remains reserved for Step 46.

## Step 46 - Integration as Area

The Year 12 Integration as Area topic is now live across Understand, Memorise and AO1-AO3. The conceptual sequence is deliberately positive-area first: a selectable positive function is shown with lower limit fixed at `0`, the upper limit moves while the shaded region and integral value update, and an arbitrary lower limit is then introduced by visibly removing the unwanted `0 -> a` accumulation from the full `0 -> b` region. That visual subtraction is connected directly to `F(b)-F(a)`.

The same `AreaExplorer` is reused rather than replaced. Step 46 configures it to hide later signed-area/split-point detail while preserving the engine's legacy defaults for Step 47 and other consumers. Identical limits, adjacent intervals and reversed limits are then shown visually on the same positive-curve model. The topic deliberately does not introduce integration as a limit of a sum or below-axis/crossing-axis area; those remain later steps.

## Step 47 - Areas Below the Axis and Crossing the Axis

The Year 12 signed-area topic is now live across Understand, Memorise and AO1-AO3. The Understand journey reuses the full signed configuration of `AreaExplorer`: above-axis regions contribute positively, below-axis regions contribute negatively, and the live readout distinguishes the signed definite integral from total geometrical area.

A cancellation example uses `y=x` on `[-2,2]` to make the distinction unavoidable: the signed integral is `0`, while the total geometrical area is `4`. The explicit **Split the Integral** activity uses `y=x^2-1` on `[-2,2]`; students must visibly select the sign-changing roots `x=-1` and `x=1` before the calculation explanation unlocks, with `x=0` present as a non-root distractor. The conceptual chain is kept explicit: **root -> axis crossing -> sign change -> split integral**.

No new area graph engine is introduced. `SignedAreaUnderstandExperience` orchestrates the existing `AreaExplorer`; `signed-area-model.js` supplies only topic mathematics. Memorise continues through the shared `MemoryLab`, while AO1-AO3 and diagnostics continue through the canonical `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`, `DiagnosticRouter` and Help systems.

## Step 48 - Year 12 Review and Mastery

The Year 12 review checkpoint is now live in Memorise, AO1, AO2 and AO3. Memorise begins with eight consolidated Things to Remember sections covering gradient/derivatives, first principles, tangents/normals, stationary points, increasing/decreasing functions, integration, definite integration and signed/geometrical area. Vocabulary Check then reuses the existing Memory Lab to retrieve the combined Year 12 definitions, notation and diagram meanings; no separate review glossary is maintained.

Mixed AO1, AO2 and AO3 practice is deliberately topic-blind. The question catalogue assembles the review from existing source-topic `QuestionDefinition` records, so prompts do not announce the topic while hidden source topic/AO/micro-skill metadata remains available for diagnostics. AO3 also includes a reconstruction problem that combines integration with an initial condition through the same shared question contract.

The Diagnostic mastery activity mixes AO1-AO3 evidence and uses the existing `DiagnosticRouter` and `MasteryFeedbackModel`. A mastery summary below the shared `QuestionShell` groups evidence by exact source micro-skill, distinguishes strengths from specific weaknesses and provides direct next-step buttons to the relevant Year 12 Understand, Memorise or AO1 activity. Review attempts count toward the Review topic without mutating progress in the source teaching topics. No new question runner, Memory Lab, diagnostic router or persistence path is introduced.

## Step 49 - Year 12 regression gate

The completed Year 12 / 8MA0 pathway now has a dedicated regression gate in `tests/year12_regression_step49_test.mjs`. It verifies plan traceability, scope identity, vocabulary, progress applicability, canonical routes, generated-question validity, the Year 12 review boundary and responsive-layout contracts across the completed Steps 37-48 topics.

The gate corrected one metadata-only ordering drift: later Year 12 topic `sequence` values now continue the frozen `10, 20` convention as `30` through `110`. This preserves the existing visible navigation while making future metadata-driven ordering deterministic. The frozen Basics reference files remain byte-for-byte unchanged.

## Step 50
Standard Functions is now live as the first Additional Year 13 / 9MA0 topic, reusing the linked-gradient explorer, Memory Lab, shared question generator/shell and diagnostic routing. See `Calculus_Website_STEP_50_STANDARD_FUNCTIONS.md`.

## Step 51 - First-Principles Proofs for Trig Derivatives

The first-principles trig topic is now live across Understand, Memorise and AO1-AO3. Its central journey is **small-angle evidence -> key limits -> first-principles formula -> angle-addition identities -> derivative of sine/cosine**. The Understand experience reuses `DiagramPrimitives` for linked near-zero graphs and a unit-circle view, and `EquationStepRenderer` for line-by-line derivations in which the two small-angle limits are visibly substituted.

Radians are explicit throughout. ClassWiz TABLE support may be used to observe `sin h / h` approaching `1`, but the interface states that this is numerical evidence rather than proof. Memorise and assessment continue through the canonical Memory Lab, QuestionShell/generator and diagnostic systems; no second graph, proof renderer, memory interface, assessment shell or persistence path has been added.

## Step 52

Product / Quotient / Chain now has its Understand-only Plan 20.1-20.3 structure layer: expression classification, function-machine composition, persistent labelled structure highlighting, formal rule structure and nested/mixed rule unpacking. Memorise and AO1-AO3 remain deferred to Step 53.


## Step 53 - Product / Quotient / Chain Rule: Memorise and AO1-AO3

The Product / Quotient / Chain topic now uses the full five-mode architecture. Memorise runs through the canonical Memory Lab with formal-rule recall, quick methods, rule-selection retrieval and explicit practice against reversed quotient order and missing chain factors. AO1 provides individual product/quotient/chain generators plus mixed one-rule and multi-rule sets; AO2 separates rule-selection reasoning from explicit quotient-order and missing-chain-factor diagnosis; AO3 adds short applications through the shared generated-question pipeline.

Rule metadata remains diagnostic evidence rather than UI duplication: individual and mixed one-rule questions retain exact source micro-skills, while multi-rule questions use a dedicated multi-rule execution skill. No parallel memory, question, diagnostic, persistence or rule-specific engine has been introduced.

## Step 54 - Parametric Equations and Differentiation

The Additional Year 13 / 9MA0 Parametric Equations and Differentiation topic is now live across Understand, Memorise and AO1-AO3. The journey keeps the shared parameter visible from the start: students trace `x(t), y(t)`, restrict the allowed `t` interval and observe the resulting coordinate ranges, eliminate the parameter where appropriate, then derive `dy/dx=(dy/dt)/(dx/dt)` explicitly from the chain rule before applying it to gradients, tangents and normals.

Step 54 reuses and extends the registered `ParametricCurveTracer` rather than introducing another graph engine. The tracer can now calculate coordinate ranges for a restricted parameter interval and renders an explicit vertical tangent when `dx/dt=0` while `dy/dt` is non-zero. Excluded parts of the curve remain visible but faded so domain/range restrictions stay connected to the whole curve. The fraction-like differential shortcut is labelled as intuition only; the chain rule remains the formal justification. Memory, generated AO1-AO3 assessment, diagnostics, vocabulary and ClassWiz support continue through the canonical shared systems.

## Step 55 - Implicit Differentiation

Step 55 adds the Additional Year 13 implicit-differentiation topic. The Understand sequence deliberately separates calculus from algebra: classify the relation, apply `d/dx` to both sides, differentiate one term at a time, and only after every term has been processed unlock the collect/factor/divide stage for `dy/dx`. y-dependent terms are explicitly framed through the chain rule (`y=y(x)`), while `xy` examples retain the product-rule structure. Memorise and AO1-AO3 reuse the canonical Memory Lab, QuestionDefinition/GeneratorRunner, QuestionShell, DiagnosticRouter, Help and progress contracts.

## Step 56 - Trig Identities and Inverse Trig Differentiation

Step 56 adds the Additional Year 13 / 9MA0 Trig Identities and Inverse Trig Differentiation topic across Understand, Memorise and AO1-AO3. The topic makes the notation distinction explicit from the start: `sin^-1 x = arcsin x` is an inverse function, whereas `(sin x)^-1 = 1/sin x = cosec x` is a reciprocal. Inverse trig graphs are introduced only after restricting the original trig function to a one-to-one domain and reflecting in `y=x`.

Further trig derivatives are built from existing quotient/product rules and identities before becoming memory facts. The general inverse-function gradient relationship is introduced before the inverse-trig derivations. The inverse-trig pathway deliberately reuses the Step 55 implicit-differentiation sequencing and keeps the common structure visible as **Rewrite -> Differentiate -> Identity -> Simplify**. Mixed trig work also reuses `StructureHighlighter` so inside/outside identities and chain factors remain labelled rather than relying on colour alone.

No separate inverse-trig graph engine, equation renderer, implicit engine, memory surface, question shell, diagnostic router or storage path has been introduced. `DiagramPrimitives`, `EquationStepRenderer`, `StructureHighlighter`, the canonical Memory Lab, generated-question stack, diagnostics, Help, vocabulary and progress systems remain the shared implementation path.

## Step 57 - Concavity, Convexity and Inflection

The Additional Year 13 / 9MA0 Concavity, Convexity and Inflection topic is now live across Understand, Memorise and AO1-AO3. The central journey reuses `LinkedFunctionGradientExplorer` with the second derivative visible so students can read `f''` as the rate of change of gradient, connect `f''<0` with concave intervals and `f''>0` with convex intervals, and then test candidate inflection points by checking for a genuine sign change in `f''`.

The Understand sequence deliberately compares `x^3` with `x^4`: both have `f''(0)=0`, but only `x^3` changes concavity at the origin. A separate comparison distinguishes stationary from non-stationary inflections using `f'` only after the inflection sign-change test has been established. `EquationStepRenderer` supports the final solve/sign-chart/interpret workflow; Memory Lab, generated AO1-AO3 questions and diagnostics continue through the canonical shared systems.

## Step 58 - Connected Rates of Change

The Additional Year 13 / 9MA0 Connected Rates topic is now live across Understand, Memorise and AO1-AO3. Its central journey is **practical changing quantities -> dependency diagram -> chain rule -> unknown rate -> units and interpretation**. The implementation reuses the canonical `RateFlowDiagram`: students arrange variables and orient each derivative before numerical substitution is unlocked, with `x -> y` consistently interpreted as `dy/dx`.

The Understand sequence covers the ripple chain `t -> r -> A`, a fixed six-stage connected-rates method, negative-rate/unit interpretation and the multi-stage `t -> r -> V -> m` model. Memory and generated assessment continue through the existing shared systems. No second rate-flow diagram, memory interface, question shell, diagnostic router, equation renderer or persistence path has been introduced.

## Step 59 - Year 13 Differentiation Review and Mastery

The existing `Full A level · 9MA0` review surface is now active as a differentiation-only checkpoint spanning Year 12 differentiation foundations and the Additional Year 13 differentiation content from Steps 50-58. It deliberately excludes integration until the later full-calculus review.

The review follows **Recall -> select method -> explain method -> apply method -> topic-blind mixed differentiation -> diagnostic mastery**. Method-selection-only AO1 work samples product/chain, quotient/chain, parametric, implicit, inverse-function, connected-rates and second-derivative choices before any algebra. Mixed AO1-AO3 work reuses source-topic `QuestionDefinition` records so exact micro-skill and diagnostic metadata survive even though prompts are topic-blind.

The mastery contract keeps **recognition** and **execution** evidence separate: review-specific method-choice errors route to the shared method map, while execution errors from reused source questions route back to the precise teaching topic. The implementation reuses the one Memory Lab, QuestionShell, DiagnosticRouter, MasteryFeedbackModel, AppShell, progress and persistence systems; no parallel Year 13 review architecture is introduced.

## Step 60 - Standard Integrals to Memorise

The Additional Year 13 / 9MA0 Standard Integrals topic is now live across Understand, Memorise and AO1-AO3. One central `standard-integrals-data.js` source owns the standard integral array and reusable `ax+b` forms so later integration methods can import the same facts instead of duplicating formula lists. The Understand journey links integration back to differentiation, names the Fundamental Theorem of Calculus explicitly, separates indefinite families from definite endpoint evaluation, and includes recovery of a function from `f'` with a point used to determine `C`.

Memorise reuses the canonical Memory Lab for rapid integrand-to-antiderivative recall, sign/coefficient traps and differentiation-to-check. AO1-AO3 continue through the shared `QuestionDefinition` / `GeneratorRunner` / `QuestionShell` path. Numerical calculator integration or derivative values are described only as checks; they do not replace symbolic integration or exact working.

## Step 61 - Recognition and Reverse Chain Rule

The Additional Year 13 / 9MA0 Recognition and Reverse Chain Rule topic is now live across Understand, Memorise and AO1-AO3. The learning order is deliberately **differentiate composites -> identify inner function and inner derivative -> classify reverse chain / f′/f / neither -> adjust constants -> integrate**. Near-misses are first-class examples: if the visible factor differs from the required inner derivative by an x-dependent ratio, the structure cannot be repaired by pulling out a constant.

Step 61 imports the Step 60 `STANDARD_INTEGRAL_DEFINITIONS` directly and reuses `StructureHighlighter` for labelled structure. The `f′/f` logarithm pattern is kept as a separate recognition family; trig work includes tan/cot rewrites and odd-power structures, and definite versions preserve recognition before endpoint evaluation. Memory, AO1-AO3 questions, Help/diagnostics, progress and persistence continue through the canonical shared systems.
## Step 62 - Integration Using Trig Identities

The Additional Year 13 / 9MA0 Integration Using Trig Identities topic is now live across Understand, Memorise and AO1-AO3. Its central journey is **recognise trig form -> choose identity -> rewrite exactly -> reduce to standard/reverse-chain -> integrate**. Rewrite-only work comes before calculation so students learn that the first move is often algebraic/trigonometric manipulation rather than integration.

Step 62 keeps method choice explicit. Students distinguish **standard integral**, **reverse chain**, **trig identity** and **substitution** routes before integrating, including deliberate examples where an identity is unnecessary. The topic covers `sin^2 x`, `cos^2 x`, scaled `cos^2(3x)`, `tan^2 x`, and definite cases with exact manipulation visible throughout. The implementation imports Step 60 standard-integral definitions by reference and consumes Step 61's canonical `reverse-chain` tag; Memory Lab, generated questions, diagnostics, Help, progress and persistence continue through the shared systems.


## Step 63 - Integration by Substitution: Understand

The Additional Year 13 / 9MA0 Integration by Substitution topic is now live in **Understand only**. Its central journey is **recognise -> choose substitution -> change everything to the new variable -> integrate -> substitute back if indefinite / stay in the new variable if definite**. Recognition is positioned as the faster route when reverse-chain structure is obvious; substitution is the systematic version of the same chain-rule reversal.

Step 63 introduces a reusable `VariableTransformationWorkspace` that models each variable-change stage and rejects mixed-variable states. If `u` has been introduced, the transformed integral cannot retain an unresolved `x` or `dx`; for definite integrals the original limits are first displayed explicitly as `x=a`, `x=b`, then converted to u-limits, after which the calculation remains in u. Choosing-u guidance covers inner expressions in powers/roots/exponentials/trig/logs, denominators, repeated expressions and the derivative-present test, alongside deliberately unhelpful choices.

The implementation reuses Step 61 reverse-chain recognition data and Step 62's canonical `substitution` method tag. Memorise and AO1-AO3 remain disabled until Step 64; no future assessment content has been implemented early.

## Step 64 - Integration by Substitution: AO1-AO3 and diagnostics

The Additional Year 13 / 9MA0 Integration by Substitution topic is now complete across all five modes. Memorise retrieves the method position, change-everything sequence, choosing-u cues, definite-limit conversion and finishing rules. AO1 separates supplied substitutions, choosing `u`, changing limits and complete execution; AO2 compares recognition with explicit substitution and diagnoses failed variable changes; AO3 applies substitution when the method is not signposted.

The diagnostic contract deliberately separates **choice of `u`**, **transformation/change of variable**, and **integration/evaluation** errors. This means a plausible but unhelpful substitution is not treated as the same weakness as a mixed-variable state, and neither is confused with a later antiderivative/evaluation error. Definite work continues to show the original `x` limits, convert them to `u`, and remain in `u` thereafter.

Step 64 reuses the Step 63 `VariableTransformationWorkspace`, Step 61 reverse-chain recognition data and Step 62's canonical `substitution` method tag. Memory, generated assessment, Help/diagnostics, progress and persistence continue through the shared systems; no parallel substitution architecture is introduced.

## Step 65 - Integration by Parts

The Additional Year 13 / 9MA0 Integration by Parts topic is now live across Understand, Memorise and AO1-AO3. Its central journey is **method positioning -> derive from product rule -> preview `u`/`dv` choices -> basic cases -> hidden 1 -> repeated use -> DI table -> cyclic cases**. A visible product is never treated as sufficient evidence for the method: the decision rule is whether `uv - ∫v du` produces a genuinely easier remaining integral after earlier standard/rewrite/reverse-chain/substitution routes have been considered.

The formula is derived through the shared `EquationStepRenderer`, and the choice preview makes both good and poor `u`/`dv` options visible before calculation. Special cases include `∫ln x dx = ∫1·ln x dx`, repeated polynomial-exponential work, the DI table with alternating signs, and cyclic integrals where the original integral is labelled `I` and solved algebraically when it returns.

Step 65 extends the existing integration method vocabulary with `integration-by-parts`, reuses Step 60's standard-integral definitions by reference, and continues through the canonical Memory Lab, generated-question, Help/diagnostic, progress and persistence systems. Partial fractions are implemented in Step 66 using the same shared integration-method vocabulary and a separate reusable algebraic decomposition model.


## Step 66 - Integration Using Partial Fractions

The Additional Year 13 / 9MA0 Integration Using Partial Fractions topic is now live across Understand, Memorise and AO1-AO3. Its central journey is **recognise rational function -> make proper -> choose decomposition -> find coefficients -> integrate simple terms -> combine logarithms**. Students first decide whether the rational function is proper; improper cases require polynomial division before any decomposition.

The algebraic decomposition model is deliberately separated from the calculus layer. Distinct linear factors include up to three terms; repeated linear factors include every power up to the repeated power; coefficients can be found by convenient values and/or coefficient comparison and are verified before integration. Once decomposed, standard `1/(ax+b)` terms reuse Step 60's standard-integral definitions by reference, while repeated-power terms may use the power rule rather than being forced into logarithms.

Logarithm laws stay visible through product, quotient and power simplification. Indefinite work includes `+C`; when students absorb the arbitrary constant into one logarithm, the convention is `C = ln K` with `K > 0`. Definite examples retain exact logarithmic values. Step 66 extends the shared integration-method vocabulary with the canonical `partial-fractions` tag and continues through the existing Memory Lab, generated-question, Help/diagnostic, vocabulary, progress and persistence systems.

## Step 67 - Areas with Year 13 Techniques

Step 67 adds `topic:y13:integration:areas` across Understand, Memorise and AO1-AO3. It reuses `AreaExplorer` and the existing integration-method vocabulary. The fixed decision order is **region -> intersections/limits -> top-bottom -> split? -> geometry or calculus -> integration method -> calculation**. No new area canvas or integration engine is introduced. See `Calculus_Website_STEP_67_AREAS_YEAR13_TECHNIQUES.md`.

## Step 68 - Area Using Parametric Equations

Step 68 adds `topic:y13:integration:parametric-area` across Understand, Memorise and AO1-AO3. It extends the existing `ParametricCurveTracer` with an optional thin-strip/direction teaching overlay, derives `A=∫y dx=∫y(t)(dx/dt)dt`, converts x-boundaries to t-limits explicitly, separates signed direction from geometrical area, and adds `parametric-area` to the canonical integration-method vocabulary for the later method-tag audit. See `Calculus_Website_STEP_68_PARAMETRIC_AREA.md`.

## Step 70 - Integration as the Limit of a Sum

Step 69 adds the full Year 13 limit-of-sum topic while preserving `RectangleSumExplorer` as the single rectangle/finite-sum engine. `LimitOfSumUnderstandExperience` orchestrates the explorer and its existing `buildSumToIntegralMap()` output; it does not create another SVG/canvas system.

The central journey is **rectangles -> finite sum -> thinner rectangles -> limiting sum -> recognise integrand/limits -> definite integral -> choose existing integration technique -> evaluate**. The new canonical method tag is `limit-of-sum`, intended for recognition/method-audit metadata rather than as a replacement for standard/reverse-chain/trig/substitution/parts/partial-fractions evaluation tags. k-notation remains deliberately brief and exam-focused.

## Step 70 - Numerical Integration and Trapezium Rule

Step 70 activates the full Year 13 numerical-integration topic using the existing `TrapeziumRuleBuilder`. The canonical sequence is one rotated trapezium -> long-way addition -> `1,2,...,2,1` -> estimate -> percentage error / concavity bound. `buildOrdinateTable()` is the shared x/y/coefficient projection for written work and ClassWiz TABLE checks, and `trapezium-rule` is the canonical method tag for the Step 71 audit.


## Step 71 integration method-tag audit

Step 71 adds no new student topic. `integration-method-vocabulary.js` is the canonical source for the ten Year 13 integration method/setup tags and their student-facing labels. `integration-method-audit.js` audits all 74 Step 60-70 integration question definitions and is enforced by `tests/integration_method_audit_step71_test.mjs`. Structural descriptors are kept out of `methodTags`.

## Step 72 - First-Order Differential Equations: Understand

Step 72 implements Plan 37.1-37.4 as an Understand-only topic. The canonical sequence is **translate rate statement -> recognise separability -> separate by multiplication/division -> stop/check -> integrate using the existing integration vocabulary -> interpret general family -> condition selects a particular solution**. The topic reuses `FamilyOfCurvesExplorer` and `EquationStepRenderer`; Step 73 assessment/modelling content is deliberately not implemented.

## Step 73 - First-Order Differential Equations AO1-AO3 and modelling limits

Step 73 completes the first-order differential-equations topic across Memorise, AO1, AO2 and AO3 while preserving the Step 72 Understand experience. The topic now practises initial/boundary conditions, proportionality contexts, signs/units, long-term behaviour, assumptions and realistic-domain limitations. Question diagnostics route to the first broken stage and reuse the shared Help/Memory/AO1 system. Post-separation integration continues to use the Step 71 canonical integration-method vocabulary.

## Step 74 - Full 9MA0 Calculus Modelling

Step 74 adds the full-course modelling topic `topic:y13:modelling:calculus` and the reusable `CalculusModellingScaffold`. The canonical modelling sequence is **variables/units/restrictions -> relationship -> target -> method -> solve -> interpret -> limitations**. The same scaffold is reused across optimisation, connected rates, parametric and implicit relationships, accumulation/area, numerical integration and differential equations. AO3 contexts remain technique-blind until the mathematical relationship and target have been identified. Exact-versus-numerical method choice is explicit, and existing topic/activity IDs remain the point-of-need support destinations.

## Step 75 - Method Selection, Mixed Practice and Full 9MA0 Mastery

Step 75 adds `topic:full:review:full-calculus-mastery` as the final topic-blind mastery layer. It reuses existing course `QuestionDefinition` objects by reference rather than creating a parallel final bank. AO1 separates method-only recognition, method order/rewrite-first decisions, and select-complete-check practice; AO2 adds selection explanation and order diagnosis; AO3 provides a mixed full-course mastery set. `FullCalculusMasteryModel` keeps recognition, order, execution and interpretation evidence separate while preserving the source question's precise diagnostic support target.

## Step 76 - Curriculum and planning-document coverage audit

Step 76 adds no student-facing curriculum. `src/scripts/curriculum-coverage-audit.js` traces planning Sections 5-39 to the existing TopicMetadata/activity routes and separately checks the Section 17 reusable visual systems. The audit passes with 34 curriculum sections traced to 33 implemented curriculum/review/mastery topics, zero missing sections and zero Year 12/Year 13 scope errors. Planning Section 15 remains deliberate: arbitrary area-between-curves is Year 13, while Year 12 retains integration-as-area, signed/total area and axis/straight-line bounded work. See `Calculus_Website_STEP_76_CURRICULUM_COVERAGE_AUDIT.md`.

## Step 77 - Mathematical correctness and generator batch audit

Step 77 adds no student-facing curriculum. `tests/mathematical_correctness_step77_test.mjs` batch-generates all 232 canonical question definitions across 32 reproducible seeds each (7,424 generated instances), checks every displayed choice through the live answer checker, verifies explicit generated numeric/algebraic expected values, and adds targeted regression assertions for undefined/vertical gradients, logarithm domains, substitution/parametric limit conversion, signed area, trapezium concavity bounds and reverse-chain / `f′/f` / neither classification. The audit found no mathematical generator defect requiring a source constraint change. See `Calculus_Website_STEP_77_MATHEMATICAL_GENERATOR_AUDIT.md`.

## Step 78 - Interactive and diagram visual audit

Step 78 adds a permanent extreme-state visual/interactive regression gate across the canonical diagram systems. It also hardens the shared `DiagramPrimitives.label()` primitive with `fitLabelViewPosition()` so labels at domain edges are shifted inside the SVG view instead of being clipped. No curriculum content is added. Live Chromium screenshot evidence remains unavailable in this environment because the bounded browser process times out before producing an image.

## Step 79 responsive/accessibility/reduced-motion audit

Step 79 adds no curriculum content. `tests/responsive_accessibility_step79_test.mjs` is the permanent release gate for shared 44px touch targets, visible focus, keyboard completion, definition access without hover, narrow-screen containment, core contrast/non-colour cues and reduced motion. Shared Help/Word Bank/Data/ClassWiz triggers now keep the 44px target at all breakpoints, the AreaExplorer split slider uses the same target, and `tokens.css` contains the central reduced-motion guard. The Step 36 reference regression remains mandatory after these shared-shell changes.

## Step 80 - Persistence, import/export and state recovery

Step 80 adds a permanent state-recovery release gate without adding curriculum. `navigation-route.js` is the shared URL/history adapter for the existing AppShell: stable activity IDs round-trip to the canonical five-segment routes, route changes are written to browser history, and Back/Forward restores the exact topic/mode/activity while preserving query parameters. `LocalStateStore` remains the only browser-storage boundary. User-selected imports now require complete progress and vocabulary collections before replacement, preventing a structurally incomplete JSON file from silently normalising to an empty state. Production `app-state.js` now starts a new profile from `createBlankAppState()` rather than prototype sample progress. The Step 80 audit covers all 586 implemented activity routes plus production blank-profile initialisation, clean-profile export/import, reset, corrupt-storage recovery and the existing transient-overlay state-retention contract.

## Step 81 - Code-reuse and performance cleanup

Step 81 adds no curriculum content and makes no intended student-facing behaviour change. A code-reuse audit confirmed that QuestionShell, browser storage, graph/diagram rendering and generated-assessment execution remain behind their canonical shared systems. The main avoidable duplication was the repeated five-mode label/descriptor/kicker logic across 20 completed topic activity adapters. `learning-mode-presentation.js` now owns those canonical presentation values, while topic-specific mathematical sequencing and pedagogy remain explicit. `tests/code_reuse_performance_step81_test.mjs` is the permanent reuse-boundary regression gate.

## Step 82 - Final end-to-end student journey and release checklist

Step 82 is the final numbered action-plan step and adds no curriculum or architecture redesign. `tests/final_student_journey_step82_test.mjs` permanently exercises representative Year 12 and full-A-level journeys from a blank profile through Understand, Memorise, generated practice, explicit failure -> exact diagnostic support -> successful retry, secure mastery evidence and clean-profile export/import recovery. `Calculus_Website_RELEASE_CHECKLIST.md` is the reusable release checklist for future updates. The source/runtime is code-ready for deployment after the complete release gates pass; production verification still requires host-specific SPA fallback, HTTPS/cache/deep-link checks and real-browser desktop/tablet/phone QA.
