import {
  powerRuleAlgebraicDefinition,
  powerRuleChoiceDefinition,
  powerRuleNumericDefinition,
  powerRuleQuestionDefinitions,
  powerRuleReasoningDefinition
} from "./question-definitions/power-rule.js";
import {
  firstPrinciplesAssessmentQuestionDefinitions,
  simpleLimitDefinition, fxPlusHDefinition, x2FirstPrinciplesDefinition, x3FirstPrinciplesDefinition,
  explainChordDefinition, explainHZeroDefinition, diagnoseDerivationDefinition,
  chooseDifferenceQuotientDefinition, firstPrinciplesGradientApplicationDefinition
} from "./question-definitions/first-principles-assessment.js?v=ao1math4";
import {
  tangentsNormalsAssessmentQuestionDefinitions, tangentGradientDefinition, tangentLineDefinition, normalGradientDefinition, normalLineDefinition, explainPerpendicularDefinition, specialCaseDefinition, diagnoseLineDefinition, applicationDefinition
} from "./question-definitions/tangents-normals-assessment.js?v=interactions4";
import {
  stationaryPointsAssessmentQuestionDefinitions, findStationaryDefinition, signMaximumDefinition, signMinimumDefinition, signInflectionDefinition, secondDerivativeDefinition, explainSignTestDefinition, diagnoseClassificationDefinition, parameterStationaryDefinition, applicationClassificationDefinition
} from "./question-definitions/stationary-points-assessment.js?v=interactions1";
import {
  increasingDecreasingAssessmentQuestionDefinitions, visualClassificationDefinition, derivativeSignDefinition, intervalFromGraphDefinition, solveInequalityDefinition, explainSignsDefinition, stationaryBoundaryDefinition, applicationDefinition as increasingDecreasingApplicationDefinition
} from "./question-definitions/increasing-decreasing-assessment.js?v=interactions1";
import {
  integrationIntroAssessmentQuestionDefinitions, reverseDifferentiateDefinition, powerRuleIntegrationDefinition, rewriteIntegrateDefinition, termByTermIntegrationDefinition, whyPlusCDefinition, diagnoseIntegrationDefinition, integrationApplicationDefinition
} from "./question-definitions/integration-intro-assessment.js";
import {
  definiteIndefiniteAssessmentQuestionDefinitions, classifyIntegralDefinition, evaluateDefiniteDefinition, cancelCDefinition, limitPropertiesDefinition, explainWorkflowDefinition, diagnoseNotationDefinition, definiteApplicationDefinition
} from "./question-definitions/definite-indefinite-assessment.js";
import {
  integrationAreaAssessmentQuestionDefinitions, lowerZeroAreaDefinition, arbitraryLowerAreaDefinition, endpointDifferenceDefinition, identicalLimitsDefinition, adjacentIntervalsDefinition, reversedLimitsDefinition, explainLowerLimitDefinition, diagnoseAreaReasoningDefinition, areaApplicationDefinition
} from "./question-definitions/integration-area-assessment.js?v=interactions2";
import {
  signedAreaAssessmentQuestionDefinitions, signedContributionDefinition, crossingIntegralDefinition, splitAtRootsDefinition, totalAreaDefinition, explainCancellationDefinition, diagnoseSplittingDefinition, signedAreaApplicationDefinition
} from "./question-definitions/signed-area-assessment.js?v=interactions2";
import { year12ReviewAssessmentQuestionDefinitions, reconstructFromDerivativeDefinition } from "./question-definitions/year12-review-assessment.js";
import { fullDifferentiationReviewAssessmentQuestionDefinitions, methodProductChainDefinition, methodQuotientChainDefinition, methodParametricDefinition, methodImplicitDefinition, methodInverseRelationDefinition, methodConnectedRatesDefinition, methodSecondDerivativeDefinition, compareApproachesDefinition } from "./question-definitions/full-differentiation-review-assessment.js";
import {
  basicsAssessmentQuestionDefinitions,
  errorCorrectionDefinition,
  explainGradientFunctionDefinition,
  graphMatchingDefinition,
  rewriteReciprocalDefinition,
  rewriteRootDefinition,
  simpleApplicationInterpretDefinition,
  simpleApplicationRateDefinition,
  termByTermDefinition,
  unknownCoefficientsDefinition
} from "./question-definitions/basics-assessment.js";

