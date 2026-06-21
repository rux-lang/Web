# Pointer Arithmetic

Adding an integer to a `*T` advances the address by multiples of the **element size**, not by raw bytes. `base + 1` moves forward by `sizeof(T)` bytes so that it lands on the next element, whatever `T` is. This is most useful when walking a buffer, such as a [slice's](/docs/slices/overview) `data` pointer.

```rux
let nums = [10, 20, 30, 40];
let base = nums.data;     // *int32 — pointer to the first element

let second = *(base + 1); // 20
let third  = *(base + 2); // 30
```

## How the Address Advances

Because `int32` is 4 bytes, each `+ 1` adds 4 to the underlying address. The pointer steps element by element even though memory is counted in bytes:

```
   Expression     Address       Reads
  ┌────────────┬────────────┬──────────┐
  │ base       │ 0x7ffd1000 │ 10       │
  │ base + 1   │ 0x7ffd1004 │ 20       │   +4 bytes (sizeof int32)
  │ base + 2   │ 0x7ffd1008 │ 30       │   +8 bytes
  │ base + 3   │ 0x7ffd100c │ 40       │   +12 bytes
  └────────────┴────────────┴──────────┘
```

Use [`sizeof`](/docs/slices/low-level#sizeof-and-element-size) when you need the byte size of an element explicitly — for example to compute an offset by hand.

## Staying in Bounds

Pointer arithmetic is unchecked. Advancing past the last element produces an address outside the buffer, and dereferencing it is **undefined behavior**. When iterating, bound the walk by the slice's `length`:

```rux
let nums = [10, 20, 30, 40];
let p = nums.data;
var i: uint64 = 0;
while i < nums.length {
    Print(*(p + i));      // always within the buffer
    i += 1;
}
```

## See Also

- [Pointers](/docs/pointers/overview) — addresses and how a pointer is stored
- [Slices](/docs/slices/overview) — the `data` pointer and `length` that bound a buffer
- [Pointers and `extern`](/docs/pointers/extern) — passing buffers to native code
