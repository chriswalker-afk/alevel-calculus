# Calculus Website - Step 65: Integration by Parts (Plan 31)

**Status:** COMPLETE

## Scope

Step 65 implements Integration by Parts across Understand, Memorise and AO1-AO3 while extending the existing integration-method vocabulary rather than creating a separate method-selection system.

## Implemented

- Added `topic:y13:integration:by-parts` across all five canonical modes.
- Positioned integration by parts as a **later integration option**, not a reflex for every product. Method-position examples compare standard integral, reverse chain, trig identity, substitution and parts before calculation.
- Derived `∫u dv = uv − ∫v du` line by line from the differentiation product rule using the shared `EquationStepRenderer`.
- Added an accessible interactive `u`/`dv` choice preview. Students can compare alternative choices and see whether the resulting `∫v du` becomes easier or harder.
- Added basic indefinite and definite cases, the hidden product `1·ln x`, repeated use, a DI-table organiser and a cyclic example where the original integral is labelled `I`, returns, and is solved algebraically.
- Added Memory Lab facts/games/review, canonical vocabulary, AO1 basic/definite/hidden-one/repeated practice, AO2 explanation/derivation/error diagnosis, and AO3 unsignposted/cyclic applications.
- Added precise Help/diagnostic routing for method choice, `u`/`dv` choice, formula/sign errors, hidden-one recognition, repeated parts/DI and cyclic algebra.
- Extended Step 62's canonical `INTEGRATION_METHOD_TAGS` with `integration-by-parts`.
- Reused Step 60 `STANDARD_INTEGRAL_DEFINITIONS` by reference and records the Step 53 product-rule topic as the derivation source.

## Reuse and architecture

No new integration shell, question runner, Memory Lab, diagnostic router, equation renderer, method-selection framework or persistence path was introduced. `IntegrationByPartsUnderstandExperience` is a topic orchestration layer over existing shared systems.

The durable choice rule is **the new integral must become easier**. Mnemonics may suggest an initial choice, but the previewed mathematical consequence determines whether the choice is retained.

The durable cyclic rule is **label the original integral `I` -> allow `I` to reappear -> collect the `I` terms -> solve algebraically**.

## QA

- Dedicated Step 65 regression: PASS.
- Complete runtime suite through Step 65: PASS.
- Static build: PASS.
- Step 36 frozen reference regression: PASS.
- Frozen reference source comparison: 7/7 unchanged from Step 64.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped** after governance synchronisation, including implementation-log continuity through Step 65 and fresh runtime build/tests.
- Managed Chromium phone-width capture: bounded attempt timed out with exit 124 and produced no screenshot; **browser visual QA is not claimed**.

## Boundary

Step 66 Integration Using Partial Fractions is not implemented here.
