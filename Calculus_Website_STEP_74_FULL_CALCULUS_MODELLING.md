# Step 74 - Full 9MA0 Calculus Modelling (Plan 38)

## Status
Complete.

## What was implemented
- Added one reusable `CalculusModellingScaffold` with the fixed stages **variables/units/restrictions -> relationship -> target -> method -> solve -> interpret -> limitations**.
- Added seven representative modelling families using the same scaffold: optimisation, connected rates, parametric motion, implicit relationships, accumulation/area, numerical integration and differential equations.
- Added a full five-mode topic at `topic:y13:modelling:calculus`.
- Added explicit exact-vs-numerical decision logic covering exact integration, trapezium-rule use for sampled data and calculator numerical checking after model setup.
- Added AO1 specified-step/framework practice, AO2 method-appropriateness/exact-vs-numerical/interpretation critique and AO3 topic-blind modelling.
- Added shared Memory Lab recall items for the modelling framework, method timing, exact-vs-numerical choice and interpretation/limitations.
- Each modelling context retains exact support topic/activity IDs so point-of-need help can reuse previously built techniques rather than duplicate them.

## Durable modelling contract
**variables/units/restrictions -> relationship/model -> target -> calculus method -> solve -> interpret sign/size/units/domain -> reasonableness/assumptions/limitations**

AO3 context must not reveal the calculus technique before the relationship and target are identified.

## Reuse
No new graph engine, calculator engine, QuestionShell, Memory Lab, diagnostic router or persistence path was created. Existing optimisation/stationary-point, connected-rate, parametric, implicit, integration-area, trapezium-rule and differential-equation topics remain the precise support destinations.

## QA
- Dedicated Step 74 regression: PASS.
- Complete runtime suite through Step 74: PASS.
- Static build: PASS.
- Step 36 frozen-reference regression: PASS through the normal suite.
- Browser visual evidence is claimed only if an actual screenshot is produced.
