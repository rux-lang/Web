# Build From Source

This guide explains how to build the Rux compiler from source with [CMake](https://cmake.org), [Ninja](https://ninja-build.org), and [Clang](https://clang.llvm.org). It works on every platform Rux supports, including platforms without a prebuilt package.

## Supported Platforms

- BSD
- Illumos
- Linux
- macOS
- Windows

## Requirements

Rux is built with Clang C++ compiler. We recommend the latest stable release of each tool:

- [Clang 22.1](https://clang.llvm.org) or later
- [CMake 4.3](https://cmake.org) or later
- [Ninja 1.13](https://ninja-build.org) or later
- [Git 2.54](https://git-scm.com) or later

## Install the Build Tools

Install Clang, CMake, Ninja, and Git for your platform:

::: code-group

```sh [Arch]
sudo pacman -S clang cmake ninja git
```

```sh [BSD]
pkg install llvm cmake ninja git
```

```sh [Debian]
sudo apt install clang cmake ninja-build git
```

```sh [Fedora]
sudo dnf install clang cmake ninja-build git
```

```sh [macOS]
brew install llvm cmake ninja git
```

```sh [Ubuntu]
sudo apt install clang cmake ninja-build git
```

```sh [Windows]
scoop install llvm cmake ninja git
```

:::

::: tip
On macOS, the system `clang` is Apple Clang. To build with Homebrew's LLVM instead, prepend it to your `PATH` — `export PATH="$(brew --prefix llvm)/bin:$PATH"` — before configuring.
:::

## Clone the Repository

The Rux compiler has two branches:

- **main** — the most stable release of the compiler
- **dev** — the latest community updates; may be unstable

::: code-group

```sh [main]
git clone https://github.com/rux-lang/rux
cd rux
```

```sh [dev]
git clone -b dev https://github.com/rux-lang/rux rux-dev
cd rux-dev
```

:::

## Configure and Build

Configure the project with the Ninja generator and Clang, then build:

```sh
cmake -G Ninja -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -B build
cmake --build build
```

The compiled `rux` binary is written to the `build` directory.

## Add the Binary to Your PATH

::: code-group

```sh [BSD / Illumos / macOS / Linux]
cp build/rux ~/.local/bin/
```

```sh [Windows]
# Open Environment Variables and add the build directory to your global Path,
# or copy rux.exe into a directory that is already on your PATH.
```

:::

On Unix-like systems, make sure `~/.local/bin` is on your `PATH`, adding it in your shell's profile if needed.

## Verify the Installation

```sh
rux version
```

You should see the installed Rux compiler version.

## Releases

All Rux releases are available on [GitHub](https://github.com/rux-lang/Rux/releases).
