# `Munmap`

Removes a virtual-memory mapping.

**Package:** `Bsd`

## Signature

```rux
func Munmap(addr: *opaque, length: uint) -> int64;
```

## Parameters

| Name     | Type      | Description                         |
| -------- | --------- | ----------------------------------- |
| `addr`   | `*opaque` | Base address of the range to unmap. |
| `length` | `uint`    | Number of bytes in the range.       |

## Returns

`int64` - `0` on success, or a negative errno value on failure.

After success, the unmapped range is invalid and must not be accessed.

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Mmap`](mmap) - create a mapping
