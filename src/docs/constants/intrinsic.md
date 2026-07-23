# Intrinsic Constants

Alongside the [constants you declare](/docs/constants/overview), the compiler exposes a set of **intrinsic values** through the [build context](/docs/comptime/context). Each is a field of an intrinsic — `#source`, `#build`, `#target`, `#compiler`, or `#config` — that you import from the standard `Rux` package and read with `.`. Because every one is fixed at compile time, it can initialize an ordinary [`const`](/docs/constants/overview) or serve as a default argument, at no run-time cost.

```rux
import Rux::{ #source, #build };

Print(#source.file);   // e.g. "Main.rux"
Print(#source.line);   // the line number of this call
```

## Common Compile-Time Values

| Value            | Type      | Expands to                        |
| ---------------- | --------- | --------------------------------- |
| `#source.file`   | `Slice<char8>` | Current source file name          |
| `#source.line`   | `uint`    | Current line number               |
| `#source.column` | `uint`    | Current column number             |
| `#source.function` | `Slice<char8>` | Enclosing function name         |
| `#source.module` | `Slice<char8>` | Enclosing module path             |
| `#build.date`    | `Slice<char8>` | Date the program was compiled     |
| `#build.time`    | `Slice<char8>` | Time the program was compiled     |

See [Build Context](/docs/comptime/context) for the complete set, including `#target`, `#compiler`, and `#config`.

> These replace the earlier standalone `#file`, `#line`, `#date`, and `#time` constants, which are now fields of `#source` and `#build`.

## Substitution at the Point of Use

A build-context value expands where it is **written**. `#source.line` on line 40 evaluates to `40`; `#source.function` inside `func Parse` evaluates to `"Parse"`. The value is a plain literal by the time the program runs.

## Build Stamps

Because `#build.date` and `#build.time` are constant expressions, they can initialize a regular [`const`](/docs/constants/overview) — a convenient way to embed a build stamp:

```rux
import Rux::{ #build };

const BuildDate: Slice<char8> = #build.date;
const BuildTime: Slice<char8> = #build.time;
```

## Source Location as a Default Argument

When a `#source` field is the default value of a parameter, it expands at the **call site**, so a function learns where it was called from without the caller passing anything — the pattern behind [`Assert`](/api/#assert) and [`Fatal`](/api/#fatal). See [Source Location as a Default Argument](/docs/comptime/context#source-location-as-a-default-argument) for the full example.

## See Also

- [Build Context](/docs/comptime/context) — every compiler-provided value in one place
- [Intrinsics](/docs/comptime/intrinsic) — how these values are declared and imported
- [Constants](/docs/constants/overview) — declaring your own compile-time constants
