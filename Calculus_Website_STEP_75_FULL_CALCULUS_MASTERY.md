# Step 75 - Method Selection, Mixed Practice and Full 9MA0 Mastery (Plan 39)

## Status
Complete.

## What was implemented
- Added `topic:full:review:full-calculus-mastery` with AO1, AO2 and AO3 mastery activities.
- Added method-only selection, simplify/rewrite/which-method-first, select-complete-check, select-and-explain, order diagnosis and final mixed AO1-AO3 mastery activities.
- Reused existing `QuestionDefinition` objects directly. The registered definition count remains 232; Step 75 adds no parallel final question bank.
- Added `FullCalculusMasteryModel` to classify mastery evidence into **recognition**, **order**, **execution** and **interpretation** while preserving the source question's existing diagnostic/deep-link target.
- Kept the final practice topic-blind by default. Method-order work includes rewrite-first and multi-method decisions.

## Reuse contract
Step 75 is an orchestration layer over existing question banks/tags. Source question metadata, solutions, error categories and support destinations remain authoritative. Do not copy source prompts/solutions into a second final-course bank.

## Diagnostic contract
The final mastery layer separates:
1. recognition - choosing the relevant structure/method;
2. order - simplify/rewrite first and sequencing multiple methods;
3. execution - carrying out the chosen route accurately;
4. interpretation - explaining/finishing in context.

Precise remediation continues to use each source question's canonical diagnostic target.

## QA
- Dedicated Step 75 regression: PASS.
- Complete runtime suite through Step 75: PASS.
- Static build: PASS.
- Step 36 frozen-reference regression: PASS through the normal suite.
- Frozen Step 36 source comparison: 7/7 unchanged.
- Canonical quality harness: 21 passed, 0 failed, 0 skipped.
- Bounded 390x844 Chromium attempt: exit 124; no screenshot produced, so browser visual QA is not claimed.
