# `#compiler`

Compile-time information about the compiler performing the build.

**Package:** `Rux`

## Definition

```rux
intrinsic #compiler: Compiler;

struct Compiler {
    version: SemanticVersion;
}

extend Compiler {
    intrinsic func HasFeature(self, feature: Slice<char8>) -> bool;
}
```

`#compiler` is a compile-time value describing the compiler itself: its `version`, and a `HasFeature` query for capabilities that a program may want to gate on.

## `SemanticVersion`

```rux
struct SemanticVersion {
    major: uint;
    minor: uint;
    patch: uint;
}
```

`SemanticVersion` carries the three numeric components of a semantic version and orders them by precedence. It provides `New`, a `Compare` returning `-1`, `0`, or `1`, the named comparisons `IsEqualTo` / `IsLessThan` / `IsAtMost` / `IsGreaterThan` / `IsAtLeast`, and the comparison operators `==`, `!=`, `<`, `<=`, `>`, `>=`.

## Example

```rux
import Rux::{ #compiler, SemanticVersion };
import Io::PrintLine;

func Main() -> int {
    if #compiler.version >= SemanticVersion::New(0, 3, 0) {
        PrintLine("compiler is new enough");
    }
    return 0;
}
```

## See also

- [`Rux`](/api/rux/) — the package overview
- [`#build`](build) / [`#target`](target) / [`#config`](config) / [`#source`](source) — the other compile-time values
- [Conditional Compilation](/docs/comptime/conditional) — using the build context in `when`
