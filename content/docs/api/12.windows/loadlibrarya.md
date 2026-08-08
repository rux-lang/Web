# LoadLibraryA

Loads a DLL into the calling process.

**Package:** `Windows`

**Microsoft documentation:** [`LoadLibraryA`](https://learn.microsoft.com/en-us/windows/win32/docs/api/libloaderapi/nf-libloaderapi-loadlibrarya)

## Signature

```rux
func LoadLibraryA(
    libFileName: *char8
) -> *opaque;
```

## Parameters

| Name          | Description                         |
| ------------- | ----------------------------------- |
| `libFileName` | Null-terminated ANSI DLL path/name. |

## Returns

`*opaque` — a module handle on success or `null` on failure. Release a
successful handle with [`FreeLibrary`](/docs/api/windows/freelibrary). Use a trusted, explicit
path when the name is configurable to avoid unintended DLL search results.

## See also

- [`GetProcAddress`](/docs/api/windows/getprocaddress) — resolve an export
- [`Windows`](/docs/api/windows) — the package overview
