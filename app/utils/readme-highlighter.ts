import shellscript from "@shikijs/langs/shellscript";
import catppuccinLatte from "@shikijs/themes/catppuccin-latte";
import catppuccinMocha from "@shikijs/themes/catppuccin-mocha";
import type { Element } from "hast";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { LanguageRegistration } from "shiki/types";
import ruxGrammarSource from "../../grammars/rux.tmLanguage.json";

export type ReadmeHighlightLanguage = "rux" | "shellscript";

const shellLanguages = new Set(["sh", "bash", "shell", "shellscript", "zsh"]);
const ruxGrammar = { ...ruxGrammarSource, name: "rux" } as LanguageRegistration;

let highlighterPromise: ReturnType<typeof createHighlighterCore> | undefined;

export function readmeHighlightLanguage(language: string | undefined): ReadmeHighlightLanguage | null {
  const normalized = language?.trim().toLowerCase();
  if (normalized === "rux") return "rux";
  if (normalized && shellLanguages.has(normalized)) return "shellscript";
  return null;
}

function getReadmeHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [ruxGrammar, shellscript],
    themes: [catppuccinLatte, catppuccinMocha],
  });
  return highlighterPromise;
}

export async function highlightReadmeCode(code: string, language: string | undefined): Promise<Element | null> {
  const supportedLanguage = readmeHighlightLanguage(language);
  if (!supportedLanguage) return null;

  const highlighter = await getReadmeHighlighter();
  // Markdown fences contribute one structural trailing newline. Keeping it in
  // Shiki's input creates an extra empty `.line`; intentional blank lines still
  // survive because only this single fence newline is removed.
  const displayCode = code.replace(/\r?\n$/, "");
  const tree = highlighter.codeToHast(displayCode, {
    lang: supportedLanguage,
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
  });

  return tree.children.find((node): node is Element => node.type === "element" && node.tagName === "pre") ?? null;
}
