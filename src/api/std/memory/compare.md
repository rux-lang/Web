# `Compare`

Compares two blocks of memory byte by byte.

**Module:** `Std::Memory`

## Signature

```rux
func Compare(lhs: *const opaque, rhs: *const opaque, length: uint) -> uint;
```

## Parameters

| Name     | Type            | Description                              |
| -------- | --------------- | ---------------------------------------- |
| `lhs`    | `*const opaque` | First block.                             |
| `rhs`    | `*const opaque` | Second block.                            |
| `length` | `uint`          | Number of bytes to compare.             |

## Returns

`uint` — the index of the first byte that differs, or `length` if the two blocks
are equal over all `length` bytes.

## Description

Scans up to `length` bytes and reports where the blocks first diverge. A return
value equal to `length` means the ranges are identical; any smaller value is the
offset of the first mismatch.

::: tip
This differs from C's `memcmp`, which returns a sign. Here, test for equality
with `Compare(a, b, n) == n`.
:::

## Example

```rux
import Memory::*;

func Equal(a: *opaque, b: *opaque, n: uint) -> bool {
    return Compare(a, b, n) == n;
}
```

## See also

- [`Copy`](copy) — duplicate a block of memory
