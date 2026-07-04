# Shift Operations

Shift operations move the bits of an integer value left or right. They are primarily used for bit masks, packed data, binary protocols, and low-level numeric code.

## Operators

| Operator | Operation   | Compound assignment |
| -------- | ----------- | ------------------- |
| `<<`     | Left shift  | `<<=`               |
| `>>`     | Right shift | `>>=`               |

```rux
let value: uint8 = 0b00010100;  // 20

let left = value << 2;   // 0b01010000 = 80
let right = value >> 2;  // 0b00000101 = 5
```

The result has the type of the left operand. The shift amount must be a non-negative integer.

## Left Shift

`value << count` moves bits toward the most significant end and fills the vacated low-order bits with zeros:

```rux
let bit: uint32 = 1 << 5;  // bit 5 set
```

Bits shifted beyond the width of the left operand are discarded. Use a type wide enough for the expected result.

## Unsigned Right Shift

Right-shifting an unsigned integer performs a logical shift. The vacated high-order bits are filled with zeros:

```rux
let value: uint8 = 0b10000000;
let result = value >> 2;  // 0b00100000
```

Unsigned integers are usually the clearest choice for masks and bit fields.

## Signed Right Shift

Right-shifting a signed integer performs an arithmetic shift. The vacated high-order bits are filled with the sign bit:

```rux
let value: int8 = -8;     // 0b11111000
let result = value >> 2;  // 0b11111110 = -2
```

Cast to an unsigned type first when a zero-filling right shift is required.

## Shift Amount

The shift amount must be smaller than the bit width of the left operand. Invalid constant amounts are compile-time errors; invalid runtime amounts produce a runtime error.

```rux
let value: uint32 = 1;
let valid = value << 31;
let invalid = value << 32;  // error: shift amount is not less than 32
```

## Compound Assignment

Compound shift assignment updates a mutable left operand:

```rux
var flags: uint32 = 1;
flags <<= 3;  // flags = flags << 3
flags >>= 1;  // flags = flags >> 1
```

## Building Masks

Shifts are most often used to build a mask that a [bitwise](/docs/operations/bitwise) operator then applies — `1 << 3`, for instance, produces a value with only bit 3 set. See [Common Patterns](/docs/operations/bitwise#common-patterns) for the standard set, clear, toggle, and test idioms that pair shifts with `&`, `|`, and `^`.

Parenthesize shifts when combining them with bitwise or comparison operators to make the intended grouping explicit.

## Precedence

Addition and subtraction bind more tightly than shifts. Shifts bind more tightly than the bitwise and comparison operators:

```rux
let mask = 1 << (offset + 1);
let set = (flags & mask) != 0;
```

See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the complete precedence table.

## See Also

- [Bitwise Operations](/docs/operations/bitwise) — `&`, `|`, `^`, `~` applied to shifted masks
- [Arithmetic Operations](/docs/operations/arithmetic) — numeric operators on the same integer types
- [Unsigned Integer Types](/docs/unsigned/uint8#shift-and-bitwise) — per-type shift behaviour
