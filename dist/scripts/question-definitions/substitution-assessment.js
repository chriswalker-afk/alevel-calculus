import { defineQuestionDefinition } from '../question-definition.js';
import { defineSolutionStep } from '../solution-step.js';
import { INTEGRATION_METHOD_TAGS } from '../integration-method-vocabulary.js';
import { SUBSTITUTION_METHOD_TAG } from '../substitution-data.js';
const topicId='topic:y13:integration:substitution';
const skill=s=>`skill:y13:integration:substitution:${s}`;
const step=(id,label,expression,explanation)=>defineSolutionStep({id,kind:'working',label,expression,explanation});
const ok=(m='Correct.')=>({success:true,tone:'correct',title:'Correct',message:m});
const bad=(c,m)=>({success:false,tone:'incorrect',title:'Check this step',message:m,errorCategory:c});
const choice=(id,label)=>({id,label});
function base(c){return defineQuestionDefinition({courseScope:'y13',topicId,difficulty:'core',prerequisiteTags:[INTEGRATION_METHOD_TAGS.reverseChain,INTEGRATION_METHOD_TAGS.standard,'integration-method-selection'],methodTags:[SUBSTITUTION_METHOD_TAG],vocabularyTags:['vocab:integration','vocab:substitution','vocab:differential'],hintSequence:[{id:'h1',text:'Choose u only if the complete change of variable makes the integral simpler and leaves one integration variable.'}],...c});}

export const givenSubstitutionDefinition=base({
 templateId:'question-template:y13:integration:substitution:given-substitution',assessmentObjective:'ao1',microSkillId:skill('given-substitution'),responseType:'choice',responseLabel:'Transformed integral',
 errorCategories:['transformation','mixed-variable'],diagnosticRules:{transformation:{kind:'execution',supportNeed:'understand',supportMicroSkillId:skill('transform-integrand'),studentMessage:'Transform the integrand and differential together.'},'mixed-variable':{kind:'execution',supportNeed:'understand',supportMicroSkillId:skill('mixed-variable-check'),studentMessage:'A completed substitution must not mix x and u.'}},defaultDiagnostic:{kind:'execution',supportNeed:'understand'},
 parameterGenerator:()=>({}),promptRenderer:()=>`Use u=x²+1 to transform ∫ x cos(x²+1) dx. Do not integrate yet.`,
 responseOptionsRenderer:()=>[choice('a','(1/2)∫cos u du'),choice('b','∫u cos(x²+1) du'),choice('c','∫x cos u du')],
 answerChecker:r=>r==='a'?ok('Correct. The integral is now entirely in u.'):bad(r==='b'||r==='c'?'mixed-variable':'transformation','Use du=2x dx, so x dx=du/2, and remove every remaining x-expression.'),
 workedSolutionGenerator:()=>[step('1','Substitution','u=x²+1','Differentiate the chosen substitution.'),step('2','Differential','du=2x dx, so x dx=du/2','Convert the factor attached to dx.'),step('3','Transform','(1/2)∫cos u du','The transformed integral contains only u and du.')]
});

