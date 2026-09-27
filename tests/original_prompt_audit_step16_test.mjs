import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  getHelpTargets,
  getSupportTargetForMicroSkill,
  helpTargetOrder,
  lateCourseHelpAudit
} from '../src/scripts/help-content.js';
import {
  SHARED_CLASSWIZ_USE_CASES,
  CLASSWIZ_OPPORTUNITY_AUDIT,
  getClassWizSupportPack,
  getClassWizAuditDecision,
  getClassWizModels
} from '../src/scripts/classwiz-support-data.js';
import { listTopicObjectiveConfigs } from '../src/scripts/topic-objectives-data.js';
import { partialFractionsIntegrationTopic } from '../src/scripts/topic-content/partial-fractions-integration.js';
import { year13AreasTopic } from '../src/scripts/topic-content/year13-areas.js';
import { parametricAreaTopic } from '../src/scripts/topic-content/parametric-area.js';
import { limitOfSumTopic } from '../src/scripts/topic-content/limit-of-sum.js';
import { numericalIntegrationTopic } from '../src/scripts/topic-content/numerical-integration.js';
import { differentialEquationsTopic } from '../src/scripts/topic-content/differential-equations.js';
import { calculusModellingTopic } from '../src/scripts/topic-content/calculus-modelling.js';
import { fullCalculusMasteryTopic } from '../src/scripts/topic-content/full-calculus-mastery.js';

const lateTopics=[
  partialFractionsIntegrationTopic,
  year13AreasTopic,
  parametricAreaTopic,
  limitOfSumTopic,
  numericalIntegrationTopic,
  differentialEquationsTopic,
  calculusModellingTopic,
  fullCalculusMasteryTopic
];

function expectedRoute(activityId){
  return '/'+activityId.replace(/^activity:/,'').split(':').join('/');
}
function assertTargetResolves(topic,target,need){
  assert(target,topic.topicId+' is missing '+need+' Help');
  assert.equal(target.topicId,topic.topicId,topic.topicId+' '+need+' Help must remain in the correct topic');
  assert.equal(target.mode,need,topic.topicId+' '+need+' Help must use the requested mode');
  const activity=topic.activities.find((entry)=>entry.activityId===target.activityId);
  assert(activity,topic.topicId+' '+need+' target must resolve to a real activity');
  assert.equal(activity.mode,need,topic.topicId+' '+need+' target activity has the wrong mode');
  assert.equal(target.route,expectedRoute(target.activityId),topic.topicId+' '+need+' route must be derived from the stable activity ID');
}

for(const topic of lateTopics){
  const targets=getHelpTargets(topic.topicId);
  const byNeed=new Map(targets.map((target)=>[target.need,target]));
  for(const need of helpTargetOrder){
    if(topic.modes.includes(need)) assertTargetResolves(topic,byNeed.get(need),need);
    else assert(!byNeed.has(need),topic.topicId+' must not invent a '+need+' route for a mode that does not exist');
  }
  for(const micro of topic.microSkills??[]){
    for(const need of helpTargetOrder){
      if(!topic.modes.includes(need)) continue;
      const target=getSupportTargetForMicroSkill(micro.microSkillId,need);
      assertTargetResolves(topic,target,need);
      assert.equal(target.microSkillId,micro.microSkillId,topic.topicId+' diagnostic target must retain the originating micro-skill ID');
    }
  }
}

for(const topic of lateTopics.slice(0,-1)){
  assert.deepEqual(getHelpTargets(topic.topicId).map((target)=>target.need),['understand','memorise','ao1'],topic.topicId+' should expose the standard three Help routes');
}
assert.deepEqual(getHelpTargets(fullCalculusMasteryTopic.topicId).map((target)=>target.need),['ao1'],'Full 9MA0 mastery has no Understand or Memorise mode and must expose AO1 only.');
assert.equal(getHelpTargets(fullCalculusMasteryTopic.topicId)[0].activityId,'activity:full:review:full-calculus-mastery:ao1:select-complete-check','Generic Full Mastery practice Help should route to broad execute-and-check AO1 practice.');

const masteryAudit=lateCourseHelpAudit.find((entry)=>entry.topicId===fullCalculusMasteryTopic.topicId);
assert(masteryAudit);
assert.deepEqual(masteryAudit.exposedNeeds,['ao1']);
assert.deepEqual(masteryAudit.omissions.map((entry)=>entry.need),['understand','memorise']);
assert(masteryAudit.omissions.every((entry)=>/has no .* mode/i.test(entry.reason)));

const allTopicIds=listTopicObjectiveConfigs().map((entry)=>entry.topicId).sort();
const auditIds=CLASSWIZ_OPPORTUNITY_AUDIT.map((entry)=>entry.topicId).sort();
assert.equal(CLASSWIZ_OPPORTUNITY_AUDIT.length,33,'Calculator opportunity audit must cover all registered topics.');
assert.equal(new Set(auditIds).size,33,'Calculator audit topic IDs must be unique.');
assert.deepEqual(auditIds,allTopicIds,'Calculator opportunity audit must account for every registered topic exactly once.');

