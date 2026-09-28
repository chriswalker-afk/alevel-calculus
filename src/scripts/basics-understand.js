import {
  LinkedFunctionGradientExplorer,
  POLYNOMIAL_FUNCTIONS,
  createPolynomialFunctionDefinition,
  derivativeCoefficients,
  parsePolynomialExpression,
  polynomialToText
} from './linked-function-gradient-explorer.js?v=auditstep3';

const STEP33_IDS = new Set([
  'activity:y12:differentiation:basics:understand:curve-tangent-gradient',
  'activity:y12:differentiation:basics:understand:gradient-function',
  'activity:y12:differentiation:basics:understand:polynomial-explorer',
  'activity:y12:differentiation:basics:understand:derivative-notation',
  'activity:y12:differentiation:basics:understand:differentiation-machine',
  'activity:y12:differentiation:basics:understand:calculus-backstory',
  'activity:y12:differentiation:basics:understand:power-rule-pattern',
  'activity:y12:differentiation:basics:understand:term-by-term'
]);

const powerExamples = Object.freeze([
  { input: 'x', output: '1', coefficient: 1, power: 1 },
  { input: 'x²', output: '2x', coefficient: 1, power: 2 },
  { input: 'x³', output: '3x²', coefficient: 1, power: 3 },
  { input: 'x⁴', output: '4x³', coefficient: 1, power: 4 },
  { input: '5x³', output: '15x²', coefficient: 5, power: 3 }
]);

