import { defineQuestionDefinition } from "../question-definition.js";
import { defineSolutionStep } from "../solution-step.js";
import { createPolynomialFunctionDefinition } from "../linked-function-gradient-explorer.js";

const topicId = "topic:y12:differentiation:basics";
const skill = (slug) => `skill:y12:differentiation:basics:${slug}`;

const superscripts = Object.freeze({0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹"});
function sup(n){ if(n===1) return ""; return String(n).split("").map(d=>superscripts[d] ?? d).join(""); }
function compact(value){ return String(value ?? "").toLowerCase().replace(/[\s·×*]/g,"").replace(/−/g,"-").replace(/√x/g,"sqrt(x)").replace(/⁻/g,"^-").replace(/⁰/g,"0").replace(/¹/g,"1").replace(/²/g,"2").replace(/³/g,"3").replace(/⁴/g,"4").replace(/\+\-/g,"-"); }
function numeric(expected, response){ const v=Number(String(response ?? "").trim()); return Number.isFinite(v) && Math.abs(v-expected)<=1e-9; }
function signedPolynomial(terms){
  return terms.filter(t=>t.coefficient!==0).map((t,i)=>{
    const c=t.coefficient, mag=Math.abs(c), sign=c<0?"−":"+";
    const coeff=t.power!==0 && mag===1?"":String(mag);
    const body=t.power===0?"":`x${sup(t.power)}`;
    const term=`${coeff}${body}`;
    return i===0?(c<0?`−${term}`:term):`${sign} ${term}`;
  }).join(" ") || "0";
}
function asciiPolynomial(terms){
  return terms.filter(t=>t.coefficient!==0).map((t,i)=>{
    const c=t.coefficient, mag=Math.abs(c), raw=t.power===0?String(mag):`${mag===1?"":mag}x${t.power===1?"":`^${t.power}`}`;
    return i===0?(c<0?`-${raw}`:raw):(c<0?`-${raw}`:`+${raw}`);
  }).join("") || "0";
}
function polynomialMatch(response, terms){ const got=compact(response); return [terms,[...terms].reverse()].some(order=>got===compact(asciiPolynomial(order))); }
function makeSteps(rows){ return rows.map((row,index)=>defineSolutionStep({id:`step-${index+1}`,kind:row.kind??"working",label:row.label,expression:row.expression,explanation:row.explanation})); }
function containsAll(text, groups){ const s=String(text??"").toLowerCase(); return groups.every(group=>group.some(token=>s.includes(token))); }

export const rewriteReciprocalDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao1:rewrite-reciprocal",
  courseScope:"y12",topicId,assessmentObjective:"ao1",microSkillId:skill("rewrite-powers"),difficulty:"standard",
  prerequisiteTags:["indices"],methodTags:["rewrite-negative-power","power-rule"],vocabularyTags:["vocab:power-index","vocab:differentiate"],
  errorCategories:["not-rewritten","sign-error","power-error"],
  diagnosticRules:{
    "not-rewritten":{kind:"recognition",supportNeed:"memorise",studentMessage:"Rewrite the reciprocal as a negative power before applying the power rule."},
    "sign-error":{kind:"execution",supportNeed:"ao1",studentMessage:"You chose the right method; focus on the negative exponent and coefficient sign."},
    "power-error":{kind:"execution",supportNeed:"ao1",studentMessage:"The reciprocal has been recognised; practise carrying the power rule through accurately."}
  }, defaultDiagnostic:{kind:"recognition",supportNeed:"memorise"},
  responseType:"algebraic",responseLabel:"Your derivative",placeholder:"e.g. -6x^-4",
  parameterGenerator({random}){ return {a:random.int(2,7),n:random.int(2,5)}; },
  promptRenderer(){ return "Rewrite using a negative power, then differentiate with respect to x."; },
  mathRenderer({a,n}){ return `y = ${a}/x${sup(n)}`; },
  answerChecker(response,{a,n}){
    const expected=`-${a*n}x^-${n+1}`; const alternative=`-${a*n}/x^${n+1}`; const got=compact(response);
    if(got===compact(expected)||got===compact(alternative)) return {tone:"correct",title:"Correct",message:"The reciprocal was rewritten and differentiated accurately."};
    if(got===compact(`${a}x^-${n}`)) return {tone:"incorrect",errorCategory:"not-rewritten",title:"Differentiate after rewriting",message:"Rewriting is only the setup; now apply the power rule."};
    if(got===compact(`${a*n}x^-${n+1}`)) return {tone:"incorrect",errorCategory:"sign-error",title:"Check the sign",message:"A negative exponent multiplies the coefficient, so the derivative coefficient is negative."};
    return {tone:"incorrect",errorCategory:"power-error",title:"Check the exponent",message:"After rewriting as a negative power, multiply by the old power and reduce the exponent by 1."};
  },
  workedSolutionGenerator({a,n}){ return makeSteps([
    {label:"Rewrite",expression:`y = ${a}x^−${n}`,explanation:"A reciprocal power becomes a negative power."},
    {label:"Apply the power rule",expression:`dy/dx = ${a}(−${n})x^−${n+1}`,explanation:"Multiply by the old power, then subtract 1 from the exponent."},
    {kind:"result",label:"Simplify",expression:`dy/dx = −${a*n}x^−${n+1}`,explanation:"This is equivalent to writing the result as a reciprocal."}
  ]); },
  hintSequenceGenerator(){ return [{id:"rewrite",text:"Write 1/xⁿ as x⁻ⁿ."},{id:"rule",text:"Then use the ordinary power rule on the negative exponent."}]; }
});

