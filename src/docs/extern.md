# Foreign Function Interface

The `extern` keyword declares functions that are defined outside Rux — typically in C / C++ libraries.

```rux
extern func malloc(size: uint) -> *opaque;
extern func free(ptr: *opaque);
extern func sin(angle: float) -> float;
```

Calling `extern` functions is inherently **unsafe**, as Rux cannot verify their behavior.

## Import Attribute

The `@[Import]` attribute links an `extern` declaration to a specific dynamic library (`.dll`, `.so`, `.dylib`). The OS loader resolves the library by name at runtime.

```rux
@[Import(lib: "libm.so")]
extern func sin(angle: float64) -> float64;
```

Multiple declarations from the same library can be grouped in an `extern` block:

```rux
@[Import(lib: "Kernel32.dll")]
extern {
    func GetStdHandle(handle: uint32) -> *opaque;
    func WriteFile(
        handle: *opaque,
        buffer: *const opaque,
        numberOfBytesToWrite: uint32,
        lpNumberOfBytesWritten: *uint64,
        overlapped: int,
    ) -> bool;
}
```

See [`@[Import]`](./attributes/import.md) for full attribute reference.
