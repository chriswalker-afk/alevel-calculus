import { learningModeOrder, learningModes } from "./sample-activities.js";
import { getCourseScope } from "./scope-metadata.js";
import { getTopicProgress, progressModeOrder } from "./progress-model.js";
import { getHelpTarget, getHelpTargets } from "./help-content.js";
import { createDiagnosticRouter } from "./diagnostic-router.js";
import { createMasteryFeedbackModel } from "./mastery-feedback-model.js";
import { localStateStore, progressStore, vocabularyStore } from "./app-state.js";
import { APP_STATE_SCHEMA_VERSION } from "./local-state-store.js";
import { activityRouteFromId, createHistoryRouteController } from "./navigation-route.js";
import { renderVocabularyRichText } from "./vocabulary-term.js";
import { buildWordBankEntries, filterWordBankEntries } from "./word-bank-model.js";
import { createQuestionShell } from "./question-shell.js?v=ao2math1";
import { getQuestionPracticeDefinitionForActivity } from "./question-catalogue.js?v=ao2math1";
import { createGeneratorRunner, readQuestionDebugSeed } from "./generator-runner.js";
import { createQuestionPracticeSession } from "./question-practice-session.js?v=generatorpass1";
import { createMemoryLab } from "./memory-lab.js?v=hotfix3";
import { installMathRendering } from "./math-renderer.js?v=ao1math4";
import { getMemoryItemsForTopic } from "./memory-content.js?v=notation1";
import { getMemoryGamePackForTopic } from "./memory-game-content.js?v=notation1";
import { getMemoryReviewPackForTopic } from "./memory-review-content.js";
import { createClassWizSupportPanel } from "./classwiz-support-panel.js";
import { createBasicsUnderstandExperience } from "./basics-understand.js?v=understand2";
import { createPreCalculusUnderstandExperience } from "./pre-calculus-understand.js";
import { preCalculusLearningModes } from "./pre-calculus-activities.js";
import { createFirstPrinciplesUnderstandExperience } from "./first-principles-understand.js?v=understand2";
import { firstPrinciplesLearningModes } from "./first-principles-activities.js";
import { createTangentsNormalsUnderstandExperience } from "./tangents-normals-understand.js?v=understand2";
import { tangentsNormalsLearningModes } from "./tangents-normals-activities.js";
import { createStationaryPointsUnderstandExperience } from "./stationary-points-understand.js?v=understand2";
import { stationaryPointsLearningModes } from "./stationary-points-activities.js";
import { createIncreasingDecreasingUnderstandExperience } from "./increasing-decreasing-understand.js?v=understand2";
import { increasingDecreasingLearningModes } from "./increasing-decreasing-activities.js";
import { createIntegrationIntroUnderstandExperience } from "./integration-intro-understand.js?v=understand2";
import { integrationIntroLearningModes } from "./integration-intro-activities.js";
import { createDefiniteIndefiniteUnderstandExperience } from "./definite-indefinite-understand.js?v=understand2";
import { definiteIndefiniteLearningModes } from "./definite-indefinite-activities.js";
import { createIntegrationAreaUnderstandExperience } from "./integration-area-understand.js?v=understand2";
import { integrationAreaLearningModes } from "./integration-area-activities.js";
import { createSignedAreaUnderstandExperience } from "./signed-area-understand.js?v=understand2";
import { signedAreaLearningModes } from "./signed-area-activities.js";
import { year12ReviewLearningModes } from "./year12-review-activities.js";
import { getYear12ReviewMicroSkillLabel } from "./year12-review-model.js";
import { createStandardFunctionsUnderstandExperience } from "./standard-functions-understand.js?v=understand2";
import { standardFunctionsLearningModes } from "./standard-functions-activities.js";
import { createTrigFirstPrinciplesUnderstandExperience } from "./trig-first-principles-understand.js?v=understand2";
import { trigFirstPrinciplesLearningModes } from "./trig-first-principles-activities.js";
import { createProductQuotientChainUnderstandExperience } from "./product-quotient-chain-understand.js?v=understand2";
import { productQuotientChainLearningModes } from "./product-quotient-chain-activities.js";
import { createParametricDifferentiationUnderstandExperience } from "./parametric-differentiation-understand.js?v=understand2";
import { parametricDifferentiationLearningModes } from "./parametric-differentiation-activities.js";
import { createImplicitDifferentiationUnderstandExperience } from "./implicit-differentiation-understand.js?v=understand2";
import { implicitDifferentiationLearningModes } from "./implicit-differentiation-activities.js";
import { createTrigIdentitiesInverseUnderstandExperience } from "./trig-identities-inverse-understand.js?v=understand2";
import { trigIdentitiesInverseLearningModes } from "./trig-identities-inverse-activities.js";
import { createConcavityInflectionUnderstandExperience } from "./concavity-inflection-understand.js?v=understand2";
import { concavityInflectionLearningModes } from "./concavity-inflection-activities.js";
import { createConnectedRatesUnderstandExperience } from "./connected-rates-understand.js?v=understand2";
import { connectedRatesLearningModes } from "./connected-rates-activities.js";
import { fullDifferentiationReviewLearningModes } from "./full-differentiation-review-activities.js";
import { createStandardIntegralsUnderstandExperience } from "./standard-integrals-understand.js?v=understand2";
import { standardIntegralsLearningModes } from "./standard-integrals-activities.js";
import { createReverseChainRuleUnderstandExperience } from "./reverse-chain-rule-understand.js?v=understand2";
import { reverseChainRuleLearningModes } from "./reverse-chain-rule-activities.js";
import { createTrigIdentityIntegrationUnderstandExperience } from "./trig-identity-integration-understand.js?v=understand2";
import { trigIdentityIntegrationLearningModes } from "./trig-identity-integration-activities.js";
import { createSubstitutionUnderstandExperience } from "./substitution-understand.js?v=understand2";
import { substitutionLearningModes } from "./substitution-activities.js";
import { createIntegrationByPartsUnderstandExperience } from "./integration-by-parts-understand.js?v=understand2";
import { integrationByPartsLearningModes } from "./integration-by-parts-activities.js";
import { createPartialFractionsUnderstandExperience } from "./partial-fractions-understand.js?v=understand2";
import { partialFractionsLearningModes } from "./partial-fractions-activities.js";
import { createYear13AreasUnderstandExperience } from "./year13-areas-understand.js";
import { year13AreasLearningModes } from "./year13-areas-activities.js";
import { createParametricAreaUnderstandExperience } from "./parametric-area-understand.js?v=understand2";
import { parametricAreaLearningModes } from "./parametric-area-activities.js";
import { createLimitOfSumUnderstandExperience } from "./limit-of-sum-understand.js?v=understand2";
import { limitOfSumLearningModes } from "./limit-of-sum-activities.js";
import { createNumericalIntegrationUnderstandExperience } from "./trapezium-integration-understand.js";
import { numericalIntegrationLearningModes } from "./trapezium-integration-activities.js";
import { createDifferentialEquationsUnderstandExperience } from "./differential-equations-understand.js?v=understand2";
import { differentialEquationsLearningModes } from "./differential-equations-activities.js";
import { createCalculusModellingUnderstandExperience } from "./calculus-modelling-understand.js";
import { calculusModellingLearningModes } from "./calculus-modelling-activities.js";
import { fullCalculusMasteryLearningModes } from "./full-calculus-mastery-activities.js";
import { fullCalculusMasteryModel } from "./full-calculus-mastery-model.js";
import { getFullDifferentiationReviewMicroSkillLabel } from "./full-differentiation-review-model.js";
import { getTopicObjectiveConfig } from "./topic-objectives-data.js?v=objectives1";

const root = document.documentElement;
const shell = document.querySelector("[data-app-shell]");
const topbar = document.querySelector("[data-shell-topbar]");
const topicNavigation = document.querySelector("[data-topic-navigation]");
const topicNavigationToggle = document.querySelector("[data-topic-navigation-toggle]");
const topicNavigationClose = document.querySelector("[data-topic-navigation-close]");
const navigationScrim = document.querySelector("[data-navigation-scrim]");
const learningWorkspace = document.querySelector("[data-learning-workspace]");
const modePanel = document.querySelector("[data-mode-panel]");
const modeTabs = Array.from(document.querySelectorAll("[data-mode-tab]"));
const scopeBadges = Array.from(document.querySelectorAll("[data-scope-badge]"));
const topicProgressItems = Array.from(document.querySelectorAll("[data-topic-progress-item]"));
const currentTopicLabelElement = document.querySelector("[data-current-topic-label]");
const currentTopicBreadcrumb = document.querySelector("[data-current-topic-breadcrumb]");
const stage = document.querySelector("[data-activity-stage]");
const standardActivityContent = document.querySelector("[data-standard-activity-content]");
const activityVisual = document.querySelector("[data-activity-visual]");
const questionShellElement = document.querySelector("[data-question-shell]");
const year12MasterySummary = document.querySelector("[data-year12-mastery-summary]");
const year12MasteryEvidence = document.querySelector("[data-year12-mastery-summary-evidence]");
const year12MasteryEmpty = document.querySelector("[data-year12-mastery-summary-empty]");
const year12MasteryColumns = document.querySelector("[data-year12-mastery-summary-columns]");
const year12MasteryStrengths = document.querySelector("[data-year12-mastery-strengths]");
const year12MasteryWeaknesses = document.querySelector("[data-year12-mastery-weaknesses]");
const fullDifferentiationMasterySummary = document.querySelector("[data-full-differentiation-mastery-summary]");
const fullDifferentiationMasteryEvidence = document.querySelector("[data-full-differentiation-mastery-summary-evidence]");
const fullDifferentiationMasteryEmpty = document.querySelector("[data-full-differentiation-mastery-summary-empty]");
const fullDifferentiationMasteryColumns = document.querySelector("[data-full-differentiation-mastery-summary-columns]");
const fullDifferentiationMasteryStrengths = document.querySelector("[data-full-differentiation-mastery-strengths]");
const fullDifferentiationMasteryWeaknesses = document.querySelector("[data-full-differentiation-mastery-weaknesses]");
const memoryLabElement = document.querySelector("[data-memory-lab]");
const previousButton = document.querySelector("[data-previous-activity]");
const nextButton = document.querySelector("[data-next-activity]");
const footerPosition = document.querySelector("[data-footer-position]");
const classWizPanelElement = document.querySelector("[data-classwiz-panel]");
const classWizTrigger = document.querySelector("[data-classwiz-trigger]");
const classWizClose = document.querySelector("[data-classwiz-close]");
const classWizScrim = document.querySelector("[data-classwiz-scrim]");
const helpDrawer = document.querySelector("[data-help-drawer]");
const helpDrawerTrigger = document.querySelector("[data-help-drawer-trigger]");
const helpDrawerClose = document.querySelector("[data-help-drawer-close]");
const helpDrawerScrim = document.querySelector("[data-help-drawer-scrim]");
const helpContext = document.querySelector("[data-help-context]");
const helpTargetLinks = Array.from(document.querySelectorAll("[data-help-target]"));
const wordBankDrawer = document.querySelector("[data-word-bank-drawer]");
const topicGoalsTrigger = document.querySelector("[data-topic-goals-trigger]");
const topicGoalsDialog = document.querySelector("[data-topic-goals-dialog]");
const topicGoalsClose = document.querySelector("[data-topic-goals-close]");
const topicGoalsHeading = document.querySelector("[data-topic-goals-heading]");
const topicGoalsTopic = document.querySelector("[data-topic-goals-topic]");
const topicGoalsList = document.querySelector("[data-topic-goals-list]");
const topicGoalsFooter = document.querySelector("[data-topic-goals-footer]");
const topicObjectivesInline = document.querySelector("[data-topic-objectives-inline]");
const topicObjectivesInlineEyebrow = document.querySelector("[data-topic-objectives-inline-eyebrow]");
const topicObjectivesInlineHeading = document.querySelector("[data-topic-objectives-inline-heading]");
const topicObjectivesInlineList = document.querySelector("[data-topic-objectives-inline-list]");
const topicObjectivesInlineFooter = document.querySelector("[data-topic-objectives-inline-footer]");
const wordBankTrigger = document.querySelector("[data-word-bank-trigger]");
const wordBankClose = document.querySelector("[data-word-bank-close]");
const wordBankScrim = document.querySelector("[data-word-bank-scrim]");
const wordBankCount = document.querySelector("[data-word-bank-count]");
const wordBankSearch = document.querySelector("[data-word-bank-search]");
const wordBankFilterButtons = Array.from(document.querySelectorAll("[data-word-bank-filter]"));
const wordBankResultsSummary = document.querySelector("[data-word-bank-results-summary]");
const wordBankList = document.querySelector("[data-word-bank-list]");
const wordBankEmpty = document.querySelector("[data-word-bank-empty]");
const wordBankDetail = document.querySelector("[data-word-bank-detail]");
const wordBankDetailScope = document.querySelector("[data-word-bank-detail-scope]");
const wordBankDetailTerm = document.querySelector("[data-word-bank-detail-term]");
const wordBankDetailDefinition = document.querySelector("[data-word-bank-detail-definition]");
const wordBankDetailNotation = document.querySelector("[data-word-bank-detail-notation]");
const wordBankDetailFirst = document.querySelector("[data-word-bank-detail-first]");
const wordBankDetailRelated = document.querySelector("[data-word-bank-detail-related]");
const wordBankReviewToggle = document.querySelector("[data-word-bank-review-toggle]");
const dataManagementTrigger = document.querySelector("[data-data-management-trigger]");
const dataManagementDialog = document.querySelector("[data-data-management-dialog]");
const storageStatus = document.querySelector("[data-storage-status]");
const stateSchemaVersion = document.querySelector("[data-state-schema-version]");
const progressRecordCount = document.querySelector("[data-progress-record-count]");
const vocabularyRecordCount = document.querySelector("[data-vocabulary-record-count]");
const exportProgressButton = document.querySelector("[data-export-progress]");
const importProgressFile = document.querySelector("[data-import-progress-file]");
const importFilename = document.querySelector("[data-import-filename]");
const importPreview = document.querySelector("[data-import-preview]");
const importPreviewSummary = document.querySelector("[data-import-preview-summary]");
const confirmImportButton = document.querySelector("[data-confirm-import]");
const resetProgressButton = document.querySelector("[data-reset-progress]");
const resetConfirmation = document.querySelector("[data-reset-confirmation]");
const confirmResetButton = document.querySelector("[data-confirm-reset]");
const cancelResetButton = document.querySelector("[data-cancel-reset]");
const dataManagementStatus = document.querySelector("[data-data-management-status]");

