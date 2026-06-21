# `Brk`

Invokes the kernel's raw program-break operation.

**Module:** `Linux`

## Signature

```rux
func Brk(addr: *opaque) -> int64;
```

## Parameters

| Name   | Type      | Description                                  |
| ------ | --------- | -------------------------------------------- |
| `addr` | `*opaque` | Requested new program break, or `null` to query it. |

## Returns

`int64` — the resulting program-break address.

## Description

This is the raw Linux syscall contract, which differs from libc's `brk`
wrapper. The kernel returns the current break when it cannot set the requested
value; that result is not represented as negative errno. To detect failure,
compare the returned address with the requested address.

::: danger
Changing the program break can conflict with the runtime allocator and corrupt
process memory. Application code should normally use `Std::Memory` or
[`Mmap`](mmap) instead.
:::

## Example

```rux
import Linux::Brk;

let currentBreak = Brk(null) as *opaque;
```

