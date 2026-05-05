# Foreign Function Interface

The `extern` keyword declares functions or variables that are defined outside Rux — typically in C / C++ libraries.

```rux
extern func malloc(size: uint64) -> *opaque;
extern func free(ptr: *opaque);
extern func printf(fmt: *uint8, ...) -> int32;
```

Calling `extern` functions is inherently **unsafe**, as Rux cannot verify their behavior.
