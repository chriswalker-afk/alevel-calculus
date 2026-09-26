function identityShuffle(values) {
  return [...values];
}

export function buildFlashcardDeck(items, { shuffle = identityShuffle } = {}) {
  const cards = [];
  for (const item of items) {
    cards.push(Object.freeze({
      id: `${item.id}:forward`,
      itemId: item.id,
      direction: "forward",
      cue: item.flashcard.cue,
      front: item.flashcard.front,
      back: item.flashcard.back
    }));
    if (item.flashcard.reverse) {
      cards.push(Object.freeze({
        id: `${item.id}:reverse`,
        itemId: item.id,
        direction: "reverse",
        cue: "Recall the matching expression or meaning",
        front: item.flashcard.back,
        back: item.flashcard.front
      }));
    }
  }
  return Object.freeze(shuffle(cards).map((card) => Object.freeze(card)));
}

export function createFlashcardEngine(container, {
  items = [],
  onAttempt = () => {},
  onSecurity = () => {},
  onComplete = () => {},
  shuffle = identityShuffle
} = {}) {
  if (!container) throw new Error("FlashcardEngine requires a container.");
  const deck = buildFlashcardDeck(items, { shuffle });
  const cardButton = container.querySelector("[data-flashcard-card]");
  const cue = container.querySelector("[data-flashcard-cue]");
  const faceLabel = container.querySelector("[data-flashcard-face-label]");
  const content = container.querySelector("[data-flashcard-content]");
  const counter = container.querySelector("[data-flashcard-counter]");
  const prompt = container.querySelector("[data-flashcard-prompt]");
  const rating = container.querySelector("[data-flashcard-rating]");
  const notYet = container.querySelector("[data-flashcard-not-yet]");
  const know = container.querySelector("[data-flashcard-know]");
  const status = container.querySelector("[data-flashcard-status]");
  if ([cardButton, cue, faceLabel, content, counter, prompt, rating, notYet, know, status].some((node) => !node)) {
    throw new Error("FlashcardEngine markup is incomplete.");
  }

  let index = 0;
  let revealed = false;
  const reviewedItemIds = new Set();
  const itemRatings = new Map();

  function currentCard() {
    return deck[index] ?? null;
  }

  function render() {
    const card = currentCard();
    if (!card) {
      cue.textContent = "No cards available";
      faceLabel.textContent = "Memory Lab";
      content.textContent = "Add MemoryItem content to begin retrieval.";
      counter.textContent = "0 of 0";
      prompt.textContent = "";
      rating.hidden = true;
      return;
    }
    cue.textContent = card.cue;
    faceLabel.textContent = revealed ? "Answer" : "Prompt";
    content.textContent = revealed ? card.back : card.front;
    counter.textContent = `${index + 1} of ${deck.length}`;
    prompt.textContent = revealed ? "How well did you know it?" : "Tap, click or press Enter to reveal.";
    rating.hidden = !revealed;
    cardButton.setAttribute("aria-pressed", revealed ? "true" : "false");
  }

  function reveal() {
    if (!currentCard()) return;
    revealed = !revealed;
    render();
  }

  function securityFromRatings() {
    if ([...itemRatings.values()].some((value) => value === false)) return "needs-review";
    if (reviewedItemIds.size >= items.length && items.length > 0) return "developing";
    return null;
  }

  function rate(known) {
    const card = currentCard();
    if (!card || !revealed) return;
    reviewedItemIds.add(card.itemId);
    const previous = itemRatings.get(card.itemId);
    itemRatings.set(card.itemId, previous === false ? false : Boolean(known));
    const complete = reviewedItemIds.size >= items.length && items.length > 0;
    onAttempt({
      engine: "flashcards",
      itemId: card.itemId,
      cardId: card.id,
      success: Boolean(known),
      result: known ? 1 : 0,
      completed: false
    });
    const security = securityFromRatings();
    if (security) onSecurity({ engine: "flashcards", security });
    if (complete) onComplete({ engine: "flashcards" });
    status.textContent = known ? "Marked as known." : "Marked for more review.";
    index = (index + 1) % Math.max(deck.length, 1);
    revealed = false;
    render();
    cardButton.focus();
  }

  cardButton.addEventListener("click", reveal);
  notYet.addEventListener("click", () => rate(false));
  know.addEventListener("click", () => rate(true));

  render();
  return Object.freeze({
    reveal,
    rate,
    getState: () => Object.freeze({ index, revealed, reviewedItemIds: Object.freeze([...reviewedItemIds]) }),
    getDeck: () => deck
  });
}