export const chooseUDefinition=base({
 templateId:'question-template:y13:integration:substitution:choose-u',assessmentObjective:'ao1',microSkillId:skill('choose-u'),responseType:'choice',responseLabel:'Best substitution',
 errorCategories:['choice'],diagnosticRules:{choice:{kind:'recognition',supportNeed:'understand',supportMicroSkillId:skill('choose-u'),studentMessage:'Choose an inner, denominator or repeated expression whose derivative is available and makes progress.'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
 parameterGenerator:({random})=>({kind:random.pick(['trig','denominator','power'])}),
 promptRenderer:p=>p.kind==='trig'?`Choose the most useful u for ∫ x sin(x²+4) dx.`:p.kind==='denominator'?`Choose the most useful u for ∫ (4x+3)/(2x²+3x+7) dx.`:`Choose the most useful u for ∫ 6x(3x²+1)^4 dx.`,
 responseOptionsRenderer:p=>p.kind==='trig'?[choice('a','x²+4'),choice('b','x'),choice('c','sin(x²+4)')]:p.kind==='denominator'?[choice('a','2x²+3x+7'),choice('b','4x+3'),choice('c','x')]:[choice('a','3x²+1'),choice('b','6x'),choice('c','x')],
 answerChecker:r=>r==='a'?ok('Correct. This choice absorbs the derivative factor and simplifies the outer structure.'):bad('choice','Check which candidate appears as a complete inner/repeated expression and whether its derivative is present.'),
 workedSolutionGenerator:p=>[step('1','Identify structure',p.kind==='trig'?'sin(x²+4)':p.kind==='denominator'?'1/(2x²+3x+7)':'(3x²+1)^4','Locate the inner, denominator or repeated expression.'),step('2','Derivative check',p.kind==='trig'?'d(x²+4)/dx=2x':p.kind==='denominator'?'d(2x²+3x+7)/dx=4x+3':'d(3x²+1)/dx=6x','Compare with the remaining factor.'),step('3','Choose u',p.kind==='trig'?'u=x²+4':p.kind==='denominator'?'u=2x²+3x+7':'u=3x²+1','The transformed integral becomes simpler.')]
});

export const changeLimitsDefinition=base({
 templateId:'question-template:y13:integration:substitution:change-limits',assessmentObjective:'ao1',microSkillId:skill('definite-limits'),responseType:'choice',responseLabel:'u-limits',
 errorCategories:['limits','mixed-variable'],diagnosticRules:{limits:{kind:'execution',supportNeed:'understand',supportMicroSkillId:skill('definite-limits'),studentMessage:'Write the original x-limits explicitly, then evaluate u at each endpoint.'},'mixed-variable':{kind:'execution',supportNeed:'understand',supportMicroSkillId:skill('mixed-variable-check'),studentMessage:'Once u-limits are used, the definite integral should stay in u.'}},defaultDiagnostic:{kind:'execution',supportNeed:'understand'},
 parameterGenerator:()=>({}),promptRenderer:()=>`For ∫₀¹ 2x(x²+1)^3 dx, let u=x²+1. What are the new limits?`,
 responseOptionsRenderer:()=>[choice('a','u=1 to u=2'),choice('b','u=0 to u=1'),choice('c','x=1 to x=2')],
 answerChecker:r=>r==='a'?ok('Correct. x=0 gives u=1 and x=1 gives u=2.'):bad('limits','Evaluate u=x²+1 at each original x-limit.'),
 workedSolutionGenerator:()=>[step('1','Original lower limit','x=0','State the original variable.'),step('2','Convert lower','u=0²+1=1','Evaluate the substitution.'),step('3','Original upper limit','x=1','State the original variable.'),step('4','Convert upper','u=1²+1=2','The transformed integral uses u-limits 1 and 2.')]
});

export const completeSubstitutionDefinition=base({
 templateId:'question-template:y13:integration:substitution:complete',assessmentObjective:'ao1',microSkillId:skill('indefinite-workflow'),responseType:'choice',responseLabel:'Antiderivative',
 errorCategories:['choice','transformation','integration'],diagnosticRules:{choice:{kind:'recognition',supportNeed:'understand',supportMicroSkillId:skill('choose-u'),studentMessage:'Identify the inner expression before transforming.'},transformation:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('given-substitution'),studentMessage:'Use the differential to transform every x-dependent factor.'},integration:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('indefinite-workflow'),studentMessage:'Integrate the u-expression correctly, then substitute back and include +C.'}},defaultDiagnostic:{kind:'execution',supportNeed:'ao1'},
 parameterGenerator:()=>({}),promptRenderer:()=>`Evaluate ∫ x cos(x²+1) dx using substitution.`,
 responseOptionsRenderer:()=>[choice('a','(1/2)sin(x²+1)+C'),choice('b','sin(x²+1)+C'),choice('c','(1/2)sin u+C')],
 answerChecker:r=>r==='a'?ok():bad(r==='c'?'integration':'transformation','Use u=x²+1 and x dx=du/2; for an indefinite integral, substitute back to x and add C.'),
 workedSolutionGenerator:()=>[step('1','Choose u','u=x²+1','The inner derivative is available.'),step('2','Transform','(1/2)∫cos u du','Use x dx=du/2.'),step('3','Integrate','(1/2)sin u+C','Integrate in u.'),step('4','Return to x','(1/2)sin(x²+1)+C','Indefinite work finishes in the original variable.')]
});

