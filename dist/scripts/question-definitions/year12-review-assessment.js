import { defineQuestionDefinition } from '../question-definition.js';
import { defineSolutionStep } from '../solution-step.js';

const step=(id,label,expression,explanation)=>defineSolutionStep({id,kind:'working',label,expression,explanation});
const ok=(message='Correct.')=>({success:true,tone:'correct',title:'Correct',message});
const bad=(errorCategory,message)=>({success:false,tone:'incorrect',title:'Check the chain of reasoning',message,errorCategory});
const choice=(id,label)=>({id,label});

export const reconstructFromDerivativeDefinition=defineQuestionDefinition({
  templateId:'question-template:y12:review:calculus-mastery:reconstruct-from-derivative',
  courseScope:'y12',
  topicId:'topic:y12:review:calculus-mastery',
  assessmentObjective:'ao3',
  microSkillId:'skill:y12:integration:introduction:constant-of-integration',
  difficulty:'core',
  prerequisiteTags:['integration-power-rule','constant-of-integration','function-evaluation'],
  methodTags:['reconstruct-function','combine-differentiation-integration'],
  vocabularyTags:['vocab:integration','vocab:constant-of-integration'],
  responseType:'choice',
  responseLabel:'Value of f(2)',
  errorCategories:['integration-method','initial-condition'],
  diagnosticRules:{
    'integration-method':{kind:'execution',supportNeed:'ao1',supportMicroSkillId:'skill:y12:integration:introduction:term-by-term',studentMessage:'Reconstruct f by integrating f′ term by term before using the given value.'},
    'initial-condition':{kind:'recognition',supportNeed:'memorise',supportMicroSkillId:'skill:y12:integration:introduction:constant-of-integration',studentMessage:'Use f(0)=3 to determine the constant of integration before evaluating f(2).'}
  },
  defaultDiagnostic:{kind:'execution',supportNeed:'ao1',supportMicroSkillId:'skill:y12:integration:introduction:term-by-term'},
  parameterGenerator:()=>({}),
  promptRenderer:()=>`A function satisfies f′(x)=6x−4 and f(0)=3. Find f(2).`,
  mathRenderer:()=>`f′(x)=6x−4,   f(0)=3`,
  responseOptionsRenderer:()=>[choice('a','7'),choice('b','4'),choice('c','10')],
  answerChecker:(response)=>response==='a'?ok('You reconstructed the function, fixed C from the initial condition and evaluated it.'):response==='b'?bad('initial-condition','You appear to have integrated but not used the initial condition correctly.'):bad('integration-method','Start by integrating 6x−4 term by term.'),
  workedSolutionGenerator:()=>[
    step('1','Integrate the derivative','f(x)=3x²−4x+C','Reverse differentiation term by term.'),
    step('2','Use the condition','f(0)=C=3','The initial value fixes the member of the antiderivative family.'),
    step('3','Evaluate','f(2)=3(4)−8+3=7','Substitute x=2 only after the function is fully determined.')
  ],
  hintSequence:[
    {id:'h1',text:'First reconstruct the whole function by integrating f′(x).'},
    {id:'h2',text:'Use f(0)=3 to determine C before substituting x=2.'}
  ]
});

export const year12ReviewAssessmentQuestionDefinitions=Object.freeze([reconstructFromDerivativeDefinition]);
