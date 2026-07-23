# `Mmap`

Creates a virtual-memory mapping.

**Package:** `MacOS`

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

| Name         | Type      | Description                                       |
| ------------ | --------- | ------------------------------------------------- |
| `address`    | `*opaque` | Requested address hint, or `null`.                |
| `length`     | `uint`    | Mapping length in bytes.                          |
| `protection` | `int32`   | Page protections, such as `ProtectionRead`.       |
| `flags`      | `int32`   | Mapping behavior, such as `MapPrivate`.           |
| `fd`         | `int32`   | Backing descriptor, or `-1` for anonymous memory. |
| `offset`     | `uint64`  | Page-aligned offset in the backing object.        |

## Returns

`int64` - the mapped address encoded as an integer on success, or a negative
errno value on failure.

For private anonymous memory, combine `MapPrivate | MapAnonymous`, pass `-1i32`
for `fd`, and use an offset of `0u64`.

::: danger
Check the result with [`IsError`](iserror) before casting it to a pointer.
Release every successful mapping with [`Munmap`](munmap) using its correct base
address and length.
:::

## Example

```rux
import MacOS::{ IsError, Mmap, Munmap, MapAnonymous, MapPrivate, ProtectionRead, ProtectionWrite };

func Main() -> int {
    let result = Mmap(null, 4096u, ProtectionRead | ProtectionWrite,
        MapPrivate | MapAnonymous, -1i32, 0u64);
    if IsError(result) {
        return 1;
    }
    let memory = result as *opaque;
    Munmap(memory, 4096u);
    return 0;
}
```

## See also

- [`MacOS`](/api/macos/) — the package overview
- [`Munmap`](munmap) - remove a mapping
- [`Types and constants`](types) - protection and mapping flags
