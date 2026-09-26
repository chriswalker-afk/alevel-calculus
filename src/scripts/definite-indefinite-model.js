export function evaluateBracket(F,a,b){return F(b)-F(a);}
export function definiteIntegralFromAntiderivative(F,a,b){return evaluateBracket(F,a,b);}
export function evaluateWithConstant(F,a,b,C=0){return (F(b)+C)-(F(a)+C);}
export function constantCancellationState(F,a,b,constants=[-3,0,3]){return Object.freeze(constants.map(C=>Object.freeze({C,value:evaluateWithConstant(F,a,b,C)})));}
export function reverseLimits(value){return -value;}
export function zeroWidthIntegral(){return 0;}
export function splitIntegral(left,right){return left+right;}
export function differenceFromZero(toB,toA){return toB-toA;}
