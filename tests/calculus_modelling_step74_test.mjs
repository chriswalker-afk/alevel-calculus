import assert from 'node:assert/strict';
import { calculusModellingTopic } from '../src/scripts/topic-content/calculus-modelling.js';
import { calculusModellingLearningModes } from '../src/scripts/calculus-modelling-activities.js';
import { CALCULUS_MODELLING_CONTEXTS, MODELLING_STAGE_IDS, buildModellingScaffold, compareExactAndNumerical } from '../src/scripts/calculus-modelling-scaffold.js';
import { calculusModellingAssessmentQuestionDefinitions } from '../src/scripts/question-definitions/calculus-modelling-assessment.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';

assert.equal(calculusModellingTopic.topicId,'topic:y13:modelling:calculus');
assert.equal(calculusModellingTopic.sequence,380);
assert.deepEqual(calculusModellingTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.ok(calculusModellingTopic.activities.every(a=>a.implementationStep===74));
for(const mode of calculusModellingTopic.modes) assert.ok(calculusModellingLearningModes[mode]?.activities.length>0,`${mode} mode must be live`);
assert.deepEqual(MODELLING_STAGE_IDS,['variables','relationship','target','method','solve','interpret','limitations']);
assert.equal(CALCULUS_MODELLING_CONTEXTS.length,7);
for(const family of ['optimisation','connected-rates','parametric','implicit','accumulation','numerical','differential-equations']) assert.ok(CALCULUS_MODELLING_CONTEXTS.some(c=>c.family===family),`missing ${family}`);
for(const c of CALCULUS_MODELLING_CONTEXTS){
 assert.equal(buildModellingScaffold(c).length,7);
 assert.ok(c.support.topicId.startsWith('topic:'),'context must retain exact support topic');
 assert.ok(c.support.activityId.startsWith('activity:'),'context must retain exact support activity');
}
const hidden=buildModellingScaffold(CALCULUS_MODELLING_CONTEXTS[0],{revealMethod:false});
assert.equal(hidden.find(s=>s.id==='method').hidden,true,'AO3 scaffold must support hiding method until student commits');
assert.equal(compareExactAndNumerical({hasOnlyTable:true}).choice,'trapezium-rule');
assert.equal(compareExactAndNumerical({hasFormula:true,exactAntiderivativePractical:true}).choice,'exact');
assert.equal(calculusModellingAssessmentQuestionDefinitions.length,6);
assert.deepEqual([...new Set(calculusModellingAssessmentQuestionDefinitions.map(q=>q.assessmentObjective))].sort(),['ao1','ao2','ao3']);
const ao3=calculusModellingAssessmentQuestionDefinitions.find(q=>q.assessmentObjective==='ao3');
assert.ok(!ao3.promptRenderer({}).toLowerCase().includes('differentiat')&&!ao3.promptRenderer({}).toLowerCase().includes('integrat'),'AO3 prompt must not reveal a calculus technique prematurely');
for(const activity of calculusModellingTopic.activities.filter(a=>a.activityType==='question-set')) assert.ok(getQuestionSetDefinitionForActivity(activity.activityId),`missing question set ${activity.activityId}`);
assert.ok(getMemoryItemsForTopic(calculusModellingTopic.topicId).length>=4);
const shell=await import('node:fs/promises').then(fs=>fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8'));
assert.match(shell,/topic:y13:modelling:calculus/); assert.match(shell,/calculusModellingLearningModes/); assert.match(shell,/createCalculusModellingUnderstandExperience/);
console.log('Full 9MA0 calculus modelling Step 74 tests passed.');
