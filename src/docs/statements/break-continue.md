# `break` and `continue`

`break` and `continue` alter the flow of a loop:

- `break` exits the innermost loop immediately.
- `continue` skips the rest of the current iteration and moves on — re-evaluating the condition in a [`while`](/docs/statements/while), or advancing to the next element in a [`for`](/docs/statements/for).

```rux
while true {
    let input = ReadLine();
    if input == "quit" { break; }     // leave the loop
    if input == "" { continue; }      // skip blank lines
    Process(input);
}
```

## Targeting an Outer Loop

By default both act on the innermost enclosing loop. To affect an outer loop instead, give that loop a label and name it: `break label` or `continue label` (see [Labels](/docs/statements/loop#labels)):

```rux
outer: for row in rows {
    for cell in row {
        if cell == target { break outer; }   // exit both loops
    }
}
```

## See Also

- [`loop`](/docs/statements/loop) — infinite loops and how labels are declared
- [`while`](/docs/statements/while) — looping on a condition
- [`for` / `in`](/docs/statements/for) — iterating a collection or range
