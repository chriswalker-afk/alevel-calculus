# Step 57 - Concavity, Convexity and Inflection

**Status:** Complete  
**Plan:** 24  
**Scope:** Additional Year 13 / 9MA0  
**Topic:** `topic:y13:differentiation:concavity-inflection`

## Purpose

Implement the Year 13 second-derivative curve-shape topic without creating a topic-specific graph, memory, question, diagnostic or persistence engine. The topic must connect the sign of the second derivative to changing gradient, distinguish candidate points from confirmed inflection points, and separate the inflection test from the stationary/non-stationary classification.

## Implemented learning journey

### Understand

1. **Read `f''` as change of gradient**
   - Reuses `LinkedFunctionGradientExplorer` with `f`, `f'` and `f''` visible together.
   - Students connect positive `f''` with increasing tangent gradient and negative `f''` with decreasing tangent gradient.

2. **Concave or convex?**
   - Uses the same linked explorer so curve shape and the sign of `f''` remain synchronized.
   - `f'' < 0` is used for concave intervals; `f'' > 0` for convex intervals.

3. **`f''=0` is only a candidate**
   - Compares `f(x)=x^3` and `f(x)=x^4` at the origin.
   - Both satisfy `f''(0)=0`, but `x^3` changes the sign of `f''` and `x^4` does not.
   - The reusable helper `hasInflectionBySignChange(...)` checks the sign on either side of the candidate.

4. **Stationary and non-stationary inflections**
   - Separates two questions:
     1. Does `f''` change sign? If yes, there is an inflection.
     2. Is `f'=0` there? If yes it is stationary; otherwise it is non-stationary.
   - Uses `x^3` and `x^3+x` as representative models.

5. **Solve and interpret**
   - Reuses `EquationStepRenderer` for the sequence `solve f''=0 -> build/sign-check intervals -> conclude curve shape/inflection`.
   - Keeps algebra and interpretation visibly separate.

### Memorise

The canonical `MemoryLab` now covers:
- second derivative as rate of change of gradient;
- concave/convex sign conventions;
- `f''=0` as a candidate rather than a sufficient test;
- the sign-change test for inflection;
- stationary versus non-stationary inflections;
- the solve -> sign chart -> conclude method.

Existing memory games and mixed-review infrastructure are reused.

### AO1

Generated question sets cover:
- interpreting the sign of `f''`;
- finding concave/convex intervals;
- finding candidate inflection points and confirming/classifying them.

### AO2

Generated reasoning/diagnostic work covers:
- explaining why `f''>0` corresponds to a convex curve via increasing `f'`;
- diagnosing the invalid inference “`f''=0`, therefore this is an inflection point”.

### AO3

Application work combines solving for second-derivative sign changes with interval interpretation and curve-sketching information.

## Reuse and architecture decisions

- **No `ConcavityGraphExplorer` was created.** The topic configures the registered `LinkedFunctionGradientExplorer` with `revealSecondDerivative:true` and `allowSecondDerivative:true`.
- `EquationStepRenderer` remains the canonical staged algebra renderer.
- `MemoryLab`, memory-game/review engines, `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`, `DiagnosticRouter`, Help routing, `VocabularyTerm`, AppShell, progress and persistence are reused unchanged as architectural contracts.
- Topic-specific code supplies mathematics, learning sequence and orchestration only.

## Durable mathematical/pedagogical invariants

- `f''` is interpreted as the rate of change of `f'` / tangent gradient.
- `f''<0` -> concave; `f''>0` -> convex.
- `f''(a)=0` alone is **not sufficient** for a point of inflection.
- A point of inflection is confirmed by a change in sign of `f''` across the point.
- Stationary/non-stationary classification is separate: inspect `f'(a)` only after the inflection has been confirmed.
- The `x^4` counterexample must remain available because it prevents the common false rule “solve `f''=0` and call every solution an inflection”.

## Verification

- Dedicated Step 57 regression: PASS.
- Complete runtime suite through Step 57: PASS.
- Step 36 frozen-reference regression: PASS.
- Step 49 Year 12 regression gate: PASS.
- Static build: PASS.
- Frozen reference files: **7/7 byte-for-byte unchanged**.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped**.
- Managed Chromium phone-width attempt: exit 124, no screenshot produced; browser visual QA is **not claimed**.

## Step boundary

No Connected Rates / Step 58 curriculum implementation is included in this step.
