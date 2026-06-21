# `GetPid`

Returns the calling process ID.

**Module:** `Illumos`

## Signature

```rux
func GetPid() -> int64;
```

## Returns

`int64` - the process ID assigned by the kernel.

::: warning Error ambiguity
Process IDs from `1` through `4095` satisfy the current [`IsError`](iserror)
range check even though they are valid results. Do not validate `GetPid` by
passing its result to `IsError`.
:::

## Example

```rux
import Illumos::GetPid;

let pid = GetPid();
```

## See also

- [`Process`](process) - process API overview
