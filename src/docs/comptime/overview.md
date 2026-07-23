# Compile-Time Programming

Some of a Rux program is decided while it is being **compiled**, before any of it runs. The compiler exposes facts about the build, selects which code to compile, and substitutes values that are fixed the moment the program is built. Together these features let one source tree target several platforms and configurations without a preprocessor or a separate build language.

Everything in this chapter is evaluated by the compiler and leaves **no run-time cost**: a chosen branch is compiled as if it were the only code written, and a substituted value is already a plain literal by the time the program runs.

## The Pieces

| Feature                                               | What it does                                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Conditional Compilation](/docs/comptime/conditional) | Compiles one branch and discards the others, based on a compile-time condition                |
| [Build Context](/docs/comptime/context)               | Read-only facts about the target, build profile, compiler, source location, and configuration |
| [Intrinsics](/docs/comptime/intrinsic)                | Values and functions the compiler supplies, including the build context itself                |

## How It Fits Together

The build context is a set of [intrinsics](/docs/comptime/intrinsic) — `#target`, `#build`, `#compiler`, `#source`, and `#config` — that the standard `Rux` package declares and your code imports. A [`when`](/docs/comptime/conditional) reads those intrinsics to decide which code to keep:

```rux
import Rux::{ #target };

when #target.os == .Windows {
    // compiled only on Windows
} else {
    // compiled everywhere else
}
```

Because the discarded branch is never analyzed, it may reference functions or libraries that exist only on the platform it targets.

## Compile Time vs. Run Time

Rux keeps the two conditionals visually distinct so it is always clear which decisions the compiler makes and which the program makes as it runs:

| Written                              | Decided         | Both branches compiled?    |
| ------------------------------------ | --------------- | -------------------------- |
| [`if`](/docs/statements/if)          | At run time     | Yes                        |
| [`when`](/docs/comptime/conditional) | At compile time | No — only the taken branch |

## See Also

- [Conditional Compilation](/docs/comptime/conditional) — the `when` construct in full
- [Build Context](/docs/comptime/context) — every fact `#target`, `#build`, `#compiler`, `#source`, and `#config` expose
- [Intrinsics](/docs/comptime/intrinsic) — the `intrinsic` keyword and how the build context is declared
- [Constants](/docs/constants/overview) — named compile-time values
