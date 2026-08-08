# #Warn

Emits a compilation warning.

**Package:** `Rux`

## Signature

```rux
intrinsic func #Warn(message: Slice<char8>);
```

## Description

`#Warn` reports `message` as a compile-time warning and lets compilation continue. Use it to flag a questionable but permitted configuration — a deprecated path, an untested target — without failing the build the way [`#Error`](/docs/api/core/error) does.

## Example

```rux
import Core::{ #target, #Warn };

when #target.arch {
    .X86_64 => { /* optimized path */ },
    else => #Warn("using the portable fallback for this architecture")
}
```

## See also

- [`Core`](/docs/api/core) — the package overview
- [`#Error`](/docs/api/core/error) — stop the build instead of warning
- [Conditional Compilation](/docs/lang/comptime/conditional) — `when` and the build context
