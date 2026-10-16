/**
 * The API Reference outline: the 39 first-party packages of rux-lang/Rux, in
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
  { slug: "concurrency", title: "Concurrency", icon: "i-lucide-workflow" },
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
      startup: {
        title: "Process start",
        description: "The frame the operating system hands a program when it starts.",
      },
      atomic: {
        title: "Atomic intrinsics",
        description:
          "The atomic loads, stores, exchanges and read-modify-write operations, memory orders and fences that the Atomic package builds on.",
      },
      adaptors: {
        title: "Iterator adaptors",
        description:
          "Lazy adaptors over any iterator — map, filter, skip, take, enumerate, zip and chain — and walking a slice.",
      },
      integers: {
        title: "Integers",
        description:
          "The signed and unsigned integer types from 8 to 512 bits and the pointer-sized `int` and `uint`, with their width and limit constants. The built-in `byte` is `uint8` and shares its constants.",
      },
      "floating-point": {
        title: "Floating-point types",
        description:
          "The floating-point types `float8` to `float512`, with their width, limit and special-value constants. The built-in `float` is `float64` and shares its constants.",
      },
      booleans: {
        title: "Booleans",
        description:
          "The boolean types `bool8` to `bool512`, with their width constants. The built-in `bool` is `bool8` and shares its constants.",
      },
      characters: {
        title: "Characters",
        description:
          "The character types `char8` to `char512`, with their width and limit constants. The built-in `char` is `char32` and shares its constants.",
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
    topics: {
      shared: {
        title: "Shared ownership",
        description: "Reference-counted handles: `Rc` within one thread and `Arc` across threads.",
      },
    },
  },
  {
    name: "Math",
    area: "foundation",
    icon: "i-lucide-sigma",
    description: "Mathematical constants and functions",
    topics: {
      complex: {
        title: "Complex numbers",
        description: "Complex numbers at two precisions: arithmetic, polar form, and the elementary functions.",
      },
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
      scripts: { title: "Scripts", description: "The script each code point belongs to." },
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
      numeric: {
        title: "Numeric sequences",
        description: "Running sums and scans, counting sequences, and an overflow-free midpoint.",
      },
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
      "memory-stream": {
        title: "Memory streams",
        description: "A reader and a writer over bytes in memory, with seeking.",
      },
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
      futex: { title: "Futexes", description: "Waiting on a word and waking its waiters through `futex`." },
      poll: { title: "Polling", description: "Descriptor flags and the epoll calls a poller waits with." },
      resolve: { title: "Name resolution", description: "`getaddrinfo` and the list of addresses it returns." },
      socket: {
        title: "Sockets",
        description: "Address families, socket types and options, and the calls that open, bind and connect sockets.",
      },
      spawn: {
        title: "Starting processes",
        description: "`posix_spawn` and its file actions, and waiting for and signalling a child.",
      },
      thread: {
        title: "Threads",
        description: "POSIX threads: starting, joining and detaching them, their stack size, and the processor count.",
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
      poll: { title: "Polling", description: "Descriptor flags and the kqueue filters a poller waits with." },
      resolve: { title: "Name resolution", description: "`getaddrinfo` and the list of addresses it returns." },
      socket: {
        title: "Sockets",
        description: "Address families, socket types and options, and the calls that open, bind and connect sockets.",
      },
      spawn: {
        title: "Starting processes",
        description: "`posix_spawn` and its file actions, and waiting for and signalling a child.",
      },
      thread: {
        title: "Threads",
        description: "POSIX threads: starting, joining and detaching them, their stack size, and the processor count.",
      },
      umtx: { title: "Address waits", description: "Waiting on a word and waking its waiters through `_umtx_op`." },
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
      poll: { title: "Polling", description: "Descriptor flags and the kqueue filters a poller waits with." },
      socket: {
        title: "Sockets",
        description: "Address families, socket types and options, and the calls that open, bind and connect sockets.",
      },
      resolve: { title: "Name resolution", description: "`getaddrinfo` and the list of addresses it returns." },
      spawn: {
        title: "Starting processes",
        description: "`posix_spawn` and its file actions, and waiting for and signalling a child.",
      },
      thread: {
        title: "Threads",
        description: "POSIX threads: starting, joining and detaching them, their stack size, and the processor count.",
      },
      ulock: {
        title: "Address waits",
        description: "Waiting on a word and waking its waiters through `__ulock_wait` and `__ulock_wake`.",
      },
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
      "process-control": {
        title: "Process control",
        description:
          "Starting processes with `CreateProcessW`, their startup information, inherited handles and waits.",
      },
      synch: { title: "Address waits", description: "`WaitOnAddress` and the calls that wake its waiters." },
      "time-zone": {
        title: "Time zone",
        description: "The system's time zone rules, read through `GetTimeZoneInformation`.",
      },
      winsock: {
        title: "Winsock",
        description: "Starting Winsock, address families, sockets and their options, and name resolution.",
      },
    },
  },
  {
    name: "Regex",
    area: "text",
    icon: "i-lucide-regex",
    description:
      "Regular expressions matched in linear time, with Unicode classes, captures, splitting and replacement",
    topics: {
      regex: {
        title: "Regex",
        description:
          "A compiled regular expression: matching, finding, capturing, splitting and replacing, and escaping text to match it literally.",
      },
      error: { title: "Errors", description: "Why a pattern was refused, and where in it." },
    },
  },
  {
    name: "Process",
    area: "system",
    icon: "i-lucide-square-terminal",
    description: "The running process: its command-line arguments, environment, identifier and exit",
    topics: {
      arguments: { title: "Arguments", description: "The command-line arguments the process was started with." },
      capture: {
        title: "Captured output",
        description: "What a program wrote and how it ended, kept by `Command::Capture`.",
      },
      child: {
        title: "Child processes",
        description: "A started program: waiting for it, killing it, and its standard streams.",
      },
      command: {
        title: "Commands",
        description:
          "Describing a program to start: its arguments, environment, working directory and standard streams.",
      },
      environment: { title: "Environment", description: "Reading, setting and removing environment variables." },
      executable: { title: "Executable", description: "The path of the file the process is running." },
      exit: { title: "Exit", description: "Ending the process, and its identifier." },
    },
  },
  {
    name: "CommandLine",
    area: "system",
    icon: "i-lucide-square-chevron-right",
    description: "Declarative command-line parsing: options, positional arguments, subcommands and generated help",
    topics: {
      spec: {
        title: "Specification",
        description: "Declaring a command: its flags, valued options, positional arguments, subcommands and version.",
      },
      help: { title: "Help", description: "Writing the help, usage and version text generated from a specification." },
    },
  },
  {
    name: "Log",
    area: "system",
    icon: "i-lucide-scroll-text",
    description:
      "Structured logging: levels, typed fields, text and JSON-lines records, a process-wide log for every thread, and log files that rotate by size",
    topics: {
      record: { title: "Records", description: "The formats a log record is written in: text or JSON lines." },
      logger: { title: "Logger", description: "A logger over any writer: levels, context fields and timestamps." },
      level: { title: "Levels", description: "The severity levels, their names, and the level compiled into a build." },
      global: { title: "Process-wide log", description: "The log every thread shares, written to standard error." },
      field: { title: "Fields", description: "Typed key-value fields that a record carries." },
    },
  },
  {
    name: "TimeZone",
    area: "system",
    icon: "i-lucide-globe",
    description: "Time zones: the tz database, POSIX rules, the local zone, and local times that happen twice or never",
    topics: {
      error: { title: "Errors", description: "Why a time zone could not be loaded." },
      zone: {
        title: "Time zones",
        description: "A place's rules: loading them, and converting between UTC and local time.",
      },
    },
  },
  {
    name: "Net",
    area: "system",
    icon: "i-lucide-network",
    description: "Networking: IP and socket addresses, TCP listeners and streams, UDP sockets, and name resolution",
    topics: {
      address: {
        title: "Addresses",
        description: "IPv4, IPv6 and socket addresses: reading them, writing them and classifying them.",
      },
      resolve: { title: "Name resolution", description: "The addresses a host name resolves to." },
      tcp: { title: "TCP", description: "Listeners that accept connections, and the streams they produce." },
      udp: { title: "UDP", description: "Datagram sockets and the datagrams they receive." },
    },
  },
  {
    name: "Test",
    area: "system",
    icon: "i-lucide-flask-conical",
    description: "Unit tests: checks with readable failures, and the runner that #Test() functions are gathered into",
    topics: {
      runner: {
        title: "Runner",
        description: "Running a table of tests with filters, as the generated test runner does.",
      },
      failure: { title: "Failures", description: "The failure a test returns, and skipping a test." },
      expect: {
        title: "Checks",
        description: "Checks that return a readable failure: equality, nearness, text, optionals and outcomes.",
      },
      benchmark: {
        title: "Benchmarks",
        description: "Measuring how long code takes per iteration, and keeping its results alive.",
      },
    },
  },
  {
    name: "Thread",
    area: "concurrency",
    icon: "i-lucide-git-fork",
    description: "Threads of execution: starting, joining and detaching them, and asking about the current one",
    topics: {
      current: {
        title: "The current thread",
        description: "Its identifier, giving way to other threads, and how many can run at once.",
      },
      error: { title: "Errors", description: "Why a thread could not be started." },
      spawn: {
        title: "Starting threads",
        description: "Starting a thread on a context, its options, and joining it for its result.",
      },
    },
  },
  {
    name: "Atomic",
    area: "concurrency",
    icon: "i-lucide-zap",
    description: "Values that threads share without a lock: atomic integers, flags and pointers",
  },
  {
    name: "Sync",
    area: "concurrency",
    icon: "i-lucide-lock-keyhole",
    description:
      "Locks, conditions, once-only initialization, semaphores, barriers, wait groups and channels for threads",
    topics: {
      channel: { title: "Channels", description: "Bounded queues that carry values from thread to thread." },
      counters: { title: "Counters", description: "Semaphores, barriers and wait groups." },
      lock: { title: "Locks", description: "A plain lock, and running an initialization exactly once." },
      mutex: {
        title: "Mutexes",
        description: "A value one thread at a time may reach, and the conditions threads wait on while holding it.",
      },
      "rw-lock": {
        title: "Reader-writer locks",
        description: "A value many threads may read at once, or one may write.",
      },
    },
  },
  {
    name: "Encoding",
    area: "data",
    icon: "i-lucide-binary",
    description: "Hexadecimal, Base64, Base32, Base58 and percent-encoding of byte sequences",
    topics: {
      stream: {
        title: "Streams",
        description: "Encoding and decoding through a writer or a reader, a block at a time.",
      },
      percent: {
        title: "Percent-encoding",
        description: "Percent-encoding bytes for URLs, with the set of characters left as they are.",
      },
      hex: {
        title: "Hexadecimal",
        description: "Bytes as hexadecimal digits in either case, and a view that prints them.",
      },
      base64: {
        title: "Base64",
        description:
          "Base64 in its standard and URL-safe alphabets, with or without padding, and a view that prints it.",
      },
      base58: {
        title: "Base58",
        description: "Base58 in the Bitcoin alphabet, which leaves out look-alike characters.",
      },
      base32: { title: "Base32", description: "Base32 in the RFC 4648 and Crockford alphabets." },
    },
  },
  {
    name: "Url",
    area: "data",
    icon: "i-lucide-link",
    description: "URLs: parsing, normalizing and resolving them, and reading and building their queries",
    topics: {
      error: { title: "Errors", description: "Why a URL could not be parsed." },
      query: { title: "Query strings", description: "Reading and building the name-value pairs of a query." },
      url: { title: "URLs", description: "Parsing a URL into its parts and reading them back." },
    },
  },
  {
    name: "Compress",
    area: "data",
    icon: "i-lucide-file-archive",
    description: "Deflate compression in the raw, zlib and gzip formats, as streams and for whole buffers",
    topics: {
      inflate: { title: "Decompressing", description: "A reader that decompresses a stream as it is read." },
      format: {
        title: "Formats and levels",
        description: "The raw, zlib and gzip formats, and the compression levels.",
      },
      deflate: { title: "Compressing", description: "A writer that compresses what is written through it." },
      buffers: { title: "Whole buffers", description: "Compressing and decompressing a whole buffer in one call." },
    },
  },
  {
    name: "NanoId",
    area: "data",
    icon: "i-lucide-hash",
    description: "Short, URL-safe, unpredictable identifiers in the Nano ID format",
    topics: {
      generate: {
        title: "Generating",
        description: "Generating an identifier into a buffer of your own, from any alphabet and entropy source.",
      },
      alphabet: { title: "Alphabets", description: "The default alphabet and length, and checking a custom alphabet." },
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
  { folder: "2.types", title: "Types", kinds: ["struct", "enum", "variant", "union", "type", "primitive"] },
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
