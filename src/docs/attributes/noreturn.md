# `NoReturn`

Declares that a function **never returns** to its caller — it ends the program, loops forever, or transfers control elsewhere. The compiler uses this to check control flow: code after a call to a `#NoReturn` function is known to be unreachable, and a branch that ends in one satisfies a function that must produce a value.

## Syntax

```rux
#NoReturn()
func Exit(code: int32);
```

The attribute takes no arguments — the parentheses are always empty.

## Effect on Analysis

Because the compiler knows control never comes back, a `#NoReturn` call can stand in for a missing return:

```rux
#NoReturn()
func Fatal(message: Slice<char8>);

func MustParse(text: Slice<char8>) -> int32 {
    if let value = TryParse(text) {
        return value;
    }
    Fatal("invalid number");   // no return needed — Fatal never comes back
}
```

It is the right annotation for process-exit routines, panic/abort handlers, and infinite event loops. The standard library's [`Fatal`](/api/#fatal) is declared this way.

## See Also

- [`Fatal`](/api/#fatal) — the standard-library function that uses this attribute
- [Functions](/docs/functions/overview) — declarations and return types
- [Attributes](/docs/attributes/overview) — the full attribute set
