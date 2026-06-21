# `if` / `else`

`if` runs its block when the condition is `true`. Add `else if` to test further conditions, and a final `else` to handle everything that remains. The first matching block runs; the rest are skipped.

```rux
if x > 0 {
    Print("positive");
} else if x < 0 {
    Print("negative");
} else {
    Print("zero");
}
```

The braces are always required, even for a single statement, and the condition is written without parentheses.

## The Condition Is a `bool`

An `if` condition must be a [`bool`](/docs/boolean/bool). Numbers and pointers are not implicitly truthy, so test them explicitly:

```rux
if count { }       // error: count is not a bool
if count != 0 { }  // OK
```

Combine several tests with the [logical operators](/docs/operations/logical) `&&`, `||`, and `!`:

```rux
if age >= 18 && hasTicket {
    Admit();
}
```

The [`is`](/docs/operations/type-test) type test also produces a `bool`, so it reads naturally as a condition:

```rux
if shape is Circle {
    let circle = shape as Circle;
    Print(circle.radius);
}
```

## See Also

- [`match`](/docs/statements/match) — prefer it when branching exhaustively over many cases
- [Logical Operations](/docs/operations/logical) — building compound conditions
- [Type Tests](/docs/operations/type-test) — using `is` in a condition