const required = [
  root,
  shell,
  topbar,
  topicNavigation,
  topicNavigationToggle,
  topicNavigationClose,
  navigationScrim,
  learningWorkspace,
  modePanel,
  stage,
  standardActivityContent,
  activityVisual,
  questionShellElement,
  memoryLabElement,
  previousButton,
  nextButton,
  footerPosition,
  classWizPanelElement,
  classWizTrigger,
  classWizClose,
  classWizScrim,
  helpDrawer,
  helpDrawerTrigger,
  helpDrawerClose,
  helpDrawerScrim,
  helpContext,
  topicGoalsTrigger,
  topicGoalsDialog,
  topicGoalsClose,
  topicGoalsHeading,
  topicGoalsTopic,
  topicGoalsList,
  topicGoalsFooter,
  topicObjectivesInline,
  topicObjectivesInlineEyebrow,
  topicObjectivesInlineHeading,
  topicObjectivesInlineList,
  topicObjectivesInlineFooter,
  wordBankDrawer,
  wordBankTrigger,
  wordBankClose,
  wordBankScrim,
  wordBankCount,
  wordBankSearch,
  wordBankResultsSummary,
  wordBankList,
  wordBankEmpty,
  wordBankDetail,
  wordBankDetailScope,
  wordBankDetailTerm,
  wordBankDetailDefinition,
  wordBankDetailNotation,
  wordBankDetailFirst,
  wordBankDetailRelated,
  wordBankReviewToggle,
  dataManagementTrigger,
  dataManagementDialog,
  storageStatus,
  stateSchemaVersion,
  progressRecordCount,
  vocabularyRecordCount,
  exportProgressButton,
  importProgressFile,
  importFilename,
  importPreview,
  importPreviewSummary,
  confirmImportButton,
  resetProgressButton,
  resetConfirmation,
  confirmResetButton,
  cancelResetButton,
  dataManagementStatus,
  currentTopicLabelElement,
  currentTopicBreadcrumb
];

if (required.some((element) => !element) || modeTabs.length !== learningModeOrder.length || helpTargetLinks.length !== 3 || wordBankFilterButtons.length !== 4) {
  throw new Error("AppShell is missing one or more required regions, ModeTabs, HelpDrawer targets, Word Bank controls, QuestionShell host, or progress-data controls.");
}

installMathRendering(document);

const compactNavigationMedia = window.matchMedia("(max-width: 900px)");

const fields = Object.freeze({
  kicker: stage.querySelector("[data-activity-kicker]"),
  position: stage.querySelector("[data-activity-position]"),
  overline: stage.querySelector("[data-activity-overline]"),
  title: stage.querySelector("[data-activity-title]"),
  body: stage.querySelector("[data-activity-body]"),
  calloutLabel: stage.querySelector("[data-activity-callout] .activity-callout__label"),
  callout: stage.querySelector("[data-activity-callout] p"),
  formula: stage.querySelector("[data-activity-formula]"),
  caption: stage.querySelector("[data-activity-caption]")
});

let activeMode = learningModeOrder.includes(root.dataset.learningMode)
  ? root.dataset.learningMode
  : "understand";
let activityIndex = 0;
let navigationOpen = false;
let classWizOpen = false;
let helpOpen = false;
let wordBankOpen = false;
let wordBankFilter = "all";
let wordBankSelectedTermId = null;
let wordBankReturnFocus = null;
let pendingImport = null;
let dataDialogReturnFocus = null;
let currentTopicId = "topic:y12:differentiation:basics";
let currentTopicLabel = "Basics of differentiation";
const classWizSupportPanel = createClassWizSupportPanel({ element: classWizPanelElement, topicId: "topic:y12:differentiation:basics" });
if (!classWizSupportPanel) throw new Error("No ClassWiz support pack exists for the Basics reference topic");
const basicsUnderstand = createBasicsUnderstandExperience(activityVisual);
const preCalculusUnderstand = createPreCalculusUnderstandExperience(activityVisual);
const firstPrinciplesUnderstand = createFirstPrinciplesUnderstandExperience(activityVisual);
const tangentsNormalsUnderstand = createTangentsNormalsUnderstandExperience(activityVisual);
const stationaryPointsUnderstand = createStationaryPointsUnderstandExperience(activityVisual);
const increasingDecreasingUnderstand = createIncreasingDecreasingUnderstandExperience(activityVisual);
const integrationIntroUnderstand = createIntegrationIntroUnderstandExperience(activityVisual);
const definiteIndefiniteUnderstand = createDefiniteIndefiniteUnderstandExperience(activityVisual);
const integrationAreaUnderstand = createIntegrationAreaUnderstandExperience(activityVisual);
const signedAreaUnderstand = createSignedAreaUnderstandExperience(activityVisual);
const standardFunctionsUnderstand = createStandardFunctionsUnderstandExperience(activityVisual);
const trigFirstPrinciplesUnderstand = createTrigFirstPrinciplesUnderstandExperience(activityVisual);
const productQuotientChainUnderstand = createProductQuotientChainUnderstandExperience(activityVisual);
const parametricDifferentiationUnderstand = createParametricDifferentiationUnderstandExperience(activityVisual);
const implicitDifferentiationUnderstand = createImplicitDifferentiationUnderstandExperience(activityVisual);
const trigIdentitiesInverseUnderstand = createTrigIdentitiesInverseUnderstandExperience(activityVisual);
const concavityInflectionUnderstand = createConcavityInflectionUnderstandExperience(activityVisual);
const connectedRatesUnderstand = createConnectedRatesUnderstandExperience(activityVisual);
const standardIntegralsUnderstand = createStandardIntegralsUnderstandExperience(activityVisual);
const reverseChainRuleUnderstand = createReverseChainRuleUnderstandExperience(activityVisual);
const trigIdentityIntegrationUnderstand = createTrigIdentityIntegrationUnderstandExperience(activityVisual);
const substitutionUnderstand = createSubstitutionUnderstandExperience(activityVisual);
const integrationByPartsUnderstand = createIntegrationByPartsUnderstandExperience(activityVisual);
const partialFractionsUnderstand = createPartialFractionsUnderstandExperience(activityVisual);
const year13AreasUnderstand = createYear13AreasUnderstandExperience(activityVisual);
const parametricAreaUnderstand = createParametricAreaUnderstandExperience(activityVisual);
const limitOfSumUnderstand = createLimitOfSumUnderstandExperience(activityVisual);
const numericalIntegrationUnderstand = createNumericalIntegrationUnderstandExperience(activityVisual);
const differentialEquationsUnderstand = createDifferentialEquationsUnderstandExperience(activityVisual);
const calculusModellingUnderstand = createCalculusModellingUnderstandExperience(activityVisual);

