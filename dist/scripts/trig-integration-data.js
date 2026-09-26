import { STANDARD_INTEGRAL_DEFINITIONS } from './standard-integrals-data.js';
import { INTEGRATION_METHOD_TAGS } from './integration-method-vocabulary.js';
export { INTEGRATION_METHOD_TAGS, INTEGRATION_METHOD_LABELS, INTEGRATION_METHOD_TAG_LIST, isIntegrationMethodTag, getIntegrationMethodLabel } from './integration-method-vocabulary.js';

const freeze=Object.freeze;
export const TRIG_IDENTITY_SOURCE_TOPIC='topic:y13:differentiation:trig-identities-inverse';
export const TRIG_INTEGRATION_IDENTITIES=freeze([
 freeze({id:'sin-square',left:'sin²x',right:'(1−cos 2x)/2',family:'double-angle',purpose:'Turns a squared sine into a constant plus a standard cosine integral.'}),
 freeze({id:'cos-square',left:'cos²x',right:'(1+cos 2x)/2',family:'double-angle',purpose:'Turns a squared cosine into a constant plus a standard cosine integral.'}),
 freeze({id:'tan-square',left:'tan²x',right:'sec²x−1',family:'pythagorean',purpose:'Exposes the standard sec² integral.'}),
 freeze({id:'pythagorean-sine',left:'1−sin²x',right:'cos²x',family:'pythagorean',purpose:'Useful when a sine power leaves a cosine-square factor.'}),
 freeze({id:'pythagorean-cosine',left:'1−cos²x',right:'sin²x',family:'pythagorean',purpose:'Useful when a cosine power leaves a sine-square factor.'})
]);



export const TRIG_INTEGRATION_EXAMPLES=freeze([
 freeze({id:'sin-square-basic',expression:'∫ sin²x dx',identityId:'sin-square',rewrite:'(1/2)∫(1−cos 2x) dx',route:'trig-identity',result:'x/2 − sin 2x/4 + C',scaled:false,definite:false}),
 freeze({id:'cos-square-basic',expression:'∫ cos²x dx',identityId:'cos-square',rewrite:'(1/2)∫(1+cos 2x) dx',route:'trig-identity',result:'x/2 + sin 2x/4 + C',scaled:false,definite:false}),
 freeze({id:'cos-square-scaled',expression:'∫ cos²(3x) dx',identityId:'cos-square',rewrite:'(1/2)∫(1+cos 6x) dx',route:'trig-identity',result:'x/2 + sin 6x/12 + C',scaled:true,definite:false}),
 freeze({id:'tan-square-basic',expression:'∫ tan²x dx',identityId:'tan-square',rewrite:'∫(sec²x−1) dx',route:'trig-identity',result:'tan x − x + C',scaled:false,definite:false}),
 freeze({id:'sin-square-definite',expression:'∫₀^(π/2) sin²x dx',identityId:'sin-square',rewrite:'(1/2)∫₀^(π/2)(1−cos 2x) dx',route:'trig-identity',result:'π/4',scaled:false,definite:true}),
 freeze({id:'already-standard',expression:'∫ sec²(4x) dx',identityId:null,rewrite:'No identity needed.',route:'standard-integral',result:'(1/4)tan 4x + C',scaled:true,definite:false}),
 freeze({id:'reverse-chain',expression:'∫ sin³x cos x dx',identityId:null,rewrite:'No identity needed: let the visible structure signal inner sin x.',route:'reverse-chain',result:'sin⁴x/4 + C',scaled:false,definite:false}),
 freeze({id:'substitution-later',expression:'∫ x cos(x²) dx',identityId:null,rewrite:'No trig identity helps; the inner x² suggests substitution/reverse-chain structure.',route:'substitution',result:'(1/2)sin(x²)+C',scaled:false,definite:false})
]);

export const STANDARD_INTEGRAL_TRIG_SOURCE=STANDARD_INTEGRAL_DEFINITIONS;
export function getTrigIntegrationIdentity(id){return TRIG_INTEGRATION_IDENTITIES.find(x=>x.id===id)??null;}
export function getTrigIntegrationExample(id){return TRIG_INTEGRATION_EXAMPLES.find(x=>x.id===id)??null;}
