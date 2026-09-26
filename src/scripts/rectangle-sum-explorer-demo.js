import { RectangleSumExplorer } from "./rectangle-sum-explorer.js";

const host = document.querySelector("#rectangle-sum-explorer-demo");
const explorer = new RectangleSumExplorer(host, {
  initialFunctionId: "rectangle-positive-quadratic",
  initialLower: 0,
  initialUpper: 2,
  initialN: 1,
  initialSampleLocation: "midpoint"
});

window.rectangleSumExplorerDemo = explorer;