export const rewriteRootDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao1:rewrite-root",
  courseScope:"y12",topicId,assessmentObjective:"ao1",microSkillId:skill("rewrite-powers"),difficulty:"standard",
  prerequisiteTags:["indices"],methodTags:["rewrite-fractional-power","power-rule"],vocabularyTags:["vocab:power-index","vocab:differentiate"],
  errorCategories:["not-rewritten","coefficient-error","power-error"],
  diagnosticRules:{
    "not-rewritten":{kind:"recognition",supportNeed:"memorise",studentMessage:"Rewrite the root as a fractional power before differentiating."},
    "coefficient-error":{kind:"execution",supportNeed:"ao1",studentMessage:"The fractional power is recognised; practise multiplying the coefficient by 1/2 accurately."},
    "power-error":{kind:"execution",supportNeed:"ao1",studentMessage:"The setup is right; focus on subtracting 1 from the fractional exponent."}
  }, defaultDiagnostic:{kind:"recognition",supportNeed:"memorise"},
  responseType:"algebraic",responseLabel:"Your derivative",placeholder:"e.g. 3x^-1/2",
  parameterGenerator({random}){ return {k:random.int(1,6)}; },
  promptRenderer(){ return "Rewrite the root as a power, then differentiate."; },
  mathRenderer({k}){ return `y = ${2*k}√x`; },
  answerChecker(response,{k}){
    const got=compact(response); const accepted=[`${k}x^-1/2`,`${k}/sqrt(x)`,`${k}x^(-1/2)`].map(compact);
    if(accepted.includes(got)) return {tone:"correct",title:"Correct",message:"The root was rewritten as x^(1/2) and differentiated correctly."};
    if(got===compact(`${2*k}x^1/2`)||got===compact(`${2*k}sqrt(x)`)) return {tone:"incorrect",errorCategory:"not-rewritten",title:"Now differentiate",message:"Rewriting creates a power-rule form; it is not yet the derivative."};
    if(got===compact(`${2*k}x^-1/2`)) return {tone:"incorrect",errorCategory:"coefficient-error",title:"Multiply by 1/2",message:"The new coefficient should be half the original coefficient."};
    return {tone:"incorrect",errorCategory:"power-error",title:"Check the new power",message:"1/2 − 1 = −1/2."};
  },
  workedSolutionGenerator({k}){ return makeSteps([
    {label:"Rewrite",expression:`y = ${2*k}x^(1/2)`,explanation:"√x is x^(1/2)."},
    {label:"Apply the power rule",expression:`dy/dx = ${2*k}(1/2)x^(−1/2)`,explanation:"Multiply by the old power and subtract 1 from the exponent."},
    {kind:"result",label:"Simplify",expression:`dy/dx = ${k}x^(−1/2)`,explanation:`Equivalent form: ${k}/√x.`}
  ]); },
  hintSequenceGenerator(){ return [{id:"root",text:"Use √x = x^(1/2)."},{id:"half",text:"After differentiating, the new power is −1/2."}]; }
});

