import { describe, expect, it } from "vitest";
import { ruxEditorTheme, tokenizeRux } from "../app/utils/rux-language";

type Token = { text: string; token: string | null };

/** The token stream with whitespace dropped, which is what the assertions read. */
function tokens(source: string): [string, string | null][] {
  return tokenizeRux(source)
    .filter((entry: Token) => entry.text.trim().length > 0)
    .map((entry: Token) => [entry.text, entry.token]);
}

function tokenOf(source: string, text: string): string | null | undefined {
  return tokens(source).find((entry) => entry[0] === text)?.[1];
}

describe("Rux stream mode", () => {
  it("tags the opening lines of the home page's first example", () => {
    expect(
      tokens(["import Io::PrintLine;", "", "// Entry point of the program", "func Main() -> int {"].join("\n")),
    ).toEqual([
      ["import", "keyword"],
      ["Io", "variableName"],
      ["::", "operator"],
      ["PrintLine", "variableName"],
      [";", "punctuation"],
      ["// Entry point of the program", "lineComment"],
      ["func", "keyword"],
      ["Main", "variableName.function"],
      ["(", "bracket"],
      [")", "bracket"],
      ["->", "operator"],
      ["int", "typeName"],
      ["{", "bracket"],
    ]);
  });

  it("separates control flow from storage modifiers", () => {
    const source = "let greetings = [];\nfor greeting in greetings {\n    return 0;\n}";

    expect(tokenOf(source, "let")).toBe("modifier");
    expect(tokenOf(source, "for")).toBe("controlKeyword");
    expect(tokenOf(source, "in")).toBe("controlKeyword");
    expect(tokenOf(source, "return")).toBe("controlKeyword");
    expect(tokenOf("var steps = 10;\nconst Size: uint = 1024;", "var")).toBe("modifier");
    expect(tokenOf("pub func Main() {}", "pub")).toBe("modifier");
  });

  it("names the type a declaration introduces", () => {
    expect(tokens("struct Vector {")).toEqual([
      ["struct", "definitionKeyword"],
      ["Vector", "typeName"],
      ["{", "bracket"],
    ]);
    expect(tokenOf("interface Display {", "Display")).toBe("typeName");
    expect(tokenOf("type Handle = opaque;", "Handle")).toBe("typeName");
    expect(tokenOf("enum Colour {", "Colour")).toBe("typeName");
  });

  it("knows every primitive width the grammar lists", () => {
    for (const primitive of ["int", "uint", "int64", "uint512", "float64", "float80", "char32", "bool8", "opaque"]) {
      expect(tokenOf(`let x: ${primitive} = 0;`, primitive)).toBe("typeName");
    }
    expect(tokenOf("let x: Vector = 0;", "Vector")).toBe("variableName");
  });

  it("marks a call but not a plain reference", () => {
    const source = "PrintLine(sum.Length());";

    expect(tokenOf(source, "PrintLine")).toBe("variableName.function");
    expect(tokenOf(source, "sum")).toBe("variableName");
    expect(tokenOf(source, "Length")).toBe("variableName.function");
  });

  it("distinguishes doc comments from ordinary ones", () => {
    expect(tokenOf("/// Returns the area.", "/// Returns the area.")).toBe("docComment");
    expect(tokenOf("// Returns the area.", "// Returns the area.")).toBe("lineComment");
    expect(tokens("/**/")).toEqual([["/**/", "blockComment"]]);
  });

  it("carries a block comment across lines and nests it", () => {
    const nested = tokenizeRux("/* outer /* inner */ still outer */ func");

    expect(nested[0]?.token).toBe("blockComment");
    expect(nested[0]?.text).toBe("/* outer /* inner */ still outer */");
    expect(tokens("/* first\n   second */ func").map((entry) => entry[1])).toEqual([
      "blockComment",
      "blockComment",
      "keyword",
    ]);
    expect(tokens("/** doc\n   more */").map((entry) => entry[1])).toEqual(["docComment", "docComment"]);
  });

  it("pulls escapes out of a string without losing the quotes", () => {
    expect(tokens(String.raw`Print("Factorial: {}\n", n);`).slice(0, 6)).toEqual([
      ["Print", "variableName.function"],
      ["(", "bracket"],
      ['"', "string"],
      ["Factorial: {}", "string"],
      ["\\n", "escape"],
      ['"', "string"],
    ]);
  });

  it("reads character literals and the sized string prefixes", () => {
    expect(tokens("let c = 'a';").slice(3, 6)).toEqual([
      ["'", "string"],
      ["a", "string"],
      ["'", "string"],
    ]);
    expect(tokens('let s = c32"日";')[3]).toEqual(['c32"', "string"]);
  });

  it("ends an unterminated literal with its line", () => {
    expect(tokens('let s = "oops\nfunc Main() {}').map((entry) => entry[1])).toContain("keyword");
  });

  it("accepts separators, radix prefixes and width suffixes", () => {
    for (const literal of ["0", "1024", "1_000_000", "3.1415", "1.5e-3", "0xFF_00u8", "0o755", "0b1010_1010i32"]) {
      expect(tokenOf(`let n = ${literal};`, literal)).toBe("number");
    }
  });

  it("keeps a range operator out of the number beside it", () => {
    expect(tokens("for i in 2..=n {").slice(3, 6)).toEqual([
      ["2", "number"],
      ["..=", "operator"],
      ["n", "variableName"],
    ]);
    expect(tokens("let s = arr[1..4];").slice(5, 8)).toEqual([
      ["1", "number"],
      ["..", "operator"],
      ["4", "number"],
    ]);
  });

  it("tags language constants apart from each other", () => {
    expect(tokenOf("let ok = true;", "true")).toBe("bool");
    expect(tokenOf("let ok = false;", "false")).toBe("bool");
    expect(tokenOf("var buf: **int64 = null;", "null")).toBe("null");
    expect(tokenOf("func Length(self) -> float64 {", "self")).toBe("self");
    expect(tokenOf("let where = #line;", "#line")).toBe("macroName");
  });

  it("reads the pointer and address-of punctuation the memory example uses", () => {
    expect(tokens("let ptrY: *var int = @y;").map((entry) => entry[1])).toEqual([
      "modifier",
      "variableName",
      "punctuation",
      "operator",
      "modifier",
      "typeName",
      "operator",
      "operator",
      "variableName",
      "punctuation",
    ]);
  });

  it("prefers the longest operator", () => {
    expect(tokens("a <<= b == c != d => e").map((entry) => entry[0])).toEqual([
      "a",
      "<<=",
      "b",
      "==",
      "c",
      "!=",
      "d",
      "=>",
      "e",
    ]);
  });

  it("treats as and is as operators rather than declarations", () => {
    expect(tokenOf("import Math as Calc;", "as")).toBe("operatorKeyword");
    expect(tokenOf("if x is int {", "is")).toBe("operatorKeyword");
  });
});

describe("Rux editor theme", () => {
  it("ships a light and a dark extension pair", () => {
    expect(ruxEditorTheme(false)).toHaveLength(2);
    expect(ruxEditorTheme(true)).toHaveLength(2);
    expect(ruxEditorTheme(true)).not.toEqual(ruxEditorTheme(false));
  });
});
