/**
 * The Learn Rux course outline: the 25 parts of github.com/rux-lang/Examples,
 * in course order, with the slug and folder each one gets on this site.
 *
 * The lessons themselves are not listed here — they are discovered from the
 * Examples README by scripts/sync-learn.mjs and live as Markdown files under
 * content/docs/1.learn/<folder>/. This table only says what the README cannot:
 * where a part is filed, what its URL is, which icon heads its sidebar group,
 * the one-line summary the course road map shows, and which Part 25 projects
 * are checkpoints after it. LearnRoadmap.vue reads it too.
 */
export const LEARN_ROOT = "content/docs/1.learn";

export const PARTS = [
  { number: 1, slug: "basics", title: "Basics", icon: "i-lucide-sprout", summary: "Printing, values and their types" },
  {
    number: 2,
    slug: "operators",
    title: "Operators",
    icon: "i-lucide-plus",
    summary: "Combining values into new ones",
  },
  {
    number: 3,
    slug: "control-flow",
    title: "Control flow",
    icon: "i-lucide-git-branch",
    summary: "Choosing and repeating",
    checkpoints: [
      { slug: "thanks", title: "Thanks" },
      { slug: "fizz-buzz", title: "FizzBuzz" },
    ],
  },
  {
    number: 4,
    slug: "functions",
    title: "Functions",
    icon: "i-lucide-square-function",
    summary: "Naming a piece of work and reusing it",
    checkpoints: [{ slug: "temperature", title: "Temperature" }],
  },
  {
    number: 5,
    slug: "sequences",
    title: "Sequences",
    icon: "i-lucide-brackets",
    summary: "Arrays, slices and tuples",
    checkpoints: [{ slug: "prime", title: "Prime" }],
  },
  {
    number: 6,
    slug: "types",
    title: "Types",
    icon: "i-lucide-shapes",
    summary: "Structs, enums and variants of your own",
  },
  {
    number: 7,
    slug: "patterns",
    title: "Patterns",
    icon: "i-lucide-scan-search",
    summary: "Everything a match arm can say",
  },
  {
    number: 8,
    slug: "optionals",
    title: "Optionals",
    icon: "i-lucide-circle-dashed",
    summary: "A value that may be absent: T?",
  },
  {
    number: 9,
    slug: "errors",
    title: "Errors",
    icon: "i-lucide-triangle-alert",
    summary: "Operations that can fail: T ! E",
    checkpoints: [{ slug: "calculator", title: "Calculator" }],
  },
  {
    number: 10,
    slug: "sum-types",
    title: "Sum types",
    icon: "i-lucide-combine",
    summary: "A value that is one of several types: A | B",
  },
  {
    number: 11,
    slug: "ownership",
    title: "Ownership",
    icon: "i-lucide-key-round",
    summary: "Who owns a value, and when it is cleaned up",
  },
  {
    number: 12,
    slug: "interfaces",
    title: "Interfaces",
    icon: "i-lucide-plug",
    summary: "Behaviour that many types share",
  },
  {
    number: 13,
    slug: "generics",
    title: "Generics",
    icon: "i-lucide-boxes",
    summary: "Types and functions that work for many types",
  },
  { number: 14, slug: "text", title: "Text", icon: "i-lucide-type", summary: "Strings, formatting, parsing and input" },
  {
    number: 15,
    slug: "memory",
    title: "Memory",
    icon: "i-lucide-memory-stick",
    summary: "Pointers, raw memory and allocators",
  },
  {
    number: 16,
    slug: "numbers",
    title: "Numbers",
    icon: "i-lucide-binary",
    summary: "Numbers in depth",
    checkpoints: [
      { slug: "circle", title: "Circle" },
      { slug: "quadratic", title: "Quadratic" },
    ],
  },
  {
    number: 17,
    slug: "collections",
    title: "Collections",
    icon: "i-lucide-layers",
    summary: "Vectors, maps, sets and queues",
    checkpoints: [
      { slug: "word-count", title: "Word count" },
      { slug: "inventory", title: "Inventory" },
    ],
  },
  {
    number: 18,
    slug: "algorithms",
    title: "Algorithms",
    icon: "i-lucide-arrow-down-wide-narrow",
    summary: "Sorting, searching and folding slices",
    checkpoints: [{ slug: "statistics", title: "Statistics" }],
  },
  { number: 19, slug: "files", title: "Files", icon: "i-lucide-folder-open", summary: "Paths, files and directories" },
  {
    number: 20,
    slug: "utilities",
    title: "Utilities",
    icon: "i-lucide-wrench",
    summary: "Time, randomness, hashing and UUIDs",
    checkpoints: [
      { slug: "guess", title: "Guess" },
      { slug: "age", title: "Age" },
      { slug: "password", title: "Password" },
      { slug: "launch", title: "Launch" },
    ],
  },
  {
    number: 21,
    slug: "data-formats",
    title: "Data formats",
    icon: "i-lucide-file-json",
    summary: "Reading and writing JSON and TOML",
    checkpoints: [{ slug: "notes", title: "Notes" }],
  },
  {
    number: 22,
    slug: "packages",
    title: "Packages",
    icon: "i-lucide-package",
    summary: "Modules, packages, libraries and tools",
  },
  {
    number: 23,
    slug: "compile-time",
    title: "Compile time",
    icon: "i-lucide-cpu",
    summary: "Code chosen while compiling",
  },
  {
    number: 24,
    slug: "platform",
    title: "Platform",
    icon: "i-lucide-monitor-cog",
    summary: "The operating system and the machine",
    checkpoints: [{ slug: "melody", title: "Melody" }],
  },
  { number: 25, slug: "projects", title: "Projects", icon: "i-lucide-hammer", summary: "Complete small programs" },
].map((part) => ({ ...part, folder: `${String(part.number).padStart(2, "0")}.${part.slug}` }));

/**
 * Sidebar and page titles for lessons whose package name does not read well
 * split into words ("BufferedIo" → "Buffered io"). Everything else is the
 * package name with its words separated: "MutableReference" → "Mutable
 * reference".
 */
export const TITLES = {
  Hello: "Hello, World",
  DoWhile: "Do-while",
  ElseIf: "Else if",
  Is: "The is operator",
  NoCopy: "Non-copyable types",
  MinMax: "Min and max",
  Utf8: "UTF-8",
  BufferedIo: "Buffered I/O",
  DateTime: "Date and time",
  Uuid: "UUID",
  Json: "JSON",
  JsonWrite: "Writing JSON",
  JsonStream: "Streaming JSON",
  Toml: "TOML",
  TomlWrite: "Writing TOML",
  CInterop: "C interop",
  Abi: "ABI",
  Asm: "Assembly",
  AsmArm: "ARM assembly",
  FizzBuzz: "FizzBuzz",
  WordCount: "Word count",
};

export function lessonTitle(name) {
  if (TITLES[name]) return TITLES[name];
  const words = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(" ");
  return [words[0], ...words.slice(1).map((w) => w.toLowerCase())].join(" ");
}
