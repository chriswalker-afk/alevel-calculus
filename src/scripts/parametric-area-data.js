import { PARAMETRIC_CURVES } from './parametric-curve-tracer.js';
import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';

const freeze=Object.freeze;
export const PARAMETRIC_AREA_METHOD_TAG=INTEGRATION_METHOD_TAGS.parametricArea;
export const PARAMETRIC_AREA_TRACER_SOURCE=PARAMETRIC_CURVES;

export const PARAMETRIC_AREA_CURVES=freeze([
 freeze({
  id:'parametric-area-positive',label:'Positive curve: x=t, y=t²+1',expressions:freeze({x:'t',y:'t² + 1',dxdt:'1',dydt:'2t'}),
  tDomain:freeze([0,2.5]),xDomain:freeze([-0.5,3]),yDomain:freeze([-0.5,8]),initialT:1.25,
  x:t=>t,y:t=>t*t+1,dxdt:()=>1,dydt:t=>2*t,
  description:'A positive curve for deriving a thin vertical strip without sign changes.'
 }),
 freeze({
  id:'parametric-area-limit-conversion',label:'Limit conversion: x=t²+1, y=t+2',expressions:freeze({x:'t² + 1',y:'t + 2',dxdt:'2t',dydt:'1'}),
  tDomain:freeze([0,2.2]),xDomain:freeze([0,6]),yDomain:freeze([0,5]),initialT:1,
  x:t=>t*t+1,y:t=>t+2,dxdt:t=>2*t,dydt:()=>1,
  description:'The x-boundaries 1 and 5 correspond to t=0 and t=2 on the non-negative branch.'
 }),
 freeze({
  id:'parametric-area-ellipse',label:'Upper ellipse: x=3cos t, y=2sin t',expressions:freeze({x:'3 cos t',y:'2 sin t',dxdt:'−3 sin t',dydt:'2 cos t'}),
  tDomain:freeze([0,Math.PI]),xDomain:freeze([-4,4]),yDomain:freeze([-0.5,3]),initialT:Math.PI/3,
  x:t=>3*Math.cos(t),y:t=>2*Math.sin(t),dxdt:t=>-3*Math.sin(t),dydt:t=>2*Math.cos(t),
  description:'Increasing t travels from right to left, so dx/dt is negative on the upper arc.'
 }),
 freeze({
  id:'parametric-area-trig',label:'Mixed technique: x=t, y=cos²t',expressions:freeze({x:'t',y:'cos²t',dxdt:'1',dydt:'−sin 2t'}),
  tDomain:freeze([0,Math.PI/2]),xDomain:freeze([-0.2,2]),yDomain:freeze([-0.2,1.3]),initialT:Math.PI/4,
  x:t=>t,y:t=>Math.cos(t)**2,dxdt:()=>1,dydt:t=>-Math.sin(2*t),
  description:'After the parametric setup, the remaining integral requires a trig identity.'
 })
]);

export const PARAMETRIC_AREA_CASES=freeze([
 freeze({id:'thin-strip',curveId:'parametric-area-positive',xBounds:'x=0 to x=2',tLimits:'t=0 to t=2',setup:'A=∫₀²(t²+1)(1)dt',direction:'right',signed:false,laterMethod:INTEGRATION_METHOD_TAGS.standard}),
 freeze({id:'convert-limits',curveId:'parametric-area-limit-conversion',xBounds:'x=1 to x=5',tLimits:'t=0 to t=2',setup:'A=∫₀²(t+2)(2t)dt',direction:'right',signed:false,laterMethod:INTEGRATION_METHOD_TAGS.standard}),
 freeze({id:'negative-dxdt',curveId:'parametric-area-ellipse',xBounds:'x=3 to x=−3',tLimits:'t=0 to t=π',setup:'∫₀^π (2sin t)(−3sin t)dt',direction:'left',signed:true,laterMethod:INTEGRATION_METHOD_TAGS.trigIdentity}),
 freeze({id:'geometric-ellipse',curveId:'parametric-area-ellipse',xBounds:'x=−3 to x=3',tLimits:'t=π to t=0',setup:'A=∫_π^0 (2sin t)(−3sin t)dt=3π',direction:'right',signed:false,laterMethod:INTEGRATION_METHOD_TAGS.trigIdentity}),
 freeze({id:'mixed-trig',curveId:'parametric-area-trig',xBounds:'x=0 to x=π/2',tLimits:'t=0 to t=π/2',setup:'A=∫₀^(π/2) cos²t dt',direction:'right',signed:false,laterMethod:INTEGRATION_METHOD_TAGS.trigIdentity}),
 freeze({id:'mixed-substitution',curveId:null,xBounds:'given',tLimits:'converted first',setup:'A=∫ y(t)x′(t)dt, then simplify',direction:'check x′(t)',signed:false,laterMethod:INTEGRATION_METHOD_TAGS.substitution}),
 freeze({id:'mixed-parts',curveId:null,xBounds:'given',tLimits:'converted first',setup:'A=∫ y(t)x′(t)dt, then simplify',direction:'check x′(t)',signed:false,laterMethod:INTEGRATION_METHOD_TAGS.byParts})
]);

export function getParametricAreaCurve(id){return PARAMETRIC_AREA_CURVES.find(c=>c.id===id)??null;}
export function describeXDirection(dxdt){return dxdt>1e-10?'x increasing':dxdt<-1e-10?'x decreasing':'x stationary';}
export function calculateThinStripState(definition,t,dt=0.04){
 const x=definition.x(t),y=definition.y(t),dxdt=definition.dxdt(t),dxApprox=dxdt*dt;
 return freeze({t,x,y,dxdt,dt,dxApprox,stripAreaApprox:y*dxApprox,integrand:y*dxdt,direction:describeXDirection(dxdt)});
}
