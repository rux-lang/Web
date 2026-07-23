# Build Context

The build context is a set of five [intrinsics](/docs/comptime/intrinsic) the compiler fills in for each build. Every one is declared by the standard `Rux` package, so you **import** the ones you use:

```rux
import Rux::{ #target, #build, #compiler, #source, #config };
```

| Intrinsic  | Describes                                              |
| ---------- | ----------------------------------------------------- |
| `#target`  | The machine and ABI the program is being built for     |
| `#build`   | The build profile, mode, and timestamps                |
| `#compiler`| The Rux compiler itself                                |
| `#source`  | The current source location                            |
| `#config`  | Key/value definitions supplied by the build            |

Read a field with `.`; the field names are **lowerCamelCase**, and the query methods are **PascalCase**. Every value is fixed at compile time, so it can drive a [`when`](/docs/comptime/conditional) condition or stand in as an ordinary literal in normal code.

```rux
import Rux::{ #build };

const BuildDate: Slice<char8> = #build.date;   // baked in as a literal
```

## `#target` {#target}

Facts about the machine, operating system, and ABI the current build targets.

| Field / method       | Type                       | Example value          |
| -------------------- | -------------------------- | ---------------------- |
| `os`                 | `OperatingSystem`          | `.Linux`               |
| `arch`               | `Architecture`             | `.X86_64`              |
| `abi`                | `ApplicationBinaryInterface` | `.SystemV`           |
| `endian`             | `Endianness`               | `.Little`              |
| `pointerBits`        | integer                    | `64`                   |
| `dataModel`          | `DataModel`                | `.LP64`                |
| `objectFormat`       | `ObjectFormat`             | `.ELF`                 |
| `triple`             | `Slice<char8>`                  | `"x86_64-linux-gnu"`   |
| `HasFeature(.AVX2)`  | `bool`                     | whether a CPU feature is enabled |

```rux
import Rux::{ #target };

when #target.arch == .X86_64 && #target.HasFeature(.AVX2) {
    UseAvx2Kernel();
} else {
    UseScalarKernel();
}
```

## `#build` {#build}

The profile and options the build was invoked with, plus a single timestamp shared across the whole compilation.

| Field / method    | Type              | Notes                                             |
| ----------------- | ----------------- | ------------------------------------------------- |
| `profile`         | `Slice<char8>`         | Profile name, e.g. `"Debug"` or `"Release"`       |
| `mode`            | `BuildMode`       | `.Debug` or `.Release`                            |
| `optimization`    | `OptimizationMode`| `.None`, `.Size`, or `.Speed`                     |
| `debugAssertions` | `bool`            | Whether `DebugAssert` checks are compiled in      |
| `debugInfo`       | `bool`            | Whether debug information is emitted               |
| `isTest`          | `bool`            | `true` under `rux test`                           |
| `outputKind`      | `OutputKind`      | `.Executable`, `.SharedLibrary`, or `.StaticLibrary` |
| `timestamp`       | integer           | Unix seconds; honors `SOURCE_DATE_EPOCH`          |
| `date`            | `Slice<char8>`         | `"YYYY-MM-DD"` from `timestamp`                   |
| `time`            | `Slice<char8>`         | `"HH:MM:SS"` from `timestamp`                     |

## `#compiler` {#compiler}

The compiler building the program.

| Field / method                  | Type              | Notes                                       |
| ------------------------------- | ----------------- | ------------------------------------------- |
| `version`                       | `SemanticVersion` | Has `.major`, `.minor`, `.patch`; orderable |
| `HasFeature("link-attribute")`  | `bool`            | Whether the compiler supports a named feature |

`version` compares against another `SemanticVersion`, so code can require a minimum compiler:

```rux
import Rux::{ #compiler };

when #compiler.version >= SemanticVersion::New(0, 3, 0) {
    UseNewIntrinsic();
}
```

Feature names accepted by `#compiler.HasFeature` include `"conditional-compilation"`, `"namespaced-intrinsics"`, `"target-intrinsics"`, `"build-intrinsics"`, `"compiler-feature-detection"`, `"source-location-defaults"`, `"extern-symbol-names"`, `"link-attribute"`, and `"no-return-attribute"`.

