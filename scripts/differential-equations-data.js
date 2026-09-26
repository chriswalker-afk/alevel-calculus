import { INTEGRATION_METHOD_TAGS } from './integration-method-vocabulary.js';
const freeze=Object.freeze;
export const RATE_TRANSLATION_EXAMPLES=freeze([
 freeze({id:'proportional-x',statement:'The rate of change of y with respect to x is proportional to x.',equation:'dy/dx = kx',sign:'k carries the direction',reason:'“proportional to x” means multiply x by a constant k.'}),
 freeze({id:'decay-y',statement:'The rate of decrease of y is proportional to y.',equation:'dy/dx = −ky',sign:'negative for decrease (k>0)',reason:'“rate of decrease” gives the negative sign; proportionality supplies k.'}),
 freeze({id:'inverse-square',statement:'The rate of change of y is inversely proportional to x².',equation:'dy/dx = k/x²',sign:'sign is carried by k unless the context says increase/decrease',reason:'Inverse proportionality to x² means multiply by 1/x².'})
]);
export const SEPARATION_EXAMPLES=freeze([
 freeze({id:'simple-product',equation:'dy/dx = x(y+1)',separable:true,separated:'1/(y+1) dy = x dx',move:'divide by (y+1), then multiply by dx'}),
 freeze({id:'linear-y',equation:'dy/dx = −2xy',separable:true,separated:'1/y dy = −2x dx',move:'divide by y, then multiply by dx'}),
 freeze({id:'reciprocal-x',equation:'dy/dx = (1+y²)/x',separable:true,separated:'1/(1+y²) dy = 1/x dx',move:'divide by (1+y²), then multiply by dx'}),
 freeze({id:'not-separable',equation:'dy/dx = x + y',separable:false,separated:null,move:'addition ties x and y together; ordinary separation is not available'})
]);
export const INTEGRATED_EXAMPLES=freeze([
 freeze({id:'power',separated:'dy = x dx',leftIntegral:'∫1 dy = y + C₁',rightIntegral:'∫x dx = ½x² + C₂',combined:'y = ½x² + C',methodTags:freeze([INTEGRATION_METHOD_TAGS.standard])}),
 freeze({id:'log-family',separated:'1/y dy = −2x dx',leftIntegral:'∫1/y dy = ln|y| + C₁',rightIntegral:'∫−2x dx = −x² + C₂',combined:'ln|y| = −x² + C',methodTags:freeze([INTEGRATION_METHOD_TAGS.standard])})
]);
export function isSeparatedForm(text=''){
 const value=String(text).replace(/\s+/g,'');
 const left=value.split('=')[0]||'', right=value.split('=')[1]||'';
 return /dy/.test(left)&&!/x/.test(left.replace(/dx/g,''))&&/dx/.test(right)&&!/y/.test(right.replace(/dy/g,''));
}
export function combineArbitraryConstants(left='C₁',right='C₂'){return `${right} − ${left} = C`;}

export const MODEL_INTERPRETATION_EXAMPLES=freeze([
 freeze({id:'growth',context:'Population P (thousands), time t (years)',equation:'dP/dt = 0.18P',condition:'P(0)=4',particular:'P = 4e^(0.18t)',units:'P in thousands; dP/dt in thousands per year',longTerm:'The mathematical model grows without bound as t→∞.',assumption:'The proportional growth rate 0.18 remains constant.',limitation:'Resources and carrying capacity make indefinite exponential growth unrealistic.'}),
 freeze({id:'cooling',context:'Temperature excess θ (°C), time t (minutes)',equation:'dθ/dt = −0.12θ',condition:'θ(0)=70',particular:'θ = 70e^(−0.12t)',units:'θ in °C; dθ/dt in °C per minute',longTerm:'θ→0 as t→∞.',assumption:'Cooling rate remains proportional to temperature excess.',limitation:'The model assumes a constant surrounding temperature and unchanged heat-transfer conditions.'}),
 freeze({id:'price',context:'Price p (£), time t (months)',equation:'dp/dt = −k/p',condition:'p(0)=20',particular:'p² = 400 − 2kt',units:'dp/dt in £ per month',longTerm:'The formula reaches p=0 at a finite model time.',assumption:'The inverse-price rate relationship remains valid.',limitation:'The model must stop before p≤0; negative prices are outside the realistic domain.'})
]);
export function applyInitialCondition({generalValueAtPoint,targetValue}){return targetValue-generalValueAtPoint;}
export function modelValidityChecklist({units=false,sign=false,longTerm=false,assumption=false,domain=false}={}){return freeze({units,sign,longTerm,assumption,domain,complete:units&&sign&&longTerm&&assumption&&domain});}
