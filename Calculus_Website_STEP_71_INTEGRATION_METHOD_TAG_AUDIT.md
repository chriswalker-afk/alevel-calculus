# Calculus Website - Step 71 Integration technique regression and method-tag audit

**Status:** COMPLETE

Step 71 consolidates the Year 13 integration metadata added in Steps 60-70. It does not add a student topic.

## Canonical integration method vocabulary

`src/scripts/integration-method-vocabulary.js` is now the single owner of method tags and human labels:

- `standard-integral` - Standard integral
- `reverse-chain` - Reverse chain
- `f-prime-over-f` - f′/f
- `trig-identity` - Trig identity
- `substitution` - Substitution
- `integration-by-parts` - Integration by parts
- `partial-fractions` - Partial fractions
- `parametric-area` - Parametric area setup
- `limit-of-sum` - Limit of a sum
- `trapezium-rule` - Trapezium rule

`trig-integration-data.js` re-exports the same object for compatibility; it no longer owns a competing vocabulary.

## Audit result

`integration-method-audit.js` audits all 74 Step 60-70 integration question definitions. The audit passes with zero issues. Legacy aliases (`standard-integrals`, `integration-recognition`, `integration-method-selection`, `area-construction`) no longer appear in `methodTags`. Setup/prerequisite concepts remain in `prerequisiteTags` where appropriate.

Step 61 recognition examples now keep only canonical integration methods in `methodTags`; descriptors such as `definite`, `trig`, `log`, `odd-power`, `rewrite-first` and `near-miss` live in `structureTags`.

## Regression discipline

The Step 71 test is appended to the canonical runtime suite and rejects future non-canonical method tags, missing labels, legacy aliases, or mixed method/structure metadata. No Step 36 frozen reference file was changed.

## Final QA

- Full runtime suite through Step 71: PASS.
- Static build: PASS.
- Canonical quality harness: 21 passed, 0 failed, 0 skipped.
- Frozen reference comparison: 7/7 unchanged.
- Bounded 390x844 Chromium capture: exit 124, no screenshot produced; browser visual QA not claimed.
