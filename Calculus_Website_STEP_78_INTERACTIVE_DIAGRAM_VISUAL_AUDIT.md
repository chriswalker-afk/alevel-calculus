# Calculus Website - Step 78 Interactive and Diagram Visual Audit

**Status:** Complete  
**Date:** 26 September 2026

## Scope

Step 78 audits the reusable interactive/diagram layer at extreme mathematical states and representative narrow/medium/wide layout assumptions. It adds no curriculum content.

Canonical systems audited:

- `DiagramPrimitives`
- `LinkedFunctionGradientExplorer`
- `ChordToTangentExplorer`
- `FamilyOfCurvesExplorer`
- `AreaExplorer`
- `ParametricCurveTracer`
- `RateFlowDiagram`
- `RectangleSumExplorer`
- `TrapeziumRuleBuilder`
- `ExpressionStructureHighlighter`
- `EquationStepRenderer`

## Extreme-state audit

The permanent `tests/interactive_visual_audit_step78_test.mjs` gate checks:

- graph-domain endpoints and fixed-scale contracts;
- chord/tangent states at the minimum useful `h` and both domain extremes;
- family-of-curves `C=-4` and `C=4` across each full declared x-domain;
- area full-domain, reversed-limit, zero-width and split-point states;
- parametric t-domain endpoints, clamped restricted intervals and an explicit vertical-tangent state;
- rectangle sums at `n=1` and `n=100`, all three sample locations and reversed bounds;
- trapezium-rule states at `n=1` and `n=24`, forward/reversed bounds and concavity classifications;
- rate-flow initial/solved arrangements with labelled button alternatives to pointer interaction;
- responsive collapse rules for all eight shared graph/diagram systems;
- keyboard + pointer/touch support in the shared primitive layer;
- long equation/structure wrapping for `EquationStepRenderer` and `StructureHighlighter` output.

## Defect found and fixed

A shared clipping risk existed in `DiagramPrimitives.label()`: labels at extreme curve/domain values used a requested view position directly, so a start-anchored label near the right edge or a label above a top-edge point could extend outside the SVG view and be clipped.

Step 78 adds `fitLabelViewPosition()` and makes `DiagramPrimitives.label()` fit its estimated text box inside the SVG view by default. The same fitting logic is used on later `label.set()` updates, so moving points cannot reintroduce the clipping. This is a shared primitive fix; no topic-local label patches were added.

The fitting algorithm preserves the requested text anchor and only shifts labels when their estimated box would cross a view boundary. Callers may opt out with `keepInView: false` if a future diagram intentionally places text outside the SVG.

## Scale and mathematical-legibility findings

- Existing explorer function/curve domains remain declared/fixed; slider movement does not autoscale the graph and visually hide the mathematical change.
- Signed-area systems retain explicit sign/dash cues in addition to colour.
- Vertical parametric tangents remain represented as vertical lines rather than a fabricated finite gradient.
- Dense rectangle states suppress sample-point clutter above the existing threshold while retaining the curve and rectangle outlines.
- Trapezium concavity classifications remain explicit, including the mixed-concavity no-whole-interval-bound case.
- Rate-flow rearrangement remains available through labelled left/right buttons; essential reasoning is not drag-only.
- Shared draggable points continue to expose pointer/touch plus Arrow-key interaction through `role="slider"`.

## Browser evidence limitation

A bounded Chromium 390x844 screenshot attempt was made after the audit. Chromium timed out with exit code 124 and produced no screenshot. A control attempt against `about:blank` also timed out, confirming an environment/browser-launch limitation rather than a specific calculus page failure.

Accordingly, Step 78 does **not** claim live browser screenshot evidence. The completed evidence is the permanent deterministic extreme-state/layout regression plus the full historical runtime suite/static build/reference freeze/quality harness.

## Completion result

PASS. No tested extreme state obscures essential mathematical state in the audited model/layout contracts, the discovered shared edge-label clipping risk is fixed centrally, and touch/keyboard alternatives remain present. No curriculum content was changed.
