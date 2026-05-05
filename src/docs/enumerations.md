# Enumerations

Enums define a type that can be exactly one of several named variants.

```rux
enum Direction
{
    North,
    South,
    East,
    West
}

enum Shape
{
    Circle(float64),                // radius
    Rectangle(float64, float64),    // width, height
    Triangle(float64, float64, float64)
}
```

**Usage:**

```rux
let dir = Direction.North;
let area = match shape
{
    Shape.Circle(r)          => PI * r * r,
    Shape.Rectangle(w, h)    => w * h,
    Shape.Triangle(a, b, c)  => TriangleArea(a, b, c),
}
```