const sharedUseCases=new Set(Object.values(SHARED_CLASSWIZ_USE_CASES));
for(const decision of CLASSWIZ_OPPORTUNITY_AUDIT){
  assert(decision.reason?.length>20,decision.topicId+' calculator audit decision needs a useful reason');
  const pack=getClassWizSupportPack(decision.topicId);
  if(decision.status==='enabled'){
    assert(pack,decision.topicId+' is enabled in the calculator audit but has no support pack');
    assert.deepEqual(decision.useCaseIds,pack.useCases.map((useCase)=>useCase.id));
    for(const useCase of pack.useCases){
      assert(sharedUseCases.has(useCase),useCase.id+' must reuse the shared calculator use-case library rather than duplicate instructions');
      assert(useCase.helpsWith);
      assert(useCase.doesNotReplace);
      assert.match(useCase.doesNotReplace,/not|do not/i,useCase.id+' must distinguish checking from required working');
      for(const modelId of ['cw','ex']){
        assert(Array.isArray(useCase.models[modelId])&&useCase.models[modelId].length>=4,useCase.id+' needs complete '+modelId+' steps');
      }
    }
  }else{
    assert.equal(pack,null,decision.topicId+' is documented as not-added and must not silently expose a pack');
    assert.equal(decision.useCaseIds.length,0);
  }
  assert.equal(getClassWizAuditDecision(decision.topicId),decision);
}

const models=getClassWizModels();
assert.equal(models.cw.label,'fx-991CW');
assert.equal(models.ex.label,'fx-991EX');
assert.equal(SHARED_CLASSWIZ_USE_CASES.derivativeCheck.radiansRequired,true);
assert.equal(SHARED_CLASSWIZ_USE_CASES.trigIntegralCheck.radiansRequired,true);
assert.equal(SHARED_CLASSWIZ_USE_CASES.smallAngleTable.radiansRequired,true);
assert.equal(SHARED_CLASSWIZ_USE_CASES.integralCheck.radiansRequired,false);
assert.match(SHARED_CLASSWIZ_USE_CASES.derivativeCheck.radiansReminder,/RADIAN/);
assert.match(SHARED_CLASSWIZ_USE_CASES.trigIntegralCheck.radiansReminder,/RADIAN/);

const roots=SHARED_CLASSWIZ_USE_CASES.polynomialRoots;
assert(roots.models.cw.some((step)=>/HOME -> Equation/.test(step.text)));
assert(roots.models.cw.some((step)=>/Polynomial/.test(step.text)&&/2, 3 or 4/.test(step.text)));
assert(roots.models.ex.some((step)=>/MENU -> Equation\/Func/.test(step.text)));
assert(roots.models.ex.some((step)=>/Polynomial/.test(step.text)&&/2, 3 or 4/.test(step.text)));
assert.match(roots.doesNotReplace,/does not replace/i);

const trigPack=getClassWizSupportPack('topic:y13:integration:trig-identities');
assert(trigPack);
assert.equal(trigPack.defaultUseCaseId,'trig-integral-check');
assert.equal(trigPack.useCases[0].radiansRequired,true);
const parametricPack=getClassWizSupportPack('topic:y13:differentiation:parametric-differentiation');
assert(parametricPack);
assert.equal(parametricPack.defaultUseCaseId,'paired-table');
assert.match(parametricPack.introduction,/do not replace/i);
const numericalPack=getClassWizSupportPack('topic:y13:integration:numerical-integration');
assert(numericalPack);
assert.equal(numericalPack.defaultUseCaseId,'ordinate-table');
assert.match(numericalPack.introduction,/does not claim that a ClassWiz uses the trapezium rule internally/i);

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const panel=read('src/scripts/classwiz-support-panel.js');
assert.match(panel,/function setTopic\(id\)/);
assert.match(panel,/function renderUseCaseTabs\(\)/);
assert.match(panel,/useCaseTabList\.replaceChildren\(\)/);
assert.match(panel,/button\.dataset\.classwizUseCase=useCase\.id/);
const app=read('src/scripts/app-shell.js');
assert.match(app,/hasClassWizSupport\(currentTopicId\)/);
assert.match(app,/classWizSupportPanel\.setTopic\(currentTopicId\)/);
assert.match(app,/help-content\.js\?v=supportfix2/);
assert.match(app,/classwiz-support-panel\.js\?v=auditstep16final/);
assert.match(app,/classwiz-support-data\.js\?v=auditstep16final/);
assert.match(app,/currentTopicId = topicId;[\s\S]*?syncCurrentTopicChrome\(\);[\s\S]*?syncHelpTargets\(\);/,'Changing topic must update the topic ID before rebuilding Help links.');
assert.match(app,/function syncCurrentTopicChrome\(\)[\s\S]*?classWizSupportPanel\.setTopic\(currentTopicId\)/,'Changing topic must rebind the calculator panel to the current topic pack.');
assert.match(app,/withUnderstandJourney\(Object\.freeze\(\{\.\.\.runtime,classWiz:hasClassWizSupport\(topicId\)\}\)\)/,'Runtime ClassWiz metadata must be derived from the audit registry rather than stale hand-set flags.');

for(const [source,published] of [
 ['src/scripts/help-content.js','scripts/help-content.js'],
 ['src/scripts/classwiz-support-data.js','scripts/classwiz-support-data.js'],
 ['src/scripts/classwiz-support-panel.js','scripts/classwiz-support-panel.js']
]){
  assert.equal(read(source),read(published),source+' and '+published+' must remain mirrored.');
}

for(const path of ['src/index.html','index.html','404.html']){
  assert.match(read(path),/app-shell\.js\?v=supportfix2/,path+' must load the Step 16 runtime.');
}

console.log('PASS Original-prompt audit Step 16 late Help routing, complete calculator opportunity audit, shared ClassWiz checks and topic-synced panel');
