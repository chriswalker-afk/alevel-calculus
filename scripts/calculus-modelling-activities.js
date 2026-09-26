import { calculusModellingTopic } from './topic-content/calculus-modelling.js';
import { learningModeDescriptor, learningModeKicker, learningModeLabel } from './learning-mode-presentation.js';
const freeze=Object.freeze; const rows={}; for(const m of calculusModellingTopic.modes) rows[m]=calculusModellingTopic.activities.filter(a=>a.mode===m);
const views={'framework-recall':'learn','method-cues':'flashcards','interpret-checks':'match'};
export const calculusModellingLearningModes=freeze(Object.fromEntries(Object.entries(rows).map(([mode,list])=>[mode,freeze({
 label:learningModeLabel(mode),descriptor:learningModeDescriptor(mode),
 activities:freeze(list.map(meta=>freeze({activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:learningModeKicker(mode),overline:meta.title,title:meta.title,body:mode==='understand'?'Use the same modelling scaffold regardless of context.':mode==='memorise'?'Retrieve the framework and interpretation checks before calculating.':'Model first, choose calculus second, then interpret and critique.',calloutLabel:'Common modelling framework',callout:'variables/units → relationship → target → method → solve → interpret → limitations',formula:'context → model → calculus → contextual conclusion',caption:'Plan 38: one modelling scaffold across the full 9MA0 calculus toolkit.',calculusModellingUnderstand:mode==='understand',...(mode==='memorise'?{memoryLabView:views[meta.slug],memoryLabNavTarget:true}:{})})))
})])));
