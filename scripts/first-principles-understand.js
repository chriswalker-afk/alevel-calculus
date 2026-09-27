import { ChordToTangentExplorer, calculateChordState, formatChordNumber } from './chord-to-tangent-explorer.js';
import { createPolynomialFunctionDefinition } from './linked-function-gradient-explorer.js';
import { renderEquationSteps } from './equation-step-renderer.js';

const STEP38_IDS = new Set([
  'activity:y12:differentiation:first-principles:understand:limit-intuition',
  'activity:y12:differentiation:first-principles:understand:simple-limits',
  'activity:y12:differentiation:first-principles:understand:two-points',
  'activity:y12:differentiation:first-principles:understand:chord-approximation',
  'activity:y12:differentiation:first-principles:understand:h-to-zero',
  'activity:y12:differentiation:first-principles:understand:formal-definition',
  'activity:y12:differentiation:first-principles:understand:derive-x2',
  'activity:y12:differentiation:first-principles:understand:derive-x3',
  'activity:y12:differentiation:first-principles:understand:proof-vs-use'
]);

const X_SQUARED = createPolynomialFunctionDefinition({
  id: 'first-principles-x2',
  label: 'Quadratic: x²',
  coefficients: [0, 0, 1],
  xDomain: [-2.5, 3.5],
  yDomains: { function: [-1, 9], derivative: [-5, 7], secondDerivative: [-1, 4] },
  initialX: 1,
  description: 'Simple quadratic used to connect chord gradients to the derivative.'
});

const X_CUBED = createPolynomialFunctionDefinition({
  id: 'first-principles-x3',
  label: 'Cubic: x³',
  coefficients: [0, 0, 0, 1],
  xDomain: [-2.1, 2.1],
  yDomains: { function: [-9, 9], derivative: [-1, 13], secondDerivative: [-13, 13] },
  initialX: 1,
  description: 'Simple cubic used to compare the chord and tangent.'
});

const H_SEQUENCE = Object.freeze([1, 0.5, 0.1, 0.01]);

const X2_STEPS = Object.freeze([
  { id: 'x2-start', kind: 'working', label: 'Start with the definition', expression: "f′(x) = lim_(h→0) [(f(x+h) − f(x))/h]", explanation: 'For f(x)=x², first find f(x+h).' },
  { id: 'x2-substitute', kind: 'working', label: 'Substitute f(x)=x²', expression: "f′(x) = lim_(h→0) [((x+h)² − x²)/h]", explanation: 'The two function values are the heights of Q and P.' },
  { id: 'x2-expand', kind: 'working', label: 'Expand', expression: "= lim_(h→0) [(x² + 2xh + h² − x²)/h]", explanation: 'Expand before trying to cancel anything.' },
  { id: 'x2-simplify', kind: 'working', label: 'Simplify the numerator', expression: '= lim_(h→0) [(2xh + h²)/h]', explanation: 'Both remaining terms contain a factor h.' },
  { id: 'x2-cancel', kind: 'reasoning', label: 'Cancel h while h ≠ 0', expression: '= lim_(h→0) (2x + h)', explanation: 'During the approach h is non-zero, so the common factor can be cancelled.' },
  { id: 'x2-limit', kind: 'result', label: 'Now take the limit', expression: "f′(x) = 2x", explanation: 'As h approaches 0, 2x+h approaches 2x. This matches the power rule.' }
]);

const X3_STEPS = Object.freeze([
  { id: 'x3-start', kind: 'working', label: 'Start with the definition', expression: "f′(x) = lim_(h→0) [((x+h)³ − x³)/h]", explanation: 'Substitute f(x)=x³ into the same difference quotient.' },
  { id: 'x3-expand', kind: 'working', label: 'Expand (x+h)³', expression: '= lim_(h→0) [(x³ + 3x²h + 3xh² + h³ − x³)/h]', explanation: 'The x³ terms cancel.' },
  { id: 'x3-simplify', kind: 'working', label: 'Simplify', expression: '= lim_(h→0) [(3x²h + 3xh² + h³)/h]', explanation: 'Every term in the numerator contains h.' },
  { id: 'x3-cancel', kind: 'reasoning', label: 'Cancel h while h ≠ 0', expression: '= lim_(h→0) (3x² + 3xh + h²)', explanation: 'The difference quotient is now ready for the limiting step.' },
  { id: 'x3-limit', kind: 'result', label: 'Now take the limit', expression: "f′(x) = 3x²", explanation: 'The h terms approach zero, leaving 3x²: again the familiar power-rule result.' }
]);

