# Extern and FFI

The `extern` keyword declares functions or variables that are defined outside Rux — typically in C libraries.

```rux
extern func malloc(size: uint64) -> *uint8;
extern func free(ptr: *uint8);
extern func printf(fmt: *uint8, ...) -> int32;
```

Calling `extern` functions is inherently **unsafe**, as Rux cannot verify their behavior. A safety boundary mechanism is planned.
