# `rux list`

List packages.

```sh
rux list
rux list --global
```

Without flags, lists all dependencies defined in `Rux.toml`. With `--global`, lists all packages present in the cache.

## Options

| Option     | Description                    |
| ---------- | ------------------------------ |
| `--global` | List all packages in the cache |

## Examples

```sh
# List packages defined in Rux.toml
rux list

# List all packages in the cache
rux list --global
```
