# `rux build`

Build the current package. This command reads `Rux.toml`, resolve packages, compile targets, emits binaries and libraries.

```sh
rux build [options]
```

## Options

| Options             | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `--debug`           | Build with debug symbols (unoptimized output)               |
| `--profile <name>`  | Build using a custom profile defined in `Rux.toml`          |
| `--release`         | Build with release profile (optimized, no debug info)       |
| `--target <triple>` | Build for the specified target platform (e.g. `x86`, `x64`) |
| `-q`, `--quiet`     | Suppress non-essential output (only errors are shown)       |
| `-v`, `--verbose`   | Enable verbose output for detailed build information        |

Artifacts are stored in `Bin/Debug/` or `Bin/Release/`.

## Examples

```sh
rux build
rux build --debug
rux build --release
rux build --verbose --release
```
