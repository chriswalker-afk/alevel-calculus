/* Root Rescue: dependency-free maths engine and solo game. */
(function (root) {
  'use strict';
  const MINUS = '\u2212';
  function integer(value) {
    const text = String(value).trim().replace(/\u2212/g, '-');
    if (!/^[+-]?\d+$/.test(text)) return null;
    const n = Number(text);
    return Number.isSafeInteger(n) ? (n === 0 ? 0 : n) : null;
  }
  function term(n, letter, first) {
    if (n === 0) return '';
    const sign = n < 0 ? MINUS : '+';
    const magnitude = Math.abs(n);
    const body = (letter && magnitude === 1 ? '' : String(magnitude)) + letter;
    return first ? (n < 0 ? MINUS : '') + body : ' ' + sign + ' ' + body;
  }
  function poly(b, c) { return 'x\u00b2' + term(b, 'x', false) + term(c, '', false); }
  function linear(b, c) { return (b ? term(b, 'x', true) + term(c, '', false) : term(c, '', true)) || '0'; }
  function bracket(n) { return n === 0 ? 'x' : '(x ' + (n < 0 ? MINUS : '+') + ' ' + Math.abs(n) + ')'; }
  function factors(p, q) { return p === 0 && q === 0 ? 'x\u00b2' : bracket(p) + bracket(q); }
  function signed(n) { return n < 0 ? '(' + MINUS + Math.abs(n) + ')' : String(n); }
  function plan(mode) {
    const areas = mode === 'all' ? [0, 1, 2, 3] : [Number(mode)];
    if (areas.some(a => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error('Unknown mission');
    return areas.flatMap(area => [0, 1, 2].map(slot => ({ area, slot })));
  }
  function makeQuestion(area, slot, rng = Math.random) {
    if (![0, 1, 2, 3].includes(area) || ![0, 1, 2].includes(slot)) throw new Error('Unknown lock');
    const rand = (a, b) => a + Math.floor(rng() * (b - a + 1));
    const sign = () => rng() < .5 ? -1 : 1;
    const a = rand(2, 7);
    let p, q, rx = 0, rc = 0;
    if (area === 0) {
      const b = ((a + rand(0, 6)) % 8) + 1;
      const s = slot === 1 ? 1 : -1;
      p = s * a; q = s * b;
    } else if (area === 1) {
      const b = a + rand(1, 3);
      p = slot === 1 ? b : a; q = slot === 1 ? -a : -b;
      if (slot === 2 && rng() < .5) { p = -p; q = -q; }
    } else if (area === 2) {
      if (slot === 0) { p = sign() * a; q = p; }
      else if (slot === 1) { p = 0; q = sign() * a; }
      else { p = a; q = -a; }
    } else {
      p = sign() * a; q = sign() * (a + rand(1, 3));
      rx = slot === 0 ? 0 : sign() * rand(1, 5);
      rc = slot === 1 ? 0 : sign() * rand(2, 16);
    }
    const b = p + q, c = p * q || 0;
    return { area, slot, p, q, b, c, rx, rc, leftB: b + rx, leftC: c + rc,
      roots: [-p, -q].map(n => n === 0 ? 0 : n) };
  }
  function original(q) { return poly(q.leftB, q.leftC) + ' = ' + linear(q.rx, q.rc); }
  function factorMatch(q, p, r) { return p + r === q.b && p * r === q.c; }
  function rootMatch(q, values) {
    const expected = [...new Set(q.roots)].sort((a, b) => a - b);
    const actual = [...new Set(values)].sort((a, b) => a - b);
    return actual.length === expected.length && actual.every((x, i) => x === expected[i]);
  }
  const api = { integer, poly, linear, bracket, factors, signed, plan, makeQuestion, original, factorMatch, rootMatch };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RootRescueCore = api;
})(typeof window === 'undefined' ? globalThis : window);

(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  const M = window.RootRescueCore, $ = id => document.getElementById(id);
  const areas = [
    { name: 'First steps', text: 'Distinct positive and negative roots. Practise the difference between a bracket number and a solution.', mascot: 'Vault Dragon', joke: 'Dragon rescued. Your roots have fireproof approval.' },
    { name: 'Mixed signs', text: 'One positive root and one negative root. Check both signs carefully.', mascot: 'Maths Robot', joke: 'Beep boop. Both roots received. Rescue successful.' },
    { name: 'Special roots', text: 'A repeated root, a zero root, and opposite roots. Same method; different-looking answers.', mascot: 'Algebra Cat', joke: 'The cat approves. It was especially pleased you did not lose the zero.' },
    { name: 'Rearrange first', text: 'Collect the equation into a form with zero on one side, then factorise and solve.', mascot: 'Factor Alien', joke: 'Alien rescued. Zero on the right. Everything right in the universe.' }
  ];
  /* Existing arcade artwork, reused here so the same characters continue the story. */
  const art = [
    '<svg viewBox="0 0 260 260" role="img" aria-label="Vault Dragon"><rect width="260" height="260" fill="#d1fae5"/><circle cx="215" cy="48" r="14" fill="#fde68a"/><ellipse cx="132" cy="150" rx="72" ry="58" fill="#34d399"/><circle cx="172" cy="101" r="42" fill="#34d399"/><path d="M76 144 Q39 104 61 65 Q84 79 98 122" fill="none" stroke="#10b981" stroke-width="17" stroke-linecap="round"/><path d="M124 92 L143 64 L154 99 Z M164 82 L187 58 L188 94 Z" fill="#f59e0b"/><circle cx="161" cy="96" r="11" fill="#fff"/><circle cx="164" cy="99" r="5" fill="#111827"/><circle cx="192" cy="112" r="4" fill="#065f46"/><path d="M181 121 Q197 126 202 137" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M180 137 Q206 142 215 127 Q216 150 195 157 Z" fill="#fb7185"/><circle cx="107" cy="145" r="10" fill="#6ee7b7"/><circle cx="137" cy="161" r="10" fill="#6ee7b7"/><circle cx="84" cy="166" r="10" fill="#6ee7b7"/><path d="M102 196 Q130 216 160 196" fill="none" stroke="#065f46" stroke-width="8" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 260 260" role="img" aria-label="Maths Robot"><rect width="260" height="260" fill="#e0f2fe"/><rect x="70" y="56" width="120" height="98" rx="18" fill="#93c5fd" stroke="#1d4ed8" stroke-width="6"/><rect x="83" y="70" width="94" height="29" rx="10" fill="#eff6ff"/><circle cx="106" cy="119" r="16" fill="#fff"/><circle cx="154" cy="119" r="16" fill="#fff"/><circle cx="106" cy="119" r="7" fill="#111827"/><circle cx="154" cy="119" r="7" fill="#111827"/><rect x="110" y="140" width="40" height="9" rx="5" fill="#1d4ed8"/><path d="M130 56 V32" stroke="#64748b" stroke-width="6"/><circle cx="130" cy="26" r="8" fill="#f59e0b"/><rect x="86" y="166" width="88" height="44" rx="12" fill="#60a5fa" stroke="#1d4ed8" stroke-width="6"/><path d="M86 188 L54 210 M174 188 L206 210 M108 210 L96 242 M152 210 L164 242" stroke="#64748b" stroke-width="8" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 260 260" role="img" aria-label="Algebra Cat"><rect width="260" height="260" fill="#fee2e2"/><circle cx="130" cy="136" r="76" fill="#f9a8d4"/><path d="M78 88 L58 44 L104 72 Z M182 88 L202 44 L156 72 Z" fill="#f472b6"/><circle cx="98" cy="126" r="14" fill="#fff"/><circle cx="162" cy="126" r="14" fill="#fff"/><circle cx="98" cy="128" r="6" fill="#111827"/><circle cx="162" cy="128" r="6" fill="#111827"/><polygon points="130,140 120,150 140,150" fill="#be185d"/><path d="M130 150 Q118 164 104 162 M130 150 Q142 164 156 162" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M72 144 L108 148 M72 156 L108 154 M152 148 L188 144 M152 154 L188 156" stroke="#111827" stroke-width="3"/></svg>',
    '<svg viewBox="0 0 260 260" role="img" aria-label="Factor Alien"><rect width="260" height="260" fill="#dbeafe"/><circle cx="206" cy="42" r="6" fill="#fde68a"/><ellipse cx="130" cy="196" rx="94" ry="27" fill="#94a3b8"/><ellipse cx="130" cy="190" rx="68" ry="20" fill="#cbd5e1"/><path d="M78 179 Q88 104 130 98 Q172 104 182 179 Z" fill="#bae6fd" stroke="#38bdf8" stroke-width="5"/><ellipse cx="130" cy="137" rx="45" ry="40" fill="#86efac"/><ellipse cx="112" cy="132" rx="13" ry="18" fill="#111827"/><ellipse cx="148" cy="132" rx="13" ry="18" fill="#111827"/><circle cx="108" cy="127" r="4" fill="#fff"/><circle cx="144" cy="127" r="4" fill="#fff"/><path d="M116 157 Q130 168 144 157" stroke="#166534" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M113 99 L104 73 M147 99 L156 73" stroke="#166534" stroke-width="4"/><circle cx="102" cy="68" r="6" fill="#f472b6"/><circle cx="158" cy="68" r="6" fill="#f472b6"/></svg>'
  ];
  let s = null;
  function text(id, value) { $(id).textContent = value; }
  function bestKey() { return 'quadraticRootRescueBest-v1-' + (s ? s.mode : $('missionSelect').value); }
  function readBest() { try { const n = Number(localStorage.getItem(bestKey())); return Number.isFinite(n) && n >= 0 ? n : 0; } catch (_) { return 0; } }
  function saveBest() { try { localStorage.setItem(bestKey(), String(Math.max(s.stars, readBest()))); } catch (_) { /* Storage may be blocked; gameplay still works. */ } }
  function feedback(message, kind = '') { $('feedback').className = 'feedback' + (kind ? ' ' + kind : ''); text('feedback', message); }
  function describeMission() {
    const mode = $('missionSelect').value;
    text('missionDescription', mode === 'all' ? 'Rescue four characters in order: first steps, mixed signs, special roots, then rearranging to zero. Three locks per area.' : areas[Number(mode)].text);
  }
  function start() {
    const mode = $('missionSelect').value, seen = new Set();
    const questions = M.plan(mode).map(({ area, slot }) => {
      let q, key;
      for (let tries = 0; tries < 40; tries++) { q = M.makeQuestion(area, slot); key = M.original(q); if (!seen.has(key)) break; }
      seen.add(key); return q;
    });
    s = { mode, questions, index: 0, stars: 0, results: [], penalties: 0, clues: 0, stage: '', solved: false, active: true, accepted: [] };
    $('setup').hidden = true; $('finish').hidden = true; $('playing').hidden = false; $('newMission').hidden = false;
    text('crewMessage', 'The crew is counting on your roots.');
    load();
  }
  function current() { return s.questions[s.index]; }
  function load() {
    const q = current();
    s.penalties = 0; s.clues = 0; s.solved = false; s.accepted = [];
    s.stage = q.area === 3 ? 'rearrange' : 'factor';
    $('task').hidden = false; $('solution').hidden = true; $('nextLock').hidden = true;
    text('areaName', areas[q.area].name); text('lockNumber', 'Lock ' + (s.index + 1) + ' of ' + s.questions.length);
    text('equation', M.original(q));
    renderTask(); renderProgress();
    feedback(q.area === 3 ? 'First make one side zero. Do not set brackets to zero while the other side is nonzero.' : 'Start by finding the two bracket numbers. You will solve for x in the next step.');
  }
  function renderSteps() {
    const all = current().area === 3 ? ['rearrange', 'factor', 'roots'] : ['factor', 'roots'];
    const labels = { rearrange: 'Make zero', factor: 'Factorise', roots: 'Find roots' };
    $('steps').replaceChildren();
    all.forEach((name, index) => {
      const li = document.createElement('li'); li.textContent = (index + 1) + '. ' + labels[name];
      li.className = s.solved || all.indexOf(s.stage) > index ? 'done' : name === s.stage ? 'current' : '';
      if (name === s.stage && !s.solved) li.setAttribute('aria-current', 'step');
      $('steps').appendChild(li);
    });
  }
  function renderTask() {
    $('entryA').value = ''; $('entryB').value = ''; s.clues = 0; $('clue').disabled = false;
    const q = current();
    if (s.stage === 'rearrange') {
      text('taskTitle', 'Make one side zero');
      text('taskInstruction', 'Subtract the right-hand terms from both sides. Enter b and c in x\u00b2 + bx + c = 0.');
      text('labelA', 'Middle coefficient b'); text('labelB', 'Constant c'); text('check', 'Check the zero form');
      text('entryNote', 'Keep each term with its sign. The coefficient of x\u00b2 stays 1.');
    } else if (s.stage === 'factor') {
      text('taskTitle', 'Open the factor lock');
      text('taskInstruction', 'Factorise ' + M.poly(q.b, q.c) + '. Enter p and q in (x + p)(x + q).');
      text('labelA', 'Bracket number p'); text('labelB', 'Bracket number q'); text('check', 'Check factorisation');
      text('entryNote', 'Use signed numbers: -4 means (x \u2212 4). Either bracket order works.');
    } else {
      text('taskTitle', 'Open the root lock');
      text('taskInstruction', 'The product is zero, so at least one factor must be zero. Solve each factor = 0.');
      text('labelA', 'First solution: x ='); text('labelB', 'Other solution: x ='); text('check', 'Check roots & rescue');
      text('entryNote', 'Either order works. For one repeated root, leave the other box blank or repeat it.');
    }
    renderSteps(); preview(); updateAvailable();
    $('entryA').focus({ preventScroll: true });
  }
  function preview() {
    if (!s || s.solved) return;
    const a = M.integer($('entryA').value), b = M.integer($('entryB').value);
    if (s.stage === 'roots') { text('preview', M.factors(...s.accepted) + ' = 0'); return; }
    if (a === null || b === null) { text('preview', s.stage === 'rearrange' ? 'x\u00b2 + bx + c = 0' : '(x + p)(x + q) = 0'); return; }
    text('preview', s.stage === 'rearrange' ? M.poly(a, b) + ' = 0' : M.factors(a, b) + ' = 0');
  }
  function updateAvailable() { text('availableStars', Math.max(1, 3 - s.penalties) + ' star' + (Math.max(1, 3 - s.penalties) === 1 ? '' : 's') + ' available'); }
  function wrong(message) { s.penalties++; updateAvailable(); feedback(message + '\nTry again. Earlier rescues are safe.', 'bad'); }
  function check(event) {
    event.preventDefault();
    if (!s || !s.active || s.solved) return;
    const q = current(), raw = [$('entryA').value.trim(), $('entryB').value.trim()], values = raw.map(M.integer);
    const invalid = raw.some((v, i) => v !== '' && values[i] === null);
    if (invalid || raw.every(v => v === '')) { feedback('Enter whole signed numbers, such as -4, 0 or 6. No stars lost for an invalid entry.', 'bad'); return; }
    if (s.stage !== 'roots' && values.some(v => v === null)) { feedback('Fill both boxes before checking. No stars lost.', 'bad'); return; }
    if (s.stage === 'rearrange') {
      if (values[0] === q.b && values[1] === q.c) {
        s.stage = 'factor'; renderTask(); feedback('Zero form correct: ' + M.poly(q.b, q.c) + ' = 0. Now factorise the left side.', 'good');
      } else { wrong('Collect like terms after subtracting the right-hand side. Subtract negative terms carefully.'); }
      return;
    }
    if (s.stage === 'factor') {
      const [p, r] = values;
      if (M.factorMatch(q, p, r)) {
        s.accepted = values; s.stage = 'roots'; renderTask();
        feedback('Factor lock open. Now find the values of x that make these factors zero.', 'good');
      } else {
        wrong('Your numbers add to ' + (p + r) + ' and multiply to ' + (p * r) + '. They need to add to ' + q.b + ' and multiply to ' + q.c + '.');
      }
      return;
    }
    const roots = values.filter(v => v !== null), distinct = new Set(q.roots).size;
    if (roots.length < distinct) { feedback('There are two different solutions here. Enter both before checking. No stars lost for an incomplete answer.', 'bad'); return; }
    if (M.rootMatch(q, roots)) { complete(false); return; }
    if (new Set(roots).size === 1 && distinct === 2 && q.roots.includes(roots[0])) { wrong('That is one correct root, but it has been repeated. Find the solution from the other factor too.'); }
    else if (M.factorMatch(q, roots[0], roots.length > 1 ? roots[1] : roots[0])) { wrong('Those are the bracket numbers, not the roots. Set each factor equal to zero and solve for x.'); }
    else { wrong('Check each proposed root in the factors. At least one factor must become zero. For x + p = 0, the solution is x = -p.'); }
  }
  function clue() {
    if (!s || s.solved || s.clues >= 2) return;
    const q = current(); s.clues++; s.penalties++; updateAvailable();
    let message;
    if (s.stage === 'rearrange') {
      message = s.clues === 1 ? 'Subtract ' + M.linear(q.rx, q.rc) + ' from BOTH sides, then collect the x-terms and constants.' : 'For the zero form: b = ' + M.signed(q.leftB) + ' - ' + M.signed(q.rx) + '; c = ' + M.signed(q.leftC) + ' - ' + M.signed(q.rc) + '.';
    } else if (s.stage === 'factor') {
      message = s.clues === 1 ? (q.c === 0 ? 'The constant is zero: one bracket number is 0. Taking out x gives x(x + b).' : 'Find two integers with sum ' + q.b + ' and product ' + q.c + '. ' + (q.c < 0 ? 'They have opposite signs.' : q.b < 0 ? 'They are both negative.' : 'They are both positive.')) : 'One bracket number can be ' + q.p + '. Which second number gives both the required sum and product?';
    } else {
      const p = s.accepted[0];
      message = s.clues === 1 ? 'Solve ' + M.linear(1, p) + ' = 0 first. What must x be? Do the same for the other factor.' : 'One solution is x = ' + (-p || 0) + '. ' + (q.p === q.q ? 'Both factors are the same, so this is the only distinct solution.' : 'Now make the OTHER factor zero to find the remaining solution.');
    }
    feedback('Clue ' + s.clues + ': ' + message);
    $('clue').disabled = s.clues >= 2;
  }
  function addLine(parent, value, cls) { const p = document.createElement('p'); p.className = cls || ''; p.textContent = value; parent.appendChild(p); }
  function showSolution(assisted, earned) {
    const q = current(), box = $('solution'); box.replaceChildren(); box.hidden = false;
    const h = document.createElement('h3'); h.textContent = assisted ? 'Study the method' : 'Lock open! ' + '\u2605'.repeat(earned) + '\u2606'.repeat(3 - earned); box.appendChild(h);
    addLine(box, M.original(q), 'math');
    if (q.area === 3) { addLine(box, 'Subtract ' + M.linear(q.rx, q.rc) + ' from both sides and collect like terms.'); addLine(box, M.poly(q.b, q.c) + ' = 0', 'math'); }
    addLine(box, 'Bracket numbers: ' + M.signed(q.p) + ' + ' + M.signed(q.q) + ' = ' + q.b + '; ' + M.signed(q.p) + ' \u00d7 ' + M.signed(q.q) + ' = ' + q.c + '.', 'check-line');
    addLine(box, M.factors(q.p, q.q) + ' = 0', 'math');
    addLine(box, M.linear(1, q.p) + ' = 0' + (q.p === q.q ? '' : '  or  ' + M.linear(1, q.q) + ' = 0'), 'math');
    const roots = [...new Set(q.roots)];
    addLine(box, roots.map(r => 'x = ' + (r < 0 ? '\u2212' + Math.abs(r) : r)).join('  or  ') + (roots.length === 1 ? '  (one distinct, repeated root)' : ''), 'math');
    roots.forEach(r => { const left = r * r + q.leftB * r + q.leftC, right = q.rx * r + q.rc; addLine(box, 'Check x = ' + r + ' in the ORIGINAL equation: left side = ' + left + ', right side = ' + right + '.', 'check-line'); });
    if (assisted) addLine(box, 'This worked example opens the lock for 0 stars. The next lock is a fresh chance to solve independently.', 'check-line');
  }
  function complete(assisted) {
    if (s.solved || !s.active) return;
    const q = current(), earned = assisted ? 0 : Math.max(1, 3 - s.penalties);
    s.solved = true; s.stars += earned; s.results.push({ area: q.area, stars: earned, assisted }); saveBest();
    $('task').hidden = true; $('nextLock').hidden = false;
    text('nextLock', s.index + 1 === s.questions.length ? 'Complete the mission \u2192' : 'Next lock \u2192');
    feedback(assisted ? 'Worked example opened. Read the steps before continuing.' : 'Correct! The factors and roots both work. Another rescue lock is open.', 'good');
    showSolution(assisted, earned); renderSteps(); renderProgress();
    if (s.results.filter(r => r.area === q.area).length === 3) text('crewMessage', areas[q.area].joke);
    $('nextLock').focus({ preventScroll: true });
  }
  function pod(area, progress, currentArea) {
    const fig = document.createElement('figure'); fig.className = 'pod' + (progress === 3 ? ' rescued' : '') + (area === currentArea ? ' current' : '');
    const portrait = document.createElement('div'); portrait.className = 'portrait';
    const mystery = document.createElement('span'); mystery.textContent = '?'; mystery.setAttribute('aria-hidden', 'true'); portrait.appendChild(mystery);
    portrait.insertAdjacentHTML('beforeend', art[area]);
    const svg = portrait.querySelector('svg'); svg.style.clipPath = 'inset(' + (100 - progress * 100 / 3) + '% 0 0)'; svg.setAttribute('aria-hidden', progress < 3 ? 'true' : 'false');
    if (progress === 3) mystery.hidden = true;
    const caption = document.createElement('figcaption'); caption.textContent = progress === 3 ? areas[area].mascot + ' rescued' : 'Rescue ' + (area + 1) + ' \u00b7 ' + progress + '/3';
    fig.append(portrait, caption); return fig;
  }
  function renderProgress() {
    text('opened', s.results.length + ' / ' + s.questions.length); text('stars', s.stars + ' / ' + s.questions.length * 3); text('best', readBest());
    const activeAreas = [...new Set(s.questions.map(q => q.area))], counts = activeAreas.map(a => s.results.filter(r => r.area === a).length);
    text('rescued', counts.filter(n => n === 3).length + ' / ' + activeAreas.length);
    $('route').replaceChildren();
    s.questions.forEach((q, i) => { const dot = document.createElement('span'); dot.className = 'route-dot' + (i < s.results.length ? ' done' : i === s.index ? ' current' : ''); dot.title = 'Lock ' + (i + 1) + ': ' + areas[q.area].name; dot.setAttribute('aria-label', dot.title + (i < s.results.length ? ', opened' : i === s.index ? ', current' : ', locked')); $('route').appendChild(dot); });
    $('crew').replaceChildren(); activeAreas.forEach((a, i) => $('crew').appendChild(pod(a, counts[i], current().area)));
  }
  function finish() {
    s.active = false; $('playing').hidden = true; $('finish').hidden = false;
    text('finalStars', '\u2605 ' + s.stars + ' / ' + s.questions.length * 3 + ' stars');
    const assisted = s.results.filter(r => r.assisted).length;
    text('finishMessage', (s.results.length - assisted) + ' equations solved, ' + assisted + ' worked examples studied. Best for this mission: ' + readBest() + ' stars.');
    $('finishCrew').replaceChildren(); [...new Set(s.questions.map(q => q.area))].forEach(a => $('finishCrew').appendChild(pod(a, 3, -1)));
    $('finish').focus({ preventScroll: true });
  }
  function chooseMission() {
    if (s && s.active && !window.confirm('Leave this rescue? Your best score stays saved, but this mission will restart.')) return;
    s = null; $('setup').hidden = false; $('playing').hidden = true; $('finish').hidden = true; $('newMission').hidden = true;
    describeMission(); $('missionSelect').focus({ preventScroll: true });
  }
  $('missionSelect').addEventListener('change', describeMission);
  $('startMission').addEventListener('click', start);
  $('answerForm').addEventListener('submit', check);
  $('clue').addEventListener('click', clue);
  $('worked').addEventListener('click', () => { if (s && !s.solved && window.confirm('Open this lock by studying the full solution? This lock will earn 0 stars.')) complete(true); });
  $('nextLock').addEventListener('click', () => { if (!s || !s.active || !s.solved) return; if (s.index + 1 === s.questions.length) finish(); else { s.index++; load(); } });
  $('replay').addEventListener('click', start);
  $('newMission').addEventListener('click', chooseMission);
  $('chooseMission').addEventListener('click', chooseMission);
  ['entryA', 'entryB'].forEach(id => $(id).addEventListener('input', preview));
  document.querySelectorAll('[data-sign]').forEach(button => button.addEventListener('click', () => { const input = $(button.dataset.sign); const value = input.value.trim().replace(/\u2212/g, '-'); input.value = value.startsWith('-') ? value.slice(1) : '-' + value.replace(/^\+/, ''); preview(); input.focus({ preventScroll: true }); }));
  describeMission();
  const activeTab = document.querySelector('.arcade-tab.active');
  const tabStrip = document.querySelector('.arcade-tabs-wrap');
  if (activeTab && tabStrip) {
    const tab = activeTab.getBoundingClientRect(), strip = tabStrip.getBoundingClientRect();
    tabStrip.scrollLeft = Math.max(0, tab.left - strip.left + tabStrip.scrollLeft - (strip.width - tab.width) / 2);
  }
})();