function el(doc, tag, className = '', text = '') {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(doc, label, onClick, className = 'basics-understand__button') {
  const node = el(doc, 'button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

function format(value, digits = 2) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(digits));
  return String(rounded);
}

function signedGradientMessage(gradient) {
  if (Math.abs(gradient) < 0.08) return 'The tangent is horizontal, so the gradient is about 0.';
  if (gradient > 0) return `The curve is increasing here, so the gradient is positive (${format(gradient)}).`;
  return `The curve is decreasing here, so the gradient is negative (${format(gradient)}).`;
}

function differentiationMachineResult(key) {
  return ({
    'x3': ['x³', '3x²'],
    '4x2': ['4x²', '8x'],
    '5x-7': ['5x − 7', '5'],
    '2x4+3x': ['2x⁴ + 3x', '8x³ + 3']
  })[key] ?? ['x³', '3x²'];
}

function polynomialMagnitudeBound(coefficients, radius) {
  return coefficients.reduce((sum, coefficient, power) => sum + Math.abs(Number(coefficient) || 0) * radius ** power, 0);
}

function buildPolynomialDefinition(coefficients) {
  const degree = Math.max(0, coefficients.length - 1);
  const radius = degree >= 5 ? 2 : 3;
  const first = derivativeCoefficients(coefficients);
  const second = derivativeCoefficients(first);
  const extent = Math.max(8, polynomialMagnitudeBound(coefficients, radius) * 1.08);
  const dExtent = Math.max(8, polynomialMagnitudeBound(first, radius) * 1.08);
  const ddExtent = Math.max(8, polynomialMagnitudeBound(second, radius) * 1.08);
  return createPolynomialFunctionDefinition({
    id: 'student-polynomial',
    label: polynomialToText(coefficients),
    coefficients,
    xDomain: [-radius, radius],
    yDomains: { function: [-extent, extent], derivative: [-dExtent, dExtent], secondDerivative: [-ddExtent, ddExtent] },
    initialX: Math.min(0.5, radius)
  });
}

export class BasicsUnderstandExperience {
  constructor(host, { onStateChange = () => {} } = {}) {
    if (!host) throw new Error('BasicsUnderstandExperience requires a DOM host.');
    this.host = host;
    this.document = host.ownerDocument || globalThis.document;
    this.onStateChange = onStateChange;
    this.explorer = null;
    this.cleanup = [];
    this.state = { activityId: null };
  }

  supports(activityId) { return STEP33_IDS.has(activityId); }

  destroy() {
    this.#destroyExplorer();
    for (const cleanup of this.cleanup.splice(0)) cleanup();
    this.host.replaceChildren();
    this.host.classList.remove('basics-understand');
    delete this.host.dataset.basicsActivity;
  }

  render(activityId) {
    if (!this.supports(activityId)) return false;
    this.#destroyExplorer();
    for (const cleanup of this.cleanup.splice(0)) cleanup();
    this.host.classList.add('basics-understand');
    this.host.replaceChildren();
    this.state.activityId = activityId;
    const slug = activityId.split(':').at(-1);
    this.host.dataset.basicsActivity = slug.replaceAll('-', '_');
    const renderer = this[`render_${this.host.dataset.basicsActivity}`];
    if (typeof renderer !== 'function') throw new Error(`No Understand renderer for ${activityId}`);
    renderer.call(this);
    this.onStateChange({ activityId });
    return true;
  }

  #destroyExplorer() {
    this.explorer?.destroy();
    this.explorer = null;
  }

  #panel(title, eyebrow) {
    const panel = el(this.document, 'section', 'basics-understand__panel');
    const header = el(this.document, 'div', 'basics-understand__panel-header');
    header.append(el(this.document, 'span', 'basics-understand__eyebrow', eyebrow), el(this.document, 'h3', '', title));
    const body = el(this.document, 'div', 'basics-understand__panel-body');
    panel.append(header, body);
    this.host.append(panel);
    return body;
  }

  #mountExplorer(body, options = {}) {
    const graphHost = el(this.document, 'div', 'basics-understand__graph-host');
    body.append(graphHost);
    this.explorer = new LinkedFunctionGradientExplorer(graphHost, {
      allowSecondDerivative: false,
      ...options
    });
    return this.explorer;
  }

  render_curve_tangent_gradient() {
    const body = this.#panel('Move the point. Read the tangent.', '1 · Gradient on a curve');
    const prompt = el(this.document, 'div', 'basics-understand__prompt', 'Before looking at the number, decide: positive, negative or zero gradient?');
    const insight = el(this.document, 'p', 'basics-understand__insight');
    body.append(prompt, insight);
    this.#mountExplorer(body, {
      functions: POLYNOMIAL_FUNCTIONS,
      initialFunctionId: 'cubic-turns',
      revealDerivative: false,
      showFunctionSelector: true,
      showDerivativeControls: false,
      showDerivativeReadout: false,
      onChange: ({ values }) => { insight.textContent = signedGradientMessage(values.derivative); }
    });
    insight.textContent = 'Move the point to compare upward, downward and horizontal tangents.';
  }

  render_gradient_function() {
    const body = this.#panel('Build f′(x) from tangent gradients', '2 · Gradient function');
    const instruction = el(this.document, 'p', 'basics-understand__instruction', 'Each marked point on the lower graph has height = tangent gradient on the upper graph. Add samples first; reveal the complete curve only after you have a prediction.');
    body.append(instruction);
    const controls = el(this.document, 'div', 'basics-understand__action-row');
    const sampleStatus = el(this.document, 'span', 'basics-understand__status', '0 gradient points plotted');
    sampleStatus.setAttribute('role', 'status');
    sampleStatus.setAttribute('aria-live', 'polite');
    body.append(controls);
    const explorer = this.#mountExplorer(body, {
      functions: [POLYNOMIAL_FUNCTIONS.find((item) => item.id === 'quadratic-bowl')],
      revealDerivative: false,
      showFunctionSelector: false,
      derivativeSamples: [],
      derivativePanelVisible: true,
      showDerivativeControls: false,
      showDerivativeReadout: false
    });
    const sampleXs = [];
    const addSample = () => {
      const x = explorer.getState().x;
      if (!sampleXs.some((value) => Math.abs(value - x) < 0.08)) sampleXs.push(x);
      explorer.setDerivativeSamples(sampleXs);
      sampleStatus.textContent = `${sampleXs.length} gradient point${sampleXs.length === 1 ? '' : 's'} plotted`;
    };
    controls.append(
      button(this.document, 'Plot this gradient point', addSample),
      button(this.document, 'Reveal complete f′(x)', () => explorer.setDerivativeVisible(true), 'basics-understand__button basics-understand__button--primary'),
      sampleStatus
    );
    const takeaway = el(this.document, 'div', 'basics-understand__takeaway', 'Key idea: the height of f′(x) is the gradient of f(x), not the height of f(x).');
    body.append(takeaway);
  }

  render_polynomial_explorer() {
    const body = this.#panel('Type a polynomial; keep the meaning', '3 · Polynomial explorer');

    const entry = el(this.document, 'div', 'basics-understand__polynomial-entry');
    const entryLabel = el(this.document, 'label', 'basics-understand__polynomial-label');
    entryLabel.append(el(this.document, 'span', '', 'Type a polynomial'));
    const expressionInput = el(this.document, 'input', 'basics-understand__polynomial-input');
    expressionInput.type = 'text';
    expressionInput.value = 'x^3 - 3x';
    expressionInput.placeholder = 'e.g. 3x^4 - 2x + 7';
    expressionInput.autocomplete = 'off';
    expressionInput.spellcheck = false;
    expressionInput.setAttribute('aria-describedby', 'polynomial-entry-help polynomial-entry-status');
    entryLabel.append(expressionInput);

    const apply = button(this.document, 'Use this polynomial', () => applyTypedPolynomial(), 'basics-understand__button basics-understand__button--primary');
    const help = el(this.document, 'p', 'basics-understand__polynomial-help', 'Use x with whole-number powers up to 6. Examples: 3x^4 − 2x + 7, −x⁶ + 0.5x², or y = 2x³ − x.');
    help.id = 'polynomial-entry-help';
    const status = el(this.document, 'p', 'basics-understand__status', 'Showing f(x) = x^3 − 3x.');
    status.id = 'polynomial-entry-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    entry.append(entryLabel, apply, help, status);
    body.append(entry);

    const coefficientDetails = el(this.document, 'details', 'basics-understand__coefficient-details');
    const coefficientSummary = el(this.document, 'summary', 'basics-understand__coefficient-summary', 'Or edit the coefficients');
    coefficientSummary.setAttribute('aria-label', 'Open coefficient editor');
    const coefficientEditor = el(this.document, 'div', 'basics-understand__coefficient-editor');
    const fallbackLabel = el(this.document, 'div', 'basics-understand__coefficient-heading');
    fallbackLabel.append(
      el(this.document, 'strong', '', 'Coefficient editor'),
      el(this.document, 'span', '', 'Optional: these controls update the same polynomial.')
    );
    coefficientEditor.append(fallbackLabel);

    const controls = el(this.document, 'div', 'basics-understand__coefficients');
    const coefficients = [0, -3, 0, 1, 0, 0, 0];
    const inputs = [];
    ['constant', 'x', 'x²', 'x³', 'x⁴', 'x⁵', 'x⁶'].forEach((label, index) => {
      const wrapper = el(this.document, 'label', 'basics-understand__coefficient');
      wrapper.append(el(this.document, 'span', '', label));
      const input = el(this.document, 'input');
      input.type = 'number';
      input.step = '0.5';
      input.min = '-20';
      input.max = '20';
      input.value = String(coefficients[index]);
      input.setAttribute('aria-label', `Coefficient of ${label}`);
      wrapper.append(input);
      controls.append(wrapper);
      inputs.push(input);
    });
    coefficientEditor.append(controls);
    coefficientDetails.append(coefficientSummary, coefficientEditor);
    body.append(coefficientDetails);

    const graphHost = el(this.document, 'div', 'basics-understand__graph-host');
    body.append(graphHost);

    const mount = (next) => {
      this.#destroyExplorer();
      const definition = buildPolynomialDefinition(next);
      this.explorer = new LinkedFunctionGradientExplorer(graphHost, {
        functions: [definition],
        revealDerivative: true,
        allowSecondDerivative: false,
        showFunctionSelector: false,
        showDerivativeControls: false
      });
    };

    const syncCoefficientInputs = (next) => {
      inputs.forEach((input, index) => {
        input.value = String(next[index] ?? 0);
      });
    };

    const applyTypedPolynomial = () => {
      try {
        const parsed = parsePolynomialExpression(expressionInput.value, { maxDegree: 6, maxCoefficient: 20 });
        expressionInput.setAttribute('aria-invalid', 'false');
        expressionInput.value = parsed.canonicalText;
        syncCoefficientInputs(parsed.coefficients);
        mount(parsed.coefficients);
        status.textContent = `Showing f(x) = ${parsed.canonicalText}. Move the tangent and compare it with f′(x).`;
      } catch (error) {
        expressionInput.setAttribute('aria-invalid', 'true');
        status.textContent = error instanceof Error ? error.message : 'Check the polynomial and try again.';
      }
    };

    const typedKeydown = (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      applyTypedPolynomial();
    };
    expressionInput.addEventListener('keydown', typedKeydown);
    this.cleanup.push(() => expressionInput.removeEventListener('keydown', typedKeydown));

    for (const input of inputs) {
      const listener = () => {
        const next = inputs.map((field) => Math.max(-20, Math.min(20, Number(field.value) || 0)));
        expressionInput.value = polynomialToText(next);
        expressionInput.setAttribute('aria-invalid', 'false');
        status.textContent = `Showing f(x) = ${expressionInput.value}. The coefficient controls and typed expression describe the same polynomial.`;
        mount(next);
      };
      input.addEventListener('change', listener);
      this.cleanup.push(() => input.removeEventListener('change', listener));
    }

    applyTypedPolynomial();
  }

  render_derivative_notation() {
    const body = this.#panel('Same derivative, different emphasis', '4 · Derivative notation');
    const grid = el(this.document, 'div', 'basics-understand__notation-grid');
    const cards = [
      ['f′(x)', 'Function notation', 'Names the new function that gives the gradient of f at each x-value.'],
      ['dy/dx', 'Rate notation', 'Emphasises how y changes with respect to x. It represents the derivative itself.'],
      ['d/dx ( · )', 'Operator notation', 'An instruction: differentiate the expression inside the brackets with respect to x.']
    ];
    cards.forEach(([formula, title, copy]) => {
      const card = el(this.document, 'article', 'basics-understand__notation-card');
      card.append(el(this.document, 'div', 'basics-understand__notation-formula', formula), el(this.document, 'strong', '', title), el(this.document, 'p', '', copy));
      grid.append(card);
    });
    body.append(grid, el(this.document, 'div', 'basics-understand__equivalence', 'd/dx [ f(x) ] = f′(x)   and   d/dx (y) = dy/dx'));
  }

  render_differentiation_machine() {
    const body = this.#panel('Put an expression inside the operator', '5 · The d/dx machine');
    const machine = el(this.document, 'div', 'basics-understand__machine');
    const select = el(this.document, 'select', 'basics-understand__machine-select');
    [['x3','x³'],['4x2','4x²'],['5x-7','5x − 7'],['2x4+3x','2x⁴ + 3x']].forEach(([value,label]) => { const option=el(this.document,'option','',label); option.value=value; select.append(option); });
    select.setAttribute('aria-label', 'Expression to differentiate');
    const inputBox = el(this.document, 'div', 'basics-understand__machine-box');
    const operator = el(this.document, 'div', 'basics-understand__machine-operator', 'd/dx'); operator.setAttribute('data-math-render','');
    const arrow = el(this.document, 'div', 'basics-understand__machine-arrow', '→');
    const output = el(this.document, 'div', 'basics-understand__machine-box basics-understand__machine-box--output');
    output.setAttribute('role', 'status');
    output.setAttribute('aria-live', 'polite');
    const update = () => { const [input, result] = differentiationMachineResult(select.value); inputBox.textContent = `[ ${input} ]`; output.textContent = result; };
    select.addEventListener('change', update); this.cleanup.push(() => select.removeEventListener('change', update)); update();
    machine.append(select, inputBox, operator, arrow, output);
    body.append(machine, el(this.document, 'p', 'basics-understand__takeaway', 'The operator acts on the whole expression inside the brackets. The output is the derivative.'));
  }

  render_calculus_backstory() {
    const body = this.#panel('Why do we have several notations?', '6 · Calculus has a backstory');
    const timeline = el(this.document, 'div', 'basics-understand__timeline');
    [
      ['Newton', 'Fluxions and dot notation', 'Thought about quantities changing with time; his dot notation survives strongly in mechanics.'],
      ['Leibniz', 'dx, dy and dy/dx', 'Created notation that makes “with respect to x” and rates of change highly visible.'],
      ['Lagrange', 'f′(x)', 'Prime notation gives a compact name to the derivative function.']
    ].forEach(([name, notation, copy]) => { const item=el(this.document,'article','basics-understand__timeline-item'); item.append(el(this.document,'strong','',name),el(this.document,'span','basics-understand__timeline-notation',notation),el(this.document,'p','',copy)); timeline.append(item); });
    body.append(timeline, el(this.document, 'p', 'basics-understand__history-note', 'Newton and Leibniz developed calculus independently. A bitter priority dispute followed, including plagiarism accusations and a Royal Society investigation closely connected to Newton. The mathematics survived; so did more than one useful notation.'));
  }

  render_power_rule_pattern() {
    const body = this.#panel('Notice what changes each time', '7 · See the power-rule pattern');
    const list = el(this.document, 'div', 'basics-understand__pattern-list');
    powerExamples.forEach(({ input, output }) => {
      const row = el(this.document, 'div', 'basics-understand__pattern-row');
      row.append(el(this.document, 'span', 'basics-understand__pattern-input basics-understand__math', `d/dx [ ${input} ]`), el(this.document, 'span', 'basics-understand__machine-arrow', '→'), el(this.document, 'span', 'basics-understand__pattern-output', output)); list.append(row);
    });
    const rule = el(this.document, 'div', 'basics-understand__rule-reveal basics-understand__math');
    const reveal = button(this.document, 'Reveal the general rule', () => { rule.hidden = false; reveal.disabled = true; }, 'basics-understand__button basics-understand__button--primary');
    rule.hidden = true; rule.textContent = 'd/dx (a xⁿ) = a n xⁿ⁻¹  — multiply by the old power, then reduce the power by 1.';
    body.append(list, reveal, rule);
  }

  render_term_by_term() {
    const body = this.#panel('A sum differentiates one term at a time', '8 · Term by term');
    const expression = el(this.document, 'div', 'basics-understand__term-expression', 'y = 3x⁴ − 2x² + 5x − 7');
    const row = el(this.document, 'div', 'basics-understand__term-row');
    ['3x⁴ → 12x³', '−2x² → −4x', '+5x → +5', '−7 → 0'].forEach((text) => row.append(el(this.document, 'div', 'basics-understand__term-card', text)));
    const result = el(this.document, 'div', 'basics-understand__term-result basics-understand__math', 'dy/dx = 12x³ − 4x + 5');
    body.append(expression, row, result, el(this.document, 'p', 'basics-understand__takeaway', 'For sums and differences, differentiate each term separately, then put the differentiated terms back together.'));
  }
}

export function createBasicsUnderstandExperience(host, options) {
  return new BasicsUnderstandExperience(host, options);
}

export { STEP33_IDS as BASICS_UNDERSTAND_ACTIVITY_IDS };
