# Type Aliases

A type alias introduces an additional name for an existing type using the `type` keyword:

```rux
type UserId = uint64;
```

An alias is **transparent**: it names the same type rather than creating a new one, so values move freely between the alias and the original without casts. `UserId` and `uint64` are two spellings of one type, not two types.

## What Can Be Aliased

Any type has a name, so any type can be aliased — primitives, [arrays](/docs/slices/overview), [pointers](/docs/pointers/overview), and [function types](/docs/aliases/function-types):

```rux
type UserId  = uint64;
type Vector3 = float32[3];
type Matrix4 = float32[4][4];
type Pointer = *uint8;
type Handler = func(x: int32, y: int32);
```

An alias is especially valuable for the longer forms — a nested array type or a function signature is far easier to read behind a single name.

## Transparency

Because an alias is the same type as its target, no cast is ever needed to convert between them, in either direction:

```rux
let id: UserId = 1;
let raw: uint64 = id;     // OK — same type
let back: UserId = raw;   // OK — same type
```

This also means an alias provides **no extra type checking**: the compiler will not stop you from mixing a `UserId` with any other `uint64`. When you need a name the compiler keeps genuinely distinct, use a single-field [`struct`](/docs/structs/overview) instead.

## Topics in This Chapter

| Topic                                                  | Description                                      |
| ------------------------------------------------------ | ------------------------------------------------ |
| [Using Type Aliases](/docs/aliases/usage)                | Shortening signatures and documenting intent     |
| [Function Type Aliases](/docs/aliases/function-types)    | Naming callable signatures for callbacks         |
| [Built-in Aliases](/docs/aliases/builtin)                | Compiler-provided aliases such as `float`         |
