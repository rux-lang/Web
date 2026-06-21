# Pointers

A pointer holds the memory address of a value. The type `*T` is a pointer to a value of type `T`. Pointers enable indirection, low-level memory access, and interoperation with foreign code.

```rux
var x = 42;
let p: *int32 = &x;   // p points to x
let y = *p;           // y == 42 — read through the pointer
*p = 7;               // write through the pointer; x == 7
```

## Addresses and Hexadecimal

Every byte of memory has a numbered location called its **address**. An address is just an unsigned integer, but it is almost always written in **hexadecimal** — base 16, with a `0x` prefix — because hex maps cleanly onto the underlying bits and keeps large addresses short:

```
decimal 4096  ==  hex 0x1000
```

Taking the address of `x` with `&x` yields that number. If you print a pointer you will see a value such as:

```rux
var x = 42;
let p = &x;
Print(p);    // e.g. 0x7ffd3a4b00c0  — x lives at this address
```

These addresses are assigned by the operating system and loader at run time, so the exact value differs on every run and on every machine. The hex numbers shown throughout this chapter are **illustrative** — never hard-code an address.

## How a Pointer Is Stored in Memory

A value of type `T` occupies `sizeof(T)` bytes somewhere in memory. A pointer to it is a separate value whose contents are simply that location's address:

```
                Memory
   Address        Contents
  ┌────────────┬───────────────┐
  │ 0x7ffd00c0 │ 42            │ ← x   : int32  (4 bytes of data)
  ├────────────┼───────────────┤
  │ 0x7ffd00c8 │ 0x7ffd00c0    │ ← p   : *int32 (holds x's address)
  └────────────┴───────────────┘
```

Reading `*p` means "go to the address stored in `p` (`0x7ffd00c0`) and read the value there" — yielding `42`. Writing `*p = 7` stores `7` back into that same cell, which is why `x` changes too: `p` and `x` name the same memory.

A pointer is itself a fixed-size value: its size is the target's **address width** — 8 bytes on a 64-bit target, 4 bytes on a 32-bit target — regardless of how large `T` is. A `*int8` and a `*float512` are the same size, because both store only an address, not the data it points to.

## Address-of and Dereference

The unary `&` operator takes the address of a value, producing a pointer. The unary `*` operator dereferences a pointer, yielding the value it points to.

```rux
var count = 0;
let ptr = &count;     // *int32

*ptr += 1;            // count == 1
let current = *ptr;   // current == 1
```

`&` requires an addressable operand — a variable, a field, or an element of a slice. Temporary values produced by an expression do not have a stable address, so `&(a + b)` is not allowed.

## Topics in This Chapter

Each remaining aspect of pointers has a dedicated page:

| Topic                                                       | Description                                       |
| ----------------------------------------------------------- | ------------------------------------------------- |
| [Pointer Types](/docs/pointers/types)                       | `*T`, `*const T`, nesting, and `*opaque`          |
| [The `null` Pointer](/docs/pointers/null)                   | The zero address and checking for no value        |
| [Fields and Members](/docs/pointers/members)                | Accessing struct fields through a pointer         |
| [Pointer Arithmetic](/docs/pointers/arithmetic)             | Advancing a pointer by element size               |
| [Pointers and `extern`](/docs/pointers/extern)              | Exchanging memory with native code                |
