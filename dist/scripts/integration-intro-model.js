export function integratePowerTerm(coefficient,power){
  const a=Number(coefficient), n=Number(power);
  if(!Number.isFinite(a)||!Number.isFinite(n)) throw new Error('Power-term parameters must be finite.');
  if(n===-1) return Object.freeze({supported:false,reason:'n=-1 exception'});
  return Object.freeze({supported:true,coefficient:a/(n+1),power:n+1});
}
export function differentiatePowerTerm(coefficient,power){return Object.freeze({coefficient:Number(coefficient)*Number(power),power:Number(power)-1});}
export function sameDerivativeUpToConstant(a,b,{samples=[-2,-1,0,1,2],tolerance=1e-9}={}){
  return samples.every(x=>Math.abs(a.derivative(x)-b.derivative(x))<=tolerance);
}
export const integrationExamples=Object.freeze([
  Object.freeze({id:'quadratic',derivative:'2x',antiderivative:'x² + C',specific:['x² − 3','x²','x² + 4']}),
  Object.freeze({id:'cubic',derivative:'3x²',antiderivative:'x³ + C',specific:['x³ − 2','x³','x³ + 5']})
]);
