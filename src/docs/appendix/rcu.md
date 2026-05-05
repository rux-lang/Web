<!-- ---
title: RCU — Rux Compiled Unit File Format
description: Binary specification for .rcu object files produced by the Rux compiler. Covers file layout, all binary structures, relocation processing, and incremental-compilation metadata.
sidebar_label: RCU File Format
slug: /rcu-format
--- -->

# Rux Compiled Unit

**Version 0.1.0** · Windows x64 (x86-64, little-endian)

## Overview

A **Rux Compiled Unit (RCU)** (`.rcu`) is the binary object file emitted by the Rux compiler for each compiled `.rux` source file. The Rux linker collects one or more RCU files and links them into a Windows x64 executable (`.exe`).

| Artefact | Role                                                             |
| -------- | ---------------------------------------------------------------- |
| `.rux`   | Rux source file (human-readable)                                 |
| `.rcu`   | Rux Compiled Unit — machine code, symbols, relocations, metadata |
| `.exe`   | Windows x64 PE executable — output of the Rux linker             |

### Design Goals

| Goal                                 | How it is achieved                                                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Simple**                           | Fixed-size header and section entries; no indirection chains; fewer tables than COFF or ELF                                        |
| **Fast to parse**                    | All table offsets are stored directly in the header; the linker can seek straight to any structure                                 |
| **Linker-ready**                     | Symbols, relocations, and string data are fully self-contained                                                                     |
| **Incremental-compilation–friendly** | Optional Rux Metadata block stores a SHA-256 source hash and compiler version stamp so unchanged source files are never recompiled |

### Comparison with Common Formats

| Feature                  | COFF (`.obj`)        | ELF (`.o`)            | RCU (`.rcu`)         |
| ------------------------ | -------------------- | --------------------- | -------------------- |
| Magic / identification   | 2-byte machine type  | 16-byte `e_ident`     | 4-byte `"RCU\0"`     |
| Section entry size       | 40 bytes             | 64 bytes (ELF64)      | 40 bytes             |
| Symbol entry size        | 18 bytes             | 24 bytes (ELF64)      | 20 bytes             |
| Relocation entry size    | 10 bytes (no addend) | 24 bytes (ELF64 RELA) | 16 bytes             |
| Source-language metadata | no                   | no                    | yes (optional block) |
| Checksum                 | no                   | no                    | CRC-32C              |
| Architecture scope       | multi-architecture   | multi-architecture    | x86-64 only          |

## File Layout

An RCU file consists of six consecutive regions. All multi-byte integer fields are stored in **little-endian** byte order. Fields are placed at the exact offsets listed — there is no implicit struct padding.

```
┌──────────────────────────────────────────────┐  Offset 0
│                 File Header                  │  32 bytes (fixed)
├──────────────────────────────────────────────┤  Offset 32
│               Section Table                  │  section_count × 40 bytes
├──────────────────────────────────────────────┤  Offset 32 + section_count × 40
│               Symbol Table                   │  symbol_count × 20 bytes
├──────────────────────────────────────────────┤
│     Section Raw Data + Relocation Arrays     │  one block per section:
│       ┌──────────────────────────┐           │    raw data (aligned)
│       │  section[0] raw data     │           │    followed by relocation
│       │  section[0] relocations  │           │    entries (4-byte aligned)
│       │  section[1] raw data     │           │
│       │  section[1] relocations  │           │
│       │  ...                     │           │
│       └──────────────────────────┘           │
├──────────────────────────────────────────────┤
│               String Table                   │  string_table_size bytes
├──────────────────────────────────────────────┤
│          Rux Metadata  (optional)            │  64 bytes when present
└──────────────────────────────────────────────┘
```

> **Reading tip** — a reader needs only the 32-byte File Header to locate every other structure. Parse the header first, then use the stored offsets and counts to seek directly to any region.

## File Header

The File Header is always 32 bytes and begins at file offset 0.

