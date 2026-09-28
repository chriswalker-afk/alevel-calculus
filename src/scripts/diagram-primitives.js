const SVG_NS = "http://www.w3.org/2000/svg";
let instanceCounter = 0;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeDomain(domain, fallback = [-1, 1]) {
  const source = Array.isArray(domain) && domain.length === 2 ? domain : fallback;
  let [min, max] = source.map(Number);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    [min, max] = fallback;
  }
  return min < max ? [min, max] : [max, min];
}

export function domainToView(value, domain, start, end) {
  const [min, max] = normalizeDomain(domain);
  const ratio = (Number(value) - min) / (max - min);
  return start + ratio * (end - start);
}

export function viewToDomain(value, domain, start, end) {
  const [min, max] = normalizeDomain(domain);
  const ratio = (Number(value) - start) / (end - start);
  return min + ratio * (max - min);
}

export function fitLabelViewPosition({
  x,
  y,
  text = "",
  anchor = "middle",
  width = 1000,
  height = 600,
  fontSize = 19,
  margin = 8
} = {}) {
  const safeWidth = Math.max(1, Number(width) || 1000);
  const safeHeight = Math.max(1, Number(height) || 600);
  const safeMargin = Math.max(0, Number(margin) || 0);
  const safeFont = Math.max(8, Number(fontSize) || 19);
  const glyphWidth = safeFont * 0.58;
  const estimatedWidth = Math.min(safeWidth - safeMargin * 2, Math.max(safeFont, String(text).length * glyphWidth));
  const estimatedHeight = safeFont * 1.15;
  let minX = safeMargin;
  let maxX = safeWidth - safeMargin;
  if (anchor === "start") maxX -= estimatedWidth;
  else if (anchor === "end") minX += estimatedWidth;
  else { minX += estimatedWidth / 2; maxX -= estimatedWidth / 2; }
  if (minX > maxX) { const mid = safeWidth / 2; minX = mid; maxX = mid; }
  const minY = safeMargin + estimatedHeight;
  const maxY = safeHeight - safeMargin;
  return Object.freeze({
    x: clamp(Number(x), minX, maxX),
    y: clamp(Number(y), Math.min(minY, maxY), Math.max(minY, maxY))
  });
}

function svgElement(documentRef, name, attributes = {}) {
  const element = documentRef.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) element.setAttribute(key, String(value));
  }
  return element;
}

function htmlElement(documentRef, name, className = "") {
  const element = documentRef.createElement(name);
  if (className) element.className = className;
  return element;
}

function numericStep(domain) {
  const [min, max] = normalizeDomain(domain);
  return (max - min) / 100;
}

function parseAspectRatio(value, fallback = [16, 9]) {
  const match = String(value ?? "").match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (!match) return fallback;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!(width > 0) || !(height > 0)) return fallback;
  return [width, height];
}

