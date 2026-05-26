# `rux update`

Updates all registry dependencies listed in `Rux.toml`.

```sh
rux update
```

Checks all registry dependencies listed in `Rux.toml` and pulls the latest changes for each one. Missing packages are cloned from the registry. Transitive dependencies are resolved and updated automatically.

Packages are stored locally at:

- **Windows** — `%LOCALAPPDATA%\Rux\Packages`
- **Linux / macOS** — `~/.rux/packages`

## Examples

```sh
rux update
# Updated 2 packages, installed 1 new package.
```
