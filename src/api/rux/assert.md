# `Assert`

Checks a condition at run time and aborts if it does not hold.

**Package:** `Rux`

## Signature

```rux
intrinsic func Assert(condition: bool, message: Slice<char8>);
intrinsic func DebugAssert(condition: bool, message: Slice<char8>);
```

## Description

`Assert` evaluates `condition` and, when it is `false`, prints `message` and terminates the program the way [`Panic`](panic) does. It is a compiler intrinsic, so the check is emitted inline rather than called through a library.

`DebugAssert` is the same check, but only in a build with debug assertions enabled (see [`#build.debugAssertions`](build)); in a release build it compiles to nothing, so it carries no run-time cost. Use `Assert` for invariants that must always hold, and `DebugAssert` for expensive checks you only want while developing.

## Example

```rux
import Rux::Assert;

func Main() -> int {
    let count = 3;
    Assert(count > 0, "count must be positive");
    return 0;
}
```

## See also

- [`Rux`](/api/rux/) — the package overview
- [`Panic`](panic) — the unconditional abort `Assert` uses
- [`#build`](build) — whether debug assertions are enabled
