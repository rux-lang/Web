# Operators

## Arithmetic Operators

| Operator | Operation      |
| -------- | -------------- |
| `+`      | Addition       |
| `-`      | Subtraction    |
| `*`      | Multiplication |
| `/`      | Division       |
| `%`      | Remainder      |
| `**`     | Exponentiation |

## Bitwise Operators

| Operator | Operation   |
| -------- | ----------- |
| `&`      | Bitwise AND |
| `\|`     | Bitwise OR  |
| `^`      | Bitwise XOR |
| `~`      | Bitwise NOT |
| `<<`     | Left shift          |
| `>>`     | Right shift (arithmetic on signed, logical on unsigned) |
| `>>>`    | Logical right shift (signed integers only)              |

## Logical Operators

| Operator | Operation   |
| -------- | ----------- |
| `&&`     | Logical AND |
| `\|\|`   | Logical OR  |
| `!`      | Logical NOT |

## Comparison Operators

| Operator | Operation             |
| -------- | --------------------- |
| `==`     | Equal                 |
| `!=`     | Not equal             |
| `<`      | Less than             |
| `<=`     | Less than or equal    |
| `>`      | Greater than          |
| `>=`     | Greater than or equal |

## Assignment Operators

| Operator | Equivalent to    |
| -------- | ---------------- |
| `=`      | Plain assignment |
| `+=`     | `x = x + rhs`    |
| `-=`     | `x = x - rhs`    |
| `*=`     | `x = x * rhs`    |
| `/=`     | `x = x / rhs`    |
| `%=`     | `x = x % rhs`    |
| `&=`     | `x = x & rhs`    |
| `\|=`    | `x = x \| rhs`   |
| `^=`     | `x = x ^ rhs`    |
| `<<=`    | `x = x << rhs`   |
| `>>=`    | `x = x >> rhs`   |
| `>>>=`   | `x = x >>> rhs`  |

## Memory Operators

| Operator | Meaning                                                 |
| -------- | ------------------------------------------------------- |
| `@`      | Address-of: `@value` yields a pointer `*T` to the value |
| `*`      | Dereference: `*ptr` reads or writes the pointed-to value |

```rux
var x = 42;
let p = @x;      // *int32 — address of x
let y = *p;      // 42     — read through the pointer
*p = 7;          // write through the pointer; x == 7
```

The address-of operand must be addressable — a variable, field, or slice element — not a temporary. See [Address-of and Dereference](/docs/pointers/overview#address-of-and-dereference).

## Type Operators

| Operator | Meaning                                         |
| -------- | ----------------------------------------------- |
| `as`     | Type cast: `value as TargetType`                |
| `is`     | Type test: `value is SomeType` (returns `bool`) |

```rux
let n: int64 = bigValue as int64;
if shape is Circle
{
    Print("It's a circle");
}
```

## Operator Precedence

From highest to lowest precedence:

| Level       | Operators                                                |
| ----------- | -------------------------------------------------------- |
| 1 (highest) | Unary `!` `~` `-` `@` `*`                                |
| 2           | `as` `is`                                                |
| 3           | `**`                                                     |
| 4           | `*` `/` `%`                                              |
| 5           | `+` `-`                                                  |
| 6           | `<<` `>>` `>>>`                                          |
| 7           | `&`                                                      |
| 8           | `^`                                                      |
| 9           | `\|`                                                     |
| 10          | `==` `!=` `<` `<=` `>` `>=`                              |
| 11          | `&&`                                                     |
| 12          | `\|\|`                                                   |
| 13 (lowest) | `=` `+=` `-=` `*=` `/=` `%=` `&=` `\|=` `^=` `<<=` `>>=` `>>>=` |

Use parentheses to override precedence explicitly.
