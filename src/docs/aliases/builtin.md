# Built-in Aliases

Some built-in type names are themselves **compiler-provided aliases** — convenient default spellings for a specific underlying type. Like any [alias](/docs/aliases/overview) they are transparent, so the alias and its target are the same type.

```rux
type float = float64;  // compiler intrinsic alias
```

## Default-Width Aliases

These three names alias the most common width of their family, so unsuffixed code reads naturally:

| Alias                            | Target                              | Notes                                  |
| -------------------------------- | ----------------------------------- | -------------------------------------- |
| [`float`](/docs/floating/float)  | [`float64`](/docs/floating/float64) | Type of an unsuffixed float literal    |
| [`bool`](/docs/boolean/bool)     | [`bool8`](/docs/boolean/bool8)      | The everyday boolean                   |
| [`char`](/docs/character/char)   | [`char32`](/docs/character/char32)  | A full Unicode scalar value            |

## Target-Dependent Aliases

These names alias a type whose width follows the platform's pointer size — `*32` on a 32-bit target and `*64` on a 64-bit target. Use them for sizes, indices, and counts that should match the machine's natural word:

| Alias                           | 32-bit target                       | 64-bit target                       |
| ------------------------------- | ----------------------------------- | ----------------------------------- |
| [`int`](/docs/signed/int)       | [`int32`](/docs/signed/int32)       | [`int64`](/docs/signed/int64)       |
| [`uint`](/docs/unsigned/uint)   | [`uint32`](/docs/unsigned/uint32)   | [`uint64`](/docs/unsigned/uint64)   |

## See Also

- [Type Aliases](/docs/aliases/overview) — how aliasing works in general
- [Primitive Data Types](/docs/appendix/primitives) — the full table of built-in types and their sizes
