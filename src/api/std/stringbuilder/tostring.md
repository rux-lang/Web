# `ToString`

Copies the contents into a new `String`.

**Module:** `Std`

## Signature

```rux
func ToString(self) -> String;
```

## Returns

`String` — a new string holding a **copy** of the builder's current content.

## Description

`ToString` allocates a fresh buffer and copies the bytes into it, leaving the
builder unchanged and reusable. Use it when you need the current content but want
to keep appending afterward. If you're finished with the builder, prefer
[`IntoString`](intostring), which avoids the copy.

This method is also `StringBuilder`'s [`Display`](../display) implementation.

## Example

```rux
import Std::StringBuilder;

var sb = StringBuilder::New();
sb.Append("partial");
let snapshot = sb.ToString();  // copy; sb still usable
sb.Append(" more");
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`IntoString`](intostring) — convert without copying
