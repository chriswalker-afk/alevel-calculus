import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { standardIntegralsTopic } from '../src/scripts/topic-content/standard-integrals.js';
import { standardIntegralsLearningModes } from '../src/scripts/standard-integrals-activities.js';
import { STANDARD_INTEGRAL_FACTS, LINEAR_STANDARD_INTEGRAL_FORMS, STANDARD_INTEGRAL_DEFINITIONS, FUNDAMENTAL_THEOREM_STATEMENT } from '../src/scripts/standard-integrals-data.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:y13:integration:standard-integrals';
assert.equal(standardIntegralsTopic.topicId,topicId);
assert.equal(standardIntegralsTopic.scopeId,'y13-additional');
assert.equal(standardIntegralsTopic.strand,'integration');
assert.equal(standardIntegralsTopic.sequence,270);
assert.deepEqual(standardIntegralsTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert(standardIntegralsTopic.activities.every(a=>a.implementationStep===60));
for(const mode of standardIntegralsTopic.modes) assert.ok(standardIntegralsLearningModes[mode].activities.length>0,`missing ${mode}`);

assert.equal(STANDARD_INTEGRAL_FACTS.length,10,'Plan 27 core array should contain ten standard facts');
assert.equal(LINEAR_STANDARD_INTEGRAL_FORMS.length,5,'Plan 27 should include reusable ax+b forms');
assert.equal(STANDARD_INTEGRAL_DEFINITIONS.length,15);
assert.equal(new Set(STANDARD_INTEGRAL_DEFINITIONS.map(x=>x.id)).size,15,'central standard-integral ids must be unique');
const combined=STANDARD_INTEGRAL_DEFINITIONS.map(x=>`${x.integrand} ${x.antiderivative}`).join(' | ');
for(const cue of ['x^n','1/x','e^x','a^(kx)','cos x','sin x','sec²','cosec²','sec x tan x','cosec x cot x','1/(ax+b)','(ax+b)^n']) assert(combined.includes(cue),`central data missing ${cue}`);
assert.match(FUNDAMENTAL_THEOREM_STATEMENT.name,/Fundamental Theorem of Calculus/);
assert.match(FUNDAMENTAL_THEOREM_STATEMENT.definite,/F\(b\).*F\(a\)/);
assert.match(FUNDAMENTAL_THEOREM_STATEMENT.meaning,/signed area|accumul/i);

const items=getMemoryItemsForTopic(topicId);
assert.ok(items.length>=12,'Memory Lab should cover core facts plus vocabulary');
assert.ok(getMemoryGamePackForTopic(topicId)?.impostor);
assert.ok(getMemoryReviewPackForTopic(topicId)?.rapid);

const activities=[
 'activity:y13:integration:standard-integrals:ao1:standard-array',
 'activity:y13:integration:standard-integrals:ao1:linear-forms',
 'activity:y13:integration:standard-integrals:ao1:definite-standard',
 'activity:y13:integration:standard-integrals:ao1:recover-function',
 'activity:y13:integration:standard-integrals:ao1:spot-error',
 'activity:y13:integration:standard-integrals:ao2:explain-and-check',
 'activity:y13:integration:standard-integrals:ao3:recover-and-evaluate'
];
const runner=createGeneratorRunner({debugSeed:'step60'});
for(const id of activities){
 const set=getQuestionSetDefinitionForActivity(id);
 assert.ok(set?.definitions.length>0,`missing generated set ${id}`);
 const generated=runner.generateSet(set);
 assert.equal(generated.questions.length,set.definitions.length);
 assert(generated.questions.every(q=>q.metadata.topicId===topicId));
}
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:standard-integrals:linear-forms','ao1').activityId,'activity:y13:integration:standard-integrals:ao1:linear-forms');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:standard-integrals:fundamental-theorem','understand').activityId,'activity:y13:integration:standard-integrals:understand:fundamental-theorem');

const understand=await fs.readFile(new URL('../src/scripts/standard-integrals-understand.js',import.meta.url),'utf8');
assert.match(understand,/STANDARD_INTEGRAL_FACTS/);
assert.match(understand,/FUNDAMENTAL_THEOREM_STATEMENT/);
assert.match(understand,/numerical/i);
assert.match(understand,/symbolic/i);
const app=await fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/standardIntegralsLearningModes/);
assert.match(app,/createStandardIntegralsUnderstandExperience/);
assert.match(app,/standardIntegralsLearningModes, availableModes: Object\.freeze\(\[\.\.\.learningModeOrder\]\), understandExperience: standardIntegralsUnderstand, classWiz: true/);
const html=await fs.readFile(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y13:integration:standard-integrals/);
assert.match(html,/topic-index">27</);
assert.match(html,/standard-integrals-understand\.css/);
console.log('PASS Step 60 central standard-integral data, FTC, function recovery, Memory Lab and AO1-AO3 contracts');
