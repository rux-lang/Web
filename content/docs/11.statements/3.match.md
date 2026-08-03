# `match`

`match` compares a value against a series of **patterns** and runs the first arm that matches. It is exhaustive: the compiler requires every possible value to be covered, so a `match` can never silently fall through.

```rux
match status {
    200 => Print("OK"),
    404 => Print("Not Found"),
    500 => Print("Server Error"),
    _   => Print("Unknown"),
}
```

Each arm is written `pattern => body,`. Patterns are checked top to bottom, and the first match wins.

## Patterns

A pattern can be a literal, a range, or a destructuring of an [`enum`](/docs/enums/overview) variant or a [`struct`](/docs/structs/overview):

```rux
// Literal and range patterns
match code {
    0    => Print("zero"),
    1..9 => Print("single digit"),
    _    => Print("other"),
}

// Enum destructuring — bind the variant's data
match event {
    Event::Click(x, y)   => HandleClick(x, y),
    Event::KeyPress(key) => HandleKey(key),
    Event::Quit          => Exit(),
}

// Struct destructuring — match and bind fields
match point {
    Point { x: 0, y: 0 } => Print("origin"),
    Point { x, y }       => Print(x, y),
}
```

## Guards

Add `if <condition>` to an arm to match only when an extra condition also holds. Guarded arms are tested in order, so list the most specific first:

```rux
match temperature {
    t if t < 0.0   => Print("freezing"),
    t if t < 20.0  => Print("cold"),
    t if t < 30.0  => Print("comfortable"),
    _              => Print("hot"),
}
```

## The Wildcard

The wildcard `_` matches any value and discards it. It is the usual way to satisfy exhaustiveness for all remaining cases:

```rux
match code {
    0 => Print("ok"),
    _ => Print("error"),
}
```

## `match` as an Expression

A `match` can produce a value. Used this way, every arm must yield a value of the same type, and the result can be bound directly:

```rux
let label = match status {
    200 => "OK",
    404 => "Not Found",
    _   => "Unknown",
};
```

## See Also

- [`if` / `else`](/docs/statements/if) — simpler branching for one or two cases
- [Type Tests](/docs/operations/type-test) — `is` for a single type check without exhaustiveness
- [Enumerations](/docs/enums/overview) — the tagged values `match` most often destructures
