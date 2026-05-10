---
sidebar: false
prev: false
next: false
---

# API Reference

The Rux standard library is under active development at [github.com/rux-lang/Std](https://github.com/rux-lang/Std). This page documents the current public API.

Add the standard library to your project:

```sh
rux add Std
rux install
```

Then import the modules, data types or functions you need:

```rux
import Std::Io::*;
import Std::Math::*;
import Std::String;
```

## Display

**Module:** `Std`

The core interface for converting values to strings. Implement this interface to make a type work with `Format` and `Print`.

```rux
interface Display {
    func ToString() -> String;
}
```

## String

**Module:** `Std`

An immutable heap-allocated UTF-8 string.

### Struct

```rux
struct String {
    data:   *char8;
    length: uint;
}
```

### Functions

```rux
func From(value: char8[]) -> String
```

Creates a `String` from a string literal or slice.

```rux
func From(value: *const char8, length: uint) -> String
```

Creates a `String` from a raw pointer and byte length.

### Methods

```rux
func Data(self) -> *char8
```

Returns a pointer to the underlying character data.

```rux
func Length(self) -> uint
```

Returns the byte length of the string.

### Operators

```rux
func +(a: String, b: String) -> String
```

Concatenates two strings, returning a new `String`.

## StringBuilder

**Module:** `Std`

A mutable buffer for building strings incrementally.

### Struct

```rux
struct StringBuilder {
    data:     *char8;
    length:   uint;
    capacity: uint;
}
```

### Functions

```rux
func New() -> StringBuilder
```

Creates an empty `StringBuilder`.

### Methods

```rux
func Append(self: &StringBuilder, value: char8[])
func Append(self: &StringBuilder, value: String)
func Append(self: &StringBuilder, value: Display)
```

Appends a value to the buffer. The `Display` overload calls `ToString()` on the argument.

```rux
func ToString(self: &StringBuilder) -> String
```

Returns the accumulated content as an immutable `String`.

## Io

**Module:** `Std::Io`

Console output.

### Functions

```rux
func Print(data: *const char8, length: uint)
```

Writes `length` bytes from `data` to standard output.

```rux
func Print(value: char8[])
```

Writes a string literal or slice to standard output.

```rux
func Print(value: String)
```

Writes a `String` to standard output.

```rux
func Print(fmt: char8[], args: Display...)
```

Formats `fmt` using `args` (see [`Format`](#format)) and writes the result to standard output. Use `{}` as the placeholder in the format string.

**Example:**

```rux
import Std::Io::*;

Print("Hello, {}!\n", name);
```

## Format

**Module:** `Std`

String formatting.

### Functions

```rux
func Format(fmt: char8[], args: Display...) -> String
```

Returns a new `String` with each `{}` placeholder in `fmt` replaced by the corresponding argument's `ToString()` value, in order.

**Example:**

```rux
import Std::Format;

let s = Format("x = {}, y = {}", x, y);
```

## Math

**Module:** `Std::Math`

Mathematical constants and functions.

### Constants

```rux
Pi: float64  // 3.141592653589793
E:  float64  // 2.718281828459045
```

### Functions

All trigonometric and transcendental functions are provided for both `float64` and `float32`.

```rux
func Sin(x: float64) -> float64;
func Sin(x: float32) -> float32;

func Cos(x: float64) -> float64;
func Cos(x: float32) -> float32;

func Tan(x: float64) -> float64;
func Tan(x: float32) -> float32;

func Sqrt(x: float64) -> float64;
func Sqrt(x: float32) -> float32;

func Pow(base: float64, exp: float64) -> float64;
func Pow(base: float32, exp: float32) -> float32;

func Abs(x: float64) -> float64;
func Abs(x: float32) -> float32;

func Floor(x: float64) -> float64;
func Floor(x: float32) -> float32;

func Ceil(x: float64) -> float64;
func Ceil(x: float32) -> float32;

func Round(x: float64) -> float64;
func Round(x: float32) -> float32;
```

Integer addition (primarily for internal use):

```rux
func Add(a: int, b: int) -> int
```

## Memory

**Module:** `Std::Memory`

Raw memory operations. These functions wrap the Windows heap allocator and correspond directly to C runtime equivalents.

### Functions

```rux
func Alloc(size: uint) -> *opaque
```

Allocates `size` bytes on the heap. Returns a pointer to the allocated block, or `null` on failure.

```rux
func Realloc(ptr: *opaque, size: uint) -> *opaque
```

Resizes a previously allocated block. Returns the (possibly moved) pointer.

```rux
func Free(ptr: *opaque)
```

Releases a heap-allocated block.

```rux
func Set(ptr: *opaque, value: uint8, size: uint)
```

Fills `size` bytes starting at `ptr` with `value`.

```rux
func Zero(ptr: *opaque, size: uint)
```

Zeroes `size` bytes starting at `ptr`. Equivalent to `Set(ptr, 0, size)`.

```rux
func Copy(dst: *opaque, src: *opaque, size: uint)
```

Copies `size` bytes from `src` to `dst`. Regions must not overlap.

```rux
func Compare(a: *opaque, b: *opaque, size: uint) -> int32
```

Compares `size` bytes at `a` and `b`. Returns `0` if equal, negative if `a < b`, positive if `a > b`.

## Assert

**Module:** `Std`

Debug assertion.

### Functions

```rux
func Assert(
    condition: bool,
    message:   char8[],
    file:      char8[]   = #file,
    function:  char8[]   = #function,
    line:      uint32    = #line,
    column:    uint32    = #column,
)
```

If `condition` is `false`, prints the file, function, line, column, and `message` to standard error, then exits with code `1`.

The `#file`, `#function`, `#line`, and `#column` default arguments are substituted by the compiler at each call site — callers typically omit them.

**Example:**

```rux
import Std::Assert;

Assert(index < length, "index out of bounds");
```

## Fatal

**Module:** `Std`

Unconditional termination with a diagnostic message.

### Functions

```rux
func Fatal(
    message:  char8[],
    file:     char8[]  = #file,
    function: char8[]  = #function,
    line:     uint32   = #line,
    column:   uint32   = #column,
)
```

Prints `message` with the call-site location to standard error and exits with code `1`. Use this for unrecoverable errors where continuing execution makes no sense.

**Example:**

```rux
import Std::Fatal;

Fatal("unreachable: unknown variant");
```

## System

**Module:** `Std::System`

Process control.

### Functions

```rux
func Exit(code: uint32)
```

Terminates the current process with the given exit code.

## Type Extensions

The following extensions implement `Display` for built-in numeric and boolean types, enabling them to be passed to `Print` and `Format`.

### int64

**Module:** `Std`

```rux
func ToString(value: int64) -> String
```

Converts a signed 64-bit integer to its decimal string representation.

### uint64

**Module:** `Std`

```rux
func ToString(value: uint64) -> String
```

Converts an unsigned 64-bit integer to its decimal string representation.

### float64

**Module:** `Std`

```rux
func IsNan(value: float64) -> bool
```

Returns `true` if `value` is NaN.

```rux
func IsInfinite(value: float64) -> bool
```

Returns `true` if `value` is positive or negative infinity.

```rux
func ToString(value: float64) -> String
```

Converts a 64-bit floating-point number to its decimal string representation.

### bool8

**Module:** `Std`

`bool8` implements `Display` and returns `"true"` or `"false"`.
