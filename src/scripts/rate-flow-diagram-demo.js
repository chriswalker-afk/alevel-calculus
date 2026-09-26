import { RateFlowDiagram } from "./rate-flow-diagram.js";

const host = document.querySelector("#rate-flow-demo");
new RateFlowDiagram(host, { initialDefinitionId: "sphere-density-chain" });
