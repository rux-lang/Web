# Types and Constants

Types and constants exported by the `MacOS` package.

**Package:** `MacOS`

## Standard File Descriptors

| Name     | Type    | Value | Description      |
| -------- | ------- | ----: | ---------------- |
| `StdIn`  | `int32` | `0`   | Standard input.  |
| `StdOut` | `int32` | `1`   | Standard output. |
| `StdErr` | `int32` | `2`   | Standard error.  |

A process may close or redirect these conventional descriptors.

## Syscall Numbers

Darwin partitions syscall numbers by class: Unix/BSD calls carry the class bits
`UnixSyscallClass` (`0x02000000`), so each exported number is the class OR'd
with the bare ordinal.

| Name                | Value                     |
| ------------------- | ------------------------- |
| `UnixSyscallClass`  | `0x02000000`              |
| `SysExit`           | `UnixSyscallClass \| 1`   |
| `SysRead`           | `UnixSyscallClass \| 3`   |
| `SysWrite`          | `UnixSyscallClass \| 4`   |
| `SysClose`          | `UnixSyscallClass \| 6`   |
| `SysGetPid`         | `UnixSyscallClass \| 20`  |
| `SysMunmap`         | `UnixSyscallClass \| 73`  |
| `SysGetTimeOfDay`   | `UnixSyscallClass \| 116` |
| `SysMmap`           | `UnixSyscallClass \| 197` |

## Memory Protection

| Name                | Type    | Value | Description            |
| ------------------- | ------- | ----: | ---------------------- |
| `ProtectionNone`    | `int32` | `0`   | No access.             |
| `ProtectionRead`    | `int32` | `1`   | Pages may be read.     |
| `ProtectionWrite`   | `int32` | `2`   | Pages may be written.  |
| `ProtectionExecute` | `int32` | `4`   | Pages may be executed. |

## Mapping Flags

| Name           | Type    |  Value | Description                             |
| -------------- | ------- | -----: | --------------------------------------- |
| `MapShared`    | `int32` | `1`    | Create a shared mapping.                |
| `MapPrivate`   | `int32` | `2`    | Create a private copy-on-write mapping. |
| `MapFixed`     | `int32` | `16`   | Place the mapping at the exact address. |
| `MapAnonymous` | `int32` | `4096` | Create a mapping not backed by a file.  |

## `Timeval`

```rux
struct Timeval {
    seconds: int64;
    microseconds: int32;
}
```

| Field          | Type    | Description                                  |
| -------------- | ------- | -------------------------------------------- |
| `seconds`      | `int64` | Whole seconds since the Unix epoch.          |
| `microseconds` | `int32` | Microseconds within the second, 0–999,999.   |

Filled by [`GetTimeOfDay`](gettimeofday).

## See also

- [`MacOS`](/api/macos/) — the package overview
- [`Mmap`](mmap) — uses the protection and mapping flags
- [`Syscall0`–`Syscall6`](syscalls) — use the class-qualified syscall numbers
