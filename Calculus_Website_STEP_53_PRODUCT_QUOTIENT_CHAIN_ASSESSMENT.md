# Calculus Website - Step 53: Product / Quotient / Chain Rule Memorise and AO1-AO3

**Status:** Complete  
**Date:** 2026-09-25

## Scope

Step 53 extends the Step 52 Product / Quotient / Chain Rule topic from its Understand-only structure layer into the remaining canonical modes: **Memorise, AO1, AO2 and AO3**. No Step 54 Parametric Equations content is included.

## Implemented learning journey

### Memorise

The topic now uses the canonical `MemoryLab` for formal rule recall, quick methods, rule-selection retrieval, vocabulary, memory games and mixed review. Retrieval explicitly targets the two planned high-value execution errors:

- quotient numerator order: `v u′ - u v′`, not the reverse;
- missing chain factor: differentiating the outside but omitting the derivative of the inside.

Memory-game and review content reuse the shared build, missing-piece, sort and impostor patterns. No rule-specific recall surface was created.

### AO1

Generated fluency is split into exact micro-skills for:

- product rule;
- quotient rule;
- chain rule;
- mixed one-rule selection;
- mixed multi-rule execution.

The mixed one-rule set is assembled from the same individual rule definitions, so the hidden `microSkillId` remains the exact rule actually being tested. Multi-rule items include combinations such as product + chain and quotient + chain.

### AO2

Reasoning and diagnosis now cover:

- explaining which rule or rule sequence is appropriate before calculating;
- diagnosing reversed quotient numerator order;
- diagnosing a missing chain factor.

The diagnostic metadata preserves a useful distinction between **rule-selection failure** and **correct-rule execution failure**. Explicit error categories include `quotient-order`, `denominator-square`, `missing-chain-factor`, `outer-derivative` and `rule-selection`.

### AO3

Applications use the shared generated-question pipeline for short calculus contexts, including tangent-gradient and rate-of-change tasks that require the appropriate product/chain structure.

## Architecture and reuse

Step 53 reuses the existing:

- `StructureHighlighter` from Step 52;
- `MemoryLab` and canonical memory-game/review engines;
- `QuestionDefinition`, `GeneratorRunner` and `QuestionShell`;
- `DiagnosticRouter` and Help support routing;
- AppShell route, progress, vocabulary and persistence contracts.

No `ProductRuleEngine`, `QuotientRuleEngine`, `ChainRuleEngine`, second Memory Lab, second QuestionShell, rule-specific persistence system or competing diagnostic system was introduced.

## QA

- Full runtime regression suite: **PASS through Step 53**.
- Step 36 frozen-reference regression: **PASS**.
- Step 49 Year 12 regression gate: **PASS**.
- Step 53 dedicated regression: **PASS**.
- Static build: **PASS**.
- Frozen Basics / QuestionShell / MemoryLab monitored files: **7/7 byte-for-byte unchanged**.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width screenshot attempt: **timed out (exit 124); no screenshot produced**, so visual-browser QA is not claimed.

## Next boundary

Step 53 is complete. The next numbered action is **Step 54 - Parametric Equations and Differentiation (Plan 21)**; it is not started here.
