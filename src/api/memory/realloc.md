# `Realloc`

Resizes a block of memory, preserving the bytes that still fit.

**Package:** `Memory`

## Signature

```rux
func Realloc(
    ptr: *opaque,
    size: uint
) -> *var opaque;
```

## Parameters

| Name   | Type      | Description                                            |
| ------ | --------- | ------------------------------------------------------ |
| `ptr`  | `*opaque` | A block from [`Alloc`](alloc) or `Realloc`, or `null`. |
| `size` | `uint`    | The new size in bytes.                                 |

## Returns

A pointer to the resized block, which **may differ from `ptr`** — the block is
allowed to move, and once it has, the old pointer must not be used again. Two
arguments are treated as shorthands rather than errors:

- `Realloc(null, size)` allocates a fresh block, exactly like [`Alloc`](alloc).
- `Realloc(ptr, 0)` releases the block and returns `null`, exactly like
  [`Free`](free).

Growing keeps every byte of the old block and leaves the bytes past the old size
uninitialized; shrinking keeps the surviving prefix and discards the rest.

The return is `null` if the platform could not satisfy the request. In that case
the original block is **untouched and still valid**, so it must still be freed —
assigning the result straight back over `ptr` leaks it.

## Example

```rux
import Memory::{ Alloc, Free, Realloc, Set };

func Main() -> int {
    var buffer = Alloc(8);
    Set(buffer, 8, 0xAB);

    let grown = Realloc(buffer, 64); // the first 8 bytes are still 0xAB
    if grown == null {
        Free(buffer); // the old block survived the failure
        return 1;
    }

    buffer = grown;
    Free(buffer);
    return 0;
}
```

## See also

- [`Memory`](/api/memory/) — the package overview
- [`Alloc`](alloc) — allocate the block in the first place
- [`Free`](free) — release the block when it is no longer needed
- [`Copy`](copy) — move bytes between blocks by hand
