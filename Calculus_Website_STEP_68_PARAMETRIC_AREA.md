# Calculus Website - Step 68: Area Using Parametric Equations

**Status:** Complete  
**Plan:** Plan 34  
**Canonical topic:** `topic:y13:integration:parametric-area`

## Scope completed

Step 68 adds parametric area across all five modes. The durable sequence is:

**identify region / x-boundaries -> convert to t-limits -> form y(t)(dx/dt) -> inspect direction/sign -> correct geometrical-area orientation/splits -> choose any later integration technique -> calculate**

The Understand journey extends the existing `ParametricCurveTracer` with an optional teaching overlay. A highlighted thin vertical strip connects `dA = y dx` to `dx = (dx/dt)dt`, the readout shows `y·dx/dt` and whether x is increasing or decreasing, and the upper ellipse example makes negative `dx/dt` visible. Limit conversion is taught explicitly before evaluation. A separate mixed-technique activity shows that trig identities, substitution or integration by parts are selected only after the parametric setup is complete.

## Reuse decisions

- Extends `ParametricCurveTracer`; no new parametric-area canvas or SVG engine was created.
- Reuses Step 67 area-construction semantics and the shared signed/geometrical-area distinction.
- Extends the canonical `INTEGRATION_METHOD_TAGS` object with `parametric-area` for the later Step 71 method-tag audit.
- Reuses the canonical Memory Lab, QuestionDefinition, GeneratorRunner, QuestionShell, Help/diagnostic, AppShell, progress, persistence and ClassWiz systems.

## Mathematical conventions

- `A = ∫ y dx = ∫ y(t)(dx/dt) dt` is derived from a vertical strip.
- Limits must match the integration variable: x-boundaries are converted explicitly to t-values.
- `dx/dt < 0` means increasing t moves left; a forward t-integral can therefore be negative even when the region lies above the x-axis.
- For geometrical area, reverse limits, introduce a minus sign, or split intervals when direction/sign changes require it.
- Parametric setup is diagnostically separate from any later trig/substitution/parts/etc. integration technique.

## QA

- Dedicated Step 68 contract: PASS.
- Complete runtime suite through Step 68: PASS.
- Static build: PASS.
- Step 36 frozen-reference regression: PASS.
- Frozen reference source comparison: 7/7 unchanged from Step 67.
- Canonical project quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width capture: timed out with exit 124 and produced no screenshot; browser visual QA is **not claimed**.

## Stop boundary

Step 69 is not implemented in this step.
