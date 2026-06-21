# Arithmetic Operations

Arithmetic operations calculate numeric values. Rux supports arithmetic on integer and floating-point types. Both operands of a binary operation must have the same type; mixed-type expressions require an explicit conversion with `as`.

## Operators

| Operator | Operation      | Example  |
| -------- | -------------- | -------- |
| `+`      | Addition       | `a + b`  |
| `-`      | Subtraction    | `a - b`  |
| `*`      | Multiplication | `a * b`  |
| `/`      | Division       | `a / b`  |
| `%`      | Remainder      | `a % b`  |
| `**`     | Exponentiation | `a ** b` |
| `-`      | Unary negation | `-a`     |

```rux
let a: int32 = 10;
let b: int32 = 3;

let sum = a + b;         // 13
let difference = a - b;  // 7
let product = a * b;     // 30
let quotient = a / b;    // 3
let remainder = a % b;   // 1
let power = a ** b;      // 1000
let negative = -a;       // -10
```

The result has the same type as the operands.

## Type Rules

Rux does not implicitly convert between numeric types:

```rux
let count: int32 = 10;
let scale: int64 = 2;

let invalid = count * scale;           // error: different operand types
let valid = (count as int64) * scale;  // int64
```

Unsigned integers do not support unary negation. Character and boolean types do not support arithmetic operations directly.

## Integer Division and Remainder

Integer division truncates toward zero. The remainder takes the sign of the dividend:

```rux
let q1 = 7 / 2;    // 3
let q2 = -7 / 2;   // -3
let r1 = 7 % 2;    // 1
let r2 = -7 % 2;   // -1
```

Integer division or remainder by zero is an error.

## Floating-Point Arithmetic

Floating-point operations follow IEEE 754 semantics. Division by zero produces infinity or `NaN` rather than an integer-style division error:

```rux
let positiveInfinity = 1.0 / 0.0;
let notANumber = 0.0 / 0.0;
```

See [Floating-Point Types](/docs/floating/float64#arithmetic) for precision, rounding, and special-value behavior.

## Compound Assignment

The common arithmetic operators have compound assignment forms:

| Operation      | Compound form | Equivalent expression |
| -------------- | ------------- | --------------------- |
| Addition       | `x += y`      | `x = x + y`           |
| Subtraction    | `x -= y`      | `x = x - y`           |
| Multiplication | `x *= y`      | `x = x * y`           |
| Division       | `x /= y`      | `x = x / y`           |
| Remainder      | `x %= y`      | `x = x % y`           |

The left operand must be mutable:

```rux
var total = 10;
total += 5;
total *= 2;  // 30
```

## Precedence

Exponentiation binds more tightly than multiplication, division, and remainder. Those operators bind more tightly than addition and subtraction. Use parentheses when the intended order is not obvious:

```rux
let first = 2 + 3 * 4;     // 14
let second = (2 + 3) * 4;  // 20
```

See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the complete precedence table.

## See Also

- [Comparison Operations](/docs/operations/comparison) — relating numeric results
- [Type Casts](/docs/operations/type-cast) — converting between numeric types with `as`
- [Floating-Point Types](/docs/floating/float64) — precision, rounding, and special values