function el(doc, tag, className = '', text = '') {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(doc, label, onClick, className = 'first-principles-understand__button') {
  const node = el(doc, 'button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

function formatLimitValue(value) {
  if (Math.abs(value) >= 0.1) return String(Number(value.toFixed(3)));
  return String(Number(value.toFixed(5)));
}

function createLimitTable(doc, hValues = [1, 0.5, 0.1, 0.01, 0.001]) {
  const table = el(doc, 'table', 'first-principles-understand__table');
  const caption = el(doc, 'caption', '', 'Outputs as h approaches 0');
  const head = el(doc, 'thead');
  const headRow = el(doc, 'tr');
  ['h', '3 + h', '2 + h²'].forEach((label) => headRow.append(el(doc, 'th', '', label)));
  head.append(headRow);
  const body = el(doc, 'tbody');
  hValues.forEach((h) => {
    const row = el(doc, 'tr');
    [h, 3 + h, 2 + h * h].forEach((value) => row.append(el(doc, 'td', '', formatLimitValue(value))));
    body.append(row);
  });
  table.append(caption, head, body);
  return table;
}

export class FirstPrinciplesUnderstandExperience {
  constructor(host) {
    if (!host) throw new Error('FirstPrinciplesUnderstandExperience requires a DOM host.');
    this.host = host;
    this.document = host.ownerDocument || globalThis.document;
    this.explorer = null;
    this.cleanup = [];
  }

  supports(activityId) { return STEP38_IDS.has(activityId); }

  destroy() {
    this.explorer?.destroy();
    this.explorer = null;
    for (const cleanup of this.cleanup.splice(0)) cleanup();
    this.host.replaceChildren();
    this.host.classList.remove('first-principles-understand');
  }

  render(activityId) {
    if (!this.supports(activityId)) return false;
    this.destroy();
    this.host.classList.add('first-principles-understand');
    const slug = activityId.split(':').at(-1).replaceAll('-', '_');
    const renderer = this[`render_${slug}`];
    if (typeof renderer !== 'function') throw new Error(`No First-principles renderer for ${activityId}`);
    renderer.call(this);
    return true;
  }

  #panel(title, eyebrow) {
    const panel = el(this.document, 'section', 'first-principles-understand__panel');
    const header = el(this.document, 'div', 'first-principles-understand__panel-header');
    header.append(el(this.document, 'span', 'first-principles-understand__eyebrow', eyebrow), el(this.document, 'h3', '', title));
    const body = el(this.document, 'div', 'first-principles-understand__panel-body');
    panel.append(header, body);
    this.host.append(panel);
    return body;
  }

  #status(body, text = '') {
    const status = el(this.document, 'p', 'first-principles-understand__status', text);
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    body.append(status);
    return status;
  }

  #mountExplorer(body, {
    functions = [X_SQUARED, X_CUBED],
    initialFunctionId = functions[0].id,
    pX = 1,
    initialH = 1,
    informationMode = 'full',
    showFunctionSelector = true,
    onChange = () => {}
  } = {}) {
    const graphHost = el(this.document, 'div', 'first-principles-understand__graph-host');
    body.append(graphHost);
    this.explorer = new ChordToTangentExplorer(graphHost, {
      functions,
      initialFunctionId,
      pX,
      initialH,
      minAbsH: 0.01,
      informationMode,
      showFunctionSelector,
      showInformationSelector: false,
      onChange
    });
    // Continuous dragging updates the visual/readout, but should not spam assistive technology.
    this.explorer.readout?.setAttribute('aria-live', 'off');
    return this.explorer;
  }

  #renderStepReveal(body, steps, resultReminder) {
    const controls = el(this.document, 'div', 'first-principles-understand__action-row');
    const stepHost = el(this.document, 'div', 'first-principles-understand__steps');
    const status = this.#status(body, 'Step 1 is shown. Reveal the algebra only when the current line makes sense.');
    body.insertBefore(controls, status);
    body.insertBefore(stepHost, status);
    let visibleCount = 1;
    const render = () => {
      renderEquationSteps(stepHost, steps.slice(0, visibleCount));
      const current = stepHost.querySelector?.('.equation-step:last-child');
      current?.classList?.add('first-principles-understand__current-step');
      previous.disabled = visibleCount <= 1;
      next.disabled = visibleCount >= steps.length;
      status.textContent = visibleCount >= steps.length ? resultReminder : `Showing step ${visibleCount} of ${steps.length}. Explain this line before revealing the next.`;
    };
    const previous = button(this.document, 'Previous step', () => { visibleCount = Math.max(1, visibleCount - 1); render(); });
    const next = button(this.document, 'Reveal next step', () => { visibleCount = Math.min(steps.length, visibleCount + 1); render(); }, 'first-principles-understand__button first-principles-understand__button--primary');
    controls.append(previous, next);
    render();
  }

  render_limit_intuition() {
    const body = this.#panel('Get close to zero without using zero', '1 · Approaching a value');
    const sequence = el(this.document, 'div', 'first-principles-understand__sequence');
    const value = el(this.document, 'strong', 'first-principles-understand__limit-value', 'h = 1');
    const distance = el(this.document, 'span', 'first-principles-understand__distance', 'distance from 0 = 1');
    const track = el(this.document, 'div', 'first-principles-understand__limit-track');
    const marker = el(this.document, 'span', 'first-principles-understand__limit-marker');
    track.append(marker);
    sequence.append(value, distance, track);
    const controls = el(this.document, 'div', 'first-principles-understand__choice-row');
    const status = this.#status(body, 'Choose successively smaller positive values of h.');
    body.insertBefore(sequence, status);
    body.insertBefore(controls, status);
    [1, 0.5, 0.1, 0.01, 0.001].forEach((h) => {
      const choice = button(this.document, String(h), () => {
        value.textContent = `h = ${h}`;
        distance.textContent = `distance from 0 = ${h}`;
        marker.style.left = `${Math.max(2, Math.min(98, h * 96))}%`;
        status.textContent = h <= 0.01 ? `${h} is extremely close to 0, but it is still not 0.` : `${h} is closer to 0 than the previous larger values.`;
        for (const candidate of controls.querySelectorAll?.('button') ?? []) candidate.setAttribute('aria-pressed', candidate === choice ? 'true' : 'false');
      });
      choice.setAttribute('aria-pressed', h === 1 ? 'true' : 'false');
      controls.append(choice);
    });
    marker.style.left = '96%';
    body.append(el(this.document, 'div', 'first-principles-understand__takeaway', 'Read h → 0 as “h approaches 0”. The arrow describes a process, not an instruction to substitute h = 0 immediately.'));
  }

  render_simple_limits() {
    const body = this.#panel('See what the output approaches', '2 · Basic limit examples');
    const controls = el(this.document, 'div', 'first-principles-understand__action-row');
    const readout = el(this.document, 'div', 'first-principles-understand__limit-readout');
    const hLabel = el(this.document, 'strong', '', 'h = 1');
    const outputA = el(this.document, 'span', '', '3 + h = 4');
    const outputB = el(this.document, 'span', '', '2 + h² = 3');
    readout.append(hLabel, outputA, outputB);
    const input = el(this.document, 'input', 'first-principles-understand__range');
    input.type = 'range'; input.min = '-3'; input.max = '0'; input.step = '0.01'; input.value = '0';
    input.setAttribute('aria-label', 'Choose the size of positive h on a logarithmic scale');
    const update = () => {
      const h = 10 ** Number(input.value);
      hLabel.textContent = `h = ${formatLimitValue(h)}`;
      outputA.textContent = `3 + h = ${formatLimitValue(3 + h)}`;
      outputB.textContent = `2 + h² = ${formatLimitValue(2 + h * h)}`;
    };
    input.addEventListener('input', update);
    this.cleanup.push(() => input.removeEventListener('input', update));
    controls.append(input);
    body.append(controls, readout, createLimitTable(this.document), el(this.document, 'div', 'first-principles-understand__takeaway', 'As h → 0, the first output approaches 3 and the second approaches 2. That is all the limit language we need for now.'));
  }

  render_two_points() {
    const body = this.#panel('A location is not yet a gradient', '3 · Why two points?');
    const cards = el(this.document, 'div', 'first-principles-understand__point-grid');
    const pCard = el(this.document, 'article', 'first-principles-understand__point-card');
    pCard.append(el(this.document, 'span', 'first-principles-understand__point-label', 'Fixed point P'), el(this.document, 'strong', '', 'P = (x, f(x))'), el(this.document, 'p', '', 'One point tells us where we are on the curve, but one point alone cannot define the gradient of a straight line.'));
    const qCard = el(this.document, 'article', 'first-principles-understand__point-card first-principles-understand__point-card--accent');
    qCard.append(el(this.document, 'span', 'first-principles-understand__point-label', 'Nearby point Q'), el(this.document, 'strong', '', 'Q = (x + h, f(x + h))'), el(this.document, 'p', '', 'Q is h units away horizontally. Now P and Q define a chord, so we can calculate a straight-line gradient.'));
    cards.append(pCard, qCard);
    const quotient = el(this.document, 'div', 'first-principles-understand__difference-quotient');
    quotient.append(el(this.document, 'span', '', 'vertical change'), el(this.document, 'strong', '', '[f(x + h) − f(x)] / h'), el(this.document, 'span', '', 'horizontal change = h'));
    body.append(cards, quotient, el(this.document, 'div', 'first-principles-understand__takeaway', 'The line through P and Q is called a chord or secant. Its gradient is an approximation to the gradient we want at P.'));
  }

  render_chord_approximation() {
    const body = this.#panel('Drag Q and watch the geometry', '4 · Chord approximation');
    const insight = el(this.document, 'p', 'first-principles-understand__insight', 'Start with Q away from P. Then move it closer from either side.');
    body.append(insight);
    const explorer = this.#mountExplorer(body, {
      informationMode: 'full',
      initialH: 1,
      onChange: ({ values }) => {
        const gap = Math.abs(values.gradientError);
        insight.textContent = `|chord gradient − tangent gradient| = ${formatChordNumber(gap)}. ${gap < 0.05 ? 'The two lines now have almost the same gradient.' : 'Move Q closer to P and compare again.'}`;
      }
    });
    const initial = explorer.getChordState();
    insight.textContent = `Chord gradient = ${formatChordNumber(initial.chordGradient)}; tangent gradient = ${formatChordNumber(initial.tangentGradient)}. Move Q closer to P.`;
  }

  render_h_to_zero() {
    const body = this.#panel('Shrink h in a deliberate sequence', '5 · h → 0');
    const controls = el(this.document, 'div', 'first-principles-understand__choice-row');
    const status = this.#status(body, 'Start with h = 1, then move through the sequence towards 0.');
    body.insertBefore(controls, status);
    const explorer = this.#mountExplorer(body, { functions: [X_SQUARED], showFunctionSelector: false, initialH: 1, informationMode: 'full' });
    const table = el(this.document, 'table', 'first-principles-understand__table first-principles-understand__table--sequence');
    const caption = el(this.document, 'caption', '', 'For f(x)=x² at P where x=1');
    const head = el(this.document, 'thead'); const row = el(this.document, 'tr');
    ['h', 'Chord gradient', 'Tangent gradient'].forEach((label) => row.append(el(this.document, 'th', '', label))); head.append(row);
    const tbody = el(this.document, 'tbody');
    H_SEQUENCE.forEach((h) => {
      const values = calculateChordState(X_SQUARED, 1, 1 + h);
      const tr = el(this.document, 'tr'); tr.dataset.h = String(h);
      [h, values.chordGradient, values.tangentGradient].forEach((value) => tr.append(el(this.document, 'td', '', formatChordNumber(value))));
      tbody.append(tr);
      const choice = button(this.document, `h = ${h}`, () => {
        explorer.setH(h, 'sequence');
        for (const candidate of controls.querySelectorAll?.('button') ?? []) candidate.setAttribute('aria-pressed', candidate === choice ? 'true' : 'false');
        for (const candidate of tbody.querySelectorAll?.('tr') ?? []) candidate.classList?.toggle?.('is-current', candidate.dataset.h === String(h));
        const valuesNow = explorer.getChordState();
        status.textContent = `h = ${h}: chord gradient ${formatChordNumber(valuesNow.chordGradient)}; tangent gradient ${formatChordNumber(valuesNow.tangentGradient)}. Difference ${formatChordNumber(Math.abs(valuesNow.gradientError))}.`;
      });
      choice.setAttribute('aria-pressed', h === 1 ? 'true' : 'false'); controls.append(choice);
    });
    tbody.querySelector?.('tr')?.classList?.add('is-current');
    table.append(caption, head, tbody);
    body.append(table, el(this.document, 'div', 'first-principles-understand__takeaway', 'The chord gradient 3, 2.5, 2.1, 2.01, … approaches 2, the tangent gradient. We approach h = 0; we do not form a chord with h = 0.'));
  }

  render_formal_definition() {
    const body = this.#panel('Turn the picture into the definition', '6 · First principles');
    const formula = el(this.document, 'div', 'first-principles-understand__formal-formula', "f′(x) = lim_(h→0) [f(x+h) − f(x)]/h");
    body.append(formula);
    const explorer = this.#mountExplorer(body, { functions: [X_SQUARED], showFunctionSelector: false, initialH: 0.5, informationMode: 'full' });
    void explorer;
    const map = el(this.document, 'dl', 'first-principles-understand__formula-map');
    [
      ['f(x)', 'height at P'],
      ['f(x+h)', 'height at Q'],
      ['f(x+h) − f(x)', 'vertical change from P to Q'],
      ['h', 'horizontal change from P to Q'],
      ['[f(x+h) − f(x)] / h', 'gradient of the chord PQ'],
      ['h → 0', 'move Q towards P'],
      ['lim', 'follow the value the chord gradient approaches']
    ].forEach(([term, meaning]) => { map.append(el(this.document, 'dt', '', term), el(this.document, 'dd', '', meaning)); });
    body.append(map);
  }

  render_derive_x2() {
    const body = this.#panel('First principles proves a rule you already use', '7 · Derive x²');
    this.#renderStepReveal(body, X2_STEPS, 'Complete: first principles gives f′(x) = 2x, exactly matching the power rule.');
  }

  render_derive_x3() {
    const body = this.#panel('Same definition, one longer expansion', '8 · Derive x³');
    this.#renderStepReveal(body, X3_STEPS, 'Complete: first principles gives f′(x) = 3x², again matching the power rule.');
  }

  render_proof_vs_use() {
    const body = this.#panel('Choose the right purpose', '9 · What have we proved?');
    const compare = el(this.document, 'div', 'first-principles-understand__compare');
    const use = el(this.document, 'article', 'first-principles-understand__compare-card');
    use.append(el(this.document, 'span', 'first-principles-understand__compare-label', 'Use a rule'), el(this.document, 'strong', '', 'Efficient calculation'), el(this.document, 'p', '', 'Example: differentiate x³ by applying the power rule to write 3x² immediately.'));
    const prove = el(this.document, 'article', 'first-principles-understand__compare-card first-principles-understand__compare-card--accent');
    prove.append(el(this.document, 'span', 'first-principles-understand__compare-label', 'Prove a rule'), el(this.document, 'strong', '', 'Explain why it is true'), el(this.document, 'p', '', 'Start from the first-principles definition, simplify the difference quotient, then take the limit.'));
    compare.append(use, prove);
    body.append(compare, el(this.document, 'div', 'first-principles-understand__proof-chain', 'approaching a value → chord gradient → Q approaches P → tangent gradient → first-principles definition → proof'));
  }
}

export function createFirstPrinciplesUnderstandExperience(host, options) {
  return new FirstPrinciplesUnderstandExperience(host, options);
}
