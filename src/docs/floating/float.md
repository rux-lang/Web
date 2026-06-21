# `float`

| Property          | Value |
| ----------------- | ----- |
| Alias of          | [`float64`](./float64) |
| Size              | 8 bytes (64 bits) |
| Format            | IEEE 754 binary64 (double precision) |
| Decimal precision | ~15–16 digits |
| Hardware support  | Native on all supported targets |

`float` is a built-in, compiler-provided alias for `float64` — the default floating-point type in Rux:

```rux
type float = float64;  // compiler intrinsic alias
```

Because the alias is transparent, `float` and `float64` are the same type and fully interchangeable. Use `float` in everyday code; spell out `float64` when the exact width is the point (serialisation, FFI signatures).

## Literals

When a floating-point literal is written without an annotation or suffix, Rux infers `float64`:

```rux
let a = 1.0;         // float64
let b = 3.14;        // float64
let c: float = 0.5;  // same type, by alias
```

## Arithmetic, Comparison, and Conversion

`float` behaves identically to [`float64`](./float64) in every respect — operators, `NaN` and `Inf` rules, rounding, and conversion. See the [`float64`](./float64) page for the full reference.

## See Also

- [`float64`](./float64) — the aliased type: full arithmetic, comparison, and conversion rules
- [`float32`](./float32) — narrower, hardware-native single precision
