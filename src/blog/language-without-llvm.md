---
head:
  - - meta
    - itemprop: name
      content: Programming Language Without LLVM
  - - meta
    - itemprop: description
      content: Rux is a new systems programming language built from scratch without LLVM, featuring a custom compiler pipeline, object format, linker, and package manager.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/og-blog.jpg
  - - meta
    - property: og:url
      content: https://rux-lang.dev/blog/language-without-llvm
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:title
      content: Programming Language Without LLVM
  - - meta
    - property: og:description
      content: Rux is a new systems programming language built from scratch without LLVM, featuring a custom compiler pipeline, object format, linker, and package manager.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/og-blog.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Programming Language Without LLVM
  - - meta
    - name: twitter:description
      content: Rux is a new systems programming language built from scratch without LLVM, featuring a custom compiler pipeline, object format, linker, and package manager.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/og-blog.jpg
---

# Programming Language Without LLVM

We've been building a compiled, systems-capable programming language called **Rux** and just cut the 0.2.2 release. We'd love to get feedback from developers, especially from people who've thought hard about language design and compiler architecture.

## What is Rux?

Rux is a fast, compiled, strongly typed, multi-paradigm language. The compiler is written from scratch in C++26, with no LLVM backend — it has its own pipeline from source all the way to native binaries via a custom object file format (RCU) and linker.

The full pipeline looks like this:

```
Source → Lexer → Parser → AST → Sema → HIR → LIR → ASM → RCU → Linker → Native Binary
```

Every stage is dumpable (`--dump-tokens`, `--dump-ast`, `--dump-sema`, `--dump-hir`, `--dump-lir`, `--dump-asm`, `--dump-rcu`) which has been invaluable for debugging and understanding what the compiler is actually doing at each step.

## The Language

Rux sits somewhere between Rust and a hypothetical "what if C had a modern redesign". The syntax leans toward clarity and ergonomics without sacrificing control.

A minimal example:

```rux
import Std::Io::PrintLine;

func Main() -> int {
    let a = 10;
    let b = 20;
    PrintLine("{} + {} = {}", a, b, a + b);
    return 0;
}
```

A more representative one:

```rux
module Geom {
    struct Vec2 {
        x: float64;
        y: float64;
    }

    extend Vec2 {
        func *(self, other: Vec2) -> float64 {
            return self.x * other.x + self.y * other.y;
        }
    }

    interface Shape {
        func Area(self) -> float64;
        func Perimeter(self) -> float64;
    }
}
```

### Type system

- Primitive integers: `int8`, `int16`, `int32`, `int64`, `uint8` ... `uint64`
- Floats: `float32`, `float64`
- Booleans: `bool8`, `bool16`, `bool32`
- Composite types: `struct`, `enum` (sum types), `union`, tuples `(T, U, V)`
- Slices: `T[]` for variable-length, `T[N]` for fixed-size arrays
- Pointers: `*T`
- Type aliases: `type Name = OtherType`
- Interfaces for structural contracts + vtable dispatch
- `extend` blocks for adding methods to any type (including external ones)
- Generics via type parameters

### Control flow

The usual suspects — `if`/`else`, `for`/`in`, `while`, `do`-`while`, `loop`, `break`/`continue` with optional labels, `match` with pattern matching (wildcards, literals, ranges, enum destructuring, struct patterns, guarded arms).

### Calling conventions

Functions can specify Win64 vs System V AMD64 ABI. The `extern` keyword handles FFI with DLL imports, variadic functions, and extern variables.

### Attributes

Rux uses a `@[...]` syntax for annotations:

```rux
@[Target("Linux")]
func Path(x: int32) -> String {
    // implementation
}

@[Import(lib: "kernel32.dll")]
extern func Beep(freq: uint32, duration: uint32) -> bool32;

@[Deprecated("Use NewFunc instead")]
func OldFunc() {
    // implementation
}
```

PascalCase names, `@` is not address-of (`&` is).

### Inline Assembly

Designed for systems programming, Rux has first-class inline asm:

```rux
asm func ReadCr3() -> uint64 {
    mov rax, cr3
    ret
}
```

Register names and mnemonics are lowercase (consistent with GAS/LLVM conventions, as opposed to older MASM uppercase style).

## The Compiler Internals

A few things I'm particularly happy with:

