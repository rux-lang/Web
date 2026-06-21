# `for` / `in`

`for` iterates over the elements of a collection or the values of a range, binding each in turn to the loop variable.

```rux
for item in collection {
    Print(item);
}
```

## Iterating a Collection

A `for` loop walks a [slice](/docs/slices/overview) element by element, in order. The loop variable holds each element directly — no index bookkeeping is required:

```rux
let nums = [1, 2, 3, 4, 5];
var sum = 0;
for n in nums {
    sum += n;
}
```

## Iterating a Range

A **range** generates a sequence of integers. `0..10` is half-open — the end is excluded — while `0..=10` includes the end:

```rux
for i in 0..10 {
    Print(i);   // prints 0 through 9
}

for i in 0..=10 {
    Print(i);   // prints 0 through 10 (inclusive)
}
```

Ranges are the idiomatic way to repeat something a fixed number of times or to walk a collection by index when you need the position.

## Exiting Early

[`break`](/docs/statements/break-continue) leaves the loop immediately; [`continue`](/docs/statements/break-continue) skips to the next element or value.

## See Also

- [`while`](/docs/statements/while) — looping on a condition rather than a sequence
- [Slices](/docs/slices/overview) — the collections `for` iterates over
- [`break` / `continue`](/docs/statements/break-continue) — altering loop control flow
