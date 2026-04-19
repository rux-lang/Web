# `rux new`

Create a new Rux package in a new directory.

```sh
rux new [name] [options]
```

## Options

| Optin          | Description                           |
| -------------- | ------------------------------------- |
| `--bin`        | Create a binary application (default) |
| `--lib`        | Create a library project              |
| `--path <dir>` | Create in a specific directory        |

## Example

```sh
rux new Program
rux new Program --bin
```

Creates such folders and files:

```
Program/
├── Bin/
│   ├── Debug/
│   └── Release/
├── Source/
│   └── Main.rux
├── Temp/
├── Rux.toml
└── .gitignore
```
