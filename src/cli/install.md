# `rux install`

Download and install packages into the cache.

```sh
rux install
rux install [package]
rux install [package]@[version]
```

Without arguments, installs all dependencies listed in `Rux.toml`. With a package name, installs only that specific package and its transitive dependencies.

Packages are stored locally at:

- **Windows** — `%LOCALAPPDATA%\Rux\Packages`
- **Linux / macOS** — `~/.rux/packages`

## Examples

```sh
# Install all packages listed in Rux.toml
rux install

# Install a specific package
rux install Json

# Install a specific version
rux install Math@0.3.1
```
