---
title: Download
description: Download the Rux compiler for FreeBSD, Linux, macOS, and Windows on x86-64 and AArch64.
---

# Download Rux

<p class="status-lead">
Get the latest Rux compiler for your platform. Prebuilt, tested binaries ship
for FreeBSD, Linux, macOS, and Windows — each on both x86-64 and AArch64.
Download an archive, unpack it, and put <code>rux</code> on your <code>PATH</code>.
</p>

::tip
**Verify your download**\
Every release includes a
[`SHA256SUMS`](https://github.com/rux-lang/Rux/releases/latest/download/SHA256SUMS)
file listing the checksum of each binary. Compare it against your download to
confirm the file arrived intact before running it.
::

## FreeBSD

Built and tested on FreeBSD 14.4. Unpack with `tar -xzf`, then move `rux` onto
your `PATH`.

::u-page-grid
:link-card{name="x86-64" handle="rux-freebsd-x86_64.tar.gz" description="64-bit Intel and AMD, the amd64 architecture." icon="i-simple-icons-freebsd" color="text-red-600" note="tar.gz archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-freebsd-x86_64.tar.gz"}
:link-card{name="AArch64" handle="rux-freebsd-aarch64.tar.gz" description="64-bit Arm, the arm64 architecture." icon="i-simple-icons-freebsd" color="text-red-600" note="tar.gz archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-freebsd-aarch64.tar.gz"}
::

## Linux

Built on Ubuntu 24.04 and linked against the system C library, so any
distribution of that vintage or newer will run it.

::u-page-grid
:link-card{name="x86-64" handle="rux-linux-x86_64.tar.gz" description="64-bit Intel and AMD, the x86_64 architecture." icon="i-simple-icons-linux" color="text-highlighted" note="tar.gz archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-linux-x86_64.tar.gz"}
:link-card{name="AArch64" handle="rux-linux-aarch64.tar.gz" description="64-bit Arm, from a Raspberry Pi 5 to a Graviton instance." icon="i-simple-icons-linux" color="text-highlighted" note="tar.gz archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-linux-aarch64.tar.gz"}
::

## macOS

Built on macOS 26. The binaries are unsigned, so the first run needs a trip
through **System Settings → Privacy & Security**.

::u-page-grid
:link-card{name="x86-64" handle="rux-macos-x86_64.tar.gz" description="Intel Macs." icon="i-simple-icons-apple" color="text-highlighted" note="tar.gz archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-macos-x86_64.tar.gz"}
:link-card{name="AArch64" handle="rux-macos-aarch64.tar.gz" description="Apple silicon — every M-series Mac." icon="i-simple-icons-apple" color="text-highlighted" note="tar.gz archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-macos-aarch64.tar.gz"}
::

## Windows

Built with MSVC on Windows Server 2025 and Windows 11 on Arm. The installer
puts `rux` on your `PATH` for you; the archives do not.

::u-page-grid
:link-card{name="x86-64" handle="rux-windows-x86_64.zip" description="64-bit Intel and AMD, the x64 architecture." icon="i-simple-icons-windows" color="text-sky-500" note="zip archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-windows-x86_64.zip"}
:link-card{name="AArch64" handle="rux-windows-aarch64.zip" description="Windows on Arm, including Copilot+ PCs." icon="i-simple-icons-windows" color="text-sky-500" note="zip archive" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-windows-aarch64.zip"}
:link-card{name="Installer" handle="rux-windows-x86_64.msi" description="Same x86-64 build, wrapped in an MSI that sets up PATH." icon="i-lucide-package" color="text-sky-500" note="MSI installer" to="https://github.com/rux-lang/Rux/releases/latest/download/rux-windows-x86_64.msi"}
::

## Every Release

Each download above resolves to the newest release. Older versions, release
notes, and the full asset list live on GitHub.

::u-page-grid
:link-card{name="All releases" handle="rux-lang/Rux/releases" description="Every tagged version with its notes and assets." icon="i-simple-icons-github" color="text-highlighted" note="GitHub" to="https://github.com/rux-lang/Rux/releases"}
:link-card{name="Checksums" handle="SHA256SUMS" description="One SHA-256 per asset in the latest release." icon="i-lucide-shield-check" color="text-emerald-500" note="Latest release" to="https://github.com/rux-lang/Rux/releases/latest/download/SHA256SUMS"}
::

Prefer a package manager, or want the finer details for your platform? The
per-platform [install guides](/start) cover every supported install method
step by step.
