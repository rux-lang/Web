---
title: API Reference
description: Reference documentation for the Rux standard packages — the foundation, text, collection, system and data-format packages, cryptography, and the platform bindings for C, Linux, FreeBSD, macOS and Windows.
navigation:
  title: Table of Contents
seo:
  title: API Reference
  description: Reference documentation for the Rux standard packages — the foundation, text, collection, system and data-format packages, cryptography, and the platform bindings for C, Linux, FreeBSD, macOS and Windows.
  ogImage: https://rux-lang.dev/images/og-api.png
  ogType: website
  ogUrl: https://rux-lang.dev/docs/api
---

# API Reference

This reference documents the packages that ship with Rux: every public type, interface, function and constant, what it does and where it lives in the source. It is for looking things up rather than learning — if you are new to the language, start with [Learn Rux](/docs/learn) or the [Rux Language Reference](/docs/lang).

Rux has no monolithic runtime. Each package below is a dependency a project declares in its [manifest](/docs/packaging/manifest), and a program depends only on what it asks for.

::warning
**Unstable API**\
None of these packages has a stable API yet. Names, signatures and behaviour may change between releases, and this reference changes with them.
::

:api-packages

## Reading this reference

Each package has an overview page listing everything it exports, and each type, interface or function has a page of its own. A type's members — constructors, methods, operators and constants — are sections of that page, so every one has a link of its own, such as `/docs/api/allocator/arena#reset`.

- **Header** — the declaration's kind, the package version it describes, and a **Source** button that opens the declaration on GitHub.
- **Sidebar** — inside a package, the sidebar lists that package only, grouped into interfaces, types, functions and constants. The menu above it switches to another package.
- **Platform badges** — Linux, FreeBSD, macOS and Windows each bind one operating system's own entry points, with no portability layer, and build only for that platform. Guard every call to them with [conditional compilation](/docs/lang/comptime/conditional).
