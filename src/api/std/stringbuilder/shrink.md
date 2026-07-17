# `Shrink`

Releases unused capacity.

**Module:** `Std`

## Signature

```rux
func Shrink(self);
```

## Description

Reallocates the buffer down to exactly [`Length`](length) bytes, freeing any
slack between the length and the capacity. Does nothing if the builder is already
full or empty. Useful before holding a builder around for a long time, though
most code converts to a `String` instead.

## Example

```rux
import Rux::StringBuilder;

var sb = StringBuilder::WithCapacity(1024);
sb.Append("short");
sb.Shrink();                 // capacity drops to 5
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`Reserve`](reserve) — the opposite direction
- [`IntoString`](intostring) — also trims slack while converting
