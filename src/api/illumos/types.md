# Types and Constants

Types and constants exported by the `Illumos` module.

**Module:** `Illumos`

## Standard File Descriptors

| Name     | Type    | Value | Description     |
| -------- | ------- | ----: | --------------- |
| `Stdin`  | `int32` | `0`   | Standard input. |
| `Stdout` | `int32` | `1`   | Standard output.|
| `Stderr` | `int32` | `2`   | Standard error. |

These are conventional descriptor numbers. A process may close or redirect
them, so the corresponding descriptor is not guaranteed to remain open.

## Syscall Numbers

| Name                | Type     | Value |
| ------------------- | -------- | ----: |
| `SYS_EXIT`          | `uint64` | `1`   |
| `SYS_READ`          | `uint64` | `3`   |
| `SYS_WRITE`         | `uint64` | `4`   |
| `SYS_CLOSE`         | `uint64` | `6`   |
| `SYS_BRK`           | `uint64` | `17`  |
| `SYS_GETPID`        | `uint64` | `20`  |
| `SYS_MMAP`          | `uint64` | `115` |
| `SYS_MUNMAP`        | `uint64` | `117` |
| `SYS_CLOCK_GETTIME` | `uint64` | `191` |
| `SYS_NANOSLEEP`     | `uint64` | `199` |

These values are valid for the Illumos x86-64 syscall ABI only.

## Memory Protection

| Name         | Type    | Value | Description            |
| ------------ | ------- | ----: | ---------------------- |
| `PROT_READ`  | `int32` | `1`   | Pages may be read.     |
| `PROT_WRITE` | `int32` | `2`   | Pages may be written.  |
| `PROT_EXEC`  | `int32` | `4`   | Pages may be executed. |

Combine protection values with bitwise OR.

## Mapping Flags

| Name            | Type    | Value | Description                             |
| --------------- | ------- | ----: | --------------------------------------- |
| `MAP_PRIVATE`   | `int32` | `2`   | Create a private copy-on-write mapping. |
| `MAP_ANONYMOUS` | `int32` | `256` | Create a mapping not backed by a file.  |

## Clock IDs

| Name              | Type    | Value | Description                              |
| ----------------- | ------- | ----: | ---------------------------------------- |
| `CLOCK_REALTIME`  | `int32` | `3`   | Adjustable wall-clock time.              |
| `CLOCK_MONOTONIC` | `int32` | `4`   | Monotonic time for interval measurement. |

## `Timespec`

```rux
struct Timespec {
    tv_sec:  int64;
    tv_nsec: int64;
}
```

| Field     | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| `tv_sec`  | `int64` | Whole seconds.                                   |
| `tv_nsec` | `int64` | Nanoseconds within the second, normally 0-999,999,999. |

[`ClockGetTime`](clockgettime) writes a clock value into this structure.
[`Nanosleep`](nanosleep) accepts opaque pointers; pass a pointer to `Timespec`
for its requested and remaining intervals.

## See also

- [`Mmap`](mmap) - use protection and mapping flags
- [`Time`](time) - use clock IDs and `Timespec`
- [`Raw syscalls`](syscalls) - use syscall numbers directly
