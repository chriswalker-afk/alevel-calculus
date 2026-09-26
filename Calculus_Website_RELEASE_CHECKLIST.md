# Calculus Website Release Checklist

**Canonical from:** Step 82  
**Purpose:** Reuse this checklist for every deployment/release candidate after the initial Step 82 release audit.

A release candidate is ready only when every applicable automated gate passes, deployment-only checks are explicitly completed, and any remaining limitations are recorded rather than implied away.

## 1. Source and governance baseline

- [ ] Begin from the latest canonical runtime restore archive and matching implementation log.
- [ ] Confirm the implementation log is continuous with no duplicated or incomplete numbered steps.
- [ ] Check the reuse registry before adding or replacing shared infrastructure.
- [ ] Confirm no unplanned curriculum content has been introduced.
- [ ] If a shared/frozen system changed, rerun the Step 36 reference-topic regression and compare the monitored frozen files against the previous canonical baseline.

## 2. Complete automated runtime gates

Run from `calculus-site/`:

```sh
./tests/run_tests.sh
python3 tools/build_static.py
```

The complete test runner must include and pass at least:

- Step 36 reference-topic freeze;
- Step 49 Year 12 regression gate;
- Step 71 integration-method tag audit;
- Step 76 curriculum/planning coverage audit;
- Step 77 mathematical/generator batch audit;
- Step 78 interactive/diagram extreme-state audit;
- Step 79 responsive/accessibility/reduced-motion audit;
- Step 80 persistence/navigation/state-recovery audit;
- Step 81 code-reuse/performance boundary audit;
- Step 82 end-to-end student journey gate.

No release should proceed with a failing gate.

## 3. Representative student journeys

### Year 12 journey

- [ ] Start from a blank learner profile.
- [ ] Open a canonical Year 12 Understand activity.
- [ ] Complete representative Understand work.
- [ ] Move to Memorise and complete representative Memory Lab/retrieval work.
- [ ] Move to generated AO practice.
- [ ] Submit an incorrect response.
- [ ] Confirm the failure resolves to an exact existing diagnostic support target.
- [ ] Visit the support target without losing learner progress.
- [ ] Retry the same generated item successfully.
- [ ] Reach Year 12 diagnostic mastery and record secure mastery evidence.

### Full A level journey

- [ ] Complete representative Year 13 Understand work.
- [ ] Complete representative Memorise work.
- [ ] Complete representative generated practice.
- [ ] Enter Full 9MA0 mixed mastery.
- [ ] Submit an incorrect response.
- [ ] Confirm the exact diagnostic target and route.
- [ ] Retry successfully.
- [ ] Confirm final mastery evidence separates recognition/order/execution/interpretation as applicable.
- [ ] Record secure final mastery evidence.

`tests/final_student_journey_step82_test.mjs` is the permanent automated model-level version of these two journeys.

## 4. Persistence and navigation

- [ ] Fresh profile begins blank.
- [ ] All stable activity IDs round-trip to canonical five-segment routes.
- [ ] Browser Back/Forward restores topic, mode and activity.
- [ ] Query parameters such as debug seeds survive route writes.
- [ ] Help/Word Bank/Data/ClassWiz overlays do not discard mounted activity/question state.
- [ ] Only `LocalStateStore` accesses browser storage directly.
- [ ] Export data from a populated profile.
- [ ] Import it into a clean profile and verify progress plus vocabulary are restored.
- [ ] Reset persists a blank state across refresh.
- [ ] Invalid, future-version and structurally incomplete imports are rejected before replacement.

## 5. Accessibility and responsive behaviour

- [ ] Shared actionable controls retain the 44px minimum target.
- [ ] Visible keyboard focus remains present.
- [ ] Core student journeys can be completed without a mouse.
- [ ] Hover-only information has focus/tap access.
- [ ] Drawers/dialogs support Escape and sensible focus return.
- [ ] Colour is not the only semantic cue.
- [ ] Reduced-motion preference suppresses non-essential transitions/animations.
- [ ] Narrow layouts use the same AppShell and keep mathematics readable by stacking/scrolling rather than excessive shrinking.

## 6. Browser visual QA

Automated DOM/state audits are not a substitute for an actual browser capture.

For every production release candidate:

- [ ] Capture and inspect at least one desktop viewport.
- [ ] Capture and inspect at least one tablet viewport.
- [ ] Capture and inspect at least one narrow/phone viewport.
- [ ] Check the reference topic across Understand, Memorise and practice states.
- [ ] Check representative Year 13 interactive/diagram states.
- [ ] Check Help, Word Bank, Data and ClassWiz overlays.
- [ ] Check at least one incorrect-feedback/diagnostic state and one worked-solution state.
- [ ] Check reduced-motion behaviour in a real browser where supported.

If the environment cannot produce a capture, record that limitation explicitly and do not claim browser visual QA.

## 7. Deployment-host checks

These checks cannot be completed by the static source tree alone and must be verified on the chosen host:

- [ ] HTTPS is enabled.
- [ ] Canonical five-segment activity URLs directly refresh to the SPA entry point rather than returning 404.
- [ ] Static assets resolve correctly from canonical deep links.
- [ ] Cache policy does not strand users on mismatched HTML/JS/CSS versions after a release.
- [ ] Export/import works in the production browser security context.
- [ ] Browser storage is available or the UI accurately reports a non-persistent session.
- [ ] No console errors occur during the two representative student journeys.

## 8. Release evidence and restore point

- [ ] Save runtime test output.
- [ ] Save static-build output.
- [ ] Save quality-harness output.
- [ ] Save relevant frozen-reference/accessibility/persistence gate outputs.
- [ ] Save browser screenshots when actual captures succeed.
- [ ] Document known limitations.
- [ ] Update implementation log and reuse registry when applicable.
- [ ] Create a canonical runtime ZIP.
- [ ] Extract that ZIP into a clean directory and rerun the complete test suite plus static build.
- [ ] Produce the matching handoff bundle and verify its checksums/manifest.

## Release decision rule

A candidate is **code-ready for deployment** when all source/runtime gates pass and no known limitation requires architectural change. It becomes **production-verified** only after the deployment-host and real-browser checks above have also been completed on the selected hosting environment.
