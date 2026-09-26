# Calculus Website - Step 52: Product, Quotient and Chain Rule - Structure and Understand

**Status:** Complete  
**Plan:** 20.1-20.3  
**Scope:** Additional Year 13 / 9MA0  
**Depends on:** Steps 36 and 50

## Implemented outcome

Step 52 adds the Understand-only structure layer for Product, Quotient and Chain Rule. The topic deliberately stops before Memorise/AO1-AO3, which remain Step 53.

The teaching journey is:

**recognise whole-expression structure -> build/unpack composition -> learn the formal rule with persistent identities -> unpack nested mixtures**.

Students are required to name the structure/rule before calculation. Product, quotient, composite and mixed structures are all represented.

## Function composition

A two-machine interaction compares `f(g(x))` and `g(f(x))` using the same selected functions and input. It makes order visible and labels the inside function and outside function explicitly.

## StructureHighlighter

Step 52 implements the previously reserved reusable `StructureHighlighter` contract as `expression-structure-highlighter.js`. It applies semantic role metadata plus visible text labels to mathematical substructures. Colour is supplementary only. `EquationStepRenderer` is extended with an optional backwards-compatible expression-decorator hook so structured highlighting decorates the canonical equation rows rather than creating a second equation renderer.

The three differentiation structures reuse the same utility:

- product: `u` / `v` identities persist through `u'v + uv'`;
- quotient: `u` / `v` identities persist through `(vu' - uv') / v^2`, with numerator order explicitly protected;
- chain: inside/outside identities persist through `f'(g(x)) g'(x)` and `dy/du · du/dx`.

The utility does not replace `EquationStepRenderer`; later multi-line worked algebra may compose both systems.

## Nested structures

Mixed examples require students to state the outside structure first and then inspect each component for a second rule. This prepares multi-rule differentiation without implementing Step 53 practice early.

## Reuse decisions

No second shell, equation renderer, question system, memory system, graph engine or persistence layer was created. The topic is a thin Understand orchestration layer inside the canonical AppShell and uses the existing TopicMetadata/route, progress, scope-badge and Word Bank contracts.

## QA

- Full runtime suite through Step 52: **PASS**.
- Step 36 frozen-reference regression: **PASS**.
- Step 49 Year 12 regression gate: **PASS**.
- Step 52 contract: **PASS**.
- Static build: **PASS**.
- Frozen Basics/QuestionShell/MemoryLab files: **7/7 byte-for-byte unchanged**.
- Canonical quality harness: **21 passed, 0 failed, 0 skipped**.
- Bounded Chromium phone-width screenshot attempt: **timed out (exit 124), no screenshot produced**; visual-browser QA is therefore not claimed.

Step 53 is intentionally not implemented here.
