# `rux run`

Build and execute a runnable target.

```sh
rux run [option] [-- args...]
```

`args` are forwarded to the executable as command line arguments.

## Options

| Option      | Description                |
| ----------- | -------------------------- |
| `--release` | Build with release profile |

## Examples

```sh
rux run -- --port 8080
```
