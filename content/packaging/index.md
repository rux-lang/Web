---
title: Packaging
description: How Rux packages are built, described, published, and consumed — package types, the Rux.toml manifest, dependencies, namespaces, API tokens, publishing to the registry, versioning, and yanking.
navigation:
  title: Overview
seo:
  title: Packaging
  description: How Rux packages are built, described, published, and consumed — package types, the Rux.toml manifest, dependencies, namespaces, API tokens, publishing to the registry, versioning, and yanking.
  ogType: website
  ogUrl: https://rux-lang.dev/packaging/
---

# Packaging

A **package** is the unit Rux builds, ships, and depends on. Every package is a directory with a
[`Rux.toml` manifest](/packaging/manifest) at its root and its sources under `Src/`. That is true whether
the package never leaves your machine or ends up on the public registry.

This section follows a package through its whole life: describing it, depending on other packages,
finding it, and publishing it for other people to use.

## Local packaging

Everything here works offline, with no account and no registry.

| Page                                    | Covers                                                     |
| --------------------------------------- | ---------------------------------------------------------- |
| [Package Types](/packaging/types)       | `Program`, `Library`, and `Source`, and what each produces |
| [Directory Layout](/packaging/layout)   | Where sources, build output, and metadata live             |
| [Package Manifest](/packaging/manifest) | Every field of `Rux.toml`, and the rules each one follows  |
| [Dependencies](/packaging/dependencies) | Declaring, resolving, and updating what your package needs |

## The registry

The public registry at [rux-lang.dev/packages](/packages) hosts published packages. Reading from it needs
no account; publishing to it does.

| Page                                | Covers                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| [The Registry](/packaging/registry) | Browsing, searching, and installing published packages        |
| [Namespaces](/packaging/namespaces) | Package identity, claiming a namespace, and sharing ownership |
| [API Tokens](/packaging/tokens)     | Credentials that let the CLI act on your behalf               |
| [Publishing](/packaging/publishing) | Preparing a package and uploading a release                   |
| [Versioning](/packaging/versioning) | Semantic Versioning, immutability, and version requirements   |
| [Yanking](/packaging/yanking)       | Withdrawing a release without breaking existing builds        |

## From a new package to a published one

The short version of the whole section:

```sh
rux new Widget --lib --namespace Acme   # Create it
rux add Io                              # Depend on something
rux check                               # Make sure it compiles
rux pack                                # Inspect the archive
rux publish --dry-run                   # Validate without uploading
rux publish                             # Release it
```

Each step has its own page here, and every command has a page in the
[CLI reference](/cli).

::note
Publishing has two requirements a local package does not: a [`Namespace`](/packaging/namespaces) and a
`MinRux` version. Both are described in the [manifest reference](/packaging/manifest).
::
