# Tuples vs. Structs

Tuples and [structs](/docs/structs/overview) both group several values into one. The difference is how the parts are identified: a tuple's elements are **positional and anonymous**, while a struct's fields are **named**.

## When a Tuple Fits

Reach for a tuple when the grouping is small, local, and self-evident — typically returning two or three closely related values:

```rux
func Divide(a: int, b: int) -> (int, int) {
    return (a / b, a % b);   // quotient and remainder
}

let (q, r) = Divide(17, 5);
```

Here the meaning of each position is obvious at the call site, and a named type would add ceremony without adding clarity.

## When to Prefer a Struct

Nothing at the call site says what each tuple position means. When a tuple would accumulate more than two or three elements, or when the meaning of a position is not obvious, prefer a [`struct`](/docs/structs/overview) with named fields:

```rux
// Hard to read at the call site — what do the three values mean?
func Parse(src: char8[]) -> (int, int, bool) { /* … */ }

// Self-documenting
struct ParseResult {
    line: int;
    column: int;
    ok: bool;
}

func Parse(src: char8[]) -> ParseResult { /* … */ }
```

A struct also lets the type be named, reused, given [methods](/docs/structs/methods), and extended with new fields without rewriting every call site.

## Rule of Thumb

| Use a tuple when…                                  | Use a struct when…                              |
| -------------------------------------------------- | ----------------------------------------------- |
| Two or three values, meaning obvious from context  | Several fields, or meanings that need labels    |
| Grouping is local and short-lived                  | The type is reused across the codebase          |
| No behaviour is attached                            | The type needs methods or operators             |

## See Also

- [Tuples](/docs/tuples/overview) — the tuple overview
- [Structures](/docs/structs/overview) — named aggregates with typed fields
- [Methods](/docs/structs/methods) — attaching behaviour to a struct
