# Statements

## `if` / `else`

```rux
if x > 0 {
    Print("positive");
} else if x < 0 {
    Print("negative");
} else {
    Print("zero");
}
```

## `match`

`match` performs exhaustive pattern matching. The compiler requires all cases to be covered.

```rux
match status {
    200 => Print("OK"),
    404 => Print("Not Found"),
    500 => Print("Server Error"),
    _   => Print("Unknown"),
}
```

```rux
// Literal patterns
match code {
    0    => Print("zero"),
    1..9 => Print("single digit"),
    _    => Print("other"),
}

// Enum destructuring
match event {
    Event.Click(x, y)   => HandleClick(x, y),
    Event.KeyPress(key) => HandleKey(key),
    Event.Quit          => Exit(),
}

// Struct destructuring
match point {
    Point { x: 0, y: 0 } => Print("origin"),
    Point { x, y }       => Print(x, y),
}

// Guards
match temperature {
    t if t < 0.0   => Print("freezing"),
    t if t < 20.0  => Print("cold"),
    t if t < 30.0  => Print("comfortable"),
    _              => Print("hot"),
}
```

The wildcard `_` matches any value and discards it. Patterns are checked in order; the first matching arm executes.

## `while`

```rux
var i = 0;
while i < 10 {
    Print(i);
    i++;
}
```

## `for` / `in`

```rux
for item in collection {
    Print(item);
}

for i in 0..10 {
    Print(i);  // prints 0 through 9
}

for i in 0..=10 {
    Print(i); // prints 0 through 10 (inclusive)
}
```

## `loop`

`loop` creates an unconditional infinite loop. It runs until a `break` exits it.

```rux
loop {
    let input = ReadLine();
    if input == "quit" { break; }
    Process(input);
}
```

### Labels

A loop can be given a label so that `break` and `continue` can target a specific outer loop when nesting.

```rux
outer: loop {
    loop {
        if ShouldStop() { break outer; }
        if ShouldSkip() { continue outer; }
        Step();
    }
    // never reached after break outer
}
```

`break label` exits the labeled loop entirely. `continue label` skips to the next iteration of the labeled loop.

## `break`

```rux
while true {
    let input = ReadLine();
    if input == "quit" { break; }
    if input == "" { continue; }
    Process(input);
}
```

## `continue`

```rux
while true {
    let input = ReadLine();
    if input == "quit" { break; }
    if input == "" { continue; }
    Process(input);
}
```
