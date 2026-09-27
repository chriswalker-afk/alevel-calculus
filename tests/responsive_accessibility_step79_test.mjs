import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const tokens = read('src/styles/tokens.css');
const shellCss = read('src/styles/app-shell.css');
const areaCss = read('src/styles/area-explorer.css');
const diagramCss = read('src/styles/diagram-primitives.css');
const questionCss = read('src/styles/question-shell.css');
const memoryCss = read('src/styles/memory-lab.css');
const shellJs = read('src/scripts/app-shell.js');
const vocabJs = read('src/scripts/vocabulary-term.js');
const diagramJs = read('src/scripts/diagram-primitives.js');
const memoryJs = read('src/scripts/memory-lab.js');
const classwizJs = read('src/scripts/classwiz-support-panel.js');
const html = read('src/index.html');

function block(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Missing CSS block for ${selector}`);
  return match[1];
}

// Shared focus and minimum-target contracts.
assert.match(tokens, /--touch-target-min:\s*44px/);
assert.match(tokens, /:where\(a, button, input, select, textarea, \[tabindex\]\):focus-visible/);
assert.match(tokens, /outline:\s*var\(--focus-ring-width\) solid var\(--focus-ring\)/);

for (const selector of [
  '.activity-help-button',
  '.word-bank-button',
  '.vocabulary-popover__open-bank',
  '.word-bank-filter',
  '.word-bank-review-toggle',
  '.data-management-trigger',
  '.classwiz-support-button'
]) {
  assert.match(block(shellCss, selector), /min-height:\s*var\(--touch-target-min\)/, `${selector} must keep the shared 44px target`);
}
assert.match(block(shellCss, '.word-bank-entry'), /min-height:\s*var\(--touch-target-min\)/);
assert.match(block(areaCss, '.area-explorer__split-input'), /min-height:\s*var\(--touch-target-min, 44px\)/);
assert.match(diagramCss, /\.diagram-primitives__slider-input[\s\S]*min-height:\s*var\(--touch-target-min\)/);
assert.match(questionCss, /\.question-shell button:focus-visible/);
assert.match(memoryCss, /\.memory-lab button:focus-visible/);

// Narrow-screen contract: one shell, contained scrolling and visible five-mode strip.
assert.match(shellCss, /@media \(max-width: 900px\)/);
assert.match(shellCss, /@media \(max-width: 680px\)/);
assert.match(shellCss, /html,\s*body\s*\{[\s\S]*?overflow:\s*hidden/);
assert.match(shellCss, /\.activity-stage\s*\{[\s\S]*?overflow:\s*auto/);
assert.match(shellCss, /@media \(max-width: 680px\)[\s\S]*?\.mode-tab\s*\{[\s\S]*?min-height:\s*46px/);
assert.match(shellCss, /\.math-placeholder__formula\s*\{[\s\S]*?overflow-wrap:\s*anywhere/);

// Keyboard completion for core journeys.
assert.match(shellJs, /\["ArrowLeft", "ArrowRight", "Home", "End"\]/);
assert.match(shellJs, /event\.key === "Escape" && classWizOpen/);
assert.match(shellJs, /event\.key === "Escape" && wordBankOpen/);
assert.match(shellJs, /event\.key === "Escape" && helpOpen/);
assert.match(shellJs, /event\.key === "Escape" && navigationOpen/);
assert.match(diagramJs, /event\.key === "ArrowLeft"/);
assert.match(diagramJs, /event\.key === "ArrowRight"/);
assert.match(diagramJs, /event\.key === "ArrowDown"/);
assert.match(diagramJs, /event\.key === "ArrowUp"/);
assert.match(memoryJs, /\["ArrowLeft", "ArrowRight", "Home", "End"\]/);
assert.match(classwizJs, /\['ArrowLeft', 'ArrowRight', 'Home', 'End'\]/);

// Drawers move focus in and return it; background becomes inert.
assert.match(shellJs, /setHelpBackgroundInert\(true\)/);
assert.match(shellJs, /classWizClose\.focus/);
assert.match(shellJs, /wordBankSearch\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
assert.match(shellJs, /helpDrawerClose\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
assert.match(shellJs, /topicNavigationClose\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
assert.match(shellJs, /if \(restoreFocus\) classWizTrigger\.focus/);
assert.match(shellJs, /if \(restoreFocus\) helpDrawerTrigger\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
assert.match(shellJs, /topicNavigationToggle\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);

// Definitions use hover on fine pointers, while touch/keyboard activation can explicitly open them and outside interaction dismisses them.
assert.match(shellCss, /@media \(hover: hover\) and \(pointer: fine\)[\s\S]*?\.vocabulary-term-wrap:hover \.vocabulary-popover/);
assert.doesNotMatch(shellCss, /\.vocabulary-term-wrap:focus-within \.vocabulary-popover/);
assert.match(vocabJs, /button\.addEventListener\("click"/);
assert.match(vocabJs, /event\.detail === 0/);
assert.match(vocabJs, /document\.addEventListener\("pointerdown", dismissOutside\)/);
assert.match(vocabJs, /document\.addEventListener\("focusin", dismissOutside\)/);
assert.match(vocabJs, /event\.key !== "Escape"/);
assert.match(vocabJs, /aria-expanded/);
assert.match(vocabJs, /aria-describedby/);

// Reduced motion: tokens go to zero AND a central guard catches hard-coded future motion.
assert.match(tokens, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(tokens, /--motion-fast:\s*0ms/);
assert.match(tokens, /animation-duration:\s*0\.01ms !important/);
assert.match(tokens, /animation-iteration-count:\s*1 !important/);
assert.match(tokens, /transition-duration:\s*0\.01ms !important/);
assert.match(tokens, /transition-delay:\s*0ms !important/);
assert.match(tokens, /scroll-behavior:\s*auto/);

// Non-colour cues survive: progress symbols, signed-area dash/sign, feedback symbols.
assert.match(html, /data-mode-progress-symbol/);
assert.match(areaCss, /area-explorer__region--negative[\s\S]*stroke-dasharray/);
assert.match(areaCss, /area-explorer__region-sign/);
assert.match(html, /data-question-shell-feedback-symbol/);

// Core dialog/status semantics and named controls.
assert.match(html, /role="tabpanel"/);
assert.match(html, /role="status" aria-live="polite"/);
assert.match(html, /aria-label="Close reminder help"/);
assert.match(html, /aria-label="Close Word Bank"/);
assert.match(html, /aria-label="Close ClassWiz calculator support"/);

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((v) => parseInt(v, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
function rootVar(name) {
  const match = tokens.match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(match, `Missing ${name}`);
  return match[1];
}
for (const [fgName, bgName] of [
  ['--text-primary', '--surface-base'],
  ['--text-secondary', '--surface-base'],
  ['--text-muted', '--surface-base'],
  ['--feedback-info-ink', '--feedback-info-soft'],
  ['--feedback-warning-ink', '--feedback-warning-soft'],
  ['--feedback-incorrect-ink', '--feedback-incorrect-soft'],
  ['--feedback-correct-ink', '--feedback-correct-soft']
]) {
  const ratio = contrast(rootVar(fgName), rootVar(bgName));
  assert.ok(ratio >= 4.5, `${fgName} on ${bgName} contrast ${ratio.toFixed(2)} must be >= 4.5`);
}

console.log('Step 79 responsive/accessibility/reduced-motion audit passed.');
