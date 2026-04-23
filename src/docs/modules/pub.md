# pub

By default, items are private to their module. Use `pub` to make them visible externally.

```rux
pub struct Config {
    pub host: String;
    pub port: uint16;
    apiKey: String;  // private field
}

pub func NewConfig(host: String, port: u16) -> Config { ... }
```
