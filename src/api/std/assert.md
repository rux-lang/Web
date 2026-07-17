# `Assert`

Checks a condition and aborts the program if it is false.

**Module:** `Std`

## Signature

```rux
func Assert(
    condition: bool,
    message:   char8[],
    file:      char8[]  = #file,
    function:  char8[]  = #function,
    line:      uint     = #line,
    column:    uint     = #column,
);
```

## Parameters

| Name        | Type      | Description                                                        |
| ----------- | --------- | ----------------------------------------------------------------- |
| `condition` | `bool`    | The condition that is expected to hold.                           |
| `message`   | `char8[]` | Text describing what was being asserted.                          |
| `file`      | `char8[]` | Source file of the call site. Supplied by the compiler — omit it. |
| `function`  | `char8[]` | Function of the call site. Supplied by the compiler — omit it.    |
| `line`      | `uint`    | Line of the call site. Supplied by the compiler — omit it.        |
| `column`    | `uint`    | Column of the call site. Supplied by the compiler — omit it.      |

## Description

If `condition` is `true`, `Assert` does nothing. If it is `false`, it prints
`message` together with the call-site location and exits the process with code
`2`.

The `#file`, `#function`, `#line`, and `#column` default arguments are filled in
by the compiler at each call site, so callers pass only `condition` and
`message`.

::: warning
A failed assertion terminates the process — it does not unwind or return. Use it
to catch programming errors (broken invariants), not for recoverable runtime
conditions. For unconditional termination, see [`Fatal`](fatal).
:::

## Example

```rux
import Rux::Assert;

func Divide(a: int, b: int) -> int {
    Assert(b != 0, "divisor must be non-zero");
    return a / b;
}
```

If the assertion fails, the program prints:

```
Assertion failed: divisor must be non-zero
--> Src/Main.rux:4:5
    in function Divide
```

## See also

- [`Fatal`](fatal) — terminate unconditionally with a message
- [`Exit`](exit) — terminate with a specific exit code
