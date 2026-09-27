const SUPERSCRIPT_CHARACTERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const DERIVATIVE_PATTERN = `(?:d(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?[A-Za-z]*\\/d[A-Za-z]+(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?|∂(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?[A-Za-z]*\\/∂[A-Za-z]+(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?)`;
const FUNCTION_PATTERN = "(?:sin|cos|tan|sec|cosec|cot|ln|log|exp)";
const SCRIPT_SUFFIX_PATTERN = "(?:[_^](?:\\([^)]{1,60}\\)|-?\\d+|[A-Za-z]+))*";
const SIMPLE_MATH_ATOM_PATTERN = `(?:\\d+(?:\\.\\d+)?${SCRIPT_SUFFIX_PATTERN}|(?:Δ[A-Za-z]|[A-Za-zπ])(?:[′']{1,2})?(?:[${SUPERSCRIPT_CHARACTERS}]+)?${SCRIPT_SUFFIX_PATTERN}|${FUNCTION_PATTERN}[${SUPERSCRIPT_CHARACTERS}]*\\s*[A-Za-zπ](?:[${SUPERSCRIPT_CHARACTERS}]+)?${SCRIPT_SUFFIX_PATTERN}|[A-Za-zπ](?:[′']{1,2})?\\([^()\\n]{1,50}\\)${SCRIPT_SUFFIX_PATTERN}|\\?)`;
const PAREN_GROUP_PATTERN = `\\((?:[^()\\n]|\\([^()\\n]{0,60}\\)){1,140}\\)`;
const SQUARE_GROUP_PATTERN = `\\[[^\\[\\]\\n]{1,140}\\]`;
const ABS_GROUP_PATTERN = `\\|[^|\\n]{1,100}\\|`;
const FRACTION_ATOM_PATTERN = `(?:${PAREN_GROUP_PATTERN}|${SQUARE_GROUP_PATTERN}|${ABS_GROUP_PATTERN}|${SIMPLE_MATH_ATOM_PATTERN})`;
const FRACTION_PATTERN = new RegExp(`(?<![A-Za-z])(?:${DERIVATIVE_PATTERN}|${FRACTION_ATOM_PATTERN}\\s*\\/\\s*${FRACTION_ATOM_PATTERN})(?![A-Za-z])`, "g");
const SCRIPT_PATTERN = /([_^])(\([^)]{1,60}\)|-?\d+|[A-Za-z]+)/g;

export const mathRenderSelector = [
  "[data-activity-formula]",
  "[data-question-shell-math]",
  "[data-question-shell-choice-label]",
  ".equation-step__expression",
  ".memory-learn-item__notation",
  ".memory-flashcard__content",
  ".memory-match-option",
  "[data-build-context]",
  ".memory-build-slot",
  ".memory-game-token",
  ".memory-game-expression",
  ".memory-game-choice",
  ".memory-impostor-option",
  ".memory-sort-item",
  ".memory-rapid-option",
  ".word-bank-detail__notation",
  "[class*=\"__formula\"]",
  "[class*=\"__equation\"]",
  "[class*=\"__expression\"]",
  "[class*=\"__notation\"]"
].join(",");

const displayMathSelector = [
  "[data-activity-formula]",
  "[data-question-shell-math]",
  ".equation-step__expression",
  ".memory-learn-item__notation",
  ".memory-flashcard__content",
  ".memory-game-expression",
  ".word-bank-detail__notation",
  "[class*=\"__formula\"]",
  "[class*=\"__equation\"]"
].join(",");

function trimOuterParentheses(value) {
  const text = String(value ?? "");
  if (text.startsWith("(") && text.endsWith(")")) return text.slice(1, -1);
  return text;
}

function trimFractionGrouping(value) {
  const text = String(value ?? "").trim();
  if ((text.startsWith("(") && text.endsWith(")")) || (text.startsWith("[") && text.endsWith("]"))) {
    return text.slice(1, -1).trim();
  }
  return text;
}

function findTopLevelSlash(value) {
  const text = String(value ?? "");
  let roundDepth = 0;
  let squareDepth = 0;
  let absoluteDepth = 0;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === "|" && roundDepth === 0 && squareDepth === 0) {
      absoluteDepth = absoluteDepth ? 0 : 1;
      continue;
    }
    if (absoluteDepth) continue;
    if (character === "(") roundDepth += 1;
    else if (character === ")") roundDepth = Math.max(0, roundDepth - 1);
    else if (character === "[") squareDepth += 1;
    else if (character === "]") squareDepth = Math.max(0, squareDepth - 1);
    else if (character === "/" && roundDepth === 0 && squareDepth === 0) return index;
  }
  return text.indexOf("/");
}

function pushTextToken(tokens, value) {
  if (!value) return;
  const previous = tokens[tokens.length - 1];
  if (previous?.type === "text") previous.value += value;
  else tokens.push({ type: "text", value });
}

