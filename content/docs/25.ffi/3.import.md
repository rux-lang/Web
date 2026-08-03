# Linking Libraries

The [`#Link`](/docs/attributes/link) attribute binds an [`extern`](/docs/ffi/extern) declaration to a native library (`.dll`, `.so`, `.dylib`). The operating-system loader resolves the library by name at run time.

```rux
#Link("libm.so")
extern func sqrt(x: float64) -> float64;

#Link("libm.so")
extern func pow(base: float64, exp: float64) -> float64;
```

A single `#Link` may also annotate a whole [`extern` block](/docs/ffi/extern), applying the library to every function inside it.

## Example: Printing with the Windows API

```rux
#Link("Kernel32.dll")
extern func GetStdHandle(handle: uint32) -> *opaque;

#Link("Kernel32.dll")
extern func WriteFile(
    handle: *opaque,
    buffer: *opaque,
    numberOfBytesToWrite: uint32,
    numberOfBytesWritten: *var uint32,
    overlapped: *Overlapped,
) -> bool32;

func Main() -> int {
    let text = "Hello, Rux!\n";
    var written: uint32 = 0;
    let stdout = GetStdHandle(-11 as uint32); // STD_OUTPUT_HANDLE
    WriteFile(stdout, text.data, text.length as uint32, @written, null);
    return 0;
}
```

## Per-Platform Libraries

Library names differ across systems, so guard the declarations with [conditional compilation](/docs/comptime/conditional) rather than a platform attribute:

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

See [`#Link`](/docs/attributes/link) for the full attribute reference, including binding a differently named exported symbol.

## See Also

- [`#Link`](/docs/attributes/link) — the full attribute reference
- [`extern` Declarations](/docs/ffi/extern) — the declarations this attribute links
- [Conditional Compilation](/docs/comptime/conditional) — selecting a library per platform
