::code-tree{defaultValue="Imports/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Imports/Rux.toml]
[Manifest]
Version = 1

[Package]
Name = "Imports"
Version = "0.1.0"
Type = "Executable"
Description = "Package import"

[Dependencies]
Io = { Namespace = "Rux", Version = "*" }
Math = { Namespace = "Rux", Version = "*" }
```

```rux [Imports/Src/Main.rux]
// Import one item from a package
import Io::PrintLine;

// Import several items from a package
import Math::{ Sin, Cos };

// Import a module, then name its items through it
import Math::Constants;

// Import every public item of a module
import Math::Constants::*;

func Main() -> int {
    let angle = Constants::Pi / 6.0;
    PrintLine("sin = {}, cos = {}", Sin(angle), Cos(angle));
    PrintLine("tau = {}", Tau);
    return 0;
}
```

::
