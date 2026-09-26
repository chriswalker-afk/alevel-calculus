import { ChordToTangentExplorer } from "./chord-to-tangent-explorer.js";

const host = document.querySelector("#chord-tangent-demo");
if (host) {
  const explorer = new ChordToTangentExplorer(host, {
    pX: 1,
    initialH: 1.5,
    informationMode: "full"
  });

  const presets = document.querySelectorAll("[data-h-preset]");
  for (const button of presets) {
    button.addEventListener("click", () => explorer.setH(Number(button.dataset.hPreset), "preset"));
  }
}
