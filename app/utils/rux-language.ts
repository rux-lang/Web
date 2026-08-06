import { HighlightStyle, StreamLanguage, StringStream, syntaxHighlighting } from "@codemirror/language";
import type { StreamParser } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

/**
 * A CodeMirror mode for Rux, derived from `grammars/rux.tmLanguage.json`.
 *
 * That grammar is what Shiki highlights the docs with at build time, so keeping
 * the two in step is what stops the editor disagreeing with the prose code block
 * three paragraphs above it about what a keyword is. Token names here are
 * @lezer/highlight tag names: a stream parser with no `tokenTable` resolves them
 * straight against `tags`, and an unknown name is a console warning and an
 * unstyled token.
 */

const controlKeywords = new Set([
  "break",
  "continue",
  "do",
  "else",
  "for",
  "if",
  "in",
  "loop",
  "match",
  "return",
  "while",
]);

const storageModifiers = new Set(["const", "let", "pub", "var"]);

/** Keywords that introduce a named type, so the name after them is one. */
const declarationKeywords = new Set(["enum", "interface", "struct", "type", "union"]);

const otherKeywords = new Set(["asm", "async", "export", "extend", "extern", "func", "import", "module"]);

const typeOperators = new Set(["as", "is"]);

const primitiveTypes = new Set([
  "opaque",
  ...["bool", "char", "float", "int", "uint"].flatMap((base) => [
    base,
    ...["8", "16", "32", "64", "128", "256", "512"].map((width) => `${base}${width}`),
  ]),
  "float80",
]);

const numericSuffix =
  "(?:f8|f16|f32|f64|f80|f128|f256|f512|i8|i16|i32|i64|i128|i256|i512|u8|u16|u32|u64|u128|u256|u512|i|u)?";
const hexLiteral = new RegExp(`^0x[\\da-fA-F_]+${numericSuffix}`);
const octalLiteral = new RegExp(`^0o[0-7_]+${numericSuffix}`);
const binaryLiteral = new RegExp(`^0b[01_]+${numericSuffix}`);
// The fractional part requires a digit so `2..=n` reads as a range, not `2.` and `=n`.
const decimalLiteral = new RegExp(`^\\d[\\d_]*(?:\\.[\\d_]+)?(?:[Ee][+-]?[\\d_]+)?${numericSuffix}`);

