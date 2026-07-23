# `int`

| Property         | Value                                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| Size             | 4 bytes on 32-bit targets (as `int32`); 8 bytes on 64-bit targets (as `int64`) |
| Signed           | Yes                                                                            |
| Literal suffix   | `i`                                                                            |
| Representation   | Two's complement                                                               |
| Hardware support | Native on all supported targets                                                |

`int` is the platform-dependent signed integer: its width matches the native pointer width of the compilation target. It is the **default type for integer literals** and the idiomatic choice for general-purpose counting — it maps to the most efficient native integer on the target and is the type expected by most standard library functions (the standard library uses `int` for lengths). Like all signed types it uses [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement).

## Literals

When an integer literal is written without an annotation or suffix, Rux infers `int`:

```rux
let x = 42;            // x : int
let y = -7;            // y : int
const MaxRetries = 5;  // MaxRetries : int
let z = 42i;           // explicit suffix
```

Override the default with an explicit type annotation or a type suffix on the literal:

```rux
let a: int32 = 42;  // explicit annotation — int32
let b = 42i32;      // type suffix         — int32, same effect
```

A suffixed literal and an explicit annotation must agree; providing both when they conflict is a compile-time error. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- Loop counters and slice indices
- Collection lengths and counts
- Pointer-sized offsets and arithmetic

## Portability

Code that assumes a specific width for `int` will behave differently on 32-bit and 64-bit targets. When the bit width must be exact — serialised data, hardware registers, cross-platform binary protocols — use a fixed-width type such as [`int32`](./int32) or [`int64`](./int64) instead.

## Arithmetic

| Operator | Description    | Compound |
| -------- | -------------- | -------- |
| `+`      | Addition       | `+=`     |
| `-`      | Subtraction    | `-=`     |
| `*`      | Multiplication | `*=`     |
| `/`      | Division       | `/=`     |
| `%`      | Remainder      | `%=`     |
| `**`     | Exponentiation | n/a      |

```rux
let a = 10;
let b = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   carries the sign of the dividend
```

Division and remainder truncate toward zero, so the remainder takes the sign of the dividend: `-7 % 2` is `-1`.

**Overflow.** In debug builds, signed overflow raises a fatal error. In release builds it wraps modulo 2<sup>n</sup> (where _n_ is the target width) in two's-complement fashion. Wraparound is well-defined in Rux (unlike C/C++), but relying on it is almost always a logic error.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `int` with a fixed-width type such as `int32`, or with an unsigned type such as `uint`, is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift with `>>` on a signed value is **arithmetic**: vacated bits are filled with the sign bit, preserving the sign. To fill with zeros instead, use the logical right shift [`>>>`](/docs/operations/shift#logical-right-shift), which keeps the same signed type and width.

```rux
let s = -8;
let r = s >> 2;    // -2   sign-filled (arithmetic) right shift
```

The bitwise operators `&`, `|`, `^`, and `~` are also defined (`~x` equals `−(x + 1)`), but bitmask work usually reads more clearly on [unsigned types](/docs/unsigned/uint).

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Because `int` has a target-dependent width, always cast to a fixed-width type before serialising or comparing across platforms.

```rux
let n = 1000;
let fixed = n as int32;   // pin to a known width
let u = n as uint;        // same width, bits reinterpreted
```

## See Also

- [`uint`](/docs/unsigned/uint) — unsigned counterpart of the same width
- [Unsigned Integer Types](/docs/unsigned/uint) — the unsigned integer family
