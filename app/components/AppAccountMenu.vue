<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { safeAvatarUrl, userInitials } from "~/utils/auth";

const _props = withDefaults(
  defineProps<{
    mobile?: boolean;
  }>(),
  {
    mobile: false,
  },
);

const route = useRoute();
const auth = useCurrentUser();

const returnTo = computed(() => (route.path.startsWith("/packages/-/auth/") ? "/packages" : route.fullPath));
const signInTarget = computed(() => ({
  path: "/packages/-/auth/sign-in",
  query: returnTo.value === "/packages" ? undefined : { return_to: returnTo.value },
}));
const displayName = computed(() => auth.user.value?.display_name?.trim() || auth.user.value?.github_login || "");
const avatar = computed(() => {
  const user = auth.user.value;
  if (!user) return undefined;
  return {
    src: safeAvatarUrl(user.avatar_url),
    alt: `${displayName.value} avatar`,
    text: userInitials(user.display_name, user.github_login),
  };
});
const accountLabel = computed(() => {
  const initials = avatar.value?.text;
  return `${initials ? `${initials} ` : ""}${displayName.value} account menu`;
});
const menuItems = computed<DropdownMenuItem[][]>(() => {
  const user = auth.user.value;
  if (!user) return [];
  return [
    [
      {
        type: "label",
        label: displayName.value,
        description: `@${user.github_login}`,
        avatar: avatar.value,
      },
    ],
    [
      {
        label: "Dashboard",
        icon: "i-lucide-layout-dashboard",
        to: "/packages/-/dashboard",
      },
      {
        label: "API tokens",
        icon: "i-lucide-key-round",
        to: "/packages/-/dashboard/tokens",
      },
      {
        label: "Settings",
        icon: "i-lucide-settings",
        to: "/packages/-/dashboard/settings",
      },
      {
        label: "Sign out",
        icon: "i-lucide-log-out",
        loading: auth.signingOut.value,
        disabled: auth.signingOut.value,
        onSelect: () => void auth.signOut(),
      },
    ],
  ];
});
</script>

<template>
  <div :class="_props.mobile ? 'w-full' : ''">
    <div
      v-if="auth.status.value === 'loading'"
      role="status"
      aria-live="polite"
      class="flex items-center gap-2"
      :class="_props.mobile ? 'w-full' : ''"
    >
      <span class="sr-only">Loading account status</span>
      <USkeleton class="h-8" :class="_props.mobile ? 'w-full' : 'w-24'" aria-hidden="true" />
    </div>

    <UButton
      v-else-if="auth.status.value === 'anonymous'"
      :block="_props.mobile"
      label="Sign in"
      icon="i-lucide-lock"
      color="neutral"
      :variant="_props.mobile ? 'outline' : 'ghost'"
      :to="signInTarget"
    />

    <UButton
      v-else-if="auth.status.value === 'expired'"
      :block="_props.mobile"
      label="Sign in again"
      icon="i-lucide-clock-alert"
      color="warning"
      :variant="_props.mobile ? 'outline' : 'ghost'"
      :to="signInTarget"
    />

    <UButton
      v-else-if="auth.status.value === 'unavailable'"
      :block="_props.mobile"
      label="Retry account status"
      icon="i-lucide-refresh-cw"
      color="neutral"
      :variant="_props.mobile ? 'outline' : 'ghost'"
      @click="auth.refresh"
    />

    <UDropdownMenu v-else-if="auth.user.value" :items="menuItems" :content="{ align: 'end' }">
      <UButton
        :block="_props.mobile"
        color="neutral"
        variant="ghost"
        :aria-label="accountLabel"
        :class="_props.mobile ? 'justify-between' : ''"
      >
        <span class="flex min-w-0 items-center gap-2">
          <UAvatar v-bind="avatar" size="xs" :ui="{ fallback: 'text-default' }" />
          <span :class="_props.mobile ? 'truncate' : 'hidden max-w-32 truncate lg:inline'">
            {{ displayName }}
          </span>
        </span>
        <UIcon name="i-lucide-chevron-down" class="size-4 text-muted" aria-hidden="true" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>
