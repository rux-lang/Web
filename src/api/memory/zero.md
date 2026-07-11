# `Zero`

Fills a block of memory with zero bytes.

**Module:** `Memory`

## Signature

```rux
func Zero(ptr: *opaque, size: uint);
```

## Parameters

| Name   | Type      | Description                          |
| ------ | --------- | ------------------------------------ |
| `ptr`  | `*opaque` | The first byte of the block to clear. |
| `size` | `uint`    | The number of bytes to clear.        |

## Remarks

Writes `size` zero bytes starting at `ptr` — the same thing as
[`Set(ptr, size, 0)`](set), which is exactly how it is implemented everywhere
except Windows, where it lowers to `RtlZeroMemory`.

This is the usual companion to [`Alloc`](alloc), whose blocks come back
uninitialized. A `size` of `0` writes nothing, and writing past the end of the
block is undefined behavior.

On BSD the function is not implemented yet and does nothing.

## Example

```rux
import Memory::{ Alloc, Free, Zero };

let buffer = Alloc(1024);

Zero(buffer, 1024); // now safe to read before writing

Free(buffer);
```

## See also

- [`Memory`](/api/memory/) — the module overview
- [`Set`](set) — fill with a byte other than zero
- [`Alloc`](alloc) — the source of the uninitialized block
