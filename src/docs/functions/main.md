# The Main Entry Point

Every binary executable package must define a `Main` function with no parameters. By default, this file is called `Main.rux`. The returned `int` becomes the process exit code; by convention `0` means success.

```rux
// Entry point
func Main() -> int {
    return 0;
}
```

A non-zero return value signals failure, following the usual operating-system convention. Only a binary executable package needs a `Main`; a library package has none.

## See Also

- [Function Declaration](/docs/functions/declaration) — defining functions in general
- [Package Types](/docs/packages/types) — executable vs. library packages
- [Fatal Errors](/docs/error/fatal) — aborting with a non-zero exit code
