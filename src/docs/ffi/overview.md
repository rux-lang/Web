# Foreign Function Interface

The foreign function interface (FFI) lets Rux call functions defined outside the language — typically in C / C++ libraries — and exchange data with them. Each part of the FFI has a dedicated chapter:

| Topic                                          | Description                                         |
| ---------------------------------------------- | --------------------------------------------------- |
| [`extern` Declarations](/docs/ffi/extern)      | Declaring functions defined outside Rux             |
| [Import Attribute](/docs/ffi/import)           | Linking declarations to a dynamic library           |

Pointers are central to passing memory across the boundary — see [Pointers and `extern`](/docs/pointers/extern).

## See Also

- [Pointers and `extern`](/docs/pointers/extern) — exchanging memory with native code
- [`@[Import]`](/docs/attributes/import) — the attribute that names the library
- [`@[Target]`](/docs/attributes/target) — platform-specific `extern` declarations
