# `Mmap`

Creates a virtual-memory mapping.

**Package:** `Linux`

## Signature

```rux
func Mmap(
    address: *opaque,
    length: uint,
    protection: int32,
    flags: int32,
    fd: int32,
    offset: uint64
) -> int64;
```

## Parameters

| Name         | Type      | Description                                                 |
| ------------ | --------- | ---------------------------------------------------------- |
| `address`    | `*opaque` | Requested address hint, or `null`.                         |
| `length`     | `uint`    | Mapping length in bytes; must be greater than 0.           |
| `protection` | `int32`   | Page protections, such as `ProtectionRead`.                |
| `flags`      | `int32`   | Mapping behavior, such as `MapPrivate`.                    |
| `fd`         | `int32`   | Backing file descriptor, or `-1` for an anonymous mapping. |
| `offset`     | `uint64`  | Page-aligned offset in the backing file.                   |

## Returns

`int64` — the mapped address encoded as an integer on success, or a negative
errno result on failure.

## Description

Combine protection and mapping flags with bitwise OR. For an anonymous private
mapping, pass `MapPrivate | MapAnonymous`, `-1i32` for `fd`, and `0u64` for
`offset`. Release a successful mapping with [`Munmap`](munmap).

::: danger
Call [`IsError`](iserror) before casting the result to a pointer. Casting a
negative errno result produces an invalid address.
:::

## Example

```rux
import Linux::{ IsError, Mmap, Munmap, MapAnonymous, MapPrivate, ProtectionRead, ProtectionWrite };

func Main() -> int {
    let result = Mmap(null, 4096u, ProtectionRead | ProtectionWrite,
        MapPrivate | MapAnonymous, -1i32, 0u64);
    if IsError(result) {
        return 1;
    }

    let memory = result as *opaque;
    // Use memory within the mapped 4096-byte range.
    Munmap(memory, 4096u);
    return 0;
}
```

## See also

- [`Constants`](types) — available protection and mapping flags
- [`Munmap`](munmap) — remove a mapping

