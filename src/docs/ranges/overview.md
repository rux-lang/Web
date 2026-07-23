# Ranges

A **range** describes an interval between two bounds. It is written with the `..` and `..=` operators and used mainly to drive a [`for`](/docs/statements/for) loop or to take a [sub-slice](/docs/arrays/slicing#sub-slicing-with-a-range) of an array. A range is an ordinary value — it can be stored in a variable and its bounds read back.

```rux
for i in 0..5 {
    Print(i);   // 0, 1, 2, 3, 4
}
```

## The Six Forms

The **start is inclusive**; whether the **end** is included depends on the operator — `..` excludes it (half-open), `..=` includes it. Either bound may be omitted:

| Syntax  | Meaning                          | Type                 |
| ------- | -------------------------------- | -------------------- |
| `a..b`  | `a` up to, **excluding** `b`     | `Range`              |
| `a..=b` | `a` up to, **including** `b`     | `RangeInclusive`     |
| `a..`   | `a` onward, no upper bound        | `RangeFrom`          |
| `..b`   | up to, **excluding** `b`          | `RangeTo`            |
| `..=b`  | up to, **including** `b`          | `RangeToInclusive`   |
| `..`    | everything                        | `RangeFull`          |

The bound type parameterises the range, so `0..10` has type `Range<int>` and `'a'..='z'` has type `RangeInclusive<char8>`.

```rux
let count = 0..10;    // Range<int> — 0,1,…,9
let upto  = 0..=10;   // RangeInclusive<int> — 0,1,…,10
```

## Reading the Bounds

A range that carries a bound exposes it as a field: `.start` for the lower bound and `.end` for the upper. The forms without that bound do not have the field.

```rux
let r = 5..12;
let lo = r.start;   // 5
let hi = r.end;     // 12
```

`..`, `..b`, and `..=b` have no `.start`; `..`, `a..` have no `.end`.

## What Ranges Are For

| Use                                                              | Example              |
| --------------------------------------------------------------- | -------------------- |
| [Iterating](/docs/ranges/usage#iteration) a counted loop         | `for i in 0..n`      |
| [Sub-slicing](/docs/ranges/usage#slicing) an array or slice      | `data[1..4]`         |

Both are covered in [Using Ranges](/docs/ranges/usage).

## See Also

- [Using Ranges](/docs/ranges/usage) — ranges in `for` loops and slicing
- [`for` / `in`](/docs/statements/for) — the loop a range most often drives
- [Arrays as Slices](/docs/arrays/slicing) — taking a sub-slice with a range
