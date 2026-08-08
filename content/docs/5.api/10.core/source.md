# #source

Compile-time location of the expression that reads it.

**Package:** `Rux`

## Definition

```rux
intrinsic #source: Source;

struct Source {
    line: uint;
    column: uint;
    file: Slice<char8>;
    fileName: Slice<char8>;
    filePath: Slice<char8>;
    function: Slice<char8>;
    module: Slice<char8>;
}
```

`#source` is a compile-time value describing where in the code it is read. Each reference resolves to the position of that reference, which makes it useful for logging, assertions, and diagnostics that want to report their own location.

## Fields

| Field      | Type           | Description                     |
| ---------- | -------------- | ------------------------------- |
| `line`     | `uint`         | Line number of the reference.   |
| `column`   | `uint`         | Column number of the reference. |
| `file`     | `Slice<char8>` | Full file identifier.           |
| `fileName` | `Slice<char8>` | File name alone.                |
| `filePath` | `Slice<char8>` | Path to the file.               |
| `function` | `Slice<char8>` | Enclosing function's name.      |
| `module`   | `Slice<char8>` | Enclosing module's name.        |

## Example

```rux
import Core::{ #source };
import Io::PrintLine;

func Main() -> int {
    PrintLine("{}:{}", #source.fileName, #source.line);
    return 0;
}
```

## See also

- [`Core`](/docs/api/core) — the package overview
- [`#build`](/docs/api/core/build) / [`#compiler`](/docs/api/core/compiler) / [`#config`](/docs/api/core/config) / [`#target`](/docs/api/core/target) — the other compile-time values
- [Conditional Compilation](/docs/lang/comptime/conditional) — the compile-time context
