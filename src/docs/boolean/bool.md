# `bool`

| Property | Value |
| -------- | ----- |
| Alias of | [`bool8`](./bool8) |
| Size     | 1 byte (8 bits) — a language guarantee, not platform-dependent |
| Values   | `false` or `true` |

`bool` is a built-in, compiler-provided alias for `bool8` — the default boolean type in Rux:

```rux
type bool = bool8;  // compiler intrinsic alias
```

Because the alias is transparent, `bool` and `bool8` are the same type and fully interchangeable. Use `bool` in everyday code for flags, conditions, and return values; spell out `bool8` when the exact width is the point (serialisation, FFI signatures). Reserve the wider boolean types for SIMD, FFI, and memory-layout-sensitive contexts.

## Literals

There are exactly two boolean literals, both lowercase keywords:

```rux
let isActive: bool = true;
let isDone: bool = false;
let flag = true;       // inferred as bool
```

## Logical Operations, Comparison, and Conversion

`bool` behaves identically to [`bool8`](./bool8) in every respect — logical and bitwise operators, equality, and the explicit conversion rules to and from integers. See the [`bool8`](./bool8) page for the full reference.

Booleans are distinct from integers: no implicit conversion happens in either direction, and a condition must already be a boolean expression. Don't compare a boolean to a literal redundantly:

```rux
// Avoid
if isReady == true { Start(); }

// Preferred
if isReady { Start(); }
if !isReady { Wait(); }
```

## See Also

- [`bool8`](./bool8) — the aliased type: full operator and conversion rules
- [`bool16`](./bool16) — the next width up