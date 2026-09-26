import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';
import { calculateTrapeziumRule, buildCoefficientSummary, buildLongWayTerms, buildOrdinateTable, classifyTrapeziumBound, TRAPEZIUM_RULE_FUNCTIONS } from './trapezium-rule-builder.js';
const freeze=Object.freeze;
export const TRAPEZIUM_METHOD_TAG=INTEGRATION_METHOD_TAGS.trapeziumRule;
export const TRAPEZIUM_BUILDER_SOURCE=freeze({calculateTrapeziumRule,buildCoefficientSummary,buildLongWayTerms,buildOrdinateTable,classifyTrapeziumBound,functions:TRAPEZIUM_RULE_FUNCTIONS});
export const TRAPEZIUM_CONTEXTS=freeze([
 freeze({id:'table-data',label:'Only tabulated values are supplied',numerical:true,reason:'No formula is available to integrate exactly; use the supplied ordinates.'}),
 freeze({id:'no-simple-antiderivative',label:'A definite integral has no simple course-level antiderivative',numerical:true,reason:'A numerical estimate is appropriate when an exact elementary antiderivative is unavailable.'}),
 freeze({id:'simple-polynomial',label:'A simple polynomial is given and exact value is requested',numerical:false,reason:'Integrate exactly unless the question explicitly asks for a numerical rule.'})
]);
export function percentageError(estimate, exact){const e=Number(estimate),x=Number(exact);if(!Number.isFinite(e)||!Number.isFinite(x)||Math.abs(x)<1e-12)return null;return Math.abs(e-x)/Math.abs(x)*100;}
export function generalTrapeziumFormula(){return 'estimate = (h/2)[y₀ + yₙ + 2(y₁ + … + yₙ₋₁)],  h=(b−a)/n';}
