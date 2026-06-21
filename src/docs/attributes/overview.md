# Attributes

An attribute attaches metadata to a declaration, written as `@[Name(...)]` on the line before the item it annotates. Attributes instruct the compiler — to link a foreign library, restrict an item to one platform, or flag a function at its call sites — without changing the declaration's own code.

```rux
@[Target("Windows")]
@[Import(lib: "Kernel32.dll")]
extern func Beep(freq: uint32, duration: uint32) -> bool32;
```

Multiple attributes may be **stacked** before a single declaration; each applies independently.

## Available Attributes

| Attribute                                  | Purpose                                                  |
| ------------------------------------------ | ------------------------------------------------------- |
| [`@[Import]`](/docs/attributes/import)     | Link an `extern` function to a dynamic library           |
| [`@[Target]`](/docs/attributes/target)     | Restrict a declaration to a specific operating system    |
| [`@[Warn]`](/docs/attributes/warn)         | Emit a compiler warning at every call site               |
| [`@[Error]`](/docs/attributes/error)       | Emit a compiler error at every call site                 |

## See Also

- [Foreign Function Interface](/docs/ffi/overview) — where `@[Import]` is used
- [Functions](/docs/functions/overview) — the declarations attributes most often annotate
