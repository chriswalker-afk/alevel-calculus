import { defineQuestionDefinition } from '../question-definition.js';
import { defineSolutionStep } from '../solution-step.js';

const topicId = 'topic:y12:differentiation:first-principles';
const skill = (slug) => `skill:y12:differentiation:first-principles:${slug}`;

const steps = (rows) => rows.map((row, index) => defineSolutionStep({
  id: row.id ?? `step-${index + 1}`,
  kind: row.kind ?? 'working',
  label: row.label,
  expression: row.expression,
  explanation: row.explanation
}));

const norm = (value) => String(value ?? '').toLowerCase().replace(/\s+/g, '').replace(/[−–—]/g, '-');
const numeric = (expected, response) => Math.abs(Number(response) - expected) < 1e-9;

export const simpleLimitDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao1:simple-limit', courseScope: 'y12', topicId,
  assessmentObjective: 'ao1', microSkillId: skill('simple-limits'), difficulty: 'foundation',
  prerequisiteTags: ['substitution'], methodTags: ['limits', 'substitution'], vocabularyTags: ['vocab:limit', 'vocab:approaches'],
  errorCategories: ['sets-h-equal-zero-too-early', 'arithmetic-error'],
  diagnosticRules: {
    'sets-h-equal-zero-too-early': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition'), studentMessage: 'Revisit what h → 0 means before evaluating the output.' },
    'arithmetic-error': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('simple-limits'), studentMessage: 'The limit idea is appropriate; practise the simple substitution carefully.' }
  }, defaultDiagnostic: { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition') },
  responseType: 'numeric', responseLabel: 'Limit', placeholder: 'Enter the value approached',
  parameterGenerator({ random }) { const a = random.int(1, 7), p = random.pick([1, 2]); return { a, p }; },
  promptRenderer({ a, p }) { return `Evaluate the simple limit as h → 0.`; },
  mathRenderer({ a, p }) { return `lim_(h→0) (${a} + h${p === 2 ? '²' : ''})`; },
  answerChecker(response, { a }) { return numeric(a, response) ? { tone: 'correct', title: 'Correct', message: 'The output approaches the constant term.' } : { tone: 'incorrect', errorCategory: 'arithmetic-error', title: 'Follow what the expression approaches', message: 'Make h smaller and identify the value the whole expression approaches.' }; },
  workedSolutionGenerator({ a, p }) { return steps([{ label: 'Let h approach zero', expression: `${a} + h${p === 2 ? '²' : ''} → ${a}`, explanation: 'The h-term approaches zero.' }, { kind: 'result', label: 'Limit', expression: `${a}`, explanation: 'So the expression approaches the constant term.' }]); },
  hintSequenceGenerator() { return [{ id: 'approach', text: 'Think about h = 0.1, 0.01, 0.001 rather than treating this as a new algebra rule.' }]; }
});

