import { DiagramPrimitives } from './diagram-primitives.js';

const STEP37_IDS = new Set([
  'activity:y12:foundations:pre-calculus:understand:hill-gradient',
  'activity:y12:foundations:pre-calculus:understand:gradient-sign',
  'activity:y12:foundations:pre-calculus:understand:steepness',
  'activity:y12:foundations:pre-calculus:understand:gradient-vs-height',
  'activity:y12:foundations:pre-calculus:understand:vertical-limit',
  'activity:y12:foundations:pre-calculus:understand:delta-change',
  'activity:y12:foundations:pre-calculus:understand:curve-question'
]);

function el(doc, tag, className = '', text = '') {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(doc, label, onClick, className = 'pre-calculus-understand__button') {
  const node = el(doc, 'button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

function format(value, digits = 2) {
  const next = Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(digits));
  return String(next);
}

function linePoints({ slope, intercept = 0, xMin = -4.5, xMax = 4.5 }) {
  return [{ x: xMin, y: slope * xMin + intercept }, { x: xMax, y: slope * xMax + intercept }];
}

function hillY(x) {
  return 1.05 * Math.sin(x * 0.82) + 0.18 * x;
}

function hillGradient(x) {
  return 0.861 * Math.cos(x * 0.82) + 0.18;
}

function curveY(x) {
  return 0.12 * x * x * x - 0.75 * x;
}

export class PreCalculusUnderstandExperience {
  constructor(host) {
    if (!host) throw new Error('PreCalculusUnderstandExperience requires a DOM host.');
    this.host = host;
    this.document = host.ownerDocument || globalThis.document;
    this.diagram = null;
    this.cleanup = [];
    this.animationHandle = null;
    this.animationRunning = false;
  }

  supports(activityId) { return STEP37_IDS.has(activityId); }

  destroy() {
    this.#stopAnimation();
    this.diagram?.destroy();
    this.diagram = null;
    for (const cleanup of this.cleanup.splice(0)) cleanup();
    this.host.replaceChildren();
    this.host.classList.remove('pre-calculus-understand');
  }

  render(activityId) {
    if (!this.supports(activityId)) return false;
    this.destroy();
    this.host.classList.add('pre-calculus-understand');
    const slug = activityId.split(':').at(-1).replaceAll('-', '_');
    const renderer = this[`render_${slug}`];
    if (typeof renderer !== 'function') throw new Error(`No Pre-calculus renderer for ${activityId}`);
    renderer.call(this);
    return true;
  }

  #panel(title, eyebrow) {
    const panel = el(this.document, 'section', 'pre-calculus-understand__panel');
    const header = el(this.document, 'div', 'pre-calculus-understand__panel-header');
    header.append(el(this.document, 'span', 'pre-calculus-understand__eyebrow', eyebrow), el(this.document, 'h3', '', title));
    const body = el(this.document, 'div', 'pre-calculus-understand__panel-body');
    panel.append(header, body);
    this.host.append(panel);
    return body;
  }

  #graph(body, { xDomain = [-5, 5], yDomain = [-4, 4], ariaLabel = 'Gradient diagram' } = {}) {
    const graphHost = el(this.document, 'div', 'pre-calculus-understand__graph-host');
    body.append(graphHost);
    this.diagram = new DiagramPrimitives(graphHost, { xDomain, yDomain, ariaLabel, minHeight: 300 });
    this.diagram.grid({ xStep: 1, yStep: 1 });
    this.diagram.axes({ tickStep: 1 });
    return { graphHost, diagram: this.diagram };
  }

  #status(body, text = '') {
    const status = el(this.document, 'p', 'pre-calculus-understand__status', text);
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    body.append(status);
    return status;
  }

  #stopAnimation() {
    this.animationRunning = false;
    if (this.animationHandle != null) {
      const cancel = globalThis.cancelAnimationFrame ?? globalThis.clearTimeout;
      cancel?.(this.animationHandle);
      this.animationHandle = null;
    }
  }

  render_hill_gradient() {
    const body = this.#panel('Drive left to right. Watch the change.', '1 · Gradient means change');
    const controls = el(this.document, 'div', 'pre-calculus-understand__action-row');
    body.append(controls);
    const status = this.#status(body, 'Start at the left and notice whether the car is climbing or descending.');
    const { diagram } = this.#graph(body, { yDomain: [-2.5, 2.5], ariaLabel: 'A car moving left to right along a hill' });
    const xs = Array.from({ length: 161 }, (_, i) => -4.5 + i * 9 / 160);
    diagram.polyline(xs.map((x) => ({ x, y: hillY(x) })), { tone: 'curve' });
    const car = diagram.point({ x: -4.2, y: hillY(-4.2), radius: 12, tone: 'interactive', label: 'car' });
    const direction = diagram.arrow({ x1: -4.4, y1: -2.1, x2: -2.8, y2: -2.1, tone: 'accent', label: 'read left → right' });
    void direction;
    const slider = diagram.slider({
      label: 'Car position', min: -4.2, max: 4.2, step: 0.05, value: -4.2,
      format: (x) => `x = ${format(x, 1)}`,
      onInput: (x) => {
        car.setPosition(x, hillY(x));
        const m = hillGradient(x);
        const message = Math.abs(m) < 0.08 ? 'Almost horizontal: height is barely changing.' : m > 0 ? 'Climbing: y increases as x increases → positive gradient.' : 'Descending: y decreases as x increases → negative gradient.';
        status.textContent = message;
      }
    });
    controls.append(slider.element);
    const play = button(this.document, 'Drive across hill', () => {
      if (this.animationRunning) { this.#stopAnimation(); play.textContent = 'Drive across hill'; return; }
      this.animationRunning = true;
      play.textContent = 'Pause car';
      let x = Number(slider.input.value);
      if (x >= 4.15) x = -4.2;
      let last = 0;
      const raf = globalThis.requestAnimationFrame ?? ((fn) => globalThis.setTimeout(() => fn(Date.now()), 16));
      const frame = (time) => {
        if (!this.animationRunning) return;
        if (!last) last = time;
        const elapsed = Math.min(60, time - last);
        last = time;
        x += elapsed * 0.00115;
        if (x >= 4.2) {
          x = 4.2;
          slider.setValue(x);
          this.#stopAnimation();
          play.textContent = 'Drive again';
          return;
        }
        slider.setValue(x);
        this.animationHandle = raf(frame);
      };
      this.animationHandle = raf(frame);
    }, 'pre-calculus-understand__button pre-calculus-understand__button--primary');
    controls.append(play);
    const motion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (motion?.matches) play.textContent = 'Move car automatically';
  }

  render_gradient_sign() {
    const body = this.#panel('Read each graph from left to right', '2 · Sign of gradient');
    const status = this.#status(body, 'Select a line to inspect its sign.');
    const controls = el(this.document, 'div', 'pre-calculus-understand__choice-row');
    body.append(controls);
    const { diagram } = this.#graph(body, { yDomain: [-4, 4], ariaLabel: 'Straight lines with positive, zero and negative gradients' });
    const options = [
      { id: 'positive', label: 'Rising', slope: 0.7, intercept: 0, text: 'Rising left to right → positive gradient.' },
      { id: 'zero', label: 'Horizontal', slope: 0, intercept: -1.4, text: 'Horizontal → zero gradient.' },
      { id: 'negative', label: 'Falling', slope: -0.7, intercept: 0.5, text: 'Falling left to right → negative gradient.' }
    ];
    const lines = new Map();
    for (const option of options) {
      const [a, b] = linePoints(option);
      lines.set(option.id, diagram.line({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, tone: option.id === 'zero' ? 'secondary' : 'curve' }));
      const choice = button(this.document, option.label, () => {
        status.textContent = option.text;
        for (const candidate of controls.querySelectorAll?.('button') ?? []) candidate.setAttribute('aria-pressed', candidate === choice ? 'true' : 'false');
      });
      choice.setAttribute('aria-pressed', 'false');
      controls.append(choice);
    }
  }

  render_steepness() {
    const body = this.#panel('Keep the axes fixed. Rotate the line.', '3 · Steepness');
    const controls = el(this.document, 'div', 'pre-calculus-understand__action-row');
    body.append(controls);
    const status = this.#status(body, 'Gradient = 0.50: a shallow upward line.');
    const { diagram } = this.#graph(body, { yDomain: [-5, 5], ariaLabel: 'A line whose steepness can be changed' });
    const line = diagram.line({ x1: -4, y1: -2, x2: 4, y2: 2, tone: 'curve' });
    const slider = diagram.slider({
      label: 'Gradient', min: -2.5, max: 2.5, step: 0.1, value: 0.5,
      format: (m) => `m = ${format(m, 1)}`,
      onInput: (m) => {
        line.setCoordinates({ x1: -2, y1: -2 * m, x2: 2, y2: 2 * m });
        if (Math.abs(m) < 0.05) status.textContent = 'Gradient = 0: horizontal.';
        else if (m > 0) status.textContent = `Gradient = ${format(m, 1)}: ${Math.abs(m) > 1 ? 'steep' : 'shallow'} upward line.`;
        else status.textContent = `Gradient = ${format(m, 1)}: ${Math.abs(m) > 1 ? 'steep' : 'shallow'} downward line.`;
      }
    });
    controls.append(slider.element);
  }

  render_gradient_vs_height() {
    const body = this.#panel('Move the line without changing its tilt', '4 · Gradient is not height');
    const controls = el(this.document, 'div', 'pre-calculus-understand__action-row');
    body.append(controls);
    const status = this.#status(body, 'The line moves vertically, but its gradient remains 0.75.');
    const { diagram } = this.#graph(body, { yDomain: [-5, 5], ariaLabel: 'Parallel lines at different vertical positions' });
    const slope = 0.75;
    const line = diagram.line({ x1: -3.5, y1: -3.5 * slope, x2: 3.5, y2: 3.5 * slope, tone: 'curve' });
    const shadow = diagram.line({ x1: -3.5, y1: -3.5 * slope - 2, x2: 3.5, y2: 3.5 * slope - 2, tone: 'secondary', dashed: true });
    const slider = diagram.slider({
      label: 'Vertical shift', min: -2.5, max: 2.5, step: 0.25, value: 0,
      format: (c) => `shift = ${format(c, 2)}`,
      onInput: (c) => {
        line.setCoordinates({ x1: -3.5, y1: -3.5 * slope + c, x2: 3.5, y2: 3.5 * slope + c });
        status.textContent = `Vertical shift ${format(c, 2)}; gradient still ${slope}. Height changed, tilt did not.`;
      }
    });
    controls.append(slider.element);
    status.textContent = 'Solid and dashed lines sit at different heights but have the same gradient 0.75.';
    void shadow;
  }

  render_vertical_limit() {
    const body = this.#panel('Near vertical: unbounded gradient, then undefined', '5 · Vertical-line limit idea');
    const controls = el(this.document, 'div', 'pre-calculus-understand__action-row');
    body.append(controls);
    const status = this.#status(body, 'At 45°, gradient = 1. Move towards either near-vertical side.');
    const { diagram } = this.#graph(body, { xDomain: [-4, 4], yDomain: [-4, 4], ariaLabel: 'A line rotating from steep negative through horizontal to steep positive, approaching vertical on both sides' });
    const line = diagram.line({ x1: -2.5, y1: -2.5, x2: 2.5, y2: 2.5, tone: 'curve' });
    const slider = diagram.slider({
      label: 'Signed angle from horizontal', min: -89, max: 89, step: 1, value: 45,
      format: (angle) => `${angle}°`,
      onInput: (angle) => {
        const radians = angle * Math.PI / 180;
        const slope = Math.tan(radians);
        const dx = Math.min(2.8, 3.5 / Math.max(1, Math.abs(slope)));
        line.setCoordinates({ x1: -dx, y1: -dx * slope, x2: dx, y2: dx * slope });
        if (Math.abs(angle) >= 85) {
          const side = slope > 0 ? 'positive-gradient' : 'negative-gradient';
          const tendency = slope > 0 ? 'm → +∞' : 'm → −∞';
          status.textContent = `Near vertical from the ${side} side: m ≈ ${format(slope, 1)}. As the line gets closer to vertical, ${tendency}; |m| grows without bound.`;
        } else if (Math.abs(angle) < 0.5) {
          status.textContent = 'Horizontal: m = 0.';
        } else {
          status.textContent = `At ${angle}°, gradient ≈ ${format(slope, 2)}. Moving closer to vertical makes |m| larger.`;
        }
      }
    });
    const presets = el(this.document, 'div', 'pre-calculus-understand__choice-row');
    presets.append(
      button(this.document, 'Near vertical: negative', () => slider.setValue(-89)),
      button(this.document, 'Horizontal', () => slider.setValue(0)),
      button(this.document, 'Near vertical: positive', () => slider.setValue(89))
    );
    controls.append(slider.element, presets);
    body.append(
      el(this.document, 'div', 'pre-calculus-understand__takeaway', 'Approaching vertical from one side gives m → +∞; from the other gives m → −∞. This means the gradient is unbounded — it does not mean a vertical line has gradient “infinity”.'),
      el(this.document, 'div', 'pre-calculus-understand__takeaway', 'Exactly vertical: Δx = 0, so Δy / Δx would divide by zero. The gradient is undefined.')
    );
  }

  render_delta_change() {
    const body = this.#panel('See the two changes before the ratio', '6 · Δy / Δx');
    const controls = el(this.document, 'div', 'pre-calculus-understand__action-row');
    body.append(controls);
    const status = this.#status(body, 'Δx = 4, Δy = 2, so gradient = 2 ÷ 4 = 0.5.');
    const { diagram } = this.#graph(body, { xDomain: [-1, 7], yDomain: [-1, 6], ariaLabel: 'A straight line with horizontal and vertical change triangle' });
    const p = { x: 1, y: 1 };
    const q = { x: 5, y: 3 };
    const line = diagram.line({ x1: -0.5, y1: 0.25, x2: 6.5, y2: 3.75, tone: 'curve' });
    diagram.point({ ...p, label: 'P' });
    const qPoint = diagram.point({ ...q, label: 'Q', tone: 'interactive' });
    const horizontal = diagram.line({ x1: p.x, y1: p.y, x2: q.x, y2: p.y, tone: 'accent', dashed: true });
    const vertical = diagram.line({ x1: q.x, y1: p.y, x2: q.x, y2: q.y, tone: 'tangent', dashed: true });
    const dxLabel = diagram.label({ x: 3, y: 1, text: 'Δx = 4', dy: 24, tone: 'accent' });
    const dyLabel = diagram.label({ x: 5, y: 2, text: 'Δy = 2', dx: 18, anchor: 'start', tone: 'tangent' });
    const slider = diagram.slider({
      label: 'Move Q horizontally', min: 2, max: 6, step: 0.5, value: 5,
      format: (x) => `xQ = ${format(x, 1)}`,
      onInput: (x) => {
        const y = 0.5 * x + 0.5;
        qPoint.setPosition(x, y);
        horizontal.setCoordinates({ x1: p.x, y1: p.y, x2: x, y2: p.y });
        vertical.setCoordinates({ x1: x, y1: p.y, x2: x, y2: y });
        dxLabel.set({ x: (p.x + x) / 2, y: p.y, text: `Δx = ${format(x - p.x, 1)}` });
        dyLabel.set({ x, y: (p.y + y) / 2, text: `Δy = ${format(y - p.y, 1)}` });
        status.textContent = `Δx = ${format(x - p.x, 1)}, Δy = ${format(y - p.y, 1)}; ratio = 0.5 every time because the line has one gradient.`;
      }
    });
    controls.append(slider.element);
    void line;
  }

  render_curve_question() {
    const body = this.#panel('Straight line: one gradient. Curve: now what?', '7 · Transition to differentiation');
    const { diagram } = this.#graph(body, { yDomain: [-4, 4], ariaLabel: 'A straight line compared with a curved graph' });
    diagram.line({ x1: -4, y1: -2.4, x2: 4, y2: 2.4, tone: 'secondary', dashed: true });
    const xs = Array.from({ length: 161 }, (_, i) => -4 + i * 8 / 160);
    diagram.polyline(xs.map((x) => ({ x, y: curveY(x) })), { tone: 'curve' });
    diagram.label({ x: 2.8, y: 1.7, text: 'straight: same gradient everywhere', dx: 8, dy: -10, anchor: 'start', tone: 'secondary' });
    diagram.label({ x: -2.9, y: curveY(-2.9), text: 'curve: steepness changes', dx: 10, dy: -14, anchor: 'start', tone: 'curve' });
    const question = el(this.document, 'div', 'pre-calculus-understand__question');
    question.append(el(this.document, 'strong', '', 'A straight line has one gradient everywhere.'), el(this.document, 'span', '', 'What should “gradient” mean when the graph is curved?'));
    body.append(question);
  }
}

export function createPreCalculusUnderstandExperience(host, options) {
  return new PreCalculusUnderstandExperience(host, options);
}