| Offset | Size | Type    | Field               | Description                                                                         |
| ------ | ---- | ------- | ------------------- | ----------------------------------------------------------------------------------- |
| 0      | 4    | `u8[4]` | `magic`             | Magic bytes: `52 43 55 00` (`"RCU\0"`)                                              |
| 4      | 2    | `u16`   | `version`           | Format version packed as `(major << 8) \| minor`; v1.0 = `0x0100`                   |
| 6      | 1    | `u8`    | `arch`              | Target architecture — see [Architecture](#architecture)                             |
| 7      | 1    | `u8`    | `flags`             | File-level flags — see [File Flags](#file-flags)                                    |
| 8      | 2    | `u16`   | `section_count`     | Number of entries in the Section Table                                              |
| 10     | 2    | `u16`   | `_reserved`         | Must be `0x0000`                                                                    |
| 12     | 4    | `u32`   | `symbol_count`      | Number of entries in the Symbol Table                                               |
| 16     | 4    | `u32`   | `string_table_off`  | File offset to the first byte of the String Table                                   |
| 20     | 4    | `u32`   | `string_table_size` | Byte size of the String Table                                                       |
| 24     | 4    | `u32`   | `metadata_offset`   | File offset to the Rux Metadata block; `0` = not present                            |
| 28     | 4    | `u32`   | `checksum`          | CRC-32C of the whole file with this field treated as `0`; `0` = validation disabled |

### Architecture

| Value  | Constant      | Meaning                         |
| ------ | ------------- | ------------------------------- |
| `0x01` | `ARCH_X86_64` | x86-64 (AMD64), Windows x64 ABI |

Additional architectures may be assigned in future minor versions.

### File Flags

Bits 4–7 are reserved and must be `0`.

| Bit | Constant         | Set when…                                                                |
| --- | ---------------- | ------------------------------------------------------------------------ |
| 0   | `F_HAS_METADATA` | The Rux Metadata block is present at `metadata_offset`                   |
| 1   | `F_PIC`          | All code in the file is position-independent                             |
| 2   | `F_DEBUG`        | The file was compiled with debug information enabled                     |
| 3   | `F_STRIPPED`     | The Symbol Table contains only globally-visible symbols (locals removed) |

### Version Compatibility

A reader **must** reject a file whose `magic` bytes do not match `"RCU\0"`. A reader **should** reject a file whose `version` major byte is greater than the highest major version it supports. Minor version differences within the same major version are backward-compatible.

## Section Table

The Section Table begins immediately at file offset 32 and contains `section_count` entries of 40 bytes each.

| Offset | Size | Type      | Field          | Description                                                                      |
| ------ | ---- | --------- | -------------- | -------------------------------------------------------------------------------- |
| 0      | 8    | `char[8]` | `name`         | Section name, null-padded ASCII (e.g. `".text\0\0\0"`)                           |
| 8      | 4    | `u32`     | `type`         | Section type — see [Section Types](#section-types)                               |
| 12     | 4    | `u32`     | `flags`        | Section flags — see [Section Flags](#section-flags)                              |
| 16     | 4    | `u32`     | `raw_offset`   | File offset to section raw data; `0` for `SEC_BSS`                               |
| 20     | 4    | `u32`     | `raw_size`     | Byte size of raw data stored in the file; `0` for `SEC_BSS`                      |
| 24     | 4    | `u32`     | `virtual_size` | Byte size the section occupies in memory; equals `raw_size` except for `SEC_BSS` |
| 28     | 2    | `u16`     | `alignment`    | Required alignment in bytes; must be a power of two in the range 1–4096          |
| 30     | 2    | `u16`     | `reloc_count`  | Number of relocation entries for this section                                    |
| 32     | 4    | `u32`     | `reloc_offset` | File offset to this section's relocation array; `0` if `reloc_count == 0`        |
| 36     | 4    | `u32`     | `_reserved`    | Must be `0x00000000`                                                             |

### Section Types

| Value | Constant     | Description                                                   |
| ----- | ------------ | ------------------------------------------------------------- |
| `0`   | `SEC_NULL`   | Unused placeholder entry                                      |
| `1`   | `SEC_TEXT`   | Executable machine code                                       |
| `2`   | `SEC_DATA`   | Initialized read-write data                                   |
| `3`   | `SEC_RODATA` | Read-only data: string literals, float constants, jump tables |
| `4`   | `SEC_BSS`    | Zero-initialized data; no raw bytes are stored in the file    |
| `5`   | `SEC_META`   | Rux-specific metadata (at most one per file)                  |

### Section Flags

| Bit | Constant     | Meaning                                                       |
| --- | ------------ | ------------------------------------------------------------- |
| 0   | `SF_ALLOC`   | Section occupies memory at run time                           |
| 1   | `SF_EXEC`    | Section is executable                                         |
| 2   | `SF_READ`    | Section is readable                                           |
| 3   | `SF_WRITE`   | Section is writable                                           |
| 4   | `SF_MERGE`   | The linker may merge identical entries from multiple units    |
| 5   | `SF_STRINGS` | Section contains null-terminated strings (implies `SF_MERGE`) |

### Standard Sections

The Rux compiler emits the following sections. User code never names sections explicitly; the compiler assigns data to the appropriate section automatically.

| Name      | Type         | Flags                             | Alignment | Contents                          |
| --------- | ------------ | --------------------------------- | --------- | --------------------------------- |
| `.text`   | `SEC_TEXT`   | `SF_ALLOC \| SF_EXEC \| SF_READ`  | 16        | Function machine code             |
| `.rodata` | `SEC_RODATA` | `SF_ALLOC \| SF_READ`             | 8         | String literals, float constants  |
| `.data`   | `SEC_DATA`   | `SF_ALLOC \| SF_READ \| SF_WRITE` | 8         | Initialized global variables      |
| `.bss`    | `SEC_BSS`    | `SF_ALLOC \| SF_READ \| SF_WRITE` | 8         | Zero-initialized global variables |

The `.bss` section is omitted from the file if no zero-initialized globals are declared. Similarly, `.rodata` and `.data` are omitted when empty.

## Symbol Table

The Symbol Table begins immediately after the last Section Table entry.

> **File offset** = `32 + section_count × 40`

Each entry is 20 bytes.

| Offset | Size | Type  | Field           | Description                                                                                           |
| ------ | ---- | ----- | --------------- | ----------------------------------------------------------------------------------------------------- |
| 0      | 4    | `u32` | `name_off`      | Byte offset into the String Table for the symbol name                                                 |
| 4      | 4    | `u32` | `value`         | Byte offset of the symbol within its section; absolute value when `section_idx == 0xFFFE`             |
| 8      | 4    | `u32` | `size`          | Symbol size in bytes; `0` if unknown                                                                  |
| 12     | 2    | `u16` | `section_idx`   | Zero-based index of the owning section; `0xFFFF` = external (undefined); `0xFFFE` = absolute constant |
| 14     | 1    | `u8`  | `kind`          | Symbol kind — see [Symbol Kinds](#symbol-kinds)                                                       |
| 15     | 1    | `u8`  | `visibility`    | Symbol visibility — see [Symbol Visibility](#symbol-visibility)                                       |
| 16     | 4    | `u32` | `type_name_off` | String Table offset for the Rux type string (e.g. `"fn(i32, i32) -> i32"`); `0` = not recorded        |

### Symbol Kinds

| Value | Constant          | Description                                                               |
| ----- | ----------------- | ------------------------------------------------------------------------- |
| `0`   | `SYM_UNKNOWN`     | Unclassified symbol                                                       |
| `1`   | `SYM_FUNC`        | Function defined in this unit                                             |
| `2`   | `SYM_DATA`        | Mutable global variable defined in this unit                              |
| `3`   | `SYM_CONST`       | Read-only constant defined in this unit                                   |
| `4`   | `SYM_SECTION`     | Section symbol (one per section; name equals the section name)            |
| `5`   | `SYM_FILE`        | Source file name (informational; `section_idx` = `0xFFFE`, `value` = `0`) |
| `6`   | `SYM_EXTERN_FUNC` | External function referenced by this unit but defined elsewhere           |
| `7`   | `SYM_EXTERN_DATA` | External data referenced by this unit but defined elsewhere               |

External symbols (`SYM_EXTERN_FUNC`, `SYM_EXTERN_DATA`) always have `section_idx = 0xFFFF` and `value = 0`.

### Symbol Visibility

| Value | Constant     | Description                                                                       |
| ----- | ------------ | --------------------------------------------------------------------------------- |
| `0`   | `VIS_LOCAL`  | Visible only within this unit; not exported to the linker                         |
| `1`   | `VIS_GLOBAL` | Exported; the linker requires exactly one definition across all linked units      |
| `2`   | `VIS_WEAK`   | Exported; a `VIS_GLOBAL` definition from another unit silently overrides this one |

## Relocation Table

Each section with fix-ups has its own relocation array. A section's array starts at `section.reloc_offset` and contains `section.reloc_count` entries of 16 bytes each.

| Offset | Size | Type  | Field            | Description                                                               |
| ------ | ---- | ----- | ---------------- | ------------------------------------------------------------------------- |
| 0      | 4    | `u32` | `section_offset` | Byte offset within the owning section where the fix-up placeholder begins |
| 4      | 4    | `u32` | `symbol_index`   | Zero-based index into the Symbol Table of the target symbol               |
| 8      | 2    | `u16` | `type`           | Relocation type — see [Relocation Types](#relocation-types)               |
| 10     | 2    | `u16` | `_reserved`      | Must be `0x0000`                                                          |
| 12     | 4    | `i32` | `addend`         | Signed constant added to the resolved symbol value during fix-up          |

### Relocation Types

| Value | Constant    | Placeholder width | Linker formula                         | Typical use                                 |
| ----- | ----------- | ----------------- | -------------------------------------- | ------------------------------------------- |
| `0`   | `REL_NONE`  | —                 | no-op                                  | Alignment padding                           |
| `1`   | `REL_ABS64` | 64-bit            | `sym + addend`                         | 64-bit pointer in `.data` / `.rodata`       |
| `2`   | `REL_ABS32` | 32-bit            | `(u32)(sym + addend)`                  | 32-bit absolute value in the low 4 GiB      |
| `3`   | `REL_REL32` | 32-bit            | `(i32)(sym + addend − (patch_va + 4))` | `CALL rel32`, `JMP rel32`, `[rip + disp32]` |

**Variables used in the formulas:**

- `sym` — virtual address assigned to the target symbol by the linker.
- `patch_va` — virtual address of the first byte of the placeholder field (`section_virtual_address + section_offset`).
- `addend` — the signed value stored in the relocation entry.

### REL_REL32 — PC-Relative 32-bit Fix-up

`REL_REL32` is the most common relocation type for x86-64 code. The assembler emits four zero bytes as a placeholder. The linker replaces them with a signed 32-bit integer according to:

```
patch = (i32)(sym + addend − (patch_va + 4))
```

The `+ 4` in the denominator accounts for the processor advancing `RIP` past the 4-byte placeholder before adding the displacement.

With `addend = 0` (the default emitted by the Rux compiler) the formula covers all standard x86-64 position-relative encodings:

| Instruction            | Opcode prefix        | Placeholder at offset | Notes                     |
| ---------------------- | -------------------- | --------------------- | ------------------------- |
| `CALL sym`             | `E8` (1 byte)        | `instr + 1`           | Near call                 |
| `JMP sym`              | `E9` (1 byte)        | `instr + 1`           | Near unconditional jump   |
| `Jcc sym`              | `0F 8x` (2 bytes)    | `instr + 2`           | Conditional jumps         |
| `LEA rax, [rip + sym]` | `48 8D 05` (3 bytes) | `instr + 3`           | RIP-relative address load |
| `MOV rax, [rip + sym]` | `48 8B 05` (3 bytes) | `instr + 3`           | RIP-relative memory load  |

## String Table

The String Table is a flat array of null-terminated UTF-8 strings packed consecutively. Byte offset `0` is always `\0` — the empty string sentinel. All string-offset fields in other structures are byte offsets into this array.

```
Offset   Content
 0       \0                          ← always: empty sentinel
 1       "add\0"
 5       "main\0"
10       "fn(i32, i32) -> i32\0"
30       "-> i32\0"
37       "math.rux\0"
46       ...
```

Strings are encoded in UTF-8. The Rux compiler guarantees that symbol names and section names contain only printable ASCII characters. Source file paths and Rux type strings may contain arbitrary UTF-8.

## Rux Metadata

When `header.flags & F_HAS_METADATA` is set, a 64-byte Rux Metadata block is present at `header.metadata_offset`. This block is specific to Rux and carries information used by the build system for incremental compilation and by tooling for diagnostics and introspection.

| Offset | Size | Type     | Field              | Description                                                             |
| ------ | ---- | -------- | ------------------ | ----------------------------------------------------------------------- |
| 0      | 4    | `u8[4]`  | `magic`            | Block magic: `4D 45 54 41` (`"META"`)                                   |
| 4      | 4    | `u32`    | `block_size`       | Total size of this block in bytes (currently `64`)                      |
| 8      | 4    | `u32`    | `source_path_off`  | String Table offset for the source file path (e.g. `"src/math.rux"`)    |
| 12     | 4    | `u32`    | `package_name_off` | String Table offset for the Rux package name                            |
| 16     | 8    | `u64`    | `build_timestamp`  | Unix seconds since epoch at compile time                                |
| 24     | 4    | `u32`    | `rux_version`      | Rux language version: `(major << 16) \| (minor << 8) \| patch`          |
| 28     | 4    | `u32`    | `compiler_flags`   | Compiler option flags — see [Compiler Flags](#compiler-flags)           |
| 32     | 32   | `u8[32]` | `source_hash`      | SHA-256 digest of the source `.rux` file; all-zero bytes if unavailable |

### Compiler Flags

Bits 3–31 are reserved and must be `0`.

| Bit | Constant       | Set when…                                      |
| --- | -------------- | ---------------------------------------------- |
| 0   | `CF_DEBUG`     | Compiled with `-g` / debug information enabled |
| 1   | `CF_OPTIMIZED` | Compiled with optimizations enabled            |
| 2   | `CF_TEST`      | Compiled in test mode (`rux test`)             |

## Alignment and Padding Rules

1. **Section Table** — begins at file offset 32 with no preceding padding.
2. **Symbol Table** — begins immediately after the last Section Table entry with no padding (`32 + section_count × 40`).
3. **Section raw data** — must begin at a file offset that satisfies `offset mod alignment == 0` where `alignment` is the section's declared alignment. Insert zero-fill padding between consecutive sections as necessary.
4. **Relocation arrays** — must begin at a 4-byte-aligned file offset. Insert zero-fill padding after section raw data if needed before the relocation array.
5. **String Table** — byte-aligned; no special alignment required.
6. **Rux Metadata block** — must begin at an 8-byte-aligned file offset. Insert zero-fill padding after the String Table if needed.

Unused bytes in any padding region must be set to `0x00`.

## Example: Two-Function Unit

This section shows a complete RCU for the following source file.

```rux
// Math.rux
func Add(a: int32, b: int32) -> int32 {
    return a + b;
}

func Main() -> int32 {
    return Add(3, 4);
}
```

### Machine Code — `.text` (31 bytes)

```
; add — section offset 0, size 10 bytes
Offset  Bytes             Disassembly
  0     55                push  rbp
  1     48 89 E5          mov   rbp, rsp
  4     01 F7             add   edi, esi        ; b into a (i32)
  6     89 F8             mov   eax, edi        ; return value
  8     5D                pop   rbp
  9     C3                ret

; main — section offset 10, size 21 bytes
Offset  Bytes             Disassembly
 10     55                push  rbp
 11     48 89 E5          mov   rbp, rsp
 14     BF 03 00 00 00    mov   edi, 3          ; first argument
 19     BE 04 00 00 00    mov   esi, 4          ; second argument
 24     E8 00 00 00 00    call  add             ; ← REL_REL32 relocation at offset 25
 29     5D                pop   rbp
 30     C3                ret
```

The four zero bytes at offsets `25–28` are the `REL_REL32` placeholder for the `call add` instruction.

### Symbol Table (2 entries)

| Index | `name_off`   | `value` | `size` | `section_idx` | `kind`         | `visibility`     | `type_name_off`              |
| ----- | ------------ | ------- | ------ | ------------- | -------------- | ---------------- | ---------------------------- |
| 0     | `1` ("add")  | `0`     | `10`   | `0` (`.text`) | `SYM_FUNC` (1) | `VIS_GLOBAL` (1) | `10` ("fn(i32, i32) -> i32") |
| 1     | `5` ("main") | `10`    | `21`   | `0` (`.text`) | `SYM_FUNC` (1) | `VIS_GLOBAL` (1) | `30` ("-> i32")              |

### Relocation Table for `.text` (1 entry)

| `section_offset` | `symbol_index` | `type`            | `addend` | Explanation                                                 |
| ---------------- | -------------- | ----------------- | -------- | ----------------------------------------------------------- |
| `25`             | `0` (`add`)    | `3` (`REL_REL32`) | `0`      | Fix up 4-byte placeholder at `.text[25..28]` for `call add` |

**Linker verification** — assuming `.text` is placed at virtual address `0x1000`:

- `add_va = 0x1000 + 0 = 0x1000`
- `patch_va = 0x1000 + 25 = 0x1019`
- `patch = (i32)(0x1000 + 0 − (0x1019 + 4)) = (i32)(0x1000 − 0x101D) = −29 = 0xFFFFFFE3`
- CPU executes `E8 E3 FF FF FF` → jumps to `0x101D + (−29) = 0x1000` ✓

### String Table (37 bytes)

```
Off   Hex                                           ASCII
 0    00                                            \0 (sentinel)
 1    61 64 64 00                                   "add\0"
 5    6D 61 69 6E 00                                "main\0"
10    66 6E 28 69 33 32 2C 20 69 33 32 29 20        "fn(i32, i32) -> i32\0"
      2D 3E 20 69 33 32 00
30    2D 3E 20 69 33 32 00                          "-> i32\0"
```

### File Layout Summary

```
File offset   Region                      Size
  0x0000      File Header                 32 bytes
  0x0020      Section Table  (1 entry)    40 bytes
  0x0048      Symbol Table   (2 entries)  40 bytes
  0x0070      .text raw data              31 bytes  (alignment 16 → offset 0x70 = 112, 112 % 16 = 0 ✓)
              [1 byte zero padding]
  0x0090      .text relocations (1 entry) 16 bytes  (alignment 4 → offset 0x90 = 144, 144 % 4 = 0 ✓)
  0x00A0      String Table                37 bytes
              [3 bytes zero padding for 8-byte alignment]
  0x00C8      Rux Metadata                64 bytes  (alignment 8 → offset 0xC8 = 200, 200 % 8 = 0 ✓)
  0x0108      End of file
```

### File Header Bytes

```
Offset  Bytes                           Field
  0     52 43 55 00                     magic        "RCU\0"
  4     01 00                           version      0x0100 → v1.0
  6     01                              arch         0x01 → x86-64
  7     01                              flags        F_HAS_METADATA
  8     01 00                           section_count 1
 10     00 00                           _reserved
 12     02 00 00 00                     symbol_count  2
 16     A0 00 00 00                     string_table_off  0x00A0
 20     25 00 00 00                     string_table_size 37
 24     C8 00 00 00                     metadata_offset   0x00C8
 28     xx xx xx xx                     checksum     (CRC-32C computed last)
```

## Incremental Compilation

The Rux build system uses the Rux Metadata block to avoid recompiling unchanged source files:

1. **Source hash check** — compute the SHA-256 of the `.rux` file and compare it to `source_hash` in the metadata. If they match, the source has not changed since the last compilation.
2. **Compiler version check** — if the installed compiler's `rux_version` differs from the value stored in the metadata, the file must be recompiled regardless of the hash, because language semantics or code-generation may have changed.

If both checks pass the existing `.rcu` is used directly; the source file is not read again.

## Checksum — CRC-32C

The `checksum` field holds a CRC-32C (Castagnoli polynomial `0x1EDC6F41`) computed over the entire file content with the four bytes at offset 28 treated as `0x00000000`.

Writers must compute and store the checksum after writing all other fields. Readers may skip validation by checking for `checksum == 0`; a stored checksum of `0` disables checking.

## Implementation Notes

### Reading an RCU File

1. Read 32 bytes from offset 0 → File Header.
2. Verify magic == [0x52, 0x43, 0x55, 0x00].
3. Verify version major byte <= supported major version.
4. Read section_count × 40 bytes at offset 32 → Section Table.
5. Read symbol_count × 20 bytes at offset (32 + section_count × 40) → Symbol Table.
6. Read string_table_size bytes at string_table_off → String Table.
7. For each section entry:
   a. If raw_size > 0, read raw_size bytes at raw_offset → section data.
   b. If reloc_count > 0, read reloc_count × 16 bytes at reloc_offset → relocations.
8. If flags & F_HAS_METADATA, read 64 bytes at metadata_offset → Rux Metadata.
   Verify metadata magic == [0x4D, 0x45, 0x54, 0x41].
9. If header.checksum != 0, validate CRC-32C.

### Writing an RCU File

1. Assemble sections, symbols, relocations, and strings from the code-generation stage.
2. Intern all strings (names, type strings, paths) into the String Table.
3. Compute section_count, symbol_count, and all file offsets
   (write 0 into header.checksum as a placeholder).
4. Write regions in order:
   File Header → Section Table → Symbol Table →
   [for each section: raw data (aligned) + relocation array (4-byte aligned)] →
   String Table (8-byte aligned) → Rux Metadata (optional).
5. Compute CRC-32C over the complete file content (treating offset 28 as zero).
6. Seek to offset 28 and write the 4-byte checksum.

### Linker Responsibilities

The Rux linker processes a set of RCU files to produce a Windows x64 PE executable:

1. Collect and merge all same-named sections (`.text`, `.rodata`, `.data`, `.bss`).
2. Resolve all symbols: pair each `SYM_EXTERN_*` reference with its `VIS_GLOBAL` or `VIS_WEAK` definition; report an error for any unresolved symbol.
3. Assign virtual addresses to all merged sections.
4. Apply all relocations using the formulas in [Relocation Types](#relocation-types).
5. Emit a PE/COFF image with appropriate headers, a `.idata` import section for external Windows API calls, and the merged section data.
