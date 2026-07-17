# Memory Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

The package provides raw memory management — allocating, resizing, and releasing blocks, and filling, copying, and comparing the bytes inside them.

**Module:** `Memory`

**Source:** [github.com/rux-lang/Memory](https://github.com/rux-lang/Memory)

Every function is implemented per target, so a call compiles down to the platform's own primitives rather than to a bundled allocator: the Win32 heap and the `Rtl*` intrinsics on Windows, and anonymous `mmap` mappings on Linux, macOS, and illumos. The API is the same on all of them.

```rux
import Memory::{ Alloc, Free, Set };
import Io::PrintLine;

func Main() -> int {
    let buffer = Alloc(1024);
    if buffer == null {
        return 1;
    }

    Set(buffer, 1024, 0xFF);
    PrintLine(*(buffer as *uint8)); // 255

    Free(buffer);
    return 0;
}
```

## Installation

```sh
rux add Memory
rux install
```

## Platform support

Implemented on Illumos, Linux, macOS, and Windows. **BSD is not implemented yet** — every function is a stub that returns `null`, `0`, or does nothing at all, so a program that calls into this package on BSD compiles but does no work.

## Memory model

The block a caller receives is raw and owned: nothing tracks it, nothing frees it, and its contents are whatever the platform last left there. [`Alloc`](alloc) does not zero it — use [`Zero`](zero) when you need a clean block. Every block returned by [`Alloc`](alloc) or [`Realloc`](realloc) must be released exactly once with [`Free`](free), and a pointer that [`Realloc`](realloc) has moved must not be used again.

Passing a pointer these functions did not produce, releasing the same block twice, or reading or writing outside the requested size is undefined behavior — it is not checked and it will not be diagnosed.

## Functions

### Allocation

| Function             | Description                                    |
| -------------------- | ---------------------------------------------- |
| [`Alloc`](alloc)     | Allocate an uninitialized block of memory.     |
| [`Realloc`](realloc) | Resize a block, preserving the bytes that fit. |
| [`Free`](free)       | Release a block back to the platform.          |

### Filling

| Function       | Description                        |
| -------------- | ---------------------------------- |
| [`Set`](set)   | Fill a block with a repeated byte. |
| [`Zero`](zero) | Fill a block with zero bytes.      |

### Bulk operations

| Function             | Description                                       |
| -------------------- | ------------------------------------------------- |
| [`Copy`](copy)       | Copy bytes between two non-overlapping blocks.    |
| [`Compare`](compare) | Find the offset at which two blocks first differ. |
