# `#Error`

Emits a compilation error.

**Package:** `Rux`

## Signature

```rux
intrinsic func #Error(message: Slice<char8>);
```

## Description

`#Error` stops compilation and reports `message` as a compile-time error. It runs at compile time, not run time, so it is the way to reject an unsupported configuration while the program is being built — most often the `else` arm of a [`when`](/docs/comptime/conditional) over the target, so that an unsupported platform fails to build rather than misbehaving.

## Example

```rux
import Rux::{ #target, #Error };

when #target.os {
    .Linux => { /* ... */ },
    .Windows => { /* ... */ },
    else => #Error("Unsupported operating system")
}
```

## See also

- [`Rux`](/api/rux/) — the package overview
- [`#Warn`](warn) — report a compile-time warning without stopping the build
- [`#target`](target) — the target that is usually being checked
- [Conditional Compilation](/docs/comptime/conditional) — `when` and the build context
