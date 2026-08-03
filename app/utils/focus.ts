export function focusMainContent(documentRoot: Document = document): boolean {
  const main = documentRoot.getElementById("main-content");
  if (!(main instanceof HTMLElement)) return false;

  main.focus({ preventScroll: true });
  return documentRoot.activeElement === main;
}
