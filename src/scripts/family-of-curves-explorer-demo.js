import { FamilyOfCurvesExplorer } from "./family-of-curves-explorer.js";

const host = document.querySelector("#family-curves-demo");
if (host) {
  new FamilyOfCurvesExplorer(host, {
    initialConstant: 1.5,
    comparisonConstants: [-3, 0, 3]
  });
}
