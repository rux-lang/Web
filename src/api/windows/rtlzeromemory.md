# `RtlZeroMemory`

Fills a memory range with zeros.

**Module:** `Windows`

**Microsoft documentation:** [`RtlZeroMemory`](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/wdm/nf-wdm-rtlzeromemory)

## Signature

```rux
func RtlZeroMemory(destination: *opaque, length: uint);
```

`destination` must be writable for `length` bytes.

## See also

- [`RtlFillMemory`](rtlfillmemory) — fill with another byte value
- [`Memory operations`](memory) — raw memory API overview
