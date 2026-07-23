# Types and Constants

Types and constants exported by the `Linux` package.

**Package:** `Linux`

## Standard File Descriptors

| Name     | Type    | Value | Description      |
| -------- | ------- | ----: | ---------------- |
| `StdIn`  | `int32` | `0`   | Standard input.  |
| `StdOut` | `int32` | `1`   | Standard output. |
| `StdErr` | `int32` | `2`   | Standard error.  |

A process may close or redirect these conventional descriptors.

## Syscall Numbers

Syscall numbers differ by architecture; the package selects the right set for
the active target:

| Name              | x86-64 | AArch64 |
| ----------------- | -----: | ------: |
| `SysRead`         | `0`    | `63`    |
| `SysWrite`        | `1`    | `64`    |
| `SysClose`        | `3`    | `57`    |
| `SysMmap`         | `9`    | `222`   |
| `SysMunmap`       | `11`   | `215`   |
| `SysBrk`          | `12`   | `214`   |
| `SysNanosleep`    | `35`   | `101`   |
| `SysGetPid`       | `39`   | `172`   |
| `SysExit`         | `60`   | `93`    |
| `SysClockGetTime` | `228`  | `113`   |

## Memory Protection

| Name                | Type    | Value | Description            |
| ------------------- | ------- | ----: | ---------------------- |
| `ProtectionNone`    | `int32` | `0`   | No access.             |
| `ProtectionRead`    | `int32` | `1`   | Pages may be read.     |
| `ProtectionWrite`   | `int32` | `2`   | Pages may be written.  |
| `ProtectionExecute` | `int32` | `4`   | Pages may be executed. |

Combine protection values with bitwise OR.

## Mapping Flags

| Name           | Type    | Value | Description                             |
| -------------- | ------- | ----: | --------------------------------------- |
| `MapShared`    | `int32` | `1`   | Create a shared mapping.                |
| `MapPrivate`   | `int32` | `2`   | Create a private copy-on-write mapping. |
| `MapFixed`     | `int32` | `16`  | Place the mapping at the exact address. |
| `MapAnonymous` | `int32` | `32`  | Create a mapping not backed by a file.  |

## Clock IDs

| Name             | Type    | Value | Description                                |
| ---------------- | ------- | ----: | ------------------------------------------ |
| `ClockRealtime`  | `int32` | `0`   | Settable wall-clock time.                  |
| `ClockMonotonic` | `int32` | `1`   | Monotonic time since an unspecified point. |

## `Timespec`

```rux
struct Timespec {
    seconds: int64;
    nanoseconds: int64;
}
```

| Field         | Type    | Description                                            |
| ------------- | ------- | ------------------------------------------------------ |
| `seconds`     | `int64` | Whole seconds.                                         |
| `nanoseconds` | `int64` | Nanoseconds within the second, normally 0–999,999,999. |

[`Nanosleep`](nanosleep) reads it as a relative duration; [`ClockGetTime`](clockgettime)
writes a timestamp for the selected clock.

## See also

- [`Linux`](/api/linux/) — the package overview
- [`Mmap`](mmap) — uses the protection and mapping flags
- [`ClockGetTime`](clockgettime) — uses the clock IDs and `Timespec`
- [`Syscall0`–`Syscall6`](syscalls) — use the syscall numbers directly
