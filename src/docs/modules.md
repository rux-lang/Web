# Modules

## Module Declaration

Modules organize code into named namespaces. A module is declared with the `module` keyword and can appear anywhere in a source file. Multiple modules can exist in one file, and modules can be nested.

```rux
module Math {
    pub func Sqrt(x: float64) -> float64 {
        // Code here
    }

    pub func Abs(x: float64) -> float64 {
        // Code here
    }
}
```

Nested modules can be declared inline or using path notation:

```rux
module Std::Io {
    pub func Print(s: String) {
        // Code here
    }
}
```

## Items Visibility

By default, items are private to their module. Use `pub` to make them visible externally.

```rux
pub struct Config {
    pub host: String;
    pub port: uint16;
    apiKey: String;  // private field
}

pub func NewConfig(host: String, port: uint16) -> Config {
    // Code here
}
```

## Import

`import` brings names from a module into the current scope.

```rux
import Math::Sqrt;
import Http::{ Request, Response };
import Std::Io::*;
import Std::Io::{ Print, PrintLine };
```

The `::` path separator is used for qualified names:

```rux
let result = Math::Sqrt(2.0);
```
