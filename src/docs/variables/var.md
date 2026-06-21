# Mutable Variables (`var`)

A variable introduced with `var` is **mutable**: it can be reassigned at any time after declaration. Use it for values that genuinely change — counters, accumulators, loop state — and prefer [`let`](/docs/variables/let) for everything else.

```rux
var score = 0;
score = score + 1;  // reassignment
score += 1;         // compound assignment
```

## The Type Is Fixed at Declaration

A `var` may change its value, but never its type. The type is set when the variable is declared, and because Rux performs no implicit conversions, assigning a value of a different type is a compile-time error — convert explicitly with an [`as`](/docs/operations/type-cast) cast:

```rux
var total: int32 = 0;
let big: int64 = 5;

total = big;          // error: int64 is not int32
total = big as int32; // OK — explicit cast
```

## Compound Assignment

The [arithmetic](/docs/operations/arithmetic#compound-assignment), [bitwise](/docs/operations/bitwise#compound-assignment), and [shift](/docs/operations/shift) operators have compound assignment forms (`+=`, `*=`, `&=`, `<<=`, …). They read and update the variable in one step and require a mutable left operand:

```rux
var n = 10;
n += 5;   // n == 15
n *= 2;   // n == 30
```

## Mutating Fields

Binding a [struct](/docs/structs/overview) with `var` lets you change individual fields in place, in addition to reassigning the whole value:

```rux
var p = Point { x: 0.0, y: 0.0 };
p.x = 3.0;                     // modify a field
p = Point { x: 1.0, y: 1.0 };  // or replace the whole value
```

See [Mutability of Structs](/docs/variables/mutability) for the full rules.

## See Also

- [Immutable Variables (`let`)](/docs/variables/let) — the default binding
- [Mutability of Structs](/docs/variables/mutability) — how `var` enables field changes
- [Compound Assignment Operators](/docs/lexical/operators#assignment-operators) — the full list
