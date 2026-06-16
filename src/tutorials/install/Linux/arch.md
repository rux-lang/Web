# Installation on Arch Based Distros

This guide explains how to install the Rux compiler on Arch Based Distros using the [AUR](https://aur.archlinux.org/), a community driven software repository for Arch based distros.

## Supported Distros

- All Arch Based Distros

## Installation steps

*Skip this step and use `yay -S rux-git` or `paru -S rux-git` if you have [`yay`](https://github.com/jguer/yay)/[`paru`](https://github.com/Morganamilo/paru) already installed.*

To compile and install Rux, you will use `makepkg` and `git` to build the package from source.

Install base development tools and Git
```sh
sudo pacman -S --needed base-devel git
```

Clone the AUR repository
```sh
git clone https://aur.archlinux.org/rux-git.git
```

Build and install the Rux CLI tool
```sh
cd rux-git
makepkg -si
```

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
