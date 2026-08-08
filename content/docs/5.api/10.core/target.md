# #target

Compile-time information about the compilation target.

**Package:** `Rux`

## Definition

```rux
intrinsic #target: Target;

struct Target {
    os: OperatingSystem;
    arch: Architecture;
    abi: ApplicationBinaryInterface;
    endian: Endianness;
    pointerBits: uint;
    dataModel: DataModel;
    objectFormat: ObjectFormat;
    triple: Slice<char8>;
}

extend Target {
    intrinsic func HasFeature(self, feature: TargetFeature) -> bool;
}
```

`#target` is a compile-time value describing the platform the code is being compiled for. It is the primary input to [conditional compilation](/docs/lang/comptime/conditional): match on `#target.os` or `#target.arch` in a [`when`](/docs/lang/comptime/conditional) to select platform-specific code, and use `HasFeature` to gate on CPU features.

## Fields

| Field          | Type                         | Description                     |
| -------------- | ---------------------------- | ------------------------------- |
| `os`           | `OperatingSystem`            | Target operating system.        |
| `arch`         | `Architecture`               | Target processor architecture.  |
| `abi`          | `ApplicationBinaryInterface` | Calling convention and ABI.     |
| `endian`       | `Endianness`                 | Byte order.                     |
| `pointerBits`  | `uint`                       | Width of a pointer in bits.     |
| `dataModel`    | `DataModel`                  | Integer and pointer size model. |
| `objectFormat` | `ObjectFormat`               | Object-file format emitted.     |
| `triple`       | `Slice<char8>`               | Target triple as text.          |

`HasFeature(feature: TargetFeature) -> bool` reports whether the target enables a given CPU feature.

## Enums

```rux
enum OperatingSystem: uint8 {
    Unknown, AIX, Android, DragonFlyBSD, FreeBSD, Fuchsia, Haiku, Illumos,
    IOS, Linux, MacOS, NetBSD, OpenBSD, QNX, Redox, Solaris, Windows
}

enum Architecture: uint8 {
    Unknown, ARM32, AArch64, RISCV32, RISCV64, X86Bit32, X86_64
}

enum ApplicationBinaryInterface: uint8 {
    Unknown, AAPCS, AAPCS64, RiscvIlp32, RiscvLp64, SystemV, WindowsX64, WindowsX86
}

enum TargetFeature: uint8 {
    AVX, AVX2, AVX512, NEON, RVV, SSE2, SSE3, SSE41, SSE42, SSSE3, SVE
}

enum Endianness: uint8 { Big, Little }
enum DataModel: uint8 { Unknown, ILP32, LLP64, LP64 }
enum ObjectFormat: uint8 { Unknown, COFF, ELF, MachO, Wasm }
```

## Example

```rux
import Core::{ #target };

func Main() -> int {
    when #target.os {
        .Linux => { /* Linux path */ },
        .Windows => { /* Windows path */ },
        else => {}
    }
    return 0;
}
```

## See also

- [`Core`](/docs/api/core) — the package overview
- [`#build`](/docs/api/core/build) / [`#compiler`](/docs/api/core/compiler) / [`#config`](/docs/api/core/config) / [`#source`](/docs/api/core/source) — the other compile-time values
- [Conditional Compilation](/docs/lang/comptime/conditional) — selecting code by target
