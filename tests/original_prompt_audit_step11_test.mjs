import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parametricDifferentiationTopic } from '../src/scripts/topic-content/parametric-differentiation.js';
import { parametricDifferentiationLearningModes } from '../src/scripts/parametric-differentiation-activities.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { chainReasoningDefinition } from '../src/scripts/question-definitions/parametric-differentiation-assessment.js';

const understandActivities=parametricDifferentiationLearningModes.understand.activities;
assert.equal(understandActivities[0].activityId,'activity:y13:differentiation:parametric-differentiation:understand:trace-curve');
assert.equal(understandActivities[1].activityId,'activity:y13:differentiation:parametric-differentiation:understand:restrict-domain');
assert.match(understandActivities[1].body,/domain means allowed inputs/i);
assert.match(understandActivities[1].body,/range means resulting outputs/i);

const domainSkill=parametricDifferentiationTopic.microSkills.find(skill=>skill.slug==='domain-range');
assert(domainSkill);
assert.match(domainSkill.title,/Recall domain\/range/i);
const restrictJourney=parametricDifferentiationTopic.journey.find(item=>item.id==='restrict-eliminate');
assert(restrictJourney);
assert.match(restrictJourney.summary,/domain as allowed inputs and range as resulting outputs/i);

const source=readFileSync(new URL('../src/scripts/parametric-differentiation-understand.js',import.meta.url),'utf8');
const restrictStart=source.indexOf(' render_restrict_domain(){');
const eliminateStart=source.indexOf(' render_eliminate_parameter(){',restrictStart);
const deriveStart=source.indexOf(' render_derive_gradient(){',eliminateStart);
const gradientViewStart=source.indexOf(' render_gradient_view(){',deriveStart);
assert(restrictStart>=0&&eliminateStart>restrictStart&&deriveStart>eliminateStart&&gradientViewStart>deriveStart);

const restrictSource=source.slice(restrictStart,eliminateStart);
assert.match(restrictSource,/Domain.*allowed input values/s);
assert.match(restrictSource,/Range.*output values produced/s);
assert.match(restrictSource,/Quick recall check/);
assert.match(restrictSource,/which statement gives the domain/i);
assert.match(restrictSource,/−2≤x≤1/);
assert.match(restrictSource,/0≤f\(x\)≤4/);
assert.match(restrictSource,/explorer\.hidden=true/,'The parametric range explorer must remain hidden until the recap check is answered correctly.');
assert.match(restrictSource,/if\(id==='domain'\)\{revealExplorer\(\);return;\}/);
assert.match(restrictSource,/That interval describes the range of output values/);
assert.match(restrictSource,/allowed t-values form the parameter domain/);
assert.match(restrictSource,/restricting t can change both coordinate ranges/);
assert(restrictSource.indexOf('Domain')<restrictSource.indexOf('mountTracer(explorer'),'Students must meet domain/range meaning before the parametric range explorer is mounted.');

const deriveSource=source.slice(deriveStart,gradientViewStart);
assert.match(deriveSource,/formal derivation is the chain rule/i);
assert.match(deriveSource,/y = y\(x\(t\)\)/);
assert.match(deriveSource,/dy\/dt = \(dy\/dx\)\(dx\/dt\)/);
assert.match(deriveSource,/dy\/dx = \(dy\/dt\) \/ \(dx\/dt\)/);
assert(deriveSource.indexOf("Apply the chain rule with respect to t")<deriveSource.indexOf("A-level intuition, not proof"),'The chain-rule derivation must appear before the cancellation mnemonic.');
assert.match(deriveSource,/At A level it can be useful to think of the differentials as if dt cancels/i);
assert.match(deriveSource,/mnemonic or intuition/i);
assert.match(deriveSource,/chain rule above is the justification/i);
assert.match(deriveSource,/not ordinary algebraic factors that may always be cancelled/i);
assert.match(deriveSource,/later mathematics treats differential notation more carefully/i);

const memory=getMemoryItemsForTopic(parametricDifferentiationTopic.topicId);
const chainMemory=memory.find(item=>item.id.endsWith(':chain'));
assert(chainMemory);
assert.match(chainMemory.learn.statement,/chain rule gives dy\/dt=\(dy\/dx\)\(dx\/dt\)/i);
assert.match(chainMemory.learn.statement,/A-level mnemonic only, not the proof/i);
assert.match(chainMemory.learn.statement,/later mathematics treats differentials more carefully/i);

assert(chainReasoningDefinition.errorCategories.includes('chain-justification'));
const assessment=readFileSync(new URL('../src/scripts/question-definitions/parametric-differentiation-assessment.js',import.meta.url),'utf8');
assert.match(assessment,/Because dt is an ordinary number that may always be cancelled\./,'Literal cancellation should appear only as an explicitly incorrect distractor.');
assert.match(assessment,/This is the formal justification; do not derive it by literal cancellation\./);
assert.match(assessment,/fraction-like cancellation can be a mnemonic only/);
assert.match(assessment,/later mathematics treats them more carefully/);

console.log('PASS Original-prompt audit Step 11 domain-range recap and differential-notation caveat');
