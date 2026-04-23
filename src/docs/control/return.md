# return

```rux
func FindFirst(items: int32[], target: int32): int32 {
    for (i in 0..items.Length)
        if (items[i] == target)
            return i;
    return -1;
}
```