export const fxPlusHDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao1:fx-plus-h', courseScope: 'y12', topicId,
  assessmentObjective: 'ao1', microSkillId: skill('formal-definition'), difficulty: 'foundation', prerequisiteTags: ['function-notation', 'expanding-brackets'],
  methodTags: ['function-substitution', 'difference-quotient'], vocabularyTags: ['vocab:f-x-plus-h', 'vocab:difference-quotient'],
  errorCategories: ['function-notation-error', 'expansion-error'],
  diagnosticRules: {
    'function-notation-error': { kind: 'recognition', supportNeed: 'memorise', supportMicroSkillId: skill('formal-definition'), studentMessage: 'Recall that f(x+h) means replace every x in f(x) by x+h.' },
    'expansion-error': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2'), studentMessage: 'Your setup is right; focus on expanding the bracket accurately.' }
  }, defaultDiagnostic: { kind: 'recognition', supportNeed: 'memorise', supportMicroSkillId: skill('formal-definition') },
  responseType: 'algebraic', responseLabel: 'f(x+h)', placeholder: 'Enter the expanded expression',
  parameterGenerator({ random }) { const b = random.int(-4, 4); return { b }; },
  promptRenderer({ b }) { return `For f(x)=x²${b === 0 ? '' : b > 0 ? `+${b}x` : `${b}x`}, find and expand f(x+h).`; },
  mathRenderer({ b }) { return `f(x) = x² ${b === 0 ? '' : b > 0 ? `+ ${b}x` : `− ${Math.abs(b)}x`}`; },
  answerChecker(response, { b }) {
    const s = norm(response); const candidates = [`x^2+2xh+h^2${b ? `${b > 0 ? '+' : ''}${b}x${b > 0 ? '+' : ''}${b}h` : ''}`, `x²+2xh+h²${b ? `${b > 0 ? '+' : ''}${b}x${b > 0 ? '+' : ''}${b}h` : ''}`].map(norm);
    if (candidates.includes(s)) return { tone: 'correct', title: 'Correct', message: 'You replaced x by x+h throughout and expanded correctly.' };
    if (!s.includes('h')) return { tone: 'incorrect', errorCategory: 'function-notation-error', title: 'Replace x by x+h', message: 'f(x+h) must contain h because the input has changed.' };
    return { tone: 'incorrect', errorCategory: 'expansion-error', title: 'Check the expansion', message: 'Expand (x+h)² carefully and include the linear term if present.' };
  },
  workedSolutionGenerator({ b }) { return steps([{ label: 'Replace x by x+h', expression: `f(x+h)=(x+h)²${b ? `${b > 0 ? '+' : ''}${b}(x+h)` : ''}`, explanation: 'Every x in the function receives the new input x+h.' }, { kind: 'result', label: 'Expand', expression: `x²+2xh+h²${b ? `${b > 0 ? '+' : ''}${b}x${b > 0 ? '+' : ''}${b}h` : ''}`, explanation: 'Now the expression is ready to be used in the difference quotient.' }]); },
  hintSequenceGenerator() { return [{ id: 'replace', text: 'Write the original rule, then replace each x by (x+h).' }, { id: 'expand', text: 'Use (x+h)²=x²+2xh+h².' }]; }
});

export const x2FirstPrinciplesDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao1:x2-first-principles', courseScope: 'y12', topicId,
  assessmentObjective: 'ao1', microSkillId: skill('derive-x2'), difficulty: 'standard', prerequisiteTags: ['expanding-brackets', 'simplifying-algebra'],
  methodTags: ['first-principles', 'difference-quotient', 'backwards-fading'], vocabularyTags: ['vocab:first-principles', 'vocab:difference-quotient', 'vocab:limit'],
  errorCategories: ['wrong-difference-quotient', 'expansion-error', 'cancels-h-incorrectly', 'substitutes-zero-too-early'],
  diagnosticRules: {
    'wrong-difference-quotient': { kind: 'recognition', supportNeed: 'memorise', supportMicroSkillId: skill('formal-definition'), studentMessage: 'Retrieve the exact first-principles definition before starting the algebra.' },
    'expansion-error': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2'), studentMessage: 'Your calculus setup is sound; practise the bracket expansion and simplification.' },
    'cancels-h-incorrectly': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2'), studentMessage: 'Factor h from the whole numerator before cancelling the common factor.' },
    'substitutes-zero-too-early': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition'), studentMessage: 'Revisit why h approaches 0 while remaining non-zero during cancellation.' }
  }, defaultDiagnostic: { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2') },
  responseType: 'algebraic', responseLabel: 'Derivative', placeholder: 'Enter f′(x)',
  parameterGenerator({ random }) { return { a: random.int(1, 4) }; },
  promptRenderer({ a }) { return `Use first principles to differentiate f(x)=${a === 1 ? '' : a}x². Enter the final derivative.`; },
  mathRenderer({ a }) { return `f′(x)=lim_(h→0) [${a}(x+h)²−${a}x²]/h`; },
  answerChecker(response, { a }) { const s = norm(response); return [norm(`${2*a}x`), norm(`${2*a}*x`)].includes(s) ? { tone: 'correct', title: 'Correct', message: 'The first-principles derivation gives the expected linear derivative.' } : { tone: 'incorrect', errorCategory: 'expansion-error', title: 'Check the middle algebra', message: 'Expand, cancel the common factor h while h≠0, then take the limit.' }; },
  workedSolutionGenerator({ a }) { return steps([{ label: 'Substitute', expression: `lim_(h→0) [${a}(x+h)²−${a}x²]/h`, explanation: 'Use the definition.' }, { label: 'Expand', expression: `lim_(h→0) [${2*a}xh+${a}h²]/h`, explanation: 'The x² terms cancel.' }, { label: 'Cancel h', expression: `lim_(h→0) (${2*a}x+${a}h)`, explanation: 'h is non-zero during the approach.' }, { kind: 'result', label: 'Take the limit', expression: `f′(x)=${2*a}x`, explanation: 'The remaining h-term approaches zero.' }]); },
  hintSequenceGenerator() { return [{ id: 'expand', text: 'Expand (x+h)² before cancelling anything.' }, { id: 'factor', text: 'After simplifying, factor h from the numerator.' }, { id: 'limit', text: 'Only after cancellation should you let h approach 0.' }]; }
});

