# Type Tests

The `is` operator tests whether a value currently holds a given type. It
produces a [`bool`](/docs/boolean/bool): `true` when the value has that type,
`false` otherwise.

```rux
let result = shape is Circle; // bool
```

The left operand is a value; the right operand is a type. `is` never converts
or moves anything — it only inspects the type and reports the answer. To
actually obtain the value as the tested type, follow the test with an
[`as`](/docs/lexical/operators#type-operators) cast.

## Testing Enum Variants

The most common use is checking which variant a tagged
[`enum`](/docs/enums/overview) currently holds:

```rux
enum Shape {
    Circle(float64),
    Rectangle(float64, float64),
    Triangle(float64, float64, float64)
}

func Describe(shape: Shape) {
    if shape is Circle {
        Print("It's a circle");
    } else if shape is Rectangle {
        Print("It's a rectangle");
    }
}
```

Because `is` returns a plain `bool`, it composes with the ordinary
[logical operators](/docs/operations/logical):

```rux
let rounded = shape is Circle || shape is Ellipse;
```

## In Conditions

`is` is most often written directly in an [`if`](/docs/statements/if)
condition. Pair it with `as` inside the branch to work with the value at its
concrete type:

```rux
if shape is Circle {
    let circle = shape as Circle;
    Print(circle.radius);
}
```

## `is` vs. `match`

A single `is` test answers one yes/no question. When every variant must be
handled, prefer [`match`](/docs/statements/match): it destructures the variant
data and checks exhaustively that no case is missed.

```rux
// One case in isolation — use `is`
if event is Quit {
    Exit();
}

// All cases, with the variant data — use `match`
match event {
    Event::Click(x, y)   => HandleClick(x, y),
    Event::KeyPress(key) => HandleKey(key),
    Event::Quit          => Exit(),
}
```

Reach for `is` when you care about a single type and don't need the payload;
reach for `match` when you need exhaustiveness, the bound data, or several
arms.

## `is` vs. `as`

`is` and `as` are companion [type operators](/docs/lexical/operators#type-operators):

| Operator | Question it answers          | Result          |
| -------- | ---------------------------- | --------------- |
| `is`     | Does this value have type T? | `bool`          |
| `as`     | Give me this value as type T | the value as T  |

Test before you cast when the type is not statically guaranteed:

```rux
if value is Rectangle {
    let rect = value as Rectangle; // safe — the test just succeeded
}
```

## Precedence

`is` shares precedence level 2 with `as` — just below the unary operators and
above arithmetic, so it binds tighter than the comparison and logical operators.
This means `shape is Circle && radius > 0.0` reads as
`(shape is Circle) && (radius > 0.0)` without extra parentheses:

```rux
let valid = shape is Circle && radius > 0.0;
```

See [Operator Precedence](/docs/lexical/operators#operator-precedence) for the
complete table.

## See Also

- [Type Casts](/docs/operations/type-cast) — the companion `as` operator
- [`match`](/docs/statements/match) — exhaustive alternative when handling every variant
- [Enumerations](/docs/enums/overview) — the tagged values `is` most often inspects
