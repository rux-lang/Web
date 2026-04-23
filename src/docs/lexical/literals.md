# Literals

## Integer Literals

Integer literals may use decimal, hexadecimal, binary, or octal bases. Underscores may be used as visual separators.

```rux
42          // decimal
0xFF        // hexadecimal
0b1010_1010 // binary
0o77        // octal
1_000_000   // underscores for readability
```

## Floating-Point Literals

```rux
3.14
1.0e9
2.5e-3
```

## Boolean Literals

```rux
true
false
```

## String Literals

String literals are enclosed in double quotes. Standard escape sequences are supported:

```rux
"Hello, World!"
"Line one\nLine two"
"Tab\there"
"Quote: \""
"Backslash: \\"
```

| Escape     | Meaning                        |
| ---------- | ------------------------------ |
| `\n`       | Newline                        |
| `\t`       | Horizontal tab                 |
| `\r`       | Carriage return                |
| `\0`       | Null byte                      |
| `\\`       | Backslash                      |
| `\'`       | Single quote                   |
| `\"`       | Double quote                   |
| `\u{XXXX}` | Unicode code point _(planned)_ |

## Character Literals

A character literal contains exactly one character (or one escape sequence) enclosed in single quotes:

```rux
'A'
'\n'
'\\'
```
