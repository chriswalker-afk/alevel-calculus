const freeze = Object.freeze;

export const INTEGRATION_METHOD_TAGS = freeze({
  standard: 'standard-integral',
  reverseChain: 'reverse-chain',
  fPrimeOverF: 'f-prime-over-f',
  trigIdentity: 'trig-identity',
  substitution: 'substitution',
  byParts: 'integration-by-parts',
  partialFractions: 'partial-fractions',
  parametricArea: 'parametric-area',
  limitOfSum: 'limit-of-sum',
  trapeziumRule: 'trapezium-rule'
});

export const INTEGRATION_METHOD_LABELS = freeze({
  [INTEGRATION_METHOD_TAGS.standard]: 'Standard integral',
  [INTEGRATION_METHOD_TAGS.reverseChain]: 'Reverse chain',
  [INTEGRATION_METHOD_TAGS.fPrimeOverF]: "f′/f",
  [INTEGRATION_METHOD_TAGS.trigIdentity]: 'Trig identity',
  [INTEGRATION_METHOD_TAGS.substitution]: 'Substitution',
  [INTEGRATION_METHOD_TAGS.byParts]: 'Integration by parts',
  [INTEGRATION_METHOD_TAGS.partialFractions]: 'Partial fractions',
  [INTEGRATION_METHOD_TAGS.parametricArea]: 'Parametric area setup',
  [INTEGRATION_METHOD_TAGS.limitOfSum]: 'Limit of a sum',
  [INTEGRATION_METHOD_TAGS.trapeziumRule]: 'Trapezium rule'
});

export const INTEGRATION_METHOD_TAG_LIST = freeze(Object.values(INTEGRATION_METHOD_TAGS));
export function isIntegrationMethodTag(tag){ return INTEGRATION_METHOD_TAG_LIST.includes(tag); }
export function getIntegrationMethodLabel(tag){ return INTEGRATION_METHOD_LABELS[tag] ?? tag; }
