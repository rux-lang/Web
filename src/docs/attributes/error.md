# Error

Emits a compiler **error** at every call site of the annotated function. The build fails at any point where the function is called. Use this to intentionally block usage of a function — for example, to enforce that a stub or platform-unsupported path is never called.

## Syntax

```rux
@[Error("Function is not implemented")]
func DoSomething() {
    // Implementation
}
```

## Examples

### Unsupported platform stub

```rux
@[Target("Windows")]
func OpenDisplay() -> *opaque {
    // real Windows implementation
    return null;
}

@[Target("Linux")]
@[Error("OpenDisplay is not supported on Linux in this build")]
func OpenDisplay() -> *opaque {
    return null;
}
```

Calling `OpenDisplay()` on a Linux build produces:

```
error: OpenDisplay is not supported on Linux in this build
```

### Removed API

```rux
@[Error("Connect() was removed; use ConnectAsync() instead")]
func Connect(host: char8[], port: uint16) -> bool {
    return false;
}
```

Any call to `Connect()` is a compile-time error, ensuring all callers are migrated before the code can build.
