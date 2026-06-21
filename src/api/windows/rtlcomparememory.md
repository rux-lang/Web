# `RtlCompareMemory`

Counts matching bytes from the start of two memory ranges.

**Module:** `Windows`

**Microsoft documentation:** [`RtlCompareMemory`](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/wdm/nf-wdm-rtlcomparememory)

## Signature

```rux
func RtlCompareMemory(source1: *const opaque, source2: *const opaque,
    length: uint) -> uint;
```

## Returns

`uint` — matching bytes before the first difference, up to `length`. A result
equal to `length` means the ranges are equal. This is not lexicographic compare.

Both pointers must be readable for `length` bytes.

## See also

- [`Memory operations`](memory) — raw memory API overview
