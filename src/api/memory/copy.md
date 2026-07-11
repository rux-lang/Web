# `Copy`

Copies bytes from one block of memory to another.

**Module:** `Memory`

## Signature

```rux
func Copy(dest: *opaque, src: *const opaque, length: uint);
```

## Parameters

| Name     | Type            | Description                        |
| -------- | --------------- | ---------------------------------- |
| `dest`   | `*opaque`       | The block to copy into.            |
| `src`    | `*const opaque` | The block to copy from.            |
| `length` | `uint`          | The number of bytes to copy.       |

## Remarks

Copies `length` bytes from `src` to `dest`. The two regions **must not
overlap** — the copy runs forward, byte by byte, so an overlapping destination
that starts inside the source will read bytes it has already overwritten. There
is no `Move` counterpart yet; to shift bytes within one block, copy through a
scratch block from [`Alloc`](alloc).

Both blocks must be at least `length` bytes long. A `length` of `0` copies
nothing.

On BSD the function is not implemented yet and does nothing.

## Example

```rux
import Memory::{ Alloc, Compare, Copy, Free, Set };

let src = Alloc(16);
let dest = Alloc(16);
Set(src, 16, 0x5A);

Copy(dest, src, 16);
Compare(dest, src, 16); // 16 -- the blocks are equal

Free(dest);
Free(src);
```

## See also

- [`Memory`](/api/memory/) — the module overview
- [`Compare`](compare) — check that two blocks hold the same bytes
- [`Set`](set) — fill a block with a byte instead of copying one
- [`Realloc`](realloc) — resize a block, which copies the bytes for you
