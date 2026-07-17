# `float64`

| Property          | Value |
| ----------------- | ----- |
| Size              | 8 bytes (64 bits) |
| Format            | IEEE 754 binary64 (double precision) |
| Approximate range | ±2.2 × 10<sup>-308</sup> to ±1.8 × 10<sup>308</sup> |
| Decimal precision | ~15–16 digits |
| Literal suffix    | `f64` |
| Hardware support  | Native on all supported targets |

`float64` is the default floating-point type in Rux — [`float`](./float) is a built-in alias for it. It is fully [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) compliant. Special values (`Inf`, `-Inf`, `NaN`) are supported, and division by zero produces `Inf` or `NaN` rather than a fatal error.

## Literals

A floating-point literal written without an annotation or suffix is inferred as `float64`:

```rux
let e = 2.718281828459045;       // float64 (inferred)
let a: float64 = 1.0;            // explicit annotation
let b = 1.0f64;                  // type suffix
```

Decimal and scientific forms are both accepted:

```rux
let avogadro = 6.022e23;   // 6.022 × 10²³
let planck   = 6.626e-34;  // 6.626 × 10⁻³⁴
```

See [Literals](/docs/lexical/literals) for the full grammar.

## Typical Use Cases

- Scientific computing
- Financial calculations
- General-purpose numeric code

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
let a: float64 = 10.0;
let b: float64 = 3.0;

let sum  = a + b;   // 13.0
let quot = a / b;   // 3.3333333333333335
let rem  = a % b;   // 1.0
```

Both operands must share the same type; mixed-width expressions require an explicit cast. Arithmetic rounds to nearest (ties to even), unary negation (`-x`) flips the sign, and results that exceed the range overflow to `Inf`. Subtracting nearly equal values loses significant digits (catastrophic cancellation) — reorder the computation or use a wider type when accuracy matters.

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
let close = Abs(x - 0.3) < 1.0e-9;  // not  x == 0.3
```

## Conversion

Rux implicitly **widens** to any larger float type, so no precision is lost. **Narrowing** must be explicit and rounds to nearest (ties to even).

```rux
let x: float64 = 1.5;
let wide: float128 = x;      // widening — implicit
let narrow = x as float32;   // narrowing — explicit cast
```

Float-to-integer conversions are always explicit and truncate toward zero; the reverse (int→float) widens implicitly. Casting `NaN` or `Inf` to an integer raises a [fatal error](/docs/error/fatal) in debug builds.

```rux
let whole = x as int32;      // 1     truncates toward zero
let back: float64 = 100;     // 100.0 int→float, implicit
```

## See Also

- [`float`](./float) — the alias used for `float64` in everyday code
- [`float32`](./float32) — narrower, hardware-native alternative
