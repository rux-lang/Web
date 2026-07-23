# Types and Constants

Types and constants exported by the `Bsd` package.

**Package:** `Bsd`

## Standard File Descriptors

| Name     | Type    | Value | Description      |
| -------- | ------- | ----: | ---------------- |
| `StdIn`  | `int32` | `0`   | Standard input.  |
| `StdOut` | `int32` | `1`   | Standard output. |
| `StdErr` | `int32` | `2`   | Standard error.  |

A process may close or redirect these conventional descriptors.

## Syscall Numbers

These numbers are the same on all four supported BSDs:

| Name         | Type     | Value |
| ------------ | -------- | ----: |
| `SysExit`    | `uint64` | `1`   |
| `SysRead`    | `uint64` | `3`   |
| `SysWrite`   | `uint64` | `4`   |
| `SysClose`   | `uint64` | `6`   |
| `SysBrk`     | `uint64` | `17`  |
| `SysGetPid`  | `uint64` | `20`  |
| `SysMunmap`  | `uint64` | `73`  |

`SysMmap`, `SysNanosleep`, and `SysClockGetTime` are also exported, but their
values are selected for the active target, since they differ between FreeBSD,
OpenBSD, NetBSD, and DragonFly BSD.

## Memory Protection

| Name                 | Type    | Value | Description            |
| -------------------- | ------- | ----: | ---------------------- |
| `ProtectionNone`     | `int32` | `0`   | No access.             |
| `ProtectionRead`     | `int32` | `1`   | Pages may be read.     |
| `ProtectionWrite`    | `int32` | `2`   | Pages may be written.  |
| `ProtectionExecute`  | `int32` | `4`   | Pages may be executed. |

## Mapping Flags

| Name           | Type    |  Value | Description                             |
| -------------- | ------- | -----: | --------------------------------------- |
| `MapShared`    | `int32` | `1`    | Create a shared mapping.                |
| `MapPrivate`   | `int32` | `2`    | Create a private copy-on-write mapping. |
| `MapFixed`     | `int32` | `16`   | Place the mapping at the exact address. |
| `MapAnonymous` | `int32` | `4096` | Create a mapping not backed by a file.  |

These values are shared by all four supported BSDs.

## Clock IDs

| Name             | Type    |   Value | Description                              |
| ---------------- | ------- | ------: | ---------------------------------------- |
| `ClockRealtime`  | `int32` | `0`     | Adjustable wall-clock time.              |
| `ClockMonotonic` | `int32` | `4`/`3` | Monotonic time for interval measurement. |

`ClockMonotonic` is `4` on FreeBSD and DragonFly BSD and `3` on NetBSD and
OpenBSD; the package selects the right value for the active target. Use these
constants with [`ClockGetTime`](clockgettime).

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

Used by [`Nanosleep`](nanosleep) and [`ClockGetTime`](clockgettime).

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Mmap`](mmap) — uses the protection and mapping flags
- [`ClockGetTime`](clockgettime) — uses the clock IDs and `Timespec`
- [`Syscall0`–`Syscall6`](syscalls) — use the syscall numbers directly
