<script setup>
import { ref, onMounted } from "vue";
import { ICONS } from "../osProfiles.js";

const RELEASES = "https://github.com/rux-lang/Rux/releases";
// `releases/latest/download/<asset>` always redirects to the newest published
// asset, so these links never go stale as new versions ship.
const LATEST = `${RELEASES}/latest/download`;

// Curated per-OS install methods. Unlike the live status matrix (which is fully
// API-driven), downloads reflect what actually ships for each platform today:
// direct binaries where they exist, package managers otherwise, source as the
// universal fallback.
const platforms = [
  {
    name: "Windows",
    icon: "windows",
    color: "#0078d4",
    note: "Windows 10 or later, 64-bit.",
    files: [
      { label: "Installer", ext: ".msi", href: `${LATEST}/rux-windows.msi` },
      { label: "Zip", ext: ".zip", href: `${LATEST}/rux-windows.zip` },
    ],
    command: "scoop bucket add rux-lang https://github.com/rux-lang/Scoop\nscoop install rux",
    commandLabel: "Or install with Scoop",
    guide: "/start/install/windows",
  },
  {
    name: "macOS",
    icon: "macos",
    color: "var(--vp-c-text-1)",
    note: "Apple Silicon and Intel. No native package yet — build from source.",
    guide: "/start/build",
    guideLabel: "Build from source",
  },
  {
    name: "Arch Linux",
    icon: "linux",
    color: "#d9a400",
    note: "All Arch-based distributions, via the AUR.",
    command: "yay -S rux-git",
    commandLabel: "Install from the AUR",
    guide: "/start/install/arch",
  },
  {
    name: "Fedora",
    icon: "linux",
    color: "#d9a400",
    note: "Fedora, Alma Linux, and CentOS, via Copr.",
    command: "sudo dnf copr enable zapaxe/Rux-Lang\nsudo dnf install rux",
    commandLabel: "Install with dnf",
    guide: "/start/install/fedora",
  },
  {
    name: "openSUSE",
    icon: "linux",
    color: "#d9a400",
    note: "openSUSE Tumbleweed, via Copr.",
    command:
      "sudo zypper addrepo https://copr.fedorainfracloud.org/coprs/zapaxe/Rux-Lang/repo/opensuse-tumbleweed/zapaxe-Rux-Lang-opensuse-tumbleweed.repo\nsudo zypper install rux",
    commandLabel: "Install with zypper",
    guide: "/start/install/opensuse",
  },
];

// Best-effort live version badge. api.github.com is CORS-enabled and public, so
// the browser can read the latest release tag directly; if the request fails
// (offline, rate-limited) we simply hide the badge rather than block the page.
const version = ref(null);
onMounted(async () => {
  try {
    const r = await fetch(`https://api.github.com/repos/rux-lang/Rux/releases/latest`);
    if (r.ok) {
      const data = await r.json();
      version.value = data.tag_name;
    }
  } catch {
    /* ignore — badge stays hidden */
  }
});

const copied = ref(null);
async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = key;
    setTimeout(() => {
      if (copied.value === key) copied.value = null;
    }, 1600);
  } catch {
    /* clipboard unavailable — no-op */
  }
}
</script>

<template>
  <div class="dl-meta">
    <a class="dl-version" :href="RELEASES" target="_blank" rel="noopener noreferrer">
      <span class="dl-version-dot"></span>
      <span v-if="version">Latest release {{ version }}</span>
      <span v-else>Latest release</span>
    </a>
    <a
      class="dl-changelog"
      href="https://github.com/rux-lang/Rux/blob/main/CHANGELOG.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      Changelog
    </a>
  </div>

  <div class="dl-grid">
    <div v-for="p in platforms" :key="p.name" class="dl-card">
      <div class="dl-card-head">
        <span class="dl-os-mark" :style="{ color: p.color }" aria-hidden="true" v-html="ICONS[p.icon]"></span>
        <h3>{{ p.name }}</h3>
      </div>

      <p class="dl-note">{{ p.note }}</p>

      <div v-if="p.files" class="dl-files">
        <a
          v-for="f in p.files"
          :key="f.href"
          class="dl-btn"
          :href="f.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="dl-btn-label">{{ f.label }}</span>
          <span class="dl-btn-ext">{{ f.ext }}</span>
        </a>
      </div>

      <div v-if="p.command" class="dl-cmd-block">
        <span class="dl-cmd-label">{{ p.commandLabel }}</span>
        <div class="dl-cmd">
          <pre><code>{{ p.command }}</code></pre>
          <button
            class="dl-copy"
            type="button"
            :aria-label="`Copy ${p.name} install command`"
            @click="copy(p.command, p.name)"
          >
            {{ copied === p.name ? "Copied" : "Copy" }}
          </button>
        </div>
      </div>

      <a class="dl-guide" :href="p.guide">
        {{ p.guideLabel || "Installation guide" }}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.dl-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 0 28px;
}

.dl-version {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.25s ease;
}

.dl-version:hover {
  border-color: var(--vp-c-brand-1);
}

.dl-version-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #28c840;
  box-shadow: 0 0 0 5px rgba(40, 200, 64, 0.12);
}

.dl-changelog {
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.dl-changelog:hover {
  color: var(--vp-c-brand-1);
}

.dl-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  margin: 24px 0 48px;
}

.dl-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  animation: rux-fade-up 0.5s ease both;
  transition:
    translate 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.dl-card:hover {
  translate: 0 -5px;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 32px rgba(142, 92, 217, 0.2);
}

.dl-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dl-card-head h3 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 18px;
}

.dl-os-mark {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
  background-color: color-mix(in srgb, currentColor 10%, transparent);
}

.dl-os-mark :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.dl-note {
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.dl-files {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.dl-files .dl-btn,
.dl-files .dl-btn:hover {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 8px;
  background: linear-gradient(120deg, #7c3aed 0%, #a855f7 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.dl-files .dl-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.35);
}

.dl-btn-ext {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  opacity: 0.9;
}

.dl-cmd-block {
  margin-top: 16px;
}

.dl-cmd-label {
  display: block;
  margin-bottom: 6px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.dl-cmd {
  position: relative;
  min-width: 0;
}

.dl-cmd pre {
  margin: 0;
  padding: 12px 56px 12px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.dl-cmd code {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.6;
  white-space: pre;
  color: var(--vp-c-text-1);
}

.dl-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.dl-copy:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.dl-guide {
  margin-top: auto;
  padding-top: 18px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.dl-guide span {
  display: inline-block;
  transition: transform 0.2s ease;
}

.dl-guide:hover span {
  transform: translateX(3px);
}

@media (max-width: 760px) {
  .dl-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dl-card {
    animation: none !important;
    transition: none !important;
  }
}
</style>
