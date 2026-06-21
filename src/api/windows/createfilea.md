# `CreateFileA`

Creates or opens a file or I/O device.

**Module:** `Windows`

**Microsoft documentation:** [`CreateFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea)

## Signature

```rux
func CreateFileA(fileName: *const char8, desiredAccess: FileAccess,
    shareMode: FileShare, securityAttributes: *opaque,
    creationDisposition: CreationDisposition, flagsAndAttributes: uint32,
    templateFile: *opaque) -> *opaque;
```

## Parameters

| Name                     | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `fileName`               | Null-terminated ANSI path.                      |
| `desiredAccess`          | Requested read and/or write access.             |
| `shareMode`              | Sharing permitted to later opens.               |
| `securityAttributes`     | Security attributes, or `null`.                 |
| `creationDisposition`    | Create/open behavior.                           |
| `flagsAndAttributes`     | File attributes and Win32 flags.                |
| `templateFile`           | Template handle, normally `null`.               |

## Returns

`*opaque` — an open handle on success or `INVALID_HANDLE_VALUE` on failure.
Close a successful result with [`CloseHandle`](closehandle).

## See also

- [`File I/O`](files) — file API overview
- [`Types and constants`](types) — file enums
