# Logical Operations

Logical operations combine or invert boolean expressions. They are commonly used in conditions for `if`, `while`, and pattern guards.

## Operators

| Operator | Operation   | Result                                     |
| -------- | ----------- | ------------------------------------------ |
| `&&`     | Logical AND | `true` when both operands are `true`       |
| `\|\|`   | Logical OR  | `true` when at least one operand is `true` |
| `!`      | Logical NOT | The inverse of the operand's logical value |

```rux
let isReady = true;
let hasWork = false;

let shouldRun = isReady && hasWork;  // false
let canWait = isReady || hasWork;    // true
let isBlocked = !isReady;            // false
```

Logical operands must be boolean values. Numeric values are not accepted as conditions without an explicit comparison:

```rux
let count = 3;

if count { }       // error: count is not bool
if count != 0 { }  // valid
```

## Short-Circuit Evaluation

Logical AND and OR evaluate from left to right and short-circuit.

- `left && right` does not evaluate `right` when `left` is `false`.
- `left || right` does not evaluate `right` when `left` is `true`.

```rux
if index < values.length && values[index] == target {
    Print("found");
}
```

Here `values[index]` is evaluated only when `index` is within the checked range. Short-circuiting also avoids unnecessary function calls:

```rux
if IsEnabled() && LoadConfiguration() {
    Start();
}
```

`LoadConfiguration()` is called only when `IsEnabled()` returns `true`.

## Logical NOT

Logical NOT is a unary operator and binds more tightly than comparison, logical AND, and logical OR:

```rux
let allowed = !isBlocked && hasPermission;
```

Parentheses can make a compound negation clearer:

```rux
let unavailable = !(isOnline && isReady);
```

## Logical vs. Bitwise

Logical operators short-circuit and operate on truth values. Bitwise operators (`&`, `|`, `^`, and `~`) operate on individual bits and evaluate all operands.

Use `&&`, `||`, and `!` for conditions:

```rux
if isReady && hasWork {
    Run();
}
```

Use bitwise operators for masks and packed flags. See [Bitwise Operations](/docs/operations/bitwise) for `&`, `|`, `^`, and `~`, and [Shift Operations](/docs/operations/shift) for related bit manipulation.

## Precedence

Logical NOT has higher precedence than comparisons. Logical AND has higher precedence than logical OR:

```rux
let result = !a || b && c;
// Equivalent to: (!a) || (b && c)
```

See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the complete precedence table.

## See Also

- [Comparison Operations](/docs/operations/comparison) — producing the boolean operands
- [Bitwise Operations](/docs/operations/bitwise) — the non-short-circuiting `&`, `|`, `^`, `~`
- [Boolean Types](/docs/boolean/bool) — the `bool` type these operators consume and produce
