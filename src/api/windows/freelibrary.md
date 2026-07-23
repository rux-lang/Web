# `FreeLibrary`

Releases a reference to a loaded DLL.

**Package:** `Windows`

**Microsoft documentation:** [`FreeLibrary`](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-freelibrary)

## Signature

```rux
func FreeLibrary(module_arg: *opaque) -> bool32;
```

## Parameters

| Name         | Description             |
| ------------ | ----------------------- |
| `module_arg` | Loaded module handle.   |

## Returns

`bool32` — nonzero on success or zero on failure. When the reference count
reaches zero, the DLL is unloaded and addresses returned by `GetProcAddress`
become invalid.

## See also

- [`LoadLibraryA`](loadlibrarya) — load a module
- [`Windows`](/api/windows/) — the package overview
