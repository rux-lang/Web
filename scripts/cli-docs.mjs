import { format } from "prettier";

const commandDetails = {
  add: {
    behavior:
      "Registry dependencies require a namespaced identity such as `Rux/Io`; an optional `@requirement` constrains the resolved version. `--path` adds a local dependency instead. The command updates `Rux.toml` only after registry validation succeeds.",
    environment: ["`RUX_REGISTRY_URL` sets the default registry when `--registry` is absent."],
    related: ["install", "remove", "update"],
  },
  build: {
    behavior:
      "Builds the normal package artifact and may additionally write inspection output selected by repeatable or comma-separated `--emit`. `--debug` and `--release` are mutually exclusive. Frontend target selection is supported, but linking a foreign target is rejected until that backend is available end to end.",
    output:
      "The artifact is written below configured `[Build].Output` using the selected profile. Inspection output is written below `Temp/` and does not replace the normal artifact.",
    environment: ["`SOURCE_DATE_EPOCH` fixes compiler timestamps for reproducible builds."],
    related: ["check", "run", "clean"],
    afterBehavior: `Executable, SharedLibrary, and StaticLibrary packages build their conventional native artifact. A Windows SharedLibrary additionally writes its \`.lib\` import library. SourceLibrary packages can be checked but cannot be built directly.

### \`--emit\` values

| Kind | Additional output |
| --- | --- |
| \`tokens\` | Token streams in \`Temp/Tokens/\` |
| \`ast\` | Parsed syntax trees in \`Temp/Ast/\` |
| \`sema\` | Semantic-analysis dump in \`Temp/Sema/sema.txt\` |
| \`hir\` | High-level IR in \`Temp/Hir/hir.txt\` |
| \`lir\` | Low-level IR in \`Temp/Lir/lir.txt\` |
| \`asm\` | Target assembly in \`Temp/Asm/\` |
| \`rcu\` | RCU objects in \`Temp/Obj/\` and text dumps in \`Temp/Rcu/\` |

The option is repeatable and accepts comma-separated values, so \`--emit ast --emit sema\` and \`--emit ast,sema\` are equivalent.`,
  },
  check: {
    behavior:
      "Runs lexing, parsing, dependency loading, conditional-compilation folding, and semantic analysis without linking. Any supported target may be checked, including a foreign target. `--define` values override `[Build.Defines]`.",
    output:
      "Text diagnostics go to stderr. With `--json`, stdout receives one complete JSON document with a success flag and an escaped diagnostics array, including on failure.",
    related: ["build", "lint", "doc"],
  },
  clean: {
    behavior:
      "Removes the directory named by `[Build].Output` and the package `Temp/` directory. `--temp` preserves configured build artifacts and removes only `Temp/`.",
    related: ["build"],
  },
  doc: {
    behavior:
      "Runs the same folded, semantically checked frontend as `rux check`, then documents public modules, types, functions, constants, fields, variants, interface members, externs, and public extension methods. `--document-private-items` includes private items. Consecutive outer `///` comments attach when no blank line intervenes and support safe Markdown; raw HTML is escaped and unsafe link schemes are omitted. Foreign supported targets and repeated `--define` values select the API that is generated.",
    output:
      "The default is `[Build].Output/Docs` (normally `Bin/Docs`). A workspace gets a landing page and one member section; dependencies are excluded. Generation is deterministic and self-contained. Rux writes through a temporary directory, marks managed output, and refuses to replace a non-empty unmarked directory. `--open` launches the generated index only after success.",
    related: ["check", "build"],
  },
  fmt: {
    behavior:
      "Formats both `Src/**/*.rux` and `Rux.toml` by default. `--source-only` and `--manifest-only` are mutually exclusive. `--check` reports drift without writing files.",
    related: ["check", "lint"],
  },
  help: {
    behavior:
      "Without an operand, lists all commands and global options. With a command operand, prints command help. `--json` emits schema version 1 with stable program, command, usage, argument, option, example, and documentation URL data; build timestamps are intentionally absent.",
    output: "Help and JSON are written to stdout.",
    related: ["version"],
  },
  info: {
    behavior:
      "Without an operand, reads the current manifest. With a namespaced identity, selects the highest installed version matching the requirement and consults the registry only to explain a cache miss. Package identities remain namespace-qualified.",
    output:
      "Human-readable metadata goes to stdout. `--json` writes one complete, fully escaped JSON document on success or failure.",
    environment: ["`RUX_REGISTRY_URL` sets the lookup registry when `--registry` is absent."],
    related: ["list", "install"],
  },
  init: {
    behavior:
      "Creates a manifest and starter source in the current directory. `--executable`, `--shared`, `--static`, and `--source` are mutually exclusive; Executable is the default. `--namespace` prepares a registry identity.",
    related: ["new"],
  },
  install: {
    behavior:
      "Without an operand, installs registry dependencies from the current package or every workspace member. With a namespaced identity, installs that package without adding it to the manifest. Resolution honors requirements, target conditions, transitive dependencies, yank state, `MinRux`, published SHA-256 checksums, and exact-version cache directories.",
    environment: [
      "`RUX_REGISTRY_URL` sets the registry when `--registry` is absent.",
      "`LOCALAPPDATA` on Windows or `HOME` elsewhere determines the user package cache.",
    ],
    related: ["add", "update", "uninstall"],
  },
  lint: {
    behavior:
      "Runs fast source-level lint rules for the package or every workspace member without building an artifact. Use `rux check` when full semantic validation is required.",
    related: ["check", "fmt"],
  },
  list: {
    behavior:
      "Lists manifest dependencies and the installed versions that satisfy them. `--global` lists every exact version in the user cache.",
    environment: ["`LOCALAPPDATA` on Windows or `HOME` elsewhere determines the user package cache."],
    related: ["info", "install", "uninstall"],
  },
  login: {
    behavior:
      "Reads a registry token from stdin so it does not enter shell history or the process list, verifies it when the registry supports verification, and stores it per registry with owner-only permissions.",
    environment: [
      "`RUX_REGISTRY_URL` selects the registry when `--registry` is absent.",
      "`RUX_TOKEN` overrides a stored token for commands that authenticate.",
    ],
    related: ["logout", "publish"],
  },
  logout: {
    behavior:
      "Removes only the stored token associated with the selected registry. It does not change the `RUX_TOKEN` environment variable or credentials for other registries.",
    environment: ["`RUX_REGISTRY_URL` selects the registry when `--registry` is absent."],
    related: ["login"],
  },
  new: {
    behavior:
      "Creates a new directory containing a manifest and starter source. `--executable`, `--shared`, `--static`, and `--source` are mutually exclusive; Executable is the default. `--path` selects the parent directory and `--namespace` sets the registry namespace.",
    related: ["init"],
  },
  pack: {
    behavior:
      "Validates the publication profile and creates a deterministic `.ruxpkg` containing `Rux.toml`, `Src/`, and declared readme and license files. Workspaces and path dependencies cannot be packed.",
    output:
      "The default archive is `<Name>-<Version>.ruxpkg` below configured build output. `-o` and `--output` select an explicit path.",
    related: ["publish"],
  },
  publish: {
    behavior:
      "Applies the same validation and packing rules as `rux pack`, then uploads an immutable version. `--dry-run` stops after validation and archive creation. Authentication tokens are never accepted as command-line options.",
    environment: [
      "`RUX_REGISTRY_URL` sets the registry when `--registry` is absent.",
      "`RUX_TOKEN` takes precedence over a token stored by `rux login`.",
    ],
    related: ["pack", "login"],
  },
  remove: {
    behavior:
      "Removes the dependency with the given import name from `Rux.toml`. It does not remove cached package versions; use `rux uninstall` for cache cleanup.",
    related: ["add", "uninstall"],
  },
  run: {
    behavior:
      "Builds an Executable package, then runs it. SharedLibrary, StaticLibrary, and SourceLibrary packages cannot run. `--define` overrides compile-time configuration and `--release` selects the release profile. Only arguments after `--` are passed to the child program.",
    output:
      "Compiler progress and diagnostics use the usual streams. After a successful build, the command returns the child program's exit code.",
    environment: ["`SOURCE_DATE_EPOCH` fixes compiler timestamps for reproducible builds."],
    related: ["build", "test"],
  },
  test: {
    behavior:
      "Discovers test Program packages, builds them with test mode enabled, and runs every executable. Workspaces include root and member test trees. `--define` and `--release` apply consistently to every test target.",
    output:
      "A summary is written to stdout; compiler diagnostics and failed test details identify unsuccessful targets. The command returns 1 when any build or test fails.",
    related: ["check", "run"],
  },
  uninstall: {
    behavior:
      "Without an operand, removes cached versions of dependencies declared by the current manifest. A namespaced identity removes all matching versions, or only versions matching an `@requirement`. `--global` is mutually exclusive with an operand and clears the package cache.",
    environment: ["`LOCALAPPDATA` on Windows or `HOME` elsewhere determines the user package cache."],
    related: ["install", "list"],
  },
  update: {
    behavior:
      "Re-resolves manifest dependencies and installs the newest versions allowed by their requirements and target conditions. `--global` updates every cached identity. Older exact versions remain cached until `rux uninstall` removes them.",
    environment: [
      "`RUX_REGISTRY_URL` sets the registry when `--registry` is absent.",
      "`LOCALAPPDATA` on Windows or `HOME` elsewhere determines the user package cache.",
    ],
    related: ["install", "uninstall"],
  },
  version: {
    behavior:
      "Prints the compiler's source version. Human-readable version output may include build date and time; the stable help JSON contract contains only the semantic version.",
    output: "Version information is written to stdout and the command exits 0.",
    related: ["help"],
  },
};

