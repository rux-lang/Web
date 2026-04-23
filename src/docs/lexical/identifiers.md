# Identifiers

An identifier begins with a Unicode letter or underscore (`_`) and continues with any combination of letters, digits, and underscores.

```
Identifier ::= (Letter | '_') (Letter | Digit | '_')*
```

Rux is **case-sensitive**. By convention it is recommended to use **camelCase** and **PascalCase**.

| Item      | Example                                  |
| --------- | ---------------------------------------- |
| Types     | `Handle`, `HResult`, `Primitive`         |
| Structs   | `HttpRequest`, `HttpResponse`, `Order`   |
| Fiels     | `red`, `green`, `blue`, `alpha`          |
| Enums     | `DayOfWeek`, `MonthOfYear`, `AppState`   |
| Functions | `ParseInput`, `ReadFile`, `CloseWindow`  |
| Variables | `userId`, `userName`, `fileName`         |
| Constants | `MaxSize`, `MaxConnections`, `SizeLimit` |
| Modules   | `Http`, `Json`, `OpenGL`, `Vulkan`       |
