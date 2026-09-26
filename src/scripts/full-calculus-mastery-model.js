const freeze=Object.freeze;
export const FULL_CALCULUS_MASTERY_DIMENSIONS=freeze(['recognition','order','execution','interpretation']);
const interpretationPattern=/interpret|limitation|model|assumption|domain|unit|long-term|reasonab|context/i;
export function classifyFullCalculusMasteryDimension(activityId,attempt={}){
 const id=String(activityId||''); const error=String(attempt.errorCategory||'');
 if(id.endsWith(':ao1:method-only')) return 'recognition';
 if(id.endsWith(':ao1:which-method-first')||id.endsWith(':ao2:diagnose-order')) return 'order';
 if(id.endsWith(':ao2:select-and-explain')) return interpretationPattern.test(error)||attempt.metadata?.assessmentObjective==='ao3'?'interpretation':'recognition';
 if(id.endsWith(':ao1:select-complete-check')) return attempt.diagnostic?.kind==='recognition'?'recognition':'execution';
 if(interpretationPattern.test(error)) return 'interpretation';
 if(attempt.diagnostic?.kind==='recognition') return 'recognition';
 return attempt.metadata?.assessmentObjective==='ao2'?'order':'execution';
}
export function createFullCalculusMasteryModel(){
 function summarise(records=[]){
  const dimensions=Object.fromEntries(FULL_CALCULUS_MASTERY_DIMENSIONS.map(d=>[d,{dimension:d,attempts:0,successes:0,failures:0,nextSteps:[]}])) ;
  for(const record of records){const a=record?.attempt||record; if(!a?.metadata) continue; const d=classifyFullCalculusMasteryDimension(record?.activityId,a); const bucket=dimensions[d]; bucket.attempts++; if(a.success) bucket.successes++; else {bucket.failures++; if(a.diagnostic?.target) bucket.nextSteps.push(a.diagnostic.target);}}
  return freeze({attemptCount:Object.values(dimensions).reduce((n,x)=>n+x.attempts,0),dimensions:freeze(Object.fromEntries(Object.entries(dimensions).map(([k,v])=>[k,freeze({...v,nextSteps:freeze(v.nextSteps)})])))});
 }
 return freeze({summarise});
}
export const fullCalculusMasteryModel=createFullCalculusMasteryModel();
