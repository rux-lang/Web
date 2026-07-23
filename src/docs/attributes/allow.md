# `Allow`

Suppresses a specific **lint** on the annotated declaration. The linter's style checks apply everywhere by default; `#Allow` opts one declaration out when it has a deliberate reason to break a rule.

## Syntax

```rux
#Allow("naming.type")
struct iovec {   // deliberately lower-case to mirror the C struct
    base: *opaque,
    length: uint,
}
```

The argument is the lint rule to silence. It applies only to the declaration it precedes; every other declaration is still checked.

## Available Rules

| Rule          | Checks                                                        |
| ------------- | ------------------------------------------------------------ |
| `naming.type` | Types use PascalCase (see [Identifiers](/docs/lexical/identifiers)) |

Suppressing a rule is most defensible when a name must match an external contract — a C struct, an OS type, a wire format — where following Rux conventions would obscure the correspondence.

## See Also

- [Identifiers](/docs/lexical/identifiers) — the naming conventions the linter enforces
- [Attributes](/docs/attributes/overview) — the full attribute set
