# Step 60 - Standard Integrals to Memorise (Plan 27)

**Status:** Complete  
**Scope:** Year 13 additional / 9MA0  
**Topic:** `topic:y13:integration:standard-integrals`

## Implemented

- Central reusable standard-integral definitions in `src/scripts/standard-integrals-data.js`.
- Core array: power, reciprocal/logarithm, exponential, trigonometric and further-trig standard forms.
- Reusable `ax+b` forms, including reciprocal and power forms with the correct coefficient adjustment.
- Understand journey: integration as reverse differentiation, standard-array exploration, linear-input adjustment, the **Fundamental Theorem of Calculus**, and recovery of `f(x)` from `f'(x)` including determination of `C` from a point.
- Memorise journey through the existing Memory Lab, games and mixed review.
- AO1 standard/linear/definite/function-recovery/error-checking generators, AO2 reasoning/checking and AO3 exact application.
- Exact Help/diagnostic support routes, vocabulary, progress and Year 13 scope/navigation integration.
- Existing ClassWiz numerical derivative/definite-integral checking support is available for this topic; numerical results are explicitly checks only and symbolic integration remains required.

## Reuse decisions

Step 60 introduces no second memory, question, diagnostic, equation or persistence system. Later integration topics should import `STANDARD_INTEGRAL_DEFINITIONS` (or its core/linear subsets) instead of maintaining local copies of standard results. `EquationStepRenderer`, `MemoryLab`, `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`, `DiagnosticRouter`, Help, Word Bank and AppShell remain canonical.

## QA

- Full runtime suite through Step 60: PASS.
- Dedicated Step 60 regression: PASS.
- Static build: PASS.
- Frozen reference files: 7/7 byte-for-byte unchanged from Step 59.
- Canonical quality harness: recorded in `qa-artifacts-step60-quality-harness.txt` after governance sync.
- Bounded managed Chromium phone-width attempt: exit 124, no screenshot produced; browser visual QA is not claimed.

## Boundary

Step 61 (Recognition and Reverse Chain Rule) has not been implemented in this step.
