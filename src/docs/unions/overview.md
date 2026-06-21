# Unions

A union is a composite type whose fields all **share the same memory**. Writing one field and then reading another reinterprets the same bits as a different type — nothing is converted and nothing is checked.

```rux
union Bits {
    asByte: uint8;
    asFloat: float64;
    asInt: int32;
}
```

Unions are **untagged**: the language does not track which field was written last, and reading a different field is not an error. The programmer is responsible for knowing which field is active. Prefer [`enum`](/docs/enums/overview) for type-safe tagged unions — enum variants with data cover most cases where a union looks tempting.

## Memory Layout

Every field starts at **offset zero**, so all fields overlap. The union's size is that of its **largest** field, and its alignment is the strictest alignment among its fields:

```
union Bits — size 8, alignment 8

offset 0 ┌───────────────────────────────┐
         │ asFloat : float64  (8 bytes)  │
         ├───────────────┬───────────────┘
         │ asInt : int32 │  ← overlaps the low 4 bytes
         ├───┬───────────┘
         │ub │  ← asByte : uint8 overlaps the low byte
         └───┘
```

Here `Bits` occupies 8 bytes — the size of `float64`, its largest field — even though `asByte` needs only one. Storing to `asFloat` and then reading `asInt` reinterprets the low four bytes of the float's representation; no bits are moved.

## When to Use a Union

- Bit-level reinterpretation, such as inspecting the raw bits of a floating-point value
- Interop with C `union` types through the [foreign function interface](/docs/ffi/overview)
- Memory-dense storage when only one of several fields is ever live at a time
