# Calculus Website - Step 64: Integration by Substitution AO1-AO3 and diagnostics

**Status:** COMPLETE

## Scope

Step 64 completes the substitution topic across Memorise, AO1, AO2 and AO3 while preserving the Step 63 Understand workspace and variable-change model.

## Implemented

- Expanded `topic:y13:integration:substitution` to the canonical five modes.
- Added shared Memory Lab content for recognition-versus-substitution, the change-everything sequence, choosing-u cues, definite-limit conversion, finishing rules and three-stage diagnosis.
- Added AO1 question sets for supplied substitutions, choosing `u`, changing limits and complete substitution.
- Added AO2 comparison/diagnosis work, including explicit mixed-variable failures.
- Added AO3 unsignposted definite substitution applications.
- Reused `VariableTransformationWorkspace`, Step 61 reverse-chain recognition and Step 62's canonical `substitution` method tag.
- Diagnostics distinguish **choice of u**, **transformation/change of variable**, and **integration/evaluation** failures.
- Definite questions convert the original `x` limits and remain in `u` after conversion.

## Reuse and architecture

No substitution-specific question shell, generator runner, Memory Lab, diagnostic router, storage path or method-tag vocabulary was created. Step 64 uses the existing `MemoryLab`, `QuestionDefinition`, `GeneratorRunner`, `QuestionShell`, `DiagnosticRouter`, Help routing, vocabulary, progress and persistence contracts.

The canonical substitution invariant remains: **one integration variable at a time**.

## QA

- Dedicated Step 64 regression: PASS.
- Complete runtime suite through Step 64: PASS.
- Static build: PASS.
- Step 36 frozen reference regression: PASS.
- Frozen reference hash comparison: **7/7 unchanged from Step 63**.
- Canonical quality harness: run after governance synchronisation; final result recorded in the implementation log/QA artifact.
- Managed Chromium phone-width capture: bounded attempt retained as environment-dependent evidence; no visual pass is claimed if no screenshot is produced.

## Boundary

Step 65 Integration by Parts is not implemented here.
