# Comments

Rux supports three types of comments: line comments, block comments, and documentation comments.

## Line Comment

A line comment starts with `//` and extends to the end of the line. Use it for short notes, inline remarks, or temporarily disabling code.

```rux
// This is a line comment
let x = 12;
let y = 60; // Inline comment
```

## Block Comment

A block comment starts with `/*` and ends with `*/`.

```rux
/* This is a block comment */
```

A block can contain any number of lines.

```rux
/*
    This is a multi-line
    block comment.
*/
let y = 10;
```

Nested block comments are supported, which makes it easy to comment out sections of code that already contain block comments.

```rux
/*
    Temporarily disabled
    /*
        let result = Compute(x);
        Print(result);
    */
*/
```

> **Note:** Block comments cannot be used as documentation comments. Use `///` to document declarations.

## Documentation Comment

A documentation comment starts with `///` and extends to the end of the line. It documents the declaration that immediately follows it. Consecutive `///` lines are merged into a single documentation block by the doc generator.

```rux
/// Returns the absolute value of x
func Abs(x: float64) -> float64
{
    // Code here
}
```

```rux
/// Parses a source file and returns a syntax tree
/// @param path: Path to the .rux source file
/// @return The root AST node, or null on parse failure
func Parse(path: String) -> *Node
{
    // Code here
}
```

Documentation comments can be used on any declaration: functions, types, structs, enums, constants, and modules.

```rux
/// Represents a 2D point in space
struct Point
{
    /// The horizontal coordinate
    x: float64;

    /// The vertical coordinate
    y: float64;
}
```

> **Note:** A documentation comment must be placed directly above the declaration it describes, with no blank lines in between.

## Documentation Tags

Tags provide structured metadata within a documentation comment. Each tag begins with `@` and must appear on its own `///` line.

### Tag `@param`

Tag `@param name: description` documents a function parameter. Use one `@param` tag per parameter, in the same order they appear in the function signature.

```rux
/// Raises base to the power of exp
/// @param base: The number to raise
/// @param exp: The exponent
/// @return: The result of base raised to the power of exp
func Pow(base: float64, exp: float64) -> float64
{
    // Code here
}
```

### Tag `@return`

Tag `@return: description` documents the return value of a function. Omit this tag for functions that return nothing.

```rux
/// Finds the first element matching the predicate
/// @param predicate: A function that returns true for the desired element
/// @return: The matched element, or null if none was found
func Find(predicate: func(T) -> bool) -> *T
{
    // Code here
}
```

### Tag `@throws`

Tag `@throws type: description` documents an error or exception that the function may throw or propagate. Use one `@throws` tag per error type.

```rux
/// Reads the entire contents of a file as a string
/// @param path: Path to the file to read
/// @return: The file contents as a UTF-8 string
/// @throws IoException: If the file does not exist or cannot be read
/// @throws EncodingException: If the file contents are not valid UTF-8
func ReadFile(path: String) -> String
{
    // Code here
}
```

### Combined example

```rux
/// Divides two integers and returns the result
/// @param a: The dividend
/// @param b: The divisor
/// @return: The result of dividing a by b
/// @throws DivideByZeroException: If b is zero
func Divide(a: int64, b: int64) -> int64
{
    // Code here
}
```
