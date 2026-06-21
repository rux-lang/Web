# `Length`

Returns the number of bytes written so far.

**Module:** `Std`

## Signature

```rux
func Length(self) -> uint;
```

## Returns

`uint` — the current content length in bytes (always ≤ [`Capacity`](capacity)).

## Example

```rux
import Std::StringBuilder;

var sb = StringBuilder::New();
sb.Append("hello");
// sb.Length() == 5
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`IsEmpty`](isempty) — test for zero length
- [`Capacity`](capacity) — allocated size