**Custom object format (RCU).** Rather than emitting ELF/COFF directly, the compiler generates RCU (Rux Compilation Unit) files — a simple binary format that carries sections, symbols, relocations, source metadata, and a build hash. The linker then combines them into a native executable. This keeps the backend clean and gives full control over the object model.

**HIR/LIR split.** The HIR (High-level IR) is a typed tree that mirrors the source closely — it still has `if`, `for`, structs, interfaces, etc. The LIR (Low-level IR) flattens everything into basic blocks with explicit jumps and three-address instructions. This made implementing control flow and pattern matching much easier than trying to do both simultaneously.

**No GC, no runtime.** Rux compiles to bare metal. There's no garbage collector, no runtime library overhead. Memory management is manual (or will be — RAII/resource types are on the roadmap).

**The assembly emitter** targets x86-64 with NASM-compatible output (Intel syntax, System V AMD64 ABI). Register allocation is currently naive (everything spilled to the stack) — a proper allocator is next.

## The Package Manager

Rux ships with a built-in package manager. Current commands:

```sh
rux new <name> [--bin | --lib]   # scaffold a new project
rux build [--debug | --release]  # compile
rux run                          # build + execute
rux install [package][@version]  # add a dependency
rux uninstall [package]          # remove a dependency
rux list [--global]              # show installed packages
rux update [--global]            # update to latest
rux add --path <path>            # add local dependency
```

Build stats are printed after every successful compile (files, lines, time per stage), which is surprisingly motivating.

## Platform Support

As of current release:

- **FreeBSD x86-64**
- **Linux x86-64**
- **Windows x86-64**

The compiler itself requires C++26 (Clang 19+, GCC 14+, MSVC 2022+) and CMake 4.2+.

## What's Missing / Rough

Team will be upfront about current limitations:

- Register allocation is trivially naive (everything spilled to stack)
- No optimizer passes yet
- No closures or first-class functions in the language yet
- Generics are parsed but codegen support is incomplete
- No standard library beyond syscall thunks for I/O
- Error messages could be much better

The language is moving fast. 0.1.0 was April 30, 0.2.0 on May 10, 0.2.2 on May 28 — roughly one significant release every two weeks.

## Why Another Language?

Most languages today force a tradeoff that shouldn't exist: you either get a language that's pleasant to write, or one that compiles fast, runs fast, and doesn't hide what the machine is doing. Rux is an attempt to close that gap.

**Simple syntax.** C++ has decades of accumulated complexity — arcane template syntax, multiple ways to do the same thing, and a learning curve that punishes newcomers. Rust is better, but its ownership model demands significant upfront investment before you can be productive. Rux aims for a syntax that feels immediately readable: `func`, `struct`, `enum`, `extend`, `interface` — keywords that say what they mean, a consistent declaration style, and no hidden magic. You should be able to read Rux code on day one.

**Fast compilation.** Slow builds are a productivity tax paid on every save. A common complaint about Rust is that incremental compile times can feel brutal on large projects. Rux doesn't use LLVM — the backend is a direct x86-64 emitter with a straightforward HIR → LIR → ASM → object pipeline. Fewer layers means fewer places for compile time to hide. The goal is sub-second rebuilds for typical project sizes.

**Fast execution.** No garbage collector. No runtime. No hidden allocations. Rux compiles to native machine code and gets out of the way. The current register allocator is naive (everything spills to the stack) — that's a known limitation we're actively working on — but the architecture is designed so that optimization passes slot in cleanly without redesigning the pipeline.

**A build system that doesn't fight you.** One of Go's most underrated wins is that `go build` just works. You don't configure it, you don't write a separate build file in a different language, and you don't spend an afternoon reading documentation to add a dependency. Rux takes the same stance: `rux new`, `rux build`, `rux run`, `rux install`. The manifest is simple, the CLI is the only interface you need, and dependencies resolve without ceremony.

None of this is novel in isolation. The bet is that combining all four — readable syntax, fast builds, native performance, and a friction-free build system — in a single language with no legacy constraints is worth doing from scratch.

## Links

- GitHub: https://github.com/rux-lang/rux
- Docs: https://rux-lang.dev/docs
- Discord: https://discord.com/invite/uvSHjtZSVG

Happy to answer questions about any of the compiler internals, design decisions, or the road ahead.
