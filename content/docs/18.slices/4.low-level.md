# Slices and Pointers

A slice's [header](/docs/slices/overview#memory-layout) exposes its `data` pointer and `length` directly, which is what makes low-level and foreign-code access possible without copying. An [array](/docs/arrays/overview) exposes the same two fields, so everything here applies to both.

## Reaching the Backing Memory

A slice's `data` field is a regular `*T` pointer. You can pass it to [`extern`](/docs/pointers/extern) functions or perform [pointer arithmetic](/docs/pointers/arithmetic) on it when low-level access is needed:

```rux
extern func memcpy(dst: *opaque, src: *opaque, n: uint) -> *opaque;

let src = [1, 2, 3, 4];            // int[4]
var dst: Slice<int> = allocate(4);      // a slice over four ints
let bytes = sizeof(int) * src.length;
memcpy(dst.data, src.data, bytes); // dst now holds 1, 2, 3, 4
```

Passing `data` hands the callee the address of the first element; passing a byte count derived from `length` tells it how far the region extends. The two are always used together — a pointer without its length cannot be bounded safely.

## `sizeof` and Element Size

`length` counts **elements**, not bytes. `sizeof(T)` returns the size of a single element in bytes, so multiplying the two gives the total byte size of the backing region — exactly what a C API that works in bytes expects:

```rux
let buf: float64[4] = [1.0, 2.0, 3.0, 4.0];
let byteSize = sizeof(float64) * buf.length;   // 32
```

## See Also

- [Slices](/docs/slices/overview) — the slice view type and its memory layout
- [Pointer Arithmetic](/docs/pointers/arithmetic) — advancing a pointer by element size
- [Pointers and `extern`](/docs/pointers/extern) — exchanging memory with native code
