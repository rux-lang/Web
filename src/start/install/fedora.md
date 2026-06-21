# Install on Fedora

This guide explains how to install the Rux compiler on Fedora-based distributions using [Copr](https://copr.fedorainfracloud.org/), a package build service provided by Fedora.

## Supported Distros

- Alma Linux 10
- Fedora 42
- Fedora 43
- Fedora 44
- CentOS 10

## Enable the Copr Repository

```sh
sudo dnf copr enable zapaxe/Rux-Lang
```

## Install the Rux Compiler

```sh
sudo dnf install rux
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
