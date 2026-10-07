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
  { name: "Core", area: "foundation", icon: "i-lucide-atom", description: "Core language intrinsics" },
  { name: "Memory", area: "foundation", icon: "i-lucide-memory-stick", description: "Memory management functions" },
  {
    name: "Allocator",
    area: "foundation",
    icon: "i-lucide-boxes",
    description: "Allocation contracts and the allocators that meet them",
  },
  { name: "Math", area: "foundation", icon: "i-lucide-sigma", description: "Mathematical constants and functions" },
  { name: "Text", area: "text", icon: "i-lucide-type", description: "Strings and fundamental text manipulation" },
  { name: "Format", area: "text", icon: "i-lucide-whole-word", description: "String conversion and formatting" },
  {
    name: "Unicode",
    area: "text",
    icon: "i-lucide-languages",
    description: "Unicode character properties, case, normalization and segmentation",
  },
  { name: "Collections", area: "collections", icon: "i-lucide-layers", description: "Generic data structures" },
  {
    name: "Algorithms",
    area: "collections",
    icon: "i-lucide-arrow-down-wide-narrow",
    description: "Generic algorithms over slices and mutable slices",
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
  },
  { name: "Io", area: "system", icon: "i-lucide-terminal", description: "Streams, console I/O, readers and writers" },
  {
    name: "FileSystem",
    area: "system",
    icon: "i-lucide-folder-tree",
    description: "Files, directories and filesystem operations",
  },
  {
    name: "Path",
    area: "system",
    icon: "i-lucide-route",
    description: "Native operating-system strings and filesystem paths",
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
  },
  {
    name: "Crypto",
    area: "security",
    icon: "i-lucide-lock",
    description: "Cryptographic hashes, message authentication codes and key derivation",
  },
  { name: "C", area: "platform", icon: "i-simple-icons-c", description: "C standard library bindings" },
  {
    name: "Linux",
    area: "platform",
    icon: "i-simple-icons-linux",
    description: "Linux platform bindings",
    platform: "Linux",
  },
  {
    name: "FreeBSD",
    area: "platform",
    icon: "i-simple-icons-freebsd",
    description: "FreeBSD platform bindings",
    platform: "FreeBSD",
  },
  {
    name: "macOS",
    area: "platform",
    icon: "i-simple-icons-apple",
    description: "macOS platform bindings",
    platform: "macOS",
  },
  {
    name: "Windows",
    area: "platform",
    icon: "i-simple-icons-windows",
    description: "Windows platform bindings",
    platform: "Windows",
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
