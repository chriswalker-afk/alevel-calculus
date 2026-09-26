# Calculus Website - Step 66: Integration Using Partial Fractions

**Status:** Complete  
**Plan:** Plan 32  
**Canonical topic:** `topic:y13:integration:partial-fractions`

## Scope completed

Step 66 implements the full five-mode partial-fractions integration topic without introducing a second integration framework. The learning journey is:

**Recognise rational function -> make proper -> choose decomposition -> find coefficients -> integrate simple terms -> combine logarithms**

Understand explicitly separates algebraic decomposition from calculus. Students review proper versus improper rational functions, polynomial division, distinct and repeated linear-factor structures, coefficient finding/verification, term-by-term integration and exact logarithm simplification. Memorise/AO1-AO3 reuse the shared Memory Lab and generated-question systems.

## Reuse decisions

- `partial-fractions-model.js` is the canonical reusable algebraic decomposition model.
- Step 60 `STANDARD_INTEGRAL_DEFINITIONS` are consumed by reference; they are not copied.
- Step 62's shared integration-method vocabulary is extended with one canonical tag: `partial-fractions`.
- Step 65's method-positioning sequence now includes partial fractions before integration by parts.
- Existing `EquationStepRenderer`, Memory Lab, `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`, Help/diagnostics, vocabulary, AppShell, progress and persistence systems remain canonical.

## Mathematical conventions

- Improper rational functions: polynomial division first.
- Distinct linear factors: one simple-fraction term per factor, including up to three factors in the recap/assessment set.
- Repeated linear factors: include every power up to the repeated power.
- Coefficients: convenient substitutions and/or coefficient comparison, followed by verification.
- Repeated-power terms may integrate using the power rule rather than logarithms.
- Log laws are explicit; combining the arbitrary constant via `C = ln K` uses `K > 0`.
- Definite answers remain exact.

## QA

- Dedicated Step 66 contract: PASS.
- Complete runtime suite through Step 66: PASS.
- Static build: PASS.
- Step 36 frozen-reference regression: PASS.
- Frozen reference source comparison: 7/7 unchanged from Step 65.
- Canonical project quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width capture: timed out with exit 124 and produced no screenshot; browser visual QA is **not claimed**.

## Stop boundary

Step 67 is not implemented in this step.
