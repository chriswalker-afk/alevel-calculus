export function createLearnView(container, { items = [] } = {}) {
  if (!container) throw new Error("LearnView requires a container.");
  const list = container.querySelector("[data-memory-learn-list]");
  const summary = container.querySelector("[data-memory-learn-summary]");
  if (!list || !summary) throw new Error("LearnView markup is incomplete.");

  function render() {
    list.replaceChildren();
    for (const item of items) {
      const article = document.createElement("article");
      article.className = "memory-learn-item";
      article.dataset.memoryItemId = item.id;

      const header = document.createElement("div");
      header.className = "memory-learn-item__header";
      const label = document.createElement("h3");
      label.textContent = item.learn.label;
      const kind = document.createElement("span");
      kind.className = "memory-learn-item__kind";
      kind.textContent = item.kind;
      header.append(label, kind);

      const statement = document.createElement("p");
      statement.textContent = item.learn.statement;
      const notation = document.createElement("div");
      notation.className = "memory-learn-item__notation";
      notation.textContent = item.learn.notation ?? "";
      notation.hidden = !item.learn.notation;
      article.append(header, statement, notation);
      list.append(article);
    }
    summary.textContent = `${items.length} key facts and vocabulary items from one shared memory bank.`;
  }

  render();
  return Object.freeze({ render });
}
