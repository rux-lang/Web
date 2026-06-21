# Package Manifest

## Overview

Every Rux package is described by a `Rux.toml` file at the project root. It defines the package metadata, build configuration, and dependencies, and is required for any project that takes part in the build system or a workspace.

```toml
[Package]
Name = "App"
Version = "0.1.0"
Description = "My first Rux application"
Authors = ["Your Name <name@mail.com>"]
```

The file must be UTF-8 encoded and follow [TOML 1.0.0](https://toml.io) syntax. By convention, all keys and tables use **PascalCase**. Parsing is case-sensitive, and unrecognized fields are ignored with a warning for forward compatibility.

## `[Package]`

Project metadata and packaging details.

```toml
[Package]
Name = "App"
Version = "0.1.0"
Type = "Program"
Description = "A simple Rux project"
License = "MIT"
Authors = ["Your Name <name@mail.com>"]
```

| Field         | Type             | Required | Description                                                  |
| ------------- | ---------------- | -------- | ------------------------------------------------------------ |
| `Name`        | string           | ✅       | Package name (alphanumeric + underscores)                    |
| `Version`     | string           | ✅       | [Semantic version](https://semver.org) (`MAJOR.MINOR.PATCH`) |
| `Type`        | string           | ❌       | [Package type](types) (defaults to `"Program"`)             |
| `Description` | string           | ❌       | Short package summary                                        |
| `License`     | string           | ❌       | SPDX license identifier (e.g., `"MIT"`)                      |
| `Authors`     | array of strings | ❌       | Author names and emails                                      |

## `[Build]`

Build parameters and compiler options.

```toml
[Build]
Target = "x86"
OptLevel = "Release"
Output = "Bin"
```

| Field      | Type   | Description                                        |
| ---------- | ------ | -------------------------------------------------- |
| `Target`   | string | Compilation target triple (e.g., `"x86"`, `"x64"`) |
| `OptLevel` | string | Optimization level (`"Debug"`, `"Release"`)        |
| `Output`   | string | Path to output binary or library                   |

## `[Dependencies]`

Packages this project depends on. Each entry is a version string or an inline table:

```toml
[Dependencies]
Std = "1.0"
Json = "2.1"
Utils = { Path = "../Utils" }
Network = "*"
```

A version of `"*"` resolves to the latest available release.

| Form          | Example               | Description                         |
| ------------- | --------------------- | ----------------------------------- |
| Simple string | `Json = "2.1"`        | Version resolved from the registry  |
| Inline table  | `{ Path = "../Lib" }` | Local path relative to the manifest |

See [Dependencies](dependencies) for adding, installing, and updating packages.

## Full Example

```toml
[Package]
Name = "App"
Version = "0.1.0"
Description = "The best application ever"
Authors = ["Your Name <name@mail.com>"]

[Build]
Target = "x86_64"
OptLevel = "Release"
Output = "Bin"

[Dependencies]
Std = "0.3.0"
Json = "0.2.1"
```
