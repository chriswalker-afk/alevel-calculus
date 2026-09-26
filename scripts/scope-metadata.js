export const courseScopes = Object.freeze({
  y12: Object.freeze({
    label: "Year 12 · 8MA0",
    compactLabel: "Y12 · 8MA0",
    accessibleLabel: "Year 12, Pearson Edexcel 8MA0 calculus",
    routeScope: "y12",
    description: "Content in the Year 12 calculus pathway.",
    sampleRoute: "/y12/differentiation/first-principles/understand/chord-gradient"
  }),
  "y13-additional": Object.freeze({
    label: "Year 13 additional · 9MA0",
    compactLabel: "Y13 add. · 9MA0",
    accessibleLabel: "Additional Year 13, Pearson Edexcel 9MA0 calculus",
    routeScope: "y13",
    description: "Additional calculus introduced after the Year 12 mastery checkpoint.",
    sampleRoute: "/y13/integration/substitution/ao1/change-limits"
  }),
  "full-alevel": Object.freeze({
    label: "Full A level · 9MA0",
    compactLabel: "Full · 9MA0",
    accessibleLabel: "Full Pearson Edexcel A level 9MA0 calculus",
    routeScope: "full",
    description: "Mixed work drawing across the complete A level calculus course.",
    sampleRoute: "/full/calculus/full-review/mastery/mixed-method-selection"
  })
});

export const courseScopeOrder = Object.freeze([
  "y12",
  "y13-additional",
  "full-alevel"
]);

export function getCourseScope(scopeId) {
  return courseScopes[scopeId] ?? null;
}
