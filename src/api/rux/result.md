# `Result`

The return type of an operation that can fail.

**Package:** `Rux`

## Definition

```rux
enum Result<T, E> {
    Success(T),
    Error(E)
}
```

A `Result<T, E>` holds either a `Success` carrying the value `T` an operation produced, or an `Error` carrying the failure `E`. Because the error is part of the return type, a caller cannot read the value without acknowledging that the call might have failed — the usual way is to [`match`](/docs/statements/match) on the two variants.

```rux
import Rux::Result;

match ParseInt64("42") {
    .Success(n) => PrintLine(n),
    .Error(e) => PrintLine("bad input")
}
```

`Result` is the recoverable-error half of Rux's error model; for conditions a caller is not expected to recover from, see [`Panic`](panic).

## See also

- [`Rux`](/api/rux/) — the package overview
- [The `Result` Type](/docs/error/result) — the language-reference treatment
- [`match`](/docs/statements/match) — destructuring `Success` and `Error`
- [`Panic`](panic) — for unrecoverable errors
