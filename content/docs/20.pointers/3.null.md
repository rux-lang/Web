# The `null` Pointer

`null` is a pointer that addresses nothing. It is the **zero address** — the bit pattern `0x0` — reserved to mean "this pointer does not point at a valid value". Use it to represent the absence of a value and check for it before dereferencing.

```rux
var node: *Node = null;   // points nowhere — stored as 0x0

if node != null {
    Process(*node);
}
```

## Why Zero

No real object is ever placed at address `0x0`, so the value is unambiguous: a pointer either holds a genuine address or holds `null`, with no overlap. Comparing against `null` is therefore just a check for zero:

```
   Address        Contents
  ┌────────────┬───────────────┐
  │ 0x7ffd00c8 │ 0x00000000    │ ← node : *Node  (null — no target)
  └────────────┴───────────────┘
```

## Dereferencing `null`

Reading or writing through `null` means accessing address `0x0`, which the operating system leaves unmapped. The result is **undefined behavior** — in practice a crash (a segmentation fault). Always validate a pointer that may be null before reading through it:

```rux
func Length(list: *Node) -> int32 {
    var n = 0;
    var cur = list;
    while cur != null {     // stop before dereferencing null
        n += 1;
        cur = cur.next;
    }
    return n;
}
```

A `null` terminator is the conventional way to mark the end of a linked structure — see [Self-Referential Structures](/docs/pointers/members#self-referential-structures).

## See Also

- [Pointers](/docs/pointers/overview) — addresses and how a pointer is stored
- [Fields and Members](/docs/pointers/members) — building linked structures that end in `null`
