import { focusMainContent } from "~/utils/focus";

export default defineNuxtPlugin((nuxtApp) => {
  let initialPageFinished = false;

  nuxtApp.hook("page:finish", () => {
    if (!initialPageFinished) {
      initialPageFinished = true;
      return;
    }

    requestAnimationFrame(() => focusMainContent());
  });
});
