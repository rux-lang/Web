# Package Types

Every package has a type that tells the compiler what to produce. The type is set with the `Type` field in the [package manifest](manifest).

| Type    | Value       | Description                                                    |
| ------- | ----------- | -------------------------------------------------------------- |
| Program | `"Program"` | Produces a runnable program, must define `Main()`              |
| Library | `"Library"` | Produces a dynamic library (`*.dll`, `*.so`) to link against   |
| Source  | `"Source"`  | Distributed as source code and can be included as a dependency |

A **program** is compiled to a runnable executable and must define a `Main()` entry point.

A **library** is compiled to a dynamic library that other packages link against at load time. Rux has no static libraries — a reusable binary is always dynamic.

A **source** package ships its `*.rux` files unchanged and is compiled directly into whatever package depends on it. It produces no standalone artifact of its own.

Program and library packages have slightly different [directory layouts](dirs).
