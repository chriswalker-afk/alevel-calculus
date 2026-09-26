# Calculus Website - Step 82 Final End-to-End Student Journey and Release Checklist

**Date:** 26 September 2026  
**Status:** Complete

## Scope

Step 82 is the final planned implementation/audit step. It adds no curriculum and makes no architectural redesign. It verifies that the completed systems behave as one coherent learning application across representative Year 12 and full A level journeys, including diagnostic recovery, mastery evidence and persisted state recovery.

## Permanent release gate

Added `tests/final_student_journey_step82_test.mjs` and appended it to `tests/run_tests.sh`.

The gate begins from a genuinely blank `LocalStateStore` profile and drives two representative journeys through the existing canonical domain/runtime systems.

### Year 12 journey

1. First visit begins with no saved progress or vocabulary.
2. Visit and complete a Basics of Differentiation Understand activity.
3. Visit and complete a Basics Memorise activity.
4. Encounter vocabulary through the shared `VocabularyStore`.
5. Generate canonical AO1 graph-matching practice through `QuestionDefinition` + `GeneratorRunner`.
6. Submit a real distractor and record a failed attempt.
7. Resolve the failure through `DiagnosticRouter` to an exact existing support activity/route.
8. Visit that support destination.
9. Retry the same generated question using its correct choice and record success/completion.
10. Generate the Year 12 diagnostic-mastery set and verify AO1/AO2/AO3 representation.
11. Record completed/secure Year 12 mastery evidence.
12. Verify `MasteryFeedbackModel` still preserves the failed evidence as an actionable next step even after the successful retry.

### Full A level journey

1. Visit and complete representative Year 13 substitution Understand work.
2. Visit and complete representative substitution Memorise work.
3. Complete representative substitution AO1 practice.
4. Enter the final `Full 9MA0 calculus mastery` AO3 mixed set.
5. Select a diagnostically routable generated choice question.
6. Submit a real distractor and record failure.
7. Follow the exact diagnostic support target.
8. Retry the same item successfully.
9. Record secure final mastery evidence.
10. Verify `FullCalculusMasteryModel` records both failure and success while retaining its recognition/order/execution/interpretation dimension contract.

### State recovery at the end of the journey

The combined populated learner state is exported through `LocalStateStore`, imported into a new clean in-memory profile, and compared for exact progress/vocabulary equality. The restored profile retains secure Year 12 and full-A-level mastery plus both two-attempt failure/retry histories.

## Route and reuse assertions

The Step 82 gate also verifies that every journey/support route it touches retains the canonical five-segment shape and round-trips through `activityRouteFromId()` / `parseActivityRoute()`.

No new question shell, generator, diagnostic system, mastery store, route format, persistence layer or topic-local browser storage is introduced.

## Reusable release checklist

`Calculus_Website_RELEASE_CHECKLIST.md` is now the canonical release checklist for this project and future updates. It covers:

- governance/reuse/frozen-reference baseline;
- complete automated runtime gates;
- both representative student journeys;
- persistence/navigation;
- accessibility/responsive behaviour;
- real-browser visual QA;
- deployment-host checks;
- evidence, restore archive and clean-extraction verification.

## Release status

The source/runtime implementation is **code-ready for deployment** once the Step 82 final gates and clean-restore verification pass. No further architectural work is identified by the numbered action plan.

Production verification still requires host-specific checks that cannot be proven by the static runtime alone.

## Final known limitations

1. **Production SPA fallback is host-specific.** Direct refreshes of canonical five-segment activity routes require the selected host to rewrite/fallback to `index.html`. The source/runtime cannot configure an unknown deployment platform.
2. **Real-browser visual capture remains environment-dependent.** Previous bounded Chromium attempts at Steps 78-80 timed out without screenshots. Automated diagram/state/responsive/accessibility gates are strong regression evidence, but they are not a substitute for desktop/tablet/phone captures on the final deployment candidate. Step 82 only claims browser visual QA if a new capture actually succeeds.
3. **Production networking/cache/security context is unverified until deployment.** HTTPS, cache behaviour, deep-link asset loading, browser storage availability and console cleanliness must be checked on the chosen host.
4. **The static site intentionally has no server account/sync layer.** Learner persistence is local to the browser profile and export/import is the portable recovery mechanism. This is an explicit architecture choice, not a Step 82 defect.

None of these known limitations requires further calculus-content or application-architecture work before selecting/configuring a deployment target.

## Browser capture attempt

A fresh Step 82 desktop Chromium capture was attempted against the rebuilt static site. The bounded process timed out with exit code 124 and produced no screenshot. Therefore Step 82 does not claim live-browser visual QA; the release checklist explicitly carries desktop/tablet/phone capture forward to production verification.