export class DiagramPrimitives {
  constructor(root, {
    xDomain = [-5, 5],
    yDomain = [-5, 5],
    ariaLabel = "Interactive mathematical diagram",
    minHeight = 280,
    aspectRatio = "5 / 3"
  } = {}) {
    if (!root?.ownerDocument) throw new Error("DiagramPrimitives requires a DOM host element.");
    this.root = root;
    this.document = root.ownerDocument;
    this.xDomain = normalizeDomain(xDomain, [-5, 5]);
    this.yDomain = normalizeDomain(yDomain, [-5, 5]);
    this.width = 1000;
    const [aspectWidth, aspectHeight] = parseAspectRatio(aspectRatio);
    this.height = Math.round(this.width * aspectHeight / aspectWidth);
    this.padding = Object.freeze({ left: 72, right: 34, top: 34, bottom: 62 });
    this.id = `diagram-primitives-${++instanceCounter}`;
    this.layers = new Map();
    this.cleanupCallbacks = [];

    root.classList.add("diagram-primitives");
    root.style.setProperty("--diagram-min-height", `${Math.max(180, Number(minHeight) || 280)}px`);
    root.style.setProperty("--diagram-aspect-ratio", aspectRatio);

    this.svg = svgElement(this.document, "svg", {
      viewBox: `0 0 ${this.width} ${this.height}`,
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      "aria-label": ariaLabel,
      class: "diagram-primitives__svg"
    });
    this.svg.style.touchAction = "none";

    const defs = svgElement(this.document, "defs");
    const marker = svgElement(this.document, "marker", {
      id: `${this.id}-arrow`,
      markerWidth: 10,
      markerHeight: 10,
      refX: 8,
      refY: 3,
      orient: "auto",
      markerUnits: "strokeWidth"
    });
    marker.append(svgElement(this.document, "path", { d: "M0,0 L0,6 L9,3 z", class: "diagram-primitives__arrow-head" }));
    defs.append(marker);
    this.svg.append(defs);

    for (const name of ["grid", "regions", "axes", "curves", "lines", "points", "labels", "interaction"]) {
      const group = svgElement(this.document, "g", { "data-diagram-layer": name });
      this.layers.set(name, group);
      this.svg.append(group);
    }

    root.replaceChildren(this.svg);
    this.resizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(() => this.#syncSize())
      : null;
    this.resizeObserver?.observe(root);
    this.#syncSize();
  }

  #syncSize() {
    const rect = this.root.getBoundingClientRect?.();
    if (!rect?.width || !rect?.height) return;
    this.root.dataset.diagramWidth = String(Math.round(rect.width));
    this.root.dataset.diagramHeight = String(Math.round(rect.height));
  }

  destroy() {
    this.resizeObserver?.disconnect();
    for (const cleanup of this.cleanupCallbacks.splice(0)) cleanup();
    this.root.replaceChildren();
    this.root.classList.remove("diagram-primitives");
  }

  clear({ keepGrid = false, keepAxes = false } = {}) {
    for (const [name, layer] of this.layers) {
      if ((name === "grid" && keepGrid) || (name === "axes" && keepAxes)) continue;
      layer.replaceChildren();
    }
  }

  setDomains({ xDomain = this.xDomain, yDomain = this.yDomain } = {}) {
    this.xDomain = normalizeDomain(xDomain, this.xDomain);
    this.yDomain = normalizeDomain(yDomain, this.yDomain);
  }

  x(value) {
    return domainToView(value, this.xDomain, this.padding.left, this.width - this.padding.right);
  }

  y(value) {
    return domainToView(value, this.yDomain, this.height - this.padding.bottom, this.padding.top);
  }

  fromClient(clientX, clientY) {
    const rect = this.svg.getBoundingClientRect();
    const scale = Math.min(rect.width / this.width, rect.height / this.height) || 1;
    const renderedWidth = this.width * scale;
    const renderedHeight = this.height * scale;
    const offsetX = (rect.width - renderedWidth) / 2;
    const offsetY = (rect.height - renderedHeight) / 2;
    const viewX = (clientX - rect.left - offsetX) / scale;
    const viewY = (clientY - rect.top - offsetY) / scale;
    return {
      x: clamp(viewToDomain(viewX, this.xDomain, this.padding.left, this.width - this.padding.right), ...this.xDomain),
      y: clamp(viewToDomain(viewY, this.yDomain, this.height - this.padding.bottom, this.padding.top), ...this.yDomain)
    };
  }

  grid({ xStep = 1, yStep = 1, showMinor = false } = {}) {
    const layer = this.layers.get("grid");
    const [xMin, xMax] = this.xDomain;
    const [yMin, yMax] = this.yDomain;
    const draw = (axis, start, end, step, minor = false) => {
      if (!(step > 0)) return;
      const first = Math.ceil(start / step) * step;
      for (let value = first; value <= end + step * 1e-6; value += step) {
        const line = axis === "x"
          ? svgElement(this.document, "line", { x1: this.x(value), x2: this.x(value), y1: this.y(yMin), y2: this.y(yMax) })
          : svgElement(this.document, "line", { x1: this.x(xMin), x2: this.x(xMax), y1: this.y(value), y2: this.y(value) });
        line.setAttribute("class", `diagram-primitives__grid-line${minor ? " diagram-primitives__grid-line--minor" : ""}`);
        layer.append(line);
      }
    };
    if (showMinor) {
      draw("x", xMin, xMax, xStep / 2, true);
      draw("y", yMin, yMax, yStep / 2, true);
    }
    draw("x", xMin, xMax, xStep);
    draw("y", yMin, yMax, yStep);
    return layer;
  }

