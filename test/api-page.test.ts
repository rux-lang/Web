import { describe, expect, it } from "vitest";
import { apiPageInfo } from "../app/utils/api-page";

describe("API page metadata", () => {
  it("links C functions to their actual implementation files", () => {
    expect(apiPageInfo("/docs/api/c/printf")).toEqual({
      packageName: "C",
      version: "0.1.0",
      sourceUrl: "https://github.com/rux-lang/Rux/blob/main/Packages/C/Src/StdIo.rux",
    });
    expect(apiPageInfo("/docs/api/c/sqrt").sourceUrl).toMatch(/\/Packages\/C\/Src\/Math\.rux$/);
    expect(apiPageInfo("/docs/api/c/mktime").sourceUrl).toMatch(/\/Packages\/C\/Src\/Time\.rux$/);
  });

  it("maps package-specific and shared implementation files", () => {
    expect(apiPageInfo("/docs/api/io/printline").sourceUrl).toMatch(/\/Packages\/Io\/Src\/PrintLine\.rux$/);
    expect(apiPageInfo("/docs/api/math/degtorad").sourceUrl).toMatch(/\/Packages\/Math\/Src\/Angle\.rux$/);
    expect(apiPageInfo("/docs/api/text/stringbuilder/append").sourceUrl).toMatch(
      /\/Packages\/Text\/Src\/StringBuilder\.rux$/,
    );
    expect(apiPageInfo("/docs/api/windows/writefile").sourceUrl).toMatch(/\/Packages\/Windows\/Src\/Windows\.rux$/);
  });

  it("falls back to the closest package or repository source directory", () => {
    expect(apiPageInfo("/docs/api/format/tostring").sourceUrl).toBe(
      "https://github.com/rux-lang/Rux/tree/main/Packages/Format",
    );
    expect(apiPageInfo("/docs/api/c").sourceUrl).toBe("https://github.com/rux-lang/Rux/tree/main/Packages/C");
    expect(apiPageInfo("/docs/api").sourceUrl).toBe("https://github.com/rux-lang/Rux/tree/main/Packages");
  });
});
