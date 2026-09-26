import { STANDARD_INTEGRAL_DEFINITIONS } from './standard-integrals-data.js';
import { INTEGRATION_METHOD_TAGS } from './integration-method-vocabulary.js';

const freeze = (value) => Object.freeze(value);
const freezeExample = (config) => freeze({
  ...config,
  methodTags: freeze([...(config.methodTags ?? [])]),
  structureTags: freeze([...(config.structureTags ?? [])]),
  standardIntegralIds: freeze([...(config.standardIntegralIds ?? [])])
});

export const INTEGRATION_RECOGNITION_TAGS = freeze({
  reverseChain: INTEGRATION_METHOD_TAGS.reverseChain,
  fPrimeOverF: INTEGRATION_METHOD_TAGS.fPrimeOverF,
  neither: 'neither'
});

export const RECOGNITION_FAMILIES = freeze([
  freeze({ id: INTEGRATION_RECOGNITION_TAGS.reverseChain, label: 'Reverse chain', cue: 'An inner function g(x) is present and its derivative g′(x) appears as a factor, allowing for a constant multiple.' }),
  freeze({ id: INTEGRATION_RECOGNITION_TAGS.fPrimeOverF, label: "f′/f", cue: 'The numerator is the derivative of the denominator, allowing for a constant multiple.' }),
  freeze({ id: INTEGRATION_RECOGNITION_TAGS.neither, label: 'Neither', cue: 'The required derivative structure is missing or an extra x-dependent factor prevents a constant adjustment.' })
]);

