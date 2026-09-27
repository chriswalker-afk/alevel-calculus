import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { concavityInflectionTopic } from '../src/scripts/topic-content/concavity-inflection.js';
import { concavityInflectionLearningModes } from '../src/scripts/concavity-inflection-activities.js';
import { concavityFromSecondDerivative } from '../src/scripts/concavity-inflection-understand.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';

const understandIds=concavityInflectionLearningModes.understand.activities.map(activity=>activity.activityId);
assert.deepEqual(understandIds.slice(0,3),[
 'activity:y13:differentiation:concavity-inflection:understand:visual-mnemonic',
 'activity:y13:differentiation:concavity-inflection:understand:visual-challenge',
 'activity:y13:differentiation:concavity-inflection:understand:gradient-change'
],'The visual mnemonic and its challenge must precede the existing linked derivative explorer.');

assert.equal(concavityFromSecondDerivative(-1),'concave');
assert.equal(concavityFromSecondDerivative(1),'convex');
assert.match(concavityFromSecondDerivative(0),/candidate/);

const source=readFileSync(new URL('../src/scripts/concavity-inflection-understand.js',import.meta.url),'utf8');
const mnemonicStart=source.indexOf(' render_visual_mnemonic(){');
const challengeStart=source.indexOf(' render_visual_challenge(){',mnemonicStart);
const gradientStart=source.indexOf(' render_gradient_change(){',challengeStart);
const signStart=source.indexOf(' render_concavity_sign(){',gradientStart);
const inflectionStart=source.indexOf(' render_inflection_test(){',signStart);
const typeStart=source.indexOf(' render_inflection_types(){',inflectionStart);
assert(mnemonicStart>=0&&challengeStart>mnemonicStart&&gradientStart>challengeStart&&signStart>gradientStart&&inflectionStart>signStart&&typeStart>inflectionStart);

const mnemonic=source.slice(mnemonicStart,challengeStart);
assert.match(mnemonic,/concave looks like a cave/i);
assert.match(mnemonic,/convex looks like a V/i);
assert.match(mnemonic,/f\(x\)=−x²/);
assert.match(mnemonic,/f\(x\)=x²/);
assert.match(mnemonic,/only a first visual cue, not the definition/i);
assert.match(mnemonic,/formal decision comes from the sign of f″/i);

const challenge=source.slice(challengeStart,gradientStart);
assert.match(challenge,/f\(x\)=x³\+x/);
assert.match(challenge,/S-shaped overall/);
assert.match(challenge,/cave or V.*not reliable by itself/i);
assert.match(challenge,/Check with f″/);
assert.match(challenge,/f″\(−1\)=−6<0/);
assert.match(challenge,/f″\(1\)=6>0/);
assert.match(challenge,/Your choice is only a hypothesis until f″ is checked/);
assert.match(challenge,/setSecondDerivativeVisible\(true\)/,'The counterexample must reveal second-derivative evidence before the formal conclusion.');
assert.match(challenge,/The sign of f″ is the criterion/);
assert.match(challenge,/one S-shaped curve contains both concave and convex regions/i);

const formal=source.slice(gradientStart,inflectionStart);
assert.match(formal,/createLinkedFunctionGradientExplorer/);
assert.match(formal,/revealDerivative:true/);
assert.match(formal,/revealSecondDerivative:true/);
assert.match(formal,/Use the Edexcel convention: f″<0 is concave and f″>0 is convex/);
assert.match(formal,/Concave: f″<0\. Convex: f″>0/);

const inflection=source.slice(inflectionStart,typeStart);
assert.match(inflection,/zero second derivative is only a candidate/i);
assert.match(inflection,/Only x³ changes sign in f″/);
assert.match(inflection,/Do not write “f″=0, therefore inflection”/);
assert.match(inflection,/Confirm a sign change in f″/);

const visualJourney=concavityInflectionTopic.journey.find(item=>item.id==='visual-cue');
assert(visualJourney);
assert.match(visualJourney.summary,/concave looks like a cave/i);
assert.match(visualJourney.summary,/convex looks like a V/i);
assert.match(visualJourney.summary,/sign of f″ is the criterion/i);

const memory=getMemoryItemsForTopic(concavityInflectionTopic.topicId);
const signs=memory.find(item=>item.id.endsWith(':signs'));
const inflectionMemory=memory.find(item=>item.id.endsWith(':inflection'));
assert(signs&&inflectionMemory);
assert.match(signs.learn.statement,/concave can look like a cave and convex can look like a V/i);
assert.match(signs.learn.statement,/only a mnemonic/i);
assert.match(signs.learn.statement,/Edexcel criterion/i);
assert.match(inflectionMemory.learn.statement,/f″ changes sign/);
assert.match(inflectionMemory.learn.statement,/f″=0 alone is only a candidate/);

const assessment=readFileSync(new URL('../src/scripts/question-definitions/concavity-inflection-assessment.js',import.meta.url),'utf8');
assert.match(assessment,/cave\/V picture is only a visual cue/i);
assert.match(assessment,/f″<0 concave; f″>0 convex/);
assert.match(assessment,/sign-based reasoning is the formal criterion/i);
assert.match(assessment,/zero second derivative alone is not sufficient/i);

console.log('PASS Original-prompt audit Step 13 cave/V mnemonic, visual counterexample, Edexcel signs and inflection sign-change criterion');
