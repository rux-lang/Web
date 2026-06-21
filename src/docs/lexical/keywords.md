# Keywords

The following words are reserved and may not be used as [identifiers](/docs/lexical/identifiers). Keywords are case-sensitive and are listed below in ascending order, each linked to the chapter that describes it in full.

Built-in type names (`int`, `bool`, `char32`, …) are **not** keywords — they are predefined identifiers in the type namespace. For a consolidated list of them, see the [Primitive Type Reference](/docs/appendix/primitives).

| Keyword                                       | Role                                                           |
| --------------------------------------------- | -------------------------------------------------------------- |
| [`as`](/docs/operations/type-cast)             | Converts a value from one type to another (cast)               |
| [`asm`](/docs/functions/assembler)            | Marks a function whose body is written in assembly             |
| [`break`](/docs/statements/break-continue)    | Exits the nearest enclosing loop                               |
| [`const`](/docs/constants/overview)                    | Declares a compile-time constant                               |
| [`continue`](/docs/statements/break-continue) | Skips to the next iteration of a loop                          |
| [`else`](/docs/statements/if)                 | Introduces the alternative branch of an `if`                   |
| [`enum`](/docs/enums/overview)                 | Declares an enumeration type                                   |
| [`extend`](/docs/interfaces/implementation)   | Attaches methods to a type, optionally implementing interfaces |
| [`extern`](/docs/ffi/extern)                  | Declares a function or symbol defined outside Rux              |
| [`false`](/docs/boolean/bool)                 | The false boolean value                                        |
| [`for`](/docs/statements/for)                 | Iterates over the elements of a sequence                       |
| [`func`](/docs/functions/declaration)         | Declares a function                                            |
| [`if`](/docs/statements/if)                   | Begins a conditional branch                                    |
| [`import`](/docs/modules/import)              | Brings names from a module into scope                          |
| [`in`](/docs/statements/for)                  | Separates the loop variable from the sequence in a `for` loop  |
| [`interface`](/docs/interfaces/declaration)   | Declares an interface                                          |
| [`is`](/docs/operations/type-test)             | Tests whether a value has a given type                         |
| [`let`](/docs/variables/let)                  | Declares an immutable variable                                 |
| [`loop`](/docs/statements/loop)               | Begins an unconditional loop                                   |
| [`match`](/docs/statements/match)             | Selects a branch by pattern matching                           |
| [`module`](/docs/modules/declaration)         | Declares a module (namespace)                                  |
| [`null`](/docs/pointers/null)                 | The null pointer value                                         |
| [`pub`](/docs/modules/visibility)             | Makes an item visible outside its module                       |
| [`return`](/docs/functions/declaration)       | Returns a value from a function                                |
| [`self`](/docs/interfaces/implementation)     | The receiver parameter of a method                             |
| [`struct`](/docs/structs/overview)             | Declares a structure type                                      |
| [`true`](/docs/boolean/bool)                  | The true boolean value                                         |
| [`type`](/docs/aliases/overview)                | Declares a type alias                                          |
| [`union`](/docs/unions/overview)               | Declares a union type                                          |
| [`var`](/docs/variables/var)                  | Declares a mutable variable                                    |
| [`while`](/docs/statements/while)             | Loops while a condition holds                                  |
