# `Capacity`

Returns the current allocated capacity.

**Module:** `Std`

## Signature

```rux
func Capacity(self) -> uint;
```

## Returns

`uint` — the number of bytes the builder can hold before it must grow.

## Description

Capacity is always greater than or equal to [`Length`](length). The difference
is the headroom available for appends before the next reallocation.

## Example

```rux
import Rux::StringBuilder;

var sb = StringBuilder::WithCapacity(64);
sb.Append("hi");
// sb.Length() == 2, sb.Capacity() == 64
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`Reserve`](reserve) — increase capacity
- [`Shrink`](shrink) — release unused capacity
