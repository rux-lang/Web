# `Free`

Releases a heap block previously returned by `Alloc` or `Realloc`.

**Module:** `Std::Memory`

## Signature

```rux
func Free(ptr: *opaque);
```

## Parameters

| Name  | Type      | Description                                                    |
| ----- | --------- | -------------------------------------------------------------- |
| `ptr` | `*opaque` | Pointer from [`Alloc`](alloc)/[`Realloc`](realloc), or `null`. |

## Description

`Free` returns a block of memory to the heap. Passing `null` is safe and does
nothing, so you don't need to guard the call.

::: warning
Each allocation must be freed exactly once. Using a pointer after it has been
freed, or freeing the same pointer twice, is undefined behavior.
:::

## Example

```rux
import Memory::*;

let buffer = Alloc(256);
if buffer == null {
    return 1;
}

// ... use the buffer ...

Free(buffer);
```

## See also

- [`Alloc`](alloc) — allocate a block
- [`Realloc`](realloc) — resize a block
