# Foreign Function Interface

The `extern` keyword declares functions that are defined outside Rux — typically in C / C++ libraries.

```rux
extern func malloc(size: uint) -> *opaque;
extern func free(ptr: *opaque);
```

## Import Attribute

The `@[Import]` attribute links an `extern` declaration to a specific dynamic library (`.dll`, `.so`, `.dylib`). The operating system loader resolves the library by name at runtime.

```rux
@[Import(lib: "libm.so")]
extern func cos(angle: float64) -> float64;

@[Import(lib: "libm.so")]
extern func sin(angle: float64) -> float64;

@[Import(lib: "libm.so")]
extern func sqrt(value: float64) -> float64;
```

Multiple declarations from the same library can be grouped in one `extern` block.

```rux
@[Import(lib: "Kernel32.dll")]
extern {
    func CreateFileW(
        fileName: *const char16,
        desiredAccess: uint32,
        shareMode: uint32,
        securityAttributes: *SecurityAttributes,
        creationDisposition: uint32,
        flagsAndAttributes: uint32,
        templateFile: *opaque
    ) -> *opaque;

    func WriteFile(
        handle: *opaque,
        buffer: *const opaque,
        numberOfBytesToWrite: uint32,
        numberOfBytesWritten: *uint32,
        overlapped: *Overlapped,
    ) -> bool32;
}
```

See [`@[Import]`](./attributes/import.md) for full attribute reference.
