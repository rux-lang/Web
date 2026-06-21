# Types

Types and constants exported by the `MacOS` module.

**Module:** `MacOS`

## `StdHandle`

Identifies one of the process's standard devices.

```rux
enum StdHandle: uint32 {
    Error  = 0xFFFFFFF4,
    Output = 0xFFFFFFF5,
    Input  = 0xFFFFFFF6
}
```

| Member   | macOS descriptor | Description     |
| -------- | ----------------: | --------------- |
| `Error`  | `2`               | Standard error. |
| `Output` | `1`               | Standard output.|
| `Input`  | `0`               | Standard input. |

Pass a member to [`GetStdHandle`](getstdhandle). The values mirror the Win32
standard-handle constants because the Rux linker exposes a compatibility API;
the returned values are macOS BSD file descriptors encoded as pointers.

::: warning
The handle for `Input` may compare equal to `null` because descriptor `0` is
encoded as a pointer. It is still a valid standard-input handle.
:::

## Example

```rux
import MacOS::{ GetStdHandle, StdHandle };

let input = GetStdHandle(StdHandle::Input);
let output = GetStdHandle(StdHandle::Output);
let error = GetStdHandle(StdHandle::Error);
```

## See also

- [`Console and I/O`](console) — operations that use standard handles

