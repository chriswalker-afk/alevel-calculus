import { preCalculusTopic } from './topic-content/pre-calculus.js';
import { basicsDifferentiationTopic } from './topic-content/basics-differentiation.js';
import { firstPrinciplesTopic } from './topic-content/first-principles.js';
import { tangentsNormalsTopic } from './topic-content/tangents-normals.js';
import { stationaryPointsTopic } from './topic-content/stationary-points.js';
import { increasingDecreasingTopic } from './topic-content/increasing-decreasing.js';
import { integrationIntroTopic } from './topic-content/integration-intro.js';
import { definiteIndefiniteTopic } from './topic-content/definite-indefinite-integration.js';
import { integrationAreaTopic } from './topic-content/integration-area.js';
import { signedAreaTopic } from './topic-content/signed-area.js';
import { year12ReviewTopic } from './topic-content/year12-review.js';
import { standardFunctionsTopic } from './topic-content/standard-functions.js';
import { trigFirstPrinciplesTopic } from './topic-content/trig-first-principles.js';
import { productQuotientChainTopic } from './topic-content/product-quotient-chain.js';
import { parametricDifferentiationTopic } from './topic-content/parametric-differentiation.js';
import { implicitDifferentiationTopic } from './topic-content/implicit-differentiation.js';
import { trigIdentitiesInverseTopic } from './topic-content/trig-identities-inverse.js';
import { concavityInflectionTopic } from './topic-content/concavity-inflection.js';
import { connectedRatesTopic } from './topic-content/connected-rates.js';
import { fullDifferentiationReviewTopic } from './topic-content/full-differentiation-review.js';
import { standardIntegralsTopic } from './topic-content/standard-integrals.js';
import { reverseChainRuleTopic } from './topic-content/reverse-chain-rule.js';
import { trigIdentityIntegrationTopic } from './topic-content/trig-identity-integration.js';
import { substitutionTopic } from './topic-content/substitution.js';
import { integrationByPartsTopic } from './topic-content/integration-by-parts.js';
import { partialFractionsIntegrationTopic } from './topic-content/partial-fractions-integration.js';
import { year13AreasTopic } from './topic-content/year13-areas.js';
import { parametricAreaTopic } from './topic-content/parametric-area.js';
import { limitOfSumTopic } from './topic-content/limit-of-sum.js';
import { numericalIntegrationTopic } from './topic-content/numerical-integration.js';
import { differentialEquationsTopic } from './topic-content/differential-equations.js';
import { calculusModellingTopic } from './topic-content/calculus-modelling.js';
import { fullCalculusMasteryTopic } from './topic-content/full-calculus-mastery.js';

export const CURRICULUM_AUDIT_TOPICS = Object.freeze([
  preCalculusTopic, basicsDifferentiationTopic, firstPrinciplesTopic, tangentsNormalsTopic,
  stationaryPointsTopic, increasingDecreasingTopic, integrationIntroTopic, definiteIndefiniteTopic,
  integrationAreaTopic, signedAreaTopic, year12ReviewTopic, standardFunctionsTopic,
  trigFirstPrinciplesTopic, productQuotientChainTopic, parametricDifferentiationTopic,
  implicitDifferentiationTopic, trigIdentitiesInverseTopic, concavityInflectionTopic,
  connectedRatesTopic, fullDifferentiationReviewTopic, standardIntegralsTopic, reverseChainRuleTopic,
  trigIdentityIntegrationTopic, substitutionTopic, integrationByPartsTopic,
  partialFractionsIntegrationTopic, year13AreasTopic, parametricAreaTopic, limitOfSumTopic,
  numericalIntegrationTopic, differentialEquationsTopic, calculusModellingTopic, fullCalculusMasteryTopic
]);

const fiveModes = Object.freeze(['understand','memorise','ao1','ao2','ao3']);
const audit = (section,title,topic,requiredActivitySlugs,{modes=fiveModes,scope=topic.scopeId,note=''}={}) => Object.freeze({
  section,title,topicId:topic.topicId,scope,requiredModes:Object.freeze([...modes]),
  requiredActivitySlugs:Object.freeze([...requiredActivitySlugs]),note
});

