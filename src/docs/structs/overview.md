# Structures

A `struct` groups related values into a single named type. Each field has a name and a type, and the struct is a **value type** — assigning it or passing it to a function copies the whole value, unless you take a [pointer](/docs/pointers/members) to it.

```rux
struct Point {
    x: float64;
    y: float64;
}

let p = Point { x: 1.0, y: 2.0 };
Print(p.x);   // 1.0
```

## Declaration

A struct declaration names the type and lists its fields, each written as `name: Type;`. By convention struct types use PascalCase, and fields use camelCase.

```rux
struct Point {
    x: float64;
    y: float64;
}

struct Person {
    name: char8[];
    age: uint32;
}
```

Fields are laid out in declaration order. A struct introduces a distinct type: two structs with identical fields but different names are not interchangeable.

A field may be any type — a primitive, a [slice](/docs/slices/overview), a [pointer](/docs/pointers/overview), or another struct. Structs nest freely:

```rux
struct Line {
    start: Point;
    end: Point;
}
```

A struct cannot contain itself **by value**, since its size would be infinite. To refer to its own type — as in a linked list or tree node — hold a [pointer](/docs/pointers/members) instead:

```rux
struct Node {
    value: int32;
    next: *Node;   // pointer to the same type — allowed
}
```

## Construction and Field Access

Create a struct value with a **struct literal**: name the type and provide every field. Read or write fields with the `.` operator.

```rux
let p = Point { x: 1.0, y: 2.0 };
let alice = Person { name: "Alice", age: 30 };

Print(p.x);          // 1.0
Print(alice.name);   // Alice
```

Every field must be listed; the compiler rejects a literal that omits or misnames a field. Fields may be given in any order, since each is named.

## Mutating Fields

A struct bound with [`let`](/docs/variables/let) is immutable. Bind it with [`var`](/docs/variables/var) to assign to its fields:

```rux
var q = Point { x: 0.0, y: 0.0 };
q.x = 3.0;           // ok — q is mutable
q.y = 4.0;

let r = Point { x: 1.0, y: 1.0 };
r.x = 2.0;           // error: r is immutable
```

## Value Semantics

A struct is a **value type**. Assigning it, or passing it to a function, copies the whole value; the copy and the original are independent.

```rux
var a = Point { x: 1.0, y: 2.0 };
var b = a;           // full copy
b.x = 9.0;           // a.x is still 1.0
```

When you need several places to share — or mutate — the same instance, use a [pointer](/docs/pointers/members) rather than a copy.

## Memory Layout

A struct's fields are stored **in declaration order**, each placed at the next offset that satisfies its [natural alignment](/docs/appendix/primitives). To meet that alignment the compiler may insert unused **padding** bytes between fields. The struct's own alignment is that of its most-aligned field, and its total size is rounded up to a multiple of that alignment so that elements stay aligned inside an array.

```rux
struct Mixed {
    a: uint8;    // offset 0
    b: uint32;   // offset 4  — 3 padding bytes follow a
    c: uint16;   // offset 8
}                // alignment 4, size 12 (2 trailing padding bytes)
```

Ordering fields from largest to smallest minimises the padding. Use [`sizeof`](/docs/slices/low-level#sizeof-and-element-size) to obtain a type's actual size — never assume it equals the sum of its field sizes.

## Further Topics

| Topic                                              | Description                                   |
| -------------------------------------------------- | --------------------------------------------- |
| [Methods](/docs/structs/methods)                    | Attaching behaviour with `extend`             |
| [Pointers to Fields and Members](/docs/pointers/members) | Referencing and mutating a struct through `*T` |
