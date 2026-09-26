import { STANDARD_INTEGRAL_DEFINITIONS } from './standard-integrals-data.js';
import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';
const freeze=Object.freeze;
export const INTEGRATION_BY_PARTS_METHOD_TAG=INTEGRATION_METHOD_TAGS.byParts;
export const STANDARD_INTEGRAL_PARTS_SOURCE=STANDARD_INTEGRAL_DEFINITIONS;
export const PRODUCT_RULE_SOURCE_TOPIC='topic:y13:differentiation:product-quotient-chain';
export const PARTS_FORMULA=freeze({
  productRule:'d(uv)/dx = u dv/dx + v du/dx',
  rearranged:'u dv/dx = d(uv)/dx − v du/dx',
  integral:'∫u dv = uv − ∫v du',
  principle:'Choose u and dv so that the new integral ∫v du is easier than the original.'
});
export const PARTS_METHOD_POSITION=freeze([
  freeze({id:'standard',expression:'∫e^x dx',method:INTEGRATION_METHOD_TAGS.standard,reason:'Already a standard integral.'}),
  freeze({id:'reverse',expression:'∫2x cos(x²) dx',method:INTEGRATION_METHOD_TAGS.reverseChain,reason:'The inner derivative is visible.'}),
  freeze({id:'identity',expression:'∫cos²x dx',method:INTEGRATION_METHOD_TAGS.trigIdentity,reason:'A trig identity exposes standard integrals.'}),
  freeze({id:'substitution',expression:'∫x cos(x²+1) dx',method:INTEGRATION_METHOD_TAGS.substitution,reason:'A systematic change of variable makes the structure standard.'}),
  freeze({id:'partial-fractions',expression:'∫(5x+1)/((x−1)(x+2)) dx',method:INTEGRATION_METHOD_TAGS.partialFractions,reason:'A proper rational function with factorised linear denominator should be decomposed before integration.'}),
  freeze({id:'parts',expression:'∫x e^x dx',method:INTEGRATION_BY_PARTS_METHOD_TAG,reason:'No earlier route removes the product; differentiating x simplifies it.'})
]);
export const PARTS_CHOICE_PREVIEWS=freeze([
  freeze({id:'x-exp',expression:'∫x e^x dx',choices:freeze([
    freeze({id:'good',u:'x',dv:'e^x dx',du:'dx',v:'e^x',newIntegral:'∫e^x dx',easier:true,reason:'x differentiates to 1 while e^x integrates unchanged.'}),
    freeze({id:'poor',u:'e^x',dv:'x dx',du:'e^x dx',v:'x²/2',newIntegral:'(1/2)∫x²e^x dx',easier:false,reason:'The polynomial degree increases, so the new integral is harder.'})
  ])}),
  freeze({id:'x-sin',expression:'∫x sin x dx',choices:freeze([
    freeze({id:'good',u:'x',dv:'sin x dx',du:'dx',v:'−cos x',newIntegral:'−∫cos x dx',easier:true,reason:'The x factor disappears after differentiation.'}),
    freeze({id:'poor',u:'sin x',dv:'x dx',du:'cos x dx',v:'x²/2',newIntegral:'(1/2)∫x²cos x dx',easier:false,reason:'The polynomial becomes more complicated.'})
  ])})
]);
export const PARTS_EXAMPLES=freeze([
  freeze({id:'basic',expression:'∫x e^x dx',result:'e^x(x−1)+C',kind:'basic',steps:freeze(['u=x, dv=e^x dx','du=dx, v=e^x','∫x e^x dx = x e^x − ∫e^x dx','=e^x(x−1)+C'])}),
  freeze({id:'definite',expression:'∫₀¹x e^x dx',result:'1',kind:'definite',steps:freeze(['[x e^x − e^x]₀¹','=[e^x(x−1)]₀¹','=0−(−1)=1'])}),
  freeze({id:'hidden-one',expression:'∫ln x dx',result:'x ln x−x+C',kind:'hidden-one',steps:freeze(['∫1·ln x dx','u=ln x, dv=dx','du=(1/x)dx, v=x','x ln x−∫1 dx','=x ln x−x+C'])}),
  freeze({id:'repeated',expression:'∫x²e^x dx',result:'e^x(x²−2x+2)+C',kind:'repeated',steps:freeze(['x²e^x−∫2x e^x dx','=x²e^x−2(xe^x−∫e^x dx)','=e^x(x²−2x+2)+C'])}),
  freeze({id:'cyclic',expression:'I=∫e^x cos x dx',result:'(e^x/2)(sin x+cos x)+C',kind:'cyclic',steps:freeze(['I=e^x cos x+∫e^x sin x dx','∫e^x sin x dx=e^x sin x−I','I=e^x(cos x+sin x)−I','2I=e^x(sin x+cos x)','I=(e^x/2)(sin x+cos x)+C'])})
]);
export const DI_TABLE_EXAMPLE=freeze({
  expression:'∫x²e^x dx',
  signs:freeze(['+','−','+']),
  derivatives:freeze(['x²','2x','2','0']),
  integrals:freeze(['e^x','e^x','e^x']),
  products:freeze(['+x²e^x','−2xe^x','+2e^x']),
  result:'e^x(x²−2x+2)+C'
});
export function getPartsChoicePreview(id){return PARTS_CHOICE_PREVIEWS.find(x=>x.id===id)??null;}
export function getPartsExample(id){return PARTS_EXAMPLES.find(x=>x.id===id)??null;}
