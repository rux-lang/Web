# Examples

The fastest way to learn Rux is to write a little of it. This page walks you through your first program, then points you to a growing collection of worked examples you can clone and run.

## Your first program

Let's build a console application that prints `Hello, World!`.

### 1. Create the project

Scaffold a new project with the Rux toolchain and open it in your editor:

```sh
rux new Hello
cd Hello
code .
```

### 2. Write the code

Replace the contents of `Src/Main.rux` with:

```rux
import Io::Print;

func Main() -> int {
	Print("Hello, World!");
	return 0;
}
```

`Main` is the program's [entry point](/docs/functions/main), and the `import` brings `Print` from the standard library's `Std::Io` module into scope.

### 3. Add the standard library

```sh
rux add Std
rux install
```

### 4. Build and run

```sh
rux build
rux run
```

You should see:

```
Hello, World!
```

## More examples

Once your first program runs, explore the [Rux Examples repository](https://github.com/rux-lang/Examples) — a collection of small, self-contained projects that introduce core concepts one step at a time.

### Repository layout

Each example is its own complete project:

```
Examples/
├── Hello/
│   ├── Src/
│   │    └── Main.rux
│   └── Rux.toml
├── Factorial/
│   ├── Src/
│   │    └── Main.rux
│   └── Rux.toml
├── ...
└── README.md
```

### Run an example

1. Clone the repository:

   ```sh
   git clone https://github.com/rux-lang/Examples.git
   cd Examples
   ```

2. Move into an example and open it:

   ```sh
   cd Hello
   code .
   ```

3. Read its README for the task and learning goals, then build and run it:

   ```sh
   rux run
   ```

### Tips

- Read the problem carefully before you start coding.
- Experiment — modify an example and see what changes.
- Write clear comments as you go.
- Found a bug or have an idea? Open an issue on [GitHub](https://github.com/rux-lang/Examples/issues).

All examples are released under the MIT License.
