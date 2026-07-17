# `float128`

::: warning
`float128` is not implemented in the current release.
:::

| Property          | Value |
| ----------------- | ----- |
| Size              | 16 bytes (128 bits) |
| Format            | IEEE 754 binary128 (quadruple precision) |
| Approximate range | ±3.4 × 10<sup>-4932</sup> to ±1.2 × 10<sup>4932</sup> |
| Decimal precision | ~33–34 digits |
| Literal suffix    | `f128` |
| Hardware support  | Software-emulated on most hardware |

`float128` is a quadruple-precision float, fully [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) compliant. Special values (`Inf`, `-Inf`, `NaN`) are supported, and division by zero produces `Inf` or `NaN` rather than a fatal error. It is software-emulated on most hardware — expect large slowdowns versus [`float64`](./float64), so profile before using it in hot paths.

## Literals

```rux
let quad: float128 = 1.0f128;  // type suffix
let v: float128 = 2.0;         // explicit annotation
```

Unsuffixed floating-point literals default to [`float64`](./float64); request `float128` with the `f128` suffix or an annotation. Decimal and scientific forms (`1.2e4932`) are both accepted — see [Literals](/docs/lexical/literals).

## Typical Use Cases

- Compensated summation and high-accuracy integration
- Reference implementations for validating lower-precision algorithms

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
let a: float128 = 10.0;
let b: float128 = 3.0;

let sum  = a + b;   // 13.0
let quot = a / b;   // 3.333…
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
let close = Abs(x - 0.3) < 1.0e-30;  // not  x == 0.3
```

## Conversion

Rux implicitly **widens** to any larger float type, so no precision is lost. **Narrowing** must be explicit and rounds to nearest (ties to even).

```rux
let x: float128 = 1.5;
let wide: float256 = x;      // widening — implicit
let narrow = x as float64;   // narrowing — explicit cast
```

Float-to-integer conversions are always explicit and truncate toward zero; casting `NaN` or `Inf` to an integer raises a [fatal error](/docs/error/fatal) in debug builds.

```rux
let whole = x as int32;      // 1   truncates toward zero
```

## See Also

- [`float64`](./float64) — the default double-precision float
- [`float256`](./float256) — the next precision up
