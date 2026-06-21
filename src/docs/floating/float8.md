# `float8`

::: warning
`float8` is not implemented in the current release.
:::

| Property          | Value |
| ----------------- | ----- |
| Size              | 1 byte (8 bits) |
| Format            | E4M3 (4 exponent bits, 3 mantissa bits) |
| Approximate range | ±1.6 × 10<sup>-2</sup> to ±4.5 × 10<sup>2</sup> |
| Decimal precision | ~1–2 digits |
| Literal suffix    | `f8` |
| Hardware support  | Software-emulated on CPU targets |

`float8` is a minimal-precision float for memory-dense storage. It follows the **E4M3** variant common in machine-learning frameworks, so its behaviour at the subnormal boundary differs slightly from standard [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754). Special values (`Inf`, `-Inf`, `NaN`) are supported, and division by zero produces `Inf` or `NaN` rather than a fatal error.

**Caution.** `float8` arithmetic is subject to heavy quantization error — avoid it in numerical algorithms and reserve it for storage.

## Literals

```rux
let w: float8 = 1.5;  // explicit annotation
let v = 1.5f8;        // type suffix
```

Unsuffixed floating-point literals default to [`float64`](./float64); request `float8` with the `f8` suffix or an annotation. Decimal and scientific forms (`6.0e1`) are both accepted — see [Literals](/docs/lexical/literals).

## Typical Use Cases

- Machine-learning weight storage
- Lookup tables where density beats accuracy

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
let a: float8 = 10.0;
let b: float8 = 3.0;

let sum  = a + b;   // 13.0
let quot = a / b;   // 3.33…  (rounded to the nearest representable value)
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
let close = Abs(x - 0.3) < 1.0e-2;  // not  x == 0.3
```

## Conversion

Rux implicitly **widens** to any larger float type, so no precision is lost. `float8` is the narrowest float, so there is no narrower float to convert to.

```rux
let x: float8 = 1.5;
let wide: float32 = x;   // widening — implicit
```

Float-to-integer conversions are always explicit and truncate toward zero; casting `NaN` or `Inf` to an integer raises a [fatal error](/docs/error/fatal) in debug builds.

```rux
let whole = x as int32;  // 1   truncates toward zero
```

## See Also

- [`float64`](./float64) — the default double-precision float
- [`float16`](./float16) — the next precision up
