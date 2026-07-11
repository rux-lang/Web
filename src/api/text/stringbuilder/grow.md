# `Grow`

Grows the block to hold at least a given number of bytes.

**Module:** `Text`

## Signature

```rux
func Grow(self, required: uint);
```

## Parameters

| Name       | Type   | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `required` | `uint` | The total number of bytes the block must hold. |

## Remarks

The size is a **total**, not an increment — it counts the bytes already written. [`Reserve`](reserve) is the same thing stated relative to [`Length`](length), and is usually what you want.

A `required` that already fits is left alone: the block never shrinks here. Otherwise the capacity doubles from a 16 byte floor until it covers `required`, which is why it can end up larger than what was asked for, and why a run of [`Append`](append) calls costs an amortized constant rather than a reallocation each time.

Growing may move the block, so a pointer taken from [`Data`](data) beforehand must not be used after.

## Example

```rux
import Text::StringBuilder;

var builder = StringBuilder::New();

builder.Grow(20);
builder.Capacity(); // 32 -- doubled from 16 until it covered 20
builder.Length();   // 0 -- growing writes nothing

builder.Grow(8);
builder.Capacity(); // 32 still -- the block never shrinks here

builder.Free();
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Reserve`](reserve) — the same, counted from what is already written
- [`Shrink`](shrink) — the way back down
- [`Memory::Realloc`](/api/memory/realloc) — the resize this is built on
