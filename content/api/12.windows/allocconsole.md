# AllocConsole

Allocates a console for the calling process.

**Package:** `Windows`

**Microsoft documentation:** [`AllocConsole`](https://learn.microsoft.com/en-us/windows/console/allocconsole)

## Signature

```rux
func AllocConsole() -> bool32;
```

## Returns

`bool32` — nonzero on success or zero on failure. Call
[`GetLastError`](/api/windows/getlasterror) after failure.

## Description

A process can be associated with at most one console. After allocation, obtain
the console handles with [`GetStdHandle`](/api/windows/getstdhandle).

## See also

- [`Windows`](/api/windows) — the package overview
- [`GetStdHandle`](/api/windows/getstdhandle) — retrieve a standard device handle
