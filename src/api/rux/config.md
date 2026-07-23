# `#config`

Compile-time access to user-defined build values.

**Package:** `Rux`

## Definition

```rux
intrinsic #config: Config;

struct Config {}

extend Config {
    intrinsic func Get(self, name: Slice<char8>) -> Slice<char8>;

    intrinsic func Has(self, name: Slice<char8>) -> bool;
}
```

`#config` is a compile-time value exposing the definitions supplied through the manifest's `[Build.Defines]` table and the `--define` command-line flag. `Has` reports whether a name is defined and `Get` returns its value as text, so a program can specialize at build time on values the build passes in.

## Methods

| Method                    | Returns        | Description                               |
| ------------------------- | -------------- | ----------------------------------------- |
| `Get(name: Slice<char8>)` | `Slice<char8>` | The value defined for `name`, as text.    |
| `Has(name: Slice<char8>)` | `bool`         | Whether `name` is defined.                |

## Example

```rux
import Rux::{ #config };
import Io::PrintLine;

func Main() -> int {
    when #config.Has("FeatureX") {
        PrintLine("FeatureX is enabled");
    }
    return 0;
}
```

## See also

- [`Rux`](/api/rux/) — the package overview
- [`#build`](build) / [`#compiler`](compiler) / [`#target`](target) / [`#source`](source) — the other compile-time values
- [Conditional Compilation](/docs/comptime/conditional) — using the build context in `when`
