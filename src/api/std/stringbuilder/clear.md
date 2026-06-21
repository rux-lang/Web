# `Clear`

Resets the length to zero, keeping the capacity.

**Module:** `Std`

## Signature

```rux
func Clear(self);
```

## Description

Sets the builder's length back to `0` so it can be reused, **without** freeing
the buffer — the existing capacity is retained, so refilling it won't reallocate.
The old bytes are not wiped; they are simply overwritten as you append again.

## Example

```rux
import Std::StringBuilder;

var sb = StringBuilder::WithCapacity(128);
for i in 0..3 {
    sb.Append("row");
    let line = sb.ToString();
    // ... use line ...
    sb.Clear();              // reuse the same buffer next iteration
}
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`IsEmpty`](isempty) — check whether it's empty
- [`IntoString`](intostring) — finish instead of clearing
