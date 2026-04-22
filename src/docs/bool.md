# Bool Types

## Overview

Boolean types in Rux represent truth values: `true` or `false`. They are used in conditions, logical expressions, flags, and control flow. Rux provides a family of explicitly sized boolean types — `bool8` through `bool512` — as well as a default `bool` alias for the most common use case.

Unlike some languages where booleans are simply aliases for integers, Rux boolean types are distinct from numeric types. Implicit conversion between booleans and integers is not permitted; explicit conversion is required.

## Bool Types

Rux provides seven fixed-width boolean types, each occupying a specific number of bits. This is useful for low-level programming, [SIMD](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data) operations, [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface), packed data structures, and interoperability with external systems.

| Type      | Size     | Range             |
| --------- | -------- | ----------------- |
| `bool8`   | 1 byte   | `false` or `true` |
| `bool16`  | 2 bytes  | `false` or `true` |
| `bool32`  | 4 bytes  | `false` or `true` |
| `bool64`  | 8 bytes  | `false` or `true` |
| `bool128` | 16 bytes | `false` or `true` |
| `bool256` | 32 bytes | `false` or `true` |
| `bool512` | 64 bytes | `false` or `true` |

All boolean types store only `true` or `false`, regardless of their underlying width. The extra bits in wider types are zeroed and reserved.

```rux
let a: bool8  = true
let b: bool32 = false
let c: bool64 = true
```

## Default Bool Type (`bool`)

The plain `bool` keyword is an alias for `bool8` — the most commonly used boolean type in everyday programming.

```rux
let isActive: bool = true
let isDone: bool   = false
let flag = true;
```

Use `bool` (i.e. `bool8`) unless you have a specific reason to choose a wider type, such as FFI requirements or SIMD vectorization.

## Bool Literals

There are exactly two boolean literals in Rux:

| Literal | Value         |
| ------- | ------------- |
| `true`  | Logical true  |
| `false` | Logical false |

Both literals are lowercase keywords. They are compatible with any bool type and will be implicitly widened to the target type upon assignment.

```rux
let x: bool    = true
let y: bool32  = false
let z: bool128 = true
```

Boolean literals cannot be used directly as integer values. The following is a compile-time error:

```rux
let n: int32 = true  // error: cannot assign bool to int32
```

## Type Conversion

Rux does not allow implicit conversions between boolean types and numeric types. All conversions must be explicit using the `as` keyword.

### Bool to Integer

```rux
let flag: bool = true
let n: int32 = flag as int32   // n == 1
let m: int32 = false as int32  // m == 0
```

`true` converts to `1` and `false` converts to `0` for any integer type.

### Integer to Bool

```rux
let n: int = 1
let flag: bool = n as bool   // true  (non-zero)
let zero: bool = 0 as bool   // false (zero)
```

Any non-zero integer value converts to `true`; zero converts to `false`.

### Between Bool Sizes

Conversion between boolean widths is allowed with `as`:

```rux
let a: bool8  = true
let b: bool32 = a as bool32
let c: bool8  = b as bool8
```

Narrowing conversions preserve the logical value (`true`/`false`); the extra bits are discarded or zeroed accordingly.

## Logical Operations

Rux supports the standard set of logical and bitwise operations on boolean types.

### Logical Operators

These operators work on single boolean values and short-circuit where applicable.

| Operator | Name        | Description                              |
| -------- | ----------- | ---------------------------------------- |
| `&&`     | Logical AND | `true` only if both operands are `true`  |
| `\|\|`   | Logical OR  | `true` if at least one operand is `true` |
| `!`      | Logical NOT | Inverts the boolean value                |

```rux
let a: bool = true
let b: bool = false

let andResult: bool = a && b   // false
let orResult:  bool = a || b   // true
let notResult: bool = !a       // false
```

Short-circuit evaluation applies: in `a && b`, if `a` is `false`, `b` is never evaluated. In `a || b`, if `a` is `true`, `b` is never evaluated.

### Bitwise Operators on Bool Types

Wider boolean types (`bool32`, `bool64`, etc.) also support bitwise operations. These do **not** short-circuit.

| Operator | Name        |
| -------- | ----------- |
| `&`      | Bitwise AND |
| `\|`     | Bitwise OR  |
| `^`      | Bitwise XOR |
| `~`      | Bitwise NOT |

```rux
let a: bool32 = true
let b: bool32 = false

let c: bool32 = a & b   // false
let d: bool32 = a | b   // true
let e: bool32 = a ^ b   // true
let f: bool32 = ~a      // false
```

For plain `bool` / `bool8`, prefer `&&`, `||`, and `!` over their bitwise equivalents in general logic to benefit from short-circuit evaluation and clearer intent.

### Equality and Comparison

Boolean types support equality checks:

```rux
let a: bool = true
let b: bool = true

let eq:  bool = a == b   // true
let neq: bool = a != b   // false
```

Booleans do not support ordering operators (`<`, `>`, `<=`, `>=`). If ordered comparison is needed, convert to an integer first.

## Recommendations

**Prefer `bool` for general use.** Use `bool` (alias for `bool8`) for flags, conditions, and return values in application-level code. Reserve wider types for SIMD, FFI, and memory-layout-sensitive contexts.

```rux
// Preferred
func IsValid(value: int): bool { ... }

// Only when size matters
func PackFlags(): bool32 { ... }
```

**Do not compare booleans to literals redundantly.** Comparing a `bool` to `true` or `false` adds noise with no benefit.

```rux
// Avoid
if (isReady == true) { ... }

// Preferred
if isReady { ... }
if !isReady { ... }
```

**Avoid casting integers to bool without intention.** While `n as bool` is legal, it can mask logic errors. Prefer explicit comparisons when deriving a boolean from a numeric value.

```rux
// Fragile
let flag: bool = count as bool

// Clearer
let flag: bool = count > 0
```

**Use `&&` and `||` over `&` and `|` when short-circuiting matters.** If the right-hand operand has side effects or is expensive to compute, logical operators avoid unnecessary evaluation.

```rux
// Safe — Load() is only called when IsEnabled() returns true
if (IsEnabled() && Load()) { ... }
```

**Name boolean variables and functions affirmatively.** Names that read as yes/no questions improve readability.

```rux
// Clear
let isConnected: bool = true
let hasPermission: bool = false
func CanProceed() -> bool { ... }

// Unclear
let connection: bool = true
let permission: bool = false
```

## Notes

- `true` and `false` are reserved keywords and cannot be used as identifiers.
- Boolean types are not numeric types; arithmetic operations (`+`, `-`, `*`, `/`) on booleans are not permitted.
- `bool` is guaranteed to be exactly 8 bits wide (`bool8`). This is a language guarantee, not platform-dependent.
- Wider boolean types (`bool256`, `bool512`) are primarily intended for SIMD vector masks and low-level bit manipulation. They may require aligned memory on certain platforms.
- When a boolean is used as a condition in `if`, `while`, or `for`, no implicit conversion occurs — the expression must already be of a boolean type.
- Boolean values in Rux are always initialized. Uninitialized boolean variables are a compile-time error.
- The `match` expression can be used with boolean values as an alternative to `if`/`else` when matching is more expressive:

```rux
match isReady {
    true  => Start(),
    false => Wait(),
}
```
