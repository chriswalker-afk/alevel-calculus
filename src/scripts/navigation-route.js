function cleanPathname(pathname = '/') {
  const path = String(pathname || '/').split('?')[0].split('#')[0];
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/') ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

export function activityRouteFromId(activityId) {
  const parts = String(activityId ?? '').split(':');
  if (parts.length !== 6 || parts[0] !== 'activity' || parts.slice(1).some((part) => !part)) return null;
  const [, routeScope, strand, topicSlug, mode, activitySlug] = parts;
  return `/${routeScope}/${strand}/${topicSlug}/${mode}/${activitySlug}`;
}

export function parseActivityRoute(pathname) {
  const parts = cleanPathname(pathname).split('/').filter(Boolean);
  if (parts.length !== 5) return null;
  const [routeScope, strand, topicSlug, mode, activitySlug] = parts;
  return Object.freeze({
    route: `/${parts.join('/')}`,
    topicId: `topic:${routeScope}:${strand}:${topicSlug}`,
    mode,
    activityId: `activity:${routeScope}:${strand}:${topicSlug}:${mode}:${activitySlug}`
  });
}

export function resolveActivityRoute(pathname, topicRuntime) {
  const parsed = parseActivityRoute(pathname);
  if (!parsed) return null;
  const runtime = topicRuntime?.[parsed.topicId];
  if (!runtime || !runtime.availableModes?.includes(parsed.mode)) return null;
  const activities = runtime.learningModes?.[parsed.mode]?.activities ?? [];
  const activityIndex = activities.findIndex((activity) => activity.activityId === parsed.activityId);
  if (activityIndex < 0) return null;
  return Object.freeze({ ...parsed, activityIndex });
}

export function createHistoryRouteController({
  history,
  location,
  topicRuntime,
  applyRoute,
  schedule = (callback) => queueMicrotask(callback)
}) {
  if (!history || !location || !topicRuntime || typeof applyRoute !== 'function') {
    throw new Error('HistoryRouteController requires history, location, topicRuntime and applyRoute.');
  }

  let applyingHistory = false;
  let scheduled = false;
  let pendingMode = 'push';
  let pendingRoute = null;

  function currentUrl(route) {
    return `${route}${location.search ?? ''}${location.hash ?? ''}`;
  }

  function write(route, mode = 'push') {
    if (!route || applyingHistory) return false;
    const currentPath = cleanPathname(location.pathname);
    if (currentPath === cleanPathname(route)) {
      history.replaceState({ calculusRoute: route }, '', currentUrl(route));
      return true;
    }
    const method = mode === 'replace' ? 'replaceState' : 'pushState';
    history[method]({ calculusRoute: route }, '', currentUrl(route));
    return true;
  }

  function scheduleWrite(route, { replace = false } = {}) {
    if (!route || applyingHistory) return;
    pendingRoute = route;
    if (replace) pendingMode = 'replace';
    if (scheduled) return;
    scheduled = true;
    schedule(() => {
      scheduled = false;
      const routeToWrite = pendingRoute;
      const mode = pendingMode;
      pendingRoute = null;
      pendingMode = 'push';
      write(routeToWrite, mode);
    });
  }

  function restore(pathname = location.pathname, { focusStage = false } = {}) {
    const resolved = resolveActivityRoute(pathname, topicRuntime);
    if (!resolved) return null;
    applyingHistory = true;
    try {
      applyRoute(resolved, { focusStage, fromHistory: true });
    } finally {
      applyingHistory = false;
    }
    return resolved;
  }

  return Object.freeze({
    resolve: (pathname = location.pathname) => resolveActivityRoute(pathname, topicRuntime),
    restore,
    scheduleWrite,
    replace: (route) => write(route, 'replace'),
    isApplyingHistory: () => applyingHistory
  });
}
