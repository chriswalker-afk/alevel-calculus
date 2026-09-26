# Step 58 - Connected Rates of Change (Plan 25)

**Status:** Complete  
**Scope:** Additional Year 13 / 9MA0 differentiation  
**Implementation step:** 58 only

## Delivered journey

Step 58 implements the planned sequence **practical changing quantities -> dependency diagram -> chain rule -> unknown rate -> units and interpretation**.

### Understand

The topic reuses the canonical `RateFlowDiagram` from Step 29. Students must arrange variable dependency and orient each derivative before numerical substitution is unlocked. The shared diagrams include the direct `t -> r -> A` ripple case and the multi-stage `t -> r -> V -> m` chain.

The five Understand activities cover:

1. practical dependency before calculation;
2. rate-flow ordering and derivative orientation;
3. the six-stage connected-rates method;
4. positive/negative rates plus compound units;
5. multi-stage chains.

The stable method is:

1. identify quantities and units;
2. write the relationship;
3. draw/arrange the rate-flow diagram;
4. differentiate/connect the rates;
5. substitute values for the stated instant;
6. interpret sign, size and units.

For an arrow `x -> y`, the local derivative is always `dy/dx`. Numerical values are not substituted until the dependency structure has been checked.

### Memorise

The one shared Memory Lab provides retrieval for dependency-first method, derivative orientation, signs/units and vocabulary. No connected-rates-specific memory engine is introduced.

### AO1

Generated question sets cover standard circle/sphere rate calculations, rate-chain orientation and positive/negative rates with units.

### AO2

Generated reasoning/diagnostic work asks students to explain why rates multiply through the chain rule, correct reversed derivatives and interpret signs/units.

### AO3

Generated modelling includes a multi-stage sphere/volume/mass context using

`dm/dt = (dm/dV)(dV/dr)(dr/dt)`

with a negative radius rate and contextual unit interpretation.

## Shared architecture reused

- `RateFlowDiagram`
- `DiagramPrimitives` through RateFlowDiagram
- `EquationStepRenderer`
- `MemoryLab` and shared memory engines
- `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`
- `DiagnosticRouter` and Help support routing
- shared vocabulary, progress and persistence contracts
- one AppShell/topic routing system

No second dependency-diagram engine, equation renderer, Memory Lab, QuestionShell, diagnostic router or persistence system was added.

## QA

- dedicated Step 58 regression: **PASS**;
- complete runtime suite through Step 58: **PASS**;
- static build: **PASS**;
- frozen Step 36 reference files: **7/7 byte-for-byte unchanged** by direct SHA-256 comparison;
- canonical quality harness: **21 passed, 0 failed, 0 skipped**, including log continuity through Step 58 and fresh runtime build/tests;
- restore ZIP integrity: **PASS**;
- bounded Chromium phone-width attempt: exit **124**, screenshot **not produced**, so browser visual QA is **not claimed**.

## Boundary

Step 59 Year 13 Differentiation Review and Mastery has not been started.
