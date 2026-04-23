### Mutability

All bindings are **immutable by default**. Use `var` to allow reassignment.

```rux
let count = 0;      // immutable
var mut score = 0;  // mutable
score = score + 1;  // OK
```