  axes({ xLabel = "x", yLabel = "y", ticks = true, tickStep = 1, xTickStep = tickStep, yTickStep = tickStep } = {}) {
    const layer = this.layers.get("axes");
    const [xMin, xMax] = this.xDomain;
    const [yMin, yMax] = this.yDomain;
    const xAxisY = this.y(clamp(0, yMin, yMax));
    const yAxisX = this.x(clamp(0, xMin, xMax));
    layer.append(svgElement(this.document, "line", {
      x1: this.x(xMin), x2: this.x(xMax), y1: xAxisY, y2: xAxisY, class: "diagram-primitives__axis"
    }));
    layer.append(svgElement(this.document, "line", {
      x1: yAxisX, x2: yAxisX, y1: this.y(yMin), y2: this.y(yMax), class: "diagram-primitives__axis"
    }));

    if (ticks && xTickStep > 0) {
      for (let x = Math.ceil(xMin / xTickStep) * xTickStep; x <= xMax; x += xTickStep) {
        if (Math.abs(x) < 1e-9) continue;
        layer.append(svgElement(this.document, "line", { x1: this.x(x), x2: this.x(x), y1: xAxisY - 5, y2: xAxisY + 5, class: "diagram-primitives__tick" }));
        const label = svgElement(this.document, "text", { x: this.x(x), y: xAxisY + 25, class: "diagram-primitives__tick-label", "text-anchor": "middle" });
        label.textContent = Number(x.toFixed(6));
        layer.append(label);
      }
    }
    if (ticks && yTickStep > 0) {
      for (let y = Math.ceil(yMin / yTickStep) * yTickStep; y <= yMax; y += yTickStep) {
        if (Math.abs(y) < 1e-9) continue;
        layer.append(svgElement(this.document, "line", { x1: yAxisX - 5, x2: yAxisX + 5, y1: this.y(y), y2: this.y(y), class: "diagram-primitives__tick" }));
        const label = svgElement(this.document, "text", { x: yAxisX - 12, y: this.y(y) + 5, class: "diagram-primitives__tick-label", "text-anchor": "end" });
        label.textContent = Number(y.toFixed(6));
        layer.append(label);
      }
    }

    this.label({ x: xMax, y: clamp(0, yMin, yMax), text: xLabel, dx: -8, dy: -14, anchor: "end", layer: "axes", tone: "axis" });
    this.label({ x: clamp(0, xMin, xMax), y: yMax, text: yLabel, dx: 18, dy: 18, anchor: "start", layer: "axes", tone: "axis" });
    return layer;
  }

  label({ x, y, text, dx = 0, dy = 0, anchor = "middle", tone = "default", layer = "labels", className = "", keepInView = true }) {
    const place = (nextX, nextY, nextText, nextDx, nextDy) => {
      const raw = { x: this.x(nextX) + nextDx, y: this.y(nextY) + nextDy };
      return keepInView
        ? fitLabelViewPosition({ ...raw, text: nextText, anchor, width: this.width, height: this.height })
        : raw;
    };
    const initial = place(x, y, text, dx, dy);
    const node = svgElement(this.document, "text", {
      x: initial.x,
      y: initial.y,
      "text-anchor": anchor,
      class: `diagram-primitives__label diagram-primitives__tone--${tone}${className ? ` ${className}` : ""}`
    });
    node.textContent = text;
    this.layers.get(layer)?.append(node);
    return {
      element: node,
      set: ({ x: nextX = x, y: nextY = y, text: nextText = node.textContent, dx: nextDx = dx, dy: nextDy = dy } = {}) => {
        const fitted = place(nextX, nextY, nextText, nextDx, nextDy);
        node.setAttribute("x", String(fitted.x));
        node.setAttribute("y", String(fitted.y));
        node.textContent = nextText;
      },
      owner: this
    };
  }

