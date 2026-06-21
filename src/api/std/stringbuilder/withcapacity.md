# `WithCapacity`

Creates a builder with space pre-allocated.

**Module:** `Std`

## Signature

```rux
func WithCapacity(capacity: uint) -> StringBuilder;
```

## Parameters

| Name       | Type   | Description                           |
| ---------- | ------ | ------------------------------------- |
| `capacity` | `uint` | Number of bytes to allocate up front. |

## Returns

`StringBuilder` — an empty builder backed by a buffer of `capacity` bytes. A
`capacity` of `0` behaves like [`New`](new).

## Description

Use `WithCapacity` when you can estimate the final size: it allocates the buffer
once, so subsequent appends up to `capacity` won't trigger a reallocation. The
builder still grows automatically if you exceed the reserved size.

## Example

```rux
import Std::StringBuilder;

// Building a 16-row table — reserve once.
var sb = StringBuilder::WithCapacity(1024);
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`New`](new) — start empty
- [`Reserve`](reserve) — grow capacity after construction
