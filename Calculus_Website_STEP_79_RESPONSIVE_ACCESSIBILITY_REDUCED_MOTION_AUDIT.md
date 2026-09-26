# Calculus Website - Step 79 Responsive, Accessibility and Reduced-Motion Audit

**Status:** Complete  
**Date:** 26 September 2026

## Scope

Step 79 is a release audit of the shared application shell and interaction layer. It adds no curriculum content.

The audit covers:

- keyboard completion of core journeys;
- visible focus treatment and focus return;
- 44px shared touch/tap targets;
- narrow-screen containment and mathematical readability;
- definition access without hover;
- non-colour semantic cues;
- locked colour-token contrast;
- reduced-motion behaviour;
- shared overlay/dialog accessibility semantics.

## Defects found and fixed

### 1. Shared shell controls below the 44px touch target

Several older compact shell controls still used 32-36px minimum heights despite the frozen project contract requiring `--touch-target-min` (44px) for shared interactive controls.

Step 79 normalises the following controls to the shared token:

- `Need a reminder?` / Help trigger;
- Word Bank trigger;
- Word Bank filter buttons;
- Word Bank review toggle;
- `Open in Word Bank` from definition popovers;
- Data-management trigger;
- ClassWiz support trigger;
- Word Bank result entries;
- narrow-screen variants of the same shared triggers.

The `AreaExplorer` split-point range input is also raised from 32px to the shared 44px target.

Non-interactive badges, readouts and decorative markers remain compact; the fix is limited to actionable controls.

### 2. Reduced-motion coverage relied too heavily on motion tokens

The site already set `--motion-fast`, `--motion-normal` and `--motion-slow` to zero when `prefers-reduced-motion: reduce` was active. That covered the shared shell transitions, and topic-specific hard-coded motion currently had local overrides, but a future hard-coded animation or transition could bypass the token contract.

Step 79 adds one central reduced-motion guard in `tokens.css` which:

- sets animation duration to effectively zero;
- limits animation iteration to one;
- sets transition duration to effectively zero;
- removes transition delay;
- disables smooth scrolling while focus moves.

This keeps the existing token system while making the release contract robust against future hard-coded motion.

## Keyboard and focus findings

The permanent audit confirms:

- ModeTabs retain ArrowLeft / ArrowRight / Home / End navigation.
- Memory Lab tab groups retain equivalent roving-keyboard navigation.
- ClassWiz tab groups retain equivalent keyboard navigation.
- draggable diagram handles retain Arrow-key movement in all four directions;
- Help, Word Bank, ClassWiz and compact topic navigation all support Escape close;
- opening overlays moves focus into the surface and closing restores focus to a sensible trigger;
- background application regions are made inert while support drawers are open;
- the Data management surface remains a modal dialog with native focus containment where supported;
- shared focusable controls retain the global `--focus-ring` treatment.

## Definition access / hover-only audit

`VocabularyTerm` remains available by hover for pointer users, but hover is not required. The definition popover is also exposed by `:focus-within`, tap/click, and native keyboard button activation. Escape closes an explicitly opened definition. The term button retains `aria-expanded`, `aria-controls` and `aria-describedby`, and the Word Bank can be opened from the popover without pointer-only interaction.

No required core journey is hover-only.

## Narrow-screen audit

The existing one-shell responsive contract is retained:

- `<=900px`: topic navigation becomes the same shared overlay drawer;
- `<=680px`: workspace header stacks, five mode tabs remain visible, activity content becomes one column, and overflow remains inside the activity stage;
- mathematical placeholder text may wrap rather than force document-level horizontal scrolling;
- interactive shell triggers now retain 44px targets at the narrow breakpoint rather than shrinking to 34px.

No separate mobile shell or topic-specific narrow-screen architecture was introduced.

## Contrast and non-colour cues

The Step 79 regression calculates WCAG contrast ratios for the core text/feedback token pairs and requires at least 4.5:1. The current locked pairs pass.

The audit also protects existing non-colour cues:

- progress uses symbols/state markers rather than colour alone;
- negative signed-area regions use a dashed outline and explicit sign marker in addition to colour;
- question feedback exposes a symbol as well as feedback colour/text.

## Permanent regression gate

`tests/responsive_accessibility_step79_test.mjs` is now the canonical Step 79 accessibility/responsive release gate. It checks the shared target/focus contract, keyboard paths, overlay focus movement, vocabulary definition access, narrow-screen layout rules, non-colour cues, core token contrast and reduced-motion guard.

Future accessibility fixes should normally be made through shared tokens/components and added to this gate rather than creating topic-local accessibility patches.

## Reference-topic freeze impact

Step 79 is an explicitly planned shared-shell accessibility audit, so it is allowed to make a controlled change to the frozen shared presentation layer. `src/styles/app-shell.css` changes only to bring shared interactive targets into the already-frozen 44px contract. The other six monitored Step 36 source files remain byte-for-byte unchanged, and the complete Step 36 reference-topic regression passes.

The Step 79 runtime therefore becomes the new post-audit shared-shell baseline for later release steps.

## Browser evidence limitation

The bounded 390x844 Chromium release capture timed out with exit 124 and produced no screenshot. A live-browser visual pass is therefore not claimed. The Step 79 result relies on the permanent responsive/accessibility/reduced-motion regression, the complete historical suite and the static build; the browser limitation is recorded explicitly rather than inferred away.

## Completion result

PASS. Core journeys remain keyboard-completable, definition access is not hover-only, shared interactive targets meet the project 44px contract, locked contrast/non-colour cues are retained, narrow-screen work remains contained and readable, and reduced-motion preferences suppress non-essential animation/transition behaviour through one central contract.
