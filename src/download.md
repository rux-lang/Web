---
title: Download Rux
description: Download the Rux compiler for Windows, macOS, Linux, BSD, and illumos, or build it from source. Every platform targets x86-64.
sidebar: false
prev: false
next: false
---

<script setup>
import DownloadCards from "../.vitepress/theme/components/DownloadCards.vue";
</script>

# Download Rux

<p class="status-lead">
Get the Rux compiler for your operating system. Windows ships prebuilt
binaries; other platforms install through their native package manager or
build from source. Every platform targets x86-64.
</p>

<DownloadCards />

## Build From Source

No prebuilt package for your platform? The Rux toolchain builds anywhere a
supported C++ compiler and CMake are available. See
[Build From Source](/start/build) for the full instructions, or browse the
per-platform [install guides](/start/) for package-manager options.

::: info Targets are x86-64
Every platform currently targets x86-64. Native ARM64 output is not yet
supported — the macOS host builds the compiler natively on arm64 but runs the
x86-64 programs it generates through Rosetta 2.
:::
