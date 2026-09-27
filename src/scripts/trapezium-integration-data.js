import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';
import { calculateTrapeziumRule, buildTrapeziumComparison, buildCoefficientSummary, buildLongWayTerms, buildOrdinateTable, classifyTrapeziumBound, TRAPEZIUM_RULE_FUNCTIONS } from './trapezium-rule-builder.js';
const freeze=Object.freeze;
export const TRAPEZIUM_METHOD_TAG=INTEGRATION_METHOD_TAGS.trapeziumRule;
export const TRAPEZIUM_BUILDER_SOURCE=freeze({calculateTrapeziumRule,buildTrapeziumComparison,buildCoefficientSummary,buildLongWayTerms,buildOrdinateTable,classifyTrapeziumBound,functions:TRAPEZIUM_RULE_FUNCTIONS});
export const TRAPEZIUM_CONTEXTS=freeze([
 freeze({id:'normal-density',label:'Standard normal-distribution density',numerical:true,expression:'φ(x) = (1/√(2π))e^(−x²/2)',contextOnly:true,reason:'This important probability density has no elementary antiderivative. Definite probabilities are therefore evaluated numerically; here it is a motivating context only, not a new integration technique.'}),
 freeze({id:'table-data',label:'Only tabulated values are supplied',numerical:true,reason:'No formula is available to integrate exactly; use the supplied ordinates.'}),
 freeze({id:'no-simple-antiderivative',label:'A definite integral has no simple course-level antiderivative',numerical:true,reason:'A numerical estimate is appropriate when an exact elementary antiderivative is unavailable.'}),
 freeze({id:'simple-polynomial',label:'A simple polynomial is given and exact value is requested',numerical:false,reason:'Integrate exactly unless the question explicitly asks for a numerical rule.'})
]);
export const TRAPEZIUM_REFINEMENT_COUNTS=freeze([1,2,4,8,16]);
export const TRAPEZIUM_REFINEMENT_MESSAGE='For the smooth, well-behaved curves met here, using more, thinner trapezia generally improves the approximation. This is not an absolute guarantee for every possible function.';
export const CALCULATOR_NUMERICAL_INTEGRATION_NOTE='A calculator definite-integral command also returns a numerical approximation obtained by a numerical method. The trapezium rule is one accessible example of numerical integration; this site does not assume that a ClassWiz uses the trapezium rule internally, and the calculator may use a different algorithm.';

export function percentageError(estimate, exact){const e=Number(estimate),x=Number(exact);if(!Number.isFinite(e)||!Number.isFinite(x)||Math.abs(x)<1e-12)return null;return Math.abs(e-x)/Math.abs(x)*100;}
export function generalTrapeziumFormula(){return 'estimate = (h/2)[y₀ + yₙ + 2(y₁ + … + yₙ₋₁)],  h=(b−a)/n';}
