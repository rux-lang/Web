# `Repeat`

Returns a copy of the contents laid down N times.

**Package:** `Text`

## Signature

```rux
func Repeat(self, count: uint) -> String;
```

## Parameters

| Name    | Type   | Description                         |
| ------- | ------ | ----------------------------------- |
| `count` | `uint` | How many times to lay the bytes down. |

## Returns

A new `String` holding the receiver's bytes `count` times over, in a block of its own. The receiver is left untouched. Repeating zero times, or repeating the empty string, yields the empty string.

The block is sized up front — it goes through a [`StringBuilder`](../stringbuilder/) built with [`WithCapacity`](../stringbuilder/withcapacity) — so this costs **one** allocation rather than one per round.

## Example

```rux
import Text::String;

func Main() -> int {
    var dash = String::From("-");

    var rule = dash.Repeat(20); // "--------------------"
    rule.Length();              // 20

    rule.Free();
    dash.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`+`](plus) — join two different strings
- [`StringBuilder::WithCapacity`](../stringbuilder/withcapacity) — the one allocation this leans on