## `#source` {#source}

The location in the source where the intrinsic is written. Reading one costs nothing at run time — it is already a literal.

| Field       | Type       | Expands to                                  |
| ----------- | ---------- | ------------------------------------------- |
| `line`      | integer    | Current line number                         |
| `column`    | integer    | Current column number                       |
| `file`      | `Slice<char8>`  | File name, e.g. `"Main.rux"`                |
| `fileName`  | `Slice<char8>`  | Alias of `file`                             |
| `filePath`  | `Slice<char8>`  | Stable package-relative path                |
| `function`  | `Slice<char8>`  | Enclosing function name                     |
| `module`    | `Slice<char8>`  | Enclosing module path                       |

### Source Location as a Default Argument

The most important use of `#source` is as a **default argument**. A default expands at the *call site*, not where the function is defined, so a function can learn where it was called from without the caller passing anything. This is how the standard library's [`Assert`](/api/#assert) and [`Fatal`](/api/#fatal) capture a location:

```rux
import Rux::{ #source };

func Log(message: Slice<char8>,
         file: Slice<char8> = #source.file,
         line: uint32 = #source.line,
         function: Slice<char8> = #source.function) {
    Print(file, ":", line, " (", function, ") ", message);
}

Log("starting up");   // file, line, and function filled in from this call site
```

Callers normally omit these arguments; pass them explicitly only to forward a location from elsewhere.

## `#config` {#config}

Key/value strings supplied by the build — from a `[Build.Defines]` table in [`Rux.toml`](/docs/packages/manifest) and overridden by `--define NAME[=VALUE]` on the command line.

| Method                | Type      | Result                                          |
| --------------------- | --------- | ----------------------------------------------- |
| `#config.Get("NAME")` | `Slice<char8>` | The value, or an empty string when undefined    |
| `#config.Has("NAME")` | `bool`    | Whether the key is defined                       |

```rux
import Rux::{ #config };

when #config.Has("TELEMETRY") {
    EnableTelemetry(#config.Get("TELEMETRY"));
}
```

## Enum Variant Reference

The enum-valued fields draw from these variants. Only buildable operating systems can actually be produced; naming any other in a `when` is allowed but [warns](/docs/comptime/conditional#naming-an-unbuildable-target).

| Enum                         | Variants                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `OperatingSystem`            | `Windows`, `Linux`, `MacOS`, `FreeBSD`, `OpenBSD`, `NetBSD`, `DragonFlyBSD`, `Illumos`, `Solaris` (buildable); `AIX`, `Android`, `Fuchsia`, `Haiku`, `IOS`, `QNX`, `Redox` (nameable only) |
| `Architecture`              | `X86_64`, `X86Bit32`, `AArch64`, `ARM32`, `RISCV64`, `RISCV32`                               |
| `ApplicationBinaryInterface` | `SystemV`, `WindowsX64`, `WindowsX86`, `AAPCS`, `AAPCS64`, `RiscvIlp32`, `RiscvLp64`         |
| `Endianness`                | `Little`, `Big`                                                                              |
| `DataModel`                 | `ILP32`, `LP64`, `LLP64`                                                                     |
| `ObjectFormat`              | `COFF`, `ELF`, `MachO`, `Wasm`                                                               |
| `BuildMode`                 | `Debug`, `Release`                                                                           |
| `OptimizationMode`          | `None`, `Size`, `Speed`                                                                      |
| `OutputKind`                | `Executable`, `SharedLibrary`, `StaticLibrary`                                               |

CPU features for `#target.HasFeature` are `SSE2`, `SSE3`, `SSSE3`, `SSE41`, `SSE42`, `AVX`, `AVX2`, `AVX512`, `NEON`, `SVE`, and `RVV`.

## See Also

- [Conditional Compilation](/docs/comptime/conditional) — using these values in a `when`
- [Intrinsics](/docs/comptime/intrinsic) — how `#target` and friends are declared and imported
- [Package Manifest](/docs/packages/manifest) — the `[Build.Defines]` table behind `#config`
