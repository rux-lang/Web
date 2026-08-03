# Extern Declarations

The `extern` keyword declares functions that are defined outside Rux — typically in C / C++ libraries.

```rux
extern func malloc(size: uint) -> *opaque;
extern func free(ptr: *opaque);
```

Multiple declarations from the same library can be grouped in one `extern` block.

```rux
extern {
    func malloc(size: uint) -> *opaque;
    func realloc(ptr: *opaque, size: uint) -> *opaque;
    func free(ptr: *opaque);
}
```

Foreign functions exchange data through [pointers](/docs/pointers/overview): `*opaque` for handles, `*T` for read-only buffers, and `*var T` for buffers the callee may write to.

## See Also

- [Linking Libraries](/docs/ffi/import) — binding an `extern` declaration to a library with `#Link`
- [Pointers and `extern`](/docs/pointers/extern) — the pointer types crossing the boundary
- [Pointer Types](/docs/pointers/types) — `*opaque`, `*T`, and `*var T`
