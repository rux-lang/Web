# `Munmap`

Removes a virtual-memory mapping.

**Package:** `Linux`

## Signature

```rux
func Munmap(addr: *opaque, length: uint) -> int64;
```

## Parameters

| Name     | Type      | Description                                  |
| -------- | --------- | -------------------------------------------- |
| `addr`   | `*opaque` | Page-aligned start of the range to unmap.    |
| `length` | `uint`    | Number of bytes in the range.                |

## Returns

`int64` — `0` on success, or a negative errno result on failure.

## Description

After a successful call, accessing the unmapped range is invalid. The address
must be page-aligned; Linux rounds `length` up to a page boundary.

## Example

```rux
import Linux::{ IsError, Munmap };

func Main() -> int {
    if IsError(Munmap(memory, 4096u)) {
        return 1;
    }
    return 0;
}
```

## See also

- [`Mmap`](mmap) — create a mapping

