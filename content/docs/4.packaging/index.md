---
title: Packaging
description: How Rux packages are built, described, published, and consumed — package types, the Rux.toml manifest, dependencies, namespaces, API tokens, publishing to the registry, versioning, and yanking.
navigation:
  title: Overview
seo:
  title: Packaging
  description: How Rux packages are built, described, published, and consumed — package types, the Rux.toml manifest, dependencies, namespaces, API tokens, publishing to the registry, versioning, and yanking.
  ogType: website
  ogUrl: https://rux-lang.dev/docs/packaging
---

# Packaging

A **package** is the unit Rux builds, ships, and depends on. Every package is a directory with a
[`Rux.toml` manifest](/docs/packaging/manifest) at its root and its sources under `Src/`. That is true whether
the package never leaves your machine or ends up on the public registry.

This section follows a package through its whole life: describing it, depending on other packages,
finding it, and publishing it for other people to use.

## Local packaging

Everything here works offline, with no account and no registry.

| Page                                         | Covers                                                     |
| -------------------------------------------- | ---------------------------------------------------------- |
| [Package Types](/docs/packaging/types)       | Executable, shared, static, and source libraries           |
| [Directory Layout](/docs/packaging/layout)   | Where sources, build output, and metadata live             |
| [Package Manifest](/docs/packaging/manifest) | Every field of `Rux.toml`, and the rules each one follows  |
| [Dependencies](/docs/packaging/dependencies) | Declaring, resolving, and updating what your package needs |

## The registry

The public registry at [rux-lang.dev/packages](/packages) hosts published packages. Reading from it needs
no account; publishing to it does.

| Page                                     | Covers                                                        |
| ---------------------------------------- | ------------------------------------------------------------- |
| [The Registry](/docs/packaging/registry) | Browsing, searching, and installing published packages        |
| [Namespaces](/docs/packaging/namespaces) | Package identity, claiming a namespace, and sharing ownership |
| [API Tokens](/docs/packaging/tokens)     | Credentials that let the CLI act on your behalf               |
| [Publishing](/docs/packaging/publishing) | Preparing a package and uploading a release                   |
| [Versioning](/docs/packaging/versioning) | Semantic Versioning, immutability, and version requirements   |
| [Yanking](/docs/packaging/yanking)       | Withdrawing a release without breaking existing builds        |

## From a new package to a published one

The short version of the whole section:

```sh
rux new Widget --source --namespace Acme # Create a publishable package
rux add Io                              # Depend on something
rux check                               # Make sure it compiles
rux pack                                # Inspect the archive
rux publish --dry-run                   # Validate without uploading
rux publish                             # Release it
```

Each step has its own page here, and every command has a page in the
[CLI reference](/docs/cli).

::note
Publishing has two requirements a local package does not: a [`Namespace`](/docs/packaging/namespaces) and a
`MinRux` version. Both are described in the [manifest reference](/docs/packaging/manifest).
::