const topicRuntime = Object.freeze({
  "topic:y12:differentiation:basics": Object.freeze({
    topicId: "topic:y12:differentiation:basics",
    label: "Basics of differentiation",
    breadcrumb: "Differentiation › Basics",
    learningModes,
    availableModes: Object.freeze([...learningModeOrder]),
    understandExperience: basicsUnderstand,
    classWiz: true
  }),
  "topic:y12:foundations:pre-calculus": Object.freeze({
    topicId: "topic:y12:foundations:pre-calculus",
    label: "Pre-calculus",
    breadcrumb: "Foundations › Pre-calculus",
    learningModes: preCalculusLearningModes,
    availableModes: Object.freeze(["understand"]),
    understandExperience: preCalculusUnderstand,
    classWiz: false
  }),
  "topic:y12:differentiation:first-principles": Object.freeze({
    topicId: "topic:y12:differentiation:first-principles",
    label: "First principles",
    breadcrumb: "Differentiation › First principles",
    learningModes: firstPrinciplesLearningModes,
    availableModes: Object.freeze([...learningModeOrder]),
    understandExperience: firstPrinciplesUnderstand,
    classWiz: false
  }),
  "topic:y12:differentiation:tangents-normals": Object.freeze({
    topicId: "topic:y12:differentiation:tangents-normals",
    label: "Tangents & normals",
    breadcrumb: "Differentiation › Tangents & normals",
    learningModes: tangentsNormalsLearningModes,
    availableModes: Object.freeze([...learningModeOrder]),
    understandExperience: tangentsNormalsUnderstand,
    classWiz: false
  }),
  "topic:y12:differentiation:stationary-points": Object.freeze({
    topicId: "topic:y12:differentiation:stationary-points",
    label: "Stationary points",
    breadcrumb: "Differentiation › Stationary points",
    learningModes: stationaryPointsLearningModes,
    availableModes: Object.freeze([...learningModeOrder]),
    understandExperience: stationaryPointsUnderstand,
    classWiz: false
  }),
  "topic:y12:differentiation:increasing-decreasing": Object.freeze({
    topicId: "topic:y12:differentiation:increasing-decreasing",
    label: "Increasing & decreasing",
    breadcrumb: "Differentiation › Increasing & decreasing",
    learningModes: increasingDecreasingLearningModes,
    availableModes: Object.freeze([...learningModeOrder]),
    understandExperience: increasingDecreasingUnderstand,
    classWiz: false
  }),
  "topic:y12:integration:introduction": Object.freeze({
    topicId: "topic:y12:integration:introduction", label: "Introduction to integration", breadcrumb: "Integration › Introduction",
    learningModes: integrationIntroLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: integrationIntroUnderstand, classWiz: false
  }),
  "topic:y12:integration:definite-indefinite": Object.freeze({
    topicId: "topic:y12:integration:definite-indefinite", label: "Definite & indefinite integration", breadcrumb: "Integration › Definite & indefinite",
    learningModes: definiteIndefiniteLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: definiteIndefiniteUnderstand, classWiz: false
  }),
  "topic:y12:integration:area": Object.freeze({
    topicId: "topic:y12:integration:area", label: "Integration as area", breadcrumb: "Integration › Area",
    learningModes: integrationAreaLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: integrationAreaUnderstand, classWiz: false
  }),
  "topic:y12:integration:signed-area": Object.freeze({
    topicId: "topic:y12:integration:signed-area", label: "Areas below & crossing axis", breadcrumb: "Integration › Signed area",
    learningModes: signedAreaLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: signedAreaUnderstand, classWiz: false
  }),
  "topic:y12:review:calculus-mastery": Object.freeze({
    topicId: "topic:y12:review:calculus-mastery", label: "Year 12 review & mastery", breadcrumb: "Year 12 › Review & mastery",
    learningModes: year12ReviewLearningModes, availableModes: Object.freeze(["memorise","ao1","ao2","ao3"]), understandExperience: null, classWiz: false, scopeId: "y12"
  }),
  "topic:y13:differentiation:standard-functions": Object.freeze({
    topicId: "topic:y13:differentiation:standard-functions", label: "Standard functions", breadcrumb: "Differentiation › Standard functions",
    learningModes: standardFunctionsLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: standardFunctionsUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:trig-first-principles": Object.freeze({
    topicId: "topic:y13:differentiation:trig-first-principles", label: "Trig proofs from first principles", breadcrumb: "Differentiation › Trig proofs from first principles",
    learningModes: trigFirstPrinciplesLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: trigFirstPrinciplesUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:product-quotient-chain": Object.freeze({
    topicId: "topic:y13:differentiation:product-quotient-chain", label: "Product, quotient & chain", breadcrumb: "Differentiation › Product, quotient & chain",
    learningModes: productQuotientChainLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: productQuotientChainUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:parametric-differentiation": Object.freeze({
    topicId: "topic:y13:differentiation:parametric-differentiation", label: "Parametric differentiation", breadcrumb: "Differentiation › Parametric differentiation",
    learningModes: parametricDifferentiationLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: parametricDifferentiationUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:implicit-differentiation": Object.freeze({
    topicId: "topic:y13:differentiation:implicit-differentiation", label: "Implicit differentiation", breadcrumb: "Differentiation › Implicit differentiation",
    learningModes: implicitDifferentiationLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: implicitDifferentiationUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:trig-identities-inverse": Object.freeze({
    topicId: "topic:y13:differentiation:trig-identities-inverse", label: "Trig identities & inverse trig", breadcrumb: "Differentiation › Trig identities & inverse trig",
    learningModes: trigIdentitiesInverseLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: trigIdentitiesInverseUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:concavity-inflection": Object.freeze({
    topicId: "topic:y13:differentiation:concavity-inflection", label: "Concavity, convexity & inflection", breadcrumb: "Differentiation › Concavity, convexity & inflection",
    learningModes: concavityInflectionLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: concavityInflectionUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:differentiation:connected-rates": Object.freeze({
    topicId: "topic:y13:differentiation:connected-rates", label: "Connected rates of change", breadcrumb: "Differentiation › Connected rates of change",
    learningModes: connectedRatesLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: connectedRatesUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:full:review:calculus-mastery": Object.freeze({
    topicId: "topic:full:review:calculus-mastery", label: "Differentiation review & mastery", breadcrumb: "Full A level › Differentiation review & mastery",
    learningModes: fullDifferentiationReviewLearningModes, availableModes: Object.freeze(["memorise","ao1","ao2","ao3"]), understandExperience: null, classWiz: false, scopeId: "full-alevel"
  }),
  "topic:y13:integration:standard-integrals": Object.freeze({
    topicId: "topic:y13:integration:standard-integrals", label: "Standard integrals", breadcrumb: "Integration › Standard integrals",
    learningModes: standardIntegralsLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: standardIntegralsUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:integration:reverse-chain-rule": Object.freeze({
    topicId: "topic:y13:integration:reverse-chain-rule", label: "Recognition & reverse chain", breadcrumb: "Integration › Recognition & reverse chain",
    learningModes: reverseChainRuleLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: reverseChainRuleUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:integration:trig-identities": Object.freeze({
    topicId: "topic:y13:integration:trig-identities", label: "Integration using trig identities", breadcrumb: "Integration › Trig identities",
    learningModes: trigIdentityIntegrationLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: trigIdentityIntegrationUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:integration:substitution": Object.freeze({
    topicId: "topic:y13:integration:substitution", label: "Integration by substitution", breadcrumb: "Integration › Substitution",
    learningModes: substitutionLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: substitutionUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:integration:by-parts": Object.freeze({
    topicId: "topic:y13:integration:by-parts", label: "Integration by parts", breadcrumb: "Integration › By parts",
    learningModes: integrationByPartsLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: integrationByPartsUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:integration:partial-fractions": Object.freeze({
    topicId: "topic:y13:integration:partial-fractions", label: "Integration using partial fractions", breadcrumb: "Integration › Partial fractions",
    learningModes: partialFractionsLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: partialFractionsUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:integration:areas": Object.freeze({
    topicId: "topic:y13:integration:areas", label: "Areas with Year 13 techniques", breadcrumb: "Integration › Areas with Year 13 techniques",
    learningModes: year13AreasLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: year13AreasUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:integration:parametric-area": Object.freeze({
    topicId: "topic:y13:integration:parametric-area", label: "Area using parametric equations", breadcrumb: "Integration › Parametric area",
    learningModes: parametricAreaLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: parametricAreaUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:integration:limit-of-sum": Object.freeze({
    topicId: "topic:y13:integration:limit-of-sum", label: "Integration as the limit of a sum", breadcrumb: "Integration › Limit of a sum",
    learningModes: limitOfSumLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: limitOfSumUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:integration:numerical-integration": Object.freeze({
    topicId: "topic:y13:integration:numerical-integration", label: "Numerical integration and the trapezium rule", breadcrumb: "Integration › Numerical integration",
    learningModes: numericalIntegrationLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: numericalIntegrationUnderstand, classWiz: true, scopeId: "y13-additional"
  }),
  "topic:y13:differential-equations:first-order": Object.freeze({
    topicId: "topic:y13:differential-equations:first-order", label: "First-order differential equations", breadcrumb: "Differential equations › First order",
    learningModes: differentialEquationsLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: differentialEquationsUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:y13:modelling:calculus": Object.freeze({
    topicId: "topic:y13:modelling:calculus", label: "Full 9MA0 calculus modelling", breadcrumb: "Modelling › Full calculus modelling",
    learningModes: calculusModellingLearningModes, availableModes: Object.freeze([...learningModeOrder]), understandExperience: calculusModellingUnderstand, classWiz: false, scopeId: "y13-additional"
  }),
  "topic:full:review:full-calculus-mastery": Object.freeze({
    topicId: "topic:full:review:full-calculus-mastery", label: "Full 9MA0 calculus mastery", breadcrumb: "Full A level › Full calculus mastery",
    learningModes: fullCalculusMasteryLearningModes, availableModes: Object.freeze(["ao1","ao2","ao3"]), understandExperience: null, classWiz: false, scopeId: "full-alevel"
  }),
});

const activityIndexByTopicMode = new Map(
  Object.values(topicRuntime).flatMap((topic) => learningModeOrder.map((mode) => [`${topic.topicId}|${mode}`, 0]))
);

function currentTopicRuntime() {
  return topicRuntime[currentTopicId];
}

function currentLearningModes() {
  return currentTopicRuntime().learningModes;
}

function topicModeKey(topicId = currentTopicId, mode = activeMode) {
  return `${topicId}|${mode}`;
}

let browserRouteReady = false;

function applyResolvedBrowserRoute(resolved, { focusStage = false } = {}) {
  if (!resolved) return false;
  if (resolved.topicId !== currentTopicId) selectTopic(resolved.topicId, { focusStage: false });
  if (resolved.mode !== activeMode) selectMode(resolved.mode);
  renderActivity(resolved.activityIndex);
  if (focusStage) stage.focus?.();
  return true;
}

const browserLocation = window.location ?? { pathname: "/", search: "", hash: "" };
const browserHistory = window.history ?? { pushState() {}, replaceState() {} };
const historyRouteController = createHistoryRouteController({
  history: browserHistory,
  location: browserLocation,
  topicRuntime,
  applyRoute: applyResolvedBrowserRoute
});

function currentActivityRoute() {
  const activity = currentActivities()[activityIndex];
  return activityRouteFromId(activity?.activityId);
}


const questionGeneratorRunner = createGeneratorRunner({
  debugSeed: readQuestionDebugSeed(window.location?.search ?? "")
});
const diagnosticRouter = createDiagnosticRouter();
const masteryFeedbackModel = createMasteryFeedbackModel({ router: diagnosticRouter });
const questionOutcomeHistory = [];
const year12ReviewOutcomeHistory = [];
const fullDifferentiationReviewOutcomeHistory = [];
const fullCalculusMasteryOutcomeHistory = [];
let fullCalculusMasterySnapshot = fullCalculusMasteryModel.summarise(fullCalculusMasteryOutcomeHistory);
let masteryFeedbackSnapshot = masteryFeedbackModel.summarise(questionOutcomeHistory);
let year12ReviewMasterySnapshot = masteryFeedbackModel.summarise(year12ReviewOutcomeHistory);
let fullDifferentiationReviewMasterySnapshot = masteryFeedbackModel.summarise(fullDifferentiationReviewOutcomeHistory);
const questionPracticeSessionsByActivityId = new Map();

function isYear12DiagnosticMasteryActivity() {
  return currentTopicId === "topic:y12:review:calculus-mastery" && currentActivities()[activityIndex]?.activityId === "activity:y12:review:calculus-mastery:ao3:diagnostic-mastery";
}

function isFullDifferentiationDiagnosticMasteryActivity() {
  return currentTopicId === "topic:full:review:calculus-mastery" && currentActivities()[activityIndex]?.activityId === "activity:full:review:calculus-mastery:ao3:diagnostic-mastery";
}

function clearList(element) {
  if (!element) return;
  while (element.firstChild) element.removeChild(element.firstChild);
}