export const CURRICULUM_COVERAGE_TRACE = Object.freeze([
  audit(5,'Pre-Calculus Introduction',preCalculusTopic,['hill-gradient','gradient-sign','steepness','gradient-vs-height','vertical-limit','delta-change','curve-question'],{modes:['understand']}),
  audit(6,'Basics of Differentiation',basicsDifferentiationTopic,['curve-tangent-gradient','gradient-function','derivative-notation','power-rule-pattern','term-by-term','power-rule','explain-gradient-function']),
  audit(7,'Differentiation from First Principles',firstPrinciplesTopic,['limit-intuition','chord-approximation','h-to-zero','formal-definition','derive-x2','derive-x3','independent-proof','explain-chord-limit']),
  audit(8,'Tangents and Normals',tangentsNormalsTopic,['derivative-gradient','tangent-line','normal-gradient','normal-line','special-cases','applications']),
  audit(9,'Basic Applications: Stationary and Turning',stationaryPointsTopic,['zero-gradient','max-min-signs','stationary-inflection','second-derivative','find-stationary','applications-parameters']),
  audit(10,'Increasing and Decreasing Functions',increasingDecreasingTopic,['appearance-first','derivative-sign','select-intervals','algebra-bridge','visual-classification','applications']),
  audit(11,'Introduction to Integration',integrationIntroTopic,['guess-original','family-of-curves','constant-of-integration','power-rule','term-by-term','why-plus-c','simple-applications']),
  audit(12,'Definite and Indefinite Integration',definiteIndefiniteTopic,['family-vs-number','integrate-then-evaluate','bracket-notation','why-no-c','properties','evaluate-definite','simple-applications']),
  audit(13,'Integration as Area',integrationAreaTopic,['lower-limit-zero','remove-unwanted-region','endpoint-difference','visual-properties','simple-area-applications']),
  audit(14,'Areas Below the Axis and Crossing the Axis',signedAreaTopic,['signed-contributions','cancellation-zero','split-the-integral','signed-vs-total','split-and-area','signed-area-applications']),
  Object.freeze({section:15,title:'Area Between Curves — Placement',topicId:year13AreasTopic.topicId,scope:'placement-rule',requiredModes:Object.freeze([...fiveModes]),requiredActivitySlugs:Object.freeze(['construction-visual','top-minus-bottom','split-when-needed']),note:'General arbitrary area-between-curves is intentionally Year 13; Year 12 retains axis/straight-line bounded area only.'}),
  audit(16,'Year 12 / 8MA0 Calculus Review and Mastery',year12ReviewTopic,['gradient-derivatives','first-principles','tangents-normals','stationary-points','increasing-decreasing','integration','definite-integration','areas','topic-blind-mixed','diagnostic-mastery'],{modes:['memorise','ao1','ao2','ao3']}),
  audit(18,'Differentiation of Standard Functions',standardFunctionsTopic,['graph-discovery','scaled-functions','core-rules','standard-rules','explain-graphs','tangent-stationary-applications']),
  audit(19,'First-Principles Proofs for Trig Derivatives',trigFirstPrinciplesTopic,['small-angle-evidence','key-limits','derive-sine','derive-cosine','complete-derivations','reconstruct-and-apply']),
  audit(20,'Product Rule, Quotient Rule and Chain Rule',productQuotientChainTopic,['classify-structure','function-machines','rule-application','nested-mixtures','mixed-multi-rule','applications']),
  audit(21,'Parametric Equations and Differentiation',parametricDifferentiationTopic,['trace-curve','restrict-domain','eliminate-parameter','derive-gradient','gradient-view','tangent-normal','applications']),
  audit(22,'Implicit Differentiation',implicitDifferentiationTopic,['explicit-implicit','y-chain-rule','term-workspace','rearrange','full-method','applications']),
  audit(23,'Differentiation with Trig Identities and Inverse Functions',trigIdentitiesInverseTopic,['inverse-or-reciprocal','restricted-domain','further-trig','inverse-derivative','inverse-trig-derivations','mixed-workspace','applications']),
  audit(24,'Concavity, Convexity and Points of Inflection',concavityInflectionTopic,['gradient-change','concavity-sign','inflection-test','inflection-types','solve-interpret','curve-sketching']),
  audit(25,'Connected Rates of Change',connectedRatesTopic,['practical-dependency','rate-flow','consistent-method','signs-units','multi-stage','modelling']),
  audit(26,'Year 13 Differentiation Review and Mastery',fullDifferentiationReviewTopic,['things-to-remember','method-map','method-selection-only','topic-blind-fluency','justify-and-diagnose','diagnostic-mastery'],{modes:['memorise','ao1','ao2','ao3'],scope:'full-alevel'}),
  audit(27,'Standard Integrals to Memorise',standardIntegralsTopic,['reverse-link','standard-array','linear-forms','fundamental-theorem','recover-function','differentiate-to-check','recover-and-evaluate']),
  audit(28,'Recognition and the Reverse Chain Rule',reverseChainRuleTopic,['discover-pattern','recognition-first','constant-adjustment','f-prime-over-f','trig-recognition','definite-recognition','multi-step-recognition']),
  audit(29,'Integration Using Trig Identities',trigIdentityIntegrationTopic,['identity-bank','rewrite-first','core-examples','scaled-cases','method-choice','definite-cases','mixed-application']),
  audit(30,'Integration by Substitution',substitutionTopic,['why-substitution','change-everything','definite-indefinite','choosing-u','complete-substitution','diagnose-errors','unfamiliar-applications']),
  audit(31,'Integration by Parts',integrationByPartsTopic,['method-positioning','derive-formula','choice-preview','hidden-one','repeated-parts','di-table','cyclic-cases','unsignposted']),
  audit(32,'Integration Using Partial Fractions',partialFractionsIntegrationTopic,['recognise-proper','improper-first','structure-builder','find-coefficients','integrate-terms','single-log','mixed-rational']),
  audit(33,'Areas with Year 13 Integration Techniques',year13AreasTopic,['construction-visual','top-minus-bottom','split-when-needed','geometry-or-calculus','full-toolkit','signed-vs-geometric','unfamiliar-diagrams']),
  audit(34,'Area Using Parametric Equations',parametricAreaTopic,['thin-strip','derive-formula','convert-limits','direction-and-sign','geometric-area','later-technique','bounded-regions']),
  audit(35,'Integration as the Limit of a Sum',limitOfSumTopic,['rectangle-progression','sum-to-integral','recognise-first','k-notation','recognise-evaluate','mixed-technique']),
  audit(36,'Numerical Integration and the Trapezium Rule',numericalIntegrationTopic,['numerical-context','one-trapezium','long-way-build','general-rule','ordinate-table','percentage-error','concavity-bounds','table-context']),
  audit(37,'First-Order Differential Equations',differentialEquationsTopic,['vocabulary','translate-rate-statements','recognise-separable','separate-only','integrate-both-sides','family-particular','solve-and-condition','assumptions-limitations','unfamiliar-modelling']),
  audit(38,'9MA0 Calculus Modelling',calculusModellingTopic,['framework','contexts','method-choice','exact-vs-numerical','interpret-limitations','topic-blind-model']),
  audit(39,'Method Selection, Mixed Practice and 9MA0 Mastery',fullCalculusMasteryTopic,['method-only','which-method-first','select-complete-check','select-and-explain','diagnose-order','mixed-mastery'],{modes:['ao1','ao2','ao3'],scope:'full-alevel'})
]);

