# Type Operators

| Operator | Meaning                                         |
| -------- | ----------------------------------------------- |
| `as`     | Type cast: `value as TargetType`                |
| `is`     | Type test: `value is SomeType` (returns `bool`) |

```rux
let n: int64 = bigValue as int64;
if shape is Circle {
    Print("It's a circle");
}
```
