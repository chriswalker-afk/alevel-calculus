import { LinkedFunctionGradientExplorer } from "./linked-function-gradient-explorer.js";

const host = document.querySelector("#linked-gradient-demo");
if (host) {
  new LinkedFunctionGradientExplorer(host, {
    revealDerivative: false,
    revealSecondDerivative: false,
    allowSecondDerivative: true
  });
}
