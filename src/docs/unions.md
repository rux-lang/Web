# Unions

Unions are untagged; the programmer is responsible for knowing which field is active. Prefer `enum` for type-safe tagged unions.

```rux
union Bits
{
    asInt:   int32;
    asFloat: float32;
    asBytes: uint8[4];
}
```
