# Calculus Website - Step 77 Mathematical Correctness and Generator Batch Audit

**Status:** COMPLETE - all sampled generators and targeted boundary cases pass; no curriculum correction was required.

## Audit scope

Step 77 audits the existing canonical generated-question catalogue rather than adding new curriculum. The permanent regression gate is `tests/mathematical_correctness_step77_test.mjs`.

- Canonical `QuestionDefinition` objects audited: **232**.
- Reproducible seed families: **32 per definition** (16 representative + 16 boundary-labelled seeds).
- Generated question instances audited: **7,424**.
- Choice-question instances with every displayed option checked through the live `answerChecker`: **6,080**.
- Generated numeric/algebraic explicit expected-answer checks: **192**.
- Generator/math defects requiring source correction: **0**.
- Previously failing production seed requiring a regression constraint: **0**.

## Permanent batch checks

For every canonical definition and audit seed, the Step 77 gate verifies:

1. The same definition + seed + sequence regenerates the same parameters, prompt, options, hints and worked solution.
2. Prompt/solution rendering contains no `NaN`, `Infinity` or `[object Object]` leakage.
3. Worked solutions contain non-empty mathematical expressions.
4. A deliberately invalid response is never accepted as correct.
5. Every choice question has **exactly one** displayed option accepted by its own answer checker.
6. When generated parameters expose an explicit scalar `expected`, `answer`, `gradient`, `rate` or `slope`, that value is accepted by the live checker.

This checks the generator, rendered item, checker and worked-solution path together rather than validating only the parameter generator in isolation.

## High-risk calculus boundary checks

### Undefined gradients and vertical tangents

- A horizontal tangent correctly produces a **vertical normal** rather than the invalid numeric expression `-1/0`.
- In parametric differentiation, `dx/dt = 0` with `dy/dt != 0` is classified as a **vertical tangent** and the worked solution explicitly avoids division by zero / a finite-gradient claim.

### Logarithm domains

- The standard reciprocal integral renders `ln|x| + C`, not unrestricted `ln x + C`.
- The integration-by-parts `integral ln x dx` case states the real-domain condition **`x > 0`**.

### Definite-limit changes

- Substitution converts `x=0,1` to the correct `u=1,2` limits before evaluating in `u`.
- Parametric-area questions convert x-boundaries to matching t-limits.
- Direction-sensitive parametric area with `dx/dt < 0` explicitly reverses orientation / negates the signed integral for positive geometrical area.

### Signed area

- Equal +7 and -7 region contributions cancel to a signed integral of 0.
- Total geometrical area uses magnitudes, e.g. `|3|+|-4|+|2| = 9`.

### Concavity claims

The canonical `TrapeziumRuleBuilder` bound classifier is checked at all three boundary types:

- convex interval -> **overestimate**;
- concave interval -> **underestimate**;
- changing concavity -> **mixed**, with no whole-interval over/under claim.

### Recognition classifications

The reverse-chain recognition generator is batch-checked until all three branches are reached and correctly classified:

- `reverse-chain`;
- `f-prime-over-f`;
- `neither`.

The Step 71 integration-method vocabulary remains unique and canonical.

## Audit decision

**No generator constraint or curriculum mathematics needed correction in Step 77.** The representative/boundary batches are clean. The correct implementation action is to keep the new batch audit in the canonical runtime suite so future changes can reproduce any failing seed immediately.

## Final QA evidence

- Dedicated Step 77 mathematical/generator audit: **PASS**.
- Complete runtime suite through Step 77: **PASS**.
- Static build: **PASS**.
- Student-facing UI changes: **none**.

Step 78 should proceed to the separate interactive/diagram visual audit rather than broadening the curriculum.

### Final release QA

- Canonical quality harness: 21 passed, 0 failed, 0 skipped.
- Implementation-log continuity: Steps 1-77 present once and marked Complete.
- Frozen Step 36 reference files: 7/7 SHA-256 hashes unchanged from the Step 76 baseline.
- Bounded 390x844 Chromium capture: timed out with exit 124 and produced no screenshot; browser visual QA is therefore not claimed.
