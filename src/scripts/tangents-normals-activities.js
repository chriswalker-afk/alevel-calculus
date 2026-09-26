import { tangentsNormalsTopic } from './topic-content/tangents-normals.js';
import { learningModeDescriptor, learningModeKicker, learningModeLabel } from './learning-mode-presentation.js';
const freeze = Object.freeze;
const textByMode = {
  understand: [
    ['derivative-gradient','Derivative gives gradient','Differentiate first, then evaluate at x = a. The number f′(a) is the gradient of the tangent at the point (a, f(a)).','m_tangent = f′(a)'],
    ['tangent-line','Tangent through the point of contact','Once the gradient is known, pair it with the point (a, f(a)) in point-slope form.','y − f(a) = f′(a)(x − a)'],
    ['normal-gradient','Turn 90° to the normal','The normal is perpendicular to the tangent. For a non-zero finite tangent gradient, their product is −1.','m_normal = −1 / m_tangent'],
    ['normal-line','Normal through the same point','The normal passes through exactly the same point of contact as the tangent, but uses the perpendicular gradient.','y − f(a) = m_normal(x − a)'],
    ['special-cases','Do not divide by zero','At a horizontal tangent m_tangent = 0. The perpendicular normal is vertical, so write x = a rather than an undefined gradient.','m_tangent = 0  ⇒  normal: x = a']
  ],
  memorise: [
    ['key-facts','Key facts','Use the shared Memory Lab to retrieve the derivative-to-tangent and perpendicular-gradient facts.','f′(a) → m_tangent → m_normal'],
    ['formula-recall','Formula recall','Recall point-slope form and the negative reciprocal relationship before revealing them.','y − y₁ = m(x − x₁)'],
    ['special-cases','Special cases','Make horizontal tangent and vertical normal an automatic pair.','horizontal tangent ↔ vertical normal'],
    ['vocabulary-recall','Vocabulary recall','Match tangent, normal, point of contact, perpendicular and negative reciprocal to precise meanings.','term ↔ meaning'],
    ['memory-games','Memory games','Reconstruct and classify the same facts using the shared game engines.','recall → classify → reconstruct'],
    ['mixed-review','Mixed review','Mix formulas, vocabulary and diagrams through the shared review engines.','gradient ↔ line ↔ geometry']
  ],
  ao1: [
    ['tangent-gradient','Tangent-gradient fluency','Differentiate and substitute the given x-value accurately.','m_tangent = f′(a)'],
    ['tangent-line','Tangent equations','Find the point of contact and tangent gradient, then form the line equation.','y − f(a) = f′(a)(x − a)'],
    ['normal-gradient','Normal-gradient fluency','Convert a non-zero tangent gradient to its negative reciprocal.','m_normal = −1/m_tangent'],
    ['normal-line','Normal equations','Use the same point of contact with the normal gradient.','y − f(a) = m_normal(x − a)']
  ],
  ao2: [
    ['explain-perpendicular','Why the negative reciprocal?','Explain the perpendicular-gradient relationship rather than using it as an unexplained trick.','m_tangent × m_normal = −1'],
    ['special-cases','Reason about horizontal tangents','Explain why a zero tangent gradient produces a vertical normal and why −1/0 is not a usable gradient.','m_tangent = 0  ⇒  x = a'],
    ['diagnose-line','Diagnose a line solution','Identify whether an error comes from the derivative, the point of contact, the perpendicular gradient or the line equation.','gradient + point → line']
  ],
  ao3: [
    ['applications','Apply tangents and normals','Use tangent or normal equations in short contextual and intersection problems without adding unnecessary algebraic complexity.','differentiate → gradient → line → interpret']
  ]
};
const byId = new Map(tangentsNormalsTopic.activities.map(a=>[a.activityId,a]));
const memoryViews = { 'key-facts':'learn','formula-recall':'flashcards','special-cases':'flashcards','vocabulary-recall':'games','memory-games':'games','mixed-review':'review' };
export const tangentsNormalsLearningModes = freeze(Object.fromEntries(Object.entries(textByMode).map(([mode, rows])=>[mode,freeze({
  label: learningModeLabel(mode), descriptor: learningModeDescriptor(mode),
  activities: freeze(rows.map(([slug,title,body,formula])=>{
    const meta=[...byId.values()].find(a=>a.mode===mode&&a.slug===slug); if(!meta) throw new Error(`Missing Tangents/Normals metadata ${mode}:${slug}`);
    return freeze({activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:`${learningModeKicker(mode)}`,overline:title,title,body,calloutLabel:mode==='understand'?'Central journey':mode==='memorise'?'Memory Lab':`${mode.toUpperCase()} focus`,callout:mode==='understand'?'Derivative gives gradient → tangent uses gradient → normal is perpendicular → equation of line.':mode==='memorise'?'Use the same shared Memory Lab engines and vocabulary source as the reference topic.':'Keep the mathematics valid and the line/point relationship explicit.',formula,caption: mode==='understand'?'Move the point and keep the curve, tangent and normal connected.':'Use the shared question and feedback systems.',tangentsNormalsUnderstand:mode==='understand',...(mode==='memorise'?{memoryLabView:memoryViews[slug],memoryLabGame:slug==='vocabulary-recall'?'match':slug==='memory-games'?'build':undefined,memoryLabGames:slug==='memory-games'?freeze(['build','missing-piece','sort','impostor']):undefined,memoryLabNavTarget:['key-facts','formula-recall','memory-games','mixed-review'].includes(slug)}:{})});
  }))
})])));
