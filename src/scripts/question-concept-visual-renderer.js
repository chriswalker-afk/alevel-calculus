import { DiagramPrimitives } from "./diagram-primitives.js";
import { evaluatePolynomial } from "./linked-function-gradient-explorer.js";
import {
  RateFlowDiagram,
  checkRateFlowState,
  correctVariableOrder,
  validateRateFlowDefinition
} from "./rate-flow-diagram.js";

export const conceptInteractiveQuestionVisualKinds = Object.freeze([
  "calculus-rate-flow-workspace",
  "calculus-expression-term-selector",
  "calculus-riemann-component-selector",
  "calculus-line-selector",
  "calculus-solution-curve-selector"
]);

function createElement(documentRef, tag, className = "") {
  const element = documentRef.createElement(tag);
  if (className) element.className = className;
  return element;
}

function validDomain(value) {
  return Array.isArray(value)
    && value.length === 2
    && value.every((item) => Number.isFinite(Number(item)))
    && Number(value[0]) !== Number(value[1]);
}

function selectionKey(ids, order = []) {
  const selected = new Set((ids ?? []).map(String));
  return [
    ...order.map(String).filter((id) => selected.has(id)),
    ...[...selected].filter((id) => !order.map(String).includes(id)).sort()
  ].join("|");
}

function selectionResponse(config, items, prefix, ids) {
  const key = selectionKey(ids, (items ?? []).map((item) => item.id));
  if (!key) return "";
  return config?.responseMap?.[key] ?? `${prefix}:${key}`;
}

function selectionFromResponse(config, items, prefix, response) {
  const text = String(response ?? "");
  if (!text) return Object.freeze([]);
  const mapped = Object.entries(config?.responseMap ?? {}).find(([, value]) => String(value) === text)?.[0];
  const raw = mapped ?? (text.startsWith(`${prefix}:`) ? text.slice(prefix.length + 1) : "");
  const allowed = new Set((items ?? []).map((item) => String(item.id)));
  return Object.freeze(raw.split("|").filter((id) => allowed.has(id)));
}

function resolvedSpec(question) {
  const config = question?.diagramConfig ?? {};
  const keyed = config.specKey ? question?.parameters?.[config.specKey] : null;
  return keyed ? { ...config, ...keyed, kind: config.kind } : config;
}

export function termResponseFromSelection(config, ids) {
  return selectionResponse(config, config?.terms, "terms", ids);
}

export function termSelectionFromResponse(config, response) {
  return selectionFromResponse(config, config?.terms, "terms", response);
}

function validRateFlowConfig(config) {
  try {
    validateRateFlowDefinition(config?.rateFlowDefinition);
    return true;
  } catch {
    return false;
  }
}

function validTermConfig(config) {
  return Array.isArray(config?.terms)
    && config.terms.length >= 2
    && config.terms.every((term) => term?.id && term?.label);
}

function validRiemannConfig(config) {
  return Array.isArray(config?.coefficients)
    && config.coefficients.length > 0
    && config.coefficients.every((value) => Number.isFinite(Number(value)))
    && validDomain(config.xDomain)
    && validDomain(config.yDomain)
    && Array.isArray(config.xValues)
    && config.xValues.length >= 3
    && config.xValues.every((value) => Number.isFinite(Number(value)));
}

function validLineConfig(config) {
  return Array.isArray(config?.coefficients)
    && config.coefficients.length > 0
    && config.coefficients.every((value) => Number.isFinite(Number(value)))
    && validDomain(config.xDomain)
    && validDomain(config.yDomain)
    && Number.isFinite(Number(config?.point?.x))
    && Number.isFinite(Number(config?.point?.y))
    && Array.isArray(config.lines)
    && config.lines.length >= 2;
}

function validSolutionCurveConfig(config) {
  return validDomain(config?.xDomain)
    && validDomain(config?.yDomain)
    && Array.isArray(config?.curves)
    && config.curves.length >= 2
    && Number.isFinite(Number(config?.initialPoint?.x))
    && Number.isFinite(Number(config?.initialPoint?.y));
}

export function isConceptInteractiveQuestionVisual(question) {
  const config = question?.diagramConfig ?? {};
  if (!conceptInteractiveQuestionVisualKinds.includes(config.kind)) return false;
  if (config.kind === "calculus-rate-flow-workspace") return validRateFlowConfig(config);
  if (config.kind === "calculus-expression-term-selector") return validTermConfig(resolvedSpec(question));
  if (config.kind === "calculus-riemann-component-selector") return validRiemannConfig(config);
  if (config.kind === "calculus-line-selector") return validLineConfig(config);
  if (config.kind === "calculus-solution-curve-selector") return validSolutionCurveConfig(config);
  return false;
}

