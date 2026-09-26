import { DiagramPrimitives } from "./diagram-primitives.js";
import { evaluatePolynomial } from "./linked-function-gradient-explorer.js";

function createElement(documentRef, tag, className = "") {
  const element = documentRef.createElement(tag);
  if (className) element.className = className;
  return element;
}

function sample(coefficients, xDomain, count = 90) {
  const [xMin, xMax] = xDomain;
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = xMin + (index / count) * (xMax - xMin);
    return { x, y: evaluatePolynomial(coefficients, x) };
  });
}

export function createQuestionVisualRenderer(host) {
  if (!host?.ownerDocument) return Object.freeze({ render() {}, clear() {} });
  const documentRef = host.ownerDocument;
  let diagrams = [];

  function clear() {
    for (const diagram of diagrams) diagram.destroy();
    diagrams = [];
    host.replaceChildren();
    host.hidden = true;
    delete host.dataset.visualKind;
  }

  function addGraph(container, { title, coefficients, xDomain, yDomain, tone = "curve", ariaLabel }) {
    const card = createElement(documentRef, "section", "question-graph-card");
    const heading = createElement(documentRef, "h3", "question-graph-card__title");
    heading.textContent = title;
    const plot = createElement(documentRef, "div", "question-graph-card__plot");
    card.append(heading, plot);
    container.append(card);
    const diagram = new DiagramPrimitives(plot, { xDomain, yDomain, ariaLabel, minHeight: 150, aspectRatio: "4 / 3" });
    diagram.grid({ xStep: 1, yStep: 2 });
    diagram.axes({ tickStep: 1 });
    diagram.polyline(sample(coefficients, xDomain), { tone });
    diagrams.push(diagram);
  }

  function render(question) {
    clear();
    if (question?.diagramConfig?.kind !== "function-derivative-choice") return;
    const { coefficients, candidateGraphs } = question.parameters ?? {};
    if (!Array.isArray(coefficients) || !Array.isArray(candidateGraphs) || candidateGraphs.length !== 4) return;
    const config = question.diagramConfig;
    const xDomain = config.xDomain ?? [-3, 3];
    const functionYDomain = config.functionYDomain ?? [-8, 8];
    const candidateYDomain = config.candidateYDomain ?? [-8, 8];

    host.hidden = false;
    host.dataset.visualKind = "function-derivative-choice";
    const wrap = createElement(documentRef, "div", "question-graph-match");
    const original = createElement(documentRef, "div", "question-graph-match__original");
    const candidates = createElement(documentRef, "div", "question-graph-match__candidates");
    wrap.append(original, candidates);
    host.append(wrap);

    addGraph(original, { title: "Function f(x)", coefficients, xDomain, yDomain: functionYDomain, tone: "curve", ariaLabel: "Graph of the original function f of x" });
    candidateGraphs.forEach((candidate, index) => addGraph(candidates, {
      title: `Derivative candidate ${String.fromCharCode(65 + index)}`,
      coefficients: candidate.coefficients,
      xDomain,
      yDomain: candidateYDomain,
      tone: "accent",
      ariaLabel: `Derivative candidate graph ${String.fromCharCode(65 + index)}`
    }));
  }

  return Object.freeze({ render, clear });
}
