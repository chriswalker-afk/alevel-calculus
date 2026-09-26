# Step 50 - Standard Functions (Plan 18)

Status: Complete

## Delivered
- Activated `topic:y13:differentiation:standard-functions` as the first additional Year 13 / 9MA0 topic with the frozen five-mode pattern.
- Extended `LinkedFunctionGradientExplorer` with a reusable standard-function definition factory and catalogue covering `sin x`, `cos x`, `e^x`, `ln x`, scaled trig/exponential/log forms, and `a^(kx)` via a representative `2^(3x)` case.
- Understand uses the shared linked graph/tangent system. Learners move the tangent and inspect numerical gradients before revealing the complete derivative curve. A prominent RADIAN MODE reminder is present for trig derivatives.
- Memorise uses the existing Memory Lab, vocabulary store, memory games and mixed review; no topic-specific retrieval interface was created.
- AO1-AO3 use the shared QuestionDefinition -> GeneratorRunner -> QuestionShell path with exact DiagnosticRouter support routes. Mixed practice includes polynomial + trig differentiation, tangent-gradient application and a stationary-point application.
- The top course-scope badge now switches to `Year 13 additional · 9MA0` when the topic is selected.

## Rules represented
- d/dx[sin x] = cos x
- d/dx[cos x] = -sin x
- d/dx[e^x] = e^x
- d/dx[ln x] = 1/x, x>0
- d/dx[sin(ax)] = a cos(ax)
- d/dx[cos(ax)] = -a sin(ax)
- d/dx[e^(ax)] = a e^(ax)
- d/dx[ln(ax)] = 1/x for positive a,x
- d/dx[a^(kx)] = k ln(a) a^(kx)

## Verification
- Full runtime suite, including the Step 36 frozen-reference regression and Step 49 Year 12 gate: PASS.
- Step 50 finite-difference checks agree with encoded derivatives for the complete catalogue and multiple sine scale factors.
- Static build: PASS.
- Frozen reference source comparison: **7/7 unchanged**.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width visual attempt: exit 124, no screenshot produced; browser visual QA is therefore not claimed.
