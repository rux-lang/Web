# Pattern Matching

`match` expressions support rich pattern syntax.

```rux
// Literal patterns
match code {
    0    => Print("zero"),
    1..9 => Print("single digit"),
    _    => Print("other"),
}

// Enum destructuring
match event {
    Event.Click(x, y)  => HandleClick(x, y),
    Event.KeyPress(key) => HandleKey(key),
    Event.Quit          => Exit(),
}

// Struct destructuring
match point {
    Point { x: 0, y: 0 } => Print("origin"),
    Point { x, y }        => Print(x, y),
}

// Guards
match temperature {
    t if t < 0.0   => Print("freezing"),
    t if t < 20.0  => Print("cold"),
    t if t < 30.0  => Print("comfortable"),
    _               => Print("hot"),
}
```

The wildcard `_` matches any value and discards it. Patterns are checked in order; the first matching arm executes.
