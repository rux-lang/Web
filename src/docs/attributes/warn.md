# `Warn`

Emits a compiler **warning** at every call site of the annotated function. The function remains callable; the warning is informational.

## Syntax

```rux
@[Warn("Message")]
func DoSomething() {
    // Implementation
}
```

## Examples

### Deprecation notice

```rux
@[Warn("Use NewApi() instead; OldApi() will be removed in v2.0")]
func OldApi() -> int32 {
    return NewApi();
}

func Main() -> int {
    OldApi(); // warning: use NewApi() instead; OldApi() will be removed in v2.0
    return 0;
}
```

### Unsafe operation advisory

```rux
@[Warn("This function bypasses bounds checking; ensure the index is valid")]
func UncheckedGet(arr: *int32, index: uint) -> int32 {
    return *(arr + index);
}
```

## See Also

- [`@[Error]`](/docs/attributes/error) — block usage outright instead of warning
- [Attributes](/docs/attributes/overview) — the full attribute set
