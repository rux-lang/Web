# Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com) is the recommended editor for Rux. The official [Rux Language](https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux) extension adds syntax highlighting for `.rux` source files.

## Installing the Extension

::: code-group

```sh [Quick Open]
# Press Ctrl+P in VS Code and paste:
ext install rux-lang.vscode-rux
```

```sh [Command Line]
code --install-extension rux-lang.vscode-rux
```

:::

Alternatively, open the **Extensions** panel (`Ctrl+Shift+X`), search for **Rux Language**, and click **Install**.

## Features

- Syntax highlighting for `.rux` source files
- Markdown code fence injection — Rux code blocks in `.md` files are highlighted automatically

## Creating a New Project

```sh
rux new MyApp
cd MyApp
code .
```
