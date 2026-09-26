import { listQuestionDefinitions } from './src/scripts/question-catalogue.js';
import { createGeneratorRunner } from './src/scripts/generator-runner.js';
const defs=listQuestionDefinitions(); const runner=createGeneratorRunner({debugSeed:'step77-expected'});
const keys=['expected','answer','gradient','rate','value','slope','xValue'];
let rows=[];
for(const def of defs){
  for(let i=0;i<8;i++){
    const q=runner.generate(def,{seed:`step77-exp:${def.templateId}:${i}`,sequence:i});
    if(q.responseType==='choice'||q.responseType==='short-reasoning') continue;
    for(const key of keys){
      if(!(key in q.parameters)) continue;
      const val=q.parameters[key];
      if(['string','number'].includes(typeof val)){
        const r=q.check(String(val));
        rows.push({template:def.templateId,seed:i,type:q.responseType,key,val,correct:r.tone==='correct',feedback:r.message});
      }
    }
  }
}
const bad=rows.filter(r=>!r.correct);
console.log(JSON.stringify({total:rows.length,badCount:bad.length,bad:bad.slice(0,100)},null,2));
