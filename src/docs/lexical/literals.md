# Literals

## Integer Literals

Integer literals may use decimal, hexadecimal `0x`, binary `0b`, or octal `0o` bases.

```rux
42          // decimal
0xFF        // hexadecimal
0o77        // octal
0b10101010  // binary
```

There are suffixes `u8`-`u512`, `i8`-`i512` to specify integer types.

```rux
255u8    // uint8
255u16   // uint16
255u32   // uint32
255u64   // uint64
255u128  // uint128
255u256  // uint256
255u512  // uint512
-128i8   // int8
-128u16  // int16
-128u32  // int32
-128u64  // int64
-128u128 // int128
-128u256 // int256
-128u512 // int512
```

```rux
255  // int positive
-255 // int negative
255i // int
255u // uint
```

Prefixes and suffixes can be combined in literals.

```rux
0b10001111i32 // int32 in binary format
0o70500u64    // uint64 in octal format
0xFFu8        // uint8 in hexadecimal format
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

A character literal contains exactly one character (or one escape sequence) is `char` type and enclosed in single quotes:

```rux
'A'
'∀',
'🍏'
'🍉'
'😁'
'\n'
'\\'
```

```rux
'a'    // char
c8'b'  // char8
c16'c' // char16
c32'd' // char32
```

## String Literals

String literals are slices of type `char8[]` enclosed in double quotes. Standard escape sequences are supported:

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
