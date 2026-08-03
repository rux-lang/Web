import { afterEach, describe, expect, it } from "vitest";
import { focusMainContent } from "../app/utils/focus";

describe("route focus management", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("moves programmatic focus to the main landmark", () => {
    const previous = document.createElement("button");
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.append(previous, main);
    previous.focus();

    expect(focusMainContent()).toBe(true);
    expect(document.activeElement).toBe(main);
  });

  it("does nothing when the main landmark is unavailable", () => {
    expect(focusMainContent()).toBe(false);
  });
});
