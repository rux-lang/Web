# `Alloc`

Allocates an uninitialized block of memory.

**Module:** `Memory`

## Signature

```rux
func Alloc(size: uint) -> *opaque;
```

## Parameters

| Name   | Type   | Description                       |
| ------ | ------ | --------------------------------- |
| `size` | `uint` | The number of bytes to allocate.  |

## Returns

A pointer to the first byte of the block, or `null` if the platform could not
satisfy the request. The bytes are **not** zeroed — they hold whatever was last
left there, so read them only after writing them, or clear the block with
[`Zero`](zero) first.

The block belongs to the caller and must be released exactly once with
[`Free`](free). Every successful call returns a distinct block, and the pointer
stays valid until it is passed to [`Free`](free) or moved by
[`Realloc`](realloc).

On BSD the function is not implemented yet and always returns `null`.

## Example

```rux
import Memory::{ Alloc, Free, Zero };

let buffer = Alloc(1024);
if buffer == null {
    return 1;
}

Zero(buffer, 1024);
Free(buffer);
```

## See also

- [`Memory`](/api/memory/) — the module overview
- [`Free`](free) — release the block when it is no longer needed
- [`Realloc`](realloc) — resize a block that already exists
- [`Zero`](zero) — clear the uninitialized bytes