import {
  standardFunctionsAssessmentQuestionDefinitions, standardRuleDefinition, scaledRuleDefinition, mixedRoutineDefinition as standardFunctionsMixedRoutineDefinition, explainScaleDefinition, diagnoseDefinition as standardFunctionsDiagnoseDefinition, applicationDefinition as standardFunctionsApplicationDefinition, stationaryApplicationDefinition as standardFunctionsStationaryApplicationDefinition
} from "./question-definitions/standard-functions-assessment.js";
import { trigFirstPrinciplesAssessmentQuestionDefinitions, limitsIdentityDefinition, completeDerivationDefinition, whyRadiansDefinition, locateLimitDefinition, graphConnectionDefinition, reconstructApplyDefinition } from "./question-definitions/trig-first-principles-assessment.js?v=ao1math4";
import { productQuotientChainAssessmentQuestionDefinitions, productRuleDefinition, quotientRuleDefinition, chainRuleDefinition, ruleSelectionDefinition as productQuotientChainRuleSelectionDefinition, multiRuleDefinition as productQuotientChainMultiRuleDefinition, quotientErrorDefinition, chainErrorDefinition, applicationDefinition as productQuotientChainApplicationDefinition } from "./question-definitions/product-quotient-chain-assessment.js";
import { parametricDifferentiationAssessmentQuestionDefinitions, coordinateDefinition as parametricCoordinateDefinition, rangeDefinition as parametricRangeDefinition, eliminationDefinition as parametricEliminationDefinition, gradientDefinition as parametricGradientDefinition, tangentDefinition as parametricTangentDefinition, parameterReasoningDefinition as parametricParameterReasoningDefinition, chainReasoningDefinition as parametricChainReasoningDefinition, verticalTangentDefinition as parametricVerticalTangentDefinition, applicationDefinition as parametricApplicationDefinition } from "./question-definitions/parametric-differentiation-assessment.js?v=interactions3b";
import { trigIdentitiesInverseAssessmentQuestionDefinitions, notationDefinition as trigInverseNotationDefinition, furtherTrigDefinition as trigInverseFurtherTrigDefinition, inverseRelationshipDefinition as trigInverseRelationshipDefinition, inverseTrigDefinition as trigInverseDerivativeDefinition, mixedDefinition as trigInverseMixedDefinition, explainNotationDefinition as trigInverseExplainNotationDefinition, explainIdentityDefinition as trigInverseExplainIdentityDefinition, diagnoseChainDefinition as trigInverseDiagnoseChainDefinition, applicationDefinition as trigInverseApplicationDefinition } from "./question-definitions/trig-identities-inverse-assessment.js";
import { concavityInflectionAssessmentQuestionDefinitions, interpretDefinition as concavityInterpretDefinition, intervalsDefinition as concavityIntervalsDefinition, inflectionDefinition as concavityInflectionDefinition, typeDefinition as concavityTypeDefinition, explainDefinition as concavityExplainDefinition, diagnoseDefinition as concavityDiagnoseDefinition, applicationDefinition as concavityApplicationDefinition } from "./question-definitions/concavity-inflection-assessment.js?v=interactions1";
import { connectedRatesAssessmentQuestionDefinitions, geometryDefinition as connectedRatesGeometryDefinition, chainDefinition as connectedRatesChainDefinition, signUnitsDefinition as connectedRatesSignUnitsDefinition, explainDefinition as connectedRatesExplainDefinition, diagnoseDefinition as connectedRatesDiagnoseDefinition, applicationDefinition as connectedRatesApplicationDefinition } from "./question-definitions/connected-rates-assessment.js?v=interactions4";
import { standardIntegralsAssessmentQuestionDefinitions, standardIntegralDefinition, linearFormDefinition, definiteStandardDefinition, recoverFunctionDefinition, spotErrorDefinition, explainCheckDefinition, applicationDefinition as standardIntegralsApplicationDefinition } from "./question-definitions/standard-integrals-assessment.js?v=ao2math2";
import { reverseChainRuleAssessmentQuestionDefinitions, classifyRecognitionDefinition, constantAdjustmentDefinition as reverseChainConstantAdjustmentDefinition, fPrimeOverFDefinition, trigRecognitionDefinition, definiteRecognitionDefinition, explainNearMissDefinition, diagnoseCoefficientDefinition, multiStepRecognitionDefinition } from "./question-definitions/reverse-chain-rule-assessment.js?v=ao2math2";
import { trigIdentityIntegrationAssessmentQuestionDefinitions, rewriteOnlyDefinition as trigIntegrationRewriteDefinition, integrateRewrittenDefinition as trigIntegrationIntegrateDefinition, scaledDefiniteDefinition as trigIntegrationScaledDefinition, chooseMethodDefinition as trigIntegrationMethodDefinition, explainChoiceDefinition as trigIntegrationExplainDefinition, diagnoseRewriteDefinition as trigIntegrationDiagnoseDefinition, mixedApplicationDefinition as trigIntegrationApplicationDefinition } from "./question-definitions/trig-identity-integration-assessment.js";
import { substitutionAssessmentQuestionDefinitions, givenSubstitutionDefinition, chooseUDefinition as substitutionChooseUDefinition, changeLimitsDefinition as substitutionChangeLimitsDefinition, completeSubstitutionDefinition, diagnoseMixedVariableDefinition, compareRecognitionDefinition as substitutionCompareRecognitionDefinition, unfamiliarApplicationDefinition as substitutionApplicationDefinition } from "./question-definitions/substitution-assessment.js";
import { integrationByPartsAssessmentQuestionDefinitions, chooseAndCompleteDefinition as partsChooseCompleteDefinition, definiteBasicDefinition as partsDefiniteDefinition, hiddenOneDefinition as partsHiddenOneDefinition, repeatedDiDefinition as partsRepeatedDiDefinition, explainChoiceDefinition as partsExplainChoiceDefinition, deriveFormulaDefinition as partsDeriveFormulaDefinition, diagnoseErrorsDefinition as partsDiagnoseDefinition, unsignpostedDefinition as partsUnsignpostedDefinition, cyclicMixedDefinition as partsCyclicDefinition } from "./question-definitions/integration-by-parts-assessment.js";
import { partialFractionsAssessmentQuestionDefinitions, structureChoiceDefinition as partialFractionsStructureDefinition, distinctIntegrateDefinition as partialFractionsDistinctDefinition, repeatedIntegrateDefinition as partialFractionsRepeatedDefinition, logSimplifyDefinition as partialFractionsLogDefinition, explainStructureDefinition as partialFractionsExplainStructureDefinition, coefficientMethodDefinition as partialFractionsCoefficientMethodDefinition, constantAsLogDefinition as partialFractionsConstantLogDefinition, mixedRationalDefinition as partialFractionsMixedDefinition, improperMultistepDefinition as partialFractionsImproperDefinition } from "./question-definitions/partial-fractions-assessment.js";
import { implicitDifferentiationAssessmentQuestionDefinitions, classifyDefinition as implicitClassifyDefinition, yTermDefinition as implicitYTermDefinition, fullMethodDefinition as implicitFullMethodDefinition, rearrangeDefinition as implicitRearrangeDefinition, explainDydxDefinition as implicitExplainDydxDefinition, explainBothSidesDefinition as implicitExplainBothSidesDefinition, diagnoseDefinition as implicitDiagnoseDefinition, applicationDefinition as implicitApplicationDefinition } from "./question-definitions/implicit-differentiation-assessment.js?v=interactions4";
import { year13AreasAssessmentQuestionDefinitions, routineBetweenCurvesDefinition, splitRegionsDefinition, advancedTechniqueDefinition, explainSplitsDefinition, compareMethodsDefinition, signedVsGeometricDefinition, unfamiliarDiagramDefinition } from "./question-definitions/year13-areas-assessment.js?v=interactions2";
import { parametricAreaAssessmentQuestionDefinitions, parametricAreaFormulaDefinition, parametricAreaLimitsDefinition, parametricAreaDirectionDefinition, explainParametricAreaDefinition, diagnoseParametricDirectionDefinition, parametricBoundedRegionDefinition, parametricMixedTechniqueDefinition } from "./question-definitions/parametric-area-assessment.js?v=interactions3";
import { limitOfSumAssessmentQuestionDefinitions, recogniseIntegralDefinition as limitSumRecogniseDefinition, kNotationDefinition as limitSumKNotationDefinition, recogniseEvaluateDefinition as limitSumEvaluateDefinition, explainRectanglesDefinition as limitSumExplainDefinition, mapComponentsDefinition as limitSumMapDefinition, mixedTechniqueDefinition as limitSumMixedDefinition } from "./question-definitions/limit-of-sum-assessment.js?v=ao1math4";
import { trapeziumIntegrationAssessmentQuestionDefinitions, coefficientsDefinition as trapCoefficientsDefinition, estimateDefinition as trapEstimateDefinition, percentageErrorDefinition as trapErrorDefinition, justifyBoundDefinition as trapBoundDefinition, mixedConcavityDefinition as trapMixedConcavityDefinition, chooseContextDefinition as trapContextDefinition, tableContextDefinition as trapTableDefinition } from "./question-definitions/trapezium-integration-assessment.js?v=interactions3";
import { differentialEquationsAssessmentQuestionDefinitions, constructRateDefinition as deConstructRateDefinition, initialConditionDefinition as deInitialConditionDefinition, longTermDefinition as deLongTermDefinition, diagnoseSeparationDefinition as deDiagnoseSeparationDefinition, limitationDefinition as deLimitationDefinition, diagnoseConditionDefinition as deDiagnoseConditionDefinition, unfamiliarModelDefinition as deUnfamiliarModelDefinition } from "./question-definitions/differential-equations-assessment.js?v=interactions4";
import { calculusModellingAssessmentQuestionDefinitions, specifiedStepDefinition as modellingSpecifiedStepDefinition, frameworkPracticeDefinition as modellingFrameworkDefinition, methodAppropriatenessDefinition as modellingMethodDefinition, exactVsNumericalDefinition as modellingExactNumericalDefinition, interpretCritiqueDefinition as modellingInterpretDefinition, topicBlindModelDefinition as modellingTopicBlindDefinition } from "./question-definitions/calculus-modelling-assessment.js";
const allDefinitions = Object.freeze([...powerRuleQuestionDefinitions, ...basicsAssessmentQuestionDefinitions, ...firstPrinciplesAssessmentQuestionDefinitions, ...tangentsNormalsAssessmentQuestionDefinitions, ...stationaryPointsAssessmentQuestionDefinitions, ...increasingDecreasingAssessmentQuestionDefinitions, ...integrationIntroAssessmentQuestionDefinitions, ...definiteIndefiniteAssessmentQuestionDefinitions, ...integrationAreaAssessmentQuestionDefinitions, ...signedAreaAssessmentQuestionDefinitions, ...year12ReviewAssessmentQuestionDefinitions, ...fullDifferentiationReviewAssessmentQuestionDefinitions, ...standardFunctionsAssessmentQuestionDefinitions, ...trigFirstPrinciplesAssessmentQuestionDefinitions, ...productQuotientChainAssessmentQuestionDefinitions, ...parametricDifferentiationAssessmentQuestionDefinitions, ...implicitDifferentiationAssessmentQuestionDefinitions, ...trigIdentitiesInverseAssessmentQuestionDefinitions, ...concavityInflectionAssessmentQuestionDefinitions, ...connectedRatesAssessmentQuestionDefinitions, ...standardIntegralsAssessmentQuestionDefinitions, ...reverseChainRuleAssessmentQuestionDefinitions, ...trigIdentityIntegrationAssessmentQuestionDefinitions, ...substitutionAssessmentQuestionDefinitions, ...integrationByPartsAssessmentQuestionDefinitions, ...partialFractionsAssessmentQuestionDefinitions, ...year13AreasAssessmentQuestionDefinitions, ...parametricAreaAssessmentQuestionDefinitions, ...limitOfSumAssessmentQuestionDefinitions, ...trapeziumIntegrationAssessmentQuestionDefinitions, ...differentialEquationsAssessmentQuestionDefinitions, ...calculusModellingAssessmentQuestionDefinitions]);
const questionDefinitionsByTemplateId = new Map(allDefinitions.map((definition) => [definition.templateId, definition]));
const requireExistingDefinition = (templateId) => {
  const definition = questionDefinitionsByTemplateId.get(templateId);
  if (!definition) throw new Error(`Missing existing QuestionDefinition ${templateId} for Step 75 mastery reuse.`);
  return definition;
};
const existingDefinitions = (...templateIds) => Object.freeze(templateIds.map(requireExistingDefinition));
const step75MethodOnlyDefinitions = existingDefinitions(
  'question-template:full:review:calculus-mastery:method-product-chain',
  'question-template:full:review:calculus-mastery:method-quotient-chain',
  'question-template:full:review:calculus-mastery:method-parametric',
  'question-template:full:review:calculus-mastery:method-implicit',
  'question-template:full:review:calculus-mastery:method-connected-rates',
  'question-template:full:review:calculus-mastery:method-second-derivative',
  'question-template:y13:integration:reverse-chain-rule:classify',
  'question-template:y13:integration:trig-identities:choose-method',
  'question-template:y13:integration:substitution:choose-u',
  'question-template:y13:integration:partial-fractions:structure-choice',
  'question-template:y13:integration:limit-of-sum:recognise',
  'question-template:y13:modelling:calculus:specified-step'
);
const step75MethodOrderDefinitions = existingDefinitions(
  'question-template:y13:differentiation:product-quotient-chain:rule-selection',
  'question-template:y13:differentiation:product-quotient-chain:multi-rule',
  'question-template:y13:integration:trig-identities:rewrite-only',
  'question-template:y13:integration:substitution:given-substitution',
  'question-template:y13:integration:by-parts:choose-complete',
  'question-template:y13:integration:partial-fractions:structure-choice',
  'question-template:y13:integration:areas:advanced',
  'question-template:y13:integration:parametric-area:limits',
  'question-template:y13:differential-equations:first-order:diagnose-separation',
  'question-template:y13:modelling:calculus:framework-practice'
);
const step75CompleteDefinitions = existingDefinitions(
  'question-template:y12:differentiation:basics:ao1:term-by-term-polynomial',
  'question-template:y12:differentiation:stationary-points:find-stationary',
  'question-template:y13:differentiation:product-quotient-chain:multi-rule',
  'question-template:y13:differentiation:parametric-differentiation:gradient',
  'question-template:y13:differentiation:implicit-differentiation:full-method',
  'question-template:y13:differentiation:connected-rates:chain',
  'question-template:y13:integration:standard-integrals:linear-form',
  'question-template:y13:integration:reverse-chain-rule:definite',
  'question-template:y13:integration:substitution:complete',
  'question-template:y13:integration:by-parts:definite-basic',
  'question-template:y13:integration:partial-fractions:distinct-integrate',
  'question-template:y13:integration:parametric-area:mixed',
  'question-template:y13:integration:numerical:estimate',
  'question-template:y13:differential-equations:first-order:initial-condition'
);
const step75ExplainDefinitions = existingDefinitions(
  'question-template:full:review:calculus-mastery:compare-approaches',
  'question-template:y13:integration:reverse-chain-rule:explain-near-miss',
  'question-template:y13:integration:trig-identities:explain-choice',
  'question-template:y13:integration:substitution:compare-recognition',
  'question-template:y13:integration:by-parts:explain-choice',
  'question-template:y13:integration:partial-fractions:explain-structure',
  'question-template:y13:integration:areas:explain-split',
  'question-template:y13:integration:parametric-area:explain',
  'question-template:y13:integration:limit-of-sum:explain',
  'question-template:y13:modelling:calculus:method-appropriateness',
  'question-template:y13:modelling:calculus:interpret-critique',
  'question-template:y13:differential-equations:first-order:model-limitation'
);
const step75DiagnoseOrderDefinitions = existingDefinitions(
  'question-template:y13:differentiation:product-quotient-chain:quotient-error',
  'question-template:y13:differentiation:product-quotient-chain:chain-error',
  'question-template:y13:integration:trig-identities:diagnose-rewrite',
  'question-template:y13:integration:substitution:diagnose-mixed',
  'question-template:y13:integration:by-parts:diagnose-errors',
  'question-template:y13:integration:parametric-area:diagnose',
  'question-template:y13:differential-equations:first-order:diagnose-condition'
);
const step75MixedMasteryDefinitions = Object.freeze([
  ...step75MethodOnlyDefinitions.slice(0,4),
  ...step75CompleteDefinitions.slice(0,6),
  ...step75ExplainDefinitions.slice(0,5),
  requireExistingDefinition('question-template:y12:differentiation:stationary-points:parameter'),
  requireExistingDefinition('question-template:y13:differentiation:connected-rates:application'),
  requireExistingDefinition('question-template:y13:integration:by-parts:unsignposted'),
  requireExistingDefinition('question-template:y13:integration:partial-fractions:improper-multistep'),
  requireExistingDefinition('question-template:y13:integration:areas:unfamiliar'),
  requireExistingDefinition('question-template:y13:differential-equations:first-order:unfamiliar-model'),
  requireExistingDefinition('question-template:y13:modelling:calculus:topic-blind')
]);

