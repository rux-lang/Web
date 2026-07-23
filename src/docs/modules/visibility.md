# Items Visibility

::: warning
`pub` is not implemented in the current release.
:::

By default, items are private to their module. Use `pub` to make them visible externally.

```rux
pub struct Config {
    pub host: String;
    pub port: uint16;
    apiKey: String;  // private field
}

pub func NewConfig(host: String, port: uint16) -> Config {
    // Code here
}
```

Visibility applies independently to a type and to each of its fields. In `Config` above, the struct and its `host`/`port` fields are public, while `apiKey` stays private — code outside the module can construct and read a `Config` but cannot touch `apiKey`.

Only `pub` items can be reached through a qualified path or brought in with [`import`](/docs/modules/import).

## See Also

- [Module Declaration](/docs/modules/declaration) — the namespaces `pub` exports from
- [Import](/docs/modules/import) — consuming exported items
