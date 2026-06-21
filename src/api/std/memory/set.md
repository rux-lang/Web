# `Set`

Fills a block of memory with a byte value.

**Module:** `Std::Memory`

## Signature

```rux
func Set(ptr: *opaque, size: uint, value: int32);
```

## Parameters

| Name    | Type      | Description                                             |
| ------- | --------- | ------------------------------------------------------- |
| `ptr`   | `*opaque` | Pointer to the start of the block to fill.              |
| `size`  | `uint`    | Number of bytes to write.                               |
| `value` | `int32`   | Fill value; only the low 8 bits are used for each byte. |

## Description

Writes `size` copies of `value` (truncated to a byte) starting at `ptr`. The
block must be at least `size` bytes. To fill with zeros, prefer
[`Zero`](zero), which is a touch clearer at the call site.

## Example

```rux
import Std::Memory::*;

let buffer = Alloc(256);
Set(buffer, 256, 0xFF);     // fill every byte with 0xFF
Free(buffer);
```

## See also

- [`Zero`](zero) — fill a block with zeros
- [`Alloc`](alloc) — allocate the block being filled
