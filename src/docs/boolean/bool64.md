# `bool64`

::: warning
`bool64` is not implemented in the current release.
:::

| Property | Value |
| -------- | ----- |
| Size     | 8 bytes (64 bits) |
| Values   | `false` or `true` |

`bool64` is an 8-byte, word-sized boolean. Like every Rux boolean type it stores only `true` or `false`; the extra bits are zeroed and reserved. Booleans are distinct from integers — no implicit conversion happens in either direction, and a condition in `if`, `while`, or `for` must already be a boolean expression. Use the default [`bool`](./bool) unless a 64-bit width is specifically required.

## Literals

There are exactly two boolean literals, both lowercase keywords:

```rux
let a: bool64 = true;
let b: bool64 = false;
```

They are widened to the target type on assignment and cannot stand in for integer values — `let n: int32 = true;` is a compile-time error.

## Typical Use Cases

- 64-bit SIMD lane masks
- ABIs with word-sized boolean fields

## Logical Operations

These operators work on single boolean values and short-circuit where applicable.

| Operator | Name        | Description                              |
| -------- | ----------- | ---------------------------------------- |
| `&&`     | Logical AND | `true` only if both operands are `true`  |
| `\|\|`   | Logical OR  | `true` if at least one operand is `true` |
| `!`      | Logical NOT | Inverts the boolean value                |

```rux
let a: bool64 = true;
let b: bool64 = false;

let andResult = a && b;  // false
let orResult  = a || b;  // true
let notResult = !a;      // false
```

Short-circuit evaluation applies: in `a && b`, if `a` is `false`, `b` is never evaluated; in `a || b`, if `a` is `true`, `b` is never evaluated. Prefer `&&`, `||`, and `!` over the bitwise operators below for general logic — they short-circuit and read more clearly.

## Bitwise Operations

`bool64` also supports non-short-circuiting bitwise operators, which always evaluate both operands.

| Operator | Name        |
| -------- | ----------- |
| `&`      | Bitwise AND |
| `\|`     | Bitwise OR  |
| `^`      | Bitwise XOR |
| `~`      | Bitwise NOT |

```rux
let a: bool64 = true;
let b: bool64 = false;

let c = a & b;  // false
let d = a | b;  // true
let e = a ^ b;  // true
let f = ~a;     // false
```

## Comparison

| Operator | Description | Result |
| -------- | ----------- | ------ |
| `==`     | Equal       | `bool` |
| `!=`     | Not equal   | `bool` |

```rux
let a: bool64 = true;
let b: bool64 = true;

let eq  = a == b;  // true
let neq = a != b;  // false
```

Booleans support equality but **not** ordering (`<`, `>`, `<=`, `>=`). Convert to an integer first if ordered comparison is needed.

## Conversion

Conversions between boolean and numeric types are always explicit, using `as`:

```rux
let flag: bool64 = true;
let n = flag as int32;        // 1   — true → 1, false → 0
let back = n as bool;         // true — non-zero → true, zero → false
let wide = flag as bool512;   // boolean widths convert with as
```

`true` converts to `1` and `false` to `0` for any integer type; any non-zero integer converts to `true` and zero to `false`. Conversions between boolean widths preserve the logical value (`true`/`false`); the extra bits are discarded or zeroed accordingly. Prefer an explicit comparison (`count > 0`) over `count as bool` when deriving a boolean from a number — it makes the intent clear and avoids masking logic errors.

## See Also

- [`bool`](./bool) — the default boolean type
- [`bool32`](./bool32) — the next width down
- [`bool128`](./bool128) — the next width up
