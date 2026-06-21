---
title: Download Rux
description: Download the Rux compiler for Windows, macOS, and Linux, or build it from source — with live build health for every supported platform.
sidebar: false
prev: false
next: false
---

<script setup>
import DownloadCards from "../.vitepress/theme/components/DownloadCards.vue";
import StatusMatrix from "../.vitepress/theme/components/StatusMatrix.vue";
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

## Build Health

<p class="status-lead">
Live health for the Rux compiler on every supported operating system. Each
workflow builds the compiler from source, runs the project test suite with that
compiler, then deploys the release artifacts. Results are reported from the <code>main</code> branch.
</p>

<StatusMatrix />

### What The Checks Mean

<div class="status-explainer">
  <div>
    <span>01</span>
    <h3>Build</h3>
    <p>CMake 4.2+ configures and compiles the C++26 Rux toolchain Clang 19+ on the target operating system.</p>
  </div>
  <div>
    <span>02</span>
    <h3>Test</h3>
    <p>The newly built compiler compiles and runs Rux packages, and the generated executables are verified.</p>
  </div>
  <div>
    <span>03</span>
    <h3>Deploy</h3>
    <p>On success the release artifacts for the platform are published, so each card reflects the latest build, test, and deploy outcome.</p>
  </div>
</div>

::: info Targets are x86-64
Every platform currently targets x86-64. Native ARM64 output is not yet
supported — the macOS host builds the compiler natively on arm64 but runs the
x86-64 programs it generates through Rosetta 2.
:::