export const termByTermDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao1:term-by-term-polynomial",
  courseScope:"y12",topicId,assessmentObjective:"ao1",microSkillId:skill("term-by-term"),difficulty:"standard",
  prerequisiteTags:["algebraic-simplification","integer-powers"],methodTags:["term-by-term","power-rule"],vocabularyTags:["vocab:differentiate","vocab:coefficient","vocab:constant"],
  errorCategories:["term-omitted","constant-retained","power-rule-error"],
  diagnosticRules:{
    "term-omitted":{kind:"execution",supportNeed:"ao1",studentMessage:"Differentiate every term independently before recombining the result."},
    "constant-retained":{kind:"recognition",supportNeed:"memorise",supportMicroSkillId:skill("constant-and-linear"),studentMessage:"Recall what happens to a constant under differentiation."},
    "power-rule-error":{kind:"recognition",supportNeed:"memorise",supportMicroSkillId:skill("power-rule"),studentMessage:"Retrieve the power rule before retrying the polynomial."}
  }, defaultDiagnostic:{kind:"execution",supportNeed:"ao1"},
  responseType:"algebraic",responseLabel:"Your derivative",placeholder:"e.g. 12x^3 - 6x + 4",
  parameterGenerator({random}){ const p=random.int(3,5),q=random.int(2,p-1); return {a:random.int(2,5),b:-random.int(2,5),c:random.int(1,7),d:random.int(-8,8),p,q}; },
  promptRenderer(){ return "Differentiate the polynomial term by term."; },
  mathRenderer({a,b,c,d,p,q}){ return `y = ${signedPolynomial([{coefficient:a,power:p},{coefficient:b,power:q},{coefficient:c,power:1},{coefficient:d,power:0}])}`; },
  answerChecker(response,{a,b,c,d,p,q}){
    const expected=[{coefficient:a*p,power:p-1},{coefficient:b*q,power:q-1},{coefficient:c,power:0}];
    if(polynomialMatch(response,expected)) return {tone:"correct",title:"Correct",message:"Every term has been differentiated and recombined accurately."};
    if(polynomialMatch(response,[expected[0],expected[2]])) return {tone:"incorrect",errorCategory:"term-omitted",title:"One term is missing",message:"Differentiate every term in the original polynomial."};
    if(d!==0 && polynomialMatch(response,[...expected,{coefficient:d,power:0}])) return {tone:"incorrect",errorCategory:"constant-retained",title:"Remove the original constant",message:"A constant differentiates to 0."};
    return {tone:"incorrect",errorCategory:"power-rule-error",title:"Check each term",message:"Apply the power rule separately to every non-constant term."};
  },
  workedSolutionGenerator({a,b,c,d,p,q}){ const original=signedPolynomial([{coefficient:a,power:p},{coefficient:b,power:q},{coefficient:c,power:1},{coefficient:d,power:0}]); const derivative=signedPolynomial([{coefficient:a*p,power:p-1},{coefficient:b*q,power:q-1},{coefficient:c,power:0}]); return makeSteps([
    {label:"Separate the terms",expression:`d/dx [${original}]`,explanation:"Treat addition and subtraction term by term."},
    {label:"Differentiate each term",expression:`${a}x${sup(p)} → ${a*p}x${sup(p-1)},   ${Math.abs(b)}x${sup(q)} → ${Math.abs(b*q)}x${sup(q-1)},   ${c}x → ${c},   ${d} → 0`,explanation:"Use the power rule on each power term."},
    {kind:"result",label:"Recombine",expression:`dy/dx = ${derivative}`,explanation:"Keep the original plus/minus structure as the differentiated terms are recombined."}
  ]); },
  hintSequenceGenerator(){ return [{id:"all",text:"Mark each term before differentiating so none are lost."},{id:"constant",text:"Remember that the constant contributes 0."}]; }
});

