# Import

Specifies the shared library from which an `extern` function is imported at link time.

## Syntax

```rux
@[Import(lib: "<library-name>")]
extern func FunctionName(params) -> ReturnType;
```

The `lib` value is the library name without a path. Rux also probes the name with the platform extension appended (`.dll`, `.so`, `.dylib`), so `"kernel32"` and `"kernel32.dll"` are both valid on Windows.

Every `extern func` must carry `@[Import]`; omitting it is a compile-time error.

## Example

Windows I/O via Kernel32.dll

```rux
@[Import(lib: "Kernel32.dll")]
extern func GetStdHandle(handle: uint32) -> *opaque;

@[Import(lib: "Kernel32.dll")]
extern func WriteFile(
    handle:     *opaque,
    buffer:     *const opaque,
    numberOfBytesToWrite: uint32,
    lpNumberOfBytesWritten:    *uint64,
    overlapped: int,
) -> bool;

func Main() -> int {
    let text = c8"Hello, Rux!\n";
    var written: uint64 = 0;
    let stdout = GetStdHandle(-11); // STD_OUTPUT_HANDLE
    WriteFile(stdout, text.data, text.length, &written, 0);
    return 0;
}
```

**Example — libc math**

```rux
@[Import(lib: "libm")]
extern func sqrt(x: float64) -> float64;

@[Import(lib: "libm")]
extern func pow(base: float64, exp: float64) -> float64;
```
