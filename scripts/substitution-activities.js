import { substitutionTopic } from './topic-content/substitution.js';
const freeze=Object.freeze; const byMode=(mode)=>substitutionTopic.activities.filter(a=>a.mode===mode); const bySlug=new Map(substitutionTopic.activities.map(a=>[`${a.mode}:${a.slug}`,a]));
const uRows=[
  ['why-substitution','Why substitution?','Compare recognition with a systematic change of variable on the same integral.','recognise or set u → change variable → integrate'],
  ['change-everything','Change everything','Transform the integrand and differential together; mixed x/u states are not allowed.','u=g(x), du=g′(x)dx'],
  ['definite-indefinite','Indefinite vs definite','Use different endings: back-substitute and +C for indefinite work; change limits and stay in u for definite work.','x=a,x=b → u(a),u(b)'],
  ['choosing-u','Choosing u','Choose an inner, denominator or repeated expression only when its derivative is available and the integral becomes simpler.','choose u → check du → judge progress']
];
const understand=freeze(uRows.map(([slug,title,body,formula])=>{const meta=bySlug.get(`understand:${slug}`);return freeze({activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:'Understand',overline:title,title,body,calloutLabel:'Change variable completely',callout:'A valid substitution leaves one integration variable at a time. If x and u survive together, the transformation is incomplete or the choice of u is unhelpful.',formula,caption:'Plan 30.1–30.4: recognise → choose u → change everything → integrate → finish in the correct variable.',substitutionUnderstand:true});}));
const generic=(mode,label,descriptor)=>freeze(byMode(mode).map(meta=>freeze({activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:label,overline:meta.title,title:meta.title,body:mode==='memorise'?'Retrieve the substitution sequence, variable checks and finishing rules until they are automatic.':mode==='ao1'?'Build reliable substitution fluency one stage at a time.':mode==='ao2'?'Explain and diagnose why a substitution succeeds or fails.':'Select and execute substitution when the context does not announce the method.',calloutLabel:'Substitution discipline',callout:'Choose u because it simplifies the complete integral. Change every x-dependent part consistently; definite work stays in u after the limits change.',formula:'choose u → transform completely → integrate → finish correctly',caption:`${descriptor}: choice, transformation and integration are checked as separate stages.`,memoryLabGame:mode==='memorise'&&meta.slug==='change-everything'?'match':undefined,memoryLabGames:mode==='memorise'&&meta.slug==='memory-games'?freeze(['build','missing-piece','sort','impostor']):undefined,memoryReview:mode==='memorise'&&meta.slug==='mixed-review'?'mix':undefined})));
export const substitutionLearningModes=freeze({
 understand:freeze({label:'Understand',descriptor:'Explore',activities:understand}),
 memorise:freeze({label:'Memorise',descriptor:'Recall',activities:generic('memorise','Memorise','Recall')}),
 ao1:freeze({label:'AO1',descriptor:'Fluency',activities:generic('ao1','AO1','Fluency')}),
 ao2:freeze({label:'AO2',descriptor:'Reasoning',activities:generic('ao2','AO2','Reasoning')}),
 ao3:freeze({label:'AO3',descriptor:'Problem solving',activities:generic('ao3','AO3','Problem solving')})
});
