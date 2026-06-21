# Pointers and `extern`

Pointers are the primary way Rux exchanges memory with C and other native libraries. Typed pointers, `*const` for read-only buffers, and `*opaque` for handles all map directly onto C pointer types.

```rux
extern func memcpy(dst: *opaque, src: *const opaque, n: uint) -> *opaque;

let src = [1, 2, 3, 4];
var dst: int32[4];
memcpy(dst.data, src.data, sizeof(int32) * src.length);
```

Pass a buffer by handing the callee its `data` pointer and `length`; the address identifies the first byte and the length bounds the access. Because C strings are null-terminated and Rux [slices](/docs/slices/overview) are not, account for the terminator explicitly when crossing the boundary.

See the [Foreign Function Interface](/docs/ffi/overview) chapter for more on calling native code.

## See Also

- [Pointers](/docs/pointers/overview) — addresses and how a pointer is stored
- [Pointer Types](/docs/pointers/types) — `*const` and `*opaque`, which map onto C pointer types
- [Foreign Function Interface](/docs/ffi/overview) — declaring and calling native functions
