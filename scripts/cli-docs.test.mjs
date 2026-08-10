import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderCliDocs } from "./cli-docs.mjs";

const contract = JSON.parse(await readFile(new URL("../data/cli-reference.json", import.meta.url), "utf8"));

test("the CLI contract renders every reference page", async () => {
  const pages = await renderCliDocs(contract);
  assert.equal(contract.commands.length, 23);
  assert.equal(pages.size, 25);
  assert.doesNotMatch(pages.get("content/docs/3.cli/index.md"), /Planned Extensions/);
});

test("every command page has the shared reference structure and verified spellings", async () => {
  const pages = await renderCliDocs(contract);
  for (const [index, command] of contract.commands.entries()) {
    const path = `content/docs/3.cli/${String(index + 2).padStart(2, "0")}.${command.name}.md`;
    const markdown = pages.get(path);
    assert.ok(markdown, path);
    for (const heading of [
      "Purpose",
      "Synopsis",
      "Behavior",
      "Arguments",
      "Options",
      "Output and exit status",
      "Examples",
      "Environment variables",
      "Related commands",
    ]) {
      assert.match(markdown, new RegExp(`^## ${heading}$`, "m"), `${path}: ${heading}`);
    }
    for (const usage of command.usages) assert.ok(markdown.includes(usage), `${path}: ${usage}`);
    for (const option of command.options) assert.ok(markdown.includes(option.flags), `${path}: ${option.flags}`);
  }
});
