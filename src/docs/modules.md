# Modules

## Module Declaration

Modules organize code into named namespaces. A module can be declared inline or correspond to a separate source file.

```rux
module Math {
    func Sqrt(x: float64) -> float64 { ... }
    func Abs(x: float64) -> float64 { ... }
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

}
```

## Import Modules

`use` brings names from a module into the current scope.

```rux
import Math.Sqrt;
import Http::{ Request, Response };
import Std.Io.*;
```

The `::` path separator is used for qualified names:

```rux
let result = Math::Sqrt(2.0);
```
