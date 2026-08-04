<script setup lang="ts">
import type { ContextMenuItem } from "@nuxt/ui";

const route = useRoute();
const { headerLinks } = useHeaderLinks();
const toast = useToast();

const { ruxVersion, githubStars } = useRuntimeConfig().public;

/**
 * Right-clicking the logo offers the SVG and the design kit, as on nuxt.com.
 *
 * The copy goes straight to the async Clipboard API rather than VueUse's
 * useClipboard — this site has no @vueuse/core dependency, and the same
 * trade-off is already made in DesignKitColorCard.vue. That API is undefined
 * outside a secure context, so the failure branch is a real toast rather than a
 * silently dead menu item.
 */
const logo = useTemplateRef("logo");

async function copyLogoSvg() {
  const svg = logo.value?.$el as SVGElement | undefined;
  if (!svg) return;

  try {
    await navigator.clipboard.writeText(svg.outerHTML);
    toast.add({
      title: "Rux logo copied as SVG",
      description: "You can now paste it into your project.",
      icon: "i-lucide-copy-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "Could not copy",
      description: "Download the logo from the design kit instead.",
      icon: "i-lucide-copy-x",
      color: "error",
    });
  }
}

const logoContextMenuItems: ContextMenuItem[][] = [
  [{ label: "Copy logo as SVG", icon: "i-lucide-copy", onSelect: copyLogoSvg }],
  [{ label: "Browse design kit", icon: "i-lucide-shapes", to: "/design-kit" }],
];

// The four docs sections get their own row under the bar (nuxt.com's
// HeaderBottom), so while it is showing the top-level "Docs" dropdown is
// flattened to a plain link — otherwise the same four links appear twice.
const inDocs = computed(() => /^\/(start|docs|cli|api)(\/|$)/.test(route.path));

const items = computed(() =>
  headerLinks.value.map((link) => (inDocs.value && link.label === "Docs" ? { ...link, children: [] } : link)),
);

// That second row makes the header taller, and the docs layout's sticky aside
// and TOC both offset themselves by --ui-header-height. Growing the variable
// (see main.css) keeps them aligned instead of tucked under the sub-nav.
useHead(() => ({
  bodyAttrs: { class: inDocs.value ? "has-docs-subnav" : "" },
}));
</script>

<template>
  <!--
    `items-end` bottom-aligns the version badge with the baseline of the
    wordmark instead of centring it against the logo's full height — the same
    trick nuxt.com uses to make the badge read as a superscript on the logo.
  -->
  <UHeader :ui="{ left: 'min-w-0 items-end', container: 'h-16' }" class="flex flex-col">
    <template #left>
      <NuxtLink to="/" aria-label="Rux home">
        <UContextMenu :items="logoContextMenuItems" size="xs">
          <RuxLogo ref="logo" class="block h-6 w-auto" />
        </UContextMenu>
      </NuxtLink>

      <UBadge
        :label="`v${ruxVersion}`"
        color="primary"
        variant="subtle"
        size="sm"
        class="-mb-px rounded-sm px-1.5 text-[12px]/3 font-semibold"
      />
    </template>

    <UNavigationMenu :items="items" variant="link" content-orientation="vertical" :ui="{ linkLeadingIcon: 'hidden' }" />

    <template #right>
      <AppAskRuxy />

      <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Toggle theme" :kbds="['d']">
        <UColorModeButton />
      </UTooltip>

      <!--
        The count is hidden below `sm` (as on nuxt.com) — on a phone the header
        needs that width for the menu toggle. It is decorative there, so the
        accessible name carries it instead of the visible label.
      -->
      <UTooltip text="GitHub Stars">
        <UButton
          icon="i-simple-icons-github"
          to="https://github.com/rux-lang/Rux"
          target="_blank"
          variant="ghost"
          color="neutral"
          :label="githubStars"
          :aria-label="`Rux on GitHub, ${githubStars} stars`"
          :ui="{ label: 'hidden sm:inline-flex' }"
        />
      </UTooltip>
    </template>

    <!-- Mobile menu. Without this slot there is no navigation on small screens. -->
    <template #body>
      <AppHeaderBody />
    </template>

    <template v-if="inDocs" #bottom>
      <AppHeaderBottom />
    </template>
  </UHeader>
</template>
