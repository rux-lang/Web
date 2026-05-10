# Modules

## Module Declaration

Modules organize code into named namespaces. A module is a separate source file.

```rux
// File Math.rux

func Sqrt(x: float64) -> float64 {
    // Code here
}

func Abs(x: float64) -> float64 {
    // Code here
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
