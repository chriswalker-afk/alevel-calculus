import { defineQuestionDefinition } from '../question-definition.js';
import { defineSolutionStep } from '../solution-step.js';

const topicId='topic:y12:differentiation:tangents-normals';
const skill=(slug)=>`skill:y12:differentiation:tangents-normals:${slug}`;
const step=(id,label,expression,explanation)=>defineSolutionStep({id,kind:'working',label,expression,explanation});
const num=(value,response)=>{const got=Number(String(response??'').trim());return Number.isFinite(got)&&Math.abs(got-value)<1e-9;};
const compact=(v)=>String(v??'').toLowerCase().replace(/\s+/g,'').replace(/−/g,'-').replace(/\*/g,'');
const ok=(message='Correct.')=>({success:true,tone:'correct',title:'Correct',message});
const bad=(errorCategory,message)=>({success:false,tone:'incorrect',title:'Check this step',message,errorCategory});
function contains(response, parts){const t=compact(response);return parts.every(p=>t.includes(compact(p)));}

function base(config){return defineQuestionDefinition({courseScope:'y12',topicId,difficulty:'core',prerequisiteTags:[],methodTags:['tangents-normals'],vocabularyTags:['vocab:tangent','vocab:normal'],hintSequence:[{id:'h1',text:'Write down the point of contact and the relevant gradient before forming a line equation.'}],...config});}

export const tangentGradientDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:tangent-gradient',assessmentObjective:'ao1',microSkillId:skill('tangent-gradient'),responseType:'numeric',responseLabel:'Tangent gradient',placeholder:'e.g. 6',
  errorCategories:['derivative','substitution'],diagnosticRules:{derivative:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:'skill:y12:differentiation:basics:power-rule',studentMessage:'Review the derivative before substituting the x-value.'},substitution:{kind:'execution',supportNeed:'ao1',studentMessage:'The derivative is the gradient function; now evaluate it at the stated x-value.'}},defaultDiagnostic:{kind:'execution',supportNeed:'understand'},
  parameterGenerator:({random})=>{const a=random.pick([-2,-1,1,2,3]); const c=random.pick([1,2,3]); return {a,c,expected:2*c*a};},
  promptRenderer:({a,c})=>`For f(x) = ${c}x² + 1, find the gradient of the tangent at x = ${a}.`,mathRenderer:({a,c})=>`f′(x) = ${2*c}x, so evaluate f′(${a}).`,
  answerChecker:(r,p)=>num(p.expected,r)?ok():bad('substitution','Differentiate first, then substitute the given x-value.'),
  workedSolutionGenerator:(p)=>[step('1','Differentiate',`f′(x) = ${2*p.c}x`,'The derivative gives the tangent gradient function.'),step('2','Evaluate',`f′(${p.a}) = ${p.expected}`,'Substitute x = a.')]
});

export const tangentLineDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:tangent-line',assessmentObjective:'ao1',microSkillId:skill('tangent-line'),responseType:'algebraic',responseLabel:'Tangent equation',placeholder:'y - 1 = 2(x - 1)',
  errorCategories:['gradient','point','line-form'],diagnosticRules:{gradient:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('tangent-gradient'),studentMessage:'Find f′(a) before forming the line.'},point:{kind:'recognition',supportNeed:'understand',studentMessage:'The tangent passes through (a,f(a)).'},'line-form':{kind:'execution',supportNeed:'understand',studentMessage:'Use point-slope form with the gradient and point of contact.'}},defaultDiagnostic:{kind:'execution',supportNeed:'understand'},
  parameterGenerator:()=>({a:1,y:1,m:2}),promptRenderer:()=>`For f(x)=x², find the equation of the tangent at x=1. Give an equivalent line equation.`,mathRenderer:()=>`Point of contact: (1,1), tangent gradient: 2.`,
  answerChecker:(r)=>{const t=compact(r);return ['y-1=2(x-1)','y=2x-1'].includes(t)?ok():bad('line-form','Use the point (1,1) and gradient 2 in a valid straight-line equation.');},
  workedSolutionGenerator:()=>[step('1','Point','(1, 1)','Evaluate f(1).'),step('2','Gradient','f′(1)=2','Differentiate then evaluate.'),step('3','Line','y − 1 = 2(x − 1)','Use point-slope form.')]
});