const escapeCell = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const frontmatter = (title, description, navigation = title) => `---
title: ${title}
description: ${description}
navigation:
  title: ${navigation}
seo:
  title: ${title}
  description: ${description}
---

`;

function optionTable(options) {
  if (!options.length) return "This command has no command-specific options. Global options still apply.";
  return `| Option | Description |
| --- | --- |
${options.map((option) => `| \`${escapeCell(option.flags)}\` | ${escapeCell(option.description)} |`).join("\n")}`;
}

function argumentTable(arguments_) {
  if (!arguments_.length) return "This command accepts no operands.";
  return `| Argument | Required | Description |
| --- | --- | --- |
${arguments_.map((argument) => `| \`${argument.name}\` | ${argument.required ? "Yes" : "No"} | ${escapeCell(argument.description)} |`).join("\n")}`;
}

export function renderCommand(command) {
  const details = commandDetails[command.name] ?? {};
  const environment =
    details.environment?.join("\n\n") ?? "This command defines no command-specific environment variables.";
  const related =
    (details.related ?? []).map((name) => `- [\`rux ${name}\`](/docs/cli/${name})`).join("\n") ||
    "- [Global options](/docs/cli/global)";
  return `${frontmatter(`rux ${command.name}`, command.summary, command.name)}# rux ${command.name}

## Purpose

${command.description}

## Synopsis

\`\`\`sh
${command.usages.join("\n")}
\`\`\`

## Behavior

${details.behavior ?? command.description}

${details.afterBehavior ?? ""}

## Arguments

${argumentTable(command.arguments)}

## Options

${optionTable(command.options)}

Global options may appear before or after the command. See [Global options](/docs/cli/global).

## Output and exit status

${details.output ?? "Primary results are written to stdout. Progress, warnings, and errors are written to stderr."}

Success exits 0, invalid command-line usage exits 2, and compiler, validation, filesystem, network, or generation failures exit 1 unless stated otherwise above.

## Examples

\`\`\`sh
${command.examples.length ? command.examples.join("\n") : command.usages[0]}
\`\`\`

## Environment variables

${environment}

The global color environment behavior is described under [Global options](/docs/cli/global#environment-variables).

## Related commands

${related}
`;
}

