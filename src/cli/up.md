# `rux up`

Handles Rux toolchain updates — compiler, standard library, and package registry.

```sh
rux up [option]
```

Checks for updates to the Rux compiler, package registry, and tools. By default, updates all installed toolchain components.

## Options

| Option   | Description          |
| -------- | -------------------- |
| `--self` | Update only compiler |

## Examples

```sh
rux up
# Checking for updates...
# Rux 0.1.2 available (current: 0.1.0)
# ...
```
