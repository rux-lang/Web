# `#build`

Compile-time information about the active build.

**Package:** `Rux`

## Definition

```rux
intrinsic #build: Build;

struct Build {
    profile: Slice<char8>;
    mode: BuildMode;
    optimization: OptimizationMode;
    debugAssertions: bool;
    debugInfo: bool;
    isTest: bool;
    outputKind: OutputKind;
    timestamp: uint64;
    date: Slice<char8>;
    time: Slice<char8>;
}
```

`#build` is a compile-time value describing the profile and output of the current build. Read its fields in a [`when`](/docs/comptime/conditional) to compile differently by mode, or embed the build date and time in a program.

## Fields

| Field             | Type               | Description                                          |
| ----------------- | ------------------ | ---------------------------------------------------- |
| `profile`         | `Slice<char8>`     | Name of the active build profile.                    |
| `mode`            | `BuildMode`        | `Debug` or `Release`.                                |
| `optimization`    | `OptimizationMode` | `None`, `Size`, or `Speed`.                          |
| `debugAssertions` | `bool`             | Whether [`DebugAssert`](assert) checks are compiled. |
| `debugInfo`       | `bool`             | Whether debug information is emitted.                |
| `isTest`          | `bool`             | Whether this is a test build.                        |
| `outputKind`      | `OutputKind`       | `Executable`, `SharedLibrary`, or `StaticLibrary`.   |
| `timestamp`       | `uint64`           | Build time as a Unix timestamp.                      |
| `date`            | `Slice<char8>`     | Build date as text.                                  |
| `time`            | `Slice<char8>`     | Build time of day as text.                           |

## Enums

```rux
enum BuildMode: uint8 { Debug = 0, Release = 1 }
enum OptimizationMode: uint8 { None = 0, Size = 1, Speed = 2 }
enum OutputKind: uint8 { Executable = 0, SharedLibrary = 1, StaticLibrary = 2 }
```

## Example

```rux
import Rux::{ #build };
import Io::PrintLine;

func Main() -> int {
    when #build.mode {
        .Debug => PrintLine("debug build"),
        .Release => PrintLine("release build")
    }
    return 0;
}
```

## See also

- [`Rux`](/api/rux/) — the package overview
- [`#target`](target) / [`#compiler`](compiler) / [`#config`](config) / [`#source`](source) — the other compile-time values
- [Conditional Compilation](/docs/comptime/conditional) — using the build context in `when`
