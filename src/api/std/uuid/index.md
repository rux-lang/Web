# `Std::UUID`

Generate, format, and validate version-4 UUIDs.

**Module:** `Std::UUID`

```rux
import Uuid;
import Io::PrintLine;

func Main() -> int {
    let id = UUID::UuidV4();
    PrintLine(id);               // e.g. 1b4e28ba-2fa1-4d3b-a3f5-...
    return 0;
}
```

A UUID has two representations here: the **canonical string**
(`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, 36 characters) and the **16 raw bytes**.
Functions that return raw bytes pack them into a [`String`](../string/) of
length 16.

::: warning
`UuidV4` seeds its randomness from [`Time::TickMs`](../time/tickms) and a simple
xorshift mixer — it is **not** a cryptographically secure source. Don't use these
UUIDs as security tokens or secrets. (On macOS, where `TickMs` returns `0`,
generation is effectively deterministic.)
:::

## Generation

| Function                     | Description                               |
| ---------------------------- | ----------------------------------------- |
| [`UuidV4`](uuidv4)           | New random UUID as a 36-character string. |
| [`UuidV4Bytes`](uuidv4bytes) | New random UUID as 16 raw bytes.          |
| [`UuidNil`](uuidnil)         | The all-zero (nil) UUID string.           |

## Conversion and validation

| Function                       | Description                                   |
| ------------------------------ | --------------------------------------------- |
| [`UuidToString`](uuidtostring) | Format 16 raw bytes as a canonical string.    |
| [`UuidParse`](uuidparse)       | Parse a canonical string into 16 raw bytes.   |
| [`IsValidUuid`](isvaliduuid)   | Check whether a string is a well-formed UUID. |
