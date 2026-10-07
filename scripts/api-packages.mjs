/**
 * The API Reference outline: the 25 first-party packages of rux-lang/Rux, in
 * hub order, grouped by area.
 *
 * Everything else about a package — its version, dependencies and public
 * items — comes from the `rux doc --format json` snapshot in data/api/, which
 * scripts/sync-api-reference.mjs writes. This table only says what the
 * snapshot cannot: which area of the /docs/api hub a package sits in, the
 * folder its pages are filed under, the icon that heads its card and sidebar,
 * and the topic pages whose title no declaration supplies.
 *
 * `description` repeats the manifest's, so the hub can show a card for a
 * package whose reference has not been generated yet. `platform` marks the
 * bindings that exist for one operating system only.
 *
 * Icons named here only appear in a `.mjs` file, which the icon scanner never
 * reads, so each one is also listed in `icon.clientBundle.icons` in
 * nuxt.config.ts.
 */
export const API_ROOT = "content/docs/5.api";

export const AREAS = [
  { slug: "foundation", title: "Foundation", icon: "i-lucide-blocks" },
  { slug: "text", title: "Text", icon: "i-lucide-type" },
  { slug: "collections", title: "Collections and algorithms", icon: "i-lucide-layers" },
  { slug: "system", title: "System and I/O", icon: "i-lucide-terminal" },
  { slug: "data", title: "Data formats", icon: "i-lucide-braces" },
  { slug: "security", title: "Security", icon: "i-lucide-lock" },
  { slug: "platform", title: "Platform bindings", icon: "i-lucide-cpu" },
];

