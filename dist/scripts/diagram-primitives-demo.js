import { createDiagramPrimitives } from "./diagram-primitives.js";

const host = document.querySelector("[data-diagram-demo]");
const controls = document.querySelector("[data-diagram-controls]");
const coordinates = document.querySelector("[data-point-coordinates]");
if (!host || !controls || !coordinates) throw new Error("Diagram primitive demo is missing required regions.");

const state = { point: { x: 1.25, y: 2.25 }, slope: 0.75 };
const diagram = createDiagramPrimitives(host, {
  xDomain: [-5, 5],
  yDomain: [-4, 6],
  ariaLabel: "Demonstration coordinate grid with a movable point, tangent line, arrow and shaded region",
  minHeight: 320
});

diagram.grid({ xStep: 1, yStep: 1, showMinor: true });
diagram.axes({ xLabel: "x", yLabel: "y", tickStep: 1 });

diagram.shadedRegion([
  { x: -3.6, y: 0 }, { x: -3.6, y: 1.0 }, { x: -2.8, y: 1.7 },
  { x: -2.0, y: 1.25 }, { x: -1.2, y: 0.45 }, { x: -1.2, y: 0 }
], { tone: "region", opacity: 0.22 });
diagram.label({ x: -2.4, y: 0.5, text: "shaded region", dy: 26, tone: "region" });

const curvePoints = [];
for (let x = -4.5; x <= 4.5; x += 0.12) {
  curvePoints.push({ x, y: 0.16 * (x + 1.5) * (x - 1.2) + 1.1 });
}
diagram.polyline(curvePoints, { tone: "curve" });
diagram.label({ x: 3.7, y: 2.6, text: "curve", dy: -16, tone: "curve" });

diagram.arrow({ x1: -4.2, y1: 4.7, x2: -2.7, y2: 3.8, tone: "accent", label: "direction" });
diagram.point({ x: 3.2, y: -1.6, label: "fixed point", tone: "point", tooltip: "A fixed point primitive" });

const tangent = diagram.tangent({ ...state.point, slope: state.slope, span: 5, tone: "tangent" });
const tangentLabel = diagram.label({ x: state.point.x + 1.7, y: state.point.y + state.slope * 1.7, text: "line / tangent", dy: -16, tone: "tangent" });

function syncPoint(next) {
  state.point = { x: next.x, y: next.y };
  tangent.setPointSlope({ ...state.point, slope: state.slope, span: 5 });
  tangentLabel.set({
    x: state.point.x + 1.7,
    y: state.point.y + state.slope * 1.7,
    text: "line / tangent",
    dy: -16
  });
  coordinates.textContent = `x = ${state.point.x.toFixed(2)}, y = ${state.point.y.toFixed(2)}`;
}

const movable = diagram.handle({
  ...state.point,
  label: "Movable diagram point",
  tooltip: "Drag with a pointer or use the arrow keys to move this point.",
  xDomain: [-4.5, 4.5],
  yDomain: [-3.3, 5.3],
  stepX: 0.1,
  stepY: 0.1,
  onChange: syncPoint
});
movable.element.setAttribute("data-demo-handle", "true");

const slopeSlider = diagram.slider({
  label: "Tangent slope",
  min: -2,
  max: 2,
  step: 0.1,
  value: state.slope,
  format: (value) => value.toFixed(1),
  onInput(value) {
    state.slope = value;
    syncPoint(state.point);
  }
});
controls.append(slopeSlider.element);

const xSlider = diagram.slider({
  label: "Point x-coordinate",
  min: -4.5,
  max: 4.5,
  step: 0.1,
  value: state.point.x,
  format: (value) => value.toFixed(1),
  onInput(value) {
    movable.setPosition(value, state.point.y);
  }
});
controls.append(xSlider.element);

coordinates.textContent = `x = ${state.point.x.toFixed(2)}, y = ${state.point.y.toFixed(2)}`;