function syncYear12MasterySummary() {
  if (!year12MasterySummary) return;
  const visible = isYear12DiagnosticMasteryActivity();
  year12MasterySummary.hidden = !visible;
  if (!visible) return;
  const snapshot = year12ReviewMasterySnapshot;
  if (year12MasteryEvidence) year12MasteryEvidence.textContent = `${snapshot.attemptCount} ${snapshot.attemptCount === 1 ? "attempt" : "attempts"}`;
  const hasEvidence = snapshot.attemptCount > 0;
  if (year12MasteryEmpty) year12MasteryEmpty.hidden = hasEvidence;
  if (year12MasteryColumns) year12MasteryColumns.hidden = !hasEvidence;
  clearList(year12MasteryStrengths);
  clearList(year12MasteryWeaknesses);
  for (const strength of snapshot.strengths) {
    const item = document.createElement("li");
    item.textContent = `${getYear12ReviewMicroSkillLabel(strength.microSkillId)} — ${strength.successes}/${strength.attempts} successful evidence`;
    year12MasteryStrengths?.appendChild(item);
  }
  if (hasEvidence && snapshot.strengths.length === 0 && year12MasteryStrengths) {
    const item = document.createElement("li"); item.textContent = "No secure micro-skill evidence yet in this set."; year12MasteryStrengths.appendChild(item);
  }
  for (const weakness of snapshot.weaknesses) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = getYear12ReviewMicroSkillLabel(weakness.microSkillId);
    item.appendChild(title);
    const detail = document.createElement("div");
    detail.textContent = `${weakness.focus} · ${weakness.failures} failed attempt${weakness.failures === 1 ? "" : "s"}`;
    item.appendChild(detail);
    if (weakness.nextStep) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "year12-mastery-summary__next-step";
      button.textContent = `Go to ${weakness.nextStep.supportLabel}: ${weakness.nextStep.title}`;
      button.addEventListener("click", () => followSupportTarget(weakness.nextStep));
      item.appendChild(button);
    }
    year12MasteryWeaknesses?.appendChild(item);
  }
  if (hasEvidence && snapshot.weaknesses.length === 0 && year12MasteryWeaknesses) {
    const item = document.createElement("li"); item.textContent = "No specific weakness has been identified from the evidence so far."; year12MasteryWeaknesses.appendChild(item);
  }
}


function syncFullDifferentiationMasterySummary() {
  if (!fullDifferentiationMasterySummary) return;
  const visible = isFullDifferentiationDiagnosticMasteryActivity();
  fullDifferentiationMasterySummary.hidden = !visible;
  if (!visible) return;
  const snapshot = fullDifferentiationReviewMasterySnapshot;
  if (fullDifferentiationMasteryEvidence) fullDifferentiationMasteryEvidence.textContent = `${snapshot.attemptCount} ${snapshot.attemptCount === 1 ? "attempt" : "attempts"}`;
  const hasEvidence = snapshot.attemptCount > 0;
  if (fullDifferentiationMasteryEmpty) fullDifferentiationMasteryEmpty.hidden = hasEvidence;
  if (fullDifferentiationMasteryColumns) fullDifferentiationMasteryColumns.hidden = !hasEvidence;
  clearList(fullDifferentiationMasteryStrengths); clearList(fullDifferentiationMasteryWeaknesses);
  for (const strength of snapshot.strengths) {
    const item=document.createElement("li"); item.textContent=`${getFullDifferentiationReviewMicroSkillLabel(strength.microSkillId)} — ${strength.successes}/${strength.attempts} successful evidence`; fullDifferentiationMasteryStrengths?.appendChild(item);
  }
  if (hasEvidence && snapshot.strengths.length===0 && fullDifferentiationMasteryStrengths) { const item=document.createElement("li"); item.textContent="No secure micro-skill evidence yet in this set."; fullDifferentiationMasteryStrengths.appendChild(item); }
  for (const weakness of snapshot.weaknesses) {
    const item=document.createElement("li"); const title=document.createElement("strong"); title.textContent=getFullDifferentiationReviewMicroSkillLabel(weakness.microSkillId); item.appendChild(title);
    const detail=document.createElement("div"); detail.textContent=`${weakness.focus} · recognition ${weakness.recognitionErrors} · execution ${weakness.executionErrors}`; item.appendChild(detail);
    if (weakness.nextStep) { const button=document.createElement("button"); button.type="button"; button.className="year12-mastery-summary__next-step"; button.textContent=`Go to ${weakness.nextStep.supportLabel}: ${weakness.nextStep.title}`; button.addEventListener("click",()=>followSupportTarget(weakness.nextStep)); item.appendChild(button); }
    fullDifferentiationMasteryWeaknesses?.appendChild(item);
  }
  if (hasEvidence && snapshot.weaknesses.length===0 && fullDifferentiationMasteryWeaknesses) { const item=document.createElement("li"); item.textContent="No specific weakness has been identified from the evidence so far."; fullDifferentiationMasteryWeaknesses.appendChild(item); }
}

function questionPracticeSessionForActivity(activityId) {
  const setDefinition = getQuestionPracticeDefinitionForActivity(activityId);
  if (!setDefinition) return null;
  if (!questionPracticeSessionsByActivityId.has(activityId)) {
    questionPracticeSessionsByActivityId.set(activityId, createQuestionPracticeSession({
      setDefinition,
      runner: questionGeneratorRunner
    }));
  }
  return questionPracticeSessionsByActivityId.get(activityId);
}

function generatedQuestionSetForActivity(activityId) {
  return questionPracticeSessionForActivity(activityId)?.currentBatch() ?? null;
}

const questionShell = createQuestionShell(questionShellElement, {
  onRequestFreshSet() {
    const activity = currentActivities()[activityIndex];
    if (!activity?.activityId) return null;
    return questionPracticeSessionForActivity(activity.activityId)?.nextBatch() ?? null;
  },
  resolveDiagnostic(attempt) {
    return diagnosticRouter.routeOutcome(attempt);
  },
  onDiagnosticNavigate(target) {
    followSupportTarget(target);
  },
  onAttempt(attempt) {
    const activity = currentActivities()[activityIndex];
    if (!activity?.activityId) return;
    const isYear12Review = currentTopicId === "topic:y12:review:calculus-mastery";
    const isFullDifferentiationReview = currentTopicId === "topic:full:review:calculus-mastery";
    const isFullCalculusMastery = currentTopicId === "topic:full:review:full-calculus-mastery";
    const isReview = isYear12Review || isFullDifferentiationReview || isFullCalculusMastery;
    progressStore.recordAttempt(activity.activityId, {
      success: attempt.success,
      result: attempt.success ? 1 : 0,
      topicId: isReview ? currentTopicId : (attempt.metadata?.topicId ?? currentTopicId),
      mode: isReview ? activeMode : (attempt.metadata?.assessmentObjective ?? activeMode)
    });
    questionOutcomeHistory.push(attempt);
    masteryFeedbackSnapshot = masteryFeedbackModel.summarise(questionOutcomeHistory);
    if (isYear12Review) {
      year12ReviewOutcomeHistory.push(attempt);
      year12ReviewMasterySnapshot = masteryFeedbackModel.summarise(year12ReviewOutcomeHistory);
      syncYear12MasterySummary();
    }
    if (isFullDifferentiationReview) {
      fullDifferentiationReviewOutcomeHistory.push(attempt);
      fullDifferentiationReviewMasterySnapshot = masteryFeedbackModel.summarise(fullDifferentiationReviewOutcomeHistory);
      syncFullDifferentiationMasterySummary();
    }
    if (isFullCalculusMastery) {
      fullCalculusMasteryOutcomeHistory.push({ activityId: activity.activityId, attempt });
      fullCalculusMasterySnapshot = fullCalculusMasteryModel.summarise(fullCalculusMasteryOutcomeHistory);
      for (const [dimension, evidence] of Object.entries(fullCalculusMasterySnapshot.dimensions)) {
        shell.dataset[`mastery${dimension[0].toUpperCase()}${dimension.slice(1)}`] = `${evidence.failures}/${evidence.attempts}`;
      }
    }
    const weaknessCount = isYear12Review ? year12ReviewMasterySnapshot.weaknesses.length : isFullDifferentiationReview ? fullDifferentiationReviewMasterySnapshot.weaknesses.length : isFullCalculusMastery ? Object.values(fullCalculusMasterySnapshot.dimensions).filter((d)=>d.failures>0).length : masteryFeedbackSnapshot.weaknesses.length;
    shell.dataset.diagnosticWeaknesses = String(weaknessCount);
  }
});

