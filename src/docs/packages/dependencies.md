# Dependencies

Dependencies are other packages your project builds against. They are declared in the [`[Dependencies]`](manifest#dependencies) table of `Rux.toml` and managed with the `rux` command-line tool.

## Adding and removing

Add a dependency to `Rux.toml`:

```sh
# Latest version
rux add Json

# Specific version
rux add Math@0.1.0
```

Remove a dependency:

```sh
rux remove Json
```

## Installing and updating

Download all dependencies listed in `Rux.toml`:

```sh
rux install
```

Update dependencies to the latest compatible versions:

```sh
# Update packages listed in Rux.toml
rux update

# Update all packages in the local store
rux update --global
```

## Registry

Registry dependencies are resolved through the official Rux registry at [`rux-lang.dev/packages`](https://rux-lang.dev/packages), where you can browse and search every published package. The registry is also available programmatically through the Web API at [`api.rux-lang.dev/packages`](https://api.rux-lang.dev/packages).

When resolving a dependency, `rux` looks the package up in the registry and downloads it from its source into the local package store.

## Package storage

Downloaded packages are kept in a shared, per-user store that is separate from individual projects:

| Platform        | Location                    |
| --------------- | --------------------------- |
| Windows         | `%LOCALAPPDATA%\Rux\Packages` |
| Linux / macOS   | `~/.rux/packages`           |

Each package occupies its own subdirectory named after the package, for example `Std` or `Windows`. This store is managed by `rux install` and `rux update` and should not be edited manually.
