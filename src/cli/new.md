# `rux new`

Create a new Rux project in a new directory.

```bash
rux new <name> [--lib] [--bin] [--path <dir>] [--vcs <none|git>]
```

## Options

| Flag           | Description                           |
| -------------- | ------------------------------------- |
| `--lib`        | Create a library project              |
| `--bin`        | Create a binary application (default) |
| `--path <dir>` | Create in a specific directory        |
| `--vcs none`   | Disable VCS (no Git initialization)F  |

## Example

```bash
rux new Program --bin
```

Creates:

```
Program/
├── Bin/
│   ├── Debug/
│   └── Release/
├── Src/
│   └── Main.rux
├── Temp/
├── Rux.toml
└── .gitignore
```