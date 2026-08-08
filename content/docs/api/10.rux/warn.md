# #Warn

Emits a compilation warning.

**Package:** `Rux`

## Signature

```rux
intrinsic func #Warn(message: Slice<char8>);
```

## Description

`#Warn` reports `message` as a compile-time warning and lets compilation continue. Use it to flag a questionable but permitted configuration — a deprecated path, an untested target — without failing the build the way [`#Error`](/docs/api/rux/error) does.

## Example

```rux
import Rux::{ #target, #Warn };

when #target.arch {
    .X86_64 => { /* optimized path */ },
    else => #Warn("using the portable fallback for this architecture")
}
```

## See also

- [`Rux`](/docs/api/rux) — the package overview
- [`#Error`](/docs/api/rux/error) — stop the build instead of warning
- [Conditional Compilation](/docs/comptime/conditional) — `when` and the build context
