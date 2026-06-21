# Variants with Data

A variant can carry data of any type, turning the enum into a **type-safe tagged union**: the value is always exactly one variant, and the data it holds is determined by which variant that is.

```rux
enum Shape {
    Circle(float64),                // radius
    Rectangle(float64, float64),    // width, height
    Triangle(float64, float64, float64)
}
```

Each variant lists the types of its payload in parentheses. Variants without data and variants with data may be mixed freely in the same enum.

## Constructing a Variant

Construct a value by naming the variant and supplying its data, using the `::` path separator:

```rux
let c = Shape::Circle(2.0);
let r = Shape::Rectangle(3.0, 4.0);
```

The result has type `Shape`; the payload is stored inside the value and reached only by matching on it.

## Reading the Data

The payload is **bound to names** by destructuring the variant in a [`match`](/docs/statements/match). Because the match is exhaustive, every variant — and therefore every shape of data — must be handled:

```rux
let area = match shape {
    Shape::Circle(r)         => Pi * r * r,
    Shape::Rectangle(w, h)   => w * h,
    Shape::Triangle(a, b, c) => TriangleArea(a, b, c),
}
```

Each pattern binds the variant's fields to fresh variables (`r`, `w`, `h`, …) that are in scope only within that arm.

## Memory Layout

A data-carrying enum is a **tagged union**: a [tag](/docs/enums/overview#memory-layout) identifying the active variant, followed by a payload area large enough to hold the **largest** variant's data. Every variant shares that one payload area, so the enum's size is the tag plus the biggest payload (rounded up for alignment):

```
enum Shape — tag + payload
┌─────┬─────────────────────────────────────────┐
│ tag │ payload (sized for Triangle, 3×float64) │
└─────┴─────────────────────────────────────────┘
       Circle uses the first float64;
       Rectangle the first two;
       Triangle all three.
```

The tag tells the compiler which interpretation of the payload is valid — which is exactly the safety an untagged [`union`](/docs/unions/overview) does not provide.

## See Also

- [Enumerations](/docs/enums/overview) — the enum overview
- [Backing Type and Explicit Values](/docs/enums/values) — enums whose variants map to integers
- [`match`](/docs/statements/match) — destructuring and the full pattern syntax
