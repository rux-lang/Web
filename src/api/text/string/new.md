# `New`

Creates an empty string.

**Module:** `Text`

## Signature

```rux
func New() -> String;
```

## Returns

An empty `String`. It owns no block, so this allocates nothing, and every method treats it as a string of length zero rather than as a missing value: [`Length`](length) is `0`, [`IsEmpty`](isempty) is `true`, [`Data`](data) is `null`, and [`Free`](free) is a no-op.

It is also what the transformations return when there is nothing to give back — [`Substring`](substring) past the end, [`Trim`](trim) of nothing but whitespace, [`Repeat`](repeat) zero times.

## Example

```rux
import Text::String;

var empty = String::New();
empty.IsEmpty(); // true
empty.Length();  // 0
empty.Free();    // safe, and not required
```

## See also

- [`String`](/api/text/string/) — the string type
- [`From`](from) — create a string that holds bytes
- [`IsEmpty`](isempty) — test for the empty string