  line({ x1, y1, x2, y2, tone = "primary", dashed = false, className = "" } = {}) {
    const node = svgElement(this.document, "line", {
      class: `diagram-primitives__line diagram-primitives__tone--${tone}${dashed ? " diagram-primitives__line--dashed" : ""}${className ? ` ${className}` : ""}`
    });
    this.layers.get("lines").append(node);
    const controller = {
      element: node,
      setCoordinates: (next = {}) => {
        const values = { x1, y1, x2, y2, ...next };
        node.setAttribute("x1", this.x(values.x1));
        node.setAttribute("y1", this.y(values.y1));
        node.setAttribute("x2", this.x(values.x2));
        node.setAttribute("y2", this.y(values.y2));
        Object.assign(controller.state, values);
      },
      state: { x1, y1, x2, y2 }
    };
    controller.setCoordinates();
    return controller;
  }

  tangent({ x, y, slope, span = 4, tone = "tangent" } = {}) {
    const controller = this.line({ x1: x - span / 2, y1: y - slope * span / 2, x2: x + span / 2, y2: y + slope * span / 2, tone });
    controller.setPointSlope = ({ x: nextX, y: nextY, slope: nextSlope = slope, span: nextSpan = span }) => {
      x = nextX; y = nextY; slope = nextSlope; span = nextSpan;
      controller.setCoordinates({
        x1: x - span / 2,
        y1: y - slope * span / 2,
        x2: x + span / 2,
        y2: y + slope * span / 2
      });
    };
    return controller;
  }

  arrow({ x1, y1, x2, y2, tone = "accent", label = "" } = {}) {
    const controller = this.line({ x1, y1, x2, y2, tone, className: "diagram-primitives__arrow" });
    controller.element.setAttribute("marker-end", `url(#${this.id}-arrow)`);
    if (label) this.label({ x: (x1 + x2) / 2, y: (y1 + y2) / 2, text: label, dy: -12, tone });
    return controller;
  }

  polyline(points, { tone = "curve", closed = false, className = "" } = {}) {
    const node = svgElement(this.document, closed ? "polygon" : "polyline", {
      class: `diagram-primitives__curve diagram-primitives__tone--${tone}${className ? ` ${className}` : ""}`,
      fill: closed ? "currentColor" : "none"
    });
    const setPoints = (nextPoints) => {
      node.setAttribute("points", nextPoints.map(({ x, y }) => `${this.x(x)},${this.y(y)}`).join(" "));
    };
    setPoints(points);
    this.layers.get(closed ? "regions" : "curves").append(node);
    return { element: node, setPoints };
  }

  shadedRegion(points, { tone = "region", opacity = 0.2 } = {}) {
    const region = this.polyline(points, { tone, closed: true, className: "diagram-primitives__region" });
    region.element.style.opacity = String(opacity);
    return region;
  }

  point({ x, y, radius = 8, tone = "point", label = "", tooltip = "" } = {}) {
    const node = svgElement(this.document, "circle", {
      cx: this.x(x), cy: this.y(y), r: radius,
      class: `diagram-primitives__point diagram-primitives__tone--${tone}`
    });
    this.layers.get("points").append(node);
    if (label) this.label({ x, y, text: label, dx: 14, dy: -14, anchor: "start", tone });
    if (tooltip) this.tooltip(node, tooltip);
    return {
      element: node,
      setPosition: (nextX, nextY) => {
        x = nextX; y = nextY;
        node.setAttribute("cx", this.x(x));
        node.setAttribute("cy", this.y(y));
      },
      getPosition: () => ({ x, y })
    };
  }

