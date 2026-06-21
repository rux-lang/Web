# Intrinsic Constants

Alongside the [constants you declare](/docs/constants/overview), the compiler provides a small set of **intrinsic constants**, each written with a leading `#`. They are not declared anywhere — the compiler substitutes each one with information about the source location or the build at the exact point where it appears.

```rux
Print(#file);   // e.g. "Main.rux"
Print(#line);   // the line number of this call
```

## Available Intrinsics

| Constant    | Type      | Expands to                      |
| ----------- | --------- | ------------------------------- |
| `#module`   | `char8[]` | Name of the enclosing module    |
| `#file`     | `char8[]` | Path of the current source file |
| `#function` | `char8[]` | Name of the enclosing function  |
| `#line`     | `uint`    | Current line number             |
| `#column`   | `uint`    | Current column number           |
| `#date`     | `char8[]` | Date the program was compiled   |
| `#time`     | `char8[]` | Time the program was compiled   |

The string-valued intrinsics produce a [`char8[]`](/docs/slices/literals#string-literals); `#line` and `#column` produce a compile-time unsigned integer that fits wherever an unsigned type such as `uint32` or `uint` is expected.

## Substitution at the Point of Use

An intrinsic expands where it is **written**. `#line` on line 40 evaluates to `40`; `#function` inside `func Parse` evaluates to `"Parse"`. Because the value is fixed at compile time, using one costs nothing at run time — it is already a plain literal by the time the program runs.

## Default Arguments for Diagnostics

The most important use is as a **default argument value**. When an intrinsic is the default for a parameter, it expands at the _call site_ rather than where the function is defined — so the function automatically learns where it was called from. This is exactly how the standard library's [`Assert`](/api/#assert) and [`Fatal`](/api/#fatal) capture a location without the caller passing one:

```rux
func Log(message: char8[],
         file: char8[] = #file,
         function: char8[] = #function,
         line: uint32 = #line) {
    Print(file, ":", line, " (", function, ") ", message);
}

Log("starting up");   // file, function, and line filled in from this call site
```

Callers normally omit these arguments and let the compiler fill them in; pass them explicitly only to forward a location from somewhere else.

## Build Stamps

Because `#date` and `#time` are constant expressions, they can initialize a regular [`const`](/docs/constants/overview), which is a convenient way to embed a build stamp:

```rux
const BuildDate: char8[] = #date;
const BuildTime: char8[] = #time;
```

## See Also

- [Constants](/docs/constants/overview) — declaring your own compile-time constants
- [`Assert`](/api/#assert) and [`Fatal`](/api/#fatal) — standard-library functions that use these intrinsics
- [String Literals](/docs/slices/literals#string-literals) — the `char8[]` type the string intrinsics produce
