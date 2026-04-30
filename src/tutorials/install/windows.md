# Installation on Windows

This guide explains how to install the Rux compiler on Windows using [Scoop](https://scoop.sh), a command-line package manager for Windows.

## Prerequisites

- Windows 10 or later (64-bit)
- PowerShell 5.1 or later

## Install Scoop

If you don't have Scoop installed yet, open **PowerShell** and run:

```sh
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

To verify Scoop is installed correctly:

```sh
scoop --version
```

## Add the Rux Bucket

Scoop uses buckets to organize packages. Add the official Rux bucket:

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
```

## Install the Rux Compiler

```sh
scoop install rux
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Updating

To update the Rux compiler to the latest version:

```sh
scoop update rux
```

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
