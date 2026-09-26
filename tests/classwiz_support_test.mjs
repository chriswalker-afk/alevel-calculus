import { getClassWizModels, getClassWizSupportPack, getClassWizUseCase } from '../src/scripts/classwiz-support-data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const pack = getClassWizSupportPack('topic:y12:differentiation:basics');
assert(pack, 'Basics should expose one ClassWiz support pack');
assert(pack.useCases.length === 2, 'Step 22 validation pack should include derivative and integral checks');
const models = getClassWizModels();
assert(models.cw.label === 'fx-991CW' && models.ex.label === 'fx-991EX', 'Both required calculator models should be available');

const derivative = getClassWizUseCase(pack.topicId, 'derivative-check');
const integral = getClassWizUseCase(pack.topicId, 'integral-check');
assert(derivative.radiansRequired === true, 'Trig derivative check should require a RADIAN reminder');
assert(integral.radiansRequired === false, 'Polynomial integral check should not show an irrelevant RADIAN warning');
for (const useCase of [derivative, integral]) {
  assert(useCase.helpsWith && useCase.doesNotReplace, 'Every use case needs help and does-not-replace guidance');
  for (const modelId of ['cw', 'ex']) {
    assert(Array.isArray(useCase.models[modelId]) && useCase.models[modelId].length >= 4, `Missing ${modelId} steps for ${useCase.id}`);
  }
}
assert(derivative.models.cw.some((step) => step.text.includes('Func Analysis')), 'fx-991CW derivative steps should use the Function Analysis menu');
assert(derivative.models.ex.some((step) => step.text.includes('SHIFT')), 'fx-991EX derivative steps should identify the shifted d/dx key');
assert(integral.models.cw.some((step) => step.text.includes('Integration')), 'fx-991CW integral steps should identify the Integration command');
assert(integral.models.ex.some((step) => step.text.includes('integral key')), 'fx-991EX integral steps should identify the integral key');

console.log('PASS ClassWiz support pack model-specific derivative/integral guidance and conditional RADIAN reminder');
