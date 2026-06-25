import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader,
} from "vitepress-plugin-group-icons";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Load Rux grammar for syntax highlighting
const dirname = path.dirname(fileURLToPath(import.meta.url));
const filename = path.resolve(dirname, "./grammars/rux.tmLanguage.json");
const ruxGrammar = JSON.parse(readFileSync(filename, "utf-8"));

// Set aliases for the Rux grammar
ruxGrammar.aliases = ["rux"];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Rux Programming Language",
  description: "Fast, compiled, strongly typed, multi-paradigm language",
  srcDir: "./src",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: "https://rux-lang.dev" },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["link", { rel: "icon", href: "/favicon.ico", sizes: "any" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    [
      "script",
      {
        defer: "true",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "c3db4674-752d-4334-a22b-6deba2e4ecfb",
      },
    ],
  ],

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Rux",

    nav: [
      {
        text: "Docs",
        items: [
          { text: "Get Started", link: "/start/" },
          { text: "Rux Reference", link: "/docs/" },
          { text: "API Reference", link: "/api/" },
          { text: "CLI Reference", link: "/cli/" },
        ],
      },
      { text: "Playground", link: "/playground" },
      { text: "Packages", link: "/packages" },
      { text: "Blog", link: "/blog/release-v0.3.0" },
      { text: "Community", link: "/community" },
      { text: "Support", link: "/support" },
      { text: "Download", link: "/download" },
      { text: "FAQ", link: "/faq" },
    ],

    search: {
      provider: "local",
    },

    sidebar: {
      "/start/": [
        {
          text: "Get Started",
          collapsed: false,
          items: [
            { text: "Overview", link: "/start/" },
            {
              text: "Install",
              collapsed: true,
              items: [
                { text: "BSD", link: "/start/install/bsd" },
                { text: "illumos", link: "/start/install/illumos" },
                { text: "Linux", link: "/start/install/linux" },
                { text: "macOS", link: "/start/install/macos" },
                { text: "Windows", link: "/start/install/windows" },
              ],
            },
            { text: "Build From Source", link: "/start/build" },
            {
              text: "Code Editors",
              collapsed: true,
              items: [
                { text: "Visual Studio Code", link: "/start/editors/vscode" },
                { text: "Sublime Text", link: "/start/editors/sublime" },
                { text: "Zed", link: "/start/editors/zed" },
              ],
            },
            { text: "Examples", link: "/start/examples" },
          ],
        },
      ],
      "/docs/": [
        {
          text: "Rux Reference",
          collapsed: false,
          items: [
            { text: "Table of Contents", link: "/docs/" },
            { text: "Introduction", link: "/docs/introduction" },
            {
              text: "Lexical Structure",
              collapsed: true,
              items: [
                { text: "Source Files", link: "/docs/lexical/sources" },
                { text: "Comments", link: "/docs/lexical/comments" },
                { text: "Keywords", link: "/docs/lexical/keywords" },
                { text: "Identifiers", link: "/docs/lexical/identifiers" },
                { text: "Literals", link: "/docs/lexical/literals" },
                { text: "Operators", link: "/docs/lexical/operators" },
              ],
            },
            {
              text: "Signed Integers",
              collapsed: true,
              items: [
                { text: "int", link: "/docs/signed/int" },
                { text: "int8", link: "/docs/signed/int8" },
                { text: "int16", link: "/docs/signed/int16" },
                { text: "int32", link: "/docs/signed/int32" },
                { text: "int64", link: "/docs/signed/int64" },
                { text: "int128", link: "/docs/signed/int128" },
                { text: "int256", link: "/docs/signed/int256" },
                { text: "int512", link: "/docs/signed/int512" },
              ],
            },
            {
              text: "Unsigned Integers",
              collapsed: true,
              items: [
                { text: "uint", link: "/docs/unsigned/uint" },
                { text: "uint8", link: "/docs/unsigned/uint8" },
                { text: "uint16", link: "/docs/unsigned/uint16" },
                { text: "uint32", link: "/docs/unsigned/uint32" },
                { text: "uint64", link: "/docs/unsigned/uint64" },
                { text: "uint128", link: "/docs/unsigned/uint128" },
                { text: "uint256", link: "/docs/unsigned/uint256" },
                { text: "uint512", link: "/docs/unsigned/uint512" },
              ],
            },
            {
              text: "Floating-Point",
              collapsed: true,
              items: [
                { text: "float", link: "/docs/floating/float" },
                { text: "float8", link: "/docs/floating/float8" },
                { text: "float16", link: "/docs/floating/float16" },
                { text: "float32", link: "/docs/floating/float32" },
                { text: "float64", link: "/docs/floating/float64" },
                { text: "float80", link: "/docs/floating/float80" },
                { text: "float128", link: "/docs/floating/float128" },
                { text: "float256", link: "/docs/floating/float256" },
                { text: "float512", link: "/docs/floating/float512" },
              ],
            },
            {
              text: "Booleans",
              collapsed: true,
              items: [
                { text: "bool", link: "/docs/boolean/bool" },
                { text: "bool8", link: "/docs/boolean/bool8" },
                { text: "bool16", link: "/docs/boolean/bool16" },
                { text: "bool32", link: "/docs/boolean/bool32" },
                { text: "bool64", link: "/docs/boolean/bool64" },
                { text: "bool128", link: "/docs/boolean/bool128" },
                { text: "bool256", link: "/docs/boolean/bool256" },
                { text: "bool512", link: "/docs/boolean/bool512" },
              ],
            },
            {
              text: "Characters",
              collapsed: true,
              items: [
                { text: "char", link: "/docs/character/char" },
                { text: "char8", link: "/docs/character/char8" },
                { text: "char16", link: "/docs/character/char16" },
                { text: "char32", link: "/docs/character/char32" },
                { text: "char64", link: "/docs/character/char64" },
                { text: "char128", link: "/docs/character/char128" },
                { text: "char256", link: "/docs/character/char256" },
                { text: "char512", link: "/docs/character/char512" },
              ],
            },
            {
              text: "Variables",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/variables/overview" },
                { text: "Immutable", link: "/docs/variables/let" },
                { text: "Mutable", link: "/docs/variables/var" },
                {
                  text: "Mutability of Structs",
                  link: "/docs/variables/mutability",
                },
              ],
            },
            {
              text: "Constants",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/constants/overview" },
                {
                  text: "Intrinsic Constants",
                  link: "/docs/constants/intrinsic",
                },
              ],
            },
            {
              text: "Operations",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/operations/overview" },
                {
                  text: "Arithmetic Operations",
                  link: "/docs/operations/arithmetic",
                },
                {
                  text: "Comparison Operations",
                  link: "/docs/operations/comparison",
                },
                {
                  text: "Logical Operations",
                  link: "/docs/operations/logical",
                },
                {
                  text: "Bitwise Operations",
                  link: "/docs/operations/bitwise",
                },
                { text: "Shift Operations", link: "/docs/operations/shift" },
                { text: "Type Casts", link: "/docs/operations/type-cast" },
                { text: "Type Tests", link: "/docs/operations/type-test" },
              ],
            },
            {
              text: "Statements",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/statements/overview" },
                { text: "if / else", link: "/docs/statements/if" },
                { text: "match", link: "/docs/statements/match" },
                { text: "while", link: "/docs/statements/while" },
                { text: "for / in", link: "/docs/statements/for" },
                { text: "loop", link: "/docs/statements/loop" },
                {
                  text: "break / continue",
                  link: "/docs/statements/break-continue",
                },
              ],
            },
            {
              text: "Functions",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/functions/overview" },
                { text: "Declaration", link: "/docs/functions/declaration" },
                { text: "Variadic", link: "/docs/functions/variadic" },
                { text: "Generic", link: "/docs/functions/generic" },
                { text: "Assembler", link: "/docs/functions/assembler" },
                { text: "Main Entry Point", link: "/docs/functions/main" },
              ],
            },
            {
              text: "Structures",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/structs/overview" },
                { text: "Methods", link: "/docs/structs/methods" },
              ],
            },
            {
              text: "Unions",
              collapsed: true,
              items: [{ text: "Overview", link: "/docs/unions/overview" }],
            },
            {
              text: "Enumerations",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/enums/overview" },
                { text: "Backing Type", link: "/docs/enums/values" },
                { text: "Variants", link: "/docs/enums/data" },
              ],
            },
            {
              text: "Tuples",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/tuples/overview" },
                { text: "Destructuring", link: "/docs/tuples/destructuring" },
                { text: "Tuples vs. Structs", link: "/docs/tuples/vs-struct" },
              ],
            },
            {
              text: "Slices",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/slices/overview" },
                { text: "Dynamic and Fixed-Size", link: "/docs/slices/kinds" },
                { text: "Literals", link: "/docs/slices/literals" },
                { text: "Indexing and Iteration", link: "/docs/slices/access" },
                { text: "Slices and Pointers", link: "/docs/slices/low-level" },
              ],
            },
            {
              text: "Pointers",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/pointers/overview" },
                { text: "Pointer Types", link: "/docs/pointers/types" },
                { text: "The null Pointer", link: "/docs/pointers/null" },
                { text: "Fields and Members", link: "/docs/pointers/members" },
                {
                  text: "Pointer Arithmetic",
                  link: "/docs/pointers/arithmetic",
                },
                { text: "Pointers and extern", link: "/docs/pointers/extern" },
              ],
            },
            {
              text: "Type Aliases",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/aliases/overview" },
                { text: "Usage", link: "/docs/aliases/usage" },
                {
                  text: "Function Type Aliases",
                  link: "/docs/aliases/function-types",
                },
                { text: "Built-in Aliases", link: "/docs/aliases/builtin" },
              ],
            },
            {
              text: "Interfaces",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/interfaces/overview" },
                { text: "Declaration", link: "/docs/interfaces/declaration" },
                {
                  text: "Implementation",
                  link: "/docs/interfaces/implementation",
                },
              ],
            },
            {
              text: "Modules",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/modules/overview" },
                { text: "Declaration", link: "/docs/modules/declaration" },
                { text: "Items Visibility", link: "/docs/modules/visibility" },
                { text: "Import", link: "/docs/modules/import" },
              ],
            },
            {
              text: "Error Handling",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/error/overview" },
                { text: "The Result Type", link: "/docs/error/result" },
                { text: "Fatal Errors", link: "/docs/error/fatal" },
              ],
            },
            {
              text: "Foreign Function Interface",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/ffi/overview" },
                { text: "Extern Declarations", link: "/docs/ffi/extern" },
                { text: "Import Attribute", link: "/docs/ffi/import" },
              ],
            },
            {
              text: "Attributes",
              collapsed: true,
              items: [
                { text: "Overview", link: "/docs/attributes/overview" },
                { text: "Import", link: "/docs/attributes/import" },
                { text: "Target", link: "/docs/attributes/target" },
                { text: "Warn", link: "/docs/attributes/warn" },
                { text: "Error", link: "/docs/attributes/error" },
              ],
            },
            {
              text: "Package System",
              collapsed: true,
              items: [
                { text: "Package Types", link: "/docs/packages/types" },
                { text: "Directory Layout", link: "/docs/packages/dirs" },
                { text: "Package Manifest", link: "/docs/packages/manifest" },
                { text: "Dependencies", link: "/docs/packages/dependencies" },
              ],
            },
            {
              text: "Appendix",
              collapsed: true,
              items: [
                { text: "Primitive Types", link: "/docs/appendix/primitives" },
                { text: "Token Reference", link: "/docs/appendix/tokens" },
                { text: "Rux Compiled Unit", link: "/docs/appendix/rcu" },
              ],
            },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          collapsed: false,
          items: [
            { text: "Overview", link: "/api/" },
            {
              text: "Std Package",
              collapsed: true,
              items: [
                { text: "Overview", link: "/api/std/" },
                {
                  text: "Std",
                  collapsed: true,
                  items: [
                    { text: "Assert", link: "/api/std/assert" },
                    { text: "Display", link: "/api/std/display" },
                    { text: "Exit", link: "/api/std/exit" },
                    { text: "Fatal", link: "/api/std/fatal" },
                    { text: "Floating-Point Helpers", link: "/api/std/float" },
                    { text: "Format", link: "/api/std/format" },
                    {
                      text: "String",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/std/string/" },
                        {
                          text: "Capitalize",
                          link: "/api/std/string/capitalize",
                        },
                        {
                          text: "CapitalizeInPlace",
                          link: "/api/std/string/capitalizeinplace",
                        },
                        { text: "Clone", link: "/api/std/string/clone" },
                        { text: "Data", link: "/api/std/string/data" },
                        { text: "EndsWith", link: "/api/std/string/endswith" },
                        { text: "From", link: "/api/std/string/from" },
                        { text: "IsEmpty", link: "/api/std/string/isempty" },
                        { text: "Length", link: "/api/std/string/length" },
                        { text: "New", link: "/api/std/string/new" },
                        { text: "Repeat", link: "/api/std/string/repeat" },
                        { text: "Split", link: "/api/std/string/split" },
                        {
                          text: "StartsWith",
                          link: "/api/std/string/startswith",
                        },
                        {
                          text: "TitleCase",
                          link: "/api/std/string/titlecase",
                        },
                        {
                          text: "TitleCaseInPlace",
                          link: "/api/std/string/titlecaseinplace",
                        },
                        { text: "ToLower", link: "/api/std/string/tolower" },
                        {
                          text: "ToLowerInPlace",
                          link: "/api/std/string/tolowerinplace",
                        },
                        { text: "ToString", link: "/api/std/string/tostring" },
                        { text: "ToUpper", link: "/api/std/string/toupper" },
                        {
                          text: "ToUpperInPlace",
                          link: "/api/std/string/toupperinplace",
                        },
                        { text: "Trim", link: "/api/std/string/trim" },
                        {
                          text: "TrimInPlace",
                          link: "/api/std/string/triminplace",
                        },
                        { text: "+", link: "/api/std/string/plus" },
                      ],
                    },
                    {
                      text: "StringBuilder",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/std/stringbuilder/" },
                        {
                          text: "Append",
                          link: "/api/std/stringbuilder/append",
                        },
                        {
                          text: "Capacity",
                          link: "/api/std/stringbuilder/capacity",
                        },
                        { text: "Clear", link: "/api/std/stringbuilder/clear" },
                        {
                          text: "IntoString",
                          link: "/api/std/stringbuilder/intostring",
                        },
                        {
                          text: "IsEmpty",
                          link: "/api/std/stringbuilder/isempty",
                        },
                        {
                          text: "Length",
                          link: "/api/std/stringbuilder/length",
                        },
                        { text: "New", link: "/api/std/stringbuilder/new" },
                        {
                          text: "Reserve",
                          link: "/api/std/stringbuilder/reserve",
                        },
                        {
                          text: "Shrink",
                          link: "/api/std/stringbuilder/shrink",
                        },
                        {
                          text: "ToString",
                          link: "/api/std/stringbuilder/tostring",
                        },
                        {
                          text: "WithCapacity",
                          link: "/api/std/stringbuilder/withcapacity",
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "Std::Base64",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/base64/" },
                    {
                      text: "DecodeBase64",
                      link: "/api/std/base64/decodebase64",
                    },
                    {
                      text: "EncodeBase64",
                      link: "/api/std/base64/encodebase64",
                    },
                  ],
                },
                {
                  text: "Std::Hash",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/hash/" },
                    { text: "Blake2", link: "/api/std/hash/blake2" },
                    { text: "Blake3", link: "/api/std/hash/blake3" },
                    { text: "Md5", link: "/api/std/hash/md5" },
                    { text: "Sha0", link: "/api/std/hash/sha0" },
                    { text: "Sha1", link: "/api/std/hash/sha1" },
                    { text: "Sha256", link: "/api/std/hash/sha256" },
                    { text: "Sha512", link: "/api/std/hash/sha512" },
                  ],
                },
                {
                  text: "Std::HashMap",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/hashmap/" },
                    { text: "Cap", link: "/api/std/hashmap/cap" },
                    { text: "Clear", link: "/api/std/hashmap/clear" },
                    { text: "Contains", link: "/api/std/hashmap/contains" },
                    { text: "Free", link: "/api/std/hashmap/free" },
                    { text: "Get", link: "/api/std/hashmap/get" },
                    { text: "Init", link: "/api/std/hashmap/init" },
                    { text: "Keys", link: "/api/std/hashmap/keys" },
                    { text: "Len", link: "/api/std/hashmap/len" },
                    { text: "Remove", link: "/api/std/hashmap/remove" },
                    { text: "Set", link: "/api/std/hashmap/set" },
                    { text: "Values", link: "/api/std/hashmap/values" },
                  ],
                },
                {
                  text: "Std::HashSet",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/hashset/" },
                    { text: "Cap", link: "/api/std/hashset/cap" },
                    { text: "Clear", link: "/api/std/hashset/clear" },
                    { text: "Contains", link: "/api/std/hashset/contains" },
                    { text: "Free", link: "/api/std/hashset/free" },
                    { text: "Init", link: "/api/std/hashset/init" },
                    { text: "Insert", link: "/api/std/hashset/insert" },
                    { text: "Keys", link: "/api/std/hashset/keys" },
                    { text: "Len", link: "/api/std/hashset/len" },
                    { text: "Remove", link: "/api/std/hashset/remove" },
                  ],
                },
                {
                  text: "Std::Hex",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/hex/" },
                    { text: "Decode", link: "/api/std/hex/decode" },
                    { text: "DecodeBytes", link: "/api/std/hex/decodebytes" },
                    { text: "Encode", link: "/api/std/hex/encode" },
                    { text: "EncodeBytes", link: "/api/std/hex/encodebytes" },
                  ],
                },
                {
                  text: "Std::Io",
                  collapsed: true,
                  items: [
                    { text: "Print", link: "/api/std/io/print" },
                    { text: "PrintLine", link: "/api/std/io/printline" },
                    { text: "ReadLine", link: "/api/std/io/readline" },
                  ],
                },
                {
                  text: "Std::Math",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/math/" },
                    { text: "Abs", link: "/api/std/math/abs" },
                    { text: "Add", link: "/api/std/math/add" },
                    { text: "Ceil", link: "/api/std/math/ceil" },
                    { text: "Cos", link: "/api/std/math/cos" },
                    { text: "Floor", link: "/api/std/math/floor" },
                    { text: "Pow", link: "/api/std/math/pow" },
                    { text: "Round", link: "/api/std/math/round" },
                    { text: "Sin", link: "/api/std/math/sin" },
                    { text: "Sqrt", link: "/api/std/math/sqrt" },
                    { text: "Tan", link: "/api/std/math/tan" },
                  ],
                },
                {
                  text: "Std::Memory",
                  collapsed: true,
                  items: [
                    { text: "Alloc", link: "/api/std/memory/alloc" },
                    { text: "Compare", link: "/api/std/memory/compare" },
                    { text: "Copy", link: "/api/std/memory/copy" },
                    { text: "Free", link: "/api/std/memory/free" },
                    { text: "Realloc", link: "/api/std/memory/realloc" },
                    { text: "Set", link: "/api/std/memory/set" },
                    { text: "Zero", link: "/api/std/memory/zero" },
                  ],
                },
                {
                  text: "Std::Random",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/random/" },
                    { text: "RandomBool", link: "/api/std/random/randombool" },
                    {
                      text: "RandomFloat",
                      link: "/api/std/random/randomfloat",
                    },
                    { text: "RandomInt", link: "/api/std/random/randomint" },
                    { text: "RandomUInt", link: "/api/std/random/randomuint" },
                  ],
                },
                {
                  text: "Std::Sort",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/sort/" },
                    { text: "Crumsort", link: "/api/std/sort/crumsort" },
                    { text: "Piposort", link: "/api/std/sort/piposort" },
                    { text: "Quadsort", link: "/api/std/sort/quadsort" },
                    { text: "Sort", link: "/api/std/sort/sort" },
                  ],
                },
                {
                  text: "Std::Time",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/time/" },
                    { text: "LocalTime", link: "/api/std/time/localtime" },
                    {
                      text: "SleepMinutes",
                      link: "/api/std/time/sleepminutes",
                    },
                    { text: "SleepMs", link: "/api/std/time/sleepms" },
                    {
                      text: "SleepSeconds",
                      link: "/api/std/time/sleepseconds",
                    },
                    { text: "SystemTime", link: "/api/std/time/systemtime" },
                    { text: "TickMs", link: "/api/std/time/tickms" },
                    { text: "UtcTime", link: "/api/std/time/utctime" },
                  ],
                },
                {
                  text: "Std::UUID",
                  collapsed: true,
                  items: [
                    { text: "Overview", link: "/api/std/uuid/" },
                    { text: "IsValidUuid", link: "/api/std/uuid/isvaliduuid" },
                    { text: "UuidNil", link: "/api/std/uuid/uuidnil" },
                    { text: "UuidParse", link: "/api/std/uuid/uuidparse" },
                    {
                      text: "UuidToString",
                      link: "/api/std/uuid/uuidtostring",
                    },
                    { text: "UuidV4", link: "/api/std/uuid/uuidv4" },
                    { text: "UuidV4Bytes", link: "/api/std/uuid/uuidv4bytes" },
                  ],
                },
              ],
            },
            {
              text: "BSD Package",
              collapsed: true,
              items: [
                { text: "Overview", link: "/api/bsd/" },
                {
                  text: "BSD",
                  collapsed: true,
                  items: [
                    {
                      text: "I/O",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/bsd/io" },
                        { text: "Close", link: "/api/bsd/close" },
                        { text: "Read", link: "/api/bsd/read" },
                        { text: "Write", link: "/api/bsd/write" },
                      ],
                    },
                    {
                      text: "Memory",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/bsd/memory" },
                        { text: "Brk", link: "/api/bsd/brk" },
                        { text: "Mmap", link: "/api/bsd/mmap" },
                        { text: "Munmap", link: "/api/bsd/munmap" },
                      ],
                    },
                    {
                      text: "Process",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/bsd/process" },
                        { text: "Exit", link: "/api/bsd/exit" },
                        { text: "GetPid", link: "/api/bsd/getpid" },
                      ],
                    },
                    {
                      text: "Raw Syscalls",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/bsd/syscalls" },
                        { text: "Errno", link: "/api/bsd/errno" },
                        { text: "IsError", link: "/api/bsd/iserror" },
                      ],
                    },
                    {
                      text: "Time",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/bsd/time" },
                        {
                          text: "ClockGettime",
                          link: "/api/bsd/clockgettime",
                        },
                        { text: "Nanosleep", link: "/api/bsd/nanosleep" },
                      ],
                    },
                    {
                      text: "Types and Constants",
                      link: "/api/bsd/types",
                    },
                  ],
                },
              ],
            },
            {
              text: "Illumos Package",
              collapsed: true,
              items: [
                { text: "Overview", link: "/api/illumos/" },
                {
                  text: "Illumos",
                  collapsed: true,
                  items: [
                    {
                      text: "I/O",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/illumos/io" },
                        { text: "Close", link: "/api/illumos/close" },
                        { text: "Read", link: "/api/illumos/read" },
                        { text: "Write", link: "/api/illumos/write" },
                      ],
                    },
                    {
                      text: "Memory",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/illumos/memory" },
                        { text: "Brk", link: "/api/illumos/brk" },
                        { text: "Mmap", link: "/api/illumos/mmap" },
                        { text: "Munmap", link: "/api/illumos/munmap" },
                      ],
                    },
                    {
                      text: "Process",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/illumos/process" },
                        { text: "Exit", link: "/api/illumos/exit" },
                        { text: "GetPid", link: "/api/illumos/getpid" },
                      ],
                    },
                    {
                      text: "Raw Syscalls",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/illumos/syscalls" },
                        { text: "Errno", link: "/api/illumos/errno" },
                        { text: "IsError", link: "/api/illumos/iserror" },
                      ],
                    },
                    {
                      text: "Time",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/illumos/time" },
                        {
                          text: "ClockGetTime",
                          link: "/api/illumos/clockgettime",
                        },
                        { text: "Nanosleep", link: "/api/illumos/nanosleep" },
                      ],
                    },
                    {
                      text: "Types and Constants",
                      link: "/api/illumos/types",
                    },
                  ],
                },
              ],
            },
            {
              text: "Linux Package",
              collapsed: true,
              items: [
                { text: "Overview", link: "/api/linux/" },
                {
                  text: "Linux",
                  collapsed: true,
                  items: [
                    {
                      text: "I/O",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/linux/io" },
                        { text: "Close", link: "/api/linux/close" },
                        { text: "Read", link: "/api/linux/read" },
                        { text: "Write", link: "/api/linux/write" },
                      ],
                    },
                    {
                      text: "Memory",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/linux/memory" },
                        { text: "Brk", link: "/api/linux/brk" },
                        { text: "Mmap", link: "/api/linux/mmap" },
                        { text: "Munmap", link: "/api/linux/munmap" },
                      ],
                    },
                    {
                      text: "Process",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/linux/process" },
                        { text: "Exit", link: "/api/linux/exit" },
                        { text: "GetPid", link: "/api/linux/getpid" },
                      ],
                    },
                    {
                      text: "Raw Syscalls",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/linux/syscalls" },
                        { text: "Errno", link: "/api/linux/errno" },
                        { text: "IsError", link: "/api/linux/iserror" },
                      ],
                    },
                    {
                      text: "Time",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/linux/time" },
                        {
                          text: "ClockGetTime",
                          link: "/api/linux/clockgettime",
                        },
                        { text: "Nanosleep", link: "/api/linux/nanosleep" },
                      ],
                    },
                    {
                      text: "Types and Constants",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/linux/types" },
                        { text: "Constants", link: "/api/linux/constants" },
                        { text: "Timespec", link: "/api/linux/timespec" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "MacOS Package",
              collapsed: true,
              items: [
                { text: "Overview", link: "/api/macos/" },
                {
                  text: "MacOS",
                  collapsed: true,
                  items: [
                    {
                      text: "Console and I/O",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/macos/console" },
                        {
                          text: "GetStdHandle",
                          link: "/api/macos/getstdhandle",
                        },
                        { text: "ReadFile", link: "/api/macos/readfile" },
                        { text: "WriteFile", link: "/api/macos/writefile" },
                      ],
                    },
                    {
                      text: "Heap and Memory",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/macos/heap" },
                        {
                          text: "GetProcessHeap",
                          link: "/api/macos/getprocessheap",
                        },
                        { text: "HeapAlloc", link: "/api/macos/heapalloc" },
                        { text: "HeapFree", link: "/api/macos/heapfree" },
                        { text: "Munmap", link: "/api/macos/munmap" },
                      ],
                    },
                    {
                      text: "Process",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/macos/process" },
                        {
                          text: "ExitProcess",
                          link: "/api/macos/exitprocess",
                        },
                      ],
                    },
                    { text: "Types", link: "/api/macos/types" },
                  ],
                },
              ],
            },
            {
              text: "Windows Package",
              collapsed: true,
              items: [
                { text: "Overview", link: "/api/windows/" },
                {
                  text: "Windows",
                  collapsed: true,
                  items: [
                    { text: "CodePage", link: "/api/windows/codepage" },
                    {
                      text: "Console",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/console" },
                        {
                          text: "AllocConsole",
                          link: "/api/windows/allocconsole",
                        },
                        { text: "Beep", link: "/api/windows/beep" },
                        {
                          text: "GetStdHandle",
                          link: "/api/windows/getstdhandle",
                        },
                        {
                          text: "ReadConsoleA",
                          link: "/api/windows/readconsolea",
                        },
                        {
                          text: "WriteConsoleA",
                          link: "/api/windows/writeconsolea",
                        },
                        {
                          text: "WriteConsoleW",
                          link: "/api/windows/writeconsolew",
                        },
                      ],
                    },
                    {
                      text: "Dynamic Libraries",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/libraries" },
                        {
                          text: "FreeLibrary",
                          link: "/api/windows/freelibrary",
                        },
                        {
                          text: "GetProcAddress",
                          link: "/api/windows/getprocaddress",
                        },
                        {
                          text: "LoadLibraryA",
                          link: "/api/windows/loadlibrarya",
                        },
                      ],
                    },
                    {
                      text: "File Enumeration",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/enumeration" },
                        { text: "FindClose", link: "/api/windows/findclose" },
                        {
                          text: "FindFirstFileA",
                          link: "/api/windows/findfirstfilea",
                        },
                        {
                          text: "FindNextFileA",
                          link: "/api/windows/findnextfilea",
                        },
                      ],
                    },
                    {
                      text: "File I/O",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/files" },
                        {
                          text: "CreateFileA",
                          link: "/api/windows/createfilea",
                        },
                        {
                          text: "GetFileSizeEx",
                          link: "/api/windows/getfilesizeex",
                        },
                        { text: "ReadFile", link: "/api/windows/readfile" },
                        {
                          text: "SetFilePointerEx",
                          link: "/api/windows/setfilepointerex",
                        },
                        { text: "WriteFile", link: "/api/windows/writefile" },
                      ],
                    },
                    {
                      text: "Filesystem",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/filesystem" },
                        { text: "CopyFileA", link: "/api/windows/copyfilea" },
                        {
                          text: "CreateDirectoryA",
                          link: "/api/windows/createdirectorya",
                        },
                        {
                          text: "DeleteFileA",
                          link: "/api/windows/deletefilea",
                        },
                        {
                          text: "GetCurrentDirectoryA",
                          link: "/api/windows/getcurrentdirectorya",
                        },
                        {
                          text: "GetFileAttributesA",
                          link: "/api/windows/getfileattributesa",
                        },
                        { text: "MoveFileA", link: "/api/windows/movefilea" },
                        {
                          text: "RemoveDirectoryA",
                          link: "/api/windows/removedirectorya",
                        },
                        {
                          text: "SetCurrentDirectoryA",
                          link: "/api/windows/setcurrentdirectorya",
                        },
                        {
                          text: "SetFileAttributesA",
                          link: "/api/windows/setfileattributesa",
                        },
                      ],
                    },
                    {
                      text: "Handles and Errors",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/handles" },
                        {
                          text: "CloseHandle",
                          link: "/api/windows/closehandle",
                        },
                        {
                          text: "GetLastError",
                          link: "/api/windows/getlasterror",
                        },
                      ],
                    },
                    {
                      text: "Heap",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/heap" },
                        {
                          text: "GetProcessHeap",
                          link: "/api/windows/getprocessheap",
                        },
                        { text: "HeapAlloc", link: "/api/windows/heapalloc" },
                        { text: "HeapFree", link: "/api/windows/heapfree" },
                        {
                          text: "HeapReAlloc",
                          link: "/api/windows/heaprealloc",
                        },
                      ],
                    },
                    {
                      text: "Memory Operations",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/memory" },
                        {
                          text: "RtlCompareMemory",
                          link: "/api/windows/rtlcomparememory",
                        },
                        {
                          text: "RtlCopyMemory",
                          link: "/api/windows/rtlcopymemory",
                        },
                        {
                          text: "RtlFillMemory",
                          link: "/api/windows/rtlfillmemory",
                        },
                        {
                          text: "RtlZeroMemory",
                          link: "/api/windows/rtlzeromemory",
                        },
                      ],
                    },
                    {
                      text: "Process and Thread",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/process" },
                        {
                          text: "ExitProcess",
                          link: "/api/windows/exitprocess",
                        },
                        {
                          text: "GetCurrentProcessId",
                          link: "/api/windows/getcurrentprocessid",
                        },
                        {
                          text: "GetCurrentThreadId",
                          link: "/api/windows/getcurrentthreadid",
                        },
                        { text: "Sleep", link: "/api/windows/sleep" },
                      ],
                    },
                    {
                      text: "Text Conversion",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/conversion" },
                        {
                          text: "MultiByteToWideChar",
                          link: "/api/windows/multibytetowidechar",
                        },
                        {
                          text: "WideCharToMultiByte",
                          link: "/api/windows/widechartomultibyte",
                        },
                      ],
                    },
                    {
                      text: "Time",
                      collapsed: true,
                      items: [
                        { text: "Overview", link: "/api/windows/time" },
                        {
                          text: "GetLocalTime",
                          link: "/api/windows/getlocaltime",
                        },
                        {
                          text: "GetSystemTime",
                          link: "/api/windows/getsystemtime",
                        },
                        {
                          text: "GetTickCount64",
                          link: "/api/windows/gettickcount64",
                        },
                      ],
                    },
                    { text: "Types and Constants", link: "/api/windows/types" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      "/cli/": [
        {
          text: "CLI Reference",
          collapsed: false,
          items: [
            { text: "Overview", link: "/cli/" },
            { text: "Global Options", link: "/cli/global" },
            { text: "rux add", link: "/cli/add" },
            { text: "rux build", link: "/cli/build" },
            { text: "rux clean", link: "/cli/clean" },
            { text: "rux doc", link: "/cli/doc" },
            { text: "rux fmt", link: "/cli/fmt" },
            { text: "rux help", link: "/cli/help" },
            { text: "rux init", link: "/cli/init" },
            { text: "rux install", link: "/cli/install" },
            { text: "rux list", link: "/cli/list" },
            { text: "rux new", link: "/cli/new" },
            { text: "rux remove", link: "/cli/remove" },
            { text: "rux run", link: "/cli/run" },
            { text: "rux test", link: "/cli/test" },
            { text: "rux uninstall", link: "/cli/uninstall" },
            { text: "rux update", link: "/cli/update" },
            { text: "rux version", link: "/cli/version" },
          ],
        },
      ],
      "/blog/": [
        {
          text: "2026",
          collapsed: true,
          items: [
            {
              text: "Rux 0.3.0 — Laying the Cross-Platform Groundwork",
              link: "/blog/release-v0.3.0",
            },
            {
              text: "Programming Language Without LLVM",
              link: "/blog/language-without-llvm",
            },
            {
              text: "Rux 0.2.0 — A Real Language",
              link: "/blog/release-v0.2.0",
            },
            { text: "Rux 0.1.0 — It Compiles!", link: "/blog/release-v0.1.0" },
          ],
        },
        {
          text: "2025",
          collapsed: true,
          items: [{ text: "Getting Started", link: "/blog/getting-started" }],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/rux-lang/Rux",
        ariaLabel: "GitHub",
      },
      // {
      //   icon: {
      //     svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M19.2,1.2c2.65,0,4.8,2.15,4.8,4.8v9.6c0,2.65-2.15,4.8-4.8,4.8h-3.1l-3.25,3.25c-.43.43-1.11.47-1.58.1l-.11-.1-3.25-3.25h-3.1c-2.56,0-4.67-2.01-4.79-4.56v-.24s0-9.6,0-9.6C0,3.35,2.15,1.2,4.8,1.2h14.4ZM14.4,12h-7.2c-.66,0-1.2.54-1.2,1.2s.54,1.2,1.2,1.2h7.2c.66,0,1.2-.54,1.2-1.2s-.54-1.2-1.2-1.2M16.8,7.2H7.2c-.66,0-1.2.54-1.2,1.2s.54,1.2,1.2,1.2h9.6c.66,0,1.2-.54,1.2-1.2s-.54-1.2-1.2-1.2" /></svg>',
      //   },
      //   link: "https://github.com/rux-lang/Rux/discussions",
      //   ariaLabel: "Discussions",
      // },
      {
        icon: "discord",
        link: "https://discord.com/invite/uvSHjtZSVG",
        ariaLabel: "Discord",
      },
      // {
      //   icon: "reddit",
      //   link: "https://www.reddit.com/r/ruxlang",
      //   ariaLabel: "Reddit",
      // },
      {
        icon: "youtube",
        link: "https://www.youtube.com/@ruxlang",
        ariaLabel: "YouTube",
      },
      {
        icon: "x",
        link: "https://x.com/ruxlang",
        ariaLabel: "X",
      },
      // {
      //   icon: "bluesky",
      //   link: "https://bsky.app/profile/rux-lang.dev",
      //   ariaLabel: "Bluesky",
      // },
      // {
      //   icon: "mastodon",
      //   link: "https://mastodon.social/@ruxlang",
      //   ariaLabel: "Mastodon",
      // },
      // {
      //   icon: "telegram",
      //   link: "https://t.me/ruxlang",
      //   ariaLabel: "Telegram",
      // },
    ],

    externalLinkIcon: true,

    editLink: {
      pattern: "https://github.com/rux-lang/Web/edit/dev/src/:path",
      text: "Edit this page on GitHub",
    },

    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "medium",
      },
    },

    footer: {
      message:
        'Released under the <a href="https://github.com/rux-lang/Rux/blob/main/LICENSE">MIT License</a>',
      copyright:
        'Copyright © 2025-2026 <a href="https://github.com/musicvano">Ivan Muzyka</a>',
    },
  },

  markdown: {
    math: true,
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    languages: [ruxGrammar],
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          rux: localIconLoader(import.meta.url, "../src/public/icons/code.svg"),
          // Prevent "Ubuntu" from matching the built-in "bun" runtime icon.
          ubuntu: "",
        },
      }),
    ],
    server: {
      // Proxy registry API calls through the dev server so the browser stays
      // same-origin. This avoids CORS failures: the production API's allowlist
      // doesn't cover localhost dev origins, so the browser can't call it
      // directly. The proxy runs server-side, where CORS doesn't apply.
      proxy: {
        "/api/registry": {
          target: "https://api.rux-lang.dev",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/registry/, ""),
        },
      },
    },
  },
});
