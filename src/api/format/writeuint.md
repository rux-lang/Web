# `WriteUint`

Appends the decimal digits of an unsigned integer to a builder.

**Package:** `Format`

## Signature

```rux
func WriteUint(
    builder: *StringBuilder,
    value: uint64
);
```

## Parameters

| Name      | Type             | Description               |
| --------- | ---------------- | ------------------------- |
| `builder` | `*StringBuilder` | The builder to append to. |
| `value`   | `uint64`         | The value to write.       |

As with [`WriteInt`](writeint), there is one overload rather than one per width: a narrower unsigned value widens to `uint64` on the way in, which loses nothing.

## Remarks

Writes the digits and nothing else — there is no sign on an unsigned value. Zero is the single digit `0`, and the largest `uint64`, `18446744073709551615`, is the longest output there is at twenty digits.

Nothing is allocated beyond whatever growth the builder needs. This is the function to reach for while accumulating; [`ToString`](tostring) is the one that hands back a `String` of its own.

## Example

```rux
import Format::WriteUint;
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();
    builder.Append("read ");
    WriteUint(@builder, 4096u64);
    builder.Append(" bytes");

    var line = builder.IntoString(); // "read 4096 bytes"

    line.Free();
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`WriteInt`](writeint) — the same, with a sign for a negative value
- [`ToString`](tostring) — the digits in a `String` of their own
- [`Text::StringBuilder`](/api/text/stringbuilder/) — the builder being appended to
