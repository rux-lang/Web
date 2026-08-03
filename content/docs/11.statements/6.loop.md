# `loop`

`loop` creates an unconditional infinite loop. It runs until a [`break`](/docs/statements/break-continue) exits it. Prefer `loop` over `while true` — it states the intent directly and cannot be mistaken for a condition that might change.

```rux
loop {
    let input = ReadLine();
    if input == "quit" { break; }
    Process(input);
}
```

## Labels

A loop can be given a label so that `break` and `continue` target a specific outer loop when loops are nested. A label is a name followed by `:` before the loop:

```rux
outer: loop {
    loop {
        if ShouldStop() { break outer; }
        if ShouldSkip() { continue outer; }
        Step();
    }
    // never reached after `break outer`
}
```

`break outer` exits the labeled loop entirely. `continue outer` skips to the next iteration of the labeled loop. Without a label, `break` and `continue` always act on the innermost loop.

Labels work on any loop — `loop`, [`while`](/docs/statements/while), and [`for`](/docs/statements/for) — not only on `loop`.

## See Also

- [`break` / `continue`](/docs/statements/break-continue) — exiting and skipping iterations
- [`while`](/docs/statements/while) — looping while a condition holds
