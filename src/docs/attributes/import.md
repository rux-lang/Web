# `Import`

Specifies the shared (dynamic) library from which an `extern` function is imported at link time.

## Syntax

```rux
@[Import(lib: "Kernel32.dll")]
extern func Beep(freq: uint32, duration: uint32) -> bool32;
```

The `lib` value is the library name without a path like `vulkan.so`, `vulkan.dylib`, `vulkan.dll`, etc.

## Examples

### Print string using Windows API

```rux
@[Import(lib: "Kernel32.dll")]
extern func GetStdHandle(handle: uint32) -> *opaque;

@[Import(lib: "Kernel32.dll")]
extern func WriteFile(
    handle: *opaque,
    buffer: *const opaque,
    numberOfBytesToWrite: uint32,
    numberOfBytesWritten: *uint64,
    overlapped: int,
) -> bool;

func Main() -> int {
    let text = "Hello, Rux!\n";
    var written: uint64 = 0;
    let stdout = GetStdHandle(-11 as uint32); // STD_OUTPUT_HANDLE
    WriteFile(stdout, text.data, text.length as uint32, &written, 0);
    return 0;
}
```

### Mathematical functions from libc

```rux
@[Import(lib: "libm.so")]
extern func sqrt(x: float64) -> float64;

@[Import(lib: "libm.so")]
extern func pow(base: float64, exp: float64) -> float64;
```

## See Also

- [Import Attribute](/docs/ffi/import) — using `@[Import]` in the FFI workflow
- [`extern` Declarations](/docs/ffi/extern) — the declarations this attribute links
- [`@[Target]`](/docs/attributes/target) — choosing a library per platform
