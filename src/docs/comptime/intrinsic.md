# Intrinsics

An **intrinsic** is a value or function whose meaning the compiler supplies directly — there is no Rux body to write, because the compiler knows the answer. The [build context](/docs/comptime/context) (`#target`, `#build`, `#compiler`, `#source`, `#config`) is built entirely from intrinsics, and a handful of standard-library routines are intrinsics too.

Most code simply **imports** intrinsics from the standard `Rux` package and uses them. Declaring one is reserved for the standard library and advanced interop; the `intrinsic` keyword exists so those declarations can name what the compiler must provide.

## Declaring an Intrinsic

The `intrinsic` keyword prefixes a declaration that has no body. It comes in two shapes.

**An intrinsic value** is a `#`-prefixed name with an explicit type. The type names which intrinsic the compiler binds:

```rux
intrinsic #target: Target;   // the compiler supplies a Target value
```

**An intrinsic function** is an ordinary signature the compiler implements:

```rux
intrinsic func Assert(condition: bool, message: Slice<char8> = "assertion failed");
```

Giving either form a body is an error — the compiler provides it.

## Namespaced Intrinsics

An intrinsic method is declared inside an [`extend`](/docs/structs/methods) block, which namespaces it under the type. This is how `#target.HasFeature(...)` and `#config.Get(...)` are defined:

```rux
extend Target {
    intrinsic func HasFeature(feature: TargetFeature) -> bool;
}

extend Config {
    intrinsic func Get(name: Slice<char8>) -> Slice<char8>;
    intrinsic func Has(name: Slice<char8>) -> bool;
}
```

## Importing Intrinsics

Because the build-context intrinsics live in the `Rux` package, a file that uses one must import it by its `#`-prefixed name — the same as any other item:

```rux
import Rux::{ #target, #source };
```

A name used in a [`when`](/docs/comptime/conditional) condition must be imported this way; the compiler reports an unknown identifier otherwise. An `intrinsic` declaration in the current file brings the name into scope locally with the same effect.

## Source-Location Intrinsics

The [`#source`](/docs/comptime/context#source) intrinsic exposes the current location — `#source.file`, `#source.line`, `#source.function`, and friends. Used as a [default argument](/docs/functions/declaration#default-arguments) it expands at the call site, letting a function capture where it was called from. This is the mechanism behind [`Assert`](/api/#assert) and [`Fatal`](/api/#fatal), and it replaces the earlier standalone `#file` / `#line` constants.

```rux
import Rux::{ #source };

func Require(ok: bool, file: Slice<char8> = #source.file, line: uint32 = #source.line) {
    if !ok { Fatal("requirement failed at ", file, ":", line); }
}
```

## See Also

- [Build Context](/docs/comptime/context) — the intrinsics `#target`, `#build`, `#compiler`, `#source`, and `#config`
- [Conditional Compilation](/docs/comptime/conditional) — where imported intrinsics are most used
- [Constants](/docs/constants/overview) — declaring your own compile-time values
- [Function Declaration](/docs/functions/declaration#default-arguments) — default arguments, which source-location intrinsics rely on
