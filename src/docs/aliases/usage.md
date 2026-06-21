# Using Type Aliases

Aliases do not change what a program does — they change how it reads. The two payoffs are shorter signatures and clearer intent.

## Documenting Intent

An alias gives a primitive a meaningful name at the point of use. `UserId` says more than `uint64`, even though the two are interchangeable:

```rux
type UserId = uint64;

func Find(id: UserId) -> *User {
    // Code here
}

let admin: UserId = 1;
Find(admin);   // OK — UserId is uint64
```

Because an alias is [transparent](/docs/aliases/overview#transparency), no cast is needed to pass a `uint64` where a `UserId` is expected, or vice versa.

## Shortening Complex Signatures

The benefit grows with the size of the type. A nested array or a [function type](/docs/aliases/function-types) repeated across several declarations is easier to read — and to change — behind one name:

```rux
type Matrix4 = float32[4][4];

func Identity() -> Matrix4 { /* … */ }
func Multiply(a: Matrix4, b: Matrix4) -> Matrix4 { /* … */ }
```

Updating the underlying type in one `type` declaration updates every use at once.

## Aliases Are Not New Types

An alias never introduces a separate type, so it offers no protection against mixing values that happen to share a representation:

```rux
type UserId  = uint64;
type OrderId = uint64;

let user: UserId = 1;
let order: OrderId = user;   // OK — both are just uint64; the compiler sees no difference
```

If you want the compiler to treat two ids as incompatible, wrap the value in a single-field [`struct`](/docs/structs/overview), which is a distinct type. Reach for an alias when readability is the goal and for a struct when type separation is.

## See Also

- [Type Aliases](/docs/aliases/overview) — the alias overview and transparency
- [Function Type Aliases](/docs/aliases/function-types) — naming callback signatures
- [Structures](/docs/structs/overview) — when you need a genuinely distinct type
