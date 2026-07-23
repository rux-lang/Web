# Assembler Functions

An `asm func` replaces the usual Rux body with a sequence of x86-64 instructions written by hand in **Intel syntax** (the destination operand comes first). Reach for one only when you need exact control over the emitted machine code — a system-call stub, a CPU-feature probe, or a routine the language cannot otherwise express — and are prepared to manage registers, the stack, and the calling convention yourself. The body is assembled straight to machine code, bypassing the normal compilation pipeline.

```rux
asm func Halt() {
    ret
}
```

`asm` is a modifier on `func`. It combines with `pub`, parameters, a return type, and [attributes](/docs/attributes/overview), and an `asm func` may appear anywhere an ordinary function can.

## The Body

Between the braces, each entry is either an **instruction** or a **label**. Newlines are not significant to the compiler — an instruction ends at its last operand — but the convention is one instruction per line. Both `// line` and `/* block */` comments are allowed.

```rux
asm func Countdown() {
    mov ecx, 10
loop_start:            // a label
    dec ecx
    jnz loop_start     // jump back while ecx != 0
    ret
}
```

Mnemonics and register names are **case-insensitive**; the compiler lower-cases them. A label is any name followed by `:`, and jumps to it are resolved within the function.

## Operands

An instruction takes zero or more comma-separated operands of four kinds:

| Kind          | Written as              | Purpose                                          |
| ------------- | ----------------------- | ------------------------------------------------ |
| **Register**  | `rax`, `ecx`, `xmm0`    | A CPU register                                   |
| **Immediate** | `42`, `0xFF`, `-1`      | A constant value encoded into the instruction    |
| **Memory**    | `[rbp + rax*4 - 8]`     | A memory reference                               |
| **Symbol**    | `Helper`, `Message`     | Another function, global, or data name           |

- **Register** — the full x86-64 general-purpose file in every width (`rax`/`eax`/`ax`/`al`, `r8`…`r15` with their `d`/`w`/`b` forms, plus `spl`/`bpl`/`sil`/`dil` and the legacy high-byte `ah`/`bh`/`ch`/`dh`), and the SSE registers `xmm0`…`xmm15`.
- **Immediate** — an integer literal in decimal, hexadecimal (`0x`), octal (`0o`), or binary (`0b`), with `_` digit separators and an optional sign: `42`, `-1`, `0xFF`, `0b1010`.
- **Memory** — `[base + index*scale ± disp]`; any part is optional and `scale` is 1, 2, 4, or 8. Prefix a `byte`, `word`, `dword`, or `qword` size when the width is otherwise ambiguous (an optional `ptr` is accepted). RIP-relative addressing is written `[rip + symbol]`.
- **Symbol** — any identifier that is not a register names another function, global, or data symbol. The assembler emits a relocation that the linker resolves, so this is how one `asm func` calls another function or takes the address of a global.

```rux
mov  rax, qword [rbp - 8]     // memory operand with a size prefix
lea  rsi, [rip + Message]     // rip-relative address of a global
call Helper                   // symbol reference → relocation
```

## Supported Instructions

The assembler recognises a curated subset of x86-64 — enough for stubs, system calls, and numeric kernels, not the entire instruction set. An unrecognised mnemonic is a compile-time error.

| Category                       | Mnemonics                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Data movement                  | `mov`, `movzx`, `movsx`, `movsxd`, `lea`, `push`, `pop`, `test`                                                    |
| Integer arithmetic & logic     | `add`, `sub`, `adc`, `sbb`, `and`, `or`, `xor`, `cmp`, `inc`, `dec`, `neg`, `not`, `mul`, `imul`, `div`, `idiv`    |
| Shifts & rotates               | `shl` / `sal`, `shr`, `sar`, `rol`, `ror` — the count is an immediate or `cl`                                      |
| Control flow                   | `jmp`, `call`, `ret`, `leave`, `nop`, conditional `jCC` (e.g. `je`, `jne`, `jl`, `jae`), and `setCC`               |
| System                         | `syscall`, `int`, `int3`                                                                                           |
| Sign extension                 | `cqo`, `cdq`, `cdqe`                                                                                               |
| SSE / SSE2 (scalar and packed) | moves `movsd`/`movss`/`movups`/`movupd`/`movaps`/`movapd`, `movd`, `movq`; arithmetic `addsd`…`divss`, `sqrtsd`/`sqrtss`, `minsd`/`maxsd`; compares `comisd`/`ucomiss`; conversions `cvtsi2sd`, `cvtsd2si`, `cvttsd2si`, `cvtss2si`, `cvtsd2ss`, `cvtss2sd`; bitwise `xorps`/`xorpd`, `andps`, `orps`, `andnps`, `pxor`, `pand`, `por` |

## Signature, Parameters, and Return Values

An `asm func` may declare parameters and a return type. They are **not** bound to names inside the body — they only fix the function's signature and the calling convention its callers use. Your instructions must read arguments from, and leave the result in, the registers that convention dictates.

The listing below follows the System V AMD64 ABI (Linux, BSD, macOS), where the first two integer arguments arrive in `edi`/`esi` and the result is returned in `eax`:

```rux
asm func Add(a: int32, b: int32) -> int32 {
    mov eax, edi
    add eax, esi
    ret
}
```

On Windows (the Win64 ABI) those two arguments would instead arrive in `ecx`/`edx`. No prologue or epilogue is generated for you — the body is emitted verbatim, so you are responsible for stack alignment, preserving callee-saved registers, and the closing `ret`.

The calling convention follows the platform default — System V AMD64 on Linux, Win64 elsewhere. Pin it explicitly with an `#Abi` attribute when you need a fixed ABI regardless of target: `#Abi(.SysV)`, `#Abi(.Win64)`, or `#Abi(.C)` for the platform's C ABI.

```rux
#Abi(.SysV)
asm func Add(a: int32, b: int32) -> int32 {
    mov eax, edi
    add eax, esi
    ret
}
```

## Platform Specificity

Because the body is raw machine code for one architecture and one ABI, an `asm func` is inherently platform-specific. When a package supports more than one target, provide a matching implementation per platform and select between them with [conditional compilation](/docs/comptime/conditional):

```rux
import Rux::{ #target };

when #target.os == .Linux {
    asm func WriteStdout(buf: *char8, len: uint64) -> int64 {
        // SysV passes buf in rdi and len in rsi.
        // Linux write(fd, buf, count) wants rdi=fd, rsi=buf, rdx=count.
        mov rdx, rsi        // count = len
        mov rsi, rdi        // buf
        mov rdi, 1          // fd = stdout
        mov rax, 1          // SYS_write
        syscall
        ret                 // the kernel leaves the result in rax
    }
}
```

RCU, the object format the compiler emits, is x86-64 only, so `asm func` bodies are always x86-64 regardless of target OS. The AArch64 backend does not support inline assembly.

## See Also

- [Function Declaration](/docs/functions/declaration) — ordinary Rux-bodied functions
- [Conditional Compilation](/docs/comptime/conditional) — restricting a function to one platform with `when`
- [Foreign Function Interface](/docs/ffi/overview) — calling external native code instead of writing assembly
- [Rux Compiled Unit](/docs/appendix/rcu) — how symbol references become relocations
