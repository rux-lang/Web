# `Error`

Emits a compiler **error** at every call site of the annotated function. The build fails at any point where the function is called. Use it to intentionally block usage of a function — for example, to enforce that a stub or unsupported path is never called.

## Syntax

```rux
#Error("Function is not implemented")
func DoSomething() {
    // Implementation
}
```

## Examples

### Unsupported-platform stub

Pair `#Error` with [conditional compilation](/docs/comptime/conditional) so a platform that lacks an implementation fails at the call site rather than at link time:

```rux
import Rux::{ #target };

when #target.os == .Windows {
    func OpenDisplay() -> *opaque {
        // real Windows implementation
        return null;
    }
} else {
    #Error("OpenDisplay is not supported on this platform")
    func OpenDisplay() -> *opaque {
        return null;
    }
}
```

Calling `OpenDisplay()` on a non-Windows build produces:

```
error: OpenDisplay is not supported on this platform
```

### Removed API

```rux
#Error("Connect() was removed; use ConnectAsync() instead")
func Connect(host: Slice<char8>, port: uint16) -> bool {
    return false;
}
```

Any call to `Connect()` is a compile-time error, ensuring all callers are migrated before the code can build.

## See Also

- [`#Warn`](/docs/attributes/warn) — flag usage without breaking the build
- [Conditional Compilation](/docs/comptime/conditional) — selecting per-platform implementations
- [Attributes](/docs/attributes/overview) — the full attribute set
