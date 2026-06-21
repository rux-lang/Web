# `float512`

::: warning
`float512` is not implemented in the current release.
:::

| Property          | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Size              | 64 bytes (512 bits)                                     |
| Format            | Rux extension                                           |
| Approximate range | ±2.0 × 10<sup>-1262611</sup> to ±2.0 × 10<sup>1262611</sup> |
| Decimal precision | ~148–150 digits                                         |
| Literal suffix    | `f512`                                                  |
| Hardware support  | Always software-emulated                                |

`float512` is the maximum-precision float in Rux. It is a Rux extension beyond IEEE 754-2019, but follows the same structural rules (sign, biased exponent, significand) and round-to-nearest behaviour. Special values (`Inf`, `-Inf`, `NaN`) are supported, and division by zero produces `Inf` or `NaN` rather than a fatal error. It is always software-emulated — expect large slowdowns versus [`float64`](./float64), so it is not recommended for hot paths.

## Literals

`float512` has no literal suffix, so an explicit type annotation is required:

```rux
let ext: float512 = 1.0;       // explicit annotation
let big: float512 = 1.3e308;   // scientific notation
```

Unsuffixed floating-point literals otherwise default to [`float64`](./float64). See [Literals](/docs/lexical/literals) for the full grammar.

## Typical Use Cases

- Specialized research
- Long-running simulations where error accumulation must be tightly bounded

## Arithmetic

| Operator | Description    | Compound |
| -------- | -------------- | -------- |
| `+`      | Addition       | `+=`     |
| `-`      | Subtraction    | `-=`     |
| `*`      | Multiplication | `*=`     |
| `/`      | Division       | `/=`     |
| `%`      | Remainder      | `%=`     |
| `**`     | Exponentiation | n/a      |

```rux
let a: float512 = 10.0;
let b: float512 = 3.0;

let sum  = a + b;   // 13.0
let quot = a / b;   // 3.333…
let rem  = a % b;   // 1.0
```

Both operands must share the same type; mixed-width expressions require an explicit cast. Arithmetic rounds to nearest (ties to even), unary negation (`-x`) flips the sign, and results that exceed the range overflow to `Inf`. Subtracting nearly equal values loses significant digits (catastrophic cancellation) — reorder the computation when accuracy matters.

Division by zero never fails: it yields signed infinity, and `0.0 / 0.0` yields `NaN`. `Inf` and `NaN` then propagate — `Inf - Inf` and `Inf * 0.0` are both `NaN`.

```rux
let p =  1.0 / 0.0;  //  Inf
let n = -1.0 / 0.0;  // -Inf
let u =  0.0 / 0.0;  //  NaN
```

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type; comparing a different float width, or a float with an integer, is a compile-time error — cast explicitly first.

`NaN` is unordered: every comparison involving it returns `false`, including `NaN == NaN`. Detect it with [`IsNan`](/api/#float64), never `==`. For the same reason, avoid `==` between computed results and compare within a tolerance instead:

```rux
let x = 0.1 + 0.2;
let close = Abs(x - 0.3) < 1.0e-140;  // not  x == 0.3
```

## Conversion

Rux implicitly **widens** to any larger float type, so no precision is lost. `float512` is the widest float, so there is no wider type to widen into. **Narrowing** to a smaller float must be explicit and rounds to nearest (ties to even).

```rux
let x: float512 = 1.5;
let narrow = x as float64;   // narrowing — explicit cast
```

Float-to-integer conversions are always explicit and truncate toward zero; casting `NaN` or `Inf` to an integer raises a [fatal error](/docs/error/fatal) in debug builds.

```rux
let whole = x as int32;      // 1   truncates toward zero
```

## See Also

- [`float64`](./float64) — the default double-precision float
- [`float256`](./float256) — the next precision down
