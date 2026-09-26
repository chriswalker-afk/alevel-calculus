const freeze=Object.freeze;
export function isProperRational({numeratorDegree,denominatorDegree}){return Number(numeratorDegree)<Number(denominatorDegree);}
export function buildLinearDecomposition(factors=[]){
 const terms=[];
 for(const factor of factors){const power=Math.max(1,Number(factor.power)||1);for(let p=1;p<=power;p++)terms.push(`${String.fromCharCode(65+terms.length)}/(${factor.label})${p>1?`^${p}`:''}`);}
 return freeze(terms);
}
export function solveTwoDistinctLinear({a,b,p,q}){
 // (px+q)/((x-a)(x-b)) = A/(x-a)+B/(x-b)
 if(a===b)throw new Error('Distinct factors require a !== b.');
 const A=(p*a+q)/(a-b); const B=(p*b+q)/(b-a);
 return freeze({A,B});
}
export function solveRepeatedSquare({a,p,q}){
 // (px+q)/(x-a)^2 = A/(x-a)+B/(x-a)^2
 const A=p; const B=q+p*a;
 return freeze({A,B});
}
export function verifyTwoDistinct({a,b,p,q,A,B}){
 return Math.abs((A+B)-p)<1e-9 && Math.abs((-A*b-B*a)-q)<1e-9;
}
export function verifyRepeatedSquare({a,p,q,A,B}){
 return Math.abs(A-p)<1e-9 && Math.abs((B-A*a)-q)<1e-9;
}
