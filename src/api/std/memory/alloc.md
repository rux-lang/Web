# `Alloc`

Allocates a block of uninitialized memory on the heap.

**Module:** `Std::Memory`

## Signature

```rux
func Alloc(size: uint) -> *opaque;
```

## Parameters

| Name   | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| `size` | `uint` | Number of bytes to allocate. |

## Returns

`*opaque` — a pointer to the start of the allocated block, or `null` if the
allocation fails. The contents are **uninitialized**; use `Zero` or `Set` if
you need a known starting state.

## Description

`Alloc` reserves `size` bytes of heap memory and returns an opaque pointer to
them. Every successful allocation must be released exactly once with
[`Free`](free), or handed to [`Realloc`](realloc) to be resized.

::: warning
The returned memory is uninitialized and the caller owns it. Always check for
`null` before use, and free every successful allocation to avoid leaks.
:::

## Example

```rux
import Std::Memory::*;

func Main() -> int {
    let buffer = Alloc(1024);
    if buffer == null {
        return 1;
    }

    Zero(buffer, 1024);
    // ... use the buffer ...

    Free(buffer);
    return 0;
}
```

## See also

- [`Realloc`](realloc) — resize an existing allocation
- [`Free`](free) — release an allocation
