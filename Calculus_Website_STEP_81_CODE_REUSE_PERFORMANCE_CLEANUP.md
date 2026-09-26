# Calculus Website - Step 81 Code-Reuse and Performance Cleanup

**Date:** 26 September 2026  
**Status:** Complete

## Scope

Step 81 audits completed runtime code for avoidable parallel implementations of question shells, graph primitives, mode styling/presentation, storage access, standard facts and generator infrastructure. It makes only behaviour-preserving reuse changes.

## Findings

### Question shell

There is one general `QuestionShell` implementation (`src/scripts/question-shell.js`) and one AppShell integration point. Topic activity adapters do not own alternative response/check/hint/solution shells.

### Graph and diagram primitives

Topic activity adapters do not create their own SVG/canvas renderers. Shared visual engines continue to compose the canonical graph/diagram systems. The existing Step 78 visual audit remains the release gate for extreme visual states.

### Persistence

`src/scripts/local-state-store.js` remains the only source module that accesses browser storage directly. No topic-local `localStorage` or `sessionStorage` path was found.

### Generator infrastructure

Canonical generated assessment still runs through `QuestionDefinition` + `GeneratorRunner` + `QuestionShell`. No topic-local random-number engine or second general generator runner was found in the audited assessment/activity adapters.

### Standard facts

Existing canonical shared fact sources remain in place where a single source is useful, including `standard-integrals-data.js` and `integration-method-vocabulary.js`. Repeated mathematical statements inside Memory Lab items, distractors, worked solutions and explanatory activities are retained where they are presentation-specific pedagogical content rather than parallel infrastructure.

### Mode presentation duplication

Twenty completed topic activity adapters independently repeated the same canonical mode label, descriptor and kicker ternaries. This was avoidable implementation duplication.

**Fix:** added `src/scripts/learning-mode-presentation.js` as a small shared presentation contract for the five canonical learning modes. The 20 adapters now consume `learningModeLabel()`, `learningModeDescriptor()` and `learningModeKicker()` instead of evaluating identical local ternaries. The helper rejects unknown mode IDs instead of silently inventing copy.

This is intentionally narrow: it does not absorb topic-specific captions, callouts, Memory Lab configuration or mathematical behaviour into a generic mega-builder.

## Performance decision

The audit did not identify a safe student-visible performance bottleneck that justified changing navigation, activity mounting, generator caching or interactive rendering. Those systems already preserve important transient state and route/persistence contracts. Step 81 therefore avoids speculative lazy-loading/remounting changes. The mode-presentation consolidation reduces repeated module-initialisation branching while preserving output byte-for-byte at the presentation-model level.

## Permanent regression gate

`tests/code_reuse_performance_step81_test.mjs` verifies:

- the shared five-mode presentation metadata and exact labels/descriptors/kickers;
- the 20 completed topic adapters consume the shared contract;
- the prior duplicated canonical ternaries are absent;
- only `LocalStateStore` accesses browser storage;
- there is one `createQuestionShell` factory;
- topic activity adapters do not create local SVG/canvas renderers;
- AppShell still consumes the shared QuestionShell and LocalStateStore.

## QA

- Dedicated Step 81 reuse audit: PASS.
- Complete runtime suite through Step 81: PASS.
- Step 36 frozen reference regression: PASS.
- Step 79 responsive/accessibility gate: PASS.
- Step 80 persistence/navigation gate: PASS (**586 canonical activity routes**).
- Static build: PASS.
- Frozen Step 79/80 reference files: unchanged by Step 81.
- No browser visual QA is claimed: Step 81 is a non-visual refactor and no successful browser capture was produced as part of this step.

## Architecture decision

`LearningModePresentation` is a presentation-only shared contract. It may own canonical mode labels/descriptors/kickers, but it must not become a generic topic/activity builder that hides mathematical sequencing or topic-specific pedagogy. Topic adapters remain explicit about mathematical content while reusing shared infrastructure.
