---
head:
  - - meta
    - itemprop: name
      content: Rux 0.2.0 — A Real Language, Allegedly
  - - meta
    - itemprop: description
      content: Rux 0.2.0 brings control flow, slices, tuples, enums, interfaces, modules, packages, and more. The language is starting to look like, well, a language.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/blog/2026/v0.2.0.webp
  - - meta
    - property: og:url
      content: https://rux-lang.dev/blog/release-v0.2.0
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:title
      content: Rux 0.2.0 — A Real Language, Allegedly
  - - meta
    - property: og:description
      content: Rux 0.2.0 brings control flow, slices, tuples, enums, interfaces, modules, packages, and more. The language is starting to look like, well, a language.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/blog/2026/v0.2.0.webp
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux 0.2.0 — A Real Language, Allegedly
  - - meta
    - name: twitter:description
      content: Rux 0.2.0 brings control flow, slices, tuples, enums, interfaces, modules, packages, and more. The language is starting to look like, well, a language.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/blog/2026/v0.2.0.webp
---

# Rux 0.2.0 — A Real Language, Allegedly

![Rux v0.2.0](/images/blog/2026/v0.2.0.webp)

In v0.1.0, Rux could compile a `Main` function that did arithmetic and returned an integer. It was humble. It was honest. It was, frankly, not very useful.

**Rux 0.2.0 fixes that.** This release ships control flow, slices, tuples, enums, interfaces, modules, packages, function overloading, and more. The compiler now handles programs you'd actually want to write — and produces native x86-64 binaries that actually run them.

Let's go through what's new.

## Control Flow

Rux now has `if`, `while`, `do-while`, `for`, and `loop`. Your programs can make decisions. They can repeat themselves. They can finally do something other than return a constant.

```rux
func Clamp(value: int32, min: int32, max: int32) -> int32 {
    if value < min { return min; }
    if value > max { return max; }
    return value;
}
```

```rux
func Factorial(n: int32) -> int32 {
    var result = 1;
    var i = 1;
    while i <= n {
        result *= i;
        i++;
    }
    return result;
}
```

`for` iterates over ranges and slices with the `in` keyword:

```rux
for i in 0..10 {
    Process(i);  // 0 through 9
}

for i in 0..=10 {
    Process(i);  // 0 through 10
}
```

`loop` creates an infinite loop that runs until `break`:

```rux
loop {
    let input = ReadLine();
    if input == "quit" { break; }
    Handle(input);
}
```

## Slices

Slices are variable-length views over contiguous memory. A slice type is written `T[]`; a fixed-size array is `T[N]`.

```rux
func Sum(values: int32[]) -> int32 {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}
```

You can index into a slice with `[i]` and spread a slice into a variadic call with `...`:

```rux
let nums = [1, 2, 3, 4, 5];
let result = Sum(nums...);  // 15
```

## Tuples

Tuples are fixed-size, anonymous product types. They're useful for returning multiple values from a function without declaring a struct.

```rux
func MinMax(values: int32[]) -> (int32, int32) {
    var min = values[0];
    var max = values[0];
    for v in values {
        if v < min { min = v; }
        if v > max { max = v; }
    }
    return (min, max);
}
```

Tuple types are written `(T, U, V)` and tuple values are constructed the same way.

## Enums

Enums are named sum types. Each variant can carry data — positional or named fields.

```rux
enum Direction { North, South, East, West }

enum Shape {
    Circle(radius: float64),
    Rect(width: float64, height: float64),
}
```

Use `match` to handle enum variants exhaustively. The compiler requires all cases to be covered:

```rux
func Area(shape: Shape) -> float64 {
    match shape {
        Shape.Circle(r) => 3.14159 * r * r,
        Shape.Rect(w, h) => w * h,
    }
}
```

## Interfaces and `extend`

Interfaces define structural contracts. Any type that provides the required methods satisfies the interface.

```rux
interface Area {
    func Compute(self) -> float64;
}
```

Use `extend` to implement an interface for a type — or to add methods to any type at all:

```rux
struct Circle {
    radius: float64;
}

extend Circle for Area {
    func Compute(self) -> float64 {
        return 3.14159 * self.radius * self.radius;
    }
}
```

Methods added via `extend` are called with the familiar dot syntax: `circle.Compute()`.

## Modules and Packages

The `module` keyword declares which module a source file belongs to. Functions from other modules are imported with `import`.

```rux
// Math.rux
module Math {
    func Add(a: int32, b: int32) -> int32 {
        return a + b;
    }

    func Mul(a: int32, b: int32) -> int32 {
        return a * b;
    }
}
```

```rux
// Main.rux
import Math::*;

func Main() -> int {
    return Add(3, Mul(2, 5));  // 13
}
```

Modules compose into **packages** — multi-file compilation units with their own `Rux.toml` manifest and dependency resolution. The compiler now builds entire packages in one pass and resolves cross-package imports automatically.

## Function Overloading

Multiple functions can share a name as long as their parameter signatures differ. The compiler picks the right one at the call site:

```rux
func Area(side: float64) -> float64 {
    return side * side;
}

func Area(width: float64, height: float64) -> float64 {
    return width * height;
}

Area(5.0);       // square  → 25.0
Area(3.0, 4.0);  // rectangle → 12.0
```

## `sizeof`

The `sizeof` operator returns the byte size of a type at compile time:

```rux
let a = sizeof(int8);    // 1
let b = sizeof(int32);   // 4
let c = sizeof(float64); // 8
```

This is particularly useful when working with packed data or FFI.

## Build Statistics

`rux build` now prints a summary after a successful build:

```
16 files | 724 LOC | 3K tokens | 122.9K LOC/s | App.exe 48 KB
```

Small thing. Very satisfying.

## What's Next?

Rux 0.2.0 is a big step — the language now covers the features you need to write real programs. What's still ahead: a standard library, string operations, fatal errors, generics.

Follow along on [GitHub](https://github.com/rux-lang/Rux/releases), join the conversation on [Discord](https://discord.com/invite/uvSHjtZSVG), and keep an eye on the [changelog](https://github.com/rux-lang/Rux/blob/main/CHANGELOG.md).

The compiler is getting smarter. Try to keep up.
