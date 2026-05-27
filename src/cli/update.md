# `rux update`

Update packages.

```sh
rux update
rux update --global
```

Without flags, checks all registry dependencies listed in `Rux.toml` and pulls the latest changes for each one. With `--global`, updates all packages in the cache.

Missing packages are cloned from the registry. Transitive dependencies are resolved and updated automatically.

Packages are stored locally at:

- **Windows** — `%LOCALAPPDATA%\Rux\Packages`
- **Linux / macOS** — `~/.rux/packages`

## Options

| Option     | Description                      |
| ---------- | -------------------------------- |
| `--global` | Update all packages in the cache |

## Examples

```sh
# Update packages listed in Rux.toml
rux update

# Update all packages in the cache
rux update --global
```
