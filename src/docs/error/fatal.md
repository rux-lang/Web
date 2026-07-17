# Fatal Errors

A *fatal error* aborts the program on an unrecoverable condition rather than returning an error to the caller. Fatal errors are reserved for bugs and invariant violations — situations the program is not expected to handle at runtime.

You can trigger one explicitly with [`Fatal`](/api/#fatal) from the `Std` package, which prints a diagnostic message and the call-site location to standard error and exits with code `1`:

```rux
import Rux::Fatal;

Fatal("unreachable: unknown variant");
```

Several documented operations also fail fatally:

- **Integer overflow** in debug builds raises a fatal error; release builds wrap instead (see [Signed Integer overflow behaviour](/docs/signed/int#arithmetic)).
- **Narrowing character casts** raise a fatal error when the value is out of range; use `as?` to get `null` instead (see [Character Types](/docs/character/char)).
- **Casting `NaN` or `Inf` to an integer** raises a fatal error in debug builds (see [Floating-Point Types](/docs/floating/float64#conversion)).

For conditions a caller is expected to recover from, return a [`Result`](/docs/error/result) instead.

## See Also

- [The `Result` Type](/docs/error/result) — the recoverable-error alternative
- [`Fatal`](/api/#fatal) — the standard-library function that triggers a fatal error
- [Intrinsic Constants](/docs/constants/intrinsic) — the `#file`/`#line` values reported at the call site
