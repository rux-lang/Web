# `AllocConsole`

Allocates a console for the calling process.

**Module:** `Windows`

**Microsoft documentation:** [`AllocConsole`](https://learn.microsoft.com/en-us/windows/console/allocconsole)

## Signature

```rux
func AllocConsole() -> bool32;
```

## Returns

`bool32` — nonzero on success or zero on failure. Call
[`GetLastError`](getlasterror) after failure.

## Description

A process can be associated with at most one console. After allocation, obtain
the console handles with [`GetStdHandle`](getstdhandle).

## See also

- [`Console`](console) — console API overview
- [`GetStdHandle`](getstdhandle) — retrieve a standard device handle
