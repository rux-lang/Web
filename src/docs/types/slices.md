# Slices

A slice is a view over a contiguous sequence of elements. Rux has two slice forms:

| Syntax  | Description                                              |
| ------- | -------------------------------------------------------- |
| `T[]`   | Dynamic slice — pointer and length, size known at runtime |
| `T[N]`  | Fixed-size array — `N` elements backed by stack storage  |

Both forms share the same 16-byte runtime representation and the same set of operations.

## Memory Layout

Every slice value occupies exactly **16 bytes** on the stack, regardless of the element type or count:

```
Offset  Size  Field
0       8     data:   *T       — pointer to the first element
8       8     length: uint64   — number of elements
```

The `data` and `length` fields can be read directly in Rux code:

```rux
let nums = [10, 20, 30];
let p = nums.data;    // *int32 — pointer to first element
let n = nums.length;  // uint64 — 3
```

## Dynamic Slices (`T[]`)

A dynamic slice (`T[]`) does not own any memory. It is a fat pointer: a pair of `{data, length}` that describes a region of memory owned by someone else — a stack buffer, a heap allocation, or a static.

```rux
func Sum(values: int32[]) -> int32 {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}
```

Passing a slice to a function does not copy the elements — the 16-byte header is passed by pointer, so the callee reads the same memory.

## Fixed-Size Arrays (`T[N]`)

When you declare a variable with a fixed-size type, the compiler allocates `N × sizeof(T)` bytes on the stack for the element data and initialises the slice header to point at it:

```rux
let buf: char8[1024];   // 1024 bytes on the stack; buf.length == 1024
let rgb: uint8[3];      // 3 bytes on the stack; rgb.length == 3
```

The resulting value is still a 16-byte `{data, length}` header — `T[N]` is syntactic sugar for a stack-backed slice, not a distinct type. A `T[N]` variable is assignable anywhere a `T[]` is expected.

## Slice Literals

A slice literal `[e1, e2, …]` allocates the elements on the stack and returns a slice header pointing to them:

```rux
let primes = [2, 3, 5, 7, 11];   // int32[]; primes.length == 5
let flags  = [true, false, true]; // bool8[]; flags.length == 3
```

## String Literals

A string literal produces a `char8[]` slice whose `data` pointer addresses the string bytes in the `.rodata` section of the binary. The length is the byte count, not including any null terminator (Rux strings are not null-terminated):

```rux
let greeting = "Hello";   // char8[]; greeting.length == 5
```

## Indexing

Use `[i]` to read or write a single element. The index is zero-based:

```rux
let colors = ["red", "green", "blue"];
let first  = colors[0];   // "red"
colors[2]  = "cyan";      // write
```

## Iteration

`for … in` iterates over every element in order:

```rux
let nums = [1, 2, 3, 4, 5];
var sum = 0;
for n in nums {
    sum += n;
}
```

## Spread

Pass all elements of a slice as individual arguments to a variadic function with `…`:

```rux
func Max(values: int32...) -> int32 { /* … */ }

let data = [3, 1, 4, 1, 5, 9];
let m = Max(data...);   // equivalent to Max(3, 1, 4, 1, 5, 9)
```

See [Variadic Functions](/docs/functions#variadic-functions) for details.

## Slices and Pointers

A slice's `data` field is a regular `*T` pointer. You can pass it to `extern` functions or perform pointer arithmetic on it when low-level access is needed:

```rux
extern func memcpy(dst: *opaque, src: *opaque, n: uint) -> *opaque;

let src = [1, 2, 3, 4];
let dst: uint8[4];
memcpy(dst.data, src.data, src.length);
```

## `sizeof` and Element Size

`sizeof(T)` returns the size of a single element in bytes. Multiply by `length` to get the total byte size of the backing buffer:

```rux
let buf: float64[8];
let byteSize = sizeof(float64) * buf.length;   // 64
```
