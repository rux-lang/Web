# `Mmap`

Creates a virtual-memory mapping.

**Module:** `Linux`

## Signature

```rux
func Mmap(addr: *opaque, length: uint, prot: int32, flags: int32, fd: int32, offset: uint64) -> int64;
```

## Parameters

| Name     | Type      | Description                                      |
| -------- | --------- | ------------------------------------------------ |
| `addr`   | `*opaque` | Requested address hint, or `null`.               |
| `length` | `uint`    | Mapping length in bytes; must be greater than 0. |
| `prot`   | `int32`   | Page protections, such as `PROT_READ`.           |
| `flags`  | `int32`   | Mapping behavior, such as `MAP_PRIVATE`.          |
| `fd`     | `int32`   | Backing file descriptor, or `-1` for an anonymous mapping. |
| `offset` | `uint64`  | Page-aligned offset in the backing file.          |

## Returns

`int64` — the mapped address encoded as an integer on success, or a negative
errno result on failure.

## Description

Combine protection and mapping flags with bitwise OR. For an anonymous private
mapping, pass `MAP_PRIVATE | MAP_ANONYMOUS`, `-1i32` for `fd`, and `0u64` for
`offset`. Release a successful mapping with [`Munmap`](munmap).

::: danger
Call [`IsError`](iserror) before casting the result to a pointer. Casting a
negative errno result produces an invalid address.
:::

## Example

```rux
import Linux::{ IsError, Mmap, Munmap, MAP_ANONYMOUS, MAP_PRIVATE, PROT_READ, PROT_WRITE };

let result = Mmap(null, 4096u, PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS, -1i32, 0u64);
if IsError(result) {
    return 1i32;
}

let memory = result as *opaque;
// Use memory within the mapped 4096-byte range.
Munmap(memory, 4096u);
```

## See also

- [`Constants`](constants) — available protection and mapping flags
- [`Munmap`](munmap) — remove a mapping

