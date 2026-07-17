# `IntoString`

Consumes the builder, transferring its buffer to a `String`.

**Module:** `Std`

## Signature

```rux
func IntoString(self) -> String;
```

## Returns

`String` — a string that takes ownership of the builder's buffer.

## Description

`IntoString` hands the builder's buffer directly to the returned `String`
(shrinking any unused slack first), so no copy is made. The builder is then reset
to empty — its `data` becomes `null` and its length and capacity become `0`.

Prefer this over [`ToString`](tostring) when you're done building and want the
result, since it avoids an allocation and copy.

::: warning
After `IntoString`, the builder is empty. It is safe to reuse (a later
[`Append`](append) re-allocates), but the previously held buffer now belongs to
the returned `String` — don't assume the builder still references it.
:::

## Example

```rux
import Io::*;
import Text::StringBuilder;

func Main() -> int {
    var sb = StringBuilder::New();
    sb.Append("done");
    let s = sb.IntoString();     // buffer moves to s; sb is now empty
    PrintLine(s);
    return 0;
}
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`ToString`](tostring) — convert by copying, keeping the builder usable
