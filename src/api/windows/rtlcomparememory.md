# `RtlCompareMemory`

Counts matching bytes from the start of two memory ranges.

**Package:** `Windows`

**Microsoft documentation:** [`RtlCompareMemory`](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/wdm/nf-wdm-rtlcomparememory)

## Signature

```rux
func RtlCompareMemory(
    source1: *opaque,
    source2: *opaque,
    length: uint
) -> uint;
```

## Returns

`uint` — matching bytes before the first difference, up to `length`. A result
equal to `length` means the ranges are equal. This is not lexicographic compare.

Both pointers must be readable for `length` bytes.

## See also

- [`Windows`](/api/windows/) — the package overview
