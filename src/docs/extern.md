# Foreign Function Interface

The `extern` keyword declares functions or variables that are defined outside Rux — typically in C / C++ libraries.

```rux
extern func malloc(size: uint) -> *opaque;
extern func free(ptr: *opaque);
extern func sin(angle: float) -> float;
```

Calling `extern` functions is inherently **unsafe**, as Rux cannot verify their behavior.
