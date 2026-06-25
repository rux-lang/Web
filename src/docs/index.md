---
title: Rux Language Reference
description: The complete Rux language reference — covering lexical structure, primitive types, variables, functions, structs, enums, interfaces, modules, error handling, FFI, and the package system.
head:
  - - meta
    - itemprop: name
      content: Rux Language Reference
  - - meta
    - itemprop: description
      content: The complete Rux language reference — covering lexical structure, primitive types, variables, functions, structs, enums, interfaces, modules, error handling, FFI, and the package system.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/og-docs.jpg
  - - meta
    - property: og:url
      content: https://rux-lang.dev/docs/
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Rux Language Reference
  - - meta
    - property: og:description
      content: The complete Rux language reference — covering lexical structure, primitive types, variables, functions, structs, enums, interfaces, modules, error handling, FFI, and the package system.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/og-docs.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux Language Reference
  - - meta
    - name: twitter:description
      content: The complete Rux language reference — covering lexical structure, primitive types, variables, functions, structs, enums, interfaces, modules, error handling, FFI, and the package system.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/og-docs.jpg
---

# Rux Language Reference

1. [Introduction](introduction)
2. [Lexical Structure](lexical/sources)
   - 2.1. [Source Files](lexical/sources)
   - 2.2. [Comments](lexical/comments)
   - 2.3. [Keywords](lexical/keywords)
   - 2.4. [Identifiers](lexical/identifiers)
   - 2.5. [Literals](lexical/literals)
   - 2.6. [Operators and Punctuation](lexical/operators)
3. [Signed Integers](signed/int)
   - 3.1. [`int`](signed/int)
   - 3.2. [`int8`](signed/int8)
   - 3.3. [`int16`](signed/int16)
   - 3.4. [`int32`](signed/int32)
   - 3.5. [`int64`](signed/int64)
   - 3.6. [`int128`](signed/int128)
   - 3.7. [`int256`](signed/int256)
   - 3.8. [`int512`](signed/int512)
4. [Unsigned Integers](unsigned/uint)
   - 4.1. [`uint`](unsigned/uint)
   - 4.2. [`uint8`](unsigned/uint8)
   - 4.3. [`uint16`](unsigned/uint16)
   - 4.4. [`uint32`](unsigned/uint32)
   - 4.5. [`uint64`](unsigned/uint64)
   - 4.6. [`uint128`](unsigned/uint128)
   - 4.7. [`uint256`](unsigned/uint256)
   - 4.8. [`uint512`](unsigned/uint512)
5. [Floating-Point](floating/float)
   - 5.1. [`float`](floating/float)
   - 5.2. [`float8`](floating/float8)
   - 5.3. [`float16`](floating/float16)
   - 5.4. [`float32`](floating/float32)
   - 5.5. [`float64`](floating/float64)
   - 5.6. [`float80`](floating/float80)
   - 5.7. [`float128`](floating/float128)
   - 5.8. [`float256`](floating/float256)
   - 5.9. [`float512`](floating/float512)
6. [Booleans](boolean/bool)
   - 6.1. [`bool`](boolean/bool)
   - 6.2. [`bool8`](boolean/bool8)
   - 6.3. [`bool16`](boolean/bool16)
   - 6.4. [`bool32`](boolean/bool32)
   - 6.5. [`bool64`](boolean/bool64)
   - 6.6. [`bool128`](boolean/bool128)
   - 6.7. [`bool256`](boolean/bool256)
   - 6.8. [`bool512`](boolean/bool512)
7. [Characters](character/char)
   - 7.1. [`char`](character/char)
   - 7.2. [`char8`](character/char8)
   - 7.3. [`char16`](character/char16)
   - 7.4. [`char32`](character/char32)
   - 7.5. [`char64`](character/char64)
   - 7.6. [`char128`](character/char128)
   - 7.7. [`char256`](character/char256)
   - 7.8. [`char512`](character/char512)
8. [Variables](variables/overview)
   - 8.1. [Overview](variables/overview)
   - 8.2. [Immutable](variables/let)
   - 8.3. [Mutable](variables/var)
   - 8.4. [Mutability of Structs](variables/mutability)
9. [Constants](constants/overview)
   - 9.1. [Overview](constants/overview)
   - 9.2. [Intrinsic Constants](constants/intrinsic)
