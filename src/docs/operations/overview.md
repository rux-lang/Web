# Operations

An operation combines one or more values with an **operator** to produce a result. Rux groups its operators into the categories below; each has a dedicated page with the full operator list, semantics, and examples.

| Category                                            | Operators                          | Result                          |
| --------------------------------------------------- | ---------------------------------- | ------------------------------- |
| [Arithmetic](/docs/operations/arithmetic)            | `+` `-` `*` `/` `%` `**`           | A numeric value                 |
| [Comparison](/docs/operations/comparison)            | `==` `!=` `<` `<=` `>` `>=`        | A [`bool`](/docs/boolean/bool)  |
| [Logical](/docs/operations/logical)                  | `&&` `\|\|` `!`                    | A [`bool`](/docs/boolean/bool)  |
| [Bitwise](/docs/operations/bitwise)                  | `&` `\|` `^` `~`                   | An integer (per-bit) value      |
| [Shift](/docs/operations/shift)                      | `<<` `>>`                          | An integer value                |
| [Type Casts](/docs/operations/type-cast)             | `as`                               | The value in the target type    |
| [Type Tests](/docs/operations/type-test)             | `is`                               | A [`bool`](/docs/boolean/bool)  |

## A Shared Rule: No Implicit Conversion

Across every category, Rux never converts between distinct types on your behalf. The operands of a binary operation must already share a type; when they differ, convert one side explicitly with the [`as`](/docs/operations/type-cast) cast:

```rux
let count: int32 = 10;
let scale: int64 = 2;

let invalid = count * scale;            // error: different operand types
let valid = (count as int64) * scale;   // int64
```

This rule keeps the type of every expression visible in the source rather than hidden behind silent promotions.

## Precedence

When several operators appear in one expression, **precedence** decides the grouping — for example `**` binds tighter than `*`, which binds tighter than `+`. Each page summarises the precedence relevant to its operators; the [Operator Precedence](/docs/lexical/operators#operator-precedence) table lists every level in one place. Use parentheses whenever the intended order is not obvious.

## See Also

- [Operators and Punctuation](/docs/lexical/operators) — the complete operator and precedence reference
- [Type Casts](/docs/operations/type-cast) — the `as` operator used throughout this chapter