export function tokeniseMathExpression(source) {
  const text = String(source ?? "");
  const tokens = [];
  let cursor = 0;
  FRACTION_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(FRACTION_PATTERN)) {
    const index = match.index ?? 0;
    pushTextToken(tokens, text.slice(cursor, index));
    const raw = match[0];
    const slash = findTopLevelSlash(raw);
    tokens.push({
      type: "fraction",
      numerator: trimFractionGrouping(raw.slice(0, slash)),
      denominator: trimFractionGrouping(raw.slice(slash + 1)),
      derivative: raw.trimStart().startsWith("d") || raw.trimStart().startsWith("∂")
    });
    cursor = index + raw.length;
  }
  pushTextToken(tokens, text.slice(cursor));
  return Object.freeze(tokens.map((token) => Object.freeze({ ...token })));
}

function appendScriptedText(parent, value, doc) {
  const text = String(value ?? "");
  let cursor = 0;
  SCRIPT_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(SCRIPT_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) parent.append(doc.createTextNode(text.slice(cursor, index)));
    const script = doc.createElement(match[1] === "^" ? "sup" : "sub");
    script.className = "math-script";
    appendMathText(script, trimOuterParentheses(match[2]), doc);
    parent.append(script);
    cursor = index + match[0].length;
  }
  if (cursor < text.length) parent.append(doc.createTextNode(text.slice(cursor)));
}

function appendMathText(parent, value, doc) {
  for (const token of tokeniseMathExpression(String(value ?? ""))) {
    if (token.type === "fraction") parent.append(createFractionNode(token, doc));
    else appendScriptedText(parent, token.value, doc);
  }
}

function createFractionNode(token, doc) {
  const fraction = doc.createElement("span");
  fraction.className = token.derivative ? "math-fraction math-fraction--derivative" : "math-fraction";
  const numerator = doc.createElement("span");
  numerator.className = "math-fraction__numerator";
  appendMathText(numerator, token.numerator, doc);
  const denominator = doc.createElement("span");
  denominator.className = "math-fraction__denominator";
  appendMathText(denominator, token.denominator, doc);
  fraction.append(numerator, denominator);
  return fraction;
}

function hasStructuredChildren(element) {
  const children = Array.from(element.children ?? []);
  if (children.length === 0) return false;
  return !(children.length === 1 && children[0].hasAttribute("data-math-rendered-content"));
}

export function renderMathElement(element, { source = null } = {}) {
  if (!element || hasStructuredChildren(element)) return false;
  const raw = String(source ?? element.textContent ?? "").trim();
  if (!raw) {
    element.classList?.remove("math-typeset", "math-typeset--display");
    delete element.dataset.mathSource;
    return false;
  }

  const doc = element.ownerDocument ?? globalThis.document;
  if (!doc?.createElement) return false;

  const wrapper = doc.createElement("span");
  wrapper.className = "math-typeset__content";
  wrapper.setAttribute("data-math-rendered-content", "");

  appendMathText(wrapper, raw, doc);

  element.classList.add("math-typeset");
  if (typeof element.matches === "function" && element.matches(displayMathSelector)) element.classList.add("math-typeset--display");
  else element.classList.remove("math-typeset--display");
  element.dataset.mathSource = raw;
  element.replaceChildren(wrapper);
  return true;
}

function renderCandidates(root) {
  if (!root?.querySelectorAll) return;
  if (typeof root.matches === "function" && root.matches(mathRenderSelector)) renderMathElement(root);
  for (const element of root.querySelectorAll(mathRenderSelector)) renderMathElement(element);
}

function isRendererMutation(mutation) {
  if (mutation.addedNodes?.length !== 1) return false;
  const node = mutation.addedNodes[0];
  return node?.nodeType === 1 && node.hasAttribute?.("data-math-rendered-content");
}

export function installMathRendering(root = globalThis.document) {
  if (!root) return Object.freeze({ disconnect() {} });
  renderCandidates(root);

  const Observer = root.ownerDocument?.defaultView?.MutationObserver ?? globalThis.MutationObserver;
  if (typeof Observer !== "function") return Object.freeze({ disconnect() {} });

  const observer = new Observer((mutations) => {
    const candidates = new Set();
    for (const mutation of mutations) {
      if (isRendererMutation(mutation)) continue;
      const target = mutation.target?.nodeType === 1 ? mutation.target : mutation.target?.parentElement;
      if (target?.closest?.("[data-math-rendered-content]")) continue;
      const direct = target?.closest?.(mathRenderSelector);
      if (direct) candidates.add(direct);
      for (const node of mutation.addedNodes ?? []) {
        if (node?.nodeType !== 1 || node.hasAttribute?.("data-math-rendered-content")) continue;
        if (node.matches?.(mathRenderSelector)) candidates.add(node);
        for (const nested of node.querySelectorAll?.(mathRenderSelector) ?? []) candidates.add(nested);
      }
    }
    for (const candidate of candidates) renderMathElement(candidate);
  });

  observer.observe(root, { childList: true, subtree: true });
  return Object.freeze({ disconnect: () => observer.disconnect() });
}
