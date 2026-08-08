::code-tree{defaultValue="Imports/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Imports/Rux.toml]
[Package]
Name = "Imports"
Version = "0.1.0"
Type = "Program"
Description = "Package import"

[Dependencies]
Math = { Namespace = "Rux", Version = "*" }
```

```rux [Imports/Src/Main.rux]
// Import package
import Math;

// Import a package with an alias
import Math as Calc;

// Import all items from a package
import Math::*;

// Import specific items from a package
import Math::Sin;

// Import multiple specific items from a package
import Math::{ Sin, Cos };

// Import specific item from a package with an alias
import Math::Cos as Cosine;

func Main() -> int {
    return 0;
}
```

::