const memoryLabHosts = new Map([["topic:y12:differentiation:basics", memoryLabElement]]);
const firstPrinciplesMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (firstPrinciplesMemoryLabHost) {
  firstPrinciplesMemoryLabHost.hidden = true;
  memoryLabHosts.set("topic:y12:differentiation:first-principles", firstPrinciplesMemoryLabHost);
}
const tangentsNormalsMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (tangentsNormalsMemoryLabHost) {
  tangentsNormalsMemoryLabHost.hidden = true;
  memoryLabHosts.set("topic:y12:differentiation:tangents-normals", tangentsNormalsMemoryLabHost);
}
const stationaryPointsMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (stationaryPointsMemoryLabHost) {
  stationaryPointsMemoryLabHost.hidden = true;
  memoryLabHosts.set("topic:y12:differentiation:stationary-points", stationaryPointsMemoryLabHost);
}
const increasingDecreasingMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (increasingDecreasingMemoryLabHost) {
  increasingDecreasingMemoryLabHost.hidden = true;
  memoryLabHosts.set("topic:y12:differentiation:increasing-decreasing", increasingDecreasingMemoryLabHost);
}
const integrationIntroMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (integrationIntroMemoryLabHost) { integrationIntroMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y12:integration:introduction", integrationIntroMemoryLabHost); }
const definiteIndefiniteMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (definiteIndefiniteMemoryLabHost) { definiteIndefiniteMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y12:integration:definite-indefinite", definiteIndefiniteMemoryLabHost); }
const integrationAreaMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (integrationAreaMemoryLabHost) { integrationAreaMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y12:integration:area", integrationAreaMemoryLabHost); }
const signedAreaMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (signedAreaMemoryLabHost) { signedAreaMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y12:integration:signed-area", signedAreaMemoryLabHost); }
const year12ReviewMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (year12ReviewMemoryLabHost) { year12ReviewMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y12:review:calculus-mastery", year12ReviewMemoryLabHost); }
const standardFunctionsMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (standardFunctionsMemoryLabHost) { standardFunctionsMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:standard-functions", standardFunctionsMemoryLabHost); }
const trigFirstPrinciplesMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (trigFirstPrinciplesMemoryLabHost) { trigFirstPrinciplesMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:trig-first-principles", trigFirstPrinciplesMemoryLabHost); }
const productQuotientChainMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (productQuotientChainMemoryLabHost) { productQuotientChainMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:product-quotient-chain", productQuotientChainMemoryLabHost); }
const parametricDifferentiationMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (parametricDifferentiationMemoryLabHost) { parametricDifferentiationMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:parametric-differentiation", parametricDifferentiationMemoryLabHost); }
const implicitDifferentiationMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (implicitDifferentiationMemoryLabHost) { implicitDifferentiationMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:implicit-differentiation", implicitDifferentiationMemoryLabHost); }
const trigIdentitiesInverseMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (trigIdentitiesInverseMemoryLabHost) { trigIdentitiesInverseMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:trig-identities-inverse", trigIdentitiesInverseMemoryLabHost); }
const concavityInflectionMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (concavityInflectionMemoryLabHost) { concavityInflectionMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:concavity-inflection", concavityInflectionMemoryLabHost); }
const connectedRatesMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (connectedRatesMemoryLabHost) { connectedRatesMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:differentiation:connected-rates", connectedRatesMemoryLabHost); }
const fullDifferentiationReviewMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (fullDifferentiationReviewMemoryLabHost) { fullDifferentiationReviewMemoryLabHost.hidden = true; memoryLabHosts.set("topic:full:review:calculus-mastery", fullDifferentiationReviewMemoryLabHost); }
const standardIntegralsMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (standardIntegralsMemoryLabHost) { standardIntegralsMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:standard-integrals", standardIntegralsMemoryLabHost); }
const reverseChainRuleMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (reverseChainRuleMemoryLabHost) { reverseChainRuleMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:reverse-chain-rule", reverseChainRuleMemoryLabHost); }
const trigIdentityIntegrationMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (trigIdentityIntegrationMemoryLabHost) { trigIdentityIntegrationMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:trig-identities", trigIdentityIntegrationMemoryLabHost); }
const substitutionMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (substitutionMemoryLabHost) { substitutionMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:substitution", substitutionMemoryLabHost); }
const integrationByPartsMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (integrationByPartsMemoryLabHost) { integrationByPartsMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:by-parts", integrationByPartsMemoryLabHost); }
const partialFractionsMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (partialFractionsMemoryLabHost) { partialFractionsMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:partial-fractions", partialFractionsMemoryLabHost); }
const year13AreasMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (year13AreasMemoryLabHost) { year13AreasMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:areas", year13AreasMemoryLabHost); }
const parametricAreaMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (parametricAreaMemoryLabHost) { parametricAreaMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:parametric-area", parametricAreaMemoryLabHost); }
const limitOfSumMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (limitOfSumMemoryLabHost) { limitOfSumMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:limit-of-sum", limitOfSumMemoryLabHost); }
const numericalIntegrationMemoryLabHost = typeof memoryLabElement.cloneNode === "function" ? memoryLabElement.cloneNode(true) : null;
if (numericalIntegrationMemoryLabHost) { numericalIntegrationMemoryLabHost.hidden = true; memoryLabHosts.set("topic:y13:integration:numerical-integration", numericalIntegrationMemoryLabHost); }

let mountedMemoryLabHost = memoryLabElement;
const memoryLabStates = new Map();

function createTopicMemoryLab(topicId) {
  const host = memoryLabHosts.get(topicId);
  if (!host) return null;
  const items = getMemoryItemsForTopic(topicId);
  const gamePack = getMemoryGamePackForTopic(topicId);
  const reviewPack = getMemoryReviewPackForTopic(topicId);
  if (!items.length || !gamePack || !reviewPack) return null;

  const memoriseActivities = topicRuntime[topicId].learningModes.memorise.activities;
  const matchMemoryActivity = memoriseActivities.find((activity) => activity.memoryLabGame === "match");
  const gamesActivity = memoriseActivities.find((activity) => Array.isArray(activity.memoryLabGames));
  const gameActivityIds = Object.freeze({
    match: matchMemoryActivity?.activityId ?? gamesActivity?.activityId ?? null,
    build: gamesActivity?.activityId ?? null,
    "missing-piece": gamesActivity?.activityId ?? null,
    sort: gamesActivity?.activityId ?? null,
    impostor: gamesActivity?.activityId ?? null
  });
  const gameByActivityId = new Map();
  let lab = null;

  lab = createMemoryLab(host, {
    items, gamePack, reviewPack, gameActivityIds,
    onNavigate(view, { focusTab = false } = {}) {
      const targetIndex = memoriseActivities.findIndex((activity) => activity.memoryLabView === view && activity.memoryLabNavTarget !== false);
      if (targetIndex < 0) throw new Error(`Memory Lab view does not resolve to a Memorise activity for ${topicId}: ${view}`);
      if (currentTopicId !== topicId) selectTopic(topicId, { focusStage: false });
      if (activeMode !== "memorise") selectMode("memorise");
      renderActivity(targetIndex);
      if (focusTab) {
        const activity = memoriseActivities[targetIndex];
        lab.show(view, { activityId: activity.activityId, game: gameByActivityId.get(activity.activityId) ?? activity.memoryLabGame ?? null, focusTab: true });
      }
    },
    onGameNavigate(gameId, { focusGameTab = false } = {}) {
      const mappedActivityId = gameActivityIds[gameId];
      const targetIndex = memoriseActivities.findIndex((activity) => activity.activityId === mappedActivityId);
      if (targetIndex < 0) throw new Error(`Memory game does not resolve to a Memorise activity for ${topicId}: ${gameId}`);
      const activity = memoriseActivities[targetIndex];
      gameByActivityId.set(activity.activityId, gameId);
      if (currentTopicId !== topicId) selectTopic(topicId, { focusStage: false });
      if (activeMode !== "memorise") selectMode("memorise");
      renderActivity(targetIndex);
      lab.show("games", { activityId: activity.activityId, game: gameId, focusGameTab });
    },
    onAttempt({ activityId, success, result, completed = false }) {
      if (!activityId) return;
      progressStore.recordAttempt(activityId, { success, result, completed, topicId, mode: "memorise" });
    },
    onSecurity({ activityId, security }) {
      if (!activityId || !security) return;
      progressStore.setSecurity(activityId, security, { topicId, mode: "memorise" });
    },
    onComplete({ activityId }) {
      if (!activityId) return;
      progressStore.setCompleted(activityId, true, { topicId, mode: "memorise" });
    }
  });
  return Object.freeze({ lab, host, gameByActivityId });
}

for (const topicId of memoryLabHosts.keys()) {
  const state = createTopicMemoryLab(topicId);
  if (state) memoryLabStates.set(topicId, state);
}

function mountMemoryLabForTopic(topicId) {
  const state = memoryLabStates.get(topicId);
  if (!state || mountedMemoryLabHost === state.host) return;
  mountedMemoryLabHost.replaceWith(state.host);
  mountedMemoryLabHost = state.host;
}

function activeMemoryLabState() { return memoryLabStates.get(currentTopicId) ?? null; }
function activeMemoryLab() { return activeMemoryLabState()?.lab ?? null; }


function syncScopeBadges() {
  for (const badge of scopeBadges) {
    const scopeId = badge.dataset.courseScope;
    const scope = getCourseScope(scopeId);
    if (!scope) throw new Error(`Unknown course scope: ${scopeId}`);
    badge.textContent = badge.dataset.scopeBadgeVariant === "compact" ? scope.compactLabel : scope.label;
    badge.setAttribute("aria-label", scope.accessibleLabel);
    badge.dataset.routeScope = scope.routeScope;
  }
}

function syncTopicProgress() {
  for (const item of topicProgressItems) {
    const topicId = item.dataset.topicId;
    const progress = getTopicProgress(topicId, progressStore);
    const marker = item.querySelector("[data-topic-state-marker]");
    const description = item.querySelector("[data-topic-progress-description]");
    const modeProgress = item.querySelector("[data-topic-mode-progress]");

    item.dataset.progressState = progress.state;
    if (marker) {
      marker.dataset.progressState = progress.state;
      marker.textContent = progress.symbol;
      marker.setAttribute("title", progress.label);
    }
    if (description) description.textContent = ` Progress: ${progress.accessibleSummary}`;

    if (!modeProgress) continue;
    const modeMarkers = Array.from(modeProgress.querySelectorAll("[data-mode-progress]"));
    const implementedModes = topicRuntime[topicId]?.availableModes ?? null;
    for (const modeMarker of modeMarkers) {
      const mode = modeMarker.dataset.modeProgress;
      const modeState = progress.modes[mode];
      const enabled = progressModeOrder.includes(mode) && modeState?.enabled && (!implementedModes || implementedModes.includes(mode));
      modeMarker.hidden = !enabled;
      if (!enabled) continue;
      modeMarker.dataset.progressState = modeState.state;
      modeMarker.setAttribute("title", `${modeState.modeLabel}: ${modeState.label}`);
      const symbol = modeMarker.querySelector("[data-mode-progress-symbol]");
      if (symbol) symbol.textContent = modeState.symbol;
    }
  }
}

function setBackgroundInert(inert) {
  topbar.inert = inert;
  learningWorkspace.inert = inert;
}

function setHelpBackgroundInert(inert) {
  topbar.inert = inert;
  topicNavigation.inert = inert;
  learningWorkspace.inert = inert;
}

function syncHelpTargets() {
  const targets = getHelpTargets(currentTopicId);
  const targetByNeed = Object.fromEntries(targets.map((target) => [target.need, target]));

  for (const link of helpTargetLinks) {
    const target = targetByNeed[link.dataset.helpTarget];
    if (!target) {
      link.hidden = true;
      continue;
    }
    link.hidden = false;
    link.href = target.route;
    link.dataset.helpTargetId = target.activityId;
    link.dataset.helpTargetSkillId = target.microSkillId;
    link.dataset.helpTargetMode = target.mode;
    link.querySelector("[data-help-target-label]").textContent = target.supportLabel;
    link.querySelector("[data-help-target-title]").textContent = target.title;
    link.querySelector("[data-help-target-description]").textContent = target.description;
    link.setAttribute("aria-label", `${target.prompt}: ${target.title}. ${target.description}`);
  }
}

function syncWordBankCount() {
  const count = vocabularyStore.getEncounteredCount();
  wordBankCount.textContent = String(count);
  wordBankCount.setAttribute("aria-label", `${count} ${count === 1 ? "word" : "words"} encountered`);
}

function humaniseMicroSkill(microSkillId) {
  const slug = microSkillId?.split(":").at(-1);
  if (!slug) return "Current activity";
  return slug.replaceAll("-", " ");
}

function vocabularyScopeLabel(scopeId) {
  const scope = getCourseScope(scopeId);
  return scope?.label ?? scopeId;
}

function currentActivityContext(activity) {
  return {
    scopeId: root.dataset.courseScope ?? "y12",
    topicId: currentTopicId,
    topicLabel: currentTopicLabel,
    microSkillId: activity.microSkillId ?? null,
    activityId: activity.activityId ?? null,
    activityTitle: activity.title
  };
}

function renderWordBankDetail(entry) {
  if (!entry) {
    wordBankDetail.hidden = true;
    return;
  }

  const first = entry.record.firstEncounter ?? {};
  wordBankDetail.hidden = false;
  wordBankDetailScope.textContent = vocabularyScopeLabel(entry.scopeId);
  wordBankDetailTerm.textContent = entry.label;
  wordBankDetailDefinition.textContent = entry.definition;
  wordBankDetailNotation.textContent = entry.notation || "No special notation";
  wordBankDetailFirst.textContent = `${first.topicLabel ?? "Current topic"} · ${humaniseMicroSkill(first.microSkillId)}`;
  wordBankDetailRelated.textContent = entry.relatedTopics.join(" · ");
  wordBankReviewToggle.setAttribute("aria-pressed", entry.record.needsReview ? "true" : "false");
  wordBankReviewToggle.textContent = entry.record.needsReview ? "Needs review" : "Mark for review";
}

function renderWordBank() {
  const entries = buildWordBankEntries(vocabularyStore.listRecords());
  const filtered = filterWordBankEntries(entries, { query: wordBankSearch.value, filter: wordBankFilter });
  wordBankResultsSummary.textContent = `${filtered.length} ${filtered.length === 1 ? "word" : "words"} shown · ${entries.length} encountered`;
  wordBankEmpty.hidden = filtered.length !== 0;

  if (!filtered.some((entry) => entry.id === wordBankSelectedTermId)) {
    wordBankSelectedTermId = filtered[0]?.id ?? null;
  }

  if (typeof document.createElement !== "function" || typeof wordBankList.replaceChildren !== "function") {
    renderWordBankDetail(filtered.find((entry) => entry.id === wordBankSelectedTermId) ?? null);
    return;
  }

  wordBankList.replaceChildren();
  for (const entry of filtered) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `word-bank-entry${entry.id === wordBankSelectedTermId ? " is-selected" : ""}`;
    button.dataset.wordBankTermId = entry.id;
    button.setAttribute("role", "listitem");
    button.setAttribute("aria-pressed", entry.id === wordBankSelectedTermId ? "true" : "false");

    const copy = document.createElement("span");
    copy.className = "word-bank-entry__copy";
    const label = document.createElement("strong");
    label.textContent = entry.label;
    const definition = document.createElement("span");
    definition.className = "word-bank-entry__definition";
    definition.textContent = entry.definition;
    copy.append(label, definition);

    const meta = document.createElement("span");
    meta.className = "word-bank-entry__meta";
    meta.textContent = entry.scopeId === "y13-additional" ? "Year 13" : "Year 12";
    if (entry.record.needsReview) {
      const review = document.createElement("span");
      review.className = "word-bank-entry__review";
      review.textContent = "Review";
      meta.append(" · ", review);
    }

    button.append(copy, meta);
    button.addEventListener("click", () => {
      wordBankSelectedTermId = entry.id;
      renderWordBank();
    });
    wordBankList.append(button);
  }

  renderWordBankDetail(filtered.find((entry) => entry.id === wordBankSelectedTermId) ?? null);
}

function syncDataManagementSummary() {
  const status = localStateStore.getStatus();
  storageStatus.textContent = status.persistent ? "Saved on this device" : "Memory only";
  stateSchemaVersion.textContent = String(APP_STATE_SCHEMA_VERSION);
  progressRecordCount.textContent = String(progressStore.listActivities().length);
  vocabularyRecordCount.textContent = String(vocabularyStore.getEncounteredCount());
}

function setDataStatus(message, tone = "neutral") {
  dataManagementStatus.textContent = message;
  dataManagementStatus.dataset.tone = tone;
}

function clearImportSelection() {
  pendingImport = null;
  importProgressFile.value = "";
  importFilename.textContent = "No file selected";
  importPreview.hidden = true;
  importPreviewSummary.textContent = "";
}

function openDataManagement() {
  if (navigationOpen) closeTopicNavigation({ restoreFocus: false });
  if (classWizOpen) closeClassWizSupport({ restoreFocus: false });
  if (helpOpen) closeHelpDrawer({ restoreFocus: false });
  if (wordBankOpen) closeWordBank({ restoreFocus: false });
  dataDialogReturnFocus = compactNavigationMedia.matches ? topicNavigationToggle : dataManagementTrigger;
  resetConfirmation.hidden = true;
  setDataStatus("");
  syncDataManagementSummary();
  if (typeof dataManagementDialog.showModal === "function") dataManagementDialog.showModal();
  else dataManagementDialog.setAttribute("open", "");
}

function closeDataManagement() {
  if (dataManagementDialog.open && typeof dataManagementDialog.close === "function") dataManagementDialog.close();
  else dataManagementDialog.removeAttribute("open");
}

function downloadProgressExport() {
  const blob = new Blob([localStateStore.exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `calculus-progress-${date}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setDataStatus("Progress backup exported.", "success");
}

export function openClassWizSupport() {
  if (!currentTopicRuntime().classWiz || classWizOpen) return;
  if (navigationOpen) closeTopicNavigation({ restoreFocus: false });
  if (helpOpen) closeHelpDrawer({ restoreFocus: false });
  if (wordBankOpen) closeWordBank({ restoreFocus: false });

  classWizOpen = true;
  shell.dataset.classwizOpen = "true";
  classWizTrigger.setAttribute("aria-expanded", "true");
  classWizPanelElement.setAttribute("aria-hidden", "false");
  classWizScrim.hidden = false;
  setHelpBackgroundInert(true);
  classWizClose.focus({ preventScroll: true });
}

export function closeClassWizSupport({ restoreFocus = true } = {}) {
  if (!classWizOpen) return;
  classWizOpen = false;
  shell.dataset.classwizOpen = "false";
  classWizTrigger.setAttribute("aria-expanded", "false");
  classWizPanelElement.setAttribute("aria-hidden", "true");
  classWizScrim.hidden = true;
  setHelpBackgroundInert(false);
  if (restoreFocus) classWizTrigger.focus({ preventScroll: true });
}

export function openWordBank(termId = null, returnFocus = null) {
  if (wordBankOpen) {
    if (termId) {
      wordBankSelectedTermId = termId;
      renderWordBank();
    }
    return;
  }
  if (navigationOpen) closeTopicNavigation({ restoreFocus: false });
  if (classWizOpen) closeClassWizSupport({ restoreFocus: false });
  if (helpOpen) closeHelpDrawer({ restoreFocus: false });

  wordBankOpen = true;
  wordBankReturnFocus = returnFocus ?? wordBankTrigger;
  if (termId) wordBankSelectedTermId = termId;
  shell.dataset.wordBankOpen = "true";
  wordBankTrigger.setAttribute("aria-expanded", "true");
  wordBankDrawer.setAttribute("aria-hidden", "false");
  wordBankScrim.hidden = false;
  setHelpBackgroundInert(true);
  renderWordBank();
  wordBankSearch.focus();
}

export function closeWordBank({ restoreFocus = true } = {}) {
  if (!wordBankOpen) return;
  wordBankOpen = false;
  shell.dataset.wordBankOpen = "false";
  wordBankTrigger.setAttribute("aria-expanded", "false");
  wordBankDrawer.setAttribute("aria-hidden", "true");
  wordBankScrim.hidden = true;
  setHelpBackgroundInert(false);
  if (restoreFocus) (wordBankReturnFocus ?? wordBankTrigger).focus?.();
  wordBankReturnFocus = null;
}

export function openHelpDrawer() {
  if (helpOpen) return;
  if (navigationOpen) closeTopicNavigation({ restoreFocus: false });
  if (classWizOpen) closeClassWizSupport({ restoreFocus: false });
  if (wordBankOpen) closeWordBank({ restoreFocus: false });

  helpOpen = true;
  shell.dataset.helpOpen = "true";
  helpDrawerTrigger.setAttribute("aria-expanded", "true");
  helpDrawer.setAttribute("aria-hidden", "false");
  helpDrawerScrim.hidden = false;
  helpContext.textContent = `Quick support for “${fields.title.textContent}”. Choose what you need; your current work stays here.`;
  setHelpBackgroundInert(true);
  helpDrawerClose.focus();
}

export function closeHelpDrawer({ restoreFocus = true } = {}) {
  if (!helpOpen) return;
  helpOpen = false;
  shell.dataset.helpOpen = "false";
  helpDrawerTrigger.setAttribute("aria-expanded", "false");
  helpDrawer.setAttribute("aria-hidden", "true");
  helpDrawerScrim.hidden = true;
  setHelpBackgroundInert(false);
  if (restoreFocus) helpDrawerTrigger.focus();
}

function followSupportTarget(target) {
  if (!target) return;
  if (target.topicId && target.topicId !== currentTopicId) selectTopic(target.topicId);
  const activities = currentLearningModes()[target.mode]?.activities ?? [];
  const targetIndex = activities.findIndex((activity) => activity.activityId === target.activityId);
  if (targetIndex < 0) throw new Error(`Support target does not resolve to an existing activity: ${target.activityId}`);
  if (classWizOpen) closeClassWizSupport({ restoreFocus: false });
  if (helpOpen) closeHelpDrawer({ restoreFocus: false });
  if (wordBankOpen) closeWordBank({ restoreFocus: false });
  selectMode(target.mode);
  renderActivity(targetIndex);
  stage.focus();
}

function followHelpTarget(need) {
  followSupportTarget(getHelpTarget(currentTopicId, need));
}

export function openTopicNavigation() {
  if (!compactNavigationMedia.matches || navigationOpen) return;
  if (classWizOpen) closeClassWizSupport({ restoreFocus: false });
  if (helpOpen) closeHelpDrawer({ restoreFocus: false });
  if (wordBankOpen) closeWordBank({ restoreFocus: false });

  navigationOpen = true;
  shell.dataset.navigationOpen = "true";
  topicNavigationToggle.setAttribute("aria-expanded", "true");
  topicNavigation.setAttribute("aria-hidden", "false");
  navigationScrim.hidden = false;
  setBackgroundInert(true);
  topicNavigationClose.focus();
}

export function closeTopicNavigation({ restoreFocus = true } = {}) {
  navigationOpen = false;
  shell.dataset.navigationOpen = "false";
  topicNavigationToggle.setAttribute("aria-expanded", "false");
  navigationScrim.hidden = true;
  setBackgroundInert(false);

  if (compactNavigationMedia.matches) {
    topicNavigation.setAttribute("aria-hidden", "true");
  } else {
    topicNavigation.removeAttribute("aria-hidden");
  }

  if (restoreFocus && compactNavigationMedia.matches) {
    topicNavigationToggle.focus();
  }
}

function syncNavigationForViewport() {
  closeTopicNavigation({ restoreFocus: false });
}

function syncCurrentTopicChrome() {
  const runtime = currentTopicRuntime();
  currentTopicLabel = runtime.label;
  currentTopicLabelElement.textContent = runtime.label;
  currentTopicBreadcrumb.textContent = runtime.breadcrumb;
  shell.dataset.topicId = currentTopicId;
  const currentScopeId = runtime.scopeId ?? (currentTopicId.startsWith("topic:y13:") ? "y13-additional" : "y12");
  root.dataset.courseScope = currentScopeId;
  const topScopeBadge = scopeBadges.find((badge) => !badge.classList.contains("scope-badge--compact") && badge.closest?.("[data-shell-topbar]"));
  if (topScopeBadge) topScopeBadge.dataset.courseScope = currentScopeId;
  syncScopeBadges();
  classWizTrigger.hidden = !runtime.classWiz;
  classWizTrigger.disabled = !runtime.classWiz;
  if (!runtime.classWiz && classWizOpen) closeClassWizSupport({ restoreFocus: false });

  for (const item of topicProgressItems) {
    const current = item.dataset.topicId === currentTopicId;
    item.classList?.toggle?.("is-current", current);
    if (current) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }
}

export function selectTopic(topicId, { focusStage = true } = {}) {
  const runtime = topicRuntime[topicId];
  if (!runtime || topicId === currentTopicId) {
    if (runtime && compactNavigationMedia.matches) closeTopicNavigation({ restoreFocus: false });
    return Boolean(runtime);
  }

  activityIndexByTopicMode.set(topicModeKey(), activityIndex);
  basicsUnderstand.destroy();
  preCalculusUnderstand.destroy();
  firstPrinciplesUnderstand.destroy();
  tangentsNormalsUnderstand.destroy();
  stationaryPointsUnderstand.destroy();
  increasingDecreasingUnderstand.destroy();
  integrationIntroUnderstand.destroy();
  definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); standardIntegralsUnderstand.destroy(); reverseChainRuleUnderstand.destroy(); trigIdentityIntegrationUnderstand.destroy(); substitutionUnderstand.destroy();
  questionShell.hide();
  activeMemoryLab()?.hide();
  currentTopicId = topicId;
  mountMemoryLabForTopic(currentTopicId);

  if (!runtime.availableModes.includes(activeMode)) activeMode = runtime.availableModes[0] ?? "understand";
  root.dataset.learningMode = activeMode;
  syncCurrentTopicChrome();
  syncModeTabs();
  syncHelpTargets();
  syncTopicProgress();
  renderActivity(activityIndexByTopicMode.get(topicModeKey()) ?? 0);
  syncYear12MasterySummary();
  syncFullDifferentiationMasterySummary();
  if (compactNavigationMedia.matches) closeTopicNavigation({ restoreFocus: false });
  if (focusStage) stage.focus();
  return true;
}

function currentActivities() {
  return currentLearningModes()[activeMode]?.activities ?? [];
}

function renderTopicObjectiveList(listElement, objectives) {
  const items = objectives.map((objective) => {
    const item = document.createElement("li");
    item.className = "topic-objectives-list__item";
    const marker = document.createElement("span");
    marker.className = "topic-objectives-list__marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "✓";
    const copy = document.createElement("span");
    copy.textContent = objective;
    item.append(marker, copy);
    return item;
  });
  listElement.replaceChildren(...items);
}

function syncTopicGoalsDialog() {
  const config = getTopicObjectiveConfig(currentTopicId);
  if (!config) return;
  topicGoalsHeading.textContent = config.heading;
  topicGoalsTopic.textContent = currentTopicRuntime().label;
  topicGoalsFooter.textContent = config.footer;
  renderTopicObjectiveList(topicGoalsList, config.objectives);
}

function syncInlineTopicObjectives() {
  const config = getTopicObjectiveConfig(currentTopicId);
  const activities = currentActivities();
  const isFirstUnderstand = activeMode === "understand" && activityIndex === 0;
  const isLastUnderstand = activeMode === "understand" && activities.length > 1 && activityIndex === activities.length - 1;
  const show = Boolean(config && (isFirstUnderstand || isLastUnderstand));
  topicObjectivesInline.hidden = !show;
  if (!show) return;

  const recap = isLastUnderstand && !isFirstUnderstand;
  topicObjectivesInline.dataset.objectivePhase = recap ? "recap" : "intro";
  topicObjectivesInlineEyebrow.textContent = recap ? "Topic recap" : "Topic goals";
  topicObjectivesInlineHeading.textContent = recap ? config.recapHeading : config.heading;
  topicObjectivesInlineFooter.textContent = recap
    ? "Use these goals to decide what needs one more look before you move into recall and practice."
    : config.footer;
  renderTopicObjectiveList(topicObjectivesInlineList, config.objectives);
}

function openTopicGoals() {
  syncTopicGoalsDialog();
  topicGoalsTrigger.setAttribute("aria-expanded", "true");
  if (typeof topicGoalsDialog.showModal === "function") topicGoalsDialog.showModal();
  else topicGoalsDialog.setAttribute("open", "");
  topicGoalsClose.focus();
}

function closeTopicGoals() {
  if (typeof topicGoalsDialog.close === "function" && topicGoalsDialog.open) topicGoalsDialog.close();
  else {
    topicGoalsDialog.removeAttribute("open");
    topicGoalsTrigger.setAttribute("aria-expanded", "false");
    topicGoalsTrigger.focus();
  }
}

export function wrappedIndex(index, length = currentActivities().length) {
  if (!(length > 0)) return 0;
  return ((index % length) + length) % length;
}

export function renderActivity(index) {
  const activities = currentActivities();
  if (activities.length === 0) return;
  activityIndex = wrappedIndex(index, activities.length);
  activityIndexByTopicMode.set(topicModeKey(), activityIndex);
  const activity = activities[activityIndex];
  const position = `${activityIndex + 1} of ${activities.length}`;

  fields.kicker.textContent = activity.kicker;
  fields.position.textContent = position;
  fields.overline.textContent = activity.overline;
  fields.title.textContent = activity.title;
  if (Array.isArray(activity.bodySegments)) {
    renderVocabularyRichText(fields.body, activity.bodySegments, {
      store: vocabularyStore,
      context: currentActivityContext(activity),
      onOpenWordBank: (termId, returnFocus) => openWordBank(termId, returnFocus),
      onEncountered: syncWordBankCount
    });
  } else {
    fields.body.textContent = activity.body;
  }
  fields.calloutLabel.textContent = activity.calloutLabel;
  fields.callout.textContent = activity.callout;
  fields.formula.textContent = activity.formula;
  fields.caption.textContent = activity.caption;
  footerPosition.textContent = position;
  syncInlineTopicObjectives();

  const memoryLabView = activeMode === "memorise" ? activity.memoryLabView : null;
  const generatedQuestionSet = generatedQuestionSetForActivity(activity.activityId);
  if (memoryLabView) {
    const memoryState = activeMemoryLabState();
    if (!memoryState) throw new Error(`No MemoryLab content configured for ${currentTopicId}`);
    standardActivityContent.hidden = true;
    questionShell.hide();
    memoryState.lab.show(memoryLabView, {
      activityId: activity.activityId,
      game: memoryState.gameByActivityId.get(activity.activityId) ?? activity.memoryLabGame ?? null
    });
  } else if (generatedQuestionSet) {
    activeMemoryLab()?.hide();
    standardActivityContent.hidden = true;
    questionShell.loadSet(generatedQuestionSet);
  } else {
    activeMemoryLab()?.hide();
    questionShell.hide();
    standardActivityContent.hidden = false;
    connectedRatesUnderstand.destroy();
    standardIntegralsUnderstand.destroy();
    reverseChainRuleUnderstand.destroy();
    const customBasicsUnderstand = activeMode === "understand" && activity.basicsUnderstand && basicsUnderstand.supports(activity.activityId);
    const customPreCalculusUnderstand = activeMode === "understand" && activity.preCalculusUnderstand && preCalculusUnderstand.supports(activity.activityId);
    const customFirstPrinciplesUnderstand = activeMode === "understand" && activity.firstPrinciplesUnderstand && firstPrinciplesUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.basicsUnderstandActive = customBasicsUnderstand ? "true" : "false";
    standardActivityContent.dataset.preCalculusUnderstandActive = customPreCalculusUnderstand ? "true" : "false";
    standardActivityContent.dataset.firstPrinciplesUnderstandActive = customFirstPrinciplesUnderstand ? "true" : "false";
    const customTangentsNormalsUnderstand = activeMode === "understand" && activity.tangentsNormalsUnderstand && tangentsNormalsUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.tangentsNormalsUnderstandActive = customTangentsNormalsUnderstand ? "true" : "false";
    const customStationaryPointsUnderstand = activeMode === "understand" && activity.stationaryPointsUnderstand && stationaryPointsUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.stationaryPointsUnderstandActive = customStationaryPointsUnderstand ? "true" : "false";
    const customIncreasingDecreasingUnderstand = activeMode === "understand" && activity.increasingDecreasingUnderstand && increasingDecreasingUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.increasingDecreasingUnderstandActive = customIncreasingDecreasingUnderstand ? "true" : "false";
    const customIntegrationIntroUnderstand = activeMode === "understand" && activity.integrationIntroUnderstand && integrationIntroUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.integrationIntroUnderstandActive = customIntegrationIntroUnderstand ? "true" : "false";
    const customDefiniteIndefiniteUnderstand = activeMode === "understand" && activity.definiteIndefiniteUnderstand && definiteIndefiniteUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.definiteIndefiniteUnderstandActive = customDefiniteIndefiniteUnderstand ? "true" : "false";
    const customIntegrationAreaUnderstand = activeMode === "understand" && activity.integrationAreaUnderstand && integrationAreaUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.integrationAreaUnderstandActive = customIntegrationAreaUnderstand ? "true" : "false";
    const customSignedAreaUnderstand = activeMode === "understand" && activity.signedAreaUnderstand && signedAreaUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.signedAreaUnderstandActive = customSignedAreaUnderstand ? "true" : "false";
    const customStandardFunctionsUnderstand = activeMode === "understand" && activity.standardFunctionsUnderstand && standardFunctionsUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.standardFunctionsUnderstandActive = customStandardFunctionsUnderstand ? "true" : "false";
    const customTrigFirstPrinciplesUnderstand = activeMode === "understand" && activity.trigFirstPrinciplesUnderstand && trigFirstPrinciplesUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.trigFirstPrinciplesUnderstandActive = customTrigFirstPrinciplesUnderstand ? "true" : "false";
    const customProductQuotientChainUnderstand = activeMode === "understand" && activity.productQuotientChainUnderstand && productQuotientChainUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.productQuotientChainUnderstandActive = customProductQuotientChainUnderstand ? "true" : "false";
    const customParametricDifferentiationUnderstand = activeMode === "understand" && activity.parametricDifferentiationUnderstand && parametricDifferentiationUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.parametricDifferentiationUnderstandActive = customParametricDifferentiationUnderstand ? "true" : "false";
    const customImplicitDifferentiationUnderstand = activeMode === "understand" && activity.implicitDifferentiationUnderstand && implicitDifferentiationUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.implicitDifferentiationUnderstandActive = customImplicitDifferentiationUnderstand ? "true" : "false";
    const customTrigIdentitiesInverseUnderstand = activeMode === "understand" && activity.trigIdentitiesInverseUnderstand && trigIdentitiesInverseUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.trigIdentitiesInverseUnderstandActive = customTrigIdentitiesInverseUnderstand ? "true" : "false";
    const customConnectedRatesUnderstand = activeMode === "understand" && activity.connectedRatesUnderstand && connectedRatesUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.connectedRatesUnderstandActive = customConnectedRatesUnderstand ? "true" : "false";
    const customStandardIntegralsUnderstand = activeMode === "understand" && activity.standardIntegralsUnderstand && standardIntegralsUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.standardIntegralsUnderstandActive = customStandardIntegralsUnderstand ? "true" : "false";
    const customReverseChainRuleUnderstand = activeMode === "understand" && activity.reverseChainRuleUnderstand && reverseChainRuleUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.reverseChainRuleUnderstandActive = customReverseChainRuleUnderstand ? "true" : "false";
    if (!customReverseChainRuleUnderstand) reverseChainRuleUnderstand.destroy();
    const customTrigIdentityIntegrationUnderstand = activeMode === "understand" && activity.trigIdentityIntegrationUnderstand && trigIdentityIntegrationUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.trigIdentityIntegrationUnderstandActive = customTrigIdentityIntegrationUnderstand ? "true" : "false";
    if (!customTrigIdentityIntegrationUnderstand) trigIdentityIntegrationUnderstand.destroy();
    const customSubstitutionUnderstand = activeMode === "understand" && activity.substitutionUnderstand && substitutionUnderstand.supports(activity.activityId);
    standardActivityContent.dataset.substitutionUnderstandActive = customSubstitutionUnderstand ? "true" : "false";
    if (!customSubstitutionUnderstand) substitutionUnderstand.destroy();
    if (customBasicsUnderstand) {
      preCalculusUnderstand.destroy();
      firstPrinciplesUnderstand.destroy();
      tangentsNormalsUnderstand.destroy();
      stationaryPointsUnderstand.destroy();
      increasingDecreasingUnderstand.destroy();
      integrationIntroUnderstand.destroy();
      definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      basicsUnderstand.render(activity.activityId);
    } else if (customPreCalculusUnderstand) {
      basicsUnderstand.destroy();
      firstPrinciplesUnderstand.destroy();
      tangentsNormalsUnderstand.destroy();
      stationaryPointsUnderstand.destroy();
      increasingDecreasingUnderstand.destroy();
      integrationIntroUnderstand.destroy();
      definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      preCalculusUnderstand.render(activity.activityId);
    } else if (customFirstPrinciplesUnderstand) {
      basicsUnderstand.destroy();
      preCalculusUnderstand.destroy();
      tangentsNormalsUnderstand.destroy();
      stationaryPointsUnderstand.destroy();
      increasingDecreasingUnderstand.destroy();
      integrationIntroUnderstand.destroy();
      definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      firstPrinciplesUnderstand.render(activity.activityId);
    } else if (customTangentsNormalsUnderstand) {
      basicsUnderstand.destroy();
      preCalculusUnderstand.destroy();
      firstPrinciplesUnderstand.destroy();
      stationaryPointsUnderstand.destroy();
      increasingDecreasingUnderstand.destroy();
      integrationIntroUnderstand.destroy();
      definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      tangentsNormalsUnderstand.render(activity.activityId);
    } else if (customStationaryPointsUnderstand) {
      basicsUnderstand.destroy();
      preCalculusUnderstand.destroy();
      firstPrinciplesUnderstand.destroy();
      tangentsNormalsUnderstand.destroy();
      increasingDecreasingUnderstand.destroy();
      integrationIntroUnderstand.destroy();
      definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      stationaryPointsUnderstand.render(activity.activityId);
    } else if (customIncreasingDecreasingUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      increasingDecreasingUnderstand.render(activity.activityId);
    } else if (customIntegrationIntroUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      integrationIntroUnderstand.render(activity.activityId);
    } else if (customDefiniteIndefiniteUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      definiteIndefiniteUnderstand.render(activity.activityId);
    } else if (customIntegrationAreaUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      integrationAreaUnderstand.render(activity.activityId);
    } else if (customSignedAreaUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      signedAreaUnderstand.render(activity.activityId);
    } else if (customStandardFunctionsUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      standardFunctionsUnderstand.render(activity.activityId);
    } else if (customTrigFirstPrinciplesUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      trigFirstPrinciplesUnderstand.render(activity.activityId);
    } else if (customProductQuotientChainUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      productQuotientChainUnderstand.render(activity.activityId);
    } else if (customParametricDifferentiationUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      parametricDifferentiationUnderstand.render(activity.activityId);
    } else if (customImplicitDifferentiationUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy();
      implicitDifferentiationUnderstand.render(activity.activityId);
    } else if (customTrigIdentitiesInverseUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy();
      trigIdentitiesInverseUnderstand.render(activity.activityId);
    } else if (customConnectedRatesUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); concavityInflectionUnderstand.destroy();
      connectedRatesUnderstand.render(activity.activityId);
    } else if (customStandardIntegralsUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); concavityInflectionUnderstand.destroy(); connectedRatesUnderstand.destroy();
      standardIntegralsUnderstand.render(activity.activityId);
    } else if (customReverseChainRuleUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); concavityInflectionUnderstand.destroy(); connectedRatesUnderstand.destroy(); standardIntegralsUnderstand.destroy();
      reverseChainRuleUnderstand.render(activity.activityId);
    } else if (customTrigIdentityIntegrationUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); concavityInflectionUnderstand.destroy(); connectedRatesUnderstand.destroy(); standardIntegralsUnderstand.destroy(); reverseChainRuleUnderstand.destroy();
      trigIdentityIntegrationUnderstand.render(activity.activityId);
    } else if (customSubstitutionUnderstand) {
      basicsUnderstand.destroy(); preCalculusUnderstand.destroy(); firstPrinciplesUnderstand.destroy(); tangentsNormalsUnderstand.destroy(); stationaryPointsUnderstand.destroy(); increasingDecreasingUnderstand.destroy(); integrationIntroUnderstand.destroy(); definiteIndefiniteUnderstand.destroy(); integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); concavityInflectionUnderstand.destroy(); connectedRatesUnderstand.destroy(); standardIntegralsUnderstand.destroy(); reverseChainRuleUnderstand.destroy(); trigIdentityIntegrationUnderstand.destroy();
      substitutionUnderstand.render(activity.activityId);
    } else {
      basicsUnderstand.destroy();
      preCalculusUnderstand.destroy();
      firstPrinciplesUnderstand.destroy();
      tangentsNormalsUnderstand.destroy();
      stationaryPointsUnderstand.destroy();
      increasingDecreasingUnderstand.destroy();
      integrationIntroUnderstand.destroy();
      definiteIndefiniteUnderstand.destroy();
  integrationAreaUnderstand.destroy(); signedAreaUnderstand.destroy(); standardFunctionsUnderstand.destroy(); trigFirstPrinciplesUnderstand.destroy(); productQuotientChainUnderstand.destroy(); parametricDifferentiationUnderstand.destroy(); implicitDifferentiationUnderstand.destroy(); trigIdentitiesInverseUnderstand.destroy(); standardIntegralsUnderstand.destroy(); reverseChainRuleUnderstand.destroy(); trigIdentityIntegrationUnderstand.destroy(); substitutionUnderstand.destroy();
    }
  }

  shell.dataset.activityIndex = String(activityIndex);
  shell.dataset.learningMode = activeMode;
  stage.dataset.learningMode = activeMode;
  if (activity.activityId) {
    progressStore.markVisited(activity.activityId, { topicId: currentTopicId, mode: activeMode });
  }
  syncYear12MasterySummary();
  syncFullDifferentiationMasterySummary();
  stage.scrollTop = 0;
  if (browserRouteReady) historyRouteController.scheduleWrite(currentActivityRoute());
}

function syncModeTabs({ focusActive = false } = {}) {
  let activeTab = null;
  const availableModes = new Set(currentTopicRuntime().availableModes);

  for (const tab of modeTabs) {
    const mode = tab.dataset.modeTab;
    const enabled = availableModes.has(mode);
    const selected = mode === activeMode;
    tab.disabled = !enabled;
    tab.setAttribute("aria-disabled", enabled ? "false" : "true");
    tab.setAttribute("aria-selected", selected ? "true" : "false");
    tab.setAttribute("tabindex", selected ? "0" : "-1");
    if (selected) activeTab = tab;
  }

  if (!activeTab) throw new Error(`No ModeTabs entry for mode: ${activeMode}`);
  modePanel.setAttribute("aria-labelledby", activeTab.id);
  if (focusActive) activeTab.focus();
}

export function selectMode(mode, { focusTab = false } = {}) {
  if (!learningModeOrder.includes(mode) || !currentTopicRuntime().availableModes.includes(mode)) return;

  activityIndexByTopicMode.set(topicModeKey(), activityIndex);
  activeMode = mode;
  root.dataset.learningMode = activeMode;
  syncModeTabs({ focusActive: focusTab });
  renderActivity(activityIndexByTopicMode.get(topicModeKey()) ?? 0);
}

function moveModeFocus(fromTab, key) {
  const enabledTabs = modeTabs.filter((tab) => !tab.disabled);
  const currentIndex = enabledTabs.indexOf(fromTab);
  if (currentIndex < 0 || enabledTabs.length === 0) return;

  let nextIndex = currentIndex;
  if (key === "ArrowRight") nextIndex = (currentIndex + 1) % enabledTabs.length;
  if (key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
  if (key === "Home") nextIndex = 0;
  if (key === "End") nextIndex = enabledTabs.length - 1;

  if (nextIndex !== currentIndex || key === "Home" || key === "End") {
    selectMode(enabledTabs[nextIndex].dataset.modeTab, { focusTab: true });
  }
}

for (const item of topicProgressItems) {
  item.addEventListener?.("click", () => {
    if (topicRuntime[item.dataset.topicId]) selectTopic(item.dataset.topicId);
  });
  if (item.getAttribute?.("role") === "button") item.addEventListener?.("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (topicRuntime[item.dataset.topicId]) selectTopic(item.dataset.topicId);
  });
}

for (const tab of modeTabs) {
  tab.addEventListener("click", () => selectMode(tab.dataset.modeTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    moveModeFocus(tab, event.key);
  });
}

classWizTrigger.addEventListener("click", openClassWizSupport);
classWizClose.addEventListener("click", () => closeClassWizSupport());
classWizScrim.addEventListener("click", () => closeClassWizSupport());

topicGoalsTrigger.addEventListener("click", openTopicGoals);
topicGoalsClose.addEventListener("click", closeTopicGoals);
topicGoalsDialog.addEventListener("close", () => {
  topicGoalsTrigger.setAttribute("aria-expanded", "false");
  topicGoalsTrigger.focus();
});

helpDrawerTrigger.addEventListener("click", openHelpDrawer);
helpDrawerClose.addEventListener("click", () => closeHelpDrawer());
helpDrawerScrim.addEventListener("click", () => closeHelpDrawer());
for (const link of helpTargetLinks) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    followHelpTarget(link.dataset.helpTarget);
  });
}

wordBankTrigger.addEventListener("click", () => openWordBank(null, wordBankTrigger));
wordBankClose.addEventListener("click", () => closeWordBank());
wordBankScrim.addEventListener("click", () => closeWordBank());
wordBankSearch.addEventListener("input", renderWordBank);
for (const button of wordBankFilterButtons) {
  button.addEventListener("click", () => {
    wordBankFilter = button.dataset.wordBankFilter;
    for (const candidate of wordBankFilterButtons) {
      const selected = candidate === button;
      candidate.classList?.toggle?.("is-active", selected);
      candidate.setAttribute("aria-pressed", selected ? "true" : "false");
    }
    renderWordBank();
  });
}
wordBankReviewToggle.addEventListener("click", () => {
  if (!wordBankSelectedTermId) return;
  vocabularyStore.toggleNeedsReview(wordBankSelectedTermId);
  renderWordBank();
});

dataManagementTrigger.addEventListener("click", openDataManagement);
exportProgressButton.addEventListener("click", downloadProgressExport);
importProgressFile.addEventListener("change", async () => {
  const file = importProgressFile.files?.[0];
  pendingImport = null;
  importPreview.hidden = true;
  if (!file) {
    importFilename.textContent = "No file selected";
    return;
  }
  importFilename.textContent = file.name;
  try {
    const text = await file.text();
    const inspection = localStateStore.inspectImport(text);
    pendingImport = { text, inspection };
    importPreviewSummary.textContent = `Version ${inspection.schemaVersion} · ${inspection.activityCount} activity records · ${inspection.vocabularyCount} Word Bank records. Importing will replace the current local data.`;
    importPreview.hidden = false;
    setDataStatus("File checked. Confirm to import it.");
  } catch (error) {
    setDataStatus(error.message ?? String(error), "error");
  }
});
confirmImportButton.addEventListener("click", () => {
  if (!pendingImport) return;
  localStateStore.importData(pendingImport.text);
  clearImportSelection();
  syncDataManagementSummary();
  setDataStatus("Progress data imported successfully.", "success");
});
resetProgressButton.addEventListener("click", () => {
  resetConfirmation.hidden = false;
  confirmResetButton.focus();
});
cancelResetButton.addEventListener("click", () => {
  resetConfirmation.hidden = true;
  resetProgressButton.focus();
});
confirmResetButton.addEventListener("click", () => {
  localStateStore.reset();
  resetConfirmation.hidden = true;
  clearImportSelection();
  syncDataManagementSummary();
  setDataStatus("Local progress and vocabulary records reset.", "success");
  resetProgressButton.focus();
});
dataManagementDialog.addEventListener("close", () => {
  resetConfirmation.hidden = true;
  clearImportSelection();
  setDataStatus("");
  (dataDialogReturnFocus ?? dataManagementTrigger).focus?.();
  dataDialogReturnFocus = null;
});

localStateStore.subscribe(() => {
  syncTopicProgress();
  syncWordBankCount();
  syncDataManagementSummary();
  if (wordBankOpen) renderWordBank();
});

topicNavigationToggle.addEventListener("click", openTopicNavigation);
topicNavigationClose.addEventListener("click", () => closeTopicNavigation());
navigationScrim.addEventListener("click", () => closeTopicNavigation());
previousButton.addEventListener("click", () => renderActivity(activityIndex - 1));
nextButton.addEventListener("click", () => renderActivity(activityIndex + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && classWizOpen) {
    event.preventDefault();
    closeClassWizSupport();
    return;
  }
  if (event.key === "Escape" && wordBankOpen) {
    event.preventDefault();
    closeWordBank();
    return;
  }
  if (event.key === "Escape" && helpOpen) {
    event.preventDefault();
    closeHelpDrawer();
    return;
  }
  if (event.key === "Escape" && navigationOpen) {
    event.preventDefault();
    closeTopicNavigation();
  }
});

if (typeof compactNavigationMedia.addEventListener === "function") {
  compactNavigationMedia.addEventListener("change", syncNavigationForViewport);
} else {
  compactNavigationMedia.addListener(syncNavigationForViewport);
}

window.addEventListener?.("popstate", () => {
  historyRouteController.restore(browserLocation.pathname, { focusStage: true });
});

const initialBrowserRoute = historyRouteController.resolve(browserLocation.pathname ?? "/");
if (initialBrowserRoute) {
  currentTopicId = initialBrowserRoute.topicId;
  activeMode = initialBrowserRoute.mode;
  activityIndex = initialBrowserRoute.activityIndex;
  activityIndexByTopicMode.set(topicModeKey(), activityIndex);
  root.dataset.learningMode = activeMode;
}

syncScopeBadges();
syncTopicProgress();
syncHelpTargets();
shell.dataset.classwizOpen = "false";
classWizScrim.hidden = true;
shell.dataset.helpOpen = "false";
helpDrawerScrim.hidden = true;
shell.dataset.wordBankOpen = "false";
wordBankScrim.hidden = true;
syncWordBankCount();
syncDataManagementSummary();
syncNavigationForViewport();
syncCurrentTopicChrome();
syncModeTabs();
renderActivity(activityIndexByTopicMode.get(topicModeKey()) ?? 0);
historyRouteController.replace(currentActivityRoute());
browserRouteReady = true;
