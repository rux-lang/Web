# `rux fmt`

Format all `*.rux` source files.

```sh
rux fmt [--check] [--manifest]
```

## Options

| Option       | Description                              |
| ------------ | ---------------------------------------- |
| `--check`    | Check formatting without modifying files |
| `--manifest` | Format only the manifest (`Rux.toml`)    |

## Examples

```sh
rux fmt
rux fmt --check
rux fmt --manifest
```
