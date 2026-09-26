# Step 63 - Integration by Substitution - Understand (Plan 30.1-30.4)

**Status:** Complete  
**Scope:** Year 13 additional / 9MA0  
**Topic:** `topic:y13:integration:substitution`

## Implemented

- A reusable substitution data layer in `src/scripts/substitution-data.js` containing the Plan 30.1-30.4 worked examples, choosing-u guidance, change-everything checklist and deliberate unhelpful substitutions.
- Direct reuse of Step 61 reverse-chain recognition data and Step 62's canonical `substitution` method tag rather than creating a parallel integration-method vocabulary.
- A reusable `VariableTransformationWorkspace` in `src/scripts/variable-transformation-workspace.js`. It models original, substitution, fully transformed, integrated and finished states and provides a shared validator that rejects mixed `x`/`u` states or a mismatched `dx`/`du` differential.
- Four Understand activities matching the requested scope exactly:
  1. why substitution, including the same integral solved by fast reverse-chain recognition and systematic substitution;
  2. change everything, with the integrand and differential transformed together and invalid mixed-variable states explicitly rejected;
  3. indefinite vs definite workflows, including explicit `x=a`, `x=b` endpoint display before converting to u-limits and the rule to stay in u once definite limits have changed;
  4. choosing u, using inner-function, denominator, repeated-expression and derivative-present cues plus deliberately unhelpful proposals.
- Common useful choices including `u=ax+b`, `u=x^2+a` and `u=ax^2+bx+c`.
- Canonical substitution/differential vocabulary entries and precise Understand Help routes.
- AppShell activation of the existing Year 13 substitution navigation item with **Understand as the only enabled mode**. Step 64 modes have not been implemented early.

## Reuse decisions

Step 63 adds one reusable variable-transformation workspace, not a new integration shell. `REVERSE_CHAIN_SUBSTITUTION_SOURCE` points directly to Step 61 recognition examples, and `SUBSTITUTION_METHOD_TAG` consumes Step 62's `INTEGRATION_METHOD_TAGS.substitution`. The workspace is designed to be reused by Step 64 worked practice and generated questions.

The durable transformation invariant is **one integration variable at a time**. After `u=g(x)` is chosen, the integrand and differential must be transformed consistently; for definite work the limits must also be transformed. A state containing both x and u, u with dx, or x with du is invalid unless it is the explicit bridge line where the substitution relationship is being stated.

No Step 64 Memory Lab, question generators, AO activities or assessment diagnostics were introduced. Existing AppShell, Help, vocabulary, progress, ClassWiz and persistence systems remain canonical.

## QA

- Dedicated Step 63 substitution-Understand regression: PASS.
- Full runtime suite through Step 63: PASS.
- Static build: PASS.
- Step 36 frozen reference files: 7/7 byte-for-byte unchanged from Step 62.
- Canonical quality harness: PASS - 21 passed, 0 failed, 0 skipped; implementation-log continuity through Step 63 confirmed.
- Bounded managed Chromium phone-width attempt: timed out with exit 124 and produced no screenshot; browser visual QA is not claimed.

## Boundary

Step 64 has not been implemented in this step.
