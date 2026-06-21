# `Copy`

Copies bytes from one block of memory to another.

**Module:** `Std::Memory`

## Signature

```rux
func Copy(dest: *opaque, src: *const opaque, length: uint);
```

## Parameters

| Name     | Type            | Description                              |
| -------- | --------------- | ---------------------------------------- |
| `dest`   | `*opaque`       | Destination block.                       |
| `src`    | `*const opaque` | Source block.                            |
| `length` | `uint`          | Number of bytes to copy.                 |

## Description

Copies `length` bytes from `src` to `dest`. Both blocks must be at least
`length` bytes.

::: warning
The source and destination regions must **not overlap**. For overlapping moves,
copy through a temporary buffer instead.
:::

## Example

```rux
import Std::Memory::*;

let src = Alloc(64);
let dst = Alloc(64);
Set(src, 64, 0xAB);
Copy(dst, src, 64);          // dst now mirrors src
Free(src);
Free(dst);
```

## See also

- [`Compare`](compare) — check whether two blocks hold the same bytes
- [`Alloc`](alloc) — allocate source and destination blocks
