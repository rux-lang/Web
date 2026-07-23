# Ranges

The range types produced by the range operators.

**Package:** `Rux`

Each range operator builds one of these structs. A range with a start is iterable in a [`for`](/docs/statements/for) loop; every range can slice a collection.

## Definitions

```rux
struct Range<T> {            // a..b   — start up to, excluding, end
    start: T;
    end: T;
}

struct RangeInclusive<T> {   // a..=b  — start up to, including, end
    start: T;
    end: T;
}

struct RangeFrom<T> {        // a..    — start onward
    start: T;
}

struct RangeTo<T> {          // ..b    — up to, excluding, end
    end: T;
}

struct RangeToInclusive<T> { // ..=b   — up to, including, end
    end: T;
}

struct RangeFull {}          // ..     — the whole extent
```

| Type                 | Operator | Bounds                          | Iterable |
| -------------------- | -------- | ------------------------------- | :------: |
| `Range<T>`           | `a..b`   | `start` inclusive, `end` exclusive | ✓     |
| `RangeInclusive<T>`  | `a..=b`  | both inclusive                  | ✓        |
| `RangeFrom<T>`       | `a..`    | `start` inclusive, unbounded end | ✓       |
| `RangeTo<T>`         | `..b`    | unbounded start, `end` exclusive | —       |
| `RangeToInclusive<T>`| `..=b`   | unbounded start, `end` inclusive | —       |
| `RangeFull`          | `..`     | the whole extent                | —        |

The start-bearing ranges (`Range`, `RangeInclusive`, `RangeFrom`) can drive a `for` loop; the startless ones are for slicing only.

## See also

- [`Rux`](/api/rux/) — the package overview
- [Ranges](/docs/ranges/overview) — the language-reference treatment
- [`Slice`](slice) — what range-indexing a collection yields
