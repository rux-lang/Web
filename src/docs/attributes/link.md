# `Link`

Names the native library an [`extern`](/docs/ffi/extern) function is imported from, and optionally the exported symbol to bind to. The operating system loader resolves the library by name at run time.

## Syntax

```rux
#Link("Kernel32.dll")
extern func Beep(freq: uint32, duration: uint32) -> bool32;
```

The library is a plain name — `vulkan.so`, `vulkan.dylib`, `vulkan.dll` — without a path. The argument may be a string literal or a compile-time [string constant](/docs/constants/overview).

## Binding a Different Symbol Name

By default the exported symbol matches the Rux declaration name. A second argument binds to a differently named export, so the Rux name can follow local conventions:

```rux
#Link("libm.so", "sqrt")
extern func SquareRoot(x: float64) -> float64;   // calls C's sqrt
```

## Applying to an `extern` Block

The one-argument form may annotate an entire [`extern` block](/docs/ffi/extern), applying the library to every function inside it:

```rux
#Link("Kernel32.dll")
extern {
    func GetStdHandle(handle: uint32) -> *opaque;
    func WriteFile(
        handle: *opaque,
        buffer: *opaque,
        numberOfBytesToWrite: uint32,
        numberOfBytesWritten: *var uint32,
        overlapped: *Overlapped,
    ) -> bool32;
}
```

## Compatibility Spellings

`#Library("name")` and `#Symbol("name")` set the library and symbol separately. They are retained for compatibility and **cannot be combined with `#Link`** — prefer `#Link`, which expresses both in one attribute.

## Selecting a Library per Platform

Because a library name differs across systems, guard the declarations with [conditional compilation](/docs/comptime/conditional):

```rux
import Rux::{ #target };

when #target.os == .Windows {
    #Link("Kernel32.dll")
    extern func GetTickCount64() -> uint64;
} else when #target.os == .Linux {
    #Link("librt.so")
    extern func clock_gettime(clockid: int32, tp: *opaque) -> int32;
}
```

## See Also

- [`extern` Declarations](/docs/ffi/extern) — the declarations this attribute links
- [Foreign Function Interface](/docs/ffi/overview) — the full FFI workflow
- [Conditional Compilation](/docs/comptime/conditional) — choosing a library per platform
