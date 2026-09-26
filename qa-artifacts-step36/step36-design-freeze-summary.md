# Step 36 reference-topic design-freeze summary

- Reference topic: Basics of differentiation (`topic:y12:differentiation:basics`)
- Five live modes checked: Understand, Memorise, AO1, AO2, AO3
- Runtime suite: PASS
- Reference-topic freeze test: PASS
- Canonical project harness: 21 passed, 0 failed, 0 skipped
- Static shell audit: no duplicate IDs; no unlabelled input/textarea/select controls
- Persistence boundary: only `LocalStateStore` accesses `localStorage` directly
- Reuse boundary: Understand uses registered explorers/DiagramPrimitives; Memorise uses MemoryLab; AO modes use QuestionShell/GeneratorRunner
- Accessibility refinements: shared 44px touch target for Basics controls/MemoryLab tabs/mobile Topics toggle; explicit shared focus rings in MemoryLab and QuestionShell; discrete polite announcements for gradient-point count and d/dx-machine output
- Browser visual QA: blocked by managed Chromium policy (`net::ERR_BLOCKED_BY_ADMINISTRATOR` for localhost); no screenshot pass claimed