export function renderGlobal(contract) {
  return `${frontmatter("Global options", "Options accepted before or after every Rux CLI command.", "Global Options")}# Global options

## Purpose

Global options configure command-independent CLI behavior and may appear before or after the command name.

## Synopsis

\`\`\`sh
rux [global-options] <command> [command-options] [operands]
\`\`\`

Both \`--option value\` and \`--option=value\` are accepted for options that take a value. Only \`rux run\` accepts \`--\`; every following token is passed unchanged to the child program.

## Behavior

\`-q\`/\`--quiet\` and \`-v\`/\`--verbose\` conflict. Help and version exit 0. Unknown options, missing values, invalid color values, conflicts, and incorrect operand counts exit 2 and are written to stderr.

Help is available as \`rux help\`, \`rux help <command>\`, or command-level \`-h\`/\`--help\`. Close command and option spellings receive a suggestion.

## Options

${optionTable(contract.globalOptions)}

### Color

\`--color\` accepts exactly \`auto\`, \`always\`, or \`never\`. An explicit CLI value overrides the environment. In auto mode, stdout and stderr terminal attachment are detected independently.

### Manifest

\`--manifest <path>\` selects a specific manifest instead of searching upward for \`Rux.toml\`.

## Output and exit status

Primary output and structured JSON use stdout. Progress, warnings, and errors use stderr. Success, help, and version exit 0; invalid CLI usage exits 2; operational and compiler failures exit 1.

## Examples

\`\`\`sh
rux --manifest examples/Rux.toml check
rux build --color=never
rux --quiet test
rux help build
rux help --json
\`\`\`

## Environment variables

- A non-empty \`NO_COLOR\` disables color in auto mode.
- \`TERM=dumb\` disables color in auto mode.
- An explicit \`--color always\` or \`--color never\` overrides both variables.

## Related commands

- [\`rux help\`](/docs/cli/help)
- [\`rux version\`](/docs/cli/version)
`;
}

