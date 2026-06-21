# Assembler Functions

An `asm func` body is written directly in assembly for the build target instead of Rux. Use it when exact instruction-level control is required:

```rux
asm func Greet() {
    mov eax, 4      // 'write' system call
    mov ebx, 1      // file descriptor (stdout)
    mov ecx, msg    // pointer to the string
    mov edx, len    // length of the string
    int 0x80        // call the kernel

    mov eax, 1      // 'exit' system call
    xor ebx, ebx    // return code 0
    int 0x80        // call the kernel
}
```

The instruction set is that of the build target, so an `asm func` is inherently platform-specific — pair it with [`@[Target]`](/docs/attributes/target) when a package supports more than one architecture.

## See Also

- [Function Declaration](/docs/functions/declaration) — ordinary Rux-bodied functions
- [`@[Target]`](/docs/attributes/target) — restricting a function to one platform
- [Foreign Function Interface](/docs/ffi/overview) — calling external native code instead
