# Operators and Punctuation

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
| `<<`     | Left shift  |
| `>>`     | Right shift |

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

## Range Operators
| Operator | Equivalent to                                 |
| -------- | --------------------------------------------- |
| `a..b`   | Range from `a` (inclusive) to `b` (exclusive) |
| `a..=b`  | Same as `a..b` but `b` is inclusive           |

## Function Operators
| Operator | Equivalen to                                    |
| -------- | ----------------------------------------------- |
| `a...`   | [Spread Operator](../functions#spread-operator) |

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
| 1 (highest) | Unary `!` `~` `-`                                        |
| 2           | `**`                                                     |
| 3           | `*` `/` `%`                                              |
| 4           | `+` `-`                                                  |
| 5           | `<<` `>>`                                                |
| 6           | `&`                                                      |
| 7           | `^`                                                      |
| 8           | `\|`                                                     |
| 9           | `==` `!=` `<` `<=` `>` `>=`                              |
| 10          | `&&`                                                     |
| 11          | `\|\|`                                                   |
| 12          | `as` `is`                                                |
| 13 (lowest) | `=` `+=` `-=` `*=` `/=` `%=` `&=` `\|=` `^=` `<<=` `>>=` |

Use parentheses to override precedence explicitly.
