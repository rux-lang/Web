# Import Attribute

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

See [`@[Import]`](/docs/attributes/import) for the full attribute reference.

## See Also

- [`extern` Declarations](/docs/ffi/extern) — declaring the foreign functions being linked
- [`@[Import]`](/docs/attributes/import) — the full attribute reference
- [`@[Target]`](/docs/attributes/target) — selecting a library per platform
