# `Reserve`

Makes room for more bytes.

**Module:** `Text`

## Signature

```rux
func Reserve(self, additional: uint);
```

## Parameters

| Name         | Type   | Description                                          |
| ------------ | ------ | ---------------------------------------------------- |
| `additional` | `uint` | How many more bytes to make room for, on top of what is written. |

## Remarks

Ensures the block can hold `additional` bytes **beyond** the current [`Length`](length), so the appends that follow do not reallocate. It is [`Grow`](grow) with the bookkeeping done for you — the argument is relative to what is written, not the total.

Capacity only ever grows, so this leaves a builder that is already big enough alone; the capacity that goes unused is handed back by [`Shrink`](shrink), not by reserving less.

Reserving may move the block, so a pointer taken from [`Data`](data) beforehand must not be used after.

## Example

```rux
import Text::StringBuilder;

var builder = StringBuilder::New();
builder.Append("Rux");   // Length is 3

builder.Reserve(100);    // room for 100 more, so at least 103 in all
builder.Capacity();      // >= 103, and no append below that reallocates

builder.Free();
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Grow`](grow) — ask for a total size instead of an increment
- [`WithCapacity`](withcapacity) — reserve up front, before anything is written
- [`Shrink`](shrink) — hand back what went unused
