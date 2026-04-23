# match

`match` performs exhaustive pattern matching. The compiler requires all cases to be covered.

```rux
match status
{
    200 => Print("OK"),
    404 => Print("Not Found"),
    500 => Print("Server Error"),
    _   => Print("Unknown"),
}
```

See [Section 13](pattern-matching) for the full pattern syntax.
