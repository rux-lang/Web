# Error Handling

::: tip
This section will be expanded as the error-handling model is finalized
:::

Rux favors explicit error handling over exceptions. The standard approach uses return-type encoding with a `Result` type:

```rux
func ReadFile(path: str) -> Result<String, IoError> {
    // Implementation
}

match ReadFile("config.toml") {
    Result.Ok(contents) => ParseConfig(contents),
    Result.Err(err) => Print("Failed: {}", err),
}
```