export const x3FirstPrinciplesDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao1:x3-first-principles', courseScope: 'y12', topicId,
  assessmentObjective: 'ao1', microSkillId: skill('derive-x3'), difficulty: 'standard', prerequisiteTags: ['expanding-brackets', 'simplifying-algebra'],
  methodTags: ['first-principles', 'difference-quotient', 'backwards-fading'], vocabularyTags: ['vocab:first-principles', 'vocab:difference-quotient', 'vocab:limit'],
  errorCategories: ['expansion-error', 'substitutes-zero-too-early'], diagnosticRules: {
    'expansion-error': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x3'), studentMessage: 'The first-principles idea is right; revisit the cubic expansion and factor h from every remaining term.' },
    'substitutes-zero-too-early': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition'), studentMessage: 'Keep h non-zero until the common factor has been cancelled.' }
  }, defaultDiagnostic: { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x3') },
  responseType: 'algebraic', responseLabel: 'Derivative', placeholder: 'Enter f′(x)', parameterGenerator() { return {}; },
  promptRenderer() { return 'Use first principles to differentiate f(x)=x³. Enter the final derivative.'; }, mathRenderer() { return `f′(x)=lim_(h→0) [((x+h)³−x³)/h]`; },
  answerChecker(response) { return [norm('3x^2'), norm('3x²')].includes(norm(response)) ? { tone: 'correct', title: 'Correct', message: 'You have established the cubic derivative from the definition.' } : { tone: 'incorrect', errorCategory: 'expansion-error', title: 'Check the cubic expansion', message: 'Expand (x+h)³ fully, simplify, factor h, cancel, then take the limit.' }; },
  workedSolutionGenerator() { return steps([{ label: 'Expand', expression: 'lim_(h→0) [3x²h+3xh²+h³]/h', explanation: 'The x³ terms cancel.' }, { label: 'Cancel h', expression: 'lim_(h→0) (3x²+3xh+h²)', explanation: 'Every numerator term contains h.' }, { kind: 'result', label: 'Take the limit', expression: 'f′(x)=3x²', explanation: 'Terms containing h approach zero.' }]); },
  hintSequenceGenerator() { return [{ id: 'expand', text: '(x+h)³=x³+3x²h+3xh²+h³.' }, { id: 'factor', text: 'Factor h from all remaining numerator terms before cancelling.' }]; }
});

export const explainChordDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao2:explain-chord', courseScope: 'y12', topicId,
  assessmentObjective: 'ao2', microSkillId: skill('chord-approximation'), difficulty: 'standard', prerequisiteTags: ['straight-line-gradient'],
  methodTags: ['explain-approximation', 'connect-diagram'], vocabularyTags: ['vocab:chord', 'vocab:tangent', 'vocab:approximation'],
  errorCategories: ['gradient-prerequisite', 'missing-approach-link'], diagnosticRules: {
    'gradient-prerequisite': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: 'skill:y12:foundations:pre-calculus:delta-y-over-delta-x', studentMessage: 'Revisit straight-line gradient as vertical change divided by horizontal change.' },
    'missing-approach-link': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('chord-approximation'), studentMessage: 'Use the movement of Q towards P to explain why the chord becomes a better local approximation.' }
  }, defaultDiagnostic: { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('chord-approximation') },
  responseType: 'short-reasoning', responseLabel: 'Explanation', placeholder: 'Explain what changes as Q approaches P.', parameterGenerator() { return {}; },
  promptRenderer() { return 'Explain why the chord through P and Q only approximates the gradient at P, and why the approximation improves as Q approaches P.'; }, mathRenderer() { return 'Q → P  ⇒  chord gradient → tangent gradient'; },
  answerChecker(response) { const s = String(response ?? '').toLowerCase(); const chord = /chord|secant/.test(s); const tangent = /tangent|gradient at p|instantaneous/.test(s); const approach = /closer|approach|towards|distance|h.*0/.test(s); if (chord && tangent && approach) return { tone: 'correct', title: 'Good explanation', message: 'You linked the two-point chord to the one-point tangent through the limiting movement.' }; if (!/gradient|slope/.test(s)) return { tone: 'warning', errorCategory: 'gradient-prerequisite', title: 'Talk about gradient', message: 'Explain what the line gradient is estimating.' }; return { tone: 'warning', errorCategory: 'missing-approach-link', title: 'Use Q → P explicitly', message: 'State why moving Q closer makes the chord behave more like the tangent.' }; },
  workedSolutionGenerator() { return steps([{ label: 'Chord', expression: 'gradient of PQ', explanation: 'A chord uses two distinct points, so it gives an average straight-line gradient across a small interval.' }, { kind: 'reasoning', label: 'Approach', expression: 'Q → P', explanation: 'As the interval shrinks, the chord aligns more closely with the tangent at P.' }, { kind: 'result', label: 'Limit', expression: 'm(chord) → m(tangent)', explanation: 'That limiting gradient is the derivative at P.' }]); },
  hintSequenceGenerator() { return [{ id: 'two-points', text: 'A chord uses two points; a tangent gradient describes the curve at one point.' }, { id: 'closer', text: 'Describe what happens to the chord as the horizontal separation h becomes smaller.' }]; }
});

