# Global Options

These options can be used before or after the command name.

```sh
rux -q build
rux build -q
rux --verbose build
rux build --verbose

```

## `--color <auto|on|off>` {#color}

Control whether CLI output uses ANSI colors.

```sh
rux --color auto build
rux --color on test
rux --color off help
```

| Value  | Description                                              |
| ------ | -------------------------------------------------------- |
| `auto` | Enable colors only when output is attached to a terminal |
| `on`   | Always enable colored output                             |
| `off`  | Disable colored output                                   |

Use this option when you need predictable output in terminals, logs, or CI environments.

## `-h`, `--help` {#help}

Show help information and exit.

```sh
rux -h
rux --help
rux help
```

Use `rux help <command>` to show help for a specific command.

## `-q`, `--quiet` {#quiet}

Suppress non-essential log output.

```sh
rux -q build
rux --quiet test
```

Use this option to reduce noise and keep the output focused on warnings, errors, and final results.

## `-v`, `--verbose` {#verbose}

Enable verbose logging.

```sh
rux -v build
rux --verbose run
```

Use this option to display additional diagnostics, progress details, and troubleshooting information.

## `-V`, `--version` {#version}

Show version information and exit.

```sh
rux -V
rux --version
rux version
```

This option is the same as using command `rux version`.
