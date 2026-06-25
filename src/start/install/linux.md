# Install on Linux

This guide explains how to install the Rux compiler on Linux — using the
universal install script, your distribution's package manager, or the prebuilt
release tarball.

## Prerequisites

- A 64-bit (x86-64) Linux distribution
- `curl` or `wget` to download the release
- `tar` to extract the archive (for the manual install)

## Quick Install (Script)

The fastest way to install on **any** distribution is the per-user install
script. It downloads the latest release, installs the `rux` binary into
`~/.local/bin` (no root required), and adds that directory to your `PATH`:

```sh
curl -fsSL https://rux-lang.dev/install.sh | sh
```

The script accepts a few options — for example, install a specific version or a
custom directory:

```sh
curl -fsSL https://rux-lang.dev/install.sh | sh -s -- --version 0.3.0 --dir /usr/local/bin
```

Run it with `--help` to see all options.

## Manual Install

On Ubuntu, Debian, or any other distribution without a dedicated package, use
the prebuilt tarball.

Download the latest Linux tarball:

```sh
curl -LO https://github.com/rux-lang/Rux/releases/latest/download/rux-linux.tar.gz
```

Extract the archive:

```sh
tar -xzf rux-linux.tar.gz
```

Move the extracted `rux` binary somewhere on your `PATH`:

```sh
sudo mv rux /usr/local/bin/rux
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