export const diagnoseMixedVariableDefinition=base({
 templateId:'question-template:y13:integration:substitution:diagnose-mixed',assessmentObjective:'ao2',microSkillId:skill('error-diagnosis'),responseType:'choice',responseLabel:'First error',
 errorCategories:['mixed-variable','transformation'],diagnosticRules:{'mixed-variable':{kind:'execution',supportNeed:'understand',supportMicroSkillId:skill('mixed-variable-check'),studentMessage:'A transformed integral cannot contain both x and u.'},transformation:{kind:'execution',supportNeed:'understand',supportMicroSkillId:skill('transform-integrand'),studentMessage:'Transform the differential and integrand consistently.'}},defaultDiagnostic:{kind:'execution',supportNeed:'understand'},
 parameterGenerator:()=>({}),promptRenderer:()=>`A student sets u=x²+1 in ∫x² cos(x²+1)dx and writes (1/2)∫x cos u du. Diagnose the first issue.`,
 responseOptionsRenderer:()=>[choice('a','The transformed integral still mixes x and u; the substitution has not removed all x-dependence.'),choice('b','u should always equal x.'),choice('c','cos u cannot be integrated.')],
 answerChecker:r=>r==='a'?ok('Correct. This is a transformation/choice warning, not an integration error.'):bad('mixed-variable','Check the variable state before attempting to integrate.'),
 workedSolutionGenerator:()=>[step('1','Differentiate u','du=2x dx','Only one factor of x is absorbed.'),step('2','Inspect result','(1/2)∫x cos u du','An x remains while the differential is du.'),step('3','Diagnosis','mixed-variable state','The proposed substitution has not simplified the integral enough.')]
});

export const compareRecognitionDefinition=base({
 templateId:'question-template:y13:integration:substitution:compare-recognition',assessmentObjective:'ao2',microSkillId:skill('recognition-comparison'),responseType:'short-reasoning',responseLabel:'Comparison',placeholder:'Explain the relationship between the two methods.',
 errorCategories:['choice'],diagnosticRules:{choice:{kind:'recognition',supportNeed:'understand',supportMicroSkillId:skill('recognition-comparison'),studentMessage:'Reverse-chain recognition is a compressed version of the same variable-change structure.'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
 parameterGenerator:()=>({}),promptRenderer:()=>`Explain why ∫6x(3x²+4)^5 dx can be solved either by immediate reverse-chain recognition or by u=3x²+4.`,
 answerChecker:r=>{const t=String(r??'').toLowerCase();return (t.includes('derivative')||t.includes("g'"))&&(t.includes('same')||t.includes('substitution')||t.includes('chain'))?ok():bad('choice','Explain that du=6x dx formalises the same inner-function/inner-derivative pattern used by reverse-chain recognition.');},
 workedSolutionGenerator:()=>[step('1','Inner function','g(x)=3x²+4','Its derivative is 6x.'),step('2','Recognition','6x(g(x))^5','Reverse chain spots the structure immediately.'),step('3','Substitution','u=g(x), du=6x dx','Substitution writes the same reversal as an explicit change of variable.')]
});

export const unfamiliarApplicationDefinition=base({
 templateId:'question-template:y13:integration:substitution:application',assessmentObjective:'ao3',microSkillId:skill('applications'),responseType:'choice',responseLabel:'Exact value',
 errorCategories:['choice','limits','transformation','integration'],diagnosticRules:{choice:{kind:'recognition',supportNeed:'understand',supportMicroSkillId:skill('choose-u'),studentMessage:'Identify the repeated inner expression before calculating.'},limits:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('definite-limits'),studentMessage:'Convert both endpoints before integrating.'},transformation:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('given-substitution'),studentMessage:'Transform the integrand and differential completely.'},integration:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:skill('indefinite-workflow'),studentMessage:'Once the definite integral is in u, evaluate it there.'}},defaultDiagnostic:{kind:'recognition',supportNeed:'understand'},
 parameterGenerator:()=>({}),promptRenderer:()=>`A model gives accumulated change A=∫₀¹ 2x e^(x²+1) dx. Find A exactly.`,
 responseOptionsRenderer:()=>[choice('a','e²−e'),choice('b','e²−1'),choice('c','e−1')],
 answerChecker:r=>r==='a'?ok():bad('integration','Use u=x²+1, convert x=0→u=1 and x=1→u=2, then evaluate ∫₁²e^u du.'),
 workedSolutionGenerator:()=>[step('1','Choose u','u=x²+1, du=2x dx','The derivative factor is exact.'),step('2','Change limits','x=0→u=1; x=1→u=2','Definite work now stays in u.'),step('3','Transform','A=∫₁²e^u du','No x remains.'),step('4','Evaluate','A=[e^u]₁²=e²−e','Exact final value.')]
});

export const substitutionAssessmentQuestionDefinitions=Object.freeze([givenSubstitutionDefinition,chooseUDefinition,changeLimitsDefinition,completeSubstitutionDefinition,diagnoseMixedVariableDefinition,compareRecognitionDefinition,unfamiliarApplicationDefinition]);
