# Error Handling

::: tip
This chapter will be expanded as the error-handling model is finalized.
:::

Rux favors explicit error handling over exceptions: a function that can fail reports the failure in its return type, and the caller must deal with it. Unrecoverable conditions instead abort the program with a fatal error.

| Topic                                       | Description                                              |
| ------------------------------------------- | ------------------------------------------------------- |
| [The `Result` Type](/docs/error/result)     | Return-type encoding of recoverable errors              |
| [Fatal Errors](/docs/error/fatal)           | Aborting on unrecoverable conditions                    |

## See Also

- [`match`](/docs/statements/match) — handling the variants of a `Result`
- [Enumerations](/docs/enums/overview) — the tagged-value mechanism behind `Result`
