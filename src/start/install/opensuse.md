# Install on openSUSE

This guide explains how to install the Rux compiler on openSUSE using [Copr](https://copr.fedorainfracloud.org/), a package build service provided by Fedora.

## Supported Distros

- openSUSE Tumbleweed

## Add Repository to Zypper

```sh
sudo zypper addrepo https://copr.fedorainfracloud.org/coprs/zapaxe/Rux-Lang/repo/opensuse-tumbleweed/zapaxe-Rux-Lang-opensuse-tumbleweed.repo
sudo zypper ref
```

## Install the Rux Compiler

```sh
sudo zypper install rux
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
