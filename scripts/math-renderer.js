const SUPERSCRIPT_CHARACTERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const DERIVATIVE_PATTERN = `(?:d(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?[A-Za-z]*\\/d[A-Za-z]+(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?|∂(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?[A-Za-z]*\\/∂[A-Za-z]+(?:[${SUPERSCRIPT_CHARACTERS}]+|\\^\\d+)?)`;
const FRACTION_ATOM_PATTERN = `(?:\\([^()\\n]{1,60}\\)|√?[A-Za-zπ\\d]+[${SUPERSCRIPT_CHARACTERS}]*)`;
const FRACTION_PATTERN = new RegExp(`${DERIVATIVE_PATTERN}|${FRACTION_ATOM_PATTERN}\\/${FRACTION_ATOM_PATTERN}`, "g");
const SCRIPT_PATTERN = /([_^])(\([^)]{1,40}\)|-?\d+|[A-Za-z]+)/g;

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
    const slash = raw.indexOf("/");
    tokens.push({
      type: "fraction",
      numerator: trimOuterParentheses(raw.slice(0, slash)),
      denominator: trimOuterParentheses(raw.slice(slash + 1)),
      derivative: raw.startsWith("d") || raw.startsWith("∂")
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
    script.textContent = trimOuterParentheses(match[2]);
    parent.append(script);
    cursor = index + match[0].length;
  }
  if (cursor < text.length) parent.append(doc.createTextNode(text.slice(cursor)));
}

function createFractionNode(token, doc) {
  const fraction = doc.createElement("span");
  fraction.className = token.derivative ? "math-fraction math-fraction--derivative" : "math-fraction";
  const numerator = doc.createElement("span");
  numerator.className = "math-fraction__numerator";
  appendScriptedText(numerator, token.numerator, doc);
  const denominator = doc.createElement("span");
  denominator.className = "math-fraction__denominator";
  appendScriptedText(denominator, token.denominator, doc);
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

  for (const token of tokeniseMathExpression(raw)) {
    if (token.type === "fraction") wrapper.append(createFractionNode(token, doc));
    else appendScriptedText(wrapper, token.value, doc);
  }

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
