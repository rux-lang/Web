# Foreign Function Interface

The foreign function interface (FFI) lets Rux call functions defined outside the language — typically in C / C++ libraries — and exchange data with them. Each part of the FFI has a dedicated chapter:

| Topic                                          | Description                                         |
| ---------------------------------------------- | --------------------------------------------------- |
| [`extern` Declarations](/docs/ffi/extern)      | Declaring functions defined outside Rux             |
| [Linking Libraries](/docs/ffi/import)          | Binding declarations to a native library with `#Link` |

Pointers are central to passing memory across the boundary — see [Pointers and `extern`](/docs/pointers/extern).

## See Also

- [Pointers and `extern`](/docs/pointers/extern) — exchanging memory with native code
- [`#Link`](/docs/attributes/link) — the attribute that names the library
- [Conditional Compilation](/docs/comptime/conditional) — platform-specific `extern` declarations
