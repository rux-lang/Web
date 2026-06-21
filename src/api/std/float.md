# Floating-point helpers

Predicates for inspecting `float64` values.

**Module:** `Std`

These free functions test for the special IEEE-754 values that compare unequal
to everything (NaN) or lie outside the finite range (infinity). They complement
the `Display` implementations that render floats as text.

## `IsNan`

```rux
func IsNan(value: float64) -> bool;
```

Returns `true` if `value` is NaN (not-a-number). Because `NaN != NaN`, this is
the only reliable way to detect it — a direct `value == value` style check does
not work.

## `IsInfinite`

```rux
func IsInfinite(value: float64) -> bool;
```

Returns `true` if `value` is positive or negative infinity.

## Example

```rux
import Std::{ IsNan, IsInfinite };
import Std::Io::PrintLine;
import Std::Math;

func Main() -> int {
    let r = Math::Sqrt(-1.0);
    if IsNan(r) {
        PrintLine("result is not a number");
    }

    let big = 1.0 / 0.0;
    PrintLine(IsInfinite(big));     // true
    return 0;
}
```

## See also

- [`Math`](math/) — floating-point math functions
- [`Display`](display) — how floats are converted to strings
