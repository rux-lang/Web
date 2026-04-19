# `rux init`

Initialize a new package in the current directory (useful for existing code).

```sh
rux init [option]
```

If file `Rux.toml` does not exist, it will be created.

## Options

| Option  | Description              |
| ------- | ------------------------ |
| `--bin` | Create a binary package  |
| `--lib` | Create a library package |

## Examples

```sh
rux init --bin
```