export const REVERSE_CHAIN_RECOGNITION_EXAMPLES = freeze([
  freezeExample({ id:'power-exact', expression:'6x(3x²+4)^5', classification:'reverse-chain', inner:'3x²+4', innerDerivative:'6x', matchingFactor:'6x', adjustment:'1', antiderivative:'(3x²+4)^6/6 + C', explanation:'The inner derivative 6x is present exactly.', methodTags:[INTEGRATION_METHOD_TAGS.reverseChain], structureTags:['power'], standardIntegralIds:['power'] }),
  freezeExample({ id:'exp-adjust', expression:'5x e^(x²+1)', classification:'reverse-chain', inner:'x²+1', innerDerivative:'2x', matchingFactor:'5x', adjustment:'5/2', antiderivative:'(5/2)e^(x²+1) + C', explanation:'5x is a constant multiple, 5/2, of the inner derivative 2x.', methodTags:[INTEGRATION_METHOD_TAGS.reverseChain], structureTags:['exponential'], standardIntegralIds:['exp-e'] }),
  freezeExample({ id:'cos-adjust', expression:'9x cos(3x²−2)', classification:'reverse-chain', inner:'3x²−2', innerDerivative:'6x', matchingFactor:'9x', adjustment:'3/2', antiderivative:'(3/2)sin(3x²−2) + C', explanation:'9x=(3/2)(6x), so the missing difference is only a constant.', methodTags:[INTEGRATION_METHOD_TAGS.reverseChain], structureTags:['trig'], standardIntegralIds:['cos'] }),
  freezeExample({ id:'near-miss-variable-factor', expression:'x² cos(x²+1)', classification:'neither', inner:'x²+1', innerDerivative:'2x', matchingFactor:'x²', adjustment:null, antiderivative:null, explanation:'x² is not a constant multiple of 2x; the mismatch depends on x.', methodTags:[], structureTags:['near-miss'], standardIntegralIds:['cos'] }),
  freezeExample({ id:'near-miss-wrong-inner', expression:'(2x+1)(x²+1)^4', classification:'neither', inner:'x²+1', innerDerivative:'2x', matchingFactor:'2x+1', adjustment:null, antiderivative:null, explanation:'The extra +1 cannot be repaired by multiplying by one constant.', methodTags:[], structureTags:['near-miss'], standardIntegralIds:['power'] }),
  freezeExample({ id:'log-exact', expression:'(2x+3)/(x²+3x+7)', classification:'f-prime-over-f', inner:'x²+3x+7', innerDerivative:'2x+3', matchingFactor:'2x+3', adjustment:'1', antiderivative:'ln|x²+3x+7| + C', explanation:'The numerator is exactly the derivative of the denominator.', methodTags:[INTEGRATION_METHOD_TAGS.fPrimeOverF], structureTags:['log'], standardIntegralIds:['reciprocal'] }),
  freezeExample({ id:'log-adjust', expression:'x/(x²+4)', classification:'f-prime-over-f', inner:'x²+4', innerDerivative:'2x', matchingFactor:'x', adjustment:'1/2', antiderivative:'(1/2)ln(x²+4) + C', explanation:'x is one half of the denominator derivative 2x.', methodTags:[INTEGRATION_METHOD_TAGS.fPrimeOverF], structureTags:['log'], standardIntegralIds:['reciprocal'] }),
  freezeExample({ id:'tan-kx', expression:'tan(3x)', classification:'f-prime-over-f', inner:'cos(3x)', innerDerivative:'−3sin(3x)', matchingFactor:'sin(3x)', adjustment:'−1/3 after rewriting tan(3x)=sin(3x)/cos(3x)', antiderivative:'−(1/3)ln|cos(3x)| + C', explanation:'Rewrite tan as sin/cos; the numerator is a constant multiple of the denominator derivative.', methodTags:[INTEGRATION_METHOD_TAGS.fPrimeOverF], structureTags:['trig','rewrite-first'], standardIntegralIds:['reciprocal'] }),
  freezeExample({ id:'cot-kx', expression:'cot(2x)', classification:'f-prime-over-f', inner:'sin(2x)', innerDerivative:'2cos(2x)', matchingFactor:'cos(2x)', adjustment:'1/2 after rewriting cot(2x)=cos(2x)/sin(2x)', antiderivative:'(1/2)ln|sin(2x)| + C', explanation:'Rewrite cot as cos/sin and compare numerator with the denominator derivative.', methodTags:[INTEGRATION_METHOD_TAGS.fPrimeOverF], structureTags:['trig','rewrite-first'], standardIntegralIds:['reciprocal'] }),
  freezeExample({ id:'odd-power-trig', expression:'sin³x cos x', classification:'reverse-chain', inner:'sin x', innerDerivative:'cos x', matchingFactor:'cos x', adjustment:'1', antiderivative:'sin⁴x/4 + C', explanation:'Treat (sin x)^3 as a power of the inner function; cos x is its derivative.', methodTags:[INTEGRATION_METHOD_TAGS.reverseChain], structureTags:['trig','odd-power'], standardIntegralIds:['power'] }),
  freezeExample({ id:'definite-power', expression:'∫_0^1 2x(x²+1)^3 dx', classification:'reverse-chain', inner:'x²+1', innerDerivative:'2x', matchingFactor:'2x', adjustment:'1', antiderivative:'[(x²+1)^4/4]_0^1 = 15/4', explanation:'Recognition is unchanged for a definite integral; integrate first, then evaluate the original x-limits.', methodTags:[INTEGRATION_METHOD_TAGS.reverseChain], structureTags:['definite'], standardIntegralIds:['power'] })
]);

const byId = new Map(REVERSE_CHAIN_RECOGNITION_EXAMPLES.map((example) => [example.id, example]));
export function getRecognitionExample(id){ return byId.get(id) ?? null; }
export function listRecognitionExamples({classification=null}={}){ return classification ? REVERSE_CHAIN_RECOGNITION_EXAMPLES.filter((example)=>example.classification===classification) : REVERSE_CHAIN_RECOGNITION_EXAMPLES; }
export function getRecognitionFamily(id){ return RECOGNITION_FAMILIES.find((family)=>family.id===id) ?? null; }

export const STANDARD_INTEGRAL_RECOGNITION_SOURCE = STANDARD_INTEGRAL_DEFINITIONS;
