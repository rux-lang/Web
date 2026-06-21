# Comparison Operations

Comparison operations test the relationship between two values. Every comparison produces a boolean result.

## Operators

| Operator | Operation             |
| -------- | --------------------- |
| `==`     | Equal                 |
| `!=`     | Not equal             |
| `<`      | Less than             |
| `<=`     | Less than or equal    |
| `>`      | Greater than          |
| `>=`     | Greater than or equal |

```rux
let a = 10;
let b = 20;

let equal = a == b;          // false
let notEqual = a != b;       // true
let less = a < b;            // true
let lessOrEqual = a <= b;    // true
let greater = a > b;         // false
let greaterOrEqual = a >= b; // false
```

## Operand Types

Both operands must have the same type. Numeric values of different types require an explicit conversion:

```rux
let left: int32 = 10;
let right: int64 = 20;

let invalid = left < right;           // error: different operand types
let valid = (left as int64) < right;  // true
```

Signed and unsigned integers also require an explicit conversion. Choose a target type that can represent both values correctly.

## Equality and Ordering

Equality operators (`==` and `!=`) test whether values are equal. Ordering operators (`<`, `<=`, `>`, and `>=`) test relative order.

Numeric and character types support both equality and ordering. Boolean values support equality but not ordering:

```rux
let same = true == false;    // false
let invalid = true < false;  // error: bool values are not ordered
```

## Floating-Point Comparisons

Floating-point comparisons follow IEEE 754 rules. `NaN` is not equal to any value, including itself:

```rux
let value = Float::NaN;

let equal = value == value;     // false
let notEqual = value != value;  // true
let ordered = value < 1.0;      // false
```

Use `IsNan(value)` to test for `NaN`. Avoid exact equality for values produced by calculations when rounding error is possible:

```rux
let difference = actual - expected;
let closeEnough = difference < epsilon && difference > -epsilon;
```

See [Floating-Point Types](/docs/floating/float64#comparison) for the complete floating-point comparison rules.

## Chained Conditions

Comparison operators do not form mathematical comparison chains. Combine separate comparisons with logical AND:

```rux
let withinRange = minimum <= value && value <= maximum;
```

## Precedence

Arithmetic and shift operations bind more tightly than comparisons. Comparisons bind more tightly than logical AND and logical OR:

```rux
let valid = offset + length <= capacity && capacity != 0;
```

Use parentheses when combining several kinds of operation:

```rux
let valid = ((offset + length) <= capacity) && (capacity != 0);
```

See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the complete precedence table.

## See Also

- [Logical Operations](/docs/operations/logical) — combining comparisons with `&&`, `||`, `!`
- [Arithmetic Operations](/docs/operations/arithmetic) — producing the values being compared
- [Type Casts](/docs/operations/type-cast) — matching operand types before comparing