const intrinsicConstant = /^#(?:module|file|function|line|column|date|time)\b/;
const identifier = /^[A-Za-z_][A-Za-z0-9_]*/;
const stringOpen = /^(?:c8|c16|c32)?(["'])/;
const compoundOperator =
  /^(?:<<=|>>=|\.\.=|\.\.\.|\.\.|==|!=|<=|>=|=>|->|::|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<|>>)/;
const singleOperator = /^[+\-*/%=<>!~^&|@?]/;

export interface RuxTokenizerState {
  /** Block-comment nesting depth; the grammar allows one inside another. */
  blockDepth: number;
  blockIsDoc: boolean;
  /** The quote character of the literal being read, when inside one. */
  quote: string | null;
  /** Set by a declaration keyword, so the identifier after it reads as a type. */
  expectTypeName: boolean;
}

function tokenizeBlockComment(stream: StringStream, state: RuxTokenizerState): string {
  while (!stream.eol()) {
    if (stream.match("*/")) {
      state.blockDepth -= 1;
      if (state.blockDepth > 0) continue;
      const doc = state.blockIsDoc;
      state.blockIsDoc = false;
      return doc ? "docComment" : "blockComment";
    }
    if (stream.match("/*")) {
      state.blockDepth += 1;
      continue;
    }
    stream.next();
  }
  return state.blockIsDoc ? "docComment" : "blockComment";
}

function tokenizeStringBody(stream: StringStream, state: RuxTokenizerState): string {
  const quote = state.quote;

  if (stream.eat("\\")) {
    stream.next();
    if (stream.eol()) state.quote = null;
    return "escape";
  }
  if (quote && stream.eat(quote)) {
    state.quote = null;
    return "string";
  }

  while (!stream.eol()) {
    const next = stream.peek();
    if (next === "\\" || next === quote) break;
    stream.next();
  }
  // A literal never spans a line, so an unterminated one ends with the line
  // rather than painting the rest of the file green.
  if (stream.eol()) state.quote = null;
  return "string";
}

function tokenizeWord(stream: StringStream, state: RuxTokenizerState): string {
  const word = stream.current();
  const expectedTypeName = state.expectTypeName;
  state.expectTypeName = declarationKeywords.has(word);

  if (controlKeywords.has(word)) return "controlKeyword";
  if (storageModifiers.has(word)) return "modifier";
  if (declarationKeywords.has(word)) return "definitionKeyword";
  if (otherKeywords.has(word)) return "keyword";
  if (typeOperators.has(word)) return "operatorKeyword";
  if (word === "self" || word === "super") return "self";
  if (word === "true" || word === "false") return "bool";
  if (word === "null") return "null";
  if (primitiveTypes.has(word)) return "typeName";
  if (expectedTypeName) return "typeName";
  if (stream.match(/^\s*\(/, false)) return "variableName.function";
  return "variableName";
}

export const ruxStreamParser: StreamParser<RuxTokenizerState> = {
  name: "rux",
  startState: () => ({ blockDepth: 0, blockIsDoc: false, quote: null, expectTypeName: false }),
  copyState: (state) => ({ ...state }),
  blankLine: (state) => {
    state.quote = null;
    state.expectTypeName = false;
  },
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", '"', "'"] },
    indentOnInput: /^\s*[)\]}]$/,
  },
  token(stream, state) {
    if (state.quote !== null) return tokenizeStringBody(stream, state);
    if (state.blockDepth > 0) return tokenizeBlockComment(stream, state);
    if (stream.eatSpace()) return null;

    if (stream.match("/**/")) return "blockComment";
    if (stream.match("/*")) {
      state.blockDepth = 1;
      state.blockIsDoc = stream.peek() === "*";
      return tokenizeBlockComment(stream, state);
    }
    if (stream.match("///")) {
      stream.skipToEnd();
      return "docComment";
    }
    if (stream.match("//")) {
      stream.skipToEnd();
      return "lineComment";
    }

    const opened = stream.match(stringOpen) as RegExpMatchArray | null;
    if (opened) {
      state.quote = opened[1] ?? null;
      state.expectTypeName = false;
      return "string";
    }

    const next = stream.peek() ?? "";
    if (next >= "0" && next <= "9") {
      state.expectTypeName = false;
      if (stream.match(hexLiteral) || stream.match(octalLiteral) || stream.match(binaryLiteral)) return "number";
      if (stream.match(decimalLiteral)) return "number";
    }

    if (stream.match(intrinsicConstant)) {
      state.expectTypeName = false;
      return "macroName";
    }

    if (stream.match(identifier)) return tokenizeWord(stream, state);

    state.expectTypeName = false;
    if (stream.match(compoundOperator) || stream.match(singleOperator)) return "operator";
    if (stream.match(/^[[\]{}()]/)) return "bracket";
    if (stream.match(/^[.,;:]/)) return "punctuation";

    stream.next();
    return null;
  },
};

export const ruxLanguage = StreamLanguage.define(ruxStreamParser);

/**
 * Runs the mode over a whole document.
 *
 * The parser is a plain function over a `StringStream`, so this needs no editor
 * and no DOM — which is what the mode's tests drive.
 */
export function tokenizeRux(source: string): { text: string; token: string | null }[] {
  const state = ruxStreamParser.startState?.(2) ?? ({} as RuxTokenizerState);
  const tokens: { text: string; token: string | null }[] = [];

  for (const line of source.split("\n")) {
    if (line.trim().length === 0) {
      ruxStreamParser.blankLine?.(state, 2);
      continue;
    }
    const stream = new StringStream(line, 2, 2);
    while (!stream.eol()) {
      const token = ruxStreamParser.token(stream, state);
      tokens.push({ text: stream.current(), token });
      stream.start = stream.pos;
    }
  }

  return tokens;
}

interface RuxPalette {
  comment: string;
  control: string;
  keyword: string;
  operatorKeyword: string;
  storage: string;
  variable: string;
  bool: string;
  number: string;
  type: string;
  string: string;
  escape: string;
  callee: string;
  punctuation: string;
  selection: string;
  activeLine: string;
}

