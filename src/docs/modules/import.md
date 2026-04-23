# use

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
