# #Error

Emits a compilation error.

**Package:** `Rux`

## Signature

```rux
intrinsic func #Error(message: Slice<char8>);
```

## Description

`#Error` stops compilation and reports `message` as a compile-time error. It runs at compile time, not run time, so it is the way to reject an unsupported configuration while the program is being built — most often the `else` arm of a [`when`](/docs/lang/comptime/conditional) over the target, so that an unsupported platform fails to build rather than misbehaving.

## Example

```rux
import Core::{ #target, #Error };

when #target.os {
    .Linux => { /* ... */ },
    .Windows => { /* ... */ },
    else => #Error("Unsupported operating system")
}
```

## See also

- [`Core`](/docs/api/core) — the package overview
- [`#Warn`](/docs/api/core/warn) — report a compile-time warning without stopping the build
- [`#target`](/docs/api/core/target) — the target that is usually being checked
- [Conditional Compilation](/docs/lang/comptime/conditional) — `when` and the build context
