# `StartsWith`

Reports whether the string begins with a given prefix.

**Module:** `Std`

## Signature

```rux
func StartsWith(self, prefix: String) -> bool;
```

## Parameters

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| `prefix` | `String` | The prefix to test for. |

## Returns

`bool` — `true` if the string begins with `prefix`. A prefix longer than the
string returns `false`.

## See also

- [`String`](/api/std/string/) — the string type
- [`EndsWith`](endswith) — test the end of the string
