# `WriteInt`

Appends the decimal digits of a signed integer to a builder.

**Module:** `Format`

## Signature

```rux
func WriteInt(builder: *StringBuilder, value: int64);
```

## Parameters

| Name      | Type             | Description                        |
| --------- | ---------------- | ---------------------------------- |
| `builder` | `*StringBuilder` | The builder to append to.          |
| `value`   | `int64`          | The value to write.                |

There is one overload rather than one per width: a narrower signed value widens to `int64` on the way in, which loses nothing, so `WriteInt(&builder, x as int64)` covers every signed type.

## Remarks

Writes a minus sign for a negative value and then the digits, with no plus sign on a positive one. Zero is the single digit `0`.

Nothing is allocated here beyond whatever growth the builder needs, which is the point: [`ToString`](tostring) allocates a `String` per value, and a caller who is already accumulating would only free it again. The digits go straight into the block the builder already has.

The most negative `int64` has no positive counterpart in its own type — negating `-9223372036854775808` overflows straight back to itself — so the magnitude is taken as a `uint64`, and that value prints in full like any other.

## Example

```rux
import Format::WriteInt;
import Text::StringBuilder;

var builder = StringBuilder::New();
builder.Append("offset ");
WriteInt(&builder, -42i64);
builder.Append(" of ");
WriteInt(&builder, 100i64);

var line = builder.IntoString(); // "offset -42 of 100"

line.Free();
```

## See also

- [`Format`](/api/format/) — the module overview
- [`WriteUint`](writeuint) — the same, without a sign to write
- [`ToString`](tostring) — the digits in a `String` of their own
- [`Text::StringBuilder`](/api/text/stringbuilder/) — the builder being appended to
