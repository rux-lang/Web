# Constants

Constants exported by the `Linux` module.

**Module:** `Linux`

## Standard File Descriptors

| Name     | Type    | Value | Description     |
| -------- | ------- | ----: | --------------- |
| `Stdin`  | `int32` | `0`   | Standard input. |
| `Stdout` | `int32` | `1`   | Standard output.|
| `Stderr` | `int32` | `2`   | Standard error. |

These are conventional descriptor numbers. A program may close or redirect
them, so the corresponding descriptor is not guaranteed to remain open.

## Syscall Numbers

| Name                 | Type     | Value |
| -------------------- | -------- | ----: |
| `SYS_READ`           | `uint64` | `0`   |
| `SYS_WRITE`          | `uint64` | `1`   |
| `SYS_CLOSE`          | `uint64` | `3`   |
| `SYS_MMAP`           | `uint64` | `9`   |
| `SYS_MUNMAP`         | `uint64` | `11`  |
| `SYS_BRK`            | `uint64` | `12`  |
| `SYS_NANOSLEEP`      | `uint64` | `35`  |
| `SYS_GETPID`         | `uint64` | `39`  |
| `SYS_EXIT`           | `uint64` | `60`  |
| `SYS_CLOCK_GETTIME`  | `uint64` | `228` |

These values are valid for the Linux x86-64 syscall ABI only.

## Clock IDs

| Name              | Type    | Value | Description                           |
| ----------------- | ------- | ----: | ------------------------------------- |
| `CLOCK_REALTIME`  | `int32` | `0`   | Settable wall-clock time.             |
| `CLOCK_MONOTONIC` | `int32` | `1`   | Monotonic time since an unspecified point. |

## Memory Protection

| Name         | Type    | Value | Description              |
| ------------ | ------- | ----: | ------------------------ |
| `PROT_READ`  | `int32` | `1`   | Pages may be read.       |
| `PROT_WRITE` | `int32` | `2`   | Pages may be written.    |
| `PROT_EXEC`  | `int32` | `4`   | Pages may be executed.   |

Combine protection values with bitwise OR.

## Mapping Flags

| Name            | Type    | Value | Description                              |
| --------------- | ------- | ----: | ---------------------------------------- |
| `MAP_PRIVATE`   | `int32` | `2`   | Create a private copy-on-write mapping.  |
| `MAP_ANONYMOUS` | `int32` | `32`  | Create a mapping not backed by a file.   |

```rux
let prot = PROT_READ | PROT_WRITE;
let flags = MAP_PRIVATE | MAP_ANONYMOUS;
```

## See also

- [`Mmap`](mmap) — use memory protection and mapping flags
- [`ClockGetTime`](clockgettime) — use a clock ID
- [`Syscall0`–`Syscall6`](syscalls) — use syscall numbers directly

