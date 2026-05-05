# Package Manifest

## Overview

Every Rux package is described by a `Rux.toml` file at the project root.
The `Rux.toml` file defines metadata, build configuration, and dependency information for a Rux project. It is required in every Rux project directory that participates in the build system or workspace.

```toml
[Package]
Name = "App"
Version = "0.1.0"
Authors = ["Your Name <name@mail.com>"]
Description = "My first Rux application"
```

The file must be encoded in **UTF-8** and adhere to [TOML 1.0.0](https://toml.io) syntax.

## Conventions

- All keys and tables use **PascalCase** by convention.
- Parsing is **case-sensitive**, but Rux tools (`rux`, `rux fmt`) will emit PascalCase when writing manifests.
- Unrecognized fields must be ignored with a warning (to allow forward compatibility).

## `[Package]` Section

Defines project metadata and packaging details.

```toml
[Package]
Name = "App"
Version = "0.1.0"
Description = "A simple Rux project"
License = "MIT"
Authors = ["Your Name <name@mail.com>"]
Repository = "https://github.com/yourname/app"
Homepage = "https://app.com"
Edition = "2026"
Readme = "README.md"
Keywords = ["demo", "example"]
Categories = ["cli"]
```

### Fields

| Field         | Type             | Required | Description                                                  |
| ------------- | ---------------- | -------- | ------------------------------------------------------------ |
| `Name`        | string           | ✅       | Package name (alphanumeric + underscores)                    |
| `Version`     | string           | ✅       | [Semantic version](https://semver.org) (`MAJOR.MINOR.PATCH`) |
| `Description` | string           | ❌       | Short package summary                                        |
| `License`     | string           | ❌       | SPDX license identifier (e.g., `"MIT"`)                      |
| `Authors`     | array of strings | ❌       | Author names and emails                                      |
| `Repository`  | string           | ❌       | VCS repository URL                                           |
| `Homepage`    | string           | ❌       | Project website                                              |
| `Edition`     | string           | ❌       | Language edition (e.g., `"2026"`)                            |
| `Readme`      | string           | ❌       | Path to readme file                                          |
| `Keywords`    | array of strings | ❌       | Search keywords                                              |
| `Categories`  | array of strings | ❌       | Registry categories                                          |

## `[Build]` Section

Specifies build parameters and compiler options.

```toml
[Build]
Target = "x86"
OptLevel = "Release"
Output = "Bin"
EmitIr = false
Flags = ["--warn-unused", "--color=on"]
```

### Fields

| Field      | Type             | Description                                              |
| ---------- | ---------------- | -------------------------------------------------------- |
| `Target`   | string           | Compilation target triple (e.g., `"x86"`, `"x64"`).      |
| `OptLevel` | string/int       | Optimization level (`"Debug"`, `"Release"`, or numeric). |
| `Output`   | string           | Path to output binary or library.                        |
| `EmitIr`   | bool             | Whether to emit intermediate representation.             |
| `Flags`    | array of strings | Extra flags passed to the compiler.                      |

## `[Dependencies]` Sections

The section defines packages this project depends on. Rux supports several dependency tables:

- `[Dependencies]` – runtime dependencies
- `[DevDependencies]` – for testing and tooling
- `[BuildDependencies]` – for build scripts or code generation

### Example

```toml
[Dependencies]
Std = "1.0"
Json = "2.1"
Http = { Version = "1.4", Source = "https://pkg.rux-lang.dev" }
Utils = { Path = "../Utils" }
Network = "*"

[DevDependencies]
TestLib = "0.3"

[BuildDependencies]
CC = "1.2"
```

A dependency version of `"*"` resolves to the latest available release.

### Dependency specification forms

| Form          | Example                                                    | Description                           |
| ------------- | ---------------------------------------------------------- | ------------------------------------- |
| Simple string | `Json = "2.1"`                                             | Version from the default registry     |
| Inline table  | `{ Version = "1.4", Source = "https://pkg.rux-lang.dev" }` | Custom source or path                 |
| Local path    | `{ Path = "../Lib" }`                                      | Local dependency relative to manifest |

### Inline fields

| Field     | Description                |
| --------- | -------------------------- |
| `Version` | Version requirement        |
| `Path`    | Local relative path        |
| `Source`  | Custom registry or Git URL |

## `[Features]` Section

Defines named feature sets for conditional compilation.

```toml
[Features]
Default = ["Network"]
Network = ["Http", "Json"]
CLI = []
```

- `Default` specifies features automatically enabled when none are given.
- Other features list dependencies or nested features.

## `[Scripts]` Section

Defines user-defined commands for build automation.

```toml
[Scripts]
Build = "rux build"
Test = "rux test"
Fmt = "rux fmt"
```

Scripts can be executed via:

```sh
rux script Build
rux script Test
rux script Fmt
```

## `[Workspace]` Section

Groups multiple Rux packages under one workspace.

```toml
[Workspace]
Members = ["Core", "CLI", "Utils"]
```

### Fields

| Field     | Type             | Description                        |
| --------- | ---------------- | ---------------------------------- |
| `Members` | array of strings | Relative paths to member packages. |

## `[Tool.*]` Sections

Used for third-party or internal tool configuration.

```toml
[Tool.RuxFmt]
MaxLineLength = 100
IndentStyle = "Space"
IndentWidth = 4
```

Each tool defines its own schema.  
Tools should use `Tool.<ToolName>` with PascalCase.

## `Rux.lock`

When dependency resolution occurs, the build system creates `Rux.lock` beside the manifest.

Example:

```toml
[[Package]]
Name = "Json"
Version = "2.1.3"
Source = "https://pkg.rux-lang.dev"
Checksum = "8dcb2a7f..."

[[Package]]
Name = "Http"
Version = "1.4.0"
Source = "https://pkg.rux-lang.dev"
Checksum = "ab2cc1c..."
```

This file must not be manually edited.

## Grammar Summary

### Table naming

```toml
[Package]
[Build]
[Dependencies]
[DevDependencies]
[BuildDependencies]
[Features]
[Scripts]
[Workspace]
[Tool.<Name>]
```

### Key rules

- PascalCase keys only.
- Dotted tables are allowed: `[Tool.RuxFmt]`.
- Booleans: `true` / `false` (lowercase per TOML spec).
- Strings: `"..."` UTF-8 quoted strings.
- Comments: `#` (same as TOML).

## Example Full Manifest

```toml
[Package]
Name = "App"
Version = "0.1.0"
Description = "The best application ever"
License = "MIT"
Authors = ["Your Name <name@mail.com>"]
Edition = "2026"

[Build]
Target = "x86_64"
OptLevel = "Release"
Output = "Bin"

[Dependencies]
Std = "1.0"
Json = "2.1"
Http = { Version = "1.4", Source = "https://pkg.rux-lang.dev" }

[DevDependencies]
TestLib = "0.3"

[Features]
Default = ["Network"]
Network = ["Http", "Json"]

[Scripts]
Build = "rux build"
Test = "rux test"

[Tool.RuxFmt]
IndentStyle = "Space"
IndentWidth = 4
```

## Future Extensions

Planned sections:

- `[Profiles.Release]` and `[Profiles.Debug]` for build profiles
- `[Registry]` for multiple registries
- `[Platform]` for per-target configuration
- `[Plugins]` for build extensions or macros
