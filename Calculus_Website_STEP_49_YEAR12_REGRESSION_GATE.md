# Calculus Website - Step 49 Year 12 Regression Gate

**Date:** 2026-09-25  
**Status:** Complete

## Gate scope

Step 49 audits the completed Year 12 / 8MA0 implementation from planning Sections 5-16 before any additional Year 13 / 9MA0 topic work begins.

The automated gate covers:

- plan-to-topic traceability for Sections 5-14 and 16;
- the Section 15 placement rule that general area between arbitrary curves remains in the additional Year 13 pathway;
- Year 12 / 8MA0 scope identity;
- TopicMetadata-to-live-activity agreement;
- canonical five-segment routes;
- vocabulary resolution and Memory Lab availability;
- progress-mode applicability, including Pre-calculus Understand-only and Review without an artificial Understand mode;
- shared QuestionDefinition / GeneratorRunner validity across every Year 12 AO activity;
- the visible Year 12 review checkpoint before the additional-9MA0 navigation boundary;
- fixed AppShell / internal-scroll and topic-level responsive-collapse contracts.

## Finding and correction

The gate found one metadata-ordering defect. The frozen first two Year 12 topics use sequence values `10` and `20`, while Steps 38-48 had introduced later topic sequence values `3` through `11`. Navigation was visually correct because it is currently explicit in the AppShell, but a future metadata-driven ordering would have placed those topics incorrectly.

The later Year 12 TopicMetadata sequence values were normalized to `30, 40, ... 110`, preserving the frozen Basics topic unchanged. No student-facing content, route, activity ID, micro-skill ID, generated-question identity, persistence contract or shared shell component changed.

## Regression result

- static build: PASS;
- complete runtime automated suite: PASS;
- Step 49 Year 12 regression test: PASS;
- Step 36 reference-topic regression: PASS as part of the full suite;
- frozen reference source comparison: 7/7 unchanged;
- canonical quality harness: PASS after governance update;
- managed Chromium visual attempt: timed out (exit 124) and produced no screenshot, so visual-browser QA is not claimed.

## Boundary decision

Year 12 is cleared as the stable 8MA0 boundary. The next numbered step may begin the additional Year 13 / 9MA0 pathway, starting with Step 50 - Standard Functions. Step 49 does not implement any Step 50 content.