export const REUSABLE_VISUAL_SYSTEM_EVIDENCE = Object.freeze([
  'linked-function-gradient-explorer.js','chord-to-tangent-explorer.js','family-of-curves-explorer.js',
  'area-explorer.js','parametric-curve-tracer.js','rate-flow-diagram.js','rectangle-sum-explorer.js',
  'trapezium-rule-builder.js','expression-structure-highlighter.js','equation-step-renderer.js'
]);

export function runCurriculumCoverageAudit(){
  const topics=new Map(CURRICULUM_AUDIT_TOPICS.map(topic=>[topic.topicId,topic]));
  const findings=[];
  for(const row of CURRICULUM_COVERAGE_TRACE){
    const topic=topics.get(row.topicId);
    if(!topic){findings.push(`Section ${row.section}: missing topic ${row.topicId}`);continue;}
    if(row.scope!=='placement-rule'&&topic.scopeId!==row.scope)findings.push(`Section ${row.section}: expected scope ${row.scope}, found ${topic.scopeId}`);
    for(const mode of row.requiredModes)if(!topic.modes.includes(mode))findings.push(`Section ${row.section}: ${topic.topicId} missing mode ${mode}`);
    for(const slug of row.requiredActivitySlugs)if(!topic.activities.some(activity=>activity.slug===slug))findings.push(`Section ${row.section}: ${topic.topicId} missing activity slug ${slug}`);
    if(row.section!==5&&row.section!==39&&topic.vocabularyTags.length===0)findings.push(`Section ${row.section}: ${topic.topicId} has no vocabulary family`);
  }
  const y12Ids=new Set(CURRICULUM_AUDIT_TOPICS.filter(t=>t.scopeId==='y12').map(t=>t.topicId));
  if(y12Ids.has(year13AreasTopic.topicId)) findings.push('Section 15: arbitrary between-curves topic leaked into Year 12 scope');
  return Object.freeze({ok:findings.length===0,findings:Object.freeze(findings),sectionsAudited:CURRICULUM_COVERAGE_TRACE.length,topicsAudited:CURRICULUM_AUDIT_TOPICS.length});
}
