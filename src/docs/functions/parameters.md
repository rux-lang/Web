# Parameters and Return Types

```rux
func Add(a: int32, b: int32): int32
{
    return a + b;
}

func Clamp(value: float64, min: float64, max: float64): float64
{
    if (value < min) { return min; }
    if (value > max) { return max; }
    return value;
}
```
