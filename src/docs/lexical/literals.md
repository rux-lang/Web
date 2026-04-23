# Literals

## Integer Literals

Integer literals may use decimal, hexadecimal, binary, or octal bases.

```rux
42          // decimal
255u8       // decimal with suffix
0xFF        // hexadecimal
0o77        // octal
0b10101010  // binary
```

## Floating-Point Literals

```rux
3.1415      // float
3.1415f32   // float32
3.1415f64   // float64
1.0e9       // float scientific format
2.51381e-3
```

## Boolean Literals

```rux
true
false
```

## Character Literals

A character literal contains exactly one character (or one escape sequence) enclosed in single quotes:

```rux
'A'
'∀',
'🍏'
'🍉'
'😁'
'\n'
'\\'
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

| Escape     | Meaning            |
| ---------- | ------------------ |
| `\n`       | Newline            |
| `\t`       | Horizontal tab     |
| `\r`       | Carriage return    |
| `\0`       | Null byte          |
| `\\`       | Backslash          |
| `\'`       | Single quote       |
| `\"`       | Double quote       |
| `\u{XXXX}` | Unicode code point |
