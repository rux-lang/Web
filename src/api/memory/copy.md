# `Copy`

Copies bytes from one block of memory to another.

**Package:** `Memory`

## Signature

```rux
func Copy(
    dest: *var opaque,
    src: *opaque,
    length: uint
);
```

## Parameters

| Name     | Type            | Description                        |
| -------- | --------------- | ---------------------------------- |
| `dest`   | `*var opaque`   | The block to copy into.            |
| `src`    | `*opaque`       | The block to copy from.            |
| `length` | `uint`          | The number of bytes to copy.       |

## Remarks

Copies `length` bytes from `src` to `dest`. The two regions **must not
overlap** — the copy runs forward, byte by byte, so an overlapping destination
that starts inside the source will read bytes it has already overwritten. There
is no `Move` counterpart yet; to shift bytes within one block, copy through a
scratch block from [`Alloc`](alloc).

Both blocks must be at least `length` bytes long. A `length` of `0` copies
nothing.

## Example

```rux
import Memory::{ Alloc, Compare, Copy, Free, Set };

func Main() -> int {
    let src = Alloc(16);
    let dest = Alloc(16);
    Set(src, 16, 0x5A);

    Copy(dest, src, 16);
    Compare(dest, src, 16); // 16 -- the blocks are equal

    Free(dest);
    Free(src);
    return 0;
}
```

## See also

- [`Memory`](/api/memory/) — the package overview
- [`Compare`](compare) — check that two blocks hold the same bytes
- [`Set`](set) — fill a block with a byte instead of copying one
- [`Realloc`](realloc) — resize a block, which copies the bytes for you