export const explainHZeroDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao2:why-not-h-zero', courseScope: 'y12', topicId,
  assessmentObjective: 'ao2', microSkillId: skill('limit-intuition'), difficulty: 'standard', prerequisiteTags: ['fractions'], methodTags: ['explain-limit'], vocabularyTags: ['vocab:limit', 'vocab:difference-quotient'],
  errorCategories: ['limit-misread'], diagnosticRules: { 'limit-misread': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition'), studentMessage: 'Return to the h→0 sequence and separate approaching zero from being equal to zero.' } }, defaultDiagnostic: { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition') },
  responseType: 'short-reasoning', responseLabel: 'Explanation', placeholder: 'Explain using the denominator and the limiting process.', parameterGenerator() { return {}; },
  promptRenderer() { return 'Why can we not substitute h=0 into the original difference quotient before simplifying?'; }, mathRenderer() { return '[f(x+h)−f(x)] / h'; },
  answerChecker(response) { const s = String(response ?? '').toLowerCase(); if ((/denominator|divide|division/.test(s) && /zero|0/.test(s)) && /approach|limit|after|simplif|cancel/.test(s)) return { tone: 'correct', title: 'Correct', message: 'You distinguished the undefined h=0 quotient from the limit as h approaches zero.' }; return { tone: 'warning', errorCategory: 'limit-misread', title: 'Separate “approaches” from “equals”', message: 'Mention what happens to the denominator at h=0 and why the limit is taken after simplification.' }; },
  workedSolutionGenerator() { return steps([{ label: 'Original quotient', expression: '[f(x+h)−f(x)]/h', explanation: 'At h=0 the denominator is zero, so this expression is not defined.' }, { kind: 'reasoning', label: 'Limit process', expression: 'h→0 with h≠0', explanation: 'We simplify for nearby non-zero h values.' }, { kind: 'result', label: 'Then take the limit', expression: 'simplified expression → derivative', explanation: 'After cancellation the limiting value can be found.' }]); },
  hintSequenceGenerator() { return [{ id: 'denominator', text: 'What would the denominator become if h were exactly zero?' }, { id: 'process', text: 'The arrow in h→0 describes nearby non-zero values before the limiting value is taken.' }]; }
});

