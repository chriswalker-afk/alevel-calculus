import { differentialEquationsTopic } from './topic-content/differential-equations.js';
import { learningModeDescriptor, learningModeKicker, learningModeLabel } from './learning-mode-presentation.js';
const freeze=Object.freeze; const byKey=new Map(differentialEquationsTopic.activities.map(a=>[`${a.mode}:${a.slug}`,a]));
const rows={
 understand:[
  ['vocabulary','Key vocabulary','Name the objects before manipulating them: equation, order, variables, separability and solution type.','language → structure → solution'],
  ['translate-rate-statements','Translate rate statements','Turn proportionality words into derivatives, a constant k and the correct sign.','words → rate equation'],
  ['recognise-separable','Recognise separable structure','Ask whether x-dependent and y-dependent factors can be gathered onto opposite sides.','dy/dx=f(x)g(y)'],
  ['separate-only','Separate — and stop','Use multiplication and division to separate variables. Do not integrate until the separated form is correct.','[1/g(y)]dy=f(x)dx'],
  ['integrate-both-sides','Integrate both sides','Once separated, integrate each side with the existing integration toolkit and combine C₁,C₂ into one C.','∫[1/g(y)]dy=∫f(x)dx'],
  ['family-particular','General family and particular solution','A general solution represents many curves. A condition selects one particular member of that family.','general family + condition → particular solution']
 ],
 memorise:[
  ['translation-signs','Rate language, k and signs','Recall how proportional, decreasing and inversely proportional statements become differential equations.','increase: +k · decrease: −k'],
  ['separation-method','Separate → integrate → +C','Retrieve the order of the solution method before doing algebra.','translate → separate → integrate → +C'],
  ['general-particular','General → condition → particular','Recall where the condition is used: after forming the general solution.','general solution + condition → C'],
  ['model-checks','Interpretation and model checks','Recall the four checks after solving: sign, units, long-term behaviour and realistic domain/assumptions.','sign · units · t→∞ · assumptions/domain']
 ],
 ao1:[
  ['construct-rate-equations','Construct rate equations','Translate proportionality contexts with the correct derivative, constant and sign.','context → dy/dx'],
  ['solve-and-condition','Solve and apply conditions','Separate, integrate and use an initial/boundary condition to determine C.','general → condition → particular'],
  ['interpret-solutions','Interpret signs, units and long-term behaviour','Read constants, signs and asymptotic behaviour back into the context.','solution → contextual statement']
 ],
 ao2:[
  ['explain-and-diagnose','Explain and diagnose solution methods','Explain why a separation or condition step is valid and diagnose common errors.','reason about the first broken stage'],
  ['assumptions-limitations','Assumptions and model limitations','Judge assumptions, realistic domain and whether long-term extrapolation is justified.','mathematical behaviour ≠ automatic realism']
 ],
 ao3:[
  ['unfamiliar-modelling','Unfamiliar differential-equation modelling','Build, solve and interpret a model from an unfamiliar context, including a limitation statement.','construct → solve → interpret → critique']
 ]
};
const views={'translation-signs':'learn','separation-method':'flashcards','general-particular':'games','model-checks':'review'};
export const differentialEquationsLearningModes=freeze(Object.fromEntries(Object.entries(rows).map(([mode,list])=>[mode,freeze({
 label:learningModeLabel(mode),descriptor:learningModeDescriptor(mode),
 activities:freeze(list.map(([slug,title,body,formula])=>{const meta=byKey.get(`${mode}:${slug}`);if(!meta)throw new Error(`Missing differential-equations metadata ${mode}:${slug}`);return freeze({activityId:meta.activityId,microSkillId:meta.microSkillIds[0],kicker:learningModeKicker(mode),overline:title,title,body,calloutLabel:mode==='understand'?'Separation first':mode==='memorise'?'Memory Lab':`${mode.toUpperCase()} focus`,callout:mode==='understand'?'Translate and separate before choosing any integration technique.':mode==='memorise'?'Retrieve the method and model checks before calculation.':'Solve the mathematics, then interpret it inside the stated context; do not extrapolate blindly.',formula,caption:'Plan 37: translate → separate → integrate → condition → interpret → test assumptions/limitations.',differentialEquationsUnderstand:mode==='understand',...(mode==='memorise'?{memoryLabView:views[slug],memoryLabNavTarget:true,memoryLabGames:slug==='general-particular'?['build','missing-piece','sort','impostor']:undefined}:{})});}) )
})])));
