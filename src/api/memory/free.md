# `Free`

Releases a block of memory back to the platform.

**Module:** `Memory`

## Signature

```rux
func Free(ptr: *opaque);
```

## Parameters

| Name  | Type      | Description                                            |
| ----- | --------- | ------------------------------------------------------ |
| `ptr` | `*opaque` | A block from [`Alloc`](alloc) or [`Realloc`](realloc). |

## Remarks

Passing `null` is a no-op, so a caller needs no guard around the common
"allocate, maybe fail, clean up" path.

Anything else is undefined behavior and is not diagnosed: releasing the same
block twice, releasing a pointer that [`Realloc`](realloc) has already moved, or
passing a pointer this package did not produce. After the call the block is gone
and the pointer must not be read, written, or freed again.

On BSD the function is not implemented yet and does nothing.

## Example

```rux
import Memory::{ Alloc, Free };

let buffer = Alloc(256);
if buffer == null {
    return 1;
}

Free(buffer);
Free(null); // harmless
```

## See also

- [`Memory`](/api/memory/) — the module overview
- [`Alloc`](alloc) — allocate the block in the first place
- [`Realloc`](realloc) — resize a block instead of releasing it