const graphFamilies = Object.freeze([
  {id:"quadratic",label:"quadratic",coefficients:[0,0,1],functionText:"x²",derivativeText:"2x",correct:"line-origin",options:[
    {id:"line-origin",label:"Graph A — straight line through the origin, rising left to right"},
    {id:"horizontal-positive",label:"Graph B — horizontal line above the x-axis"},
    {id:"upward-parabola",label:"Graph C — upward-opening parabola"},
    {id:"line-falling",label:"Graph D — straight line through the origin, falling left to right"}
  ],candidateGraphs:[
    {id:"line-origin",coefficients:[0,2]},
    {id:"horizontal-positive",coefficients:[2]},
    {id:"upward-parabola",coefficients:[0,0,1]},
    {id:"line-falling",coefficients:[0,-2]}
  ]},
  {id:"cubic",label:"cubic",coefficients:[0,-3,0,1],functionText:"x³ − 3x",derivativeText:"3x² − 3",correct:"upward-shifted",options:[
    {id:"upward-shifted",label:"Graph A — upward-opening parabola crossing the x-axis twice"},
    {id:"line-origin",label:"Graph B — straight line through the origin"},
    {id:"cubic",label:"Graph C — cubic with two turning points"},
    {id:"horizontal-negative",label:"Graph D — horizontal line below the x-axis"}
  ],candidateGraphs:[
    {id:"upward-shifted",coefficients:[-3,0,3]},
    {id:"line-origin",coefficients:[0,2]},
    {id:"cubic",coefficients:[0,-3,0,1]},
    {id:"horizontal-negative",coefficients:[-3]}
  ]}
]);

export const graphMatchingDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao1:function-derivative-graph-match",
  courseScope:"y12",topicId,assessmentObjective:"ao1",microSkillId:skill("function-derivative-match"),difficulty:"standard",
  prerequisiteTags:["polynomial-graphs"],methodTags:["match-representations","gradient-sign"],vocabularyTags:["vocab:derivative","vocab:gradient-function","vocab:increasing","vocab:decreasing"],
  errorCategories:["function-height-confusion","gradient-sign-confusion","graph-shape-confusion"],
  diagnosticRules:{
    "function-height-confusion":{kind:"recognition",supportNeed:"understand",studentMessage:"The derivative graph records gradient, not the height of the original function."},
    "gradient-sign-confusion":{kind:"recognition",supportNeed:"understand",studentMessage:"Reconnect increasing/decreasing behaviour with the sign of the derivative."},
    "graph-shape-confusion":{kind:"recognition",supportNeed:"understand",studentMessage:"Use tangent gradients across x-values to reconstruct the gradient function."}
  }, defaultDiagnostic:{kind:"recognition",supportNeed:"understand"},
  responseType:"choice",responseLabel:"Choose the derivative graph",placeholder:"",
  parameterGenerator({random}){ return {...random.pick(graphFamilies)}; },
  promptRenderer(){ return "Which description matches the graph of f′(x)?"; },
  mathRenderer({functionText}){ return `f(x) = ${functionText}`; },
  responseOptionsRenderer({options}){ return options; },
  answerChecker(response,{correct}){
    if(response===correct) return {tone:"correct",title:"Correct",message:"The derivative graph matches the gradient pattern of f."};
    const cat=response==="cubic"||response==="upward-parabola"?"function-height-confusion":response?.includes("fall")||response?.includes("negative")?"gradient-sign-confusion":"graph-shape-confusion";
    return {tone:"incorrect",errorCategory:cat,title:"Use gradients, not heights",message:"Track where f is increasing, decreasing and horizontal; f′ records those gradients."};
  },
  workedSolutionGenerator({functionText,derivativeText}){ return makeSteps([
    {label:"Read the original graph",expression:`f(x) = ${functionText}`,explanation:"Identify where tangent gradients are positive, negative or zero."},
    {label:"Differentiate to verify",expression:`f′(x) = ${derivativeText}`,explanation:"The algebra confirms the gradient-function shape."},
    {kind:"result",label:"Match the graph",expression:`graph of y = ${derivativeText}`,explanation:"Choose the graph description with this shape and sign behaviour."}
  ]); },
  hintSequenceGenerator(){ return [{id:"sign",text:"Where f is increasing, f′ must be above the x-axis; where f is decreasing, f′ must be below it."},{id:"zeros",text:"Horizontal tangents on f correspond to x-intercepts of f′."}]; },
  diagramConfig:{kind:"function-derivative-choice",xDomain:[-2.4,2.4],functionYDomain:[-7,7],candidateYDomain:[-7,7]}
});

