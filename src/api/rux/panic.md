# `Panic`

Terminates the program immediately with a message.

**Package:** `Rux`

## Signature

```rux
intrinsic func Panic(message: Slice<char8>);
```

## Description

`Panic` prints `message` and stops the program at once. It does not return. Reach for it on a condition a caller is not expected to recover from — a broken invariant, an unreachable branch, a state the program cannot continue from. For failures a caller *should* handle, return a [`Result`](result) instead.

`Panic` is a compiler intrinsic, so it is available without a run-time library and can be used from the lowest levels of a program.

## Example

```rux
import Rux::Panic;

func Main() -> int {
    let ok = false;
    if !ok {
        Panic("unreachable state reached");
    }
    return 0;
}
```

## See also

- [`Rux`](/api/rux/) — the package overview
- [`Assert`](assert) — a conditional panic on a checked invariant
- [`Result`](result) — the recoverable-error alternative
- [Fatal Errors](/docs/error/fatal) — when to panic versus return an error