  draggablePoint({
    x,
    y,
    radius = 12,
    tone = "interactive",
    label = "Draggable point",
    tooltip = "Drag, tap then use arrow keys, or focus and use arrow keys.",
    xDomain = this.xDomain,
    yDomain = this.yDomain,
    stepX = numericStep(xDomain),
    stepY = numericStep(yDomain),
    onChange = () => {}
  } = {}) {
    const xBounds = normalizeDomain(xDomain, this.xDomain);
    const yBounds = normalizeDomain(yDomain, this.yDomain);
    const node = svgElement(this.document, "circle", {
      cx: this.x(x), cy: this.y(y), r: radius,
      class: `diagram-primitives__point diagram-primitives__handle diagram-primitives__tone--${tone}`,
      tabindex: 0,
      role: "slider",
      "aria-label": label,
      "aria-valuetext": `x ${x.toFixed(2)}, y ${y.toFixed(2)}`
    });
    this.layers.get("interaction").append(node);
    this.tooltip(node, tooltip);

    let position = { x: clamp(x, ...xBounds), y: clamp(y, ...yBounds) };
    const apply = (next, { announce = true } = {}) => {
      position = {
        x: clamp(Number(next.x), ...xBounds),
        y: clamp(Number(next.y), ...yBounds)
      };
      node.setAttribute("cx", this.x(position.x));
      node.setAttribute("cy", this.y(position.y));
      node.setAttribute("aria-valuetext", `x ${position.x.toFixed(2)}, y ${position.y.toFixed(2)}`);
      onChange({ ...position, source: announce ? "interaction" : "programmatic" });
    };

    const pointerMove = (event) => apply(this.fromClient(event.clientX, event.clientY));
    const pointerUp = (event) => {
      node.releasePointerCapture?.(event.pointerId);
      node.removeEventListener("pointermove", pointerMove);
      node.removeEventListener("pointerup", pointerUp);
      node.removeEventListener("pointercancel", pointerUp);
    };
    const pointerDown = (event) => {
      event.preventDefault();
      node.focus?.();
      node.setPointerCapture?.(event.pointerId);
      apply(this.fromClient(event.clientX, event.clientY));
      node.addEventListener("pointermove", pointerMove);
      node.addEventListener("pointerup", pointerUp);
      node.addEventListener("pointercancel", pointerUp);
    };
    const keyDown = (event) => {
      let dx = 0; let dy = 0;
      if (event.key === "ArrowLeft") dx = -stepX;
      else if (event.key === "ArrowRight") dx = stepX;
      else if (event.key === "ArrowDown") dy = -stepY;
      else if (event.key === "ArrowUp") dy = stepY;
      else return;
      event.preventDefault();
      apply({ x: position.x + dx, y: position.y + dy });
    };
    node.addEventListener("pointerdown", pointerDown);
    node.addEventListener("keydown", keyDown);
    this.cleanupCallbacks.push(() => {
      node.removeEventListener("pointerdown", pointerDown);
      node.removeEventListener("keydown", keyDown);
    });

    return {
      element: node,
      setPosition: (nextX, nextY) => apply({ x: nextX, y: nextY }, { announce: false }),
      getPosition: () => ({ ...position })
    };
  }

  handle(options = {}) {
    return this.draggablePoint({ radius: 14, tone: "handle", ...options });
  }

  tooltip(element, text) {
    if (!element || !text) return null;
    const title = svgElement(this.document, "title");
    title.textContent = text;
    element.prepend(title);
    const existing = element.getAttribute("aria-label");
    if (!existing) element.setAttribute("aria-label", text);
    element.dataset.tooltip = text;
    return title;
  }

  slider({
    label,
    min,
    max,
    step = 1,
    value,
    format = (number) => String(number),
    onInput = () => {}
  } = {}) {
    const wrapper = htmlElement(this.document, "label", "diagram-primitives__slider");
    const heading = htmlElement(this.document, "span", "diagram-primitives__slider-label");
    heading.textContent = label;
    const output = htmlElement(this.document, "output", "diagram-primitives__slider-value");
    output.textContent = format(Number(value));
    const input = htmlElement(this.document, "input", "diagram-primitives__slider-input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    input.setAttribute("aria-label", label);
    const row = htmlElement(this.document, "span", "diagram-primitives__slider-heading");
    row.append(heading, output);
    wrapper.append(row, input);
    const listener = () => {
      const next = Number(input.value);
      output.textContent = format(next);
      onInput(next);
    };
    input.addEventListener("input", listener);
    this.cleanupCallbacks.push(() => input.removeEventListener("input", listener));
    return { element: wrapper, input, output, setValue(next) { input.value = String(next); listener(); } };
  }
}

export function createDiagramPrimitives(root, options) {
  return new DiagramPrimitives(root, options);
}
