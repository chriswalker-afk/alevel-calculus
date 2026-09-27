import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { implicitDifferentiationTopic } from '../src/scripts/topic-content/implicit-differentiation.js';
import { implicitDifferentiationLearningModes } from '../src/scripts/implicit-differentiation-activities.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { explainDydxDefinition, explainBothSidesDefinition } from '../src/scripts/question-definitions/implicit-differentiation-assessment.js';

const ids=implicitDifferentiationLearningModes.understand.activities.map(activity=>activity.activityId);
assert.deepEqual(ids,[
 'activity:y13:differentiation:implicit-differentiation:understand:explicit-implicit',
 'activity:y13:differentiation:implicit-differentiation:understand:y-chain-rule',
 'activity:y13:differentiation:implicit-differentiation:understand:term-workspace',
 'activity:y13:differentiation:implicit-differentiation:understand:rearrange'
]);

const source=readFileSync(new URL('../src/scripts/implicit-differentiation-understand.js',import.meta.url),'utf8');
const classifyStart=source.indexOf(' render_explicit_implicit(){');
const chainStart=source.indexOf(' render_y_chain_rule(){',classifyStart);
const termStart=source.indexOf(' render_term_workspace(){',chainStart);
const rearrangeStart=source.indexOf(' render_rearrange(){',termStart);
assert(classifyStart>=0&&chainStart>classifyStart&&termStart>chainStart&&rearrangeStart>termStart);

const classifySource=source.slice(classifyStart,chainStart);
assert.match(classifySource,/choose a classification before the label or explanation is revealed/i);
assert.match(classifySource,/feedback\.hidden=true/,'Correct classification/explanation must begin hidden.');
assert.match(classifySource,/for\(const choice of \['explicit','implicit'\]\)/,'Students need explicit/implicit action choices.');
assert.match(classifySource,/feedback\.hidden=false/,'The answer is revealed only after a student choice.');
assert.match(classifySource,/aria-pressed/);
assert(classifySource.indexOf("feedback.hidden=true")<classifySource.indexOf("b.addEventListener('click'"),'Labels/explanations must be hidden before the student action.');

const chainSource=source.slice(chainStart,termStart);
assert.match(chainSource,/d\/dx\[y\] = dy\/dx/,'The formal derivative of y with respect to x must remain explicit.');
assert.match(chainSource,/d\/dx\[f\(y\)\] = f′\(y\) · dy\/dx/,'The formal chain-rule form must remain explicit.');
assert.match(chainSource,/Memory cue: “dy\/dx pops out”/);
assert.match(chainSource,/y-dependent expression with respect to x.*dy\/dx factor as popping out/s);
assert.match(chainSource,/shorthand only, not a separate rule/i);
assert.match(chainSource,/chain rule produces the dy\/dx factor/i);

const termSource=source.slice(termStart,rearrangeStart);
assert.match(termSource,/Apply d\/dx to both sides/);
assert.match(termSource,/<strong>d\/dx<\/strong> \[x² \+ xy \+ y²\]/);
assert.match(termSource,/<strong>d\/dx<\/strong> \[7\]/);
assert.match(termSource,/term buttons stay locked until d\/dx has been applied to both equal expressions/i);
assert.match(termSource,/b\.disabled=true/,'Individual term buttons must start locked.');
assert.match(termSource,/operatorAction\.addEventListener\('click'/);
assert.match(termSource,/for\(const b of termButtons\)b\.disabled=false/,'Applying d/dx to both sides must unlock term processing.');
assert.match(termSource,/state\.size!==terms\.length/,'Rebuilding must remain locked until every term is differentiated.');
assert.match(termSource,/if\(state\.size!==terms\.length\)return;/);
assert.match(termSource,/this\.termWorkspaceComplete=true/);
assert(termSource.indexOf("if(state.size!==terms.length)return;")<termSource.indexOf("this.termWorkspaceComplete=true"),'Workspace completion can only be recorded after every term is differentiated.');

const rearrangeSource=source.slice(rearrangeStart);
assert.match(rearrangeSource,/if\(!this\.termWorkspaceComplete\)/,'The separate rearrangement page must check workspace completion.');
assert.match(rearrangeSource,/Rearrangement is still locked/);
assert.match(rearrangeSource,/Return to the previous Understand page/);
assert.match(rearrangeSource,/Every original term has already been processed/);

const journey=implicitDifferentiationTopic.journey.find(item=>item.id==='differentiate-terms');
assert(journey);
assert.match(journey.title,/Apply d\/dx to both sides/i);
assert.match(journey.summary,/“dy\/dx pops out” cue.*formal chain-rule justification/i);

const memory=getMemoryItemsForTopic(implicitDifferentiationTopic.topicId);
const yChain=memory.find(item=>item.id.endsWith(':y-chain'));
const method=memory.find(item=>item.id.endsWith(':method'));
assert(yChain&&method);
assert.match(yChain.learn.statement,/dy\/dx factor ‘pops out’/);
assert.match(yChain.learn.statement,/shorthand for the chain rule/i);
assert.match(method.learn.statement,/Apply the same d\/dx operator to both sides/);
assert.match(method.learn.statement,/differentiate every term completely/);
assert.match(method.flashcard.cue,/Do not rearrange until every term is differentiated/);

const assessment=readFileSync(new URL('../src/scripts/question-definitions/implicit-differentiation-assessment.js',import.meta.url),'utf8');
assert(explainDydxDefinition.errorCategories.includes('missing-dydx'));
assert(explainBothSidesDefinition.errorCategories.includes('operator'));
assert.match(assessment,/“dy\/dx pops out” cue is only shorthand/);
assert.match(assessment,/d\/dx\[LHS\]=d\/dx\[RHS\]/);
assert.match(assessment,/same operation is applied to both sides before differentiating individual terms/);

console.log('PASS Original-prompt audit Step 12 student-driven implicit classification, both-sides operator, pop-out cue and rearrangement lock');
