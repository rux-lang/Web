# `WriteFloat`

Appends the decimal text of a floating-point value to a builder.

**Module:** `Format`

## Signature

```rux
func WriteFloat(builder: *StringBuilder, value: float64);
func WriteFloat(builder: *StringBuilder, value: float32);
```

## Parameters

| Name      | Type                  | Description               |
| --------- | --------------------- | ------------------------- |
| `builder` | `*StringBuilder`      | The builder to append to. |
| `value`   | `float64` / `float32` | The value to write.       |

The two widths keep separate overloads, unlike the integers, because the width is not something the value can be widened out of: a `float32` reaches a `float64` exactly, but what it reaches is its **full binary value**, and printing that to the digits a `float64` earns would print noise the `float32` never carried. The overload is what says how many digits the value is worth.

## Remarks

Writes the same text [`ToString`](tostring) would produce, into the builder rather than into a `String` of its own, so a caller who is already accumulating pays no allocation for it.

The value is rendered to fifteen significant digits from a `float64` and seven from a `float32`, with the trailing zeros dropped and a fractional part always written — `1.0` is `1.0`, not `1`. Notation is fixed while the decimal exponent stays in `[-4, digits)` and scientific outside it, following the printf `%g` rule: below `-4` the text would be mostly leading zeros, and at the digit count and above it would be mostly trailing ones.

A NaN is `NaN` and the infinities are `Inf` and `-Inf`. A negative zero keeps its sign as `-0.0`, which is the one thing arithmetic cannot see about it, since it compares equal to a positive zero.

## Example

```rux
import Format::WriteFloat;
import Text::StringBuilder;

var builder = StringBuilder::New();
WriteFloat(&builder, 0.1);         // "0.1"      -- not 0.1000000000000000055
builder.Append(c8' ');
WriteFloat(&builder, 0.1f32);      // "0.1"
builder.Append(c8' ');
WriteFloat(&builder, 2.5e-7);      // "2.5e-07"
builder.Append(c8' ');
WriteFloat(&builder, 1.0 / 0.0);   // "Inf"

var line = builder.IntoString(); // "0.1 0.1 2.5e-07 Inf"

line.Free();
```

## See also

- [`Format`](/api/format/) — the module overview, and what the digit cutoff costs
- [`ToString`](tostring) — the same text in a `String` of its own
- [`IsNan`](isnan) / [`IsInfinite`](isinfinite) — classify a value before writing it
- [`Text::StringBuilder`](/api/text/stringbuilder/) — the builder being appended to
