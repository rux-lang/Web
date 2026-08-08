# Panic

Terminates the program immediately with a message.

**Package:** `Rux`

## Signature

```rux
intrinsic func Panic(message: Slice<char8>);
```

## Description

`Panic` prints `message` and stops the program at once. It does not return. Reach for it on a condition a caller is not expected to recover from — a broken invariant, an unreachable branch, a state the program cannot continue from. For failures a caller _should_ handle, return a [`Result`](/docs/api/core/result) instead.

`Panic` is a compiler intrinsic, so it is available without a run-time library and can be used from the lowest levels of a program.

## Example

```rux
import Core::Panic;

func Main() -> int {
    let ok = false;
    if !ok {
        Panic("unreachable state reached");
    }
    return 0;
}
```

## See also

- [`Core`](/docs/api/core) — the package overview
- [`Assert`](/docs/api/core/assert) — a conditional panic on a checked invariant
- [`Result`](/docs/api/core/result) — the recoverable-error alternative
- [Fatal Errors](/docs/lang/error/fatal) — when to panic versus return an error
