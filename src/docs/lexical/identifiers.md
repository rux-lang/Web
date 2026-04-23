# Identifiers

An identifier begins with a Unicode letter or underscore (`_`) and continues with any combination of letters, digits, and underscores.

```
identifier ::= (letter | '_') (letter | digit | '_')*
```

Rux is **case-sensitive**. By convention:

| Item                  | Convention           | Example                  |
| --------------------- | -------------------- | ------------------------ |
| Types, structs, enums | PascalCase           | `HttpResponse`           |
| Functions, variables  | PascalCase           | `ParseInput`, `userName` |
| Constants             | SCREAMING_SNAKE_CASE | `MAX_SIZE`               |
| Modules               | PascalCase           | `mod Http`               |
