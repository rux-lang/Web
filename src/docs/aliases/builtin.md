# Built-in Aliases

Some built-in type names are themselves **compiler-provided aliases** — convenient default spellings for a specific underlying type. Like any [alias](/docs/aliases/overview) they are transparent, so the alias and its target are the same type.

```rux
type float = float64;  // compiler intrinsic alias
```

## Default-Width Aliases

These three names alias the most common width of their family, so unsuffixed code reads naturally:

| Alias                           | Target                              | Notes                               |
| ------------------------------- | ----------------------------------- | ----------------------------------- |
| [`float`](/docs/floating/float) | [`float64`](/docs/floating/float64) | Type of an unsuffixed float literal |
| [`bool`](/docs/boolean/bool)    | [`bool8`](/docs/boolean/bool8)      | The everyday boolean                |
| [`char`](/docs/character/char)  | [`char32`](/docs/character/char32)  | A full Unicode scalar value         |

## Target-Dependent Aliases

These names alias a type whose width follows the platform's pointer size — `*32` on a 32-bit target and `*64` on a 64-bit target. Use them for sizes, indices, and counts that should match the machine's natural word:

| Alias                         | 32-bit target                     | 64-bit target                     |
| ----------------------------- | --------------------------------- | --------------------------------- |
| [`int`](/docs/signed/int)     | [`int32`](/docs/signed/int32)     | [`int64`](/docs/signed/int64)     |
| [`uint`](/docs/unsigned/uint) | [`uint32`](/docs/unsigned/uint32) | [`uint64`](/docs/unsigned/uint64) |

## Semantic Aliases

This name aliases a type of the same width but reads more clearly at the call site. `byte` is the same 8-bit unsigned integer as [`uint8`](/docs/unsigned/uint8); prefer it wherever a value is raw memory rather than a small number — buffers, binary protocol fields, and serialisation:

| Alias                          | Target                          | Notes                                        |
| ------------------------------ | ------------------------------- | -------------------------------------------- |
| [`byte`](/docs/unsigned/uint8) | [`uint8`](/docs/unsigned/uint8) | A raw 8-bit byte; identical in every respect |

```rux
let header: byte = 0xFF;   // reads as "one raw byte"
let count:  uint8 = 12;    // reads as "a small number"
```

Because the two are the same type, a `byte` and a `uint8` are interchangeable — you can assign one to the other and pass either to a function expecting the other, with no cast.

## See Also

- [Type Aliases](/docs/aliases/overview) — how aliasing works in general
- [Primitive Data Types](/docs/appendix/primitives) — the full table of built-in types and their sizes
