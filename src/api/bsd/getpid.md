# `GetPid`

Returns the calling process ID.

**Package:** `Bsd`

## Signature

```rux
func GetPid() -> int64;
```

## Returns

`int64` - the process ID assigned by the kernel.


## Example

```rux
import Bsd::GetPid;

func Main() -> int {
    let pid = GetPid();
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
