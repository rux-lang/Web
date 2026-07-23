# `RtlFillMemory`

Fills a memory range with a byte value.

**Package:** `Windows`

**Microsoft documentation:** [`RtlFillMemory`](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/wdm/nf-wdm-rtlfillmemory)

## Signature

```rux
func RtlFillMemory(
    destination: *opaque,
    length: uint,
    fill: int32
);
```

Writes the low 8 bits of `fill` to each of `length` bytes. `destination` must
be writable for the complete range.

## See also

- [`RtlZeroMemory`](rtlzeromemory) — fill with zero
- [`Windows`](/api/windows/) — the package overview
