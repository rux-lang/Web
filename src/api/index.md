---
title: API Reference
description: Reference documentation for the Rux standard library and operating-system packages.
---

<script setup>
import ApiPackages from "../../.vitepress/theme/components/ApiPackages.vue";
</script>

# API Reference

<p class="api-lead">Explore the libraries that ship Rux programs from portable application code down to direct operating-system APIs.</p>

::: warning Evolving APIs
Rux and its packages are under active development. Public names, signatures,
and behavior may change between releases. Pin dependency versions for
reproducible builds.
:::

## Start with the standard library

<ApiPackages primary />

Use `Std` for application code unless you specifically need an operating-system
contract. It provides the most portable surface and hides platform calling
conventions.

## Operating-system bindings

These packages expose low-level, platform-specific APIs for **x86-64**. They
require explicit resource management, pointer validation, and manual error
handling.

<ApiPackages />

## Choose the right package

| You need                                          | Start here                 |
| ------------------------------------------------- | -------------------------- |
| Portable strings, collections, I/O, math, or time | [`Std`](/api/std/)         |
| Direct syscalls across the BSD family             | [`BSD`](/api/bsd/)         |
| Direct illumos syscalls                           | [`Illumos`](/api/illumos/) |
| Direct Linux syscalls                             | [`Linux`](/api/linux/)     |
| Low-level macOS compatibility bindings            | [`MacOS`](/api/macos/)     |
| Direct Win32 functions and types                  | [`Windows`](/api/windows/) |

## Add a package

Install a dependency with the CLI, then import only the symbols your program
uses:

```sh
rux add Std
rux install
```

```rux
import Std::Io::PrintLine;

func Main() -> int32 {
    PrintLine("Hello from Rux");
    return 0i32;
}
```

See [package dependencies](/docs/packages/dependencies) for manifest syntax,
version constraints, and local path dependencies.