export const explainGradientFunctionDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao2:explain-gradient-function",
  courseScope:"y12",topicId,assessmentObjective:"ao2",microSkillId:skill("function-derivative-match"),difficulty:"standard",
  prerequisiteTags:["polynomial-graphs"],methodTags:["explain-gradient-sign","connect-representations"],vocabularyTags:["vocab:gradient","vocab:gradient-function","vocab:increasing","vocab:decreasing"],
  errorCategories:["height-not-gradient","missing-sign-link","incomplete-explanation"],
  diagnosticRules:{
    "height-not-gradient":{kind:"recognition",supportNeed:"understand",studentMessage:"Revisit the idea that f′(x) gives the gradient of f, not its y-coordinate."},
    "missing-sign-link":{kind:"recognition",supportNeed:"understand",studentMessage:"Reconnect derivative sign with increasing/decreasing behaviour."},
    "incomplete-explanation":{kind:"recognition",supportNeed:"understand",studentMessage:"Use the tangent-gradient meaning of f′ to justify the statement."}
  }, defaultDiagnostic:{kind:"recognition",supportNeed:"understand"},
  responseType:"short-reasoning",responseLabel:"Your explanation",placeholder:"Explain using gradient and derivative sign.",
  parameterGenerator({random}){ const x=random.pick([-2,-1,1,2]); return {x,gradient:2*x}; },
  promptRenderer({x,gradient}){ return `For f(x)=x², explain what f′(${x})=${gradient} tells you about the graph of f at x=${x}.`; },
  mathRenderer({x,gradient}){ return `f′(${x}) = ${gradient}`; },
  answerChecker(response,{gradient}){
    const s=String(response??"").toLowerCase(); const needs=gradient>0?["positive","increas","rising","upward"]:["negative","decreas","falling","downward"];
    const mentionsGradient=/gradient|slope|tangent/.test(s); const mentionsBehaviour=needs.some(t=>s.includes(t));
    if(mentionsGradient&&mentionsBehaviour) return {tone:"correct",title:"Well justified",message:"You connected the derivative value to tangent gradient and local graph behaviour."};
    if(/height|y-coordinate|y coordinate/.test(s)) return {tone:"warning",errorCategory:"height-not-gradient",title:"Derivative height has a different meaning",message:"f′(x) records the gradient of f at that x-value, not the height of f."};
    if(mentionsGradient) return {tone:"warning",errorCategory:"missing-sign-link",title:"Interpret the sign",message:"Add what the sign of the gradient tells you about whether f is increasing or decreasing."};
    return {tone:"warning",errorCategory:"incomplete-explanation",title:"Use tangent gradient",message:"Explain what f′ means geometrically, then interpret its sign."};
  },
  workedSolutionGenerator({x,gradient}){ return makeSteps([
    {label:"Meaning of f′",expression:`f′(${x}) = ${gradient}`,explanation:"This is the gradient of the tangent to f at x = ${x}."},
    {kind:"reasoning",label:"Interpret the sign",expression:gradient>0?"gradient > 0":"gradient < 0",explanation:gradient>0?"The graph is increasing at this point.":"The graph is decreasing at this point."}
  ]); },
  hintSequenceGenerator(){ return [{id:"meaning",text:"Start by saying what f′(x) measures on the original graph."},{id:"sign",text:"Then interpret whether the derivative is positive or negative."}]; }
});

