# Hello World

Let's create a simple Rux console application that prints "Hello World!" on the screen.

## Creating Project

We are going to create the first application of every programmer. Let's run the Rux toolchain.

```sh
rux new HelloWorld
cd HelloWorld
code .
```

## Main Function

Insert this snippet into the `Main.rux` file

```rux
import System::Print;

func Main() -> int {
	Print("Hello World!");
	return 0;
}
```

## Building and Running

```sh
rux build
rux run
```

## Output

```
Hello World!
```

## Source Code

Please refer to the [GitHub repository](https://github.com/rux-lang/Rux.Tutorials/tree/main/HelloWorld).
