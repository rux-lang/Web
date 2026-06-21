# Types and Constants

Types and constants exported by the `BSD` module.

**Module:** `BSD`

## Standard File Descriptors

| Name     | Type    | Value | Description     |
| -------- | ------- | ----: | --------------- |
| `Stdin`  | `int32` | `0`   | Standard input. |
| `Stdout` | `int32` | `1`   | Standard output.|
| `Stderr` | `int32` | `2`   | Standard error. |

A process may close or redirect these conventional descriptors.

## Syscall Numbers

| Name          | Type     | Value |
| ------------- | -------- | ----: |
| `SYS_EXIT`    | `uint64` | `1`   |
| `SYS_READ`    | `uint64` | `3`   |
| `SYS_WRITE`   | `uint64` | `4`   |
| `SYS_CLOSE`   | `uint64` | `6`   |
| `SYS_GETPID`  | `uint64` | `20`  |
| `SYS_BRK`     | `uint64` | `45`  |
| `SYS_MUNMAP`  | `uint64` | `73`  |

The package uses dedicated per-BSD thunks instead of exported syscall numbers
for `mmap`, `nanosleep`, and `clock_gettime`.

## Memory Protection

| Name         | Type    | Value | Description            |
| ------------ | ------- | ----: | ---------------------- |
| `PROT_READ`  | `int32` | `1`   | Pages may be read.     |
| `PROT_WRITE` | `int32` | `2`   | Pages may be written.  |
| `PROT_EXEC`  | `int32` | `4`   | Pages may be executed. |

## Mapping Flags

| Name            | Type    | Value  | Description                             |
| --------------- | ------- | -----: | --------------------------------------- |
| `MAP_PRIVATE`   | `int32` | `2`    | Create a private copy-on-write mapping. |
| `MAP_ANONYMOUS` | `int32` | `4096` | Create a mapping not backed by a file.  |

OpenBSD uses `32` for its native anonymous-mapping flag. Use
`MAP_ANONYMOUS` with the package's [`Mmap`](mmap) compatibility wrapper rather
than passing it to an arbitrary raw OpenBSD syscall.

## Clock IDs

| Name              | Type    | Value | Description                              |
| ----------------- | ------- | ----: | ---------------------------------------- |
| `CLOCK_REALTIME`  | `int32` | `0`   | Adjustable wall-clock time.              |
| `CLOCK_MONOTONIC` | `int32` | `4`   | Monotonic time for interval measurement. |

OpenBSD uses `3` for its native monotonic-clock ID. Use this compatibility
constant with [`ClockGettime`](clockgettime).

## `timespec`

```rux
struct timespec {
    tv_sec:  int64;
    tv_nsec: int64;
}
```

| Field     | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| `tv_sec`  | `int64` | Whole seconds.                                   |
| `tv_nsec` | `int64` | Nanoseconds within the second, normally 0-999,999,999. |

The lowercase type name is part of the current public API. It is used by
[`Nanosleep`](nanosleep) and [`ClockGettime`](clockgettime).

## See also

- [`Mmap`](mmap) - use protection and mapping flags
- [`Time`](time) - use clocks and `timespec`
- [`Raw syscalls`](syscalls) - use shared syscall numbers
