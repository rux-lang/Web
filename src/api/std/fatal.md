# `Fatal`

Reports an unrecoverable error and terminates the process.

**Module:** `Std`

## Signature

```rux
func Fatal(
    message:  char8[],
    file:     char8[]  = #file,
    function: char8[]  = #function,
    line:     uint     = #line,
    column:   uint     = #column,
);
```

## Parameters

| Name       | Type      | Description                                                        |
| ---------- | --------- | ----------------------------------------------------------------- |
| `message`  | `char8[]` | A description of what went wrong.                                 |
| `file`     | `char8[]` | Source file of the call site. Supplied by the compiler — omit it. |
| `function` | `char8[]` | Function of the call site. Supplied by the compiler — omit it.    |
| `line`     | `uint`    | Line of the call site. Supplied by the compiler — omit it.        |
| `column`   | `uint`    | Column of the call site. Supplied by the compiler — omit it.      |

## Description

`Fatal` prints `message` together with the call-site location, then exits the
process with code `1`. Use it for unrecoverable conditions where continuing
execution makes no sense — a corrupt invariant, an unreachable branch, or a
missing resource the program cannot run without.

The `#file`, `#function`, `#line`, and `#column` default arguments are
substituted by the compiler at each call site, so callers pass only `message`.

::: warning
`Fatal` does not return — it terminates the process immediately. Any deferred
work or cleanup after the call site will not run. For recoverable checks, prefer
returning an error; for debug-only invariants, use `Assert`.
:::

## Example

```rux
import Rux::Fatal;

func Main() -> int {
    let config = LoadConfig();
    if config == null {
        Fatal("could not load configuration");
    }
    // ... unreachable if config is null ...
    return 0;
}
```

Output:

```
Fatal error: could not load configuration
--> Src/Main.rux:6:9
    in function Main
```
