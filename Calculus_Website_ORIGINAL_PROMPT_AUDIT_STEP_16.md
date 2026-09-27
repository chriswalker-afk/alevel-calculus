# Original-prompt audit — Step 16: Help routing and ClassWiz support

Status: Complete

## Help routing audit

The late-course Help pass now covers:

- Integration using partial fractions
- Areas with Year 13 techniques
- Parametric area
- Integration as the limit of a sum
- Numerical integration and the trapezium rule
- First-order differential equations
- Full 9MA0 calculus modelling
- Full 9MA0 calculus mastery

For every late topic, Help is derived from the topic's real activity metadata rather than a second hand-maintained route list. Where the topic has the mode, the top-level drawer provides:

- **I don't understand this** → an Understand activity
- **I don't remember this** → a Memorise activity
- **I need to practise this** → an AO1 activity

Micro-skill diagnostic routing first respects the micro-skill's declared support target, then a same-micro-skill activity in the requested mode, then a small audited set of pedagogical fallbacks.

**Full 9MA0 calculus mastery** is the deliberate exception: its metadata contains AO1, AO2 and AO3 only. Help therefore exposes AO1 practice but does not invent Understand or Memorise routes. The exported `lateCourseHelpAudit` records those omissions and reasons explicitly.

## Site-wide calculator opportunity audit

The calculator audit covers all 33 registered course topics exactly once. It is exported as `CLASSWIZ_OPPORTUNITY_AUDIT` from `classwiz-support-data.js`.

### Calculator support enabled

Shared calculator checks are enabled where they naturally support, rather than replace, the course mathematics:

**Year 12**
- Basics of differentiation — numerical derivative and definite-integral checks
- Tangents and normals — numerical derivative check
- Stationary points — polynomial-root and TABLE checks
- Increasing/decreasing functions — polynomial-root and TABLE checks
- Definite/indefinite integration — definite-integral check
- Integration as area — definite-integral check
- Signed/geometrical area — definite-integral and polynomial-root checks

**Year 13 differentiation**
- Standard functions — numerical derivative check
- Trig proofs from first principles — TABLE small-angle evidence
- Product/quotient/chain — numerical derivative check
- Parametric differentiation — paired TABLE and numerical derivative checks
- Trig identities/inverse trig — numerical derivative check
- Concavity/inflection — polynomial-root and TABLE checks

**Year 13 integration**
- Standard integrals — definite-integral check
- Reverse chain rule — definite-integral check
- Integration using trig identities — radians-aware definite-integral check
- Substitution — definite-integral check
- Integration by parts — definite-integral check
- Partial fractions — definite-integral and polynomial-root checks
- Year 13 areas — definite-integral and polynomial-root checks
- Parametric area — paired TABLE and definite-integral checks
- Limit of a sum — definite-integral check after conversion
- Numerical integration — ordinate TABLE plus calculator definite-integral comparison

### Deliberately not added

These topics have an explicit no-pack audit decision:

- **Pre-calculus** — conceptual graph/gradient preparation; calculator output adds little to the intended reasoning.
- **First principles** — the limiting argument and proof are the point; numerical checking risks replacing the derivation.
- **Introduction to integration** — inverse-differentiation structure is better checked by differentiating the result at this stage.
- **Year 12 review/mastery** — mixed review is better served by calculator support in the source topic after the method is identified.
- **Implicit differentiation** — no single calculator check verifies the symbolic term-by-term method and rearrangement reliably.
- **Connected rates** — the main difficulty is modelling dependencies, signs and units rather than a calculator operation.
- **Full differentiation review/mastery** — use the calculator support from the identified source topic.
- **First-order differential equations** — separation, exact integration, constants and interpretation are the assessed method; a generic calculator action does not verify the full solution.
- **Full 9MA0 calculus modelling** — calculator opportunities depend on the chosen model, so the relevant source-topic pack is more accurate.
- **Full 9MA0 calculus mastery** — topic-blind review should route calculator checking through the source topic once the method is recognised.

## Shared ClassWiz use cases

The implementation reuses one small library rather than copying instructions between topics:

- numerical derivative check
- numerical definite-integral check
- radians-aware trig integral check
- TABLE function values
- TABLE paired values
- TABLE trapezium ordinates
- TABLE small-angle evidence
- polynomial-root check

The reusable panel now changes pack when the current topic changes and rebuilds its use-case tabs from the active pack. It no longer remains bound to the initial Basics calculator pack.

## Model accuracy and boundaries

The model-specific instructions retain separate **fx-991CW** and **fx-991EX** steps.

The audit was checked against Casio's official fx-991CW/fx-570CW and fx-991EX/fx-570EX user guides for:

- numerical derivative and definite-integral commands
- radians requirements for trigonometric numerical calculus
- TABLE with f(x) and g(x)
- polynomial equation solving for root checks

All calculator guidance is framed as **checking/exploration**, not a substitute for exact algebra, symbolic calculus, proof, method selection or written exam working.
