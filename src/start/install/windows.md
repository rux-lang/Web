# Install on Windows

This guide explains how to install the Rux compiler on Windows, either with the MSI installer or using [Scoop](https://scoop.sh), a command-line package manager for Windows.

## Prerequisites

- Windows 11
- Windows Server 2025

## Install with the MSI Installer

The MSI installer is the simplest option if you prefer a graphical installer.

1. Download `rux-windows.msi` from the [Download](/download) page or the [latest release](https://github.com/rux-lang/Rux/releases/latest).
2. Double-click the downloaded `.msi` file to launch the installer.
3. Follow the setup wizard to complete the installation.

The installer places the `rux` executable on your system `PATH`, so you can run it from any new terminal window once setup finishes.

::: tip
You can also install silently from a terminal — useful for scripted or unattended setups:

```sh
msiexec /i rux-windows.msi /quiet
```
:::

To update later, download the newer `.msi` and run it again; to remove Rux, uninstall it from **Settings → Apps → Installed apps**.

## Install with Scoop

### Add the Rux Bucket

Scoop uses buckets to organize packages. Add the official Rux bucket:

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
```

### Install the Rux Compiler

```sh
scoop install rux
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Updating with Scoop

To update a Scoop installation to the latest version:

```sh
scoop update rux
```

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
