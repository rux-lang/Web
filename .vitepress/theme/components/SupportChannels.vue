<script setup>
import { computed } from "vue";

const props = defineProps({
  section: { type: String, required: true },
});

// Brand icons from Simple Icons (https://simpleicons.org/), CC0 license.
const icons = {
  opencollective:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.54 0 4.894-.79 6.834-2.135l-3.107-3.109a7.715 7.715 0 1 1 0-13.512l3.107-3.109A11.94 11.94 0 0 0 12 0m9.865 5.166l-3.109 3.107A7.7 7.7 0 0 1 19.715 12a7.7 7.7 0 0 1-.959 3.727l3.109 3.107A11.94 11.94 0 0 0 24 12c0-2.54-.79-4.894-2.135-6.834"/></svg>',
  patreon:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482c-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46c3.765.047 4.326-4.804 6.068-7.141c1.24-1.662 2.836-2.132 4.801-2.618c3.376-.836 5.678-3.501 5.673-7.031"/></svg>',
  paypal:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513c-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541c-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"/></svg>',
};

const sections = {
  donate: [
    {
      id: "opencollective",
      name: "Open Collective",
      handle: "opencollective.com/ruxlang",
      href: "https://opencollective.com/ruxlang",
      color: "#3385ff",
      description:
        "One-time or recurring donations with a fully transparent public budget.",
      tag: "One-time & recurring",
    },
    {
      id: "patreon",
      name: "Patreon",
      handle: "patreon.com/ruxlang",
      href: "https://www.patreon.com/ruxlang",
      color: "#ff424d",
      description:
        "Become a patron and follow development updates from the inside.",
      tag: "Monthly membership",
    },
    {
      id: "paypal",
      name: "PayPal",
      handle: "paypal.com/donate",
      href: "https://www.paypal.com/donate/?hosted_button_id=83MF2W5BVC5UN",
      color: "#0070ba",
      description:
        "Quick one-time donation with your PayPal account or card — no sign-up required.",
      tag: "One-time donation",
    },
  ],
};

const channels = computed(() => sections[props.section] ?? []);
</script>

<template>
  <div class="channel-grid">
    <a
      v-for="channel in channels"
      :key="channel.id"
      class="channel-card"
      :href="channel.href"
      target="_blank"
      rel="noopener"
    >
      <span class="channel-arrow" v-html="icons.arrow"></span>
      <div class="channel-header">
        <span
          class="channel-icon"
          :style="{ color: channel.color }"
          v-html="icons[channel.id]"
        ></span>
        <div class="channel-title">
          <span class="channel-name">{{ channel.name }}</span>
          <span class="channel-handle">{{ channel.handle }}</span>
        </div>
      </div>
      <p class="channel-description">{{ channel.description }}</p>
      <div v-if="channel.tag" class="channel-footer">
        <span class="channel-stat">{{ channel.tag }}</span>
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

.channel-footer {
  display: flex;
}

.channel-stat {
  padding: 0.125rem 0.625rem;
  border-radius: 0.5rem;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