export function renderOverview(contract) {
  const rows = contract.commands
    .map((command) => `| [\`rux ${command.name}\`](/docs/cli/${command.name}) | ${escapeCell(command.summary)} |`)
    .join("\n");
  return `${frontmatter("CLI Reference", "Verified reference for the Rux compiler and package-manager command line.", "Overview")}# CLI Reference

The Rux compiler is the source of truth for this reference. The checked-in contract was generated by \`rux ${contract.program.version}\` using help schema version ${contract.schemaVersion}.

## Command syntax

\`\`\`sh
rux [global-options] <command> [command-options] [operands]
\`\`\`

Global options may appear before or after the command. Value options accept separated and equals forms. Only [\`rux run\`](/docs/cli/run) treats tokens after \`--\` as child-program arguments.

## Commands

| Command | Purpose |
| --- | --- |
${rows}

## Streams and exit status

Primary output and JSON use stdout. Progress, warnings, and errors use stderr. Success, help, and version exit 0; invalid CLI usage exits 2; compiler or operational failures exit 1. [\`rux run\`](/docs/cli/run) returns the child program's exit code after a successful build.

## Structured help

\`rux help --json\` returns the full stable contract. \`rux help <command> --json\` returns one command. Both use \`schemaVersion: 1\` and omit build timestamps.

## Start here

- [Global options](/docs/cli/global)
- [Build a package](/docs/cli/build)
- [Check without linking](/docs/cli/check)
- [Generate API documentation](/docs/cli/doc)
- [Package and publish](/docs/packaging)
`;
}

export async function renderCliDocs(contract) {
  const files = new Map([
    ["content/docs/3.cli/index.md", renderOverview(contract)],
    ["content/docs/3.cli/01.global.md", renderGlobal(contract)],
  ]);
  contract.commands.forEach((command, index) => {
    const order = String(index + 2).padStart(2, "0");
    files.set(`content/docs/3.cli/${order}.${command.name}.md`, renderCommand(command));
  });
  return new Map(
    await Promise.all(
      [...files].map(async ([path, markdown]) => [path, await format(markdown, { parser: "markdown" })]),
    ),
  );
}
