import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  TRAPEZIUM_RULE_FUNCTIONS,
  buildTrapeziumComparison,
  classifyTrapeziumBound
} from '../src/scripts/trapezium-rule-builder.js';
import {
  TRAPEZIUM_CONTEXTS,
  TRAPEZIUM_REFINEMENT_COUNTS,
  TRAPEZIUM_REFINEMENT_MESSAGE,
  CALCULATOR_NUMERICAL_INTEGRATION_NOTE,
  percentageError
} from '../src/scripts/trapezium-integration-data.js';
import { numericalIntegrationTopic } from '../src/scripts/topic-content/numerical-integration.js';
import { getClassWizSupportPack } from '../src/scripts/classwiz-support-data.js';
import { trapeziumIntegrationAssessmentQuestionDefinitions } from '../src/scripts/question-definitions/trapezium-integration-assessment.js';

const controlled=TRAPEZIUM_RULE_FUNCTIONS.find(definition=>definition.id==='trapezium-convex');
assert(controlled);
const comparison=buildTrapeziumComparison(controlled,{lower:0,upper:4,counts:TRAPEZIUM_REFINEMENT_COUNTS});
assert.deepEqual(comparison.map(row=>row.n),[1,2,4,8,16]);
assert.ok(comparison.slice(1).every((row,index)=>row.absoluteError<comparison[index].absoluteError),'Controlled smooth example must show shrinking absolute error as n increases.');
assert.ok(comparison.slice(1).every(row=>row.errorShrank===true),'Every refinement in the controlled example should be marked as a smaller error.');
assert.ok(comparison.slice(1).every((row,index)=>row.h<comparison[index].h),'Increasing n must make the strips thinner.');
assert.match(TRAPEZIUM_REFINEMENT_MESSAGE,/generally improves/i);
assert.match(TRAPEZIUM_REFINEMENT_MESSAGE,/not an absolute guarantee/i);

const normal=TRAPEZIUM_CONTEXTS.find(context=>context.id==='normal-density');
assert(normal);
assert.equal(normal.contextOnly,true);
assert.match(normal.label,/normal-distribution density/i);
assert.match(normal.reason,/no elementary antiderivative/i);
assert.match(normal.reason,/motivating context only/i);

assert.match(CALCULATOR_NUMERICAL_INTEGRATION_NOTE,/numerical approximation/i);
assert.match(CALCULATOR_NUMERICAL_INTEGRATION_NOTE,/one accessible example of numerical integration/i);
assert.match(CALCULATOR_NUMERICAL_INTEGRATION_NOTE,/does not assume that a ClassWiz uses the trapezium rule internally/i);
assert.match(CALCULATOR_NUMERICAL_INTEGRATION_NOTE,/different algorithm/i);

const support=getClassWizSupportPack(numericalIntegrationTopic.topicId);
assert(support);
assert.equal(support.defaultUseCaseId,'ordinate-table');
assert.match(support.introduction,/TABLE to generate\/check/i);
assert.match(support.introduction,/does not claim that a ClassWiz uses the trapezium rule internally/i);
const tableSupport=support.useCases.find(useCase=>useCase.id==='ordinate-table');
assert(tableSupport);
assert.match(tableSupport.doesNotReplace,/finding h/i);
assert.match(tableSupport.doesNotReplace,/1,2,…,2,1 coefficients/i);
assert.match(tableSupport.doesNotReplace,/trapezium-rule calculation/i);

const understandActivities=numericalIntegrationTopic.activities.filter(activity=>activity.mode==='understand');
assert.equal(understandActivities.length,8);
const understandIds=new Set(understandActivities.map(activity=>activity.activityId));
for(const id of [
 'activity:y13:integration:numerical-integration:understand:refining-estimate',
 'activity:y13:integration:numerical-integration:understand:percentage-error',
 'activity:y13:integration:numerical-integration:understand:concavity-bounds'
]) assert(understandIds.has(id),id+' must remain in the Understand journey.');

