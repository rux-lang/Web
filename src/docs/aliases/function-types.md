# Function Type Aliases

A **function type** describes a callable signature — its parameter types and its return type — without naming a particular function. It is written with the `func` keyword followed by the parameters and an optional `->` return type:

```rux
func(a: int32, b: int32) -> int32;   // takes two int32, returns int32
func(x: int32, y: int32);            // takes two int32, returns nothing
func() -> bool;                      // takes nothing, returns a bool
```

These types tend to be long and appear repeatedly wherever callbacks are passed around, which makes them the prime candidate for a [type alias](/docs/aliases/overview):

```rux
type Comparator = func(a: int32, b: int32) -> int32;
```

## Using a Named Signature

Once aliased, the signature reads as a single concept. Use it for a parameter that receives a callback:

```rux
type Comparator = func(a: int32, b: int32) -> int32;

func Sort(items: int32[], cmp: Comparator) {
    // ... compares elements with cmp(items[i], items[j]) ...
}
```

Any function whose signature matches the alias can be passed by name — the alias is [transparent](/docs/aliases/overview#transparency), so no cast is involved:

```rux
func Ascending(a: int32, b: int32) -> int32 {
    return a - b;
}

func Descending(a: int32, b: int32) -> int32 {
    return b - a;
}

Sort(data, Ascending);    // pass the function by name
Sort(data, Descending);   // a different function, same Comparator type
```

## Calling Through the Value

Inside `Sort`, the parameter `cmp` is called like any function:

```rux
let order = cmp(x, y);    // invokes whichever function was passed
```

## Parameter Names Are Documentation

Only the parameter **types** and the return type determine whether a function matches a function type; the parameter names in the type are there for readability. These two aliases describe the same type:

```rux
type Comparator = func(a: int32, b: int32) -> int32;
type Cmp        = func(int32, int32) -> int32;       // names omitted
```

## Signatures Without a Return

A function type that omits `->` matches functions that return nothing — the usual shape for event handlers and callbacks invoked for their side effects:

```rux
type Handler = func(x: int32, y: int32);

func OnClick(x: int32, y: int32) {
    Print(x, y);
}

func Register(h: Handler) { /* … */ }

Register(OnClick);
```

## See Also

- [Type Aliases](/docs/aliases/overview) — the alias overview and transparency
- [Using Type Aliases](/docs/aliases/usage) — shortening signatures and documenting intent
- [Function Declaration](/docs/functions/declaration) — how the functions you pass are written
