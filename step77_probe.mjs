import { listQuestionDefinitions } from './src/scripts/question-catalogue.js';
import { createGeneratorRunner } from './src/scripts/generator-runner.js';
const defs=listQuestionDefinitions();
const runner=createGeneratorRunner({debugSeed:'step77-probe'});
let failures=[]; let choiceCount=0; let generated=0; let expectedKeys=new Map();
for(const def of defs){
  for(let i=0;i<12;i++){
    let q;
    try { q=runner.generate(def,{seed:`step77:${def.templateId}:${i}`,sequence:i}); generated++; }
    catch(e){ failures.push({template:def.templateId,seed:i,type:'generate',msg:e.message}); continue; }
    const text=[q.prompt,q.math,...q.solutionSteps.flatMap(s=>Object.values(s).filter(v=>typeof v==='string'))].join(' ');
    if(/\b(?:undefined|NaN|Infinity|\[object Object\])\b/.test(text)) failures.push({template:def.templateId,seed:i,type:'bad-text',msg:text.match(/\b(?:undefined|NaN|Infinity|\[object Object\])\b/)?.[0]});
    if(q.responseType==='choice'){
      choiceCount++;
      const results=q.options.map(o=>({id:o.id,label:o.label??o.text??'',result:q.check(o.id)}));
      const correct=results.filter(x=>x.result.tone==='correct');
      if(correct.length!==1) failures.push({template:def.templateId,seed:i,type:'choice-correct-count',results});
    }
    const keys=Object.keys(q.parameters);
    for(const key of keys){ if(/expected|answer|gradient|rate|value|result|area|slope/i.test(key)) expectedKeys.set(key,(expectedKeys.get(key)||0)+1); }
    const nonsense=q.check('__step77_invalid_response__');
    if(nonsense.tone==='correct') failures.push({template:def.templateId,seed:i,type:'nonsense-accepted'});
  }
}
console.log(JSON.stringify({definitions:defs.length,generated,choiceCount,failures:failures.slice(0,80),failureCount:failures.length,expectedKeys:[...expectedKeys.entries()].sort((a,b)=>b[1]-a[1])},null,2));
