# `GetPid`

Returns the calling process ID.

**Module:** `BSD`

## Signature

```rux
func GetPid() -> int64;
```

## Returns

`int64` - the process ID assigned by the kernel.

::: warning Error ambiguity
Process IDs from `1` through `4095` satisfy the current [`IsError`](iserror)
range check even though they are valid results. Do not validate `GetPid` with
`IsError`.
:::

## Example

```rux
import BSD::GetPid;

let pid = GetPid();
```

## See also

- [`Process`](process) - process API overview
