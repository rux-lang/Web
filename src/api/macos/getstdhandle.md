# `GetStdHandle`

Returns the descriptor for a standard device.

**Module:** `MacOS`

## Signature

```rux
func GetStdHandle(stdHandle: StdHandle) -> *opaque;
```

## Parameters

| Name        | Type        | Description                             |
| ----------- | ----------- | --------------------------------------- |
| `stdHandle` | `StdHandle` | Standard input, output, or error device.|

## Returns

`*opaque` — the corresponding BSD file descriptor encoded as a pointer:
`Input` maps to `0`, `Output` to `1`, and `Error` to `2`.

::: warning
Standard input is descriptor `0`, so its valid encoded handle may equal
`null`. Do not treat `null` as a failure sentinel for this function.
:::

## Example

```rux
import MacOS::{ GetStdHandle, StdHandle };

let output = GetStdHandle(StdHandle::Output);
```

## See also

- [`StdHandle`](types#stdhandle) — standard-device identifiers
- [`ReadFile`](readfile) — read from a handle
- [`WriteFile`](writefile) — write to a handle