export const normalGradientDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:normal-gradient',assessmentObjective:'ao1',microSkillId:skill('normal-gradient'),responseType:'numeric',responseLabel:'Normal gradient',placeholder:'e.g. -0.5',
  errorCategories:['perpendicular'],diagnosticRules:{perpendicular:{kind:'recognition',supportNeed:'understand',studentMessage:'Perpendicular non-vertical lines have gradients whose product is −1.'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
  parameterGenerator:({random})=>{const m=random.pick([-4,-2,2,4]);return {m,expected:-1/m};},promptRenderer:({m})=>`A tangent has gradient ${m}. Find the gradient of the normal.`,mathRenderer:()=>`m_tangent × m_normal = −1`,
  answerChecker:(r,p)=>num(p.expected,r)?ok():bad('perpendicular','Take the negative reciprocal of the tangent gradient.'),workedSolutionGenerator:(p)=>[step('1','Perpendicular gradients',`${p.m} × m_normal = −1`,'The tangent and normal are perpendicular.'),step('2','Normal gradient',`m_normal = ${p.expected}`,'Divide by the tangent gradient.')]
});

export const normalLineDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:normal-line',assessmentObjective:'ao1',microSkillId:skill('normal-line'),responseType:'algebraic',responseLabel:'Normal equation',placeholder:'y - 1 = -0.5(x - 1)',
  errorCategories:['perpendicular','point','line-form'],diagnosticRules:{perpendicular:{kind:'recognition',supportNeed:'understand',supportMicroSkillId:skill('normal-gradient'),studentMessage:'Convert the tangent gradient to its negative reciprocal.'},point:{kind:'recognition',supportNeed:'understand',studentMessage:'The normal passes through the same point of contact.'},'line-form':{kind:'execution',supportNeed:'understand',studentMessage:'Use point-slope form with the normal gradient.'}},defaultDiagnostic:{kind:'execution',supportNeed:'understand'},
  parameterGenerator:()=>({}),promptRenderer:()=>`For f(x)=x², find the equation of the normal at x=1.`,mathRenderer:()=>`Point (1,1), tangent gradient 2.`,
  answerChecker:(r)=>{const t=compact(r);return ['y-1=-0.5(x-1)','y-1=-1/2(x-1)','y=-0.5x+1.5','y=-x/2+3/2'].includes(t)?ok():bad('line-form','Use point (1,1) with normal gradient −1/2.');},
  workedSolutionGenerator:()=>[step('1','Tangent gradient','m_tangent=2','f′(1)=2.'),step('2','Normal gradient','m_normal=−1/2','Take the negative reciprocal.'),step('3','Line','y−1=−1/2(x−1)','Use the same point of contact.')]
});

export const explainPerpendicularDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:explain-perpendicular',assessmentObjective:'ao2',microSkillId:skill('normal-gradient'),responseType:'short-reasoning',responseLabel:'Explain',
  errorCategories:['perpendicular'],diagnosticRules:{perpendicular:{kind:'recognition',supportNeed:'understand',studentMessage:'Connect perpendicular lines with the product of their gradients.'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
  parameterGenerator:()=>({}),promptRenderer:()=>`Explain why a tangent with gradient 3 has a normal with gradient −1/3.`,
  answerChecker:(r)=>contains(r,['perpendicular'])&&(contains(r,['-1'])||contains(r,['negative reciprocal']))?ok():bad('perpendicular','State that tangent and normal are perpendicular and connect this to product −1 or negative reciprocals.'),workedSolutionGenerator:()=>[step('1','Relationship','m_tangent × m_normal = −1','Perpendicular non-vertical lines have gradient product −1.'),step('2','Apply','3 × (−1/3)=−1','So the normal gradient is −1/3.')]
});