export const errorCorrectionDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao2:error-correction",
  courseScope:"y12",topicId,assessmentObjective:"ao2",microSkillId:skill("error-correction"),difficulty:"standard",
  prerequisiteTags:["indices","algebraic-simplification"],methodTags:["error-analysis","rewrite-powers","term-by-term"],vocabularyTags:["vocab:differentiate","vocab:power-index"],
  errorCategories:["names-answer-only","wrong-misconception","incomplete-correction"],
  diagnosticRules:{
    "names-answer-only":{kind:"recognition",supportNeed:"ao1",supportMicroSkillId:skill("rewrite-powers"),studentMessage:"You can produce a correction, but AO2 also requires identifying why the original method fails."},
    "wrong-misconception":{kind:"recognition",supportNeed:"memorise",supportMicroSkillId:skill("rewrite-powers"),studentMessage:"Review how reciprocals are rewritten as negative powers before diagnosing the method."},
    "incomplete-correction":{kind:"execution",supportNeed:"ao1",supportMicroSkillId:skill("rewrite-powers"),studentMessage:"You have located the issue; practise carrying the corrected method through to the derivative."}
  }, defaultDiagnostic:{kind:"recognition",supportNeed:"memorise",supportMicroSkillId:skill("rewrite-powers")},
  responseType:"short-reasoning",responseLabel:"Explain the error and correct it",placeholder:"State the error, then give the corrected derivative.",
  parameterGenerator({random}){ const n=random.int(2,4),a=random.int(2,6); return {n,a}; },
  promptRenderer({a,n}){ return `A student says: “${a}/x${sup(n)} differentiates to ${a*n}/x${sup(n-1)} because I brought the power down.” Explain the error and correct the derivative.`; },
  mathRenderer({a,n}){ return `${a}/x${sup(n)}  →  ${a*n}/x${sup(n-1)}  ?`; },
  answerChecker(response,{a,n}){
    const s=String(response??"").toLowerCase().replace(/−/g,"-"); const mentionsNegative=/negative|x\s*\^?\s*-/.test(s); const mentionsDerivative=s.includes(String(-a*n))||s.includes(`-${a*n}`); const explains=/rewrite|reciprocal|negative power|exponent/.test(s);
    if(explains&&mentionsNegative&&mentionsDerivative) return {tone:"correct",title:"Good diagnosis",message:"You identified the negative-power issue and corrected the derivative."};
    if(mentionsDerivative&&!explains) return {tone:"warning",errorCategory:"names-answer-only",title:"Explain why",message:"The corrected result is useful, but AO2 requires the misconception to be identified."};
    if(explains) return {tone:"warning",errorCategory:"incomplete-correction",title:"Finish the correction",message:"Now carry the corrected negative-power method through to the final derivative."};
    return {tone:"warning",errorCategory:"wrong-misconception",title:"Focus on the reciprocal",message:"The key issue occurs before differentiation: rewrite the reciprocal as a negative power."};
  },
  workedSolutionGenerator({a,n}){ return makeSteps([
    {label:"Identify the misconception",expression:`${a}/x${sup(n)} = ${a}x^−${n}`,explanation:"The original exponent is negative, not positive."},
    {label:"Differentiate the correct power",expression:`dy/dx = ${a}(−${n})x^−${n+1}`,explanation:"Multiply by the old exponent and subtract 1 from it."},
    {kind:"result",label:"Correct result",expression:`dy/dx = −${a*n}x^−${n+1}`,explanation:"The sign and new exponent both follow from the negative power."}
  ]); },
  hintSequenceGenerator(){ return [{id:"first",text:"Check the student's very first representation of the reciprocal."},{id:"rewrite",text:"Rewrite 1/xⁿ as x⁻ⁿ before differentiating."}]; }
});

export const unknownCoefficientsDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao2:unknown-coefficients",
  courseScope:"y12",topicId,assessmentObjective:"ao2",microSkillId:skill("unknown-coefficients"),difficulty:"standard",
  prerequisiteTags:["linear-equations","algebraic-simplification"],methodTags:["differentiate-then-solve","simultaneous-equations"],vocabularyTags:["vocab:coefficient","vocab:derivative"],
  errorCategories:["used-function-values","differentiation-error","equation-solving-error"],
  diagnosticRules:{
    "used-function-values":{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-function"),studentMessage:"The conditions are about f′, so begin with the gradient function rather than f itself."},
    "differentiation-error":{kind:"execution",supportNeed:"ao1",supportMicroSkillId:skill("term-by-term"),studentMessage:"Practise differentiating the polynomial accurately before using the conditions."},
    "equation-solving-error":{kind:"execution",supportNeed:"ao1",supportMicroSkillId:skill("power-rule"),studentMessage:"Your differentiation route is appropriate; check the algebra after forming the derivative equations."}
  }, defaultDiagnostic:{kind:"execution",supportNeed:"ao1",supportMicroSkillId:skill("term-by-term")},
  responseType:"numeric",responseLabel:"Value of a",placeholder:"Enter a",
  parameterGenerator({random}){ const a=random.int(1,5),b=random.int(-5,5)||2; return {a,b,m:3*a+2*b,n:12*a+4*b}; },
  promptRenderer({m,n}){ return `f(x)=ax³+bx². Given f′(1)=${m} and f′(2)=${n}, find a.`; },
  mathRenderer(){ return `f(x) = ax³ + bx²`; },
  answerChecker(response,{a,b,m,n}){
    if(numeric(a,response)) return {tone:"correct",title:"Correct",message:"You used the derivative conditions to determine the coefficient."};
    if(numeric(m,response)||numeric(n,response)) return {tone:"incorrect",errorCategory:"used-function-values",title:"Use both derivative conditions",message:"The given numbers are gradient values, not the coefficient a."};
    return {tone:"incorrect",errorCategory:"equation-solving-error",title:"Form two equations in a and b",message:"Differentiate first, substitute x=1 and x=2 into f′, then solve the resulting simultaneous equations."};
  },
  workedSolutionGenerator({a,b,m,n}){ return makeSteps([
    {label:"Differentiate",expression:"f′(x) = 3ax² + 2bx",explanation:"The conditions refer to the derivative, so form the gradient function first."},
    {label:"Use x = 1",expression:`3a + 2b = ${m}`,explanation:"Substitute x=1 into f′(x)."},
    {label:"Use x = 2",expression:`12a + 4b = ${n}`,explanation:"Substitute x=2 into f′(x)."},
    {kind:"result",label:"Solve",expression:`a = ${a},  b = ${b}`,explanation:"Solve the two linear equations simultaneously."}
  ]); },
  hintSequenceGenerator(){ return [{id:"derive",text:"Differentiate f(x) before using either condition."},{id:"equations",text:"Substitute x=1 and x=2 into f′(x) to obtain two equations in a and b."}]; }
});

