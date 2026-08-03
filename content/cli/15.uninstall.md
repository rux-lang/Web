# `rux uninstall`

Remove packages from the cache.

```sh
rux uninstall
rux uninstall [package]
```

Without arguments, removes all packages listed in `Rux.toml` from the cache. With a package name, removes only that specific package.

Packages are stored locally at:

- **Windows** — `%LOCALAPPDATA%\Rux\Packages`
- **Linux / macOS** — `~/.rux/packages`

## Examples

```sh
# Uninstall all packages listed in Rux.toml
rux uninstall

# Uninstall a specific package
rux uninstall Json
```
