# `Zero`

Fills a block of memory with zeros.

**Module:** `Std::Memory`

## Signature

```rux
func Zero(ptr: *opaque, size: uint);
```

## Parameters

| Name   | Type      | Description                                 |
| ------ | --------- | ------------------------------------------- |
| `ptr`  | `*opaque` | Pointer to the start of the block to clear. |
| `size` | `uint`    | Number of bytes to set to zero.             |

## Description

Sets `size` bytes starting at `ptr` to `0`. Equivalent to
[`Set`](set)`(ptr, size, 0)`, and the idiomatic way to initialize freshly
[allocated](alloc) memory to a known state.

## Example

```rux
import Memory::*;

let buffer = Alloc(1024);
if buffer == null {
    return 1;
}
Zero(buffer, 1024);          // start from all-zero bytes
Free(buffer);
```

## See also

- [`Set`](set) — fill with an arbitrary byte value
- [`Alloc`](alloc) — returns uninitialized memory that often needs zeroing
