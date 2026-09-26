import { fullCalculusMasteryTopic } from './topic-content/full-calculus-mastery.js';
const freeze=Object.freeze;
const rows={};
for(const mode of fullCalculusMasteryTopic.modes) rows[mode]=fullCalculusMasteryTopic.activities.filter(a=>a.mode===mode);
const copy={
 'method-only':['Recognition only','Choose the method or structure. Do not calculate yet.','recognise → choose'],
 'which-method-first':['Order matters','Decide whether to simplify/rewrite first and, for multi-method questions, which method comes first.','rewrite/simplify? → first method → next method'],
 'select-complete-check':['Select → complete → check','Choose the route, execute it, then use an appropriate check.','select → execute → check'],
 'select-and-explain':['Explain the choice','Justify why the method fits the mathematical structure, not the topic label.','structure → method → reason'],
 'diagnose-order':['Find the first broken step','Separate a wrong order/recognition decision from later algebraic execution.','first wrong stage → precise support'],
 'mixed-mastery':['Topic-blind full-course mastery','Mixed AO1, AO2 and AO3 questions drawn from existing course banks.','recognition · order · execution · interpretation']
};
export const fullCalculusMasteryLearningModes=freeze(Object.fromEntries(
 Object.entries(rows).map(([mode,list])=>[mode,freeze({
  label:mode.toUpperCase(),
  descriptor:mode==='ao1'?'Practise':mode==='ao2'?'Reason':'Apply',
  activities:freeze(list.map(meta=>{
   const [overline,body,formula]=copy[meta.slug];
   return freeze({
    activityId:meta.activityId,microSkillId:meta.microSkillIds[0],
    kicker:mode==='ao3'?'Mastery · Full 9MA0':`${mode.toUpperCase()} · Topic blind`,
    overline,title:meta.title,body,
    calloutLabel:'No topic heading',
    callout:'Use the structure of the mathematics to decide what to do. Source questions and support links come from the existing course banks.',
    formula,
    caption:'Plan 39: select → explain/order → complete/check → mixed AO1-AO3 mastery.'
   });
  }))
 })])
));
