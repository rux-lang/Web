---
title: CLI Reference
description: Reference for the rux command line interface — the primary tool for Rux projects, integrating the compiler, package manager, formatter, dependency resolver, and build system.
navigation:
  title: Overview
seo:
  title: CLI Reference
  description: Reference for the rux command line interface — the primary tool for Rux projects, integrating the compiler, package manager, formatter, dependency resolver, and build system.
  ogImage: https://rux-lang.dev/images/og-cli.png
  ogType: website
  ogUrl: https://rux-lang.dev/docs/cli
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

| Command                                | Description                                       |
| -------------------------------------- | ------------------------------------------------- |
| [`rux add`](/docs/cli/add)             | Add a dependency to the manifest                  |
| [`rux build`](/docs/cli/build)         | Build the current package                         |
| [`rux check`](/docs/cli/check)         | Analyze the sources without building              |
| [`rux clean`](/docs/cli/clean)         | Remove build artifacts                            |
| [`rux doc`](/docs/cli/doc)             | Generate package documentation                    |
| [`rux fmt`](/docs/cli/fmt)             | Format source files and manifests                 |
| [`rux help`](/docs/cli/help)           | Show help information                             |
| [`rux info`](/docs/cli/info)           | Show package metadata                             |
| [`rux init`](/docs/cli/init)           | Initialize a Rux package in the current directory |
| [`rux install`](/docs/cli/install)     | Install packages into the cache                   |
| [`rux lint`](/docs/cli/lint)           | Run source-level diagnostics                      |
| [`rux list`](/docs/cli/list)           | List packages                                     |
| [`rux login`](/docs/cli/login)         | Store a registry token for publishing             |
| [`rux logout`](/docs/cli/logout)       | Remove a stored registry token                    |
| [`rux new`](/docs/cli/new)             | Create a new Rux package                          |
| [`rux pack`](/docs/cli/pack)           | Build the publishable package archive             |
| [`rux publish`](/docs/cli/publish)     | Publish the package to the registry               |
| [`rux remove`](/docs/cli/remove)       | Remove a dependency from the manifest             |
| [`rux run`](/docs/cli/run)             | Build and run the main executable                 |
| [`rux test`](/docs/cli/test)           | Run all test targets                              |
| [`rux uninstall`](/docs/cli/uninstall) | Remove packages from the cache                    |
| [`rux update`](/docs/cli/update)       | Update packages                                   |
| [`rux version`](/docs/cli/version)     | Show version information                          |

## Global options

| Option                                                                        | Description              |
| ----------------------------------------------------------------------------- | ------------------------ |
| [`--color`](/docs/cli/global#color-autoonoff)                                 | Control colored output   |
| [`-h`](/docs/cli/global#h-help), [`--help`](/docs/cli/global#h-help)          | Show help information    |
| [`-q`](/docs/cli/global#q-quiet), [`--quiet`](/docs/cli/global#q-quiet)       | Do not show log messages |
| [`-v`](/docs/cli/global#v-verbose), [`--verbose`](/docs/cli/global#v-verbose) | Use verbose output       |
| [`-V`](/docs/cli/global#v-version), [`--version`](/docs/cli/global#v-version) | Show version information |

## Example Workflow

```sh
rux new App --bin
cd App
rux add Rux/Json@0.1.3
rux install
rux build
rux run
rux fmt
rux test
rux clean
```

Publishing follows on from there — see [Packaging](/docs/packaging) for the whole subject:

```sh
rux login
rux check
rux pack
rux publish --dry-run
rux publish
```

## Planned Extensions

| Command     | Purpose                      |
| ----------- | ---------------------------- |
| `rux bench` | Run benchmarks               |
| `rux deps`  | Inspect dependency graph     |
| `rux repl`  | Interactive Rux shell        |
| `rux yank`  | Withdraw a published version |
