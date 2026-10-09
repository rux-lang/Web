# API snapshot schema (v1)

`rux doc --format json` writes one `<Package>.json` per package into its output directory. `npm run sync:api` copies each into this folder as `data/api/<slug>.json` (slug = lowercased package name), and `scripts/api-docs.mjs` renders the `/docs/api/<slug>` pages from it. The compiler and the site agree on exactly this shape; a change to it bumps `schema`.

Every Markdown string is the documentation's own normalized Markdown, unchanged: the compiler does not render or rewrap it. Keys are always present; an absent value is `null`, an empty list is `[]`. Items appear in source order: modules in the order the compiler loaded them, declarations in file order.

```jsonc
{
  "schema": 1,
  "target": "windows-x86_64", // the --target the snapshot was taken for
  "package": {
    "name": "Allocator",
    "namespace": "Rux",
    "version": "0.1.0",
    "description": "Allocation contracts and the allocators that meet them",
    "license": "MIT",
    "minRux": "0.4.0",
    "repository": "https://github.com/rux-lang/Rux",
    "homepage": "https://rux-lang.dev/docs/api/allocator",
    "dependencies": [
      { "name": "Core", "namespace": "Rux", "version": "0.1.0", "targetOS": [] },
      { "name": "Memory", "namespace": "Rux", "version": "0.1.0", "targetOS": [] },
    ],
  },
  "modules": [
    {
      "name": "Arena", // file stem
      "source": "Src/Arena.rux", // relative to the package root, forward slashes
      "header": "An allocator that hands out storage by advancing a pointer…", // the leading `//` file header, joined into one Markdown string, or null
    },
  ],
  "items": [
    {
      "kind": "struct", // struct | enum | variant | union | interface | function | constant | type | primitive | extern
      "name": "Arena",
      "displayName": "Arena", // with type parameters: "Box<T>"
      "module": "Arena",
      "source": "Src/Arena.rux",
      "line": 44,
      "signature": "pub struct Arena", // DeclSignature: a single line, no body
      "typeParams": [], // [{ "name": "T", "bounds": ["Display"] }]
      "doc": {
        "summary": "An allocator that advances a pointer and reclaims everything at once.", // Documentation::Summary()
        "markdown": "An allocator that …\nMove-only, …", // the full prose, tags excluded
        "typeParams": [], // [{ "name": "T", "markdown": "the type the box owns one of" }]
        "params": [], // [{ "name": "backing", "markdown": "…" }]
        "returns": null, // Markdown or null
        "see": ["https://rux-lang.dev/docs/api/allocator/arena"], // every @see subject, in order
        "deprecated": null, // Markdown or null
      },
      "value": null, // constant only: the initializer as written in source, e.g. "4096" or "0x52757841_6C6C6F63"
      "fields": [
        // struct / union: every field, public or not; the site shows only the public ones
        { "name": "backing", "type": "Allocator", "public": false, "line": 46, "doc": "Where the blocks come from." },
      ],
      "baseType": null, // enum only: "uint8"
      "cases": [
        // enum / variant
        // { "name": "OutOfMemory", "value": "1", "payload": null, "line": 12, "doc": "…" }
        // payload for a variant case: "(int32, String)" or "{ code: int32; }"
      ],
      "members": [
        // from every `extend <this type>` block and, for an interface, its requirements
        {
          "kind": "constructor", // constructor | method | associated | operator | destructor | constant | requirement
          "name": "Arena",
          "line": 70,
          "signature": "pub func Arena(backing: Allocator, blockSize: uint) -> Arena",
          "typeParams": [],
          "params": [
            { "name": "backing", "type": "Allocator" },
            { "name": "blockSize", "type": "uint" },
          ], // the `self` receiver is not listed
          "receiver": null, // "&var Arena" for a method, null otherwise
          "returnType": "Arena", // null when nothing is returned
          "value": null, // constant members only
          "conformance": null, // "Allocator" when the member came from `extend T : Allocator`
          "public": true, // a prohibited copy `func =` is private and left out unless --document-private-items
          "doc": {/* same shape as item.doc */},
        },
      ],
      "implements": [], // interfaces this type conforms to, from `extend T : I` headers: ["Allocator"]
    },
  ],
}
```

## Primitive items

Every primitive type is built into the compiler, so no package declares one. A package that extends a primitive gets one `primitive` item for it, named by its canonical spelling (`int8`, never `byte`), anchored on the first `extend` block of it that carries documentation: `module`, `source`, `line` and `doc` come from that block, and `signature` is `extend int8`. Its `members` gather every `extend int8` block in the package, `extend byte` included. A primitive the package extends only in undocumented blocks gets no item.

## Member kinds

- `constructor` — an associated function whose name is the type's own name (`func Arena(…) -> Arena`).
- `associated` — any other function in an `extend` block with no `self` receiver (`Layout::New`, `Box::Create`).
- `method` — a function whose first parameter is `self`.
- `operator` — a method whose name is an operator: `==`, `!=`, `<`, `+`, `[]`, … (`func =` is the copy operator and is private by convention).
- `destructor` — `func ~Type`.
- `constant` — a `const` inside an `extend` block.
- `requirement` — a function declared inside an `interface`.

## What the site does with it

The `@see` URL is the routing table. `https://rux-lang.dev/docs/api/<slug>/<page>` makes the item the owner of page `<page>`; `…/<page>#<anchor>` places the item (or member) as an anchored section on that page. Members default to their type's page. Fields and cases need no `@see`. See `scripts/api-docs.mjs`.

Several declarations may share one URL as an _overload set_: callables of one name (`Print(String)`, `Print(StringView)`, …), or declarations of one name that no target has both of (`type c_long = int32` on Windows, `int64` elsewhere). The set renders as one section with every signature in one fence. Anything else that shares a URL is an error.

## Targets

`rux doc` documents the API one `--target` enables, so `npm run sync:api` takes a snapshot for every supported target (only the platform's own targets for a platform package such as Linux) and merges them into the one file in this folder. The merge adds two fields; the compiler writes neither, and neither bumps `schema`:

- `targets` at the top level: every target the merged snapshots were taken for, in the order of `TARGETS` in `scripts/api-docs.mjs`. `target` keeps the first of them.
- `targets` on every item, member, field and case: the targets that declare it.

Declarations match across targets by kind, name, module (items only) and signature, and a constant also by its value, so a constant whose value differs by OS becomes one declaration per value, each with its own `targets`. A declaration missing from some targets gets an availability note on its page ("Linux · FreeBSD"), and the variants of an overload set are labelled with theirs in the signature fence.