const questionSetsByActivityId = Object.freeze({
  "activity:full:review:full-calculus-mastery:ao1:method-only": Object.freeze({id:"question-set:full:review:full-calculus-mastery:ao1:method-only",label:"Method only",definitions:step75MethodOnlyDefinitions}),
  "activity:full:review:full-calculus-mastery:ao1:which-method-first": Object.freeze({id:"question-set:full:review:full-calculus-mastery:ao1:which-method-first",label:"Which method first?",definitions:step75MethodOrderDefinitions}),
  "activity:full:review:full-calculus-mastery:ao1:select-complete-check": Object.freeze({id:"question-set:full:review:full-calculus-mastery:ao1:select-complete-check",label:"Select, complete and check",definitions:step75CompleteDefinitions}),
  "activity:full:review:full-calculus-mastery:ao2:select-and-explain": Object.freeze({id:"question-set:full:review:full-calculus-mastery:ao2:select-and-explain",label:"Select and explain",definitions:step75ExplainDefinitions}),
  "activity:full:review:full-calculus-mastery:ao2:diagnose-order": Object.freeze({id:"question-set:full:review:full-calculus-mastery:ao2:diagnose-order",label:"Diagnose method order",definitions:step75DiagnoseOrderDefinitions}),
  "activity:full:review:full-calculus-mastery:ao3:mixed-mastery": Object.freeze({id:"question-set:full:review:full-calculus-mastery:ao3:mixed-mastery",label:"Full 9MA0 mixed mastery",definitions:step75MixedMasteryDefinitions}),
  "activity:y13:integration:limit-of-sum:ao1:recognise": Object.freeze({id:"question-set:y13:integration:limit-of-sum:ao1:recognise",label:"Recognise integrand and limits",definitions:Object.freeze([limitSumRecogniseDefinition])}),
  "activity:y13:integration:limit-of-sum:ao1:k-notation": Object.freeze({id:"question-set:y13:integration:limit-of-sum:ao1:k-notation",label:"Read k-notation",definitions:Object.freeze([limitSumKNotationDefinition])}),
  "activity:y13:integration:limit-of-sum:ao1:recognise-evaluate": Object.freeze({id:"question-set:y13:integration:limit-of-sum:ao1:recognise-evaluate",label:"Recognise then evaluate",definitions:Object.freeze([limitSumEvaluateDefinition])}),
  "activity:y13:integration:limit-of-sum:ao2:explain-rectangles": Object.freeze({id:"question-set:y13:integration:limit-of-sum:ao2:explain-rectangles",label:"Explain rectangle interpretation",definitions:Object.freeze([limitSumExplainDefinition])}),
  "activity:y13:integration:limit-of-sum:ao2:map-components": Object.freeze({id:"question-set:y13:integration:limit-of-sum:ao2:map-components",label:"Map sum components",definitions:Object.freeze([limitSumMapDefinition])}),
  "activity:y13:integration:limit-of-sum:ao3:mixed-technique": Object.freeze({id:"question-set:y13:integration:limit-of-sum:ao3:mixed-technique",label:"Recognise and choose technique",definitions:Object.freeze([limitSumMixedDefinition])}),
  "activity:y13:integration:numerical-integration:ao1:coefficients": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao1:coefficients",label:"Derive coefficient pattern",definitions:Object.freeze([trapCoefficientsDefinition])}),
  "activity:y13:integration:numerical-integration:ao1:estimate": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao1:estimate",label:"Calculate estimates",definitions:Object.freeze([trapEstimateDefinition])}),
  "activity:y13:integration:numerical-integration:ao1:percentage-error": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao1:percentage-error",label:"Percentage error",definitions:Object.freeze([trapErrorDefinition])}),
  "activity:y13:integration:numerical-integration:ao2:justify-bound": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao2:justify-bound",label:"Justify bounds",definitions:Object.freeze([trapBoundDefinition])}),
  "activity:y13:integration:numerical-integration:ao2:mixed-concavity": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao2:mixed-concavity",label:"Mixed concavity",definitions:Object.freeze([trapMixedConcavityDefinition])}),
  "activity:y13:integration:numerical-integration:ao2:choose-context": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao2:choose-context",label:"Choose numerical context",definitions:Object.freeze([trapContextDefinition])}),
  "activity:y13:integration:numerical-integration:ao3:table-context": Object.freeze({id:"question-set:y13:integration:numerical-integration:ao3:table-context",label:"Table-data problem",definitions:Object.freeze([trapTableDefinition])}),
  "activity:y13:integration:parametric-area:ao1:formula-and-strip": Object.freeze({id:"question-set:y13:integration:parametric-area:ao1:formula-and-strip",label:"Parametric area formula",definitions:Object.freeze([parametricAreaFormulaDefinition])}),
  "activity:y13:integration:parametric-area:ao1:convert-limits": Object.freeze({id:"question-set:y13:integration:parametric-area:ao1:convert-limits",label:"Convert parametric area limits",definitions:Object.freeze([parametricAreaLimitsDefinition])}),
  "activity:y13:integration:parametric-area:ao1:direction-and-area": Object.freeze({id:"question-set:y13:integration:parametric-area:ao1:direction-and-area",label:"Direction and geometrical area",definitions:Object.freeze([parametricAreaDirectionDefinition])}),
  "activity:y13:integration:parametric-area:ao2:explain-direction": Object.freeze({id:"question-set:y13:integration:parametric-area:ao2:explain-direction",label:"Explain parametric area direction",definitions:Object.freeze([explainParametricAreaDefinition])}),
  "activity:y13:integration:parametric-area:ao2:diagnose-direction": Object.freeze({id:"question-set:y13:integration:parametric-area:ao2:diagnose-direction",label:"Diagnose parametric area errors",definitions:Object.freeze([diagnoseParametricDirectionDefinition])}),
  "activity:y13:integration:parametric-area:ao3:bounded-regions": Object.freeze({id:"question-set:y13:integration:parametric-area:ao3:bounded-regions",label:"Bounded parametric regions",definitions:Object.freeze([parametricBoundedRegionDefinition])}),
  "activity:y13:integration:parametric-area:ao3:mixed-technique": Object.freeze({id:"question-set:y13:integration:parametric-area:ao3:mixed-technique",label:"Parametric setup plus later technique",definitions:Object.freeze([parametricMixedTechniqueDefinition])}),
  "activity:y13:integration:standard-integrals:ao1:standard-array": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao1:standard-array",label:"Standard integral fluency",definitions:Object.freeze([standardIntegralDefinition])}),
  "activity:y13:integration:standard-integrals:ao1:linear-forms": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao1:linear-forms",label:"Linear-input standard integrals",definitions:Object.freeze([linearFormDefinition])}),
  "activity:y13:integration:standard-integrals:ao1:definite-standard": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao1:definite-standard",label:"Exact definite standard integrals",definitions:Object.freeze([definiteStandardDefinition])}),
  "activity:y13:integration:standard-integrals:ao1:recover-function": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao1:recover-function",label:"Recover a function",definitions:Object.freeze([recoverFunctionDefinition])}),
  "activity:y13:integration:standard-integrals:ao1:spot-error": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao1:spot-error",label:"Spot incorrect standard integrals",definitions:Object.freeze([spotErrorDefinition])}),
  "activity:y13:integration:standard-integrals:ao2:explain-and-check": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao2:explain-and-check",label:"Explain and check standard integrals",definitions:Object.freeze([explainCheckDefinition])}),
  "activity:y13:integration:standard-integrals:ao3:recover-and-evaluate": Object.freeze({id:"question-set:y13:integration:standard-integrals:ao3:recover-and-evaluate",label:"Recover and evaluate",definitions:Object.freeze([standardIntegralsApplicationDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao1:classify-only": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao1:classify-only",label:"Classify before integrating",definitions:Object.freeze([classifyRecognitionDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao1:constant-adjustment": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao1:constant-adjustment",label:"Constant adjustment",definitions:Object.freeze([reverseChainConstantAdjustmentDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao1:f-prime-over-f": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao1:f-prime-over-f",label:"f prime over f",definitions:Object.freeze([fPrimeOverFDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao1:trig-recognition": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao1:trig-recognition",label:"Trig recognition",definitions:Object.freeze([trigRecognitionDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao1:definite-recognition": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao1:definite-recognition",label:"Definite recognition",definitions:Object.freeze([definiteRecognitionDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao2:explain-near-misses": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao2:explain-near-misses",label:"Explain near-misses",definitions:Object.freeze([explainNearMissDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao2:diagnose-coefficients": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao2:diagnose-coefficients",label:"Diagnose coefficient errors",definitions:Object.freeze([diagnoseCoefficientDefinition])}),
  "activity:y13:integration:reverse-chain-rule:ao3:multi-step-recognition": Object.freeze({id:"question-set:y13:integration:reverse-chain-rule:ao3:multi-step-recognition",label:"Multi-step recognition",definitions:Object.freeze([multiStepRecognitionDefinition])}),
  "activity:y13:integration:trig-identities:ao1:rewrite-only": Object.freeze({id:"question-set:y13:integration:trig-identities:ao1:rewrite-only",label:"Rewrite trig integrands",definitions:Object.freeze([trigIntegrationRewriteDefinition])}),
  "activity:y13:integration:trig-identities:ao1:integrate-rewritten": Object.freeze({id:"question-set:y13:integration:trig-identities:ao1:integrate-rewritten",label:"Integrate rewritten trig forms",definitions:Object.freeze([trigIntegrationIntegrateDefinition])}),
  "activity:y13:integration:trig-identities:ao1:scaled-and-definite": Object.freeze({id:"question-set:y13:integration:trig-identities:ao1:scaled-and-definite",label:"Scaled and definite trig integration",definitions:Object.freeze([trigIntegrationScaledDefinition])}),
  "activity:y13:integration:trig-identities:ao1:choose-method": Object.freeze({id:"question-set:y13:integration:trig-identities:ao1:choose-method",label:"Choose the integration route",definitions:Object.freeze([trigIntegrationMethodDefinition])}),
  "activity:y13:integration:trig-identities:ao2:explain-choice": Object.freeze({id:"question-set:y13:integration:trig-identities:ao2:explain-choice",label:"Explain the identity choice",definitions:Object.freeze([trigIntegrationExplainDefinition])}),
  "activity:y13:integration:trig-identities:ao2:diagnose-rewrite": Object.freeze({id:"question-set:y13:integration:trig-identities:ao2:diagnose-rewrite",label:"Diagnose trig rewrite errors",definitions:Object.freeze([trigIntegrationDiagnoseDefinition])}),
  "activity:y13:integration:trig-identities:ao3:mixed-application": Object.freeze({id:"question-set:y13:integration:trig-identities:ao3:mixed-application",label:"Unsignposted trig-identity applications",definitions:Object.freeze([trigIntegrationApplicationDefinition])}),
  "activity:y13:integration:substitution:ao1:given-substitution": Object.freeze({id:"question-set:y13:integration:substitution:ao1:given-substitution",label:"Given substitutions",definitions:Object.freeze([givenSubstitutionDefinition])}),
  "activity:y13:integration:substitution:ao1:choose-u": Object.freeze({id:"question-set:y13:integration:substitution:ao1:choose-u",label:"Choose u",definitions:Object.freeze([substitutionChooseUDefinition])}),
  "activity:y13:integration:substitution:ao1:change-limits": Object.freeze({id:"question-set:y13:integration:substitution:ao1:change-limits",label:"Change definite limits",definitions:Object.freeze([substitutionChangeLimitsDefinition])}),
  "activity:y13:integration:substitution:ao1:complete-substitution": Object.freeze({id:"question-set:y13:integration:substitution:ao1:complete-substitution",label:"Complete substitutions",definitions:Object.freeze([completeSubstitutionDefinition])}),
  "activity:y13:integration:substitution:ao2:diagnose-errors": Object.freeze({id:"question-set:y13:integration:substitution:ao2:diagnose-errors",label:"Diagnose substitution errors",definitions:Object.freeze([diagnoseMixedVariableDefinition])}),
  "activity:y13:integration:substitution:ao2:compare-recognition": Object.freeze({id:"question-set:y13:integration:substitution:ao2:compare-recognition",label:"Compare recognition and substitution",definitions:Object.freeze([substitutionCompareRecognitionDefinition])}),
  "activity:y13:integration:substitution:ao3:unfamiliar-applications": Object.freeze({id:"question-set:y13:integration:substitution:ao3:unfamiliar-applications",label:"Unfamiliar substitution applications",definitions:Object.freeze([substitutionApplicationDefinition])}),
  "activity:y13:integration:by-parts:ao1:choose-and-complete": Object.freeze({id:"question-set:y13:integration:by-parts:ao1:choose-and-complete",label:"Choose and complete parts",definitions:Object.freeze([partsChooseCompleteDefinition])}),
  "activity:y13:integration:by-parts:ao1:definite-basic": Object.freeze({id:"question-set:y13:integration:by-parts:ao1:definite-basic",label:"Definite parts",definitions:Object.freeze([partsDefiniteDefinition])}),
  "activity:y13:integration:by-parts:ao1:hidden-one": Object.freeze({id:"question-set:y13:integration:by-parts:ao1:hidden-one",label:"Hidden-one parts",definitions:Object.freeze([partsHiddenOneDefinition])}),
  "activity:y13:integration:by-parts:ao1:repeated-di": Object.freeze({id:"question-set:y13:integration:by-parts:ao1:repeated-di",label:"Repeated parts and DI",definitions:Object.freeze([partsRepeatedDiDefinition])}),
  "activity:y13:integration:by-parts:ao2:explain-choice": Object.freeze({id:"question-set:y13:integration:by-parts:ao2:explain-choice",label:"Explain parts choices",definitions:Object.freeze([partsExplainChoiceDefinition])}),
  "activity:y13:integration:by-parts:ao2:derive-from-product": Object.freeze({id:"question-set:y13:integration:by-parts:ao2:derive-from-product",label:"Derive parts from product rule",definitions:Object.freeze([partsDeriveFormulaDefinition])}),
  "activity:y13:integration:by-parts:ao2:diagnose-errors": Object.freeze({id:"question-set:y13:integration:by-parts:ao2:diagnose-errors",label:"Diagnose parts errors",definitions:Object.freeze([partsDiagnoseDefinition])}),
  "activity:y13:integration:by-parts:ao3:unsignposted": Object.freeze({id:"question-set:y13:integration:by-parts:ao3:unsignposted",label:"Unsignposted parts",definitions:Object.freeze([partsUnsignpostedDefinition])}),
  "activity:y13:integration:by-parts:ao3:cyclic-mixed": Object.freeze({id:"question-set:y13:integration:by-parts:ao3:cyclic-mixed",label:"Cyclic and repeated parts",definitions:Object.freeze([partsCyclicDefinition])}),

  "activity:y13:integration:partial-fractions:ao1:structure-choice": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao1:structure-choice",label:"Choose decomposition structure",definitions:Object.freeze([partialFractionsStructureDefinition])}),
  "activity:y13:integration:partial-fractions:ao1:distinct-integrate": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao1:distinct-integrate",label:"Distinct-factor integration",definitions:Object.freeze([partialFractionsDistinctDefinition])}),
  "activity:y13:integration:partial-fractions:ao1:repeated-integrate": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao1:repeated-integrate",label:"Repeated-factor integration",definitions:Object.freeze([partialFractionsRepeatedDefinition])}),
  "activity:y13:integration:partial-fractions:ao1:log-simplify": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao1:log-simplify",label:"Logarithm simplification",definitions:Object.freeze([partialFractionsLogDefinition])}),
  "activity:y13:integration:partial-fractions:ao2:explain-structure": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao2:explain-structure",label:"Explain repeated-factor structure",definitions:Object.freeze([partialFractionsExplainStructureDefinition])}),
  "activity:y13:integration:partial-fractions:ao2:coefficient-method": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao2:coefficient-method",label:"Choose coefficient method",definitions:Object.freeze([partialFractionsCoefficientMethodDefinition])}),
  "activity:y13:integration:partial-fractions:ao2:constant-log": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao2:constant-log",label:"Explain constant inside one log",definitions:Object.freeze([partialFractionsConstantLogDefinition])}),
  "activity:y13:integration:partial-fractions:ao3:mixed-rational": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao3:mixed-rational",label:"Unsignposted rational integrals",definitions:Object.freeze([partialFractionsMixedDefinition])}),
  "activity:y13:integration:partial-fractions:ao3:improper-multistep": Object.freeze({id:"question-set:y13:integration:partial-fractions:ao3:improper-multistep",label:"Improper rational multi-step",definitions:Object.freeze([partialFractionsImproperDefinition])}),

  "activity:y13:integration:areas:ao1:routine-between-curves": Object.freeze({id:"question-set:y13:integration:areas:ao1:routine",label:"Routine between-curves areas",definitions:Object.freeze([routineBetweenCurvesDefinition])}),
  "activity:y13:integration:areas:ao1:split-regions": Object.freeze({id:"question-set:y13:integration:areas:ao1:split",label:"Split regions",definitions:Object.freeze([splitRegionsDefinition])}),
  "activity:y13:integration:areas:ao1:advanced-techniques": Object.freeze({id:"question-set:y13:integration:areas:ao1:advanced",label:"Advanced area techniques",definitions:Object.freeze([advancedTechniqueDefinition])}),
  "activity:y13:integration:areas:ao2:explain-splits": Object.freeze({id:"question-set:y13:integration:areas:ao2:splits",label:"Explain area splits",definitions:Object.freeze([explainSplitsDefinition])}),
  "activity:y13:integration:areas:ao2:compare-methods": Object.freeze({id:"question-set:y13:integration:areas:ao2:compare",label:"Compare geometry and calculus",definitions:Object.freeze([compareMethodsDefinition])}),
  "activity:y13:integration:areas:ao2:signed-vs-geometric": Object.freeze({id:"question-set:y13:integration:areas:ao2:signed",label:"Signed versus geometrical area",definitions:Object.freeze([signedVsGeometricDefinition])}),
  "activity:y13:integration:areas:ao3:unfamiliar-diagrams": Object.freeze({id:"question-set:y13:integration:areas:ao3:unfamiliar",label:"Unfamiliar area diagrams",definitions:Object.freeze([unfamiliarDiagramDefinition])}),  "activity:y13:differentiation:connected-rates:ao1:geometry-rates": Object.freeze({id:"question-set:y13:differentiation:connected-rates:ao1:geometry-rates",label:"Circle and sphere rates",definitions:Object.freeze([connectedRatesGeometryDefinition])}),
  "activity:y13:differentiation:connected-rates:ao1:rate-chain": Object.freeze({id:"question-set:y13:differentiation:connected-rates:ao1:rate-chain",label:"Build and orient rate chains",definitions:Object.freeze([connectedRatesChainDefinition])}),
  "activity:y13:differentiation:connected-rates:ao1:signs-units": Object.freeze({id:"question-set:y13:differentiation:connected-rates:ao1:signs-units",label:"Signs and units",definitions:Object.freeze([connectedRatesSignUnitsDefinition])}),
  "activity:y13:differentiation:connected-rates:ao2:explain-chain": Object.freeze({id:"question-set:y13:differentiation:connected-rates:ao2:explain-chain",label:"Explain connected rates",definitions:Object.freeze([connectedRatesExplainDefinition])}),
  "activity:y13:differentiation:connected-rates:ao2:diagnose-orientation": Object.freeze({id:"question-set:y13:differentiation:connected-rates:ao2:diagnose-orientation",label:"Diagnose derivative orientation",definitions:Object.freeze([connectedRatesDiagnoseDefinition])}),
  "activity:y13:differentiation:connected-rates:ao3:modelling": Object.freeze({id:"question-set:y13:differentiation:connected-rates:ao3:modelling",label:"Connected-rate modelling",definitions:Object.freeze([connectedRatesApplicationDefinition])}),
  "activity:y13:differentiation:concavity-inflection:ao1:interpret-fpp": Object.freeze({id:"question-set:y13:differentiation:concavity-inflection:ao1:interpret-fpp",label:"Interpret f double-prime",definitions:Object.freeze([concavityInterpretDefinition])}),
  "activity:y13:differentiation:concavity-inflection:ao1:intervals": Object.freeze({id:"question-set:y13:differentiation:concavity-inflection:ao1:intervals",label:"Concave and convex intervals",definitions:Object.freeze([concavityIntervalsDefinition])}),
  "activity:y13:differentiation:concavity-inflection:ao1:inflection-points": Object.freeze({id:"question-set:y13:differentiation:concavity-inflection:ao1:inflection-points",label:"Inflection points",definitions:Object.freeze([concavityInflectionDefinition,concavityTypeDefinition])}),
  "activity:y13:differentiation:concavity-inflection:ao2:explain-shape": Object.freeze({id:"question-set:y13:differentiation:concavity-inflection:ao2:explain-shape",label:"Explain curve shape",definitions:Object.freeze([concavityExplainDefinition])}),
  "activity:y13:differentiation:concavity-inflection:ao2:diagnose-inflection": Object.freeze({id:"question-set:y13:differentiation:concavity-inflection:ao2:diagnose-inflection",label:"Diagnose inflection claims",definitions:Object.freeze([concavityDiagnoseDefinition])}),
  "activity:y13:differentiation:concavity-inflection:ao3:curve-sketching": Object.freeze({id:"question-set:y13:differentiation:concavity-inflection:ao3:curve-sketching",label:"Concavity and inflection applications",definitions:Object.freeze([concavityApplicationDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao1:classify-notation": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao1:classify-notation",label:"Inverse or reciprocal",definitions:Object.freeze([trigInverseNotationDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao1:further-trig": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao1:further-trig",label:"Further trig derivatives",definitions:Object.freeze([trigInverseFurtherTrigDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao1:inverse-relationship": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao1:inverse-relationship",label:"Inverse derivative relationship",definitions:Object.freeze([trigInverseRelationshipDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao1:inverse-trig": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao1:inverse-trig",label:"Inverse trig derivatives",definitions:Object.freeze([trigInverseDerivativeDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao1:mixed": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao1:mixed",label:"Mixed trig differentiation",definitions:Object.freeze([trigInverseMixedDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao2:explain-notation": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao2:explain-notation",label:"Explain inverse notation",definitions:Object.freeze([trigInverseExplainNotationDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao2:explain-identity": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao2:explain-identity",label:"Explain trig identity",definitions:Object.freeze([trigInverseExplainIdentityDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao2:diagnose-chain": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao2:diagnose-chain",label:"Diagnose chain factor",definitions:Object.freeze([trigInverseDiagnoseChainDefinition])}),
  "activity:y13:differentiation:trig-identities-inverse:ao3:applications": Object.freeze({id:"question-set:y13:differentiation:trig-identities-inverse:ao3:applications",label:"Trig and inverse trig applications",definitions:Object.freeze([trigInverseApplicationDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao1:classify": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao1:classify",label:"Classify explicit/implicit",definitions:Object.freeze([implicitClassifyDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao1:differentiate-y-terms": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao1:differentiate-y-terms",label:"Differentiate y-terms",definitions:Object.freeze([implicitYTermDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao1:full-method": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao1:full-method",label:"Implicit differentiation",definitions:Object.freeze([implicitFullMethodDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao1:rearrange": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao1:rearrange",label:"Rearrange for dy/dx",definitions:Object.freeze([implicitRearrangeDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao2:explain-dydx": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao2:explain-dydx",label:"Explain dy/dx",definitions:Object.freeze([implicitExplainDydxDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao2:explain-both-sides": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao2:explain-both-sides",label:"Explain d/dx both sides",definitions:Object.freeze([implicitExplainBothSidesDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao2:diagnose-errors": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao2:diagnose-errors",label:"Diagnose implicit errors",definitions:Object.freeze([implicitDiagnoseDefinition])}),
  "activity:y13:differentiation:implicit-differentiation:ao3:applications": Object.freeze({id:"question-set:y13:differentiation:implicit-differentiation:ao3:applications",label:"Implicit applications",definitions:Object.freeze([implicitApplicationDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao1:coordinates": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao1:coordinates",label:"Coordinates from t",definitions:Object.freeze([parametricCoordinateDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao1:domain-range": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao1:domain-range",label:"Domain and range",definitions:Object.freeze([parametricRangeDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao1:eliminate-parameter": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao1:eliminate-parameter",label:"Eliminate the parameter",definitions:Object.freeze([parametricEliminationDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao1:differentiate": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao1:differentiate",label:"Parametric differentiation",definitions:Object.freeze([parametricGradientDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao1:tangent-normal": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao1:tangent-normal",label:"Tangent and normal",definitions:Object.freeze([parametricTangentDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao2:explain-parameter": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao2:explain-parameter",label:"Explain the parameter",definitions:Object.freeze([parametricParameterReasoningDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao2:explain-chain-rule": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao2:explain-chain-rule",label:"Explain the chain rule",definitions:Object.freeze([parametricChainReasoningDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao2:vertical-tangent-reasoning": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao2:vertical-tangent-reasoning",label:"Vertical tangent reasoning",definitions:Object.freeze([parametricVerticalTangentDefinition])}),
  "activity:y13:differentiation:parametric-differentiation:ao3:applications": Object.freeze({id:"question-set:y13:differentiation:parametric-differentiation:ao3:applications",label:"Parametric applications",definitions:Object.freeze([parametricApplicationDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao1:product-rule": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao1:product-rule",label:"Product rule",definitions:Object.freeze([productRuleDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao1:quotient-rule": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao1:quotient-rule",label:"Quotient rule",definitions:Object.freeze([quotientRuleDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao1:chain-rule": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao1:chain-rule",label:"Chain rule",definitions:Object.freeze([chainRuleDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao1:mixed-one-rule": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao1:mixed-one-rule",label:"Mixed one-rule questions",definitions:Object.freeze([productRuleDefinition,quotientRuleDefinition,chainRuleDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao1:mixed-multi-rule": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao1:mixed-multi-rule",label:"Mixed multi-rule questions",definitions:Object.freeze([productQuotientChainMultiRuleDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao2:explain-rule-choice": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao2:explain-rule-choice",label:"Explain rule choice",definitions:Object.freeze([productQuotientChainRuleSelectionDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao2:diagnose-quotient-order": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao2:diagnose-quotient-order",label:"Diagnose quotient order",definitions:Object.freeze([quotientErrorDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao2:diagnose-chain-factor": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao2:diagnose-chain-factor",label:"Diagnose chain factor",definitions:Object.freeze([chainErrorDefinition])}),
  "activity:y13:differentiation:product-quotient-chain:ao3:applications": Object.freeze({id:"question-set:y13:differentiation:product-quotient-chain:ao3:applications",label:"Product/quotient/chain applications",definitions:Object.freeze([productQuotientChainApplicationDefinition])}),
  "activity:y13:differentiation:trig-first-principles:ao1:limits-and-identities": Object.freeze({id:"question-set:y13:differentiation:trig-first-principles:ao1:limits-and-identities",label:"Limits and identities",definitions:Object.freeze([limitsIdentityDefinition])}),
  "activity:y13:differentiation:trig-first-principles:ao1:complete-derivations": Object.freeze({id:"question-set:y13:differentiation:trig-first-principles:ao1:complete-derivations",label:"Complete trig derivations",definitions:Object.freeze([completeDerivationDefinition])}),
  "activity:y13:differentiation:trig-first-principles:ao2:why-radians-and-limits": Object.freeze({id:"question-set:y13:differentiation:trig-first-principles:ao2:why-radians-and-limits",label:"Explain radians and limits",definitions:Object.freeze([whyRadiansDefinition,locateLimitDefinition])}),
  "activity:y13:differentiation:trig-first-principles:ao2:proof-graph-connection": Object.freeze({id:"question-set:y13:differentiation:trig-first-principles:ao2:proof-graph-connection",label:"Proof and gradient graphs",definitions:Object.freeze([graphConnectionDefinition])}),
  "activity:y13:differentiation:trig-first-principles:ao3:reconstruct-and-apply": Object.freeze({id:"question-set:y13:differentiation:trig-first-principles:ao3:reconstruct-and-apply",label:"Reconstruct and apply",definitions:Object.freeze([reconstructApplyDefinition])}),
  "activity:y13:differentiation:standard-functions:ao1:standard-rules": Object.freeze({id:"question-set:y13:differentiation:standard-functions:ao1:standard-rules",label:"Standard derivatives",definitions:Object.freeze([standardRuleDefinition])}),
  "activity:y13:differentiation:standard-functions:ao1:scaled-rules": Object.freeze({id:"question-set:y13:differentiation:standard-functions:ao1:scaled-rules",label:"Scaled standard derivatives",definitions:Object.freeze([scaledRuleDefinition])}),
  "activity:y13:differentiation:standard-functions:ao1:mixed-standard-functions": Object.freeze({id:"question-set:y13:differentiation:standard-functions:ao1:mixed-standard-functions",label:"Mixed standard functions",definitions:Object.freeze([standardRuleDefinition,scaledRuleDefinition,standardFunctionsMixedRoutineDefinition])}),
  "activity:y13:differentiation:standard-functions:ao2:explain-graphs": Object.freeze({id:"question-set:y13:differentiation:standard-functions:ao2:explain-graphs",label:"Explain standard-function graphs",definitions:Object.freeze([explainScaleDefinition])}),
  "activity:y13:differentiation:standard-functions:ao2:diagnose-scale-sign": Object.freeze({id:"question-set:y13:differentiation:standard-functions:ao2:diagnose-scale-sign",label:"Diagnose sign and scale errors",definitions:Object.freeze([standardFunctionsDiagnoseDefinition])}),
  "activity:y13:differentiation:standard-functions:ao3:tangent-stationary-applications": Object.freeze({id:"question-set:y13:differentiation:standard-functions:ao3:tangent-stationary-applications",label:"Standard-function applications",definitions:Object.freeze([standardFunctionsApplicationDefinition,standardFunctionsStationaryApplicationDefinition])}),
  "activity:y12:integration:signed-area:ao1:signed-contributions": Object.freeze({id:"question-set:y12:integration:signed-area:ao1:signed-contributions",label:"Signed contributions",definitions:Object.freeze([signedContributionDefinition])}),
  "activity:y12:integration:signed-area:ao1:crossing-integral": Object.freeze({id:"question-set:y12:integration:signed-area:ao1:crossing-integral",label:"Integrals across the axis",definitions:Object.freeze([crossingIntegralDefinition])}),
  "activity:y12:integration:signed-area:ao1:split-and-area": Object.freeze({id:"question-set:y12:integration:signed-area:ao1:split-and-area",label:"Split and total area",definitions:Object.freeze([splitAtRootsDefinition,totalAreaDefinition])}),
  "activity:y12:integration:signed-area:ao2:explain-cancellation": Object.freeze({id:"question-set:y12:integration:signed-area:ao2:explain-cancellation",label:"Explain cancellation",definitions:Object.freeze([explainCancellationDefinition])}),
  "activity:y12:integration:signed-area:ao2:diagnose-splitting": Object.freeze({id:"question-set:y12:integration:signed-area:ao2:diagnose-splitting",label:"Diagnose splitting",definitions:Object.freeze([diagnoseSplittingDefinition])}),
  "activity:y12:integration:signed-area:ao3:signed-area-applications": Object.freeze({id:"question-set:y12:integration:signed-area:ao3:signed-area-applications",label:"Signed-area applications",definitions:Object.freeze([signedAreaApplicationDefinition])}),
  "activity:y12:integration:area:ao1:lower-zero-area": Object.freeze({id:"question-set:y12:integration:area:ao1:lower-zero-area",label:"Area from zero",definitions:Object.freeze([lowerZeroAreaDefinition])}),
  "activity:y12:integration:area:ao1:arbitrary-lower-area": Object.freeze({id:"question-set:y12:integration:area:ao1:arbitrary-lower-area",label:"Arbitrary lower limit",definitions:Object.freeze([arbitraryLowerAreaDefinition,endpointDifferenceDefinition])}),
  "activity:y12:integration:area:ao1:visual-properties": Object.freeze({id:"question-set:y12:integration:area:ao1:visual-properties",label:"Visual limit properties",definitions:Object.freeze([identicalLimitsDefinition,adjacentIntervalsDefinition,reversedLimitsDefinition])}),
  "activity:y12:integration:area:ao2:explain-lower-limit": Object.freeze({id:"question-set:y12:integration:area:ao2:explain-lower-limit",label:"Explain the lower limit",definitions:Object.freeze([explainLowerLimitDefinition])}),
  "activity:y12:integration:area:ao2:diagnose-area-reasoning": Object.freeze({id:"question-set:y12:integration:area:ao2:diagnose-area-reasoning",label:"Diagnose area reasoning",definitions:Object.freeze([diagnoseAreaReasoningDefinition])}),
  "activity:y12:integration:area:ao3:simple-area-applications": Object.freeze({id:"question-set:y12:integration:area:ao3:simple-area-applications",label:"Simple area applications",definitions:Object.freeze([areaApplicationDefinition])}),
  "activity:y12:integration:definite-indefinite:ao1:classify-integrals": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao1:classify-integrals",label:"Classify definite and indefinite",definitions:Object.freeze([classifyIntegralDefinition])}),
  "activity:y12:integration:definite-indefinite:ao1:evaluate-definite": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao1:evaluate-definite",label:"Evaluate definite integrals",definitions:Object.freeze([evaluateDefiniteDefinition])}),
  "activity:y12:integration:definite-indefinite:ao1:cancel-c": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao1:cancel-c",label:"Cancel the constant",definitions:Object.freeze([cancelCDefinition])}),
  "activity:y12:integration:definite-indefinite:ao1:limit-properties": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao1:limit-properties",label:"Limit properties",definitions:Object.freeze([limitPropertiesDefinition])}),
  "activity:y12:integration:definite-indefinite:ao2:explain-workflow": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao2:explain-workflow",label:"Explain the workflow",definitions:Object.freeze([explainWorkflowDefinition])}),
  "activity:y12:integration:definite-indefinite:ao2:diagnose-notation": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao2:diagnose-notation",label:"Diagnose notation",definitions:Object.freeze([diagnoseNotationDefinition])}),
  "activity:y12:integration:definite-indefinite:ao3:simple-applications": Object.freeze({id:"question-set:y12:integration:definite-indefinite:ao3:simple-applications",label:"Simple definite-integral applications",definitions:Object.freeze([definiteApplicationDefinition])}),
  "activity:y12:integration:introduction:ao1:reverse-differentiate": Object.freeze({id:"question-set:y12:integration:introduction:ao1:reverse-differentiate",label:"Reverse differentiation",definitions:Object.freeze([reverseDifferentiateDefinition])}),
  "activity:y12:integration:introduction:ao1:power-rule": Object.freeze({id:"question-set:y12:integration:introduction:ao1:power-rule",label:"Integration power rule",definitions:Object.freeze([powerRuleIntegrationDefinition])}),
  "activity:y12:integration:introduction:ao1:rewrite-and-integrate": Object.freeze({id:"question-set:y12:integration:introduction:ao1:rewrite-and-integrate",label:"Rewrite and integrate",definitions:Object.freeze([rewriteIntegrateDefinition])}),
  "activity:y12:integration:introduction:ao1:term-by-term": Object.freeze({id:"question-set:y12:integration:introduction:ao1:term-by-term",label:"Term-by-term integration",definitions:Object.freeze([termByTermIntegrationDefinition])}),
  "activity:y12:integration:introduction:ao2:why-plus-c": Object.freeze({id:"question-set:y12:integration:introduction:ao2:why-plus-c",label:"Why +C?",definitions:Object.freeze([whyPlusCDefinition])}),
  "activity:y12:integration:introduction:ao2:diagnose-errors": Object.freeze({id:"question-set:y12:integration:introduction:ao2:diagnose-errors",label:"Diagnose integration errors",definitions:Object.freeze([diagnoseIntegrationDefinition])}),
  "activity:y12:integration:introduction:ao3:simple-applications": Object.freeze({id:"question-set:y12:integration:introduction:ao3:simple-applications",label:"Simple integration applications",definitions:Object.freeze([integrationApplicationDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao1:visual-classification": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao1:visual-classification",label:"Visual classification",definitions:Object.freeze([visualClassificationDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao1:derivative-sign": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao1:derivative-sign",label:"Derivative sign",definitions:Object.freeze([derivativeSignDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao1:intervals-from-graph": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao1:intervals-from-graph",label:"Intervals from graphs",definitions:Object.freeze([intervalFromGraphDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao1:solve-inequalities": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao1:solve-inequalities",label:"Solve derivative inequalities",definitions:Object.freeze([solveInequalityDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao2:explain-signs": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao2:explain-signs",label:"Explain derivative signs",definitions:Object.freeze([explainSignsDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao2:stationary-boundaries": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao2:stationary-boundaries",label:"Stationary boundaries",definitions:Object.freeze([stationaryBoundaryDefinition])}),
  "activity:y12:differentiation:increasing-decreasing:ao3:applications": Object.freeze({id:"question-set:y12:differentiation:increasing-decreasing:ao3:applications",label:"Increasing/decreasing applications",definitions:Object.freeze([increasingDecreasingApplicationDefinition])}),

  "activity:y12:differentiation:basics:ao1:power-rule": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao1:power-rule",
    label: "Power-rule fluency",
    definitions: Object.freeze([powerRuleAlgebraicDefinition, powerRuleNumericDefinition, powerRuleChoiceDefinition])
  }),
  "activity:y12:differentiation:basics:ao1:rewrite-and-differentiate": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao1:rewrite-and-differentiate",
    label: "Rewrite then differentiate",
    definitions: Object.freeze([rewriteReciprocalDefinition, rewriteRootDefinition])
  }),
  "activity:y12:differentiation:basics:ao1:term-by-term": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao1:term-by-term",
    label: "Term-by-term differentiation",
    definitions: Object.freeze([termByTermDefinition])
  }),
  "activity:y12:differentiation:basics:ao1:graph-matching": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao1:graph-matching",
    label: "Function and derivative matching",
    definitions: Object.freeze([graphMatchingDefinition])
  }),
  "activity:y12:differentiation:basics:ao2:explain-gradient-function": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao2:explain-gradient-function",
    label: "Explain the gradient function",
    definitions: Object.freeze([explainGradientFunctionDefinition])
  }),
  "activity:y12:differentiation:basics:ao2:diagnose-power-rule": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao2:diagnose-power-rule",
    label: "Diagnose the power rule",
    definitions: Object.freeze([powerRuleReasoningDefinition])
  }),
  "activity:y12:differentiation:basics:ao2:error-correction": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao2:error-correction",
    label: "Error correction",
    definitions: Object.freeze([errorCorrectionDefinition])
  }),
  "activity:y12:differentiation:basics:ao2:unknown-coefficients": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao2:unknown-coefficients",
    label: "Unknown coefficients",
    definitions: Object.freeze([unknownCoefficientsDefinition])
  }),
  "activity:y12:differentiation:basics:ao3:simple-applications": Object.freeze({
    id: "question-set:y12:differentiation:basics:ao3:simple-applications",
    label: "Simple applications",
    definitions: Object.freeze([simpleApplicationRateDefinition, simpleApplicationInterpretDefinition])
  }),
  "activity:y12:differentiation:first-principles:ao1:building-blocks": Object.freeze({
    id: "question-set:y12:differentiation:first-principles:ao1:building-blocks",
    label: "First-principles building blocks",
    definitions: Object.freeze([simpleLimitDefinition, fxPlusHDefinition])
  }),
  "activity:y12:differentiation:first-principles:ao1:fading-practice": Object.freeze({
    id: "question-set:y12:differentiation:first-principles:ao1:fading-practice",
    label: "Fading first-principles practice",
    definitions: Object.freeze([x2FirstPrinciplesDefinition, x3FirstPrinciplesDefinition])
  }),
  "activity:y12:differentiation:first-principles:ao1:independent-proof": Object.freeze({
    id: "question-set:y12:differentiation:first-principles:ao1:independent-proof",
    label: "Independent first-principles proof",
    definitions: Object.freeze([x2FirstPrinciplesDefinition, x3FirstPrinciplesDefinition])
  }),
  "activity:y12:differentiation:first-principles:ao2:explain-chord-limit": Object.freeze({
    id: "question-set:y12:differentiation:first-principles:ao2:explain-chord-limit",
    label: "Explain chord and limit",
    definitions: Object.freeze([explainChordDefinition, explainHZeroDefinition])
  }),
  "activity:y12:differentiation:first-principles:ao2:diagnose-derivation": Object.freeze({
    id: "question-set:y12:differentiation:first-principles:ao2:diagnose-derivation",
    label: "Diagnose a first-principles derivation",
    definitions: Object.freeze([diagnoseDerivationDefinition])
  }),
  "activity:y12:differentiation:first-principles:ao3:select-and-apply": Object.freeze({
    id: "question-set:y12:differentiation:first-principles:ao3:select-and-apply",
    label: "Select and apply first principles",
    definitions: Object.freeze([chooseDifferenceQuotientDefinition, firstPrinciplesGradientApplicationDefinition])
  }),
  "activity:y12:differentiation:tangents-normals:ao1:tangent-gradient": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao1:tangent-gradient",label:"Tangent gradients",definitions:Object.freeze([tangentGradientDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao1:tangent-line": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao1:tangent-line",label:"Tangent equations",definitions:Object.freeze([tangentLineDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao1:normal-gradient": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao1:normal-gradient",label:"Normal gradients",definitions:Object.freeze([normalGradientDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao1:normal-line": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao1:normal-line",label:"Normal equations",definitions:Object.freeze([normalLineDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao2:explain-perpendicular": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao2:explain-perpendicular",label:"Explain perpendicular gradients",definitions:Object.freeze([explainPerpendicularDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao2:special-cases": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao2:special-cases",label:"Special cases",definitions:Object.freeze([specialCaseDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao2:diagnose-line": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao2:diagnose-line",label:"Diagnose line errors",definitions:Object.freeze([diagnoseLineDefinition])}),
  "activity:y12:differentiation:tangents-normals:ao3:applications": Object.freeze({id:"question-set:y12:differentiation:tangents-normals:ao3:applications",label:"Tangents and normals applications",definitions:Object.freeze([applicationDefinition])}),
  "activity:y12:differentiation:stationary-points:ao1:find-stationary": Object.freeze({id:"question-set:y12:differentiation:stationary-points:ao1:find-stationary",label:"Find stationary points",definitions:Object.freeze([findStationaryDefinition])}),
  "activity:y12:differentiation:stationary-points:ao1:sign-test": Object.freeze({id:"question-set:y12:differentiation:stationary-points:ao1:sign-test",label:"First-derivative sign tests",definitions:Object.freeze([signMaximumDefinition,signMinimumDefinition,signInflectionDefinition])}),
  "activity:y12:differentiation:stationary-points:ao1:second-derivative-test": Object.freeze({id:"question-set:y12:differentiation:stationary-points:ao1:second-derivative-test",label:"Second-derivative tests",definitions:Object.freeze([secondDerivativeDefinition])}),
  "activity:y12:differentiation:stationary-points:ao2:explain-tests": Object.freeze({id:"question-set:y12:differentiation:stationary-points:ao2:explain-tests",label:"Explain derivative tests",definitions:Object.freeze([explainSignTestDefinition])}),
  "activity:y12:differentiation:stationary-points:ao2:diagnose-classification": Object.freeze({id:"question-set:y12:differentiation:stationary-points:ao2:diagnose-classification",label:"Diagnose classification errors",definitions:Object.freeze([diagnoseClassificationDefinition])}),
  "activity:y12:differentiation:stationary-points:ao3:applications-parameters": Object.freeze({id:"question-set:y12:differentiation:stationary-points:ao3:applications-parameters",label:"Stationary-point applications and parameters",definitions:Object.freeze([parameterStationaryDefinition,applicationClassificationDefinition])}),

  "activity:y13:differential-equations:first-order:ao1:construct-rate-equations": Object.freeze({id:"question-set:y13:differential-equations:first-order:ao1:construct",label:"Construct rate equations",definitions:Object.freeze([deConstructRateDefinition])}),
  "activity:y13:differential-equations:first-order:ao1:solve-and-condition": Object.freeze({id:"question-set:y13:differential-equations:first-order:ao1:solve",label:"Solve and apply conditions",definitions:Object.freeze([deInitialConditionDefinition])}),
  "activity:y13:differential-equations:first-order:ao1:interpret-solutions": Object.freeze({id:"question-set:y13:differential-equations:first-order:ao1:interpret",label:"Interpret solutions",definitions:Object.freeze([deLongTermDefinition])}),
  "activity:y13:differential-equations:first-order:ao2:explain-and-diagnose": Object.freeze({id:"question-set:y13:differential-equations:first-order:ao2:diagnose",label:"Explain and diagnose",definitions:Object.freeze([deDiagnoseSeparationDefinition,deDiagnoseConditionDefinition])}),
  "activity:y13:differential-equations:first-order:ao2:assumptions-limitations": Object.freeze({id:"question-set:y13:differential-equations:first-order:ao2:limitations",label:"Assumptions and limitations",definitions:Object.freeze([deLimitationDefinition])}),
  "activity:y13:differential-equations:first-order:ao3:unfamiliar-modelling": Object.freeze({id:"question-set:y13:differential-equations:first-order:ao3:modelling",label:"Unfamiliar differential-equation modelling",definitions:Object.freeze([deUnfamiliarModelDefinition])}),
  "activity:y13:modelling:calculus:ao1:specified-step": Object.freeze({id:"question-set:y13:modelling:calculus:ao1:specified-step",label:"Specified calculus step in context",definitions:Object.freeze([modellingSpecifiedStepDefinition])}),
  "activity:y13:modelling:calculus:ao1:framework-practice": Object.freeze({id:"question-set:y13:modelling:calculus:ao1:framework",label:"Complete the modelling scaffold",definitions:Object.freeze([modellingFrameworkDefinition])}),
  "activity:y13:modelling:calculus:ao2:method-appropriateness": Object.freeze({id:"question-set:y13:modelling:calculus:ao2:method",label:"Explain method appropriateness",definitions:Object.freeze([modellingMethodDefinition])}),
  "activity:y13:modelling:calculus:ao2:exact-vs-numerical": Object.freeze({id:"question-set:y13:modelling:calculus:ao2:exact-numerical",label:"Exact versus numerical",definitions:Object.freeze([modellingExactNumericalDefinition])}),
  "activity:y13:modelling:calculus:ao2:interpret-critique": Object.freeze({id:"question-set:y13:modelling:calculus:ao2:interpret",label:"Interpret and critique",definitions:Object.freeze([modellingInterpretDefinition])}),
  "activity:y13:modelling:calculus:ao3:topic-blind-model": Object.freeze({id:"question-set:y13:modelling:calculus:ao3:topic-blind",label:"Topic-blind modelling challenge",definitions:Object.freeze([modellingTopicBlindDefinition])}),
  "activity:full:review:calculus-mastery:ao1:method-selection-only": Object.freeze({
    id:"question-set:full:review:calculus-mastery:ao1:method-selection-only", label:"Which method do I need?",
    definitions:Object.freeze([methodProductChainDefinition,methodQuotientChainDefinition,methodParametricDefinition,methodImplicitDefinition,methodInverseRelationDefinition,methodConnectedRatesDefinition,methodSecondDerivativeDefinition])
  }),
  "activity:full:review:calculus-mastery:ao1:topic-blind-fluency": Object.freeze({
    id:"question-set:full:review:calculus-mastery:ao1:topic-blind-fluency", label:"Topic-blind differentiation fluency",
    definitions:Object.freeze([termByTermDefinition,standardFunctionsMixedRoutineDefinition,productRuleDefinition,quotientRuleDefinition,chainRuleDefinition,productQuotientChainMultiRuleDefinition,parametricGradientDefinition,implicitFullMethodDefinition,trigInverseFurtherTrigDefinition,trigInverseDerivativeDefinition,concavityIntervalsDefinition,connectedRatesChainDefinition])
  }),
  "activity:full:review:calculus-mastery:ao2:justify-and-diagnose": Object.freeze({
    id:"question-set:full:review:calculus-mastery:ao2:justify-and-diagnose", label:"Explain, compare and diagnose",
    definitions:Object.freeze([compareApproachesDefinition,explainGradientFunctionDefinition,standardFunctionsDiagnoseDefinition,productQuotientChainRuleSelectionDefinition,quotientErrorDefinition,chainErrorDefinition,parametricChainReasoningDefinition,implicitExplainDydxDefinition,trigInverseExplainIdentityDefinition,trigInverseDiagnoseChainDefinition,concavityExplainDefinition,concavityDiagnoseDefinition,connectedRatesExplainDefinition,connectedRatesDiagnoseDefinition])
  }),
  "activity:full:review:calculus-mastery:ao3:mixed-applications": Object.freeze({
    id:"question-set:full:review:calculus-mastery:ao3:mixed-applications", label:"Mixed differentiation applications",
    definitions:Object.freeze([applicationDefinition,parameterStationaryDefinition,standardFunctionsApplicationDefinition,standardFunctionsStationaryApplicationDefinition,productQuotientChainApplicationDefinition,parametricApplicationDefinition,implicitApplicationDefinition,trigInverseApplicationDefinition,concavityApplicationDefinition,connectedRatesApplicationDefinition])
  }),
  "activity:full:review:calculus-mastery:ao3:diagnostic-mastery": Object.freeze({
    id:"question-set:full:review:calculus-mastery:ao3:diagnostic-mastery", label:"Diagnostic differentiation mastery",
    definitions:Object.freeze([methodProductChainDefinition,methodQuotientChainDefinition,methodParametricDefinition,methodImplicitDefinition,methodInverseRelationDefinition,methodConnectedRatesDefinition,methodSecondDerivativeDefinition,termByTermDefinition,standardFunctionsMixedRoutineDefinition,productQuotientChainMultiRuleDefinition,parametricGradientDefinition,implicitFullMethodDefinition,trigInverseDerivativeDefinition,concavityIntervalsDefinition,connectedRatesChainDefinition,compareApproachesDefinition,quotientErrorDefinition,chainErrorDefinition,parametricChainReasoningDefinition,implicitExplainDydxDefinition,concavityDiagnoseDefinition,connectedRatesDiagnoseDefinition,parameterStationaryDefinition,parametricApplicationDefinition,implicitApplicationDefinition,connectedRatesApplicationDefinition])
  }),
  "activity:y12:review:calculus-mastery:ao1:topic-blind-mixed": Object.freeze({
    id:"question-set:y12:review:calculus-mastery:ao1:topic-blind-mixed", label:"Topic-blind mixed AO1",
    definitions:Object.freeze([termByTermDefinition,x2FirstPrinciplesDefinition,tangentLineDefinition,normalLineDefinition,findStationaryDefinition,signInflectionDefinition,solveInequalityDefinition,termByTermIntegrationDefinition,evaluateDefiniteDefinition,lowerZeroAreaDefinition,splitAtRootsDefinition])
  }),
  "activity:y12:review:calculus-mastery:ao2:topic-blind-mixed": Object.freeze({
    id:"question-set:y12:review:calculus-mastery:ao2:topic-blind-mixed", label:"Topic-blind mixed AO2",
    definitions:Object.freeze([explainGradientFunctionDefinition,explainChordDefinition,explainSignTestDefinition,whyPlusCDefinition,explainWorkflowDefinition,explainCancellationDefinition,errorCorrectionDefinition,diagnoseSplittingDefinition])
  }),
  "activity:y12:review:calculus-mastery:ao3:topic-blind-mixed": Object.freeze({
    id:"question-set:y12:review:calculus-mastery:ao3:topic-blind-mixed", label:"Topic-blind mixed AO3",
    definitions:Object.freeze([applicationDefinition,parameterStationaryDefinition,increasingDecreasingApplicationDefinition,integrationApplicationDefinition,definiteApplicationDefinition,areaApplicationDefinition,signedAreaApplicationDefinition,simpleApplicationInterpretDefinition,reconstructFromDerivativeDefinition])
  }),
  "activity:y12:review:calculus-mastery:ao3:diagnostic-mastery": Object.freeze({
    id:"question-set:y12:review:calculus-mastery:ao3:diagnostic-mastery", label:"Diagnostic Year 12 mastery",
    definitions:Object.freeze([termByTermDefinition,x2FirstPrinciplesDefinition,tangentLineDefinition,signMinimumDefinition,solveInequalityDefinition,termByTermIntegrationDefinition,evaluateDefiniteDefinition,splitAtRootsDefinition,explainChordDefinition,explainSignTestDefinition,whyPlusCDefinition,explainCancellationDefinition,parameterStationaryDefinition,reconstructFromDerivativeDefinition,signedAreaApplicationDefinition])
  })
});

export function getQuestionDefinition(templateId) { return questionDefinitionsByTemplateId.get(templateId) ?? null; }
export function listQuestionDefinitions() { return [...questionDefinitionsByTemplateId.values()]; }
export function getQuestionSetDefinitionForActivity(activityId) { return questionSetsByActivityId[activityId] ?? null; }

export function getQuestionPracticeDefinitionForActivity(activityId) {
  const setDefinition = getQuestionSetDefinitionForActivity(activityId);
  if (!setDefinition) return null;

  const topics = new Set(setDefinition.definitions.map((definition) => definition.topicId));
  const assessmentObjectives = new Set(setDefinition.definitions.map((definition) => definition.assessmentObjective));
  let practiceDefinitions = setDefinition.definitions;

  if (topics.size === 1 && assessmentObjectives.size === 1) {
    const [topicId] = topics;
    const [assessmentObjective] = assessmentObjectives;
    const related = allDefinitions.filter((definition) =>
      definition.topicId === topicId && definition.assessmentObjective === assessmentObjective
    );
    const byTemplate = new Map();
    for (const definition of [...setDefinition.definitions, ...related]) {
      if (!byTemplate.has(definition.templateId)) byTemplate.set(definition.templateId, definition);
    }
    practiceDefinitions = Object.freeze([...byTemplate.values()]);
  }

  return Object.freeze({
    ...setDefinition,
    practiceDefinitions
  });
}

export function listQuestionSetDefinitions() { return Object.values(questionSetsByActivityId); }