export const PACKAGES = [
  {
    name: "Core",
    area: "foundation",
    icon: "i-lucide-atom",
    description: "Core language intrinsics",
    topics: {
      integers: {
        title: "Integers",
        description:
          "The signed and unsigned integer types from 8 to 512 bits, the pointer-sized `int` and `uint`, and the `byte` alias, with their width and limit constants.",
      },
      "floating-point": {
        title: "Floating-point types",
        description:
          "The IEEE 754 types `float32` and `float64` and the `float` alias, with their width, limit and special-value constants. The widths `float8`, `float16`, `float80`, `float128`, `float256` and `float512` are reserved and not implemented yet.",
      },
      booleans: {
        title: "Booleans",
        description:
          "The boolean types `bool8` to `bool64` and the `bool` alias, with their width constants. The widths `bool128`, `bool256` and `bool512` are reserved and not implemented yet.",
      },
      characters: {
        title: "Characters",
        description:
          "The character types `char8` to `char64` and the `char` alias, with their width and limit constants. The widths `char128`, `char256` and `char512` are reserved and not implemented yet.",
      },
      arithmetic: {
        title: "Integer arithmetic",
        description:
          "Checked, wrapping and saturating arithmetic at every integer width, the limits of an integer type, and the `uint64` intrinsics allocation sizes are computed with.",
      },
      bits: {
        title: "Bit operations",
        description:
          "Counting, rotating, reversing and testing the bits of an integer of any width, and a right shift that brings in zeros whatever the sign.",
      },
      "byte-order": {
        title: "Byte order",
        description:
          "Converting integers between the target's byte order and little- or big-endian, in a register or through raw bytes at any alignment.",
      },
      conversion: {
        title: "Checked conversion",
        description:
          "Converting between primitive types with a report of whether the value survived, with wrapping on purpose, or clamped to the destination's range.",
      },
      "float-classification": {
        title: "Float classification",
        description:
          "Asking whether a floating-point value is NaN, infinite, finite or zero, and reading its sign, at every float width.",
      },
      diagnostics: {
        title: "Diagnostics",
        description:
          "Run-time assertions and panics that report and terminate, and the compile-time `#Error` and `#Warn` that reject or flag a configuration.",
      },
      outcomes: {
        title: "Outcomes",
        description: "Asking which channel a native fallible `T ! E` holds without unwrapping it.",
      },
    },
  },
  {
    name: "Memory",
    area: "foundation",
    icon: "i-lucide-memory-stick",
    description: "Memory management functions",
    topics: {
      allocation: {
        title: "Heap allocation",
        description: "Allocating, resizing and releasing blocks on the system heap.",
      },
      blocks: {
        title: "Block operations",
        description: "Copying, filling, clearing, comparing and searching blocks of bytes.",
      },
      alignment: {
        title: "Alignment",
        description: "Testing addresses for alignment and rounding them to a boundary.",
      },
      "unaligned-access": {
        title: "Unaligned and byte-order access",
        description: "Reading and writing values at any alignment and in either byte order.",
      },
      pages: {
        title: "Pages",
        description: "Address space in whole pages from the operating system, with a protection.",
      },
    },
  },
  {
    name: "Allocator",
    area: "foundation",
    icon: "i-lucide-boxes",
    description: "Allocation contracts and the allocators that meet them",
  },
  {
    name: "Math",
    area: "foundation",
    icon: "i-lucide-sigma",
    description: "Mathematical constants and functions",
    topics: {
      constants: { title: "Constants", description: "Mathematical constants, rounded to the nearest float64." },
      trigonometry: {
        title: "Trigonometry",
        description: "Sine, cosine, tangent, their inverses, and conversion between degrees and radians.",
      },
      hyperbolic: {
        title: "Hyperbolic functions",
        description: "Hyperbolic sine, cosine, tangent and their inverses.",
      },
      exponential: {
        title: "Exponentials and logarithms",
        description: "Powers of e and two, and logarithms in base e, two and ten.",
      },
      powers: {
        title: "Powers and roots",
        description: "Raising to a power, square and cube roots, and the hypotenuse.",
      },
      rounding: {
        title: "Rounding and remainders",
        description: "Rounding to an integral value in a chosen direction, and the floating-point remainder.",
      },
      "abs-min-max": {
        title: "Absolute value, minimum and maximum",
        description: "The magnitude of a floating-point value and the smaller or larger of two.",
      },
      integer: {
        title: "Integer arithmetic",
        description: "Checked and wrapping integer operations: magnitude, extrema, clamping, GCD, LCM and powers.",
      },
      classification: {
        title: "Classification and special values",
        description:
          "Telling NaNs, infinities, zeros, subnormals and normal values apart, and making the special ones.",
      },
      "float-representation": {
        title: "Floating-point representation",
        description: "Signs, exponents, neighbouring values and ulp distances of floating-point values.",
      },
    },
  },
  {
    name: "Text",
    area: "text",
    icon: "i-lucide-type",
    description: "Strings and fundamental text manipulation",
    topics: {
      utf8: {
        title: "UTF-8",
        description: "Encoding, decoding and validating UTF-8, and the limits of a Unicode scalar value.",
      },
      transform: {
        title: "Transforming text",
        description: "New strings made from old: concatenation, repetition, replacement and ASCII case.",
      },
    },
  },
  {
    name: "Format",
    area: "text",
    icon: "i-lucide-whole-word",
    description: "String conversion and formatting",
    topics: {
      parse: {
        title: "Parsing integers, booleans and characters",
        description: "Reading an integer of any width and base, a boolean or one character from text.",
      },
      "parse-float": {
        title: "Parsing floats",
        description: "Reading decimal text into the nearest float32, float64 or wide float, exactly.",
      },
      "integer-text": {
        title: "Writing integers",
        description: "Spelling an integer as text: sign, base prefix, zero padding and digits.",
      },
      "float-text": {
        title: "Writing floats",
        description: "The shortest, fixed-precision and scientific renderings of a float32 or float64.",
      },
      "character-text": {
        title: "Writing characters and booleans",
        description:
          "How characters, character slices and booleans render, and how a value that is no character is escaped.",
      },
      "float-bits": {
        title: "Float classification and bits",
        description: "Whether a float is NaN, infinite or finite, and the bits it is stored as.",
      },
    },
  },
  {
    name: "Unicode",
    area: "text",
    icon: "i-lucide-languages",
    description: "Unicode character properties, case, normalization and segmentation",
    topics: {
      properties: {
        title: "Character properties",
        description:
          "The canonical combining class and the White_Space, Alphabetic and Numeric properties of a scalar value.",
      },
      case: {
        title: "Case mapping",
        description: "Simple and full upper, lower and title case mappings, and case folding.",
      },
      normalization: {
        title: "Normalization",
        description: "Canonical and compatibility decomposition, and the NFD, NFC, NFKD and NFKC normal forms.",
      },
      graphemes: {
        title: "Grapheme clusters",
        description: "Extended grapheme cluster boundaries, and how many user-perceived characters a text holds.",
      },
      tables: {
        title: "Generated tables",
        description: "The Unicode 17.0.0 Character Database tables the lookups search.",
      },
    },
  },
  {
    name: "Collections",
    area: "collections",
    icon: "i-lucide-layers",
    description: "Generic data structures",
    topics: {
      iterators: {
        title: "Slice iterators",
        description: "The iterators an array, vector or deque hands out to walk its elements by copy or by pointer.",
      },
      hashing: {
        title: "Hashing",
        description: "Ready-made seeded hash and equality callbacks for the key types a hash map or set is keyed on.",
      },
      comparing: {
        title: "Comparing",
        description: "Ready-made ordering callbacks for the key types a tree map or set is keyed on.",
      },
    },
  },
  {
    name: "Algorithms",
    area: "collections",
    icon: "i-lucide-arrow-down-wide-narrow",
    description: "Generic algorithms over slices and mutable slices",
    topics: {
      searching: {
        title: "Searching",
        description:
          "Linear queries over a slice in no particular order: whether it holds a value, where, and how many.",
      },
      comparing: {
        title: "Comparing slices",
        description: "Element-by-element equality, the first difference and lexicographic order between two slices.",
      },
      "sorted-slices": {
        title: "Sorted slices",
        description: "Binary search and bounds over a slice that is already in order, and checking that it is.",
      },
      sorting: {
        title: "Sorting",
        description: "Putting a slice in order in place, unstably with no storage or stably with caller scratch.",
      },
      heaps: {
        title: "Heaps",
        description: "A binary max-heap laid out in the slice itself, the building block of a priority queue.",
      },
      "min-max": {
        title: "Minimum and maximum",
        description: "The smallest and largest elements of a slice, and clamping a value into a range.",
      },
      folding: {
        title: "Folding",
        description: "Reducing a slice to one value, and mapping one slice onto another.",
      },
      modifying: {
        title: "Modifying",
        description: "Rearranging a slice in place, removing elements, and moving elements between slices.",
      },
    },
  },
  {
    name: "Hash",
    area: "collections",
    icon: "i-lucide-hash",
    description: "Named non-cryptographic hashes and checksums",
  },
  {
    name: "Random",
    area: "collections",
    icon: "i-lucide-dices",
    description: "Pseudorandom number generators and distributions",
    topics: {
      uniform: { title: "Uniform ranges", description: "Uniform integers and floats in a bounded range." },
      distributions: {
        title: "Distributions",
        description: "Values from the Bernoulli, exponential, normal, binomial, Poisson, gamma and beta distributions.",
      },
      sampling: {
        title: "Sampling and shuffling",
        description: "Shuffling a slice and choosing indices, uniformly or by weight.",
      },
    },
  },
  {
    name: "Io",
    area: "system",
    icon: "i-lucide-terminal",
    description: "Streams, console I/O, readers and writers",
    topics: {
      binary: {
        title: "Binary encoding",
        description:
          "Fixed-width integers and floats read from a reader and written to a writer in a chosen byte order.",
      },
    },
  },
  {
    name: "FileSystem",
    area: "system",
    icon: "i-lucide-folder-tree",
    description: "Files, directories and filesystem operations",
    topics: {
      directories: { title: "Directories", description: "Creating, deleting and listing directories." },
      "file-operations": {
        title: "File operations",
        description: "Deleting, renaming, copying and linking files by name.",
      },
      location: {
        title: "Working directory",
        description: "The process's current directory, and a path made absolute or canonical against it.",
      },
      "native-errors": {
        title: "Native error codes",
        description: "A platform's own error code, read as the IoError every operation here reports.",
      },
    },
  },
  {
    name: "Path",
    area: "system",
    icon: "i-lucide-route",
    description: "Native operating-system strings and filesystem paths",
    topics: {
      syntax: {
        title: "Path syntax",
        description: "Which units separate segments on this system, and the prefix and root a path opens with.",
      },
    },
  },
  { name: "Time", area: "system", icon: "i-lucide-clock", description: "Durations, monotonic clocks and wall clocks" },
  {
    name: "Entropy",
    area: "system",
    icon: "i-lucide-sparkles",
    description: "Unpredictable bytes from the operating system",
  },
  { name: "Json", area: "data", icon: "i-lucide-braces", description: "JSON parsing and serialization" },
  {
    name: "Toml",
    area: "data",
    icon: "i-lucide-file-cog",
    description: "TOML parsing, serialization and streaming",
    topics: {
      scalars: {
        title: "Scalars",
        description: "Reading TOML integers, floats and date-times from their source text.",
      },
    },
  },
  {
    name: "Uuid",
    area: "data",
    icon: "i-lucide-fingerprint-pattern",
    description: "UUID representation, parsing, formatting and generation",
    topics: {
      text: { title: "Text form", description: "Reading and writing a UUID in its canonical and URN text forms." },
    },
  },
  {
    name: "Crypto",
    area: "security",
    icon: "i-lucide-lock",
    description: "Cryptographic hashes, message authentication codes and key derivation",
    topics: {
      secrets: {
        title: "Secrets",
        description: "Comparing secrets in constant time and wiping them so the compiler cannot skip it.",
      },
    },
  },
  {
    name: "C",
    area: "platform",
    icon: "i-simple-icons-c",
    description: "C standard library bindings",
    topics: {
      stdio: {
        title: "Standard I/O",
        description: "C's `<stdio.h>`: streams, formatted conversion and the constants that size them.",
      },
      stdlib: {
        title: "General utilities",
        description: "C's `<stdlib.h>`: allocation, number parsing, sorting, pseudo-random numbers and exit codes.",
      },
      string: { title: "Strings and memory", description: "C's `<string.h>`: byte-string and raw memory operations." },
      math: {
        title: "Mathematics",
        description: "C's `<math.h>`: the elementary functions and the special floating-point values.",
      },
      time: {
        title: "Time",
        description: "C's `<time.h>`: calendar time, processor time and the conversions between them.",
      },
      types: { title: "Types", description: "C's scalar types under their C names, sized for the current target." },
      errno: { title: "errno", description: "Reading C's thread-local `errno`, and which C runtime it lives in." },
    },
  },
  {
    name: "Linux",
    area: "platform",
    icon: "i-simple-icons-linux",
    description: "Linux platform bindings",
    platform: "Linux",
    topics: {
      types: { title: "Types", description: "Linux's scalar types for process, file and user identifiers." },
      clock: { title: "Clocks", description: "Reading clocks and sleeping." },
      dynamic: { title: "Dynamic loading", description: "The mode flags `dlopen` takes." },
      errors: { title: "Errors", description: "The error numbers, and telling a raw result from an error." },
      files: { title: "Files", description: "Opening, reading, writing and inspecting files through descriptors." },
      directories: {
        title: "Directories and links",
        description: "The working directory, directory entries, removal, renaming and links.",
      },
      memory: { title: "Memory", description: "Mapping, protecting and advising on pages of memory." },
      process: { title: "Process", description: "Ending the process and asking its identifier." },
      syscalls: {
        title: "System calls",
        description: "The raw system-call entry points and the call numbers they take.",
      },
    },
  },
  {
    name: "FreeBSD",
    area: "platform",
    icon: "i-simple-icons-freebsd",
    description: "FreeBSD platform bindings",
    platform: "FreeBSD",
    topics: {
      types: { title: "Types", description: "FreeBSD's scalar types for process, file and user identifiers." },
      clock: { title: "Clocks", description: "Reading clocks and sleeping." },
      dynamic: { title: "Dynamic loading", description: "The mode flags `dlopen` takes." },
      errors: { title: "Errors", description: "The error numbers, and telling a raw result from an error." },
      files: { title: "Files", description: "Opening, reading, writing and inspecting files through descriptors." },
      directories: {
        title: "Directories and links",
        description: "The working directory, directory entries, removal, renaming and links.",
      },
      memory: { title: "Memory", description: "Mapping, protecting and advising on pages of memory." },
      process: { title: "Process", description: "Ending the process and asking its identifier." },
      syscalls: {
        title: "System calls",
        description: "The raw system-call entry points and the call numbers they take.",
      },
    },
  },
  {
    name: "macOS",
    area: "platform",
    icon: "i-simple-icons-apple",
    description: "macOS platform bindings",
    platform: "macOS",
    topics: {
      types: { title: "Types", description: "macOS's scalar types for process, file and user identifiers." },
      clock: { title: "Clocks", description: "Reading clocks and sleeping." },
      dynamic: { title: "Dynamic loading", description: "libSystem, and the mode flags `dlopen` takes." },
      errors: { title: "Errors", description: "The error numbers, and telling a raw result from an error." },
      files: { title: "Files", description: "Opening, reading, writing and inspecting files through descriptors." },
      directories: {
        title: "Directories and links",
        description: "The working directory, directory entries, removal, renaming and links.",
      },
      memory: { title: "Memory", description: "Mapping, protecting and advising on pages of memory." },
      process: { title: "Process", description: "Ending the process and asking its identifier." },
    },
  },
  {
    name: "Windows",
    area: "platform",
    icon: "i-simple-icons-windows",
    description: "Windows platform bindings",
    platform: "Windows",
    topics: {
      types: { title: "Types", description: "The Win32 scalar and handle types." },
      console: { title: "Console", description: "Allocating, reading and writing the console." },
      files: { title: "Files", description: "Opening, reading, writing and flushing files through handles." },
      "file-system": {
        title: "File system",
        description: "Deleting, copying and moving files, directories, attributes, search and links.",
      },
      memory: { title: "Memory", description: "Heap allocation, virtual memory and raw memory operations." },
      process: { title: "Processes and threads", description: "Exiting, threads, waiting and loading libraries." },
      clock: { title: "Clocks", description: "Performance counters, system time and tick counts." },
      text: { title: "Text conversion", description: "Converting between code pages and UTF-16." },
      errors: { title: "Errors", description: "The last Win32 error and the codes it reports." },
    },
  },
].map((entry, index) => {
  const slug = entry.name.toLowerCase();
  return { ...entry, slug, folder: `${String(index + 1).padStart(2, "0")}.${slug}`, path: `/docs/api/${slug}` };
});

/**
 * Sidebar groups inside one package, in order. Each is a sub-folder of the
 * package folder with its own .navigation.yml; a group with no pages is not
 * written at all. Pages keep flat URLs (/docs/api/allocator/arena) through
 * frontmatter `path:`, exactly as the course's lessons do. A topic page is
 * filed under the group of the declarations it holds (scripts/api-docs.mjs,
 * topicGroup).
 */
export const KIND_GROUPS = [
  { folder: "1.interfaces", title: "Interfaces", kinds: ["interface"] },
  { folder: "2.types", title: "Types", kinds: ["struct", "enum", "variant", "union", "type", "intrinsic-type"] },
  { folder: "3.functions", title: "Functions", kinds: ["function", "extern"] },
  { folder: "4.constants", title: "Constants", kinds: ["constant"] },
];

/*
 * Which packages are generated is not written down here: a package is
 * generated exactly when data/api/<slug>.json exists. Scripts read that from
 * scripts/api-generated.mjs, the app from an import.meta.glob in
 * app/utils/api-catalog.ts, so parallel syncs never edit one shared line.
 */

export const packageBySlug = (slug) => PACKAGES.find((entry) => entry.slug === slug);