export const specialCaseDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:special-case',assessmentObjective:'ao2',microSkillId:skill('special-cases'),responseType:'choice',responseLabel:'Normal line',
  errorCategories:['special-case'],diagnosticRules:{'special-case':{kind:'recognition',supportNeed:'understand',studentMessage:'A horizontal tangent is perpendicular to a vertical normal.'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
  parameterGenerator:()=>({}),promptRenderer:()=>`At x=2 the marked point P on the curve has a horizontal tangent. Select the normal line through P.`,responseOptionsRenderer:()=>[{id:'a',label:'A: y = 1'},{id:'b',label:'B: x = 2'},{id:'c',label:'C: y = 0'},{id:'d',label:'D: y−1=−(x−2)'}],answerChecker:(r)=>r==='b'?ok():bad('special-case','A horizontal tangent has a vertical normal through x=2.'),workedSolutionGenerator:()=>[step('1','Tangent','m_tangent=0','The tangent is horizontal.'),step('2','Perpendicular line','normal: x=2','The perpendicular line is vertical through the same x-coordinate.')],diagramConfig:{kind:'calculus-line-selector',title:'Select the normal',instruction:'Use the local geometry at P. The candidate lines are labelled on the graph and repeated as large buttons.',graphTitle:'A curve with a horizontal tangent at P',coefficients:[5,-4,1],xDomain:[0,4],yDomain:[-1,6],point:{x:2,y:1,label:'P'},lines:[{id:'a',label:'A: y = 1',slope:0,graphLabel:'A',tone:'tangent'},{id:'b',label:'B: x = 2',vertical:true,x:2,graphLabel:'B',tone:'accent'},{id:'c',label:'C: y = 0',slope:0,graphLabel:'C',tone:'warning',labelX:3.4},{id:'d',label:'D: y−1=−(x−2)',slope:-1,graphLabel:'D',tone:'bound'}],responseMap:{a:'a',b:'b',c:'c',d:'d'}}
});
export const diagnoseLineDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:diagnose-line',assessmentObjective:'ao2',microSkillId:skill('tangent-line'),responseType:'choice',responseLabel:'Choose the error',
  errorCategories:['point'],diagnosticRules:{point:{kind:'recognition',supportNeed:'understand',studentMessage:'The line must pass through (a,f(a)), not (a,f′(a)).'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
  parameterGenerator:()=>({}),promptRenderer:()=>`For f(x)=x² at x=2, a student writes the tangent as y−4=4(x−4). What is the error?`,responseOptionsRenderer:()=>[{id:'a',label:'The gradient should be 2.'},{id:'b',label:'The point should use x=2, so x−2.'},{id:'c',label:'A tangent uses a negative reciprocal.'},{id:'d',label:'There is no error.'}],answerChecker:(r)=>r==='b'?ok():bad('point','The point of contact is (2,4), so the line must use x−2.'),workedSolutionGenerator:()=>[step('1','Point','(2,4)','f(2)=4.'),step('2','Gradient','f′(2)=4','The gradient is correct.'),step('3','Correction','y−4=4(x−2)','The x-coordinate in point-slope form must be 2.')]
});

export const applicationDefinition=base({
  templateId:'question-template:y12:differentiation:tangents-normals:application',assessmentObjective:'ao3',microSkillId:skill('normal-line'),responseType:'numeric',responseLabel:'y-intercept',placeholder:'e.g. 1.5',
  errorCategories:['method'],diagnosticRules:{method:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('normal-line'),studentMessage:'Build the normal equation first, then read or calculate its intercept.'}},defaultDiagnostic:{kind:'execution',supportNeed:'ao1'},
  parameterGenerator:()=>({expected:1.5}),promptRenderer:()=>`The normal to y=x² at x=1 meets the y-axis at B. Find the y-coordinate of B.`,mathRenderer:()=>`Use the normal through (1,1).`,answerChecker:(r,p)=>num(p.expected,r)?ok():bad('method','Find the normal equation y−1=−1/2(x−1), then set x=0.'),workedSolutionGenerator:()=>[step('1','Normal gradient','−1/2','The tangent gradient at x=1 is 2.'),step('2','Normal equation','y−1=−1/2(x−1)','Use point-slope form.'),step('3','At the y-axis','x=0 ⇒ y=3/2','Substitute x=0.')]
});

export const tangentsNormalsAssessmentQuestionDefinitions=Object.freeze([tangentGradientDefinition,tangentLineDefinition,normalGradientDefinition,normalLineDefinition,explainPerpendicularDefinition,specialCaseDefinition,diagnoseLineDefinition,applicationDefinition]);
