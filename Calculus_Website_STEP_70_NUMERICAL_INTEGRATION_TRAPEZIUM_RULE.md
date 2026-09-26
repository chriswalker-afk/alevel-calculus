# Step 70 - Numerical Integration and Trapezium Rule

Status: Complete

Implemented the full five-mode Year 13 topic using the existing `TrapeziumRuleBuilder`. The learning sequence is one rotated trapezium -> long-way addition -> repeated interior ordinates -> general rule -> ordinate-table calculation -> percentage error -> justified concavity bounds. Added the canonical `trapezium-rule` method tag for Step 71.

The existing builder remains the canonical numerical engine. A read-only `buildOrdinateTable()` helper exposes the same x/y/coefficient representation to topic activities, questions and ClassWiz TABLE support. Concavity bounds remain restricted to intervals on which the sign of f'' is uniform; changing concavity explicitly yields no whole-interval claim.

## QA

- Dedicated Step 70 regression: PASS.
- Full runtime suite through Step 70: PASS.
- Static build: PASS.
- Step 36 frozen reference comparison: 7/7 unchanged.
- Canonical project quality harness: 21 passed, 0 failed, 0 skipped.
- Phone-width Chromium attempt: exit 124; no screenshot produced, so browser visual QA is not claimed.
