import { getClassWizModels, getClassWizSupportPack } from './classwiz-support-data.js';

function requireElement(root, selector) {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`ClassWizSupportPanel is missing ${selector}`);
  return element;
}

function setSelected(buttons, dataKey, value) {
  for (const button of buttons) {
    const selected = button.dataset[dataKey] === value;
    button.setAttribute('aria-selected', selected ? 'true' : 'false');
    button.setAttribute('tabindex', selected ? '0' : '-1');
  }
}

export function createClassWizSupportPanel({ element, topicId }) {
  const pack = getClassWizSupportPack(topicId);
  if (!pack) return null;

  const models = getClassWizModels();
  const useCaseTabs = Array.from(element.querySelectorAll('[data-classwiz-use-case]'));
  const modelTabs = Array.from(element.querySelectorAll('[data-classwiz-model]'));
  const helps = requireElement(element, '[data-classwiz-helps]');
  const example = requireElement(element, '[data-classwiz-example]');
  const radians = requireElement(element, '[data-classwiz-radians]');
  const steps = requireElement(element, '[data-classwiz-steps]');
  const doesNotReplace = requireElement(element, '[data-classwiz-does-not-replace]');
  const modelName = requireElement(element, '[data-classwiz-model-name]');

  let activeUseCaseId = pack.defaultUseCaseId;
  let activeModelId = pack.defaultModelId;

  function activeUseCase() {
    return pack.useCases.find((entry) => entry.id === activeUseCaseId) ?? pack.useCases[0];
  }

  function render() {
    const useCase = activeUseCase();
    const model = models[activeModelId];
    setSelected(useCaseTabs, 'classwizUseCase', useCase.id);
    setSelected(modelTabs, 'classwizModel', activeModelId);
    helps.textContent = useCase.helpsWith;
    example.textContent = useCase.example;
    radians.hidden = !useCase.radiansRequired;
    radians.textContent = useCase.radiansReminder;
    doesNotReplace.textContent = useCase.doesNotReplace;
    modelName.textContent = model.label;

    if (typeof document.createElement === 'function' && typeof steps.replaceChildren === 'function') {
      steps.replaceChildren();
      for (const [index, step] of useCase.models[activeModelId].entries()) {
        const row = document.createElement('li');
        row.className = 'classwiz-step';
        const number = document.createElement('span');
        number.className = 'classwiz-step__number';
        number.textContent = String(index + 1);
        const copy = document.createElement('span');
        copy.className = 'classwiz-step__copy';
        const label = document.createElement('strong');
        label.textContent = step.label;
        const text = document.createElement('span');
        text.textContent = step.text;
        copy.append(label, text);
        row.append(number, copy);
        steps.append(row);
      }
    } else {
      steps.textContent = useCase.models[activeModelId].map((step, index) => `${index + 1}. ${step.label}: ${step.text}`).join(' ');
    }
  }

  function moveTab(buttons, current, key, datasetKey, onChange) {
    const index = buttons.indexOf(current);
    if (index < 0) return;
    let next = index;
    if (key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (key === 'Home') next = 0;
    if (key === 'End') next = buttons.length - 1;
    if (next !== index || key === 'Home' || key === 'End') {
      onChange(buttons[next].dataset[datasetKey]);
      buttons[next].focus?.();
    }
  }

  function setUseCase(id) {
    if (!pack.useCases.some((entry) => entry.id === id)) return;
    activeUseCaseId = id;
    render();
  }

  function setModel(id) {
    if (!models[id]) return;
    activeModelId = id;
    render();
  }

  for (const button of useCaseTabs) {
    button.addEventListener('click', () => setUseCase(button.dataset.classwizUseCase));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      moveTab(useCaseTabs, button, event.key, 'classwizUseCase', setUseCase);
    });
  }

  for (const button of modelTabs) {
    button.addEventListener('click', () => setModel(button.dataset.classwizModel));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      moveTab(modelTabs, button, event.key, 'classwizModel', setModel);
    });
  }

  render();

  return Object.freeze({
    render,
    setUseCase,
    setModel,
    getState() {
      return Object.freeze({ activeUseCaseId, activeModelId });
    }
  });
}
