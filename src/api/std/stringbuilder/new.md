# `New`

Creates an empty builder.

**Module:** `Std`

## Signature

```rux
func New() -> StringBuilder;
```

## Returns

`StringBuilder` — an empty builder with no buffer allocated yet.

## Description

`New` is the usual starting point. No memory is allocated until the first
[`Append`](append) (or [`Reserve`](reserve)); the buffer then grows on demand.
If you already know roughly how many bytes you'll write, use
[`WithCapacity`](withcapacity) to allocate once up front.

## Example

```rux
import Std::StringBuilder;

var sb = StringBuilder::New();
sb.Append("ready");
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`WithCapacity`](withcapacity) — start with capacity reserved