/** material-theme-lighter, the site's Shiki light theme. */
const lightPalette: RuxPalette = {
  comment: "#90A4AE",
  control: "#39ADB5",
  keyword: "#F76D47",
  operatorKeyword: "#39ADB5",
  storage: "#9C3EDA",
  variable: "#90A4AE",
  bool: "#FF5370",
  number: "#F76D47",
  type: "#E2931D",
  string: "#91B859",
  escape: "#90A4AE",
  callee: "#6182B8",
  punctuation: "#39ADB5",
  selection: "#80CBC440",
  activeLine: "#CCD7DA40",
};

/** material-theme-palenight, the site's Shiki dark theme. */
const darkPalette: RuxPalette = {
  comment: "#676E95",
  control: "#89DDFF",
  keyword: "#F78C6C",
  operatorKeyword: "#89DDFF",
  storage: "#C792EA",
  variable: "#babed8",
  bool: "#ff9cac",
  number: "#F78C6C",
  type: "#FFCB6B",
  string: "#C3E88D",
  escape: "#babed8",
  callee: "#82AAFF",
  punctuation: "#89DDFF",
  selection: "#717CB480",
  activeLine: "#00000030",
};

function highlightStyle(palette: RuxPalette, themeType: "light" | "dark"): HighlightStyle {
  return HighlightStyle.define(
    [
      { tag: [tags.comment, tags.lineComment, tags.blockComment], color: palette.comment, fontStyle: "italic" },
      { tag: tags.docComment, color: palette.comment, fontStyle: "italic" },
      { tag: tags.controlKeyword, color: palette.control, fontStyle: "italic" },
      { tag: tags.keyword, color: palette.keyword },
      { tag: [tags.operatorKeyword, tags.null], color: palette.operatorKeyword },
      { tag: [tags.modifier, tags.definitionKeyword], color: palette.storage },
      { tag: [tags.variableName, tags.self], color: palette.variable },
      { tag: tags.bool, color: palette.bool },
      { tag: [tags.number, tags.macroName], color: palette.number },
      { tag: tags.typeName, color: palette.type },
      { tag: [tags.string, tags.character], color: palette.string },
      { tag: tags.escape, color: palette.escape },
      { tag: tags.function(tags.variableName), color: palette.callee },
      { tag: [tags.operator, tags.punctuation, tags.bracket], color: palette.punctuation },
    ],
    { themeType },
  );
}

const lightHighlightStyle = highlightStyle(lightPalette, "light");
const darkHighlightStyle = highlightStyle(darkPalette, "dark");

function chrome(palette: RuxPalette, dark: boolean): Extension {
  return EditorView.theme(
    {
      "&": {
        color: palette.variable,
        backgroundColor: "transparent",
        fontSize: "0.875rem",
      },
      "&.cm-focused": { outline: "none" },
      ".cm-scroller": {
        fontFamily: "var(--font-mono)",
        lineHeight: "1.5rem",
      },
      ".cm-content": {
        caretColor: "var(--ui-text-highlighted)",
        padding: "0.75rem 0",
      },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--ui-text-highlighted)" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: palette.selection,
      },
      ".cm-activeLine": { backgroundColor: palette.activeLine },
      ".cm-gutters": {
        backgroundColor: "transparent",
        color: "var(--ui-text-dimmed)",
        border: "none",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
        color: "var(--ui-text-toned)",
      },
      ".cm-lineNumbers .cm-gutterElement": { padding: "0 0.5rem 0 1rem" },
      ".cm-matchingBracket, &.cm-focused .cm-matchingBracket": {
        backgroundColor: "transparent",
        outline: `1px solid ${palette.punctuation}`,
      },
      ".cm-nonmatchingBracket, &.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "transparent",
        outline: `1px solid ${palette.bool}`,
      },
      ".cm-placeholder": { color: "var(--ui-text-dimmed)" },
    },
    { dark },
  );
}

// Built once. Each `EditorView.theme()` call mints its own generated class and
// injects another copy of the same rules, so building them per toggle would
// grow the document's style sheet every time the reader flips the site theme.
const lightTheme: Extension[] = [chrome(lightPalette, false), syntaxHighlighting(lightHighlightStyle)];
const darkTheme: Extension[] = [chrome(darkPalette, true), syntaxHighlighting(darkHighlightStyle)];

/**
 * The editor's appearance for one colour mode.
 *
 * Token colours come from the Shiki theme; the surface, gutter and caret come
 * from the site's own CSS variables, which is how a prose `pre` is painted too.
 */
export function ruxEditorTheme(dark: boolean): Extension[] {
  return dark ? darkTheme : lightTheme;
}
