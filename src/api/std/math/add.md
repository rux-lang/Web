# `Add`

Adds two integers.

**Module:** `Std::Math`

## Signature

```rux
func Add(x: int, y: int) -> int;
```

## Parameters

| Name | Type  | Description        |
| ---- | ----- | ------------------ |
| `x`  | `int` | First addend.      |
| `y`  | `int` | Second addend.     |

## Returns

`int` — the sum `x + y`.

## Description

A thin wrapper around integer addition, primarily used internally. In normal
code, use the `+` operator directly.

## Example

```rux
import Std::Math;

let total = Math::Add(2, 3);         // 5
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
