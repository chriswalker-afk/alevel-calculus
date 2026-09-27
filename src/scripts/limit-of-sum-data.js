import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';
import { STANDARD_INTEGRAL_DEFINITIONS } from './standard-integrals-data.js';
const freeze=Object.freeze;
export const LIMIT_OF_SUM_METHOD_TAG=INTEGRATION_METHOD_TAGS.limitOfSum;
export const STANDARD_INTEGRAL_LIMIT_SUM_SOURCE=STANDARD_INTEGRAL_DEFINITIONS;
export const LIMIT_OF_SUM_EXAMPLES=freeze([
 freeze({id:'unit-square',sum:'lim_(n→∞) Σₖ₌₁ⁿ (k/n)²(1/n)',integrand:'x²',lower:'0',upper:'1',integral:'∫₀¹x² dx',value:'1/3',laterMethod:INTEGRATION_METHOD_TAGS.standard}),
 freeze({id:'shifted-linear',sum:'lim_(n→∞) Σₖ₌₁ⁿ [1+2k/n](2/n)',integrand:'1+x',lower:'1',upper:'3',integral:'∫₁³(1+x) dx',value:'6',laterMethod:INTEGRATION_METHOD_TAGS.standard}),
 freeze({id:'reverse-chain',sum:'lim_(n→∞) Σₖ₌₁ⁿ 2xₖ cos(xₖ²) Δx, 0≤x≤1',integrand:'2x cos(x²)',lower:'0',upper:'1',integral:'∫₀¹2x cos(x²) dx',value:'sin 1',laterMethod:INTEGRATION_METHOD_TAGS.reverseChain})
]);
export function buildKNotation({a=0,b=1,n='n'}={}){return freeze({width:`Δx=(${b}−${a})/${n}`,sample:`xₖ=${a}+kΔx`,finite:`Σ f(xₖ)Δx`,limit:`lim_(${n}→∞) Σ f(xₖ)Δx`,integral:`∫_${a}^${b} f(x) dx`});}
