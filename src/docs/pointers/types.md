# Pointer Types

The **pointee type** follows the `*`. It determines how many bytes a dereference reads and writes, and how [pointer arithmetic](/docs/pointers/arithmetic) steps through memory. The pointer itself is always one address wide; only the pointee type changes.

```rux
let a: *int32;          // pointer to a read-only int32
let b: *var int32;      // pointer to a writable int32
let c: **int32;         // pointer to a pointer to int32
```

## Read-Only and Writable Pointees (`*T` vs `*var T`)

A plain `*T` is **read-only**: you may read the pointed-to value but not write it through the pointer. This is the default, since most pointers only need to observe. It is the right parameter type for a function that should read a buffer but never modify it, letting the compiler reject accidental writes:

```rux
func Sum(values: *int32, n: uint64) -> int32 {
    var total = 0;
    var i: uint64 = 0;
    while i < n {
        total += *(values + i);   // reading is fine
        i += 1;
    }
    return total;                 // *(values + i) = 0 would be rejected: *T is read-only
}
```

Add `var` — `*var T` — when the callee must write through the pointer:

```rux
func Zero(values: *var int32, n: uint64) {
    var i: uint64 = 0;
    while i < n {
        *(values + i) = 0;        // OK — the pointee is writable
        i += 1;
    }
}
```

The `var` qualifies writes **through the pointer**, not the pointer variable itself — you can still re-point a `var`-bound pointer to address something else. A `*var T` converts implicitly to `*T` (silently dropping write access); the reverse is rejected, so a read-only pointer can never quietly gain the ability to write.

## Nested Pointers (`**T`)

A pointer can point to another pointer, giving multiple levels of indirection. Each `*` in the type is one level; each `*` at use site removes one. This is common when a function must modify the caller's pointer, not just the value it points to:

```rux
let x = 42;
let p: *int32 = @x;
let pp: **int32 = @p;

let value = **pp;       // 42 — dereference twice
```

## Untyped Pointers (`*opaque`)

`*opaque` is a pointer to an unspecified type — the equivalent of `void*` in C. It carries an address with no element type, so it cannot be dereferenced directly and supports no [arithmetic](/docs/pointers/arithmetic); cast it to a concrete pointer type first. It is most often used at [foreign function](/docs/ffi/overview) boundaries:

```rux
extern func malloc(size: uint) -> *opaque;
extern func free(ptr: *opaque);

let raw = malloc(sizeof(int32) * 4);   // *opaque
let nums = raw as *var int32;          // cast to a writable typed pointer
*nums = 100;
free(raw);
```

## See Also

- [Pointers](/docs/pointers/overview) — addresses and how a pointer is stored
- [Pointer Arithmetic](/docs/pointers/arithmetic) — stepping by the pointee's size
- [Pointers and `extern`](/docs/pointers/extern) — where `*opaque` and `*var T` map onto C
- [Type Casts](/docs/operations/type-cast) — the `as` operator used to retype a pointer
