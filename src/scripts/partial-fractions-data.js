import { STANDARD_INTEGRAL_DEFINITIONS } from './standard-integrals-data.js';
import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';
const freeze=Object.freeze;
export const PARTIAL_FRACTIONS_METHOD_TAG=INTEGRATION_METHOD_TAGS.partialFractions;
export const STANDARD_INTEGRAL_PARTIAL_FRACTIONS_SOURCE=STANDARD_INTEGRAL_DEFINITIONS;
export const PARTIAL_FRACTIONS_PREREQUISITE='prerequisite:algebra:partial-fractions-polynomial-division';
export const PARTIAL_FRACTION_STRUCTURES=freeze([
 freeze({id:'distinct-two',label:'Two distinct linear factors',denominator:'(x−a)(x−b)',decomposition:'A/(x−a) + B/(x−b)',rule:'One constant numerator for each distinct linear factor.'}),
 freeze({id:'distinct-three',label:'Three distinct linear factors',denominator:'(x−a)(x−b)(x−c)',decomposition:'A/(x−a) + B/(x−b) + C/(x−c)',rule:'Include one term for every distinct linear factor.'}),
 freeze({id:'repeated-two',label:'Repeated linear factor',denominator:'(x−a)²',decomposition:'A/(x−a) + B/(x−a)²',rule:'Include every power from 1 up to the repeated power.'}),
 freeze({id:'improper',label:'Improper rational function',denominator:'degree numerator ≥ degree denominator',decomposition:'polynomial quotient + proper remainder/denominator',rule:'Polynomial division comes before partial-fraction decomposition.'})
]);
export const PARTIAL_FRACTION_EXAMPLES=freeze([
 freeze({id:'distinct',kind:'distinct',expression:'(5x+1)/((x−1)(x+2))',proper:true,structureId:'distinct-two',coefficientMethod:'convenient-values',coefficients:freeze({A:2,B:3}),decomposition:'2/(x−1) + 3/(x+2)',integrated:'2ln|x−1| + 3ln|x+2| + C',singleLog:'ln|(x−1)²(x+2)³| + C'}),
 freeze({id:'repeated',kind:'repeated',expression:'(3x+5)/(x−1)²',proper:true,structureId:'repeated-two',coefficientMethod:'coefficient-comparison',coefficients:freeze({A:3,B:8}),decomposition:'3/(x−1) + 8/(x−1)²',integrated:'3ln|x−1| − 8/(x−1) + C',singleLog:null}),
 freeze({id:'improper',kind:'improper',expression:'(x²+3x+5)/((x+1)(x+2))',proper:false,structureId:'improper',division:'1 + 3/((x+1)(x+2))',coefficients:freeze({A:3,B:-3}),decomposition:'1 + 3/(x+1) − 3/(x+2)',integrated:'x + 3ln|x+1| − 3ln|x+2| + C',singleLog:'x + 3ln|(x+1)/(x+2)| + C'}),
 freeze({id:'definite',kind:'definite',expression:'∫₀¹ 3/((x+1)(x+2)) dx',proper:true,structureId:'distinct-two',coefficients:freeze({A:3,B:-3}),decomposition:'3/(x+1) − 3/(x+2)',integrated:'[3ln(x+1) − 3ln(x+2)]₀¹',singleLog:'3ln(4/3)'})
]);
export const LOG_LAWS=freeze([
 freeze({id:'product',left:'ln A + ln B',right:'ln(AB)'}),
 freeze({id:'quotient',left:'ln A − ln B',right:'ln(A/B)'}),
 freeze({id:'power',left:'k ln A',right:'ln(A^k)'}),
 freeze({id:'constant',left:'C',right:'ln K, K>0',note:'Because every real C can be written as ln(e^C), the arbitrary constant can be absorbed into one positive multiplicative constant.'})
]);
export function getPartialFractionStructure(id){return PARTIAL_FRACTION_STRUCTURES.find(x=>x.id===id)??null;}
export function getPartialFractionExample(id){return PARTIAL_FRACTION_EXAMPLES.find(x=>x.id===id)??null;}
