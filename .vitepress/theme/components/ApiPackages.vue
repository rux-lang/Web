<script setup>
// Packages shown on the API reference landing page. Styles mirror the support
// page channel cards (CommunityChannels.vue) so the hover animation matches.
// `primary` renders the wide Standard Library card; otherwise the OS grid.
defineProps({
  primary: { type: Boolean, default: false },
});

const arrow =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"/></svg>';

// Package/box glyph (Feather "package") — the same icon used in the package
// registry, shown in the brand color for every binding package.
const packageIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';

const featured = {
  name: "Std",
  badge: "Cross-platform",
  href: "/api/std/",
  description:
    "Core strings, collections, I/O, memory, math, time, random values, encoding, hashing, UUIDs, and sorting.",
  topics: ["Std", "Std::Io", "Std::Memory", "Std::Time", "Std::Math"],
};

const packages = [
  {
    name: "BSD",
    handle: "FreeBSD · OpenBSD · NetBSD · DragonFly",
    href: "/api/bsd/",
    description:
      "Direct syscall bindings shared across FreeBSD, OpenBSD, NetBSD, and DragonFly BSD.",
    modules: ["I/O", "Memory", "Process", "Time", "Syscalls"],
  },
  {
    name: "Illumos",
    handle: "OmniOS · OpenIndiana · SmartOS",
    href: "/api/illumos/",
    description:
      "Raw syscalls and typed wrappers for I/O, memory, processes, and time.",
    modules: ["I/O", "Memory", "Process", "Time", "Syscalls"],
  },
  {
    name: "Linux",
    handle: "Arch Linux · Debian · Ubuntu · Fedora",
    href: "/api/linux/",
    description:
      "Direct Linux syscalls, constants, memory mappings, file-descriptor I/O, and clocks.",
    modules: ["I/O", "Memory", "Process", "Time", "Syscalls"],
  },
  {
    name: "MacOS",
    handle: "macOS · Compiler-provided thunks",
    href: "/api/macos/",
    description:
      "Mach-O linker compatibility bindings for standard I/O, virtual memory, and process control.",
    modules: ["I/O", "Memory", "Process", "Console"],
  },
  {
    name: "Windows",
    handle: "Windows · Windows Server",
    href: "/api/windows/",
    description:
      "Win32 bindings for files, consoles, heaps, processes, time, text conversion, and DLLs.",
    modules: ["Console", "Heap", "Memory", "Filesystem", "Process"],
  },
];
</script>

<template>
  <a v-if="primary" class="channel-card featured-card" :href="featured.href">
    <span class="channel-arrow" v-html="arrow"></span>
    <span class="channel-icon featured-icon" v-html="packageIcon"></span>
    <div class="featured-body">
      <div class="featured-heading">
        <strong>{{ featured.name }}</strong>
        <span class="featured-badge">{{ featured.badge }}</span>
      </div>
      <p class="channel-description featured-desc">{{ featured.description }}</p>
      <div class="featured-topics">
        <code v-for="topic in featured.topics" :key="topic">{{ topic }}</code>
      </div>
    </div>
  </a>

  <div v-else class="channel-grid">
    <a
      v-for="pkg in packages"
      :key="pkg.name"
      class="channel-card"
      :href="pkg.href"
    >
      <span class="channel-arrow" v-html="arrow"></span>
      <div class="channel-header">
        <span class="channel-icon" v-html="packageIcon"></span>
        <div class="channel-title">
          <span class="channel-name">{{ pkg.name }}</span>
          <span class="channel-handle">{{ pkg.handle }}</span>
        </div>
      </div>
      <p class="channel-description">{{ pkg.description }}</p>
      <div class="channel-topics">
        <code v-for="module in pkg.modules" :key="module">{{ module }}</code>
      </div>
    </a>
  </div>
</template>

<style scoped>
.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.channel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.125rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: inherit;
  transition:
    border-color 0.25s,
    transform 0.25s,
    box-shadow 0.25s;
}

.channel-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

.channel-arrow {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: opacity 0.25s;
}

.channel-card:hover .channel-arrow {
  opacity: 1;
}

.channel-arrow :deep(svg) {
  width: 0.875rem;
  height: 0.875rem;
}

.channel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.channel-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
  background-color: color-mix(in srgb, currentColor 10%, transparent);
}

.channel-icon :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}

.channel-title {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.channel-name {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.channel-handle {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-description {
  flex: 1;
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.channel-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.channel-topics code {
  padding: 0.125rem 0.4375rem;
  color: var(--vp-c-text-2);
  font-size: 0.6875rem;
}

/* Wide Standard Library card — reuses the channel-card border, transition,
   and hover, with a hero layout. */
.featured-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: center;
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
}

.featured-icon {
  width: 3.625rem;
  height: 3.625rem;
  border-radius: 14px;
}

.featured-icon :deep(svg) {
  width: 1.875rem;
  height: 1.875rem;
}

.featured-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.featured-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.featured-heading strong {
  color: var(--vp-c-text-1);
  font-size: 1.0625rem;
  line-height: 1.35;
}

.featured-badge {
  flex-shrink: 0;
  padding: 0.1875rem 0.5625rem;
  border: 1px solid var(--vp-c-brand-2);
  border-radius: 0.25rem;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.featured-desc {
  flex: none;
  margin-top: 0.4375rem;
  font-size: 0.875rem;
  line-height: 1.65;
}

.featured-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.75rem;
}

.featured-topics code {
  padding: 0.125rem 0.4375rem;
  color: var(--vp-c-text-2);
  font-size: 0.6875rem;
}

@media (max-width: 700px) {
  .featured-topics {
    display: none;
  }
}
</style>
