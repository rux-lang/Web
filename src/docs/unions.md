# Unions

Unions are untagged; the programmer is responsible for knowing which field is active. Prefer `enum` for type-safe tagged unions.

```rux
union Bits {
    asByte: uint8;
    asFloat: float64;
    asInt: int32;
}
```
