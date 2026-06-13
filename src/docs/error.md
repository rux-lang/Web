# Error Handling

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

## Explicit Checks

Because Rux has no exceptions and does not automatically unwind the stack, all errors must be explicitly checked or propagated at the call site. The compiler requires sum types (like `Result`) handled via `match` statements to be exhaustive, ensuring that error cases are not ignored.

