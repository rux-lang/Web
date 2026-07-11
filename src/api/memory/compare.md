# `Compare`

Finds the offset at which two blocks of memory first differ.

**Module:** `Memory`

## Signature

```rux
func Compare(lhs: *const opaque, rhs: *const opaque, length: uint) -> uint;
```

## Parameters

| Name     | Type            | Description                     |
| -------- | --------------- | ------------------------------- |
| `lhs`    | `*const opaque` | The first block.                |
| `rhs`    | `*const opaque` | The second block.               |
| `length` | `uint`          | The number of bytes to compare. |

## Returns

The offset of the first byte that differs, or `length` if the first `length`
bytes are equal. This is **not** C's `memcmp`: there is no sign, and equality is
reported as `length` rather than as `0`.

The two comparisons that trip people up:

- **Equal blocks return `length`,** so the equality test is
  `Compare(a, b, n) == n`, and never `== 0`.
- **`0` means the blocks differ at the very first byte** — except when `length`
  is `0`, where nothing is compared and `0` means trivially equal.

The comparison stops at `length`, so bytes that differ beyond it are invisible.
Both blocks must be at least `length` bytes long.

On BSD the function is not implemented yet and always returns `0`.

## Example

```rux
import Memory::{ Alloc, Compare, Free, Set };

let lhs = Alloc(16);
let rhs = Alloc(16);
Set(lhs, 16, 0x5A);
Set(rhs, 16, 0x5A);

Compare(lhs, rhs, 16); // 16 -- equal, so the full length

let bytes = rhs as *uint8;
*(bytes + 5) = 0x00;

Compare(lhs, rhs, 16); // 5 -- the first difference
Compare(lhs, rhs, 5);  // 5 -- equal, the difference is out of range

Free(rhs);
Free(lhs);
```

## See also

- [`Memory`](/api/memory/) — the module overview
- [`Copy`](copy) — make one block equal to another
- [`Set`](set) — fill a block with a known byte before comparing
