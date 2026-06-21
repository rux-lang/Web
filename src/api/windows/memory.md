# Memory Operations

Raw byte-oriented memory operations.

**Module:** `Windows`

| Function                                 | Description                           |
| ---------------------------------------- | ------------------------------------- |
| [`RtlCompareMemory`](rtlcomparememory)   | Count equal leading bytes.            |
| [`RtlCopyMemory`](rtlcopymemory)         | Copy non-overlapping memory.          |
| [`RtlFillMemory`](rtlfillmemory)         | Fill memory with a byte value.        |
| [`RtlZeroMemory`](rtlzeromemory)         | Fill memory with zeros.               |

The caller must provide valid, sufficiently large buffers. These functions do
not perform bounds checking.

