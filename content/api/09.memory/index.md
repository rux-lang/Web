---
navigation:
  title: Overview
---

# Memory Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

The package provides raw memory management — allocating, resizing, and releasing blocks, and filling, copying, and comparing the bytes inside them.

**Package:** `Memory`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Memory](https://github.com/rux-lang/Rux/tree/main/Packages/Memory)

Every function is implemented per target, so a call compiles down to the platform's own primitives rather than to a bundled allocator: the Win32 heap and the `Rtl*` intrinsics on Windows, and anonymous `mmap` mappings on Linux and macOS. The API is the same on all of them.

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

Implemented on BSD, Linux, macOS, and Windows.

## Memory model

The block a caller receives is raw and owned: nothing tracks it, nothing frees it, and its contents are whatever the platform last left there. [`Alloc`](/api/memory/alloc) does not zero it — use [`Zero`](/api/memory/zero) when you need a clean block. Every block returned by [`Alloc`](/api/memory/alloc) or [`Realloc`](/api/memory/realloc) must be released exactly once with [`Free`](/api/memory/free), and a pointer that [`Realloc`](/api/memory/realloc) has moved must not be used again.

Passing a pointer these functions did not produce, releasing the same block twice, or reading or writing outside the requested size is undefined behavior — it is not checked and it will not be diagnosed.

## Functions

### Allocation

| Function                         | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| [`Alloc`](/api/memory/alloc)     | Allocate an uninitialized block of memory.     |
| [`Realloc`](/api/memory/realloc) | Resize a block, preserving the bytes that fit. |
| [`Free`](/api/memory/free)       | Release a block back to the platform.          |

### Filling

| Function                   | Description                        |
| -------------------------- | ---------------------------------- |
| [`Set`](/api/memory/set)   | Fill a block with a repeated byte. |
| [`Zero`](/api/memory/zero) | Fill a block with zero bytes.      |

### Bulk operations

| Function                         | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| [`Copy`](/api/memory/copy)       | Copy bytes between two non-overlapping blocks.    |
| [`Compare`](/api/memory/compare) | Find the offset at which two blocks first differ. |
