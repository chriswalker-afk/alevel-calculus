import { ParametricCurveTracer } from "./parametric-curve-tracer.js";
const host = document.querySelector("#parametric-curve-tracer-demo");
const tracer = new ParametricCurveTracer(host, { initialCurveId: "parametric-parabola", initialInterval: [-2, 2] });
window.parametricCurveTracerDemo = tracer;
