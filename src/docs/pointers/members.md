# Pointers to Fields and Members

A pointer to a struct, written `*T`, lets you reference one struct value from several places, mutate it in place, pass it to a function without copying, and build linked data structures. Take a pointer with `@` and read through it with `*`, as for any type — see [Address-of and Dereference](/docs/pointers/overview#address-of-and-dereference).

```rux
struct Point {
    x: float64;
    y: float64;
}

var p = Point { x: 1.0, y: 2.0 };
let ptr: *var Point = @p;   // writable pointer to p
```

`@` requires an addressable operand, so the struct must live in a variable; a struct produced by an expression has no stable address.

## Accessing Fields Through a Pointer

Field access with `.` works directly on a pointer — Rux has **no arrow operator**. Reads and writes pass straight through to the pointed-to struct:

```rux
let sum = ptr.x + ptr.y;   // reads p.x and p.y
ptr.x = 5.0;               // writes through; p.x == 5.0
```

Writing through a pointer requires a writable pointer type, [`*var Point`](/docs/pointers/types) — which `@p` produces only because `p` is a `var`. A plain `*Point` is read-only, and `ptr.x = 5.0` through it would be rejected.

## `self` Is a Pointer

An instance method receives `self` as a pointer to the receiver. That is why a method can mutate the value it is called on, yet still uses `.` for field access:

```rux
extend Point {
    func Shift(self, dx: float64, dy: float64) {
        self.x += dx;   // writes through self
        self.y += dy;
    }
}

var q = Point { x: 0.0, y: 0.0 };
q.Shift(3.0, 4.0);      // q == Point { x: 3.0, y: 4.0 }
```

See [Methods](/docs/structs/methods) for the full method syntax.

## Passing Structs by Pointer

Passing a struct by value copies every field. For a large struct, or when a function must modify the caller's value, take a pointer parameter instead:

```rux
func Normalize(v: *var Vector) {
    let len = v.Length();
    v.x /= len;
    v.y /= len;
    v.z /= len;
}

var dir = Vector { x: 3.0, y: 4.0, z: 0.0 };
Normalize(@dir);        // dir is normalised in place
```

A writable pointer parameter like `*var Vector` documents that the function mutates the caller's value, and the compiler only lets you pass `@dir` when `dir` is a `var`. When a function should read a struct but never modify it, use a plain read-only pointer, [`*Vector`](/docs/pointers/types) — the default — so accidental writes are rejected.

## Self-Referential Structures

A struct cannot contain itself by value, but it can hold a **pointer** to its own type — the basis of linked lists, trees, and graphs. Terminate a chain with [`null`](/docs/pointers/null), and always check for it before dereferencing:

```rux
struct Node {
    value: int32;
    next: *Node;       // next node, or null at the end
}

var tail = Node { value: 3, next: null };
var head = Node { value: 1, next: @tail };

var cur: *Node = @head;
while cur != null {
    Print(cur.value);  // 1, then 3
    cur = cur.next;
}
```

Dereferencing a `null` pointer is undefined behaviour, so guard every traversal with a `!= null` check.

## See Also

- [Pointers](/docs/pointers/overview) — the full pointer chapter
- [Address-of and Dereference](/docs/pointers/overview#address-of-and-dereference) — taking addresses with `@`, reading with `*`
- [The `null` Pointer](/docs/pointers/null) — representing and checking for no value
- [Methods](/docs/structs/methods) — how `self` is passed