function samplePolynomial(coefficients, xDomain, count = 180) {
  const [xMin, xMax] = xDomain.map(Number);
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = xMin + (index / count) * (xMax - xMin);
    return { x, y: evaluatePolynomial(coefficients, x) };
  }).filter(({ y }) => Number.isFinite(y));
}

function slopeForField(kind, x, y) {
  if (kind === "negative-y") return -y;
  if (kind === "positive-y") return y;
  if (kind === "x-minus-y") return x - y;
  return 0;
}

function curveValue(curve, x) {
  if (curve.kind === "exp-decay") return Number(curve.scale ?? 1) * Math.exp(-Number(curve.rate ?? 1) * x);
  if (curve.kind === "exp-growth") return Number(curve.scale ?? 1) * Math.exp(Number(curve.rate ?? 1) * x);
  if (curve.kind === "line") return Number(curve.intercept ?? 0) + Number(curve.slope ?? 0) * x;
  return NaN;
}

export function createConceptQuestionVisualRenderer(host, { onResponseChange = () => {} } = {}) {
  if (!host?.ownerDocument) {
    return Object.freeze({ render() {}, clear() {}, focusResponse() {} });
  }

  const documentRef = host.ownerDocument;
  let diagrams = [];
  let widgets = [];
  let cleanup = [];
  let focusTarget = null;

  function addCleanup(callback) {
    cleanup.push(callback);
  }

  function clear() {
    for (const callback of cleanup.splice(0)) callback();
    for (const diagram of diagrams) diagram.destroy();
    for (const widget of widgets) widget.destroy?.();
    diagrams = [];
    widgets = [];
    focusTarget = null;
    host.replaceChildren();
    host.hidden = true;
    delete host.dataset.visualKind;
  }

  function shell(config, modifier) {
    const wrap = createElement(documentRef, "section", `question-graph-interaction ${modifier}`);
    const intro = createElement(documentRef, "div", "question-graph-interaction__intro");
    const title = createElement(documentRef, "h3", "question-graph-interaction__title");
    title.textContent = config.title ?? "Make a selection";
    const instruction = createElement(documentRef, "p", "question-graph-interaction__instruction");
    instruction.textContent = config.instruction ?? "Select the mathematically correct target.";
    intro.append(title, instruction);
    const visualHost = createElement(documentRef, "div", "question-graph-interaction__graph");
    const controls = createElement(documentRef, "div");
    const status = createElement(documentRef, "p", "question-graph-interaction__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    wrap.append(intro, visualHost, controls, status);
    host.append(wrap);
    host.hidden = false;
    host.dataset.visualKind = config.kind;
    return { visualHost, controls, status };
  }

  function graphCard(title, xDomain, yDomain, ariaLabel, minHeight = 270) {
    const card = createElement(documentRef, "section", "question-graph-card");
    const heading = createElement(documentRef, "h3", "question-graph-card__title");
    heading.textContent = title;
    const plot = createElement(documentRef, "div", "question-graph-card__plot");
    card.append(heading, plot);
    const diagram = new DiagramPrimitives(plot, { xDomain, yDomain, ariaLabel, minHeight, aspectRatio: "4 / 3" });
    diagram.grid({ xStep: 1, yStep: 1 });
    diagram.axes({ tickStep: 1 });
    diagrams.push(diagram);
    return { card, diagram };
  }

  function renderRateFlowWorkspace(question, response) {
    const config = question.diagramConfig;
    if (!validRateFlowConfig(config)) return false;

    const baseDefinition = validateRateFlowDefinition(config.rateFlowDefinition);
    const correctResponse = config.correctResponse ?? "a";
    const solved = String(response ?? "") === String(correctResponse);
    const solvedOrientations = Object.fromEntries(baseDefinition.relations.map((relation) => [relation.id, "forward"]));
    solvedOrientations.target = "forward";
    const definition = solved
      ? { ...baseDefinition, initialOrder: correctVariableOrder(baseDefinition), initialOrientations: solvedOrientations }
      : baseDefinition;

    const { visualHost, controls, status } = shell(config, "question-rate-flow-workspace");
    controls.hidden = true;
    const flowHost = createElement(documentRef, "div", "question-rate-flow-workspace__flow");
    visualHost.append(flowHost);

    const flow = new RateFlowDiagram(flowHost, {
      definitions: [definition],
      initialDefinitionId: definition.id,
      showDefinitionSelector: false,
      onChange({ state }) {
        const result = checkRateFlowState(definition, state);
        status.textContent = result.overallCorrect
          ? "Dependency order and derivative orientations are correct."
          : !result.orderCorrect
            ? "Dependency order still needs attention."
            : "Order is correct; review one or more derivative orientations.";
        onResponseChange(
          result.overallCorrect
            ? correctResponse
            : !result.orderCorrect
              ? (config.orderResponse ?? "b")
              : (config.orientationResponse ?? "c")
        );
      }
    });
    widgets.push(flow);
    const initial = checkRateFlowState(definition, flow.getState());
    status.textContent = initial.overallCorrect
      ? "Dependency order and derivative orientations are correct."
      : "Arrange the variables first, then orient each derivative.";
    focusTarget = flowHost.querySelector(".rate-flow__move-button, .rate-flow__choice, button");
    return true;
  }

  function renderExpressionTermSelector(question, response) {
    const spec = resolvedSpec(question);
    if (!validTermConfig(spec)) return false;
    const selected = new Set(termSelectionFromResponse(spec, response));
    const { visualHost, controls, status } = shell(spec, "question-expression-selector");
    controls.hidden = true;
    const equation = createElement(documentRef, "div", "question-expression-selector__equation");
    equation.setAttribute("role", "group");
    equation.setAttribute("aria-label", spec.controlLabel ?? "Selectable terms in the implicit relation");
    visualHost.append(equation);

    const buttons = new Map();
    function sync() {
      for (const term of spec.terms) buttons.get(term.id)?.setAttribute("aria-pressed", selected.has(term.id) ? "true" : "false");
      const labels = spec.terms.filter((term) => selected.has(term.id)).map((term) => term.label);
      status.textContent = labels.length ? `Selected term${labels.length > 1 ? "s" : ""}: ${labels.join(", ")}.` : "No term selected yet.";
    }
    function choose(id) {
      if (spec.allowMultiple) {
        if (selected.has(id)) selected.delete(id); else selected.add(id);
      } else {
        const same = selected.has(id) && selected.size === 1;
        selected.clear();
        if (!same) selected.add(id);
      }
      sync();
      onResponseChange(termResponseFromSelection(spec, [...selected]));
    }

    for (const term of spec.terms) {
      const button = createElement(documentRef, "button", "question-expression-selector__term");
      button.type = "button";
      button.textContent = term.label;
      button.setAttribute("aria-pressed", selected.has(term.id) ? "true" : "false");
      button.setAttribute("aria-label", term.ariaLabel ?? `Select term ${term.label}`);
      const click = () => choose(term.id);
      button.addEventListener("click", click);
      addCleanup(() => button.removeEventListener("click", click));
      equation.append(button);
      buttons.set(term.id, button);
      if (term.separator) {
        const separator = createElement(documentRef, "span", "question-expression-selector__separator");
        separator.textContent = term.separator;
        equation.append(separator);
      }
      if (!focusTarget) focusTarget = button;
    }
    sync();
    return true;
  }

  function renderRiemannComponentSelector(question, response) {
    const config = question.diagramConfig;
    if (!validRiemannConfig(config)) return false;
    const { visualHost, controls, status } = shell(config, "question-riemann-selector");
    controls.className = "question-riemann-selector__choices";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Labelled Riemann-sum components");

    const { card, diagram } = graphCard(
      config.graphTitle ?? "Rectangle sum",
      config.xDomain,
      config.yDomain,
      config.ariaLabel ?? "Rectangle sum with labelled components"
    );
    visualHost.append(card);
    const xValues = config.xValues.map(Number);
    for (let index = 0; index < xValues.length - 1; index += 1) {
      const left = xValues[index], right = xValues[index + 1];
      const height = evaluatePolynomial(config.coefficients, right);
      diagram.shadedRegion([{ x:left,y:0 },{ x:left,y:height },{ x:right,y:height },{ x:right,y:0 }], { tone:"rectangle-positive", opacity:0.12 });
      diagram.polyline([{ x:left,y:0 },{ x:left,y:height },{ x:right,y:height },{ x:right,y:0 }], { tone:"rectangle-positive" });
    }
    diagram.polyline(samplePolynomial(config.coefficients, config.xDomain), { tone:"curve" });

    const left=xValues[0], right=xValues[1], sampleX=right, sampleY=evaluatePolynomial(config.coefficients,sampleX);
    diagram.line({ x1:left,y1:-0.28,x2:right,y2:-0.28,tone:"sample" });
    diagram.label({ x:(left+right)/2,y:-0.28,text:"A",dy:18,tone:"sample" });
    diagram.line({ x1:sampleX,y1:0,x2:sampleX,y2:sampleY,tone:"accent" });
    diagram.label({ x:sampleX,y:sampleY/2,text:"B",dx:14,tone:"accent" });
    diagram.point({ x:sampleX,y:sampleY,radius:9,tone:"point",label:"C" });
    diagram.line({ x1:xValues[0],y1:0,x2:xValues[0],y2:config.yDomain[1],tone:"bound",dashed:true });
    diagram.line({ x1:xValues.at(-1),y1:0,x2:xValues.at(-1),y2:config.yDomain[1],tone:"bound",dashed:true });
    diagram.label({ x:(xValues[0]+xValues.at(-1))/2,y:config.yDomain[1]*0.9,text:"D = interval bounds",tone:"bound" });

    const choices=config.componentChoices ?? [{id:"width",label:"A"},{id:"height",label:"B"},{id:"sample",label:"C"},{id:"bounds",label:"D"}];
    const buttons=new Map();
    const selected=String(response ?? "");
    for(const choice of choices){
      const button=createElement(documentRef,"button","question-riemann-selector__choice");
      button.type="button";
      button.textContent=choice.label;
      button.setAttribute("aria-pressed",choice.id===selected?"true":"false");
      const click=()=>{
        for(const [id,item] of buttons) item.setAttribute("aria-pressed",id===choice.id?"true":"false");
        status.textContent=`Selected feature ${choice.label}.`;
        onResponseChange(choice.id);
      };
      button.addEventListener("click",click);
      addCleanup(()=>button.removeEventListener("click",click));
      controls.append(button);
      buttons.set(choice.id,button);
      if(!focusTarget) focusTarget=button;
    }
    status.textContent=selected?"A labelled feature is selected.":"Choose one labelled feature.";
    return true;
  }

  function renderLineSelector(question, response) {
    const config=question.diagramConfig;
    if(!validLineConfig(config)) return false;
    const {visualHost,controls,status}=shell(config,"question-line-selector");
    controls.className="question-line-selector__choices";
    controls.setAttribute("role","group");
    controls.setAttribute("aria-label","Candidate tangent and normal lines");

    const {card,diagram}=graphCard(config.graphTitle??"Curve with candidate lines",config.xDomain,config.yDomain,config.ariaLabel??"Curve with candidate lines");
    visualHost.append(card);
    diagram.polyline(samplePolynomial(config.coefficients,config.xDomain),{tone:"curve"});
    diagram.point({x:config.point.x,y:config.point.y,radius:10,tone:"point",label:config.point.label??"P"});
    const [xMin,xMax]=config.xDomain.map(Number), [yMin,yMax]=config.yDomain.map(Number);
    const selected=String(response??"");
    const lineElements=new Map(), buttons=new Map();

    for(const candidate of config.lines){
      let line;
      if(candidate.vertical){
        line=diagram.line({x1:candidate.x,y1:yMin,x2:candidate.x,y2:yMax,tone:candidate.tone??"accent"});
        diagram.label({x:candidate.x,y:yMax*0.82,text:candidate.graphLabel??candidate.id.toUpperCase(),dx:10,tone:candidate.tone??"accent"});
      } else {
        const y1=config.point.y+Number(candidate.slope)*(xMin-config.point.x);
        const y2=config.point.y+Number(candidate.slope)*(xMax-config.point.x);
        line=diagram.line({x1:xMin,y1,x2:xMax,y2,tone:candidate.tone??"accent"});
        const lx=candidate.labelX??(xMin+0.78*(xMax-xMin));
        const ly=config.point.y+Number(candidate.slope)*(lx-config.point.x);
        diagram.label({x:lx,y:ly,text:candidate.graphLabel??candidate.id.toUpperCase(),dy:-10,tone:candidate.tone??"accent"});
      }
      const mapped=config.responseMap?.[candidate.id]??candidate.id;
      line.element.style.opacity=String(mapped===selected?1:0.34);
      lineElements.set(candidate.id,line.element);

      const button=createElement(documentRef,"button","question-line-selector__choice");
      button.type="button";
      button.textContent=candidate.label;
      button.setAttribute("aria-pressed",mapped===selected?"true":"false");
      const click=()=>{
        for(const [id,item] of buttons) item.setAttribute("aria-pressed",id===candidate.id?"true":"false");
        for(const [id,element] of lineElements) element.style.opacity=id===candidate.id?"1":"0.34";
        status.textContent=`Selected ${candidate.label}.`;
        onResponseChange(mapped);
      };
      button.addEventListener("click",click);
      addCleanup(()=>button.removeEventListener("click",click));
      controls.append(button);
      buttons.set(candidate.id,button);
      if(!focusTarget) focusTarget=button;
    }
    status.textContent=selected?"A candidate line is selected.":"Select the line that satisfies the tangent/normal condition.";
    return true;
  }

  function renderSolutionCurveSelector(question,response){
    const config=question.diagramConfig;
    if(!validSolutionCurveConfig(config)) return false;
    const {visualHost,controls,status}=shell(config,"question-solution-curve-selector");
    controls.className="question-solution-curve-selector__choices";
    controls.setAttribute("role","group");
    controls.setAttribute("aria-label","Candidate solution curves");

    const {card,diagram}=graphCard(config.graphTitle??"Direction field and candidate solutions",config.xDomain,config.yDomain,config.ariaLabel??"Direction field with candidate solution curves",285);
    visualHost.append(card);
    const [xMin,xMax]=config.xDomain.map(Number),[yMin,yMax]=config.yDomain.map(Number);
    const xStep=config.fieldXStep??0.5,yStep=config.fieldYStep??0.5;
    for(let x=xMin;x<=xMax+1e-9;x+=xStep){
      for(let y=Math.max(yMin,yStep);y<=yMax+1e-9;y+=yStep){
        const m=slopeForField(config.fieldKind,x,y);
        const length=0.18,norm=Math.sqrt(1+m*m),dx=length/norm,dy=m*dx;
        const seg=diagram.line({x1:x-dx,y1:y-dy,x2:x+dx,y2:y+dy,tone:"bound"});
        seg.element.style.opacity="0.34";
      }
    }
    diagram.point({x:config.initialPoint.x,y:config.initialPoint.y,radius:10,tone:"point",label:config.initialPoint.label??"initial condition"});

    const selected=String(response??"");
    const curves=new Map(),buttons=new Map();
    for(const candidate of config.curves){
      const points=Array.from({length:181},(_,index)=>{
        const x=xMin+(index/180)*(xMax-xMin);
        return {x,y:curveValue(candidate,x)};
      }).filter(({y})=>Number.isFinite(y)&&y>=yMin-1&&y<=yMax+1);
      const curve=diagram.polyline(points,{tone:candidate.tone??"accent"});
      const mapped=config.responseMap?.[candidate.id]??candidate.id;
      curve.element.style.opacity=String(mapped===selected?1:0.32);
      curves.set(candidate.id,curve.element);
      const labelX=candidate.labelX??(xMin+0.76*(xMax-xMin)),labelY=curveValue(candidate,labelX);
      if(Number.isFinite(labelY)&&labelY>=yMin&&labelY<=yMax) diagram.label({x:labelX,y:labelY,text:candidate.graphLabel??candidate.id.toUpperCase(),dy:-10,tone:candidate.tone??"accent"});

      const button=createElement(documentRef,"button","question-solution-curve-selector__choice");
      button.type="button";
      button.textContent=candidate.label;
      button.setAttribute("aria-pressed",mapped===selected?"true":"false");
      const click=()=>{
        for(const [id,item] of buttons) item.setAttribute("aria-pressed",id===candidate.id?"true":"false");
        for(const [id,element] of curves) element.style.opacity=id===candidate.id?"1":"0.32";
        status.textContent=`Selected ${candidate.label}.`;
        onResponseChange(mapped);
      };
      button.addEventListener("click",click);
      addCleanup(()=>button.removeEventListener("click",click));
      controls.append(button);
      buttons.set(candidate.id,button);
      if(!focusTarget) focusTarget=button;
    }
    status.textContent=selected?"A candidate solution curve is selected.":"Choose the curve that follows the field and the initial condition.";
    return true;
  }

  function render(question,{response=""}={}){
    clear();
    const kind=question?.diagramConfig?.kind;
    if(kind==="calculus-rate-flow-workspace") return renderRateFlowWorkspace(question,response);
    if(kind==="calculus-expression-term-selector") return renderExpressionTermSelector(question,response);
    if(kind==="calculus-riemann-component-selector") return renderRiemannComponentSelector(question,response);
    if(kind==="calculus-line-selector") return renderLineSelector(question,response);
    if(kind==="calculus-solution-curve-selector") return renderSolutionCurveSelector(question,response);
    return false;
  }

  function focusResponse(){ focusTarget?.focus?.(); }

  return Object.freeze({render,clear,focusResponse});
}
