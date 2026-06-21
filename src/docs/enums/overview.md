# Enumerations

An enum defines a type whose value is exactly one of several named **variants**. The compiler knows the full set of variants, which is what makes [`match`](/docs/statements/match) exhaustiveness checking possible.

```rux
enum Direction {
    North,
    South,
    East,
    West
}

let dir = Direction::North;
```

## Simple Variants

The basic form lists the variant names, separated by commas:

```rux
enum Direction {
    North,
    South,
    East,
    West
}
```

By convention enum types and their variants use PascalCase. An enum introduces a **distinct type**: a value of one enum type is never interchangeable with a value of another, even if their variants look alike.

A variable of an enum type always holds exactly one variant — there is no "empty" or uninitialised enum value.

## Referencing Variants

Refer to a variant through the enum name with the `::` path separator:

```rux
let dir = Direction::North;
let opposite = Direction::South;
```

## Exhaustive Matching

Because the compiler knows every variant, [`match`](/docs/statements/match) can require that each one is handled. Omitting a case is a compile error, so adding a new variant forces every `match` over the enum to be revisited:

```rux
let label = match dir {
    Direction::North => "up",
    Direction::South => "down",
    Direction::East  => "right",
    Direction::West  => "left",
}
```

See [`match`](/docs/statements/match) for the full pattern syntax, including guards and the `_` wildcard.

## Memory Layout

An enum without [data](/docs/enums/data) is stored as a single integer **tag** — a small number identifying the variant. When no [backing type](/docs/enums/values) is given, the compiler chooses the smallest integer type that can hold every variant, so a handful of variants typically occupy one byte:

```rux
enum Direction {     // 4 variants → fits in a uint8
    North,           // tag 0
    South,           // tag 1
    East,            // tag 2
    West             // tag 3
}
```

To pin the size and the numeric value of each variant — for serialisation or FFI — declare an explicit [backing type](/docs/enums/values).

## Further Topics

| Topic                                                          | Description                                          |
| ------------------------------------------------------------- | --------------------------------------------------- |
| [Backing Type and Explicit Values](/docs/enums/values)         | Fixing storage size and numeric representation       |
| [Variants with Data](/docs/enums/data)                         | Carrying payloads as a type-safe tagged union        |
