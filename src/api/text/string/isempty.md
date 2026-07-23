# `IsEmpty`

Reports whether the string holds no bytes.

**Package:** `Text`

## Signature

```rux
func IsEmpty(self) -> bool;
```

## Returns

`true` when the string holds no bytes, which is the case for [`New`](new), for anything [`Free`](free) has left behind, and for a transformation that had nothing to give back.

## Example

```rux
import Text::String;

func Main() -> int {
    String::New().IsEmpty(); // true

    var text = String::From("Rux");
    text.IsEmpty();          // false

    text.Free();
    text.IsEmpty();          // true -- Free leaves an empty string behind
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`Length`](length) — the byte count this tests against zero
- [`New`](new) — the empty string
