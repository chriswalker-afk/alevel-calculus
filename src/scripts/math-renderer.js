const SUPERSCRIPT_CHARACTERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const DERIVATIVE_PATTERN = `(?:d(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?[A-Za-z]*\\/d[A-Za-z]+(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?|∂(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?[A-Za-z]*\\/∂[A-Za-z]+(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?)`;
const FUNCTION_PATTERN = "(?:sin|cos|tan|sec|cosec|cot|ln|log|exp)";
const SCRIPT_SUFFIX_PATTERN = "(?:[_^](?:\\([^)]{1,60}\\)|-?\\d+|[A-Za-z]+))*";
const FUNCTION_CALL_PATTERN = `${FUNCTION_PATTERN}\\([^()\\n]{1,80}\\)${SCRIPT_SUFFIX_PATTERN}`;
const ROOT_PATTERN = `√(?:\\([^()\\n]{1,100}\\)|[A-Za-zπ\\d]+(?:[${SUPERSCRIPT_CHARACTERS}]+)?)${SCRIPT_SUFFIX_PATTERN}`;
const SIMPLE_MATH_ATOM_PATTERN = `(?:\\d+(?:\\.\\d+)?${SCRIPT_SUFFIX_PATTERN}|(?:Δ[A-Za-z]|[A-Za-zπ])(?:[′']{1,2})?(?:[${SUPERSCRIPT_CHARACTERS}]+)?${SCRIPT_SUFFIX_PATTERN}|${FUNCTION_CALL_PATTERN}|${FUNCTION_PATTERN}[${SUPERSCRIPT_CHARACTERS}]*\\s*[A-Za-zπ](?:[${SUPERSCRIPT_CHARACTERS}]+)?${SCRIPT_SUFFIX_PATTERN}|[A-Za-zπ](?:[′']{1,2})?\\([^()\\n]{1,50}\\)${SCRIPT_SUFFIX_PATTERN}|${ROOT_PATTERN}|\\?)`;
const PAREN_GROUP_PATTERN = `\\((?:[^()\\n]|\\([^()\\n]{0,60}\\)){1,140}\\)${SCRIPT_SUFFIX_PATTERN}`;
const SQUARE_GROUP_PATTERN = `\\[[^\\[\\]\\n]{1,140}\\]${SCRIPT_SUFFIX_PATTERN}`;
const ABS_GROUP_PATTERN = `\\|[^|\\n]{1,100}\\|`;
const MONOMIAL_PATTERN = `(?:\\d+(?:\\.\\d+)?[A-Za-zπ]{1,3}|[A-Za-zπ]{2,3})${SCRIPT_SUFFIX_PATTERN}`;
const FRACTION_ATOM_PATTERN = `(?:${PAREN_GROUP_PATTERN}|${SQUARE_GROUP_PATTERN}|${ABS_GROUP_PATTERN}|${MONOMIAL_PATTERN}|${SIMPLE_MATH_ATOM_PATTERN})`;
const FRACTION_PATTERN = new RegExp(`(?<![A-Za-z])(?:${DERIVATIVE_PATTERN}|${FRACTION_ATOM_PATTERN}\\s*\\/\\s*${FRACTION_ATOM_PATTERN})(?![A-Za-z])`, "g");
const SCRIPT_PATTERN = /([_^])(\([^)]{1,60}\)|-?\d+|[A-Za-z]+)/g;
const INTEGRAL_PATTERN = /∫(?:_\(([^)]{1,80})\)|_([A-Za-z0-9π∞+−-]+))?(?:\^\(([^)]{1,80})\)|\^([A-Za-z0-9π∞+−-]+))?/g;
const SUPERSCRIPT_MAP = Object.freeze({
  "⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9",
  "ⁿ":"n","⁺":"+","⁻":"-"
});
const SUPERSCRIPT_FRACTION_PATTERN = /([⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻]+)[ᐟ⁄]([⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻]+)/g;
const COMPLEX_SUPERSCRIPT_PATTERN = /[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻]*[ⁿ⁺⁻][⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻]*/g;

function decodeSuperscript(value) {
  return [...String(value ?? "")].map((character) => SUPERSCRIPT_MAP[character] ?? character).join("");
}

export function normaliseMathSource(source) {
  let text = String(source ?? "");
  text = text.replace(SUPERSCRIPT_FRACTION_PATTERN, (_, numerator, denominator) =>
    `^(${decodeSuperscript(numerator)}/${decodeSuperscript(denominator)})`
  );
  text = text.replace(COMPLEX_SUPERSCRIPT_PATTERN, (value) => `^(${decodeSuperscript(value)})`);
  return text;
}

function isInsideScriptGroup(text, index) {
  const stack = [];
  for (let cursor = 0; cursor < index; cursor += 1) {
    const character = text[cursor];
    if (character === "(") {
      let previous = cursor - 1;
      while (previous >= 0 && /\s/.test(text[previous])) previous -= 1;
      const directScript = text[previous] === "^" || text[previous] === "_";
      stack.push(directScript || Boolean(stack[stack.length - 1]));
    } else if (character === ")") {
      stack.pop();
    }
  }
  return stack.some(Boolean);
}


export const mathRenderSelector = [
  "[data-activity-formula]",
  "[data-question-shell-math]",
  "[data-question-shell-choice-label]",
  "[data-math-render]",
  "[data-math-display]",
  "[data-math-prose]",
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
  "[class*=\"__notation\"]",
  "[class*=\"__math\"]"
].join(",");

const displayMathSelector = [
  "[data-activity-formula]",
  "[data-question-shell-math]",
  "[data-math-display]",
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
  const text = normaliseMathSource(source);
  const tokens = [];
  let cursor = 0;
  FRACTION_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(FRACTION_PATTERN)) {
    const index = match.index ?? 0;
    if (isInsideScriptGroup(text, index)) continue;
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

function createIntegralNode({ lower = "", upper = "" } = {}, doc) {
  const integral = doc.createElement("span");
  integral.className = lower || upper ? "math-integral math-integral--limited" : "math-integral";

  const symbol = doc.createElement("span");
  symbol.className = "math-integral__symbol";
  symbol.textContent = "∫";
  integral.append(symbol);

  if (lower || upper) {
    const limits = doc.createElement("span");
    limits.className = "math-integral__limits";
    const upperNode = doc.createElement("span");
    upperNode.className = "math-integral__upper";
    const lowerNode = doc.createElement("span");
    lowerNode.className = "math-integral__lower";
    if (upper) appendMathText(upperNode, upper, doc);
    if (lower) appendMathText(lowerNode, lower, doc);
    limits.append(upperNode, lowerNode);
    integral.append(limits);
  }
  return integral;
}

function appendScriptsOnly(parent, value, doc) {
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

function appendScriptedText(parent, value, doc) {
  const text = String(value ?? "");
  let cursor = 0;
  INTEGRAL_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(INTEGRAL_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) appendScriptsOnly(parent, text.slice(cursor, index), doc);
    parent.append(createIntegralNode({
      lower: match[1] ?? match[2] ?? "",
      upper: match[3] ?? match[4] ?? ""
    }, doc));
    cursor = index + match[0].length;
  }
  if (cursor < text.length) appendScriptsOnly(parent, text.slice(cursor), doc);
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
