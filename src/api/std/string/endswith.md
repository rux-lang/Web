# `EndsWith`

Reports whether the string ends with a given suffix.

**Module:** `Std`

## Signature

```rux
func EndsWith(self, suffix: String) -> bool;
```

## Parameters

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| `suffix` | `String` | The suffix to test for. |

## Returns

`bool` — `true` if the string ends with `suffix`. A suffix longer than the
string returns `false`.

## See also

- [`String`](/api/std/string/) — the string type
- [`StartsWith`](startswith) — test the start of the string
