# Type Casts

The `as` operator converts a value from one type to another — an explicit _cast_. Rux performs no implicit conversions between distinct types, so wherever a value's type does not already match what is required, an `as` cast makes the conversion visible in the source.

```rux
let n: int64 = bigValue as int64;
```

The left operand is the value to convert; the right operand is the target type. The result is the value expressed in the target type.

## Numeric Conversions

Arithmetic and comparison operands must share a type. Convert one side explicitly when the types differ:

```rux
let left: int32 = 10;
let right: int64 = 20;

let invalid = left < right;           // error: different operand types
let valid = (left as int64) < right;  // OK
```

Signed and unsigned integers also require an explicit cast. Choose a target type wide enough to represent the value correctly:

```rux
let count: uint32 = 100;
let delta: int32 = count as int32;
```

## Boolean Conversions

Boolean types are distinct from numeric types, so conversion in either direction is explicit. Conversion between boolean widths also uses `as`:

```rux
let wide: bool32 = flag as bool32;
```

Casting an integer to `bool` is legal but easy to misuse. When deriving a boolean from a number, prefer an explicit comparison — it states the intent directly:

```rux
let active = n != 0;     // preferred — clear and explicit
let opaque = n as bool;  // legal, but the intent is less obvious
```

See [Boolean Types](/docs/boolean/bool) for the full conversion rules.

## Casting After a Type Test

`as` is the companion of the [`is`](/docs/operations/type-test) type test. Test the type first, then cast inside the branch where the test has already succeeded:

```rux
if shape is Circle {
    let circle = shape as Circle;  // safe — the test just succeeded
    Print(circle.radius);
}
```

## `as` vs. `is`

`as` and `is` are companion [type operators](/docs/lexical/operators#type-operators):

| Operator | Question it answers          | Result         |
| -------- | ---------------------------- | -------------- |
| `as`     | Give me this value as type T | the value as T |
| `is`     | Does this value have type T? | `bool`         |

## Precedence

`as` shares precedence level 2 with `is` — just below the unary operators and above arithmetic, so it binds tighter than the surrounding operators. This means `left as int64 < right` reads as `(left as int64) < right`:

```rux
let valid = left as int64 < right;
```

Parentheses are still worth adding when they make the intent clearer. See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the complete table.

## See Also

- [Type Tests](/docs/operations/type-test) — the companion `is` operator
- [Arithmetic Operations](/docs/operations/arithmetic) — where mismatched numeric types need a cast
- [Primitive Data Types](/docs/appendix/primitives) — the types you convert between
