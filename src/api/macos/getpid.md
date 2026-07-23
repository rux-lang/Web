# `GetPid`

Returns the calling process ID.

**Package:** `MacOS`

## Signature

```rux
func GetPid() -> int64;
```

## Returns

`int64` - the process ID assigned by the kernel.


## Example

```rux
import MacOS::GetPid;

func Main() -> int {
    let pid = GetPid();
    return 0;
}
```

## See also

- [`MacOS`](/api/macos/) — the package overview
