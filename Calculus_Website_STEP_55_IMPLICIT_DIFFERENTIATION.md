# Step 55 - Implicit Differentiation (Plan 22)

Status: Complete

## Implemented

- Added the Additional Year 13 / 9MA0 topic `topic:y13:differentiation:implicit-differentiation` with all five canonical modes.
- Understand journey: explicit/implicit classification; `y=y(x)` chain-rule cue; gated term-by-term differentiation; separate collect/factor/divide rearrangement stage.
- The guided term workspace disables rebuilding/rearranging until all terms have been differentiated.
- Added canonical Memory Lab content for form classification, the y-term chain factor and the fixed implicit method.
- Added AO1 generated practice for classification, y-expression differentiation, complete implicit differentiation and rearranging for `dy/dx`.
- Added AO2 reasoning for why `dy/dx` appears, why `d/dx` is applied to both sides, and explicit missing-`dy/dx` / product-rule diagnosis.
- Added AO3 tangent and stationary-point applications.
- Added exact Help/DiagnosticRouter support targets for the new micro-skills.
- Added four VocabularyTerm records: implicit relation, explicit form, implicit differentiation and dependent variable.

## Architecture / reuse

No new equation renderer, question shell, memory engine, diagnostic router or persistence layer was introduced. The topic composes `EquationStepRenderer`, `MemoryLab`, `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`, `DiagnosticRouter`, Help routing and the existing AppShell/progress/vocabulary contracts.

## QA

- Full runtime suite through Step 55: PASS.
- Dedicated `implicit_differentiation_step55_test.mjs`: PASS.
- Static build: PASS.
- Frozen reference set: 7/7 hashes unchanged from the Step 36 baseline.
- Visual-browser QA is not claimed unless a screenshot is produced by the environment.
