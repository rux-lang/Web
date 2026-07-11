# `Set`

Fills a block of memory with a repeated byte.

**Module:** `Memory`

## Signature

```rux
func Set(ptr: *opaque, size: uint, value: int32);
```

## Parameters

| Name    | Type      | Description                            |
| ------- | --------- | -------------------------------------- |
| `ptr`   | `*opaque` | The first byte of the block to fill.   |
| `size`  | `uint`    | The number of bytes to write.          |
| `value` | `int32`   | The fill byte, in the low eight bits.  |

## Remarks

Writes `size` copies of `value` starting at `ptr`. Only the **low eight bits**
of `value` reach memory — the parameter is wider only to match the C fill
convention that the Win32 entry point expects, so `Set(ptr, size, 0x1FF)` fills
with `0xFF`, not with a truncation error.

A `size` of `0` writes nothing. Writing past the end of the block is undefined
behavior; `size` must not exceed the size the block was allocated with.

On BSD the function is not implemented yet and does nothing.

## Example

```rux
import Memory::{ Alloc, Free, Set };

let buffer = Alloc(16);

Set(buffer, 16, 0xA5);  // every byte is 0xA5
Set(buffer, 16, 0x1FF); // every byte is 0xFF -- only the low 8 bits land

Free(buffer);
```

## See also

- [`Memory`](/api/memory/) — the module overview
- [`Zero`](zero) — the common zero-fill case
- [`Copy`](copy) — fill a block from another block instead of from a byte