export const diagnoseDerivationDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao2:diagnose-derivation', courseScope: 'y12', topicId,
  assessmentObjective: 'ao2', microSkillId: skill('derive-x2'), difficulty: 'standard', prerequisiteTags: ['simplifying-algebra'], methodTags: ['error-analysis', 'first-principles'], vocabularyTags: ['vocab:first-principles', 'vocab:limit'],
  errorCategories: ['algebra-prerequisite', 'limit-misread'], diagnosticRules: {
    'algebra-prerequisite': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2'), studentMessage: 'Use the fading first-principles practice to strengthen expansion and factor cancellation.' },
    'limit-misread': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: skill('limit-intuition'), studentMessage: 'Revisit why h is not set equal to zero before cancellation.' }
  }, defaultDiagnostic: { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2') },
  responseType: 'short-reasoning', responseLabel: 'Identify and correct the error', placeholder: 'Name the error and explain the correction.', parameterGenerator() { return {}; },
  promptRenderer() { return 'A student writes: [(x+h)²−x²]/h = [2xh+h²]/h, then puts h=0 and says the derivative is 0/0. Explain the error.'; }, mathRenderer() { return 'lim_(h→0) [(2xh+h²)/h]'; },
  answerChecker(response) { const s = String(response ?? '').toLowerCase(); const cancel = /cancel|factor/.test(s) && /h/.test(s); const before = /before|first|non.?zero|h≠0|not.*zero/.test(s); if (cancel && before) return { tone: 'correct', title: 'Correct diagnosis', message: 'The common factor h must be cancelled for nearby non-zero h before the limit is taken.' }; if (/0\/0|zero over zero|undefined/.test(s) && !cancel) return { tone: 'warning', errorCategory: 'limit-misread', title: 'Go one step further', message: 'You noticed 0/0, but explain why we simplify for non-zero h before taking the limit.' }; return { tone: 'warning', errorCategory: 'algebra-prerequisite', title: 'Focus on the common factor', message: 'Factor h from the numerator and explain when cancellation is valid.' }; },
  workedSolutionGenerator() { return steps([{ label: 'Factor h', expression: '(2xh+h²)/h = h(2x+h)/h', explanation: 'For the approaching values, h is non-zero.' }, { label: 'Cancel', expression: '= 2x+h', explanation: 'Now the quotient no longer has h in the denominator.' }, { kind: 'result', label: 'Take the limit', expression: '2x+h → 2x', explanation: 'Only now let h approach zero.' }]); },
  hintSequenceGenerator() { return [{ id: 'factor', text: 'What common factor appears in every numerator term?' }, { id: 'order', text: 'Cancellation happens for non-zero h values before the limiting step.' }]; }
});

export const chooseDifferenceQuotientDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao3:choose-difference-quotient', courseScope: 'y12', topicId,
  assessmentObjective: 'ao3', microSkillId: skill('formal-definition'), difficulty: 'standard', prerequisiteTags: ['function-notation'], methodTags: ['select-model', 'difference-quotient'], vocabularyTags: ['vocab:difference-quotient', 'vocab:f-x-plus-h'],
  errorCategories: ['reversed-change', 'wrong-denominator', 'formula-recall'], diagnosticRules: {
    'reversed-change': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: 'skill:y12:foundations:pre-calculus:delta-y-over-delta-x', studentMessage: 'Reconnect the numerator with change in y in the same direction as the horizontal change h.' },
    'wrong-denominator': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: 'skill:y12:foundations:pre-calculus:delta-y-over-delta-x', studentMessage: 'The denominator is the horizontal change from x to x+h, which is h.' },
    'formula-recall': { kind: 'recognition', supportNeed: 'memorise', supportMicroSkillId: skill('formal-definition'), studentMessage: 'Retrieve the difference quotient and connect f(x+h)−f(x) with the vertical change.' }
  }, defaultDiagnostic: { kind: 'recognition', supportNeed: 'memorise', supportMicroSkillId: skill('formal-definition') },
  responseType: 'choice',
  parameterGenerator({ random }) {
    const base = random.int(-4, 4);
    return { base, order: random.shuffle(['correct', 'reverse', 'sum', 'wrong-denominator']) };
  },
  promptRenderer({ base }) {
    return `A curve has P=(${base},f(${base})) and Q=(${base}+h,f(${base}+h)). Which expression is the gradient of chord PQ?`;
  },
  mathRenderer({ base }) { return `P=(${base},f(${base})),  Q=(${base}+h,f(${base}+h))`; },
  responseOptionsRenderer({ base, order }) {
    const labels = {
      correct: `[f(${base}+h)−f(${base})]/h`,
      reverse: `[f(${base})−f(${base}+h)]/h`,
      sum: `[f(${base}+h)+f(${base})]/h`,
      'wrong-denominator': `[f(${base}+h)−f(${base})]/(${base}+h)`
    };
    return order.map((id) => ({ id, label: labels[id] }));
  },
  answerChecker(response) { if (response === 'correct') return { tone: 'correct', title: 'Correct', message: 'Vertical change divided by horizontal change gives the chord gradient.' }; const map = { reverse: 'reversed-change', 'wrong-denominator': 'wrong-denominator', sum: 'formula-recall' }; return { tone: 'incorrect', errorCategory: map[response] ?? 'formula-recall', title: 'Check the two changes', message: 'Use change in y over change in x from P to Q.' }; },
  workedSolutionGenerator({ base }) {
    const wrappedBase = base < 0 ? `(${base})` : String(base);
    return steps([
      { label: 'Horizontal change', expression: `(${base}+h)−${wrappedBase} = h`, explanation: 'This is the denominator.' },
      { label: 'Vertical change', expression: `f(${base}+h)−f(${base})`, explanation: 'This is the numerator.' },
      { kind: 'result', label: 'Chord gradient', expression: `[f(${base}+h)−f(${base})]/h`, explanation: 'This is the difference quotient.' }
    ]);
  },
  hintSequenceGenerator() { return [{ id: 'gradient', text: 'Start with change in y divided by change in x.' }]; }
});

