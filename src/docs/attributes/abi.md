# `Abi`

Selects the **calling convention** a function is compiled with — the contract for how arguments, the return value, and the stack are arranged. Most code never needs it: Rux uses the right convention for the target automatically. Reach for `#Abi` at a foreign boundary that must follow a specific ABI regardless of the platform default.

## Syntax

```rux
#Abi(.SysV)
func FastPath(a: int32, b: int32) -> int32 {
    return a + b;
}
```

The argument is one of three ABI variants:

| Variant  | Convention                                                         |
| -------- | ------------------------------------------------------------------ |
| `.C`     | Whatever the target's C ABI is — Win64 on Windows, System V elsewhere |
| `.SysV`  | System V AMD64 (Linux, the BSDs, macOS)                            |
| `.Win64` | Microsoft x64                                                      |

Without `#Abi`, a function uses the platform's default convention. `#Abi(.C)` is the form to use when calling into or being called from C.

## On `extern` and `asm`

`#Abi` is most useful on declarations that cross a language boundary — [`extern`](/docs/ffi/extern) functions and [`asm func`](/docs/functions/assembler) bodies — where the ABI must match exactly what the other side expects:

```rux
#Abi(.Win64)
asm func Add(a: int32, b: int32) -> int32 {
    mov eax, ecx      // Win64: first two integer args in ecx/edx
    add eax, edx
    ret
}
```

## See Also

- [Assembler Functions](/docs/functions/assembler) — where a fixed ABI matters most
- [`extern` Declarations](/docs/ffi/extern) — foreign functions that follow a C ABI
- [Attributes](/docs/attributes/overview) — the full attribute set
