<script setup lang="ts">
import type { TocLink } from "@nuxt/content";

/**
 * The phone-sized replacement for the two asides, ported from nuxt.com's
 * app/pages/docs/[...slug].vue: a bar pinned under the header carrying "Menu"
 * on the left and "On this page" on the right, each opening a drawer.
 *
 * Below `lg` both asides are display:none — UPageAside hides itself, and
 * UContentToc is given `hidden lg:flex` by the page so its own collapsible
 * accordion does not compete with the drawer here. That left the book's page
 * list unreachable on a phone: the header menu only goes as deep as the five
 * books.
 */
defineProps<{ links?: TocLink[] }>();

const route = useRoute();
const { book } = useDocsSection();

// The book title heads the desktop sidebar as a collapsible group. In the
// drawer it is the header instead, so the body renders the pages flat.
const pages = computed(() => book.value?.children ?? []);

const menuOpen = ref(false);
const tocOpen = ref(false);

/**
 * vaul-vue's DrawerContent binds `@openAutoFocus.prevent`, so nothing inside the
 * drawer is focused when it opens and the trigger button keeps the focus it got
 * from the tap. reka-ui then marks the rest of the app `aria-hidden`, and the
 * browser refuses: "Blocked aria-hidden on an element because its descendant
 * retained focus."
 *
 * Focusing the content — reka's focus scope, which carries `tabindex="-1"` — is
 * what a modal dialog should do anyway, and it moves the focused element inside
 * the part of the tree that stays visible to assistive technology.
 */
function focusDrawer(event: Event) {
  (event.currentTarget as HTMLElement | null)?.focus();
}

/**
 * That alone is not enough: reka-ui sets the `aria-hidden` as the content
 * mounts, which is a beat *before* it emits the auto-focus event, so the trigger
 * is still the focused element at the moment the warning is raised. Dropping its
 * focus on the way in closes that window — reka restores focus to the trigger on
 * close from its own reference to the element, not from `document.activeElement`,
 * so nothing is lost by blurring here.
 */
function releaseTrigger(event: MouseEvent) {
  (event.currentTarget as HTMLElement | null)?.blur();
}

// Both drawers navigate from inside themselves and neither unmounts on the way,
// so without this they stay open over the page they just moved to. The TOC
// links push a hash, which `fullPath` catches and `path` would not.
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
    tocOpen.value = false;
  },
);
</script>

<template>
  <!--
    Full-bleed on a phone: the page sits inside UContainer's `px-4 sm:px-6`, and
    the negative margins pull the bar's background and rule back out to the
    viewport edge while its own padding keeps the labels aligned with the prose.

    `order-first` is inherited from UPage's `right` slot classes when this is the
    only child of that slot, but not when UContentToc precedes it — so it is
    written out here rather than relied upon.
  -->
  <div
    class="order-first lg:hidden sticky top-(--ui-header-height) z-10 -mx-4 sm:-mx-6 flex items-center justify-between gap-4 border-b border-dashed border-default bg-default/75 px-4 sm:px-6 py-2.5 backdrop-blur"
  >
    <UDrawer
      v-model:open="menuOpen"
      direction="left"
      :title="book?.title"
      :handle="false"
      inset
      :content="{ onOpenAutoFocus: focusDrawer }"
      :ui="{ content: 'w-full max-w-2/3' }"
    >
      <UButton
        label="Menu"
        icon="i-lucide-text-align-start"
        color="neutral"
        variant="link"
        size="sm"
        aria-label="Open navigation"
        class="-ms-2"
        @click="releaseTrigger"
      />

      <template #body>
        <UContentNavigation
          :navigation="pages"
          default-open
          highlight
          trailing-icon="i-lucide-chevron-right"
          :ui="{ linkTrailingIcon: 'group-data-[state=open]:rotate-90' }"
        />
      </template>
    </UDrawer>

    <UDrawer
      v-if="links?.length"
      v-model:open="tocOpen"
      direction="right"
      title="On this page"
      :handle="false"
      inset
      :content="{ onOpenAutoFocus: focusDrawer }"
      :ui="{ content: 'w-full max-w-2/3' }"
    >
      <UButton
        label="On this page"
        trailing-icon="i-lucide-chevron-right"
        color="neutral"
        variant="link"
        size="sm"
        aria-label="Open on this page"
        class="-me-2"
        @click="releaseTrigger"
      />

      <template #body>
        <!--
          UContentToc renders its own collapsible trigger below `lg`, which would
          repeat the drawer's title. `open` keeps the list expanded with that
          trigger hidden, leaving just the links and the scrollspy highlight.
        -->
        <UContentToc
          :links="links"
          :open="true"
          highlight
          highlight-variant="circuit"
          :ui="{
            root: 'static mx-0 sm:mx-0 px-0 sm:px-0 bg-transparent backdrop-blur-none',
            container: 'p-0 sm:p-0 border-0',
            trigger: 'hidden',
            content: 'flex',
          }"
        />
      </template>
    </UDrawer>
  </div>
</template>
