# `GetProcAddress`

Retrieves the address of an exported DLL symbol.

**Package:** `Windows`

**Microsoft documentation:** [`GetProcAddress`](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getprocaddress)

## Signature

```rux
func GetProcAddress(
    module_arg: *opaque,
    procName: *char8
) -> *opaque;
```

## Parameters

| Name         | Description                              |
| ------------ | ---------------------------------------- |
| `module_arg` | Loaded module handle.                    |
| `procName`   | Null-terminated, case-sensitive export name. |

## Returns

`*opaque` — the export address, or `null` when not found. Cast it to a function
pointer with the exact native signature and calling convention before use. The
address becomes invalid when its module is unloaded.

## See also

- [`LoadLibraryA`](loadlibrarya) — load a module
- [`FreeLibrary`](freelibrary) — release a module reference