export const firstPrinciplesGradientApplicationDefinition = defineQuestionDefinition({
  templateId: 'question-template:y12:differentiation:first-principles:ao3:gradient-application', courseScope: 'y12', topicId,
  assessmentObjective: 'ao3', microSkillId: skill('proof-vs-use'), difficulty: 'standard', prerequisiteTags: ['first-principles', 'straight-line-gradient'], methodTags: ['establish-then-apply', 'gradient-at-point'], vocabularyTags: ['vocab:first-principles', 'vocab:gradient', 'vocab:tangent'],
  errorCategories: ['used-function-value', 'derivation-gap', 'gradient-prerequisite'], diagnosticRules: {
    'used-function-value': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: 'skill:y12:differentiation:basics:gradient-function', studentMessage: 'A tangent gradient comes from the derivative value, not the original function height.' },
    'derivation-gap': { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2'), studentMessage: 'Return to the fading first-principles derivation before applying the result.' },
    'gradient-prerequisite': { kind: 'recognition', supportNeed: 'understand', supportMicroSkillId: 'skill:y12:foundations:pre-calculus:delta-y-over-delta-x', studentMessage: 'Revisit what a gradient represents before applying the derived rule.' }
  }, defaultDiagnostic: { kind: 'execution', supportNeed: 'ao1', supportMicroSkillId: skill('derive-x2') },
  responseType: 'numeric', responseLabel: 'Gradient', placeholder: 'Enter the tangent gradient', parameterGenerator({ random }) { const a = random.int(1, 3), x = random.pick([-2, -1, 1, 2, 3]); return { a, x, gradient: 2*a*x, height: a*x*x }; },
  promptRenderer({ a, x }) { return `Using the first-principles result for f(x)=${a === 1 ? '' : a}x², find the tangent gradient at x=${x}.`; }, mathRenderer({ a }) { return `from first principles: f′(x)=${2*a}x`; },
  answerChecker(response, { gradient, height }) { if (numeric(gradient, response)) return { tone: 'correct', title: 'Correct', message: 'You used the established derivative to answer the gradient question.' }; if (numeric(height, response)) return { tone: 'incorrect', errorCategory: 'used-function-value', title: 'That is the function value', message: 'Use f′(x), not f(x), for the tangent gradient.' }; return { tone: 'incorrect', errorCategory: 'derivation-gap', title: 'Use the established derivative', message: 'Once first principles gives f′(x), substitute the stated x-value.' }; },
  workedSolutionGenerator({ a, x, gradient }) { return steps([{ label: 'Use the established result', expression: `f′(x)=${2*a}x`, explanation: 'First principles has proved the derivative rule for this function.' }, { kind: 'result', label: `Evaluate at x=${x}`, expression: `f′(${x})=${gradient}`, explanation: 'A derivative value is the tangent gradient.' }]); },
  hintSequenceGenerator() { return [{ id: 'result', text: 'Use the derivative you established from first principles.' }, { id: 'evaluate', text: 'Substitute the given x-value into f′(x).' }]; }
});

export const firstPrinciplesAssessmentQuestionDefinitions = Object.freeze([
  simpleLimitDefinition, fxPlusHDefinition, x2FirstPrinciplesDefinition, x3FirstPrinciplesDefinition,
  explainChordDefinition, explainHZeroDefinition, diagnoseDerivationDefinition,
  chooseDifferenceQuotientDefinition, firstPrinciplesGradientApplicationDefinition
]);
