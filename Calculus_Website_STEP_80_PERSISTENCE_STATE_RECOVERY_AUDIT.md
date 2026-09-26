# Calculus Website - Step 80 Persistence, Import/Export and State-Recovery Audit

**Date:** 26 September 2026  
**Status:** Complete

## Scope

Step 80 audits the shared state boundary rather than adding curriculum. The audited journeys are refresh/persistence, canonical route changes, browser Back/Forward, transient overlays, progress export/import/reset, malformed/corrupt data handling, and restoration into a clean profile.

## Findings and fixes

### 1. Browser history did not restore stable activity routes

TopicMetadata has exposed canonical five-segment activity routes throughout the project, but AppShell navigation did not previously write those routes to browser history. Browser Back/Forward therefore could not restore the exact topic, mode and activity.

**Fix:** added `src/scripts/navigation-route.js` as the shared route/history adapter. It derives a canonical route from the stable activity ID, resolves a route back to topic/mode/activity, preserves query parameters, batches synchronous internal navigation into one history write, restores exact activities on `popstate`, and replaces the initial browser entry with the canonical current activity route. AppShell remains the navigation owner; the new module is a small state/URL adapter, not a second router.

The permanent audit verifies all **586 implemented activity routes** round-trip between ID and route and resolve to a real runtime activity.

### 2. Incomplete imports could silently normalize to empty state

`LocalStateStore.inspectImport()` correctly rejected invalid JSON, wrong app IDs and future schema versions, but an envelope with the correct app/version and an incomplete `state` object could normalize missing slices to blanks. Confirming such an import could therefore replace valid local progress with an empty state.

**Fix:** import inspection now requires both `state.progress.activities` and `state.vocabulary.records` to be object collections before replacement. Internal loading still retains the existing normalization/recovery path, while user-selected import files fail before mutation when structurally incomplete.


### 3. Fresh production profiles still contained prototype sample progress

`app-state.js` still initialised a brand-new browser profile with early prototype/sample completion records. That made a genuinely clean first visit appear to contain learner history and weakened the meaning of clean-profile import/reset testing.

**Fix:** production app state now starts from `createBlankAppState()` and reset returns to the same blank versioned shape. The Step 80 gate asserts that the production state module contains no prototype seeding path.

## Persistence/recovery contract verified

- `LocalStateStore` remains the only source file allowed to touch browser `localStorage` directly.
- Progress and vocabulary survive creation of a fresh store instance against the same storage adapter.
- A genuinely new production profile starts with no fabricated/sample progress records.
- Exported data restores both progress and Word Bank state into a clean profile.
- Reset persists a blank state so refresh does not resurrect previous records.
- Invalid JSON, wrong app IDs, unsupported schema versions and incomplete state payloads are rejected before import.
- Corrupt stored JSON fails closed to safe in-memory state; the next valid state mutation can overwrite the corrupt value and restore persistent operation.
- Existing QuestionShell state retention plus AppShell overlay behaviour preserve current question/interactive work across Help, Word Bank, Data and ClassWiz overlays because those overlays do not remount the underlying activity.
- Stable activity routes are now reflected in browser history, and Back/Forward restores the exact topic/mode/activity through the shared route controller.
- Query parameters such as generator debug seeds are preserved during route writes.

## Permanent regression gate

`tests/persistence_state_recovery_step80_test.mjs` is the Step 80 release gate. It audits all canonical activity routes plus export/import/reset/recovery behaviour. Future persistence or navigation-state changes should extend this test instead of introducing topic-local storage or a second router.

## Architecture decision

Long-term learner data remains limited to the versioned `LocalStateStore` slices (`progress`, `vocabulary`). Transient question/interactive state remains owned by the mounted QuestionShell/interactive instance and is **not** written to local storage merely to survive drawers or dialogs. URL/history state identifies navigation location only; it does not become a second persistence store.

## QA

- Dedicated Step 80 persistence/state-recovery audit: PASS (**586 canonical activity routes**, production clean-profile start, export/import/reset/recovery).
- Complete runtime regression suite through Step 80: PASS.
- Static build: PASS.
- Step 36 reference-topic regression: PASS as part of the full suite.
- Step 79 -> Step 80 monitored frozen-source comparison: **7/7 unchanged**.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded 390x844 Chromium attempt: **exit 124; no screenshot produced**. Browser visual QA is not claimed.
- Step 79 -> Step 80 monitored frozen-file comparison: PASS (**7/7 unchanged**).
- Canonical project quality harness: PASS (**21 passed, 0 failed, 0 skipped**).
- Bounded 390x844 Chromium attempt: timed out with exit 124; no screenshot produced, so browser visual QA is not claimed.

Step 80 intentionally changes shared `app-shell.js` and `local-state-store.js` under the numbered persistence/navigation audit. The Step 79 runtime is therefore the comparison baseline; reference behaviour remains protected by the full regression gate.
