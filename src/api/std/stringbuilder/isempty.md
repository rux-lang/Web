# `IsEmpty`

Reports whether nothing has been written.

**Module:** `Std`

## Signature

```rux
func IsEmpty(self) -> bool8;
```

## Returns

`bool8` — `true` if the builder's length is `0`, otherwise `false`.

## Example

```rux
import Rux::StringBuilder;

var sb = StringBuilder::New();
// sb.IsEmpty() == true
sb.Append(c8'x');
// sb.IsEmpty() == false
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`Length`](length) — the underlying byte count
- [`Clear`](clear) — make the builder empty again
