# `GetPid`

Returns the calling process ID.

**Package:** `Linux`

## Signature

```rux
func GetPid() -> int64;
```

## Returns

`int64` — the process ID assigned by the kernel. This syscall succeeds for a
running process.

## Example

```rux
import Linux::GetPid;

func Main() -> int {
    let pid = GetPid();
    return 0;
}
```

