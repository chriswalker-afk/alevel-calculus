# Calculus Website - Step 51: First-Principles Proofs for Trig Derivatives

**Status:** Complete  
**Plan:** Plan 19  
**Scope:** Additional Year 13 / 9MA0  
**Depends on:** Steps 38 and 50

## Implemented outcome

Step 51 adds the full five-mode **Trig Derivatives from First Principles** topic. The teaching journey is locked to:

**small-angle visual evidence -> key limits -> first-principles definition -> angle-addition identities -> derivative of sin/cos -> reconstruction and application**.

Radians are explicit throughout. Numerical/table evidence is presented as evidence that supports the two limits, never as a replacement for proof.

## Understand

The Understand journey includes:

1. **Small-angle evidence** - shared `DiagramPrimitives` show `y = sin h` against `y = h`, `y = cos h` against `y = 1`, and a unit-circle geometric view. A scale control lets students inspect increasingly small angles.
2. **The two key limits** - numerical values from positive and negative `h` support
   - `lim(h->0) sin h / h = 1`
   - `lim(h->0) (cos h - 1) / h = 0`.
3. **Deriving `d/dx(sin x)`** - the first-principles quotient and angle-addition identity are revealed line by line with the shared `EquationStepRenderer`; the exact locations where each small-angle limit is substituted are visible.
4. **Deriving `d/dx(cos x)`** - the same staged proof architecture is reused and makes the negative sign traceable.
5. **Compare the proofs** - students identify the common structure and locate the different coefficient/sign outcome.

## Memorise and assessment

Memorise reuses the canonical `MemoryLab`, shared game/review engines and canonical vocabulary. Retrieval covers the two key limits, angle-addition identities, first-principles structure, proof sequence and why radians are required.

AO1-AO3 reuse `QuestionDefinition`, `GeneratorRunner`, `QuestionShell` and `DiagnosticRouter`:

- **AO1:** use the limits/identities and complete missing derivation steps.
- **AO2:** explain why radians matter, identify exactly where each limit enters a proof, and connect the proof to the earlier gradient graphs.
- **AO3:** reconstruct an unfamiliar part of a proof or use the proved derivative in a short tangent/gradient application.

The AO3 activity contains only AO3 definitions, preserving objective-specific progress evidence.

## Calculator support

The shared ClassWiz support panel includes a TABLE workflow for observing `sin h / h` approach `1` using **radian mode**. The support text explicitly states that this is numerical evidence, not a proof.

## Reuse decisions

No new graph engine, algebra renderer, Memory Lab, assessment shell, diagnostic router, storage path or vocabulary system was introduced. Step 51 consumes:

- `DiagramPrimitives`
- `EquationStepRenderer`
- canonical `MemoryLab` and memory engines
- `QuestionDefinition` / `GeneratorRunner` / `QuestionShell`
- `DiagnosticRouter` and Help support routing
- shared ClassWiz support infrastructure

The topic-specific Understand controller only orchestrates those shared systems and supplies the mathematics/state needed for Plan 19.

## QA

- Complete runtime suite through Step 51: **PASS**.
- Step 36 frozen reference-topic regression: **PASS**.
- Step 49 Year 12 regression gate: **PASS**.
- Step 51 contract: **PASS**.
- Static build: **PASS**.
- Frozen Basics/QuestionShell/MemoryLab files: **7/7 byte-for-byte unchanged**.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width screenshot attempt: **timed out (exit 124), no screenshot produced**; visual-browser QA is therefore not claimed.

Step 52 is intentionally not implemented here.
