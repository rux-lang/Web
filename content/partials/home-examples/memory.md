::code-tree{defaultValue="Mutability/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Mutability/Rux.toml]
[Manifest]
Version = 1

[Package]
Name = "Mutability"
Version = "0.1.0"
Type = "Executable"
Description = "Mutability in action"
```

```rux [Mutability/Src/Main.rux]
func Main() -> int {    
    const Size = 10u; // Compile-time constant
    Size = 35;        // Not allowed
    
    let value = 20; // Immutable variable
    value = 25;     // Not allowed
    
    var steps = 10; // Variable
    steps = 15;     // OK

    return 0;
}
```

```toml [Pointers/Rux.toml]
[Manifest]
Version = 1

[Package]
Name = "Pointers"
Version = "0.1.0"
Type = "Executable"
Description = "Pointer semantics"
```

```rux [Pointers/Src/Main.rux]
func Main() -> int {    
    let x: int = 100;    // Immutable binding    
    let ptrX: *int = @x; // Immutable pointer
    x = 10;      // Not allowed
    *ptrX = 15;  // Not allowed
    ptrX = null; // Not allowed
    
    var y: int = 200;        // Mutable binding    
    let ptrY: *var int = @y; // Immutable pointer
    y = 20;      // OK
    *ptrY = 25;  // OK
    ptrY = null; // Not allowed

    
    let z: int = 300;    // Immutable binding
    var ptrZ: *int = @z; // Mutable pointer
    z = 30;      // Not allowed
    *ptrZ = 35;  // Not allowed
    ptrZ = null; // OK

    
    var t: int = 400;        // Mutable binding
    var ptrT: *var int = @t; // Mutable pointer
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
