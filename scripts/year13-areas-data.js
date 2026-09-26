import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';
import { INTEGRATION_AREA_POSITIVE_FUNCTIONS } from './integration-area-model.js';
export const AREA_EXPLORER_SOURCE=INTEGRATION_AREA_POSITIVE_FUNCTIONS;
export const AREA_METHOD_TAGS=INTEGRATION_METHOD_TAGS;
export const YEAR13_AREA_CASES=Object.freeze([
 Object.freeze({id:'line-curve',top:'y = x + 3',bottom:'y = x² − x + 1',limits:'0 to 2',split:false,geometry:false,method:INTEGRATION_METHOD_TAGS.standard,setup:'∫₀²[(x+3)−(x²−x+1)] dx'}),
 Object.freeze({id:'split-order',top:'changes at x = 0',bottom:'changes at x = 0',limits:'−1 to 1',split:true,geometry:false,method:INTEGRATION_METHOD_TAGS.standard,setup:'∫₋₁⁰(A−B)dx + ∫₀¹(B−A)dx'}),
 Object.freeze({id:'geometry-line',top:'straight line',bottom:'x-axis',limits:'0 to 4',split:false,geometry:true,method:'geometry',setup:'triangle/trapezium area is faster'}),
 Object.freeze({id:'reverse-chain-area',top:'curve',bottom:'x-axis',limits:'given',split:false,geometry:false,method:INTEGRATION_METHOD_TAGS.reverseChain,setup:'construct limits first; then recognise f′(x)g(f(x))'}),
 Object.freeze({id:'trig-area',top:'trig curve',bottom:'x-axis',limits:'given',split:false,geometry:false,method:INTEGRATION_METHOD_TAGS.trigIdentity,setup:'construct region first; then rewrite using an identity'}),
 Object.freeze({id:'substitution-area',top:'curve',bottom:'x-axis',limits:'given',split:false,geometry:false,method:INTEGRATION_METHOD_TAGS.substitution,setup:'construct x-limits first; then substitute and change limits'}),
 Object.freeze({id:'parts-area',top:'product curve',bottom:'x-axis',limits:'given',split:false,geometry:false,method:INTEGRATION_METHOD_TAGS.byParts,setup:'construct region first; then use parts'}),
 Object.freeze({id:'partial-fractions-area',top:'rational curve',bottom:'x-axis',limits:'given',split:false,geometry:false,method:INTEGRATION_METHOD_TAGS.partialFractions,setup:'construct region first; then decompose'})
]);
