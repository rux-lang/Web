# Attributes

An attribute attaches metadata to a declaration, written as an `#Name(...)` **attribute call** on the line before the item it annotates. Attributes instruct the compiler — to link a foreign library, fix a calling convention, or flag a function at its call sites — without changing the declaration's own code.

```rux
#Link("Kernel32.dll")
extern func Beep(freq: uint32, duration: uint32) -> bool32;
```

Multiple attributes may be **stacked** before a single declaration; each applies independently.

```rux
#NoReturn()
#Warn("prefer Exit(); Abort() skips destructors")
func Abort();
```

## Available Attributes

| Attribute                                    | Purpose                                                    |
| -------------------------------------------- | ---------------------------------------------------------- |
| [`#Link`](/docs/attributes/link)             | Link an `extern` function to a native library              |
| [`#Abi`](/docs/attributes/abi)               | Select a declaration's calling convention                  |
| [`#Warn`](/docs/attributes/warn)             | Emit a compiler warning at every call site                 |
| [`#Error`](/docs/attributes/error)           | Emit a compiler error at every call site                   |
| [`#NoReturn`](/docs/attributes/noreturn)     | Declare that a function never returns to its caller         |
| [`#Allow`](/docs/attributes/allow)           | Suppress a specific lint on the declaration                 |

## Not an Attribute: Platform Selection

Restricting code to an operating system is **not** an attribute. Use [conditional compilation](/docs/comptime/conditional) instead — `when #target.os == .Windows { ... }` — which removes the untaken code before analysis rather than annotating a declaration.

## See Also

- [Conditional Compilation](/docs/comptime/conditional) — the replacement for platform attributes
- [Foreign Function Interface](/docs/ffi/overview) — where `#Link` is used
- [Functions](/docs/functions/overview) — the declarations attributes most often annotate
