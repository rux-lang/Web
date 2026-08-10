::code-tree{defaultValue="Hello/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Hello/Rux.toml]
[Package]
Name = "Hello"
Version = "0.1.0"
Type = "Executable"
Description = "The first application"

[Dependencies]
Io = { Namespace = "Rux", Version = "*" }
```

```rux [Hello/Src/Main.rux]
import Io::PrintLine;

// Entry point of the program
func Main() -> int {
	let greetings = [
		"Hello World",
		"你好，世界",
		"नमस्ते दुनिया",
		"Hola Mundo",
		"Bonjour le monde",
		"مرحبا يا عالم",
		"হ্যালো বিশ্ব",
		"Привет мир",
		"Olá Mundo",
		"سلام دنیا",
		"Привіт світ",
		"🐯🐶🐱🐭"
	];
	for greeting in greetings {
		PrintLine(greeting);
	}
	return 0;
}
```

::
