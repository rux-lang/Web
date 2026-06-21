# `Munmap`

Removes a virtual-memory mapping.

**Module:** `Illumos`

## Signature

```rux
func Munmap(addr: *opaque, length: uint) -> int64;
```

## Parameters

| Name     | Type      | Description                               |
| -------- | --------- | ----------------------------------------- |
| `addr`   | `*opaque` | Base address of the range to unmap.       |
| `length` | `uint`    | Number of bytes in the range.             |

## Returns

`int64` - `0` on success, or the thunk's raw error result on failure.

After a successful call, the unmapped range is invalid and must not be
accessed.

## See also

- [`Memory`](memory) - memory API overview
- [`Mmap`](mmap) - create a mapping