export const simpleApplicationRateDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao3:simple-rate-application",
  courseScope:"y12",topicId,assessmentObjective:"ao3",microSkillId:skill("simple-applications"),difficulty:"standard",
  prerequisiteTags:["power-rule","function-notation"],methodTags:["model-rate-of-change","differentiate-then-evaluate"],vocabularyTags:["vocab:derivative","vocab:gradient"],
  errorCategories:["evaluated-model","wrong-rate-rule","context-sign-error"],
  diagnosticRules:{
    "evaluated-model":{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-function"),studentMessage:"The question asks for a rate of change, so use the derivative rather than the model value."},
    "wrong-rate-rule":{kind:"execution",supportNeed:"ao1",supportMicroSkillId:skill("power-rule"),studentMessage:"The modelling decision is right; practise differentiating the polynomial accurately."},
    "context-sign-error":{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-on-curve"),studentMessage:"Interpret the sign of the derivative as the direction of change in the context."}
  }, defaultDiagnostic:{kind:"execution",supportNeed:"ao1",supportMicroSkillId:skill("power-rule")},
  responseType:"numeric",responseLabel:"Rate of change",placeholder:"Enter the signed rate",
  parameterGenerator({random}){ const a=random.int(1,3),b=-random.int(4,9),c=random.int(6,14),t=random.int(1,3); return {a,b,c,t,rate:3*a*t*t+2*b*t+c}; },
  promptRenderer({t}){ return `The height h metres of a test object after t seconds is modelled by h(t)=at³+bt²+ct. Using the model shown, find its instantaneous vertical velocity at t=${t}. Give a signed answer.`; },
  mathRenderer({a,b,c}){ return `h(t) = ${a===1?"":a}t³ ${b<0?"−":"+"} ${Math.abs(b)}t² + ${c}t`; },
  answerChecker(response,{a,b,c,t,rate}){
    if(numeric(rate,response)) return {tone:"correct",title:"Correct",message:`The instantaneous vertical velocity is ${rate} m/s.`};
    const height=a*t**3+b*t**2+c*t;
    if(numeric(height,response)) return {tone:"incorrect",errorCategory:"evaluated-model",title:"That is height, not velocity",message:"Differentiate the height model to obtain instantaneous vertical velocity."};
    if(numeric(Math.abs(rate),response)&&rate<0) return {tone:"incorrect",errorCategory:"context-sign-error",title:"Keep the sign",message:"A negative velocity means the object is moving downward; the sign is part of the answer."};
    return {tone:"incorrect",errorCategory:"wrong-rate-rule",title:"Differentiate the model first",message:"Find h′(t), then substitute the stated time."};
  },
  workedSolutionGenerator({a,b,c,t,rate}){ return makeSteps([
    {label:"Choose the calculus",expression:"instantaneous velocity = h′(t)",explanation:"The derivative of height with respect to time is vertical velocity."},
    {label:"Differentiate the model",expression:`h′(t) = ${3*a}t² ${2*b<0?"−":"+"} ${Math.abs(2*b)}t + ${c}`,explanation:"Differentiate each term with respect to time."},
    {kind:"result",label:`Evaluate at t = ${t}`,expression:`h′(${t}) = ${rate} m/s`,explanation:rate<0?"The negative sign means downward motion.":"The positive sign means upward motion."}
  ]); },
  hintSequenceGenerator(){ return [{id:"quantity",text:"Ask what derivative represents the requested instantaneous quantity."},{id:"derive",text:"Differentiate h(t) with respect to t before substituting the time."}]; }
});

