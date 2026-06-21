# Install on Arch Linux

This guide explains how to install the Rux compiler on Arch-based distributions using the [AUR](https://aur.archlinux.org/), a community-driven software repository for Arch.

## Supported Distros

- All Arch-based distributions

## Install yay

Install base development tools and Git

```sh
sudo pacman -S --needed base-devel git
```

Clone the yay repository

```sh
git clone https://aur.archlinux.org/yay.git
```

Build and install yay

```sh
cd yay
makepkg -si
```

## Install the Rux Compiler

```sh
sudo yay -S rux-git
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
