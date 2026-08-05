::code-tree{defaultValue="Mutability/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Mutability/Rux.toml]
[Package]
Name = "Mutability"
Version = "0.1.0"
Type = "Program"
Description = "Mutability in action"
```

```rux [Mutability/Src/Main.rux]
func Main() -> int {
    // Compile-time constant
    const Size: uint = 1024;
    // Compile-time error
    Size = 35;

    // Immutable variable
    let value = 20;
    // Compile-time error
    value = 25;

    // Variable
    var steps = 10;
    // OK
    steps = 15;

    return 0;
}
```

```toml [Pointers/Rux.toml]
[Package]
Name = "Pointers"
Version = "0.1.0"
Type = "Program"
Description = "Pointer semantics"
```

```rux [Pointers/Src/Main.rux]
func Main() -> int {
    // Immutable binding
    let x: int = 100;
    // Immutable pointer
    let ptrX: *int = @x;
    // Compile-time error
    x = 10;
    // Compile-time error
    *ptrX = 15;
    // Compile-time error
    ptrX = null;

    // Mutable binding
    var y: int = 200;
    // Immutable pointer
    let ptrY: *var int = @y;
    y = 20;     // OK
    *ptrY = 25; // OK
    // Compile-time error
    ptrY = null;

    // Immutable binding
    let z: int = 300;
    // Mutable pointer
    var ptrZ: *int = @z;
    // Compile-time error
    z = 30;
    // Compile-time error
    *ptrZ = 35;
    ptrZ = null; // OK

    // Mutable binding
    var t: int = 400;
    // Mutable pointer
    var ptrT: *var int = @t;
    t = 40;      // OK
    *ptrT = 45;  // OK
    ptrT = null; // OK

    // Simplified syntax
    var data = 3.1415;
    let pointer = @data;

    // Mutable pointer-to-pointer
    var buf: **int64 = null;
    return 0;
}
```

::
