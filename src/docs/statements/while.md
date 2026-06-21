# `while`

`while` repeats its body as long as the condition holds. The condition is tested before each iteration, so the body may run zero times.

```rux
var i = 0;
while i < 10 {
    Print(i);
    i += 1;
}
```

Like every condition, a `while` condition must be a [`bool`](/docs/boolean/bool) and is written without parentheses.

## Exiting Early

Use [`break`](/docs/statements/break-continue) to leave the loop before the condition becomes `false`, and [`continue`](/docs/statements/break-continue) to skip to the next test:

```rux
while true {
    let line = ReadLine();
    if line == "quit" { break; }
    if line == "" { continue; }
    Process(line);
}
```

When a loop is meant to run forever until a `break`, prefer [`loop`](/docs/statements/loop) over `while true` — it states the intent directly.

## See Also

- [`for` / `in`](/docs/statements/for) — when iterating a collection or a counted range
- [`loop`](/docs/statements/loop) — the clearer form of an unconditional loop
- [`break` / `continue`](/docs/statements/break-continue) — altering loop control flow
