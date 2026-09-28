import { getVocabularyTerm } from "./vocabulary-data.js?v=memorymath1";

let popoverSequence = 0;
let outsideDismissBound = false;

function setPopoverOpen(wrapper, button, open) {
  wrapper.dataset.popoverOpen = open ? "true" : "false";
  button.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeOtherVocabularyPopovers(exceptWrapper = null) {
  if (typeof document === "undefined" || typeof document.querySelectorAll !== "function") return;
  for (const wrapper of document.querySelectorAll('.vocabulary-term-wrap[data-popover-open="true"]')) {
    if (wrapper === exceptWrapper) continue;
    wrapper.dataset.popoverOpen = "false";
    wrapper.querySelector?.(".vocabulary-term")?.setAttribute?.("aria-expanded", "false");
  }
}

function ensureOutsideDismissListener() {
  if (outsideDismissBound || typeof document === "undefined" || typeof document.addEventListener !== "function") return;
  outsideDismissBound = true;
  const dismissOutside = (event) => {
    const activeWrapper = event.target?.closest?.(".vocabulary-term-wrap") ?? null;
    closeOtherVocabularyPopovers(activeWrapper);
  };
  document.addEventListener("pointerdown", dismissOutside);
  document.addEventListener("focusin", dismissOutside);
}

function prefersHoverInteraction() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    return false;
  }
}

function plainTextFromSegments(segments) {
  return segments.map((segment) => {
    if (typeof segment === "string") return segment;
    return segment.text ?? getVocabularyTerm(segment.termId)?.label ?? "";
  }).join("");
}

function createVocabularyTermElement(term, { isFirstEncounter, onOpenWordBank }) {
  const wrapper = document.createElement("span");
  wrapper.className = "vocabulary-term-wrap";
  wrapper.dataset.vocabularyTermId = term.id;
  wrapper.dataset.popoverOpen = "false";
  ensureOutsideDismissListener();

  const popoverId = `vocabulary-popover-${++popoverSequence}`;
  const definitionId = `${popoverId}-definition`;

  const button = document.createElement("button");
  button.type = "button";
  button.className = `vocabulary-term ${isFirstEncounter ? "vocabulary-term--new" : "vocabulary-term--known"}`;
  button.dataset.vocabularyTerm = term.id;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", popoverId);
  button.setAttribute("aria-describedby", definitionId);

  const label = document.createElement("span");
  label.textContent = term.label;
  button.append(label);

  if (isFirstEncounter) {
    const marker = document.createElement("span");
    marker.className = "vocabulary-new-marker";
    marker.textContent = "NEW";
    marker.setAttribute("aria-label", "New vocabulary");
    button.append(marker);
  }

  const popover = document.createElement("span");
  popover.className = "vocabulary-popover";
  popover.id = popoverId;
  popover.setAttribute("role", "dialog");
  popover.setAttribute("aria-label", `${term.label} definition`);

  const termName = document.createElement("strong");
  termName.className = "vocabulary-popover__term";
  termName.textContent = term.label;

  const definition = document.createElement("span");
  definition.className = "vocabulary-popover__definition";
  definition.id = definitionId;
  definition.textContent = term.definition;

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "vocabulary-popover__open-bank";
  openButton.textContent = "Open in Word Bank";
  openButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPopoverOpen(wrapper, button, false);
    onOpenWordBank?.(term.id, button);
  });

  popover.append(termName, definition, openButton);
  wrapper.append(button, popover);

  button.addEventListener("click", (event) => {
    const keyboardActivation = event.detail === 0;
    if (prefersHoverInteraction() && !keyboardActivation) {
      setPopoverOpen(wrapper, button, false);
      return;
    }

    const willOpen = wrapper.dataset.popoverOpen !== "true";
    if (willOpen) closeOtherVocabularyPopovers(wrapper);
    setPopoverOpen(wrapper, button, willOpen);
  });

  wrapper.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || wrapper.dataset.popoverOpen !== "true") return;
    event.preventDefault();
    setPopoverOpen(wrapper, button, false);
    button.focus?.({ preventScroll: true });
  });

  return wrapper;
}

export function renderVocabularyRichText(container, segments, {
  store,
  context,
  onOpenWordBank,
  onEncountered
} = {}) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return { encounteredIds: [], newTermIds: [] };
  }

  const termSegments = segments.filter((segment) => typeof segment === "object" && segment?.termId);
  const encounteredIds = [...new Set(termSegments.map((segment) => segment.termId))];
  const wasEncountered = new Map(encounteredIds.map((termId) => [termId, Boolean(store?.hasEncountered(termId))]));

  if (typeof document.createElement !== "function" || typeof document.createDocumentFragment !== "function" || typeof container.replaceChildren !== "function") {
    container.textContent = plainTextFromSegments(segments);
  } else {
    const fragment = document.createDocumentFragment();
    const seenInRender = new Set();

    for (const segment of segments) {
      if (typeof segment === "string") {
        fragment.append(document.createTextNode(segment));
        continue;
      }

      const term = getVocabularyTerm(segment.termId);
      if (!term) {
        fragment.append(document.createTextNode(segment.text ?? ""));
        continue;
      }

      const firstHere = !wasEncountered.get(term.id) && !seenInRender.has(term.id);
      seenInRender.add(term.id);
      fragment.append(createVocabularyTermElement(term, {
        isFirstEncounter: firstHere,
        onOpenWordBank
      }));
    }
    container.replaceChildren(fragment);
  }

  const newTermIds = [];
  for (const termId of encounteredIds) {
    const result = store?.encounter(termId, context);
    if (result?.isNew) newTermIds.push(termId);
  }

  onEncountered?.({ encounteredIds, newTermIds });
  return { encounteredIds, newTermIds };
}
