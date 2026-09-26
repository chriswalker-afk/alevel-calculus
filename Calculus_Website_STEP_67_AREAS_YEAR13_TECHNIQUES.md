# Calculus Website - Step 67: Areas with Year 13 Techniques

**Status:** Complete  
**Plan:** Plan 33  
**Canonical topic:** `topic:y13:integration:areas`

## Scope completed

Step 67 extends area work to Year 13 techniques across all five modes. The durable sequence is:

**identify region -> sketch/inspect -> intersections and limits -> top minus bottom -> split if needed -> geometry or calculus -> choose integration method -> calculate area**

The Understand journey keeps the area-construction checklist visible and reuses the existing `AreaExplorer` in paired form to show `area under A - area under B`. It includes top-minus-bottom construction, split regions, geometry-vs-calculus decisions, signed-vs-geometrical area, and method selection across standard integrals, reverse chain, trig identities, substitution, integration by parts and partial fractions.

## Reuse decisions

- Reuses `AreaExplorer`; no new area canvas or graph engine was created.
- Reuses the canonical `INTEGRATION_METHOD_TAGS` vocabulary by reference.
- Reuses Year 12 area/signed-area semantics and the shared Memory Lab, QuestionDefinition, GeneratorRunner, QuestionShell, Help/diagnostic, AppShell, progress and persistence systems.
- Step 67 introduces no new integration engine; method selection occurs only after the area integral is constructed.

## Mathematical conventions

- For vertical strips between curves: `area = integral(top - bottom) dx` while curve order is fixed.
- Split at any internal intersection where top/bottom order changes.
- Signed integrals and geometrical area remain distinct; geometrical area uses non-negative region magnitudes.
- Exact elementary geometry is preferred when it is genuinely simpler than calculus.
- Integration technique is the final decision, not the first.

## QA

- Dedicated Step 67 contract: PASS.
- Complete runtime suite through Step 67: PASS.
- Static build: PASS.
- Step 36 frozen-reference regression: PASS.
- Frozen reference source comparison: 7/7 unchanged from Step 66.
- Canonical project quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width capture: timed out with exit 124 and produced no screenshot; browser visual QA is **not claimed**.

## Stop boundary

Step 68 is not implemented in this step.
