# The `Result` Type

The standard approach to recoverable errors uses return-type encoding with a `Result` type. A function that can fail returns `Result<T, E>`, where `T` is the success value and `E` is the error.

```rux
func ReadFile(path: String) -> Result<String, IoError> {
    // Implementation
}

match ReadFile("config.toml") {
    Result::Ok(contents) => ParseConfig(contents),
    Result::Err(err) => Print("Failed: {}", err),
}
```

Because the error is part of the return type, the caller cannot ignore it by accident — every outcome must be handled, typically by [`match`](/docs/statements/match) on the `Ok` and `Err` variants.

## See Also

- [`match`](/docs/statements/match) — destructuring `Ok` and `Err`
- [Fatal Errors](/docs/error/fatal) — for conditions a caller is not expected to recover from
- [Enumerations](/docs/enums/overview) — variants with data, the basis of `Result`
