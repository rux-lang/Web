# Slices and Pointers

A slice's [header](/docs/slices/overview#memory-layout) exposes its `data` pointer and `length` directly, which is what makes low-level and foreign-code access possible without copying.

## Reaching the Backing Memory

A slice's `data` field is a regular `*T` pointer. You can pass it to [`extern`](/docs/pointers/extern) functions or perform [pointer arithmetic](/docs/pointers/arithmetic) on it when low-level access is needed:

```rux
extern func memcpy(dst: *opaque, src: *const opaque, n: uint) -> *opaque;

let src = [1, 2, 3, 4];
let dst: uint8[4];
memcpy(dst.data, src.data, src.length);
```

Passing `data` hands the callee the address of the first element; passing `length` tells it how many elements are valid. The two are always used together — a pointer without its length cannot be bounded safely.

## `sizeof` and Element Size

`sizeof(T)` returns the size of a single element in bytes. Multiply by `length` to get the total byte size of the backing buffer — for example, when telling a C API how many bytes to read or copy:

```rux
let buf: float64[8];
let byteSize = sizeof(float64) * buf.length;   // 64
```

Note that `length` counts **elements**, not bytes; only after multiplying by `sizeof(T)` do you get a byte count.

## See Also

- [Slices](/docs/slices/overview) — the slice overview and memory layout
- [Pointer Arithmetic](/docs/pointers/arithmetic) — advancing a pointer by element size
- [Pointers and `extern`](/docs/pointers/extern) — exchanging memory with native code
