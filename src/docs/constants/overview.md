# Constants

A constant binds a name to a value evaluated at **compile time**. Constants are declared with `const`, are always immutable, and must have an explicit type annotation. Unlike [`let`](/docs/variables/let) bindings, they may be declared at module scope, which makes them the natural home for shared limits and mathematical values.

```rux
const MaxConnections: uint32 = 100;
const Pi: float64 = 3.14159265358979;
```

By convention, constant names use **PascalCase** (see [Identifiers](/docs/lexical/identifiers)).

## Constants vs. `let` Bindings

|                 | `const`             | `let`                |
| --------------- | ------------------- | -------------------- |
| Evaluated       | At compile time     | At run time          |
| Type annotation | Required            | Optional (inferred)  |
| Module scope    | Allowed             | —                    |
| Initializer     | Constant expression | Any expression       |

The initializer must be a **constant expression** — a value the compiler can compute without running the program. It may combine literals and other constants:

```rux
const Width: uint32 = 1920;
const Height: uint32 = 1080;
const PixelCount: uint32 = Width * Height;   // computed at compile time
```

## Example

```rux
const MaxRetries: int = 5;

func Fetch() -> bool {
    var attempts = 0;
    while attempts < MaxRetries {
        if TryFetch() { return true; }
        attempts += 1;
    }
    return false;
}
```

## Further Topics

| Topic                                              | Description                                          |
| -------------------------------------------------- | --------------------------------------------------- |
| [Intrinsic Constants](/docs/constants/intrinsic)   | Compiler-provided values such as `#source.line`      |

## See Also

- [Immutable Variables (`let`)](/docs/variables/let) — run-time immutable bindings
- [Intrinsic Constants](/docs/constants/intrinsic) — compile-time `#source.file`, `#source.line`, and friends
- [Identifiers](/docs/lexical/identifiers) — naming conventions for constants
