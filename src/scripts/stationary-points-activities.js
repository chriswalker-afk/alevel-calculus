import { stationaryPointsTopic } from './topic-content/stationary-points.js';
import { learningModeDescriptor, learningModeKicker, learningModeLabel } from './learning-mode-presentation.js';
const freeze=Object.freeze;
const textByMode={
 understand:[
  ['zero-gradient','Gradient function → zero gradient','Move the linked point until the tangent is horizontal. On the gradient graph, the same x-value lands at f′(x)=0.','f′(a)=0 ⇒ stationary point'],
  ['max-min-signs','Zero gradient can sit inside different sign changes','Compare what f′ does just before and just after the zero: +→0→− gives a local maximum; −→0→+ gives a local minimum.','+→0→− : max    −→0→+ : min'],
  ['stationary-inflection','Stationary does not automatically mean turning','For f(x)=x³ the tangent is horizontal at x=0, but the curve keeps increasing. The derivative has the pattern +→0→+.','f′(0)=0 but there is no turn'],
  ['classify-from-signs','Classify behaviour before naming a test','Use only the derivative signs before, at and after the stationary point. Decide whether the curve turns down, turns up, or does not turn.','signs of f′ → behaviour of f'],
  ['second-derivative','The second derivative tracks changing gradient','Reveal f″ after the sign reasoning. At a stationary point f″>0 supports a local minimum, f″<0 supports a local maximum, but f″=0 is inconclusive.','f″(a)>0 min · f″(a)<0 max · f″(a)=0 inconclusive']
 ],
 memorise:[
  ['key-facts','Key facts','Retrieve what makes a point stationary and the distinction between stationary and turning points.','f′(a)=0'],
  ['sign-patterns','Sign patterns','Make +→0→−, −→0→+, and same-sign patterns automatic.','+→0→− max · −→0→+ min · same sign no turn'],
  ['second-derivative-test','Second-derivative test','Recall the useful shortcut and its essential limitation.','f″>0 min · f″<0 max · f″=0 inconclusive'],
  ['vocabulary-recall','Vocabulary recall','Match stationary point, turning point, local maximum, local minimum and stationary inflection to precise meanings.','term ↔ meaning'],
  ['memory-games','Memory games','Build, sort and spot impostors using the shared Memory Lab engines.','recall → classify → reconstruct'],
  ['mixed-review','Mixed review','Mix formulas, vocabulary, sign patterns and diagrams.','zero gradient ↔ sign change ↔ classification']
 ],
 ao1:[
  ['find-stationary','Find stationary points','Differentiate, solve f′(x)=0, and state the stationary x-value.','f′(x)=0'],
  ['sign-test','First-derivative sign test','Classify maximum, minimum or stationary inflection from valid derivative-sign behaviour.','sign of f′ before and after'],
  ['second-derivative-test','Second-derivative test','Use f″ only after a stationary point has been established; report zero as inconclusive.','f′(a)=0 then inspect f″(a)']
 ],
 ao2:[
  ['explain-tests','Explain the tests','Explain why derivative sign changes classify turning behaviour and why f″ is a shortcut.','behaviour → sign of f′'],
  ['diagnose-classification','Diagnose classification errors','Spot claims that confuse stationary with turning, or incorrectly force a result when f″(a)=0.','f″(a)=0 ⇒ inconclusive']
 ],
 ao3:[
  ['applications-parameters','Applications and parameter problems','Use the stationary condition in simple Year 12 models and parameter questions, then classify only when the evidence justifies it.','differentiate → f′(a)=0 → solve → classify']
 ]
};
const byKey=new Map(stationaryPointsTopic.activities.map(a=>[`${a.mode}:${a.slug}`,a]));
const memoryViews={'key-facts':'learn','sign-patterns':'flashcards','second-derivative-test':'flashcards','vocabulary-recall':'games','memory-games':'games','mixed-review':'review'};
export const stationaryPointsLearningModes=freeze(Object.fromEntries(Object.entries(textByMode).map(([mode,rows])=>[mode,freeze({
 label:learningModeLabel(mode),descriptor:learningModeDescriptor(mode),
 activities:freeze(rows.map(([slug,title,body,formula])=>{const meta=byKey.get(`${mode}:${slug}`);if(!meta)throw new Error(`Missing Stationary Points metadata ${mode}:${slug}`);return freeze({activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:learningModeKicker(mode),overline:title,title,body,calloutLabel:mode==='understand'?'Central journey':mode==='memorise'?'Memory Lab':`${mode.toUpperCase()} focus`,callout:mode==='understand'?'Gradient function → zero gradient → stationary points → maxima/minima → stationary inflection → derivative tests.':mode==='memorise'?'Retrieve the classification facts before relying on them in questions.':'Classify only from mathematically valid evidence; zero second derivative is never forced into max/min.',formula,caption:mode==='understand'?'Classify the behaviour from linked graphs and derivative signs before relying on a memorised test.':'Use the shared question, feedback and diagnostic systems.',stationaryPointsUnderstand:mode==='understand',...(mode==='memorise'?{memoryLabView:memoryViews[slug],memoryLabGame:slug==='vocabulary-recall'?'match':slug==='memory-games'?'build':undefined,memoryLabGames:slug==='memory-games'?freeze(['build','missing-piece','sort','impostor']):undefined,memoryLabNavTarget:['key-facts','sign-patterns','memory-games','mixed-review'].includes(slug)}:{})});}))
})])));
