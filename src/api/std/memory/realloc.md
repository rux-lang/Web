# `Realloc`

Resizes a previously allocated block, preserving its contents.

**Module:** `Std::Memory`

## Signature

```rux
func Realloc(ptr: *opaque, size: uint) -> *opaque;
```

## Parameters

| Name   | Type      | Description                                                    |
| ------ | --------- | -------------------------------------------------------------- |
| `ptr`  | `*opaque` | Pointer from a previous [`Alloc`](alloc)/`Realloc`, or `null`. |
| `size` | `uint`    | New size of the block, in bytes.                               |

## Returns

`*opaque` — a pointer to the resized block, which **may differ** from `ptr` if
the block was moved. Returns `null` if the allocation fails, or if `size` is
`0`.

## Description

`Realloc` changes the size of the block pointed to by `ptr`:

- If `ptr` is `null`, it behaves like [`Alloc`](alloc)`(size)`.
- If `size` is `0`, the block is released with [`Free`](free) and `null` is returned.
- Otherwise the existing contents are preserved up to the smaller of the old and
  new sizes; any newly added bytes are uninitialized.

::: warning
On success the original `ptr` is invalid — use the returned pointer instead. On
failure (`null`) the original block is left untouched, so keep a copy of `ptr`
until `Realloc` succeeds to avoid leaking it.
:::

## Example

```rux
import Memory::*;

var buffer = Alloc(1024);

let grown = Realloc(buffer, 2048);
if grown == null {
    Free(buffer); // original is still valid on failure
    return 1;
}
buffer = grown;

Free(buffer);
```

## See also

- [`Alloc`](alloc) — allocate a new block
- [`Free`](free) — release an allocation
