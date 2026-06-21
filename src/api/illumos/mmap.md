# `Mmap`

Creates a virtual-memory mapping.

**Module:** `Illumos`

## Signature

```rux
func Mmap(addr: *opaque, length: uint, prot: int32,
    flags: int32, fd: int32, offset: uint64) -> int64;
```

## Parameters

| Name     | Type      | Description                                      |
| -------- | --------- | ------------------------------------------------ |
| `addr`   | `*opaque` | Requested address hint, or `null`.               |
| `length` | `uint`    | Mapping length in bytes.                         |
| `prot`   | `int32`   | Page protections, such as `PROT_READ`.           |
| `flags`  | `int32`   | Mapping behavior, such as `MAP_PRIVATE`.          |
| `fd`     | `int32`   | Backing descriptor, or `-1` for anonymous memory.|
| `offset` | `uint64`  | Page-aligned offset in the backing object.        |

## Returns

`int64` - the mapped address encoded as an integer on success, or the thunk's
raw error result on failure.

For a private anonymous mapping, combine `MAP_PRIVATE | MAP_ANONYMOUS`, pass
`-1i32` for `fd`, and use an offset of `0u64`.

::: danger
Check the result before casting it to a pointer. Release every successful
mapping with [`Munmap`](munmap) using the correct base address and length.
:::

## Example

```rux
import Illumos::{ IsError, Mmap, Munmap, MAP_ANONYMOUS, MAP_PRIVATE, PROT_READ, PROT_WRITE };

let result = Mmap(null, 4096u, PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS, -1i32, 0u64);
if IsError(result) {
    return 1i32;
}
let memory = result as *opaque;
Munmap(memory, 4096u);
```

## See also

- [`Types and constants`](types) - protection and mapping flags
- [`Munmap`](munmap) - remove a mapping
