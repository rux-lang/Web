---
sidebar: false
prev: false
next: false
---

# Rux Package Manager

The Rux package manager is built into the `rux` CLI. It handles adding dependencies to your project, downloading them from the registry, and making them available at build time.

## Registry

The official Rux package registry is hosted on GitHub:

**[github.com/rux-lang/Registry](https://github.com/rux-lang/Registry)**

The registry is a single `Packages.json` file that maps package names to their source repositories. When you run `rux install`, the CLI fetches this file and clones the required packages to your local machine.

## Available Packages

The following packages are currently under development:

| Package | Repository | Description |
| ------- | ---------- | ----------- |
| `Std` | [github.com/rux-lang/Std](https://github.com/rux-lang/Std) | Rux standard library |
| `Windows` | [github.com/rux-lang/Windows](https://github.com/rux-lang/Windows) | Windows API bindings |

## Using Packages

### Adding a dependency

`rux add` records a dependency in `Rux.toml` without downloading anything:

```sh
# Add the latest version
rux add Std

# Add a specific version
rux add Std@1.0.0
```

After running `rux add`, your `Rux.toml` will contain an entry like:

```toml
[Dependencies]
Std = "1.0.0"
```

### Installing dependencies

`rux install` downloads all registry dependencies listed in `Rux.toml`:

```sh
rux install
```

The command fetches the registry index, resolves each package to its source repository, and clones it to the local package store. Packages already present are left untouched.

### Full example

```sh
# Create a new project
rux new App

# Add the standard library
rux add Std

# Download it
rux install

# Build
rux build
```

## Package Storage

Downloaded packages are stored in a shared local directory, separate from your project:

| Platform | Path |
| -------- | ---- |
| Windows | `%LOCALAPPDATA%\Rux\Packages\` |
| Linux / macOS | `~/.rux/packages/` |

Each package occupies its own subdirectory named after the package (e.g., `Std\`, `Windows\`). These directories are managed by `rux install` and should not be edited manually.
