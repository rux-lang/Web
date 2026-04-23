# Appendix: Token Reference

The following table lists every token kind recognized by the Rux lexer.

## Literals

| Token           | Example                        |
| --------------- | ------------------------------ |
| `IntLiteral`    | `42`, `0xFF`, `0b1010`, `0o77` |
| `FloatLiteral`  | `3.14`, `1.0e-9`               |
| `StringLiteral` | `"hello"`                      |
| `CharLiteral`   | `'A'`, `'\n'`                  |
| `BoolLiteral`   | `true`, `false`                |

## Identifiers

| Token        | Description          |
| ------------ | -------------------- |
| `Identifier` | Any non-keyword name |

## Keywords

| Token              | Spelling    |
| ------------------ | ----------- |
| `IfKeyword`        | `if`        |
| `ElseKeyword`      | `else`      |
| `WhileKeyword`     | `while`     |
| `ForKeyword`       | `for`       |
| `InKeyword`        | `in`        |
| `BreakKeyword`     | `break`     |
| `ContinueKeyword`  | `continue`  |
| `ReturnKeyword`    | `return`    |
| `MatchKeyword`     | `match`     |
| `FuncKeyword`      | `func`      |
| `LetKeyword`       | `let`       |
| `MutKeyword`       | `mut`       |
| `ConstKeyword`     | `const`     |
| `TypeKeyword`      | `type`      |
| `StructKeyword`    | `struct`    |
| `EnumKeyword`      | `enum`      |
| `UnionKeyword`     | `union`     |
| `InterfaceKeyword` | `interface` |
| `ImplKeyword`      | `impl`      |
| `ModKeyword`       | `mod`       |
| `UseKeyword`       | `use`       |
| `PubKeyword`       | `pub`       |
| `ExternKeyword`    | `extern`    |
| `AsKeyword`        | `as`        |
| `IsKeyword`        | `is`        |
| `NullKeyword`      | `null`      |
| `SelfKeyword`      | `self`      |
| `SuperKeyword`     | `super`     |

## Punctuation

| Token          | Symbol |
| -------------- | ------ |
| `LeftParen`    | `(`    |
| `RightParen`   | `)`    |
| `LeftBrace`    | `{`    |
| `RightBrace`   | `}`    |
| `LeftBracket`  | `[`    |
| `RightBracket` | `]`    |
| `Comma`        | `,`    |
| `Semicolon`    | `;`    |
| `Colon`        | `:`    |
| `ColonColon`   | `::`   |
| `Dot`          | `.`    |
| `DotDot`       | `..`   |
| `DotDotDot`    | `...`  |
| `Arrow`        | `->`   |
| `FatArrow`     | `=>`   |
| `At`           | `@`    |
| `Hash`         | `#`    |
| `Question`     | `?`    |
| `Tilde`        | `~`    |

## Operators

| Token                  | Symbol |
| ---------------------- | ------ |
| `Plus`                 | `+`    |
| `Minus`                | `-`    |
| `Star`                 | `*`    |
| `Slash`                | `/`    |
| `Percent`              | `%`    |
| `StarStar`             | `**`   |
| `Amp`                  | `&`    |
| `Pipe`                 | `\|`   |
| `Caret`                | `^`    |
| `LessLess`             | `<<`   |
| `GreaterGreater`       | `>>`   |
| `AmpAmp`               | `&&`   |
| `PipePipe`             | `\|\|` |
| `Bang`                 | `!`    |
| `Equal`                | `==`   |
| `BangEqual`            | `!=`   |
| `Less`                 | `<`    |
| `LessEqual`            | `<=`   |
| `Greater`              | `>`    |
| `GreaterEqual`         | `>=`   |
| `Assign`               | `=`    |
| `PlusAssign`           | `+=`   |
| `MinusAssign`          | `-=`   |
| `StarAssign`           | `*=`   |
| `SlashAssign`          | `/=`   |
| `PercentAssign`        | `%=`   |
| `AmpAssign`            | `&=`   |
| `PipeAssign`           | `\|=`  |
| `CaretAssign`          | `^=`   |
| `LessLessAssign`       | `<<=`  |
| `GreaterGreaterAssign` | `>>=`  |

## Special

| Token       | Description                                          |
| ----------- | ---------------------------------------------------- |
| `NewLine`   | Significant newline (grammar-dependent)              |
| `EndOfFile` | Marks the end of the source file                     |
| `Unknown`   | Unrecognized character; preserved for error recovery |