const pctState=buildTrapeziumComparison(controlled,{lower:0,upper:4,counts:[4]})[0];
assert(percentageError(pctState.estimate,pctState.exactIntegral)>0);
assert.equal(classifyTrapeziumBound(controlled,0,4).kind,'overestimate');
assert.equal(classifyTrapeziumBound(TRAPEZIUM_RULE_FUNCTIONS.find(definition=>definition.id==='trapezium-concave'),0,3.5).kind,'underestimate');
assert.equal(classifyTrapeziumBound(TRAPEZIUM_RULE_FUNCTIONS.find(definition=>definition.id==='trapezium-inflection'),0,3).kind,'mixed');
assert.equal(trapeziumIntegrationAssessmentQuestionDefinitions.length,7,'Step 15 must not remove existing numerical-integration assessment coverage.');

const read=relative=>readFileSync(new URL('../'+relative,import.meta.url),'utf8');
const understand=read('src/scripts/trapezium-integration-understand.js');
assert.match(understand,/buildTrapeziumComparison/);
assert.match(understand,/More, thinner trapezia: watch the approximation improve/);
assert.match(understand,/absolute error/);
assert.match(understand,/controlled smooth example/);
assert.match(understand,/not an unconditional theorem about every possible function/);
assert.match(understand,/Calculator output can be useful/);
assert.match(understand,/does not replace a requested written trapezium-rule method/);
assert.match(understand,/percentage-error/);
assert.match(understand,/concavity-bounds/);
assert.match(understand,/no whole-interval claim/i);

const dataSource=read('src/scripts/trapezium-integration-data.js');
assert.match(dataSource,/Standard normal-distribution density/);
assert.match(dataSource,/no elementary antiderivative/);
assert.doesNotMatch(dataSource,/\berf\b|Gaussian integral/i,'Normal-distribution material must remain contextual rather than adding off-spec integration techniques.');

const objectives=read('src/scripts/topic-objectives-data.js');
assert.match(objectives,/more, thinner trapezia generally improve a smooth-curve approximation/i);
assert.match(objectives,/calculator output appropriately in context/i);

const sourcePairs=[
 ['src/scripts/trapezium-rule-builder.js','scripts/trapezium-rule-builder.js'],
 ['src/scripts/trapezium-integration-data.js','scripts/trapezium-integration-data.js'],
 ['src/scripts/trapezium-integration-understand.js','scripts/trapezium-integration-understand.js'],
 ['src/scripts/topic-content/numerical-integration.js','scripts/topic-content/numerical-integration.js'],
 ['src/scripts/trapezium-integration-activities.js','scripts/trapezium-integration-activities.js'],
 ['src/scripts/classwiz-support-data.js','scripts/classwiz-support-data.js'],
 ['src/styles/trapezium-integration-understand.css','styles/trapezium-integration-understand.css'],
 ['src/scripts/topic-objectives-data.js','scripts/topic-objectives-data.js']
];
for(const [source,published] of sourcePairs) assert.equal(read(source),read(published),source+' and '+published+' must remain mirrored.');

const sourceApp=read('src/scripts/app-shell.js');
const publishedApp=read('scripts/app-shell.js');
assert.match(sourceApp,/trapezium-integration-understand\.js\?v=auditstep15/);
assert.match(publishedApp,/trapezium-integration-understand\.js\?v=auditstep15/);
assert.match(sourceApp,/trapezium-integration-activities\.js\?v=supportfix2/);
assert.match(publishedApp,/trapezium-integration-activities\.js\?v=supportfix2/);
assert.match(sourceApp,/topic-objectives-data\.js\?v=auditstep15/);
assert.match(publishedApp,/topic-objectives-data\.js\?v=auditstep15/);

const sourceIndex=read('src/index.html');
const publishedIndex=read('index.html');
assert.match(sourceIndex,/trapezium-integration-understand\.css\?v=auditstep15/);
assert.match(publishedIndex,/trapezium-integration-understand\.css\?v=auditstep15/);
assert.match(sourceIndex,/app-shell\.js\?v=integrationmath1/);
assert.match(publishedIndex,/app-shell\.js\?v=integrationmath1/);

const deepLink=read('404.html');
assert.match(deepLink,/trapezium-integration-understand\.css\?v=auditstep15/);
assert.match(deepLink,/app-shell\.js\?v=integrationmath1/);

console.log('PASS Original-prompt audit Step 15 trapezium refinement, calculator context, normal-density motivation and preserved error/bound content');
