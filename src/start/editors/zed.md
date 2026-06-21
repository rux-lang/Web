# Zed Editor

[Zed](https://zed.dev) is a fast, multiplayer code editor for macOS and Linux. The official [Rux extension](https://github.com/rux-lang/Zed) adds syntax highlighting for `.rux` source files.

## Installing the Extension

Open the extensions view from the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Linux) and run **zed: extensions**, then search for **Rux** and click **Install**.

### Install from source

If the extension is not yet available in the registry, you can install it directly from its [GitHub repository](https://github.com/rux-lang/Zed) as a dev extension.

1. Clone the repository:

   ```sh
   git clone https://github.com/rux-lang/Zed.git rux-zed
   ```

2. Open the extensions view (`zed: extensions`) and click **Install Dev Extension**.
3. Select the cloned `rux-zed` folder.

Zed compiles the extension and loads it immediately. It reloads automatically whenever you change the source, which is handy while the extension is still evolving.

## Features

- Syntax highlighting for `.rux` source files

## Creating a New Project

```sh
rux new MyApp
cd MyApp
```

Then open the `MyApp` folder in Zed via **File → Open…**, or from the terminal:

```sh
zed MyApp
```
