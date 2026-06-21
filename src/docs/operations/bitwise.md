# Bitwise Operations

Bitwise operations work on the individual bits of an integer value. They are the foundation of bit masks, packed flags, binary protocols, and other low-level numeric code. Unlike the [logical operators](/docs/operations/logical), they evaluate **both** operands and combine them bit by bit rather than as truth values.

## Operators

| Operator | Operation   | Compound assignment |
| -------- | ----------- | ------------------- |
| `&`      | Bitwise AND | `&=`                |
| `\|`     | Bitwise OR  | `\|=`               |
| `^`      | Bitwise XOR | `^=`                |
| `~`      | Bitwise NOT | —                   |

```rux
let a: uint8 = 0b0000_1100; // 12
let b: uint8 = 0b0000_1010; // 10

let and = a & b;  // 0b0000_1000 = 8   — bits set in both
let or  = a | b;  // 0b0000_1110 = 14  — bits set in either
let xor = a ^ b;  // 0b0000_0110 = 6   — bits set in exactly one
let not = ~a;     // 0b1111_0011 = 243 — every bit inverted
```

`&`, `|`, and `^` are binary; `~` is unary. The result has the type of the operand(s).

## Operand Types

Both operands of a binary bitwise operation must have the **same type**; mixed-width or signed/unsigned combinations require an explicit [`as`](/docs/operations/type-cast) cast first:

```rux
let wide: uint32 = 0xFF;
let mask: uint8  = 0x0F;

let invalid = wide & mask;             // error: different operand types
let valid = wide & (mask as uint32);   // OK
```

Unsigned integers are the natural home for bit manipulation, since their bits carry no sign. [`bool`](/docs/boolean/bool8#bitwise-operations) also supports `&`, `|`, `^`, and `~` as non-short-circuiting alternatives to the logical operators.

## Common Patterns

Combining a bitwise operator with a [shifted](/docs/operations/shift) mask gives the four standard single-bit operations:

```rux
var flags: uint32 = 0;

flags |= 1 << 3;                      // set bit 3
flags &= ~(1 << 3);                   // clear bit 3
flags ^= 1 << 2;                      // toggle bit 2
let isSet = (flags & (1 << 2)) != 0;  // test bit 2
```

Parenthesise the shift that builds the mask so the grouping is unmistakable.

## Compound Assignment

`&`, `|`, and `^` have compound assignment forms that update a mutable left operand in place:

| Operation   | Compound form | Equivalent expression |
| ----------- | ------------- | --------------------- |
| Bitwise AND | `x &= y`      | `x = x & y`           |
| Bitwise OR  | `x \|= y`     | `x = x \| y`          |
| Bitwise XOR | `x ^= y`      | `x = x ^ y`           |

```rux
var perms: uint8 = 0;
perms |= 0b100;   // grant
perms &= ~0b100;  // revoke
```

## Bitwise vs. Logical

Bitwise `&` and `|` are easy to confuse with [logical](/docs/operations/logical) `&&` and `||`:

- **Bitwise** (`&`, `|`, `^`, `~`) combine the bits of integer values and always evaluate both operands.
- **Logical** (`&&`, `||`, `!`) combine `bool` truth values and short-circuit.

Use logical operators for conditions and bitwise operators for masks and flags.

## Precedence

Unary `~` binds tightest of all operators. Among the binary bitwise operators, AND is tighter than XOR, which is tighter than OR — and all three sit **above** the comparison and logical operators, but **below** [shifts](/docs/operations/shift) and arithmetic:

```
~  >  &  >  ^  >  |  >  comparisons  >  &&  >  ||
```

Because `&` outranks `==`, the test `flags & mask != 0` already groups as `(flags & mask) != 0` — though parentheses make it clearer:

```rux
let isSet = (flags & mask) != 0;
```

See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the complete precedence table.

## See Also

- [Shift Operations](/docs/operations/shift) — `<<` and `>>`, used to build masks
- [Logical Operations](/docs/operations/logical) — `&&`, `||`, `!` for conditions
- [Unsigned Integer Types](/docs/unsigned/uint8#shift-and-bitwise) — per-type bit behaviour