export const simpleApplicationInterpretDefinition = defineQuestionDefinition({
  templateId:"question-template:y12:differentiation:basics:ao3:interpret-rate-sign",
  courseScope:"y12",topicId,assessmentObjective:"ao3",microSkillId:skill("simple-applications"),difficulty:"standard",
  prerequisiteTags:["gradient-sign"],methodTags:["interpret-derivative","context"],vocabularyTags:["vocab:derivative","vocab:gradient"],
  errorCategories:["no-context","sign-misread","incomplete-interpretation"],
  diagnosticRules:{
    "no-context":{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-on-curve"),studentMessage:"Reconnect derivative sign with direction of change, then state that meaning in the context."},
    "sign-misread":{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-on-curve"),studentMessage:"Review what positive and negative gradients mean before interpreting the model."},
    "incomplete-interpretation":{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-function"),studentMessage:"State both the direction of change and the units/rate meaning."}
  }, defaultDiagnostic:{kind:"recognition",supportNeed:"understand",supportMicroSkillId:skill("gradient-on-curve")},
  responseType:"short-reasoning",responseLabel:"Interpret the derivative",placeholder:"State what the sign and magnitude mean in context.",
  parameterGenerator({random}){ const rate=random.pick([-12,-8,-5,6,9,14]); return {rate}; },
  promptRenderer({rate}){ return `At a particular instant, a height model has h′(t)=${rate}. Interpret this value in context.`; },
  mathRenderer({rate}){ return `h′(t) = ${rate} m/s`; },
  answerChecker(response,{rate}){
    const s=String(response??"").toLowerCase(); const direction=rate<0?["down","decreas","fall"]:["up","increas","ris"];
    const hasDirection=direction.some(t=>s.includes(t)); const hasRate=/m\/s|metre|meter|per second|rate|velocity/.test(s);
    if(hasDirection&&hasRate) return {tone:"correct",title:"Good interpretation",message:"You interpreted both direction and rate in the original context."};
    if((rate<0&&/up|increas|ris/.test(s))||(rate>0&&/down|decreas|fall/.test(s))) return {tone:"warning",errorCategory:"sign-misread",title:"Check the sign",message:"The sign of the derivative tells you the direction of change."};
    if(!hasDirection&&!hasRate) return {tone:"warning",errorCategory:"no-context",title:"Return to the situation",message:"Do not leave the derivative as a bare number; explain what it means for the object's height."};
    return {tone:"warning",errorCategory:"incomplete-interpretation",title:"Complete the interpretation",message:"Include both direction of change and the rate/units."};
  },
  workedSolutionGenerator({rate}){ return makeSteps([
    {label:"Read the sign",expression:rate<0?"h′(t) < 0":"h′(t) > 0",explanation:rate<0?"Height is decreasing at that instant.":"Height is increasing at that instant."},
    {kind:"reasoning",label:"Return to context",expression:`${Math.abs(rate)} m/s`,explanation:rate<0?`The object is moving downward at ${Math.abs(rate)} m/s.`:`The object is moving upward at ${rate} m/s.`}
  ]); },
  hintSequenceGenerator(){ return [{id:"sign",text:"First interpret whether the derivative is positive or negative."},{id:"units",text:"Then state the rate using the units m/s."}]; }
});

export const basicsAssessmentQuestionDefinitions = Object.freeze([
  rewriteReciprocalDefinition,
  rewriteRootDefinition,
  termByTermDefinition,
  graphMatchingDefinition,
  explainGradientFunctionDefinition,
  errorCorrectionDefinition,
  unknownCoefficientsDefinition,
  simpleApplicationRateDefinition,
  simpleApplicationInterpretDefinition
]);
