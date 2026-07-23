<script setup>
import { ref, onMounted } from "vue";
import { ICONS } from "../osProfiles.js";

const RELEASES = "https://github.com/rux-lang/Rux/releases";
// `releases/latest/download/<asset>` always redirects to the newest published
// asset, so these links never go stale as new versions ship.
const LATEST = `${RELEASES}/latest/download`;

// Curated per-OS downloads. Every platform ships prebuilt binaries for both
// x86-64 and AArch64, packaged as .tar.gz on Unix and .zip on Windows; Windows
// additionally offers an .msi installer for x86-64. The asset names mirror the
// release workflow's packaging step, so `latest/download` always resolves them.
const platforms = [
  {
    name: "FreeBSD",
    icon: "freebsd",
    color: "#ab2b28",
    downloads: [
      { arch: "AArch64", files: [{ ext: ".tar.gz", href: `${LATEST}/rux-freebsd-aarch64.tar.gz` }] },
      { arch: "x86-64", files: [{ ext: ".tar.gz", href: `${LATEST}/rux-freebsd-x86_64.tar.gz` }] },
    ],
    guide: "/start/install/bsd",
  },
  {
    name: "Linux",
    icon: "linux",
    color: "#d9a400",
    downloads: [
      { arch: "AArch64", files: [{ ext: ".tar.gz", href: `${LATEST}/rux-linux-aarch64.tar.gz` }] },
      { arch: "x86-64", files: [{ ext: ".tar.gz", href: `${LATEST}/rux-linux-x86_64.tar.gz` }] },
    ],
    guide: "/start/install/linux",
  },
  {
    name: "macOS",
    icon: "macos",
    color: "var(--vp-c-text-1)",
    downloads: [
      { arch: "Apple Silicon", files: [{ ext: ".tar.gz", href: `${LATEST}/rux-macos-aarch64.tar.gz` }] },
      { arch: "Intel", files: [{ ext: ".tar.gz", href: `${LATEST}/rux-macos-x86_64.tar.gz` }] },
    ],
    guide: "/start/install/macos",
  },
  {
    name: "Windows",
    icon: "windows",
    color: "#0078d4",
    downloads: [
      { arch: "AArch64", files: [{ ext: ".zip", href: `${LATEST}/rux-windows-aarch64.zip` }] },
      {
        arch: "x86-64",
        files: [
          { ext: ".msi", href: `${LATEST}/rux-windows-x86_64.msi` },
          { ext: ".zip", href: `${LATEST}/rux-windows-x86_64.zip` },
        ],
      },
    ],
    guide: "/start/install/windows",
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

      <div class="dl-arch-list">
        <div v-for="d in p.downloads" :key="d.arch" class="dl-arch-row">
          <span class="dl-arch-label">{{ d.arch }}</span>
          <div class="dl-files">
            <a
              v-for="f in d.files"
              :key="f.href"
              class="dl-btn"
              :href="f.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg class="dl-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
              </svg>
              <span class="dl-btn-ext">{{ f.ext }}</span>
            </a>
          </div>
        </div>
      </div>

      <a class="dl-guide" :href="p.guide">
        Installation guide
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 24px 0 40px;
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

.dl-arch-list {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}

.dl-arch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  background: var(--vp-c-bg);
}

.dl-arch-row + .dl-arch-row {
  border-top: 1px solid var(--vp-c-divider);
}

.dl-arch-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dl-files {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.dl-files .dl-btn,
.dl-files .dl-btn:hover {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.dl-files .dl-btn:hover {
  transform: translateY(-1px);
  border-color: transparent;
  background: linear-gradient(120deg, #7c3aed 0%, #a855f7 100%);
  color: #fff;
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.35);
}

.dl-btn-icon {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dl-btn-ext {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  opacity: 0.95;
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
