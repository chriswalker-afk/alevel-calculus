function freezeFact(config){return Object.freeze({...config,tags:Object.freeze([...(config.tags??[])])});}
export const STANDARD_INTEGRAL_FACTS=Object.freeze([
 freezeFact({id:'power',family:'power',integrand:'x^n',antiderivative:'x^(n+1)/(n+1) + C',condition:'n ≠ −1',derivativeCheck:'d/dx[x^(n+1)/(n+1)] = x^n',tags:['power','core']}),
 freezeFact({id:'reciprocal',family:'log',integrand:'1/x',antiderivative:'ln|x| + C',condition:'x ≠ 0',derivativeCheck:'d/dx[ln|x|] = 1/x',tags:['log','core']}),
 freezeFact({id:'exp-e',family:'exponential',integrand:'e^x',antiderivative:'e^x + C',condition:'',derivativeCheck:'d/dx[e^x] = e^x',tags:['exponential','core']}),
 freezeFact({id:'exp-a-kx',family:'exponential',integrand:'a^(kx)',antiderivative:'a^(kx)/(k ln a) + C',condition:'a>0, a≠1, k≠0',derivativeCheck:'d/dx[a^(kx)/(k ln a)] = a^(kx)',tags:['exponential','scaled']}),
 freezeFact({id:'cos',family:'trig',integrand:'cos x',antiderivative:'sin x + C',condition:'radians',derivativeCheck:'d/dx[sin x] = cos x',tags:['trig','core']}),
 freezeFact({id:'sin',family:'trig',integrand:'sin x',antiderivative:'−cos x + C',condition:'radians',derivativeCheck:'d/dx[−cos x] = sin x',tags:['trig','core','sign']}),
 freezeFact({id:'sec2',family:'trig',integrand:'sec²x',antiderivative:'tan x + C',condition:'radians',derivativeCheck:'d/dx[tan x] = sec²x',tags:['trig','core']}),
 freezeFact({id:'cosec2',family:'trig',integrand:'cosec²x',antiderivative:'−cot x + C',condition:'radians',derivativeCheck:'d/dx[−cot x] = cosec²x',tags:['trig','core','sign']}),
 freezeFact({id:'sec-tan',family:'trig',integrand:'sec x tan x',antiderivative:'sec x + C',condition:'radians',derivativeCheck:'d/dx[sec x] = sec x tan x',tags:['trig','core']}),
 freezeFact({id:'cosec-cot',family:'trig',integrand:'cosec x cot x',antiderivative:'−cosec x + C',condition:'radians',derivativeCheck:'d/dx[−cosec x] = cosec x cot x',tags:['trig','core','sign']})
]);
export const LINEAR_STANDARD_INTEGRAL_FORMS=Object.freeze([
 freezeFact({id:'linear-power',family:'linear-input',integrand:'(ax+b)^n',antiderivative:'(ax+b)^(n+1)/(a(n+1)) + C',condition:'a≠0, n≠−1',derivativeCheck:'differentiate: factor a cancels 1/a',tags:['scaled','power']}),
 freezeFact({id:'linear-reciprocal',family:'linear-input',integrand:'1/(ax+b)',antiderivative:'(1/a)ln|ax+b| + C',condition:'a≠0',derivativeCheck:'differentiate: (1/a)·a/(ax+b)=1/(ax+b)',tags:['scaled','log']}),
 freezeFact({id:'linear-exp-e',family:'linear-input',integrand:'e^(ax+b)',antiderivative:'(1/a)e^(ax+b) + C',condition:'a≠0',derivativeCheck:'differentiate: (1/a)·a e^(ax+b)=e^(ax+b)',tags:['scaled','exponential']}),
 freezeFact({id:'linear-cos',family:'linear-input',integrand:'cos(ax+b)',antiderivative:'(1/a)sin(ax+b) + C',condition:'a≠0; radians',derivativeCheck:'differentiate: (1/a)·a cos(ax+b)=cos(ax+b)',tags:['scaled','trig']}),
 freezeFact({id:'linear-sin',family:'linear-input',integrand:'sin(ax+b)',antiderivative:'−(1/a)cos(ax+b) + C',condition:'a≠0; radians',derivativeCheck:'differentiate: −(1/a)·[−a sin(ax+b)]=sin(ax+b)',tags:['scaled','trig','sign']})
]);
export const STANDARD_INTEGRAL_DEFINITIONS=Object.freeze([...STANDARD_INTEGRAL_FACTS,...LINEAR_STANDARD_INTEGRAL_FORMS]);
const byId=new Map(STANDARD_INTEGRAL_DEFINITIONS.map(f=>[f.id,f]));
export function getStandardIntegralFact(id){return byId.get(id)??null;}
export function listStandardIntegralFacts({includeLinear=true}={}){return includeLinear?STANDARD_INTEGRAL_DEFINITIONS:STANDARD_INTEGRAL_FACTS;}
export const FUNDAMENTAL_THEOREM_STATEMENT=Object.freeze({name:'Fundamental Theorem of Calculus',condition:'If F′(x)=f(x)',definite:'∫_a^b f(x) dx = F(b) − F(a)',meaning:'The theorem is the formal bridge between antiderivatives and accumulated signed area.'});
