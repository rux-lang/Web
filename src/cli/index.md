---
title: CLI Reference
description: Reference for the rux command line interface — the primary tool for Rux projects, integrating the compiler, package manager, formatter, dependency resolver, and build system.
head:
  - - meta
    - itemprop: name
      content: Rux CLI Reference
  - - meta
    - itemprop: description
      content: Reference for the rux command line interface — the primary tool for Rux projects, integrating the compiler, package manager, formatter, dependency resolver, and build system.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/og-cli.jpg
  - - meta
    - property: og:url
      content: https://rux-lang.dev/cli/
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Rux CLI Reference
  - - meta
    - property: og:description
      content: Reference for the rux command line interface — the primary tool for Rux projects, integrating the compiler, package manager, formatter, dependency resolver, and build system.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/og-cli.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux CLI Reference
  - - meta
    - name: twitter:description
      content: Reference for the rux command line interface — the primary tool for Rux projects, integrating the compiler, package manager, formatter, dependency resolver, and build system.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/og-cli.jpg
---

# CLI Reference

The reference describes the command line interface (CLI) of `rux` that is the **primary tool** for interacting with Rux projects. It integrates all necessary components:

- Compiler
- Package manager
- Code formatter
- Dependency resolver
- Build system

All developer workflows from package creation to publishing are handled via `rux`.

## Command Syntax

```sh
rux [command] [options] [-- args...]
```

Example:

```sh
rux version
rux help
rux help new
rux new App --bin
rux build --release
rux run
rux run -- arg1 arg2 ...
rux fmt
```

## Command Summary

| Command                           | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| [`rux add`](/cli/add)             | Add a dependency to the manifest                  |
| [`rux build`](/cli/build)         | Build the current package                         |
| [`rux clean`](/cli/clean)         | Remove build artifacts                            |
| [`rux doc`](/cli/doc)             | Generate package documentation                    |
| [`rux fmt`](/cli/fmt)             | Format source files and manifests                 |
| [`rux help`](/cli/help)           | Show help information                             |
| [`rux init`](/cli/init)           | Initialize a Rux package in the current directory |
| [`rux install`](/cli/install)     | Install packages into the cache                   |
| [`rux list`](/cli/list)           | List packages                                     |
| [`rux new`](/cli/new)             | Create a new Rux package                          |
| [`rux remove`](/cli/remove)       | Remove a dependency from the manifest             |
| [`rux run`](/cli/run)             | Build and run the main executable                 |
| [`rux test`](/cli/test)           | Run all test targets                              |
| [`rux uninstall`](/cli/uninstall) | Remove packages from the cache                    |
| [`rux update`](/cli/update)       | Update packages                                   |
| [`rux version`](/cli/version)     | Show version information                          |

## Global options

| Option                                                          | Description              |
| --------------------------------------------------------------- | ------------------------ |
| [`--color`](/cli/global#color)                                  | Control colored output   |
| [`-h`](/cli/global#help), [`--help`](/cli/global#help)          | Show help information    |
| [`-q`](/cli/global#quiet), [`--quiet`](/cli/global#quiet)       | Do not show log messages |
| [`-v`](/cli/global#verbose), [`--verbose`](/cli/global#verbose) | Use verbose output       |
| [`-V`](/cli/global#version), [`--version`](/cli/global#version) | Show version information |

## Example Workflow

```sh
rux new App --bin
cd App
rux add Json@0.1.3
rux install
rux build
rux run
rux fmt
rux test
rux clean
```

## Planned Extensions

| Command       | Purpose                             |
| ------------- | ----------------------------------- |
| `rux bench`   | Run benchmarks                      |
| `rux deps`    | Inspect dependency graph            |
| `rux login`   | Authenticate with registry          |
| `rux lint`    | Run static analysis                 |
| `rux publish` | Publish package to the Rux registry |
| `rux repl`    | Interactive Rux shell               |