10. [Operations](operations/overview)
    - 10.1. [Overview](operations/overview)
    - 10.2. [Arithmetic Operations](operations/arithmetic)
    - 10.3. [Comparison Operations](operations/comparison)
    - 10.4. [Logical Operations](operations/logical)
    - 10.5. [Bitwise Operations](operations/bitwise)
    - 10.6. [Shift Operations](operations/shift)
    - 10.7. [Type Casts](operations/type-cast)
    - 10.8. [Type Tests](operations/type-test)
11. [Statements](statements/overview)
    - 11.1. [Overview](statements/overview)
    - 11.2. [`if` / `else`](statements/if)
    - 11.3. [`match`](statements/match)
    - 11.4. [`while`](statements/while)
    - 11.5. [`for` / `in`](statements/for)
    - 11.6. [`loop`](statements/loop)
    - 11.7. [`break` / `continue`](statements/break-continue)
12. [Functions](functions/overview)
    - 12.1. [Overview](functions/overview)
    - 12.2. [Declaration](functions/declaration)
    - 12.3. [Variadic Functions](functions/variadic)
    - 12.4. [Generic Functions](functions/generic)
    - 12.5. [Assembler Functions](functions/assembler)
    - 12.6. [Main Entry Point](functions/main)
13. [Structures](structs/overview)
    - 13.1. [Overview](structs/overview)
    - 13.2. [Methods](structs/methods)
14. [Unions](unions/overview)
    - 14.1 [Overview](unions/overview)
15. [Enumerations](enums/overview)
    - 15.1. [Overview](enums/values)
    - 15.2. [Backing Type and Values](enums/values)
    - 15.3. [Variants with Data](enums/data)
16. [Tuples](tuples/overview)
    - 16.1. [Overview](tuples/overview)
    - 16.2. [Destructuring](tuples/destructuring)
    - 16.3. [Tuples vs. Structs](tuples/vs-struct)
17. [Slices](slices/overview)
    - 17.1. [Overview](slices/overview)
    - 17.2. [Dynamic and Fixed-Size](slices/kinds)
    - 17.3. [Literals](slices/literals)
    - 17.4. [Indexing and Iteration](slices/access)
    - 17.5. [Slices and Pointers](slices/low-level)
18. [Pointers](pointers/overview)
    - 18.1. [Overview](pointers/overview)
    - 18.2. [Pointer Types](pointers/types)
    - 18.3. [The `null` Pointer](pointers/null)
    - 18.4. [Fields and Members](pointers/members)
    - 18.5. [Pointer Arithmetic](pointers/arithmetic)
    - 18.6. [Pointers and `extern`](pointers/extern)
19. [Type Aliases](aliases/overview)
    - 19.1. [Overview](aliases/overview)
    - 19.2. [Usage](aliases/usage)
    - 19.3. [Function Type Aliases](aliases/function-types)
    - 19.4. [Built-in Aliases](aliases/builtin)
20. [Interfaces](interfaces/overview)
    - 20.1. [Overview](interfaces/overview)
    - 20.2. [Interface Declaration](interfaces/declaration)
    - 20.3. [Interface Implementation](interfaces/implementation)
21. [Modules](modules/overview)
    - 21.1. [Overview](modules/overview)
    - 21.2. [Module Declaration](modules/declaration)
    - 21.3. [Items Visibility](modules/visibility)
    - 21.4. [Import](modules/import)
22. [Error Handling](error/overview)
    - 22.1. [Overview](error/overview)
    - 22.2. [The `Result` Type](error/result)
    - 22.3. [Fatal Errors](error/fatal)
23. [Foreign Function Interface](ffi/overview)
    - 23.1. [Overview](ffi/overview)
    - 23.2. [`extern` Declarations](ffi/extern)
    - 23.3. [Import Attribute](ffi/import)
24. [Attributes](attributes/overview)
    - 24.1. [Overview](attributes/overview)
    - 24.2. [Import](attributes/import)
    - 24.3. [Target](attributes/target)
    - 24.4. [Warn](attributes/warn)
    - 24.5. [Error](attributes/error)
25. [Package System](packages/types)
    - 25.1. [Package Types](packages/types)
    - 25.2. [Directory Layout](packages/dirs)
    - 25.3. [Package Manifest](packages/manifest)
    - 25.4. [Dependencies](packages/dependencies)
26. [Appendix](appendix/primitives)
    - 26.1. [Primitive Type Reference](appendix/primitives)
    - 26.2. [Token Reference](appendix/tokens)
    - 26.3. [Rux Compiled Unit](appendix/rcu)
