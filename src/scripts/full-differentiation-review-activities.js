import { fullDifferentiationReviewTopic } from './topic-content/full-differentiation-review.js';
const freeze=Object.freeze;
const byKey=new Map(fullDifferentiationReviewTopic.activities.map(a=>[`${a.mode}:${a.slug}`,a]));
const rows={
  memorise:[
    ['things-to-remember','Things to remember','Recall standard derivatives, notation, product/quotient/chain, trig and inverse trig derivatives, parametric and implicit methods, second derivatives, concavity and connected rates.','fact → method → precise source page'],
    ['method-map','Which method do I need?','Retrieve the structural cues that distinguish product, quotient, chain, parametric, implicit, inverse relation, connected rates and second-derivative work.','recognise before execute'],
    ['rapid-recall','Rapid differentiation recall','Use the shared Memory Lab to retrieve rules, notation and method cues across the full differentiation course.','Year 12 + additional Year 13']
  ],
  ao1:[
    ['method-selection-only','Which method do I need?','Choose the method or combination only. Do not differentiate yet. Nested structures include a “which rule first?” decision.','select method → then calculate'],
    ['topic-blind-fluency','Topic-blind fluency','Differentiate without a topic heading giving away the method.','recognise → execute']
  ],
  ao2:[['justify-and-diagnose','Explain, compare and diagnose','Explain method choice, interpret f′ and f″, compare valid routes and diagnose whether an error is recognition or execution.','why this method? → where did it fail?']],
  ao3:[
    ['mixed-applications','Mixed differentiation applications','Apply differentiation in multi-step parameter, tangent, stationary-point, implicit, parametric and modelling contexts.','model → select → execute → interpret'],
    ['diagnostic-mastery','Differentiation mastery','Complete a topic-blind AO1–AO3 diagnostic set. Feedback separates method recognition from method execution and links to precise support.','evidence → recognition/execution → next step']
  ]
};
const views={'things-to-remember':'learn','method-map':'flashcards','rapid-recall':'review'};
export const fullDifferentiationReviewLearningModes=freeze(Object.fromEntries(Object.entries(rows).map(([mode,list])=>[mode,freeze({
  label:mode==='memorise'?'Memorise':mode.toUpperCase(),descriptor:mode==='memorise'?'Recall':mode==='ao1'?'Practise':mode==='ao2'?'Reason':'Apply',
  activities:freeze(list.map(([slug,title,body,formula])=>{const meta=byKey.get(`${mode}:${slug}`);if(!meta)throw new Error(`Missing full differentiation review metadata ${mode}:${slug}`);return freeze({
    activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:mode==='memorise'?'Memorise · Full differentiation':mode==='ao3'&&slug==='diagnostic-mastery'?'Mastery · Diagnose':`${mode.toUpperCase()} · Topic blind`,
    overline:title,title,body,calloutLabel:slug==='method-selection-only'?'Method selection only':slug==='diagnostic-mastery'?'Diagnostic purpose':'Full A level differentiation',
    callout:slug==='method-selection-only'?'Choose the method before any algebra. Recognition and execution are recorded separately.':slug==='diagnostic-mastery'?'A correct method choice and correct execution are separate pieces of evidence.':'Questions draw across Year 12 differentiation and the additional Year 13 differentiation toolkit.',
    formula,caption:'Plan 26: recall → select method → explain method → apply method → topic-blind mixed differentiation.',
    ...(mode==='memorise'?{memoryLabView:views[slug],memoryLabNavTarget:true,memoryLabGames:slug==='rapid-recall'?['build','missing-piece','sort','impostor']:undefined}:{})
  });}))
})])));
