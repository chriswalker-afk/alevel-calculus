import { AreaExplorer } from "./area-explorer.js";

const host = document.querySelector("#area-explorer-demo");
const explorer = new AreaExplorer(host, {
  initialFunctionId: "area-quadratic-crossing",
  initialLower: -2,
  initialUpper: 2,
  initialSplitPoints: [0]
});

window.areaExplorerDemo = explorer;
