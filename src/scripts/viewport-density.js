const DEFAULT_VIEWPORT = Object.freeze({ width: 1440, height: 900 });

function positiveNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

export function viewportReference(width) {
  const safeWidth = positiveNumber(width, DEFAULT_VIEWPORT.width);
  if (safeWidth <= 680) return Object.freeze({ width: 390, height: 780 });
  if (safeWidth <= 900) return Object.freeze({ width: 820, height: 820 });
  return DEFAULT_VIEWPORT;
}

export function classifyViewportDensity({ width, height } = DEFAULT_VIEWPORT) {
  const safeWidth = positiveNumber(width, DEFAULT_VIEWPORT.width);
  const safeHeight = positiveNumber(height, DEFAULT_VIEWPORT.height);
  const reference = viewportReference(safeWidth);
  const fit = Math.min(safeWidth / reference.width, safeHeight / reference.height);

  if (fit >= 1.08) return "spacious";
  if (fit >= 0.86) return "standard";
  if (fit >= 0.70) return "compact";
  return "tight";
}

export function readViewportMetrics(view = globalThis.window, documentElement = globalThis.document?.documentElement) {
  const visualViewport = view?.visualViewport;
  const width = positiveNumber(
    visualViewport?.width,
    positiveNumber(view?.innerWidth, positiveNumber(documentElement?.clientWidth, DEFAULT_VIEWPORT.width))
  );
  const height = positiveNumber(
    visualViewport?.height,
    positiveNumber(view?.innerHeight, positiveNumber(documentElement?.clientHeight, DEFAULT_VIEWPORT.height))
  );
  return Object.freeze({ width, height });
}

export function applyViewportDensity(root, metrics) {
  const density = classifyViewportDensity(metrics);
  if (root?.dataset) root.dataset.uiDensity = density;
  return density;
}
